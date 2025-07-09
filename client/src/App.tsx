
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/language-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FeedbackButton } from "@/components/ui/feedback-button";
import Home from "@/pages/home";
import Calculator from "@/pages/calculator";
import HowItWorks from "@/pages/how-it-works";
import Methodology from "@/pages/methodology";
import DataSources from "@/pages/data-sources";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/calculator" component={Calculator} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/methodology" component={Methodology} />
      <Route path="/data-sources" component={DataSources} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <FeedbackButton />
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
