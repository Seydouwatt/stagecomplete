# SPRINT 5.1 - ARTIST PREMIUM: SOCIAL PROMOTION (9€/mois)

**Phase**: Phase 5.1 - Artist Premium Features
**Durée estimée**: 15 jours
**Priorité**: MEDIUM (après MVP core features)
**Statut**: 🔴 À venir

---

## 🎯 OBJECTIFS DU SPRINT

Développer le système de promotion et partage social pour les artistes Premium, leur permettant de promouvoir efficacement leurs profils sur les réseaux sociaux avec des outils professionnels.

### **Business Goals**
- Augmenter la valeur perçue de l'offre Artiste Premium 9€/mois
- Générer du trafic qualifié via le partage social
- Créer un effet réseau viral pour l'acquisition d'artistes
- Différencier StageComplete des plateformes concurrentes

### **Success Metrics**
- 40% des artistes Premium utilisent la fonctionnalité de partage dans le premier mois
- 25% augmentation du trafic organique via partages sociaux
- 15% conversion des visiteurs externes en inscriptions artistes
- 500+ profils partagés dans les 3 premiers mois

---

## 📋 EPIC 21: ARTIST PREMIUM - SOCIAL PROMOTION

### **Description**
En tant qu'artiste Premium, je veux pouvoir partager mon profil professionnel sur les réseaux sociaux avec des visuels attractifs et suivre les performances de mes partages pour maximiser ma visibilité et obtenir plus de bookings.

### **Business Value**
- **Pour l'artiste**: Promotion professionnelle simplifiée, augmentation visibilité, plus de demandes venues
- **Pour StageComplete**: Acquisition organique gratuite, renforcement marque, justification prix Premium

---

## 📝 USER STORIES - PHASE 5.1 (MVP)

### **US-049: Share Artist Profile - Core Functionality**
**Priority**: MUST HAVE
**Story Points**: 8
**Estimation**: 3 jours

**En tant qu'** artiste Premium
**Je veux** partager mon profil sur les réseaux sociaux en 1 clic
**Afin de** promouvoir mon activité et attirer des venues

**Critères d'acceptation**:
- [ ] Bouton "Partager" visible sur la page profil artiste (public)
- [ ] Modal de partage avec 5 réseaux: Instagram, Facebook, WhatsApp, LinkedIn, Twitter/X
- [ ] Génération automatique d'un lien court `stagecomplete.app/nom-artiste`
- [ ] Copie du lien en 1 clic avec feedback visuel
- [ ] Texte de partage pré-rempli et personnalisable
- [ ] Preview du message avant partage
- [ ] Tracking des clics sur liens partagés (analytics basique)

**Technical Issues**:
- `SHARE-001`: Créer composant `ShareProfileModal.tsx` (2h)
- `SHARE-002`: Implémenter générateur liens courts (backend `/api/short-links`) (3h)
- `SHARE-003`: Ajouter bouton "Partager" sur `PublicArtistProfile.tsx` (1h)
- `SHARE-004`: Intégrer Web Share API pour mobile natif (2h)
- `SHARE-005`: Créer service analytics tracking clics liens (3h)
- `SHARE-006`: Tests E2E Cypress partage profil (2h)

**Definition of Done**:
- ✅ Bouton partage fonctionnel sur profil public artiste
- ✅ Modal s'ouvre avec 5 options réseaux sociaux
- ✅ Lien court généré et copiable
- ✅ Tracking clics implémenté
- ✅ Tests E2E validés
- ✅ Responsive mobile/desktop
- ✅ Documentation utilisateur ajoutée

---

### **US-050: Visual Content Generator - Social Cards**
**Priority**: MUST HAVE
**Story Points**: 13
**Estimation**: 5 jours

**En tant qu'** artiste Premium
**Je veux** générer automatiquement des cartes visuelles (images) pour Instagram/Facebook
**Afin de** partager un contenu professionnel et attractif sans compétences en design

**Critères d'acceptation**:
- [ ] Génération automatique d'une image 1080x1080px (Instagram post)
- [ ] Template avec photo artiste, nom, genres, note moyenne, lien QR code
- [ ] 3 templates au choix (Modern, Elegant, Vibrant)
- [ ] Personnalisation couleur dominante selon genres musicaux
- [ ] Bouton "Télécharger" pour sauvegarder l'image
- [ ] Format Story Instagram 1080x1920px disponible
- [ ] Preview temps réel avant téléchargement
- [ ] Watermark "Powered by StageComplete" discret

