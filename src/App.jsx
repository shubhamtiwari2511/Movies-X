import "./App.css";
import { useEffect } from "react";
import { fetchDataFromApi } from "./utils/api";
import { getApiConfiguration, getGenres } from "./store/homeSlice";
import { useDispatch } from "react-redux";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";

import { Routes, Route } from "react-router-dom";

function App() {
  const dispatch = useDispatch();

  // Getting all the configurations required for images
  useEffect(() => {
    fetchApiConfig();
    fetchGenres();
  }, []);
  // Fethcing image url using API
  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "w1280",
        profile: res.images.secure_base_url + "w1280",
      };
      dispatch(getApiConfiguration(url));
    });
  };
  // fetching Genres of movie and series using API
  const fetchGenres = async () => {
    const promises = [];
    const endpoints = ["tv", "movie"];
    const allGenres = {};

    endpoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    try {
      const data = await Promise.all(promises);
      if (!data) {
        throw "Not able to Fetch lists ";
      }
      data.map(({ genres }) => {
        return genres.map((item) => (allGenres[item.id] = item));
      });
    } catch (error) {
      console.log(error);
    }
    dispatch(getGenres(allGenres));
  };
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
