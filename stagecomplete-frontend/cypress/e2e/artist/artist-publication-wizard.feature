Feature: Artist Publication Wizard
  As an artist
  I want to use a guided 3-step publication wizard
  So that I can easily create and publish my professional profile with quality scoring

  Background:
    Given the application is accessible
    And the backend services are running
    And I am logged in as an artist

  Scenario: Access publication wizard from dashboard
    Given I am on my artist dashboard
    When I click on "Publier mon profil"
    Then I should see the publication wizard with 3 steps
    And I should see the completion score displayed

  Scenario: Step 1 - Basic Information
    Given I am on the publication wizard step 1
    When I enter "Jazz Virtuoso" as artist name
    And I enter "Je suis un artiste passionné avec plus de 10 ans d'expérience dans le jazz et le blues. Ma musique combine tradition et innovation." as artist description
    And I select "SOLO" as artist type
    And I select "MUSIC" as artist discipline
    And I select "Jazz" and "Blues" as genres
    And I enter "Paris" as base location
    Then I should be able to proceed to step 2

  Scenario: Step 2 - Portfolio Creative
    Given I am on the publication wizard step 2
    When I upload at least one portfolio photo
    And I add a Spotify link
    And I add a YouTube link
    And I add a SoundCloud link
    And I add an Instagram link
    And I add a demo video URL
    And I select a price range
    Then I should be able to proceed to step 3

  Scenario: Step 3 - Preview and Publish
    Given I am on the publication wizard step 3
    Then I should see a before/after completion comparison
    And I should see my estimated completion percentage
    And I should see a preview of my artist card
    And I should see a checkbox to publish my profile
    When I check "Publier mon profil maintenant"
    And I click "Publier le profil"
    Then the wizard should complete successfully

  Scenario: Step 3 - Save as Draft
    Given I am on the publication wizard step 3
    When I leave the "Publier mon profil maintenant" checkbox unchecked
    And I click "Sauvegarder en brouillon"
    Then the wizard should complete successfully
    And my profile should remain private

  Scenario: Validation on Step 1
    Given I am on the publication wizard step 1
    When I try to proceed without entering artist name
    Then I should see a validation error for artist name
    When I enter "Test" as artist name
    And I try to proceed without entering description
    Then I should see a validation error for description
    When I enter a description shorter than 20 characters
    Then I should see a validation error for description length
    When I enter a valid description of at least 20 characters
    And I try to proceed without selecting genres
    Then I should see a validation error for genres
    When I try to proceed without entering location
    Then I should see a validation error for location

  Scenario: Validation on Step 2
    Given I am on the publication wizard step 2
    When I try to proceed without uploading any portfolio photo
    Then I should see a validation error for portfolio photos

  Scenario: Navigate between wizard steps
    Given I am on the publication wizard step 1
    When I fill all required fields in step 1
    And I proceed to step 2
    Then I should see step 2 content
    When I click "Précédent"
    Then I should see step 1 content
    And my previously entered data should be preserved

  Scenario: Close wizard
    Given I am in the publication wizard
    When I click the close button
    Then the wizard should close
    And I should return to the dashboard

  Scenario: Profile completion indicator updates
    Given I am on the publication wizard step 1
    When I start filling the form
    Then the estimated completion percentage should increase
    When I complete all fields in step 1 and step 2
    And I go to step 3
    Then I should see a higher completion percentage than when I started

  Scenario: Missing items alert on incomplete profile
    Given I have an incomplete artist profile
    When I open the publication wizard
    Then I should see an alert showing missing items count
    And the alert should mention "Cet assistant va vous aider à les compléter"

  Scenario: Portfolio photo becomes main photo
    Given I am on the publication wizard step 2
    When I upload a portfolio photo
    Then I should see an info message explaining that the first photo will be used as the main profile photo
