import { db } from '../db';
import { vehicleTypes, routeCongestion, calculations, users } from '@shared/schema';
import { eq } from 'drizzle-orm';

export interface CalculationInput {
  transportMode: string;
  vehicleTypeId?: number;
  occupancy?: number;
  distanceKm: number;
  travelPattern: string;
  sessionId: string;
  origin: string;
  destination: string;
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
  calculationId?: number;
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
  async calculate(input: CalculationInput): Promise<CalculationResult> {
    try {
      // Convert travel pattern to timing and frequency
      const { timing, frequency } = this.parseTravelPattern(input.travelPattern);
      
      // Handle sustainable transport modes
      if (input.transportMode !== 'car' && input.transportMode !== 'bike') {
        return await this.calculateSustainableTransport(input);
      }

      // Get vehicle data
      const vehicle = await this.getVehicleType(input.vehicleTypeId!);
      
      // Calculate impact components
      const breakdown = this.calculateBreakdown(
        vehicle,
        input.distanceKm,
        input.occupancy || 1,
        timing,
        frequency
      );

      // Generate final score (0-100)
      const score = this.generateScore(breakdown);
      
      // Calculate monthly metrics
      const monthlyMetrics = this.calculateMonthlyMetrics(
        vehicle,
        input.distanceKm,
        input.occupancy || 1,
        frequency
      );

      // Generate alternatives
      const alternatives = this.generateAlternatives(input, score);
      
      // Save calculation
      const calculationId = await this.saveCalculation(input, {
        score,
        breakdown,
        monthlyMetrics,
        alternatives
      });

      return {
        score: Math.round(score),
        confidence: this.getConfidenceLevel(input),
        breakdown,
        equivalentCommuters: Math.round(2000 + (score * 50)),
        monthlySavings: Math.max(...alternatives.map(alt => alt.costSavings)),
        monthlyEmissions: monthlyMetrics.emissions,
        monthlyCost: monthlyMetrics.cost,
        monthlyTimeHours: monthlyMetrics.timeHours,
        alternatives,
        methodology: `Based on vehicle emissions (${vehicle.emissionFactor} kg CO2/km), route congestion analysis, timing factors, and Chennai traffic patterns.`,
        calculationId,
        transportMode: input.transportMode
      };

    } catch (error) {
      console.error('Impact calculation failed:', error);
      throw new Error('Unable to calculate traffic impact. Please try again.');
    }
  }

  private async calculateSustainableTransport(input: CalculationInput): Promise<CalculationResult> {
    const { timing, frequency } = this.parseTravelPattern(input.travelPattern);
    
    const baseScores = {
      metro: 15,
      bus: 20,
      auto: 35,
      walking: 5,
      public: 25
    };

    const score = baseScores[input.transportMode as keyof typeof baseScores] || 25;
    
    const breakdown = {
      vehicleImpact: 5,
      routeCongestion: 10,
      timingPenalty: 5,
      occupancyBonus: 5
    };

    const monthlyTrips = this.getMonthlyTrips(frequency);
    const monthlyMetrics = {
      emissions: input.transportMode === 'walking' ? 0 : Math.round(input.distanceKm * 0.05 * monthlyTrips), // kg CO2
      cost: this.getPublicTransportCost(input.transportMode, input.distanceKm),
      timeHours: Math.round((input.distanceKm / 20) * monthlyTrips * 2) // Assume 20 kmh average speed
    };

    const alternatives = this.generateSustainableAlternatives(input);
    
    const calculationId = await this.saveCalculation(input, {
      score,
      breakdown,
      monthlyMetrics,
      alternatives
    });

    return {
      score,
      confidence: { level: 'A', description: 'High confidence for sustainable transport' },
      breakdown,
      equivalentCommuters: Math.round(1000 + (score * 20)),
      monthlySavings: 800,
      monthlyEmissions: monthlyMetrics.emissions,
      monthlyCost: monthlyMetrics.cost,
      monthlyTimeHours: monthlyMetrics.timeHours,
      alternatives,
      methodology: 'Sustainable transport modes have minimal traffic impact',
      calculationId,
      transportMode: input.transportMode
    };
  }

  private async getVehicleType(vehicleTypeId: number) {
    const vehicle = await db.select().from(vehicleTypes).where(eq(vehicleTypes.id, vehicleTypeId)).limit(1);
    
    if (!vehicle.length) {
      throw new Error(`Vehicle type not found: ${vehicleTypeId}`);
    }
    
    return vehicle[0];
  }

