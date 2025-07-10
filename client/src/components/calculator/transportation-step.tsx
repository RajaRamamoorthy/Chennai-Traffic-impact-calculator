import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Car, Bike, Bus, Train, Car as Taxi, User } from "lucide-react";
import { api } from "@/lib/api";
import { VehicleType } from "@/types/calculator";
import { useLanguage } from "@/contexts/language-context";
import { useTranslation } from "@/lib/i18n";
import { analytics } from "@/lib/analytics";

interface TransportationStepProps {
  selectedMode: string;
  onModeSelect: (mode: string) => void;
  vehicleTypeId?: number;
  onVehicleTypeSelect: (id: number) => void;
  occupancy: number;
  onOccupancyChange: (occupancy: number) => void;
  onNext: () => void;
}

const getTransportModes = (t: any) => [
  {
    id: 'car',
    name: t.transportation.modes.car.name,
    icon: Car,
    description: t.transportation.modes.car.description,
    requiresVehicleDetails: true
  },
  {
    id: 'bike',
    name: t.transportation.modes.bike.name,
    icon: Bike,
    description: t.transportation.modes.bike.description,
    requiresVehicleDetails: true
  },
  {
    id: 'bus',
    name: t.transportation.modes.bus.name,
    icon: Bus,
    description: t.transportation.modes.bus.description,
    requiresVehicleDetails: false
  },
  {
    id: 'metro',
    name: t.transportation.modes.metro.name,
    icon: Train,
    description: t.transportation.modes.metro.description,
    requiresVehicleDetails: false
  },
  {
    id: 'auto',
    name: t.transportation.modes.auto.name,
    icon: Taxi,
    description: t.transportation.modes.auto.description,
    requiresVehicleDetails: false
  },
  {
    id: 'walking',
    name: t.transportation.modes.walking.name,
    icon: User,
    description: t.transportation.modes.walking.description,
    requiresVehicleDetails: false
  }
];

export function TransportationStep({
  selectedMode,
  onModeSelect,
  vehicleTypeId,
  onVehicleTypeSelect,
  occupancy,
  onOccupancyChange,
  onNext
}: TransportationStepProps) {
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const { language } = useLanguage();
  const t = useTranslation(language);
  const transportModes = getTransportModes(t);
  const vehicleDetailsRef = useRef<HTMLDivElement>(null);

  const { data: vehicleTypes, isLoading: vehicleTypesLoading, error } = useQuery<VehicleType[]>({
    queryKey: [`/api/vehicle-types?category=${selectedMode}`],
    enabled: !!selectedMode && (selectedMode === 'car' || selectedMode === 'bike'),
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    cacheTime: 10 * 60 * 1000, // 10 minutes - keep in cache
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  useEffect(() => {
    const selectedTransport = transportModes.find(mode => mode.id === selectedMode);
    const shouldShowDetails = selectedTransport?.requiresVehicleDetails || false;
    setShowVehicleDetails(shouldShowDetails);

    // Reset vehicle type and set occupancy to 1 for sustainable transport
    if (selectedTransport && !selectedTransport.requiresVehicleDetails) {
      onVehicleTypeSelect(undefined);
      // Always set occupancy to 1 for sustainable transport
      if (occupancy !== 1) {
        onOccupancyChange(1);
      }
    }

    // Reset occupancy if current value exceeds limits for selected mode
    if (selectedMode === 'bike' && occupancy > 3) {
      onOccupancyChange(1);
    }

    // Scroll to vehicle details when they become visible
    if (shouldShowDetails) {
      setTimeout(() => {
        vehicleDetailsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 150);
    }
  }, [selectedMode]); // Remove the callback functions from dependencies to prevent infinite loop

  // Get occupancy options based on selected mode
  const getOccupancyOptions = (mode: string) => {
    switch(mode) {
      case 'bike':
        return [
          { value: 1, label: t.transportation.occupancyOptions.justMe },
          { value: 2, label: t.transportation.occupancyOptions.people(2) },
          { value: 3, label: t.transportation.occupancyOptions.people(3) }
        ];
      case 'car':
        return [
          { value: 1, label: t.transportation.occupancyOptions.justMe },
          { value: 2, label: t.transportation.occupancyOptions.people(2) },
          { value: 3, label: t.transportation.occupancyOptions.people(3) },
          { value: 4, label: t.transportation.occupancyOptions.people(4) },
          { value: 5, label: t.transportation.occupancyOptions.people(5) },
          { value: 6, label: t.transportation.occupancyOptions.people(6) },
          { value: 7, label: t.transportation.occupancyOptions.people(7) }
        ];
      default:
        return [
          { value: 1, label: t.transportation.occupancyOptions.justMe },
          { value: 2, label: t.transportation.occupancyOptions.people(2) },
          { value: 3, label: t.transportation.occupancyOptions.people(3) },
          { value: 4, label: t.transportation.occupancyOptions.fourPlus }
        ];
    }
  };

  const canContinue = selectedMode && (!showVehicleDetails || vehicleTypeId);

  const handleModeSelect = (modeId: string) => {
    onModeSelect(modeId);
    const selectedModeData = transportModes.find(mode => mode.id === modeId);
    if (selectedModeData) {
      analytics.trackTransportModeSelection(selectedModeData.name);
    }
  };

  const handleVehicleTypeSelect = (vehicleTypeId: number) => {
    onVehicleTypeSelect(vehicleTypeId);
    if (vehicleTypes) {
      const selectedVehicleType = vehicleTypes.find(type => type.id === vehicleTypeId);
      if (selectedVehicleType) {
        analytics.trackVehicleTypeSelection(selectedVehicleType.name, selectedVehicleType.category);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">{t.transportation.title}</h2>
        <p className="text-slate-600">{t.transportation.subtitle}</p>
      </div>

      {/* Transportation Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {transportModes.map((mode) => {
          const IconComponent = mode.icon;
          const isSelected = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => handleModeSelect(mode.id)}
              className={`p-6 border-2 rounded-xl transition-all duration-200 group ${
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div className="text-center">
                <IconComponent className={`mx-auto text-3xl mb-3 ${
                  isSelected ? 'text-primary' : 'text-slate-400 group-hover:text-primary'
                }`} />
                <h3 className="font-medium text-slate-900 mb-1">{mode.name}</h3>
                <p className="text-xs text-slate-500">{mode.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Vehicle Details */}
      {showVehicleDetails && (
        <Card ref={vehicleDetailsRef} className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-medium text-slate-900 mb-4">{t.transportation.vehicleDetails}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.transportation.vehicleType}
                </label>
                <Select 
                  value={vehicleTypeId?.toString() || ""} 
                  onValueChange={(value) => handleVehicleTypeSelect(parseInt(value))}
                  disabled={vehicleTypesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={vehicleTypesLoading ? t.transportation.loading : t.transportation.selectVehicleType} />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes && vehicleTypes.length > 0 ? (
                      vehicleTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-options" disabled>
                        {t.transportation.noVehicleTypes}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.transportation.occupancy}
                </label>
                <Select 
                  value={occupancy.toString()} 
                  onValueChange={(value) => onOccupancyChange(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.transportation.occupancyPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {getOccupancyOptions(selectedMode).map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedMode && (selectedMode === 'car' || selectedMode === 'bike') && (
                  <p className="text-xs text-slate-500 mt-1">
                    💡 Higher occupancy (more people) = Lower impact score = Better for traffic
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button 
          onClick={onNext}
          disabled={!canContinue}
          className="px-8 py-3"
        >
          {t.transportation.continue}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}