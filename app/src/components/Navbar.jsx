import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const GENRES = [
  'All',
  'Politics',
  'Technology',
  'Entertainment',
  'Sports',
  'Business',
  'Health',
  'Science',
];

export default function Navbar({ genre, onGenreChange }) {
    const [dark, setDark] = useState(false);
    // Toggle dark mode by adding/removing a class on body
    const toggleDark = () => {
        setDark((d) => {
            document.body.classList.toggle('dark-mode', !d);
            return !d;
        });
    };
    return (
        <header className="navbar-header">
            <nav className="navbar classic-navbar">
                <div className="nav-container">
                    <NavLink to="/" className="nav-logo">
                        <span>RealKhabr</span>
                    </NavLink>
                    <div className="nav-links">
                        <select
                          className="genre-select"
                          value={genre}
                          onChange={e => onGenreChange(e.target.value)}
                          aria-label="Choose news genre"
                        >
                          {GENRES.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Home
                        </NavLink>
                        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Profile
                        </NavLink>
                        <button className="mode-toggle" onClick={toggleDark} aria-label="Toggle dark mode">
                            {dark ? '🌙' : '☀️'}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}