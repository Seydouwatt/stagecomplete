Feature: Test Configuration and Setup
  As a QA engineer
  I want to ensure all test configurations are working properly
  So that our E2E tests run reliably across all environments

  Background:
    Given the test environment is properly configured
    And all necessary test data is available

  Scenario: Cypress test environment setup
    Given I start a new test session
    Then all required fixtures should be available
    And all API intercepts should be configured
    And custom commands should be accessible
    And browser storage should be clean

  Scenario: Test data fixtures validation
    Given I access test fixtures
    Then the published artists fixture should contain valid data
    And the public artist profile fixture should be complete
    And the artist with media fixture should have all media types
    And the profile analytics fixture should have realistic metrics
    And all test images should be valid base64 data

  Scenario: API mocking and intercepts
    Given I configure API intercepts
    When I make requests to mocked endpoints
    Then the registration API should be mocked
    And the login API should be mocked
    And the artist profile API should be mocked
    And the public search API should be mocked
    And the analytics API should be mocked

  Scenario: Custom commands functionality
    Given I use custom Cypress commands
    Then the login command should work properly
    And the file upload command should handle images
    And the geolocation mock should function correctly
    And the SEO checking commands should validate meta tags
    And the responsive design commands should test breakpoints

  Scenario: Browser compatibility testing
    Given I test across different browsers
    When I run tests in Chrome
    Then all features should work correctly
    When I run tests in Firefox
    Then all features should work correctly
    When I run tests in Edge
    Then all features should work correctly

  Scenario: Performance and accessibility testing
    Given I include performance checks in tests
    When I run accessibility audits
    Then pages should meet WCAG standards
    When I check performance metrics
    Then load times should be under acceptable limits
    And Core Web Vitals should pass thresholds

  Scenario: Test isolation and cleanup
    Given I run multiple tests in sequence
    When each test completes
    Then browser storage should be cleaned
    And no test data should leak between tests
    And API mocks should be reset
    And viewport should be restored to default

  Scenario: Error handling and resilience
    Given I simulate various error conditions
    When network requests fail
    Then tests should handle failures gracefully
    When elements are not found
    Then tests should provide clear error messages
    When timeouts occur
    Then tests should retry appropriately

  Scenario: Test reporting and debugging
    Given I run the complete test suite
    When tests pass or fail
    Then screenshots should be captured on failures
    And video recordings should be available
    And detailed logs should be preserved
    And test reports should be generated in multiple formats