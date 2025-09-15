Feature: Artist Authentication
  As an artist
  I want to be able to create an account and log in
  So that I can access my personalized space on StageComplete

  Background:
    Given the application is accessible
    And the backend services are running

  Scenario: Registration of a new artist
    Given I am on the homepage
    When I click on "Créer mon compte"
    And I fill the registration form with valid data
    And I submit the form
    Then I should be redirected to the artist dashboard
    And I should see the artist name displayed

  Scenario: Login with valid credentials
    Given an artist exists with email "existing@stagecomplete.fr" and password "TestPass123!"
    When I go to the login page
    And I enter "existing@stagecomplete.fr" as email
    And I enter "TestPass123!" as password
    And I click on "Se connecter"
    Then I should be redirected to the artist dashboard
    And my session should be saved

  Scenario: Login with invalid credentials
    When I go to the login page
    And I enter "invalid@email.com" as email
    And I enter "wrongpassword" as password
    And I click on "Se connecter"
    Then I should see an error "Identifiants invalides"
    And I should remain on the login page

  Scenario: Session persistence after page refresh
    Given I am logged in as an artist
    When I refresh the page
    Then I should still be logged in
    And I should see my artist dashboard

  Scenario: Logout
    Given I am logged in as an artist
    # When I click on my profile in the header
    When I click on "Se déconnecter"
    Then I should be redirected to the homepage
    And my session should be cleared