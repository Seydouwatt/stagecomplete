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
  cy.get('[data-cy="quick-actions-section"]').should('be.visible');

  actions.forEach((action) => {
    cy.get('[data-cy="quick-actions-section"]').contains(action).should('be.visible');
  });
});

Then('I should be redirected to the artist profile page', () => {
  cy.url().should('include', '/artist/portfolio');
});

Then('I should be redirected to {string}', (url) => {
  cy.url().should('include', url);
});

Given('my profile is not complete', () => {
  // Profile completeness determined by actual data
  // New artists have incomplete profiles by default
  cy.log('Profile completeness will be determined by actual profile data');
});

Given('I have a complete artist profile', () => {
  // TODO: Implement complete profile creation
  // For now, we'll skip this scenario or mock it
  cy.log('Complete profile scenario - needs implementation');
});

Then('I should see a completion indicator', () => {
  cy.get('[data-cy="profile-completion-prompt"]').should('be.visible');
});

Then('I should not see a completion indicator', () => {
  cy.get('[data-cy="profile-completion-prompt"]').should('not.exist');
});

Then('the URL should contain {string}', (urlPart) => {
  cy.url().should('include', urlPart);
});