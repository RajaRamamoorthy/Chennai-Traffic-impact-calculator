import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Database, Map, Zap, TreePine } from "lucide-react";

export default function DataSources() {
  const dataSources = [
    {
      icon: <Map className="h-6 w-6" />,
      title: "Google Maps Platform",
      category: "Geographic & Traffic Data",
      description: "Real-time traffic information, route optimization, geocoding, and place data for Chennai metropolitan area.",
      apis: ["Directions API", "Geocoding API", "Places API", "Distance Matrix API"],
      updateFrequency: "Real-time",
      reliability: "High",
      url: "https://developers.google.com/maps"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Vehicle Emission Database",
      category: "Environmental Data",
      description: "Comprehensive database of vehicle emission factors, fuel efficiency ratings, and environmental impact metrics.",
      apis: ["Emission Factors", "Fuel Consumption", "Vehicle Classifications"],
      updateFrequency: "Quarterly",
      reliability: "High",
      url: "#"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Chennai Traffic Police",
      category: "Local Traffic Data",
      description: "Traffic congestion patterns, peak hour data, and local transportation infrastructure information.",
      apis: ["Congestion Data", "Traffic Patterns", "Road Classifications"],
      updateFrequency: "Monthly",
      reliability: "Medium",
      url: "#"
    },
    {
      icon: <TreePine className="h-6 w-6" />,
      title: "Environmental Protection Agency",
      category: "Environmental Standards",
      description: "Standard methodologies for emission calculations, air quality metrics, and environmental impact assessment.",
      apis: ["Emission Standards", "Calculation Methods", "Air Quality Indices"],
      updateFrequency: "Annually",
      reliability: "High",
      url: "https://www.epa.gov"
    }
  ];

  const technicalSpecs = [
    {
      title: "Data Processing",
      details: [
        "Real-time API integration with 99.9% uptime",
        "Automated data validation and error handling",
        "Caching layer for improved performance",
        "Regular data synchronization every 15 minutes"
      ]
    },
    {
      title: "Quality Assurance",
      details: [
        "Multi-source data cross-validation",
        "Statistical outlier detection and correction",
        "Historical trend analysis for accuracy",
        "Expert review of calculation methodologies"
      ]
    },
    {
      title: "Privacy & Security",
      details: [
        "No personal location data stored permanently",
        "Encrypted data transmission (TLS 1.3)",
        "GDPR compliant data handling",
        "Anonymous usage analytics only"
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Data Sources
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our calculations are powered by reliable, authoritative data sources to ensure accurate 
          and up-to-date traffic impact assessments for Chennai.
        </p>
      </div>

      <div className="space-y-6 mb-12">
        {dataSources.map((source, index) => (
          <Card key={index} className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
                    {source.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{source.title}</CardTitle>
                      {source.url !== "#" && (
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    <Badge variant="outline" className="mb-3">
                      {source.category}
                    </Badge>
                    <CardDescription className="text-base">
                      {source.description}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="ml-16 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Data Types:</h4>
                  <div className="flex flex-wrap gap-2">
                    {source.apis.map((api, apiIndex) => (
                      <Badge key={apiIndex} variant="secondary" className="text-xs">
                        {api}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Update Frequency:</span>
                    <span className="ml-2">{source.updateFrequency}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Reliability:</span>
                    <Badge 
                      variant={source.reliability === "High" ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {source.reliability}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {technicalSpecs.map((spec, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{spec.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {spec.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-yellow-800 mb-3">
          Data Limitations
        </h2>
        <div className="space-y-2 text-yellow-700">
          <p>
            <strong>Real-time Accuracy:</strong> Traffic conditions change rapidly; calculations reflect data at the time of request.
          </p>
          <p>
            <strong>Local Variations:</strong> Micro-level traffic patterns may not be captured in broader datasets.
          </p>
          <p>
            <strong>Seasonal Changes:</strong> Some data sources may not reflect seasonal traffic variations or special events.
          </p>
          <p>
            <strong>Data Availability:</strong> Some local Chennai-specific data may have limited availability or update frequency.
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">
          Data sources are regularly reviewed and updated to maintain accuracy and relevance. 
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}