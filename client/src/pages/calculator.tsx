import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepIndicator } from "@/components/calculator/step-indicator";
import { TransportationStep } from "@/components/calculator/transportation-step";
import { RouteStep } from "@/components/calculator/route-step";
import { ResultsStep } from "@/components/calculator/results-step";
import { Card } from "@/components/ui/card";
import { calculatorFormSchema, type CalculatorFormData } from "@/lib/validation";
import { useFormPersist } from "@/hooks/use-form-persist";
import { api } from "@/lib/api";
import { CalculationResult } from "@/types/calculator";
import { useToast } from "@/hooks/use-toast";

const TOTAL_STEPS = 3;

export default function Calculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues: {
      transportMode: "",
      occupancy: 1,
      origin: "",
      destination: "",
      timing: "",
      frequency: "",
    },
  });

  const { clearSaved } = useFormPersist(
    'chennai-traffic-calculator',
    form.watch,
    form.setValue,
    ['vehicleTypeId'] // Exclude this from auto-save as it's dependent on transport mode
  );

  const { watch, setValue, handleSubmit, reset } = form;
  const formData = watch();

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
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
      // Get route information first
      const routeInfo = await api.getRouteInfo(data.origin, data.destination);
      
      if (!routeInfo) {
        throw new Error("Could not find route between the specified locations");
      }

      // Calculate impact with route distance
      const result = await api.calculateImpact({
        ...data,
        distanceKm: routeInfo.distanceKm
      });
      
      setResults(result);
      setCurrentStep(3);
      
      toast({
        title: "Calculation complete!",
        description: `Your traffic impact score is ${result.score}/100`,
      });
      
    } catch (error: any) {
      console.error('Calculation failed:', error);
      toast({
        title: "Calculation failed",
        description: error.message || "Please check your locations and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setResults(null);
    clearSaved();
    reset();
    toast({
      title: "Calculator reset",
      description: "You can now start a new calculation.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        
        <Card className="overflow-hidden">
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
                timing={formData.timing}
                onTimingChange={(timing) => setValue('timing', timing)}
                frequency={formData.frequency}
                onFrequencyChange={(frequency) => setValue('frequency', frequency)}
                onNext={() => handleSubmit(onSubmit)()}
                onPrev={prevStep}
                isLoading={isLoading}
              />
            </form>
          )}
          
          {currentStep === 3 && results && (
            <ResultsStep 
              results={results}
              onRestart={handleRestart}
            />
          )}
        </Card>

        {/* Completion Motivation */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-700">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Join 10,000+ Chennai commuters making informed transport choices
          </div>
        </div>
      </div>
    </div>
  );
}
