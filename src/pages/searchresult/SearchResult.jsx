import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../../components/spinner/Spinner";
import "./style.scss";

import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import noResults from "../../assets/no-results.png";
import MovieCard from "../../components/movieCard/MovieCard";

const SearchResult = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();

  useEffect(() => {
    fetchInitialData();
  }, [query]);
  // Initial Search
  const fetchInitialData = async () => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`)
      .then((res) => {
        setData(res);
        setPageNum((prev) => prev + 1);
        setLoading(false);
      })
      .catch((err) => {
        throw err;
      });
  };

  // Search on Scroll
  const fetchNextPageData = async () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        if (data?.results) {
          setData({
            ...data,
            results: [...data.results, ...res.results],
          });
        } else {
          setData(res);
        }
        setPageNum((prev) => prev + 1);
      }
    );
  };
  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Serch ${
                  data.total_results > 1 ? "results" : "result"
                } of "${query}"`}
              </div>
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data?.results.map((item, i) => {
                  if (item.media_type === "person") return;
                  return (
                    <MovieCard
                      key={i}
                      data={item}
                      fromSearch={true}
                      mediaType={item.media_type}
                    />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <>
              <img src={noResults} />
              <span className="resultNotFound">Sorry, Result Not Found.</span>
            </>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default SearchResult;
