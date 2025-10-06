# 🎭 StageComplete

**La première plateforme complète de l'écosystème artistique**

_Premium booking platform connecting venues with verified artists_

## 🎯 Vision

StageComplete révolutionne la mise en relation entre venues (bars, théâtres, clubs) et artistes (musique, comédie, théâtre, danse) avec une approche premium et multi-arts.

## 🚀 MVP Roadmap

- ✅ **Sprint 1** (Semaine 1): Foundation & Authentication (Complété)
- ✅ **Sprint 2** (Semaine 2): Profiles & Browse (Complété)
- ✅ **Sprint 3** (Semaine 3): Communication & Booking (Complété)
- ✅ **Sprint 4** (Semaine 4): Advanced Search & Discovery (Complété)
- 🔄 **Phase 5**: Premium Features & Monetization (En cours)

## 🛠 Tech Stack

**Backend:**

- NestJS + TypeScript
- Prisma ORM + PostgreSQL
- JWT Authentication
- WebSocket (Socket.io)

**Frontend:**

- React 18 + Vite
- TailwindCSS + DaisyUI + Framer Motion
- Zustand + TanStack Query
- React Hook Form + Zod validation
- Cypress E2E testing

## 💰 Business Model

- **Venue Premium**: 99€/mois (booking illimité)
- **Artist Basic**: 9€/mois (portfolio premium)
- **Zero commission** sur les bookings

## 🏃‍♂️ Quick Start

### Backend

```bash
cd stagecomplete-backend
npm install
cp .env.example .env
# Configurer DATABASE_URL dans .env
npx prisma migrate dev
npm run start:dev
```

### Frontend
```bash
cd stagecomplete-frontend
npm install
npm run dev          # Runs on http://localhost:5173
```

### Development

- Backend: http://localhost:3000/api
- Frontend: http://localhost:5173
- Prisma Studio: npx prisma studio
- API Documentation: http://localhost:3000/api/docs

### 📊 Current Status

✅ **v1.0.0 - MVP Artist Ecosystem** (Fonctionnel)
- ✅ Authentication & Role Management
- ✅ Complete Artist Profiles System  
- ✅ Advanced Search & Discovery
- ✅ Public Artist Pages (SEO-optimized)
- ✅ Smart Filtering System (14/16 tests ✅)
- ✅ Copy/Download Features

🔄 **v1.1.0 - Premium Features** (En développement)
- 🔄 Venue Premium Accounts
- 🔄 Direct Contact System
- 🔄 Advanced Analytics
- 📋 Payment Integration

### 🎪 Target Market

- France → Europe → Afrique

- 2000+ venues premium potentielles
- Écosystème artistique sous-digitalisé
- Besoin d'outils professionnels

## Built with ❤️ for the artistic community
