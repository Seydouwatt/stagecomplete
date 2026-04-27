# Changelog - StageComplete

Toutes les modifications notables du projet seront documentées dans ce fichier.

Format basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.6.0] - 2026-02-19

### 🚀 Ajouté

#### Gestion des Demandes de Booking (Venue)
- **Section "Demandes" dans la sidebar venue** : Nouveau lien dans la navigation avec badge indiquant le nombre de demandes en attente
- **Page VenueBookingRequestsPage** : Liste des demandes envoyees avec filtres par statut (Toutes, En attente, Acceptees, Declinees, Annulees)
- **Page BookingRequestEditPage** : Formulaire d'edition des demandes (date, type, duree, budget, message) avec renvoi automatique
- **Endpoint PUT /booking-requests/:id** : Mise a jour d'une booking request par la venue proprietaire
- **Modification et renvoi** : Si une demande etait declinee, la modification la repasse automatiquement en PENDING
- **Message systeme** : Un message "Demande de booking modifiee par [Venue]" est cree dans la conversation existante
- **Encart booking dans conversation** : Affichage du statut, duree et budget de la demande directement dans la page Messages avec lien vers l'edition

#### Systeme de Messages Non-Lus
- **Endpoint batch PUT /messages/read-all** : Marque tous les messages non-lus d'une conversation en une seule requete
- **Marquage automatique** : Les messages sont automatiquement marques comme lus quand l'utilisateur ouvre une conversation
- **Badge messages non-lus** : Le compteur dans la sidebar se met a jour en temps reel (polling 10s)
- **Hook useMarkAllAsRead** : Appele dans MessageThread au mount et quand de nouveaux messages arrivent

#### Landing Page
- **Navbar sticky** : Barre de navigation fixe en haut de la landing page avec fond transparent + backdrop-blur
- **CTAs Connexion/Inscription** : Boutons menant vers /login et /register

### 🔧 Ameliore

#### Backend
- **UpdateBookingRequestDto** : Nouveau DTO avec validation class-validator pour la mise a jour des demandes
- **Route ordering** : Endpoints correctement ordonnes dans les controllers NestJS pour eviter les conflits

#### Frontend
- **useBookingRequestStats** : Integre dans la sidebar venue pour afficher le badge de demandes en attente
- **Cache invalidation** : Invalidation complete des caches TanStack Query apres modifications (messages, conversations, booking requests)

---

## [0.5.0] - 2025-10-11

### 🚀 Ajouté

#### Système de Recherche Temps Réel
- **Recherche instantanée avec debouncing** : Les résultats de recherche s'affichent automatiquement pendant la frappe (300ms debounce)
- **Suggestions intelligentes** : Auto-complétion avec 700ms debounce pour une UX optimale
- **Synchronisation URL** : Les paramètres de recherche sont reflétés dans l'URL sans polluer l'historique du navigateur
- **BrowseGrid mis à jour en temps réel** : Les cartes d'artistes se rafraîchissent automatiquement sans rechargement de page

#### Système de Demandes de Réservation (Booking Requests)
- **Module complet de booking requests** : Venues peuvent envoyer des demandes de réservation aux artistes
- **BookingRequestModal** : Formulaire modal avec validation pour créer des demandes (date, type, durée, budget, message)
- **Statuts de demandes** : PENDING, VIEWED, ACCEPTED, DECLINED, CANCELLED, EXPIRED
- **API RESTful** : Endpoints CRUD complets pour gérer les demandes de réservation
- **Liste des demandes** : Composant BookingRequestList pour visualiser et gérer toutes les demandes

#### Système de Messagerie
- **Messages liés aux événements** : Chat contextuel pour chaque collaboration venue-artiste
- **API de messagerie** : Endpoints pour créer, récupérer et gérer les messages
- **MessagesPage** : Interface complète pour la gestion des conversations
- **Service de messagerie** : Module NestJS avec validation et sécurité

#### Système de Notifications
- **Notifications automatiques** : Alertes pour booking requests reçues/acceptées/déclinées
- **Types de notifications** : BOOKING_REQUEST_RECEIVED, BOOKING_REQUEST_ACCEPTED, BOOKING_REQUEST_DECLINED, NEW_MESSAGE, BOOKING_REMINDER
- **Event-driven architecture** : Utilisation de @nestjs/event-emitter pour notifications en temps réel
- **API de notifications** : Endpoints pour récupérer et marquer les notifications comme lues

