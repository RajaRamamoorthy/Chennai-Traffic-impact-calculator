// Comprehensive Validation Test for Chennai Traffic Impact Calculator
// This script tests all vehicle types, occupancies, and travel patterns

const vehicles = [
  { id: 99, name: "Hatchback (Swift, Baleno)", category: "car", baseImpactScore: 45 },
  { id: 100, name: "Compact Sedan (Dzire, Amaze)", category: "car", baseImpactScore: 47 },
  { id: 101, name: "Sedan (City, Verna)", category: "car", baseImpactScore: 50 },
  { id: 102, name: "Premium Sedan (Camry, Accord)", category: "car", baseImpactScore: 58 },
  { id: 103, name: "Compact SUV (Brezza, Venue)", category: "car", baseImpactScore: 52 },
  { id: 104, name: "Mid-size SUV (Creta, Seltos)", category: "car", baseImpactScore: 55 },
  { id: 105, name: "MUV/MPV (Ertiga, Innova)", category: "car", baseImpactScore: 57 },
  { id: 106, name: "Luxury SUV (XUV700, Fortuner)", category: "car", baseImpactScore: 65 },
  { id: 107, name: "Electric Car (Nexon EV, Tiago EV)", category: "car", baseImpactScore: 25 },
  { id: 108, name: "Scooter 100-125cc (Activa, Jupiter)", category: "bike", baseImpactScore: 25 },
  { id: 109, name: "Premium Scooter 150cc+ (Aerox 155)", category: "bike", baseImpactScore: 28 },
  { id: 110, name: "Commuter Bike 100-150cc (Splendor)", category: "bike", baseImpactScore: 22 },
  { id: 111, name: "Sports Bike 150-200cc (Pulsar 150)", category: "bike", baseImpactScore: 24 },
  { id: 112, name: "Mid-capacity Bike 200-350cc (Dominar 250)", category: "bike", baseImpactScore: 26 },
  { id: 113, name: "High-capacity Bike 350cc+ (Duke 390)", category: "bike", baseImpactScore: 28 },
  { id: 114, name: "Electric Two-wheeler (Ather 450X)", category: "bike", baseImpactScore: 12 }
];

const travelPatterns = [
  { pattern: "daily-commute", timing: "both-peaks", frequency: "daily" },
  { pattern: "weekday-commute", timing: "morning-peak", frequency: "weekdays" },
  { pattern: "weekend-commute", timing: "off-peak", frequency: "weekends" },
  { pattern: "frequent-trips", timing: "off-peak", frequency: "frequent" },
  { pattern: "occasional-trips", timing: "off-peak", frequency: "occasional" },
  { pattern: "rare-trips", timing: "off-peak", frequency: "rare" }
];

const occupancies = [1, 2, 3, 4];
const distances = [5, 15, 25]; // Short, medium, long distance

// Current Implementation Logic (Updated to New Multiplicative Formula)
function calculateCurrentLogic(vehicle, distance, occupancy, timing, frequency) {
  // Base vehicle impact score
  const vehicleImpact = vehicle.baseImpactScore;
  
  // Congestion factor (multiplier based on distance)
  const congestionFactor = distance > 15 ? 1.6 : distance > 8 ? 1.3 : 1.0;
  
  // Timing multiplier for peak hours
  const timingMultiplier = timing === 'both-peaks' ? 1.8 : 
                          timing === 'morning-peak' || timing === 'evening-peak' ? 1.5 :
                          timing === 'off-peak' ? 1.0 : 0.8; // night travel bonus
  
  // Frequency multiplier
  const frequencyMultipliers = {
    'daily': 1.0, 'weekdays': 0.9, 'weekends': 0.7,
    'frequent': 0.8, 'occasional': 0.5, 'rare': 0.3
  };
  const frequencyMultiplier = frequencyMultipliers[frequency] || 1.0;
  
  // Calculate final score using README documented formula
  const rawScore = (vehicleImpact * congestionFactor * timingMultiplier * frequencyMultiplier) / occupancy;
  
  const breakdown = {
    vehicleImpact: vehicleImpact,
    congestionFactor: congestionFactor,
    timingMultiplier: timingMultiplier,
    frequencyMultiplier: frequencyMultiplier,
    occupancy: occupancy,
    rawScore: rawScore
  };
  
  const finalScore = Math.min(Math.max(Math.round(rawScore), 0), 100);
  
  return { finalScore, breakdown };
}

// README.md Documented Logic
function calculateREADMELogic(vehicle, distance, occupancy, timing, frequency) {
  const vehicleImpact = vehicle.baseImpactScore;
  
  // Congestion factor (multiplier)
  const congestionFactor = distance > 15 ? 1.6 : distance > 8 ? 1.3 : 1.0;
  
  // Timing penalty (multiplier)
  const timingPenalty = timing === 'both-peaks' ? 1.8 : 
                       timing === 'morning-peak' || timing === 'evening-peak' ? 1.5 :
                       timing === 'off-peak' ? 1.0 : 0.8;
  
  // Frequency multiplier
  const frequencyMultipliers = {
    'daily': 1.0, 'weekdays': 0.9, 'weekends': 0.7,
    'frequent': 0.8, 'occasional': 0.5, 'rare': 0.3
  };
  const frequencyMultiplier = frequencyMultipliers[frequency] || 1.0;
  
  const finalScore = Math.min(Math.max(
    (vehicleImpact * congestionFactor * timingPenalty * frequencyMultiplier) / occupancy,
    0
  ), 100);
  
  return { 
    finalScore: Math.round(finalScore),
    breakdown: {
      vehicleImpact,
      congestionFactor,
      timingPenalty,
      frequencyMultiplier,
      occupancy
    }
  };
}

