export interface RouteInfo {
  distanceKm: number;
  durationMinutes: number;
  polyline: string;
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

export interface LocationInfo {
  formattedAddress: string;
  lat: number;
  lng: number;
  placeId: string;
}

export class RoutingService {
  private static readonly GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY;

  static async geocodeAddress(address: string): Promise<LocationInfo | null> {
    if (!this.GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const encodedAddress = encodeURIComponent(`${address}, Chennai, Tamil Nadu, India`);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.GOOGLE_MAPS_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        return {
          formattedAddress: result.formatted_address,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          placeId: result.place_id
        };
      }

      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  static async getRouteInfo(origin: string, destination: string): Promise<RouteInfo | null> {
    if (!this.GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const originEncoded = encodeURIComponent(origin);
      const destinationEncoded = encodeURIComponent(destination);
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originEncoded}&destination=${destinationEncoded}&region=in&key=${this.GOOGLE_MAPS_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];

        return {
          distanceKm: leg.distance.value / 1000, // Convert meters to km
          durationMinutes: leg.duration.value / 60, // Convert seconds to minutes
          polyline: route.overview_polyline.points,
          bounds: route.bounds
        };
      }

      return null;
    } catch (error) {
      console.error('Routing error:', error);
      return null;
    }
  }

  static async getPlaceAutocomplete(input: string): Promise<any[]> {
    if (!this.GOOGLE_MAPS_API_KEY) {
      throw new Error('Google Maps API key not configured');
    }

    try {
      const encodedInput = encodeURIComponent(input);
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedInput}&location=13.0827,80.2707&radius=50000&components=country:in&key=${this.GOOGLE_MAPS_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.predictions;
      }

      return [];
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  }
}
