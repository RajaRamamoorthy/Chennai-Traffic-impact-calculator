import axios from 'axios';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  lastUpdated: string;
}

// In-memory cache for weather data
let weatherCache: { data: WeatherData | null; timestamp: number } = {
  data: null,
  timestamp: 0
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes cache for weather data

export class WeatherService {
  private readonly openWeatherBaseUrl = 'https://api.openweathermap.org/data/2.5';
  private lastApiCall = 0;
  private readonly rateLimitDelay = 60000; // 1 minute between API calls

  async getChennaiWeather(): Promise<WeatherData> {
    // Check cache first
    const now = Date.now();
    if (weatherCache.data && (now - weatherCache.timestamp) < CACHE_DURATION) {
      console.log('🌤️ Returning cached Chennai weather data');
      return weatherCache.data;
    }

    // Rate limiting - ensure minimum delay between API calls
    if (now - this.lastApiCall < this.rateLimitDelay) {
      console.log('⏰ Rate limiting: using cached weather data');
      if (weatherCache.data) {
        return weatherCache.data;
      }
      // If no cached data, return fallback
      return this.getChennaiRealisticFallback();
    }

    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;

      if (!apiKey) {
        console.warn('⚠️ OpenWeatherMap API key not found, using fallback data');
        return this.getChennaiRealisticFallback();
      }

      console.log('🌐 Fetching fresh Chennai weather from OpenWeatherMap');

      const response = await axios.get(`${this.openWeatherBaseUrl}/weather`, {
        params: {
          q: 'Chennai,IN',
          units: 'metric',
          appid: apiKey
        },
        timeout: 8000,
        headers: {
          'User-Agent': 'Chennai-Traffic-Calculator/1.0'
        }
      });

      this.lastApiCall = now;
      const weatherData = this.parseOpenWeatherResponse(response.data);

      // Update cache
      weatherCache = {
        data: weatherData,
        timestamp: now
      };

      console.log('✅ Successfully fetched Chennai weather data');
      return weatherData;

    } catch (error) {
      console.error('❌ Error fetching Chennai weather:', error);

      // Return fallback data and cache it briefly
      const fallbackData = this.getChennaiRealisticFallback();

      // Cache fallback data for shorter duration (5 minutes)
      weatherCache = {
        data: fallbackData,
        timestamp: now - (CACHE_DURATION - 5 * 60000)
      };

      return fallbackData;
    }
  }

  private parseOpenWeatherResponse(data: any): WeatherData {
    return {
      temperature: Math.round(data.main.temp),
      condition: this.translateCondition(data.weather[0].description),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round((data.visibility || 10000) / 1000), // Convert to km
      lastUpdated: new Date().toISOString()
    };
  }

  private translateCondition(description: string): string {
    const weatherMap: { [key: string]: string } = {
      'clear sky': 'Clear',
      'few clouds': 'Partly cloudy',
      'scattered clouds': 'Cloudy',
      'broken clouds': 'Cloudy',
      'overcast clouds': 'Overcast',
      'light rain': 'Light rain',
      'moderate rain': 'Rainy',
      'heavy intensity rain': 'Heavy rain',
      'thunderstorm': 'Thunderstorm',
      'mist': 'Misty',
      'haze': 'Hazy'
    };

    return weatherMap[description.toLowerCase()] || 
           description.charAt(0).toUpperCase() + description.slice(1);
  }

  private getChennaiRealisticFallback(): WeatherData {
    // Realistic Chennai weather based on current season and time
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const hour = now.getHours();

    let temperature = 28;
    let condition = 'Partly cloudy';
    let humidity = 65;

    // Chennai seasonal weather patterns
    if (month >= 3 && month <= 6) { // Summer (March-June)
      temperature = 32 + Math.random() * 6; // 32-38°C
      condition = Math.random() > 0.7 ? 'Hot and sunny' : 'Hazy';
      humidity = 55 + Math.random() * 15;
    } else if (month >= 7 && month <= 9) { // Southwest Monsoon (July-September)
      temperature = 26 + Math.random() * 4; // 26-30°C
      condition = Math.random() > 0.4 ? 'Rainy' : 'Cloudy';
      humidity = 75 + Math.random() * 15;
    } else if (month >= 10 && month <= 12) { // Northeast Monsoon (October-December)
      temperature = 24 + Math.random() * 5; // 24-29°C
      condition = Math.random() > 0.6 ? 'Light rain' : 'Pleasant';
      humidity = 70 + Math.random() * 15;
    } else { // Winter (January-February)
      temperature = 22 + Math.random() * 6; // 22-28°C
      condition = 'Pleasant';
      humidity = 60 + Math.random() * 20;
    }

    // Night time adjustments for Chennai
    if (hour >= 20 || hour <= 6) {
      temperature -= 2;
    }

    return {
      temperature: Math.round(temperature),
      condition,
      humidity: Math.round(humidity),
      windSpeed: Math.round(8 + Math.random() * 12), // 8-20 km/h typical for Chennai
      visibility: Math.round(6 + Math.random() * 4), // 6-10 km
      lastUpdated: new Date().toISOString()
    };
  }
}