#### Métriques Artistes
- **Nouvelle table artist_metrics** : Suivi des performances et analytics des artistes
- **Métriques suivies** : Vues de profil, clics dans recherche, demandes de venues
- **Agrégation mensuelle** : Statistiques du mois en cours vs mois précédent

### 🔧 Amélioré

#### Backend
- **Migration Prisma idempotente** : Migrations sécurisées avec IF NOT EXISTS et gestion d'erreurs
- **Enum BookingStatus synchronisé** : Alignement complet entre Prisma et PostgreSQL
- **Enum SubscriptionType** : Gestion propre des plans FREE, BASIC, PREMIUM
- **Gestion des événements** : Support complet des champs endDate, location, address, notes, tags

#### Frontend
- **useAdvancedSearch.ts optimisé** : Synchronisation bidirectionnelle prop→state réactive
- **SearchBar.tsx amélioré** : Ajout du prop onChange pour mise à jour en temps réel
- **Browse.tsx refactorisé** : Gestion d'état optimisée avec sync URL sans boucles infinies
- **BookingForm.tsx** : Formulaire complet avec validation Zod et gestion de tous les champs
- **BookingsPageUnified.tsx** : Page unifiée pour demandes + bookings + calendrier

### 🐛 Corrigé
- **Erreurs TypeScript build** : Résolution des conflits de types dans BookingForm et BookingsPageUnified
- **Recherche non réactive** : Le bouton "Rechercher" déclenche maintenant correctement les requêtes API
- **Props non synchronisés** : useAdvancedSearch réagit maintenant aux changements de initialQuery
- **Assertions de type** : Utilisation cohérente de `as any` pour résoudre les conflits d'enums

### 🗄️ Base de Données

#### Nouvelles Tables
- **booking_requests** : Demandes de réservation avec statuts et métadonnées
- **notifications** : Système de notifications avec types et statuts de lecture
- **artist_metrics** : Métriques et analytics des profils artistes

#### Nouveaux Enums
- **BookingRequestStatus** : PENDING, VIEWED, ACCEPTED, DECLINED, CANCELLED, EXPIRED
- **NotificationType** : BOOKING_REQUEST_RECEIVED, BOOKING_REQUEST_ACCEPTED, BOOKING_REQUEST_DECLINED, NEW_MESSAGE, BOOKING_REMINDER
- **SubscriptionType** : FREE, BASIC, PREMIUM

#### Champs Ajoutés
- **events.endDate** : Date de fin d'événement
- **events.location** : Nom du lieu
- **events.address** : Adresse complète
- **events.notes** : Notes privées
- **events.tags** : Tags pour catégorisation
- **events.artistId** : Maintenant NOT NULL avec gestion migration

### 📦 Dépendances
- **@nestjs/event-emitter** : Ajout pour système de notifications événementielles

### 🧪 Tests

#### Tests E2E Cypress Ajoutés
- **realtime-search.feature** : 9 scénarios de test pour recherche temps réel
  - Suggestions avec debounce 700ms
  - Résultats automatiques avec debounce 300ms
  - Bouton recherche pour submit immédiat
  - Touche Enter pour recherche forcée
  - Bouton clear pour reset
  - Suggestions disparaissent au blur
  - Préservation des filtres pendant recherche en direct
  - Debouncing correct avec frappes rapides
  - Indicateur de chargement

### 📝 Documentation
- **MVP_MESSAGING_BOOKING_SPECS.md** : Spécifications complètes du système de messagerie et booking
- **MESSAGING_BOOKING_REQUEST_IMPLEMENTATION.md** : Guide d'implémentation détaillé
- **MIGRATION_UPLOAD_IMAGES.md** : Documentation migration système d'upload

### 🚢 Déploiement
- **Backend** : Déployé sur production avec 3 migrations Prisma appliquées
- **Frontend** : Déployé sur Netlify avec build réussi
- **Base de données** : Migrations appliquées sans perte de données

---

## [0.4.0] - 2025-10-05

### 🚀 Fonctionnalités Sprint 4 (Search & Discovery)

#### Recherche Avancée Complétée
- **Moteur de recherche full-text** : Indexation PostgreSQL avec tsvector et GIN indexes
- **Tolérance aux fautes de frappe** : Distance Levenshtein pour suggestions intelligentes
- **Priorisation intelligente** : Noms d'artistes prioritaires dans les résultats
- **Normalisation des accents** : Recherche efficace avec ou sans accents
- **14/16 tests E2E réussis** : Couverture de test à 87.5%

