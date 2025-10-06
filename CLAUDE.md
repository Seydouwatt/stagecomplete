# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StageComplete is a premium booking platform connecting venues (bars, theaters, clubs) with verified artists (music, comedy, theater, dance). This is a monorepo with a NestJS backend and React frontend, currently in Phase MVP avancée with focus on the artist ecosystem.

## Architecture

### Backend (`stagecomplete-backend/`)
- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with role-based access (ARTIST, VENUE, MEMBER, ADMIN)
- **API Documentation**: Swagger available at `/api/docs`
- **Key Modules**:
  - `auth/` - JWT authentication, user management, artist registration
  - `artist/` - Artist profiles and member management
  - `profile/` - Universal profile system
  - `public/` - Public endpoints for artist discovery with SEO optimization
  - `search/` - Advanced search engine with fuzzy matching and filtering
  - `health/` - Health check endpoints

### Frontend (`stagecomplete-frontend/`)
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM with route-based architecture in `src/routes/`
- **State Management**: Zustand + TanStack Query
- **UI**: TailwindCSS + DaisyUI components
- **Forms**: React Hook Form + Zod validation
- **Testing**: Cypress for E2E testing

### Database Schema (Prisma)
Core entities and relationships:
- **User** → **Profile** (1:1) → **Artist**/**Venue** (1:1)
- **Artist** → **ArtistMember**[] (1:many) for group/band management
- **Event** connects Venue + Artist with **Message**[] for communication
- Multi-discipline support: Music, Theater, Comedy, Dance, Circus, Magic

## Essential Commands

### Development Setup
```bash
# Start PostgreSQL
docker-compose up -d

# Backend setup
cd stagecomplete-backend
npm install
cp .env.example .env  # Configure DATABASE_URL
npx prisma migrate dev
npm run start:dev     # Runs on http://localhost:3000/api

# Frontend setup
cd stagecomplete-frontend
npm install
npm run dev          # Runs on http://localhost:5173
```

### Common Development Tasks

#### Backend
- `npm run start:dev` - Development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - ESLint code checking
- `npm run test` - Run Jest tests
- `npm run test:e2e` - End-to-end tests
- `npx prisma studio` - Database browser
- `npx prisma migrate dev` - Apply database migrations
- `npx prisma generate` - Generate Prisma client

#### Frontend
- `npm run dev` - Development server
- `npm run build` - Build for production (output: `dist/`)
- `npm run lint` - ESLint code checking
- `npm run cypress:open` - Open Cypress test runner
- `npm run cypress:run` - Run Cypress tests headlessly

### Database Management
- **Migrations**: Located in `stagecomplete-backend/prisma/migrations/`
- **Schema**: `stagecomplete-backend/prisma/schema.prisma`
- **Studio**: `npx prisma studio` for visual database management
- **Reset**: `npx prisma migrate reset` (development only)

## Key Technical Patterns

### Authentication Flow
1. JWT tokens stored in Zustand store (`src/stores/authStore.ts`)
2. Protected routes use `ProtectedRoute` component with role checking
3. API calls include Bearer token automatically via axios interceptors

### API Integration
- Backend serves at `/api` prefix (except `/health`)
- Frontend proxies `/api` to `localhost:3000` in development
- CORS configured for localhost:5173-5174 and production domains
- Swagger documentation available at `localhost:3000/api/docs`

### Form Handling
- React Hook Form + Zod validation throughout
- Custom form components in `src/components/forms/`
- Artist profile forms support complex nested data (members, portfolio, pricing)

### File Uploads
- Currently using base64 encoding for MVP (images stored in database)
- Handled in artist profile photos, logos, and portfolio media

### Component Organization
- `src/components/ui/` - Reusable UI components (buttons, modals, etc.)
- `src/components/auth/` - Authentication components
- `src/components/public/` - Public pages components (artist profiles, search)
- `src/components/search/` - Advanced search and filtering components
- `src/components/browse/` - Artist discovery and browsing
- `src/components/landing/` - Landing pages and marketing components
- `src/components/dashboard/` - User dashboards (artist/venue)
- `src/pages/` - Page-level components matching routes

## Business Logic

### User Roles & Profiles
- **ARTIST**: Can create detailed artist profiles, manage members, set pricing
- **VENUE**: Can browse artists, create events, manage bookings
- **MEMBER**: Band/group members with limited permissions
- **ADMIN**: Full system access

### Artist Profile System
- Universal Profile (name, bio, avatar, social links) shared across all users
- Extended Artist profile with genres, instruments, pricing, portfolio
- Member management for bands/groups with individual member profiles
- Public artist pages accessible at `/artist/:slug` with SEO optimization
- Copy bio and download portfolio features for enhanced UX
- Advanced portfolio management with multiple media types

### Pricing & Business Model
- Venue Premium: €99/month (unlimited bookings)
- Artist Basic: €9/month (premium portfolio)
- Zero commission on bookings

## Development Notes

- **Current Phase**: MVP Artist-focused (Sprint 4 features completed)
- **Documentation**: Comprehensive sprint plans and user stories in `start-docs/`
- **Deployment**: Backend on Render, Frontend on Netlify
- **Environment**: Node.js 20+, TypeScript throughout
- **Code Style**: ESLint configured, auto-formatting enabled
- **Test Coverage**: 14/16 Cypress E2E tests passing (87.5%)

## Recent Major Features Completed

### Search & Discovery System
- ✅ **Advanced Search Engine** with fuzzy matching and accent normalization
- ✅ **Smart Filtering System** with 14/16 E2E tests passing  
- ✅ **Intelligent Suggestions** with typo tolerance and artist name prioritization
- ✅ **SEO-Optimized Pages** for artist discovery and genre directories

### Enhanced Artist Experience  
- ✅ **Copy Bio Feature** for easy content sharing
- ✅ **Download Portfolio** with automatic file naming
- ✅ **Public Artist Profiles** with comprehensive information display
- ✅ **Advanced Portfolio Management** with multiple media types

### Technical Improvements
- ✅ **Performance Optimizations** in search algorithms
- ✅ **Mobile-Responsive Design** across all components
- ✅ **State Management** with Zustand + TanStack Query
- ✅ **Component Architecture** with 117+ TypeScript files

## Troubleshooting

### Common Issues
- **CORS errors**: Check allowed origins in `stagecomplete-backend/src/main.ts`
- **Database connection**: Verify PostgreSQL is running and `DATABASE_URL` is correct
- **Build failures**: Ensure Prisma client is generated after schema changes
- **Type errors**: Run `npx prisma generate` after schema updates

### Useful Debugging
- Backend logs available in development console
- Frontend uses custom `useDebugLog` hook for component debugging
- Prisma Studio for database inspection
- Swagger UI for API testing
- never add claude credits dans les commit