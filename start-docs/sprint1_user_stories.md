# SPRINT 1 - USER STORIES & ISSUES
## *Foundation & Authentication (Jours 1-7)*

---

## 🏗️ **EPIC 1: PROJECT SETUP**

### **US-001: Setup Backend Infrastructure**
**En tant que** développeur  
**Je veux** configurer l'infrastructure backend  
**Afin de** avoir une base solide pour développer l'API

**Critères d'acceptation :**
- [ ] Projet NestJS créé avec TypeScript
- [ ] Prisma ORM configuré avec PostgreSQL
- [ ] Variables d'environnement (.env) setup
- [ ] Base de données connectée et accessible
- [ ] Premier modèle User créé et migré
- [ ] API accessible sur http://localhost:3000
- [ ] Documentation Swagger basique générée

**Issues techniques :**
- [ ] **SETUP-001**: Initialiser projet NestJS + dépendances
- [ ] **SETUP-002**: Configurer Prisma + PostgreSQL local/cloud
- [ ] **SETUP-003**: Créer modèles Prisma initiaux
- [ ] **SETUP-004**: Setup variables d'environnement
- [ ] **SETUP-005**: Premier deploy staging Render

---

### **US-002: Setup Frontend Infrastructure**
**En tant que** développeur  
**Je veux** configurer l'infrastructure frontend  
**Afin de** avoir une base moderne et maintenable

**Critères d'acceptation :**
- [ ] Projet React + Vite + TypeScript créé
- [ ] TailwindCSS + DaisyUI configurés
- [ ] Routing React Router v6 setup
- [ ] Store Zustand + persistence configuré
- [ ] Build et dev server fonctionnels
- [ ] App accessible sur http://localhost:5173
- [ ] Design system DaisyUI opérationnel

**Issues techniques :**
- [ ] **SETUP-006**: Initialiser React + Vite + TypeScript
- [ ] **SETUP-007**: Configurer TailwindCSS + DaisyUI
- [ ] **SETUP-008**: Setup React Router + layouts
- [ ] **SETUP-009**: Configurer Zustand store structure
- [ ] **SETUP-010**: Setup utils et services API

---

## 🔐 **EPIC 2: USER AUTHENTICATION**

### **US-003: User Registration**
**En tant qu'** utilisateur non connecté  
**Je veux** créer un compte  
**Afin de** accéder à la plateforme selon mon rôle

**Critères d'acceptation :**
- [ ] Page d'inscription accessible via /register
- [ ] Formulaire avec email, password, nom, rôle (ARTIST/VENUE)
- [ ] Validation côté client (email valide, mot de passe 6+ caractères)
- [ ] Validation côté serveur identique
- [ ] Email unique enforced en base
- [ ] Mot de passe hashé avec bcrypt
- [ ] Profil par défaut créé automatiquement
- [ ] Token JWT retourné après inscription
- [ ] Redirection vers dashboard selon rôle
- [ ] Messages d'erreur clairs (email existe, validation failed)

**Issues techniques :**
- [ ] **AUTH-001**: Créer DTO RegisterDto avec validation
- [ ] **AUTH-002**: Implémenter endpoint POST /auth/register
- [ ] **AUTH-003**: Hash password avec bcrypt
- [ ] **AUTH-004**: Générer JWT token après création
- [ ] **AUTH-005**: Créer page Register React avec validation
- [ ] **AUTH-006**: Intégrer formulaire avec API
- [ ] **AUTH-007**: Gérer états loading/error/success

---

### **US-004: User Login**
**En tant qu'** utilisateur avec compte  
**Je veux** me connecter  
**Afin d'** accéder à mon espace personnalisé

**Critères d'acceptation :**
- [ ] Page de connexion accessible via /login
- [ ] Formulaire avec email et password
- [ ] Validation côté client (email valide, champs requis)
- [ ] Authentification sécurisée côté serveur
- [ ] JWT token retourné si credentials valides
- [ ] Session sauvegardée localement (localStorage)
- [ ] Redirection vers dashboard après connexion
- [ ] Message d'erreur si credentials invalides
- [ ] Bouton "show/hide password"
- [ ] Link vers page Register

**Issues techniques :**
- [ ] **AUTH-008**: Créer DTO LoginDto avec validation
- [ ] **AUTH-009**: Implémenter endpoint POST /auth/login
- [ ] **AUTH-010**: Vérifier password avec bcrypt.compare
- [ ] **AUTH-011**: Retourner JWT + user data
- [ ] **AUTH-012**: Créer page Login React
- [ ] **AUTH-013**: Intégrer avec Zustand store
- [ ] **AUTH-014**: Persistance session avec zustand/persist

---

### **US-005: JWT Authentication Middleware**
**En tant que** développeur  
**Je veux** protéger les routes API  
**Afin de** sécuriser l'accès aux données

**Critères d'acceptation :**
- [ ] JWT strategy Passport configurée
- [ ] Middleware @UseGuards(JwtAuthGuard) fonctionnel
- [ ] Routes protégées retournent 401 si pas de token
- [ ] User context accessible dans controllers (@GetUser())
- [ ] Token validation et parsing automatiques
- [ ] Gestion erreurs token expiré/invalide
- [ ] Documentation endpoints protégés

**Issues techniques :**
- [ ] **AUTH-015**: Configurer Passport JWT strategy
- [ ] **AUTH-016**: Créer JwtAuthGuard
- [ ] **AUTH-017**: Implémenter décorateur @GetUser()
- [ ] **AUTH-018**: Tester protection routes
- [ ] **AUTH-019**: Gérer erreurs JWT (expired, invalid)

---

### **US-006: Session Management Frontend**
**En tant qu'** utilisateur connecté  
**Je veux** que ma session persiste  
**Afin de** ne pas me reconnecter à chaque visite

