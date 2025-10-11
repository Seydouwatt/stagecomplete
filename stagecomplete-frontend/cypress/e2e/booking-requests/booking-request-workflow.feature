Feature: Booking Request Workflow
  As a venue or artist
  I want to create, accept, decline, or cancel booking requests
  So that I can manage my bookings efficiently

  # ===== VENUE PERSPECTIVE =====

  Scenario: Venue creates a booking request
    Given I am logged in as a venue
    And I am viewing a public artist profile
    When I click on "Envoyer une demande de réservation"
    And I fill in the booking request form with:
      | eventDate | 2025-12-31           |
      | eventType | Concert              |
      | budget    | 1500                 |
      | duration  | 120                  |
      | message   | Soirée du Nouvel An  |
    And I click on "Envoyer la demande"
    Then I should see "Demande de réservation envoyée"
    And the booking request should have status "PENDING"
    And the artist should receive a notification

  Scenario: Venue views their sent booking requests
    Given I am logged in as a venue
    And I have sent 3 booking requests
    When I go to my booking requests page
    Then I should see 3 booking requests in the list
    And each request should show the artist name
    And each request should show the event date
    And each request should show the current status

  Scenario: Venue cancels a pending request
    Given I am logged in as a venue
    And I have a pending booking request
    When I go to my booking requests page
    And I click on "Annuler" for the request
    And I confirm the cancellation with reason "Changement de programme"
    Then I should see "Demande annulée"
    And the request status should be "CANCELLED"
    And the artist should receive a cancellation notification

  Scenario: Venue cannot cancel an accepted request
    Given I am logged in as a venue
    And I have an accepted booking request
    When I go to my booking requests page
    Then I should not see an "Annuler" button for the accepted request
    And the request should show "ACCEPTED" status

  # ===== ARTIST PERSPECTIVE =====

  Scenario: Artist views received booking requests
    Given I am logged in as an artist
    And I have received 2 booking requests
    When I go to my booking requests page
    Then I should see 2 booking requests in the list
    And each request should show the venue name
    And I should see "En attente" badge for pending requests
    And I should see the proposed budget

  Scenario: Artist accepts a booking request
    Given I am logged in as an artist
    And I have a pending booking request from "La Scène Parisienne"
    When I go to my booking requests page
    And I click on "Accepter" for the request
    And I confirm the acceptance
    Then I should see "Demande acceptée ! L'événement a été créé."
    And the request status should be "ACCEPTED"
    And an event should be created in my calendar
    And the venue should receive an acceptance notification

  Scenario: Artist declines a booking request with reason
    Given I am logged in as an artist
    And I have a pending booking request
    When I go to my booking requests page
    And I click on "Décliner" for the request
    And I enter decline reason "Non disponible à cette date"
    And I confirm the decline
    Then I should see "Demande déclinée"
    And the request status should be "DECLINED"
    And the venue should receive a decline notification with the reason

  Scenario: Artist declines without providing a reason
    Given I am logged in as an artist
    And I have a pending booking request
    When I go to my booking requests page
    And I click on "Décliner" for the request
    And I skip the reason field
    And I confirm the decline
    Then I should see "Demande déclinée"
    And the request status should be "DECLINED"

  Scenario: Artist cannot respond to a cancelled request
    Given I am logged in as an artist
    And I have a cancelled booking request
    When I go to my booking requests page
    Then I should not see "Accepter" button for the cancelled request
    And I should not see "Décliner" button for the cancelled request
    And the request should show "CANCELLED" status

  Scenario: Booking request automatically marks as viewed
    Given I am logged in as an artist
    And I have a pending booking request with status "PENDING"
    When I click on "Détails" for the request
    Then the request status should change to "VIEWED"
    And the viewedByArtist flag should be true

  # ===== FILTERING & STATS =====

  Scenario: Filter booking requests by status
    Given I am logged in as an artist
    And I have requests with various statuses:
      | PENDING  | 2 |
      | ACCEPTED | 3 |
      | DECLINED | 1 |
    When I go to my booking requests page
    And I filter by status "PENDING"
    Then I should see only 2 requests
    When I filter by status "ACCEPTED"
    Then I should see only 3 requests

  Scenario: View booking request statistics
    Given I am logged in as an artist
    And I have the following requests:
      | PENDING  | 5 |
      | ACCEPTED | 10 |
      | DECLINED | 2 |
    When I go to my dashboard
    Then I should see "5" pending requests in stats
    And I should see "10" accepted requests in stats
    And I should see "2" declined requests in stats

  # ===== NOTIFICATIONS =====

  Scenario: Notifications for booking request events
    Given I am logged in as an artist
    When I receive a new booking request
    Then I should see a notification "Nouvelle demande de réservation"
    And my notification badge should show "1"
    When I click on the notification
    Then I should be redirected to the booking request details

  # ===== VALIDATION & ERROR HANDLING =====

  Scenario: Venue cannot send request to private artist
    Given I am logged in as a venue
    And I am viewing a private artist profile
    Then I should not see "Envoyer une demande de réservation" button

  Scenario: Validation on booking request form
    Given I am logged in as a venue
    And I am on the booking request form
    When I try to submit without selecting an event date
    Then I should see "La date de l'événement est obligatoire"
    When I try to submit without selecting an event type
    Then I should see "Le type d'événement est obligatoire"

  Scenario: Cannot create duplicate requests
    Given I am logged in as a venue
    And I have a pending booking request for artist "John Doe" on "2025-12-31"
    When I try to create another request for the same artist and date
    Then I should see an error "Vous avez déjà une demande en cours pour cet artiste à cette date"

  # ===== EVENT CREATION ON ACCEPTANCE =====

  Scenario: Event is created with correct details when request is accepted
    Given I am logged in as an artist
    And I have a booking request with:
      | eventDate | 2025-12-31       |
      | eventType | Concert          |
      | budget    | 2000             |
      | duration  | 180              |
    When I accept the booking request
    Then an event should be created with:
      | title     | Concert - Confirmed Booking |
      | date      | 2025-12-31                  |
      | budget    | 2000                        |
      | duration  | 180                         |
      | status    | CONFIRMED                   |
    And the event should be linked to the booking request
    And I should be able to see the event in my calendar
