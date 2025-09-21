Feature: Artist Publication Wizard
  As an artist
  I want to use a guided 3-step publication wizard
  So that I can easily create and publish my professional profile with quality scoring

  Background:
    Given the application is accessible
    And the backend services are running
    And I am logged in as an artist

  Scenario: Complete publication wizard with quality scoring
    Given I am on my artist dashboard
    When I click on "Publier mon profil"
    Then I should see the publication wizard with 3 steps
    And I should see the quality score at 0%

  Scenario: Step 1 - Basic Information
    Given I am on the publication wizard step 1
    When I upload a main photo
    And I enter "Jazz Virtuoso" as artist name
    And I enter a description of at least 50 characters
    And I select "Solo" as artist type
    And I select "Jazz" and "Blues" as genres
    And I enter "Paris" as base location
    Then the quality score should increase to at least 40%
    And I should be able to proceed to step 2

  Scenario: Step 2 - Portfolio Creative
    Given I am on the publication wizard step 2
    And I have existing portfolio photos
    When I add additional portfolio photos
    And I add YouTube links for videos
    And I add SoundCloud links for audio
    And I add Instagram and Facebook social links
    Then the quality score should increase to at least 70%
    And I should be able to proceed to step 3

  Scenario: Step 3 - Publication & Preview
    Given I am on the publication wizard step 3
    And my quality score is at least 80%
    When I preview my public profile
    Then I should see a comparison between private and public view
    And I should see the generated public URL
    And I should see social sharing buttons

  Scenario: Publish profile successfully
    Given I have completed all wizard steps
    And my quality score is 100%
    When I click "Publier maintenant"
    Then I should see a success confirmation
    And my profile should be marked as public
    And I should receive the shareable URL
    And I should see next steps suggestions

  Scenario: Quality scoring validation
    Given I am in the publication wizard
    When I have no main photo
    Then the quality score should show -20 points for missing photo
    When I have a description under 50 characters
    Then the quality score should show -15 points for short description
    When I have no genres selected
    Then the quality score should show -10 points for missing genres
    When I have no social links
    Then the quality score should show -10 points for missing social presence

  Scenario: Save draft and resume later
    Given I am in the middle of the publication wizard
    When I navigate away from the wizard
    And I return to the wizard later
    Then my progress should be saved
    And I should be able to continue from where I left off

  Scenario: Cancel wizard and keep changes
    Given I have made changes in the publication wizard
    When I click "Annuler"
    Then I should see a confirmation dialog
    When I confirm cancellation
    Then my changes should be saved to my profile
    But my profile should remain private