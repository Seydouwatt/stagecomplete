# SPRINT 5 - USER STORIES & ISSUES

## _Booking & Calendar Management System (Jours 29-35)_

---

## 📅 **EPIC 18: BOOKING MANAGEMENT CORE**

### **US-042: Smart Booking System**

**En tant que** venue premium  
**Je veux** gérer mes bookings artistes de manière centralisée  
**Afin d'** organiser mes événements efficacement

**Critères d'acceptation :**

- [ ] Calendrier unifié avec vue mensuelle/hebdomadaire/journalière
- [ ] Création événements avec artistes depuis recherche ou favoris
- [ ] Statuts booking : Brouillon, Proposé, Confirmé, Annulé
- [ ] Gestion dates multiples et récurrences (résidences, festivals)
- [ ] Workflow booking : Proposition → Négociation → Contrat → Confirmation
- [ ] Notifications automatiques artistes (email + push)
- [ ] Gestion conflits horaires et double booking
- [ ] Vue planning équipe et disponibilités
- [ ] Export calendrier (Google, Outlook, iCal)
- [ ] Historique complet bookings avec search

**Issues techniques :**

- [ ] **BOOKING-001**: Model Booking avec statuts et workflow
- [ ] **BOOKING-002**: Composant Calendar avec drag & drop
- [ ] **BOOKING-003**: API booking avec gestion conflits
- [ ] **BOOKING-004**: Système de notifications automatiques
- [ ] **BOOKING-005**: Workflow state machine booking
- [ ] **BOOKING-006**: Export calendrier formats standards
- [ ] **BOOKING-007**: Gestion récurrences et séries événements
- [ ] **BOOKING-008**: Dashboard planning avec vues multiples

---

### **US-043: Event & Venue Management**

**En tant que** venue  
**Je veux** gérer les détails de mes événements  
**Afin d'** organiser des spectacles professionnels

**Critères d'acceptation :**

- [ ] Création événements avec infos complètes (date, heure, durée, type)
- [ ] Gestion multi-scènes/espaces dans une même venue
- [ ] Paramètres techniques par événement (sono, éclairage, capacité)
- [ ] Budget prévisionnel vs réel par événement
- [ ] Billetterie basic (capacité, tarifs, réservations)
- [ ] Équipe assignée par événement (techniciens, sécurité)
- [ ] Timeline événement (installation, soundcheck, spectacle)
- [ ] Documents liés (contrats, riders, assurances)
- [ ] Post-événement : feedback, photos, metrics
- [ ] Templates événements pour réutilisation

**Issues techniques :**

- [ ] **EVENT-001**: Model Event avec configuration complète
- [ ] **EVENT-002**: Gestion multi-espaces/scènes
- [ ] **EVENT-003**: Composant EventBuilder avec templates
- [ ] **EVENT-004**: Timeline événement avec jalons
- [ ] **EVENT-005**: Budget tracking en temps réel
- [ ] **EVENT-006**: Billetterie basic intégrée
- [ ] **EVENT-007**: Gestion équipe et assignments
- [ ] **EVENT-008**: Documents et fichiers par événement

---

### **US-044: Artist Booking Workflow**

**En tant qu'** artiste  
**Je veux** recevoir et gérer les propositions de booking  
**Afin de** planifier ma carrière et confirmer mes dates

**Critères d'acceptation :**

- [ ] Réception propositions booking avec détails complets
- [ ] Réponse en 1-clic : Accepter, Refuser, Négocier
- [ ] Calendrier artiste avec disponibilités
- [ ] Contre-propositions (dates, tarifs, conditions)
- [ ] Validation automatique si conditions acceptables
- [ ] Historique propositions et négociations
- [ ] Notifications deadline réponse
- [ ] Intégration calendrier personnel artiste
- [ ] Gestion tournées et dates liées
- [ ] Dashboard bookings confirmés et pipeline

**Issues techniques :**

