import { useContext } from "react";
import { FavoritesContext } from "./favoritesStore";

export const useFavorites = () => useContext(FavoritesContext);
