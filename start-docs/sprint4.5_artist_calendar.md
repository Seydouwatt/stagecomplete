# SPRINT 4.5 - ARTIST CALENDAR & BOOKING MANAGEMENT

## _Artist-First Self-Service Calendar (6-10 octobre 2025)_

---

## 🎯 **PIVOT STRATÉGIQUE**

**Changement de scope**: Passage de "venues ↔ artists matching platform" vers **"artist-first calendar and booking management platform"**.

**Nouvelle priorité**: Les artistes peuvent créer et gérer leurs propres bookings (self-service) sans interaction avec les venues pour l'instant. Focus sur l'expérience artiste parfaite avant d'ajouter les features venues.

---

## 📅 **EPIC 18: ARTIST CALENDAR & BOOKING MANAGEMENT**

### **US-042: Artist Self-Service Booking Management** ✅

**En tant que** artiste
**Je veux** gérer mon calendrier de bookings moi-même
**Afin de** suivre mes événements et organiser mes activités professionnelles

**Critères d'acceptation:**

- [x] CRUD complet bookings (create, read, update, delete)
- [x] Formulaire création booking avec validation
  - [x] Titre (requis)
  - [x] Date et heure début (requis)
  - [x] Date et heure fin (optionnel)
  - [x] Type d'événement (requis): Concert, Théâtre, Comédie, Festival, Privé, Répétition, Studio, Autre
  - [x] Lieu et adresse (optionnels)
  - [x] Durée en minutes (optionnel)
  - [x] Cachet/Budget (optionnel)
  - [x] Statut: Confirmé, Provisoire, Annulé, Terminé
  - [x] Notes privées (optionnel)
  - [x] Tags personnalisés (optionnel)
  - [x] Description (optionnel)
- [x] Liste complète des bookings
  - [x] Cards responsive avec détails complets
  - [x] Badges colorés par statut
  - [x] Actions: voir, modifier, supprimer
  - [x] Confirmation avant suppression
- [x] Statistiques dashboard
  - [x] Total bookings
  - [x] Bookings à venir
  - [x] Bookings ce mois
  - [x] Revenue total
- [x] Bookings illimités pour artistes gratuits
- [x] Export iCal (premium only)
  - [x] Format iCal standard
  - [x] Import dans Google Calendar/Apple Calendar
  - [x] Alert pour artistes gratuits
- [x] Accès sidebar pour tous les artistes
- [ ] Vue calendrier interactive (en cours)
- [ ] Filtres avancés (statut, type, date)
- [ ] Intégration dashboard artiste

**Issues techniques:**

- [x] **BOOKING-001**: Backend API bookings (NestJS)
  - [x] BookingModule, Controller, Service
  - [x] DTOs validation (CreateBookingDto, UpdateBookingDto)
  - [x] 8 endpoints REST (CRUD + stats + calendar + export)
- [x] **BOOKING-002**: Schema Prisma Event model
  - [x] Adaptation pour artist self-service
  - [x] venueId optionnel, artistId requis
  - [x] BookingStatus enum
  - [x] SubscriptionType enum
  - [x] User.plan field
- [x] **BOOKING-003**: BookingsList page
  - [x] Liste avec cards bookings
  - [x] Stats dashboard
  - [x] Export iCal premium-gated
  - [x] Actions CRUD
- [x] **BOOKING-004**: BookingForm page
  - [x] React Hook Form + Zod validation
  - [x] Mode création/édition
  - [x] Pre-fill automatique en édition
  - [x] Gestion tags comma-separated
- [x] **BOOKING-005**: bookingService API client
  - [x] Axios avec interceptors
  - [x] Interfaces TypeScript
  - [x] Error handling
- [x] **BOOKING-006**: Routes protection
  - [x] ProtectedRoute ARTIST uniquement
  - [x] 3 routes: /artist/bookings, /new, /:id/edit
- [x] **BOOKING-007**: Premium features alignment
  - [x] bookings: true (gratuit)
  - [x] calendarExport: isPremium
  - [x] Sidebar: "Mes Bookings" visible gratuit
- [ ] **BOOKING-008**: Vue calendrier interactive
- [ ] **BOOKING-009**: Filtres et tri avancés
- [ ] **BOOKING-010**: Intégration dashboard

**Tests:**
- [x] Build frontend successful
- [x] Build backend successful
- [x] Serveurs running
- [ ] Tests E2E Cypress bookings
- [ ] Tests unitaires services

---

### **US-043: Interactive Calendar View** 🔄 EN COURS

**En tant que** artiste
**Je veux** visualiser mes bookings dans un calendrier interactif
**Afin de** mieux planifier mon temps et éviter les conflits

**Critères d'acceptation:**

- [ ] Vue calendrier mensuelle par défaut
- [ ] Navigation temporelle fluide
  - [ ] Boutons Précédent/Suivant
  - [ ] Sélecteur mois/année
  - [ ] Bouton "Aujourd'hui"
