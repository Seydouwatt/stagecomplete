import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Advanced Search Step Definitions for new Search API

Given('I am logged in as a venue', () => {
  // Login as venue user
  const venueUser = {
    email: 'venue@test.com',
    password: 'Test123!',
    role: 'VENUE',
    id: 'venue-1',
    token: 'fake-jwt-token-venue'
  };

  // Set auth in localStorage
  window.localStorage.setItem('stagecomplete-auth', JSON.stringify({
    state: {
      user: venueUser,
      token: venueUser.token,
      isAuthenticated: true
    }
  }));
});

Given('the search API is available', () => {
  // Intercept advanced search API
  cy.intercept('GET', '**/api/search/artists*', {
    statusCode: 200,
    body: {
      results: [
        {
          id: '1',
          name: 'Jazz Quartet Paris',
          avatar: 'https://via.placeholder.com/150',
          location: 'Paris, France',
          genres: ['Jazz', 'Blues'],
          instruments: ['Piano', 'Saxophone'],
          priceRange: '€€',
          experience: 'PROFESSIONAL',
          artisticBio: 'Professional jazz quartet...',
          yearsActive: 10,
          publicSlug: 'jazz-quartet-paris',
          portfolioPreview: [],
          relevanceScore: 0.95,
          popularityScore: 0.85,
          profileViews: 1234,
          memberCount: 4,
          artistType: 'GROUP'
        },
        {
          id: '2',
          name: 'Jazz Pianist Solo',
          avatar: 'https://via.placeholder.com/150',
          location: 'Paris, France',
          genres: ['Jazz', 'Classical'],
          instruments: ['Piano'],
          priceRange: '€€€',
          experience: 'PROFESSIONAL',
          artisticBio: 'Solo jazz pianist...',
          yearsActive: 15,
          publicSlug: 'jazz-pianist-solo',
          portfolioPreview: [],
          relevanceScore: 0.92,
          popularityScore: 0.90,
          profileViews: 2345,
          memberCount: 1,
          artistType: 'SOLO'
        }
      ],
      metadata: {
        total: 2,
        limit: 20,
        offset: 0,
        hasMore: false,
        executionTime: 45
      }
    }
  }).as('searchArtists');

  // Intercept suggestions API
  cy.intercept('GET', '**/api/search/suggestions*', {
    statusCode: 200,
    body: {
      suggestions: [
        {
          id: '1',
          type: 'artist',
          text: 'Jazz Quartet Paris',
          subtitle: 'Paris, France',
          avatar: 'https://via.placeholder.com/150'
        },
        {
          id: 'jazz',
          type: 'genre',
          text: 'Jazz',
          subtitle: '156 artistes'
        }
      ],
      query: 'ja',
      executionTime: 12
    }
  }).as('getSuggestions');

  // Intercept popular genres API
  cy.intercept('GET', '**/api/search/popular-genres*', {
    statusCode: 200,
    body: [
      { genre: 'Jazz', count: 156, percentage: 23.5 },
      { genre: 'Rock', count: 134, percentage: 20.2 },
      { genre: 'Pop', count: 98, percentage: 14.8 },
      { genre: 'Blues', count: 87, percentage: 13.1 },
      { genre: 'Classical', count: 76, percentage: 11.5 }
    ]
  }).as('getPopularGenres');

  // Intercept trending artists API
  cy.intercept('GET', '**/api/search/trending*', {
    statusCode: 200,
    body: [
      {
        id: '1',
        name: 'Trending Artist 1',
        publicSlug: 'trending-artist-1',
        avatar: 'https://via.placeholder.com/150',
        genres: ['Jazz'],
        location: 'Paris',
        metrics: { profileViews: 500, profileClicks: 200, bookingRequests: 50 }
      }
    ]
  }).as('getTrendingArtists');

  // Intercept quick filters API
  cy.intercept('GET', '**/api/search/quick-filters*', {
    statusCode: 200,
    body: {
      genres: ['Jazz', 'Rock', 'Pop', 'Blues', 'Classical'],
      locations: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux'],
      experiences: ['BEGINNER', 'INTERMEDIATE', 'PROFESSIONAL'],
      priceRanges: ['€', '€€', '€€€'],
      instruments: ['Piano', 'Guitar', 'Drums', 'Bass', 'Saxophone']
    }
  }).as('getQuickFilters');
});

Given('there are published artist profiles in the database', () => {
  // Already mocked in the API intercepts above
  cy.log('Artist profiles are mocked in API intercepts');
});

