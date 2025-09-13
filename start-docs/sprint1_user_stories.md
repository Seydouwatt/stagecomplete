# SPRINT 1 - USER STORIES & ISSUES

## _Foundation & Authentication (Jours 1-7)_

---

## 🏗️ **EPIC 1: PROJECT SETUP**

### **US-001: Setup Backend Infrastructure**

**En tant que** développeur  
**Je veux** configurer l'infrastructure backend  
**Afin de** avoir une base solide pour développer l'API

**Critères d'acceptation :**

- [x] Projet NestJS créé avec TypeScript
- [x] Prisma ORM configuré avec PostgreSQL
- [x] Variables d'environnement (.env) setup
- [x] Base de données connectée et accessible
- [x] Premier modèle User créé et migré
- [x] API accessible sur http://localhost:3000
- [x] Documentation Swagger basique générée

**Issues techniques :**

- [x] **SETUP-001**: Initialiser projet NestJS + dépendances
- [x] **SETUP-002**: Configurer Prisma + PostgreSQL local/cloud
- [x] **SETUP-003**: Créer modèles Prisma initiaux
- [x] **SETUP-004**: Setup variables d'environnement
- [ ] **SETUP-005**: Premier deploy staging Render

---

### **US-002: Setup Frontend Infrastructure**

**En tant que** développeur  
**Je veux** configurer l'infrastructure frontend  
**Afin de** avoir une base moderne et maintenable

**Critères d'acceptation :**

- [x] Projet React + Vite + TypeScript créé
- [x] TailwindCSS + DaisyUI configurés
- [x] Routing React Router v6 setup
- [x] Store Zustand + persistence configuré
- [x] Build et dev server fonctionnels
- [x] App accessible sur http://localhost:5173
- [x] Design system DaisyUI opérationnel

**Issues techniques :**

- [x] **SETUP-006**: Initialiser React + Vite + TypeScript
- [x] **SETUP-007**: Configurer TailwindCSS + DaisyUI
- [x] **SETUP-008**: Setup React Router + layouts
- [x] **SETUP-009**: Configurer Zustand store structure
- [x] **SETUP-010**: Setup utils et services API

---

## 🔐 **EPIC 2: USER AUTHENTICATION**

### **US-003: User Registration**

**En tant qu'** utilisateur non connecté  
**Je veux** créer un compte  
**Afin de** accéder à la plateforme selon mon rôle

**Critères d'acceptation :**

- [x] Page d'inscription accessible via /register
- [x] Formulaire avec email, password, nom, rôle (ARTIST/VENUE)
- [x] Validation côté client (email valide, mot de passe 6+ caractères)
- [x] Validation côté serveur identique
- [x] Email unique enforced en base
- [x] Mot de passe hashé avec bcrypt
- [x] Profil par défaut créé automatiquement
- [x] Token JWT retourné après inscription
- [x] Redirection vers dashboard selon rôle
- [x] Messages d'erreur clairs (email existe, validation failed)

**Issues techniques :**

- [x] **AUTH-001**: Créer DTO RegisterDto avec validation
- [x] **AUTH-002**: Implémenter endpoint POST /auth/register
- [x] **AUTH-003**: Hash password avec bcrypt
- [x] **AUTH-004**: Générer JWT token après création
- [x] **AUTH-005**: Créer page Register React avec validation
- [x] **AUTH-006**: Intégrer formulaire avec API
- [x] **AUTH-007**: Gérer états loading/error/success

---

### **US-004: User Login**

**En tant qu'** utilisateur avec compte  
**Je veux** me connecter  
**Afin d'** accéder à mon espace personnalisé

**Critères d'acceptation :**

- [x] Page de connexion accessible via /login
- [x] Formulaire avec email et password
- [x] Validation côté client (email valide, champs requis)
- [x] Authentification sécurisée côté serveur
- [x] JWT token retourné si credentials valides
- [x] Session sauvegardée localement (localStorage)
- [x] Redirection vers dashboard après connexion
- [x] Message d'erreur si credentials invalides
- [x] Bouton "show/hide password"
- [x] Link vers page Register

**Issues techniques :**

- [x] **AUTH-008**: Créer DTO LoginDto avec validation
- [x] **AUTH-009**: Implémenter endpoint POST /auth/login
- [x] **AUTH-010**: Vérifier password avec bcrypt.compare
- [x] **AUTH-011**: Retourner JWT + user data
- [x] **AUTH-012**: Créer page Login React
- [x] **AUTH-013**: Intégrer avec Zustand store
- [x] **AUTH-014**: Persistance session avec zustand/persist

---

### **US-005: JWT Authentication Middleware**

**En tant que** développeur  
**Je veux** protéger les routes API  
**Afin de** sécuriser l'accès aux données

**Critères d'acceptation :**

