import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, HeartHandshake, MapPin, DollarSign } from "lucide-react";
import { useEffect } from "react";

export default function Support() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEO 
        title="Support & FAQ"
        description="Support the Chennai Traffic Impact Calculator with donations. Learn how your contributions help keep the tool free and cover API costs."
        keywords="donation, support, FAQ, Chennai traffic calculator, free tool, Razorpay payment, secure donations"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Where does the donation money go?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Donations cover Google Maps API costs, database hosting, server infrastructure, domain renewal, and development costs to keep the tool free for all users."
              }
            },
            {
              "@type": "Question", 
              "name": "Is my payment secure?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, we use Razorpay, India's trusted payment gateway with PCI DSS Level 1 compliance and bank-grade encryption."
              }
            },
            {
              "@type": "Question",
              "name": "How much should I donate?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Any amount helps! ₹50 covers ~100 calculations, ₹100 supports ~200 users, ₹500 funds a week, ₹1000 keeps us running for a month."
              }
            }
          ]
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Support Our Mission
            </h1>
            <p className="text-lg text-slate-600">
              Help us keep the Chennai Traffic Impact Calculator free for everyone
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Where does the money go?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-slate-600">
                  <li>• Google Maps API costs for geocoding and route calculations</li>
                  <li>• Database hosting and server infrastructure</li>
                  <li>• Domain name and SSL certificate renewal</li>
                  <li>• Development and maintenance costs</li>
                  <li>• Keeping the tool completely free for all users</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Is my payment secure?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p className="mb-3">
                  Yes, absolutely! We use Razorpay, one of India's most trusted payment gateways.
                </p>
                <ul className="space-y-1">
                  <li>• PCI DSS Level 1 compliant</li>
                  <li>• Bank-grade encryption</li>
                  <li>• Supports UPI, cards, net banking</li>
                  <li>• Used by thousands of Indian businesses</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Why do we need donations?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p className="mb-3">
                  Every calculation uses Google Maps API to provide accurate Chennai traffic data. This costs money for each:
                </p>
                <ul className="space-y-1">
                  <li>• Address search and autocomplete</li>
                  <li>• Route distance calculation</li>
                  <li>• Real-time traffic information</li>
                  <li>• Location geocoding services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HeartHandshake className="h-5 w-5 text-red-600" />
                  How much should I donate?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p className="mb-3">
                  Any amount helps! Here's what different donations cover:
                </p>
                <ul className="space-y-1">
                  <li>• ₹50 - Covers ~100 route calculations</li>
                  <li>• ₹100 - Supports ~200 Chennai commuters</li>
                  <li>• ₹500 - Funds the tool for a week</li>
                  <li>• ₹1000 - Keeps us running for a month</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">
                  Thank you for supporting sustainable transport in Chennai! 🙏
                </h2>
                <p className="text-slate-600">
                  Your contribution helps thousands of Chennai commuters make better transport choices every month.
                  Together, we're building a cleaner, more efficient city.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}