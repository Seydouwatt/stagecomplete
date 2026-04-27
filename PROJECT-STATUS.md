# 📊 PROJECT STATUS DASHBOARD

## 🎯 **Vue d'ensemble**

**StageComplete** est une plateforme de création, diffusion et gestion de fiche d'artiste (roster), de calendrier et de bookings pour artistes professionnels ou non, avec annuaire de découverte pour venues. Actuellement en **Phase MVP Artist-First** avec focus sur l'expérience artiste.

---

## 🚀 **Avancement Global**

### **MVP Artist Ecosystem : ✅ FONCTIONNEL (v1.0.0)**

| Module                      | Status      | Progression | Tests    | Notes                                                   |
| --------------------------- | ----------- | ----------- | -------- | ------------------------------------------------------- |
| 🔐 **Authentication**       | ✅ Complet  | 100%        | ✅       | JWT + rôles (ARTIST/VENUE/MEMBER/ADMIN)                 |
| 👤 **Profiles System**      | ✅ Complet  | 100%        | ✅       | Universal + Artist profiles complets                    |
| 📅 **Booking Self-Service** | ✅ Complet  | 100%        | ✅       | CRUD bookings + stats + iCal backend (export non câblé en UI) |
| 🔍 **Search Engine**        | ✅ Complet  | 95%         | 14/16 ✅ | Discovery artistes (feature secondaire)                 |
| 🎨 **Public Pages**         | ✅ Complet  | 100%        | ✅       | SEO-optimized artist profiles                           |
| 📱 **Frontend UI**          | ✅ Complet  | 90%         | ✅       | 130+ fichiers TS — plusieurs routes ComingSoon          |
| 🏗️ **Backend API**          | ✅ Complet  | 100%        | ✅       | NestJS + Prisma + PostgreSQL                            |
| 📅 **Calendar UI**          | 🔄 Partiel  | 60%         | ⏳       | Composants Day/Week/Month/Year présents, route /calendar = ComingSoon + PremiumRoute |

### **Venue Booking Management : ✅ COMPLET (v0.6.0)**

| Module                           | Status     | Progression | Notes                                              |
| -------------------------------- | ---------- | ----------- | -------------------------------------------------- |
| 📋 **Gestion demandes venue**    | ✅ Complet | 100%        | Liste, edition, renvoi des demandes                |
| 💬 **Messages non-lus**          | ✅ Complet | 100%        | Badge sidebar + marquage auto a l'ouverture        |
| 🔗 **Booking dans conversation** | ✅ Complet | 100%        | Encart avec lien vers edition                      |
| 🎯 **Landing navbar**            | ✅ Complet | 100%        | Navbar sticky avec CTAs Connexion/Inscription      |

### **Premium Features : 🔄 UI SEULEMENT (v1.1.0 — sans paiement)**

| Module                     | Status       | Progression | Priorité  | ETA        |
| -------------------------- | ------------ | ----------- | --------- | ---------- |
| 💰 **Premium UI**          | ✅ UI faite  | 50%         | 🔥 High   | —          |
| 💳 **Stripe Integration**  | ❌ Non démarré | 0%        | 🔥 High   | 2 semaines |
| 📅 **Calendar /calendar**  | ❌ ComingSoon | 0%         | 🔥 High   | 1 semaine  |
| 📥 **iCal Export (UI)**    | ❌ Non câblé | 50%         | 🟡 Medium | 3 jours    |
| 📊 **Analytics**           | ❌ ComingSoon | 0%         | 🟡 Medium | Phase 2    |

---

## ⚠️ **Bugs & Incohérences détectés (Analyse code — 27/04/2026)**

### **Bugs confirmés dans le code :**

| # | Fichier                       | Description                                                  | Impact   | Statut |
| - | ----------------------------- | ------------------------------------------------------------ | -------- | ------ |
| 1 | `AppRoutes.tsx:13-17`         | `DashboardRedirect` toujours vers `/artist/dashboard` quel que soit le rôle | Venues redirigées vers dashboard artiste | ⚠️ Mineur — le login redirige déjà correctement |
| 2 | `ArtistDashboard.tsx`         | "Messages non lus" hardcodé à `"0"` | Metric fausse | ✅ Corrigé v0.6.1 |
| 3 | `sharedRoutes.tsx:54-62`      | Route `/calendar` = `ComingSoon` + derrière `PremiumRoute` | Feature invisible | ❌ À faire |
| 4 | `ArtistDashboard.tsx`         | Charts (revenus, genre, performance) = données mockées | Données fausses | ❌ Phase 2 |
| 5 | `ArtistDashboard.tsx`         | `recentActivities` = tableau statique | Activités fausses | ✅ Corrigé v0.6.1 |
| 6 | `ArtistDashboard.tsx`         | Quick actions `onClick` = `console.log()` | Boutons inactifs | ✅ Corrigé v0.6.1 |
| 7 | `UpgradePrompt.tsx:156`       | Bouton "Passer à Premium" sans handler Stripe | CTA mort | ❌ Bloqué par Stripe |
| 8 | `validation-lead.controller.ts` | `// TODO: Add role check for ADMIN` | Sécurité manquante | ❌ À faire |

