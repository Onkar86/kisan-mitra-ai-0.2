import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';
import { getWeatherByLocation, getCropWeatherAdvice } from '../services/weatherService';
import { UserProfile } from '../types';

interface WeatherWidgetProps {
  userProfile: UserProfile;
}

export default function WeatherWidget({ userProfile }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cropAdvice, setCropAdvice] = useState<string>('');

  useEffect(() => {
    loadWeather();
  }, [userProfile.district, userProfile.state]);

  const loadWeather = async () => {
    if (!userProfile.district || !userProfile.state) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getWeatherByLocation(userProfile.district, userProfile.state);
      
      if (data) {
        setWeather(data);
        
        // Get crop-specific advice
        if (userProfile.crops && userProfile.crops.length > 0) {
          const advice = getCropWeatherAdvice(userProfile.crops[0], data);
          setCropAdvice(advice);
        }
      }
    } catch (err) {
      console.error('Error loading weather:', err);
      setError('Could not load weather data');
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile.district || !userProfile.state) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-sm text-blue-800">
          Update your district and state to see weather information
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <p className="text-gray-600">Loading weather...</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">Weather data unavailable</p>
        <button
          onClick={loadWeather}
          className="mt-2 text-yellow-600 hover:text-yellow-800 text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm opacity-90">📍 {userProfile.district}, {userProfile.state}</p>
          <h3 className="text-2xl font-bold">{weather.temperature}°C</h3>
          <p className="text-blue-100">{weather.condition}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl">
            {weather.condition.includes('Rain')
              ? '🌧️'
              : weather.condition.includes('Cloud')
                ? '☁️'
                : weather.condition.includes('Clear')
                  ? '☀️'
                  : '🌤️'}
          </p>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
        <div className="bg-blue-400 bg-opacity-60 rounded p-2">
          <p className="opacity-80">Humidity</p>
          <p className="font-bold">{weather.humidity}%</p>
        </div>
        <div className="bg-blue-400 bg-opacity-60 rounded p-2">
          <p className="opacity-80">Wind</p>
          <p className="font-bold">{weather.windSpeed} m/s</p>
        </div>
        <div className="bg-blue-400 bg-opacity-60 rounded p-2">
          <p className="opacity-80">Feels Like</p>
          <p className="font-bold">{weather.feelsLike || weather.temperature}°C</p>
        </div>
      </div>

      {/* Farming Advice */}
      {weather.advice && (
        <div className="bg-blue-400 bg-opacity-40 rounded p-3 mb-4">
          <p className="text-sm">✅ {weather.advice}</p>
        </div>
      )}

      {/* Crop-specific Advice */}
      {cropAdvice && (
        <div className="bg-lime-100 text-gray-800 rounded p-3 text-sm">
          <p className="font-semibold">{cropAdvice}</p>
        </div>
      )}
    </div>
  );
}
