# SPRINT 4 - USER STORIES & ISSUES

## _Search, Discovery & Contact System (Jours 22-28)_

---

## 🔍 **EPIC 14: ADVANCED ARTIST SEARCH & DISCOVERY**

### **US-033: Advanced Artist Search Engine**

**En tant que** venue connectée  
**Je veux** rechercher des artistes avec des critères précis  
**Afin de** trouver des talents parfaits pour mes événements

**Critères d'acceptation :**

- [x] Recherche full-text : nom artiste, bio, instruments, genres
- [x] Filtres avancés combinables : genre, localisation, instruments, expérience, tarifs
- [x] Résultats instantanés avec suggestions auto-complete
- [x] Tri par : pertinence, popularité, tarifs
- [x] Pagination avec scroll infini
- [x] Affichage résultats en grille ou liste
- [x] Preview profil au hover avec infos clés
- [x] Compteur de résultats en temps réel
- [ ] Historique des recherches récentes
- [ ] Suggestions "Artistes similaires" basées sur profil recherché

**Issues techniques :**

- [x] **SEARCH-008**: API search avec indexation full-text PostgreSQL (tsvector, GIN indexes)
- [x] **SEARCH-009**: Composant SearchEngine avec auto-complete (SearchBar + suggestions)
- [x] **SEARCH-010**: Système de filtres avancés combinables (FilterPanel)
- [x] **SEARCH-011**: Preview cards avec lazy loading (ArtistCard)
- [x] **SEARCH-012**: Algorithme de tri et scoring pertinence (relevance + popularity scores)
- [x] **SEARCH-013**: Optimisation performance requêtes complexes (debouncing, caching)
- [ ] **SEARCH-014**: Suggestions artistes similaires (IA simple)
- [ ] **SEARCH-015**: Historique recherches localStorage

---

### **US-034: Smart Filtering System** ✅

**En tant que** venue
**Je veux** filtrer les artistes selon mes besoins précis
**Afin d'** optimiser ma recherche et gagner du temps

**Critères d'acceptation :**

- [x] Filtres prioritaires : Genre musical, Localisation, Instruments, Expérience, Tarifs
- [x] Multi-sélection dans chaque catégorie de filtre
- [x] Range slider pour tarifs avec min/max personnalisables
- [x] Filtre localisation avec saisie ville + suggestion
- [x] Filtre "Disponible maintenant" (profils actifs récents)
- [x] Reset rapide de tous les filtres ou individuels
- [x] Indicateurs visuels nombre de résultats par filtre
- [x] Sauvegarde état des filtres dans URL (persistance session)
- [ ] Filtres secondaires : Type artiste (Solo/Groupe), Années d'activité, Badges de vérification
- [ ] Filtres en cascade intelligents (genres → sous-genres)

**Issues techniques :**

- [x] **FILTER-008**: Composant FilterPanel modulaire et réutilisable
- [x] **FILTER-009**: MultiSelect pour genres et instruments
- [x] **FILTER-010**: Range inputs pour tarifs avec debouncing
- [x] **FILTER-011**: LocationFilter avec suggestions
- [x] **FILTER-013**: Indicateurs de compte dynamiques
- [x] **FILTER-014**: State management filtres avec URL sync (React Router)
- [x] **FILTER-015**: Query builder SQL optimisé pour filtres
- [ ] **FILTER-012**: Système de filtres en cascade (genres)

**Tests E2E :**
- [x] 14/16 scenarios passing (87.5%)
- [x] Fixtures créés avec données de test
- [x] API mocks pour tests isolés

---

### **US-035: Artist Discovery & Recommendations**

**En tant que** venue  
**Je veux** découvrir de nouveaux artistes pertinents  
**Afin d'** enrichir ma programmation avec des talents variés

**Critères d'acceptation :**

