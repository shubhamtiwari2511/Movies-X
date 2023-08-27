import "./style.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

const HeroBanner = () => {
  // Navigate Instance
  const navigate = useNavigate();

  //   UseSelctor Instance
  let { url } = useSelector((state) => state.home);

  //   Required Hooks
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");

  //   Making Api call
  const { data, loading } = useFetch("/movie/upcoming");

  // setting Background Image
  useEffect(() => {
    const bg =
      url.backdrop +
      data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
    setBackground(String(bg));
  }, [data]);

  //   On Submit
  const serachQueryHandler = (e) => {
    e.preventDefault();
    if (query) {
      navigate(`/search/${query}`);
    }
    setQuery("");
  };
  return (
    <div className="heroBanner">
      {!loading && (
        <div className="backdrop-img">
          <Img src={background} />
        </div>
      )}

      <div className="opacity-layer"></div>
      <ContentWrapper>
        <div className="heroBannerContent">
          <span className="title">Welcome</span>
          <span className="subTitle">
            Millions of movies, TV shows and people to discover. Explore now.
          </span>
          <div className="searchInput">
            <form onSubmit={serachQueryHandler}>
              <input
                type="text"
                placeholder="Search for Movie or TV Show"
                name="query"
                required
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit">Serach</button>
            </form>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
