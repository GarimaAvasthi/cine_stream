import { useState } from "react";
import { useFavorites } from "../context/useFavorites";
import MovieGrid from "../components/MovieGrid";
import MovieDetailsModal from "../components/MovieDetailsModal";

const Favorites = () => {
  const { favorites } = useFavorites();
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Saved List</p>
        <h2>My Favorites</h2>
      </header>
      <MovieGrid
        movies={favorites}
        onMovieClick={(movieId) => setSelectedMovieId(movieId)}
      />
      {selectedMovieId && (
        <MovieDetailsModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </section>
  );
};

export default Favorites;
