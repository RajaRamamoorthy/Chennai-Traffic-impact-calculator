import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Users, TrendingDown, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🚦</div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Chennai Traffic Impact Calculator
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Understand how your daily commute affects Chennai's traffic and discover better alternatives 
            to save time, money, and reduce environmental impact.
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
            Why Calculate Your Traffic Impact?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingDown className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Reduce Your Impact
                </h3>
                <p className="text-slate-600">
                  Get personalized suggestions to lower your contribution to Chennai's traffic congestion
                  and environmental impact.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Save Time & Money
                </h3>
                <p className="text-slate-600">
                  Discover alternative routes and transportation modes that can save you hours 
                  and hundreds of rupees every month.
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
                  Be part of 10,000+ Chennai commuters making informed transport choices 
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
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-slate-600">Calculations completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">2.5M kg</div>
              <div className="text-slate-600">CO₂ saved annually</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">₹45L</div>
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
  );
}
