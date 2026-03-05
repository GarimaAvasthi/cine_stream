const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL =
  import.meta.env.VITE_GEMINI_MODEL || "gemini-1.5-flash";

const cleanTitle = (text) => {
  if (!text) return "";
  const firstLine = text.split("\n")[0].trim();
  return firstLine.replace(/^["'\s]+|["'\s.]+$/g, "");
};

export const getMoodMovie = async (mood) => {
  if (!GEMINI_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY in environment.");
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Return only one movie title based on this mood: ${mood}`,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    let errorMessage = `Mood matching request failed (${response.status}).`;
    try {
      const data = await response.json();
      const apiMessage = data?.error?.message;
      if (apiMessage) errorMessage = apiMessage;
    } catch {
      // ignore response parsing errors
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const rawTitle =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const title = cleanTitle(rawTitle);
  if (!title) {
    throw new Error("Could not generate a movie title for this mood.");
  }
  return title;
};
