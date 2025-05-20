import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

export default function SearchBar({ value, onChange, onSearch, loading }) {
  const [input, setInput] = useState(value || '');
  const [placeholder, setPlaceholder] = useState('');
  const fullPlaceholder = 'Search news with Groq AI...';
  const [trendingTopics] = useState([
    { text: '🔥 ChatGPT', count: '2.3M' },
    { text: '💫 SpaceX', count: '1.1M' },
    { text: '🎮 Gaming', count: '890K' },
    { text: '🎵 Music', count: '750K' }
  ]);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullPlaceholder.length) {
        setPlaceholder(fullPlaceholder.slice(0, currentIndex));
        currentIndex++;
      } else {
        setTimeout(() => {
          currentIndex = 0;
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

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
    <div className="search-section">
      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
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
      
      <div className="trending-section">
        <h3>🔥 Trending Now</h3>
        <div className="trending-topics">
          {trendingTopics.map((topic, index) => (
            <button
              key={index}
              className="trending-topic"
              onClick={() => {
                onChange(topic.text.split(' ')[1]);
                onSearch(topic.text.split(' ')[1]);
              }}
            >
              <span className="topic-text">{topic.text}</span>
              <span className="topic-count">{topic.count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 