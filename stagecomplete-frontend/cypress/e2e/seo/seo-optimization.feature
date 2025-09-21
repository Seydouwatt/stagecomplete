Feature: SEO Optimization
  As a site owner
  I want the application to be perfectly optimized for search engines
  So that artists can be discovered organically and the platform gains visibility

  Background:
    Given the application is accessible
    And there are published artist profiles available

  Scenario: Homepage SEO optimization
    Given I visit the homepage "/"
    Then the page should have:
      | SEO Element | Expected |
      | Title tag | StageComplete - Plateforme de Découverte d'Artistes |
      | Meta description | Découvrez des artistes exceptionnels près de chez vous |
      | H1 tag | Discovrez des artistes exceptionnels |
      | Schema.org markup | WebSite type |
      | Open Graph tags | Complete social sharing data |
      | Twitter Cards | Rich media cards |
    And the page should load within 3 seconds
    And Lighthouse SEO score should be 90+

  Scenario: Artist profile SEO optimization
    Given I visit an artist profile "/artist/jazz-virtuoso-paris"
    Then the page should have dynamic SEO tags:
      | SEO Element | Content |
      | Title | Artist name + location |
      | Meta description | Artist bio excerpt + genres |
      | Keywords | Genres + location + instruments |
      | Schema.org | MusicGroup or Person markup |
      | Open Graph image | Artist photo or default |
      | Canonical URL | Clean artist profile URL |
    And the page should be indexable by search engines

  Scenario: Genre directory SEO
    Given I visit "/artistes/jazz"
    Then the page should have genre-specific SEO:
      | SEO Element | Content |
      | Title | Artistes Jazz - StageComplete |
      | Meta description | Genre description with artist count |
      | H1 | Artistes Jazz |
      | Keywords | Jazz-related terms |
      | Breadcrumbs | Home > Artistes > Jazz |
    And the page should list all jazz artists
    And pagination should be SEO-friendly

  Scenario: City + Genre SEO pages
    Given I visit "/artistes/jazz/paris"
    Then the page should have location-specific SEO:
      | SEO Element | Content |
      | Title | Artistes Jazz à Paris |
      | Meta description | Jazz artists in Paris with count |
      | H1 | Artistes Jazz à Paris |
      | Keywords | Jazz + Paris + related terms |
      | Breadcrumbs | Home > Artistes > Jazz > Paris |
    And the URL should be clean and readable
    And the page should be indexed for local searches

  Scenario: Search results page SEO
    Given I visit "/search?q=jazz&location=paris"
    Then the page should have search-specific SEO:
      | SEO Element | Content |
      | Title | Recherche: jazz à paris |
      | Meta description | Search results description |
      | Canonical URL | Clean search URL |
    And the page should use proper noindex/follow if needed
    And pagination should preserve search parameters

  Scenario: Sitemap generation
    Given the application has published content
    When I visit "/sitemap.xml"
    Then I should see a valid XML sitemap
    And it should include all public pages:
      | Page Type |
      | Homepage |
      | Directory pages |
      | Genre pages |
      | Artist profiles |
      | Static pages |
    And URLs should be properly formatted
    And lastmod dates should be accurate

  Scenario: Robots.txt optimization
    Given I visit "/robots.txt"
    Then I should see proper robots directives:
      | Directive | Value |
      | User-agent | * |
      | Sitemap | /sitemap.xml |
      | Allow | Public pages |
      | Disallow | Private/admin areas |
    And crawling rules should be appropriate

  Scenario: Core Web Vitals performance
    Given I visit any public page
    Then the page should meet Core Web Vitals:
      | Metric | Target |
      | LCP (Largest Contentful Paint) | < 2.5s |
      | FID (First Input Delay) | < 100ms |
      | CLS (Cumulative Layout Shift) | < 0.1 |
    And images should be optimized and lazy-loaded
    And CSS and JS should be minimized

  Scenario: Mobile SEO optimization
    Given I visit any page on a mobile device
    Then the page should be mobile-optimized:
      | Aspect | Requirement |
      | Responsive design | Properly scaled |
      | Touch targets | At least 44px |
      | Font size | Readable without zoom |
      | Viewport meta | Properly configured |
    And mobile Lighthouse score should be 90+

  Scenario: Structured data validation
    Given I visit an artist profile
    When I check the structured data
    Then it should validate against Schema.org
    And it should include all required properties:
      | Property | Type |
      | name | Text |
      | @type | Person or MusicGroup |
      | description | Text |
      | url | URL |
      | sameAs | Array of URLs |
    And Google Rich Results should recognize it

  Scenario: International SEO
    Given the site serves multiple regions
    Then hreflang tags should be properly configured
    And language-specific content should be marked
    And URLs should follow international SEO best practices

  Scenario: SEO monitoring and testing
    Given I want to verify SEO implementation
    When I use SEO testing tools
    Then all meta tags should be properly rendered
    And JavaScript-generated content should be crawlable
    And server response times should be optimal
    And there should be no SEO errors or warnings