- [ ] Section "Artistes recommandés" basée sur historique de recherche
- [ ] "Nouveaux talents" : artistes récemment inscrits avec profil complet
- [ ] "Tendances" : artistes populaires dans ma région
- [ ] "Artistes similaires" à ceux déjà contactés/favoris
- [ ] Carrousel d'artistes par genre avec navigation fluide
- [ ] Suggestions personnalisées selon type de venue
- [ ] "Artiste du jour" avec mise en avant spéciale
- [ ] Notifications nouvelles recommandations (optionnelles)
- [ ] Système de feedback pour améliorer recommandations
- [ ] Analytics des découvertes et conversions

**Issues techniques :**

- [ ] **DISCOVERY-001**: Algorithme de recommandation basique (ML/règles)
- [ ] **DISCOVERY-002**: Composant RecommendationCarousel
- [ ] **DISCOVERY-003**: Système de scoring et ranking artistes
- [ ] **DISCOVERY-004**: API tendances et statistiques
- [ ] **DISCOVERY-005**: Personalisation selon profil venue
- [ ] **DISCOVERY-006**: Notifications recommandations push
- [ ] **DISCOVERY-007**: Feedback loop pour amélioration continue
- [ ] **DISCOVERY-008**: Analytics découverte et engagement

---

## 💕 **EPIC 15: FAVORITES & COMPARISON SYSTEM**

### **US-036: Artist Favorites Management**

**En tant que** venue  
**Je veux** sauvegarder mes artistes favoris  
**Afin de** les retrouver facilement et les comparer

**Critères d'acceptation :**

- [ ] Bouton "Ajouter aux favoris" sur chaque profil artiste
- [ ] Page "Mes Favoris" avec vue d'ensemble
- [ ] Organisation en dossiers/collections personnalisées
- [ ] Tags personnalisés pour catégoriser favoris
- [ ] Tri favoris par date ajout, nom, note, tarifs
- [ ] Recherche dans les favoris
- [ ] Export liste favoris (PDF/Excel)
- [ ] Partage de collections favoris avec équipe
- [ ] Notifications quand favoris modifient profil
- [ ] Limite : 100 favoris pour comptes gratuits, illimité premium

**Issues techniques :**

- [ ] **FAVORITES-001**: Model et API favoris avec collections
- [ ] **FAVORITES-002**: Composant FavoritesManager avec drag & drop
- [ ] **FAVORITES-003**: Système de tags et catégorisation
- [ ] **FAVORITES-004**: Export favoris en différents formats
- [ ] **FAVORITES-005**: Partage collections avec permissions
- [ ] **FAVORITES-006**: Notifications changements favoris
- [ ] **FAVORITES-007**: Limites par type de compte
- [ ] **FAVORITES-008**: Sync favoris multi-device

---

### **US-037: Artist Comparison Tool**

**En tant que** venue  
**Je veux** comparer plusieurs artistes côte à côte  
**Afin de** choisir le meilleur pour mon événement

**Critères d'acceptation :**

- [ ] Sélection jusqu'à 4 artistes pour comparaison simultanée
- [ ] Vue comparative en tableau : tarifs, expérience, genres, localisation
- [ ] Comparaison portfolios avec gallery synchronisée
- [ ] Scores de compatibilité avec mon événement
- [ ] Highlights des différences principales
- [ ] Export comparaison en PDF pour équipe
- [ ] Sauvegarde comparaisons pour référence future
- [ ] Intégration avec système de favoris
- [ ] Notes privées par artiste dans comparaison
- [ ] Suggestions d'artistes alternatifs similaires

**Issues techniques :**

- [ ] **COMPARE-001**: Composant ComparisonTable responsive
- [ ] **COMPARE-002**: Algorithme scoring compatibilité venue/artiste
- [ ] **COMPARE-003**: Gallery synchronisée pour portfolios
- [ ] **COMPARE-004**: Export PDF comparaisons
- [ ] **COMPARE-005**: Système de sauvegarde comparaisons
- [ ] **COMPARE-006**: Notes privées par venue
- [ ] **COMPARE-007**: Intégration favoris et recommandations
- [ ] **COMPARE-008**: Optimisation performance comparaisons

---

## 📞 **EPIC 16: CONTACT & PREMIUM FEATURES**

### **US-038: Premium Contact System**

**En tant que** venue avec compte premium  
**Je veux** contacter directement les artistes  
**Afin de** négocier des collaborations efficacement