- [x] JWT strategy Passport configurée
- [x] Middleware @UseGuards(JwtAuthGuard) fonctionnel
- [x] Routes protégées retournent 401 si pas de token
- [x] User context accessible dans controllers (@GetUser())
- [x] Token validation et parsing automatiques
- [x] Gestion erreurs token expiré/invalide
- [ ] Documentation endpoints protégés

**Issues techniques :**

- [x] **AUTH-015**: Configurer Passport JWT strategy
- [x] **AUTH-016**: Créer JwtAuthGuard
- [x] **AUTH-017**: Implémenter décorateur @GetUser()
- [x] **AUTH-018**: Tester protection routes
- [x] **AUTH-019**: Gérer erreurs JWT (expired, invalid)

---

### **US-006: Session Management Frontend**

**En tant qu'** utilisateur connecté  
**Je veux** que ma session persiste  
**Afin de** ne pas me reconnecter à chaque visite

**Critères d'acceptation :**

- [x] Session sauvegardée automatiquement
- [x] App charge session au démarrage
- [x] Token attaché automatiquement aux requêtes API
- [x] Refresh page ne déconnecte pas l'utilisateur
- [x] Logout efface complètement la session
- [x] Gestion token expiré avec redirection login
- [x] Loading state pendant vérification session

**Issues techniques :**

- [x] **AUTH-020**: Configurer zustand persist middleware
- [x] **AUTH-021**: Créer axios interceptor pour token
- [x] **AUTH-022**: Implémenter auto-refresh token logic
- [x] **AUTH-023**: Gérer déconnexion automatique si token expiré
- [x] **AUTH-024**: Loading screen initialisation app

---

## 🎨 **EPIC 3: USER INTERFACE FOUNDATION**

### **US-007: Main Layout & Navigation**

**En tant qu'** utilisateur connecté  
**Je veux** naviguer facilement dans l'app  
**Afin d'** accéder aux différentes fonctionnalités

**Critères d'acceptation :**

- [x] Header fixe avec logo StageComplete
- [x] Navigation différente selon rôle (ARTIST/VENUE)
- [x] Menu utilisateur avec photo/initiales + dropdown
- [x] Sidebar avec navigation principale
- [x] Footer basique avec liens
- [x] Responsive design mobile/desktop
- [x] Thème cohérent DaisyUI
- [x] Logout fonctionnel depuis header

**Issues techniques :**

- [x] **UI-001**: Créer composant Header avec logo
- [x] **UI-002**: Implémenter user dropdown menu
- [x] **UI-003**: Créer Sidebar avec navigation rôle-based
- [x] **UI-004**: Layout responsive avec Tailwind
- [x] **UI-005**: Intégrer logout dans header

---

### **US-008: Dashboard Landing Pages**

**En tant qu'** utilisateur connecté  
**Je veux** voir un dashboard adapté à mon rôle  
**Afin d'** avoir une vue d'ensemble de mon activité

**Critères d'acceptation :**

- [x] Dashboard artiste avec statistiques basiques
- [x] Dashboard venue avec overview
- [x] Redirection automatique selon rôle après login
- [x] Sections placeholder pour futures features
- [x] Cards avec informations profil
- [x] Quick actions selon le rôle
- [x] Design cohérent et professionnel

**Issues techniques :**

- [x] **UI-006**: Créer page Dashboard Artist
- [x] **UI-007**: Créer page Dashboard Venue
- [x] **UI-008**: Implémenter redirection role-based
- [x] **UI-009**: Cards overview avec placeholder data
- [x] **UI-010**: Quick actions buttons (profile, browse, etc)

---

### **US-009: Basic Profile Display**

**En tant qu'** utilisateur connecté  
**Je veux** voir mes informations de profil  
**Afin de** vérifier mes données actuelles

**Critères d'acceptation :**

- [x] Page profil accessible depuis navigation
- [x] Affichage nom, email, rôle
- [x] Placeholder pour photo de profil
- [x] Informations de base (bio, localisation si existantes)
- [x] Message si profil incomplet
- [x] Design card cohérent avec theme

**Issues techniques :**

- [x] **UI-011**: Créer page Profile basique
- [x] **UI-012**: Composant ProfileCard
- [x] **UI-013**: Gestion affichage données manquantes
- [x] **UI-014**: Placeholder avatar par défaut

---

- Connexion avec : testartist@example.com / Password123
- Ou : testvenue@example.com / Password123

## 🔄 **EPIC 4: API FOUNDATION**

### **US-010: User Profile API**

**En tant que** frontend developer  
**Je veux** des endpoints pour gérer les profils  
**Afin d'** afficher et modifier les données utilisateur

**Critères d'acceptation :**

