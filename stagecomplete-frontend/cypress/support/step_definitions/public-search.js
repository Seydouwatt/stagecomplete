import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Public Search Step Definitions

// Removed duplicate - using definition in public-profiles.js

Given('the search API is responding', () => {
  cy.intercept('GET', '**/api/public/artists/search*', {
    statusCode: 200,
    body: {
      artists: [],
      total: 0,
      hasMore: false
    }
  }).as('searchAPI');
});



Then('I should see a prominent search bar', () => {
  cy.get('[data-cy="public-search-bar"]').should('be.visible');
  cy.get('[data-cy="search-input"]').should('be.visible');
});

Then('I should see {string} hero message', (heroMessage) => {
  cy.get('[data-cy="hero-section"]').should('contain', heroMessage);
});

Then('I should see featured artists section', () => {
  cy.get('[data-cy="featured-artists"]').should('be.visible');
  cy.get('[data-cy="featured-artist-card"]').should('have.length.greaterThan', 0);
});

Then('I should see animated statistics counters', () => {
  cy.get('[data-cy="stats-counters"]').should('be.visible');
  cy.get('[data-cy="artists-count"]').should('be.visible');
  cy.get('[data-cy="profiles-views"]').should('be.visible');
});

When('I enter {string} in the search bar', (searchTerm) => {
  cy.get('[data-cy="search-input"]').clear().type(searchTerm);
});

When('I press Enter', () => {
  cy.get('[data-cy="search-input"]').type('{enter}');
});

Then('I should be redirected to search results page', () => {
  cy.url().should('include', '/search');
  cy.get('[data-cy="search-results-page"]').should('be.visible');
});

Then('I should see artists matching {string}', (searchTerm) => {
  cy.wait('@getPublicArtists');
  cy.get('[data-cy="artist-card"]').should('have.length.greaterThan', 0);
  cy.get('[data-cy="search-query-display"]').should('contain', searchTerm);
});

Then('I should see the total number of results', () => {
  cy.get('[data-cy="results-count"]').should('be.visible').and('contain', 'artiste');
});

Then('each artist card should display basic information', () => {
  cy.get('[data-cy="artist-card"]').first().within(() => {
    cy.get('[data-cy="artist-name"]').should('be.visible');
    cy.get('[data-cy="artist-location"]').should('be.visible');
    cy.get('[data-cy="artist-genres"]').should('be.visible');
    cy.get('[data-cy="artist-type"]').should('be.visible');
    // Price should NOT be visible to public
    cy.get('[data-cy="artist-price"]').should('not.exist');
  });
});

Given('I am on the search results page', () => {
  cy.visit('/search?q=jazz');
  cy.get('[data-cy="search-results-page"]').should('be.visible');
});



Then('I should see advanced filter options', () => {
  cy.get('[data-cy="advanced-filters"]').should('be.visible');
  cy.get('[data-cy="genre-filter"]').should('be.visible');
  cy.get('[data-cy="location-filter"]').should('be.visible');
  cy.get('[data-cy="artist-type-filter"]').should('be.visible');
});

When('I select {string} as genre', (genre) => {
  cy.get('[data-cy="genre-filter"]').click();
  cy.get(`[data-cy="genre-option-${genre.toLowerCase()}"]`).click();
});

When('I select {string} as location', (location) => {
  cy.get('[data-cy="location-filter"]').clear().type(location);
});

When('I apply filters', () => {
  cy.get('[data-cy="apply-filters-btn"]').click();
});

Then('I should see only jazz artists from Paris', () => {
  cy.get('[data-cy="artist-card"]').each(($card) => {
    cy.wrap($card).find('[data-cy="artist-genres"]').should('contain', 'Jazz');
    cy.wrap($card).find('[data-cy="artist-location"]').should('contain', 'Paris');
  });
});

Then('the URL should reflect the applied filters', () => {
  cy.url().should('include', 'genres=jazz');
  cy.url().should('include', 'location=Paris');
});

