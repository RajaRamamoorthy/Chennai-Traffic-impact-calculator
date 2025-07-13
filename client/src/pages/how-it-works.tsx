import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calculator, TrendingDown, ArrowRight } from "lucide-react";
import { SEO } from "@/components/seo";
import { useEffect } from "react";

export default function HowItWorks() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const howItWorksSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Calculate Your Traffic Impact in Chennai",
    "description": "A simple 3-step process to understand your commute's impact on Chennai traffic",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Enter Your Route",
        "text": "Tell us your starting point and destination in Chennai"
      },
      {
        "@type": "HowToStep",
        "name": "Select Transportation",
        "text": "Choose your mode of transport, vehicle type, occupancy, and travel pattern"
      },
      {
        "@type": "HowToStep",
        "name": "Get Your Impact Score",
        "text": "Receive a detailed analysis showing your traffic impact score and suggestions"
      }
    ],
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
          "name": "How It Works",
          "item": "https://chennaitrafficcalc.in/how-it-works"
        }
      ]
    }
  };

  return (
    <>
      <SEO
        title="How It Works"
        description="Learn how the Chennai Traffic Impact Calculator works. Simple 3-step process to calculate your commute's impact on traffic congestion and environment."
        keywords="how Chennai traffic calculator works, traffic impact calculation process, commute analysis steps, Chennai transport calculator guide"
        canonical="https://chennaitrafficcalc.in/how-it-works"
        structuredData={howItWorksSchema}
      />
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
                <Calculator className="w-12 h-12 text-orange-500 mx-auto mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Select Transportation
                </h3>
                <p className="text-slate-600">
                  Choose from 6 transport modes, then select your specific vehicle type from 
                  21 categories including popular models like Swift, Activa, Creta, and more. 
                  Select your travel pattern (daily commute, occasional trips, etc.) for accurate impact calculation.
                </p>
              </CardContent>
            </Card>

            <Card className="relative">
              <CardContent className="p-8 text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
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
                  3
                </div>
                <TrendingDown className="w-12 h-12 text-green-500 mx-auto mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Get Your Impact Score
                </h3>
                <p className="text-slate-600">
                  Receive a detailed analysis showing your traffic impact score, 
                  environmental footprint, and personalized suggestions for reducing 
                  your impact.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Link href="/calculator">
              <Button size="lg" className="group">
                Start Calculator 
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What We Calculate */}
      <section id="what-we-calculate" className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            What We Calculate
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Traffic Impact Score</h3>
              <p className="text-slate-600 text-sm">
                A score from 0-100 representing your contribution to Chennai traffic congestion.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">CO2 Emissions</h3>
              <p className="text-slate-600 text-sm">
                Monthly carbon dioxide emissions from your commute in kilograms.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Cost Analysis</h3>
              <p className="text-slate-600 text-sm">
                Monthly transportation costs including fuel, fares, and vehicle maintenance.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Time Investment</h3>
              <p className="text-slate-600 text-sm">
                Total monthly hours spent commuting on your chosen route.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Why Your Score Matters
          </h2>
          
          <div className="space-y-6 text-slate-600">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Personal Impact</h3>
              <p>
                Understanding your traffic impact helps you make informed decisions about 
                your daily commute, potentially saving time, money, and reducing stress.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Environmental Responsibility</h3>
              <p>
                Chennai faces significant air quality challenges. By knowing your emissions, 
                you can contribute to cleaner air and a healthier city for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">City-Wide Benefits</h3>
              <p>
                When more people choose sustainable transportation options based on data, 
                it reduces overall traffic congestion, making Chennai more livable for all.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}