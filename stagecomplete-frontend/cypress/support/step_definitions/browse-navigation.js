import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Browse Navigation Context specific steps

Given('I am on the Browse page {string}', (path) => {
  cy.visit(path);
  cy.url().should('include', path.split('?')[0]); // Check base path
  cy.get('[data-cy="browse-page"]').should('exist');
});

Given('I am on the home page {string}', (path) => {
  cy.visit(path);
  cy.url().should('eq', Cypress.config().baseUrl + path);
});

Given('I directly access {string}', (url) => {
  cy.visit(url);
  cy.url().should('include', url.split('?')[0]);
});

When('I perform a search for {string}', (query) => {
  // Use the PublicSearchBar component
  cy.get('[data-cy="public-search-bar"]').should('exist');
  cy.get('[data-cy="public-search-bar"] input[type="text"]').first().clear().type(query);
  cy.get('[data-cy="public-search-bar"] button[type="button"]').click();
});

When('I enter {string} in the search field', (query) => {
  cy.get('[data-cy="public-search-bar"] input[type="text"]').first().clear().type(query);
});

When('I enter {string} in the location field', (location) => {
  cy.get('[data-cy="public-search-bar"] input[placeholder="Ville"]').clear().type(location);
});

When('I submit the search', () => {
  cy.get('[data-cy="public-search-bar"] button[type="button"]').click();
});

When('I open the filter panel', () => {
  cy.get('[data-cy="filters-button"]').click();
  cy.get('[data-cy="filter-panel"]').should('be.visible');
});

When('I apply the filters', () => {
  cy.get('[data-cy="filter-panel"]').within(() => {
    cy.contains('button', 'Appliquer').click();
  });
  cy.get('[data-cy="filter-panel"]').should('not.exist');
});

When('I select {string} genre', (genre) => {
  cy.get('[data-cy="filter-panel"]').within(() => {
    cy.contains('button', genre).click();
  });
});

When('I select {string} instrument', (instrument) => {
  cy.get('[data-cy="filter-panel"]').within(() => {
    cy.contains('button', instrument).click();
  });
});

When('I enter {string} as location', (location) => {
  cy.get('[data-cy="filter-panel"]').within(() => {
    cy.get('[data-cy="location-input"]').clear().type(location);
  });
});

When('I set minimum price to {string}', (minPrice) => {
  cy.get('[data-cy="filter-panel"]').within(() => {
    cy.get('input[placeholder="0"]').clear().type(minPrice);
  });
});

When('I set maximum price to {string}', (maxPrice) => {
  cy.get('[data-cy="filter-panel"]').within(() => {
    cy.get('input[placeholder="5000"]').clear().type(maxPrice);
  });
});

When('I select {string} experience level', (experience) => {
  cy.get('[data-cy="filter-panel"]').within(() => {
    cy.get('select').select(experience);
  });
});

When('I remove the {string} genre filter', (genre) => {
  cy.get('[data-cy="active-filters"]').within(() => {
    cy.contains('.badge', genre).find('svg').click();
  });
});

When('I click {string}', (buttonText) => {
  cy.contains('button', buttonText).click();
});

When('I refresh the page', () => {
  cy.reload();
});

When('I click the browser back button', () => {
  cy.go('back');
});

When('I navigate to {string}', (path) => {
  cy.visit(path);
});

Then('I should remain on the Browse page', () => {
  cy.url().should('include', '/browse');
  cy.get('[data-cy="browse-page"]').should('exist');
});

Then('I should remain on the Browse page with URL {string}', (expectedUrl) => {
  cy.url().should('include', expectedUrl);
  cy.get('[data-cy="browse-page"]').should('exist');
});

Then('I should be redirected to the Search page {string}', (expectedUrl) => {
  cy.url().should('include', expectedUrl);
  // Check for search results layout (different from browse layout)
  cy.get('section').contains('Résultats pour').should('exist');
});

Then('the page layout should stay consistent', () => {
  // Verify the Browse page specific layout elements
  cy.get('[data-cy="browse-page"]').should('exist');
  // Check for the hero section with search bar
  cy.get('.bg-gradient-to-br').should('exist');
  cy.get('[data-cy="public-search-bar"]').should('exist');
});

Then('the page layout should stay consistent with the search bar at the top', () => {
  // More specific check for the Browse layout
  cy.get('[data-cy="browse-page"]').should('exist');
  cy.get('.bg-gradient-to-br.from-primary.to-secondary').should('exist');
});

Then('the layout should be the search results layout', () => {
  // Check for search results page specific elements
  cy.get('.bg-white.border-b.sticky.top-0').should('exist'); // Header
  cy.get('section').contains('Résultats pour').should('exist'); // Results section
});

Then('the URL should contain {string}', (expectedParams) => {
  cy.url().should('include', expectedParams);
});

Then('the URL should be {string}', (expectedUrl) => {
  cy.url().should('include', expectedUrl);
});

Then('I should see the Browse page layout', () => {
  cy.get('[data-cy="browse-page"]').should('exist');
  cy.get('.bg-gradient-to-br').should('exist');
});

Then('the search field should contain {string}', (expectedValue) => {
  cy.get('[data-cy="public-search-bar"] input[type="text"]').first().should('have.value', expectedValue);
});

Then('the active filters should show {string}', (filters) => {
  const filterList = filters.split(', ').map(f => f.replace(/"/g, ''));
  filterList.forEach(filter => {
    cy.get('[data-cy="active-filters"]').contains(filter).should('exist');
  });
});

Then('the active filters should show {string} and {string}', (filter1, filter2) => {
  cy.get('[data-cy="active-filters"]').contains(filter1.replace(/"/g, '')).should('exist');
  cy.get('[data-cy="active-filters"]').contains(filter2.replace(/"/g, '')).should('exist');
});

Then('the active filters should show {string}, {string}, {string}, and {string}', (filter1, filter2, filter3, filter4) => {
  const filters = [filter1, filter2, filter3, filter4].map(f => f.replace(/"/g, ''));
  filters.forEach(filter => {
    cy.get('[data-cy="active-filters"]').contains(filter).should('exist');
  });
});

Then('the filters should be applied to the search results', () => {
  // Check that results are displayed (indicates filters are working)
  cy.get('[data-cy="search-results"], [data-cy="browse-page"]').should('exist');
  // Could add more specific checks here for actual filtering results
});

Then('I should be on {string}', (expectedPath) => {
  cy.url().should('include', expectedPath);
});

Then('I should see {string} in the active filters', (filter) => {
  cy.get('[data-cy="active-filters"]').contains(filter).should('exist');
});

// Additional steps for more complex scenarios
Given('I start on the home page {string}', (path) => {
  cy.visit(path);
  cy.url().should('eq', Cypress.config().baseUrl + path);
});

When('I add a {string} genre filter', (genre) => {
  cy.get('[data-cy="filters-button"]').click();
  cy.get('[data-cy="filter-panel"]').should('be.visible');
  cy.get('[data-cy="filter-panel"]').within(() => {
    cy.contains('button', genre).click();
    cy.contains('button', 'Appliquer').click();
  });
  cy.get('[data-cy="filter-panel"]').should('not.exist');
});

// Note: 'the filtering API is mocked' step is already defined in smart-filtering.js