Given('I have granted location permissions', () => {
  // Mock geolocation
  cy.window().then((win) => {
    cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsArgWith(0, {
      coords: {
        latitude: 48.8566,
        longitude: 2.3522
      }
    });
  });
});

When('I search for {string}', (searchTerm) => {
  cy.get('[data-cy="search-input"]').clear().type(searchTerm);
  cy.get('[data-cy="search-input"]').type('{enter}');
});

Then('I should see artists sorted by distance from my location', () => {
  cy.get('[data-cy="artist-card"]').should('have.length.greaterThan', 1);
  cy.get('[data-cy="artist-distance"]').should('be.visible');
});

Then('each result should show approximate distance', () => {
  cy.get('[data-cy="artist-card"]').each(($card) => {
    cy.wrap($card).find('[data-cy="artist-distance"]').should('contain', 'km');
  });
});

// Removed duplicate - using definition in public-profiles.js

Then('I should see all jazz artists', () => {
  cy.get('[data-cy="directory-page"]').should('be.visible');
  cy.get('[data-cy="artist-card"]').should('have.length.greaterThan', 0);
});

Then('the page should have proper SEO meta tags', () => {
  cy.get('head meta[name="description"]').should('exist');
  cy.get('head title').should('contain', 'Jazz');
});

Then('I should see breadcrumb navigation', () => {
  cy.get('[data-cy="breadcrumbs"]').should('be.visible');
  cy.get('[data-cy="breadcrumbs"]').should('contain', 'Accueil');
  cy.get('[data-cy="breadcrumbs"]').should('contain', 'Artistes');
});

Then('I should see genre-specific information', () => {
  cy.get('[data-cy="genre-description"]').should('be.visible');
  cy.get('h1').should('contain', 'Jazz');
});

Then('I should see jazz artists from Paris', () => {
  cy.get('[data-cy="artist-card"]').should('have.length.greaterThan', 0);
});

Then('the page title should be {string}', (expectedTitle) => {
  cy.title().should('eq', expectedTitle);
});

Then('I should see quick filter options', () => {
  cy.get('[data-cy="quick-filters"]').should('be.visible');
  cy.get('[data-cy="genre-quick-filter"]').should('be.visible');
  cy.get('[data-cy="city-quick-filter"]').should('be.visible');
});

Then('the page should be optimized for search engines', () => {
  cy.get('head meta[property="og:title"]').should('exist');
  cy.get('head meta[property="og:description"]').should('exist');
  cy.get('head link[rel="canonical"]').should('exist');
});

Given('I am viewing search results', () => {
  cy.visit('/search?q=jazz');
  cy.wait('@getPublicArtists');
  cy.get('[data-cy="artist-card"]').should('have.length.greaterThan', 0);
});

Then('each artist card should show:', (dataTable) => {
  const expectedData = dataTable.hashes();

  cy.get('[data-cy="artist-card"]').first().within(() => {
    expectedData.forEach((row) => {
      const field = row.Field;
      const visibility = row.Visibility;

      if (visibility === 'Visible') {
        switch(field) {
          case 'Artist name':
            cy.get('[data-cy="artist-name"]').should('be.visible');
            break;
          case 'Photo or placeholder':
            cy.get('[data-cy="artist-photo"]').should('be.visible');
            break;
          case 'Location':
            cy.get('[data-cy="artist-location"]').should('be.visible');
            break;
          case 'Genres (max 2)':
            cy.get('[data-cy="artist-genres"] span').should('have.length.at.most', 2);
            break;
          case 'Artist type (Solo/Group)':
            cy.get('[data-cy="artist-type"]').should('be.visible');
            break;
        }
      } else if (visibility === 'Hidden from public') {
        switch(field) {
          case 'Price range':
            cy.get('[data-cy="artist-price"]').should('not.exist');
            break;
        }
      }
    });
  });
});

Then('cards should have hover effects', () => {
  cy.get('[data-cy="artist-card"]').first().trigger('mouseover');
  cy.get('[data-cy="artist-card"]').first().should('have.css', 'transform');
});

