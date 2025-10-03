import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Smart filtering specific steps (common steps moved to common.js)

// Setup API mocks with fixtures
Given('the filtering API is mocked', () => {
  cy.fixture('filter-test-artists').then((data) => {
    // Mock search API to return filtered results based on query params
    cy.intercept('GET', '**/api/public/artists/search*', (req) => {
      const url = new URL(req.url);
      const params = url.searchParams;

      let filteredArtists = [...data.artists];

      // Filter by genres
      const genres = params.get('genres')?.split(',').filter(Boolean);
      if (genres && genres.length > 0) {
        filteredArtists = filteredArtists.filter(artist =>
          artist.artisticGenres.some(g => genres.includes(g))
        );
      }

      // Filter by instruments
      const instruments = params.get('instruments')?.split(',').filter(Boolean);
      if (instruments && instruments.length > 0) {
        filteredArtists = filteredArtists.filter(artist =>
          artist.instruments.some(i => instruments.includes(i))
        );
      }

      // Filter by location
      const location = params.get('location');
      if (location) {
        filteredArtists = filteredArtists.filter(artist =>
          artist.baseLocation.includes(location)
        );
      }

      // Filter by price range
      const minPrice = params.get('minPrice');
      const maxPrice = params.get('maxPrice');
      if (minPrice) {
        filteredArtists = filteredArtists.filter(artist =>
          artist.maxRate >= parseInt(minPrice)
        );
      }
      if (maxPrice) {
        filteredArtists = filteredArtists.filter(artist =>
          artist.minRate <= parseInt(maxPrice)
        );
      }

      // Filter by experience
      const experience = params.get('experience');
      if (experience) {
        filteredArtists = filteredArtists.filter(artist =>
          artist.experience === experience
        );
      }

      // Filter by availability
      const availableOnly = params.get('availableOnly');
      if (availableOnly === 'true') {
        filteredArtists = filteredArtists.filter(artist => artist.availableNow);
      }

      req.reply({
        statusCode: 200,
        body: {
          artists: filteredArtists,
          total: filteredArtists.length,
          hasMore: false
        }
      });
    }).as('searchArtists');

    // Mock quick filters API
    cy.intercept('GET', '**/api/search/quick-filters', {
      statusCode: 200,
      body: data.quickFilters
    }).as('quickFilters');
  });
});

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
