Feature: Freemium Features for Artists
  As an artist using StageComplete
  I want to understand the differences between free and premium offerings
  So that I can decide whether to upgrade to the paid plan

  Background:
    Given the application is accessible
    And the backend services are running

  # Access restriction testing for free artists
  Scenario: Free artist - Limited navigation in sidebar
    Given I am a new artist with a free plan
    And I am logged in to my account
    When I navigate to my dashboard
    Then I should see only the following sections in the sidebar:
      | Section      | Visible |
      | Dashboard    | Yes     |
      | My Portfolio | Yes     |
      | My Bookings  | Yes     |
      | My Info      | Yes     |
      | Settings     | Yes     |
      | Logout       | Yes     |
      | Messages     | No      |
      | Calendar     | No      |
      | Find Venues  | No      |
      | Analytics    | No      |
    And I should see an "Passer à Premium" button
    And I delete my account

  Scenario: Free artist - Portfolio photo limitation
    Given I am an artist with a free plan
    And I am logged in to my account
    When I navigate to the "My Portfolio" section
    And I click on the "Portfolio photos" section
    Then I should see the text "Plan gratuit: maximum 4 photos"
    And I should see the text "Premium: 10 photos"

  Scenario: Free artist - Attempt to access premium features
    Given I am an artist with a free plan
    And I am logged in to my account
    When I try to access "/messages" directly
    Then I should be redirected to an upgrade page
    And I should see the "UpgradePrompt" component
    And I should see the price "€9/month"
    And I should see premium benefits listed

  # Premium features testing
  Scenario: Premium artist - Full access to features
    Given I am an artist with a premium plan
    And I am logged in to my account
    When I navigate to my dashboard
    Then I should see all sections in the sidebar:
      | Section      | Visible |
      | Dashboard    | Yes     |
      | My Portfolio | Yes     |
      | Messages     | Yes     |
      | Calendar     | Yes     |
      | Find Venues  | Yes     |
      | My Bookings  | Yes     |
      | Analytics    | Yes     |
      | My Info      | Yes     |
      | Settings     | Yes     |
      | Logout       | Yes     |
    And I should not see the "Upgrade to Premium" button

# Scenario: Premium artist - Extended photo limit
#   Given I am an artist with a premium plan
#   And I am logged in to my account
#   When I navigate to "My Portfolio"
#   And I click on the "Portfolio photos" section
#   Then I should see the text "0/10 photos"
#   When I upload 8 photos
#   Then all photos should be accepted
#   And I should see the text "8/10 photos"

# # Upgrade prompt testing
# Scenario: Upgrade prompt - Display and interaction
#   Given I am an artist with a free plan
#   And I am logged in to my account
#   When I click on the "Upgrade to Premium" button in the sidebar
#   Then I should see an upgrade modal open
#   And I should see the title "Upgrade to Premium"
#   And I should see the price "€9/month"
#   And I should see the following premium features:
#     | Feature               | Description                               |
#     | Unlimited messages    | Communicate with venues without limits    |
#     | Complete calendar     | Manage all your events and bookings       |
#     | Advanced venue search | Find the perfect venues for your concerts |
#     | Detailed analytics    | Analyze your performance and audience     |
#   And I should see an "Upgrade to Premium now" button
#   When I click the close button
#   Then the modal should close

# Scenario: Contextual limitation - Photo message in upload
#   Given I am an artist with a free plan
#   And I already have 4 photos in my portfolio
#   When I navigate to "My Portfolio"
#   And I click on the "Portfolio photos" section
#   Then I should see the message "Free limit reached. Upgrade to Premium for 6 additional photos!"
#   And the upload button should be disabled or hidden

# # Plan change testing (simulation)
# Scenario: Simulate upgrade to premium
#   Given I am an artist with a free plan
#   And I am logged in to my account
#   When I change my plan to "PREMIUM" in the user data
#   And I refresh the page
#   Then I should see all premium sections in the sidebar
#   And I should no longer see the "Upgrade to Premium" button
#   And the photo limit should change to "0/10 photos"

# Scenario: User plan display
#   Given I am an artist with a free plan
#   And I am logged in to my account
#   When I look at the bottom of the sidebar
#   Then I should see "Free Plan" in my user information

#   When I upgrade to a premium plan
#   And I refresh the page
#   Then I should see "Premium Plan" in my user information