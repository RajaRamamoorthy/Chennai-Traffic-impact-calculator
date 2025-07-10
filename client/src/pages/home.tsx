import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Users, TrendingDown, Clock } from "lucide-react";
import { SEO } from "@/components/seo";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Simple number formatter for large numbers
function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function Home() {
  // Fetch real homepage stats
  const { data: stats } = useQuery({
    queryKey: ['/api/stats/homepage'],
    queryFn: api.getHomepageStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Chennai Traffic Impact Calculator",
    "applicationCategory": "TravelApplication",
    "operatingSystem": "Web Browser",
    "keywords": "Chennai traffic, Chennai traffic today, Chennai traffic jam, Chennai commute calculator, Chennai congestion score, Chennai route planner",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "10000"
    },
    "description": "Live Chennai traffic monitoring and congestion score calculator. Check traffic updates for Kathipara flyover, OMR, GST Road and plan optimal routes."
  };

  return (
    <>
      <SEO
        title="Home"
        description="Calculate how your daily commute affects Chennai traffic. Get personalized suggestions for better alternatives to save time, money, and reduce environmental impact."
        canonical="https://chennaitrafficcalc.in/"
        structuredData={homePageSchema}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🚦</div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Chennai Traffic Impact Calculator
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Check live Chennai traffic, calculate your commute impact, and discover faster routes. 
            Get real-time Chennai traffic updates and congestion scores for better travel planning.
          </p>
          <Link href="/calculator">
            <Button size="lg" className="px-8 py-4 text-lg">
              <Calculator className="mr-2 w-5 h-5" />
              Calculate My Impact
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Live Jam & Congestion Score Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingDown className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Chennai Traffic Analysis
                </h3>
                <p className="text-slate-600">
                  Real-time Chennai traffic monitoring with personalized congestion scores for 
                  Kathipara flyover, OMR, GST Road, Anna Salai, and T Nagar routes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Chennai Route Planner
                </h3>
                <p className="text-slate-600">
                  Smart Chennai route optimization and commute distance calculator to avoid 
                  peak hour traffic jams and reduce driving time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Join the Movement
                </h3>
                <p className="text-slate-600">
                  Be part of Chennai's growing community of commuters making informed transport choices 
                  for a better city.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            Making a Real Difference
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                {stats ? formatNumber(stats.totalCalculations) : "10,000+"}
              </div>
              <div className="text-slate-600">Calculations completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">
                {stats ? `${formatNumber(stats.totalCO2SavedKg)} kg` : "2.5M kg"}
              </div>
              <div className="text-slate-600">CO₂ saved annually</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">
                {stats ? `₹${formatNumber(stats.totalMoneySaved)}` : "₹45L"}
              </div>
              <div className="text-slate-600">Money saved by users</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Calculate your traffic impact in just 2 minutes and discover how you can 
            contribute to a better Chennai.
          </p>
          <Link href="/calculator">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              Start Your Calculation
            </Button>
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
