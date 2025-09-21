Feature: Public Search and Discovery
  As a visitor or venue
  I want to search and discover artists publicly
  So that I can find the perfect artist for my needs without creating an account

  Background:
    Given the application is accessible
    And there are published artist profiles available
    And the search API is responding

  Scenario: Landing page public search
    Given I am on the homepage
    Then I should see a prominent search bar
    And I should see "Trouvez l'artiste parfait" hero message
    And I should see featured artists section
    And I should see animated statistics counters

  Scenario: Basic public search
    Given I am on the homepage
    When I enter "Jazz" in the search bar
    And I press Enter
    Then I should be redirected to search results page
    And I should see artists matching "Jazz"
    And I should see the total number of results
    And each artist card should display basic information

  Scenario: Advanced search with filters
    Given I am on the search results page
    When I click on "Filtres"
    Then I should see advanced filter options
    When I select "Jazz" as genre
    And I select "Paris" as location
    And I apply filters
    Then I should see only jazz artists from Paris
    And the URL should reflect the applied filters

  Scenario: Search with geolocation
    Given I am on the search results page
    And I have granted location permissions
    When I search for "Jazz près de moi"
    Then I should see artists sorted by distance from my location
    And each result should show approximate distance

  Scenario: SEO-friendly genre directory
    Given I visit "/artistes/jazz"
    Then I should see all jazz artists
    And the page should have proper SEO meta tags
    And I should see breadcrumb navigation
    And I should see genre-specific information

  Scenario: SEO-friendly city directory
    Given I visit "/artistes/jazz/paris"
    Then I should see jazz artists from Paris
    And the page title should be "Artistes Jazz à Paris"
    And I should see quick filter options
    And the page should be optimized for search engines

  Scenario: Artist search results display
    Given I am viewing search results
    Then each artist card should show:
      | Field | Visibility |
      | Artist name | Visible |
      | Photo or placeholder | Visible |
      | Location | Visible |
      | Genres (max 2) | Visible |
      | Artist type (Solo/Group) | Visible |
      | Price range | Hidden from public |
    And cards should have hover effects
    And cards should link to public profiles

  Scenario: Load more results
    Given I am viewing search results with more than 12 artists
    Then I should see a "Charger plus d'artistes" button
    When I click the load more button
    Then additional artists should be loaded
    And the button should show loading state
    And pagination should work smoothly

  Scenario: No search results
    Given I search for "XYZ123NonExistentGenre"
    Then I should see "Aucun résultat trouvé"
    And I should see search suggestions
    And I should see tips for better search results

  Scenario: Search performance
    Given I am on any search page
    When I perform a search
    Then results should load in less than 2 seconds
    And the interface should remain responsive
    And loading states should be visible during search

  Scenario: Mobile search experience
    Given I am on a mobile device
    When I use the search functionality
    Then the search interface should be touch-optimized
    And filters should open in mobile-friendly modals
    And results should be properly formatted for mobile
    And scrolling should be smooth