import { useEffect, useReducer } from "react";
import { searchMovies } from "../services/tmdb";
import { sortMissingPostersLast } from "../utils/poster";

const initialState = {
  movies: [],
  loading: false,
  error: "",
  hasMore: true,
  totalPages: 1,
};

const moviesReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: "",
        movies: action.reset ? [] : state.movies,
      };
    case "FETCH_SUCCESS": {
      const incomingMovies = action.movies ?? [];
      const combinedMovies = action.reset
        ? incomingMovies
        : [
            ...state.movies,
            ...incomingMovies.filter(
              (movie) =>
                !state.movies.some(
                  (existing) => existing.imdbID === movie.imdbID
                )
            ),
          ];

      return {
        ...state,
        loading: false,
        movies: sortMissingPostersLast(combinedMovies),
        totalPages: action.totalPages ?? state.totalPages,
        hasMore:
          incomingMovies.length > 0 &&
          action.page < (action.totalPages ?? Infinity),
      };
    }
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
        hasMore: false,
      };
    default:
      return state;
  }
};

export const useMovies = (query, page = 1) => {
  const [state, dispatch] = useReducer(moviesReducer, initialState);
  const searchTerm = (query || "marvel").trim() || "marvel";

  useEffect(() => {
    let cancelled = false;
    const resetList = page === 1;

    const loadMovies = async () => {
      dispatch({ type: "FETCH_START", reset: resetList });
      try {
        const data = await searchMovies(searchTerm, page);
        if (cancelled) return;

        const apiMovies = data?.Search ?? [];
        const shouldShowError =
          data?.Response === "False" &&
          page === 1 &&
          data?.Error !== "Movie not found!";

        dispatch({
          type: "FETCH_SUCCESS",
          reset: resetList,
          movies: apiMovies,
          totalPages: data?.totalPages ?? 1,
          page,
        });

        if (shouldShowError) {
          dispatch({
            type: "FETCH_ERROR",
            error: data.Error || "Unable to fetch movies right now.",
          });
        }
      } catch {
        if (cancelled) return;
        dispatch({
          type: "FETCH_ERROR",
          error: "Unable to fetch movies right now.",
        });
      }
    };

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, [searchTerm, page]);

  return state;
};
