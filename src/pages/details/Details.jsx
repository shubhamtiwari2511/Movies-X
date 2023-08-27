import "./style.scss";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import DetailBanner from "../../components/detailBanner/DetailBanner";

import Cast from "../../components/cast/Cast";
import VideosSection from "../../components/videosSection/VideosSection";
import Similar from "./carousel/Similar";
import Recommendation from "./carousel/Recommendation";

const Details = () => {
  const { mediaType, id } = useParams();

  // Api Call to fetch video data
  const { data, loading } = useFetch(`/${mediaType}/${id}/videos`);

  // Ap Call to fetch cast data
  const { data: credits, loading: creditsLoading } = useFetch(
    `/${mediaType}/${id}/credits`
  );

  console.log(data);
  console.log(credits);
  return (
    <div className="details">
      <DetailBanner video={data?.results?.[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={creditsLoading} />
      {data?.results?.length > 0 && (
        <VideosSection data={data} loading={loading} />
      )}
      <Similar mediaType={mediaType} id={id} />
      <Recommendation mediaType={mediaType} id={id} />
    </div>
  );
};

export default Details;
