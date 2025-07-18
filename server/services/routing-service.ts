import { Client } from '@googlemaps/google-maps-services-js';

export interface LocationInfo {
  formattedAddress: string;
  lat: number;
  lng: number;
  placeId: string;
}

export interface RouteInfo {
  distanceKm: number;
  durationMinutes: number;
  polyline: string;
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

export class RoutingService {
  private static readonly GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
  private static client = new Client({});

  static async geocodeAddress(address: string): Promise<LocationInfo | null> {
    if (!this.GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const response = await this.client.geocode({
        params: {
          address: `${address}, Chennai, Tamil Nadu, India`,
          key: this.GOOGLE_MAPS_API_KEY,
          language: 'en'
        }
      });

      if (response.data.results.length === 0) {
        return null;
      }

      const result = response.data.results[0];
      const location = result.geometry.location;

      return {
        formattedAddress: result.formatted_address,
        lat: location.lat,
        lng: location.lng,
        placeId: result.place_id
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to geocode address');
    }
  }

  static async getRouteInfo(origin: string, destination: string): Promise<RouteInfo | null> {
    try {
      // Check if origin and destination are the same
      if (origin.toLowerCase().trim() === destination.toLowerCase().trim()) {
        console.log("Origin and destination are the same");
        return null;
      }

      const response = await this.client.directions({
        params: {
          origin,
          destination,
          key: this.GOOGLE_MAPS_API_KEY,
          mode: 'driving' as any,
          units: 'metric' as any,
          language: 'en' as any,
          departure_time: 'now' as any, // For real-time traffic
          traffic_model: 'best_guess' as any
        }
      });

      if (response.data.routes.length === 0) {
        return null;
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];

      const distanceKm = Math.round(leg.distance.value / 1000 * 100) / 100;

      // Ensure minimum distance of 0.1 km to avoid validation errors
      const finalDistanceKm = Math.max(distanceKm, 0.1);

      return {
        distanceKm: finalDistanceKm,
        durationMinutes: Math.round(leg.duration.value / 60),
        polyline: route.overview_polyline.points,
        bounds: {
          northeast: {
            lat: route.bounds.northeast.lat,
            lng: route.bounds.northeast.lng
          },
          southwest: {
            lat: route.bounds.southwest.lat,
            lng: route.bounds.southwest.lng
          }
        }
      };

    } catch (error) {
      console.error('Google Directions error:', error);
      throw new Error('Failed to get route information');
    }
  }

  static async getPlaceAutocomplete(input: string): Promise<any[]> {
    if (!this.GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const response = await this.client.placeAutocomplete({
        params: {
          input: `${input} Chennai`, // Append Chennai to search query
          key: this.GOOGLE_MAPS_API_KEY,
          components: ['country:in'], // Restrict to India
          location: '13.0827,80.2707', // Chennai coordinates
          radius: 30000, // Reduced to 30km radius around Chennai
          language: 'en',
          types: 'establishment|geocode' as any
        }
      });

      // Filter results to only include Chennai locations
      const filteredPredictions = response.data.predictions.filter(prediction => {
        const description = prediction.description.toLowerCase();
        return description.includes('chennai') || 
               description.includes('tamil nadu') ||
               description.includes('madras'); // Historical name
      });

      return filteredPredictions.map(prediction => ({
        description: prediction.description,
        placeId: prediction.place_id,
        structured_formatting: prediction.structured_formatting
      }));
    } catch (error) {
      console.error('Google Places Autocomplete error:', error);

      // Fallback to some Chennai locations if API fails
      return this.getChennaiLocationFallback(input);
    }
  }

  private static getChennaiLocationFallback(input: string): any[] {
    const commonLocations = [
      // Major Areas
      { description: 'T. Nagar, Chennai, Tamil Nadu, India', placeId: 'tnagar_fallback' },
      { description: 'Anna Nagar, Chennai, Tamil Nadu, India', placeId: 'annanagar_fallback' },
      { description: 'Adyar, Chennai, Tamil Nadu, India', placeId: 'adyar_fallback' },
      { description: 'Velachery, Chennai, Tamil Nadu, India', placeId: 'velachery_fallback' },
      { description: 'Tambaram, Chennai, Tamil Nadu, India', placeId: 'tambaram_fallback' },
      { description: 'Chrompet, Chennai, Tamil Nadu, India', placeId: 'chrompet_fallback' },
      { description: 'Porur, Chennai, Tamil Nadu, India', placeId: 'porur_fallback' },
      { description: 'Sholinganallur, Chennai, Tamil Nadu, India', placeId: 'sholinganallur_fallback' },
      
      // IT Corridors
      { description: 'OMR IT Corridor, Chennai, Tamil Nadu, India', placeId: 'omr_fallback' },
      { description: 'Rajiv Gandhi Salai (OMR), Chennai, Tamil Nadu, India', placeId: 'omr_main_fallback' },
      { description: 'GST Road IT Corridor, Chennai, Tamil Nadu, India', placeId: 'gst_fallback' },
      
      // Transport Hubs
      { description: 'Chennai Central Railway Station, Chennai, Tamil Nadu, India', placeId: 'central_fallback' },
      { description: 'Chennai Egmore Railway Station, Chennai, Tamil Nadu, India', placeId: 'egmore_fallback' },
      { description: 'Chennai Airport, Chennai, Tamil Nadu, India', placeId: 'airport_fallback' },
      { description: 'CMBT Bus Terminus, Chennai, Tamil Nadu, India', placeId: 'cmbt_fallback' },
      
      // Popular Localities
      { description: 'Mylapore, Chennai, Tamil Nadu, India', placeId: 'mylapore_fallback' },
      { description: 'Nungambakkam, Chennai, Tamil Nadu, India', placeId: 'nungambakkam_fallback' },
      { description: 'Guindy, Chennai, Tamil Nadu, India', placeId: 'guindy_fallback' },
      { description: 'Alwarpet, Chennai, Tamil Nadu, India', placeId: 'alwarpet_fallback' },
      { description: 'Kilpauk, Chennai, Tamil Nadu, India', placeId: 'kilpauk_fallback' },
      { description: 'Royapettah, Chennai, Tamil Nadu, India', placeId: 'royapettah_fallback' }
    ];

    return commonLocations.filter(location => 
      location.description.toLowerCase().includes(input.toLowerCase())
    );
  }
}

export const routingService = new RoutingService();