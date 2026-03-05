const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE =
  import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const buildPoster = (posterPath) =>
  posterPath ? `${IMAGE_BASE}${posterPath}` : "N/A";

const fetchWithTimeout = async (url, ms = 8000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
};

const asTmdbError = (data) => ({
  Response: "False",
  Error: data?.status_message || "Unable to fetch movies right now.",
});

const assertApiKey = () => {
  if (!API_KEY) {
    return {
      Response: "False",
      Error:
        "Missing TMDB key. Set VITE_TMDB_API_KEY in .env and restart/rebuild.",
    };
  }
  return null;
};

export const searchMovies = async (query, page = 1) => {
  const keyError = assertApiKey();
  if (keyError) return keyError;

  const url = new URL(`${BASE}/search/movie`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("include_adult", "false");

  try {
    const res = await fetchWithTimeout(url.toString());
    if (!res.ok) {
      return asTmdbError({
        status_message: `TMDB request failed (${res.status})`,
      });
    }
    const data = await res.json();

    if (data?.success === false || data?.status_code) {
      return asTmdbError(data);
    }

    const results = (data?.results ?? []).map((movie) => ({
      Title: movie.title,
      Year: movie.release_date ? movie.release_date.slice(0, 4) : "—",
      Poster: buildPoster(movie.poster_path),
      imdbID: String(movie.id),
    }));

    return {
      Response: "True",
      Search: results,
      totalPages: data?.total_pages ?? 1,
    };
  } catch (error) {
    const timedOut = error?.name === "AbortError";
    return asTmdbError({
      status_message: timedOut
        ? "TMDB request timed out. Check your connection and try again."
        : "Unable to reach TMDB. Please check your connection.",
    });
  }
};

export const fetchMovieDetails = async (id) => {
  const keyError = assertApiKey();
  if (keyError) return keyError;

  const url = new URL(`${BASE}/movie/${id}`);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("append_to_response", "credits");

  try {
    const res = await fetchWithTimeout(url.toString());
    if (!res.ok) {
      return asTmdbError({
        status_message: `TMDB request failed (${res.status})`,
      });
    }
    const data = await res.json();

    if (data?.success === false || data?.status_code) {
      return asTmdbError(data);
    }

    const cast =
      data?.credits?.cast
        ?.slice(0, 5)
        .map((actor) => actor.name)
        .join(", ") || "Cast data unavailable";

    const genres =
      data?.genres?.map((genre) => genre.name).join(", ") ||
      "Genre not listed";

    return {
      Response: "True",
      Title: data.title,
      imdbID: String(data.id),
      Poster: buildPoster(data.poster_path),
      Plot: data.overview || "Plot not available.",
      Genre: genres,
      Runtime: data.runtime ? `${data.runtime} min` : "Runtime N/A",
      Actors: cast,
      imdbRating:
        typeof data.vote_average === "number"
          ? data.vote_average.toFixed(1)
          : "N/A",
    };
  } catch (error) {
    const timedOut = error?.name === "AbortError";
    return asTmdbError({
      status_message: timedOut
        ? "TMDB request timed out. Check your connection and try again."
        : "Unable to reach TMDB. Please check your connection.",
    });
  }
};