**Technical Issues**:
- `SHARE-007`: Créer service génération canvas HTML5 → PNG (4h)
- `SHARE-008`: Designer 3 templates SVG réutilisables (6h)
- `SHARE-009`: Implémenter sélection/switch templates (2h)
- `SHARE-010`: Ajouter génération QR code avec `qrcode.react` (2h)
- `SHARE-011`: Créer endpoint `/api/artists/:id/social-card` (3h)
- `SHARE-012`: Optimiser performance rendering canvas (2h)
- `SHARE-013`: Ajouter option format Story (1080x1920) (2h)
- `SHARE-014`: Tests visuels automatisés (snapshot testing) (3h)

**Definition of Done**:
- ✅ Génération image 1080x1080 fonctionnelle
- ✅ 3 templates disponibles et sélectionnables
- ✅ QR code intégré dans l'image
- ✅ Téléchargement PNG haute qualité
- ✅ Format Story Instagram disponible
- ✅ Performance < 2s pour génération
- ✅ Tests visuels validés
- ✅ Documentation technique complète

---

### **US-051: QR Code & Custom Short Links**
**Priority**: MUST HAVE
**Story Points**: 5
**Estimation**: 2 jours

**En tant qu'** artiste Premium
**Je veux** obtenir un QR code personnalisé pointant vers mon profil
**Afin de** l'imprimer sur mes supports physiques (flyers, cartes de visite)

**Critères d'acceptation**:
- [ ] Génération QR code unique pour chaque artiste
- [ ] QR code pointe vers `stagecomplete.app/nom-artiste`
- [ ] Téléchargement SVG haute résolution (print-ready)
- [ ] Téléchargement PNG (web-ready)
- [ ] Personnalisation couleur QR code (brand colors)
- [ ] Option logo StageComplete au centre du QR code
- [ ] Tracking scans QR code (analytics)

**Technical Issues**:
- `SHARE-015`: Intégrer bibliothèque `qrcode` pour génération backend (2h)
- `SHARE-016`: Créer endpoint `/api/artists/:id/qr-code` (1h)
- `SHARE-017`: Implémenter téléchargement multi-formats (SVG/PNG) (2h)
- `SHARE-018`: Ajouter personnalisation couleur QR (1h)
- `SHARE-019`: Créer table `qr_code_scans` pour analytics (2h)
- `SHARE-020`: UI composant QRCodeGenerator (2h)
- `SHARE-021`: Tests intégration QR code scanning (2h)

**Definition of Done**:
- ✅ QR code généré pour chaque artiste Premium
- ✅ Téléchargement SVG et PNG disponibles
- ✅ Couleur personnalisable
- ✅ Tracking scans implémenté
- ✅ Tests backend/frontend validés
- ✅ Documentation utilisateur créée

---

### **US-052: Social Media Analytics - Basic Stats**
**Priority**: SHOULD HAVE
**Story Points**: 8
**Estimation**: 3 jours

**En tant qu'** artiste Premium
**Je veux** voir combien de personnes ont cliqué sur mes liens partagés
**Afin de** mesurer l'efficacité de ma promotion sociale

**Critères d'acceptation**:
- [ ] Dashboard analytics dans profil artiste (section "Promotion")
- [ ] Métriques affichées: Vues totales, Clics liens, Scans QR, Conversions (inscriptions venues)
- [ ] Filtrage par période (7 jours, 30 jours, 90 jours, Tout)
- [ ] Breakdown par canal (Instagram, Facebook, WhatsApp, LinkedIn, QR Code)
- [ ] Graphique simple évolution clics dans le temps
- [ ] Taux de conversion clics → vues profil
- [ ] Export CSV des statistiques

**Technical Issues**:
- `SHARE-022`: Créer table `share_analytics` (clicks, source, timestamp) (2h)
- `SHARE-023`: Implémenter middleware tracking liens courts (2h)
- `SHARE-024`: Créer endpoint `/api/artists/:id/share-stats` (3h)
- `SHARE-025`: Designer composant `ShareAnalyticsDashboard.tsx` (4h)
- `SHARE-026`: Intégrer graphique Chart.js ou Recharts (3h)
- `SHARE-027`: Ajouter export CSV avec `react-csv` (2h)
- `SHARE-028`: Tests analytics tracking end-to-end (3h)

