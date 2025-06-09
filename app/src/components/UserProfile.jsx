import { useState, useEffect } from 'react';
import { FiTrendingUp, FiBookmark, FiAward, FiBarChart2, FiFlag, FiLogOut } from 'react-icons/fi';
import { SoundManager } from '../utils/sounds';
import WeatherWidget from './WeatherWidget';

// Personality types with their descriptions and emojis
const PERSONALITIES = {
  INVESTIGATOR: {
    title: 'The Investigator 🕵️‍♂️',
    description: 'You dig deep into political tea ☕️',
    traits: ['Analytical', 'Truth Seeker', 'Detail Oriented']
  },
  DRAMA_MAGNET: {
    title: 'The Drama Magnet 🎭',
    description: 'Living for the celeb beefs and spicy takes 🌶️',
    traits: ['Drama Connoisseur', 'Pop Culture Expert', 'Tea Collector']
  },
  FINANCE_BROKE: {
    title: 'The Finance Broke 📉',
    description: 'Stonks and crypto are your daily bread 🍞',
    traits: ['Market Watcher', 'Trend Spotter', 'Risk Taker']
  },
  PEACE_SEEKER: {
    title: 'The Peace Seeker 🧘',
    description: 'Keeping it zen in a chaotic world ✨',
    traits: ['Mindful Reader', 'Positive Vibes', 'Balance Keeper']
  }
};

// Avatar items that can be unlocked
const AVATAR_ITEMS = {
  TECH: { name: 'Cyberpunk Glasses 🕶️', requirement: 50 },
  GOSSIP: { name: 'Drama Popcorn 🍿', requirement: 30 },
  DARK: { name: 'Mystery Hoodie 🧥', requirement: 40 },
  FINANCE: { name: 'Money Headband 💸', requirement: 25 }
};

export default function UserProfile({ user, onLogout }) {
  const [personality, setPersonality] = useState(null);
  const [newsStats, setNewsStats] = useState({
    politics: 30,
    entertainment: 25,
    tech: 20,
    finance: 15,
    health: 10
  });
  const [streak, setStreak] = useState(7);
  const [capScore, setCapScore] = useState(85);
  const [unlockedItems, setUnlockedItems] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('cyberpunk');
  const [hotTakes, setHotTakes] = useState([
    { text: "This AI thing? It's giving 'trying too hard' 🙄", likes: 42 },
    { text: "Breaking: Touch grass challenge failed successfully 🌱", likes: 38 }
  ]);

  // Calculate personality based on reading habits
  useEffect(() => {
    const maxCategory = Object.entries(newsStats).reduce((a, b) => 
      a[1] > b[1] ? a : b
    )[0];
    
    const personalityMap = {
      politics: 'INVESTIGATOR',
      entertainment: 'DRAMA_MAGNET',
      finance: 'FINANCE_BROKE',
      health: 'PEACE_SEEKER'
    };
    
    setPersonality(personalityMap[maxCategory] || 'INVESTIGATOR');
  }, [newsStats]);

  // Simulate unlocking items based on reading stats
  useEffect(() => {
    const newUnlockedItems = [];
    if (newsStats.tech > 40) newUnlockedItems.push('TECH');
    if (newsStats.entertainment > 20) newUnlockedItems.push('GOSSIP');
    setUnlockedItems(newUnlockedItems);
  }, [newsStats]);

  const handleThemeChange = (theme) => {
    SoundManager.play(SoundManager.Sounds.POP);
    setSelectedTheme(theme);
  };

  const addHotTake = (take) => {
    SoundManager.play(SoundManager.Sounds.POP);
    setHotTakes([{ text: take, likes: 0 }, ...hotTakes]);
  };

  const handleLogout = () => {
    SoundManager.play(SoundManager.Sounds.POP);
    onLogout();
  };

  return (
    <div className={`user-profile-container theme-${selectedTheme}`}>
      {/* Profile Header */}
      <div className="profile-header glass-card">
        <div className="profile-avatar">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
            alt="avatar" 
          />
          {unlockedItems.map(item => (
            <div key={item} className="avatar-item">
              {AVATAR_ITEMS[item].name}
            </div>
          ))}
        </div>
        
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="user-email">{user.email}</p>
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut /> Logout
          </button>
          <div className="personality-badge">
            <h2>{PERSONALITIES[personality]?.title}</h2>
            <p>{PERSONALITIES[personality]?.description}</p>
            <div className="traits">
              {PERSONALITIES[personality]?.traits.map(trait => (
                <span key={trait} className="trait-tag">{trait}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="glass-card">
          <h3><FiBarChart2 /> Your Vibe Chart</h3>
          <div className="vibe-stats">
            {Object.entries(newsStats).map(([category, percentage]) => (
              <div key={category} className="stat-bar">
                <span className="category">{category}</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="percentage">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-right">
          <div className="glass-card">
            <h3><FiFlag /> Cap Check Score</h3>
            <div className="cap-score">
              <div className="score-circle">
                <span className="score">{capScore}</span>
                <span className="label">Cap Detector</span>
              </div>
              <p>You've caught {capScore}% of 🧢 news this month!</p>
            </div>
          </div>
          
          <WeatherWidget />
        </div>
      </div>

      {/* Hot Takes Wall */}
      <div className="glass-card hot-takes">
        <h3>Your Takes 🔥</h3>
        <div className="takes-input">
          <input 
            type="text" 
            placeholder="Drop your hot take bestie..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addHotTake(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
        <div className="takes-grid">
          {hotTakes.map((take, index) => (
            <div key={index} className="take-card">
              <p>{take.text}</p>
              <div className="take-meta">
                <span className="likes">{take.likes} vibes</span>
                <span className="time">2h ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Customization */}
      <div className="glass-card themes">
        <h3>Profile Aesthetic ✨</h3>
        <div className="theme-options">
          {['cyberpunk', 'y2k', 'minimalist', 'dark-academia'].map(theme => (
            <button
              key={theme}
              className={`theme-btn ${selectedTheme === theme ? 'active' : ''}`}
              onClick={() => handleThemeChange(theme)}
            >
              {theme.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card achievements">
        <h3><FiAward /> Unlockables</h3>
        <div className="achievements-grid">
          {Object.entries(AVATAR_ITEMS).map(([key, item]) => (
            <div 
              key={key} 
              className={`achievement ${unlockedItems.includes(key) ? 'unlocked' : 'locked'}`}
            >
              <span className="achievement-icon">{item.name}</span>
              <span className="achievement-req">
                {unlockedItems.includes(key) 
                  ? 'Unlocked! 🎉' 
                  : `Read ${item.requirement} more articles`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 