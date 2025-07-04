import { db } from './db';
import { vehicleTypes, routeCongestion } from '@shared/schema';

const seedVehicleTypes = [
  // Cars
  {
    name: 'Maruti Swift (Petrol)',
    category: 'car',
    emissionFactor: '0.142', // kg CO2/km
    fuelCostPerKm: '6.50',   // ₹/km
    avgSpeedKmh: 25,
    baseImpactScore: 45
  },
  {
    name: 'Hyundai i20 (Petrol)',
    category: 'car',
    emissionFactor: '0.148',
    fuelCostPerKm: '7.20',
    avgSpeedKmh: 25,
    baseImpactScore: 47
  },
  {
    name: 'Honda City (Petrol)',
    category: 'car',
    emissionFactor: '0.155',
    fuelCostPerKm: '8.50',
    avgSpeedKmh: 28,
    baseImpactScore: 50
  },
  {
    name: 'Toyota Innova (Diesel)',
    category: 'car',
    emissionFactor: '0.168',
    fuelCostPerKm: '9.20',
    avgSpeedKmh: 30,
    baseImpactScore: 55
  },
  {
    name: 'Tata Nexon EV',
    category: 'car',
    emissionFactor: '0.045', // Lower due to electric
    fuelCostPerKm: '2.80',   // Lower operating cost
    avgSpeedKmh: 25,
    baseImpactScore: 25
  },
  
  // Two-wheelers
  {
    name: 'Honda Activa (Petrol)',
    category: 'bike',
    emissionFactor: '0.062',
    fuelCostPerKm: '2.10',
    avgSpeedKmh: 30,
    baseImpactScore: 25
  },
  {
    name: 'Bajaj Pulsar 150 (Petrol)',
    category: 'bike',
    emissionFactor: '0.055',
    fuelCostPerKm: '2.30',
    avgSpeedKmh: 35,
    baseImpactScore: 22
  },
  {
    name: 'Ather 450X (Electric)',
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
    
    // Clear existing data
    console.log('🧹 Clearing existing vehicle types...');
    await db.delete(vehicleTypes);
    
    console.log('🧹 Clearing existing route congestion data...');
    await db.delete(routeCongestion);

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
    
    // Display summary
    console.log('\n📊 Seeded Data Summary:');
    console.log(`   Cars: ${seedVehicleTypes.filter(v => v.category === 'car').length}`);
    console.log(`   Bikes: ${seedVehicleTypes.filter(v => v.category === 'bike').length}`);
    console.log(`   Public Transport: ${seedVehicleTypes.filter(v => ['metro', 'bus', 'auto'].includes(v.category)).length}`);
    console.log(`   Active Transport: ${seedVehicleTypes.filter(v => v.category === 'walking').length}`);
    console.log(`   Traffic Areas: ${seedRouteCongestion.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

export { seedDatabase };

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Database seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database seeding failed:', error);
      process.exit(1);
    });
}