**Definition of Done**:
- ✅ Dashboard analytics visible dans profil artiste
- ✅ Métriques clés affichées correctement
- ✅ Filtrage par période fonctionnel
- ✅ Breakdown par canal social
- ✅ Graphique temps réel
- ✅ Export CSV disponible
- ✅ Tests E2E validés
- ✅ Performance < 1s chargement stats

---

## 🗓️ PLANNING DÉTAILLÉ - 15 JOURS

### **Semaine 1: Core Sharing & Visual Cards (Jours 1-7)**

**Jour 1-3: US-049 - Share Profile Core**
- Jour 1: Setup architecture partage (SHARE-001, SHARE-002, SHARE-003)
- Jour 2: Implémentation Web Share API + analytics (SHARE-004, SHARE-005)
- Jour 3: Tests E2E + corrections (SHARE-006)

**Jour 4-7: US-050 - Visual Content Generator**
- Jour 4: Service génération canvas + templates base (SHARE-007, SHARE-008)
- Jour 5: Sélection templates + QR code intégration (SHARE-009, SHARE-010)
- Jour 6: Endpoint backend + optimisation (SHARE-011, SHARE-012)
- Jour 7: Format Story + tests visuels (SHARE-013, SHARE-014)

### **Semaine 2: QR Codes & Analytics (Jours 8-12)**

**Jour 8-9: US-051 - QR Code & Short Links**
- Jour 8: Backend QR generation + API (SHARE-015, SHARE-016, SHARE-017)
- Jour 9: UI QR Generator + tracking (SHARE-018, SHARE-019, SHARE-020, SHARE-021)

**Jour 10-12: US-052 - Analytics Dashboard**
- Jour 10: Database schema + tracking middleware (SHARE-022, SHARE-023)
- Jour 11: Backend stats API + frontend dashboard (SHARE-024, SHARE-025)
- Jour 12: Graphiques + export CSV (SHARE-026, SHARE-027)

### **Semaine 3: Polish & Testing (Jours 13-15)**

**Jour 13: Integration Testing**
- Tests E2E complets flux partage → analytics
- Tests performance génération images
- Tests tracking multi-canaux

**Jour 14: UI/UX Polish**
- Animations et micro-interactions
- Messages d'aide contextuelle
- Responsive final adjustments
- Accessibility (A11y) checks

**Jour 15: Documentation & Deployment**
- Documentation utilisateur (guide partage social)
- Documentation technique (API, architecture)
- Migration database production
- Feature flags activation
- Monitoring & alerts setup

---

## 🎨 DESIGN SPECS

### **ShareProfileModal Component**
```
┌─────────────────────────────────────────┐
│  Partager mon profil                  ✕ │
├─────────────────────────────────────────┤
│                                         │
│  [Preview Card]                         │
│  ┌───────────────────────────┐          │
│  │  [Photo] John Doe         │          │
│  │  🎸 Rock • Jazz            │          │
│  │  ⭐ 4.8 (12 avis)          │          │
│  │  [QR Code]                │          │
│  └───────────────────────────┘          │
│                                         │
│  Lien court:                            │
│  ┌─────────────────────────┐ [Copier]  │
│  │ stagecomplete.app/john  │            │
│  └─────────────────────────┘            │
│                                         │
│  Partager sur:                          │
│  [📸 Instagram] [👍 Facebook]           │
│  [💬 WhatsApp]  [💼 LinkedIn]           │
│                                         │
│  [📊 Voir mes statistiques]             │
└─────────────────────────────────────────┘
```

### **Visual Card Templates**

