# MVP Core: Messaging + Booking Request Workflow

## Vue d'ensemble

Transformation de StageComplete d'une plateforme "artist self-service" vers un **marketplace bidirectionnel** où venues et artistes peuvent se découvrir et négocier des bookings.

### Objectifs MVP
1. ✅ **Booking Request Workflow**: Venue → Artist → Accept/Decline
2. ✅ **Messaging System**: Communication contextuelle par booking
3. ✅ **Notifications**: Alertes temps réel des actions importantes
4. ✅ **Tests E2E**: Couverture complète des flows critiques

---

## Architecture Système

### 1. Database Schema

```prisma
// NOUVEAU MODEL - Demande de booking initiée par venue
model BookingRequest {
  id          String   @id @default(cuid())

  // Qui demande quoi
  venueId     String
  artistId    String

  // Détails de la demande
  eventDate   DateTime
  eventType   String   // "CONCERT", "COMEDY", etc.
  budget      Float?
  duration    Int?     // minutes
  message     String?  // Message initial de la venue

  // Workflow status
  status      BookingRequestStatus @default(PENDING)

  // Metadata
  viewedByArtist Boolean @default(false)
  respondedAt    DateTime?

  // Relations
  venue       Venue  @relation(fields: [venueId], references: [id], onDelete: Cascade)
  artist      Artist @relation(fields: [artistId], references: [id], onDelete: Cascade)

  // Si accepté, référence à l'Event créé
  eventId     String?  @unique
  event       Event?   @relation(fields: [eventId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([artistId, status])
  @@index([venueId, status])
  @@map("booking_requests")
}

enum BookingRequestStatus {
  PENDING      // Venue a envoyé, artiste n'a pas encore répondu
  VIEWED       // Artiste a vu la demande
  ACCEPTED     // Artiste a accepté → Event créé
  DECLINED     // Artiste a refusé
  CANCELLED    // Venue a annulé avant réponse
  EXPIRED      // Timeout (optionnel pour v2)
}

// NOUVEAU MODEL - Notifications système
model Notification {
  id          String   @id @default(cuid())

  userId      String   // Destinataire
  type        NotificationType
  title       String
  message     String

  // Context
  relatedId   String?  // ID de l'objet lié (bookingRequestId, eventId, etc.)
  relatedType String?  // "BOOKING_REQUEST", "MESSAGE", etc.

  isRead      Boolean  @default(false)
  readAt      DateTime?

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt   DateTime @default(now())

  @@index([userId, isRead])
  @@map("notifications")
}

enum NotificationType {
  BOOKING_REQUEST_RECEIVED   // Artiste reçoit une demande
  BOOKING_REQUEST_ACCEPTED   // Venue : artiste a accepté
  BOOKING_REQUEST_DECLINED   // Venue : artiste a refusé
  NEW_MESSAGE                // Nouveau message
  BOOKING_REMINDER           // Rappel J-7, J-1
}

// MODIFICATIONS EXISTANTES

// Event - Ajouter relation BookingRequest
model Event {
  // ... champs existants

  // NOUVEAU: Si cet event vient d'un booking request
  bookingRequest BookingRequest?

  // ... reste inchangé
}

// User - Ajouter relation Notifications
model User {
  // ... champs existants

  notifications Notification[]

  // ... reste inchangé
}

// Venue - Ajouter relation BookingRequests
model Venue {
  // ... champs existants

  bookingRequests BookingRequest[]

  // ... reste inchangé
}

// Artist - Ajouter relation BookingRequests
model Artist {
  // ... champs existants

  bookingRequests BookingRequest[]

  // ... reste inchangé
}
```

---

## 2. Flow Diagrams

### Flow A: Booking Request (Happy Path)