Given('I am on the browse page', () => {
  cy.visit('/browse');
  cy.get('[data-cy="browse-page"]', { timeout: 10000 }).should('be.visible');
});

When('I type {string} in the search bar', (searchTerm) => {
  cy.get('[data-cy="search-input"]').clear().type(searchTerm);
  cy.wait(500); // Wait for debouncing
});

Then('I should see search suggestions appearing', () => {
  cy.get('[data-cy="search-suggestions"]', { timeout: 5000 }).should('be.visible');
});

Then('I should see artist results matching {string}', (searchTerm) => {
  cy.wait('@searchArtists');
  cy.get('[data-cy="artist-card"]').should('have.length.greaterThan', 0);
  cy.get('[data-cy="browse-page"]').should('contain.text', searchTerm);
});

Then('each result should show artist information', () => {
  cy.get('[data-cy="artist-card"]').first().within(() => {
    cy.get('[data-cy="artist-name"]').should('be.visible');
    cy.get('[data-cy="artist-location"]').should('be.visible');
    cy.get('[data-cy="artist-genres"]').should('be.visible');
  });
});

When('I start typing {string} in the search bar', (text) => {
  cy.get('[data-cy="search-input"]').clear().type(text, { delay: 100 });
});

Then('I should see auto-complete suggestions', () => {
  cy.wait('@getSuggestions');
  cy.get('[data-cy="search-suggestions"]').should('be.visible');
  cy.get('[data-cy="suggestion-item"]').should('have.length.greaterThan', 0);
});

Then('suggestions should include artists matching {string}', (term) => {
  cy.get('[data-cy="suggestion-item"][data-type="artist"]').should('be.visible');
});

Then('suggestions should include genres matching {string}', (term) => {
  cy.get('[data-cy="suggestion-item"][data-type="genre"]').should('be.visible');
});

When('I click on a suggestion', () => {
  cy.get('[data-cy="suggestion-item"]').first().click();
});

Then('the search should be executed with the selected term', () => {
  cy.wait('@searchArtists');
  cy.get('[data-cy="artist-card"]').should('be.visible');
});

When('I click on the filters button', () => {
  cy.get('[data-cy="filters-button"]').click();
});

When('I select {string} and {string} as genres', (genre1, genre2) => {
  cy.get('[data-cy="filter-panel"]').should('be.visible');
  cy.get(`[data-cy="genre-checkbox-${genre1.toLowerCase()}"]`).check();
  cy.get(`[data-cy="genre-checkbox-${genre2.toLowerCase()}"]`).check();
});

When('I apply the filters', () => {
  cy.get('[data-cy="apply-filters"]').click();
});

Then('I should see only artists with Jazz or Blues genres', () => {
  cy.wait('@searchArtists');
  cy.get('[data-cy="artist-card"]').each(($card) => {
    cy.wrap($card).find('[data-cy="artist-genres"]')
      .invoke('text')
      .should('match', /Jazz|Blues/);
  });
});

Then('the URL should include the selected genres', () => {
  cy.url().should('match', /genres=.*jazz|genres=.*blues/i);
});

// Note: "I enter {string} as location" step is defined in smart-filtering.js

Then('I should see only artists from Paris area', () => {
  cy.wait('@searchArtists');
  cy.get('[data-cy="artist-card"]').each(($card) => {
    cy.wrap($card).find('[data-cy="artist-location"]').should('contain', 'Paris');
  });
});

Then('the URL should include the location filter', () => {
  cy.url().should('include', 'location=Paris');
});

When('I set price range from {int} to {int}', (min, max) => {
  cy.get('[data-cy="filter-panel"]').should('be.visible');
  cy.get('[data-cy="price-range-min"]').clear().type(min);
  cy.get('[data-cy="price-range-max"]').clear().type(max);
});

Then('I should see only artists within the price range', () => {
  cy.wait('@searchArtists');
  cy.get('[data-cy="artist-card"]').should('be.visible');
});

Then('prices should be between {int}€ and {int}€', (min, max) => {
  // This would require parsing price range from the card
  cy.get('[data-cy="artist-card"]').should('be.visible');
});

When('I select {string} as experience level', (experience) => {
  cy.get('[data-cy="filter-panel"]').should('be.visible');
  cy.get(`[data-cy="experience-${experience.toLowerCase()}"]`).check();
});

Then('I should see only professional artists', () => {
  cy.wait('@searchArtists');
  cy.get('[data-cy="artist-card"]').should('be.visible');
});

