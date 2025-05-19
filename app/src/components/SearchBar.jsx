import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

export default function SearchBar({ value, onChange, onSearch, loading }) {
  const [input, setInput] = useState(value || '');

  const handleInput = (e) => {
    setInput(e.target.value);
    onChange && onChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch && onSearch(input);
    }
  };

  const handleClear = () => {
    setInput('');
    onChange && onChange('');
  };

  return (
    <div className="search-bar-container glassy">
      <input
        className="search-bar-input"
        type="text"
        placeholder="Search news with Groq AI..."
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={loading}
        aria-label="Search news"
      />
      {input && !loading && (
        <button className="search-bar-clear" onClick={handleClear} aria-label="Clear search">
          <FiX size={20} />
        </button>
      )}
      <button
        className="search-bar-btn"
        onClick={() => onSearch && onSearch(input)}
        disabled={loading || !input.trim()}
        aria-label="Search"
      >
        {loading ? <span className="search-bar-spinner"></span> : <FiSearch size={22} />}
      </button>
    </div>
  );
} 