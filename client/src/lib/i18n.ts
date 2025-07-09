
export interface Translations {
  header: {
    title: string;
    about: string;
    home: string;
  };
  transportation: {
    title: string;
    subtitle: string;
    modes: {
      car: { name: string; description: string };
      bike: { name: string; description: string };
      bus: { name: string; description: string };
      metro: { name: string; description: string };
      auto: { name: string; description: string };
      walking: { name: string; description: string };
    };
    vehicleDetails: string;
    vehicleType: string;
    occupancy: string;
    occupancyPlaceholder: string;
    continue: string;
    loading: string;
    selectVehicleType: string;
    noVehicleTypes: string;
    occupancyOptions: {
      justMe: string;
      people: (count: number) => string;
      fourPlus: string;
    };
  };
  route: {
    title: string;
    subtitle: string;
    from: string;
    to: string;
    fromPlaceholder: string;
    toPlaceholder: string;
    distance: string;
    frequency: string;
    frequencyOptions: {
      daily: string;
      weekdays: string;
      weekends: string;
      occasional: string;
    };
    continue: string;
    calculating: string;
  };
  results: {
    title: string;
    subtitle: string;
    score: string;
    impact: string;
    emissions: string;
    cost: string;
    time: string;
    recommendations: string;
    shareTitle: string;
    calculateAnother: string;
    units: {
      kgCO2: string;
      rupees: string;
      minutes: string;
      km: string;
    };
    levels: {
      low: string;
      moderate: string;
      high: string;
      veryHigh: string;
    };
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    back: string;
    next: string;
  };
}

