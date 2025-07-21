import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { SEO } from "@/components/seo";
import { WeatherImpactOverlay } from "@/components/weather-impact-overlay";
import { formatNumber } from "@/lib/utils";
import { 
  Navigation, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Cloud,
  RefreshCw,
  Users,
  Route,
  Gauge,
  Database,
  Globe,
  IndianRupee,
  PiggyBank,
  Car,
  Calendar
} from "lucide-react";
import { useEffect, useState } from "react";

interface CommuteInsights {
  averageScore: number;
  averageDistance: number;
  totalCalculations: number;
}

interface FinancialInsights {
  totalMonthlyCost: number;
  avgCostByTransportMode: Array<{mode: string, avgCost: number, count: number}>;
  potentialSavings: number;
  avgCostByPattern: Array<{pattern: string, avgCost: number, count: number}>;
  avgCostByOccupancy: Array<{occupancy: number, avgCost: number, count: number}>;
  costEfficiencyMetrics: {avgCostPerKm: number, avgDistanceKm: number};
}

interface TrafficData {
  worstRoads: Array<{
    road: string;
    severity: 'high' | 'medium' | 'low';
    delay: string;
  }>;
  chokepoints: Array<{
    location: string;
    severity: 'high' | 'medium' | 'low';
    description: string;
  }>;
  lastUpdated: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  lastUpdated: string;
}

