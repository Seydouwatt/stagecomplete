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
    And I add a member with:

      | artistName   | Marie D.                                                                               |
      | firstName    | Marie                                                                                  |
      | lastName     | Dupont                                                                                 |
      | role         | Guitarist                                                                              |
      | instrument   | Guitar                                                                                 |
      | bio          | Guitar player                                                                          |
      | location     | Paris, France                                                                          |
      | website      | https://guitar.com                                                                     |
      | social_links | { facebook: "https://facebook.com/guitar", instagram: "https://instagram.com/guitar" } |
    And I click on "Ajouter"
    And I click on Sauvegarder
    Then I should see that a default member is created
    And I should see "Profil sauvegardé avec succès"

  Scenario: Create a band profile with multiple members
    When I go to the artist profile page
    And I switch to the "Membres" tab
    And I select artist type "BAND"
    And I select the number of members "2"
    And I click on Sauvegarder
    And I add a member with:
      | artistName   | Marie D.                                                                           |
      | firstName    | Marie                                                                              |
      | lastName     | Dupont                                                                             |
      | role         | Singer                                                                             |
      | email        | marie@band.com                                                                     |
      | instrument   | Chant                                                                              |
      | bio          | Singer                                                                             |
      | location     | Paris, France                                                                      |
      | website      | https://sing.com                                                                   |
      | social_links | { facebook: "https://facebook.com/sing", instagram: "https://instagram.com/sing" } |
    And I click on "Ajouter"
    And I add a member with:
      | artistName   | Paul Martin                                                                            |
      | firstName    | Paul                                                                                   |
      | lastName     | Martin                                                                                 |
      | role         | Guitarist                                                                              |
      | email        | paul@band.com                                                                          |
      | instrument   | Guitare                                                                                |
      | bio          | Guitarist                                                                              |
      | location     | Paris, France                                                                          |
      | website      | https://guitar.com                                                                     |
      | social_links | { facebook: "https://facebook.com/guitar", instagram: "https://instagram.com/guitar" } |
    And I click on "Ajouter"
    And I click on Sauvegarder
    Then I should see "Profil sauvegardé avec succès"
    And I should see 2 member in the list

  Scenario: Edit an existing member
    When I go to the artist profile page
    And I switch to the "Membres" tab
    And I select artist type "BAND"
    And I select the number of members "2"
    And I click on Sauvegarder
    And I add a member with:
      | artistName   | Marie D.                                                                           |
      | firstName    | Marie                                                                              |
      | lastName     | Dupont                                                                             |
      | role         | Singer                                                                             |
      | email        | marie@band.com                                                                     |
      | instrument   | Chant                                                                              |
      | bio          | Singer                                                                             |
      | location     | Paris, France                                                                      |
      | website      | https://sing.com                                                                   |
      | social_links | { facebook: "https://facebook.com/sing", instagram: "https://instagram.com/sing" } |
    And I click on "Ajouter"
    And I add a member with:
      | artistName   | Paul Martin                                                                            |
      | firstName    | Paul                                                                                   |
      | lastName     | Martin                                                                                 |
      | role         | Guitarist                                                                              |
      | email        | paul@band.com                                                                          |
      | instrument   | Guitare                                                                                |
      | bio          | Guitarist                                                                              |
      | location     | Paris, France                                                                          |
      | website      | https://guitar.com                                                                     |
      | social_links | { facebook: "https://facebook.com/guitar", instagram: "https://instagram.com/guitar" } |
    And I click on "Ajouter"
    And I click on Sauvegarder
    Then I should see "Profil sauvegardé avec succès"
    And I should see 2 member in the list
    When I click on "edit" for the first member
    And I change the role to "Guitare"
    And I click on "Ajouter"
    Then I should see "Marie D. Dupont a été modifié avec succès"

  Scenario: Delete a member
    When I go to the artist profile page
    And I switch to the "Membres" tab
    And I select artist type "BAND"
    And I select the number of members "2"
    And I click on Sauvegarder
    And I add a member with:
      | artistName   | Marie D.                                                                           |
      | firstName    | Marie                                                                              |
      | lastName     | Dupont                                                                             |
      | role         | Singer                                                                             |
      | email        | marie@band.com                                                                     |
      | instrument   | Chant                                                                              |
      | bio          | Singer                                                                             |
      | location     | Paris, France                                                                      |
      | website      | https://sing.com                                                                   |
      | social_links | { facebook: "https://facebook.com/sing", instagram: "https://instagram.com/sing" } |
    And I click on "Ajouter"
    And I add a member with:
      | artistName   | Paul Martin                                                                            |
      | firstName    | Paul                                                                                   |
      | lastName     | Martin                                                                                 |
      | role         | Guitarist                                                                              |
      | email        | paul@band.com                                                                          |
      | instrument   | Guitare                                                                                |
      | bio          | Guitarist                                                                              |
      | location     | Paris, France                                                                          |
      | website      | https://guitar.com                                                                     |
      | social_links | { facebook: "https://facebook.com/guitar", instagram: "https://instagram.com/guitar" } |
    And I click on "Ajouter"
    And I click on Sauvegarder
    Then I should see "Profil sauvegardé avec succès"
    And I should see 2 member in the list
    And I click on "delete" for the second member
    Then I should see "Membre supprimé"
    And I should see 1 member in the list

  Scenario: Member data validation
    When I go to the artist profile page
    And I switch to the "Membres" tab
    And I click on "Ajouter un membre"
    And I leave the name empty
    And I click on "Ajouter"
    Then I should see the validation errors:
      | Le nom de l'artiste est obligatoire |


  Scenario: Configure artist pricing
    When I go to the artist profile page
    And I switch to the "Tarifs" tab
    And I fill the pricing with:
      | minimum_rate | 500                          |
      | maximum_rate | 2000                         |
      | conditions   | Travel expenses not included |
    And I click on Sauvegarder
    Then I should see "Profil sauvegardé avec succès !"

  Scenario: Preview public profile
    # Given I have completed my artist profile
    When I go to the artist profile page
    And I fill the general information with:
      | stage_name | Solo Artist Pro                  |
      | bio        | Professional artist for 10 years |
      | location   | Paris, France                    |
      | website    | https://soloartist.com           |
    And I select the musical genres:
      | Pop  |
      | Rock |
    And I switch to the "Public" tab
    And I click on "Rendre mon profil public"
    Then I should see a preview of my public profile
    And I should see all my information displayed correctly
    And I should see all my members listed