- [x] GET /auth/me retourne user + profile complet
- [x] PUT /auth/profile permet mise à jour profil
- [x] Validation des données côté serveur
- [x] Gestion erreurs 400/401/404
- [x] Response format consistant
- [ ] Documentation Swagger endpoints

**Issues techniques :**

- [x] **API-001**: Endpoint GET /auth/me
- [x] **API-002**: Endpoint PUT /auth/profile
- [x] **API-003**: DTO UpdateProfileDto avec validation
- [x] **API-004**: Service ProfileService pour logique métier
- [ ] **API-005**: Tests unitaires controllers

---

### **US-011: Error Handling & Validation**

**En tant qu'** utilisateur  
**Je veux** des messages d'erreur clairs  
**Afin de** comprendre ce qui ne va pas

**Critères d'acceptation :**

- [x] Messages d'erreur en français et explicites
- [x] Validation côté client avec feedback visuel
- [x] Validation côté serveur avec messages détaillés
- [x] Gestion erreurs réseau (500, timeout)
- [x] Loading states pendant requêtes
- [x] Toast notifications pour succès/erreurs

**Issues techniques :**

- [x] **ERROR-001**: Global exception filter NestJS
- [x] **ERROR-002**: Messages erreur personnalisés
- [x] **ERROR-003**: Validation pipe globale
- [x] **ERROR-004**: Toast notification system React
- [x] **ERROR-005**: Loading states components

---

## 🧪 **EPIC 5: TESTING & DEPLOYMENT**

### **US-012: Local Development Setup**

**En tant que** développeur  
**Je veux** un environnement de dev stable  
**Afin de** développer efficacement

**Critères d'acceptation :**

- [ ] Base de données locale setup
- [ ] Hot reload fonctionnel front et back
- [ ] Variables d'environnement bien configurées
- [ ] Scripts npm/yarn pour common tasks
- [ ] Documentation README complète
- [ ] Seed data pour tests locaux

**Issues techniques :**

- [ ] **DEV-001**: Docker compose pour PostgreSQL local
- [ ] **DEV-002**: Scripts package.json optimisés
- [ ] **DEV-003**: Seed script pour données test
- [ ] **DEV-004**: README avec instructions setup
- [ ] **DEV-005**: VS Code config recommandée

---

### **US-013: Staging Deployment**

**En tant que** développeur  
**Je veux** déployer sur staging  
**Afin de** tester en conditions réelles

**Critères d'acceptation :**

- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Vercel/Netlify
- [ ] Base de données cloud configurée
- [ ] Variables d'environnement production
- [ ] HTTPS fonctionnel
- [ ] Monitoring basique erreurs

**Issues techniques :**

- [ ] **DEPLOY-001**: Config Render pour backend
- [ ] **DEPLOY-002**: Config Vercel pour frontend
- [ ] **DEPLOY-003**: PostgreSQL cloud (Supabase/Railway)
- [ ] **DEPLOY-004**: Environment variables production
- [ ] **DEPLOY-005**: Setup monitoring (Sentry)

---

## ✅ **DEFINITION OF DONE - SPRINT 1**

### **Critères globaux :**

- [ ] **Fonctionnel**: Auth flow complet register → login → dashboard
- [ ] **Technique**: Code review passé, pas de debt majeure
- [ ] **Qualité**: Responsive design, gestion erreurs
- [ ] **Déployé**: Staging accessible et fonctionnel
- [ ] **Documenté**: README à jour, API doc basique
- [ ] **Testé**: Happy path testé end-to-end

### **User Acceptance Testing :**

- [ ] Un nouvel utilisateur peut créer un compte artiste
- [ ] Un nouvel utilisateur peut créer un compte venue
- [ ] Un utilisateur peut se connecter avec ses credentials
- [ ] La session persiste après refresh page
- [ ] L'interface s'adapte au mobile
- [ ] Les erreurs sont affichées clairement
- [ ] Le logout fonctionne correctement

---

## 📊 **ESTIMATION & PRIORITÉS**

### **MUST HAVE (Critique) :**

- US-001, US-002: Setup projects (8h)
- US-003, US-004: Auth register/login (12h)
- US-005, US-006: JWT security (8h)
- US-007, US-008: Basic UI layout (10h)

### **SHOULD HAVE (Important) :**

- US-009: Profile display (4h)
- US-010: Profile API (6h)
- US-011: Error handling (6h)

### **COULD HAVE (Nice to have) :**

- US-012: Dev environment (4h)
- US-013: Staging deployment (6h)

### **TOTAL ESTIMATION: ~64h = 8 jours** _(avec votre expérience, réalisable en 7 jours)_

---

## 🎯 **DAILY BREAKDOWN**

**Jour 1-2**: Setup + Auth backend
**Jour 3-4**: Auth frontend + JWT
**Jour 5-6**: UI layouts + Profile
**Jour 7**: Polish + Deploy

**READY TO START CODING! 🚀**