**Critères d'acceptation :**

- [ ] Messagerie directe intégrée (réservée comptes premium)
- [ ] Templates de messages pré-écrits personnalisables
- [ ] Envoi coordonnées artistes (email/téléphone) si premium
- [ ] Historique complet conversations par artiste
- [ ] Statuts de messages : envoyé, lu, répondu
- [ ] Notifications push temps réel nouvelles conversations
- [ ] Pièces jointes : contrats, riders, documents
- [ ] Système de relances automatiques (optionnel)
- [ ] Analytics taux de réponse et conversion
- [ ] Intégration calendrier pour propositions dates

**Issues techniques :**

- [ ] **CONTACT-001**: Système de messagerie temps réel (WebSocket)
- [ ] **CONTACT-002**: Templates messages avec variables
- [ ] **CONTACT-003**: Gestion permissions premium vs gratuit
- [ ] **CONTACT-004**: Composant ChatInterface moderne
- [ ] **CONTACT-005**: Upload et gestion pièces jointes
- [ ] **CONTACT-006**: Notifications push web + email
- [ ] **CONTACT-007**: Analytics conversations et conversions
- [ ] **CONTACT-008**: Intégration calendrier booking

---

### **US-039: Account Types & Premium Features**

**En tant que** venue  
**Je veux** comprendre les avantages du compte premium  
**Afin de** décider de mon abonnement selon mes besoins

**Critères d'acceptation :**

- [ ] Page claire différences Gratuit vs Premium
- [ ] Compte gratuit : consultation profils, max 10 favoris, pas de contact
- [ ] Compte premium : contact illimité, favoris illimités, analytics
- [ ] Période d'essai 14 jours premium gratuite
- [ ] Upgrade en 1-clic avec paiement sécurisé
- [ ] Features premium clairement identifiées (badges, tooltips)
- [ ] Usage tracking pour recommandations upgrade
- [ ] Notifications limitations compte gratuit (educatives)
- [ ] Dashboard usage et limites atteintes
- [ ] Support prioritaire pour comptes premium

**Issues techniques :**

- [ ] **PREMIUM-001**: Système de gestion comptes et permissions
- [ ] **PREMIUM-002**: Pages tarification et comparaison
- [ ] **PREMIUM-003**: Période d'essai avec limitation temporelle
- [ ] **PREMIUM-004**: Système de paiement sécurisé (Stripe)
- [ ] **PREMIUM-005**: Tracking usage et analytics
- [ ] **PREMIUM-006**: Notifications et incitations upgrade
- [ ] **PREMIUM-007**: Support différentié par type compte
- [ ] **PREMIUM-008**: Dashboard admin gestion abonnements

---

## 🛡️ **EPIC 17: QUALITY & TRUST SYSTEM**

### **US-040: Advanced Artist Verification**

**En tant que** venue  
**Je veux** identifier facilement les artistes de qualité  
**Afin de** faire confiance à l'annuaire et éviter les faux profils

**Critères d'acceptation :**

- [ ] Badge "Vérifié" visible sur tous profils validés
- [ ] Système de vérification multi-critères automatique
- [ ] Validation manuelle pour badge "Premium" (équipe StageComplete)
- [ ] Scores de fiabilité basés sur : complétion profil, activité, feedback
- [ ] Signalement profils suspects avec modération rapide
- [ ] Blacklist automatique faux comptes détectés
- [ ] Validation réseaux sociaux et liens externes
- [ ] Historique et traçabilité des vérifications
- [ ] API de vérification pour partenaires externes
- [ ] Processus d'appel et contestation

**Issues techniques :**

- [ ] **TRUST-001**: Système de badges multi-niveaux
- [ ] **TRUST-002**: Algorithme scoring fiabilité automatique
- [ ] **TRUST-003**: Interface modération équipe admin
- [ ] **TRUST-004**: Validation automatique liens sociaux
- [ ] **TRUST-005**: Système signalement et appeals
- [ ] **TRUST-006**: API vérification pour intégrations
- [ ] **TRUST-007**: Dashboard métriques confiance
- [ ] **TRUST-008**: Audit trail complet actions modération

