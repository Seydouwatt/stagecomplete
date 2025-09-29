Feature: Artist Profile Completion Guidance
  As an artist with an incomplete profile
  I want to be guided to complete my profile
  So that I can increase my visibility and get more opportunities

  Background:
    Given the application is accessible
    And the backend services are running

  # Profile scoring and evaluation testing
  Scenario: Very incomplete profile - Assistant prompt display
    Given I am an artist with a 25% complete profile
    And I am logged in to my account
    When I navigate to my dashboard
    Then I should see the ProfileCompletionPrompt component
    And I should not see the standard hero section
    And I should see "Your profile is 25% complete"
    And I should see the message "Use our assistant to attract more venues!"

  Scenario: Moderately complete profile - No assistant prompt
    Given I am an artist with a 70% complete profile
    And I am logged in to my account
    When I navigate to my dashboard
    Then I should not see the ProfileCompletionPrompt component
    And I should see the standard hero section
    And I should see "Your profile is 70% complete!"
    And I should see the CTA "Create a new event"

  Scenario: Complete profile - Business-oriented dashboard
    Given I am an artist with a 90% complete profile
    And I am logged in to my account
    When I navigate to my dashboard
    Then I should not see the ProfileCompletionPrompt component
    And I should see the standard hero section
    And I should see "Ready for new challenges"
    And the quick actions should be business-oriented

  # Completion prompt content testing
  Scenario: Detailed completion prompt content
    Given I am an artist with a 40% complete profile
    And I am logged in to my account
    When I navigate to my dashboard
    Then I should see the ProfileCompletionPrompt component with:
      | Element                    | Expected content                                 |
      | Main title                | Complete your profile with the assistant        |
      | Percentage                | Your profile is 40% complete                    |
      | Progress bar              | Animated bar at 40%                             |
      | Missing items section     | List of unfulfilled criteria                    |
      | Sales arguments           | 3x more venue requests                          |
      | Primary CTA               | Use the assistant                               |
      | Secondary CTA             | Complete manually                               |

  Scenario: Missing elements displayed in prompt
    Given I am an artist with only name and email filled
    And I am logged in to my account
    When I navigate to my dashboard
    And I look at the ProfileCompletionPrompt component
    Then I should see the following missing elements:
      | Missing element      | Description                           | Icon       |
      | Basic information    | Name, bio, profile photo             | UserIcon   |
      | Musical genres       | At least 1 musical genre             | MusicIcon  |
      | Instruments         | At least 1 instrument                 | MusicIcon  |
      | Portfolio photos    | At least 2 performance photos        | CameraIcon |
      | Location            | Your city or activity region         | MapPinIcon |
    And I should see a maximum of 4 displayed elements
    And if there are more, I should see "... and X others"

  # Adaptive quick actions testing
  Scenario: Quick actions for incomplete profile
    Given I am an artist with a 30% complete profile
    And I am logged in to my account
    When I navigate to my dashboard
    And I look at the Quick Actions section
    Then I should see the following actions:
      | Action                    | Description                     | Color  |
      | Complete profile         | Use guided assistant            | Purple |
      | Add photos               | Portfolio and gallery           | Green  |
      | Edit profile             | Basic information               | Blue   |
      | View my public profile   | How venues see me               | Gray   |
    And I should not see business-oriented actions

  Scenario: Quick actions for complete profile
    Given I am an artist with an 85% complete profile
    And I am logged in to my account
    When I navigate to my dashboard
    And I look at the Quick Actions section
    Then I should see the following business actions:
      | Action              | Description                      | Color     |
      | New event           | Create a new performance         | Primary   |
      | Find venues         | Explore new locations            | Secondary |
      | Upload content      | Add photos/videos                | Green     |
      | Settings            | Manage your profile              | Info      |

  # Real-time evaluation testing
  Scenario: Score update after adding information
    Given I am an artist with a 50% complete profile
    And I am logged in to my account
    When I navigate to "My Portfolio"
    And I add 3 musical genres
    And I add 2 instruments
    And I add my location "Paris"
    And I return to the dashboard
    Then the completion percentage should have increased
    And the progress bar should update
    And some elements should disappear from the "missing" list

  Scenario: Threshold switching to business dashboard
    Given I am an artist with a 58% complete profile
    And I see the assistant prompt on the dashboard
    When I add enough information to reach 65%
    And I return to the dashboard
    Then the assistant prompt should disappear
    And the standard hero section should appear
    And the quick actions should switch to business actions

  # Sales arguments and motivation testing
  Scenario: "Why complete" section in the prompt
    Given I am an artist with an incomplete profile
    And I see the completion prompt on the dashboard
    Then I should see the "Why complete your profile?" section
    And I should see the following benefits:
      | Benefit                               | Icon        |
      | Appear first in searches              | CheckCircle |
      | Receive 3x more venue requests        | CheckCircle |
      | Enhanced professional credibility     | CheckCircle |
    And each benefit should have a green check icon

  # CTAs and redirections testing
  Scenario: Navigation via "Use the assistant" CTA
    Given I am an artist with an incomplete profile
    And I see the completion prompt
    When I click on "Use the assistant"
    Then I should be redirected to "/artist/profile-wizard"
    And I should be in the guided assistant process

  Scenario: Navigation via "Complete manually" CTA
    Given I am an artist with an incomplete profile
    And I see the completion prompt
    When I click on "Complete manually"
    Then I should be redirected to "/artist/portfolio"
    And I should be on the profile management page

  # Specific evaluation criteria testing
  Scenario: Detailed evaluation of 8 completion criteria
    Given I am a newly registered artist
    And only my name and email are filled
    When I check the completion evaluation
    Then the following criteria should be evaluated:
      | Criterion           | State      | Weight | Required for validation              |
      | Basic information   | Incomplete | 12.5%  | Name, bio, profile photo             |
      | Musical genres      | Incomplete | 12.5%  | At least 1 genre                     |
      | Instruments        | Incomplete | 12.5%  | At least 1 instrument                 |
      | Experience level   | Incomplete | 12.5%  | Level selection                       |
      | Portfolio photos   | Incomplete | 12.5%  | At least 2 photos                     |
      | Artist type        | Incomplete | 12.5%  | Solo, duo, group, etc.                |
      | Location           | Incomplete | 12.5%  | City or region                        |
      | Pricing            | Incomplete | 12.5%  | Price range or details                |
    And the global score should be close to 0%

  # Responsiveness and performance testing
  Scenario: Responsive display of completion prompt
    Given I am an artist with an incomplete profile
    And I check the dashboard on mobile
    Then the ProfileCompletionPrompt component should adapt
    And all elements should remain readable
    And CTAs should be easily clickable
    And animations should remain smooth

  # Accessibility testing
  Scenario: Completion prompt accessibility
    Given I am an artist with an incomplete profile
    And I navigate with a screen reader
    Then the prompt should have appropriate ARIA labels
    And percentages should be clearly announced
    And CTAs should have accessible descriptions
    And keyboard navigation should work correctly