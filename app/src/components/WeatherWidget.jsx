import { useState, useEffect } from 'react';
import { WiCloud, WiDaySunny, WiRain, WiWindy } from 'react-icons/wi';
import '../styles/WeatherWidget.css';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '6d78abf04fc64193a0651217252405';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=auto:ip`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error.message || 'API Error');
        }

        setWeather(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError('Unable to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition = {}) => {
    const text = condition.text?.toLowerCase() || '';
    if (text.includes('sun') || text.includes('clear')) return <WiDaySunny className="weather-icon sun" />;
    if (text.includes('rain')) return <WiRain className="weather-icon rain" />;
    if (text.includes('wind')) return <WiWindy className="weather-icon wind" />;
    return <WiCloud className="weather-icon" />;
  };

  if (loading) {
    return (
      <div className="glass-card weather-widget">
        <div className="loading">Loading weather... ⚡️</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card weather-widget">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!weather?.current) {
    return (
      <div className="glass-card weather-widget">
        <div className="error">Weather data unavailable 😢</div>
      </div>
    );
  }

  return (
    <div className="glass-card weather-widget">
      <div className="weather-content">
        <div className="weather-icon-container">
          {getWeatherIcon(weather.current.condition)}
          <span className="temperature">{Math.round(weather.current.temp_c)}°C</span>
        </div>
        <div className="weather-details">
          <p className="weather-message">✨ {weather.current.condition.text.toLowerCase()}, clear mind bestie</p>
          <div className="weather-stats">
            <span className="wind">{weather.current.wind_kph} km/h winds</span>
            <span className="humidity">{weather.current.humidity}% humidity</span>
          </div>
        </div>
      </div>
    </div>
  );
} 