# replit.md

## Overview

This is a Chennai Traffic Impact Calculator web application that helps Chennai commuters understand their traffic impact and discover better alternatives. The application uses a modern full-stack architecture with React frontend, Express.js backend, PostgreSQL database with Drizzle ORM, and integrates with Google Maps API for location services.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Routing**: Wouter for client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless connection
- **API Design**: RESTful endpoints with proper error handling

### Database Schema
The application uses PostgreSQL with the following main tables:
- `users` - Basic user tracking with session IDs
- `vehicleTypes` - Transportation modes with emission factors and costs
- `calculations` - Route calculations and impact results
- `feedback` - User feedback and analytics
- `routeCongestion` - Traffic congestion data by area

## Key Components

### Calculator Flow
- **Multi-step form**: Transportation selection → Route details → Results
- **Step persistence**: Form data saved to localStorage with auto-restore
- **Real-time validation**: Zod schemas for type-safe form validation

### External Integrations
- **Google Maps API**: Geocoding, place autocomplete, and route information
- **Location Services**: Address validation and distance calculations

### Impact Calculation Engine
- Considers vehicle type, occupancy, timing, frequency, and route congestion
- Provides detailed breakdown of traffic impact score (0-100)
- Generates alternative transportation suggestions

## Data Flow

1. **User Input**: Multi-step form collects transportation mode, vehicle details, origin/destination, timing, and frequency
2. **Geocoding**: Addresses converted to coordinates using Google Maps API
3. **Route Calculation**: Distance and route information retrieved
4. **Impact Analysis**: Backend calculates traffic impact score and alternatives
5. **Results Display**: Comprehensive results with breakdown, alternatives, and recommendations
6. **Feedback Collection**: Optional user feedback for continuous improvement

## External Dependencies

- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **@googlemaps/js-api-loader**: Google Maps integration
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **drizzle-orm**: Type-safe database queries
- **wouter**: Lightweight React router
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- Express server with TypeScript compilation via tsx
- Database migrations managed through Drizzle Kit

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: esbuild bundles Node.js application
- Database: Neon serverless PostgreSQL with connection pooling

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_MAPS_API_KEY`: For geocoding and maps functionality

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- July 8, 2025: Fixed seed script foreign key constraint issues - now properly clears database in correct order (feedback → calculations → vehicle types → route congestion)
- July 8, 2025: Resolved frontend infinite loop in TransportationStep component by optimizing useEffect dependencies  
- July 8, 2025: Successfully tested complete application flow with all features working
- July 8, 2025: Database reseeded with 17 vehicle types and 8 Chennai traffic areas
- July 8, 2025: Full API testing confirms calculator working with realistic Chennai traffic scenarios

## Changelog

- June 29, 2025: Initial setup
- July 8, 2025: Complete Chennai Traffic Impact Calculator implementation with Google Maps integration and realistic local data