```
VENUE                          BACKEND                        ARTIST
  │                               │                              │
  │ 1. Browse artist profiles     │                              │
  │    (recherche/filtres)        │                              │
  │                               │                              │
  │ 2. POST /booking-requests     │                              │
  ├──────────────────────────────>│                              │
  │                               │ 3. Create BookingRequest     │
  │                               │    status=PENDING            │
  │                               │                              │
  │                               │ 4. Emit event                │
  │                               │    "booking-request.created" │
  │                               │                              │
  │                               │ 5. Create Notification       │
  │                               │    for artist                │
  │                               ├─────────────────────────────>│
  │                               │                              │ 6. Artist sees notification
  │                               │                              │    "Nouvelle demande"
  │                               │                              │
  │                               │ 7. GET /booking-requests     │
  │                               │<─────────────────────────────┤
  │                               │                              │
  │                               │ 8. Return requests           │
  │                               │  (status=PENDING)            │
  │                               ├─────────────────────────────>│
  │                               │                              │
  │                               │                              │ 9. Artist clicks "Accept"
  │                               │                              │
  │                               │ 10. PUT /booking-requests/:id│
  │                               │     {action: "accept"}       │
  │                               │<─────────────────────────────┤
  │                               │                              │
  │                               │ 11. Update status=ACCEPTED   │
  │                               │     Create Event             │
  │                               │     Link BookingRequest      │
  │                               │                              │
  │                               │ 12. Emit event               │
  │                               │     "booking-request.accepted"│
  │                               │                              │
  │ 13. Notification "Accepté"    │                              │
  │<──────────────────────────────┤                              │
  │                               │                              │
  │ 14. GET /events/:id           │                              │
  ├──────────────────────────────>│                              │
  │                               │                              │
  │ 15. Exchange messages         │                              │
  │    POST /messages             │                              │
  │<─────────────────────────────>│<────────────────────────────>│
  │                               │                              │
```

### Flow B: Booking Request (Decline)

```
ARTIST                         BACKEND                        VENUE
  │                               │                              │
  │ 1. GET /booking-requests      │                              │
  ├──────────────────────────────>│                              │
  │                               │                              │
  │ 2. Artist clicks "Decline"    │                              │
  │                               │                              │
  │ 3. PUT /booking-requests/:id  │                              │
  │    {action: "decline",        │                              │
  │     reason: "..."}            │                              │
  ├──────────────────────────────>│                              │
  │                               │                              │
  │                               │ 4. Update status=DECLINED    │
  │                               │                              │
  │                               │ 5. Emit event                │
  │                               │    "booking-request.declined"│
  │                               │                              │
  │                               │ 6. Create Notification       │
  │                               ├─────────────────────────────>│
  │                               │                              │
  │                               │                              │ 7. Venue sees notification
  │                               │                              │    "Demande refusée"
```

### Flow C: Messaging

```
USER A                         BACKEND                        USER B
  │                               │                              │
  │ 1. Open event/booking         │                              │
  │    GET /messages/:eventId     │                              │
  ├──────────────────────────────>│                              │
  │                               │                              │
  │                               │ 2. Return messages           │
  │<──────────────────────────────┤                              │
  │                               │                              │
  │ 3. Type message & send        │                              │
  │    POST /messages             │                              │
  │    {eventId, content}         │                              │
  ├──────────────────────────────>│                              │
  │                               │                              │
  │                               │ 4. Create Message            │
  │                               │                              │
  │                               │ 5. Emit event                │
  │                               │    "message.created"         │
  │                               │                              │
  │                               │ 6. Create Notification       │
  │                               │    for USER B                │
  │                               ├─────────────────────────────>│
  │                               │                              │
  │                               │                              │ 7. Poll or WebSocket update
  │                               │    GET /messages/:eventId    │
  │                               │<─────────────────────────────┤
  │                               │                              │
  │                               │ 8. Return new messages       │
  │                               ├─────────────────────────────>│
  │                               │                              │
  │                               │                              │ 9. Mark as read
  │                               │    PUT /messages/:id/read    │
  │                               │<─────────────────────────────┤
```

