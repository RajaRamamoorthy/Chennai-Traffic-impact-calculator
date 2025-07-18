import React from "react";
import { Route, Switch, Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { queryClient } from "@/lib/queryClient";
import { LanguageProvider } from "@/contexts/language-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { FeedbackButton } from "@/components/ui/feedback-button";
import Home from "@/pages/home";
import Calculator from "@/pages/calculator";
import HowItWorks from "@/pages/how-it-works";
import Methodology from "@/pages/methodology";
import DataSources from "@/pages/data-sources";
import Support from "@/pages/support";
import ThankYou from "@/pages/thank-you";
import AboutMe from "@/pages/about-me";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsConditions from "@/pages/terms-conditions";
import FAQ from "@/pages/faq";
import Dashboard from "@/pages/dashboard";
import { AdminDashboard } from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
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