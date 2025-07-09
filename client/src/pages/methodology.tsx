
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, Database, MapPin, Zap } from "lucide-react";

export default function Methodology() {
  return (
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
                  Congestion analysis based on Chennai traffic patterns and route distance:
                </p>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
                  congestion = baseFactor * distanceMultiplier
                </div>
                <p className="text-slate-600 mt-4">
                  We analyze specific Chennai areas like T. Nagar, Anna Nagar, and IT Corridor 
                  to determine route-specific congestion impacts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Zap className="w-12 h-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Timing Penalty
                </h3>
                <p className="text-slate-600 mb-4">
                  Peak hour adjustments based on Chennai traffic patterns:
                </p>
                <div className="bg-slate-100 p-4 rounded-lg text-sm space-y-2">
                  <div>• <strong>Morning Peak (7-10 AM):</strong> 1.8-2.2x multiplier</div>
                  <div>• <strong>Evening Peak (5-8 PM):</strong> 2.0-2.5x multiplier</div>
                  <div>• <strong>Off-peak:</strong> 1.1-1.3x multiplier</div>
                  <div>• <strong>Night (10 PM-6 AM):</strong> 1.0x multiplier</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Database className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Occupancy Bonus
                </h3>
                <p className="text-slate-600 mb-4">
                  Carpooling and ridesharing benefits calculation:
                </p>
                <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
                  bonus = max(0, 20 - (occupancy * 5))
                </div>
                <p className="text-slate-600 mt-4">
                  Higher occupancy reduces individual impact, encouraging carpooling 
                  and shared transportation in Chennai.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Score Calculation */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Final Score Formula
          </h2>
          
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="bg-primary text-white p-6 rounded-lg font-mono text-lg">
                  Final Score = vehicleImpact + routeCongestion + timingPenalty - occupancyBonus
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Score Normalization</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Scores are normalized to 0-100 scale</li>
                    <li>• Lower scores indicate better traffic impact</li>
                    <li>• Higher scores suggest need for alternatives</li>
                    <li>• Frequency multipliers adjust for trip patterns</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Confidence Levels</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• <strong>High:</strong> Complete route and vehicle data</li>
                    <li>• <strong>Medium:</strong> Estimated route parameters</li>
                    <li>• <strong>Low:</strong> Limited or default values used</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Emission Calculations */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Environmental Impact Calculations
          </h2>
          
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Monthly Emissions</h3>
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm mb-4">
                monthlyEmissions = (emissionFactor * distanceKm * frequencyPerMonth) / occupancy
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-4 mt-6">Cost Analysis</h3>
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm mb-4">
                monthlyCost = (fuelCostPerKm * distanceKm * frequencyPerMonth) / occupancy
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-4 mt-6">Time Estimation</h3>
              <div className="bg-slate-100 p-4 rounded-lg font-mono text-sm">
                monthlyTimeHours = (distanceKm / avgSpeedKmh * frequencyPerMonth * timingMultiplier)
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
