# Tests E2E StageComplete - Cypress + Cucumber

Ce dossier contient les tests end-to-end pour l'application StageComplete utilisant Cypress avec Cucumber/Gherkin.

## 🎯 **Scénarios de Test Couverts**

### **1. Authentification Artiste** (`artist-authentication.feature`)
- ✅ Inscription d'un nouvel artiste
- ✅ Connexion avec identifiants valides/invalides  
- ✅ Persistance de session après rafraîchissement
- ✅ Déconnexion complète

### **2. Gestion du Profil Artiste** (`artist-profile-management.feature`)
- ✅ Création profil artiste solo complet
- ✅ Création profil groupe avec plusieurs membres
- ✅ Modification/suppression de membres
- ✅ Validation des données membre
- ✅ Configuration des tarifs
- ✅ Prévisualisation du profil public

### **3. Dashboard Artiste** (`artist-dashboard.feature`)
- ✅ Affichage des sections du dashboard
- ✅ Navigation vers profil artiste
- ✅ Statistiques et graphiques
- ✅ Responsivité mobile
- ✅ Actions rapides
- ✅ Indicateur de complétion du profil

## 🚀 **Commandes d'Exécution**

### **Développement (Interface Graphique)**
```bash
npm run test:e2e:open
```
Lance Cypress en mode interactif pour déboguer et développer les tests.

### **CI/CD (Headless)**
```bash
npm run test:e2e
```
Exécute tous les tests en mode headless pour les pipelines.

### **Test Spécifique**
```bash
npx cypress run --spec "cypress/e2e/artist/artist-authentication.feature"
```

## 📁 **Structure des Fichiers**

```
cypress/
├── e2e/
│   └── artist/
│       ├── artist-authentication.feature
│       ├── artist-profile-management.feature
│       └── artist-dashboard.feature
├── support/
│   ├── step_definitions/
│   │   ├── common.js
│   │   ├── authentication.js
│   │   └── artist-profile.js
│   ├── commands.js
│   └── e2e.js
├── fixtures/
│   └── test-users.json
└── README.md
```

## 🧪 **Prérequis pour Exécuter les Tests**

1. **Services démarrés :**
   ```bash
   # Backend sur port 3000
   cd stagecomplete-backend && npm run start:dev
   
   # Frontend sur port 5175  
   cd stagecomplete-frontend && npm run dev
   ```

2. **Base de données :**
   - PostgreSQL accessible
   - Schéma Prisma migré

## 📝 **Commandes Cypress Personnalisées**

### **Authentification**
```javascript
cy.registerArtist({ name: "Test", email: "test@test.com" })
cy.loginAsArtist("email@test.com", "password")
```

### **Navigation**
```javascript
cy.goToArtistProfile()
cy.switchToTab("members")
```

### **Gestion des Membres**
```javascript
cy.selectArtistType("BAND")
cy.addMember({ name: "Member", role: "Musician" })
```

### **Utilitaires**
```javascript
cy.waitForPageLoad()
cy.shouldShowToast("success", "Saved!")
cy.cleanupTestData()
```

## 🎭 **Scénarios de Test Basés sur User Stories**

Les tests couvrent les user stories suivantes :

### **Sprint 1 :**
- ✅ US-003: User Registration  
- ✅ US-004: User Login
- ✅ US-006: Session Management
- ✅ US-008: Dashboard Landing Pages

### **Sprint 2 :**
- ✅ US-017: Extended Artist Profile Creation
- ✅ US-017B: Artist Member Management (Groups)
- ✅ US-019: Artist Dashboard Management

## 🔧 **Configuration**

### **Cypress Config** (`cypress.config.js`)
- Base URL: `http://localhost:5175`
- API URL: `http://localhost:3000/api`
- Timeouts: 10s par défaut
- Screenshots et vidéos activés

### **Cucumber Config** (`.cypress-cucumber-preprocessorrc.json`)
- Rapports JSON et HTML
- Step definitions automatiquement chargées
- Support du français (Gherkin)

## 🐛 **Débogage**

### **Logs Détaillés**
```javascript
// Dans les step definitions
console.log('Debug step:', { data });
```

### **Attendre les Éléments**
```javascript
cy.get('[data-testid="element"]', { timeout: 10000 })
  .should('be.visible');
```

### **Captures d'Écran**
Les captures sont automatiques en cas d'échec et sauvées dans :
`cypress/screenshots/`

## ✅ **Validation Complète**

Pour valider complètement les fonctionnalités artiste :

1. **Exécuter la suite complète :**
   ```bash
   npm run test:e2e
   ```

2. **Vérifier les rapports :**
   - Console Cypress
   - `cypress/cucumber-report.json`
   - Screenshots en cas d'échec

3. **Tests manuels complémentaires :**
   - Navigation responsive  
   - Performance sur mobile
   - Compatibilité navigateurs

**Les tests E2E sont maintenant prêts ! 🎉**