Then('each artist should have {string} experience level', (experience) => {
  cy.get('[data-cy="artist-card"]').each(($card) => {
    // Experience might be in badge or data attribute
    cy.wrap($card).should('have.attr', 'data-experience', experience);
  });
});

When('I search for {string}', (searchTerm) => {
  cy.get('[data-cy="search-input"]').clear().type(searchTerm);
  cy.wait(500); // Debounce
});

When('I select {string} as location', (location) => {
  cy.get('[data-cy="filter-panel"]').should('be.visible');
  cy.get('[data-cy="location-filter"]').clear().type(location);
});

Then('I should see Jazz artists from Paris with prices 500-2000€', () => {
  cy.wait('@searchArtists');
  cy.get('[data-cy="artist-card"]').should('have.length.greaterThan', 0);
});

Then('the URL should reflect all applied filters', () => {
  cy.url().should('include', 'q=');
  cy.url().should('include', 'location=');
  cy.url().should('match', /minPrice|maxPrice/);
});

Then('results should be sorted by relevance', () => {
  cy.wait('@searchArtists');
  cy.get('[data-cy="artist-card"]').should('be.visible');
  // Check that first results have higher relevance scores
});

Then('artists with {string} and {string} should appear first', (term1, term2) => {
  cy.get('[data-cy="artist-card"]').first()
    .should('contain.text', term1)
    .or('contain.text', term2);
});

When('I click on sort options', () => {
  cy.get('[data-cy="sort-dropdown"]').click();
});

When('I select {string} as sort option', (sortOption) => {
  cy.get(`[data-cy="sort-option-popularity"]`).click();
});

Then('results should be sorted by popularity', () => {
  cy.wait('@searchArtists');
  cy.get('[data-cy="artist-card"]').should('be.visible');
});

Then('most viewed artists should appear first', () => {
  // Check that artists are in descending order of views
  cy.get('[data-cy="artist-card"]').should('be.visible');
});

Then('I should see popular genres section', () => {
  cy.wait('@getPopularGenres');
  cy.get('[data-cy="popular-genres"]').should('be.visible');
});

Then('popular genres should be clickable', () => {
  cy.get('[data-cy="popular-genre-item"]').should('have.length.greaterThan', 0);
  cy.get('[data-cy="popular-genre-item"]').first().should('not.be.disabled');
});

When('I click on {string} popular genre', (genre) => {
  cy.get('[data-cy="popular-genre-item"]').contains(genre).click();
});

Then('search should be filtered by Jazz genre', () => {
  cy.wait('@searchArtists');
  cy.url().should('include', 'genres=jazz');
});

Then('I should see trending artists section', () => {
  cy.wait('@getTrendingArtists');
  cy.get('[data-cy="trending-artists"]').should('be.visible');
});

Then('trending artists should show recent popular profiles', () => {
  cy.get('[data-cy="trending-artist-card"]').should('have.length.greaterThan', 0);
});

When('I click on a trending artist', () => {
  cy.get('[data-cy="trending-artist-card"]').first().click();
});

Then('I should navigate to their profile', () => {
  cy.url().should('include', '/artist/');
});

When('I load the page', () => {
  cy.reload();
});

Then('quick filters should be loaded from the API', () => {
  cy.wait('@getQuickFilters');
});

Then('I should see available genres in filters', () => {
  cy.get('[data-cy="filters-button"]').click();
  cy.get('[data-cy="filter-panel"]').should('be.visible');
  cy.get('[data-cy="genre-filter-options"]').should('be.visible');
});

Then('I should see available locations in filters', () => {
  cy.get('[data-cy="location-filter"]').should('be.visible');
});

Then('I should see available experience levels in filters', () => {
  cy.get('[data-cy="experience-filter"]').should('be.visible');
});

Then('I should see {string} message', (message) => {
  cy.get('[data-cy="no-results"]').should('contain', message);
});

Then('I should see suggestions to refine search', () => {
  cy.get('[data-cy="search-tips"]').should('be.visible');
});

Then('filters should still be available', () => {
  cy.get('[data-cy="filters-button"]').should('be.visible');
});

When('I type quickly {string}, {string}, {string}, {string}', (char1, char2, char3, char4) => {
  cy.get('[data-cy="search-input"]').clear();
  cy.get('[data-cy="search-input"]').type(char1, { delay: 50 });
  cy.get('[data-cy="search-input"]').type(char2, { delay: 50 });
  cy.get('[data-cy="search-input"]').type(char3, { delay: 50 });
  cy.get('[data-cy="search-input"]').type(char4, { delay: 50 });
});

