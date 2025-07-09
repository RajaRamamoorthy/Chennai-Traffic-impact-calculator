import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Database, MapPin, Zap } from "lucide-react";
import { SEO } from "@/components/seo";

export default function Methodology() {
  const methodologySchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "Chennai Traffic Impact Calculator Methodology",
    "description": "Scientific methodology behind calculating traffic impact scores in Chennai",
    "author": {
      "@type": "Organization",
      "name": "Chennai Traffic Impact Calculator"
    },
    "datePublished": "2025-01-09",
    "dateModified": "2025-01-09",
    "keywords": "traffic impact methodology, emission calculation, congestion formula, Chennai traffic science"
  };

  return (
    <>
      <SEO
        title="Methodology"
        description="Understand the scientific methodology behind our Chennai traffic impact calculations. Learn about emission factors, congestion formulas, and scoring algorithms."
        keywords="Chennai traffic methodology, traffic impact formula, emission calculation method, congestion scoring algorithm, transport impact science"
        canonical="https://chennaitrafficcalc.in/methodology"
        structuredData={methodologySchema}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Our Methodology
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Understanding the science behind our traffic impact calculations. 
            Our methodology combines real-world data with proven algorithms to 
            provide accurate assessments.
          </p>
        </div>
      </section>

      {/* Core Components */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Calculation Components
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <Calculator className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Vehicle Impact Score
                </h3>
                <p className="text-slate-600 mb-4">
                  Base impact calculated using vehicle emission factors, adjusted by occupancy:
                </p>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
                  vehicleImpact = max(5, baseScore / occupancy)
                </div>
                <p className="text-slate-600 mt-4">
                  Different vehicle types have different base impact scores based on their 
                  emission factors and efficiency in Chennai traffic conditions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <MapPin className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Route Congestion Factor
                </h3>
                <p className="text-slate-600 mb-4">
                  Distance-based congestion impact with Chennai-specific adjustments:
                </p>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
                  congestion = min(40, 10 + (distance * 1.5))
                </div>
                <p className="text-slate-600 mt-4">
                  Longer routes through Chennai's congested areas contribute more to 
                  overall traffic problems and receive higher impact scores.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Zap className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Time-Based Penalties
                </h3>
                <p className="text-slate-600 mb-4">
                  Peak hour travel receives additional impact penalties:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Morning Peak (7-10 AM): +25 points</li>
                  <li>• Evening Peak (5-8 PM): +30 points</li>
                  <li>• Off-Peak Hours: 0 points</li>
                  <li>• Night Hours (10 PM-6 AM): -10 points</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Database className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Occupancy Benefits
                </h3>
                <p className="text-slate-600 mb-4">
                  Carpooling and shared transport reduce per-person impact:
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Solo travel: No bonus</li>
                  <li>• 2 people: -10 points</li>
                  <li>• 3 people: -15 points</li>
                  <li>• 4+ people: -20 points</li>
                  <li>• Public transport: Automatic occupancy benefits</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Score Calculation */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Final Score Calculation
          </h2>
          
          <Card>
            <CardContent className="p-8">
              <p className="text-slate-600 mb-6">
                Your final traffic impact score combines all components:
              </p>
              
              <div className="bg-slate-100 p-6 rounded-lg font-mono text-sm mb-6">
                <div>score = vehicleImpact</div>
                <div className="ml-8">+ routeCongestion</div>
                <div className="ml-8">+ timingPenalty</div>
                <div className="ml-8">- occupancyBonus</div>
                <div className="mt-2">finalScore = max(0, min(100, score))</div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900">Score Interpretation:</h4>
                  <ul className="mt-2 space-y-1 text-slate-600">
                    <li>• 0-25: Low impact - You're part of the solution!</li>
                    <li>• 26-50: Moderate impact - Room for improvement</li>
                    <li>• 51-75: High impact - Consider alternatives</li>
                    <li>• 76-100: Very high impact - Significant contributor to congestion</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Confidence Levels */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Confidence Levels
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="bg-green-100 text-green-800 font-bold text-lg w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  A
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">High Confidence</h3>
                <p className="text-slate-600 text-sm">
                  Complete data with specific vehicle type, exact route, and real-time traffic information.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="bg-yellow-100 text-yellow-800 font-bold text-lg w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  B
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Medium Confidence</h3>
                <p className="text-slate-600 text-sm">
                  Some assumptions made about vehicle type or route specifics based on category averages.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="bg-red-100 text-red-800 font-bold text-lg w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  C
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Lower Confidence</h3>
                <p className="text-slate-600 text-sm">
                  Significant estimations required due to limited data or use of public transport defaults.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="py-16 px-4 bg-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Limitations & Assumptions
          </h2>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <ul className="space-y-4 text-slate-600">
              <li>
                <strong>Average conditions:</strong> Calculations assume typical weather and 
                traffic conditions. Extreme events like floods or strikes aren't factored in.
              </li>
              <li>
                <strong>Vehicle maintenance:</strong> We assume vehicles are maintained to 
                manufacturer standards. Poorly maintained vehicles may have higher emissions.
              </li>
              <li>
                <strong>Driving behavior:</strong> Calculations use average driving patterns. 
                Aggressive driving or frequent stops increase actual impact.
              </li>
              <li>
                <strong>Infrastructure changes:</strong> New roads, metro extensions, or traffic 
                management changes may not be immediately reflected in calculations.
              </li>
              <li>
                <strong>Seasonal variations:</strong> Festival seasons, school holidays, and 
                monsoons can significantly affect traffic patterns beyond our model.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}