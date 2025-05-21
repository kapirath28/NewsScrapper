import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-bar"
          placeholder="Search the latest trends with Groq AI..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-icon" aria-label="Search">
          <FiSearch />
        </button>
      </form>
    </div>
  );
};

export default SearchBar; 