### **Pages en ComingSoon :**

- `/calendar` — ComingSoon + PremiumRoute (composants CalendarView existent)
- `/venue/profile` — ComingSoon (modèle Venue en DB, pas de formulaire)
- `/venue/events` — ComingSoon
- `/venue/team` — ComingSoon
- `/browse/artists` — ComingSoon
- `/browse/venues` — ComingSoon
- `/artist/analytics` — ComingSoon

---

## 📈 **Métriques de Développement**

### **Activité Code (Depuis septembre 2025)**

- **109 commits** au total
- **38 nouvelles fonctionnalités** (✨ feat)
- **Rythme** : ~3.6 commits/jour
- **Dernière mise à jour** : 27/04/2026

### **Architecture Technique**

```
Backend (stagecomplete-backend/)
├── src/
│   ├── auth/             ✅ Complet (15+ fichiers)
│   ├── artist/           ✅ Complet (3 fichiers)
│   ├── profile/          ✅ Complet (3 fichiers)
│   ├── booking/          ✅ Complet (5 fichiers) - CRUD + calendar + stats + iCal export
│   ├── booking-request/  ✅ Complet (5 fichiers) - CRUD + update + respond
│   ├── message/          ✅ Complet (5 fichiers) - CRUD + read-all batch + unread count
│   ├── notification/     ✅ Complet (5 fichiers)
│   ├── public/           ✅ Complet (3 fichiers)
│   ├── search/           ✅ Complet (6 fichiers)
│   ├── validation-lead/  ✅ Complet (4 fichiers) - Lean Startup lead capture
│   └── health/           ✅ Complet (3 fichiers)
│
Frontend (stagecomplete-frontend/)
├── src/components/    ✅ 20+ categories organisees
├── src/pages/         ✅ 18 pages + landing pages (plusieurs avec ComingSoon)
├── src/hooks/         ✅ 9 fichiers hooks (useMarkAllAsRead + useUpdateBookingRequest dans useMessages/useBookingRequests)
├── src/services/      ✅ 13 services API
└── src/stores/        ✅ 2 stores Zustand (authStore + useToastStore)
```

### **Couverture Tests**

- **E2E Cypress** : 14/16 tests ✅ (87.5%)
- **API Tests** : Tests unitaires auth ✅
- **Fixtures** : Données de test complètes ✅

---

## 🎯 **Fonctionnalités Clés Développées**

### ✅ **SEARCH & DISCOVERY**

- **Recherche intelligente** : Tolérance fautes, normalisation accents
- **Filtres avancés** : Multi-critères avec persistance URL
- **Suggestions** : Auto-complétion + recherche floue
- **Performance** : Debouncing, lazy loading, optimisations SQL

### ✅ **ARTIST EXPERIENCE**

- **Copy Bio** : Partage facile du contenu artistique
- **Download Portfolio** : Téléchargement avec nommage automatique
- **Public Profiles** : Pages SEO /artist/:slug optimisées
- **Portfolio Management** : Gestion multi-média avancée (5 photos gratuit, illimité premium)

### ✅ **BOOKING SELF-SERVICE (Artiste)**

- **Calendar artiste** : Vue mensuelle et liste via BookingsPageUnified (/artist/bookings)
- **Gestion bookings** : CRUD complet (création, modification, suppression)
- **iCal export** : Backend `GET /bookings/export/ical` fonctionnel — non câblé en UI
- **Filtres & stats** : Tri par date, statut, type + statistiques
- **Notes privées & tags** : Organisation personnalisée

### ✅ **VENUE BOOKING REQUEST MANAGEMENT (v0.6.0)**

