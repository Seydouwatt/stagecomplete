// Import commands.js using ES2015 syntax:
import './commands';

// Global setup
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  // during development (React strict mode errors, etc.)
  return false;
});

beforeEach(() => {
  // Clear localStorage before each test
  cy.clearLocalStorage();
  
  // Intercept API calls for consistent testing
  cy.intercept('GET', '**/api/auth/me').as('getMe');
  cy.intercept('POST', '**/api/auth/register').as('register');
  cy.intercept('POST', '**/api/auth/login').as('login');
  cy.intercept('PUT', '**/api/auth/artist/profile').as('updateProfile');
  cy.intercept('GET', '**/api/auth/artist/members').as('getMembers');
  cy.intercept('POST', '**/api/auth/artist/members').as('createMember');
});