---

## 3. API Contracts

### BookingRequest API

#### POST /api/booking-requests
**Auth**: Venue role required
**Body**:
```typescript
{
  artistId: string;
  eventDate: string; // ISO 8601
  eventType: string;
  budget?: number;
  duration?: number; // minutes
  message?: string;
}
```
**Response** (201):
```typescript
{
  id: string;
  venueId: string;
  artistId: string;
  eventDate: string;
  eventType: string;
  budget: number | null;
  duration: number | null;
  message: string | null;
  status: "PENDING";
  createdAt: string;
}
```

#### GET /api/booking-requests
**Auth**: Required (Artist or Venue)
**Query params**:
- `status?: PENDING | VIEWED | ACCEPTED | DECLINED`
- `fromDate?: string` (ISO 8601)

**Response** (200):
```typescript
{
  requests: Array<{
    id: string;
    venue: { id, name, venueType, profile: {...} };
    artist: { id, artistName, profile: {...} };
    eventDate: string;
    eventType: string;
    budget: number | null;
    status: BookingRequestStatus;
    message: string | null;
    createdAt: string;
  }>;
}
```

#### GET /api/booking-requests/:id
**Auth**: Required (must be artist or venue involved)
**Response** (200):
```typescript
{
  id: string;
  venue: {...};
  artist: {...};
  eventDate: string;
  eventType: string;
  budget: number | null;
  duration: number | null;
  message: string | null;
  status: BookingRequestStatus;
  viewedByArtist: boolean;
  respondedAt: string | null;
  event?: {...}; // Si accepté
  createdAt: string;
  updatedAt: string;
}
```

#### PUT /api/booking-requests/:id
**Auth**: Artist (pour accept/decline) ou Venue (pour cancel)
**Body**:
```typescript
{
  action: "accept" | "decline" | "cancel";
  reason?: string; // Optionnel pour decline
}
```
**Response** (200):
```typescript
{
  id: string;
  status: "ACCEPTED" | "DECLINED" | "CANCELLED";
  eventId?: string; // Si accepté
  respondedAt: string;
}
```

---

### Message API

#### GET /api/messages
**Auth**: Required
**Query params**:
- `eventId: string` (required)

**Response** (200):
```typescript
{
  messages: Array<{
    id: string;
    content: string;
    senderId: string;
    sender: {
      id: string;
      profile: { name, avatar };
    };
    isRead: boolean;
    createdAt: string;
  }>;
}
```

#### POST /api/messages
**Auth**: Required
**Body**:
```typescript
{
  eventId: string;
  content: string;
}
```
**Response** (201):
```typescript
{
  id: string;
  content: string;
  senderId: string;
  eventId: string;
  isRead: false;
  createdAt: string;
}
```

#### PUT /api/messages/:id/read
**Auth**: Required (must be recipient)
**Response** (200):
```typescript
{
  id: string;
  isRead: true;
}
```

#### GET /api/messages/unread-count
**Auth**: Required
**Response** (200):
```typescript
{
  count: number;
  byEvent: Record<string, number>; // eventId -> count
}
```

---

### Notification API

#### GET /api/notifications
**Auth**: Required
**Query params**:
- `unreadOnly?: boolean` (default: false)
- `limit?: number` (default: 50)

**Response** (200):
```typescript
{
  notifications: Array<{
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedId: string | null;
    relatedType: string | null;
    isRead: boolean;
    createdAt: string;
  }>;
  unreadCount: number;
}
```

#### PUT /api/notifications/:id/read
**Auth**: Required
**Response** (200):
```typescript
{
  id: string;
  isRead: true;
}
```

#### PUT /api/notifications/mark-all-read
**Auth**: Required
**Response** (200):
```typescript
{
  updated: number;
}
```

---

## 4. Event System (Backend)

### EventEmitter Events

