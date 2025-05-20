import { useState } from 'react';
import { FiShare2, FiBookmark, FiClock } from 'react-icons/fi';
import EmojiReactions from './EmojiReactions';
import { SoundManager } from '../utils/sounds';

export default function NewsCard({ article, index }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    SoundManager.play(SoundManager.Sounds.POP);
  };

  const handleShare = async () => {
    SoundManager.play(SoundManager.Sounds.POP);
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.link
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  // Calculate if the article is new (less than 24 hours old)
  const isNew = () => {
    const pubDate = new Date(article.pubDate);
    const now = new Date();
    const diffHours = Math.abs(now - pubDate) / 36e5;
    return diffHours < 24;
  };

  // Check if article has high engagement (example logic)
  const isTrending = () => {
    // This would normally check real engagement metrics
    return Math.random() < 0.2; // 20% chance of being trending for demo
  };

  return (
    <article className="news-card">
      <div className="news-image-container">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="news-image"
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x300/333333/FFFFFF/png?text=No+Image';
            }}
          />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
        
        <button
          className={`bookmark-button ${isBookmarked ? 'active' : ''}`}
          onClick={handleBookmark}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <FiBookmark />
        </button>

        {isNew() && <div className="news-tag new">New 🔥</div>}
        {isTrending() && <div className="news-tag trending">Trending 📈</div>}
      </div>

      <div className="news-content">
        <h2 className="news-title">{article.title}</h2>
        <p className="news-description">{article.description}</p>
        
        <div className="news-meta">
          <span className="news-source">{article.source_id}</span>
          <span className="news-date">
            <FiClock style={{ marginRight: '4px' }} />
            {new Date(article.pubDate).toLocaleDateString()}
          </span>
        </div>

        <EmojiReactions articleId={index} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more"
          >
            Read More
          </a>

          <button
            className="share-button"
            onClick={handleShare}
            aria-label="Share article"
          >
            <FiShare2 />
          </button>
        </div>
      </div>
    </article>
  );
} 