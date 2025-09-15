Feature: Artist Dashboard
  As a logged-in artist
  I want to access a complete dashboard
  So that I can manage my activity on the platform

  Background:
    Given I am logged in as an artist

  Scenario: Display artist dashboard
    When I go to the dashboard
    Then I should see my artist name displayed
    And I should see the following sections:
      | Statistics      |
      | Quick actions   |
      | Artist profile  |
      | Charts          |

  Scenario: Navigate to artist profile
    When I am on the dashboard
    And I click on "Gérer mon profil"
    Then I should be redirected to the artist profile page

  Scenario: Display statistics
    When I am on the dashboard
    Then I should see the following statistics:
      | Profile views    |
      | Requests received |
      | Response rate    |
      | Events           |

  Scenario: Display charts
    When I am on the dashboard
    Then I should see the following charts:
      | Monthly views bar chart       |
      | Genres pie chart             |
      | Performance line chart       |

  Scenario: Mobile responsiveness of dashboard
    When I resize the window to mobile mode
    Then the dashboard should adapt to mobile
    And the charts should be displayed in carousel
    And the navigation should be optimized for mobile

  Scenario: Available quick actions
    When I am on the dashboard
    Then I should see the following quick actions:
      | Modifier mon profil     |
      | Voir ma fiche publique  |
      | Gérer mes membres       |
      | Paramètres du compte    |

  Scenario: Profile completion indicator
    Given my profile is not complete
    When I go to the dashboard
    Then I should see a completion indicator
    And I should see "Profil incomplet"
    And I should see a "Compléter mon profil" link