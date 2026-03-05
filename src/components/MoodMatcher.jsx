import { useState } from "react";
import { getMoodMovie } from "../services/ai";

const MoodMatcher = ({ onMovieFound }) => {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMatch = async () => {
    if (!mood.trim()) return;
    setLoading(true);
    setError("");
    try {
      const title = await getMoodMovie(mood);
      onMovieFound(title);
    } catch (matchError) {
      setError(matchError.message || "Mood match failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mood-container">
      <input
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        placeholder="Describe your mood..."
      />
      <button onClick={handleMatch} disabled={loading || !mood.trim()}>
        {loading ? "Thinking..." : "Match My Mood"}
      </button>
      {error && <p className="status-text error-text">{error}</p>}
    </div>
  );
};

export default MoodMatcher;
