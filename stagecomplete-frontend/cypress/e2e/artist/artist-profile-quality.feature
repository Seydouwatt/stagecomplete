Feature: Artist Profile Quality Management
  As an artist
  I want to understand and improve my profile quality
  So that I can maximize my visibility and professional appeal

  Background:
    Given the application is accessible
    And I am logged in as an artist
    And the quality scoring system is active

  Scenario: Profile quality score calculation
    Given I am on my artist dashboard
    Then I should see my current profile quality score (0-100%)
    And the score should be calculated based on:
      | Quality Factor | Points | Status |
      | Portfolio photos (first photo) | 20 | Required |
      | Artist description >50 chars | 15 | Required |
      | Genres selected (3+) | 10 | Recommended |
      | Location specified | 5 | Recommended |
      | Social links added | 10 | Recommended |
      | Portfolio photos (3+) | 15 | Recommended |
      | Contact information | 10 | Recommended |
      | Professional experience | 10 | Optional |
      | Member information complete | 5 | If applicable |
    And the total should equal 100%

  Scenario: Quality improvement suggestions
    Given my profile quality score is below 80%
    When I view my profile dashboard
    Then I should see personalized improvement suggestions:
      | Current Score | Suggestion |
      | 0-20% | "Ajoutez des photos à votre portfolio pour +20%" |
      | 21-40% | "Complétez votre description artistique pour +15%" |
      | 41-60% | "Ajoutez vos genres musicaux pour +10%" |
      | 61-80% | "Ajoutez vos liens sociaux pour +10%" |
    And suggestions should be actionable with direct links

  Scenario: Real-time quality score updates
    Given I am editing my profile
    When I upload a main photo
    Then the quality score should immediately increase by 20%
    And I should see a visual confirmation of the improvement
    When I add a description of 50+ characters
    Then the score should increase by 15% more
    And the progress bar should update smoothly

  Scenario: Profile completion checklist
    Given I want to improve my profile quality
    When I access the profile completion checklist
    Then I should see all quality factors with their status:
      | Factor | Status | Action |
      | Portfolio photos (first photo) | ✅/❌ | Upload/Change |
      | Description | ✅/❌ | Add/Edit |
      | Genres musicaux | ✅/❌ | Select genres |
      | Liens sociaux | ✅/❌ | Add social media |
    And each item should be clickable to jump to the relevant section

  Scenario: Quality badge system
    Given my profile meets quality standards
    When my score reaches certain thresholds:
      | Score | Badge | Benefit |
      | 60-79% | "Profil Complet" | Basic visibility |
      | 80-89% | "Profil Vérifié" | Enhanced visibility |
      | 90-100% | "Profil Premium" | Maximum visibility |
    Then I should receive the appropriate badge
    And the badge should appear on my public profile
    And I should understand the benefits of each level

  Scenario: SEO preview based on profile quality
    Given I want to see how my profile appears online
    When I access the SEO preview tool
    Then I should see simulated search results showing:
      | Platform | Preview |
      | Google search | Title, description, URL |
      | Facebook share | Image, title, description |
      | Twitter share | Card with media |
    And the preview should reflect my current profile data
    And I should see suggestions for SEO improvement

  Scenario: Quality tips and best practices
    Given I want to create the best possible profile
    When I access the profile tips section
    Then I should see contextual advice:
      | Section | Tip |
      | Photo | "Use high-quality, professional photos for your portfolio" |
      | Description | "Include your musical journey and style" |
      | Genres | "Be specific but not too niche" |
      | Social Links | "Keep your social media active" |
    And tips should be updated based on my current profile state

  Scenario: Profile analytics for quality improvement
    Given I have a published profile
    When I check my profile analytics
    Then I should see quality-related metrics:
      | Metric | Description |
      | Profile views | How often people view my profile |
      | Search appearances | How often I appear in searches |
      | Contact clicks | How many people try to contact me |
      | Quality score trend | How my score changed over time |
    And I should understand how quality affects these metrics

  Scenario: Competitive quality benchmarking
    Given I want to compare my profile quality
    When I access the benchmarking feature
    Then I should see anonymous comparisons:
      | Comparison | Data |
      | My score vs average in my genre | Percentage comparison |
      | My score vs top profiles in my city | Ranking insight |
      | Areas where I'm above/below average | Specific recommendations |
    And all data should be anonymized and aggregated

  Scenario: Quality reminders and notifications
    Given I haven't updated my profile recently
    When the system detects improvement opportunities
    Then I should receive helpful notifications:
      | Notification Type | Frequency |
      | Weekly quality tips | Weekly |
      | Missing information alerts | As needed |
      | New feature announcements | Monthly |
      | Quality score achievements | Immediately |
    And I should be able to control notification preferences

  Scenario: Profile review and validation
    Given I want professional feedback on my profile
    When I request a profile review
    Then I should receive detailed feedback on:
      | Review Aspect | Feedback |
      | Photo quality | Technical and aesthetic advice |
      | Description effectiveness | Writing and positioning tips |
      | Genre selection | Market positioning advice |
      | Overall presentation | Professional recommendations |
    And feedback should be actionable and specific