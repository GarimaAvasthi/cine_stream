import { useEffect, useMemo, useState } from "react";
import { searchMovies } from "../services/tmdb";
import { sortMissingPostersLast } from "../utils/poster";

const POPULAR_PICK_TERMS = [
  "inception",
  "interstellar",
  "parasite",
  "get out",
  "whiplash",
  "arrival",
  "coco",
  "gravity",
  "goodfellas",
  "amelie",
];

const normalizeTitleKey = (title = "") => {
  const baseTitle = title
    .toLowerCase()
    .replace(/[:-].*$/, "")
    .replace(/\b(part|episode|chapter|vol|volume)\b.*$/i, "")
    .replace(/\b\d+\b/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return baseTitle;
};

const isFranchiseDuplicate = (movie, selected) => {
  const incomingKey = normalizeTitleKey(movie.Title);
  if (!incomingKey) return false;

  return selected.some((item) => {
    const existingKey = normalizeTitleKey(item.Title);
    return incomingKey === existingKey;
  });
};

export const usePopularPicks = (limit = 5) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const pickLimit = useMemo(() => Math.max(1, limit), [limit]);

  useEffect(() => {
    let cancelled = false;

    const loadPopularPicks = async () => {
      setLoading(true);

      try {
        const responses = await Promise.all(
          POPULAR_PICK_TERMS.map((term) =>
            searchMovies(term, 1, { type: "movie" })
          )
        );

        if (cancelled) return;

        const curated = [];
        for (const response of responses) {
          const candidates = response?.Search ?? [];
          for (const movie of candidates) {
            if (
              !movie?.imdbID ||
              curated.some((item) => item.imdbID === movie.imdbID) ||
              isFranchiseDuplicate(movie, curated)
            ) {
              continue;
            }

            curated.push(movie);
            break;
          }

          if (curated.length >= pickLimit) break;
        }

        setMovies(sortMissingPostersLast(curated).slice(0, pickLimit));
      } catch (error) {
        console.error("Failed to load popular picks", error);
        if (!cancelled) setMovies([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadPopularPicks();
    return () => {
      cancelled = true;
    };
  }, [pickLimit]);

  return { movies, loading };
};
