import { Given, When, Then, } from '@badeball/cypress-cucumber-preprocessor';

// Test user setup
Given('I am a new artist with a free plan', () => {
  // Create a test user with FREE plan
  cy.fixture('test-users.json').then((users) => {
    const freeArtist = users.artists.free;
    cy.registerArtist({
      name: freeArtist.name,
      email: freeArtist.email,
      password: freeArtist.password,
      role: 'ARTIST'
    });

    // Store user data for later use
    cy.wrap(freeArtist).as('currentUser');
    cy.wrap('FREE').as('userPlan');
  });
});

Given('I am logged in to my account', () => {
  // Verify that we are logged in (should already be logged in from previous steps)
  cy.url().should('include', '/dashboard');
  // Optional: verify user is authenticated by checking for user-specific elements
  cy.get('[data-testid="sidebar"]', { timeout: 10000 }).should('be.visible');
});

When('I navigate to my dashboard', () => {
  // Navigate to dashboard or ensure we're already there
  cy.visit('/dashboard');
  cy.get('[data-testid="sidebar"]').should('be.visible');
});

When('I navigate to {string}', (page) => {
  const pageRoutes = {
    'My Portfolio': '/artist/portfolio',
    'Messages': '/messages',
    'Calendar': '/calendar',
    'Settings': '/settings'
  };

  const route = pageRoutes[page] || page;
  cy.visit(route);
});

Given('I am an artist with a free plan', () => {
  cy.fixture('test-users.json').then((users) => {
    const freeArtist = users.artists.free;
    cy.loginAsArtist(freeArtist.email, freeArtist.password);
    cy.wrap('FREE').as('userPlan');
  });
});

Given('I am an artist with a premium plan', () => {
  cy.fixture('test-users.json').then((users) => {
    const premiumArtist = users.artists.premium;
    cy.registerArtist({
      name: premiumArtist.name,
      email: premiumArtist.email,
      password: premiumArtist.password,
      role: 'ARTIST'
    });
    // Store user data for later use
    cy.wrap(premiumArtist).as('currentUser');
    cy.wrap('PREMIUM').as('userPlan');
  });
});

// Sidebar verifications
Then('I should see only the following sections in the sidebar:', (dataTable) => {
  const sectionsExpected = {};
  dataTable.hashes().forEach(row => {
    sectionsExpected[row.Section] = row.Visible === 'Yes';
  });

  // Verify each section
  Object.entries(sectionsExpected).forEach(([section, shouldBeVisible]) => {
    const sectionSelectors = {
      'Dashboard': '[data-testid="nav-dashboard"]',
      'My Portfolio': '[data-testid="nav-portfolio"]',
      'Messages': '[data-testid="nav-messages"]',
      'Calendar': '[data-testid="nav-calendar"]',
      'Find Venues': '[data-testid="nav-browse-venues"]',
      'My Bookings': '[data-testid="nav-bookings"]',
      'Analytics': '[data-testid="nav-analytics"]',
      'My Info': '[data-testid="nav-profile"]',
      'Settings': '[data-testid="nav-settings"]',
      'Logout': '[data-testid="nav-logout"]'
    };

    if (shouldBeVisible) {
      cy.get(sectionSelectors[section]).should('be.visible');
    } else {
      cy.get(sectionSelectors[section]).should('not.exist');
    }
  });
});

Then('I should see an {string} button', (buttonText) => {
  cy.contains('button', buttonText).should('be.visible');
});

Then('I should not see the {string} button', (buttonText) => {
  cy.contains('button', buttonText).should('not.exist');
});

// Portfolio photo tests
When('I click on the {string} section', (sectionName) => {
  const sectionSelectors = {
    'Portfolio photos': '[data-testid="portfolio-photos-section"]'
  };
  cy.get(sectionSelectors[sectionName]).click();
});

Then('I should see the text {string}', (text) => {
  cy.contains(text).should('be.visible');
});

When('I try to add a 5th photo', () => {
  // Simulate uploading an additional photo
  cy.get('[data-testid="photo-upload-input"]').attachFile('test-images/sample-photo-5.jpg');
});

When('I upload {int} photos', (photoCount) => {
  for (let i = 1; i <= photoCount; i++) {
    cy.get('[data-testid="photo-upload-input"]').attachFile(`test-images/sample-photo-${i}.jpg`);
    cy.wait(1000); // Wait between uploads
  }
});

Then('I should see a message {string}', (message) => {
  cy.contains(message).should('be.visible');
});

Then('the upload should not be possible', () => {
  cy.get('[data-testid="photo-upload-input"]').should('be.disabled');
});

Then('all photos should be accepted', () => {
  cy.get('[data-testid="portfolio-photo"]').should('have.length', 8);
});

// Contextual limits tests
Given('I already have {int} photos in my portfolio', (photoCount) => {
  // Pre-populate portfolio with photos
  for (let i = 1; i <= photoCount; i++) {
    cy.addPhotoToPortfolio(`test-images/existing-photo-${i}.jpg`);
  }
});

Then('the upload button should be disabled or hidden', () => {
  cy.get('[data-testid="photo-upload-button"]')
    .should('satisfy', ($btn) => {
      return $btn.is(':disabled') || !$btn.is(':visible');
    });
});

