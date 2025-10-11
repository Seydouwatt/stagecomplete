Feature: Real-time Search with Debouncing
  As a venue user
  I want to see search results update in real-time while I type
  So that I can find artists quickly without having to press Enter

  Background:
    Given I am logged in as a venue
    And the search API is available
    And there are published artist profiles in the database

  Scenario: Search results update automatically while typing with debounce
    Given I am on the browse page
    When I start typing "Ja" in the search bar
    Then I should see suggestions appearing after 700ms
    When I continue typing "zz" to complete "Jazz"
    Then the search results should update automatically after 300ms
    And I should see artist results matching "Jazz"
    And I should NOT have to press Enter or click Search button

  Scenario: Suggestions appear with 700ms debounce
    Given I am on the browse page
    When I type "J" in the search bar
    And I wait 600ms
    Then suggestions should not yet be visible
    When I wait an additional 200ms
    Then I should see auto-complete suggestions
    And suggestions should include artists and genres

  Scenario: Search button forces immediate search
    Given I am on the browse page
    When I type "Jazz" in the search bar
    And I click the "Rechercher" button immediately
    Then the search should be executed immediately
    And the URL should include "?q=Jazz"
    And I should see search results

  Scenario: Enter key forces immediate search
    Given I am on the browse page
    When I type "Blues" in the search bar
    And I press Enter
    Then the search should be executed immediately
    And the URL should include "?q=Blues"
    And I should see search results

  Scenario: Clear button resets search
    Given I am on the browse page
    And I have typed "Jazz" in the search bar
    When I click the clear (X) button
    Then the search bar should be empty
    And search results should show all artists
    And the URL should not include "?q="

  Scenario: Suggestions disappear when input loses focus
    Given I am on the browse page
    When I type "Jazz" in the search bar
    And I see suggestions
    When I click outside the search bar
    Then suggestions should disappear after 200ms
    But the search results should remain visible

  Scenario: Live search preserves existing filters
    Given I am on the browse page "/browse?location=Paris&genres=Rock"
    When I start typing "Jazz" in the search bar
    Then the search should include location=Paris and genres=Rock
    And the URL should still contain "location=Paris&genres=Rock"
    And results should be Jazz artists from Paris with Rock genre

  Scenario: Multiple rapid keystrokes are debounced correctly
    Given I am on the browse page
    When I rapidly type "J", "a", "z", "z" with 50ms delay between each
    Then only one API call should be made
    And the API call should be for the complete word "Jazz"
    And the debounce should wait 300ms after the last keystroke

  Scenario: Loading indicator appears during search
    Given I am on the browse page
    When I type "Jazz" in the search bar
    And the API is responding slowly
    Then I should see a loading spinner
    And previous results should remain visible
    When the API responds
    Then the loading spinner should disappear
    And new results should be displayed
