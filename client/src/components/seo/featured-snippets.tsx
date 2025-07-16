import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, TrendingDown, IndianRupee } from "lucide-react";

// Featured snippet optimized Q&A content for Chennai traffic
export function ChennaiTrafficQA() {
  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What time is traffic worst in Chennai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Chennai traffic is worst during morning peak hours (7:30 AM - 10:00 AM) and evening peak hours (5:30 PM - 8:30 PM). Monday mornings and Friday evenings typically have the heaviest congestion."
        }
      },
      {
        "@type": "Question", 
        "name": "How to avoid traffic in Anna Salai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To avoid Anna Salai traffic: 1) Travel before 7 AM or after 10 AM for morning commutes, 2) Use alternative routes like Poonamallee High Road or Inner Ring Road, 3) Consider Chennai Metro between Alandur and Airport, 4) Avoid the Nandanam to Thousand Lights stretch during peak hours."
        }
      },
      {
        "@type": "Question",
        "name": "What's the traffic like on OMR today?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "OMR (Old Mahabalipuram Road) typically experiences heavy traffic from Thoraipakkam to Sholinganallur during peak hours. Current conditions vary - use live traffic apps for real-time updates. Alternative routes include ECR via Injambakkam."
        }
      },
      {
        "@type": "Question",
        "name": "How much does Chennai traffic cost commuters monthly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Average Chennai commuters spend ₹3,000-8,000 monthly on transportation costs including fuel, vehicle maintenance, and parking. Traffic delays add 20-30% to fuel consumption, increasing costs by ₹600-1,500 per month."
        }
      }
    ]
  };

  return (
    <>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qaSchema) }}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Peak Traffic Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-red-600">Morning Peak: 7:30 AM - 10:00 AM</h4>
                <p className="text-sm text-muted-foreground">Heaviest on Monday mornings</p>
              </div>
              <div>
                <h4 className="font-semibold text-red-600">Evening Peak: 5:30 PM - 8:30 PM</h4>
                <p className="text-sm text-muted-foreground">Worst on Friday evenings</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600">Best Times: 10:30 AM - 4:30 PM</h4>
                <p className="text-sm text-muted-foreground">Lightest traffic conditions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Major Routes Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Anna Salai</h4>
                <p className="text-sm text-muted-foreground">Heavy: Nandanam to Thousand Lights</p>
              </div>
              <div>
                <h4 className="font-semibold">OMR</h4>
                <p className="text-sm text-muted-foreground">Congested: Thoraipakkam to Sholinganallur</p>
              </div>
              <div>
                <h4 className="font-semibold">GST Road</h4>
                <p className="text-sm text-muted-foreground">Moderate: Chrompet to Guindy stretch</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-500" />
              Alternative Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Instead of Anna Salai</h4>
                <p className="text-sm text-muted-foreground">Use Poonamallee High Road or Inner Ring Road</p>
              </div>
              <div>
                <h4 className="font-semibold">Instead of OMR</h4>
                <p className="text-sm text-muted-foreground">Take ECR via Injambakkam for coastal route</p>
              </div>
              <div>
                <h4 className="font-semibold">Public Transport</h4>
                <p className="text-sm text-muted-foreground">Chennai Metro covers Airport to Central areas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-purple-500" />
              Traffic Cost Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Monthly Commute Cost</h4>
                <p className="text-sm text-muted-foreground">₹3,000 - ₹8,000 for average Chennai commuter</p>
              </div>
              <div>
                <h4 className="font-semibold">Traffic Delay Cost</h4>
                <p className="text-sm text-muted-foreground">Extra ₹600 - ₹1,500 monthly due to congestion</p>
              </div>
              <div>
                <h4 className="font-semibold">Fuel Wastage</h4>
                <p className="text-sm text-muted-foreground">20-30% more fuel consumed in heavy traffic</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}