```typescript
// booking-request.events.ts

export enum BookingRequestEvent {
  CREATED = 'booking-request.created',
  VIEWED = 'booking-request.viewed',
  ACCEPTED = 'booking-request.accepted',
  DECLINED = 'booking-request.declined',
  CANCELLED = 'booking-request.cancelled',
}

export interface BookingRequestCreatedPayload {
  requestId: string;
  venueId: string;
  artistId: string;
  artistUserId: string; // Pour notification
  eventDate: Date;
}

export interface BookingRequestRespondedPayload {
  requestId: string;
  venueId: string;
  venueUserId: string; // Pour notification
  artistId: string;
  status: 'ACCEPTED' | 'DECLINED';
  eventId?: string; // Si accepté
}

// message.events.ts

export enum MessageEvent {
  CREATED = 'message.created',
  READ = 'message.read',
}

export interface MessageCreatedPayload {
  messageId: string;
  eventId: string;
  senderId: string;
  recipientUserIds: string[]; // Tous sauf sender
  content: string;
}
```

### Listeners

```typescript
// notification.listener.ts

@Injectable()
export class NotificationListener {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('booking-request.created')
  async handleBookingRequestCreated(payload: BookingRequestCreatedPayload) {
    await this.prisma.notification.create({
      data: {
        userId: payload.artistUserId,
        type: 'BOOKING_REQUEST_RECEIVED',
        title: 'Nouvelle demande de booking',
        message: `Une venue souhaite vous booker le ${formatDate(payload.eventDate)}`,
        relatedId: payload.requestId,
        relatedType: 'BOOKING_REQUEST',
      },
    });
  }

  @OnEvent('booking-request.accepted')
  async handleBookingRequestAccepted(payload: BookingRequestRespondedPayload) {
    await this.prisma.notification.create({
      data: {
        userId: payload.venueUserId,
        type: 'BOOKING_REQUEST_ACCEPTED',
        title: 'Demande acceptée !',
        message: `L'artiste a accepté votre demande de booking`,
        relatedId: payload.requestId,
        relatedType: 'BOOKING_REQUEST',
      },
    });
  }

  // ... autres listeners
}
```

---

## 5. Frontend Components

### Composants clés

```typescript
// MessageThread.tsx
interface MessageThreadProps {
  eventId: string;
  currentUserId: string;
}

// BookingRequestCard.tsx
interface BookingRequestCardProps {
  request: BookingRequest;
  userRole: 'artist' | 'venue';
  onAccept?: (id: string) => void;
  onDecline?: (id: string, reason?: string) => void;
  onCancel?: (id: string) => void;
}

// BookingRequestList.tsx
interface BookingRequestListProps {
  userRole: 'artist' | 'venue';
  filter?: BookingRequestStatus;
}

// NotificationBell.tsx
interface NotificationBellProps {
  userId: string;
  onNotificationClick?: (notification: Notification) => void;
}
```

---

## 6. Tests E2E (Cypress)

### Test Files à créer

#### `booking-request-workflow.feature`
```gherkin
Feature: Booking Request Workflow
  As a venue
  I want to send booking requests to artists
  So that I can book performances

  Background:
    Given the application is accessible
    And I am logged in as a venue owner

  Scenario: Send booking request to artist
    Given I am on the artist public profile page for "Jazz Virtuoso"
    When I click on "Demander un booking"
    And I fill the booking request form with:
      | eventDate | 2025-12-25 |
      | eventType | CONCERT    |
      | budget    | 1000       |
      | message   | Would love to have you! |
    And I click "Envoyer la demande"
    Then I should see a success message "Demande envoyée"
    And the booking request should be created with status "PENDING"

  Scenario: Artist accepts booking request
    Given I am logged out
    And I am logged in as an artist
    And I have a pending booking request from "Le Blue Note"
    When I navigate to my booking requests page
    Then I should see 1 booking request with status "PENDING"
    When I click on the booking request
    And I click "Accepter"
    Then the booking request status should be "ACCEPTED"
    And an event should be created
    And the venue should receive a notification "Demande acceptée"

  Scenario: Artist declines booking request
    Given I am logged in as an artist
    And I have a pending booking request
    When I view the booking request
    And I click "Refuser"
    And I enter decline reason "Déjà booké ce jour-là"
    And I confirm decline
    Then the booking request status should be "DECLINED"
    And the venue should receive a notification "Demande refusée"
