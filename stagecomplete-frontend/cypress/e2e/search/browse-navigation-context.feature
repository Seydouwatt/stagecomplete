Feature: Browse Page Navigation Context
  As a user
  I want search and filters to respect the current page context
  So that I stay on the same layout when performing actions on /browse

  Background:
    Given the filtering API is mocked

  Scenario: Search from Browse page stays on Browse
    Given I am on the Browse page "/browse"
    When I perform a search for "jazz"
    Then I should remain on the Browse page with URL "/browse?q=jazz"
    And the page layout should stay consistent with the search bar at the top

  Scenario: Filter from Browse page stays on Browse
    Given I am on the Browse page "/browse" with query "jazz"
    When I open the filter panel
    And I select "Rock" genre
    And I apply the filters
    Then I should remain on the Browse page with URL "/browse?q=jazz&genres=Rock"
    And the page layout should stay consistent

  Scenario: Multiple filters from Browse page stay on Browse
    Given I am on the Browse page "/browse"
    When I perform a search for "music"
    And I open the filter panel
    And I select "Jazz" genre
    And I select "Guitare" instrument
    And I enter "Paris" as location
    And I apply the filters
    Then I should remain on the Browse page
    And the URL should contain "q=music&genres=Jazz&instruments=Guitare&location=Paris"
    And the page layout should stay consistent

  Scenario: Search from home page navigates to Search page
    Given I am on the home page "/"
    When I perform a search for "jazz"
    Then I should be redirected to the Search page "/search?q=jazz"
    And the layout should be the search results layout

  Scenario: URL parameters are preserved when adding filters on Browse
    Given I am on the Browse page "/browse?q=jazz&location=Lyon"
    When I open the filter panel
    And I select "Blues" genre
    And I apply the filters
    Then the URL should contain "q=jazz&location=Lyon&genres=Blues"
    And I should remain on the Browse page

  Scenario: Search bar location input works on Browse page
    Given I am on the Browse page "/browse"
    When I enter "jazz" in the search field
    And I enter "Paris" in the location field
    And I submit the search
    Then I should remain on the Browse page
    And the URL should contain "q=jazz&location=Paris"

  Scenario: Filter changes update URL parameters on Browse page
    Given I am on the Browse page "/browse?q=rock"
    When I open the filter panel
    And I set minimum price to "500"
    And I set maximum price to "1000"
    And I select "Professionnel" experience level
    And I apply the filters
    Then the URL should contain "q=rock&minPrice=500&maxPrice=1000&experience=PROFESSIONAL"
    And I should remain on the Browse page

  Scenario: Remove filters preserves query on Browse page
    Given I am on the Browse page "/browse?q=jazz&genres=Rock,Blues&location=Paris"
    When I remove the "Rock" genre filter
    Then the URL should be "/browse?q=jazz&genres=Blues&location=Paris"
    And I should remain on the Browse page

  Scenario: Clear all filters preserves search query on Browse page
    Given I am on the Browse page "/browse?q=jazz&genres=Rock&location=Paris&minPrice=500"
    When I click "Tout effacer"
    Then the URL should be "/browse?q=jazz"
    And I should remain on the Browse page

  Scenario: Page refresh maintains state on Browse page
    Given I am on the Browse page "/browse?q=jazz&genres=Rock&location=Paris"
    When I refresh the page
    Then I should remain on the Browse page
    And the search field should contain "jazz"
    And the active filters should show "Rock" and "📍 Paris"

  Scenario: Back button navigation works correctly
    Given I start on the home page "/"
    When I navigate to "/browse"
    And I perform a search for "jazz"
    And I add a "Rock" genre filter
    And I click the browser back button
    Then I should be on "/browse?q=jazz"
    When I click the browser back button again
    Then I should be on "/browse"

  Scenario: Direct URL access to Browse with parameters works
    Given I directly access "/browse?q=jazz&genres=Rock,Blues&location=Paris&minPrice=500"
    Then I should see the Browse page layout
    And the search field should contain "jazz"
    And the active filters should show "Rock", "Blues", "📍 Paris", and "500€"
    And the filters should be applied to the search results