Then('cards should link to public profiles', () => {
  cy.get('[data-cy="artist-card"]').first().should('have.attr', 'href');
  cy.get('[data-cy="artist-card"]').first().click();
  cy.url().should('include', '/artist/');
});

Given('I am viewing search results with more than {int} artists', (count) => {
  cy.intercept('GET', '**/api/public/artists/search*', {
    body: {
      artists: new Array(count + 1).fill().map((_, i) => ({
        id: i,
        artistName: `Artist ${i}`,
        publicSlug: `artist-${i}`,
        genres: ['Jazz'],
        baseLocation: 'Paris'
      })),
      total: count + 5,
      hasMore: true
    }
  }).as('getManyArtists');

  cy.visit('/search?q=jazz');
  cy.wait('@getManyArtists');
});

Then('I should see a {string} button', (buttonText) => {
  cy.get('[data-cy="load-more-btn"]').should('be.visible').and('contain', buttonText);
});

When('I click the load more button', () => {
  cy.get('[data-cy="load-more-btn"]').click();
});

Then('additional artists should be loaded', () => {
  cy.get('[data-cy="artist-card"]').should('have.length.greaterThan', 12);
});

Then('the button should show loading state', () => {
  cy.get('[data-cy="load-more-btn"]').should('contain', 'loading');
});

Then('pagination should work smoothly', () => {
  cy.get('[data-cy="artist-card"]').should('be.visible');
  cy.scrollTo('bottom');
});

Given('I search for {string}', (searchTerm) => {
  cy.visit('/');
  cy.get('[data-cy="search-input"]').type(searchTerm);
  cy.get('[data-cy="search-input"]').type('{enter}');
});

Then('I should see no results message {string}', (message) => {
  cy.get('[data-cy="no-results-message"]').should('contain', message);
});

Then('I should see search suggestions', () => {
  cy.get('[data-cy="search-suggestions"]').should('be.visible');
  cy.get('[data-cy="search-suggestions"]').should('contain', 'Suggestions');
});

Then('I should see tips for better search results', () => {
  cy.get('[data-cy="search-tips"]').should('be.visible');
  cy.get('[data-cy="search-tips"]').should('contain', 'Essayez');
});

Given('I am on any search page', () => {
  cy.visit('/search');
});

When('I perform a search', () => {
  cy.get('[data-cy="search-input"]').type('jazz{enter}');
});

Then('results should load in less than {int} seconds', (seconds) => {
  const start = Date.now();
  cy.wait('@getPublicArtists').then(() => {
    const duration = Date.now() - start;
    expect(duration).to.be.lessThan(seconds * 1000);
  });
});

Then('the interface should remain responsive', () => {
  cy.get('[data-cy="search-results-page"]').should('be.visible');
  cy.get('[data-cy="search-input"]').should('not.be.disabled');
});

Then('loading states should be visible during search', () => {
  cy.get('[data-cy="loading-indicator"]').should('be.visible');
});

Given('I am on a mobile device', () => {
  cy.viewport('iphone-x');
});

When('I use the search functionality', () => {
  cy.get('[data-cy="search-input"]').type('jazz');
  cy.get('[data-cy="search-input"]').type('{enter}');
});

Then('the search interface should be touch-optimized', () => {
  cy.get('[data-cy="search-input"]').should('have.css', 'min-height', '44px');
  cy.get('[data-cy="search-btn"]').should('have.css', 'min-height', '44px');
});

Then('filters should open in mobile-friendly modals', () => {
  cy.get('[data-cy="filters-btn"]').click();
  cy.get('[data-cy="mobile-filters-modal"]').should('be.visible');
});

Then('results should be properly formatted for mobile', () => {
  cy.get('[data-cy="artist-card"]').should('be.visible');
  cy.get('[data-cy="artist-card"]').should('have.css', 'display', 'block');
});

Then('scrolling should be smooth', () => {
  cy.scrollTo('bottom', { duration: 1000 });
  cy.get('[data-cy="artist-card"]').should('be.visible');
});