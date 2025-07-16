interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  lastUpdated: string;
}

interface WeatherImpact {
  severity: 'low' | 'medium' | 'high' | 'critical';
  impactScore: number; // 0-100 (higher = more impact on traffic)
  primaryFactor: string;
  description: string;
  recommendations: string[];
  affectedAreas: string[];
  estimatedDelay: string;
  icon: string;
  color: string;
}

export class WeatherImpactService {
  
  analyzeWeatherImpact(weather: WeatherData): WeatherImpact {
    let impactScore = 0;
    let factors: string[] = [];
    let recommendations: string[] = [];
    let affectedAreas: string[] = [];
    
    // Temperature Impact Analysis (Chennai-specific)
    if (weather.temperature >= 42) {
      impactScore += 25;
      factors.push("Extreme heat");
      recommendations.push("Avoid travel during 12-4 PM");
      recommendations.push("Ensure vehicle cooling system is functional");
      affectedAreas.push("Open highways", "Non-shaded roads");
    } else if (weather.temperature >= 38) {
      impactScore += 15;
      factors.push("High heat");
      recommendations.push("Plan for more frequent breaks");
      affectedAreas.push("Highways", "Traffic signals with long waits");
    } else if (weather.temperature <= 20) {
      impactScore += 10;
      factors.push("Cooler weather");
      recommendations.push("Visibility may be reduced in early morning");
    }

    // Condition-based Impact Analysis
    const condition = weather.condition.toLowerCase();
    if (condition.includes('rain') || condition.includes('drizzle')) {
      if (condition.includes('heavy')) {
        impactScore += 40;
        factors.push("Heavy rainfall");
        recommendations.push("Reduce speed by 20-30%");
        recommendations.push("Maintain extra following distance");
        recommendations.push("Avoid underpasses and low-lying areas");
        affectedAreas.push("Velachery-Tambaram stretch", "Anna Salai", "OMR tech corridor", "Airport area");
      } else if (condition.includes('moderate')) {
        impactScore += 25;
        factors.push("Moderate rainfall");
        recommendations.push("Use headlights during day");
        recommendations.push("Be cautious of waterlogging");
        affectedAreas.push("Low-lying areas", "Underpasses");
      } else {
        impactScore += 15;
        factors.push("Light rainfall");
        recommendations.push("Slight caution advised");
        affectedAreas.push("Flood-prone areas");
      }
    }

    if (condition.includes('thunderstorm')) {
      impactScore += 35;
      factors.push("Thunderstorm");
      recommendations.push("Avoid travel if possible");
      recommendations.push("Stay away from trees and billboards");
      affectedAreas.push("ECR", "GST Road", "Outer areas");
    }

    if (condition.includes('fog') || condition.includes('mist')) {
      impactScore += 30;
      factors.push("Reduced visibility");
      recommendations.push("Use fog lights");
      recommendations.push("Reduce speed significantly");
      affectedAreas.push("Highway stretches", "Early morning routes");
    }

    // Humidity Impact (Chennai climate consideration)
    if (weather.humidity >= 85) {
      impactScore += 12;
      factors.push("High humidity");
      recommendations.push("AC usage may increase, plan for fuel");
      recommendations.push("Windows may fog up - use defogger");
    }

    // Wind Speed Impact
    if (weather.windSpeed >= 40) {
      impactScore += 20;
      factors.push("Strong winds");
      recommendations.push("Be cautious of flying debris");
      recommendations.push("High-profile vehicles should avoid highways");
      affectedAreas.push("ECR", "OMR", "Highway stretches");
    } else if (weather.windSpeed >= 25) {
      impactScore += 10;
      factors.push("Moderate winds");
      recommendations.push("Two-wheelers exercise caution");
    }

    // Visibility Impact
    if (weather.visibility <= 3) {
      impactScore += 35;
      factors.push("Poor visibility");
      recommendations.push("Use headlights and hazard lights");
      recommendations.push("Consider delaying travel");
    } else if (weather.visibility <= 6) {
      impactScore += 20;
      factors.push("Reduced visibility");
      recommendations.push("Drive with headlights on");
    }

    // Determine overall severity and primary factor
    let severity: 'low' | 'medium' | 'high' | 'critical';
    let icon: string;
    let color: string;

    if (impactScore >= 60) {
      severity = 'critical';
      icon = '🚨';
      color = 'red';
    } else if (impactScore >= 40) {
      severity = 'high';
      icon = '⚠️';
      color = 'orange';
    } else if (impactScore >= 20) {
      severity = 'medium';
      icon = '⚡';
      color = 'yellow';
    } else {
      severity = 'low';
      icon = '✅';
      color = 'green';
    }

    const primaryFactor = factors.length > 0 ? factors[0] : "Normal conditions";
    
    // Generate description
    let description: string;
    if (severity === 'critical') {
      description = `Critical weather impact on Chennai traffic. ${primaryFactor} causing significant delays and safety concerns.`;
    } else if (severity === 'high') {
      description = `High weather impact on traffic flow. ${primaryFactor} leading to moderate delays and reduced safety.`;
    } else if (severity === 'medium') {
      description = `Moderate weather impact on traffic. ${primaryFactor} may cause minor delays and requires caution.`;
    } else {
      description = `Minimal weather impact on traffic. ${primaryFactor} with normal driving conditions.`;
    }

    // Estimate delay
    let estimatedDelay: string;
    if (impactScore >= 60) {
      estimatedDelay = "30-60+ minutes";
    } else if (impactScore >= 40) {
      estimatedDelay = "15-30 minutes";
    } else if (impactScore >= 20) {
      estimatedDelay = "5-15 minutes";
    } else {
      estimatedDelay = "Minimal delay";
    }

    // Add Chennai-specific recommendations
    if (impactScore > 20) {
      recommendations.unshift("Check Chennai Traffic Police updates");
      recommendations.push("Consider Metro/suburban trains as alternative");
    }

    return {
      severity,
      impactScore,
      primaryFactor,
      description,
      recommendations: recommendations.slice(0, 4), // Limit to 4 recommendations
      affectedAreas: affectedAreas.slice(0, 4), // Limit to 4 areas
      estimatedDelay,
      icon,
      color
    };
  }

  // Get weather-specific traffic advice for Chennai routes
  getRouteSpecificAdvice(weather: WeatherData, route?: string): string[] {
    const advice: string[] = [];
    const condition = weather.condition.toLowerCase();

    if (route && condition.includes('rain')) {
      if (route.includes('Velachery') || route.includes('Tambaram')) {
        advice.push("⚠️ Velachery-Tambaram stretch prone to waterlogging");
      }
      if (route.includes('Airport') || route.includes('Meenambakkam')) {
        advice.push("⚠️ Airport area roads may have standing water");
      }
      if (route.includes('Anna Salai') || route.includes('Mount Road')) {
        advice.push("⚠️ Anna Salai underpasses may be waterlogged");
      }
      if (route.includes('OMR') || route.includes('Old Mahabalipuram')) {
        advice.push("⚠️ OMR service roads may have poor drainage");
      }
    }

    if (weather.temperature >= 40 && route) {
      if (route.includes('Highway') || route.includes('ECR') || route.includes('GST')) {
        advice.push("🌡️ Highway travel: High heat stress, frequent breaks recommended");
      }
    }

    return advice;
  }
}

export const weatherImpactService = new WeatherImpactService();