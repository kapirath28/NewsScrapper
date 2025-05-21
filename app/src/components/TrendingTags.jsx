import React from 'react';
import { FiFire, FiRocket, FiMonitor, FiMusic } from 'react-icons/fi';

const TrendingTags = ({ onTagClick }) => {
  const trendingTags = [
    { icon: <FiFire />, name: 'ChatGPT', count: '2.3M' },
    { icon: <FiRocket />, name: 'SpaceX', count: '1.1M' },
    { icon: <FiMonitor />, name: 'Gaming', count: '890K' },
    { icon: <FiMusic />, name: 'Music', count: '750K' }
  ];

  return (
    <div className="trending-section">
      <div className="trending-header">
        <FiFire size={24} />
        <h2>Trending Now</h2>
      </div>
      <div className="trending-tags">
        {trendingTags.map((tag, index) => (
          <button
            key={index}
            className="trending-tag"
            onClick={() => onTagClick(tag.name)}
          >
            <span className="tag-icon">{tag.icon}</span>
            <span className="tag-name">{tag.name}</span>
            <span className="tag-count">{tag.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTags; 