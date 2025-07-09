import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Car, Bike, Bus, Train, Car as Taxi, User } from "lucide-react";
import { api } from "@/lib/api";
import { VehicleType } from "@/types/calculator";

interface TransportationStepProps {
  selectedMode: string;
  onModeSelect: (mode: string) => void;
  vehicleTypeId?: number;
  onVehicleTypeSelect: (id: number) => void;
  occupancy: number;
  onOccupancyChange: (occupancy: number) => void;
  onNext: () => void;
}

const transportModes = [
  {
    id: 'car',
    name: 'Car',
    icon: Car,
    description: 'Private vehicle',
    requiresVehicleDetails: true
  },
  {
    id: 'bike',
    name: 'Bike',
    icon: Bike,
    description: 'Two-wheeler',
    requiresVehicleDetails: true
  },
  {
    id: 'bus',
    name: 'Bus',
    icon: Bus,
    description: 'Public transport',
    requiresVehicleDetails: false
  },
  {
    id: 'metro',
    name: 'Metro',
    icon: Train,
    description: 'Chennai Metro',
    requiresVehicleDetails: false
  },
  {
    id: 'auto',
    name: 'Auto',
    icon: Taxi,
    description: 'Auto-rickshaw',
    requiresVehicleDetails: false
  },
  {
    id: 'walking',
    name: 'Walking',
    icon: User,
    description: 'On foot',
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

  const { data: vehicleTypes } = useQuery<VehicleType[]>({
    queryKey: ['/api/vehicle-types', selectedMode],
    queryFn: async () => {
      const response = await api(`/api/vehicle-types?category=${selectedMode}`);
      return response.json();
    },
    enabled: !!selectedMode && (selectedMode === 'car' || selectedMode === 'bike'),
  });

  useEffect(() => {
    const selectedTransport = transportModes.find(mode => mode.id === selectedMode);
    setShowVehicleDetails(selectedTransport?.requiresVehicleDetails || false);
    
    // Reset vehicle type and occupancy for sustainable transport
    if (selectedTransport && !selectedTransport.requiresVehicleDetails) {
      onVehicleTypeSelect(undefined);
      onOccupancyChange(1);
    }
  }, [selectedMode]); // Remove the callback functions from dependencies to prevent infinite loop

  const canContinue = selectedMode && (!showVehicleDetails || vehicleTypeId);

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">How do you usually commute?</h2>
        <p className="text-slate-600">Select your primary mode of transportation in Chennai</p>
      </div>

      {/* Transportation Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {transportModes.map((mode) => {
          const IconComponent = mode.icon;
          const isSelected = selectedMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeSelect(mode.id)}
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
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-medium text-slate-900 mb-4">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vehicle Type
                </label>
                <Select 
                  value={vehicleTypeId?.toString()} 
                  onValueChange={(value) => onVehicleTypeSelect(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Occupancy
                </label>
                <Select 
                  value={occupancy.toString()} 
                  onValueChange={(value) => onOccupancyChange(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How many people?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 person (just me)</SelectItem>
                    <SelectItem value="2">2 people</SelectItem>
                    <SelectItem value="3">3 people</SelectItem>
                    <SelectItem value="4">4+ people</SelectItem>
                  </SelectContent>
                </Select>
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
          Continue
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
