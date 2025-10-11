Feature: Complete Booking Request Workflow
  As a venue and an artist
  I want to complete the full booking request workflow
  So that we can establish a booking and communicate

  Background:
    Given the application is accessible
    And the backend services are running

  Scenario: Complete workflow from request to messaging
    # Venue creates a booking request
    Given I am logged in as a venue "Blue Note Jazz"
    When I navigate to an artist profile "Jazz Trio"
    And I click "Demander un booking"
    And I fill in the booking request form:
      | Field       | Value                          |
      | eventDate   | 2025-02-14T21:00              |
      | eventType   | CONCERT                        |
      | duration    | 120                            |
      | budget      | 800                            |
      | message     | Soirée St-Valentin spéciale   |
    And I submit the booking request
    Then I should see "Demande envoyée avec succès"
    And I logout

    # Artist sees and accepts the request
    Given I am logged in as the artist "Jazz Trio"
    When I navigate to "/artist/bookings"
    Then I should see a badge with "1" on the "Demandes reçues" tab
    And I should see a booking request from "Blue Note Jazz"
    When I click "Accepter" on the booking request
    And I provide a response message "Avec plaisir! J'ai hâte de jouer chez vous."
    And I confirm the acceptance
    Then I should see "Demande acceptée"
    And the request should move to "Tous mes bookings" tab

    # Artist can now message the venue
    When I click on the "Tous mes bookings" tab
    Then I should see the event "Soirée St-Valentin spéciale"
    And I should see a "Via plateforme" badge
    When I click the message icon for this booking
    Then I should be on the messages page for this event
    And I should see the event details in the header
    When I type "Bonjour, pouvez-vous me confirmer l'adresse exacte?" in the message input
    And I send the message
    Then I should see my message in the thread
    And I logout

    # Venue sees the accepted booking and can respond
    Given I am logged in as the venue "Blue Note Jazz"
    When I navigate to "/messages"
    Then I should see a conversation with "Jazz Trio"
    When I click on the conversation
    Then I should see the message "Bonjour, pouvez-vous me confirmer l'adresse exacte?"
    When I type "123 Rue du Jazz, Paris 75001" in the message input
    And I send the message
    Then I should see both messages in the thread

  Scenario: Artist declines a booking request
    Given I am logged in as a venue "Rock Arena"
    When I create a booking request for artist "Jazz Trio"
    And I logout
    And I am logged in as the artist "Jazz Trio"
    When I navigate to "/artist/bookings"
    And I click "Décliner" on the booking request
    And I provide a decline reason "Désolé, je ne suis pas disponible à cette date"
    And I confirm the decline
    Then I should see "Demande déclinée"
    And the request should be marked as "DECLINED"

  Scenario: Multiple booking requests management
    Given I am an artist with 5 pending booking requests
    When I navigate to "/artist/bookings"
    Then I should see a badge with "5" on the "Demandes reçues" tab
    When I accept 2 requests
    And I decline 1 request
    Then I should see a badge with "2" on the "Demandes reçues" tab
    And I should see 2 events in "Tous mes bookings" tab

  Scenario: Booking request expires after 7 days
    Given I am a venue
    And I created a booking request 8 days ago
    When the artist logs in
    And navigates to "/artist/bookings"
    Then the request should be marked as "EXPIRED"
    And the accept/decline buttons should be disabled

  Scenario: Real-time message updates
    Given an artist and venue are in an active conversation
    When the venue sends a message "Nouvelle information importante"
    Then the artist should see the message appear within 5 seconds
    And the message count badge should update