  private calculateBreakdown(vehicle: any, distanceKm: number, occupancy: number, timing: string, frequency: string) {
    // Base vehicle impact score
    const vehicleImpact = vehicle.baseImpactScore;
    
    // Congestion factor (multiplier based on distance)
    const congestionFactor = this.getCongestionMultiplier(distanceKm);
    
    // Timing penalty (multiplier for peak hours)
    const timingMultiplier = this.getTimingMultiplier(timing);
    
    // Frequency multiplier
    const frequencyMultiplier = this.getFrequencyMultiplier(frequency);
    
    // Calculate final score using README documented formula
    const rawScore = (vehicleImpact * congestionFactor * timingMultiplier * frequencyMultiplier) / occupancy;
    
    const breakdown = {
      vehicleImpact: Math.round(vehicleImpact),
      congestionFactor: congestionFactor,
      timingMultiplier: timingMultiplier,
      frequencyMultiplier: frequencyMultiplier,
      occupancy: occupancy,
      rawScore: Math.round(rawScore * 100) / 100 // Show calculation for transparency
    };
    
    console.log('New calculation logic:', {
      formula: `(${vehicleImpact} * ${congestionFactor} * ${timingMultiplier} * ${frequencyMultiplier}) / ${occupancy}`,
      result: rawScore,
      breakdown
    });
    
    return breakdown;
  }

  private generateScore(breakdown: any): number {
    // Use the calculated raw score from the new multiplicative formula
    const finalScore = breakdown.rawScore;
    
    // Normalize to 0-100 scale
    return Math.min(Math.max(Math.round(finalScore), 0), 100);
  }

  private calculateMonthlyMetrics(vehicle: any, distanceKm: number, occupancy: number, frequency: string) {
    const monthlyTrips = this.getMonthlyTrips(frequency);
    const totalKm = distanceKm * 2 * monthlyTrips; // Round trip
    
    const emissions = Math.round(totalKm * parseFloat(vehicle.emissionFactor));
    const cost = Math.round(totalKm * parseFloat(vehicle.fuelCostPerKm) / occupancy);
    const timeHours = Math.round((totalKm / vehicle.avgSpeedKmh) * 100) / 100;

    return { emissions, cost, timeHours };
  }

  private generateAlternatives(input: CalculationInput, currentScore: number): Alternative[] {
    const alternatives: Alternative[] = [];

    // Public transport alternative
    alternatives.push({
      type: 'metro',
      title: 'Chennai Metro + Bus',
      description: 'Use metro and bus combination for your route',
      impactReduction: Math.round((currentScore - 20) / currentScore * 100),
      timeDelta: '+15-20 minutes',
      costSavings: 600,
      newScore: 20
    });

    // Carpooling alternative (if applicable)
    if ((input.occupancy || 1) < 3) {
      const newOccupancy = (input.occupancy || 1) + 2;
      const newScore = Math.round(currentScore * ((input.occupancy || 1) / newOccupancy));
      alternatives.push({
        type: 'carpool',
        title: 'Carpooling',
        description: `Share rides with ${newOccupancy - (input.occupancy || 1)} more people`,
        impactReduction: Math.round((currentScore - newScore) / currentScore * 100),
        timeDelta: '+5-10 minutes',
        costSavings: Math.round(300 * (newOccupancy - (input.occupancy || 1)) / newOccupancy),
        newScore
      });
    }

    // Off-peak timing - parse travel pattern to get timing
    const { timing } = this.parseTravelPattern(input.travelPattern);
    if (this.isInPeakHours(timing)) {
      const timingReduction = timing === 'both-peaks' ? 44 : 33; // Reduction % from multiplier change
      alternatives.push({
        type: 'timing',
        title: 'Off-Peak Travel',
        description: 'Travel outside peak hours (before 8 AM or after 9 PM)',
        impactReduction: timingReduction,
        timeDelta: 'Same or faster',
        costSavings: 0,
        newScore: Math.round(currentScore / (timing === 'both-peaks' ? 1.8 : 1.5))
      });
    }

    // E-vehicle alternative
    if (input.transportMode === 'car') {
      alternatives.push({
        type: 'electric',
        title: 'Electric Vehicle',
        description: 'Switch to an electric car',
        impactReduction: 40,
        timeDelta: 'Same',
        costSavings: 400,
        newScore: Math.round(currentScore * 0.6)
      });
    }

    return alternatives.slice(0, 4);
  }

  private generateSustainableAlternatives(input: CalculationInput): Alternative[] {
    const alternatives: Alternative[] = [];

    if (input.transportMode !== 'walking') {
      alternatives.push({
        type: 'walking',
        title: 'Walking/Cycling',
        description: 'Walk or cycle for short distances',
        impactReduction: 75,
        timeDelta: 'Variable',
        costSavings: 900,
        newScore: 5
      });
    }

    if (input.transportMode !== 'metro') {
      alternatives.push({
        type: 'metro',
        title: 'Chennai Metro',
        description: 'Use metro for faster, cleaner travel',
        impactReduction: 30,
        timeDelta: '+5-10 minutes',
        costSavings: 200,
        newScore: 15
      });
    }

    return alternatives;
  }

