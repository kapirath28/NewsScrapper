import { Link } from 'react-router-dom';

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
  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">RealKhabr</Link>
        <div className="nav-center">
          <div className="genre-container">
            <select 
              value={genre} 
              onChange={(e) => onGenreChange(e.target.value)}
              className="genre-select"
            >
              <option value="All">All</option>
              <option value="Politics">Politics</option>
              <option value="Technology">Technology</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Sports">Sports</option>
              <option value="Business">Business</option>
              <option value="Health">Health</option>
              <option value="Science">Science</option>
            </select>
            <div className="genre-backdrop"></div>
          </div>
        </div>
        <div className="nav-right">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
        </div>
      </div>
    </nav>
  );
}