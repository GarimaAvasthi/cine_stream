import { useState, useEffect } from "react";
import { FavoritesContext } from "./favoritesStore";

const FAVORITES_LIMIT = 20;

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    const exists = favorites.some((m) => m.imdbID === movie.imdbID);

    if (exists) {
      setFavorites((prev) => prev.filter((m) => m.imdbID !== movie.imdbID));
      return { ok: true, action: "removed" };
    }

    if (favorites.length >= FAVORITES_LIMIT) {
      return { ok: false, reason: "limit_reached" };
    }

    setFavorites((prev) => [...prev, movie]);
    return { ok: true, action: "added" };
  };

  const isFavorite = (id) =>
    favorites.some((movie) => movie.imdbID === id);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesLimit: FAVORITES_LIMIT,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
