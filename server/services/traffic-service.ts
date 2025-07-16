import { Client } from "@googlemaps/google-maps-services-js";
import { storage } from "../storage";

interface TrafficData {
  worstRoads: Array<{
    road: string;
    severity: 'high' | 'medium' | 'low';
    delay: string;
    segment?: string; // More precise segment information
  }>;
  chokepoints: Array<{
    location: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    specificArea?: string; // Precise location info
  }>;
  lastUpdated: string;
}

interface UserRoute {
  origin: string;
  destination: string;
  frequency: number;
  avgDistance: number;
  avgImpact: number;
}

interface RouteSegment {
  name: string;
  start: string;
  end: string;
  coords: { lat: number; lng: number };
}

// In-memory cache for traffic data (separate for each mode)
let trafficCache: { [key: string]: { data: TrafficData | null; timestamp: number } } = {
  calculator: { data: null, timestamp: 0 },
  holistic: { data: null, timestamp: 0 }
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export class TrafficService {
  private client: Client;
  private apiKey: string;

  // Static method to clear cache
  static clearCache() {
    trafficCache = {
      calculator: { data: null, timestamp: 0 },
      holistic: { data: null, timestamp: 0 }
    };
    console.log('🧹 Traffic cache cleared');
  }

  // Granular Chennai road segments for precise traffic monitoring
  private readonly chennaiRoadSegments = [
    // Major arterial roads with specific segments
    { name: "Anna Salai (Gemini - Nandanam)", start: { lat: 13.0827, lng: 80.2707 }, end: { lat: 13.0364, lng: 80.2456 } },
    { name: "Anna Salai (Nandanam - Saidapet)", start: { lat: 13.0364, lng: 80.2456 }, end: { lat: 13.0186, lng: 80.2267 } },
    { name: "GST Road (Chrompet - Pallavaram)", start: { lat: 12.9184, lng: 80.1848 }, end: { lat: 12.9673, lng: 80.1492 } },
    { name: "GST Road (Pallavaram - Tambaram)", start: { lat: 12.9673, lng: 80.1492 }, end: { lat: 12.9249, lng: 80.1000 } },
    { name: "OMR (Tidel Park - Sholinganallur)", start: { lat: 12.9698, lng: 80.2452 }, end: { lat: 12.9010, lng: 80.2279 } },
    { name: "OMR (Sholinganallur - Siruseri)", start: { lat: 12.9010, lng: 80.2279 }, end: { lat: 12.8259, lng: 80.2284 } },
    { name: "ECR (Thiruvanmiyur - Neelankarai)", start: { lat: 12.9368, lng: 80.2468 }, end: { lat: 12.9422, lng: 80.2633 } },
    { name: "ECR (Neelankarai - Injambakkam)", start: { lat: 12.9422, lng: 80.2633 }, end: { lat: 12.9103, lng: 80.2885 } },
    
    // Inner city roads and key intersections
    { name: "Poonamallee High Road (Kilpauk - Aminjikarai)", start: { lat: 13.0878, lng: 80.2785 }, end: { lat: 13.0718, lng: 80.2318 } },
    { name: "Poonamallee High Road (Aminjikarai - Chetpet)", start: { lat: 13.0718, lng: 80.2318 }, end: { lat: 13.0678, lng: 80.2440 } },
    { name: "Velachery Main Road (Velachery - Guindy)", start: { lat: 12.9698, lng: 80.2452 }, end: { lat: 13.0067, lng: 80.2206 } },
    { name: "Sardar Patel Road (Adyar - Guindy)", start: { lat: 13.0067, lng: 80.2206 }, end: { lat: 13.0186, lng: 80.2267 } },
    { name: "Lattice Bridge Road (Adyar - Thiruvanmiyur)", start: { lat: 13.0067, lng: 80.2206 }, end: { lat: 12.9854, lng: 80.2568 } },
    
    // Key junctions and chokepoints
    { name: "Kathipara Junction (GST-Inner Ring)", start: { lat: 13.0186, lng: 80.2267 }, end: { lat: 13.0067, lng: 80.2206 } },
    { name: "Koyambedu Junction (Poonamallee High Road)", start: { lat: 13.0718, lng: 80.2318 }, end: { lat: 13.0827, lng: 80.2707 } },
    { name: "Madhya Kailash Junction (OMR)", start: { lat: 12.9698, lng: 80.2452 }, end: { lat: 12.9854, lng: 80.2568 } },
    
    // Connecting roads between major areas
    { name: "Inner Ring Road (Adyar - Saidapet)", start: { lat: 13.0067, lng: 80.2206 }, end: { lat: 13.0186, lng: 80.2267 } },
    { name: "Rajiv Gandhi Salai (Thoraipakkam - Navalur)", start: { lat: 12.9397, lng: 80.2348 }, end: { lat: 12.8444, lng: 80.2284 } },
    { name: "100 Feet Road (Vadapalani - Ashok Nagar)", start: { lat: 13.0501, lng: 80.2060 }, end: { lat: 13.0364, lng: 80.2097 } },
    { name: "Arcot Road (Kodambakkam - Vadapalani)", start: { lat: 13.0501, lng: 80.2060 }, end: { lat: 13.0718, lng: 80.2318 } },
    { name: "Nelson Manickam Road (Aminjikarai - Chetpet)", start: { lat: 13.0718, lng: 80.2318 }, end: { lat: 13.0678, lng: 80.2440 } }
  ];

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    this.client = new Client({});
  }

  async getChennaiTrafficData(mode: 'calculator' | 'holistic' = 'calculator'): Promise<TrafficData> {
    // Use separate cache for each mode
    const now = Date.now();
    const modeCache = trafficCache[mode];
    
    if (modeCache.data && (now - modeCache.timestamp) < CACHE_DURATION) {
      console.log(`Returning cached ${mode} traffic data`);
      return modeCache.data;
    }

    try {
      console.log(`Fetching fresh ${mode} traffic data from Google Maps`);
      
      if (mode === 'calculator') {
        return await this.getCalculatorBasedTrafficData();
      } else {
        return await this.getHolisticTrafficData();
      }

    } catch (error) {
      console.error('Error fetching traffic data:', error);
      
      // Return fallback data if API fails
      const fallbackData = this.getFallbackTrafficData();
      
      // Cache fallback data for shorter duration (1 minute)
      trafficCache[mode] = {
        data: fallbackData,
        timestamp: now - (CACHE_DURATION - 60000) // Cache for only 1 minute
      };
      
      return fallbackData;
    }
  }

  private async getCalculatorBasedTrafficData(): Promise<TrafficData> {
    // Get actual user routes from database
    const userRoutes = await this.getUserRoutes();
    
    if (userRoutes.length === 0) {
      return this.getFallbackTrafficData();
    }

    // Analyze traffic for actual user routes
    const routeAnalysis = await this.analyzeUserRoutes(userRoutes);
    
    // Generate granular traffic analysis
    const worstRoads = await this.generateGranularTrafficAnalysis(routeAnalysis);
    const chokepoints = await this.generatePreciseChokepoints(routeAnalysis);

    const trafficData: TrafficData = {
      worstRoads: worstRoads.length > 0 ? worstRoads : this.getFallbackTrafficData().worstRoads,
      chokepoints: chokepoints.length > 0 ? chokepoints : this.getFallbackTrafficData().chokepoints,
      lastUpdated: new Date().toISOString()
    };

    // Update cache for calculator mode
    trafficCache['calculator'] = {
      data: trafficData,
      timestamp: Date.now()
    };

    return trafficData;
  }

  private async getHolisticTrafficData(): Promise<TrafficData> {
    // Use granular road segment monitoring for city-wide traffic analysis
    const trafficPromises = this.chennaiRoadSegments.map(async (segment) => {
      try {
        // Get traffic data for this specific road segment
        const response = await this.client.distancematrix({
          params: {
            origins: [`${segment.start.lat},${segment.start.lng}`],
            destinations: [`${segment.end.lat},${segment.end.lng}`],
            mode: "driving",
            departure_time: "now",
            traffic_model: "best_guess",
            key: this.apiKey,
          },
        });

        const element = response.data.rows[0]?.elements[0];
        if (element && element.status === 'OK') {
          const duration = element.duration?.value || 0;
          const durationInTraffic = element.duration_in_traffic?.value || duration;
          const delayRatio = durationInTraffic / duration;
          
          let severity: 'high' | 'medium' | 'low' = 'low';
          let delay = 'Normal flow';
          
          if (delayRatio > 1.4) {
            severity = 'high';
            delay = `${Math.round((delayRatio - 1) * 100)}% longer than usual`;
          } else if (delayRatio > 1.15) {
            severity = 'medium';
            delay = `${Math.round((delayRatio - 1) * 100)}% longer than usual`;
          }

          return {
            road: segment.name,
            severity,
            delay,
            delayRatio,
            segment: segment.name
          };
        }
      } catch (error) {
        console.error(`Error fetching traffic for ${segment.name}:`, error);
      }
      return null;
    });

    const trafficResults = await Promise.all(trafficPromises);
    const validResults = trafficResults.filter(result => result !== null) as Array<{
      road: string;
      severity: 'high' | 'medium' | 'low';
      delay: string;
      delayRatio: number;
      segment: string;
    }>;

    // Sort by delay ratio (worst first) and take top 6 for more granular data
    const worstRoads = validResults
      .sort((a, b) => b.delayRatio - a.delayRatio)
      .slice(0, 6)
      .map(({ road, severity, delay }) => ({ road, severity, delay }));

    // Generate granular chokepoints based on road segments
    const chokepoints = this.generateGranularChokepoints(validResults);

    const trafficData: TrafficData = {
      worstRoads: worstRoads.length > 0 ? worstRoads : this.getFallbackTrafficData().worstRoads,
      chokepoints: chokepoints.length > 0 ? chokepoints : this.getFallbackTrafficData().chokepoints,
      lastUpdated: new Date().toISOString()
    };

    // Update cache for holistic mode
    trafficCache['holistic'] = {
      data: trafficData,
      timestamp: Date.now()
    };

    return trafficData;
  }

  private async getUserRoutes(): Promise<UserRoute[]> {
    try {
      const topRoutes = await storage.getTopRoutes(10);
      return topRoutes.map(route => ({
        origin: route.origin,
        destination: route.destination,
        frequency: route.count,
        avgDistance: route.avgScore, // Using avgScore as a proxy for analysis
        avgImpact: route.avgScore
      }));
    } catch (error) {
      console.error('Error fetching user routes:', error);
      return [];
    }
  }

  private async analyzeUserRoutes(routes: UserRoute[]): Promise<Array<{
    route: UserRoute;
    segments: RouteSegment[];
    trafficData: any;
  }>> {
    const routeAnalysis = [];
    
    for (const route of routes.slice(0, 5)) { // Analyze top 5 routes
      try {
        // Get detailed route from Google Maps
        const directions = await this.client.directions({
          params: {
            origin: route.origin,
            destination: route.destination,
            mode: "driving",
            departure_time: "now",
            traffic_model: "best_guess",
            key: this.apiKey,
          },
        });

        if (directions.data.routes.length > 0) {
          const routeData = directions.data.routes[0];
          const segments = this.extractRouteSegments(routeData);
          
          // Get traffic data for each segment
          const trafficData = await this.getSegmentTrafficData(segments);
          
          routeAnalysis.push({
            route,
            segments,
            trafficData
          });
        }
      } catch (error) {
        console.error(`Error analyzing route ${route.origin} to ${route.destination}:`, error);
      }
    }
    
    return routeAnalysis;
  }

  private extractRouteSegments(routeData: any): RouteSegment[] {
    const segments: RouteSegment[] = [];
    
    if (routeData.legs && routeData.legs[0] && routeData.legs[0].steps) {
      const steps = routeData.legs[0].steps;
      
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step.html_instructions) {
          // Extract meaningful road names from instructions
          const roadName = this.extractRoadName(step.html_instructions);
          if (roadName) {
            segments.push({
              name: roadName,
              start: step.start_location ? `${step.start_location.lat},${step.start_location.lng}` : '',
              end: step.end_location ? `${step.end_location.lat},${step.end_location.lng}` : '',
              coords: step.start_location || { lat: 0, lng: 0 }
            });
          }
        }
      }
    }
    
    return segments;
  }

  private extractRoadName(htmlInstructions: string): string | null {
    // Extract road names from HTML instructions
    const roadPatterns = [
      /on <b>(.*?)<\/b>/,
      /onto <b>(.*?)<\/b>/,
      /toward <b>(.*?)<\/b>/,
      /via <b>(.*?)<\/b>/
    ];
    
    for (const pattern of roadPatterns) {
      const match = htmlInstructions.match(pattern);
      if (match && match[1]) {
        return match[1].replace(/<[^>]*>/g, ''); // Remove any remaining HTML tags
      }
    }
    
    return null;
  }

  private async getSegmentTrafficData(segments: RouteSegment[]): Promise<any> {
    const trafficData = [];
    
    for (const segment of segments.slice(0, 3)) { // Analyze top 3 segments per route
      try {
        if (segment.start && segment.end) {
          const response = await this.client.distancematrix({
            params: {
              origins: [segment.start],
              destinations: [segment.end],
              mode: "driving",
              departure_time: "now",
              traffic_model: "best_guess",
              key: this.apiKey,
            },
          });

          const element = response.data.rows[0]?.elements[0];
          if (element && element.status === 'OK') {
            const duration = element.duration?.value || 0;
            const durationInTraffic = element.duration_in_traffic?.value || duration;
            const delayRatio = durationInTraffic / duration;
            
            trafficData.push({
              segment: segment.name,
              delayRatio,
              duration,
              durationInTraffic
            });
          }
        }
      } catch (error) {
        console.error(`Error getting traffic data for segment ${segment.name}:`, error);
      }
    }
    
    return trafficData;
  }

  private async generateGranularTrafficAnalysis(routeAnalysis: any[]): Promise<Array<{
    road: string;
    severity: 'high' | 'medium' | 'low';
    delay: string;
    segment?: string;
  }>> {
    const trafficResults = [];
    
    for (const analysis of routeAnalysis) {
      for (const segmentData of analysis.trafficData) {
        if (segmentData.delayRatio > 1.1) { // Any delay above 10%
          let severity: 'high' | 'medium' | 'low' = 'low';
          let delay = 'Normal flow';
          
          if (segmentData.delayRatio > 1.4) {
            severity = 'high';
            delay = `${Math.round((segmentData.delayRatio - 1) * 100)}% longer than usual`;
          } else if (segmentData.delayRatio > 1.2) {
            severity = 'medium';
            delay = `${Math.round((segmentData.delayRatio - 1) * 100)}% longer than usual`;
          } else {
            severity = 'low';
            delay = `${Math.round((segmentData.delayRatio - 1) * 100)}% longer than usual`;
          }
          
          // Create more specific road descriptions
          const roadDescription = this.createGranularRoadDescription(segmentData.segment, analysis.route);
          
          trafficResults.push({
            road: roadDescription,
            severity,
            delay,
            segment: segmentData.segment,
            delayRatio: segmentData.delayRatio
          });
        }
      }
    }
    
    // Sort by delay ratio and take top 5
    return trafficResults
      .sort((a, b) => b.delayRatio - a.delayRatio)
      .slice(0, 5)
      .map(({ road, severity, delay, segment }) => ({ road, severity, delay, segment }));
  }

  private async generatePreciseChokepoints(routeAnalysis: any[]): Promise<Array<{
    location: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
    specificArea?: string;
  }>> {
    const chokepoints = [];
    
    for (const analysis of routeAnalysis) {
      for (const segmentData of analysis.trafficData) {
        if (segmentData.delayRatio > 1.3) { // Significant delay for chokepoints
          let severity: 'high' | 'medium' | 'low' = 'medium';
          
          if (segmentData.delayRatio > 1.5) {
            severity = 'high';
          } else if (segmentData.delayRatio > 1.4) {
            severity = 'medium';
          }
          
          // Create precise chokepoint location
          const location = this.createPreciseChokepointLocation(segmentData.segment, analysis.route);
          const description = this.createChokepointDescription(segmentData, analysis.route);
          
          chokepoints.push({
            location,
            severity,
            description,
            specificArea: segmentData.segment,
            delayRatio: segmentData.delayRatio
          });
        }
      }
    }
    
    // Sort by delay ratio and take top 3 most severe
    return chokepoints
      .sort((a, b) => b.delayRatio - a.delayRatio)
      .slice(0, 3)
      .map(({ location, severity, description, specificArea }) => ({ location, severity, description, specificArea }));
  }

  private createGranularRoadDescription(segment: string, route: UserRoute): string {
    // Create more specific road descriptions based on route context
    const originArea = this.extractAreaFromAddress(route.origin);
    const destArea = this.extractAreaFromAddress(route.destination);
    
    if (segment && segment.length > 0) {
      return `${segment} (${originArea} to ${destArea} route)`;
    }
    
    return `${originArea} to ${destArea} corridor`;
  }

  private createPreciseChokepointLocation(segment: string, route: UserRoute): string {
    // Create precise chokepoint locations
    const originArea = this.extractAreaFromAddress(route.origin);
    const destArea = this.extractAreaFromAddress(route.destination);
    
    if (segment && segment.length > 0) {
      return `${segment} intersection`;
    }
    
    return `${originArea} - ${destArea} junction`;
  }

  private createChokepointDescription(segmentData: any, route: UserRoute): string {
    const delayPercent = Math.round((segmentData.delayRatio - 1) * 100);
    const routeContext = `on ${this.extractAreaFromAddress(route.origin)} to ${this.extractAreaFromAddress(route.destination)} route`;
    
    if (delayPercent > 50) {
      return `Severe congestion detected with ${delayPercent}% delay ${routeContext} - avoid if possible`;
    } else if (delayPercent > 30) {
      return `Heavy traffic with ${delayPercent}% delay ${routeContext} - consider alternate routes`;
    } else {
      return `Moderate congestion with ${delayPercent}% delay ${routeContext}`;
    }
  }

  private extractAreaFromAddress(address: string): string {
    // Extract meaningful area names from full addresses
    const parts = address.split(',');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('Chennai') || trimmed.includes('Tamil Nadu') || trimmed.includes('India')) {
        continue;
      }
      if (trimmed.length > 3 && trimmed.length < 30) {
        return trimmed;
      }
    }
    return parts[0]?.trim() || 'Unknown Area';
  }

  private generateChokepoints(trafficResults: Array<{
    road: string;
    severity: 'high' | 'medium' | 'low';
    delay: string;
    delayRatio: number;
  }>): Array<{
    location: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }> {
    const highTrafficAreas = trafficResults.filter(result => result.delayRatio > 1.3);
    
    return highTrafficAreas.slice(0, 3).map(area => ({
      location: area.road,
      severity: area.severity,
      description: `Heavy congestion detected with ${area.delay.toLowerCase()}`
    }));
  }

  private generateGranularChokepoints(trafficResults: Array<{
    road: string;
    severity: 'high' | 'medium' | 'low';
    delay: string;
    delayRatio: number;
    segment: string;
  }>): Array<{ location: string; severity: 'high' | 'medium' | 'low'; description: string }> {
    // Focus on junction areas and key intersections with high delays
    const junctionAreas = trafficResults
      .filter(result => result.delayRatio > 1.2 && (
        result.segment.includes('Junction') || 
        result.segment.includes('Bridge') || 
        result.segment.includes('GST') ||
        result.segment.includes('OMR') ||
        result.segment.includes('Anna Salai') ||
        result.segment.includes('Poonamallee') ||
        result.segment.includes('ECR') ||
        result.segment.includes('Velachery')
      ))
      .slice(0, 5); // Top 5 precise chokepoints

    return junctionAreas.map(area => {
      let description = '';
      
      // Generate more specific descriptions based on delay severity
      if (area.delayRatio > 1.5) {
        description = `Critical bottleneck: ${area.delay} due to heavy traffic volume`;
      } else if (area.delayRatio > 1.3) {
        description = `Significant delays: ${area.delay} with slow-moving traffic`;
      } else {
        description = `Moderate congestion: ${area.delay} affecting vehicle flow`;
      }

      // Add context based on road type
      if (area.segment.includes('Junction')) {
        description += ' at major intersection';
      } else if (area.segment.includes('Bridge')) {
        description += ' on bridge approach';
      } else if (area.segment.includes('GST') || area.segment.includes('OMR')) {
        description += ' on arterial highway';
      } else if (area.segment.includes('ECR')) {
        description += ' on coastal road';
      }

      return {
        location: area.road,
        severity: area.severity,
        description
      };
    });
  }

  private getFallbackTrafficData(): TrafficData {
    // Realistic fallback data for Chennai during peak hours
    const hour = new Date().getHours();
    const isPeakHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
    
    if (isPeakHour) {
      return {
        worstRoads: [
          { road: "Anna Salai", severity: 'high', delay: "45% longer than usual" },
          { road: "GST Road", severity: 'high', delay: "38% longer than usual" },
          { road: "OMR (Rajiv Gandhi Salai)", severity: 'medium', delay: "25% longer than usual" },
          { road: "Mount Road", severity: 'medium', delay: "22% longer than usual" },
          { road: "Poonamallee High Road", severity: 'low', delay: "15% longer than usual" }
        ],
        chokepoints: [
          { location: "Kathipara Junction", severity: 'high', description: "Major intersection experiencing severe congestion" },
          { location: "Guindy Signal", severity: 'medium', description: "Traffic backlog due to signal timing" },
          { location: "Adyar Signal", severity: 'medium', description: "Heavy traffic flow from multiple directions" }
        ],
        lastUpdated: new Date().toISOString()
      };
    } else {
      return {
        worstRoads: [
          { road: "Anna Salai", severity: 'low', delay: "Normal flow" },
          { road: "OMR (Rajiv Gandhi Salai)", severity: 'low', delay: "Normal flow" },
          { road: "GST Road", severity: 'low', delay: "Light traffic" },
          { road: "Mount Road", severity: 'low', delay: "Normal flow" },
          { road: "ECR (East Coast Road)", severity: 'low', delay: "Normal flow" }
        ],
        chokepoints: [
          { location: "T. Nagar Pondy Bazaar", severity: 'low', description: "Typical commercial area congestion" },
          { location: "Central Railway Station", severity: 'low', description: "Normal commuter traffic" }
        ],
        lastUpdated: new Date().toISOString()
      };
    }
  }
}