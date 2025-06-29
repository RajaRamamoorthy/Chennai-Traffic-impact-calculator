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
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              {/* Step Circle */}
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step.number <= currentStep 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-300 text-slate-600'
                }`}>
                  {step.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.number <= currentStep ? 'text-slate-900' : 'text-slate-500'
                }`}>
                  {step.label}
                </span>
              </div>
              
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
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
