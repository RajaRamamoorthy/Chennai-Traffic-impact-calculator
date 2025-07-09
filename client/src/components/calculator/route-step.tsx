import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, ArrowLeft, Calculator, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useTranslation } from "@/lib/i18n";
import { analytics } from "@/lib/analytics";

interface RouteStepProps {
  origin: string;
  onOriginChange: (origin: string) => void;
  destination: string;
  onDestinationChange: (destination: string) => void;
  timing: string;
  onTimingChange: (timing: string) => void;
  frequency: string;
  onFrequencyChange: (frequency: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

export function RouteStep({
  origin,
  onOriginChange,
  destination,
  onDestinationChange,
  timing,
  onTimingChange,
  frequency,
  onFrequencyChange,
  onNext,
  onPrev,
  isLoading,
}: RouteStepProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);

  useEffect(() => {
    if (origin && destination) {
      analytics.trackRouteSearch({
        origin,
        destination,
        search_method: 'manual'
      });
    }
  }, [origin, destination]);

  const handleOriginChange = (value: string) => {
    onOriginChange(value);
    analytics.trackLocationSelect(value, 'origin');
  };

  const handleDestinationChange = (value: string) => {
    onDestinationChange(value);
    analytics.trackLocationSelect(value, 'destination');
  };

  const handleTimingChange = (value: string) => {
    onTimingChange(value);
    analytics.trackCalculationStart({ timing: value });
  };

  const handleFrequencyChange = (value: string) => {
    onFrequencyChange(value);
    analytics.trackCalculationStart({ frequency: value });
  };

  const timingOptions = [
    { value: "morning-peak", label: "Morning Peak (7-10 AM)" },
    { value: "evening-peak", label: "Evening Peak (5-8 PM)" },
    { value: "off-peak", label: "Off-Peak Hours" },
    { value: "night", label: "Night (10 PM - 6 AM)" },
  ];

  const frequencyOptions = [
    { value: "daily", label: t.route.frequencyOptions.daily },
    { value: "weekdays", label: t.route.frequencyOptions.weekdays },
    { value: "weekends", label: t.route.frequencyOptions.weekends },
    { value: "occasional", label: t.route.frequencyOptions.occasional },
  ];

  const isFormValid = origin && destination && timing && frequency;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t.route.title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {t.route.subtitle}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Route Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="origin">{t.route.from}</Label>
            <Input
              id="origin"
              value={origin}
              onChange={(e) => handleOriginChange(e.target.value)}
              placeholder={t.route.fromPlaceholder}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">{t.route.to}</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              placeholder={t.route.toPlaceholder}
              className="w-full"
            />
          </div>
        </div>

        {/* Timing Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Travel Time</Label>
          <RadioGroup value={timing} onValueChange={handleTimingChange}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {timingOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Frequency Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">{t.route.frequency}</Label>
          <RadioGroup value={frequency} onValueChange={handleFrequencyChange}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {frequencyOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.common.back}
          </Button>
          <Button
            type="button"
            onClick={onNext}
            disabled={!isFormValid || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                {t.route.calculating}
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                {t.route.continue}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}