- [ ] Vues multiples
  - [ ] Jour (timeline 24h)
  - [ ] Semaine (7 jours)
  - [ ] Mois (grille complète)
  - [ ] Année (overview 12 mois)
- [ ] Affichage bookings sur calendrier
  - [ ] Pastilles colorées par statut
  - [ ] Titre booking visible
  - [ ] Preview hover avec détails
  - [ ] Clic pour ouvrir détails complets
- [ ] Interaction
  - [ ] Drag & drop pour changer date (optionnel)
  - [ ] Double-clic jour pour créer booking
  - [ ] Badges nombre bookings par jour
- [ ] Responsive mobile
  - [ ] Swipe navigation mobile
  - [ ] Vue adaptée petits écrans
- [ ] Indicateurs visuels
  - [ ] Jour actuel surligné
  - [ ] Conflits de dates signalés
  - [ ] Jours avec bookings marqués

**Issues techniques:**

- [ ] **CALENDAR-001**: Composant CalendarView
  - [ ] Grid layout responsive
  - [ ] Navigation mois/année
  - [ ] Génération jours du mois
- [ ] **CALENDAR-002**: Vues multiples (jour/semaine/mois/année)
  - [ ] Composants séparés pour chaque vue
  - [ ] Switch entre vues fluide
  - [ ] State management vue active
- [ ] **CALENDAR-003**: Affichage bookings sur calendrier
  - [ ] Mapping bookings → dates
  - [ ] Composant BookingPill avec colors
  - [ ] Tooltip hover avec détails
- [ ] **CALENDAR-004**: Interactions calendrier
  - [ ] Clic jour → créer booking
  - [ ] Clic booking → modal détails
  - [ ] Navigation clavier (optionnel)
- [ ] **CALENDAR-005**: API calendar/:year/:month
  - [x] Endpoint backend existant
  - [ ] Intégration frontend
  - [ ] Caching avec TanStack Query
- [ ] **CALENDAR-006**: Responsive et mobile
  - [ ] Layout adaptatif
  - [ ] Touch gestures
  - [ ] Swipe navigation
- [ ] **CALENDAR-007**: Performance
  - [ ] Lazy loading bookings
  - [ ] Virtualization si nécessaire
  - [ ] Optimistic updates

**Priorité**: 🔥 **HIGH** - Next major feature après CRUD bookings

**Estimation**: 16-20h (2-3 jours)

---

### **US-044: Booking Filters & Search** 📋 PLANIFIÉ

**En tant que** artiste
**Je veux** filtrer et rechercher dans mes bookings
**Afin de** retrouver rapidement des événements spécifiques

**Critères d'acceptation:**

- [ ] Filtres multiples combinables
  - [ ] Par statut (Confirmé, Provisoire, Annulé, Terminé)
  - [ ] Par type d'événement
  - [ ] Par période (ce mois, mois prochain, année, custom)
  - [ ] Par tags
- [ ] Recherche textuelle
  - [ ] Titre, description, lieu, notes
  - [ ] Résultats instantanés
- [ ] Tri flexible
  - [ ] Date (asc/desc)
  - [ ] Titre (A-Z)
  - [ ] Budget (min/max)
  - [ ] Statut
- [ ] State persistence dans URL
- [ ] Reset rapide tous filtres
- [ ] Compteur résultats

**Issues techniques:**

- [ ] **FILTER-016**: Composant BookingFilters
- [ ] **FILTER-017**: Search input avec debouncing
- [ ] **FILTER-018**: Multi-select statuts et types
- [ ] **FILTER-019**: DateRange picker
- [ ] **FILTER-020**: URL state sync
- [ ] **FILTER-021**: Backend filters support (existant)

**Priorité**: 🟡 **MEDIUM**

**Estimation**: 8-10h

---

### **US-045: Dashboard Integration** 📋 PLANIFIÉ

**En tant que** artiste
**Je veux** voir un résumé de mes bookings dans mon dashboard
**Afin de** avoir une vue d'ensemble rapide de mes activités

**Critères d'acceptation:**

- [ ] Widget "Prochains événements" sur dashboard
  - [ ] 3-5 bookings à venir
  - [ ] Affichage compact avec date, titre, lieu
  - [ ] Lien vers page complète bookings
- [ ] Widget statistiques
  - [ ] Bookings ce mois
  - [ ] Revenue ce mois
  - [ ] Mini chart évolution
- [ ] Alertes et notifications
  - [ ] Booking dans les prochaines 24h
  - [ ] Bookings provisoires à confirmer
- [ ] Quick actions
  - [ ] Bouton "Créer booking"
  - [ ] Accès rapide calendrier

**Issues techniques:**

