const LOCAL_FALLBACK_POSTER = "/poster-fallback.svg";

export const hasPoster = (movie) =>
  Boolean(movie?.Poster && movie.Poster !== "N/A");

export const sortMissingPostersLast = (movies = []) =>
  [...movies].sort((a, b) => Number(hasPoster(b)) - Number(hasPoster(a)));

export const getPosterPlaceholder = (
  title = "No Poster",
  width = 300,
  height = 450
) => {
  void title;
  void width;
  void height;
  return LOCAL_FALLBACK_POSTER;
};

export const resolvePosterUrl = (
  poster,
  title = "No Poster",
  width = 300,
  height = 450
) => {
  if (!poster || poster === "N/A") {
    return getPosterPlaceholder(title, width, height);
  }

  // Some APIs return insecure HTTP poster links that fail on HTTPS apps.
  if (poster.startsWith("http://")) {
    return poster.replace("http://", "https://");
  }

  return poster;
};

export const handlePosterError = (
  event,
  title = "No Poster",
  width = 300,
  height = 450
) => {
  const image = event.currentTarget;
  image.onerror = null;
  image.src = getPosterPlaceholder(title, width, height);
};
