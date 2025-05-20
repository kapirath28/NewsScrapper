import { useState, useEffect } from 'react';
import { FiCloud, FiSun, FiCloudRain, FiWind } from 'react-icons/fi';

const WEATHER_API_KEY = '05ed009f28c83f177065916becb734d1';

const WEATHER_VIBES = {
  sunny: { emoji: '☀️', text: "it's giving main character energy" },
  cloudy: { emoji: '☁️', text: "cloudy with a chance of slay" },
  rainy: { emoji: '🌧️', text: "perfect for that sad girl walk" },
  stormy: { emoji: '⛈️', text: "mother nature's throwing shade" },
  snowy: { emoji: '❄️', text: "winter wonderland tingz" },
  clear: { emoji: '✨', text: "clear skies, clear mind bestie" }
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWeather = async () => {
      try {
        // Get user's location
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        
        const response = await fetch(
          `http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${latitude},${longitude}`
        );

        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError("Bestie, can't get the weather rn 😭");
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
  }, []);

  const getWeatherVibe = (description) => {
    description = description?.toLowerCase() || '';
    if (description.includes('sun') || description.includes('clear')) return WEATHER_VIBES.sunny;
    if (description.includes('cloud')) return WEATHER_VIBES.cloudy;
    if (description.includes('rain')) return WEATHER_VIBES.rainy;
    if (description.includes('storm')) return WEATHER_VIBES.stormy;
    if (description.includes('snow')) return WEATHER_VIBES.snowy;
    return WEATHER_VIBES.clear;
  };

  const getWeatherIcon = (description) => {
    description = description?.toLowerCase() || '';
    if (description.includes('sun') || description.includes('clear')) return <FiSun />;
    if (description.includes('rain')) return <FiCloudRain />;
    if (description.includes('wind')) return <FiWind />;
    return <FiCloud />;
  };

  if (loading) {
    return (
      <div className="weather-widget glass-card loading">
        <div className="loading-pulse">
          checking the vibes...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-widget glass-card error">
        <p>{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  const weatherVibe = getWeatherVibe(weather.current?.weather_descriptions?.[0]);

  return (
    <div className="weather-widget glass-card">
      <div className="weather-header">
        <div className="weather-icon">
          {getWeatherIcon(weather.current?.weather_descriptions?.[0])}
        </div>
        <div className="weather-temp">
          <span className="temp-number">{weather.current?.temperature}°</span>
          <span className="temp-unit">C</span>
        </div>
      </div>
      
      <div className="weather-details">
        <div className="weather-location">
          {weather.location?.name}, {weather.location?.country}
        </div>
        <div className="weather-description">
          {weatherVibe.emoji} {weatherVibe.text}
        </div>
      </div>

      <div className="weather-stats">
        <div className="stat">
          <FiWind />
          <span>{weather.current?.wind_speed} km/h winds</span>
        </div>
        <div className="stat">
          <span>💧</span>
          <span>{weather.current?.humidity}% humidity</span>
        </div>
      </div>
    </div>
  );
} 