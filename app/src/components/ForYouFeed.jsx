import { useState, useEffect } from 'react';
import { FiMic, FiTrendingUp, FiCoffee, FiMoon, FiSun } from 'react-icons/fi';
import { SoundManager } from '../utils/sounds';

const MOODS = {
  DARK_ACADEMIA: {
    name: 'Dark Academia 🖤',
    class: 'theme-dark-academia',
    emoji: '🖤'
  },
  Y2K: {
    name: 'Y2K Hype ✨',
    class: 'theme-y2k',
    emoji: '✨'
  },
  COZY: {
    name: 'Cozy Chill 🍂',
    class: 'theme-cozy',
    emoji: '🍂'
  }
};

const SECTIONS = {
  HOT: { name: 'Hot Right Now 🔥', emoji: '🔥' },
  SPILL: { name: 'Spill The Tea 🫖', emoji: '🫖' },
  FRESH: { name: 'Just Dropped 👀', emoji: '👀' }
};

export default function ForYouFeed({ news }) {
  const [currentMood, setCurrentMood] = useState('DARK_ACADEMIA');
  const [streak, setStreak] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [newsVibes, setNewsVibes] = useState('CHILL'); // OUTRAGE, SAD, CHILL, MINDBLOWING
  const [showMoodPicker, setShowMoodPicker] = useState(false);

  // Simulate news mood calculation
  useEffect(() => {
    const moods = ['OUTRAGE', 'SAD', 'CHILL', 'MINDBLOWING'];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    setNewsVibes(randomMood);
  }, [news]);

  const handleMoodChange = (mood) => {
    SoundManager.play(SoundManager.Sounds.POP);
    setCurrentMood(mood);
    setShowMoodPicker(false);
  };

  const startVoiceSearch = () => {
    setIsListening(true);
    SoundManager.play(SoundManager.Sounds.SWITCH);
    // Add actual voice recognition logic here
    setTimeout(() => setIsListening(false), 2000);
  };

  const getMoodEmoji = () => {
    switch(newsVibes) {
      case 'OUTRAGE': return '😡';
      case 'SAD': return '😭';
      case 'CHILL': return '😎';
      case 'MINDBLOWING': return '🤯';
      default: return '😊';
    }
  };

  return (
    <div className={`for-you-feed ${MOODS[currentMood].class}`}>
      <div className="feed-header">
        <h1 className="vibe-title">What's the vibe today? {MOODS[currentMood].emoji}</h1>
        
        <div className="mood-controls">
          <button 
            className="mood-button"
            onClick={() => setShowMoodPicker(!showMoodPicker)}
          >
            Switch Vibe {MOODS[currentMood].emoji}
          </button>
          
          {showMoodPicker && (
            <div className="mood-picker">
              {Object.entries(MOODS).map(([key, mood]) => (
                <button
                  key={key}
                  className={`mood-option ${currentMood === key ? 'active' : ''}`}
                  onClick={() => handleMoodChange(key)}
                >
                  {mood.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="search-vibe">
          <input
            type="text"
            placeholder="What's on your mind bestie? 💭"
            className="vibe-search"
          />
          <button 
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={startVoiceSearch}
          >
            <FiMic />
          </button>
        </div>

        <div className="mood-meter">
          <span className="mood-label">Today's News Mood:</span>
          <span className="mood-emoji">{getMoodEmoji()}</span>
          <div className="streak-counter">
            🔥 {streak} day streak
          </div>
        </div>
      </div>

      <div className="feed-sections">
        {Object.entries(SECTIONS).map(([key, section]) => (
          <div key={key} className="feed-section">
            <h2 className="section-title">{section.name}</h2>
            <div className="news-grid">
              {news.slice(0, 4).map((article, idx) => (
                <article key={idx} className="news-card-fyp">
                  <div className="card-overlay">
                    <span className="vibe-tag">{section.emoji} Vibing</span>
                  </div>
                  {/* News content */}
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <button className="action-button">
          🎤 Drop a Hot Take
        </button>
        <button className="action-button">
          💭 Anonymous Thoughts
        </button>
        <button className="action-button">
          🎮 News Quest
        </button>
      </div>
    </div>
  );
} 