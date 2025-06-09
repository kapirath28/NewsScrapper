import React from 'react';
import { FiBookmark, FiShare2 } from 'react-icons/fi';

const NewsCard = ({ article, isNew, isTrending }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="news-card">
      {isNew && <span className="card-badge badge-new">New</span>}
      {isTrending && <span className="card-badge badge-trending">Trending</span>}
      
      <button className="bookmark-button" aria-label="Bookmark article">
        <FiBookmark />
      </button>
      
      <div className="news-image-container">
        <img 
          src={article.image_url || 'default-news-image.jpg'} 
          alt={article.title}
          className="news-image"
        />
      </div>
      
      <div className="news-content">
        <div className="news-meta">
          <span className="news-source">{article.source_id}</span>
          <span className="news-date">{formatDate(article.pubDate)}</span>
        </div>
        
        <h2 className="news-title">{article.title}</h2>
        <p className="news-description">{article.description}</p>
        
        <div className="news-actions">
          <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="read-more"
          >
            Read More
          </a>
          
          <button className="share-button" aria-label="Share article">
            <FiShare2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard; 