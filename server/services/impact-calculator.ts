import { VehicleType, RouteCongestion } from "@shared/schema";

export interface CalculationInput {
  transportMode: string;
  vehicleTypeId?: number;
  occupancy?: number;
  distanceKm: number;
  timing: string;
  frequency: string;
  originCongestion?: RouteCongestion[];
  destinationCongestion?: RouteCongestion[];
  vehicleType?: VehicleType;
}

export interface CalculationResult {
  score: number;
  confidence: {
    level: 'A' | 'B' | 'C';
    description: string;
  };
  breakdown: {
    vehicleImpact: number;
    routeCongestion: number;
    timingPenalty: number;
    occupancyBonus: number;
  };
  equivalentCommuters: number;
  monthlySavings: number;
  monthlyEmissions: number;
  monthlyCost: number;
  monthlyTimeHours: number;
  alternatives: Alternative[];
  methodology: string;
  disclaimer?: string;
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

export class ImpactCalculator {
  
  static calculateImpact(input: CalculationInput): CalculationResult {
    const {
      transportMode,
      vehicleType,
      occupancy = 1,
      distanceKm,
      timing,
      frequency,
      originCongestion = [],
      destinationCongestion = []
    } = input;

    // Base impact calculation
    let baseScore = vehicleType?.baseImpactScore || 0;
    
    // Vehicle impact (30% of total score)
    const vehicleImpact = this.calculateVehicleImpact(transportMode, vehicleType, occupancy);
    
    // Route congestion (25% of total score)
    const routeCongestion = this.calculateRouteCongestion(originCongestion, destinationCongestion, timing);
    
    // Timing penalty (20% of total score)
    const timingPenalty = this.calculateTimingPenalty(timing);
    
    // Occupancy bonus (15% of total score)
    const occupancyBonus = this.calculateOccupancyBonus(occupancy, transportMode);
    
    // Frequency multiplier (10% of total score)
    const frequencyMultiplier = this.getFrequencyMultiplier(frequency);

    // Calculate final score (0-100)
    const rawScore = (vehicleImpact * 0.3) + (routeCongestion * 0.25) + (timingPenalty * 0.2) + (occupancyBonus * 0.15);
    const finalScore = Math.min(100, Math.max(0, Math.round(rawScore * frequencyMultiplier)));

    // Calculate monthly metrics
    const monthlyMetrics = this.calculateMonthlyMetrics(
      vehicleType,
      distanceKm,
      frequency,
      timing,
      occupancy
    );

    // Generate alternatives
    const alternatives = this.generateAlternatives(input, finalScore);

    // Determine confidence level
    const confidence = this.calculateConfidence(input);

    return {
      score: finalScore,
      confidence,
      breakdown: {
        vehicleImpact: Math.round(vehicleImpact),
        routeCongestion: Math.round(routeCongestion),
        timingPenalty: Math.round(timingPenalty),
        occupancyBonus: Math.round(occupancyBonus)
      },
      equivalentCommuters: Math.round(finalScore / 20), // Rough estimate
      monthlySavings: 0, // Will be calculated relative to alternatives
      monthlyEmissions: monthlyMetrics.emissions,
      monthlyCost: monthlyMetrics.cost,
      monthlyTimeHours: monthlyMetrics.timeHours,
      alternatives,
      methodology: "Score calculated based on vehicle emissions, route congestion, timing patterns, and occupancy factors specific to Chennai traffic conditions.",
      disclaimer: "Estimates based on Chennai traffic data and may vary with actual conditions."
    };
  }

  private static calculateVehicleImpact(mode: string, vehicleType?: VehicleType, occupancy: number = 1): number {
    if (!vehicleType) {
      // Default scores for modes without specific vehicle types
      const modeScores = {
        walking: 5,
        bus: 15,
        metro: 10,
        auto: 45
      };
      return modeScores[mode as keyof typeof modeScores] || 50;
    }

    let baseImpact = vehicleType.baseImpactScore;
    
    // Adjust for occupancy (more people = lower impact per person)
    if (occupancy > 1) {
      baseImpact = baseImpact * (1 - ((occupancy - 1) * 0.15));
    }

    return Math.max(5, baseImpact);
  }

  private static calculateRouteCongestion(
    originCongestion: RouteCongestion[],
    destinationCongestion: RouteCongestion[],
    timing: string
  ): number {
    const avgOriginMultiplier = this.getAvgCongestionMultiplier(originCongestion, timing);
    const avgDestMultiplier = this.getAvgCongestionMultiplier(destinationCongestion, timing);
    
    // Average congestion between origin and destination
    const avgCongestion = (avgOriginMultiplier + avgDestMultiplier) / 2;
    
    // Convert multiplier to impact score (higher congestion = higher impact)
    return Math.min(100, (avgCongestion - 0.8) * 50);
  }

  private static getAvgCongestionMultiplier(congestionData: RouteCongestion[], timing: string): number {
    if (congestionData.length === 0) return 1.2; // Default moderate congestion

    const totalMultiplier = congestionData.reduce((sum, area) => {
      switch (timing) {
        case 'morning-peak':
          return sum + parseFloat(area.morningPeakMultiplier || '1.5');
        case 'evening-peak':
          return sum + parseFloat(area.eveningPeakMultiplier || '1.6');
        case 'off-peak':
          return sum + parseFloat(area.offPeakMultiplier || '1.0');
        case 'night':
          return sum + parseFloat(area.nightMultiplier || '0.8');
        default:
          return sum + 1.2;
      }
    }, 0);

    return totalMultiplier / congestionData.length;
  }

