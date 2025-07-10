import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Calculator, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

export default function ThankYou() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEO 
        title="Thank You"
        description="Thank you for supporting the Chennai Traffic Impact Calculator. Your donation helps keep the tool free for everyone."
        keywords="thank you, donation, support, Chennai traffic calculator, sustainability, green transport"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Thank You - Chennai Traffic Impact Calculator",
          "description": "Thank you page for supporters of the Chennai Traffic Impact Calculator",
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
                "name": "Thank You",
                "item": "https://chennaitrafficcalc.in/thank-you"
              }
            ]
          }
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-6">
                <Heart className="h-12 w-12 text-green-600 fill-current" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Thank You So Much! 🙏
            </h1>
            
            <p className="text-lg text-slate-600 mb-6">
              Your generous contribution helps keep the Chennai Traffic Impact Calculator 
              free and accessible for everyone in our city.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Your Impact
              </h2>
              <div className="space-y-3 text-slate-600">
                <p>✅ Helped cover Google Maps API costs for accurate Chennai route data</p>
                <p>✅ Supported server infrastructure to keep the tool running 24/7</p>
                <p>✅ Enabled thousands of Chennai commuters to make sustainable transport choices</p>
                <p>✅ Contributed to reducing traffic congestion and air pollution in our city</p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <p className="text-green-800 font-medium mb-2">
              🌱 Together for a Greener Chennai
            </p>
            <p className="text-green-700 text-sm">
              Every donation brings us closer to a cleaner, more efficient Chennai. 
              Your support helps fellow commuters discover better transport alternatives.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator">
              <Button className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Try the Calculator Again
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-sm text-slate-500">
            <p>
              Questions about your donation? Contact us through our 
              <Link href="/" className="text-green-600 hover:text-green-700 ml-1">
                feedback form
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}