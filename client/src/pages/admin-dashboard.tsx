import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/seo";
import { 
  BarChart3, 
  Users, 
  Calculator, 
  MapPin, 
  MessageSquare, 
  Star, 
  DollarSign, 
  TrendingUp,
  Lock,
  Shield,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

interface AdminStats {
  totalCalculations: number;
  totalUsers: number;
  avgImpactScore: number;
  avgCommuteDistance: number;
  totalFeedback: number;
  avgRating: number;
  totalDonations: number;
  totalDonationAmount: number;
  totalContactSubmissions: number;
}

interface RouteData {
  origin: string;
  destination: string;
  count: number;
  avgScore: number;
}

interface VehicleData {
  vehicleName: string;
  category: string;
  count: number;
  avgScore: number;
}

interface TravelPatternData {
  pattern: string;
  count: number;
  avgScore: number;
}

interface ScoreDistribution {
  scoreRange: string;
  count: number;
}

interface Calculation {
  id: number;
  transportMode: string;
  origin: string;
  destination: string;
  impactScore: number;
  distanceKm: string;
  travelPattern: string;
  createdAt: string;
}

interface DailyTrend {
  date: string;
  count: number;
  avgScore: number;
}

export function AdminDashboard() {
  const [adminKey, setAdminKey] = useState(localStorage.getItem('admin-key') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (adminKey) {
      setIsAuthenticated(true);
      localStorage.setItem('admin-key', adminKey);
    }
  }, [adminKey]);

  const createAuthenticatedQuery = (endpoint: string, label: string) => {
    return useQuery({
      queryKey: [endpoint],
      queryFn: async () => {
        const response = await fetch(`/api/admin/${endpoint}`, {
          headers: { 'x-admin-key': adminKey }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch ${label}`);
        }
        return response.json();
      },
      enabled: isAuthenticated && !!adminKey,
      refetchInterval: 5 * 60 * 1000, // 5 minutes
    });
  };

  const dashboardStats = createAuthenticatedQuery('dashboard-stats', 'dashboard stats');
  const topRoutes = createAuthenticatedQuery('top-routes?limit=10', 'top routes');
  const vehicleUsage = createAuthenticatedQuery('vehicle-usage', 'vehicle usage');
  const travelPatterns = createAuthenticatedQuery('travel-patterns', 'travel patterns');
  const scoreDistribution = createAuthenticatedQuery('score-distribution', 'score distribution');
  const recentCalculations = createAuthenticatedQuery('recent-calculations?limit=15', 'recent calculations');
  const dailyTrends = createAuthenticatedQuery('daily-trends?days=14', 'daily trends');

  const handleLogin = () => {
    if (adminKey.trim()) {
      setIsAuthenticated(true);
      localStorage.setItem('admin-key', adminKey);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    localStorage.removeItem('admin-key');
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100).toLocaleString('en-IN')}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <SEO title="Admin Dashboard - Private Access" noindex={true} />
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Enter admin key to access dashboard</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Admin Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} disabled={!adminKey.trim()} className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Access Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO title="Admin Dashboard - Chennai Traffic Calculator" noindex={true} />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Chennai Traffic Impact Calculator Analytics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {dashboardStats.isLoading && (
          <Alert className="mb-6">
            <AlertDescription>Loading dashboard data...</AlertDescription>
          </Alert>
        )}

        {/* Error State */}
        {dashboardStats.error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
            <AlertDescription className="text-red-800 dark:text-red-200">
              Failed to load dashboard data. Please check your admin key and try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Overview Stats */}
        {dashboardStats.data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Calculations</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.data.totalCalculations.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Impact assessments completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.data.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Average: {Math.round(dashboardStats.data.totalCalculations / Math.max(1, dashboardStats.data.totalUsers))} calcs/user</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Impact Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.data.avgImpactScore}/100</div>
                <p className="text-xs text-muted-foreground">Avg distance: {dashboardStats.data.avgCommuteDistance} km</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardStats.data.totalDonationAmount)}</div>
                <p className="text-xs text-muted-foreground">{dashboardStats.data.totalDonations} contributions</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Secondary Stats */}
        {dashboardStats.data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Feedback</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.data.totalFeedback}</div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.data.avgRating > 0 && (
                    <>Average rating: {dashboardStats.data.avgRating}/5 <Star className="inline h-3 w-3" /></>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.data.totalContactSubmissions}</div>
                <p className="text-xs text-muted-foreground">Support inquiries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.data.totalCalculations > 0 
                    ? Math.round((dashboardStats.data.totalFeedback / dashboardStats.data.totalCalculations) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Feedback completion rate</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Top Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topRoutes.data && topRoutes.data.length > 0 ? (
                <div className="space-y-3">
                  {topRoutes.data.slice(0, 8).map((route: RouteData, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {truncateText(route.origin, 25)} → {truncateText(route.destination, 25)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {route.count} calculations • Avg score: {Math.round(route.avgScore)}
                        </p>
                      </div>
                      <Badge variant="secondary">{route.count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No route data available</p>
              )}
            </CardContent>
          </Card>

          {/* Vehicle Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Vehicle Types</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicleUsage.data && vehicleUsage.data.length > 0 ? (
                <div className="space-y-3">
                  {vehicleUsage.data.slice(0, 8).map((vehicle: VehicleData, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {vehicle.vehicleName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {vehicle.category} • Avg score: {Math.round(vehicle.avgScore)}
                        </p>
                      </div>
                      <Badge variant="secondary">{vehicle.count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No vehicle data available</p>
              )}
            </CardContent>
          </Card>

          {/* Travel Patterns */}
          <Card>
            <CardHeader>
              <CardTitle>Travel Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              {travelPatterns.data && travelPatterns.data.length > 0 ? (
                <div className="space-y-3">
                  {travelPatterns.data.map((pattern: TravelPatternData, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {pattern.pattern.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Avg score: {Math.round(pattern.avgScore)}
                        </p>
                      </div>
                      <Badge variant="secondary">{pattern.count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No travel pattern data available</p>
              )}
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {scoreDistribution.data && scoreDistribution.data.length > 0 ? (
                <div className="space-y-3">
                  {scoreDistribution.data.map((score: ScoreDistribution, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {score.scoreRange}
                        </p>
                      </div>
                      <Badge variant="secondary">{score.count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No score distribution data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Calculations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Calculations</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCalculations.data && recentCalculations.data.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="space-y-2">
                  {recentCalculations.data.slice(0, 10).map((calc: Calculation) => (
                    <div key={calc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {calc.transportMode} • Score: {calc.impactScore} • {calc.distanceKm} km
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {truncateText(calc.origin, 30)} → {truncateText(calc.destination, 30)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{calc.travelPattern}</Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(calc.createdAt), 'MMM d, HH:mm')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No recent calculations available</p>
            )}
          </CardContent>
        </Card>

        {/* Daily Trends */}
        {dailyTrends.data && dailyTrends.data.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Daily Activity Trends (Last 14 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dailyTrends.data.map((trend: DailyTrend, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {format(new Date(trend.date), 'EEEE, MMM d')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Avg score: {Math.round(trend.avgScore)}
                      </p>
                    </div>
                    <Badge variant="secondary">{trend.count} calculations</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}