---

### **US-041: Community Feedback & Ratings**

**En tant que** venue  
**Je veux** voir des indicateurs de qualité communautaire  
**Afin de** évaluer la réputation des artistes

**Critères d'acceptation :**

- [ ] Indicateurs de professionnalisme (ponctualité, communication)
- [ ] Feedback post-événement anonymisé et agrégé
- [ ] Score de réputation basé sur historique collaborations
- [ ] Système de recommandations entre venues (anonyme)
- [ ] Badges de performance : "Collaborateur fiable", "Communicant"
- [ ] Métriques transparentes : taux de réponse, délai moyen
- [ ] Protection contre faux avis et manipulation
- [ ] Feedback constructif pour amélioration artistes
- [ ] Dashboard réputation pour artistes
- [ ] Intégration avec système de vérification

**Issues techniques :**

- [ ] **FEEDBACK-001**: Système de feedback post-événement
- [ ] **FEEDBACK-002**: Algorithme agrégation et anonymisation
- [ ] **FEEDBACK-003**: Badges de performance automatiques
- [ ] **FEEDBACK-004**: Protection anti-manipulation
- [ ] **FEEDBACK-005**: Dashboard réputation artistes
- [ ] **FEEDBACK-006**: Métriques de comportement tracking
- [ ] **FEEDBACK-007**: Système de recommandations venues
- [ ] **FEEDBACK-008**: Intégration scores dans recherche

---

## ✅ **DEFINITION OF DONE - SPRINT 4**

### **Critères globaux :**

- [ ] **Fonctionnel**: Venues peuvent rechercher → filtrer → comparer → contacter artistes
- [ ] **Qualité**: Système de confiance opérationnel → profils fiables → expérience premium
- [ ] **Performance**: Recherche rapide → résultats pertinents → interface responsive
- [ ] **Business**: Distinction claire gratuit/premium → incitations upgrade → monétisation
- [ ] **Communauté**: Ecosystem de confiance → feedback constructif → qualité maintenue

### **User Acceptance Testing :**

- [ ] Une venue peut rechercher et trouver artistes pertinents
- [ ] Les filtres fonctionnent et donnent résultats précis
- [ ] Le système de favoris et comparaison est intuitif
- [ ] Les venues premium peuvent contacter les artistes
- [ ] La qualité de l'annuaire inspire confiance
- [ ] L'upgrade vers premium est motivé et fluide

---

## 📊 **ESTIMATION & PRIORITÉS**

### **MUST HAVE (Critique) :**

- US-033: Advanced Artist Search Engine (16h)
- US-034: Smart Filtering System (12h)
- US-038: Premium Contact System (14h)
- US-039: Account Types & Premium Features (10h)

### **SHOULD HAVE (Important) :**

- US-036: Artist Favorites Management (8h)
- US-037: Artist Comparison Tool (10h)
- US-040: Advanced Artist Verification (8h)

### **COULD HAVE (Nice to have) :**

- US-035: Artist Discovery & Recommendations (12h)
- US-041: Community Feedback & Ratings (10h)

### **TOTAL ESTIMATION: ~100h = 12-13 jours** _(focus sur priorités: ~60h = 7-8 jours)_

---

## 🎯 **DAILY BREAKDOWN SPRINT 4**

**Jour 22-23**: Search Engine + Smart Filtering  
**Jour 24-25**: Favorites + Comparison System  
**Jour 26-27**: Contact System + Premium Features  
**Jour 28**: Verification + Testing + Polish  

**READY FOR SPRINT 4! 🔍💼**

---

## 📝 **NOTES & QUESTIONS POUR VALIDATION**

1. **Contact premium** : Messagerie complète ou juste révélation coordonnées ?
2. **Tarification** : Prix monthly du compte premium venue ?
3. **Paiements** : Stripe ou autre processeur de paiement ?
4. **Modération** : Équipe dédiée ou modération automatique prioritaire ?
5. **Analytics** : Métriques prioritaires pour venues premium ?

**Sprint 4 axé sur la discovery et la monétisation ! 💰🚀**