**Critères d'acceptation :**
- [ ] Session sauvegardée automatiquement
- [ ] App charge session au démarrage
- [ ] Token attaché automatiquement aux requêtes API
- [ ] Refresh page ne déconnecte pas l'utilisateur
- [ ] Logout efface complètement la session
- [ ] Gestion token expiré avec redirection login
- [ ] Loading state pendant vérification session

**Issues techniques :**
- [ ] **AUTH-020**: Configurer zustand persist middleware
- [ ] **AUTH-021**: Créer axios interceptor pour token
- [ ] **AUTH-022**: Implémenter auto-refresh token logic
- [ ] **AUTH-023**: Gérer déconnexion automatique si token expiré
- [ ] **AUTH-024**: Loading screen initialisation app

---

## 🎨 **EPIC 3: USER INTERFACE FOUNDATION**

### **US-007: Main Layout & Navigation**
**En tant qu'** utilisateur connecté  
**Je veux** naviguer facilement dans l'app  
**Afin d'** accéder aux différentes fonctionnalités

**Critères d'acceptation :**
- [ ] Header fixe avec logo StageComplete
- [ ] Navigation différente selon rôle (ARTIST/VENUE)
- [ ] Menu utilisateur avec photo/initiales + dropdown
- [ ] Sidebar avec navigation principale
- [ ] Footer basique avec liens
- [ ] Responsive design mobile/desktop
- [ ] Thème cohérent DaisyUI
- [ ] Logout fonctionnel depuis header

**Issues techniques :**
- [ ] **UI-001**: Créer composant Header avec logo
- [ ] **UI-002**: Implémenter user dropdown menu
- [ ] **UI-003**: Créer Sidebar avec navigation rôle-based
- [ ] **UI-004**: Layout responsive avec Tailwind
- [ ] **UI-005**: Intégrer logout dans header

---

### **US-008: Dashboard Landing Pages**
**En tant qu'** utilisateur connecté  
**Je veux** voir un dashboard adapté à mon rôle  
**Afin d'** avoir une vue d'ensemble de mon activité

**Critères d'acceptation :**
- [ ] Dashboard artiste avec statistiques basiques
- [ ] Dashboard venue avec overview
- [ ] Redirection automatique selon rôle après login
- [ ] Sections placeholder pour futures features
- [ ] Cards avec informations profil
- [ ] Quick actions selon le rôle
- [ ] Design cohérent et professionnel

**Issues techniques :**
- [ ] **UI-006**: Créer page Dashboard Artist
- [ ] **UI-007**: Créer page Dashboard Venue
- [ ] **UI-008**: Implémenter redirection role-based
- [ ] **UI-009**: Cards overview avec placeholder data
- [ ] **UI-010**: Quick actions buttons (profile, browse, etc)

---

### **US-009: Basic Profile Display**
**En tant qu'** utilisateur connecté  
**Je veux** voir mes informations de profil  
**Afin de** vérifier mes données actuelles

**Critères d'acceptation :**
- [ ] Page profil accessible depuis navigation
- [ ] Affichage nom, email, rôle
- [ ] Placeholder pour photo de profil
- [ ] Informations de base (bio, localisation si existantes)
- [ ] Message si profil incomplet
- [ ] Design card cohérent avec theme

**Issues techniques :**
- [ ] **UI-011**: Créer page Profile basique
- [ ] **UI-012**: Composant ProfileCard
- [ ] **UI-013**: Gestion affichage données manquantes
- [ ] **UI-014**: Placeholder avatar par défaut

---

## 🔄 **EPIC 4: API FOUNDATION**

### **US-010: User Profile API**
**En tant que** frontend developer  
**Je veux** des endpoints pour gérer les profils  
**Afin d'** afficher et modifier les données utilisateur

**Critères d'acceptation :**
- [ ] GET /auth/me retourne user + profile complet
- [ ] PUT /auth/profile permet mise à jour profil
- [ ] Validation des données côté serveur
- [ ] Gestion erreurs 400/401/404
- [ ] Response format consistant
- [ ] Documentation Swagger endpoints

**Issues techniques :**
- [ ] **API-001**: Endpoint GET /auth/me
- [ ] **API-002**: Endpoint PUT /auth/profile  
- [ ] **API-003**: DTO UpdateProfileDto avec validation
- [ ] **API-004**: Service ProfileService pour logique métier
- [ ] **API-005**: Tests unitaires controllers

---

### **US-011: Error Handling & Validation**
**En tant qu'** utilisateur  
**Je veux** des messages d'erreur clairs  
**Afin de** comprendre ce qui ne va pas

**Critères d'acceptation :**
- [ ] Messages d'erreur en français et explicites
- [ ] Validation côté client avec feedback visuel
- [ ] Validation côté serveur avec messages détaillés
- [ ] Gestion erreurs réseau (500, timeout)
- [ ] Loading states pendant requêtes
- [ ] Toast notifications pour succès/erreurs

**Issues techniques :**
- [ ] **ERROR-001**: Global exception filter NestJS
- [ ] **ERROR-002**: Messages erreur personnalisés
- [ ] **ERROR-003**: Validation pipe globale
- [ ] **ERROR-004**: Toast notification system React
- [ ] **ERROR-005**: Loading states components

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

### **TOTAL ESTIMATION: ~64h = 8 jours** *(avec votre expérience, réalisable en 7 jours)*

---

## 🎯 **DAILY BREAKDOWN**

**Jour 1-2**: Setup + Auth backend
**Jour 3-4**: Auth frontend + JWT
**Jour 5-6**: UI layouts + Profile
**Jour 7**: Polish + Deploy

**READY TO START CODING! 🚀**