import { SEO } from "@/components/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calculator, Shield, HelpCircle, CreditCard, Map, Database, Bug } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InternalLinks } from "@/components/layout/internal-links";
import { useEffect } from "react";

export default function FAQ() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO 
        title="Frequently Asked Questions"
        description="Find answers to common questions about Chennai Traffic Impact Calculator, including how to use the calculator, privacy concerns, technical support, and donations."
        keywords="FAQ, frequently asked questions, Chennai traffic calculator, help, support, calculator usage, privacy, technical support, donations"
        canonical="https://chennaitrafficcalc.in/faq"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How accurate are the traffic impact calculations?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Our calculations are based on Google Maps data, vehicle emission factors, and Chennai-specific traffic patterns. While we strive for accuracy, results are estimates and actual conditions may vary due to weather, events, or real-time traffic changes."
              }
            },
            {
              "@type": "Question",
              "name": "Do you track my location or personal data?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "We use Microsoft Clarity for user behavior analytics and Google Maps for route calculations. Location data is only used for calculations and is not stored permanently. We do not track personal information without consent."
              }
            },
            {
              "@type": "Question",
              "name": "Is the calculator free to use?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, the Chennai Traffic Impact Calculator is completely free to use. We accept voluntary donations to help cover API costs and server infrastructure."
              }
            },
            {
              "@type": "Question",
              "name": "Can I use this calculator for cities other than Chennai?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The calculator is specifically designed for Chennai metropolitan area with local traffic patterns and vehicle data. While you can input other locations, the results may not be accurate for non-Chennai routes."
              }
            },
            {
              "@type": "Question",
              "name": "How do I report a bug or technical issue?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can report bugs through our contact form or feedback button. Please include details about what you were doing when the issue occurred and your browser information."
              }
            }
          ]
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb 
            items={[]}
            currentPage="FAQ"
          />
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-slate-600">
              Find answers to common questions about the Chennai Traffic Impact Calculator
            </p>
          </header>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Using the Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="accuracy">
                    <AccordionTrigger>How accurate are the traffic impact calculations?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        Our calculations are based on Google Maps data, standardized vehicle emission factors, and Chennai-specific traffic patterns. While we strive for accuracy, results are estimates and actual conditions may vary due to weather, special events, construction, or real-time traffic changes. The confidence level (A, B, or C) indicates the reliability of each calculation.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="how-to-use">
                    <AccordionTrigger>How do I use the traffic calculator?</AccordionTrigger>
                    <AccordionContent>
                      <div className="text-slate-600">
                        <p className="mb-2">Using the calculator is simple:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Select your transportation mode (Car, Bike, Public Transport, etc.)</li>
                          <li>Choose your specific vehicle type and travel pattern</li>
                          <li>Enter your origin and destination addresses</li>
                          <li>Click "Calculate Impact" to get your results</li>
                        </ol>
                        <p className="mt-2">The calculator will show your impact score, breakdown, and alternative suggestions.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="other-cities">
                    <AccordionTrigger>Can I use this calculator for cities other than Chennai?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        The calculator is specifically designed for Chennai metropolitan area with local traffic patterns, congestion data, and vehicle preferences. While you can input locations from other cities, the results may not be accurate since the congestion factors, travel patterns, and vehicle data are calibrated for Chennai conditions.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="alternatives">
                    <AccordionTrigger>How are alternative transportation suggestions generated?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        Alternative suggestions are generated based on your current route, vehicle type, and travel patterns. The system considers factors like distance, available public transport, cycling feasibility, and carpooling opportunities. Each alternative shows potential impact reduction, time difference, and cost savings compared to your current choice.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="save-results">
                    <AccordionTrigger>Can I save or share my calculation results?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        Results are not saved automatically and disappear when you navigate away. You can use the "Share Results" button to copy a shareable text summary and create a screenshot image of your results. The share function copies text to your clipboard and generates an image you can share on social media or save locally.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Privacy and Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="data-tracking">
                    <AccordionTrigger>Do you track my location or personal data?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        We use Microsoft Clarity for user behavior analytics (heatmaps, session recordings) and Google Maps for route calculations. Location data is only used for calculations and route planning - we don't store your precise location permanently. We collect anonymous usage data to improve the service. See our Privacy Policy for complete details.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cookies">
                    <AccordionTrigger>What cookies do you use?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        We use cookies for analytics (Google Analytics, Microsoft Clarity) and to improve user experience. These include session cookies for the calculator functionality and third-party cookies for analytics. You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="data-deletion">
                    <AccordionTrigger>How can I delete my data?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        To request data deletion, contact us at contact@chennaitrafficcalc.in. We'll delete your personal information within 30 days, subject to legal requirements. Note that anonymous calculation data may be retained for service improvement. You can also clear your browser data to remove local storage.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="data-sharing">
                    <AccordionTrigger>Do you share my data with third parties?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        We only share data with essential service providers: Google Maps for route calculations, Microsoft Clarity for analytics, and Razorpay for payment processing (if you donate). We do not sell your data to advertisers or other third parties. All data sharing is covered in our Privacy Policy.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-5 w-5 text-red-600" />
                  Technical Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="browser-support">
                    <AccordionTrigger>Which browsers are supported?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        The calculator works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for optimal performance. If you experience issues, try clearing your browser cache or using a different browser.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="report-bug">
                    <AccordionTrigger>How do I report a bug or technical issue?</AccordionTrigger>
                    <AccordionContent>
                      <div className="text-slate-600">
                        <p className="mb-2">You can report bugs through:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Contact form on our website</li>
                          <li>Feedback button (bottom right of the page)</li>
                          <li>Email: contact@chennaitrafficcalc.in</li>
                        </ul>
                        <p className="mt-2">Please include details about what you were doing when the issue occurred, your browser type and version, and any error messages you saw.</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="slow-loading">
                    <AccordionTrigger>Why is the calculator loading slowly?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        Slow loading can be caused by poor internet connectivity, high server traffic, or Google Maps API delays. The calculator needs to fetch route data from Google Maps, which may take a few seconds. If the issue persists, try refreshing the page or check your internet connection.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="mobile-issues">
                    <AccordionTrigger>Are there known issues on mobile devices?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        The calculator is designed to work on mobile devices, but some features may work better on desktop. If you experience issues on mobile, try using landscape mode or switching to desktop. The address autocomplete works through text input without requiring device location access.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="api-errors">
                    <AccordionTrigger>What if I get "API error" or "Route not found" messages?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        These errors typically occur when Google Maps can't find a route between your locations or when API limits are reached. Try checking your addresses for typos, ensuring both locations are in Chennai area, or try again later. If the problem persists, contact us for assistance.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
                <Accordion type="single" collapsible>
                  <AccordionItem value="free-service">
                    <AccordionTrigger>Is the calculator free to use?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        Yes, the Chennai Traffic Impact Calculator is completely free to use. We accept voluntary donations to help cover Google Maps API costs, server infrastructure, and development expenses. Your donations help keep the service free for all users.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="payment-security">
                    <AccordionTrigger>Is my payment secure?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        Yes, we use Razorpay, India's trusted payment gateway with PCI DSS Level 1 compliance and bank-grade encryption. We do not store your payment card information on our servers. All transactions are processed securely through Razorpay's infrastructure.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="donation-amount">
                    <AccordionTrigger>How much should I donate?</AccordionTrigger>
                    <AccordionContent>
                      <div className="text-slate-600">
                        <p className="mb-2">Any amount helps! Here's what different amounts cover:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>₹50 covers approximately 100 route calculations</li>
                          <li>₹100 supports around 200 users</li>
                          <li>₹500 funds the service for about a week</li>
                          <li>₹1000 helps keep us running for a month</li>
                        </ul>
                        <p className="mt-2">Choose any amount that feels comfortable for you. Even small donations make a big difference!</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="refund-policy">
                    <AccordionTrigger>What is your refund policy?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        Due to the nature of donations and operational costs, we generally do not provide refunds. However, if you believe a donation was made in error or due to fraudulent activity, please contact us at contact@chennaitrafficcalc.in within 7 days of the transaction. We'll review each case individually.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="donation-usage">
                    <AccordionTrigger>Where does the donation money go?</AccordionTrigger>
                    <AccordionContent>
                      <div className="text-slate-600">
                        <p className="mb-2">Your donations are used for:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Google Maps API costs for geocoding and route calculations</li>
                          <li>Database hosting and server infrastructure</li>
                          <li>Domain name and SSL certificate renewal</li>
                          <li>Development and maintenance costs</li>
                          <li>Keeping the tool completely free for all users</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-orange-600" />
                  Data and Methodology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="data-sources">
                    <AccordionTrigger>What data sources do you use?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        We use Google Maps for route calculations and distance data, standardized vehicle emission factors from automotive research, Chennai-specific traffic congestion patterns, and public transport cost data. Our methodology page provides detailed information about all data sources and calculations with <strong>clickable links to exact research sources</strong> - including CEEW studies, 1charging.com EV analysis, Team-BHP road trip data, and government fuel pricing tools for complete verification.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="update-frequency">
                    <AccordionTrigger>How often is the data updated?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        Route and traffic data from Google Maps is updated in real-time. Vehicle emission factors and costs are updated quarterly or when new data becomes available. Chennai traffic patterns are updated based on seasonal variations and infrastructure changes. We continuously monitor and improve our data quality.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="calculation-method">
                    <AccordionTrigger>How do you calculate the impact score?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        The impact score (0-100) is calculated using a formula that considers vehicle type, route distance, traffic congestion, travel timing, frequency, and occupancy. Lower scores indicate better environmental impact. The methodology page explains the complete calculation process and factors involved.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="suggest-improvement">
                    <AccordionTrigger>How can I suggest improvements to the calculator?</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600">
                        We welcome suggestions for improving the calculator! You can send feedback through our contact form, use the feedback button on the results page, or email us at contact@chennaitrafficcalc.in. We regularly review user feedback and incorporate improvements based on user needs.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                  Still Have Questions?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  If you can't find the answer you're looking for, we're here to help!
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-900 font-medium mb-2">Contact Us:</p>
                  <p className="text-slate-600">Email: contact@chennaitrafficcalc.in</p>
                  <p className="text-slate-600">Use the feedback button on any page</p>
                  <p className="text-slate-600">Fill out our contact form</p>
                </div>
                <p className="text-slate-600 mt-4 text-sm">
                  We aim to respond as quickly as possible. For urgent technical issues, please include detailed information about the problem in your message.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Internal Links */}
          <div className="mt-8">
            <InternalLinks currentPage="faq" />
          </div>
        </div>
      </div>
    </>
  );
}