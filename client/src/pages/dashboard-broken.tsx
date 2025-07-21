import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { SEO } from "@/components/seo";
import { DynamicCanonical } from "@/components/seo/dynamic-canonical";
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

  const dashboardSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Chennai Traffic Dashboard - Real-Time Traffic & Financial Insights",
    "description": "Live Chennai traffic dashboard with real-time congestion data, commute financial insights, weather impact analysis, and traffic chokepoint monitoring for optimal route planning.",
    "url": "https://chennaitrafficcalc.in/dashboard",
    "license": "https://chennaitrafficcalc.in/terms-conditions",
    "mainEntity": {
      "@type": "Dataset",
      "name": "Chennai Traffic Real-Time Data",
      "description": "Live traffic congestion data, commute costs, and weather impacts for Chennai roads including OMR, GST Road, Anna Salai, and major flyovers.",
      "spatialCoverage": {
        "@type": "Place",
        "name": "Chennai, Tamil Nadu, India"
      },
      "temporalCoverage": "2024/..",
      "keywords": ["Chennai traffic", "real-time traffic data", "commute costs", "weather impact", "traffic congestion"],
      "license": "https://chennaitrafficcalc.in/terms-conditions"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://chennaitrafficcalc.in"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Dashboard",
          "item": "https://chennaitrafficcalc.in/dashboard"
        }
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

  return (
    <>
      <SEO 
        title="Chennai Live Traffic Dashboard - Real-Time Traffic & Financial Insights | Chennai Traffic Impact Calculator"
        description="Advanced Chennai traffic dashboard with intelligent weather impact analysis, real-time road conditions, financial insights, and cost-saving recommendations. Monitor live traffic on Anna Salai, OMR, GST Road with monthly commute cost analysis and budget optimization."
        canonical="https://chennaitrafficcalc.in/dashboard"
        keywords="Chennai traffic weather impact, intelligent weather traffic analysis, Chennai weather commute impact, weather-aware traffic planning, Chennai traffic dashboard, live traffic Chennai weather, Chennai weather traffic delays, contextual traffic recommendations, Chennai traffic monitoring weather, Anna Salai weather traffic, OMR weather conditions, GST Road weather impact, Chennai commute weather insights, weather traffic intelligence, Chennai weather-based traffic advice, real-time weather traffic analysis, Chennai traffic weather integration, smart weather commute planning, Chennai financial insights, Chennai commute cost, Chennai transport cost analysis, Chennai cost savings, Chennai monthly commute cost, Chennai financial dashboard, Chennai commute budget optimization"
        structuredData={dashboardSchema}
      />
      <DynamicCanonical canonicalUrl="https://chennaitrafficcalc.in/dashboard" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header Section with static SEO content */}
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
                {/* Static content for crawlers */}
                <div className="mt-4 prose prose-sm text-gray-600">
                  <p>
                    Monitor live Chennai traffic conditions including Anna Salai traffic jams, OMR rush hour delays, GST Road congestion, and Kathipara Junction bottlenecks. 
                    Our intelligent dashboard combines real-time traffic data with weather impact analysis to provide comprehensive commute insights and cost-saving recommendations.
                  </p>
                  <p>
                    Features include: Real-time traffic monitoring for major Chennai roads, weather impact analysis on traffic conditions, 
                    financial insights for commute cost optimization, and personalized recommendations for route planning.
                  </p>
                </div>
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
            
            {/* Left Column: Commute & Financial Insights */}
            <div className="space-y-6">
              {/* Commute Insights */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Commute Insights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        Average Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {commuteLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <div className="text-2xl font-bold text-gray-900">
                          {commuteData?.averageScore?.toFixed(1) || '0'}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
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
                        <div className="text-2xl font-bold text-gray-900">
                          {commuteData?.averageDistance?.toFixed(1) || '0'} km
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Total Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {commuteLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <div className="text-2xl font-bold text-gray-900">
                          {commuteData?.totalCalculations || 0}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Financial Insights */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <IndianRupee className="w-6 h-6 text-primary" />
                  Financial Insights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PiggyBank className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Total Monthly Savings</span>
                    </div>
                    <div className="text-lg font-bold text-blue-900">
                      ₹{financialLoading ? '...' : formatNumber(financialData?.potentialSavings || 0)}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Avg Monthly Cost</span>
                    </div>
                    <div className="text-lg font-bold text-green-900">
                      ₹{financialLoading ? '...' : formatNumber(financialData?.totalMonthlyCost || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Traffic & Weather */}
            <div className="space-y-6">
              {/* Traffic Conditions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                    Real-Time Traffic
                  </h2>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Calculator Routes</span>
                    <Switch
                      checked={trafficMode === 'holistic'}
                      onCheckedChange={(checked) => setTrafficMode(checked ? 'holistic' : 'calculator')}
                    />
                    <span className="text-sm text-gray-600">City-wide</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Roads to Avoid</h3>
                  {trafficLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))
                  ) : (
                    trafficData?.worstRoads?.map((road, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">{road.road}</span>
                          <p className="text-sm text-gray-600">{road.delay}</p>
                        </div>
                        <Badge className={getSeverityColor(road.severity)}>
                          {road.severity.toUpperCase()}
                        </Badge>
                      </div>
                    )) || <p className="text-gray-500 text-center py-4">Loading traffic data...</p>
                  )}
                </div>
              </div>

              {/* Weather Widget */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-primary" />
                  Chennai Weather
                </h3>
                {weatherLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : weatherData ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{weatherData.temperature}°C</div>
                      <p className="text-sm text-gray-600">{weatherData.condition}</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p>Humidity: {weatherData.humidity}%</p>
                      <p>Visibility: {weatherData.visibility} km</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Weather data unavailable</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}