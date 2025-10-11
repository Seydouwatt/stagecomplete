# Changelog - StageComplete

Toutes les modifications notables du projet seront documentées dans ce fichier.

Format basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

### Phase 5: Premium Features (En Planning)
- [ ] Système de comptes premium/gratuit
- [ ] Messagerie directe premium
- [ ] Analytics avancées venues
- [ ] Intégration paiements (Stripe)
- [ ] Dashboard analytics artistes

### Features Futures
- [ ] Système de favoris
- [ ] Comparaison d'artistes
- [ ] Recommandations intelligentes
- [ ] Système de vérification artistes
- [ ] Feedback et ratings communautaires
