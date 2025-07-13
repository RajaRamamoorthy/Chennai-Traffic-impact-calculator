import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Shield, CreditCard, AlertTriangle, FileText, Gavel } from "lucide-react";
import { useEffect } from "react";

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Terms and Conditions"
        description="Terms and conditions for using Chennai Traffic Impact Calculator. Learn about service usage, limitations, user responsibilities, and legal terms."
        keywords="terms and conditions, terms of service, Chennai traffic calculator, user agreement, service terms, legal terms, usage terms"
        canonical="https://chennaitrafficcalc.in/terms-conditions"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Terms and Conditions",
          "description": "Terms and Conditions for Chennai Traffic Impact Calculator",
          "url": "https://chennaitrafficcalc.in/terms-conditions",
          "lastReviewed": "2025-01-13",
          "about": {
            "@type": "WebApplication",
            "name": "Chennai Traffic Impact Calculator"
          }
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-lg text-slate-600">
              Terms of service for using Chennai Traffic Impact Calculator
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Last updated: January 13, 2025
            </p>
          </header>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-blue-600" />
                  Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  By accessing and using the Chennai Traffic Impact Calculator website at chennaitrafficcalc.in ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Service.
                </p>
                <p className="text-slate-600">
                  These Terms constitute a legally binding agreement between you and Chennai Traffic Impact Calculator regarding your use of the Service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Service Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">What We Provide</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Free traffic impact calculation tool for Chennai commuters</li>
                      <li>Route-based analysis using Google Maps data</li>
                      <li>Alternative transportation suggestions</li>
                      <li>Environmental impact assessments</li>
                      <li>Educational content about sustainable transportation</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Service Availability</h3>
                    <p className="text-slate-600">
                      We strive to provide continuous service but do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or technical issues. We reserve the right to modify, suspend, or discontinue the Service at any time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  User Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Acceptable Use</h3>
                    <p className="text-slate-600 mb-2">You agree to use the Service only for lawful purposes and in accordance with these Terms. You must not:</p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Use the Service for any illegal or unauthorized purpose</li>
                      <li>Attempt to gain unauthorized access to our systems or data</li>
                      <li>Interfere with or disrupt the Service or servers</li>
                      <li>Submit false, misleading, or malicious information</li>
                      <li>Use automated scripts or bots to access the Service</li>
                      <li>Violate any applicable laws or regulations</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Content Accuracy</h3>
                    <p className="text-slate-600">
                      You are responsible for providing accurate location information and trip details. Inaccurate information may result in incorrect calculations and recommendations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Disclaimers and Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Service Limitations</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Calculations are estimates based on available data and may not reflect real-time conditions</li>
                      <li>Traffic conditions, weather, and other factors may affect actual travel time and impact</li>
                      <li>Alternative suggestions are recommendations and may not be suitable for all users</li>
                      <li>Service is primarily designed for Chennai metropolitan area routes</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Data Dependencies</h3>
                    <p className="text-slate-600">
                      Our Service depends on third-party data sources including Google Maps API. We do not guarantee the accuracy, completeness, or timeliness of this data. Service disruptions may occur due to third-party service issues.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Disclaimer of Warranties</h3>
                    <p className="text-slate-600">
                      The Service is provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be error-free or uninterrupted.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Donations and Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Voluntary Donations</h3>
                    <p className="text-slate-600">
                      Donations are voluntary and help support the continued operation of the Service. All donations are processed securely through Razorpay, a trusted payment gateway.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Refund Policy</h3>
                    <p className="text-slate-600">
                      Due to the nature of donations and operational costs, we generally do not provide refunds. However, if you believe a donation was made in error or due to fraudulent activity, please contact us at contact@chennaitrafficcalc.in within 7 days of the transaction.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Payment Security</h3>
                    <p className="text-slate-600">
                      We do not store your payment information. All payment processing is handled by Razorpay, which is PCI DSS Level 1 compliant. For payment security questions, please refer to Razorpay's terms and policies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-red-600" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Liability Limitations</h3>
                    <p className="text-slate-600 mb-2">
                      To the fullest extent permitted by law, Chennai Traffic Impact Calculator and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Loss of profits, revenue, or business opportunities</li>
                      <li>Loss of data or information</li>
                      <li>Business interruption or delays</li>
                      <li>Personal injury or property damage</li>
                      <li>Costs of obtaining substitute services</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Maximum Liability</h3>
                    <p className="text-slate-600">
                      Our total liability for any claim arising out of or relating to these Terms or the Service shall not exceed the amount of donations you have made to us in the 12 months preceding the claim, or ₹100, whichever is greater.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Our Rights</h3>
                    <p className="text-slate-600">
                      All content, features, and functionality of the Service, including but not limited to text, graphics, logos, images, and software, are owned by Chennai Traffic Impact Calculator and are protected by copyright, trademark, and other intellectual property laws.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Your License</h3>
                    <p className="text-slate-600">
                      We grant you a limited, non-exclusive, non-transferable license to use the Service for personal, non-commercial purposes. You may not reproduce, distribute, modify, or create derivative works based on the Service without our written consent.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Governing Law and Jurisdiction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Applicable Law</h3>
                    <p className="text-slate-600">
                      These Terms and your use of the Service are governed by the laws of India and the state of Tamil Nadu, without regard to conflict of law principles.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Jurisdiction</h3>
                    <p className="text-slate-600">
                      Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu, India.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on this page. Your continued use of the Service after changes are posted constitutes your acceptance of the modified Terms.
                </p>
                <p className="text-slate-600">
                  We encourage you to review these Terms periodically to stay informed of any changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  If you have questions about these Terms and Conditions, please contact us at:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-900 font-medium">Chennai Traffic Impact Calculator</p>
                  <p className="text-slate-600">Email: contact@chennaitrafficcalc.in</p>
                  <p className="text-slate-600">Website: https://chennaitrafficcalc.in</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}