  private getCongestionMultiplier(distanceKm: number): number {
    // Congestion multiplier based on distance as per documented formula
    // congestionFactor = 1 + (distanceKm × 0.02)
    return 1 + (distanceKm * 0.02);
  }

  private getTimingMultiplier(timing: string): number {
    // Timing multiplier for peak hours as per methodology
    if (timing === 'both-peaks') return 1.35; // Daily commute hits both peaks
    if (timing === 'morning-peak' || timing === 'evening-peak') return 1.35; // Single peak
    if (timing === 'off-peak') return 1.1; // Weekend/off-peak
    return 1.1; // Default off-peak
  }

  private isInPeakHours(timing: string): boolean {
    return timing === 'morning-peak' || timing === 'evening-peak' || timing === 'both-peaks';
  }

  private getFrequencyMultiplier(frequency: string): number {
    const multipliers = {
      'daily': 1.0,      // Daily commute
      'weekdays': 0.75,  // Weekday commute
      'weekends': 0.4,   // Weekend commute
      'frequent': 0.5,   // Frequent trips
      'occasional': 0.25, // Occasional trips
      'rare': 0.25       // Rare trips
    };
    return multipliers[frequency as keyof typeof multipliers] || 1.0;
  }

  private getMonthlyTrips(frequency: string): number {
    const trips = {
      'daily': 22, // Working days
      'weekdays': 22, // Working days only
      'weekends': 8, // Weekend days
      'frequent': 16,
      'occasional': 8,
      'rare': 4
    };
    return trips[frequency as keyof typeof trips] || 22;
  }

  private parseTravelPattern(travelPattern: string): { timing: string; frequency: string } {
    const patterns = {
      'daily-commute': { timing: 'both-peaks', frequency: 'daily' }, // Both peak hours
      'weekday-commute': { timing: 'morning-peak', frequency: 'weekdays' },
      'weekend-commute': { timing: 'off-peak', frequency: 'weekends' },
      'frequent-trips': { timing: 'off-peak', frequency: 'frequent' },
      'occasional-trips': { timing: 'off-peak', frequency: 'occasional' },
      'rare-trips': { timing: 'off-peak', frequency: 'rare' }
    };

    return patterns[travelPattern as keyof typeof patterns] || { timing: 'off-peak', frequency: 'occasional' };
  }

  private getPublicTransportCost(transportMode: string, distanceKm: number): number {
    const baseCosts = {
      metro: 20,
      bus: 15,
      auto: 50,
      walking: 0,
      public: 25
    };
    
    const baseCost = baseCosts[transportMode as keyof typeof baseCosts] || 25;
    return Math.round(baseCost * Math.max(1, distanceKm / 5) * 22); // Monthly cost
  }

  private getConfidenceLevel(input: CalculationInput) {
    // High confidence for known vehicle types and reasonable distances
    if (input.vehicleTypeId && input.distanceKm < 50) {
      return { level: 'A' as const, description: 'High confidence based on vehicle data and route analysis' };
    }
    
    // Medium confidence for sustainable transport
    if (!input.vehicleTypeId) {
      return { level: 'B' as const, description: 'Good confidence for sustainable transport modes' };
    }
    
    return { level: 'C' as const, description: 'Estimated based on available data' };
  }

  private async saveCalculation(input: CalculationInput, results: any): Promise<number> {
    // Ensure user exists
    const [user] = await db
      .insert(users)
      .values({ sessionId: input.sessionId })
      .onConflictDoUpdate({
        target: users.sessionId,
        set: { sessionId: input.sessionId }
      })
      .returning({ id: users.id });

    // Save calculation
    const [calculation] = await db
      .insert(calculations)
      .values({
        userId: user.id,
        sessionId: input.sessionId,
        transportMode: input.transportMode,
        vehicleTypeId: input.vehicleTypeId,
        occupancy: input.occupancy,
        origin: input.origin,
        destination: input.destination,
        distanceKm: input.distanceKm.toString(),
        travelPattern: input.travelPattern,
        impactScore: results.score,
        monthlyEmissions: results.monthlyMetrics.emissions.toString(),
        monthlyCost: results.monthlyMetrics.cost.toString(),
        monthlyTimeHours: results.monthlyMetrics.timeHours.toString(),
        breakdown: results.breakdown,
        alternatives: results.alternatives
      })
      .returning({ id: calculations.id });

    return calculation.id;
  }
}

export const impactCalculator = new ImpactCalculator();