import { useState, useEffect } from 'react';
import { FiSun, FiCloud, FiCloudRain, FiWind } from 'react-icons/fi';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHERSTACK_API_KEY || '05ed009f28c83f177065916becb734d1';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const CITIES = [
  { name: 'Mumbai', emoji: '🇮🇳' },
  { name: 'New York', emoji: '🗽' },
  { name: 'London', emoji: '🇬🇧' },
  { name: 'Los Angeles', emoji: '🌴' },
  { name: 'Sydney', emoji: '🦘' }
];

export default function GlobalWeather() {
  const [weatherData, setWeatherData] = useState(() => {
    const cached = localStorage.getItem('weatherData');
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
    return {};
  });
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  useEffect(() => {
    const fetchWeather = async (city) => {
      // Add delay between requests to respect rate limits
      const timeSinceLastFetch = Date.now() - lastFetchTime;
      if (timeSinceLastFetch < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastFetch));
      }

      try {
        // Try HTTPS first
        const url = `https://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${city.name}`;
        const res = await fetch(url);
        const data = await res.json();
        setLastFetchTime(Date.now());

        if (data.success === false) {
          if (data.error?.code === 106) {
            throw new Error('RATE_LIMIT');
          }
          throw new Error(data.error?.info || 'API Error');
        }

        return data;
      } catch (err) {
        if (err.message === 'RATE_LIMIT') {
          throw err;
        }
        // If HTTPS fails, try HTTP
        try {
          const httpUrl = `http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${city.name}`;
          const res = await fetch(httpUrl);
          const data = await res.json();
          setLastFetchTime(Date.now());

          if (data.success === false) {
            if (data.error?.code === 106) {
              throw new Error('RATE_LIMIT');
            }
            throw new Error(data.error?.info || 'API Error');
          }

          return data;
        } catch (httpErr) {
          throw httpErr;
        }
      }
    };

    const fetchAllWeather = async () => {
      // Check if we have valid cached data
      const cached = localStorage.getItem('weatherData');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setWeatherData(data);
          setLoading(false);
          setError(null);
          return;
        }
      }

      try {
        // Fetch weather data sequentially with delays to avoid rate limiting
        const weatherMap = {};
        for (const city of CITIES) {
          try {
            const result = await fetchWeather(city);
            weatherMap[city.name] = result;
          } catch (err) {
            if (err.message === 'RATE_LIMIT') {
              if (retryCount < 3) {
                setRetryCount(prev => prev + 1);
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount + 1) * 1000));
                continue;
              }
              throw new Error('Rate limit reached. Please try again later.');
            }
            throw err;
          }
        }
        
        // Cache the successful response
        localStorage.setItem('weatherData', JSON.stringify({
          data: weatherMap,
          timestamp: Date.now()
        }));
        
        setWeatherData(weatherMap);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        console.error('Failed to fetch weather data:', err);
        setError(err.message || 'Unable to fetch weather data. Please check your API key and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllWeather();

    // Rotate through cities every 5 seconds
    const interval = setInterval(() => {
      setActiveIndex(current => (current + 1) % CITIES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [retryCount, lastFetchTime]);

  const getWeatherIcon = (description = '') => {
    description = description?.toLowerCase() || '';
    if (description.includes('sun') || description.includes('clear')) return <FiSun className="weather-icon sun" />;
    if (description.includes('rain')) return <FiCloudRain className="weather-icon rain" />;
    if (description.includes('wind')) return <FiWind className="weather-icon wind" />;
    return <FiCloud className="weather-icon" />;
  };

  if (loading && Object.keys(weatherData).length === 0) {
    return (
      <div className="global-weather-container">
        <div className="loading-pulse">Loading global weather... ⚡️</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="global-weather-container">
        <div className="error-message">
          {error}
          <div className="error-details">
            Please make sure your WeatherStack API key is valid and has access to HTTPS endpoints.
            {retryCount > 0 && <div>Retrying... ({retryCount}/3)</div>}
          </div>
        </div>
      </div>
    );
  }

  const currentCity = CITIES[activeIndex];
  const currentWeather = weatherData[currentCity.name];

  if (!currentWeather?.current) {
    return (
      <div className="global-weather-container">
        <div className="loading-pulse">Weather data unavailable for {currentCity.name} 😢</div>
      </div>
    );
  }

  return (
    <div className="global-weather-container">
      <div className="weather-card">
        <div className="city-name">
          <span className="city-emoji">{currentCity.emoji}</span>
          {currentCity.name}
        </div>
        <div className="weather-info">
          {getWeatherIcon(currentWeather.current.weather_descriptions?.[0])}
          <span className="temperature">
            {currentWeather.current.temperature}°C
          </span>
          <span className="description">
            {currentWeather.current.weather_descriptions?.[0]}
          </span>
        </div>
      </div>

      <div className="weather-dots">
        {CITIES.map((city, index) => (
          <button
            key={city.name}
            className={`weather-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${city.name} weather`}
          />
        ))}
      </div>
    </div>
  );
} 