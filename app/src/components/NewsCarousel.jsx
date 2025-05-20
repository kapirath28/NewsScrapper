import { useState, useRef, useEffect } from 'react';
import EmojiReactions from './EmojiReactions';
import { SoundManager } from '../utils/sounds';

export default function NewsCarousel({ articles }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const carouselRef = useRef(null);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    if (Math.abs(dragOffset) > 50) {
      SoundManager.play(SoundManager.Sounds.SWIPE);

      if (dragOffset > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (dragOffset < 0 && currentIndex < articles.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      SoundManager.play(SoundManager.Sounds.SWIPE);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.style.transform = `translateX(${-currentIndex * 100 + (dragOffset / carousel.offsetWidth) * 100}%)`;
    }
  }, [currentIndex, dragOffset]);

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="carousel-container">
      <div 
        className="carousel-track"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${-currentIndex * 100 + (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100}%)`,
        }}
      >
        {articles.map((article, idx) => (
          <div key={idx} className="carousel-slide">
            <div className="carousel-card">
              <div className="carousel-image">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="no-image">No Image Available</div>
                )}
              </div>
              <div className="carousel-content">
                <h2>{article.title}</h2>
                <p>{article.description}</p>
                <div className="carousel-meta">
                  <span className="source">{article.source_id}</span>
                  <span className="date">
                    {new Date(article.pubDate).toLocaleDateString()}
                  </span>
                </div>
                <EmojiReactions articleId={idx} />
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="carousel-dots">
        {articles.map((_, idx) => (
          <button
            key={idx}
            className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 