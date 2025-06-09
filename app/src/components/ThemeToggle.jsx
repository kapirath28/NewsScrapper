import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { SoundManager } from '../utils/sounds';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    SoundManager.play(SoundManager.Sounds.SWITCH);
    setIsDark(!isDark);
    document.body.classList.toggle('light-theme');
  };

  useEffect(() => {
    // Initialize theme
    if (!isDark) {
      document.body.classList.add('light-theme');
    }
  }, []);

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span className="icon">
        {isDark ? <FiSun /> : <FiMoon />}
      </span>
    </button>
  );
} 