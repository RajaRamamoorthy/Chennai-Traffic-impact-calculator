import { db } from "./db";
import { vehicleTypes, routeCongestion, contactSubmissions, calculations, feedback } from "@shared/schema";

const seedVehicleTypes = [
  // Cars - Body Styles with Popular Models
  {
    name: 'Hatchback (Swift, Baleno)',
    category: 'car',
    emissionFactor: '0.142', // kg CO2/km
    fuelCostPerKm: '6.50',   // ₹/km
    avgSpeedKmh: 25,
    baseImpactScore: 45
  },
  {
    name: 'Compact Sedan (Dzire, Amaze)',
    category: 'car',
    emissionFactor: '0.148',
    fuelCostPerKm: '7.20',
    avgSpeedKmh: 25,
    baseImpactScore: 47
  },
  {
    name: 'Sedan (City, Verna)',
    category: 'car',
    emissionFactor: '0.155',
    fuelCostPerKm: '8.50',
    avgSpeedKmh: 28,
    baseImpactScore: 50
  },
  {
    name: 'Premium Sedan (Camry, Accord)',
    category: 'car',
    emissionFactor: '0.165',
    fuelCostPerKm: '10.20',
    avgSpeedKmh: 30,
    baseImpactScore: 58
  },
  {
    name: 'Compact SUV (Brezza, Venue)',
    category: 'car',
    emissionFactor: '0.158',
    fuelCostPerKm: '8.80',
    avgSpeedKmh: 28,
    baseImpactScore: 52
  },
  {
    name: 'Mid-size SUV (Creta, Seltos)',
    category: 'car',
    emissionFactor: '0.168',
    fuelCostPerKm: '9.20',
    avgSpeedKmh: 30,
    baseImpactScore: 55
  },
  {
    name: 'MUV/MPV (Ertiga, Innova)',
    category: 'car',
    emissionFactor: '0.172',
    fuelCostPerKm: '9.50',
    avgSpeedKmh: 28,
    baseImpactScore: 57
  },
  {
    name: 'Luxury SUV (XUV700, Fortuner)',
    category: 'car',
    emissionFactor: '0.185',
    fuelCostPerKm: '12.00',
    avgSpeedKmh: 32,
    baseImpactScore: 65
  },
  {
    name: 'Electric Car (Nexon EV, Tiago EV)',
    category: 'car',
    emissionFactor: '0.045', // Lower due to electric
    fuelCostPerKm: '2.80',   // Lower operating cost
    avgSpeedKmh: 25,
    baseImpactScore: 25
  },

  // Two-wheelers - Engine Categories with Popular Models
  {
    name: 'Scooter 100-125cc (Activa, Jupiter)',
    category: 'bike',
    emissionFactor: '0.062',
    fuelCostPerKm: '2.10',
    avgSpeedKmh: 30,
    baseImpactScore: 25
  },
  {
    name: 'Premium Scooter 150cc+ (Aerox 155, NTorq 125)',
    category: 'bike',
    emissionFactor: '0.068',
    fuelCostPerKm: '2.40',
    avgSpeedKmh: 32,
    baseImpactScore: 28
  },
  {
    name: 'Commuter Bike 100-150cc (Splendor, HF Deluxe)',
    category: 'bike',
    emissionFactor: '0.055',
    fuelCostPerKm: '2.00',
    avgSpeedKmh: 35,
    baseImpactScore: 22
  },
  {
    name: 'Sports Bike 150-200cc (Pulsar 150, FZ-S)',
    category: 'bike',
    emissionFactor: '0.058',
    fuelCostPerKm: '2.30',
    avgSpeedKmh: 38,
    baseImpactScore: 24
  },
  {
    name: 'Mid-capacity Bike 200-350cc (Dominar 250, Duke 250)',
    category: 'bike',
    emissionFactor: '0.063',
    fuelCostPerKm: '2.60',
    avgSpeedKmh: 40,
    baseImpactScore: 26
  },
  {
    name: 'High-capacity Bike 350cc+ (Duke 390, Classic 350)',
    category: 'bike',
    emissionFactor: '0.065',
    fuelCostPerKm: '2.80',
    avgSpeedKmh: 42,
    baseImpactScore: 28
  },
  {
    name: 'Electric Two-wheeler (Ather 450X, TVS iQube)',
    category: 'bike',
    emissionFactor: '0.018',
    fuelCostPerKm: '0.80',
    avgSpeedKmh: 35,
    baseImpactScore: 12
  },

  // Public Transport
  {
    name: 'Chennai Metro',
    category: 'metro',
    emissionFactor: '0.025',
    fuelCostPerKm: '2.50',
    avgSpeedKmh: 35,
    baseImpactScore: 15
  },
  {
    name: 'MTC Bus',
    category: 'bus',
    emissionFactor: '0.045',
    fuelCostPerKm: '1.50',
    avgSpeedKmh: 20,
    baseImpactScore: 20
  },
  {
    name: 'Auto Rickshaw',
    category: 'auto',
    emissionFactor: '0.075',
    fuelCostPerKm: '12.00',
    avgSpeedKmh: 25,
    baseImpactScore: 35
  },

  // Active Transport
  {
    name: 'Walking',
    category: 'walking',
    emissionFactor: '0.000',
    fuelCostPerKm: '0.00',
    avgSpeedKmh: 5,
    baseImpactScore: 5
  },
  {
    name: 'Cycling',
    category: 'walking',
    emissionFactor: '0.000',
    fuelCostPerKm: '0.10', // Maintenance cost
    avgSpeedKmh: 15,
    baseImpactScore: 5
  }
];

