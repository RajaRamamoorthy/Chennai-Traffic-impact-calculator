export interface TransportMode {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiresVehicleDetails: boolean;
}

export interface VehicleType {
  id: number;
  name: string;
  category: string;
  emissionFactor: string;
  fuelCostPerKm: string;
  avgSpeedKmh: number;
  baseImpactScore: number;
}

export interface CalculatorForm {
  transportMode: string;
  vehicleTypeId?: number;
  occupancy: number;
  origin: string;
  destination: string;
  travelPattern: string;
}

export interface CalculationResult {
  score: number;
  confidence: {
    level: 'A' | 'B' | 'C';
    description: string;
  };
  breakdown: {
    vehicleImpact: number;
    congestionFactor: number;
    timingMultiplier: number;
    frequencyMultiplier: number;
    occupancy: number;
    rawScore: number;
  };
  equivalentCommuters: number;
  monthlySavings: number;
  monthlyEmissions: number;
  monthlyCost: number;
  monthlyTimeHours: number;
  alternatives: Alternative[];
  methodology: string;
  disclaimer?: string;
  calculationId?: number;
  transportMode?: string;
}

export interface Alternative {
  type: string;
  title: string;
  description: string;
  impactReduction: number;
  timeDelta: string;
  costSavings: number;
  newScore: number;
}

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

export interface ResultsDisplayEventParams {
  impact_score: number;
  score_range: 'excellent' | 'good' | 'moderate' | 'high';
  monthly_cost: number;
  transport_mode: string;
  has_contextual_nuggets: boolean;
  alternatives_count: number;
}
