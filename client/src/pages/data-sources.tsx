import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Database, MapPin, Users, Clock } from "lucide-react";
import { SEO } from "@/components/seo";

export default function DataSources() {
  const dataSourcesSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "Chennai Traffic Impact Calculator Data Sources",
    "description": "Comprehensive data sources used for calculating traffic impact in Chennai",
    "creator": {
      "@type": "Organization",
      "name": "Chennai Traffic Impact Calculator"
    },
    "datePublished": "2025-07-10",
    "keywords": "Chennai traffic data, emission database, Google Maps API, traffic authority data"
  };

  return (
    <>
      <SEO
        title="Data Sources"
        description="Learn about the reliable data sources powering our Chennai traffic impact calculations. Google Maps, emission databases, and local traffic authority data."
        keywords="Chennai traffic data sources, Google Maps traffic API, vehicle emission database, Chennai traffic authority data, transport data Chennai"
        canonical="https://chennaitrafficcalc.in/data-sources"
        structuredData={dataSourcesSchema}
      />
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
                  className="inline-flex items-center text-primary hover:text-primary/80"
                >
                  Learn more <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Database className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Vehicle Emission Database
                </h3>
                <p className="text-slate-600 mb-4">
                  Comprehensive database with 21 vehicle categories and emission factors for Chennai's most popular vehicles.
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-slate-700 mb-2">Car Categories (9 types):</p>
                    <ul className="space-y-1 text-sm text-slate-600 ml-4">
                      <li>• Hatchback (Swift, Baleno) - 0.142 kg CO2/km</li>
                      <li>• Compact Sedan (Dzire, Amaze) - 0.148 kg CO2/km</li>
                      <li>• Sedan (City, Verna) - 0.155 kg CO2/km</li>
                      <li>• Compact SUV (Brezza, Venue) - 0.158 kg CO2/km</li>
                      <li>• Mid-size SUV (Creta, Seltos) - 0.168 kg CO2/km</li>
                      <li>• Premium Sedan, MUV/MPV, Luxury SUV categories</li>
                      <li>• Electric Car (Nexon EV, Tiago EV) - 0.045 kg CO2/km</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-slate-700 mb-2">Bike Categories (7 types):</p>
                    <ul className="space-y-1 text-sm text-slate-600 ml-4">
                      <li>• Scooter 100-125cc (Activa, Jupiter) - 0.062 kg CO2/km</li>
                      <li>• Premium Scooter 150cc+ (Aerox 155, NTorq 125)</li>
                      <li>• Commuter, Sports, Mid-capacity, High-capacity bikes</li>
                      <li>• Electric Two-wheeler (Ather 450X, TVS iQube) - 0.018 kg CO2/km</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Chennai Traffic Authority
                </h3>
                <p className="text-slate-600 mb-4">
                  Local traffic patterns, congestion data, and infrastructure information.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Peak hour traffic multipliers</li>
                  <li>• Major congestion areas</li>
                  <li>• Traffic density patterns</li>
                  <li>• Infrastructure capacity data</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <Clock className="w-12 h-12 text-indigo-500 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Public Transport Data
                </h3>
                <p className="text-slate-600 mb-4">
                  Chennai Metro and MTC bus network information.
                </p>
                <ul className="space-y-2 text-slate-600">
                  <li>• Metro route coverage</li>
                  <li>• Bus fare structures</li>
                  <li>• Average travel times</li>
                  <li>• Service frequency data</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Freshness */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Data Freshness & Updates
          </h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Real-time Data</h3>
              <p className="text-slate-600">
                Google Maps traffic data and routing information are updated in real-time, 
                ensuring your calculations reflect current conditions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">Periodic Updates</h3>
              <p className="text-slate-600">
                Vehicle emission factors and local traffic patterns are reviewed and 
                updated quarterly. Our database currently includes 21 vehicle categories 
                with market-relevant classifications based on Chennai's most popular vehicles.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-2">User Feedback Integration</h3>
              <p className="text-slate-600">
                We continuously improve our calculations based on user feedback and 
                real-world validation of our predictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Privacy */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Data Privacy & Security
          </h2>
          <p className="text-slate-600 mb-6">
            We take your privacy seriously. All route calculations are processed 
            anonymously, and we don't store personal location data.
          </p>
          <p className="text-slate-600">
            Our data sources comply with GDPR and Indian data protection regulations.
          </p>
        </div>
      </section>
    </div>
    </>
  );
}