#### Système de Filtres Intelligent
- **Filtres combinables** : Genre, localisation, instruments, expérience, tarifs
- **Multi-sélection** : Plusieurs valeurs par catégorie de filtre
- **Range slider** : Sélection de fourchettes de prix
- **Filtre disponibilité** : "Disponible maintenant" pour profils actifs
- **Persistance URL** : État des filtres sauvegardé dans l'URL
- **Reset granulaire** : Suppression individuelle ou globale des filtres

#### Features Artiste
- **Copy bio** : Copie rapide de la bio dans le presse-papier
- **Download portfolio** : Téléchargement des images de portfolio
- **Pages publiques SEO** : Profils artistes accessibles via `/artist/:slug`
- **Portfolio preview** : Galerie d'images dans les cartes de recherche

### 🎨 UI/UX
- **Design system DaisyUI** : Composants cohérents et accessibles
- **Animations Framer Motion** : Transitions fluides et professionnelles
- **Responsive mobile** : Design adaptatif sur tous les écrans
- **États de chargement** : Indicateurs visuels partout
- **Gestion d'erreurs** : Messages clairs et récupération gracieuse

### 📊 Performance
- **Lazy loading** : Chargement à la demande des images
- **Debouncing** : Optimisation des requêtes de recherche
- **Caching TanStack Query** : Réduction des appels API
- **Optimisation bundle** : Build Vite optimisé

---

## [0.3.0] - Sprint 3 (Communication & Booking)

### ✅ Complété
- Système de messagerie temps réel
- Flux de booking requests
- Notifications push
- Calendrier événements
- Dashboard artiste et venue

---

## [0.2.0] - Sprint 2 (Profiles & Browse)

### ✅ Complété
- Formulaires profil artiste complets
- Upload photos et vidéos (base64)
- Liens réseaux sociaux
- Profils venue
- Page browse avec filtres basiques

---

## [0.1.0] - Sprint 1 (Foundation)

### ✅ Complété
- Architecture NestJS + React + PostgreSQL
- Authentification JWT
- Gestion des rôles (ARTIST, VENUE, MEMBER, ADMIN)
- Schéma Prisma complet
- Dashboards de base

---

## Légende

- 🚀 **Ajouté** : Nouvelles fonctionnalités
- 🔧 **Amélioré** : Améliorations de fonctionnalités existantes
- 🐛 **Corrigé** : Corrections de bugs
- 🗄️ **Base de Données** : Modifications de schéma
- 📦 **Dépendances** : Ajouts/mises à jour de packages
- 🧪 **Tests** : Ajouts/modifications de tests
- 📝 **Documentation** : Changements de documentation
- 🚢 **Déploiement** : Informations de déploiement

---

## Prochaines Étapes (Roadmap)

### Phase actuelle : Corrections critiques + Stripe (priorité absolue)

#### 🔴 Bugs critiques à corriger
- [ ] **DashboardRedirect** : Route `/` redirige toujours vers artiste peu importe le rôle
- [ ] **ArtistDashboard** : "Messages non lus" hardcodé à 0, quick actions = console.log(), activités mockées, charts mockés
- [ ] **Route /calendar** : ComingSoon — composants CalendarView existent mais pas branchés
- [ ] **UpgradePrompt** : Bouton CTA Premium sans handler Stripe

#### 🟡 À finir avant beta
- [ ] Câbler iCal export dans l'UI (backend OK, pas de bouton)
- [ ] Sécuriser endpoints admin validation-lead (TODO: ADMIN guard)
- [ ] Formulaire profil venue (modèle DB existant, pas de form)
- [ ] Brancher vraies données dans dashboard artiste

#### Phase 5: Stripe + Premium (2 semaines)
- [ ] Intégration paiements Stripe (webhook, subscription, mise à jour user.plan)
- [ ] Système de comptes premium/gratuit (UI prête, paiement manquant)
- [ ] Analytics artistes (route ComingSoon)
- [ ] Dashboard analytics venues

#### Features Futures (Phase 6+)
- [ ] Admin panel (rôle ADMIN en DB sans UI)
- [ ] Password change (Settings = suppression compte uniquement)
- [ ] Browse Artists/Venues (routes ComingSoon)
- [ ] Venue Events/Team (routes ComingSoon)
- [ ] Drag & drop calendrier
- [ ] Système de favoris
- [ ] Recommandations intelligentes
- [ ] Système de vérification artistes
- [ ] Feedback et ratings communautaires
