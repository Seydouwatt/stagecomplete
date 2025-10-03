import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Smart filtering specific steps (common steps moved to common.js)

Given('I am on the search results page with active filters', () => {
  cy.visit('/directory?q=artiste&genres=Jazz,Blues');
  cy.get('[data-cy="active-filters"]').should('be.visible');
});

Given('I am on the search results page with multiple active filters', () => {
  cy.visit('/directory?q=artiste&genres=Jazz&location=Paris&minPrice=500');
  cy.get('[data-cy="active-filters"]').should('be.visible');
});

Given('I am on the search results page with filters {string}', (filters) => {
  cy.visit(`/directory?q=artiste&${filters}`);
});

Given('I have {string} and {string} genres selected', (genre1, genre2) => {
  cy.get('[data-cy="active-filters"]').within(() => {
    cy.contains(genre1).should('be.visible');
    cy.contains(genre2).should('be.visible');
  });
});

Given('I apply multiple filters on the search page', () => {
  cy.visit('/directory?q=artiste');
  cy.get('[data-cy="filters-button"]').click();
  cy.get('[data-cy="filter-panel"]').should('be.visible');

  // Select multiple filters
  cy.contains('button', 'Jazz').click();
  cy.contains('button', 'Guitare').click();
  cy.get('input[placeholder*="Paris"]').type('Paris');
  cy.get('input[placeholder="0"]').type('500');

  cy.contains('button', 'Appliquer').click();
});

When('I enter {string} as location', (location) => {
  cy.get('[data-cy="filter-panel"]').within(() => {
    cy.get('input[placeholder*="Paris"]').clear().type(location);
  });
});

When('I select additional filters', () => {
  cy.get('[data-cy="filter-panel"]').within(() => {
    cy.contains('button', 'Blues').click();
  });
});
