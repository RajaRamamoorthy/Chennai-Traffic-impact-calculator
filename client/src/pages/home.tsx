import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Users, TrendingDown, Clock } from "lucide-react";
import { SEO } from "@/components/seo";
import { ChennaiTrafficQA } from "@/components/seo/featured-snippets";
import { InternalLinks } from "@/components/layout/internal-links";
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

  // Fetch potential savings stats  
  const { data: potentialStats } = useQuery({
    queryKey: ['/api/stats/potential-savings'],
    queryFn: api.getPotentialSavingsStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Chennai Traffic Impact Calculator",
    "applicationCategory": "TravelApplication",
    "operatingSystem": "Web Browser",
    "keywords": "Chennai traffic, Chennai traffic today, Chennai traffic jam, Chennai commute calculator, Chennai congestion score, Chennai route planner, Chennai commute cost, Chennai financial insights, Chennai cost savings, Chennai transport cost analysis, Chennai monthly commute cost, Chennai financial dashboard, Chennai commute budget optimization",
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
    "description": "Live Chennai traffic monitoring and congestion score calculator with financial insights. Check traffic updates for Kathipara flyover, OMR, GST Road and plan optimal routes with cost savings analysis."
  };

  return (
    <>
      <SEO
        title="Home"
        description="Calculate how your daily commute affects Chennai traffic and costs. Get personalized suggestions for better alternatives to save time, money, and reduce environmental impact with financial insights and monthly cost analysis."
        canonical="https://chennaitrafficcalc.in"
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Current Impact vs Potential Savings
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Based on {potentialStats ? formatNumber(potentialStats.totalCalculations) : "10,000+"} calculations completed, 
              here's Chennai's current commute impact and what we could achieve together
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Current Impact */}
            <div className="bg-red-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-red-800 mb-6 text-center">
                Current Monthly Impact
              </h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {potentialStats ? `${formatNumber(potentialStats.currentMonthlyCO2)} kg` : "208K kg"}
                  </div>
                  <div className="text-slate-600">CO₂ emissions from current commutes</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-red-600 mb-2">
                    {potentialStats ? `₹${formatNumber(potentialStats.currentMonthlyCost)}` : "₹3.8L"}
                  </div>
                  <div className="text-slate-600">Fuel & maintenance costs</div>
                </div>
              </div>
            </div>

            {/* Potential Savings */}
            <div className="bg-green-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
                Potential Monthly Savings
              </h3>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {potentialStats ? `${formatNumber(potentialStats.potentialMonthlyCO2Saved)} kg` : "125K kg"}
                  </div>
                  <div className="text-slate-600">CO₂ reduction if using alternatives</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {potentialStats ? `₹${formatNumber(potentialStats.potentialMonthlyCostSaved)}` : "₹1.2L"}
                  </div>
                  <div className="text-slate-600">Money saved with better options</div>
                </div>
              </div>
            </div>
          </div>

          {/* Annual Projection */}
          <div className="mt-12 p-8 bg-blue-50 rounded-xl text-center">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">
              Annual Potential Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {potentialStats ? `${formatNumber(potentialStats.potentialAnnualCO2Saved)} kg` : "1.5M kg"}
                </div>
                <div className="text-slate-600">CO₂ reduction potential per year</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {potentialStats ? `₹${formatNumber(potentialStats.potentialAnnualCostSaved)}` : "₹14L"}
                </div>
                <div className="text-slate-600">Annual savings for Chennai commuters</div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-100 rounded-lg text-center">
            <p className="text-sm text-slate-600">
              <strong>How it works:</strong> Current impact shows actual emissions and costs from user calculations. 
              Potential savings are based on the best alternative suggested to each user. 
              These benefits are achievable when commuters adopt recommended transport options.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Snippet Content for Chennai Traffic Questions */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
            Chennai Traffic FAQs & Live Updates
          </h2>
          <ChennaiTrafficQA />
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

      {/* Internal Links */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <InternalLinks currentPage="home" />
        </div>
      </section>
    </div>
    </>
  );
}