- [ ] **ARTIST-BOOKING-001**: Interface propositions artistes
- [ ] **ARTIST-BOOKING-002**: Système négociation automatisé
- [ ] **ARTIST-BOOKING-003**: Calendrier artiste avec sync externe
- [ ] **ARTIST-BOOKING-004**: Workflow approbation intelligent
- [ ] **ARTIST-BOOKING-005**: Gestion tournées et série dates
- [ ] **ARTIST-BOOKING-006**: Dashboard pipeline artiste
- [ ] **ARTIST-BOOKING-007**: Notifications et deadlines
- [ ] **ARTIST-BOOKING-008**: Contre-propositions structurées

---

## 💰 **EPIC 19: FINANCIAL MANAGEMENT**

### **US-045: Pricing & Budget Management**

**En tant que** venue  
**Je veux** gérer la partie financière de mes bookings  
**Afin de** contrôler mes coûts et rentabilité

**Critères d'acceptation :**

- [ ] Négociation tarifs directement dans interface
- [ ] Templates de tarification par type événement
- [ ] Calcul automatique coûts totaux (artiste + frais + taxes)
- [ ] Gestion acomptes et échelonnement paiements
- [ ] Suivi budget prévisionnel vs réel
- [ ] Alertes dépassement budget
- [ ] Comparaison tarifs selon marché/période
- [ ] Facturation automatique selon contrat
- [ ] Reporting financier par événement/période
- [ ] Intégration comptabilité externe

**Issues techniques :**

- [ ] **FINANCE-001**: Système de tarification dynamique
- [ ] **FINANCE-002**: Calculateur coûts automatique
- [ ] **FINANCE-003**: Gestion acomptes et échéanciers
- [ ] **FINANCE-004**: Suivi budget temps réel
- [ ] **FINANCE-005**: Alertes et notifications financières
- [ ] **FINANCE-006**: Templates tarification personnalisés
- [ ] **FINANCE-007**: Facturation automatisée
- [ ] **FINANCE-008**: Export comptabilité (CSV/API)

---

### **US-046: Payment Processing System**

**En tant que** venue premium  
**Je veux** gérer les paiements artistes simplement  
**Afin d'** automatiser la partie administrative

**Critères d'acceptation :**

- [ ] Intégration Stripe pour paiements sécurisés
- [ ] Paiements directs artistes selon contrat
- [ ] Gestion multi-devises pour artistes internationaux
- [ ] Acomptes automatiques selon % défini
- [ ] Tracking statuts paiements en temps réel
- [ ] Relances automatiques factures impayées
- [ ] Reçus et factures automatiques PDF
- [ ] Reporting fiscal avec totaux TVA
- [ ] Escrow system pour protection mutuelle
- [ ] Split payments (artiste/manager/agent)

**Issues techniques :**

- [ ] **PAYMENT-001**: Intégration Stripe Connect
- [ ] **PAYMENT-002**: Système multi-devises
- [ ] **PAYMENT-003**: Acomptes et échéanciers automatiques
- [ ] **PAYMENT-004**: Tracking et notifications paiements
- [ ] **PAYMENT-005**: Génération factures PDF
- [ ] **PAYMENT-006**: Escrow et protection transactions
- [ ] **PAYMENT-007**: Split payments multiples bénéficiaires
- [ ] **PAYMENT-008**: Reporting fiscal automatisé

---

## 📞 **EPIC 20: COMMUNICATION SYSTEM**

### **US-047: Integrated Messaging Platform**

**En tant que** venue/artiste  
**Je veux** communiquer efficacement dans la plateforme  
**Afin d'** organiser mes collaborations

**Critères d'acceptation :**

- [ ] Chat temps réel avec WebSocket
- [ ] Conversations groupées par booking/événement
- [ ] Templates messages pré-écrits personnalisables
- [ ] Pièces jointes (contrats, riders, photos)
- [ ] Statuts messages : envoyé, livré, lu
- [ ] Notifications push et email
- [ ] Recherche dans historique conversations
- [ ] Mentions et tags (@artiste, @venue)
- [ ] Traduction automatique des messages
- [ ] Archive conversations importantes

**Issues techniques :**

