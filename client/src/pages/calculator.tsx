import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { StepIndicator } from "@/components/calculator/step-indicator";
import { TransportationStep } from "@/components/calculator/transportation-step";
import { RouteStep } from "@/components/calculator/route-step";
import { Card } from "@/components/ui/card";
import { calculatorFormSchema, type CalculatorFormData } from "@/lib/validation";
import { SEO } from "@/components/seo";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InternalLinks } from "@/components/layout/internal-links";

import { api } from "@/lib/api";
import { CalculationResult } from "@/types/calculator";
import { useToast } from "@/hooks/use-toast";
import { analytics } from "@/lib/analytics";

// Lazy load ResultsStep for better performance
const ResultsStep = lazy(() => import("@/components/calculator/results-step").then(module => ({ default: module.ResultsStep })));

const TOTAL_STEPS = 3;

export default function Calculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  const hasQueryParams = location.includes('?');

  const calculatorPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Chennai Traffic Impact Calculator",
    "applicationCategory": "UtilityApplication",
    "description": "Calculate your traffic impact and discover sustainable transportation alternatives in Chennai",
    "featureList": [
      "Multi-step traffic impact calculation",
      "Route optimization suggestions", 
      "Public transport alternatives",
      "Environmental impact assessment",
      "Cost comparison analysis"
    ],
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };

  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues: {
      transportMode: "",
      occupancy: 1,
      origin: "",
      destination: "",
      travelPattern: "",
    },
  });



  const { watch, setValue, handleSubmit, reset } = form;
  const formData = watch();

    // Track page view on component mount
  useEffect(() => {
    analytics.trackPageView('calculator', 'Chennai Traffic Impact Calculator');
  }, []);

  // Track step progression
  useEffect(() => {
    const stepNames = {
      1: 'transportation_selection',
      2: 'route_input',
      3: 'results_display'
    };
    analytics.trackStepProgression(currentStep, stepNames[currentStep as keyof typeof stepNames] || 'unknown');
  }, [currentStep]);

  const scrollToTop = () => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ 
        behavior: 'instant', 
        block: 'start' 
      });
    }
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        scrollToTop();
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CalculatorFormData) => {
    setIsLoading(true);

    try {
      // Validate that origin and destination are different
      if (data.origin.toLowerCase().trim() === data.destination.toLowerCase().trim()) {
        throw new Error("Origin and destination cannot be the same location. Please select different locations.");
      }

      // Get route information first
      const routeInfo = await api.getRouteInfo(data.origin, data.destination);

      if (!routeInfo) {
        throw new Error("Could not find a valid route between the specified locations. Please check that both locations are valid and try again.");
      }

      if (routeInfo.distanceKm <= 0) {
        throw new Error("The calculated distance is too short. Please select locations that are further apart.");
      }

      // Calculate impact with route distance
      const result = await api.calculateImpact({
        ...data,
        distanceKm: routeInfo.distanceKm
      });

      setResults(result);
      setCurrentStep(3);
      
      // Scroll to top of results after state update
      setTimeout(scrollToTop, 100);

      toast({
        title: "Calculation complete!",
        description: `Your traffic impact score is ${result.score}/100`,
      });

    } catch (error: any) {
      console.error('Calculation failed:', error);
      const errorMessage = error.message || "An unexpected error occurred. Please check your locations and try again.";
      toast({
        title: "Calculation failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setResults(null);
    reset();
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      scrollToTop();
    });
    
    toast({
      title: "Calculator reset",
      description: "You can now start a new calculation.",
    });
  };
  



  return (
    <>
      <SEO
        title="Chennai Traffic Calculator – Live Congestion & Route Analysis"
        description="Real-time Chennai traffic calculator with live jam updates. Check congestion scores for OMR, GST Road, Anna Salai routes and optimize your commute."
        keywords="Chennai traffic calculator, Chennai traffic live, Chennai congestion score, Chennai jam tracker, Chennai route planner, Chennai commute calculator, Chennai traffic analysis, Kathipara flyover traffic, OMR traffic status, Chennai delay calculator"
        canonical="https://chennaitrafficcalc.in/calculator"
        structuredData={calculatorPageSchema}
        noindex={hasQueryParams}
      />
      <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb 
          items={[]}
          currentPage="Traffic Calculator"
        />
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <Card ref={cardRef} className="overflow-hidden">
          {currentStep === 1 && (
            <TransportationStep
              selectedMode={formData.transportMode}
              onModeSelect={(mode) => setValue('transportMode', mode)}
              vehicleTypeId={formData.vehicleTypeId}
              onVehicleTypeSelect={(id) => setValue('vehicleTypeId', id)}
              occupancy={formData.occupancy}
              onOccupancyChange={(occupancy) => setValue('occupancy', occupancy)}
              onNext={nextStep}
            />
          )}

          {currentStep === 2 && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <RouteStep
                origin={formData.origin}
                onOriginChange={(origin) => setValue('origin', origin)}
                destination={formData.destination}
                onDestinationChange={(destination) => setValue('destination', destination)}
                travelPattern={formData.travelPattern}
                onTravelPatternChange={(travelPattern) => setValue('travelPattern', travelPattern)}
                onNext={() => handleSubmit(onSubmit)()}
                onPrev={prevStep}
                isLoading={isLoading}
              />
            </form>
          )}

          {currentStep === 3 && results && (
            <Suspense fallback={
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Loading results...</p>
              </div>
            }>
              <ResultsStep 
                results={results}
                onRestart={handleRestart}
              />
            </Suspense>
          )}
        </Card>

        {/* Internal Links */}
        {currentStep === 3 && results && (
          <div className="mt-8">
            <InternalLinks currentPage="calculator" />
          </div>
        )}
      </div>
    </div>
    </>
  );
}