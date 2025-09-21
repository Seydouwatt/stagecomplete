Feature: Growth and Conversion Features
  As a platform owner
  I want to maximize artist registration and engagement
  So that the platform grows and provides value to all users

  Background:
    Given the application is accessible
    And the growth features are active

  Scenario: Landing page conversion optimization
    Given I visit the homepage as a new visitor
    Then I should see compelling conversion elements:
      | Element | Purpose |
      | Hero section | Clear value proposition |
      | "Créez votre profil" CTA | Primary conversion action |
      | Artist testimonials | Social proof |
      | Success statistics | Platform credibility |
      | Featured artists | Content quality demonstration |
    And CTAs should be prominently displayed throughout the page

  Scenario: Social proof and credibility indicators
    Given I am exploring the platform
    Then I should see social proof elements:
      | Proof Type | Display |
      | Artist count | "Déjà 500+ artistes inscrits" |
      | Monthly profile views | "1000+ vues mensuelles" |
      | Success stories | Artist testimonials |
      | Platform benefits | Clear value propositions |
    And numbers should update in real-time
    And testimonials should rotate or be varied

  Scenario: Call-to-action optimization
    Given I am browsing as an unregistered visitor
    Then I should see strategic CTAs:
      | Page | CTA Placement |
      | Homepage | Hero, featured artists, footer |
      | Artist profiles | "Créez votre profil" banner |
      | Search results | "Rejoignez ces artistes" |
      | Directory pages | "Votre profil pourrait être ici" |
    And CTAs should be contextually relevant
    And button text should be action-oriented

  Scenario: Landing pages for specific audiences
    Given I visit targeted landing pages:
      | URL | Target Audience |
      | /musiciens-paris | Musicians in Paris |
      | /chanteurs-lyon | Singers in Lyon |
      | /groupes-rock | Rock bands |
      | /artistes-jazz | Jazz artists |
    Then each page should be customized for the audience
    And content should address specific needs
    And local references should be included

  Scenario: Registration funnel optimization
    Given I decide to create an account
    When I click "Créez votre profil"
    Then the registration process should be streamlined:
      | Step | Elements |
      | 1 | Minimal required fields |
      | 2 | Clear progress indicator |
      | 3 | Immediate value demonstration |
      | 4 | Welcome sequence activation |
    And barriers to completion should be minimized
    And I should understand the immediate next steps

  Scenario: Urgency and scarcity elements
    Given I am considering registration
    Then I might see appropriate urgency indicators:
      | Element | Message |
      | Limited time offer | "Inscription gratuite ce mois-ci" |
      | Community size | "Rejoignez une communauté croissante" |
      | Competitive advantage | "Soyez visible avant vos concurrents" |
    And urgency should feel authentic, not manipulative

  Scenario: Email capture and nurturing
    Given I am interested but not ready to register
    When I show exit intent or prolonged browsing
    Then I might see an email capture offer:
      | Offer | Value Proposition |
      | Newsletter | "Recevez nos conseils pour artistes" |
      | Tips guide | "Guide gratuit: Optimiser son profil" |
      | Updates | "Soyez informé des nouvelles fonctionnalités" |
    And the value exchange should be clear and fair

  Scenario: Referral and viral features
    Given I am a registered artist
    When I access referral features
    Then I should be able to:
      | Action | Incentive |
      | Invite other artists | Bonus features or recognition |
      | Share platform content | Increased visibility |
      | Provide testimonials | Platform promotion |
    And sharing should be simple and rewarding

  Scenario: Onboarding experience optimization
    Given I just registered as a new artist
    Then I should experience a guided onboarding:
      | Step | Objective |
      | Welcome tour | Platform orientation |
      | Profile completion | Immediate value creation |
      | First publication | Quick success experience |
      | Next steps guidance | Continued engagement |
    And each step should provide clear value
    And I should feel accomplished throughout

  Scenario: Re-engagement for inactive users
    Given I registered but haven't completed my profile
    When time passes without engagement
    Then I should receive re-engagement attempts:
      | Timing | Message Type |
      | 24 hours | Completion reminder |
      | 1 week | Success stories from other artists |
      | 1 month | New features announcement |
    And messages should provide new value or motivation

  Scenario: Conversion tracking and optimization
    Given the platform tracks user behavior
    Then key conversion metrics should be monitored:
      | Metric | Target |
      | Homepage to registration | >2% conversion |
      | Registration to profile completion | >50% |
      | Completed to published profile | >70% |
      | Time to first publication | <24 hours |
    And data should inform continuous optimization

  Scenario: A/B testing infrastructure
    Given the platform runs conversion experiments
    When I visit as part of test groups
    Then I might see variations of:
      | Element | Variations |
      | CTA button colors | Different colors/contrast |
      | Headlines | Different value propositions |
      | Social proof | Different statistics/testimonials |
      | Form fields | Different required information |
    And my experience should be consistent within my test group
    And experiments should not degrade user experience

  Scenario: Performance impact on conversion
    Given page load speed affects conversion
    When I navigate through the conversion funnel
    Then all pages should load quickly:
      | Page Type | Load Time Target |
      | Landing pages | <2 seconds |
      | Registration forms | <1.5 seconds |
      | Dashboard | <2.5 seconds |
    And slow pages should not break the conversion flow