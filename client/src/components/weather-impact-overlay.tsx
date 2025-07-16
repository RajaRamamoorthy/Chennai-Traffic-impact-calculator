import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Eye, 
  Thermometer, 
  AlertTriangle,
  Info,
  Clock,
  MapPin
} from "lucide-react";

interface WeatherImpact {
  severity: 'low' | 'medium' | 'high' | 'critical';
  impactScore: number;
  primaryFactor: string;
  description: string;
  recommendations: string[];
  affectedAreas: string[];
  estimatedDelay: string;
  icon: string;
  color: string;
}

export function WeatherImpactOverlay() {
  const { data: impactData, isLoading, error } = useQuery<WeatherImpact>({
    queryKey: ['/api/dashboard/weather-impact'],
    refetchInterval: 30 * 60 * 1000, // 30 minutes
  });

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CloudRain className="w-5 h-5" />
            Weather Impact on Traffic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !impactData) {
    return (
      <Card className="border-l-4 border-l-gray-500">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CloudRain className="w-5 h-5" />
            Weather Impact on Traffic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            Weather impact analysis unavailable
          </p>
        </CardContent>
      </Card>
    );
  }

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          borderColor: 'border-l-red-600',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          badgeColor: 'bg-red-100 text-red-800 border-red-200',
          icon: AlertTriangle
        };
      case 'high':
        return {
          borderColor: 'border-l-orange-500',
          bgColor: 'bg-orange-50',
          textColor: 'text-orange-800',
          badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: AlertTriangle
        };
      case 'medium':
        return {
          borderColor: 'border-l-yellow-500',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: Info
        };
      default:
        return {
          borderColor: 'border-l-green-500',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          badgeColor: 'bg-green-100 text-green-800 border-green-200',
          icon: Sun
        };
    }
  };

  const config = getSeverityConfig(impactData.severity);
  const SeverityIcon = config.icon;

  return (
    <Card className={`border-l-4 ${config.borderColor} ${config.bgColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CloudRain className="w-5 h-5" />
            Weather Impact on Traffic
          </CardTitle>
          <Badge className={config.badgeColor}>
            {impactData.severity.charAt(0).toUpperCase() + impactData.severity.slice(1)} Impact
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Impact Overview */}
        <Alert className={`border-l-4 ${config.borderColor} ${config.bgColor}`}>
          <SeverityIcon className="h-4 w-4" />
          <AlertDescription className={config.textColor}>
            <div className="font-medium mb-1">{impactData.primaryFactor}</div>
            <div className="text-sm">{impactData.description}</div>
          </AlertDescription>
        </Alert>

        {/* Impact Metrics */}
        <div className="space-y-4">
          <div className="bg-white/70 p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Weather Impact Level</span>
              </div>
              <Badge className={config.badgeColor}>
                {impactData.severity.charAt(0).toUpperCase() + impactData.severity.slice(1)}
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  impactData.severity === 'critical' ? 'bg-red-500' :
                  impactData.severity === 'high' ? 'bg-orange-500' :
                  impactData.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(impactData.impactScore, 100)}%` }}
              ></div>
            </div>
            
            {/* Score Explanation */}
            <div className="text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>
                  {impactData.impactScore < 15 ? 'Minimal impact on your commute' :
                   impactData.impactScore < 30 ? 'Some delays possible' :
                   impactData.impactScore < 50 ? 'Significant delays expected' :
                   'Major traffic disruption likely'}
                </span>
                <span className="font-medium text-gray-800">{impactData.impactScore}/100</span>
              </div>
            </div>
          </div>

          <div className="bg-white/70 p-3 rounded-lg border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Expected Additional Travel Time</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {impactData.estimatedDelay}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {impactData.impactScore < 15 ? 'Normal conditions' :
               impactData.impactScore < 30 ? 'Plan a bit extra time' :
               impactData.impactScore < 50 ? 'Leave significantly earlier' :
               'Consider delaying travel if possible'}
            </div>
          </div>
        </div>

        {/* Affected Areas */}
        {impactData.affectedAreas.length > 0 && (
          <div className="bg-white/70 p-3 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Most Affected Areas</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {impactData.affectedAreas.map((area, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-white/50"
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {impactData.recommendations.length > 0 && (
          <div className="bg-white/70 p-3 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Recommendations</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-1">
              {impactData.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Impact Score Legend */}
        <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 space-y-1">
          <div className="font-medium text-gray-700 mb-2">Understanding Impact Levels:</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>0-15: Normal conditions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>15-30: Minor delays</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span>30-50: Significant impact</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>50+: Major disruption</span>
            </div>
          </div>
          <div className="text-center pt-2 border-t border-gray-200 mt-2">
            Live analysis based on current Chennai weather conditions & traffic patterns
          </div>
        </div>
      </CardContent>
    </Card>
  );
}