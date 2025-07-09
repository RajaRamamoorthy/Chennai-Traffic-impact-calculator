import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calculator, MapPin, TrendingUp, Users } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Enter Your Route",
      description: "Provide your starting point and destination in Chennai. Our system uses Google Maps to calculate the exact distance and route information.",
      details: ["Address geocoding", "Route optimization", "Distance calculation"]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Transportation Details",
      description: "Select your mode of transport, vehicle type, occupancy, and travel frequency to get personalized impact calculations.",
      details: ["Vehicle selection", "Occupancy factors", "Travel timing", "Frequency patterns"]
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Impact Analysis",
      description: "Our algorithm analyzes multiple factors including vehicle emissions, traffic congestion, timing penalties, and occupancy bonuses.",
      details: ["Emission calculations", "Congestion analysis", "Time-based penalties", "Occupancy benefits"]
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Results & Alternatives",
      description: "Get your traffic impact score (0-100) with detailed breakdown and suggestions for more sustainable transportation options.",
      details: ["Impact score", "Monthly metrics", "Alternative suggestions", "Environmental insights"]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          How It Works
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our Chennai Traffic Impact Calculator uses advanced algorithms and real-time data 
          to help you understand your transportation's environmental and traffic impact.
        </p>
      </div>

      <div className="grid gap-8 md:gap-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <Card className="p-6">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Step {index + 1}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="ml-16">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {step.details.map((detail, detailIndex) => (
                      <Badge key={detailIndex} variant="secondary" className="text-xs">
                        {detail}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {index < steps.length - 1 && (
              <div className="flex justify-center mt-6 mb-2">
                <ArrowRight className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Real-time Data</h3>
            <p className="text-gray-600 text-sm">
              Uses Google Maps API for accurate route and traffic information.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Chennai-Specific</h3>
            <p className="text-gray-600 text-sm">
              Tailored calculations for Chennai's unique traffic patterns and infrastructure.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Multiple Transport Modes</h3>
            <p className="text-gray-600 text-sm">
              Supports cars, bikes, public transport, and other transportation options.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Environmental Impact</h3>
            <p className="text-gray-600 text-sm">
              Calculates CO2 emissions and environmental footprint of your travel choices.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Alternative Suggestions</h3>
            <p className="text-gray-600 text-sm">
              Provides practical alternatives to reduce your traffic impact.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Cost Analysis</h3>
            <p className="text-gray-600 text-sm">
              Shows monthly costs and potential savings from transportation choices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}