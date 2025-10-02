Feature: Advanced Search Engine
  As a logged-in user (artist or venue)
  I want to use the advanced search to find artists or venues
  So that I can discover relevant profiles with powerful filtering

  Background:
    Given I am logged in as a venue
    And the search API is available
    And there are published artist profiles in the database

  Scenario: Basic text search
    Given I am on the browse page
    When I type "Jazz" in the search bar
    Then I should see search suggestions appearing
    And I should see artist results matching "Jazz"
    And I should see the total number of results
    And each result should show artist information

  Scenario: Search with auto-complete suggestions
    Given I am on the browse page
    When I start typing "Ja" in the search bar
    Then I should see auto-complete suggestions
    And suggestions should include artists matching "Ja"
    And suggestions should include genres matching "Ja"
    When I click on a suggestion
    Then the search should be executed with the selected term

  Scenario: Advanced filtering by genres
    Given I am on the browse page
    When I click on the filters button
    And I select "Jazz" and "Blues" as genres
    And I apply the filters
    Then I should see only artists with Jazz or Blues genres
    And the URL should include the selected genres

  Scenario: Advanced filtering by location
    Given I am on the browse page
    When I click on the filters button
    And I enter "Paris" as location
    And I apply the filters
    Then I should see only artists from Paris area
    And the URL should include the location filter

  Scenario: Advanced filtering by price range
    Given I am on the browse page
    When I click on the filters button
    And I set price range from 500 to 2000
    And I apply the filters
    Then I should see only artists within the price range
    And prices should be between 500€ and 2000€

  Scenario: Advanced filtering by experience level
    Given I am on the browse page
    When I click on the filters button
    And I select "PROFESSIONAL" as experience level
    And I apply the filters
    Then I should see only professional artists
    And each artist should have "PROFESSIONAL" experience level

  Scenario: Combined filters
    Given I am on the browse page
    When I type "Jazz" in the search bar
    And I click on the filters button
    And I select "Paris" as location
    And I set price range from 500 to 2000
    And I apply the filters
    Then I should see Jazz artists from Paris with prices 500-2000€
    And the URL should reflect all applied filters

  Scenario: Sort by relevance
    Given I am on the browse page
    When I search for "Jazz pianist"
    Then results should be sorted by relevance
    And artists with "Jazz" and "Piano" should appear first

  Scenario: Sort by popularity
    Given I am on the browse page
    When I click on sort options
    And I select "Popularité" as sort option
    Then results should be sorted by popularity
    And most viewed artists should appear first

  Scenario: Popular genres display
    Given I am on the browse page
    Then I should see popular genres section
    And popular genres should be clickable
    When I click on "Jazz" popular genre
    Then search should be filtered by Jazz genre

  Scenario: Trending artists display
    Given I am on the browse page
    Then I should see trending artists section
    And trending artists should show recent popular profiles
    When I click on a trending artist
    Then I should navigate to their profile

  Scenario: Quick filters availability
    Given I am on the browse page
    When I load the page
    Then quick filters should be loaded from the API
    And I should see available genres in filters
    And I should see available locations in filters
    And I should see available experience levels in filters

  Scenario: Empty search results
    Given I am on the browse page
    When I search for "XYZ123NonExistent"
    Then I should see "Aucun résultat trouvé" message
    And I should see suggestions to refine search
    And filters should still be available

  Scenario: Search performance with debouncing
    Given I am on the browse page
    When I type quickly "J", "a", "z", "z"
    Then API calls should be debounced
    And only final "Jazz" search should be executed
    And search should complete in less than 2 seconds

  Scenario: Pagination with infinite scroll
    Given I am on the browse page
    And search returns more than 20 results
    When I scroll to the bottom of results
    Then next page should load automatically
    And loading indicator should be visible
    And new results should be appended to the list

  Scenario: URL params persistence
    Given I am on the browse page
    When I search for "Jazz" with filters applied
    And I copy the URL
    And I open the URL in a new tab
    Then the same search and filters should be applied
    And results should match the original search

  Scenario: Clear all filters
    Given I am on the browse page with filters applied
    When I click on "Clear filters" button
    Then all filters should be reset
    And search should show all results
    And URL should be cleared

  Scenario: Search API error handling
    Given I am on the browse page
    And the search API returns an error
    When I perform a search
    Then I should see an error message
    And I should be able to retry the search
    And previous results should remain visible

  Scenario: Mobile search experience
    Given I am on a mobile device
    And I am on the browse page
    When I use the search functionality
    Then the search bar should be touch-friendly
    And filters should open in a modal
    And results should be properly formatted for mobile
    And scrolling should work smoothly
