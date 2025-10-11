# Messaging & Booking Request System - Guide d'Implémentation

## 📋 Vue d'ensemble

Ce document décrit l'implémentation complète du système de messaging et de booking requests pour StageComplete MVP.

**Date**: 11 Octobre 2025
**Version**: 1.0.0
**Approche**: Option C - Hybrid (Foundation + Quick Win)

---

## 🎯 Objectifs atteints

✅ **Messaging Event-Based**: Communication artiste ↔ venue
✅ **Booking Request Workflow**: PENDING → VIEWED → ACCEPTED/DECLINED
✅ **Système de Notifications**: Event-driven avec EventEmitter2
✅ **Frontend React**: Composants UI complets avec TanStack Query
✅ **Tests E2E Cypress**: Scénarios Gherkin complets

---

## 🗄️ Base de données

### Modèles Prisma créés

#### 1. **BookingRequest**
```prisma
model BookingRequest {
  id              String                @id @default(cuid())
  venueId         String
  artistId        String
  eventDate       DateTime
  eventType       String
  budget          Float?
  duration        Int?
  message         String?
  status          BookingRequestStatus  @default(PENDING)
  viewedByArtist  Boolean               @default(false)
  respondedAt     DateTime?
  eventId         String?               @unique

  venue           Venue                 @relation(...)
  artist          Artist                @relation(...)
  event           Event?                @relation(...)

  createdAt       DateTime              @default(now())
  updatedAt       DateTime              @updatedAt

  @@index([artistId, status])
  @@index([venueId, status])
  @@map("booking_requests")
}
```

#### 2. **Notification**
```prisma
model Notification {
  id          String             @id @default(cuid())
  userId      String
  type        NotificationType
  title       String
  message     String
  relatedId   String?
  relatedType String?
  isRead      Boolean            @default(false)
  readAt      DateTime?

  user        User               @relation(...)
  createdAt   DateTime           @default(now())

  @@index([userId, isRead])
  @@map("notifications")
}
```

#### 3. **Enums**
```prisma
enum BookingRequestStatus {
  PENDING
  VIEWED
  ACCEPTED
  DECLINED
  CANCELLED
  EXPIRED
}

enum NotificationType {
  BOOKING_REQUEST_RECEIVED
  BOOKING_REQUEST_ACCEPTED
  BOOKING_REQUEST_DECLINED
  NEW_MESSAGE
  BOOKING_REMINDER
}
```

### Migration appliquée

**Fichier**: `prisma/migrations/20251011004500_add_booking_requests_and_notifications/migration.sql`

**Commande pour production**:
```bash
npx prisma migrate deploy
```

---

## 🔧 Backend (NestJS)

### Architecture des modules

```
src/
├── message/
│   ├── dto/
│   │   └── create-message.dto.ts
│   ├── message.controller.ts     # 4 endpoints REST
│   ├── message.service.ts        # 4 méthodes métier
│   └── message.module.ts
│
├── booking-request/
│   ├── dto/
│   │   ├── create-booking-request.dto.ts
│   │   └── respond-booking-request.dto.ts
│   ├── booking-request.controller.ts  # 5 endpoints REST
│   ├── booking-request.service.ts     # 5 méthodes métier
│   └── booking-request.module.ts
│
└── notification/
    ├── events/
    │   ├── booking-request.events.ts  # 4 event classes
    │   └── message.events.ts          # 1 event class
    ├── notification.controller.ts     # 5 endpoints REST
    ├── notification.service.ts        # 10 méthodes (5 listeners + 5 CRUD)
    └── notification.module.ts
```

### API Endpoints

#### Messages (`/api/messages`)
- `POST /api/messages` - Créer un message
- `GET /api/messages?eventId={id}` - Lister les messages d'un event
- `PUT /api/messages/:id/read` - Marquer comme lu
- `GET /api/messages/unread-count` - Compteur de non-lus

#### Booking Requests (`/api/booking-requests`)
- `POST /api/booking-requests` - Créer une demande (venue only)
- `GET /api/booking-requests?status={status}` - Lister les demandes
- `GET /api/booking-requests/stats` - Statistiques
- `GET /api/booking-requests/:id` - Détails (auto-mark as VIEWED)
- `PUT /api/booking-requests/:id/respond` - Répondre (accept/decline/cancel)

#### Notifications (`/api/notifications`)
- `GET /api/notifications?isRead={bool}` - Lister les notifications
- `GET /api/notifications/unread-count` - Compteur de non-lues
- `PUT /api/notifications/:id/read` - Marquer comme lue
- `PUT /api/notifications/read-all` - Tout marquer comme lu
- `DELETE /api/notifications/:id` - Supprimer

