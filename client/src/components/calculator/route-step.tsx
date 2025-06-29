import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calculator, MapPin, Flag, Clock, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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

const popularRoutes = [
  { from: "T. Nagar", to: "IT Corridor", duration: "~45 min peak hours" },
  { from: "Central Chennai", to: "Airport", duration: "~60 min peak hours" },
  { from: "Adyar", to: "Anna Nagar", duration: "~50 min peak hours" },
  { from: "Velachery", to: "Egmore", duration: "~40 min peak hours" }
];

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
  isLoading
}: RouteStepProps) {
  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const { toast } = useToast();

  // Debounced autocomplete for origin
  useEffect(() => {
    if (origin.length < 3) {
      setOriginSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const suggestions = await api.getPlaceAutocomplete(origin);
        setOriginSuggestions(suggestions);
      } catch (error) {
        console.error('Origin autocomplete error:', error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [origin]);

  // Debounced autocomplete for destination
  useEffect(() => {
    if (destination.length < 3) {
      setDestinationSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const suggestions = await api.getPlaceAutocomplete(destination);
        setDestinationSuggestions(suggestions);
      } catch (error) {
        console.error('Destination autocomplete error:', error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [destination]);

  const canContinue = origin.trim() && destination.trim() && timing && frequency;

  const handlePopularRouteClick = (route: typeof popularRoutes[0]) => {
    onOriginChange(route.from);
    onDestinationChange(route.to);
    setShowOriginSuggestions(false);
    setShowDestinationSuggestions(false);
  };

  const handleOriginSelect = (suggestion: any) => {
    onOriginChange(suggestion.description);
    setShowOriginSuggestions(false);
  };

  const handleDestinationSelect = (suggestion: any) => {
    onDestinationChange(suggestion.description);
    setShowDestinationSuggestions(false);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Tell us about your route</h2>
        <p className="text-slate-600">Enter your starting point and destination</p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Origin Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <MapPin className="inline w-4 h-4 text-green-500 mr-2" />
            From (Starting Point)
          </label>
          <Input
            type="text"
            placeholder="Enter your starting location in Chennai"
            value={origin}
            onChange={(e) => {
              onOriginChange(e.target.value);
              setShowOriginSuggestions(true);
            }}
            onFocus={() => setShowOriginSuggestions(true)}
            onBlur={() => {
              // Delay hiding to allow clicking on suggestions
              setTimeout(() => setShowOriginSuggestions(false), 200);
            }}
            className="w-full"
          />
          
          {/* Origin Suggestions */}
          {showOriginSuggestions && originSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {originSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b last:border-b-0"
                  onClick={() => handleOriginSelect(suggestion)}
                >
                  <div className="font-medium text-slate-900">{suggestion.structured_formatting?.main_text}</div>
                  <div className="text-sm text-slate-600">{suggestion.structured_formatting?.secondary_text}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Destination Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <Flag className="inline w-4 h-4 text-red-500 mr-2" />
            To (Destination)
          </label>
          <Input
            type="text"
            placeholder="Enter your destination in Chennai"
            value={destination}
            onChange={(e) => {
              onDestinationChange(e.target.value);
              setShowDestinationSuggestions(true);
            }}
            onFocus={() => setShowDestinationSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowDestinationSuggestions(false), 200);
            }}
            className="w-full"
          />
          
          {/* Destination Suggestions */}
          {showDestinationSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {destinationSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 border-b last:border-b-0"
                  onClick={() => handleDestinationSelect(suggestion)}
                >
                  <div className="font-medium text-slate-900">{suggestion.structured_formatting?.main_text}</div>
                  <div className="text-sm text-slate-600">{suggestion.structured_formatting?.secondary_text}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timing and Frequency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Clock className="inline w-4 h-4 text-yellow-500 mr-2" />
              Travel Time
            </label>
            <Select value={timing} onValueChange={onTimingChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select travel time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning-peak">Morning Peak (7-10 AM)</SelectItem>
                <SelectItem value="evening-peak">Evening Peak (5-8 PM)</SelectItem>
                <SelectItem value="off-peak">Off Peak Hours</SelectItem>
                <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar className="inline w-4 h-4 text-blue-500 mr-2" />
              Frequency
            </label>
            <Select value={frequency} onValueChange={onFrequencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="How often?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily (5-7 days/week)</SelectItem>
                <SelectItem value="frequent">Frequent (3-4 days/week)</SelectItem>
                <SelectItem value="occasional">Occasional (1-2 days/week)</SelectItem>
                <SelectItem value="rare">Rarely (few times/month)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Quick Route Suggestions */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <h3 className="font-medium text-slate-900 mb-3">Popular Routes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {popularRoutes.map((route, index) => (
              <button
                key={index}
                onClick={() => handlePopularRouteClick(route)}
                className="text-left p-2 rounded hover:bg-blue-50 transition-colors"
              >
                <div className="text-sm font-medium text-slate-900">
                  {route.from} → {route.to}
                </div>
                <div className="text-xs text-slate-600">{route.duration}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          className="px-6 py-3"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canContinue || isLoading}
          className="px-8 py-3"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Calculating...
            </>
          ) : (
            <>
              Calculate Impact
              <Calculator className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
