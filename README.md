# Chennai Traffic Impact Calculator

A comprehensive web application that empowers Chennai commuters to make sustainable transportation choices through data-driven insights and interactive analysis.

![Chennai Traffic Impact Calculator](https://img.shields.io/badge/Version-1.6.2-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Node.js](https://img.shields.io/badge/Node.js-20+-brightgreen) ![React](https://img.shields.io/badge/React-18+-blue)

## 🎯 Project Goals

### Primary Objectives
- **Environmental Awareness**: Help Chennai commuters understand their individual traffic impact on the city's environment and air quality
- **Sustainable Transportation**: Promote adoption of eco-friendly transport alternatives through personalized recommendations
- **Data-Driven Decisions**: Provide scientifically-backed calculations based on real vehicle emission factors and Chennai traffic patterns
- **Community Impact**: Create a collective movement toward sustainable commuting in Chennai
- **Context-Sensitive Messaging**: Intelligent results display with hybrid approach that balances impact score visibility with financial-first architecture
- **Optimized User Experience**: Traffic impact score prominently displayed first, followed by financial results, reducing user confusion while maintaining architectural priorities

### Impact Metrics
- Calculate personalized traffic impact scores (0-100 scale)
- Estimate monthly CO₂ emissions, costs, and time spent commuting
- Suggest practical alternatives with quantified benefits
- Track community-wide impact through aggregated analytics
- Real-time traffic monitoring with dual-mode analysis (user routes vs city-wide)
- Granular road segment analysis for precise traffic insights
- Intelligent weather impact overlay with contextual Chennai commute recommendations
- Weather-aware traffic planning with time-of-day context analysis
- Context-sensitive messaging system with financial-first approach and dynamic theming
- Adaptive results display based on transport mode (metro/walking vs cars/taxis) and efficiency levels
- Hybrid layout optimization: Traffic impact score displayed first with medium prominence, followed by financial results as primary display
- Real-time financial insights dashboard with live data aggregation from Chennai commuter submissions
- Comprehensive financial analytics: total monthly costs, potential savings, cost efficiency metrics, transport mode analysis
- Interactive financial metrics with context-aware tooltips explaining calculation methodology for user understanding
- Professional data presentation with proper capitalization and Chennai-specific contextual explanations
- Advanced SEO optimization with featured snippet targeting and enhanced schema markup for Chennai traffic searches
- Performance optimization with resource hints, lazy loading, and Core Web Vitals improvements
- **Enhanced Source Transparency**: Methodology page with clickable links to specific research papers, fuel calculators, and automotive cost analysis
- **Professional Validation**: Direct access to CEEW studies, 1charging.com EV analysis, Team-BHP road trip data, and government fuel pricing tools
- **Research Credibility**: All vehicle cost claims backed by verifiable sources with one-click access to original research publications

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
- **OpenWeatherMap OneCall API 3.0**: Real-time Chennai weather data for intelligent weather impact analysis
- **Razorpay**: Secure donation processing with webhook verification
- **Nodemailer**: Email service for contact form submissions
- **Weather APIs**: IMD API with OpenWeatherMap fallback for Chennai weather data

#### SEO & Performance
- **Schema.org Structured Data**: LocalBusiness, Place, Organization, FAQ, and Breadcrumb schemas
- **Performance Optimization**: DNS prefetch, preconnect, resource hints for critical third-party services
- **Featured Snippet Optimization**: Chennai traffic Q&A content targeting Google featured snippets
- **Internal Linking Strategy**: Contextual cross-page navigation with SEO-optimized anchor text
- **Source Transparency**: Methodology page with clickable links to exact research papers, government data, and cost analysis tools
- **Research Validation**: Direct access to CEEW studies, automotive forums, fuel pricing tools, and EV cost analysis for user verification

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

#### Real-Time Traffic & Analytics
- `GET /api/dashboard/traffic-insights?mode=calculator`: User route-based traffic data
- `GET /api/dashboard/traffic-insights?mode=holistic`: City-wide traffic monitoring

#### SEO & Performance Features
- **Featured Snippet Content**: Chennai traffic peak hours, route alternatives, cost analysis
- **Structured Data**: Schema.org markup for local business, place context, and FAQ pages
- **Performance Optimization**: Resource hints, lazy loading, Core Web Vitals improvements
- **Internal Navigation**: Breadcrumb navigation with structured data across all pages

- `GET /api/dashboard/commute-insights`: Database-derived commute statistics
- `GET /api/dashboard/financial-insights`: **NEW** Real-time financial analytics with live data aggregation
- `GET /api/dashboard/weather`: Chennai weather conditions via OpenWeatherMap OneCall API 3.0
- `GET /api/dashboard/weather-impact`: Intelligent weather impact analysis with contextual recommendations

#### Financial Insights Response Format
```json
{
  "totalMonthlyCost": 15150.75,
  "avgCostByTransportMode": [
    { "mode": "Car", "avgCost": 8500.50, "count": 125 },
    { "mode": "Bike", "avgCost": 3200.25, "count": 89 }
  ],
  "potentialSavings": 4545.23,
  "avgCostByPattern": [
    { "pattern": "Daily Work Commute", "avgCost": 6800.75, "count": 156 }
  ],
  "avgCostByOccupancy": [
    { "occupancy": 1, "avgCost": 7500.00, "count": 98 },
    { "occupancy": 2, "avgCost": 4200.50, "count": 67 }
  ],
  "costEfficiencyMetrics": {
    "avgCostPerKm": 45.25,
    "avgDistanceKm": 18.5
  }
}
```

**Enhanced UI Features:**
- **Interactive Tooltips**: Each financial metric includes hover-based explanations
- **Contextual Help**: Tooltips explain calculation methodology and data sources
- **Professional Formatting**: Proper capitalization for transport modes and consistent number formatting
- **Chennai Context**: Explanations tailored to Chennai commuter patterns and behavior

## 🌦️ Intelligent Weather Impact Analysis

### Weather-Aware Traffic Planning

The application features an advanced weather impact overlay that analyzes real Chennai weather conditions and provides contextually relevant traffic insights:

#### Real-Time Weather Integration
- **Data Source**: OpenWeatherMap OneCall API 3.0 with user's valid subscription
- **Analysis Factors**: Temperature, humidity, wind speed, visibility, precipitation
- **Context Awareness**: Time-of-day, rush hour patterns, weekend vs weekday analysis
- **Chennai-Specific**: Monsoon impacts, heat island effects, drainage considerations
- **Timezone Accuracy**: Proper Chennai IST (UTC+5:30) handling for accurate time-based analysis

#### Intelligent Impact Assessment
- **Severity Levels**: Critical, High, Medium, Low with color-coded visual indicators
- **Impact Scores**: 0-100 scale with user-friendly explanations
- **Practical Guidance**: "Normal conditions" to "Leave significantly earlier"
- **Contextual Recommendations**: AC fuel advice, headlight usage, route alternatives
- **Temperature Coverage**: Comprehensive analysis for 25°C-45°C range including typical 30-34°C Chennai conditions

#### Weather-Traffic Correlation
- **Rush Hour Analysis**: Weather impact multiplied during peak traffic times
- **Heat Stress Factors**: AC usage impact on fuel consumption and potential stops
- **Visibility Analysis**: Dawn/dusk and pollution-based visibility recommendations
- **Monsoon Preparedness**: Drainage issues and flood-prone area alerts
- **Context Priority**: Rush hour > peak heat > weekend for accurate primary factor identification

#### Weather Conditions Analyzed
- **Clear Weather**: Minimal impact with normal driving conditions
- **Overcast Conditions**: Humidity correlation analysis for pre-monsoon patterns
- **Rain & Storms**: Flooding risk assessment and visibility impact
- **Extreme Heat**: Heat island effects and AC load considerations
- **Fog & Mist**: Visibility-based safety recommendations

### Weather Impact API Endpoints
- `GET /api/dashboard/weather`: Real-time Chennai weather via OpenWeatherMap OneCall API 3.0
- `GET /api/dashboard/weather-impact`: Intelligent weather impact analysis with contextual recommendations

### Quality Assurance & Testing
- **Comprehensive Testing**: 10 test categories covering timezone logic, temperature ranges, weather conditions, API validation, and cache performance
- **Production Ready**: Expert testing verified all weather scenarios work correctly with proper Chennai timezone handling
- **Performance Optimized**: Intelligent caching (30-minute TTL) reduces API calls while maintaining real-time accuracy

## 🎨 Context-Sensitive Messaging System

### Financial-First Approach
The application prioritizes financial impact over environmental impact in messaging, recognizing that cost savings are often more immediately motivating for users than environmental benefits.

### Dynamic Theming & Messaging
The results display adapts based on transport mode and efficiency level:

#### Transport Mode Detection
- **Efficient Transport** (Metro, Bus, Walking, Cycling): Green theming with congratulatory messaging
- **Moderate Efficiency** (Mixed transport patterns): Orange theming with optimization suggestions
- **Wasteful Transport** (Single-occupancy cars, luxury vehicles): Red theming with cost-focused messaging

#### Adaptive Headlines
- **Zero-cost transport**: "Zero transport costs! You're saving ₹X/month vs driving"
- **Efficient transport**: "You're saving ₹X/month with smart transport choices!"
- **Wasteful transport**: "Your commute costs ₹X/month extra"

#### Context-Aware Elements
- **Time Display**: "Monthly Commute Time" vs "Time Wasted in Traffic"
- **Alternative Recommendations**: "How to optimize your current smart choices" vs "Why You're Losing Money"
- **Environmental Impact**: All visual elements (colors, borders, backgrounds) match transport efficiency context
- **Cost Formatting**: Indian decimal format with commas (₹10,000 instead of ₹10000)

### User Experience Benefits
- Prevents inappropriate messaging (e.g., "you're wasting money" for Metro users)
- Maintains motivation for efficient transport users with positive reinforcement
- Provides cost-focused motivation for wasteful transport users
- Ensures consistent visual experience across all result components

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

### Analytics Integration

#### Google Analytics 4
- **Tracking ID**: G-8S4RJMVGST
- **Events**: Calculator flow, navigation, feedback, donations, conversions
- **Metrics**: Page views, user engagement, conversion tracking
- **Implementation**: Direct script injection in index.html

#### Microsoft Clarity
- **Project ID**: see16sr95r (configured via `VITE_CLARITY_PROJECT_ID`)
- **Features**: Session recordings, heatmaps, user behavior analysis
- **Coverage**: All pages tracked automatically including SPA route changes
- **Implementation**: Script loaded in index.html for early initialization
- **Data**: Complements GA4 with visual behavior insights

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