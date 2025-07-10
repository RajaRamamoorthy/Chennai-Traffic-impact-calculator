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

## SEO Architecture

### Technical SEO Implementation
- **Dynamic Sitemap**: Server-side endpoint at `/sitemap.xml` generates up-to-date sitemap with proper priorities and change frequencies
- **Meta Tag Management**: React Helmet Async provides dynamic meta tags for each page
- **OpenGraph Integration**: Custom SVG image (1200x630) and complete OpenGraph tags for social media sharing
- **Twitter Cards**: Summary large image cards configured for Twitter/X platform
- **Canonical URLs**: Proper canonical tags to avoid duplicate content issues

### Progressive Web App (PWA)
- **Web Manifest**: Complete manifest.json with app metadata and icons
- **App Icons**: SVG icons in 192x192 and 512x512 sizes for various device requirements
- **Theme Colors**: Consistent branding with #10b981 (green) theme color
- **Installable**: Users can install the app on mobile and desktop devices

### Structured Data
- **WebApplication Schema**: Describes the calculator as a free utility application
- **FAQPage Schema**: Common questions and answers for better search visibility
- **JSON-LD Format**: Search engine friendly structured data implementation

### SEO Files
- `/robots.txt`: Allows all crawlers with sitemap reference
- `/sitemap.xml`: Dynamic XML sitemap generated on each request
- `/manifest.json`: PWA manifest for app installation
- `/og-image.svg`: OpenGraph image for social sharing

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- July 10, 2025: **CRITICAL SECURITY UPDATE** - Implemented comprehensive Razorpay payment security architecture
  - Removed hardcoded payment button IDs from frontend code
  - Added secure backend payment verification with webhook signature validation
  - Implemented donation database storage with audit trail logging
  - Added input validation and fraud prevention measures (amount limits, ID format validation)
  - Created secure admin endpoint for donation statistics with API key protection
  - Enhanced payment flow with duplicate transaction prevention
  - Added comprehensive error handling and user feedback mechanisms
- July 10, 2025: Enhanced SEO architecture with comprehensive structured data implementation
- July 10, 2025: Updated sitemap.xml to include /support and /thank-you pages with proper priorities
- July 10, 2025: Added WebApplication structured data to main SEO component for better search visibility
- July 10, 2025: Implemented FAQPage schema on support page with donation-related questions and answers
- July 10, 2025: Added breadcrumb structured data to all informational pages (methodology, how-it-works, data-sources)
- July 10, 2025: Enhanced structured data with TechArticle schema for methodology, HowTo schema for how-it-works, Dataset schema for data-sources
- July 10, 2025: Improved donation button to accept custom amount input instead of predefined values
- July 10, 2025: Added Razorpay donation system with support pages and FAQ integration
- July 10, 2025: Created /support page with comprehensive donation FAQ covering payment security, fund usage, and contribution impact
- July 10, 2025: Created /thank-you page for post-donation experience with user impact messaging
- July 10, 2025: Integrated Razorpay payment button in footer with explanatory text and FAQ link
- July 10, 2025: Enhanced vehicle type categories with market-relevant classifications and popular model examples
- July 10, 2025: Updated car categories: Added Compact SUV/Mid-size SUV split, Premium Sedan, and model examples in brackets
- July 10, 2025: Improved bike categories: Added engine capacity ranges (100-125cc, 150-200cc, 200-350cc, 350cc+) with model examples
- July 10, 2025: Database reseeded with 21 improved vehicle types including realistic emission factors and costs
- July 10, 2025: Vehicle categories now reflect actual Indian market segments popular in Chennai
- July 10, 2025: Updated all About section pages (data-sources, methodology, how-it-works) with current vehicle database details
- July 10, 2025: Enhanced data-sources page with comprehensive 21-category vehicle breakdown and emission factors
- July 10, 2025: Added detailed vehicle classification system to methodology page showing all categories and impact scores
- July 9, 2025: Implemented comprehensive SEO strategy with sitemap, meta tags, OpenGraph, and PWA support
- July 9, 2025: Created dynamic sitemap generator endpoint at /sitemap.xml with proper XML formatting
- July 9, 2025: Added OpenGraph image (og-image.svg) for enhanced social media sharing
- July 9, 2025: Implemented PWA manifest with icons (192x192 and 512x512 SVG) for installable web app
- July 9, 2025: Added JSON-LD structured data for WebApplication and FAQPage schemas
- July 9, 2025: Enhanced index.html with comprehensive meta tags, canonical URL, and theme colors
- July 9, 2025: React Helmet integration maintained for dynamic meta tag management on all pages
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