- [ ] **MESSAGING-001**: WebSocket temps réel avec Socket.io
- [ ] **MESSAGING-002**: Interface chat moderne responsive
- [ ] **MESSAGING-003**: Système templates et variables
- [ ] **MESSAGING-004**: Upload et gestion pièces jointes
- [ ] **MESSAGING-005**: Notifications multi-canal
- [ ] **MESSAGING-006**: Recherche full-text conversations
- [ ] **MESSAGING-007**: Système mentions et notifications
- [ ] **MESSAGING-008**: Traduction automatique (Google Translate API)

---

### **US-048: Notification Management System**

**En tant qu'** utilisateur  
**Je veux** être notifié des événements importants  
**Afin de** ne rien manquer dans mes activités

**Critères d'acceptation :**

- [ ] Notifications en temps réel (push web)
- [ ] Emails de synthèse quotidiens/hebdomadaires
- [ ] SMS pour événements critiques (confirmations, annulations)
- [ ] Préférences notifications personnalisables
- [ ] Notifications contextuelles (booking, messages, paiements)
- [ ] Remind events 48h avant
- [ ] Escalation automatique si pas de réponse
- [ ] Centre de notifications avec historique
- [ ] Notifications groupées pour éviter spam
- [ ] Integration calendriers externes

**Issues techniques :**

- [ ] **NOTIF-001**: Service notifications multi-canal
- [ ] **NOTIF-002**: Web push notifications
- [ ] **NOTIF-003**: Templates emails et SMS
- [ ] **NOTIF-004**: Préférences utilisateur granulaires
- [ ] **NOTIF-005**: Système d'escalation automatique
- [ ] **NOTIF-006**: Centre notifications avec UI
- [ ] **NOTIF-007**: Groupement et déduplication
- [ ] **NOTIF-008**: Integration Twilio pour SMS

---

## ✅ **DEFINITION OF DONE - SPRINT 5**

### **Critères globaux :**

- [ ] **Fonctionnel**: Venues peuvent créer événements → proposer bookings → artistes répondent → confirmation
- [ ] **Financier**: Gestion complète tarifs → paiements → facturation automatique
- [ ] **Communication**: Messages temps réel → notifications intelligentes → workflow fluide
- [ ] **Performance**: Interface responsive → temps réel → UX optimale
- [ ] **Business**: Monétisation effective → valeur ajoutée claire

### **User Acceptance Testing :**

- [ ] Une venue peut créer un événement et booker un artiste
- [ ] Un artiste reçoit la proposition et peut négocier
- [ ] Le workflow booking fonctionne de bout en bout
- [ ] Les paiements sont sécurisés et automatisés
- [ ] La communication est fluide et notifiée

---

## 📊 **ESTIMATION & PRIORITÉS**

### **MUST HAVE (Critique) :**

- US-042: Smart Booking System (20h)
- US-043: Event & Venue Management (16h)
- US-047: Integrated Messaging Platform (14h)

### **SHOULD HAVE (Important) :**

- US-044: Artist Booking Workflow (12h)
- US-045: Pricing & Budget Management (10h)
- US-048: Notification Management System (8h)

### **COULD HAVE (Nice to have) :**

- US-046: Payment Processing System (16h)

### **TOTAL ESTIMATION: ~96h = 12 jours** _(focus priorités: ~62h = 8 jours)_

---

## 🎯 **DAILY BREAKDOWN SPRINT 5**

**Jour 29-30**: Booking System Core + Calendar  
**Jour 31-32**: Event Management + Artist Workflow  
**Jour 33-34**: Messaging + Notifications  
**Jour 35**: Financial Management + Testing  

**READY FOR SPRINT 5! 📅💼**

---

## 📝 **NOTES & QUESTIONS POUR VALIDATION**

1. **Paiements** : Stripe Connect ou simple Stripe pour commencer ?
2. **SMS** : Twilio ou autre service pour notifications critiques ?
3. **Calendrier** : Synchronisation bidirectionnelle Google/Outlook ?
4. **Escrow** : Système de protection nécessaire dès le début ?
5. **Multi-devises** : Priorité ou reporter aux sprints suivants ?

**Sprint 5 = Foundation du business model booking ! 🚀**