# SPRINT 2 - USER STORIES & ISSUES

## _Artist Profiles & Discovery (Jours 8-14)_

---

## 🎭 **EPIC 7: ARTIST PROFILE MANAGEMENT**

### **US-017: Extended Artist Profile Creation**

**En tant qu'** artiste connecté  
**Je veux** compléter mon profil artistique détaillé  
**Afin de** créer ma vitrine professionnelle

**Critères d'acceptation :**

- [ ] Page "Mon Profil Artiste" accessible depuis dashboard
- [ ] Formulaire étendu avec sections : Info générale, Artistique, Portfolio, Contact
- [ ] Champs spécifiques : genres musicaux, instruments, années d'expérience
- [ ] Section tarifs (fourchette de prix, conditions)
- [ ] Section équipements (matériel possédé/requis)
- [ ] Bio artistique rich text avec formatage
- [ ] Upload avatar + photos portfolio
- [ ] Liens sociaux et plateformes (Spotify, YouTube, SoundCloud)
- [ ] Prévisualisation de la fiche publique
- [ ] Validation côté client et serveur
- [ ] Sauvegarde progressive (draft)

**Issues techniques :**

- [ ] **ARTIST-001**: Extend Artist model avec nouveaux champs
- [ ] **ARTIST-002**: API endpoints CRUD profil artiste étendu
- [ ] **ARTIST-003**: Upload avatar + portfolio images
- [ ] **ARTIST-004**: Page formulaire profil artiste React
- [ ] **ARTIST-005**: Validation DTOs profil étendu
- [ ] **ARTIST-006**: Rich text editor pour bio
- [ ] **ARTIST-007**: Système de sauvegarde progressive

---

### **US-018: Public Artist Profile & Shareable Link**

**En tant qu'** artiste  
**Je veux** avoir une fiche publique avec lien partageable  
**Afin de** promouvoir mon profil auprès des venues

**Critères d'acceptation :**

