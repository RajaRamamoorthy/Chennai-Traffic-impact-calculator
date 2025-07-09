
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calculator, TrendingDown, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            How It Works
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Understanding your traffic impact in Chennai is simple. Our calculator uses 
            real-time data and proven methodologies to assess your commute's effect on the city.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Simple 3-Step Process
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative">
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Enter Your Route
                </h3>
                <p className="text-slate-600">
                  Tell us your starting point and destination in Chennai. Our system 
                  uses Google Maps to calculate the most accurate route distance and 
                  identify congestion patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
                <Calculator className="w-12 h-12 text-primary mx-auto mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Choose Your Transport
                </h3>
                <p className="text-slate-600">
                  Select your mode of transportation, vehicle type, and travel patterns. 
                  We consider everything from car models to occupancy levels for 
                  accurate calculations.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
                <TrendingDown className="w-12 h-12 text-primary mx-auto mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Get Your Impact Score
                </h3>
                <p className="text-slate-600">
                  Receive a comprehensive report showing your traffic impact score, 
                  environmental footprint, costs, and personalized recommendations 
                  for better alternatives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Analyze Section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            What We Analyze
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Traffic Factors</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Route congestion levels during different times
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Vehicle type and emission factors
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Peak vs off-peak timing impacts
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Occupancy and carpooling benefits
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Output Metrics</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Traffic Impact Score (0-100 scale)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Monthly CO₂ emissions estimate
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Transportation cost analysis
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Alternative transport recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Calculate Your Impact?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your calculation now and discover how you can make Chennai's 
            traffic better for everyone.
          </p>
          <Link href="/calculator">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
              Start Calculator
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
