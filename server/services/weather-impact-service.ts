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
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = day === 0 || day === 6;
    const isRushHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
    const isEveningRush = hour >= 17 && hour <= 20;
    const isMorningRush = hour >= 7 && hour <= 10;
    const isPeakHeat = hour >= 11 && hour <= 16;
    
    let impactScore = 0;
    let factors: string[] = [];
    let recommendations: string[] = [];
    let affectedAreas: string[] = [];
    
    // Temperature Impact Analysis (Chennai-specific with time context)
    if (weather.temperature >= 42) {
      impactScore += isPeakHeat ? 35 : 20;
      factors.push("Extreme heat stress");
      if (isPeakHeat) {
        recommendations.push("Peak heat hours - avoid non-essential travel");
        recommendations.push("Vehicle overheating risk - check coolant");
        if (isRushHour) {
          recommendations.push("Heavy traffic + extreme heat = high stress zones");
        }
      } else {
        recommendations.push("Extreme heat conditions - early morning travel preferred");
      }
      affectedAreas.push("Anna Salai signal waits", "OMR open stretches", "Airport Highway");
    } else if (weather.temperature >= 38) {
      if (isPeakHeat && isRushHour) {
        impactScore += 25;
        factors.push("High heat + rush hour combination");
        recommendations.push("Hot afternoon rush - expect longer AC queue times at signals");
        recommendations.push("Vehicle stress zones: Kathipara, Koyambedu overpasses");
      } else if (isPeakHeat) {
        impactScore += 15;
        factors.push("Peak heat conditions");
        recommendations.push("Avoid midday travel - heat island effect in city center");
      } else {
        impactScore += 8;
        factors.push("Warm conditions");
      }
      affectedAreas.push("City center concrete areas", "Signal-heavy routes");
    } else if (weather.temperature >= 35) {
      if (isRushHour) {
        impactScore += 12;
        factors.push("Warm weather + traffic volume");
        recommendations.push("Increased AC usage may cause fuel stops");
      } else {
        impactScore += 5;
        factors.push("Pleasant warm weather");
      }
    } else if (weather.temperature <= 25 && hour <= 7) {
      impactScore += 8;
      factors.push("Cool morning conditions");
      recommendations.push("Early morning fog possible - drive cautiously");
    }

    // Condition-based Impact Analysis with time and traffic context
    const condition = weather.condition.toLowerCase();
    if (condition.includes('rain') || condition.includes('drizzle')) {
      if (condition.includes('heavy')) {
        impactScore += isRushHour ? 50 : 35;
        factors.push("Heavy rainfall affecting traffic");
        if (isRushHour) {
          recommendations.push("Heavy rain + rush hour - severe delays expected");
          recommendations.push("Consider delaying travel by 1-2 hours if possible");
        }
        recommendations.push("Avoid Velachery, Airport area, and low-lying routes");
        recommendations.push("Anna Salai underpasses likely waterlogged");
        affectedAreas.push("Velachery-Tambaram corridor", "Airport-Guindy stretch", "Anna Salai underpasses", "OMR service roads");
      } else if (condition.includes('moderate')) {
        impactScore += isRushHour ? 30 : 20;
        factors.push("Rain creating traffic slowdowns");
        if (isRushHour) {
          recommendations.push("Rain + heavy traffic - expect 30-50% longer commutes");
        }
        recommendations.push("Watch for waterlogging in low areas");
        recommendations.push("Cautious driving - Chennai roads get slippery quickly");
        affectedAreas.push("Flood-prone junctions", "OMR tech corridor");
      } else {
        impactScore += isRushHour ? 18 : 10;
        factors.push("Light rain affecting road conditions");
        recommendations.push("Roads may be slippery - first rain after dry spell");
        if (isRushHour) {
          affectedAreas.push("Major signal junctions");
        }
      }
    }

    if (condition.includes('thunderstorm')) {
      impactScore += 40;
      factors.push("Thunderstorm - travel risk");
      recommendations.push("Avoid travel - lightning and wind hazards");
      recommendations.push("If must travel, avoid tree-lined roads");
      affectedAreas.push("ECR coastal areas", "Outer Chennai highways", "Tree-heavy routes");
    }

    if (condition.includes('fog') || condition.includes('mist')) {
      if (hour >= 5 && hour <= 8) {
        impactScore += 25;
        factors.push("Morning fog reducing visibility");
        recommendations.push("Use headlights - morning fog common in Chennai");
        recommendations.push("Reduce speed on highways and outer areas");
        affectedAreas.push("Highway stretches", "Outer Chennai roads");
      } else {
        // Fog/mist during other times is unusual and may indicate pollution
        impactScore += 15;
        factors.push("Unusual visibility conditions");
        recommendations.push("Poor air quality - consider avoiding heavy traffic areas");
      }
    }

    // Humidity Impact (Chennai climate with heat consideration)
    if (weather.humidity >= 85 && weather.temperature >= 30) {
      impactScore += 15;
      factors.push("High humidity + heat stress");
      recommendations.push("Oppressive conditions - increased AC usage affects fuel");
      if (isRushHour) {
        recommendations.push("Heavy traffic + humidity = driver fatigue risk");
      }
    } else if (weather.humidity >= 90) {
      impactScore += 8;
      factors.push("Very humid conditions");
      recommendations.push("Window fogging likely - ensure defogger works");
    }

    // Wind Speed Impact (Chennai context)
    if (weather.windSpeed >= 40) {
      impactScore += 25;
      factors.push("Strong winds creating hazards");
      recommendations.push("High winds - debris risk on highways");
      recommendations.push("Two-wheelers avoid elevated roads and bridges");
      affectedAreas.push("ECR coastal road", "OMR elevated sections", "Airport expressway");
    } else if (weather.windSpeed >= 25) {
      impactScore += 12;
      factors.push("Moderate winds affecting driving");
      recommendations.push("Two-wheelers be cautious on bridges and flyovers");
      affectedAreas.push("Kathipara flyover", "Anna flyover");
    }

    // Visibility Impact (contextual for Chennai and time)
    if (weather.visibility <= 2) {
      impactScore += 40;
      factors.push("Severely reduced visibility");
      recommendations.push("Dangerous driving conditions - avoid travel");
      recommendations.push("Use hazard lights and headlights");
    } else if (weather.visibility <= 4) {
      impactScore += 25;
      factors.push("Poor visibility conditions");
      if (hour >= 6 && hour <= 9) {
        recommendations.push("Morning low visibility - use headlights");
      } else if (hour >= 18 && hour <= 21) {
        recommendations.push("Evening poor visibility - extra caution needed");
      } else {
        recommendations.push("Unusual daytime poor visibility - possible pollution/dust");
      }
    } else if (weather.visibility <= 6 && (hour <= 6 || hour >= 19)) {
      // Only flag visibility issues during actual low light hours
      impactScore += 12;
      factors.push("Reduced visibility during low light hours");
      recommendations.push("Use headlights during dawn/dusk hours");
    } else if (weather.visibility <= 4 && hour >= 6 && hour <= 8) {
      // Early morning with poor visibility (not just reduced)
      impactScore += 15;
      factors.push("Poor morning visibility");
      recommendations.push("Morning haze/fog - use headlights and drive carefully");
    }
    // Note: 6km+ visibility during daytime is considered good - no recommendations needed

    // Add rush hour and weekend context
    if (isRushHour && !isWeekend && impactScore < 10) {
      impactScore += 8;
      factors.push("Rush hour traffic volume");
      if (isEveningRush) {
        recommendations.push("Evening rush - expect heavy traffic despite good weather");
      } else {
        recommendations.push("Morning rush - plan extra time despite clear conditions");
      }
    }

    // Weekend traffic patterns
    if (isWeekend && impactScore < 15) {
      impactScore -= 5; // Generally lighter traffic on weekends
      if (factors.length === 0) {
        factors.push("Weekend traffic - lighter than weekdays");
      }
    }

    // Compound factor analysis
    if (weather.temperature >= 38 && weather.humidity >= 80) {
      impactScore += 8;
      factors.push("Heat + humidity stress");
      recommendations.push("Oppressive conditions - stay hydrated, check vehicle cooling");
    }

    // Determine overall severity and primary factor
    let severity: 'low' | 'medium' | 'high' | 'critical';
    let icon: string;
    let color: string;

    if (impactScore >= 50) {
      severity = 'critical';
      icon = '🚨';
      color = 'red';
    } else if (impactScore >= 30) {
      severity = 'high';
      icon = '⚠️';
      color = 'orange';
    } else if (impactScore >= 15) {
      severity = 'medium';
      icon = '⚡';
      color = 'yellow';
    } else {
      severity = 'low';
      icon = '✅';
      color = 'green';
    }

    const primaryFactor = factors.length > 0 ? factors[0] : "Normal driving conditions";
    
    // Generate contextual description
    let description: string;
    const timeContext = isPeakHeat ? "during peak heat hours" : 
                       isRushHour ? "during rush hour" : 
                       isWeekend ? "weekend conditions" : "current conditions";
    
    if (severity === 'critical') {
      description = `Critical weather impact on Chennai traffic ${timeContext}. ${primaryFactor} causing significant delays and safety risks.`;
    } else if (severity === 'high') {
      description = `High weather impact on traffic flow ${timeContext}. ${primaryFactor} creating notable delays and requiring extra caution.`;
    } else if (severity === 'medium') {
      description = `Moderate weather impact ${timeContext}. ${primaryFactor} may cause some delays - plan accordingly.`;
    } else {
      description = `Minimal weather impact ${timeContext}. ${primaryFactor} with generally good driving conditions.`;
    }

    // Estimate delay based on conditions
    let estimatedDelay: string;
    if (impactScore >= 50) {
      estimatedDelay = isRushHour ? "45-90+ minutes" : "30-60+ minutes";
    } else if (impactScore >= 30) {
      estimatedDelay = isRushHour ? "20-45 minutes" : "15-30 minutes";
    } else if (impactScore >= 15) {
      estimatedDelay = isRushHour ? "10-20 minutes" : "5-15 minutes";
    } else {
      estimatedDelay = isRushHour ? "5-10 minutes" : "Normal travel time";
    }

    // Add contextual Chennai-specific recommendations
    if (impactScore >= 15) {
      if (isRushHour) {
        recommendations.unshift("Rush hour + weather impact - consider alternate timing");
      }
      if (impactScore >= 30) {
        recommendations.push("Check Chennai Traffic Police social media for updates");
        recommendations.push("Consider Metro Rail as weather-independent alternative");
      }
    }

    // Ensure we don't overwhelm with too many recommendations
    recommendations = recommendations.slice(0, 4);

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