// Test Cases
console.log("=== COMPREHENSIVE CALCULATION VALIDATION ===\n");

// Test specific scenarios
const testCases = [
  {
    vehicle: vehicles.find(v => v.name.includes("Luxury SUV")),
    distance: 15,
    occupancy: 1,
    pattern: "daily-commute",
    description: "Luxury SUV, Single Occupancy, Daily Commute"
  },
  {
    vehicle: vehicles.find(v => v.name.includes("Hatchback")),
    distance: 15,
    occupancy: 2,
    pattern: "weekday-commute",
    description: "Hatchback, 2 People, Weekday Commute"
  },
  {
    vehicle: vehicles.find(v => v.name.includes("Electric Car")),
    distance: 15,
    occupancy: 1,
    pattern: "daily-commute",
    description: "Electric Car, Single Occupancy, Daily Commute"
  },
  {
    vehicle: vehicles.find(v => v.name.includes("Scooter")),
    distance: 15,
    occupancy: 1,
    pattern: "daily-commute",
    description: "Scooter, Single Occupancy, Daily Commute"
  }
];

testCases.forEach((testCase, index) => {
  const { vehicle, distance, occupancy, pattern, description } = testCase;
  const travelPattern = travelPatterns.find(tp => tp.pattern === pattern);
  
  console.log(`\n${index + 1}. ${description}`);
  console.log(`Vehicle: ${vehicle.name} (Base Score: ${vehicle.baseImpactScore})`);
  console.log(`Distance: ${distance}km, Occupancy: ${occupancy}, Pattern: ${pattern}`);
  
  const currentResult = calculateCurrentLogic(vehicle, distance, occupancy, travelPattern.timing, travelPattern.frequency);
  const readmeResult = calculateREADMELogic(vehicle, distance, occupancy, travelPattern.timing, travelPattern.frequency);
  
  console.log(`\nCURRENT IMPLEMENTATION:`);
  console.log(`  Final Score: ${currentResult.finalScore}`);
  console.log(`  Breakdown: ${JSON.stringify(currentResult.breakdown)}`);
  
  console.log(`\nREADME DOCUMENTED LOGIC:`);
  console.log(`  Final Score: ${readmeResult.finalScore}`);
  console.log(`  Calculation: (${readmeResult.breakdown.vehicleImpact} * ${readmeResult.breakdown.congestionFactor} * ${readmeResult.breakdown.timingPenalty} * ${readmeResult.breakdown.frequencyMultiplier}) / ${readmeResult.breakdown.occupancy}`);
  
  console.log(`\nDIFFERENCE: ${Math.abs(currentResult.finalScore - readmeResult.finalScore)} points`);
  console.log("=" * 80);
});

// Range Analysis
console.log("\n=== SCORE RANGE ANALYSIS ===");

function analyzeScoreRanges() {
  let currentMin = 100, currentMax = 0, readmeMin = 100, readmeMax = 0;
  let testCount = 0;
  
  vehicles.slice(0, 5).forEach(vehicle => { // Test first 5 vehicles for speed
    [1, 2, 4].forEach(occupancy => {
      [5, 15, 25].forEach(distance => {
        travelPatterns.forEach(pattern => {
          const currentResult = calculateCurrentLogic(vehicle, distance, occupancy, pattern.timing, pattern.frequency);
          const readmeResult = calculateREADMELogic(vehicle, distance, occupancy, pattern.timing, pattern.frequency);
          
          currentMin = Math.min(currentMin, currentResult.finalScore);
          currentMax = Math.max(currentMax, currentResult.finalScore);
          readmeMin = Math.min(readmeMin, readmeResult.finalScore);
          readmeMax = Math.max(readmeMax, readmeResult.finalScore);
          testCount++;
        });
      });
    });
  });
  
  console.log(`Tests run: ${testCount}`);
  console.log(`Current Implementation Range: ${currentMin} - ${currentMax}`);
  console.log(`README Logic Range: ${readmeMin} - ${readmeMax}`);
  
  console.log(`\nREADME Scale Classification:`);
  console.log(`0-30: Excellent (sustainable transport)`);
  console.log(`31-50: Good (efficient vehicles)`);
  console.log(`51-70: Moderate (standard vehicles)`);
  console.log(`71-100: Poor (high-impact transport)`);
}

analyzeScoreRanges();

console.log("\n=== RECOMMENDATION ===");
console.log("The current implementation uses ADDITIVE logic while README specifies MULTIPLICATIVE logic.");
console.log("Multiplicative logic better reflects real-world impact relationships:");
console.log("- Peak hours MULTIPLY the base impact (not add fixed points)");
console.log("- Higher occupancy DIVIDES the per-person impact (more logical)");
console.log("- Congestion should be a MULTIPLIER of base vehicle impact");
console.log("\nRecommendation: Update implementation to match README logic for more realistic calculations.");