import { Route, Switch, Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "@/lib/queryClient";
import { LanguageProvider } from "@/contexts/language-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { FeedbackButton } from "@/components/ui/feedback-button";
import { LazyLoader } from "@/components/ui/lazy-loader";
import { lazy, Suspense } from "react";

// Critical route - load immediately
import Home from "@/pages/home";

// Lazy load other components for better performance
const Calculator = lazy(() => import("@/pages/calculator"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const HowItWorks = lazy(() => import("@/pages/how-it-works"));
const Methodology = lazy(() => import("@/pages/methodology"));
const DataSources = lazy(() => import("@/pages/data-sources"));
const Support = lazy(() => import("@/pages/support"));
const ThankYou = lazy(() => import("@/pages/thank-you"));
const AboutMe = lazy(() => import("@/pages/about-me"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsConditions = lazy(() => import("@/pages/terms-conditions"));
const FAQ = lazy(() => import("@/pages/faq"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard").then(module => ({ default: module.default })));
const NotFound = lazy(() => import("@/pages/not-found"));

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
                  <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/calculator" component={Calculator} />
                    <Route path="/how-it-works" component={HowItWorks} />
                    <Route path="/methodology" component={Methodology} />
                    <Route path="/data-sources" component={DataSources} />
                    <Route path="/support" component={Support} />
                    <Route path="/thank-you" component={ThankYou} />
                    <Route path="/about-me" component={AboutMe} />
                    <Route path="/privacy-policy" component={PrivacyPolicy} />
                    <Route path="/terms-conditions" component={TermsConditions} />
                    <Route path="/faq" component={FAQ} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/admin-dashboard-9c8e4b7a" component={AdminDashboard} />
                    <Route component={NotFound} />
                  </Switch>
                </Suspense>
              </main>
              <Footer />
              <FeedbackButton />
              <Toaster />
            </div>
          </Router>
        </LanguageProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;