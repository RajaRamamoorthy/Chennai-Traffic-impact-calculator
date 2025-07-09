import { apiRequest } from "./queryClient";
import { CalculatorForm, CalculationResult, VehicleType, LocationInfo, RouteInfo } from "../types/calculator";

export const api = {
  // Health check
  healthCheck: async () => {
    const res = await apiRequest("GET", "/api/health");
    return res.json();
  },

  // Vehicle types
  getVehicleTypes: async (category?: string): Promise<VehicleType[]> => {
    const url = category ? `/api/vehicle-types?category=${category}` : "/api/vehicle-types";
    const res = await apiRequest("GET", url);
    return res.json();
  },

  // Geocoding
  geocodeAddress: async (address: string): Promise<LocationInfo> => {
    const res = await apiRequest("POST", "/api/geocode", { address });
    return res.json();
  },

  // Route information
  getRouteInfo: async (origin: string, destination: string): Promise<RouteInfo> => {
    const res = await apiRequest("POST", "/api/route-info", { origin, destination });
    return res.json();
  },

  // Place autocomplete
  getPlaceAutocomplete: async (input: string): Promise<any[]> => {
    const res = await apiRequest("GET", `/api/places/autocomplete?input=${encodeURIComponent(input)}`);
    return res.json();
  },

  // Calculate impact
  calculateImpact: async (formData: CalculatorForm & { distanceKm: number }): Promise<CalculationResult> => {
    const res = await apiRequest("POST", "/api/calculate-impact", formData, {
      headers: {
        'x-session-id': getSessionId()
      }
    });
    return res.json();
  },

  // Submit feedback
  submitFeedback: async (feedback: { calculationId?: number; rating?: number; helpful?: boolean; comments?: string }) => {
    const res = await apiRequest("POST", "/api/feedback", feedback);
    return res.json();
  },

  // Get user calculations
  getUserCalculations: async () => {
    const res = await apiRequest("GET", "/api/calculations", undefined, {
      headers: {
        'x-session-id': getSessionId()
      }
    });
    return res.json();
  }
};

function getSessionId(): string {
  let sessionId = localStorage.getItem('chennai-traffic-session-id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chennai-traffic-session-id', sessionId);
  }
  return sessionId;
}