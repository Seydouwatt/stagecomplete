Feature: Public Artist Profiles
  As a visitor or venue
  I want to view detailed public artist profiles
  So that I can learn about artists and their work before making contact

  Background:
    Given the application is accessible
    And there are published artist profiles available

  Scenario: Access public artist profile via URL
    Given there is a published artist with slug "jazz-virtuoso-paris"
    When I visit "/artist/jazz-virtuoso-paris"
    Then I should see the artist's public profile
    And the page should load within 2 seconds
    And I should not see private information like exact prices

  Scenario: Public profile SEO optimization
    Given I visit a public artist profile
    Then the page should have proper meta tags
    And the page should have Open Graph tags for social sharing
    And the page should have Schema.org markup for musicians
    And the page title should include the artist name
    And the page should be crawlable by search engines

  Scenario: Public profile content display
    Given I am viewing a public artist profile
    Then I should see all public information:
      | Section | Content |
      | Header | Artist name, location, genres |
      | Overview | Bio, experience, artist type |
      | Portfolio | Photos, videos, audio samples |
      | Contact | Social links, website |
      | Members | Band member information (if group) |
    And I should not see private information:
      | Private Field |
      | Exact pricing |
      | Contact email |
      | Phone number |
      | Internal notes |

  Scenario: Social media sharing
    Given I am on a public artist profile
    When I click on social sharing buttons
    Then I should be able to share on:
      | Platform |
      | Facebook |
      | Twitter |
      | LinkedIn |
      | WhatsApp |
    And the shared content should include artist name and profile URL
    And the shared preview should show artist photo and description

  Scenario: Portfolio media display
    Given I am viewing an artist profile with media
    When I click on portfolio photos
    Then photos should open in a lightbox gallery
    And I should be able to navigate between photos
    And photos should be optimized for fast loading
    When I see YouTube or SoundCloud links
    Then they should be properly embedded or linked
    And media should be responsive on all devices

  Scenario: Contact artist from public profile
    Given I am viewing a public artist profile
    And I am not logged in
    Then I should see social media links to contact the artist
    And I should see a "Contacter l'artiste" call-to-action
    When I click contact options
    Then I should be directed to external platforms or registration

  Scenario: Mobile public profile experience
    Given I am on a mobile device
    When I view a public artist profile
    Then the profile should be fully responsive
    And touch interactions should work smoothly
    And media should be optimized for mobile viewing
    And loading should be fast on 3G connections

  Scenario: Profile not found handling
    Given I visit "/artist/non-existent-artist"
    Then I should see a 404 error page
    And the page should suggest browsing other artists
    And I should have navigation options to return to the site
    And the 404 page should maintain the site's design

  Scenario: Private profile access attempt
    Given there is an artist with a private profile
    When I try to visit their public URL
    Then I should see a "Profile not available" message
    And the artist should not appear in public searches

  Scenario: Profile view analytics (artist perspective)
    Given I am the owner of a public profile
    And visitors have viewed my profile
    When I check my analytics
    Then I should see view counts
    And I should see basic visitor statistics
    But visitor personal information should remain private

  Scenario: Multi-language content support
    Given I am viewing a public artist profile
    Then content should be displayed in the appropriate language
    And special characters in artist names should display correctly
    And location names should be properly formatted

  Scenario: Profile sharing via direct URL
    Given I have a public artist profile URL
    When I share this URL directly
    Then it should open correctly for anyone
    And no authentication should be required
    And the profile should load completely for anonymous users