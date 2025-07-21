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

        {/* Main dashboard content would continue here - simplified for now */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600">Dashboard content loading...</p>
          </div>
        </div>
      </div>
    </>
  );
}