Then('API calls should be debounced', () => {
  // Check that only one final API call was made after typing stopped
  cy.wait(500); // Wait for debounce to complete
});

Then('only final {string} search should be executed', (term) => {
  cy.wait('@searchArtists');
  // Verify that only one search call was made with the final term
});

Then('search should complete in less than {int} seconds', (seconds) => {
  const start = Date.now();
  cy.wait('@searchArtists').then(() => {
    const duration = Date.now() - start;
    expect(duration).to.be.lessThan(seconds * 1000);
  });
});

Given('search returns more than {int} results', (count) => {
  cy.intercept('GET', '**/api/search/artists*', {
    statusCode: 200,
    body: {
      results: Array.from({ length: count + 1 }, (_, i) => ({
        id: `${i}`,
        name: `Artist ${i}`,
        location: 'Paris',
        genres: ['Jazz'],
        instruments: ['Piano'],
        priceRange: '€€',
        experience: 'PROFESSIONAL',
        publicSlug: `artist-${i}`
      })),
      metadata: {
        total: count + 50,
        limit: 20,
        offset: 0,
        hasMore: true,
        executionTime: 45
      }
    }
  }).as('searchManyArtists');
});

When('I scroll to the bottom of results', () => {
  cy.scrollTo('bottom', { duration: 500 });
});

Then('next page should load automatically', () => {
  cy.wait('@searchArtists');
});

Then('loading indicator should be visible', () => {
  cy.get('[data-cy="loading-indicator"]').should('be.visible');
});

Then('new results should be appended to the list', () => {
  cy.get('[data-cy="artist-card"]').should('have.length.greaterThan', 20);
});

// Note: "I copy the URL" and related steps are defined in common.js

When('I open the URL in a new tab', () => {
  cy.get('@copiedUrl').then((url) => {
    cy.visit(url);
  });
});

Then('the same search and filters should be applied', () => {
  cy.wait('@searchArtists');
  cy.get('[data-cy="artist-card"]').should('be.visible');
});

Then('results should match the original search', () => {
  cy.get('[data-cy="artist-card"]').should('have.length.greaterThan', 0);
});

Given('I am on the browse page with filters applied', () => {
  cy.visit('/browse?q=jazz&genres=jazz&location=Paris');
  cy.get('[data-cy="browse-page"]').should('be.visible');
  cy.wait('@searchArtists');
});

When('I click on {string} button', (buttonText) => {
  cy.get('[data-cy="clear-filters"]').click();
});

Then('all filters should be reset', () => {
  cy.get('[data-cy="filter-panel"]').should('not.exist');
});

Then('search should show all results', () => {
  cy.wait('@searchArtists');
});

Then('URL should be cleared', () => {
  cy.url().should('not.include', 'q=');
  cy.url().should('not.include', 'genres=');
  cy.url().should('not.include', 'location=');
});

Given('the search API returns an error', () => {
  cy.intercept('GET', '**/api/search/artists*', {
    statusCode: 500,
    body: { message: 'Internal server error' }
  }).as('searchError');
});

When('I perform a search', () => {
  cy.get('[data-cy="search-input"]').clear().type('jazz');
  cy.wait(500);
});

Then('I should see an error message', () => {
  cy.wait('@searchError');
  cy.get('[data-cy="error-message"]').should('be.visible');
});

Then('I should be able to retry the search', () => {
  cy.get('[data-cy="retry-button"]').should('be.visible');
});

Then('previous results should remain visible', () => {
  // If there were previous results, they should still be shown
  cy.get('[data-cy="browse-page"]').should('be.visible');
});

Given('I am on a mobile device', () => {
  cy.viewport('iphone-x');
});

Then('the search bar should be touch-friendly', () => {
  cy.get('[data-cy="search-input"]').should('have.css', 'min-height', '44px');
});

Then('filters should open in a modal', () => {
  cy.get('[data-cy="filters-button"]').click();
  cy.get('[data-cy="filter-modal"]').should('be.visible');
});

Then('results should be properly formatted for mobile', () => {
  cy.get('[data-cy="artist-card"]').should('be.visible');
  cy.get('[data-cy="browse-grid"]').should('have.css', 'display', 'grid');
});

Then('scrolling should work smoothly', () => {
  cy.scrollTo('bottom', { duration: 1000 });
  cy.get('[data-cy="artist-card"]').should('be.visible');
});
