Feature: Smart Filtering System
  As a venue
  I want to filter artists with precise criteria
  So that I can find the perfect talents for my events

  Scenario: Open filter panel from search results
    Given I am on the search results page for "jazz"
    When I click on the filters button
    Then I should see the filter panel
    And the filter panel should display the current results count

  Scenario: Filter by genre
    Given I am on the search results page for "musique"
    When I open the filter panel
    And I select "Jazz" genre
    And I select "Blues" genre
    And I click "Appliquer"
    Then the filter panel should close
    And I should see "Jazz" in the active filters
    And I should see "Blues" in the active filters
    And the URL should contain "genres=Jazz,Blues"

  Scenario: Filter by instruments
    Given I am on the search results page for "musicien"
    When I open the filter panel
    And I select "Guitare" instrument
    And I select "Piano" instrument
    And I click "Appliquer"
    Then I should see "Guitare" in the active filters
    And I should see "Piano" in the active filters
    And the URL should contain "instruments=Guitare,Piano"

  Scenario: Filter by location
    Given I am on the search results page for "artiste"
    When I open the filter panel
    And I enter "Paris" as location
    And I click "Appliquer"
    Then I should see "📍 Paris" in the active filters
    And the URL should contain "location=Paris"

  Scenario: Filter by price range
    Given I am on the search results page for "concert"
    When I open the filter panel
    And I set minimum price to "500"
    And I set maximum price to "1000"
    And I click "Appliquer"
    Then I should see "500€ - 1000€" in the active filters
    And the URL should contain "minPrice=500"
    And the URL should contain "maxPrice=1000"

  Scenario: Filter by quick price range
    Given I am on the search results page for "spectacle"
    When I open the filter panel
    And I click on quick range "500-1000"
    And I click "Appliquer"
    Then I should see "500€ - 1000€" in the active filters

  Scenario: Filter by experience level
    Given I am on the search results page for "professionnel"
    When I open the filter panel
    And I select "Professionnel" experience level
    And I click "Appliquer"
    Then I should see "Professionnel" in the active filters
    And the URL should contain "experience=PROFESSIONAL"

  Scenario: Filter by availability
    Given I am on the search results page for "disponible"
    When I open the filter panel
    And I check "Disponible maintenant"
    And I click "Appliquer"
    Then I should see "Disponible maintenant" in the active filters
    And the URL should contain "availableOnly=true"

  Scenario: Combine multiple filters
    Given I am on the search results page for "artiste"
    When I open the filter panel
    And I select "Rock" genre
    And I select "Guitare" instrument
    And I enter "Lyon" as location
    And I set minimum price to "200"
    And I select "Professionnel" experience level
    And I click "Appliquer"
    Then I should see 5 active filters displayed
    And the URL should contain all selected filters

  Scenario: Remove individual filter
    Given I am on the search results page with active filters
    And I have "Jazz" and "Blues" genres selected
    When I click the X button on "Jazz" filter badge
    Then the "Jazz" filter should be removed
    And the "Blues" filter should remain
    And the URL should not contain "Jazz"

  Scenario: Clear all filters
    Given I am on the search results page with multiple active filters
    When I click "Tout effacer"
    Then all filters should be removed
    And only the search query should remain in the URL

  Scenario: Reset filters in panel
    Given I am on the search results page for "music"
    When I open the filter panel
    And I select multiple filters
    And I click "Réinitialiser"
    Then all filter selections should be cleared
    And the reset button should be disabled

  Scenario: Filter persistence in URL
    Given I am on the search results page with filters "genres=Jazz&location=Paris&minPrice=500"
    Then I should see "Jazz" in the active filters
    And I should see "📍 Paris" in the active filters
    And I should see "500€" in the active filters

  Scenario: Share filtered search via URL
    Given I apply multiple filters on the search page
    When I copy the URL
    And I open the URL in a new session
    Then all the filters should be applied
    And the search results should match the filters

  Scenario: Active filters count in panel header
    Given I am on the search results page for "artiste"
    When I open the filter panel
    And I select 3 genres
    Then the filter panel header should show the count of selected genres
    When I select 2 instruments
    Then the filter panel header should show the count of selected instruments

  Scenario: Filter panel shows results count
    Given I am on the search results page for "jazz"
    When I open the filter panel
    Then the panel header should display the current number of results
    When I select additional filters
    Then the results count should update dynamically