**Template 1: Modern**
- Fond dégradé violet (#8b5cf6 → #7c3aed)
- Photo ronde centrée 400x400
- Typo sans-serif moderne (Inter)
- QR code bas droit

**Template 2: Elegant**
- Fond blanc pur
- Photo carrée coin supérieur gauche
- Bordure dorée (#FFD700)
- Typo serif élégante (Playfair Display)
- QR code centré bas

**Template 3: Vibrant**
- Fond photo artiste avec overlay coloré
- Effet glassmorphism pour texte
- Typo bold énergique (Montserrat)
- QR code intégré dans design

---

## 🛠️ ARCHITECTURE TECHNIQUE

### **Backend (NestJS)**

**Nouveaux modules**:
```
stagecomplete-backend/
└── src/
    ├── share/
    │   ├── share.module.ts
    │   ├── share.controller.ts
    │   ├── share.service.ts
    │   ├── dto/
    │   │   ├── create-short-link.dto.ts
    │   │   └── share-stats.dto.ts
    │   └── entities/
    │       ├── short-link.entity.ts
    │       └── share-analytics.entity.ts
    ├── social-card/
    │   ├── social-card.module.ts
    │   ├── social-card.controller.ts
    │   ├── social-card.service.ts
    │   ├── templates/
    │   │   ├── modern.template.ts
    │   │   ├── elegant.template.ts
    │   │   └── vibrant.template.ts
    │   └── generators/
    │       ├── canvas.generator.ts
    │       └── qr-code.generator.ts
```

**Nouvelles tables Prisma**:
```prisma
model ShortLink {
  id          String   @id @default(uuid())
  artistId    String
  artist      Artist   @relation(fields: [artistId], references: [id])
  shortCode   String   @unique // Ex: "john-doe"
  originalUrl String
  clicks      Int      @default(0)
  createdAt   DateTime @default(now())

  analytics   ShareAnalytics[]

  @@index([artistId])
  @@index([shortCode])
}

model ShareAnalytics {
  id           String    @id @default(uuid())
  shortLinkId  String
  shortLink    ShortLink @relation(fields: [shortLinkId], references: [id])
  source       String    // "instagram", "facebook", "qrcode", etc.
  userAgent    String?
  referrer     String?
  ipAddress    String?
  country      String?
  timestamp    DateTime  @default(now())

  @@index([shortLinkId])
  @@index([timestamp])
}

model QRCodeScan {
  id        String   @id @default(uuid())
  artistId  String
  artist    Artist   @relation(fields: [artistId], references: [id])
  location  String?
  timestamp DateTime @default(now())

  @@index([artistId])
}
```

**Nouveaux endpoints**:
```typescript
// Short Links
POST   /api/share/short-link          // Créer lien court
GET    /api/s/:shortCode              // Redirection avec tracking
GET    /api/share/:artistId/stats     // Stats de partage

// Social Cards
GET    /api/social-card/:artistId     // Générer carte sociale
POST   /api/social-card/:artistId/custom // Carte personnalisée

// QR Codes
GET    /api/qr-code/:artistId         // Générer QR code
GET    /api/qr-code/:artistId/scan    // Enregistrer scan
```

### **Frontend (React)**

**Nouveaux composants**:
```
stagecomplete-frontend/
└── src/
    ├── components/
    │   └── share/
    │       ├── ShareProfileModal.tsx
    │       ├── SocialCardGenerator.tsx
    │       ├── QRCodeGenerator.tsx
    │       ├── ShareAnalyticsDashboard.tsx
    │       ├── TemplateSelector.tsx
    │       └── ShareButton.tsx
    ├── hooks/
    │   ├── useShareProfile.ts
    │   ├── useGenerateSocialCard.ts
    │   └── useShareAnalytics.ts
    └── utils/
        ├── canvas-renderer.ts
        ├── social-share.ts
        └── qr-code-generator.ts
```

**Technologies**:
- `html2canvas` ou `dom-to-image`: Conversion DOM → Image
- `qrcode.react`: Génération QR codes React
- `react-share`: Boutons partage sociaux
- `recharts`: Graphiques analytics
- `react-csv`: Export CSV
- `canvas-confetti`: Animations succès partage

---

## 🧪 TESTS

### **Tests Unitaires (Jest)**
- Service génération liens courts
- Tracking analytics
- Générateurs templates
- Validation données

### **Tests E2E (Cypress)**
```javascript
describe('Social Sharing - Artist Premium', () => {
  it('should open share modal on public artist profile', () => {
    cy.visit('/artist/john-doe');
    cy.get('[data-testid="share-profile-button"]').click();
    cy.get('[data-testid="share-modal"]').should('be.visible');
  });

  it('should copy short link to clipboard', () => {
    cy.get('[data-testid="copy-link-button"]').click();
    cy.window().its('navigator.clipboard')
      .invoke('readText')
      .should('contain', 'stagecomplete.app/john-doe');
  });

  it('should generate social card and download', () => {
    cy.get('[data-testid="generate-card-button"]').click();
    cy.get('[data-testid="social-card-preview"]').should('be.visible');
    cy.get('[data-testid="download-card-button"]').click();
    // Verify download triggered
  });

  it('should display share analytics', () => {
    cy.loginAsArtist();
    cy.visit('/profile');
    cy.get('[data-testid="analytics-tab"]').click();
    cy.get('[data-testid="total-clicks"]').should('exist');
    cy.get('[data-testid="share-chart"]').should('be.visible');
  });
});
```

### **Tests Visuels (Snapshot)**
- Templates cartes sociales
- QR codes
- Dashboard analytics

---

## 📊 MÉTRIQUES DE SUCCÈS

### **Technical Metrics**
- [ ] Performance génération carte < 2s
- [ ] Taux d'erreur tracking < 0.1%
- [ ] Uptime liens courts 99.9%
- [ ] Temps chargement analytics < 1s

### **Business Metrics**
- [ ] 40% adoption feature par artistes Premium (mois 1)
- [ ] 500+ profils partagés (3 premiers mois)
- [ ] 25% augmentation trafic organique
- [ ] 15% conversion visiteurs externes → inscriptions

### **User Experience Metrics**
- [ ] Temps moyen génération carte: < 30s
- [ ] Satisfaction utilisateur: 4.5/5
- [ ] Taux d'abandon modal partage: < 20%
- [ ] Retour utilisation feature: > 60% (mois suivant)

---

## 🚀 DÉPLOIEMENT

### **Pre-requisites**
- [ ] Artistes Premium existants pour beta test
- [ ] Service génération images scalable (Cloudinary ou S3)
- [ ] CDN pour liens courts (Cloudfront ou Netlify)
- [ ] Analytics database optimisée (indexes)

### **Rollout Strategy**
1. **Phase 1**: Beta privée (10 artistes sélectionnés) - 3 jours
2. **Phase 2**: Beta élargie (tous artistes Premium) - 7 jours
3. **Phase 3**: Communication marketing (email, blog, social) - Jour 10
4. **Phase 4**: General Availability - Jour 15

### **Feature Flags**
```typescript
const FEATURE_FLAGS = {
  SHARE_PROFILE_ENABLED: true,
  VISUAL_CARDS_ENABLED: true,
  QR_CODE_ENABLED: true,
  ANALYTICS_ENABLED: true,
  PREMIUM_ONLY: true, // Limiter aux artistes Premium
};
```

---

## 🔮 ÉVOLUTIONS FUTURES (Phase 5.2+)

### **Phase 5.2 - Advanced Features**
- Kit média téléchargeable (PDF haute résolution)
- Génération légendes IA (GPT-4 pour posts optimisés)
- Watermark personnalisé optionnel
- Templates vidéo (Stories animées)

### **Phase 5.3 - Pro Features**
- Planification posts (intégration Buffer/Hootsuite)
- A/B testing visuels
- Analytics avancées (heatmaps, conversion funnels)
- Intégration APIs natives (Instagram Graph API, Facebook Marketing)

---

## ✅ CHECKLIST AVANT LANCEMENT

### **Development**
- [ ] Toutes les US complétées
- [ ] Tests unitaires > 80% coverage
- [ ] Tests E2E validés
- [ ] Code review backend + frontend
- [ ] Documentation technique à jour

### **Design & UX**
- [ ] Templates cartes validés par designer
- [ ] Responsive mobile/tablet/desktop
- [ ] Accessibility WCAG AA
- [ ] Animations fluides (60fps)

### **Infrastructure**
- [ ] Migration database production
- [ ] CDN configuré pour assets
- [ ] Monitoring logs analytics
- [ ] Alerts performance (Sentry)
- [ ] Backup database automatique

### **Business**
- [ ] Guide utilisateur rédigé
- [ ] Email annonce artistes Premium
- [ ] Article blog lancement feature
- [ ] Posts réseaux sociaux StageComplete
- [ ] Support client formé

### **Legal & Compliance**
- [ ] Politique confidentialité mise à jour (tracking)
- [ ] RGPD conformité analytics
- [ ] Mentions légales liens courts
- [ ] Copyright templates visuels

---

**Document créé**: 15 Octobre 2025
**Dernière mise à jour**: 15 Octobre 2025
**Auteur**: Équipe StageComplete
**Statut**: 🔴 Planifié - Phase 5.1
