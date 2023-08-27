import { useRef } from "react";
import "./style.scss";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import CircleRating from "../circleRating/CircleRating";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import Img from "../lazyLoadImage/Img";
import PosterFallback from "../../assets/no-poster.png";
import Genres from "../genres/Genres";

const Carousel = ({ title, data, loading, endpoint }) => {
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);
  const carouselContainer = useRef();

  // Handling left & right arrow navigation
  const navigation = (dir) => {
    const container = carouselContainer.current;

    // currently container.scrollLeft is 0
    // container.offsetWidth shows the width of the selected element
    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - container.offsetWidth + 20
        : container.scrollLeft + container.offsetWidth + 20;

    // console.log(scrollAmount);

    container.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // creating skeleton
  const skItem = () => {
    return (
      <div className="skeletonItem">
        <div className="posterBlock skeleton"></div>
        <div className="textBlock">
          <div className="title skeleton"></div>
          <div className="date skeleton"></div>
        </div>
      </div>
    );
  };
  return (
    <div className="carousel">
      <ContentWrapper>
        {title && <div className="carouselTitle">{title}</div>}
        <BsFillArrowLeftCircleFill
          className="carouselLeftNav arrow"
          onClick={() => {
            navigation("left");
          }}
        />
        <BsFillArrowRightCircleFill
          className="carouselRightNav arrow"
          onClick={() => {
            navigation("right");
          }}
        />
        {!loading ? (
          <div className="carouselItems" ref={carouselContainer}>
            {data?.map((item) => {
              const posterUrl = item.poster_path
                ? url.poster + item.poster_path
                : PosterFallback;

              return (
                <div
                  className="carouselItem"
                  onClick={() => {
                    navigate(`/${item.media_type || endpoint}/${item.id}`);
                  }}
                  key={item.id}
                >
                  <div className="posterBlock">
                    <Img src={posterUrl} />
                    <CircleRating rating={item.vote_average.toFixed(1)} />
                    <Genres data={item.genre_ids.slice(0, 2)} />
                  </div>
                  <div className="textBlock">
                    <span className="title">
                      {item.name || item.title || title}
                    </span>
                    <span className="date">
                      {dayjs(item.release_date).format("MMM D,YYYY")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="loadingSkeleton">
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

export default Carousel;
