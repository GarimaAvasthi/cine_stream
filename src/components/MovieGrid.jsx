import MovieCard from "./MovieCard";
import emptyCinemaIllustration from "../assets/empty-cinema.svg";
import { sortMissingPostersLast } from "../utils/poster";

const MovieGrid = ({ movies, onMovieClick }) => {
  const orderedMovies = sortMissingPostersLast(movies);

  if (!orderedMovies.length) {
    return (
      <div className="empty-state">
        <img
          className="empty-state-image"
          src={emptyCinemaIllustration}
          alt="Animated empty cinema screen"
        />
        <h3>No movies found</h3>
        <p>
           Try a different title, genre, or
          keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {orderedMovies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onClick={onMovieClick}
        />
      ))}
    </div>
  );
};

export default MovieGrid;
