import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Dashboard specific step definitions

Then('I should see the following quick actions for incomplete profile:', (dataTable) => {
  const actions = dataTable.raw().flat();
  cy.get('[data-cy="quick-actions-section"]').should('be.visible');

  actions.forEach((action) => {
    cy.get('[data-cy="quick-actions-section"]').contains(action).should('be.visible');
  });
});

Then('I should see the following quick actions for complete profile:', (dataTable) => {
  const actions = dataTable.raw().flat();
  cy.get('[data-cy="quick-actions-section"]').scrollIntoView().should('be.visible');

  actions.forEach((action) => {
    cy.get('[data-cy="quick-actions-section"]').contains(action).should('exist');
  });
});

Then('I should be redirected to the artist profile page', () => {
  cy.url().should('include', '/artist/portfolio');
});


Given('my profile is not complete', () => {
  // Profile completeness determined by actual data
  // New artists have incomplete profiles by default
  cy.log('Profile completeness will be determined by actual profile data');
});

Given('I have a complete artist profile', () => {
  // Wait for dashboard to be fully loaded after Background login
  cy.url().should('include', '/dashboard');
  // Create a complete profile via API (100% completion)
  cy.createCompleteArtistProfile();
  // Reload dashboard to fetch updated profile data
  cy.reload();
  cy.url().should('include', '/dashboard');
});

Then('I should see a completion indicator', () => {
  cy.get('[data-cy="profile-completion-prompt"]').should('be.visible');
});

Then('I should not see a completion indicator', () => {
  cy.get('[data-cy="profile-completion-prompt"]').should('not.exist');
});

// Note: "the URL should contain {string}" step is defined in common.js