- [ ] **DASHBOARD-001**: Composant UpcomingBookings widget
- [ ] **DASHBOARD-002**: Composant BookingStats widget
- [ ] **DASHBOARD-003**: Intégration dans ArtistDashboard
- [ ] **DASHBOARD-004**: Queries optimisées (upcoming, stats)

**Priorité**: 🟡 **MEDIUM**

**Estimation**: 6-8h

---

## 🎨 **BUSINESS MODEL SIMPLIFIÉ**

### **Artiste FREE** (Gratuit)
- ✅ Bookings illimités (CRUD complet)
- ✅ Calendrier complet
- ✅ 5 photos portfolio
- ✅ Profil public
- ❌ Export calendrier (iCal)
- ❌ Photos portfolio illimitées

### **Artiste PREMIUM** (9€/mois)
- ✅ Tout du plan gratuit
- ✅ Export calendrier (iCal/Google Calendar)
- ✅ Photos portfolio illimitées
- ✅ Badge "Pro"
- ✅ Support prioritaire (futur)
- ✅ Analytics avancées (futur)

### **Venues** (Phase 2 - Reporté)
- 🔄 Pas d'ouverture venue pour l'instant
- 🔄 Messaging venue ↔ artiste reporté
- 🔄 Browse venues reporté
- 🔄 Focus 100% expérience artiste

---

## ✅ **DEFINITION OF DONE - SPRINT 4.5**

### **Phase 1: Booking CRUD** ✅ COMPLETED (6 octobre)
- [x] Backend API complet et fonctionnel
- [x] Frontend pages CRUD opérationnelles
- [x] Premium features alignées avec specs
- [x] Sidebar navigation accessible
- [x] Build successful (backend + frontend)
- [x] Serveurs running sans erreurs
- [x] Export iCal premium-gated

### **Phase 2: Calendar View** 🔄 EN COURS (7-9 octobre)
- [ ] Vue calendrier mensuelle fonctionnelle
- [ ] Navigation temporelle (jour/semaine/mois/année)
- [ ] Affichage bookings sur calendrier
- [ ] Interactions de base (clic, création)
- [ ] Responsive mobile
- [ ] Performance acceptable (<2s load)

### **Phase 3: Polish & Integration** 📋 PLANIFIÉ (9-10 octobre)
- [ ] Filtres et recherche bookings
- [ ] Intégration dashboard artiste
- [ ] Tests E2E Cypress
- [ ] Documentation utilisateur
- [ ] Correction bugs identifiés

---

## 📊 **ESTIMATION & TIMELINE**

### **Timeline Révisée:**
- **6 octobre**: ✅ Phase 1 CRUD completed
- **7-8 octobre**: 🔄 Phase 2 Calendar view (US-043)
- **9 octobre**: 📋 Phase 3 Filters + Dashboard
- **10 octobre**: 📋 Polish, tests, documentation

### **Effort Estimation:**
- **Phase 1 (CRUD)**: ✅ 24h (3 jours) - DONE
- **Phase 2 (Calendar)**: 🔄 16-20h (2-3 jours) - IN PROGRESS
- **Phase 3 (Polish)**: 📋 8-12h (1-2 jours) - PLANNED

**Total Sprint 4.5**: ~50h = 6-8 jours

---

## 📝 **NOTES & DÉCISIONS**

### **Décisions Stratégiques:**
1. ✅ **Artist-first approach**: Focus expérience artiste parfaite
2. ✅ **Self-service bookings**: Pas de dépendance venues
3. ✅ **Bookings gratuit illimité**: Acquisition artistes facilitée
4. ✅ **Export premium only**: Monétisation claire et simple
5. 🔄 **Venues reportées Phase 2**: Lancement MVP rapide

### **Choix Techniques:**
1. ✅ **Pas de librairie externe iCal**: Génération manuelle contrôlée
2. ✅ **Event model réutilisé**: Adaptation schema existant
3. ✅ **Premium-gating simple**: Hook usePremiumFeatures centralisé
4. 🔄 **Calendar à implémenter**: À décider entre lib vs custom

### **Questions Ouvertes:**
1. **Librairie calendrier**: react-big-calendar vs custom component?
2. **Drag & drop**: Priorité haute ou nice-to-have?
3. **Notifications**: Push browser pour rappels bookings?
4. **Recurring events**: Support événements récurrents?
5. **Conflits**: Détection automatique conflits de dates?

---

## 🎯 **NEXT STEPS (Immediate)**

**Priorité Immédiate:**
1. 🔥 Implémenter vue calendrier interactive (US-043)
   - Commencer par vue mensuelle
   - Navigation mois/année
   - Affichage basique bookings

**Après Calendar View:**
2. 🟡 Ajouter filtres et recherche (US-044)
3. 🟡 Intégrer dashboard artiste (US-045)
4. 🟢 Tests E2E complets
5. 🟢 Documentation et polish

**READY FOR CALENDAR IMPLEMENTATION! 📅✨**