// Plan change simulation
When('I change my plan to {string} in the user data', (plan) => {
  // Simulate plan change via API
  cy.get('@currentUser').then((user) => {
    cy.request('PUT', '/api/users/me', {
      plan: plan
    });
  });
});

When('I upgrade to a premium plan', () => {
  cy.get('@currentUser').then((user) => {
    cy.request('PUT', '/api/users/me', {
      plan: 'PREMIUM'
    });
  });
  cy.wrap('PREMIUM').as('userPlan');
});

// Plan display verification
When('I look at the bottom of the sidebar', () => {
  cy.get('[data-testid="sidebar-user-info"]').scrollIntoView();
});

Then('I should see {string} in my user information', (planText) => {
  cy.get('[data-testid="sidebar-user-info"]')
    .should('contain', planText);
});

Then('I should see all sections in the sidebar:', (dataTable) => {
  const sectionsExpected = {};
  dataTable.hashes().forEach(row => {
    sectionsExpected[row.Section] = row.Visible === 'Yes';
  });

  // Verify each section
  Object.entries(sectionsExpected).forEach(([section, shouldBeVisible]) => {
    const sectionSelectors = {
      'Dashboard': '[data-testid="nav-dashboard"]',
      'My Portfolio': '[data-testid="nav-portfolio"]',
      'Messages': '[data-testid="nav-messages"]',
      'Calendar': '[data-testid="nav-calendar"]',
      'Find Venues': '[data-testid="nav-browse-venues"]',
      'My Bookings': '[data-testid="nav-bookings"]',
      'Analytics': '[data-testid="nav-analytics"]',
      'My Info': '[data-testid="nav-profile"]',
      'Settings': '[data-testid="nav-settings"]',
      'Logout': '[data-testid="nav-logout"]'
    };

    if (shouldBeVisible) {
      cy.get(sectionSelectors[section]).should('be.visible');
    }
  });
});

Then('I should see all premium sections in the sidebar', () => {
  cy.get('[data-testid="nav-messages"]').should('be.visible');
  cy.get('[data-testid="nav-calendar"]').should('be.visible');
  cy.get('[data-testid="nav-browse-venues"]').should('be.visible');
  cy.get('[data-testid="nav-bookings"]').should('be.visible');
  cy.get('[data-testid="nav-analytics"]').should('be.visible');
});

Then('I should no longer see the {string} button', (buttonText) => {
  cy.contains('button', buttonText).should('not.exist');
});

Then('the photo limit should change to {string}', (limitText) => {
  cy.contains(limitText).should('be.visible');
});

// Premium route access tests
When('I try to access {string} directly', (route) => {
  cy.visit(route);
});

Then('I should be redirected to an upgrade page', () => {
  cy.url().should('not.include', '/messages');
  cy.get('[data-testid="upgrade-prompt"]').should('be.visible');
});

Then('I should see the {string} component', (componentName) => {
  const componentSelectors = {
    'UpgradePrompt': '[data-testid="upgrade-prompt"]'
  };
  cy.get(componentSelectors[componentName]).should('be.visible');
});

Then('I should see the price {string}', (price) => {
  cy.contains(price).should('be.visible');
});

Then('I should see premium benefits listed', () => {
  cy.get('[data-testid="premium-benefits"] [data-testid="benefit-item"]')
    .should('have.length.at.least', 4);
});

// Upgrade modal tests
When('I click on the {string} button in the sidebar', (buttonText) => {
  cy.get('[data-testid="sidebar"] button')
    .contains(buttonText)
    .click();
});

Then('I should see an upgrade modal open', () => {
  cy.get('[data-testid="upgrade-modal"]').should('be.visible');
});

Then('I should see the title {string}', (title) => {
  cy.get('[data-testid="upgrade-modal"] h1, [data-testid="upgrade-modal"] h2, [data-testid="upgrade-modal"] h3')
    .contains(title)
    .should('be.visible');
});

Then('I should see the following premium features:', (dataTable) => {
  const features = dataTable.hashes();

  features.forEach(feature => {
    cy.get('[data-testid="premium-features"]')
      .should('contain', feature.Feature)
      .should('contain', feature.Description);
  });
});

When('I click the close button', () => {
  cy.get('[data-testid="upgrade-modal"] [data-testid="close-button"]').click();
});

Then('the modal should close', () => {
  cy.get('[data-testid="upgrade-modal"]').should('not.exist');
});

// Account cleanup
Then('I delete my account', () => {
  // Navigate to settings and delete account for cleanup
  cy.visit('/settings');
  cy.get('[data-cy="delete-account-button"]').click();
  cy.get('[data-cy="current-password-input"]').type('TestPass123!');
  cy.get('[data-cy="delete-account-input"]').type('SUPPRIMER');
  cy.get('[data-cy="confirm-delete"]').click();
  cy.url().should('include', '/');
});

// Additional custom commands
Cypress.Commands.add('addPhotoToPortfolio', (imagePath) => {
  cy.get('[data-testid="photo-upload-input"]')
    .attachFile(imagePath);
  cy.wait(2000); // Wait for upload
});

Cypress.Commands.add('simulateUserPlan', (plan) => {
  // Intercept API calls to simulate user plan
  cy.intercept('GET', '/api/users/me', (req) => {
    req.reply((res) => {
      res.body.user.plan = plan;
      return res;
    });
  });
});