### Système d'événements

**Configuration** (`app.module.ts`):
```typescript
imports: [
  EventEmitterModule.forRoot(),
  // ...
]
```

**Événements émis**:

| Événement | Émetteur | Listener | Notification créée |
|-----------|----------|----------|-------------------|
| `booking-request.received` | BookingRequestService | NotificationService | BOOKING_REQUEST_RECEIVED |
| `booking-request.accepted` | BookingRequestService | NotificationService | BOOKING_REQUEST_ACCEPTED |
| `booking-request.declined` | BookingRequestService | NotificationService | BOOKING_REQUEST_DECLINED |
| `booking-request.cancelled` | BookingRequestService | NotificationService | BOOKING_REQUEST_DECLINED |
| `message.new` | MessageService | NotificationService | NEW_MESSAGE |

**Exemple d'émission d'événement**:
```typescript
this.eventEmitter.emit(
  'booking-request.received',
  new BookingRequestReceivedEvent(
    artistUserId,
    venueUserId,
    bookingRequestId,
    venueName,
    eventDate,
    eventType
  )
);
```

---

## ⚛️ Frontend (React + TypeScript)

### Structure des composants

```
src/
├── types/
│   ├── message.ts
│   ├── booking-request.ts
│   └── notification.ts
│
├── services/
│   ├── messageService.ts
│   ├── bookingRequestService.ts
│   └── notificationService.ts
│
├── hooks/
│   ├── useMessages.ts              # 4 hooks
│   ├── useBookingRequests.ts       # 5 hooks
│   └── useNotifications.ts         # 5 hooks
│
└── components/
    ├── messages/
    │   ├── MessageList.tsx
    │   ├── MessageInput.tsx
    │   └── MessageThread.tsx
    │
    ├── booking-requests/
    │   ├── BookingRequestCard.tsx
    │   ├── BookingRequestList.tsx
    │   └── RespondModal.tsx
    │
    └── notifications/
        └── NotificationBadge.tsx
```

### Hooks React Query

#### Messages
```typescript
// Récupérer les messages (polling 5s)
const { messages, isLoading } = useMessages(eventId);

// Envoyer un message
const sendMessage = useSendMessage();
sendMessage.mutate({ eventId, content });

// Marquer comme lu
const markAsRead = useMarkMessageAsRead();
markAsRead.mutate(messageId);

// Compteur non-lus (polling 10s)
const { count, byEvent } = useUnreadMessagesCount();
```

#### Booking Requests
```typescript
// Lister les demandes
const { requests, isLoading } = useBookingRequests(status);

// Créer une demande (venue)
const createRequest = useCreateBookingRequest();
createRequest.mutate(data);

// Répondre à une demande (artist)
const respond = useRespondToBookingRequest();
respond.mutate({ id, data: { action: 'accept' } });

// Statistiques
const { stats } = useBookingRequestStats();
```

#### Notifications
```typescript
// Lister (polling 15s)
const { notifications } = useNotifications(isRead);

// Compteur (polling 10s)
const { count } = useUnreadNotificationsCount();

// Marquer comme lue
const markAsRead = useMarkNotificationAsRead();
markAsRead.mutate(notificationId);

// Tout marquer comme lu
const markAllAsRead = useMarkAllNotificationsAsRead();
markAllAsRead.mutate();
```

### Composants UI

#### MessageThread
Composant tout-en-un pour l'affichage et l'envoi de messages.

```tsx
<MessageThread
  eventId={eventId}
  eventTitle="Concert au Zénith"
/>
```

**Fonctionnalités**:
- Auto-scroll vers les nouveaux messages
- Indicateurs de lecture (✓ / ✓✓)
- Envoi avec Ctrl+Enter
- Polling automatique (5s)

#### BookingRequestList
Liste des demandes avec filtres et actions.

```tsx
<BookingRequestList
  statusFilter="PENDING"
  isArtist={true}
/>
```

**Fonctionnalités**:
- Cards avec toutes les infos (date, budget, durée)
- Actions conditionnelles selon le rôle
- Modal de confirmation pour chaque action

#### NotificationBadge
Badge avec compteur de notifications.

```tsx
<NotificationBadge onClick={handleOpenNotifications} />
```

**Fonctionnalités**:
- Badge avec compteur (99+ si > 99)
- Polling automatique (10s)
- Icône cliquable

---

## 🧪 Tests E2E (Cypress)

### Fichiers de tests créés

