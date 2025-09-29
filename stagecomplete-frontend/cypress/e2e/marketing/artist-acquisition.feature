Feature: Artist Marketing Strategy and Acquisition
  As a visitor interested in music
  I want to easily discover how to create my artist profile
  So that I can join the StageComplete community and develop my visibility

  Background:
    Given the application is accessible
    And the backend services are running

  # Artist landing page testing
  Scenario: Discovering the artist landing page
    Given I am an unconnected visitor
    When I navigate to the homepage "/"
    Then I should see a primary CTA "Create my free artist profile"
    When I click on "Create my free artist profile"
    Then I should be redirected to "/artistes"
    And I should see the artist-dedicated landing page

  Scenario: Artist landing page content
    Given I visit the "/artistes" page
    Then I should see the main title "Your artist profile. Your style. Your fans."
    And I should see the description "Join the largest community of professional artists"
    And I should see the following 4 sections:
      | Section              | Content                                          |
      | Hero                 | Catchy title and primary CTA                    |
      | Value Propositions   | 5 key benefits (Free, URL, Sharing, etc.)      |
      | Testimonials         | Artist reviews with stars                       |
      | Quick Signup         | Final CTA with urgency                          |

  Scenario: Value propositions on the landing page
    Given I visit the "/artistes" page
    When I scroll to the "Why choose StageComplete" section
    Then I should see the following 5 benefits:
      | Benefit               | Description                                    | Color    |
      | 100% Free            | Complete profile without hidden fees          | Green    |
      | Custom URL           | stagecomplete.fr/artist/your-name             | Blue     |
      | Easy Sharing         | Optimized for social networks                  | Purple   |
      | SEO Optimized        | Easily found by your fans                     | Orange   |
      | Unlimited Portfolio  | 4 free photos, streaming links                | Pink     |
    And each benefit should have a colored icon
    And the appearance animation should be smooth

  Scenario: Testimonials section with social proof
    Given I visit the "/artistes" page
    When I scroll to the testimonials section
    Then I should see 3 artist testimonials:
      | Name         | Role         | Avatar | Rating  | Genre   |
      | Marie L.     | Folk Singer  | 👩‍🎤    | 5 stars | Folk    |
      | Alex B.      | Beatboxer    | 🎤     | 5 stars | Hip-Hop |
      | Troupe Luna  | Theater      | 🎭     | 5 stars | Theater |
    And I should see the statistic "500+ Registered artists"
    And I should see "12 Artistic genres"
    And I should see "5 min Average creation time"

  # Optimized registration funnel testing
  Scenario: Registration funnel from artist landing
    Given I visit the "/artistes" page
    When I click on "Create my free profile" in the hero
    Then I should be redirected to "/register?from=artist"
    And I should see a registration page optimized for artists
    And the title should be "Create your free artist profile"
    And the description should mention "In 5 minutes, boost your visibility"
    And the "ARTIST" role should be pre-selected automatically
    And I should not see the "Venue" option in the role selector

  Scenario: Customized artist registration form
    Given I am on "/register?from=artist"
    Then I should see a purple informational box
    And the box should contain "Create your free artist profile"
    And the box should mention "Custom URL, portfolio, social networks"
    And the name field label should be "Your artist name"
    And the placeholder should be "Ex: Martin Dubois, Les Étoiles, DJ Mix..."
    And the submit button should say "Create my free artist profile"
    And the button should be purple (premium color)

  Scenario: Successful registration from artist funnel
    Given I am on "/register?from=artist"
    When I fill the form with:
      | Field    | Value                  |
      | Name     | TestArtist Marketing   |
      | Email    | test.marketing@test.com|
      | Password | TestPass123!           |
    And I click on "Create my free artist profile"
    Then I should be redirected to "/dashboard"
    And I should see a welcome message
    And my account should be created with the "ARTIST" role
    And my plan should be "FREE" by default

  # Modified homepage CTAs testing
  Scenario: Homepage refocused on artists
    Given I visit the homepage "/"
    Then the main title should be "Artists, create your free profile"
    And the description should mention "Create your showcase in 5 minutes"
    And the primary CTA should redirect to "/artistes"
    And the secondary CTA should be "View artists" to "/directory"
    And the final section should mention "More than 500 artists already trust us"

  # Conversion tracking testing
  Scenario: Conversion parameters tracking
    Given I visit the "/artistes" page
    When I click on "Create my free profile"
    Then the URL should contain "?from=artist"
    And the parameter should be preserved during navigation
    When I fill and submit the registration form
    Then analytics should record an "artist-signup" conversion
    And the source should be marked as "artist-landing"

  # Responsive and performance testing
  Scenario: Responsive landing page on mobile
    Given I visit the "/artistes" page on mobile
    Then all elements should be readable
    And CTAs should be easily clickable
    And animations should be smooth
    And loading time should be < 3 seconds
    And images should be optimized

  # SEO and referencing testing
  Scenario: SEO optimization of artist landing
    Given I visit the "/artistes" page
    Then the page title should be "Create Your Free Artist Profile | StageComplete"
    And the meta description should mention "professional artist profile in 5 minutes"
    And keywords should include "artist profile", "artist portfolio", "free"
    And OpenGraph tags should be configured
    And the page should have a Lighthouse score > 90

  # Complete experience testing
  Scenario: Complete journey from visitor to registered artist
    Given I am a visitor discovering StageComplete
    When I visit the homepage
    And I click on "Create my free artist profile"
    And I discover the landing page with all its benefits
    And I click on "Create my free profile"
    And I register via the optimized funnel
    Then I should be a registered artist with a basic profile
    And I should be directed to the dashboard with completion guidance
    And I should have access to free features
    And I should see appropriate premium incentives