import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Database, MapPin, Zap } from "lucide-react";
import { SEO } from "@/components/seo";
import { useEffect } from "react";

export default function Methodology() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    "dateModified": "2025-07-10",
    "keywords": "traffic impact methodology, emission calculation, congestion formula, Chennai traffic science",
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
          "name": "Methodology",
          "item": "https://chennaitrafficcalc.in/methodology"
        }
      ]
    }
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
            Understanding the transparent methodology behind our Chennai traffic cost calculations. 
            We combine real-world Chennai data with proven financial algorithms to 
            provide accurate cost assessments, helping you make informed transport decisions 
            based on actual monetary impact rather than just environmental metrics.
          </p>
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Vehicle Classification System
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Car Categories (9 Types)
                </h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Hatchback (Swift, Baleno)</span>
                    <span className="font-mono">45 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compact Sedan (Dzire, Amaze)</span>
                    <span className="font-mono">47 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sedan (City, Verna)</span>
                    <span className="font-mono">50 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compact SUV (Brezza, Venue)</span>
                    <span className="font-mono">52 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mid-size SUV (Creta, Seltos)</span>
                    <span className="font-mono">55 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>MUV/MPV (Ertiga, Innova)</span>
                    <span className="font-mono">57 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium Sedan (Camry, Accord)</span>
                    <span className="font-mono">58 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Luxury SUV (XUV700, Fortuner)</span>
                    <span className="font-mono">65 pts</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Electric Car (Nexon EV, Tiago EV)</span>
                    <span className="font-mono">25 pts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Bike Categories (7 Types)
                </h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Scooter 100-125cc (Activa, Jupiter)</span>
                    <span className="font-mono">25 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium Scooter 150cc+ (Aerox 155)</span>
                    <span className="font-mono">28 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commuter Bike 100-150cc (Splendor)</span>
                    <span className="font-mono">22 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sports Bike 150-200cc (Pulsar 150)</span>
                    <span className="font-mono">24 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mid-capacity 200-350cc (Dominar 250)</span>
                    <span className="font-mono">26 pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High-capacity 350cc+ (Duke 390)</span>
                    <span className="font-mono">28 pts</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Electric Two-wheeler (Ather 450X)</span>
                    <span className="font-mono">12 pts</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Components */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Calculation Components
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <Calculator className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Vehicle Base Impact
                </h3>
                <p className="text-slate-600 mb-4">
                  Each vehicle type has a base impact score reflecting its environmental footprint:
                </p>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
                  baseImpact = vehicleType.impactScore
                </div>
                <p className="text-slate-600 mt-4">
                  Our database includes 21 vehicle categories with realistic emission factors. 
                  Cars range from efficient hatchbacks (45 points) to luxury SUVs (65 points), 
                  while bikes range from commuter models (22 points) to high-capacity bikes (28 points). 
                  Electric vehicles receive the lowest scores (12-25 points).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <MapPin className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Route Congestion Multiplier
                </h3>
                <p className="text-slate-600 mb-4">
                  Longer routes increase congestion impact proportionally:
                </p>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
                  congestionFactor = 1 + (distanceKm × 0.02)
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
                  Travel Pattern Multipliers
                </h3>
                <p className="text-slate-600 mb-4">
                  Travel patterns affect impact through timing and frequency multipliers:
                </p>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Timing Multipliers:</strong>
                    <ul className="space-y-1 mt-1 text-slate-600">
                      <li>• Peak hours (morning/evening): ×1.35</li>
                      <li>• Off-peak/Weekend: ×1.1</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Frequency Multipliers:</strong>
                    <ul className="space-y-1 mt-1 text-slate-600">
                      <li>• Daily commute: ×1.0</li>
                      <li>• Weekday commute: ×0.75</li>
                      <li>• Weekend commute: ×0.4</li>
                      <li>• Frequent trips: ×0.5</li>
                      <li>• Occasional trips: ×0.25</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Database className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Occupancy Division
                </h3>
                <p className="text-slate-600 mb-4">
                  Sharing your ride divides the environmental impact per person:
                </p>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm mb-4">
                  perPersonImpact = totalImpact ÷ occupancy
                </div>
                <p className="text-slate-600">
                  Examples:
                </p>
                <ul className="space-y-2 text-slate-600 mt-2">
                  <li>• Solo driver (1 person): Full impact</li>
                  <li>• 2 people sharing: Impact divided by 2</li>
                  <li>• 4 people carpooling: Impact divided by 4</li>
                  <li>• Public transport: Already optimized for sharing</li>
                </ul>
                <p className="text-slate-600 mt-4 text-sm bg-green-50 p-3 rounded border-l-4 border-green-400">
                  <strong>Key insight:</strong> Doubling occupancy halves your personal impact!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Score Calculation */}
      <section className="py-16 px-4 bg-white">
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
                <div>baseImpact = vehicleType.baseImpactScore</div>
                <div>congestionFactor = 1 + (distanceKm × 0.02)</div>
                <div>timingMultiplier = getPeakMultiplier(pattern)</div>
                <div>frequencyMultiplier = getFrequencyMultiplier(pattern)</div>
                <div className="mt-2">rawScore = (baseImpact × congestionFactor × timingMultiplier × frequencyMultiplier) ÷ occupancy</div>
                <div className="mt-2">finalScore = max(0, min(100, round(rawScore)))</div>
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

      {/* Financial Impact Calculations */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Financial Impact Calculations
          </h2>
          <p className="text-lg text-slate-600 mb-12 text-center max-w-3xl mx-auto">
            Our platform prioritizes financial impact over environmental scores, helping you understand 
            the real monetary cost of your Chennai commute with transparent, data-driven calculations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">₹</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Monthly Cost Calculation
                </h3>
                <p className="text-slate-600 mb-4">
                  Your monthly transport cost is calculated using pre-determined cost per kilometer for each vehicle type:
                </p>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm mb-4">
                  <div>totalKm = distanceKm × 2 × monthlyTrips</div>
                  <div className="mt-2">monthlyCost = (totalKm × fuelCostPerKm) ÷ occupancy</div>
                </div>
                <p className="text-slate-600 text-sm mb-4">
                  Where <strong>fuelCostPerKm</strong> includes fuel consumption, maintenance costs, 
                  and operational expenses specific to Chennai conditions, and <strong>occupancy</strong> divides cost among passengers.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Fuel Type Approach</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Instead of separately tracking petrol, diesel, and CNG, we use <strong>averaged cost per kilometer</strong> 
                    for each vehicle category based on the most common fuel type and real Chennai market conditions:
                  </p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>• <strong>Cars:</strong> Primarily petrol-based calculations (₹6.50-12.00/km)</li>
                    <li>• <strong>Two-wheelers:</strong> Petrol consumption rates (₹2.00-2.80/km)</li>
                    <li>• <strong>Auto Rickshaw:</strong> CNG-based rates (₹12.00/km)</li>
                    <li>• <strong>Electric vehicles:</strong> Electricity costs (₹0.80-2.80/km)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Cost Efficiency Metrics
                </h3>
                <p className="text-slate-600 mb-4">
                  We calculate cost per kilometer to help you compare transport efficiency:
                </p>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm mb-4">
                  <div>costPerKm = monthlyCost ÷ totalMonthlyKm</div>
                  <div className="mt-2">efficiencyRating = compareToCityAverage(costPerKm)</div>
                </div>
                <p className="text-slate-600 text-sm">
                  Efficient choices cost <strong>₹3-8/km</strong>, while inefficient choices can cost 
                  <strong>₹15-25/km</strong> in Chennai traffic conditions.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Detailed Fuel Cost Breakdown
              </h3>
              <p className="text-slate-600 mb-6">
                Here are the exact cost per kilometer values used for each vehicle type in our Chennai calculations:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Cars (Petrol-based)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Hatchback (Swift, Baleno)</span>
                      <span className="font-mono text-green-600">₹6.50/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compact Sedan (Dzire, Amaze)</span>
                      <span className="font-mono text-green-600">₹7.20/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sedan (City, Verna)</span>
                      <span className="font-mono text-yellow-600">₹8.50/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Compact SUV (Brezza, Venue)</span>
                      <span className="font-mono text-yellow-600">₹8.80/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mid-size SUV (Creta, Seltos)</span>
                      <span className="font-mono text-orange-600">₹9.20/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MUV/MPV (Ertiga, Innova)</span>
                      <span className="font-mono text-orange-600">₹9.50/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Sedan (Camry, Accord)</span>
                      <span className="font-mono text-red-600">₹10.20/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Luxury SUV (XUV700, Fortuner)</span>
                      <span className="font-mono text-red-600">₹12.00/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Electric Car (Nexon EV, Tiago EV)</span>
                      <span className="font-mono text-blue-600">₹2.80/km</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Two-Wheelers & Others</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Commuter Bike (Splendor, HF Deluxe)</span>
                      <span className="font-mono text-green-600">₹2.00/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Scooter 100-125cc (Activa, Jupiter)</span>
                      <span className="font-mono text-green-600">₹2.10/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sports Bike (Pulsar 150, FZ-S)</span>
                      <span className="font-mono text-green-600">₹2.30/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium Scooter (Aerox 155)</span>
                      <span className="font-mono text-yellow-600">₹2.40/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mid-capacity Bike (Dominar 250)</span>
                      <span className="font-mono text-yellow-600">₹2.60/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High-capacity Bike (Duke 390)</span>
                      <span className="font-mono text-orange-600">₹2.80/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Electric Two-wheeler (Ather 450X)</span>
                      <span className="font-mono text-blue-600">₹0.80/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto Rickshaw (CNG)</span>
                      <span className="font-mono text-red-600">₹12.00/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chennai Metro</span>
                      <span className="font-mono text-green-600">₹2.50/km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MTC Bus</span>
                      <span className="font-mono text-green-600">₹1.50/km</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-100 p-4 rounded-lg text-sm">
                <strong>Note:</strong> These values include fuel consumption, vehicle maintenance, 
                insurance, and operational costs specific to Chennai traffic conditions. Electric vehicle 
                costs include electricity charges and lower maintenance expenses.
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
                Alternative Cost Savings Formula
              </h3>
              
              <div className="bg-slate-100 p-6 rounded-lg font-mono text-sm mb-6">
                <div className="text-center font-bold mb-4">Complete Financial Analysis</div>
                <div>currentMonthlyCost = calculateMonthlyCost(selectedVehicle, route, pattern)</div>
                <div className="mt-2">alternativeCost = calculateMonthlyCost(alternativeMode, route, pattern)</div>
                <div className="mt-2">monthlySavings = currentMonthlyCost - alternativeCost</div>
                <div className="mt-2">annualSavings = monthlySavings × 12</div>
                <div className="mt-4 text-center font-bold">potentialSavings = max(0, monthlySavings)</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                  <h4 className="font-semibold text-green-800 mb-2">High Savings Potential</h4>
                  <p className="text-sm text-green-700">
                    Switching from luxury car to metro: Save <strong>₹8,000-15,000/month</strong>
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <h4 className="font-semibold text-blue-800 mb-2">Moderate Savings</h4>
                  <p className="text-sm text-blue-700">
                    Carpooling or off-peak travel: Save <strong>₹2,000-5,000/month</strong>
                  </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                  <h4 className="font-semibold text-yellow-800 mb-2">Optimization</h4>
                  <p className="text-sm text-yellow-700">
                    Route and timing changes: Save <strong>₹500-2,000/month</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Financial Context Messaging
              </h3>
              <p className="text-slate-600 mb-6">
                Our results screen prioritizes financial impact with context-sensitive messaging based on your spending patterns:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-slate-900">Zero/Low Cost (Walking, Cycling)</h4>
                    <p className="text-sm text-slate-600">"You're saving money! Car users spend ₹X/month on the same route."</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-slate-900">Efficient Spending (Public Transport, Shared)</h4>
                    <p className="text-sm text-slate-600">"Smart choice! You're spending significantly less than car users."</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-medium text-slate-900">High Waste (Luxury Cars, Solo Driving)</h4>
                    <p className="text-sm text-slate-600">"You're spending too much on transport. This comes from fuel, maintenance, and time lost in traffic."</p>
                  </div>
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