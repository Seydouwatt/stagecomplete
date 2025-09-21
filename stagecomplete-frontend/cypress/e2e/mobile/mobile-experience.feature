Feature: Mobile-First Experience
  As a mobile user
  I want a perfect mobile experience
  So that I can use StageComplete seamlessly on any device

  Background:
    Given the application is accessible
    And I am using a mobile device (viewport: 375x812)
    And the mobile experience is optimized

  Scenario: PWA Installation
    Given I visit the site on my mobile browser
    When the PWA install prompt appears
    And I choose to install the app
    Then the app should install successfully
    And I should be able to launch it from my home screen
    And it should work offline for cached content

  Scenario: Mobile navigation
    Given I am on the mobile homepage
    Then I should see a mobile-optimized navigation
    And the search bar should be easily accessible
    And touch targets should be at least 44px
    When I tap the menu button
    Then I should see the mobile navigation menu
    And all menu items should be touch-friendly

  Scenario: Mobile search experience
    Given I am on the mobile homepage
    When I tap the search bar
    Then the mobile keyboard should appear
    And the search interface should adapt to mobile
    When I search for "Jazz"
    Then results should be displayed in a mobile-friendly format
    And I should be able to scroll smoothly through results

  Scenario: Touch-optimized interactions
    Given I am browsing artist profiles on mobile
    When I perform touch gestures:
      | Gesture | Expected Behavior |
      | Tap | Activate buttons and links |
      | Swipe | Navigate through photo galleries |
      | Pinch-to-zoom | Zoom into photos (if enabled) |
      | Pull-to-refresh | Refresh content (where applicable) |
    Then all interactions should be smooth and responsive
    And there should be appropriate touch feedback

  Scenario: Mobile artist profile viewing
    Given I visit an artist profile on mobile
    Then the profile should be fully responsive:
      | Element | Mobile Behavior |
      | Photos | Carousel with swipe navigation |
      | Information | Accordion layout |
      | Contact buttons | Large, tap-friendly |
      | Social links | Native app integration |
    And content should be readable without zooming
    And scrolling should be smooth and natural

  Scenario: Mobile performance optimization
    Given I am on a 3G mobile connection
    When I navigate through the site
    Then pages should load within 3 seconds
    And images should be optimized for mobile
    And the app should use lazy loading for content
    And data usage should be minimized

  Scenario: Offline functionality
    Given I have visited pages while online
    When I go offline
    Then previously visited pages should still be accessible
    And I should see an offline indicator
    And cached artist profiles should remain viewable
    When I come back online
    Then the app should sync automatically

  Scenario: Mobile sharing capabilities
    Given I am viewing an artist profile on mobile
    When I tap the share button
    Then I should see native sharing options:
      | Share Option |
      | Copy link |
      | SMS/Messages |
      | Email |
      | Social media apps |
      | WhatsApp |
    And sharing should use the Web Share API when available

  Scenario: Mobile form interactions
    Given I need to fill out forms on mobile
    When I interact with form elements
    Then the mobile keyboard should be appropriate for each field:
      | Field Type | Keyboard Type |
      | Email | Email keyboard |
      | Phone | Numeric keyboard |
      | URL | URL keyboard |
      | Text | Standard keyboard |
    And form validation should be mobile-friendly
    And error messages should be clearly visible

  Scenario: Mobile photo upload
    Given I am uploading photos on mobile
    When I tap the photo upload button
    Then I should see mobile-specific options:
      | Upload Option |
      | Take photo |
      | Choose from gallery |
      | Browse files |
    And the upload process should work smoothly
    And progress indicators should be visible

  Scenario: Mobile responsive breakpoints
    Given I test different mobile screen sizes:
      | Device | Screen Size | Orientation |
      | iPhone SE | 375x667 | Portrait |
      | iPhone 12 | 390x844 | Portrait |
      | Samsung Galaxy | 360x800 | Portrait |
      | iPad Mini | 768x1024 | Portrait |
      | Mobile | Various | Landscape |
    Then the layout should adapt properly to each size
    And content should remain readable and usable
    And no horizontal scrolling should be required

  Scenario: Mobile accessibility
    Given I am using mobile accessibility features
    Then the app should support:
      | Accessibility Feature | Support Level |
      | Screen readers | Full compatibility |
      | Voice control | Navigation support |
      | High contrast mode | Proper contrast ratios |
      | Large text | Scalable typography |
      | Touch accommodations | Large touch targets |
    And all interactive elements should be accessible

  Scenario: Mobile app-like experience
    Given I use the mobile version regularly
    Then it should feel like a native app:
      | Feature | Implementation |
      | Smooth animations | 60fps transitions |
      | Native scrolling | Momentum scrolling |
      | Touch feedback | Visual and haptic |
      | Status bar styling | Matches app theme |
      | Splash screen | Quick loading screen |
    And performance should match native app expectations