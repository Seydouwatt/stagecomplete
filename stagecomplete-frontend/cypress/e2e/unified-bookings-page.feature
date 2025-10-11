Feature: Unified Bookings Page
  As an artist
  I want to manage all my bookings in one place
  So that I can see requests, confirmed bookings, and my calendar together

  Background:
    Given the application is accessible
    And the backend services are running

  Scenario: Artist views unified bookings page with tabs
    Given I am logged in as an artist
    When I navigate to "/artist/bookings"
    Then I should see the page title "Mes Bookings"
    And I should see 3 tabs:
      | Tab Name         |
      | Demandes reçues  |
      | Tous mes bookings |
      | Calendrier       |
    And the "Demandes reçues" tab should be active by default

  Scenario: Artist switches between tabs
    Given I am logged in as an artist
    And I am on "/artist/bookings"
    When I click on the "Tous mes bookings" tab
    Then the "Tous mes bookings" tab should be active
    And I should see the bookings list or empty state
    When I click on the "Calendrier" tab
    Then the "Calendrier" tab should be active
    And I should see the calendar view

  Scenario: Artist sees pending requests with notification badge
    Given I am logged in as an artist
    And I have 3 pending booking requests
    When I navigate to "/artist/bookings"
    Then I should see a badge with "3" on the "Demandes reçues" tab
    And I should see 3 booking request cards when viewing the requests tab

  Scenario: Artist views all bookings with source indicators
    Given I am logged in as an artist
    And I have 2 manual bookings
    And I have 1 accepted platform booking
    When I navigate to "/artist/bookings"
    And I click on the "Tous mes bookings" tab
    Then I should see 3 total bookings
    And I should see "Manuel" badge on manual bookings
    And I should see "Via plateforme" badge on platform bookings

  Scenario: Artist creates a manual booking
    Given I am logged in as an artist
    And I am on "/artist/bookings"
    When I click on "Ajouter un booking"
    Then I should be redirected to "/artist/bookings/new"
    When I fill in the booking form:
      | Field       | Value                     |
      | title       | Concert au Blue Note      |
      | date        | 2025-01-15T20:00         |
      | location    | Blue Note Jazz Club       |
      | budget      | 500                       |
      | description | Soirée jazz acoustique    |
    And I click "Enregistrer"
    Then I should be redirected to "/artist/bookings"
    And I should see "Concert au Blue Note" in my bookings list

  Scenario: Artist accesses messages from platform booking
    Given I am logged in as an artist
    And I have an accepted platform booking with id "event-123"
    When I navigate to "/artist/bookings"
    And I click on the "Tous mes bookings" tab
    And I click the message icon for the platform booking
    Then I should be redirected to "/messages/event-123"

  Scenario: Calendar view shows all bookings
    Given I am logged in as an artist
    And I have 1 manual booking on "2025-01-10"
    And I have 1 platform event on "2025-01-15"
    When I navigate to "/artist/bookings"
    And I click on the "Calendrier" tab
    Then I should see 2 events on the calendar
    And I should see an event on "January 10, 2025"
    And I should see an event on "January 15, 2025"

  Scenario: Empty states for each tab
    Given I am logged in as a new artist with no bookings
    When I navigate to "/artist/bookings"
    Then I should see "Aucune demande en attente" in the requests tab
    When I click on the "Tous mes bookings" tab
    Then I should see "Aucun booking pour le moment"
    And I should see a "Créer mon premier booking" button
    When I click on the "Calendrier" tab
    Then I should see an empty calendar

  Scenario: Stats cards display correct information
    Given I am logged in as an artist
    And I have:
      | Type                  | Count |
      | Pending requests      | 2     |
      | Upcoming bookings     | 5     |
      | This month bookings   | 3     |
      | Total revenue         | 1500  |
    When I navigate to "/artist/bookings"
    Then I should see stats cards with:
      | Stat                | Value |
      | Nouvelles demandes  | 2     |
      | À venir            | 5     |
      | Ce mois            | 3     |
      | Revenue total      | 1500€ |