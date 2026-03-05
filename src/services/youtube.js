const YT_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const fetchTrailer = async (title) => {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${title} trailer&type=video&key=${YT_KEY}`
  );

  const data = await res.json();
  return data.items?.[0]?.id?.videoId || null;
};