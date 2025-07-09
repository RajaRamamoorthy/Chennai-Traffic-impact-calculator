
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Database, MapPin, Users, Clock } from "lucide-react";

export default function DataSources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Data Sources
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Our calculations are based on reliable, up-to-date data sources 
            specific to Chennai's transportation infrastructure and traffic patterns.
          </p>
        </div>
      </section>

      {/* Primary Data Sources */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Primary Data Sources
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <MapPin className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Google Maps Platform
                </h3>
                <p className="text-slate-600 mb-4">
                  Real-time routing, distance calculation, and traffic data for Chennai routes.
                </p>
                <ul className="space-y-2 text-slate-600 mb-4">
                  <li>• Geocoding API for address validation</li>
                  <li>• Directions API for route optimization</li>
                  <li>• Real-time traffic conditions</li>
                  <li>• Distance Matrix calculations</li>
                </ul>
                <a 
                  href="https://developers.google.com/maps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  Learn more <ExternalLink className="ml-1 w-4 h-4" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Database className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Vehicle Emission Standards
                </h3>
                <p className="text-slate-600 mb-4">
                  Official emission factors from government and automotive industry sources.
                </p>
                <ul className="space-y-2 text-slate-600 mb-4">
                  <li>• Bureau of Energy Efficiency (BEE) data</li>
                  <li>• Society of Indian Automobile Manufacturers (SIAM)</li>
                  <li>• Central Pollution Control Board (CPCB)</li>
                  <li>• Automotive Research Association of India (ARAI)</li>
                </ul>
                <a 
                  href="https://beeindia.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  Visit BEE <ExternalLink className="ml-1 w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Chennai-Specific Data */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Chennai-Specific Data
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Public Transportation
                </h3>
                <p className="text-slate-600 mb-4">
                  Official data from Chennai's public transport authorities.
                </p>
                <ul className="space-y-2 text-slate-600 mb-4">
                  <li>• Chennai Metro Rail Limited (CMRL)</li>
                  <li>• Metropolitan Transport Corporation (MTC)</li>
                  <li>• Route schedules and capacity data</li>
                  <li>• Fare structures and accessibility</li>
                </ul>
                <div className="flex space-x-4">
                  <a 
                    href="https://chennaimetrorail.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline text-sm"
                  >
                    CMRL <ExternalLink className="ml-1 w-3 h-3" />
                  </a>
                  <a 
                    href="https://mtcbus.tn.gov.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline text-sm"
                  >
                    MTC <ExternalLink className="ml-1 w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Clock className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Traffic Pattern Analysis
                </h3>
                <p className="text-slate-600 mb-4">
                  Congestion data based on Chennai traffic studies and real-time observations.
                </p>
                <ul className="space-y-2 text-slate-600 mb-4">
                  <li>• Peak hour traffic multipliers by area</li>
                  <li>• Major corridor congestion patterns</li>
                  <li>• Seasonal and weather impact factors</li>
                  <li>• Historical traffic growth trends</li>
                </ul>
                <p className="text-sm text-slate-500">
                  Data collected from traffic monitoring systems and public studies
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vehicle Database */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Vehicle Database
          </h2>
          
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Car Categories</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Hatchback (0.142 kg CO₂/km)</li>
                    <li>• Compact Sedan (0.148 kg CO₂/km)</li>
                    <li>• Sedan (0.155 kg CO₂/km)</li>
                    <li>• SUV (0.168 kg CO₂/km)</li>
                    <li>• Luxury SUV (0.185 kg CO₂/km)</li>
                    <li>• Electric Car (0.045 kg CO₂/km)</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Two-Wheeler Categories</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Scooter (0.062 kg CO₂/km)</li>
                    <li>• Bike &lt;350cc (0.055 kg CO₂/km)</li>
                    <li>• Bike &gt;350cc (0.065 kg CO₂/km)</li>
                    <li>• Electric Two-wheeler (0.018 kg CO₂/km)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-slate-100 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Data Update Frequency</h4>
                <p className="text-slate-600">
                  Vehicle emission factors are updated quarterly based on new model releases 
                  and changes in fuel efficiency standards. Traffic patterns are updated 
                  monthly using real-time data aggregation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Data Accuracy */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Data Accuracy & Limitations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 text-green-600">
                  What We Do Well
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>✓ Real-time route calculations</li>
                  <li>✓ Accurate vehicle emission data</li>
                  <li>✓ Chennai-specific traffic patterns</li>
                  <li>✓ Multiple transport mode analysis</li>
                  <li>✓ Regular data updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3 text-orange-600">
                  Current Limitations
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li>• Weather impact estimations</li>
                  <li>• Individual driving behavior variations</li>
                  <li>• Construction and temporary road closures</li>
                  <li>• Festival and event traffic spikes</li>
                  <li>• Real-time public transport delays</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-slate-600">
              We continuously work to improve our data accuracy and welcome feedback 
              to enhance our calculations for Chennai commuters.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
