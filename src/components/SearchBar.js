import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <input type="text" value={query} onChange={handleChange} placeholder="Buscar..." />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
}

export default SearchBar;
