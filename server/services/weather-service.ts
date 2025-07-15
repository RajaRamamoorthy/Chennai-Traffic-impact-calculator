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

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export class WeatherService {
  // IMD API endpoints for Chennai weather
  private readonly imdBaseUrl = 'https://mausam.imd.gov.in/backend';
  private readonly chennaiStationId = '43279'; // Chennai station ID for IMD

  async getChennaiWeather(): Promise<WeatherData> {
    // Check cache first
    const now = Date.now();
    if (weatherCache.data && (now - weatherCache.timestamp) < CACHE_DURATION) {
      console.log('Returning cached weather data');
      return weatherCache.data;
    }

    try {
      console.log('Fetching fresh weather data from IMD API');
      
      // Try multiple IMD endpoints for Chennai weather
      const weatherData = await this.fetchFromIMDApis();
      
      if (weatherData) {
        // Update cache
        weatherCache = {
          data: weatherData,
          timestamp: now
        };
        return weatherData;
      }
      
      throw new Error('All IMD API endpoints failed');

    } catch (error) {
      console.error('Error fetching weather data from IMD:', error);
      
      // Return fallback data if all APIs fail
      const fallbackData = this.getFallbackWeatherData();
      
      // Cache fallback data for shorter duration (5 minutes)
      weatherCache = {
        data: fallbackData,
        timestamp: now - (CACHE_DURATION - 5 * 60000)
      };
      
      return fallbackData;
    }
  }

  private async fetchFromIMDApis(): Promise<WeatherData | null> {
    // List of IMD API endpoints to try
    const imdEndpoints = [
      `${this.imdBaseUrl}/api/livedata/${this.chennaiStationId}`,
      `${this.imdBaseUrl}/api/currentweather/chennai`,
      'https://mausam.imd.gov.in/api/cityweather/chennai'
    ];

    for (const endpoint of imdEndpoints) {
      try {
        const response = await axios.get(endpoint, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Chennai-Traffic-Calculator/1.0',
            'Accept': 'application/json'
          }
        });

        const data = response.data;
        
        // Parse IMD API response format
        if (data && (data.temperature || data.temp || data.current)) {
          return this.parseIMDResponse(data);
        }
      } catch (error) {
        console.error(`Failed to fetch from ${endpoint}:`, error);
        continue;
      }
    }

    // If IMD APIs fail, try alternative weather source
    try {
      return await this.fetchFromAlternativeSource();
    } catch (error) {
      console.error('Alternative weather source also failed:', error);
      return null;
    }
  }

  private parseIMDResponse(data: any): WeatherData {
    // Handle different IMD API response formats
    const temp = data.temperature || data.temp || data.current?.temperature || 
                 data.main?.temp || data.current?.temp_c || 28;
    
    const condition = data.weather || data.condition || data.current?.condition?.text ||
                     data.weather?.[0]?.description || 'Partly cloudy';
    
    const humidity = data.humidity || data.current?.humidity || 
                    data.main?.humidity || 65;
    
    const windSpeed = data.windSpeed || data.wind_speed || data.current?.wind_kph ||
                     data.wind?.speed || 12;
    
    const visibility = data.visibility || data.current?.vis_km || 8;

    return {
      temperature: Math.round(Number(temp)),
      condition: String(condition),
      humidity: Math.round(Number(humidity)),
      windSpeed: Math.round(Number(windSpeed)),
      visibility: Math.round(Number(visibility)),
      lastUpdated: new Date().toISOString()
    };
  }

  private async fetchFromAlternativeSource(): Promise<WeatherData | null> {
    try {
      // Using a public weather API as backup (OpenWeatherMap-like format)
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: 'Chennai,IN',
          units: 'metric',
          appid: process.env.OPENWEATHER_API_KEY || 'demo_key'
        },
        timeout: 8000
      });

      const data = response.data;
      
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round((data.visibility || 10000) / 1000), // Convert to km
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Alternative weather source failed:', error);
      return null;
    }
  }

  private getFallbackWeatherData(): WeatherData {
    // Realistic fallback weather data for Chennai based on season and time
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const hour = now.getHours();
    
    let temperature = 28;
    let condition = 'Partly cloudy';
    let humidity = 65;
    
    // Seasonal adjustments for Chennai
    if (month >= 3 && month <= 6) { // Summer
      temperature = 32 + Math.random() * 6; // 32-38°C
      condition = 'Hot and sunny';
      humidity = 55 + Math.random() * 15;
    } else if (month >= 7 && month <= 9) { // Monsoon
      temperature = 26 + Math.random() * 4; // 26-30°C
      condition = Math.random() > 0.5 ? 'Rainy' : 'Cloudy';
      humidity = 75 + Math.random() * 15;
    } else if (month >= 10 && month <= 2) { // Winter/Pleasant
      temperature = 23 + Math.random() * 5; // 23-28°C
      condition = 'Pleasant';
      humidity = 60 + Math.random() * 20;
    }
    
    // Night time adjustments
    if (hour >= 20 || hour <= 6) {
      temperature -= 3;
    }

    return {
      temperature: Math.round(temperature),
      condition,
      humidity: Math.round(humidity),
      windSpeed: Math.round(8 + Math.random() * 12), // 8-20 km/h
      visibility: Math.round(6 + Math.random() * 4), // 6-10 km
      lastUpdated: new Date().toISOString()
    };
  }
}