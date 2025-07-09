
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Database, TrendingUp, Zap } from "lucide-react";

export default function Methodology() {
  const sections = [
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Impact Score Calculation",
      description: "Our proprietary algorithm calculates a traffic impact score from 0-100 based on multiple weighted factors.",
      details: [
        "Vehicle Impact (40%): Based on vehicle type, fuel efficiency, and emission factors",
        "Route Congestion (25%): Traffic density and congestion patterns for your route",
        "Timing Penalty (20%): Peak hour multipliers and time-of-day adjustments",
        "Occupancy Bonus (15%): Rewards for carpooling and shared transportation"
      ]
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Data Sources",
      description: "We combine multiple authoritative data sources to ensure accuracy and reliability.",
      details: [
        "Google Maps API: Real-time traffic data, route optimization, and distance calculations",
        "Vehicle Emission Database: Official emission factors from automotive manufacturers",
        "Chennai Traffic Authority: Local traffic patterns and congestion data",
        "Environmental Protection Agency: Standard emission calculation methodologies"
      ]
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Environmental Metrics",
      description: "Environmental impact calculations based on established scientific methodologies.",
      details: [
        "CO2 Emissions: Calculated using fuel consumption and emission factors per vehicle type",
        "Air Quality Impact: PM2.5 and NOx emissions based on vehicle class and route distance",
        "Energy Consumption: Total energy usage including fuel production and transportation",
        "Carbon Footprint: Comprehensive lifecycle assessment including vehicle manufacturing impact"
      ]
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Algorithm Factors",
      description: "Detailed breakdown of how various factors influence your impact score.",
      details: [
        "Vehicle Type: Different emission factors for cars, motorcycles, buses, and electric vehicles",
        "Occupancy: Linear reduction in per-person impact with increased passenger count",
        "Route Distance: Base impact scales with total kilometers traveled",
        "Traffic Timing: Peak hours (7-10 AM, 5-8 PM) carry 1.5x penalty multiplier"
      ]
    }
  ];

  const confidenceLevels = [
    {
      level: "A",
      title: "High Confidence",
      criteria: "Complete data available for all factors",
      color: "bg-green-100 text-green-800"
    },
    {
      level: "B", 
      title: "Medium Confidence",
      criteria: "Some estimation required for specific factors",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      level: "C",
      title: "Lower Confidence", 
      criteria: "Limited data requiring significant estimation",
      color: "bg-red-100 text-red-800"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Methodology
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn about the scientific approach and data sources behind our Chennai Traffic Impact Calculator.
        </p>
      </div>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <Card key={index} className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{section.title}</CardTitle>
                  <CardDescription className="text-base">
                    {section.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="ml-16">
                <ul className="space-y-3">
                  {section.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-12" />

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Confidence Levels
        </h2>
        <p className="text-gray-600">
          Each calculation includes a confidence level indicating the reliability of the results based on data availability and estimation requirements.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {confidenceLevels.map((level, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Badge className={`text-lg font-bold px-3 py-1 ${level.color}`}>
                    {level.level}
                  </Badge>
                  <CardTitle className="text-lg">{level.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{level.criteria}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-12" />

      <div className="bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Limitations & Assumptions
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Traffic Variability:</strong> Real-time traffic conditions may vary significantly from historical patterns used in calculations.
          </p>
          <p>
            <strong>Vehicle Condition:</strong> Emission factors assume average vehicle maintenance and age. Poorly maintained vehicles may have higher emissions.
          </p>
          <p>
            <strong>Individual Behavior:</strong> Calculations assume typical driving patterns. Aggressive driving or frequent stops can increase actual impact.
          </p>
          <p>
            <strong>Seasonal Variations:</strong> Weather conditions, festivals, and seasonal traffic patterns may affect actual impact compared to calculations.
          </p>
          <p>
            <strong>Infrastructure Changes:</strong> Ongoing road construction, new infrastructure, or traffic management changes may not be immediately reflected.
          </p>
        </div>
      </div>
    </div>
  );
}
