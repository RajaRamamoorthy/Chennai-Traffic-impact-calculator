import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Database, CreditCard, Clock, UserCheck } from "lucide-react";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Privacy Policy"
        description="Learn how Chennai Traffic Impact Calculator protects your privacy, handles your data, and complies with privacy regulations. Transparent data practices for your peace of mind."
        keywords="privacy policy, data protection, Chennai traffic calculator, Microsoft Clarity, Google Maps API, user data, privacy rights, GDPR, data security"
        canonical="https://chennaitrafficcalc.in/privacy-policy"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy",
          "description": "Privacy Policy for Chennai Traffic Impact Calculator",
          "url": "https://chennaitrafficcalc.in/privacy-policy",
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
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600">
              How we collect, use, and protect your information
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Last updated: July 13, 2025
            </p>
          </header>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Our Commitment to Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Chennai Traffic Impact Calculator is committed to protecting your privacy and being transparent about how we collect, use, and protect your personal information. This Privacy Policy explains our practices for our website at chennaitrafficcalc.in.
                </p>
                <p className="text-slate-600">
                  We believe in minimal data collection and maximum transparency. We only collect information necessary to provide our traffic calculation services and improve user experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">1. Traffic Calculator Data</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Origin and destination addresses (for route calculations)</li>
                      <li>Vehicle type and transportation mode selections</li>
                      <li>Travel patterns and frequency preferences</li>
                      <li>Calculation results and impact scores</li>
                      <li>Anonymous session identifiers for tracking calculations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">2. Contact and Feedback Information</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Name and email address (when you contact us)</li>
                      <li>Message content and feedback submissions</li>
                      <li>IP address and timestamp for security purposes</li>
                      <li>User agent information for technical support</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">3. Payment Information</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Payment amounts and transaction IDs (for donations)</li>
                      <li>Payment method details (processed securely by Razorpay)</li>
                      <li>Donation timestamps and status</li>
                      <li>We do not store credit card numbers or sensitive payment data</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  Analytics and Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Microsoft Clarity</h3>
                    <p className="text-slate-600 mb-2">
                      We partner with Microsoft Clarity and Microsoft Advertising to capture how you use and interact with our website through behavioral metrics, heatmaps, and session replay to improve and market our products/services.
                    </p>
                    <p className="text-slate-600 mb-2">
                      Website usage data is captured using first and third-party cookies and other tracking technologies to determine the popularity of products/services and online activity. Additionally, we use this information for site optimization, fraud/security purposes, and advertising.
                    </p>
                    <p className="text-slate-600">
                      For more information about how Microsoft handles your data, please see the <a href="https://privacy.microsoft.com/privacystatement" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Privacy Statement</a>.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Google Analytics 4</h3>
                    <p className="text-slate-600">
                      We use Google Analytics 4 (GA4) to understand how users interact with our website, including page views, user behavior patterns, and traffic sources. This helps us improve our services and user experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Site Disclosure</h3>
                    <p className="text-slate-600">
                      We improve our products and advertising by using Microsoft Clarity to see how you use our website. By using our site, you agree that we and Microsoft can collect and use this data. Our privacy statement has more details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  External Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Google Maps API</h3>
                    <p className="text-slate-600">
                      We use Google Maps services for address geocoding, place autocomplete, and route calculations. Your location data is sent to Google for processing. Please review <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a> for details.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Razorpay Payment Gateway</h3>
                    <p className="text-slate-600">
                      All donation payments are processed securely through Razorpay, which is PCI DSS Level 1 compliant. We do not store your payment card information. Please review <a href="https://razorpay.com/privacy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Razorpay's Privacy Policy</a> for details.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Neon Database</h3>
                    <p className="text-slate-600">
                      We use Neon's serverless PostgreSQL database to store calculation data, contact submissions, and user feedback. Data is encrypted in transit and at rest.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-red-600" />
                  Data Retention and Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">How Long We Keep Your Data</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Calculation data: Stored for service improvement and analytics</li>
                      <li>Contact submissions: Retained for customer support purposes</li>
                      <li>Donation records: Kept for audit compliance and record keeping</li>
                      <li>Session and analytics data: Retained according to Microsoft Clarity and Google Analytics 4 policies</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Data Security</h3>
                    <p className="text-slate-600">
                      We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption in transit and at rest, secure database connections, and regular security updates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  Your Rights and Choices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Your Privacy Rights</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>Access: Request a copy of your personal data we have stored</li>
                      <li>Correction: Request correction of inaccurate personal data</li>
                      <li>Deletion: Request deletion of your personal data (subject to legal requirements)</li>
                      <li>Portability: Request transfer of your data to another service</li>
                      <li>Withdraw consent: Opt out of non-essential data collection</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">How to Exercise Your Rights</h3>
                    <p className="text-slate-600">
                      To exercise any of these rights, please contact us at contact@chennaitrafficcalc.in. We will respond to your request as soon as possible. Please note that some data may be necessary to provide our services.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Cookies and Tracking</h3>
                    <p className="text-slate-600">
                      You can control cookies through your browser settings. However, disabling cookies may affect the functionality of our website. You can also opt out of Google Analytics tracking and Microsoft Clarity through their respective privacy settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-900 font-medium">Chennai Traffic Impact Calculator</p>
                  <p className="text-slate-600">Email: contact@chennaitrafficcalc.in</p>
                  <p className="text-slate-600">Website: https://chennaitrafficcalc.in</p>
                </div>
                <p className="text-slate-600 mt-4 text-sm">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page with an updated "Last updated" date.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}