- **Section "Demandes" sidebar** : Badge demandes en attente
- **Liste des demandes** : Filtres par statut
- **Edition des demandes** : Modification et renvoi avec message systeme
- **Encart booking dans conversation** : Statut, duree, budget + lien edition
- **Messages non-lus** : Badge + marquage auto batch

### ✅ **MESSAGERIE**

- **Conversations** : Liste par event avec polling 5s
- **MessageThread** : Chat complet avec mark-all-as-read auto au mount
- **Compteur non-lus** : Polling 10s dans la sidebar

### ✅ **LEAD CAPTURE (Lean Startup)**

- **ValidationLead** : Capture leads artistes + venues depuis landing pages
- **Backend admin** : CRUD complet avec statuts et scoring (TODO: sécuriser avec rôle ADMIN)
- **Landing pages** : ArtistLandingPage + VenueLandingPage avec formulaires

---

## 📋 **Reste à Faire — Priorités**

### **🔥 CRITIQUE (blockers)**

1. **Stripe Integration** (0%) — Le bouton "Passer à Premium" n'a aucune action
   - Ajouter webhook Stripe, endpoint `/payments/subscribe`, mise à jour `user.plan`
   - ~2 semaines

2. **Fix DashboardRedirect** (bug) — Route `/` redirige toujours vers artiste
   - Lire le rôle de l'user et rediriger vers `/artist/dashboard` ou `/venue/dashboard`
   - ~30 minutes

3. **Câbler la route /calendar** — Les composants CalendarView existent mais la route est ComingSoon
   - Remplacer ComingSoon par CalendarView dans sharedRoutes.tsx
   - Décider si vraiment premium-only ou accessible à tous
   - ~1 journée

### **🟡 IMPORTANT (avant beta)**

4. **iCal Export UI** — Backend exist, pas de bouton dans BookingsPageUnified
   - Ajouter bouton "Exporter .ics" dans la page bookings artiste
   - ~2h

5. **Artist Dashboard : brancher les vraies données**
   - Messages non lus : remplacer `"0"` par `useUnreadMessagesCount`
   - Recent activities : appel API réel (conversations récentes)
   - Quick actions : navigation réelle
   - ~1 journée

6. **Sécuriser les endpoints admin** (validation-lead)
   - Ajouter vérification rôle ADMIN dans le contrôleur
   - ~1h

7. **Venue Profile Form** — Le modèle Venue existe en DB, pas de page pour remplir les infos
   - Formulaire basique (type venue, capacité, équipement)
   - ~2 jours

### **🟢 NICE TO HAVE (Phase 2)**

8. **Analytics artiste** — Route ComingSoon, données mocked dans dashboard
9. **Admin Panel** — Rôle ADMIN existant sans UI
10. **Password change** — Settings n'a que la suppression de compte
11. **Browse Artists/Venues** — Routes ComingSoon
12. **Venue Events/Team** — Routes ComingSoon
13. **Drag & drop calendrier**
14. **Charts dashboard avec vraies données API**

---

## ⚠️ **Points d'Attention**

### **Technical Debt**

- 🔴 **Stripe** : Zéro intégration paiement — bloque la monétisation
- 🟡 **Mock data** : Charts + activités récentes dans ArtistDashboard = données statiques
- 🟡 **Tests E2E** : 2 tests en échec à corriger
- 🟡 **File Upload** : Migration base64 → S3/CDN à planifier
- 🟡 **Admin security** : Endpoints validation-lead manquent guard ADMIN

### **Business Model**

- 🟢 **Gratuit Artiste** : Bookings illimités + 5 photos portfolio
- 🟢 **Premium Artiste 9€/mois** : UI prête, MAIS paiement Stripe non implémenté
- 🟡 **Venues** : Pas de profil venue créable via l'interface
- 🔴 **Monétisation** : Bloquée par l'absence de Stripe

---

## 🗓️ **Timeline vers Production**

### **🎯 Objectif : Beta Launch artistes (dans 2-3 semaines)**

- **Semaine 1** : Fix bugs critiques (dashboard redirect, calendar route, iCal UI, dashboard data réelles)
- **Semaine 2** : Stripe integration + sécurité admin
- **Semaine 3** : Tests, polish, venue profile basique, beta launch

---

**Dernière mise à jour :** 27 avril 2026 (v0.6.1 — fix dashboard artiste)
**Statut global :** ✅ Backend API complet | ✅ Booking management | ✅ Dashboard artiste corrigé | ❌ Paiement non implémenté
**Confiance production :** 🟡 Moyenne (backend solide, route /calendar et Stripe restants)
