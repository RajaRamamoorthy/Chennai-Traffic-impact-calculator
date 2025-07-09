import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Home from "@/pages/home";
import Calculator from "@/pages/calculator";
import HowItWorks from "@/pages/how-it-works";
import Methodology from "@/pages/methodology";
import DataSources from "@/pages/data-sources";
import NotFound from "@/pages/not-found";
import { queryClient } from "@/lib/queryClient";

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
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;