export const translations: Record<'en' | 'ta', Translations> = {
  en: {
    header: {
      title: "Chennai Traffic Impact Calculator",
      about: "About",
      home: "Go to Home"
    },
    transportation: {
      title: "How do you usually commute?",
      subtitle: "Select your primary mode of transportation in Chennai",
      modes: {
        car: { name: "Car", description: "Private vehicle" },
        bike: { name: "Bike", description: "Two-wheeler" },
        bus: { name: "Bus", description: "Public transport" },
        metro: { name: "Metro", description: "Chennai Metro" },
        auto: { name: "Auto", description: "Auto-rickshaw" },
        walking: { name: "Walking", description: "On foot" }
      },
      vehicleDetails: "Vehicle Details",
      vehicleType: "Vehicle Type",
      occupancy: "Occupancy",
      occupancyPlaceholder: "How many people?",
      continue: "Continue",
      loading: "Loading...",
      selectVehicleType: "Select vehicle type",
      noVehicleTypes: "No vehicle types available",
      occupancyOptions: {
        justMe: "1 person (just me)",
        people: (count: number) => `${count} people`,
        fourPlus: "4+ people"
      }
    },
    route: {
      title: "Where do you travel?",
      subtitle: "Enter your usual route in Chennai",
      from: "From",
      to: "To",
      fromPlaceholder: "Enter starting location",
      toPlaceholder: "Enter destination",
      distance: "Distance",
      frequency: "How often do you travel this route?",
      frequencyOptions: {
        daily: "Daily (both ways)",
        weekdays: "Weekdays only",
        weekends: "Weekends only",
        occasional: "Occasionally"
      },
      continue: "Calculate Impact",
      calculating: "Calculating your impact..."
    },
    results: {
      title: "Your Traffic Impact Score",
      subtitle: "Based on your commute pattern in Chennai",
      score: "Impact Score",
      impact: "Environmental Impact",
      emissions: "CO₂ Emissions",
      cost: "Monthly Cost",
      time: "Travel Time",
      recommendations: "Recommendations",
      shareTitle: "Share Your Results",
      calculateAnother: "Calculate Another Route",
      units: {
        kgCO2: "kg CO₂/month",
        rupees: "₹/month",
        minutes: "min/trip",
        km: "km"
      },
      levels: {
        low: "Low Impact",
        moderate: "Moderate Impact",
        high: "High Impact",
        veryHigh: "Very High Impact"
      }
    },
    common: {
      loading: "Loading...",
      error: "Something went wrong",
      retry: "Try again",
      back: "Back",
      next: "Next"
    }
  },
  ta: {
    header: {
      title: "சென்னை போக்குவரத்து தாக்க கணிப்பான்",
      about: "பற்றி",
      home: "முகப்புக்கு செல்லவும்"
    },
    transportation: {
      title: "நீங்கள் எப்படி பயணம் செய்கிறீர்கள்?",
      subtitle: "சென்னையில் உங்கள் முதன்மை போக்குவரத்து முறையை தேர்ந்தெடுக்கவும்",
      modes: {
        car: { name: "கார்", description: "தனியார் வாகனம்" },
        bike: { name: "பைக்", description: "இருசக்கர வாகனம்" },
        bus: { name: "பேருந்து", description: "பொது போக்குவரத்து" },
        metro: { name: "மெட்ரோ", description: "சென்னை மெட்ரோ" },
        auto: { name: "ஆட்டோ", description: "ஆட்டோ ரிக்ஷா" },
        walking: { name: "நடைப்பயணம்", description: "கால் நடையாக" }
      },
      vehicleDetails: "வாகன விவரங்கள்",
      vehicleType: "வாகன வகை",
      occupancy: "பயணிகள் எண்ணிக்கை",
      occupancyPlaceholder: "எத்தனை பேர்?",
      continue: "தொடரவும்",
      loading: "ஏற்றுகிறது...",
      selectVehicleType: "வாகன வகையை தேர்ந்தெடுக்கவும்",
      noVehicleTypes: "வாகன வகைகள் இல்லை",
      occupancyOptions: {
        justMe: "1 நபர் (நான் மட்டும்)",
        people: (count: number) => `${count} நபர்கள்`,
        fourPlus: "4+ நபர்கள்"
      }
    },
    route: {
      title: "நீங்கள் எங்கு பயணம் செய்கிறீர்கள்?",
      subtitle: "சென்னையில் உங்கள் வழக்கமான பாதையை உள்ளிடவும்",
      from: "இருந்து",
      to: "வரை",
      fromPlaceholder: "தொடக்க இடத்தை உள்ளிடவும்",
      toPlaceholder: "சேருமிடத்தை உள்ளிடவும்",
      distance: "தூரம்",
      frequency: "இந்த பாதையில் எத்தனை முறை பயணம் செய்கிறீர்கள்?",
      frequencyOptions: {
        daily: "தினசரி (இரு திசைகளிலும்)",
        weekdays: "வார நாட்களில் மட்டும்",
        weekends: "வார இறுதியில் மட்டும்",
        occasional: "எப்போதாவது"
      },
      continue: "தாக்கத்தை கணக்கிடவும்",
      calculating: "உங்கள் தாக்கத்தை கணக்கிடுகிறது..."
    },
    results: {
      title: "உங்கள் போக்குவரத்து தாக்க மதிப்பெண்",
      subtitle: "சென்னையில் உங்கள் பயண முறையின் அடிப்படையில்",
      score: "தாக்க மதிப்பெண்",
      impact: "சுற்றுச்சூழல் தாக்கம்",
      emissions: "CO₂ வெளியேற்றம்",
      cost: "மாதாந்திர செலவு",
      time: "பயண நேரம்",
      recommendations: "பரிந்துரைகள்",
      shareTitle: "உங்கள் முடிவுகளை பகிரவும்",
      calculateAnother: "மற்றொரு பாதையை கணக்கிடவும்",
      units: {
        kgCO2: "கிலோ CO₂/மாதம்",
        rupees: "₹/மாதம்",
        minutes: "நிமி/பயணம்",
        km: "கிமி"
      },
      levels: {
        low: "குறைந்த தாக்கம்",
        moderate: "மிதமான தாக்கம்",
        high: "அதிக தாக்கம்",
        veryHigh: "மிக அதிக தாக்கம்"
      }
    },
    common: {
      loading: "ஏற்றுகிறது...",
      error: "ஏதோ தவறு நடந்துள்ளது",
      retry: "மீண்டும் முயற்சி செய்யவும்",
      back: "பின்னால்",
      next: "அடுத்தது"
    }
  }
};

export function useTranslation(language: 'en' | 'ta') {
  return translations[language];
}
