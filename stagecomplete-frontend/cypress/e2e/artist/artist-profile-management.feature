Feature: Artist Profile Management
  As a logged-in artist
  I want to be able to create and manage my complete artistic profile
  So that I can present my work to venues

  Background:
    Given I am logged in as an artist

  Scenario: Create a complete solo artist profile
    When I go to the artist profile page
    And I fill the general information with:
      | stage_name | Solo Artist Pro                  |
      | bio        | Professional artist for 10 years |
      | location   | Paris, France                    |
      | website    | https://soloartist.com           |
    And I select the musical genres:
      | Pop  |
      | Rock |
    And I enter "10" as years of experience
    And I switch to the "Membres" tab
    And I select artist type "SOLO"
    Then I should see that a default member is created
    And I click on "Sauvegarder"
    Then I should see "Profil sauvegardé avec succès"

  Scenario: Create a band profile with multiple members
    When I go to the artist profile page
    And I switch to the "Membres" tab
    And I select artist type "BAND"
    And I add a member with:
      | name        | Marie Dupont   |
      | role        | Singer         |
      | email       | marie@band.com |
      | instruments | Vocals         |
      | experience  | PROFESSIONAL   |
      | founder     | true           |
    And I add a member with:
      | name        | Paul Martin   |
      | role        | Guitarist     |
      | email       | paul@band.com |
      | instruments | Guitar, Bass  |
      | experience  | EXPERT        |
      | founder     | false         |
    And I click on "Sauvegarder"
    Then I should see "Profil sauvegardé avec succès"
    And I should see 2 members in the list

# Scenario: Edit an existing member
#   Given I have a band profile with 2 members
#   When I go to the artist profile page
#   And I switch to the "Membres" tab
#   And I click on "Modifier" for the first member
#   And I change the role to "Lead Singer"
#   And I add the instrument "Piano"
#   And I click on "Sauvegarder les modifications"
#   Then I should see "Membre modifié avec succès"
#   And the member should display "Lead Singer" as role

# Scenario: Delete a member
#   Given I have a band profile with 2 members
#   When I go to the artist profile page
#   And I switch to the "Membres" tab
#   And I click on "Supprimer" for the second member
#   And I confirm the deletion
#   Then I should see "Membre supprimé avec succès"
#   And I should see 1 member in the list

# Scenario: Member data validation
#   When I go to the artist profile page
#   And I switch to the "Membres" tab
#   And I click on "Ajouter un membre"
#   And I leave the name empty
#   And I enter an invalid email "invalid-email"
#   And I click on "Sauvegarder"
#   Then I should see the validation errors:
#     | Member name is required         |
#     | Email address is not valid      |

# Scenario: Configure artist pricing
#   When I go to the artist profile page
#   And I switch to the "Tarifs" tab
#   And I fill the pricing with:
#     | minimum_rate | 500                           |
#     | maximum_rate | 2000                          |
#     | conditions   | Travel expenses not included  |
#   And I click on "Sauvegarder"
#   Then I should see "Tarifs sauvegardés avec succès"

# Scenario: Preview public profile
# Given I have completed my artist profile
# When I go to the artist profile page
# And I switch to the "Public" tab
# Then I should see a preview of my public profile
# And I should see all my information displayed correctly
# And I should see all my members listed