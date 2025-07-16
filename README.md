# Chennai Traffic Impact Calculator

A comprehensive web application that empowers Chennai commuters to make sustainable transportation choices through data-driven insights and interactive analysis.

![Chennai Traffic Impact Calculator](https://img.shields.io/badge/Version-1.3.0-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Node.js](https://img.shields.io/badge/Node.js-20+-brightgreen) ![React](https://img.shields.io/badge/React-18+-blue)

## 🎯 Project Goals

### Primary Objectives
- **Environmental Awareness**: Help Chennai commuters understand their individual traffic impact on the city's environment and air quality
- **Sustainable Transportation**: Promote adoption of eco-friendly transport alternatives through personalized recommendations
- **Data-Driven Decisions**: Provide scientifically-backed calculations based on real vehicle emission factors and Chennai traffic patterns
- **Community Impact**: Create a collective movement toward sustainable commuting in Chennai

### Impact Metrics
- Calculate personalized traffic impact scores (0-100 scale)
- Estimate monthly CO₂ emissions, costs, and time spent commuting
- Suggest practical alternatives with quantified benefits
- Track community-wide impact through aggregated analytics
- Real-time traffic monitoring with dual-mode analysis (user routes vs city-wide)
- Granular road segment analysis for precise traffic insights

## 🏗️ System Architecture

### Technology Stack

#### Frontend
- **React 18** with TypeScript for type-safe UI development
- **Vite** as build tool with Hot Module Replacement (HMR)
- **Shadcn/ui + Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling with dark mode support
- **React Query (TanStack Query)** for server state management
- **React Hook Form + Zod** for form validation and handling
- **Wouter** for lightweight client-side routing

#### Backend
- **Express.js** with TypeScript for RESTful API
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** via Neon Database for serverless deployment
- **Google Maps API** for geocoding and route calculations
- **Helmet.js** for security headers and protection

#### External Integrations
- **Google Maps Services**: Geocoding, place autocomplete, directions API, Distance Matrix API for traffic analysis
- **Razorpay**: Secure donation processing with webhook verification
- **Nodemailer**: Email service for contact form submissions
- **Weather APIs**: IMD API with OpenWeatherMap fallback for Chennai weather data

### Database Schema

```sql
-- Core tables for impact calculation
users (id, session_id, created_at)
vehicle_types (id, name, category, emission_factor, fuel_cost_per_km, avg_speed_kmh, base_impact_score)
calculations (id, user_id, session_id, transport_mode, vehicle_type_id, occupancy, origin, destination, 
              distance_km, travel_pattern, impact_score, breakdown, monthly_emissions, monthly_cost, 
              monthly_time_hours, alternatives, created_at)
route_congestion (id, area_name, lat, lng, morning_peak_multiplier, evening_peak_multiplier, 
                  off_peak_multiplier, night_multiplier)

-- Analytics and feedback
feedback (id, calculation_id, rating, helpful, comments, created_at)
contact_submissions (id, name, email, message, ip_address, status, created_at)
donations (id, payment_id, order_id, amount, currency, status, donor_email, created_at)
```

## 🚦 Real-Time Traffic Monitoring System

### Dual-Mode Traffic Analysis

The application features an advanced dual-mode traffic monitoring system that provides both user-specific and city-wide traffic insights:

#### Calculator Mode (Default)
- **Data Source**: Actual user commute routes from database
- **Precision**: Street-level analysis of most-traveled user routes
- **Focus**: Specific road segments with delays >10% compared to normal conditions
- **Chokepoints**: Intersection-level analysis from user routes with 30%+ delays
- **Benefits**: Actionable insights for actual commute patterns

#### City-Wide (Holistic) Mode
- **Data Source**: 20 granular Chennai road segments monitored via Google Maps
- **Coverage**: Comprehensive city-wide traffic analysis
- **Segments**: Anna Salai (Gemini-Nandanam), GST Road (Chrompet-Pallavaram), OMR (Tidel Park-Sholinganallur)
- **Junctions**: Kathipara Junction, Koyambedu Junction, Madhya Kailash Junction
- **Benefits**: Broader traffic context and alternative route insights

### Road Segments Monitored

#### Major Arterial Roads
- **Anna Salai**: Gemini to Nandanam, Nandanam to Saidapet
- **GST Road**: Chrompet to Pallavaram, Pallavaram to Tambaram
- **OMR (Rajiv Gandhi Salai)**: Tidel Park to Sholinganallur, Sholinganallur to Siruseri
- **ECR (East Coast Road)**: Thiruvanmiyur to Neelankarai, Neelankarai to Injambakkam

#### Inner City Roads
- **Poonamallee High Road**: Kilpauk to Aminjikarai, Aminjikarai to Chetpet
- **Velachery Main Road**: Velachery to Guindy
- **Sardar Patel Road**: Adyar to Guindy
- **Lattice Bridge Road**: Adyar to Thiruvanmiyur

#### Key Junctions & Connecting Roads
- **Kathipara Junction**: GST Road-Inner Ring Road intersection
- **Koyambedu Junction**: Major bus terminal and transport hub
- **Madhya Kailash Junction**: OMR connectivity point
- **Inner Ring Road**: Adyar to Saidapet connector
- **100 Feet Road**: Vadapalani to Ashok Nagar
- **Arcot Road**: Kodambakkam to Vadapalani

### API Endpoints

#### Impact Calculator
- `POST /api/calculate-impact`: Calculate traffic impact for a journey
- `GET /api/vehicle-types`: Get available vehicle types
- `POST /api/feedback`: Submit feedback for calculations

#### Real-Time Traffic
- `GET /api/dashboard/traffic-insights?mode=calculator`: User route-based traffic data
- `GET /api/dashboard/traffic-insights?mode=holistic`: City-wide traffic monitoring
- `GET /api/dashboard/commute-insights`: Database-derived commute statistics
- `GET /api/dashboard/weather`: Chennai weather conditions

## 🧮 Calculation Logic & Methodology

### Impact Score Algorithm

The traffic impact score (0-100) is calculated using a sophisticated multi-factor algorithm:

#### 1. Vehicle Impact Factor
- **Emission Factor**: CO₂ emissions per kilometer based on vehicle type
- **Fuel Consumption**: Direct correlation with environmental impact
- **Vehicle Category**: Different impact multipliers for cars, bikes, public transport

```typescript
// Example emission factors (kg CO₂/km)
const emissionFactors = {
  'Hatchback (Swift, Baleno)': 0.142,
  'Electric Car (Nexon EV)': 0.045,
  'Scooter 100-125cc (Activa)': 0.062,
  'Metro/Bus': 0.020 // Per person with occupancy factored
};
```

#### 2. Route Congestion Analysis
- **Chennai-specific areas**: 8 major traffic zones with real congestion data
- **Time-based multipliers**: Different impact during peak vs off-peak hours
- **Dynamic calculation**: Based on actual origin-destination coordinates

```typescript
const congestionMultipliers = {
  morningPeak: 1.5,   // 7-10 AM
  eveningPeak: 1.6,   // 5-8 PM
  offPeak: 1.0,       // Regular hours
  night: 0.8          // 10 PM - 6 AM
};
```

#### 3. Travel Pattern System
- **Pattern-Based Selection**: Intuitive travel patterns instead of separate timing/frequency
- **Available Patterns**:
  - Daily Work Commute: Both peak hours, daily frequency (×1.35 timing, ×1.0 frequency)
  - Weekday Commute: Morning peak, weekday frequency (×1.35 timing, ×0.75 frequency)
  - Weekend Commute: Off-peak hours, weekend frequency (×1.1 timing, ×0.4 frequency)
  - Frequent Trips: Off-peak, 3-4 times/week (×1.1 timing, ×0.5 frequency)
  - Occasional Trips: Off-peak, 1-2 times/week (×1.1 timing, ×0.25 frequency)
  - Rare Trips: Off-peak, few times/month (×1.1 timing, ×0.25 frequency)
- **Occupancy Bonus**: Carpooling divides total impact by number of people

#### 4. Final Score Calculation
```typescript
// Multiplicative formula for accurate impact assessment
finalScore = (vehicleImpact × congestionFactor × timingMultiplier × frequencyMultiplier) ÷ occupancy

// Where:
// - vehicleImpact: Base score from vehicle type (0-100)
// - congestionFactor: 1 + (distanceKm × 0.02)
// - timingMultiplier: 1.35 for peak hours, 1.1 for off-peak
// - frequencyMultiplier: 1.0 to 0.25 based on travel pattern
// - occupancy: Number of people sharing the vehicle

// Score interpretation:
// 0-30: Excellent (sustainable transport like metro, walking)
// 31-50: Good (efficient vehicles, carpooling)
// 51-70: Moderate (standard single-occupancy vehicles)
// 71-100: Poor (luxury/high-emission vehicles in peak hours)
```

### Alternative Suggestions Engine

The system generates personalized alternatives based on:
- **Current journey characteristics** (distance, timing, frequency)
- **Available transport modes** in Chennai (Metro, Bus, Auto, Bike sharing)
- **Cost-benefit analysis** with quantified savings
- **Time impact assessment** for practical decision-making

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Google Maps API key
- Razorpay account (for donations)

### Environment Variables
Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Razorpay (for donations)
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=rzp_secret_xxx

# Admin Access
ADMIN_API_KEY=secure-random-string

# Email Service (Optional)
SMTP_USER=your-email@domain.com
SMTP_PASS=your-app-password
```

### Installation & Setup

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd chennai-traffic-calculator
npm install
```

2. **Database setup**
```bash
# Push schema to database
npm run db:push

# Seed with initial data (vehicle types, Chennai areas)
npm run dev
# Visit /api/seed in browser or run seed script
```

3. **Start development server**
```bash
npm run dev
# Access at http://localhost:5000
```

### Data Quality Verification

```bash
# Check production data filtering
curl "http://localhost:5000/api/stats/homepage"
# Should show production calculations only (423+ calculations)

# Verify dashboard insights  
curl "http://localhost:5000/api/dashboard/commute-insights"
# Should display authentic Chennai commuter patterns
```

### Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📊 Features

### Core Functionality
- **Multi-step Calculator**: Progressive form with step validation and persistence
- **Real-time Geocoding**: Address autocomplete with Chennai-specific suggestions
- **Impact Analysis**: Comprehensive breakdown of environmental and economic impact
- **Alternative Recommendations**: Personalized suggestions with quantified benefits
- **Results Visualization**: Charts and metrics for easy understanding

### User Experience
- **Progressive Web App (PWA)**: Installable on mobile and desktop
- **Dark/Light Mode**: System preference with manual toggle
- **Responsive Design**: Optimized for all device sizes
- **Accessibility**: WCAG compliant with keyboard navigation
- **Multi-language Support**: English and Tamil (expandable)

### Technical Features
- **SEO Optimized**: Dynamic sitemap, meta tags, and structured data
- **Security Hardened**: Rate limiting, CORS, security headers
- **Performance Optimized**: Caching, lazy loading, and API optimization
- **Real-time Analytics**: Usage tracking and performance monitoring

## 🔒 Security & Performance

### API Security Implementation
- **Rate Limiting**: Prevents abuse with configurable limits per endpoint
- **Intelligent Caching**: Reduces Google Maps API costs by 70-80%
- **Request Validation**: Zod schemas for all input validation
- **Security Headers**: Helmet.js configuration for production security

### Production Data Quality
- **Production Cutoff Filtering**: All analytics exclude test data before July 11, 2025
- **Clean Metrics**: 423 production calculations vs 33 test calculations filtered out
- **Authentic Insights**: Homepage stats, dashboard, and admin analytics show real Chennai commuter behavior
- **Data Preservation**: Test data preserved for debugging but excluded from user-facing metrics

### Cost Optimization
- **Google Maps API**: Cached responses reduce API calls significantly
- **Database Queries**: Optimized with proper indexing and relations
- **Asset Optimization**: Vite bundling with tree-shaking and minification

## 🛣️ API Documentation

### Calculator Endpoints

#### POST `/api/calculate-impact`
Calculate traffic impact for a journey.

**Request Body:**
```json
{
  "transportMode": "car",
  "vehicleTypeId": 1,
  "occupancy": 1,
  "origin": "T. Nagar, Chennai",
  "destination": "Anna Nagar, Chennai",
  "travelPattern": "daily-commute"
}
```

**Response:**
```json
{
  "score": 52,
  "confidence": {
    "level": "A",
    "description": "High confidence based on detailed vehicle data"
  },
  "breakdown": {
    "vehicleImpact": 45,
    "congestionFactor": 1.304,
    "timingMultiplier": 1.35,
    "frequencyMultiplier": 1.0,
    "occupancy": 1,
    "rawScore": 79.22
  },
  "equivalentCommuters": 2600,
  "monthlySavings": 800,
  "monthlyEmissions": 89.6,
  "monthlyCost": 4800,
  "monthlyTimeHours": 44,
  "alternatives": [...],
  "methodology": "Based on vehicle emissions...",
  "calculationId": 123
}
```

### Maps Integration Endpoints

#### GET `/api/places/autocomplete?input={query}`
Get location suggestions for Chennai area.

#### POST `/api/geocode`
Convert address to coordinates and validate location.

#### POST `/api/route-info`
Get route information between two points.

### Admin Endpoints

#### GET `/api/admin/api-usage`
View Google Maps API usage and cost estimates (requires admin key).

#### GET `/api/admin/contact-submissions`
Access contact form submissions (requires admin key).

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow TypeScript strict mode and ESLint configurations
2. **Component Structure**: Use functional components with hooks
3. **Database Changes**: Always update schema in `shared/schema.ts` first
4. **Testing**: Add API calls testing with realistic data
5. **Documentation**: Update README for architectural changes

### Adding New Vehicle Types

1. Update vehicle data in `server/seed.ts`:
```typescript
{
  name: 'New Vehicle (Model Examples)',
  category: 'car|bike|public',
  emissionFactor: '0.XXX', // kg CO₂/km
  fuelCostPerKm: 'X.XX',   // ₹/km
  avgSpeedKmh: XX,
  baseImpactScore: XX      // 0-100
}
```

2. Run database push: `npm run db:push`
3. Reseed database via `/api/seed` endpoint

### Adding New Chennai Areas

Update congestion data in `server/seed.ts` with area coordinates and multipliers for accurate route-based calculations.

## 📈 Analytics & Monitoring

### Available Metrics
- **Impact Calculations**: Total calculations, average scores, transport mode distribution
- **User Engagement**: Session duration, conversion rates, feedback ratings
- **API Usage**: Google Maps API calls, costs, cache hit rates
- **Performance**: Response times, error rates, database query performance

### Admin Dashboard Access
Use the admin API key to access analytics endpoints and monitor system health.

## 🎨 Customization

### Themes & Styling
- **Colors**: Modify CSS variables in `client/src/index.css`
- **Components**: Extend Shadcn/ui components in `client/src/components/ui/`
- **Layout**: Responsive breakpoints configurable in `tailwind.config.ts`

### Calculation Parameters
- **Emission Factors**: Update in vehicle type database entries
- **Congestion Areas**: Modify Chennai-specific areas in route congestion table
- **Score Algorithms**: Customize calculation logic in `server/services/impact-calculator.ts`

## Recent Changes

- July 10, 2025: **POTENTIAL SAVINGS ANALYTICS** - Added comprehensive potential savings calculations and API endpoints
  - New `/api/stats/potential-savings` endpoint calculates what users could save if they adopted suggested alternatives
  - Homepage now displays both current impact metrics and potential savings projections
  - Enhanced messaging to clarify that stats represent potential benefits, not accomplished savings
  - Added impact reduction percentage showing overall community potential (60% average reduction)
  - Stats section redesigned with better context and disclaimer about projected benefits
- July 10, 2025: **GA4 AND SEO ENHANCEMENT AUDIT COMPLETED** - Completed comprehensive SEO and GA4 analytics audit and enhancement

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chennai Metro Rail Limited** for public transportation data
- **Google Maps Platform** for geocoding and routing services
- **Environmental Protection Authority** for emission factor standards
- **Chennai Traffic Police** for congestion pattern insights
- **Open Source Community** for the amazing tools and libraries

## 📞 Support

For technical support or feature requests:
- **Email**: contact@chennaitrafficcalc.in
- **Issues**: Create a GitHub issue with detailed description
- **Documentation**: Refer to inline code comments and API documentation

---

**Built with ❤️ for Chennai commuters seeking sustainable transportation solutions.**