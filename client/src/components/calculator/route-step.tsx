import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MapPin, ArrowLeft, Calculator, Clock } from "lucide-react";
import { LocationAutocomplete } from "@/components/ui/location-autocomplete";
import { useLanguage } from "@/contexts/language-context";
import { useTranslation } from "@/lib/i18n";
import { analytics } from "@/lib/analytics";

interface RouteStepProps {
  origin: string;
  onOriginChange: (origin: string) => void;
  destination: string;
  onDestinationChange: (destination: string) => void;
  travelPattern: string;
  onTravelPatternChange: (pattern: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

function RouteStepBase({
  origin,
  onOriginChange,
  destination,
  onDestinationChange,
  travelPattern,
  onTravelPatternChange,
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
  };

  const handleDestinationChange = (value: string) => {
    onDestinationChange(value);
  };

  const handleTravelPatternChange = (value: string) => {
    onTravelPatternChange(value);
    analytics.trackCalculationStart({ travelPattern: value });
  };

  const travelPatternOptions = [
    { 
      value: "daily-commute", 
      label: "Daily Work Commute", 
      description: "Both peak hours - morning & evening",
      icon: "🚗" 
    },
    { 
      value: "weekday-commute", 
      label: "Weekday Commute Only", 
      description: "Peak hours, 5 days/week",
      icon: "📅" 
    },
    { 
      value: "weekend-commute", 
      label: "Weekend Commute", 
      description: "Weekend peak hours",
      icon: "🛣️" 
    },
    { 
      value: "frequent-trips", 
      label: "Frequent Trips", 
      description: "3-4 times/week, flexible timing",
      icon: "🔄" 
    },
    { 
      value: "occasional-trips", 
      label: "Occasional Trips", 
      description: "1-2 times/week, mostly off-peak",
      icon: "📍" 
    },
    { 
      value: "rare-trips", 
      label: "Rare Trips", 
      description: "Few times/month, any time",
      icon: "⏰" 
    },
  ];

  const isFormValid = origin && destination && travelPattern;

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
            <LocationAutocomplete
              id="origin"
              value={origin}
              onChange={handleOriginChange}
              placeholder={t.route.fromPlaceholder}
              className="w-full"
              locationType="origin"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination">{t.route.to}</Label>
            <LocationAutocomplete
              id="destination"
              value={destination}
              onChange={handleDestinationChange}
              placeholder={t.route.toPlaceholder}
              className="w-full"
              locationType="destination"
            />
          </div>
        </div>

        {/* OR Separator */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground font-medium px-3">OR</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Popular Routes Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Popular Commute Routes</Label>
          <p className="text-xs text-muted-foreground">Click any route to auto-fill your journey</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                name: "OMR IT Corridor",
                from: "Sholinganallur, Chennai, Tamil Nadu, India",
                to: "Chennai Central Railway Station, Chennai, Tamil Nadu, India",
                description: "IT professionals commute",
                icon: "💻"
              },
              {
                name: "GST Road",
                from: "Chennai Airport, Chennai, Tamil Nadu, India", 
                to: "T. Nagar, Chennai, Tamil Nadu, India",
                description: "Airport to city center",
                icon: "✈️"
              },
              {
                name: "Anna Salai Route",
                from: "T. Nagar, Chennai, Tamil Nadu, India",
                to: "Chennai Central Railway Station, Chennai, Tamil Nadu, India", 
                description: "Shopping district to station",
                icon: "🛍️"
              },
              {
                name: "Suburban Route",
                from: "Tambaram, Chennai, Tamil Nadu, India",
                to: "Chennai Central Railway Station, Chennai, Tamil Nadu, India",
                description: "Suburb to city center",
                icon: "🏘️"
              }
            ].map((route) => (
              <button
                key={route.name}
                type="button"
                onClick={() => {
                  handleOriginChange(route.from);
                  handleDestinationChange(route.to);
                  analytics.trackRouteSearch({
                    origin: route.from,
                    destination: route.to,
                    search_method: 'popular_route'
                  });
                }}
                className="flex items-start gap-3 p-3 text-left border rounded-lg hover:bg-accent hover:border-primary transition-colors group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {route.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground group-hover:text-primary">
                    {route.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {route.description}
                  </div>
                  <div className="text-xs text-muted-foreground/80 mt-1 truncate">
                    {route.from.split(',')[0]} → {route.to.split(',')[0]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Travel Pattern Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <Label className="text-lg font-semibold">How do you typically use this route?</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Choose the pattern that best describes your travel habits for more accurate impact calculation.
          </p>
          <RadioGroup value={travelPattern} onValueChange={handleTravelPatternChange}>
            <div className="grid grid-cols-1 gap-3">
              {travelPatternOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor={option.value} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <span className="text-lg">{option.icon}</span>
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
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

export const RouteStep = React.memo(RouteStepBase);