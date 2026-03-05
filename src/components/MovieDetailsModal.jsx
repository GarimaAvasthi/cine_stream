import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import YouTube from "react-youtube";
import { fetchMovieDetails } from "../services/tmdb";
import { fetchTrailer } from "../services/youtube";
import { handlePosterError, resolvePosterUrl } from "../utils/poster";

const summaryVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.12,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

const youtubeOptions = {
  width: "100%",
  playerVars: {
    autoplay: 0,
    rel: 0,
  },
};

const MovieDetailsModal = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const MotionOverlay = motion.div;
  const MotionBox = motion.div;
  const MotionSummary = motion.p;
  const MotionWord = motion.span;
  const animatedWords = useMemo(
    () => movie?.Plot?.split(" ").filter(Boolean) ?? [],
    [movie]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchMovieDetails(movieId);
        if (cancelled) return;

        if (!data || data.Response === "False") {
          setError(data?.Error || "Movie details could not be loaded.");
          setMovie(null);
          setVideoId(null);
          setLoading(false);
          return;
        }

        setMovie(data);
        const trailer = await fetchTrailer(data.Title);
        if (!cancelled) setVideoId(trailer);
      } catch {
        if (!cancelled) setError("Movie details could not be loaded.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [movieId]);

  return (
    <MotionOverlay
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <MotionBox
        className="modal-box"
        initial={{ scale: 0.96, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="close-btn" type="button" onClick={onClose}>
          {"\u2715"}
        </button>

        {loading && <p className="status-text">Loading movie details...</p>}
        {error && <p className="status-text error-text">{error}</p>}

        {!loading && !error && movie && (
          <>
            <h1>{movie.Title}</h1>
            <p className="rating-line">
              {"\u2b50"} {movie.imdbRating} IMDb
            </p>

            <div className="modal-flex">
              <img
                src={resolvePosterUrl(movie.Poster, movie.Title, 300, 450)}
                alt={movie.Title}
                onError={(event) =>
                  handlePosterError(event, movie.Title, 300, 450)
                }
              />

              <div className="movie-meta">
                <MotionSummary
                  className="movie-plot"
                  variants={summaryVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {animatedWords.map((word, index) => (
                    <MotionWord key={`${word}-${index}`} variants={wordVariants}>
                      {word}{" "}
                    </MotionWord>
                  ))}
                </MotionSummary>
                <p>
                  <b>Genre:</b> {movie.Genre}
                </p>
                <p>
                  <b>Runtime:</b> {movie.Runtime}
                </p>
                <p>
                  <b>Actors:</b> {movie.Actors}
                </p>
              </div>
            </div>

            {videoId && (
              <div className="trailer">
                <h3>Trailer</h3>
                <YouTube videoId={videoId} opts={youtubeOptions} />
              </div>
            )}
          </>
        )}
      </MotionBox>
    </MotionOverlay>
  );
};

export default MovieDetailsModal;
