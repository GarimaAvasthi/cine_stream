import { motion } from "framer-motion";
import { useFavorites } from "../context/useFavorites";
import { handlePosterError, resolvePosterUrl } from "../utils/poster";

const MovieCard = ({ movie, onClick }) => {
  const { toggleFavorite, isFavorite, favoritesLimit } = useFavorites();
  const favorite = isFavorite(movie.imdbID);
  const MotionCard = motion.div;

  const handleFavoriteClick = () => {
    const result = toggleFavorite(movie);
    if (result?.ok === false && result.reason === "limit_reached") {
      alert(`You can add up to ${favoritesLimit} movies to favorites.`);
    }
  };

  return (
    <MotionCard
      className="movie-card"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.25 }}
    >
      <button
        className="poster-btn"
        type="button"
        onClick={() => onClick?.(movie.imdbID)}
        aria-label={`Open details for ${movie.Title}`}
      >
        <img
          className="movie-poster"
          src={resolvePosterUrl(movie.Poster, movie.Title, 300, 450)}
          alt={movie.Title}
          loading="lazy"
          onError={(event) =>
            handlePosterError(event, movie.Title, 300, 450)
          }
        />
      </button>

      <div className="card-overlay">
        <div className="movie-copy">
          <h3>{movie.Title}</h3>
          <p>{movie.Year}</p>
        </div>
        <button
          className={`heart ${favorite ? "active" : ""}`}
          type="button"
          onClick={handleFavoriteClick}
          aria-label={
            favorite
              ? `Remove ${movie.Title} from favorites`
              : `Add ${movie.Title} to favorites`
          }
        >
          {"\u2665"}
        </button>
      </div>
    </MotionCard>
  );
};

export default MovieCard;