const seedRouteCongestion = [
  // High Traffic Areas
  {
    areaName: 'Anna Salai',
    lat: '13.0569',
    lng: '80.2485',
    morningPeakMultiplier: '2.5',
    eveningPeakMultiplier: '2.8',
    offPeakMultiplier: '1.5',
    nightMultiplier: '1.0'
  },
  {
    areaName: 'T. Nagar',
    lat: '13.0418',
    lng: '80.2341',
    morningPeakMultiplier: '2.8',
    eveningPeakMultiplier: '3.0',
    offPeakMultiplier: '1.8',
    nightMultiplier: '1.2'
  },
  {
    areaName: 'OMR IT Corridor',
    lat: '12.9165',
    lng: '80.2284',
    morningPeakMultiplier: '2.2',
    eveningPeakMultiplier: '2.5',
    offPeakMultiplier: '1.4',
    nightMultiplier: '1.0'
  },
  {
    areaName: 'GST Road',
    lat: '12.9716',
    lng: '80.1946',
    morningPeakMultiplier: '2.0',
    eveningPeakMultiplier: '2.3',
    offPeakMultiplier: '1.3',
    nightMultiplier: '1.0'
  },
  {
    areaName: 'Porur',
    lat: '13.0378',
    lng: '80.1585',
    morningPeakMultiplier: '2.3',
    eveningPeakMultiplier: '2.6',
    offPeakMultiplier: '1.5',
    nightMultiplier: '1.1'
  },

  // Medium Traffic Areas
  {
    areaName: 'Adyar',
    lat: '13.0067',
    lng: '80.2572',
    morningPeakMultiplier: '1.8',
    eveningPeakMultiplier: '2.0',
    offPeakMultiplier: '1.2',
    nightMultiplier: '1.0'
  },
  {
    areaName: 'Anna Nagar',
    lat: '13.0850',
    lng: '80.2101',
    morningPeakMultiplier: '1.9',
    eveningPeakMultiplier: '2.1',
    offPeakMultiplier: '1.3',
    nightMultiplier: '1.0'
  },
  {
    areaName: 'Velachery',
    lat: '12.9810',
    lng: '80.2209',
    morningPeakMultiplier: '1.6',
    eveningPeakMultiplier: '1.8',
    offPeakMultiplier: '1.1',
    nightMultiplier: '1.0'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data in correct order due to foreign key constraints
    console.log('🧹 Clearing existing data...');
    await db.delete(feedback);
    await db.delete(calculations);
    await db.delete(vehicleTypes);
    await db.delete(routeCongestion);
    await db.delete(contactSubmissions);

    // Seed vehicle types
    console.log('🚗 Seeding vehicle types...');
    for (const vehicle of seedVehicleTypes) {
      await db.insert(vehicleTypes).values(vehicle);
    }
    console.log(`✅ Inserted ${seedVehicleTypes.length} vehicle types`);

    // Seed route congestion data
    console.log('🛣️ Seeding route congestion data...');
    for (const area of seedRouteCongestion) {
      await db.insert(routeCongestion).values(area);
    }
    console.log(`✅ Inserted ${seedRouteCongestion.length} congestion areas`);

    console.log('🎉 Database seeding completed successfully!');

    // Contact submissions table will be created automatically by Drizzle
    console.log("📧 Contact submissions table ready");
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('Database seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database seeding failed:', error);
    process.exit(1);
  });