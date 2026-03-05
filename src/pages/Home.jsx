import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { useMovies } from "../hooks/useMovies";
import { usePopularPicks } from "../hooks/usePopularPicks";
import { useFavorites } from "../context/useFavorites";
import MovieGrid from "../components/MovieGrid";
import SearchBar from "../components/SearchBar";
import MovieDetailsModal from "../components/MovieDetailsModal";
import MoodMatcher from "../components/MoodMatcher";
import {
  handlePosterError,
  resolvePosterUrl,
  sortMissingPostersLast,
} from "../utils/poster";

const Home = () => {
  const [query, setQuery] = useState("");
  const [moodQuery, setMoodQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const { favorites } = useFavorites();
  const debouncedQuery = useDebounce(query, 500);
  const effectiveQuery = moodQuery || debouncedQuery;

  const { movies, loading, error, hasMore } = useMovies(
    effectiveQuery,
    page
  );
  const { movies: popularMovies, loading: loadingPopularPicks } =
    usePopularPicks(5);

  const handleQueryChange = (value) => {
    setQuery(value);
    setMoodQuery("");
    setPage(1);
  };

  const handleMoodMovieFound = (title) => {
    setMoodQuery(title.trim());
    setPage(1);
  };

  useInfiniteScroll(() => {
    if (!hasMore) return;
    setPage((prev) => prev + 1);
  }, loading);

  const hasQuery = Boolean(effectiveQuery.trim());
  const topFiveMovies = sortMissingPostersLast(popularMovies).slice(0, 5);

  return (
    <section className="page home-page">
      <section className="home-controls">
        <article className="panel-card search-panel">
          <div className="panel-head">
            <h3>Search Movies</h3>
            <span>{favorites.length} favorites</span>
          </div>
          <SearchBar query={query} onQueryChange={handleQueryChange} />
        </article>

        <article className="panel-card top-panel">
          <div className="panel-head">
            <h3>Popular Picks</h3>
          </div>
          <div className="top-list">
            {topFiveMovies.length ? (
              topFiveMovies.map((movie, index) => (
                <button
                  key={movie.imdbID}
                  type="button"
                  className="top-item"
                  onClick={() => setSelectedMovieId(movie.imdbID)}
                >
                  <span>{index + 1}</span>
                  <img
                    src={resolvePosterUrl(movie.Poster, movie.Title, 80, 110)}
                    alt={movie.Title}
                    loading="eager"
                    onError={(event) =>
                      handlePosterError(event, movie.Title, 80, 110)
                    }
                  />
                  <p>{movie.Title}</p>
                </button>
              ))
            ) : (
              <p className="status-text">
                {loadingPopularPicks
                  ? "Loading top movies..."
                  : "No popular picks available right now."}
              </p>
            )}
          </div>
        </article>

        <article className="panel-card mood-panel">
          <div className="panel-head">
            <h3>Match My Mood</h3>
          </div>
          <MoodMatcher onMovieFound={handleMoodMovieFound} />
        </article>
      </section>

      <div className="results-head">
        <h3>
          {moodQuery
            ? "Mood-based recommendations"
            : hasQuery
            ? `Results for "${effectiveQuery}"`
            : "Popular picks"}
        </h3>
      </div>
      {error && <p className="status-text error-text">{error}</p>}
      <MovieGrid
        movies={movies}
        onMovieClick={(movieId) => setSelectedMovieId(movieId)}
      />
      {loading && <p className="status-text">Loading more titles...</p>}
      {selectedMovieId && (
        <MovieDetailsModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </section>
  );
};

export default Home;