```

#### `messaging.feature`
```gherkin
Feature: Messaging System
  As a user (artist or venue)
  I want to send messages about a booking
  So that I can communicate details

  Background:
    Given the application is accessible
    And there is an accepted booking request with event

  Scenario: Send message as venue
    Given I am logged in as the venue owner
    When I navigate to the event page
    And I type "Quelle heure souhaitez-vous arriver ?" in the message input
    And I click "Envoyer"
    Then the message should appear in the thread
    And the artist should receive a notification "Nouveau message"

  Scenario: Artist receives and reads message
    Given I am logged in as the artist
    And I have 1 unread message
    When I navigate to notifications
    Then I should see a notification "Nouveau message"
    When I click on the notification
    Then I should be redirected to the event messages page
    And the message should be marked as read
    And the unread count should decrease by 1

  Scenario: Message thread displays correctly
    Given I am logged in as the venue owner
    And there are 5 messages in the event thread
    When I navigate to the event messages page
    Then I should see 5 messages in chronological order
    And my messages should be aligned to the right
    And artist messages should be aligned to the left
```

---

## 7. Critères de Succès MVP

### Fonctionnel
- ✅ Venue peut envoyer booking request à un artiste
- ✅ Artiste reçoit notification et peut voir la demande
- ✅ Artiste peut accepter → Event créé automatiquement
- ✅ Artiste peut refuser → Venue notifiée
- ✅ Messages échangeables dans le contexte d'un Event
- ✅ Compteur de messages non lus fonctionnel
- ✅ Notifications visibles et cliquables

### Technique
- ✅ Migrations Prisma passent sans erreur
- ✅ API respecte les contracts
- ✅ Guards protègent les endpoints (authorization)
- ✅ Tests E2E passent à 100%
- ✅ Pas de régression sur features existantes

### UX
- ✅ Flow intuitif sans documentation
- ✅ Feedback immédiat sur chaque action
- ✅ Erreurs affichées clairement
- ✅ Design cohérent avec l'existant

---

## 8. Post-MVP (Phase 2)

### WebSocket pour temps réel
- Socket.IO ou WS natif
- Live message updates
- Typing indicators
- Online status

### Features avancées
- Message attachments (files, images)
- Thread replies
- Message reactions
- Search/filter messages
- Email notifications
- SMS notifications (Twilio)

### Analytics
- Response rate tracking
- Average response time
- Booking conversion funnel
- Message engagement metrics

---

## Timeline Estimée

**Session actuelle (~120k tokens):**
- ✅ Specs & Architecture (FAIT)
- Backend implementation (2-3h)
- Frontend components (2h)
- Tests E2E (1-2h)

**Post-session (2-3 semaines):**
- Semaine 1: Polish UX + edge cases
- Semaine 2: WebSocket temps réel
- Semaine 3: Beta testing + fixes

**Prêt pour production:** ~3-4 semaines

---

## Notes Importantes

### Sécurité
- Authorization guards sur tous les endpoints
- Vérifier ownership avant actions (artist owns request, venue owns request)
- Rate limiting sur messaging (éviter spam)
- Validation stricte des inputs

### Performance
- Index sur `[artistId, status]` et `[venueId, status]`
- Pagination sur messages (lazy loading)
- Cache notifications count (Redis futur)

### Edge Cases
- Booking request pour date passée → reject
- Double accept d'une request → idempotence
- Artist supprime son profil → cascade delete requests
- Venue cancelled avant réponse → status CANCELLED