  private static calculateTimingPenalty(timing: string): number {
    const timingPenalties = {
      'morning-peak': 25,
      'evening-peak': 30,
      'off-peak': 10,
      'night': 5
    };
    return timingPenalties[timing as keyof typeof timingPenalties] || 15;
  }

  private static calculateOccupancyBonus(occupancy: number, mode: string): number {
    if (mode === 'walking' || mode === 'bus' || mode === 'metro') return 0;
    
    // Bonus for carpooling
    const bonusPerPerson = 5;
    return Math.max(0, 15 - ((occupancy - 1) * bonusPerPerson));
  }

  private static getFrequencyMultiplier(frequency: string): number {
    const multipliers = {
      daily: 1.0,
      frequent: 0.8,
      occasional: 0.6,
      rare: 0.4
    };
    return multipliers[frequency as keyof typeof multipliers] || 1.0;
  }

  private static calculateMonthlyMetrics(
    vehicleType: VehicleType | undefined,
    distanceKm: number,
    frequency: string,
    timing: string,
    occupancy: number
  ) {
    const tripsPerMonth = this.getTripsPerMonth(frequency);
    const monthlyDistance = distanceKm * tripsPerMonth * 2; // Round trip

    let emissions = 0;
    let cost = 0;
    let timeHours = 0;

    if (vehicleType) {
      emissions = monthlyDistance * parseFloat(vehicleType.emissionFactor || '0') / occupancy;
      cost = monthlyDistance * parseFloat(vehicleType.fuelCostPerKm || '0') / occupancy;
    }

    // Calculate time based on average speed and congestion
    const congestionMultiplier = this.getTimingCongestionMultiplier(timing);
    const avgSpeed = vehicleType?.avgSpeedKmh || 25;
    timeHours = (monthlyDistance / avgSpeed) * congestionMultiplier;

    return {
      emissions: Math.round(emissions * 100) / 100,
      cost: Math.round(cost),
      timeHours: Math.round(timeHours * 10) / 10
    };
  }

  private static getTripsPerMonth(frequency: string): number {
    const trips = {
      daily: 22, // Working days
      frequent: 15,
      occasional: 8,
      rare: 4
    };
    return trips[frequency as keyof typeof trips] || 22;
  }

  private static getTimingCongestionMultiplier(timing: string): number {
    const multipliers = {
      'morning-peak': 1.8,
      'evening-peak': 2.0,
      'off-peak': 1.0,
      'night': 0.7
    };
    return multipliers[timing as keyof typeof multipliers] || 1.2;
  }

  private static generateAlternatives(input: CalculationInput, currentScore: number): Alternative[] {
    const alternatives: Alternative[] = [];

    // Metro alternative
    if (input.transportMode !== 'metro') {
      const metroScore = Math.max(10, currentScore * 0.3);
      alternatives.push({
        type: 'metro',
        title: 'Switch to Chennai Metro',
        description: 'Reduce impact significantly with public transport',
        impactReduction: Math.round(((currentScore - metroScore) / currentScore) * 100),
        timeDelta: '+15 min',
        costSavings: Math.round(input.distanceKm * 25), // Rough savings
        newScore: Math.round(metroScore)
      });
    }

    // Carpooling alternative (for car/bike users)
    if ((input.transportMode === 'car' || input.transportMode === 'bike') && (input.occupancy || 1) === 1) {
      const carpoolScore = Math.max(15, currentScore * 0.55);
      alternatives.push({
        type: 'carpool',
        title: 'Carpool with 2+ people',
        description: 'Share your ride to reduce per-person impact',
        impactReduction: Math.round(((currentScore - carpoolScore) / currentScore) * 100),
        timeDelta: 'Same time',
        costSavings: Math.round(input.distanceKm * 15),
        newScore: Math.round(carpoolScore)
      });
    }

    // Off-peak timing alternative
    if (input.timing === 'morning-peak' || input.timing === 'evening-peak') {
      const offPeakScore = Math.max(5, currentScore * 0.75);
      alternatives.push({
        type: 'timing',
        title: 'Travel off-peak hours',
        description: 'Avoid rush hours to reduce congestion impact',
        impactReduction: Math.round(((currentScore - offPeakScore) / currentScore) * 100),
        timeDelta: '-20 min',
        costSavings: Math.round(input.distanceKm * 8),
        newScore: Math.round(offPeakScore)
      });
    }

    return alternatives.slice(0, 3); // Return top 3 alternatives
  }

  private static calculateConfidence(input: CalculationInput): { level: 'A' | 'B' | 'C'; description: string } {
    let confidenceScore = 0;

    // Higher confidence for known vehicle types
    if (input.vehicleType) confidenceScore += 30;
    
    // Higher confidence for routes with congestion data
    if (input.originCongestion && input.originCongestion.length > 0) confidenceScore += 25;
    if (input.destinationCongestion && input.destinationCongestion.length > 0) confidenceScore += 25;
    
    // Higher confidence for distance data
    if (input.distanceKm > 0) confidenceScore += 20;

    if (confidenceScore >= 80) {
      return { level: 'A', description: 'High confidence - comprehensive data available' };
    } else if (confidenceScore >= 60) {
      return { level: 'B', description: 'Good confidence - some estimates used' };
    } else {
      return { level: 'C', description: 'Moderate confidence - limited data available' };
    }
  }
}
