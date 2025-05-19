import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';

const GROQ_API_KEY = "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";

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

// Pages
function Home({ genre }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:3000/');
    socket.on('getNews', (news) => {
      setNews(news);
      setLoading(false);
    });
    return () => socket.disconnect();
  }, []);

  const filteredNews = genre === 'All' ? news : news.filter(article => (article.genre || '').toLowerCase() === genre.toLowerCase());

  // Groq AI search
  const handleSearch = async (query) => {
    setSearch(query);
    setSearchResults([]);
    setSearchError('');
    if (!query.trim()) return;
    setSearchLoading(true);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: 'You are a news search assistant. Return a JSON array of news articles (title, description, link, image_url, source_id, pubDate) relevant to the user query.' },
            { role: 'user', content: `Search news: ${query}` },
          ],
          max_tokens: 1024,
        }),
      });
      if (!res.ok) throw new Error('Groq AI search failed');
      const data = await res.json();
      // Try to extract JSON array from Groq's response
      let articles = [];
      try {
        const match = data.choices[0].message.content.match(/\[.*\]/s);
        if (match) {
          articles = JSON.parse(match[0]);
        }
      } catch (e) {
        setSearchError('Could not parse Groq AI response.');
      }
      setSearchResults(Array.isArray(articles) ? articles : []);
    } catch (err) {
      setSearchError('Groq AI search failed. This may be due to CORS or API key issues. Try again or contact support.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="news-page">
      <header className="app-header">
        <h1>Latest News</h1>
        <p className="subtitle">Stay updated with the latest headlines</p>
      </header>
      <SearchBar
        value={search}
        onChange={setSearch}
        onSearch={handleSearch}
        loading={searchLoading}
      />
      {search && (searchLoading || searchResults.length > 0 || searchError) ? (
        <div className="news-grid">
          {searchLoading && <div className="loading-container"><div className="loading-spinner"></div><p>Searching Groq AI...</p></div>}
          {searchError && <div className="error-container"><p>{searchError}</p></div>}
          {!searchLoading && !searchError && searchResults.length === 0 && <div className="no-news"><h2>No Results</h2><p>No news found for your search.</p></div>}
          {searchResults.map((article, idx) => (
            <article key={idx} className="news-card">
              <div className="news-image-container">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="news-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="no-image">No Image Available</div>
                )}
              </div>
              <div className="news-content">
                <h2 className="news-title">{article.title}</h2>
                <p className="news-description">{article.description}</p>
                <div className="news-meta">
                  <span className="news-source">{article.source_id}</span>
                  <span className="news-date">
                    {article.pubDate ? new Date(article.pubDate).toLocaleDateString() : ''}
                  </span>
                </div>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more"
                >
                  Read More
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading latest news...</p>
        </div>
      ) : (
        <div className="news-grid">
          {Array.isArray(filteredNews) && filteredNews.length > 0 ? (
            filteredNews.map((article, idx) => (
              <article key={idx} className="news-card">
                <div className="news-image-container">
                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="news-image"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="no-image">No Image Available</div>
                  )}
                </div>
                <div className="news-content">
                  <h2 className="news-title">{article.title}</h2>
                  <p className="news-description">{article.description}</p>
                  <div className="news-meta">
                    <span className="news-source">{article.source_id}</span>
                    <span className="news-date">
                      {new Date(article.pubDate).toLocaleDateString()}
                    </span>
                  </div>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="read-more"
                  >
                    Read More
                  </a>
                </div>
              </article>
            ))
          ) : (
            <div className="no-news">
              <h2>No News Available</h2>
              <p>Please try again later</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setError('');
    if (type === 'signup') {
      // Sign up: POST /api/user/profile
      try {
        const res = await fetch('http://localhost:8081/api/user/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password
          })
        });
        if (!res.ok) {
          throw new Error('Sign up failed');
        }
        const data = await res.json();
        setUser(data);
        setIsLoggedIn(true);
      } catch (err) {
        setError('Sign up failed. Try a different email.');
      }
    } else {
      // Sign in: POST /api/user/login
      try {
        const res = await fetch('http://localhost:8081/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        if (!res.ok) {
          throw new Error('Invalid credentials');
        }
        const data = await res.json();
        setUser(data);
        setIsLoggedIn(true);
      } catch (err) {
        setError('Invalid email or password.');
      }
    }
  };

  if (isLoggedIn) {
    return (
      <div className="profile-page centered">
        <header className="app-header">
          <h1>Welcome, {user?.username || 'User'}!</h1>
          <p className="subtitle">Manage your profile and preferences</p>
        </header>
        <div className="profile-container card">
          <div className="news-section">
            <h2>Your News Feed</h2>
            <p>Your personalized news feed will appear here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page centered">
      <header className="app-header">
        <h1>Welcome to RealKhabr</h1>
        <p className="subtitle">{showSignup ? 'Create an account to get started' : 'Sign in to your account'}</p>
      </header>
      <div className="profile-container card">
        <div className="auth-forms">
          {!showSignup ? (
            <form className="auth-form" onSubmit={(e) => handleSubmit(e, 'signin')}>
              <div className="auth-error">{error || ''}</div>
              <h2>Sign In</h2>
              <div className="form-group">
                <label htmlFor="signin-email">Email</label>
                <input
                  type="email"
                  id="signin-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signin-password">Password</label>
                <input
                  type="password"
                  id="signin-password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="auth-button">Sign In</button>
              <div className="switch-auth">
                <span>Don't have an account?{' '}
                  <button type="button" className="switch-link" onClick={() => setShowSignup(true)}>Sign up</button>
                </span>
              </div>
            </form>
          ) : (
            <form className="auth-form" onSubmit={(e) => handleSubmit(e, 'signup')}>
              <div className="auth-error">{error || ''}</div>
              <h2>Sign Up</h2>
              <div className="form-group">
                <label htmlFor="signup-username">Username</label>
                <input
                  type="text"
                  id="signup-username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="auth-button">Sign Up</button>
              <div className="switch-auth">
                <span>Already have an account?{' '}
                  <button type="button" className="switch-link" onClick={() => setShowSignup(false)}>Sign in</button>
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="notfound-page centered">
      <header className="app-header">
        <h1>404</h1>
        <p className="subtitle">Page Not Found</p>
      </header>
    </div>
  );
}

export default function App() {
  const [genre, setGenre] = useState('All');
  return (
    <div className="app-container vibrant-bg">
      <Navbar genre={genre} onGenreChange={setGenre} />
      <Routes>
        <Route path="/" element={<Home genre={genre} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
