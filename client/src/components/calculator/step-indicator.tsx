
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Transportation" },
    { number: 2, label: "Route Details" },
    { number: 3, label: "Results" }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2 sm:space-x-4 max-w-full overflow-x-auto px-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-shrink-0">
              {/* Step Circle */}
              <div className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-medium text-sm ${
                  step.number <= currentStep 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-300 text-slate-600'
                }`}>
                  {step.number}
                </div>
                <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium whitespace-nowrap ${
                  step.number <= currentStep ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {step.label}
                </span>
              </div>
              
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 flex-shrink-0 ${
                  step.number < currentStep ? 'bg-primary' : 'bg-slate-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