- [ ] URL publique type `/artist/nom-artiste` ou `/p/artist-id`
- [ ] Fiche publique responsive et professionnelle
- [ ] Affichage complet : photos, bio, genres, expérience, tarifs
- [ ] Gallery portfolio (photos, vidéos si applicable)
- [ ] Liens vers plateformes musicales
- [ ] Contact direct via formulaire ou bouton WhatsApp/email
- [ ] SEO optimisé (meta tags, OpenGraph)
- [ ] Option public/privé (profil visible ou non)
- [ ] Statistiques de vues (pour l'artiste)
- [ ] Partage réseaux sociaux intégré

**Issues techniques :**

- [ ] **PUBLIC-001**: Route publique `/artist/:slug` 
- [ ] **PUBLIC-002**: Composant PublicArtistProfile
- [ ] **PUBLIC-003**: SEO meta tags et OpenGraph
- [ ] **PUBLIC-004**: Système de slug/URL personnalisée
- [ ] **PUBLIC-005**: Gallery photos/portfolio
- [ ] **PUBLIC-006**: Formulaire de contact public
- [ ] **PUBLIC-007**: Statistiques de vues (optionnel)

---

### **US-019: Artist Dashboard Management**

**En tant qu'** artiste connecté  
**Je veux** gérer mon profil depuis mon dashboard  
**Afin d'** avoir un accès facile à mes outils

**Critères d'acceptation :**

- [ ] Section "Mon Profil" dans le dashboard artiste
- [ ] Quick stats : vues profil, contacts reçus, complétion profil
- [ ] Boutons rapides : éditer profil, voir fiche publique, partager lien
- [ ] Preview card de la fiche publique
- [ ] Indicateur de complétion du profil (%)
- [ ] Notifications pour profil incomplet
- [ ] Accès direct aux analytics de base

**Issues techniques :**

- [ ] **DASH-001**: Mise à jour ArtistDashboard avec profil section
- [ ] **DASH-002**: Composant ProfileCompletionCard
- [ ] **DASH-003**: Quick actions profil artiste
- [ ] **DASH-004**: Stats basiques profil
- [ ] **DASH-005**: Notifications profil incomplet

---

## 🔍 **EPIC 8: VENUE SEARCH & DISCOVERY**

### **US-020: Artist Search for Venues**

**En tant que** venue connectée  
**Je veux** rechercher des artistes selon mes critères  
**Afin de** trouver des talents pour mes événements

**Critères d'acceptation :**

- [ ] Page "Rechercher Artistes" accessible depuis dashboard venue
- [ ] Filtres de recherche : genre musical, localisation, tarifs
- [ ] Filtres avancés : expérience, instruments, disponibilité
- [ ] Résultats en grille avec cards artistes
- [ ] Preview profil au hover + clic pour fiche complète
- [ ] Tri par : pertinence, distance, tarifs, popularité
- [ ] Pagination ou scroll infini
- [ ] Sauvegarde des recherches favorites
- [ ] Export liste d'artistes (CSV/PDF)
- [ ] Contact direct depuis les résultats

**Issues techniques :**

- [ ] **SEARCH-001**: API endpoint search artistes avec filtres
- [ ] **SEARCH-002**: Page SearchArtists pour venues
- [ ] **SEARCH-003**: Composant FilterPanel avancé
- [ ] **SEARCH-004**: Composant ArtistCard résultats
- [ ] **SEARCH-005**: Système de tri et pagination
- [ ] **SEARCH-006**: Intégration géolocalisation/distance
- [ ] **SEARCH-007**: Système de favoris/bookmarks

---

### **US-021: Advanced Search Filters**

**En tant que** venue  
**Je veux** des filtres de recherche précis  
**Afin de** trouver exactement le type d'artiste recherché

**Critères d'acceptation :**

- [ ] Filtre par genres musicaux (multiple)
- [ ] Filtre par localisation (ville + rayon km)
- [ ] Filtre par fourchette de tarifs
- [ ] Filtre par expérience (débutant, intermédiaire, pro)
- [ ] Filtre par instruments/type de performance
- [ ] Filtre par disponibilité (dates spécifiques)
- [ ] Filtre par équipements possédés
- [ ] Sauvegarde et réutilisation des filtres
- [ ] Reset rapide des filtres
- [ ] Nombre de résultats en temps réel

**Issues techniques :**

- [ ] **FILTER-001**: Composant MultiSelectFilter pour genres
- [ ] **FILTER-002**: Géolocalisation avec rayon de recherche
- [ ] **FILTER-003**: Range slider pour tarifs
- [ ] **FILTER-004**: Filtres expérience et équipements
- [ ] **FILTER-005**: Date picker pour disponibilités
- [ ] **FILTER-006**: Sauvegarde filtres dans localStorage
- [ ] **FILTER-007**: Query builder backend pour filtres combinés

---

## 📊 **EPIC 9: DATA INTEGRATION & REAL CONNECTIONS**

### **US-022: Frontend-Backend Integration**

**En tant que** développeur  
**Je veux** connecter le frontend aux vraies données de l'API  
**Afin d'** avoir une application fonctionnelle avec données réelles

**Critères d'acceptation :**

- [ ] Frontend connecté à l'API Render (prod)
- [ ] Gestion des états de chargement pour toutes les requêtes
- [ ] Gestion d'erreurs réseau et API complète
- [ ] Cache des données avec React Query/SWR
- [ ] Optimistic updates pour les actions utilisateur
- [ ] Retry automatique en cas d'échec réseau
- [ ] Environnements dev/staging/prod configurés

**Issues techniques :**

- [ ] **INTEGRATION-001**: Configuration API client pour production
- [ ] **INTEGRATION-002**: Setup React Query pour cache
- [ ] **INTEGRATION-003**: Services API pour profils artistes
- [ ] **INTEGRATION-004**: Gestion erreurs globale frontend
- [ ] **INTEGRATION-005**: Optimistic updates et retry logic
- [ ] **INTEGRATION-006**: Variables d'environnement frontend

---

### **US-023: Artist Portfolio Media Management**

**En tant qu'** artiste  
**Je veux** gérer mes médias (photos, audios, vidéos)  
**Afin d'** enrichir ma fiche publique

**Critères d'acceptation :**

- [ ] Upload multiple de photos portfolio
- [ ] Support formats : JPG, PNG, WebP (optimisation auto)
- [ ] Upload audio : MP3, WAV avec player intégré
- [ ] Liens externes : YouTube, SoundCloud, Spotify
- [ ] Gestion ordre d'affichage (drag & drop)
- [ ] Compression et redimensionnement automatique
- [ ] Stockage cloud (Cloudinary/AWS S3)
- [ ] Preview avant publication
- [ ] Suppression/modification médias
- [ ] Limites de stockage et alertes

**Issues techniques :**

- [ ] **MEDIA-001**: Service upload fichiers (backend)
- [ ] **MEDIA-002**: Intégration Cloudinary ou AWS S3
- [ ] **MEDIA-003**: Composant UploadMedia React
- [ ] **MEDIA-004**: Player audio intégré
- [ ] **MEDIA-005**: Drag & drop pour réordonner
- [ ] **MEDIA-006**: Compression et optimisation images
- [ ] **MEDIA-007**: Gestion limites et quotas

---

## 🌐 **EPIC 10: DEPLOYMENT & PRODUCTION READINESS**

### **US-024: Frontend Deployment**

**En tant qu'** utilisateur  
**Je veux** accéder à l'application complète en ligne  
**Afin d'** utiliser StageComplete sans contraintes

**Critères d'acceptation :**

- [ ] Frontend déployé sur Vercel/Netlify
- [ ] Variables d'environnement production configurées
- [ ] HTTPS et certificats SSL fonctionnels
- [ ] Connexion frontend ↔ backend API sécurisée
- [ ] Performance optimisée (Lighthouse 90+)
- [ ] Cache et CDN configurés
- [ ] URLs propres et SEO friendly
- [ ] Erreurs 404 customisées

**Issues techniques :**

- [ ] **DEPLOY-006**: Déploiement Vercel avec CI/CD
- [ ] **DEPLOY-007**: Configuration variables environnement
- [ ] **DEPLOY-008**: Optimisation bundle et performance
- [ ] **DEPLOY-009**: Setup domaine et SSL
- [ ] **DEPLOY-010**: Cache stratégie et CDN
- [ ] **DEPLOY-011**: SEO et meta tags
- [ ] **DEPLOY-012**: Error pages et monitoring

---

### **US-025: Data Seeding & Demo Content**

**En tant que** développeur/testeur  
**Je veux** des données de démonstration réalistes  
**Afin de** tester et présenter l'application

**Critères d'acceptation :**

- [ ] Script de seed avec 20+ artistes fictifs mais réalistes
- [ ] 5+ venues avec profils complets
- [ ] Données variées : genres, localisations, tarifs, expériences
- [ ] Images de profil et portfolio (royalty-free)
- [ ] Comptes de test documentés pour démo
- [ ] Reset/reseed facile pour développement
- [ ] Données conformes RGPD (fictives)

**Issues techniques :**

- [ ] **SEED-001**: Script seed artistes avec données réalistes
- [ ] **SEED-002**: Script seed venues complètes
- [ ] **SEED-003**: Images de stock pour profils
- [ ] **SEED-004**: Command ligne pour seed/reset
- [ ] **SEED-005**: Documentation comptes de test
- [ ] **SEED-006**: Faker.js pour données cohérentes

---

## ✅ **DEFINITION OF DONE - SPRINT 2**

### **Critères globaux :**

- [ ] **Fonctionnel**: Artiste peut créer profil complet → fiche publique accessible → venue peut rechercher et trouver
- [ ] **Technique**: Frontend connecté aux vraies données API en production
- [ ] **Qualité**: UX fluide, gestion erreurs, performance optimisée
- [ ] **Déployé**: Application complète accessible en ligne (front + back)
- [ ] **Testé**: Scénarios complets testés avec données réelles
- [ ] **SEO**: Fiches publiques indexables et partageables

### **User Acceptance Testing :**

- [ ] Un artiste peut créer et compléter son profil artistique
- [ ] Un artiste peut générer et partager sa fiche publique
- [ ] Une venue peut rechercher des artistes par critères
- [ ] Une venue peut voir les fiches publiques des artistes
- [ ] Les données sont persistantes et synchronisées
- [ ] L'application fonctionne entièrement en ligne
- [ ] Les fiches publiques sont partageables sur réseaux sociaux

---

## 📊 **ESTIMATION & PRIORITÉS**

### **MUST HAVE (Critique) :**

- US-017: Extended Artist Profile (12h)
- US-018: Public Artist Profile (10h)
- US-020: Artist Search for Venues (8h)
- US-022: Frontend-Backend Integration (6h)

### **SHOULD HAVE (Important) :**

- US-019: Artist Dashboard Management (6h)
- US-021: Advanced Search Filters (8h)
- US-024: Frontend Deployment (4h)

### **COULD HAVE (Nice to have) :**

- US-023: Portfolio Media Management (10h)
- US-025: Data Seeding (4h)

### **TOTAL ESTIMATION: ~68h = 8-9 jours** _(réalisable en 7 jours avec focus)_

---

## 🎯 **DAILY BREAKDOWN SPRINT 2**

**Jour 8-9**: Artist Profile Backend + Extended Models  
**Jour 10-11**: Artist Profile Frontend + Public Pages  
**Jour 12-13**: Venue Search + Integration Frontend-Backend  
**Jour 14**: Deployment + Polish + Testing  

**READY FOR SPRINT 2! 🎭🔍**

---

## 📝 **NOTES & QUESTIONS POUR VALIDATION**

1. **Upload de fichiers** : Préférence pour Cloudinary ou AWS S3 ?
2. **Géolocalisation** : API Google Maps ou solution open source ?
3. **Pricing model** : Tarifs fixes ou fourchettes ?
4. **URL publiques** : Slugs personnalisables ou IDs simples ?
5. **Portfolio audio** : Player basique ou intégration Spotify/SoundCloud ?

**En attente de validation avant de commencer le développement.**