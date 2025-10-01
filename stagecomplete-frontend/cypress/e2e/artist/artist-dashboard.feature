Feature: Artist Dashboard
  As a logged-in artist
  I want to access a complete dashboard
  So that I can manage my activity on the platform

  Background:
    Given I am logged in as an artist

  # TODO: Implement artist-specific metrics (vues, clics, demandes)
  # Statistics and charts are currently for Venue dashboard only

  # Scenario: Display dashboard with incomplete profile
  #   Given my profile is not complete
  #   When I go to the dashboard
  #   Then I should see my artist name displayed
  #   And I should see a completion indicator

  Scenario: Display dashboard with complete profile
    Given I have a complete artist profile
    When I go to the dashboard
    Then I should see my artist name displayed
    And I should not see a completion indicator
    And I should see the following quick actions for complete profile:
      | Nouvel événement   |
      | Trouver des venues |
      | Upload contenu     |
      | Paramètres         |

# Scenario: Navigate to artist profile from incomplete dashboard
#   Given my profile is not complete
#   When I am on the dashboard
#   And I click on "Éditer mon profil"
#   Then I should be redirected to the artist profile page

# Scenario: Use profile completion assistant
#   Given my profile is not complete
#   When I am on the dashboard
#   And I click on "Utiliser l'assistant"
#   Then I should be redirected to "/artist/portfolio"