import { WeatherData, UserProfile, SupportedLanguage } from '../types';

/**
 * Weather Service - Provides weather data and farming seasonal advice
 * Uses OpenWeatherMap free tier API
 * 
 * Get free API key from: https://openweathermap.org/api
 * Free tier: 1,000,000 calls/month (60 calls/minute)
 */

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherAdvice {
  summary: string;
  farmingTips: string[];
  warnings: string[];
  besttoCrops: string[];
  irrigationNeeded: boolean;
  pestRiskLevel: 'low' | 'medium' | 'high';
}

export async function getWeatherByCoordinates(
  latitude: number,
  longitude: number
): Promise<WeatherData | null> {
  try {
    if (!WEATHER_API_KEY) {
      console.warn('Weather API key not configured. Set VITE_WEATHER_API_KEY in .env');
      return null;
    }

    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      console.error('Weather API error:', response.statusText);
      return null;
    }

    const data = await response.json();

    const weatherData: WeatherData = {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 10) / 10,
      feelsLike: Math.round(data.main.feels_like),
      uvIndex: data.uvi || undefined,
      rainfall: data.rain?.['1h'] || undefined,
      advice: generateFarmingAdvice(data),
    };

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

export async function getWeatherByLocation(
  city: string,
  state: string
): Promise<WeatherData | null> {
  try {
    if (!WEATHER_API_KEY) {
      return null;
    }

    // Geocode location to get coordinates
    const geoResponse = await fetch(
      `${WEATHER_BASE_URL}/find?q=${city},${state},IN&appid=${WEATHER_API_KEY}`
    );

    if (!geoResponse.ok) {
      return null;
    }

    const geoData = await geoResponse.json();

    if (geoData.list && geoData.list.length > 0) {
      const { lat, lon } = geoData.list[0].coord;
      return getWeatherByCoordinates(lat, lon);
    }

    return null;
  } catch (error) {
    console.error('Error geocoding location:', error);
    return null;
  }
}

/**
 * Generate farming-specific advice based on weather conditions
 */
function generateFarmingAdvice(weatherData: any): string {
  const temp = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const condition = weatherData.weather[0].main;
  const windSpeed = weatherData.wind.speed;
  const rainfall = weatherData.rain?.['1h'] || 0;

  let advice = '';

  // Temperature advice
  if (temp < 0) {
    advice += '❄️ Frost risk - cover sensitive crops\n';
  } else if (temp < 10) {
    advice += '🥶 Cold weather - reduce irrigation\n';
  } else if (temp > 40) {
    advice += '🌡️ Extreme heat - increase irrigation & mulching\n';
  }

  // Humidity & disease risk
  if (humidity > 85) {
    advice += '💧 High humidity - watch for fungal diseases. Apply fungicide if needed\n';
  } else if (humidity < 30) {
    advice += '🌵 Low humidity - increase irrigation frequency\n';
  }

  // Rainfall advice
  if (rainfall > 10) {
    advice += '🌧️ Heavy rain - avoid spraying pesticides today\n';
  } else if (condition === 'Rain' || condition === 'Thunderstorm') {
    advice += '⛈️ Rain expected - do field inspections after rain\n';
  }

  // Wind advice
  if (windSpeed > 20) {
    advice += '💨 Strong winds - avoid pesticide spraying\n';
  }

  // Nitrogen fertilizer advice (photosynthesis needs)
  if (condition === 'Clear' && humidity > 40 && humidity < 70 && temp > 20 && temp < 35) {
    advice += '✅ Ideal farming conditions today - good for spraying & transplanting\n';
  }

  return advice || '☀️ Average farming day - monitor your crops regularly';
}

/**
 * Get 5-day forecast for seasonal planning
 */
