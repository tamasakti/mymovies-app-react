import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { LoadingAnimation } from "components/Loading";
import Layout from "components/Layout";
import Card from "components/Card";
import { MovieType } from "Utils/movie";
import Footer from "components/Footer";
import { useTitle } from "Utils/Hooks/useTitle";
import { setFavorites } from "Utils/Redux/reducer/reducer";

const Index = () => {
  const dispatch = useDispatch();
  useTitle("Filmku - Now Playing Movie");
  // state sifatnya asynchronous, jadi tidak bisa langsung digunakan
  const [datas, setDatas] = useState<MovieType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  // this.state = {
  //   datas: [],
  //   loading: true,
  //   page: 1,
  //   totalPage: 1,
  // };

  // side effect
  // Jika dilakukan perubahan nilai dari sebuah state didalam side effect, maka akan dilakukan rerender
  useEffect(() => {
    fetchData(1);
  }, []);
  // componentDidMount() {
  //   this.fetchData(1);
  // }

  function fetchData(page: number) {
    axios
      .get(
        `now_playing?api_key=${
          import.meta.env.VITE_API_KEY
        }&language=en-US&page=${page}`
      )
      .then((data) => {
        // apapun outputnya entah dia berhasil atau gagal, dimana terlihat ada jawaban dari backend, akan masuk ke then
        const { results, total_pages } = data.data; // destructuring
        setDatas(results);
        setTotalPage(total_pages);
        // this.setState({ datas: results, totalPage: total_pages });
      })
      .catch((error) => {
        // akan masuk ke catch jikalau sama sekali tidak menerima jawaban dari backend, tidak di response dari backend, biasanya server down
        alert(error.toString());
      })
      .finally(() => setLoading(false));
  }

  function nextPage() {
    const newPage = page + 1;
    setPage(newPage);
    fetchData(newPage);
  }

  function prevPage() {
    const newPage = page - 1;
    setPage(newPage);
    fetchData(newPage);
  }

  function handleFavorite(data: MovieType) {
    const checkExist = localStorage.getItem("FavMovie");
    if (checkExist) {
      /*
      TODO: Sebelum ditambahkan ke list favorit, silahkan buat pengkondisian/cek terlebih dahulu apakah film yang dipilih sudah ditambahkan atau belum, kasih alert jika ada, jika tidak silahkan push datanya ke localstorage
      */
      let parseFav: MovieType[] = JSON.parse(checkExist);
      parseFav.push(data);
      localStorage.setItem("FavMovie", JSON.stringify(parseFav));
      dispatch(setFavorites(parseFav));
    } else {
      localStorage.setItem("FavMovie", JSON.stringify([data]));
      alert("Movie added to favorite");
    }
  }

  return (
    <Layout>
      {/* {!loading && (
        <Carousel
          datas={datas.slice(0, 5)}
          content={(data) => (
            <div
              className="w-full h-full flex justify-center items-center bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(
                    rgba(0, 0, 0, 0.5),
                    rgba(0, 0, 0, 0.5)
                  ), url(https://image.tmdb.org/t/p/original${data.poster_path})`,
              }}
            >
              <p className="text-white tracking-widest font-bold break-words text-2xl">
                {data.title}
              </p>
            </div>
          )}
        />
      )} */}
      <div className="grid dark:bg-gray-600 grid-cols-4 gap-3 p-3">
        {loading
          ? [...Array(20).keys()].map((data) => <LoadingAnimation key={data} />)
          : datas.map((data) => (
              <Card
                key={data.id}
                title={data.title}
                image={data.poster_path}
                id={data.id}
                labelButton="ADD TO FAVORITE"
                onClickFav={() => handleFavorite(data)}
              />
            ))}
      </div>
      <div
        className="btn-group dark:bg-gray-600 w-full justify-center"
        style={{ paddingTop: "2rem" }}
      >
        <button
          className="btn "
          onClick={() => prevPage()}
          disabled={page === 1}
        >
          «
        </button>
        <button className="btn">{page}</button>
        <button
          className="btn"
          onClick={() => nextPage()}
          disabled={page === totalPage}
        >
          »
        </button>
      </div>
      <Footer />
    </Layout>
  );
};

export default Index;