export default function Dashboard() {
  const [refreshTime, setRefreshTime] = useState<Date>(new Date());
  const [trafficMode, setTrafficMode] = useState<'calculator' | 'holistic'>('calculator');

  // Fetch commute insights from existing database
  const { data: commuteData, isLoading: commuteLoading } = useQuery<CommuteInsights>({
    queryKey: ['/api/dashboard/commute-insights'],
  });

  // Fetch financial insights
  const { data: financialData, isLoading: financialLoading } = useQuery<FinancialInsights>({
    queryKey: ['/api/dashboard/financial-insights'],
  });

  // Fetch real-time traffic data based on selected mode
  const { data: trafficData, isLoading: trafficLoading, refetch: refetchTraffic } = useQuery<TrafficData>({
    queryKey: ['/api/dashboard/traffic-insights', trafficMode],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/traffic-insights?mode=${trafficMode}`);
      if (!response.ok) throw new Error('Failed to fetch traffic data');
      return response.json();
    },
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch Chennai weather data
  const { data: weatherData, isLoading: weatherLoading, refetch: refetchWeather } = useQuery<WeatherData>({
    queryKey: ['/api/dashboard/weather'],
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRefresh = () => {
    refetchTraffic();
    refetchWeather();
    setRefreshTime(new Date());
  };

  const formatLastUpdated = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMs = now.getTime() - updated.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const dashboardSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Chennai Live Traffic Dashboard - Real-Time Road Conditions | Traffic Impact Calculator",
    "description": "Intelligent Chennai traffic monitoring dashboard with weather impact analysis, real-time road conditions, contextual commute recommendations, financial insights, and smart weather-traffic integration. Advanced analytics for Chennai commuters with cost savings.",
    "keywords": "Chennai traffic weather impact, intelligent weather traffic analysis, Chennai weather commute impact, weather-aware traffic planning, Chennai traffic dashboard, live traffic Chennai weather, Chennai weather traffic delays, contextual traffic recommendations, Chennai traffic monitoring weather, weather traffic intelligence, Chennai weather-based traffic advice, real-time weather traffic analysis, Chennai financial insights, Chennai commute cost, Chennai transport cost analysis, Chennai cost savings, Chennai monthly commute cost, Chennai financial dashboard, Chennai commute budget optimization",
    "about": {
      "@type": "Thing",
      "name": "Chennai Traffic Monitoring System",
      "description": "Intelligent weather-aware traffic monitoring system for Chennai providing live updates on road conditions, weather impact analysis, contextual commute recommendations, and smart traffic insights across major routes including Anna Salai, OMR, GST Road, and key junctions."
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://chennaitrafficcalc.in/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Chennai Traffic Dashboard",
          "item": "https://chennaitrafficcalc.in/dashboard"
        }
      ]
    },
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "Chennai Traffic Dashboard",
      "description": "Intelligent Chennai traffic monitoring dashboard with weather impact analysis, real-time road conditions, contextual recommendations, and smart weather-traffic integration",
      "applicationCategory": "Traffic Monitoring Application",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "featureList": [
        "Intelligent weather impact analysis",
        "Real-time Chennai traffic monitoring",
        "Contextual commute recommendations",
        "Weather-aware traffic planning",
        "Live road condition updates",
        "Traffic chokepoint analysis",
        "Commute pattern insights", 
        "Chennai weather integration",
        "Dual-mode traffic analysis",
        "Major road segment monitoring",
        "Junction traffic analysis",
        "Smart weather-traffic insights",
        "Monthly commute cost analysis",
        "Financial insights and cost savings",
        "Transport cost per kilometer calculation",
        "Money-saving route alternatives",
        "Real-time financial dashboard",
        "Chennai commute budget optimization"
      ]
    },
    "geo": {
      "@type": "Place",
      "name": "Chennai",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Chennai",
        "addressRegion": "Tamil Nadu",
        "addressCountry": "India"
      }
    }
  };

  return (
    <>
      <SEO 
        title="Chennai Live Traffic Dashboard - Real-Time Traffic & Financial Insights | Chennai Traffic Impact Calculator"
        description="Advanced Chennai traffic dashboard with intelligent weather impact analysis, real-time road conditions, financial insights, and cost-saving recommendations. Monitor live traffic on Anna Salai, OMR, GST Road with monthly commute cost analysis and budget optimization."
        canonical="https://chennaitrafficcalc.in/dashboard"
        keywords="Chennai traffic weather impact, intelligent weather traffic analysis, Chennai weather commute impact, weather-aware traffic planning, Chennai traffic dashboard, live traffic Chennai weather, Chennai weather traffic delays, contextual traffic recommendations, Chennai traffic monitoring weather, Anna Salai weather traffic, OMR weather conditions, GST Road weather impact, Chennai commute weather insights, weather traffic intelligence, Chennai weather-based traffic advice, real-time weather traffic analysis, Chennai traffic weather integration, smart weather commute planning, Chennai financial insights, Chennai commute cost, Chennai transport cost analysis, Chennai cost savings, Chennai monthly commute cost, Chennai financial dashboard, Chennai commute budget optimization"
        structuredData={dashboardSchema}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Navigation className="w-8 h-8 text-primary" />
                  Chennai Live Traffic Dashboard
                </h1>
                <p className="mt-2 text-gray-600">
                  Real-time Chennai traffic monitoring with live road conditions, traffic jams on Anna Salai, OMR, GST Road, and key junctions like Kathipara. Get instant traffic updates and weather for better commute planning.
                </p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Last refreshed: {refreshTime.toLocaleTimeString()} • Real-time Chennai traffic data updated every 5 minutes
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Commute Insights */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Commute Insights
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Data from existing calculator submissions by Chennai commuters
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Average Score */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        Average Impact Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {commuteLoading ? (
                        <Skeleton className="h-8 w-12" />
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-gray-900">
                            {commuteData?.averageScore?.toFixed(1) || '0'}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Higher score = worse impact
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Average Distance */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Route className="w-4 h-4" />
                        Average Distance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {commuteLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-gray-900">
                            {commuteData?.averageDistance?.toFixed(1) || '0'} km
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Per trip
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Total Calculations */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Total Calculations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {commuteLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <>
                          <div className="text-2xl font-bold text-gray-900">
                            {commuteData?.totalCalculations || 0}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Commute assessments
                          </p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Financial Insights */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    Financial Insights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {financialLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg">
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <PiggyBank className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Total Monthly Cost</span>
                            <div className="relative group">
                              <div className="w-3 h-3 rounded-full bg-green-600 text-white text-xs flex items-center justify-center cursor-help">?</div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Combined monthly transport expenses of all Chennai commuters using our calculator
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-green-900">
                            ₹{formatNumber(Math.round(financialData?.totalMonthlyCost || 0))}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Potential Savings</span>
                            <div className="relative group">
                              <div className="w-3 h-3 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center cursor-help">?</div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Money Chennai commuters could save by adopting recommended transport alternatives
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-blue-900">
                            ₹{formatNumber(Math.round(financialData?.potentialSavings || 0))}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Car className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">Avg Cost/km</span>
                            <div className="relative group">
                              <div className="w-3 h-3 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center cursor-help">?</div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Average transport cost per kilometer calculated from all Chennai commute data
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-purple-900">
                            ₹{(Number(financialData?.costEfficiencyMetrics?.avgCostPerKm) || 0).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium text-orange-800">Most Expensive Mode</span>
                            <div className="relative group">
                              <div className="w-3 h-3 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center cursor-help">?</div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                Transport mode with highest average monthly cost among Chennai calculator users
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-orange-900">
                            {(financialData?.avgCostByTransportMode?.[0]?.mode || 'N/A').charAt(0).toUpperCase() + (financialData?.avgCostByTransportMode?.[0]?.mode || 'N/A').slice(1).toLowerCase()}
                          </div>
                          <div className="text-xs text-orange-700">
                            ₹{formatNumber(Math.round(financialData?.avgCostByTransportMode?.[0]?.avgCost || 0))} monthly average
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Real-Time Traffic Insights */}
            <div className="space-y-6">
              {/* Traffic Conditions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                    Real-Time Traffic Insights
                  </h2>
                  
                  {/* Traffic Mode Toggle */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Database className="w-4 h-4" />
                      <span>Calculator Routes</span>
                    </div>
                    <Switch
                      checked={trafficMode === 'holistic'}
                      onCheckedChange={(checked) => setTrafficMode(checked ? 'holistic' : 'calculator')}
                      className="data-[state=checked]:bg-primary"
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>City-wide</span>
                    </div>
                  </div>
                </div>

                {/* Roads to Avoid */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Roads to Avoid Right Now
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {trafficMode === 'calculator' 
                      ? 'Live analysis of actual user commute routes - showing specific road segments with delays above 10% compared to normal conditions on Anna Salai, OMR, GST Road, and key junctions'
                      : 'Comprehensive city-wide Chennai traffic analysis using Google Maps - monitoring 20 major roads including Anna Salai, OMR, GST Road, Kathipara Junction, and Koyambedu for all traffic conditions'
                    }
                  </p>
                  <div className="space-y-2">
                    {trafficLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))
                    ) : (
                      trafficData?.worstRoads.map((road, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-900">{road.road}</span>
                            <p className="text-sm text-gray-600">{road.delay}</p>
                          </div>
                          <Badge className={getSeverityColor(road.severity)}>
                            {road.severity.toUpperCase()}
                          </Badge>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">Loading traffic data...</p>
                      )
                    )}
                  </div>
                  {trafficData?.lastUpdated && (
                    <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last updated: {formatLastUpdated(trafficData.lastUpdated)}
                    </p>
                  )}
                </div>

                {/* Traffic Chokepoints */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Current Traffic Chokepoints
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {trafficMode === 'calculator' 
                      ? 'Precise intersection-level analysis from most-traveled user routes - showing exact chokepoints with 30%+ delays on Anna Salai, OMR, GST Road, and actionable alternatives'
                      : 'Major Chennai intersections and junctions with significant traffic delays - Kathipara Junction, Koyambedu, Madhya Kailash, and other key points identified through comprehensive city-wide monitoring'
                    }
                  </p>
                  <div className="space-y-2">
                    {trafficLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))
                    ) : (
                      trafficData?.chokepoints.map((chokepoint, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{chokepoint.location}</span>
                            <Badge className={getSeverityColor(chokepoint.severity)}>
                              {chokepoint.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{chokepoint.description}</p>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">Loading chokepoint data...</p>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Weather Widget */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  Chennai Weather at a Glance
                </h3>
                {weatherLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                ) : weatherData ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-3xl font-bold text-gray-900">
                          {weatherData.temperature}°C
                        </div>
                        <p className="text-gray-600 capitalize">{weatherData.condition}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600">Humidity</p>
                        <p className="font-semibold text-gray-900">{weatherData.humidity}%</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-600">Wind Speed</p>
                        <p className="font-semibold text-gray-900">{weatherData.windSpeed} km/h</p>
                      </div>
                    </div>
                    {weatherData.lastUpdated && (
                      <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last updated: {formatLastUpdated(weatherData.lastUpdated)}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Weather data unavailable</p>
                )}
              </div>

              {/* Weather Impact on Traffic Overlay */}
              <div className="mt-6">
                <WeatherImpactOverlay />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}