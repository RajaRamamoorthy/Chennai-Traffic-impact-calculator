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

- January 9, 2025: Successfully resolved all git merge conflicts across 12 files after pulling 37 remote commits
- January 9, 2025: Fixed conflicts in App.tsx by keeping remote version with Router wrapper component structure
- January 9, 2025: Resolved language-context.tsx conflicts by using simpler implementation with toggleLanguage method
- January 9, 2025: Fixed merge conflicts in header.tsx, feedback-button.tsx, and feedback-modal.tsx components
- January 9, 2025: Resolved conflicts in all three informational pages (data-sources, how-it-works, methodology)
- January 9, 2025: Fixed shared/schema.ts and server/routes.ts conflicts preserving contact submission functionality
- January 9, 2025: Application successfully running with all features restored after merge conflict resolution
- July 10, 2025: Resolved extensive git merge conflicts across 11 files that were causing build failures
- July 10, 2025: Fixed conflicts in language-context.tsx by choosing simpler implementation without translation system
- July 10, 2025: Resolved conflicts in header.tsx, feedback-button.tsx, and feedback-modal.tsx components
- July 10, 2025: Cleaned up merge conflicts in informational pages (data-sources, how-it-works, methodology)
- July 10, 2025: Successfully restored application functionality after merge conflict resolution
- July 9, 2025: Fixed contact/feedback form flow with comprehensive error handling and database storage
- July 9, 2025: Resolved Express rate limiting X-Forwarded-For header issue by configuring trust proxy
- July 9, 2025: Fixed nodemailer import/export issues (createTransport vs createTransporter)
- July 9, 2025: Added email service debugging with fallback configurations for Zoho SMTP
- July 9, 2025: Contact form submissions are stored in database even when email delivery fails
- July 9, 2025: Added admin endpoint for accessing contact submissions at /api/admin/contact-submissions
- July 8, 2025: Fixed seed script foreign key constraint issues - now properly clears database in correct order (feedback → calculations → vehicle types → route congestion)
- July 8, 2025: Resolved frontend infinite loop in TransportationStep component by optimizing useEffect dependencies  
- July 8, 2025: Successfully tested complete application flow with all features working
- July 8, 2025: Database reseeded with 17 vehicle types and 8 Chennai traffic areas
- July 8, 2025: Full API testing confirms calculator working with realistic Chennai traffic scenarios

## Changelog

- June 29, 2025: Initial setup
- July 8, 2025: Complete Chennai Traffic Impact Calculator implementation with Google Maps integration and realistic local data