1. **`cypress/e2e/messaging/event-messaging.feature`**
   - 8 scénarios Gherkin
   - Couverture: envoi, réception, lecture, polling, validation

2. **`cypress/e2e/booking-requests/booking-request-workflow.feature`**
   - 17 scénarios Gherkin
   - Couverture: création, acceptation, déclinaison, annulation, notifications, validation

### Scénarios clés testés

#### Messaging
- ✅ Envoi de message artiste → venue
- ✅ Réception et marquage automatique comme lu
- ✅ Polling temps réel
- ✅ Raccourci clavier Ctrl+Enter
- ✅ Compteur de non-lus par event
- ✅ Validation des messages vides

#### Booking Requests
- ✅ Venue crée une demande
- ✅ Artiste voit les demandes reçues
- ✅ Artiste accepte → Event créé
- ✅ Artiste décline avec/sans raison
- ✅ Venue annule une demande
- ✅ Statut auto-update PENDING → VIEWED
- ✅ Filtrage par statut
- ✅ Statistiques dashboard
- ✅ Notifications à chaque action
- ✅ Validation des champs obligatoires

### Commandes Cypress

```bash
# Ouvrir Cypress UI
npm run cypress:open

# Lancer les tests headless
npm run cypress:run

# Lancer un test spécifique
npx cypress run --spec "cypress/e2e/messaging/event-messaging.feature"
```

---

## 🚀 Déploiement

### Backend (Render)

1. **Appliquer la migration**:
```bash
npx prisma migrate deploy
```

2. **Build**:
```bash
npm run build
```

3. **Démarrer**:
```bash
npm start
```

### Frontend (Netlify)

1. **Build**:
```bash
npm run build
```

2. **Déployer**:
```bash
netlify deploy --prod
```

---

## 📊 Métriques de l'implémentation

### Code produit
- **Backend**: ~1200 lignes
- **Frontend**: ~1300 lignes
- **Tests**: 25 scénarios (8 messaging + 17 booking requests)
- **Total**: ~2500 lignes de code

### Modules créés
- **Backend**: 3 modules NestJS
- **Frontend**: 8 composants React, 14 hooks
- **Base de données**: 2 modèles, 2 enums, 3 index

### API Endpoints
- **Total**: 14 endpoints REST
- **Tous sécurisés**: JWT AuthGuard

### Performance
- **Polling**: Messages 5s, Notifications 10-15s
- **Auto-scroll**: Temps réel dans MessageList
- **Cache**: TanStack Query avec staleTime configuré

---

## 🔐 Sécurité

### Backend
- ✅ Tous les endpoints protégés par JWT
- ✅ Vérification des permissions (artiste vs venue)
- ✅ Validation des DTOs avec class-validator
- ✅ Prisma pour prévenir les injections SQL

### Frontend
- ✅ Token JWT dans localStorage (Zustand)
- ✅ Intercepteurs Axios pour token automatique
- ✅ Redirection auto si session expirée (401)
- ✅ Validation côté client avec Zod/React Hook Form

---

## 📚 Prochaines étapes (hors MVP)

### Phase 2 - Améliorations
- [ ] WebSockets pour messaging temps réel (Socket.io)
- [ ] Upload de fichiers dans les messages
- [ ] Recherche full-text dans les conversations
- [ ] Archivage des conversations
- [ ] Templates de messages prédéfinis

### Phase 3 - Analytics
- [ ] Dashboard analytics pour booking requests
- [ ] Taux de conversion venue → artist
- [ ] Temps moyen de réponse
- [ ] Export CSV des demandes

---

## 🐛 Troubleshooting

### Backend ne démarre pas
```bash
# Vérifier Prisma Client
npx prisma generate

# Vérifier migrations
npx prisma migrate status

# Reset dev (destructif)
npx prisma migrate reset
```

### Frontend - Erreurs TypeScript
```bash
# Vérifier les imports
npm run build

# Nettoyer node_modules
rm -rf node_modules package-lock.json
npm install
```

### Tests Cypress échouent
```bash
# Vérifier que backend tourne
curl http://localhost:3000/health

# Vérifier que frontend tourne
curl http://localhost:5173

# Nettoyer Cypress cache
npx cypress cache clear
```

---

## 📞 Support

Pour toute question sur cette implémentation, consulter:
- **Specs détaillées**: `docs/MVP_MESSAGING_BOOKING_SPECS.md`
- **Schema Prisma**: `stagecomplete-backend/prisma/schema.prisma`
- **Tests E2E**: `stagecomplete-frontend/cypress/e2e/`

---

**Implémentation complétée avec succès le 11 Octobre 2025** ✅
