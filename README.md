# 🎭 StageComplete

**La première plateforme complète de l'écosystème artistique**

_Premium booking platform connecting venues with verified artists_

## 🎯 Vision

StageComplete révolutionne la mise en relation entre venues (bars, théâtres, clubs) et artistes (musique, comédie, théâtre, danse) avec une approche premium et multi-arts.

## 🚀 MVP Roadmap

- **Sprint 1** (Semaine 1): Foundation & Authentication ⏳
- **Sprint 2** (Semaine 2): Profiles & Browse
- **Sprint 3** (Semaine 3): Communication & Booking
- **Sprint 4** (Semaine 4): Polish & Deploy

## 🛠 Tech Stack

**Backend:**

- NestJS + TypeScript
- Prisma ORM + PostgreSQL
- JWT Authentication
- WebSocket (Socket.io)

**Frontend:** _(Coming soon)_

- React 18 + Vite
- TailwindCSS + DaisyUI
- Zustand + React Query

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

### Development

- Backend: http://localhost:3000/api
- Prisma Studio: npx prisma studio

### 📊 Current Status

✅ v0.1.0 - Backend Foundation
⏳ v0.2.0 - Authentication System
🔄 v0.3.0 - Profiles & Browse
📋 v0.4.0 - Communication & Booking

### 🎪 Target Market

- France → Europe → Afrique

- 2000+ venues premium potentielles
- Écosystème artistique sous-digitalisé
- Besoin d'outils professionnels

## Built with ❤️ for the artistic community
