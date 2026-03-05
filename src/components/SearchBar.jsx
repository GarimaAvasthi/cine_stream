const SearchBar = ({ query, onQueryChange }) => {
  return (
    <div className="search-wrap">
      <input
        className="search-bar"
        type="text"
        placeholder="Search movies, series, or actors..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
