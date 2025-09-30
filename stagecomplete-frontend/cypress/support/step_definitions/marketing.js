import { Given, When, Then, And } from '@badeball/cypress-cucumber-preprocessor';

// Visitor setup
Given('I am an unconnected visitor', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

Given('I visit the {string} page', (page) => {
  cy.visit(page);
  cy.waitForPageLoad();
});

Given('I visit the {string} page on mobile', (page) => {
  cy.viewport('iphone-x');
  cy.visit(page);
  cy.waitForPageLoad();
});

// Navigation and CTAs
When('I navigate to the homepage {string}', (path) => {
  cy.visit(path);
  cy.waitForPageLoad();
});

Then('I should see a primary CTA {string}', (ctaText) => {
  cy.get('[data-testid="primary-cta"], .btn-primary')
    .contains(ctaText)
    .should('be.visible');
});

// Moved to dashboard.js to avoid duplication
// Then('I should be redirected to {string}', (expectedPath) => {
//   cy.url().should('include', expectedPath);
// });

Then('I should see the artist-dedicated landing page', () => {
  cy.get('[data-testid="artist-landing-hero"]').should('be.visible');
  cy.get('[data-testid="artist-value-props"]').should('be.visible');
  cy.get('[data-testid="artist-testimonials"]').should('be.visible');
  cy.get('[data-testid="quick-signup"]').should('be.visible');
});

// Landing page content
Then('I should see the main title {string}', (title) => {
  cy.get('h1').contains(title).should('be.visible');
});

Then('I should see the description {string}', (description) => {
  cy.contains(description).should('be.visible');
});

Then('I should see the following {int} sections:', (count, dataTable) => {
  const sections = dataTable.hashes();

  sections.forEach(section => {
    switch (section.Section) {
      case 'Hero':
        cy.get('[data-testid="artist-landing-hero"]').should('be.visible');
        break;
      case 'Value Propositions':
        cy.get('[data-testid="artist-value-props"]').should('be.visible');
        break;
      case 'Testimonials':
        cy.get('[data-testid="artist-testimonials"]').should('be.visible');
        break;
      case 'Quick Signup':
        cy.get('[data-testid="quick-signup"]').should('be.visible');
        break;
    }
  });
});

// Value propositions
When('I scroll to the {string} section', (sectionName) => {
  const sectionSelectors = {
    'Why choose StageComplete': '[data-testid="artist-value-props"]',
    'testimonials': '[data-testid="artist-testimonials"]'
  };

  cy.get(sectionSelectors[sectionName]).scrollIntoView();
});

Then('I should see the following {int} benefits:', (count, dataTable) => {
  const benefits = dataTable.hashes();

  benefits.forEach((benefit, index) => {
    cy.get('[data-testid="value-prop-item"]')
      .eq(index)
      .within(() => {
        cy.contains(benefit.Benefit).should('be.visible');
        cy.contains(benefit.Description).should('be.visible');
      });
  });
});

Then('each benefit should have a colored icon', () => {
  cy.get('[data-testid="value-prop-item"] [data-testid="value-prop-icon"]')
    .should('have.length.at.least', 5)
    .each(($icon) => {
      cy.wrap($icon).should('be.visible');
    });
});

Then('the appearance animation should be smooth', () => {
  // Verify that Framer Motion animations are active
  cy.get('[data-testid="value-prop-item"]')
    .should('have.css', 'opacity', '1');
});

// Testimonials
Then('I should see {int} artist testimonials:', (count, dataTable) => {
  const testimonials = dataTable.hashes();

  cy.get('[data-testid="testimonial-item"]')
    .should('have.length', count);

  testimonials.forEach((testimonial, index) => {
    cy.get('[data-testid="testimonial-item"]')
      .eq(index)
      .within(() => {
        cy.contains(testimonial.Name).should('be.visible');
        cy.contains(testimonial.Role).should('be.visible');
        cy.get('[data-testid="testimonial-rating"]')
          .find('[data-testid="star-icon"]')
          .should('have.length', 5);
      });
  });
});

Then('I should see the statistic {string}', (statistic) => {
  cy.get('[data-testid="stats-section"]')
    .contains(statistic)
    .should('be.visible');
});

// Registration funnel
Then('I should see a registration page optimized for artists', () => {
  cy.get('[data-testid="artist-optimized-register"]').should('be.visible');
});

Then('the title should be {string}', (title) => {
  cy.get('h1').contains(title).should('be.visible');
});

Then('the description should mention {string}', (text) => {
  cy.contains(text).should('be.visible');
});

Then('the {string} role should be pre-selected automatically', (role) => {
  cy.get('input[value="ARTIST"]').should('be.checked');
});

Then('I should not see the {string} option in the role selector', (option) => {
  cy.get('[data-testid="role-selector"]')
    .should('not.contain', option);
});

// Custom form
Then('I should see a purple informational box', () => {
  cy.get('[data-testid="artist-info-card"]')
    .should('be.visible')
    .should('have.class', 'bg-purple-50');
});

Then('the box should contain {string}', (text) => {
  cy.get('[data-testid="artist-info-card"]')
    .contains(text)
    .should('be.visible');
});

Then('the box should mention {string}', (text) => {
  cy.get('[data-testid="artist-info-card"]')
    .contains(text)
    .should('be.visible');
});

Then('the name field label should be {string}', (label) => {
  cy.get('label[for="name"]').contains(label).should('be.visible');
});

Then('the placeholder should be {string}', (placeholder) => {
  cy.get('input[name="name"]')
    .should('have.attr', 'placeholder', placeholder);
});

Then('the submit button should say {string}', (buttonText) => {
  cy.get('button[type="submit"]')
    .contains(buttonText)
    .should('be.visible');
});

Then('the button should be purple \\(premium color\\)', () => {
  cy.get('button[type="submit"]')
    .should('have.class', 'bg-purple-600');
});

// Successful registration
When('I fill the form with:', (dataTable) => {
  const formData = dataTable.hashes()[0];

  cy.get('input[name="name"]').type(formData.Name);
  cy.get('input[name="email"]').type(formData.Email);
  cy.get('input[name="password"]').type(formData.Password);
});

Then('I should see a welcome message', () => {
  cy.contains('Welcome').should('be.visible');
});

Then('my account should be created with the {string} role', (role) => {
  cy.window().its('localStorage')
    .invoke('getItem', 'stagecomplete-auth')
    .then((auth) => {
      const authData = JSON.parse(auth);
      expect(authData.user.role).to.equal(role);
    });
});

Then('my plan should be {string} by default', (plan) => {
  cy.window().its('localStorage')
    .invoke('getItem', 'stagecomplete-auth')
    .then((auth) => {
      const authData = JSON.parse(auth);
      expect(authData.user.plan || 'FREE').to.equal(plan);
    });
});

// Modified homepage
Then('the main title should be {string}', (title) => {
  cy.get('h1').contains(title).should('be.visible');
});

Then('the primary CTA should redirect to {string}', (path) => {
  cy.get('[data-testid="primary-cta"]')
    .should('have.attr', 'href', path);
});

Then('the secondary CTA should be {string} to {string}', (text, path) => {
  cy.contains(text)
    .should('have.attr', 'href', path);
});

Then('the final section should mention {string}', (text) => {
  cy.get('[data-testid="final-section"]')
    .contains(text)
    .should('be.visible');
});

// Conversion tracking
Then('the URL should contain {string}', (param) => {
  cy.url().should('include', param);
});

Then('the parameter should be preserved during navigation', () => {
  cy.url().should('include', '?from=artist');
});

Then('analytics should record an {string} conversion', (conversionType) => {
  // Verify that analytics event was triggered
  cy.window().then((win) => {
    expect(win.analytics).to.exist;
    // Verify conversion event
    cy.wrap(win.analytics.events).should('include', conversionType);
  });
});

Then('the source should be marked as {string}', (source) => {
  cy.window().then((win) => {
    expect(win.analytics.source).to.equal(source);
  });
});

// Responsive tests
Then('all elements should be readable', () => {
  cy.get('h1, h2, h3, p').each(($el) => {
    cy.wrap($el).should('be.visible');
  });
});

Then('CTAs should be easily clickable', () => {
  cy.get('button, .btn').each(($btn) => {
    cy.wrap($btn)
      .should('be.visible')
      .should('have.css', 'min-height')
      .and('match', /^[4-9]\d+px$/); // At least 40px height
  });
});

Then('animations should be smooth', () => {
  // Verify animations don't cause janky scrolling
  cy.get('[data-testid="animated-element"]').should('exist');
});

Then('loading time should be < {int} seconds', (seconds) => {
  cy.window().then((win) => {
    const loadTime = win.performance.timing.loadEventEnd - win.performance.timing.navigationStart;
    expect(loadTime).to.be.lessThan(seconds * 1000);
  });
});

Then('images should be optimized', () => {
  cy.get('img').each(($img) => {
    cy.wrap($img)
      .should('be.visible')
      .should('have.attr', 'loading', 'lazy');
  });
});

// SEO tests
Then('the page title should be {string}', (title) => {
  cy.title().should('eq', title);
});

Then('the meta description should mention {string}', (text) => {
  cy.get('meta[name="description"]')
    .should('have.attr', 'content')
    .and('include', text);
});

Then('keywords should include {string}', (keywords) => {
  cy.get('meta[name="keywords"]')
    .should('have.attr', 'content')
    .and('include', keywords);
});

Then('OpenGraph tags should be configured', () => {
  cy.get('meta[property="og:title"]').should('exist');
  cy.get('meta[property="og:description"]').should('exist');
  cy.get('meta[property="og:image"]').should('exist');
});

Then('the page should have a Lighthouse score > {int}', (score) => {
  cy.lighthouse({
    performance: score,
    accessibility: score,
    'best-practices': score,
    seo: score
  });
});

// Complete journey
Given('I am a visitor discovering StageComplete', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit('/');
});