export async function getForecast(
  latitude: number,
  longitude: number
): Promise<WeatherData[] | null> {
  try {
    if (!WEATHER_API_KEY) {
      return null;
    }

    const response = await fetch(
      `${WEATHER_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const forecastList: WeatherData[] = [];

    // Get forecast for every 24 hours (position 0, 8, 16, 24, 32)
    [0, 8, 16, 24, 32].forEach(index => {
      if (data.list[index]) {
        const item = data.list[index];
        forecastList.push({
          temperature: Math.round(item.main.temp),
          condition: item.weather[0].main,
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind.speed * 10) / 10,
          rainfall: item.rain?.['3h'] || undefined,
          advice: generateFarmingAdvice(item),
        });
      }
    });

    return forecastList;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return null;
  }
}

/**
 * Get crop-specific weather recommendations
 */
export function getCropWeatherAdvice(
  crop: string,
  weatherData: WeatherData
): string {
  const cropAdvice: Record<string, (w: WeatherData) => string> = {
    wheat: (w) => {
      if (w.temperature < 10) return '🌾 Good - wheat needs cool weather for grain filling';
      if (w.temperature > 30) return '⚠️ Risk - high temps may reduce yield. Ensure irrigation.';
      return '✅ Wheat growing well in current weather';
    },
    rice: (w) => {
      if (w.humidity > 80 && w.rainfall) return '⚠️ Risk - fungal disease likely. Apply copper fungicide.';
      if (w.temperature > 25 && w.humidity > 60) return '✅ Ideal rice growing weather';
      return '🌾 Monitor rice crop closely';
    },
    sugarcane: (w) => {
      if (w.temperature > 25 && w.humidity > 50) return '✅ Sugarcane thriving in warm, humid weather';
      if (w.temperature < 15) return '🥶 Cold - sugarcane growth slows. Maintain irrigation.';
      return '🌾 Sugarcane growing steadily';
    },
    cotton: (w) => {
      if (w.humidity > 85 && w.rainfall) return '⚠️ Fungal disease risk in cotton. Monitor closely.';
      if (w.temperature > 25 && w.humidity > 40) return '✅ Perfect cotton growing conditions';
      return '🌾 Cotton growing normally';
    },
    potato: (w) => {
      if (w.temperature > 25) return '⚠️ High heat - potato quality may suffer. Irrigation important.';
      if (w.temperature > 10 && w.temperature < 20) return '✅ Ideal potato weather';
      return '🥔 Monitor potato crop for pests';
    },
    onion: (w) => {
      if (w.humidity > 85 && w.rainfall) return '⚠️ Fungal disease risk - ensure proper drainage';
      if (w.temperature > 25) return '⚠️ Excessive heat - increase irrigation';
      return '✅ Onion growing well';
    },
    tomato: (w) => {
      if (w.temperature > 30 && w.humidity < 50) return '⚠️ Hot & dry - flower drop risk. Water regularly.';
      if (w.temperature > 20 && w.humidity > 50) return '✅ Tomato growing excellently';
      return '🍅 Tomato growing steadily';
    },
    chilly: (w) => {
      if (w.temperature > 25 && w.humidity > 60) return '✅ Ideal chilly growing conditions';
      if (w.temperature < 15) return '🥶 Cold slows chilly growth. Provide warmth if possible.';
      return '🌶️ Chilly crop normal';
    },
  };

  const fn = cropAdvice[crop.toLowerCase().trim()];
  return fn ? fn(weatherData) : `🌾 Monitor ${crop} closely in current weather conditions`;
}

/**
 * Cache weather data locally for offline access
 */
export function cacheWeatherData(weather: WeatherData): void {
  try {
    localStorage.setItem('cachedWeather', JSON.stringify({
      ...weather,
      cachedAt: new Date().toISOString(),
    }));
  } catch (error) {
    console.warn('Could not cache weather data:', error);
  }
}

export function getCachedWeatherData(): WeatherData | null {
  try {
    const cached = localStorage.getItem('cachedWeather');
    if (cached) {
      const data = JSON.parse(cached);
      // Cache valid for 6 hours
      const cacheAge = Date.now() - new Date(data.cachedAt).getTime();
      if (cacheAge < 6 * 60 * 60 * 1000) {
        return data;
      }
    }
  } catch (error) {
    console.warn('Could not retrieve cached weather:', error);
  }
  return null;
}