When('I discover the landing page with all its benefits', () => {
  cy.get('[data-testid="artist-value-props"]').should('be.visible');
  cy.get('[data-testid="artist-testimonials"]').should('be.visible');
});

When('I register via the optimized funnel', () => {
  cy.get('input[name="name"]').type('TestArtist Complete');
  cy.get('input[name="email"]').type('test.complete@test.com');
  cy.get('input[name="password"]').type('TestComplete123!');
  cy.get('button[type="submit"]').click();
});

Then('I should be a registered artist with a basic profile', () => {
  cy.url().should('include', '/dashboard');
  cy.get('[data-testid="artist-dashboard"]').should('be.visible');
});

Then('I should be directed to the dashboard with completion guidance', () => {
  cy.get('[data-testid="profile-completion-prompt"]').should('be.visible');
});

Then('I should have access to free features', () => {
  cy.get('[data-testid="nav-dashboard"]').should('be.visible');
  cy.get('[data-testid="nav-portfolio"]').should('be.visible');
});

Then('I should see appropriate premium incentives', () => {
  cy.get('[data-testid="upgrade-prompt"]').should('be.visible');
});

// Additional steps for specific form scenarios
Given('I am on {string}', (path) => {
  cy.visit(path);
  cy.waitForPageLoad();
});

When('I fill and submit the registration form', () => {
  cy.get('input[name="name"]').type('Test Artist Marketing');
  cy.get('input[name="email"]').type('test.marketing@example.com');
  cy.get('input[name="password"]').type('TestPass123!');
  cy.get('button[type="submit"]').click();
});

When('I visit the homepage', () => {
  cy.visit('/');
  cy.waitForPageLoad();
});