describe('Directory Navigation Test', () => {
  beforeEach(() => {
    // Mock the search API
    cy.intercept('GET', '**/api/public/artists/search*', {
      statusCode: 200,
      body: {
        artists: [
          {
            id: '1',
            name: 'Test Artist',
            artisticBio: 'Test bio',
            avatar: null,
            location: 'Paris',
            genres: ['Jazz'],
            instruments: ['Piano'],
            priceRange: '500-1000',
            experience: 'PROFESSIONAL',
            publicSlug: 'test-artist',
            portfolioPreview: []
          }
        ],
        pagination: { total: 1, page: 1, limit: 20, hasMore: false }
      }
    }).as('searchAPI');

    // Mock filters API
    cy.intercept('GET', '**/api/public/filters', {
      statusCode: 200,
      body: {
        genres: ['Jazz', 'Rock', 'Blues'],
        instruments: ['Piano', 'Guitare'],
        locations: ['Paris', 'Lyon']
      }
    }).as('filtersAPI');
  });

  it('should load directory page without authentication', () => {
    cy.visit('/directory');
    cy.url().should('include', '/directory');
    
    // Should see the discovery page without login
    cy.get('h1').should('contain', 'Découvrez des artistes');
  });

  it('should navigate to search when searching from directory', () => {
    cy.visit('/directory');
    cy.url().should('include', '/directory');
    
    // Perform a search
    cy.get('[data-cy="public-search-bar"]').should('exist');
    cy.get('[data-cy="public-search-bar"] input[type="text"]').first().type('jazz');
    cy.get('[data-cy="public-search-bar"] button[type="button"]').first().click();
    
    // Should navigate to search page (this is the expected behavior from directory)
    cy.url().should('include', '/search');
    cy.url().should('include', 'q=jazz');
  });

  it('should stay on search page when applying filters', () => {
    // Start with a search (simulating coming from directory)
    cy.visit('/search?q=jazz');
    cy.url().should('include', '/search');
    cy.url().should('include', 'q=jazz');
    
    // Wait for search results page to load
    cy.contains('Résultats pour').should('be.visible');
    
    // Open filters
    cy.get('[data-cy="filters-button"]').should('exist').click();
    cy.get('[data-cy="filter-panel"]').should('be.visible');
    
    // Apply a filter
    cy.get('[data-cy="filter-panel"]').within(() => {
      cy.contains('button', 'Jazz').click();
      cy.contains('button', 'Appliquer').click();
    });
    
    // Should stay on search page with additional parameters
    cy.url().should('include', '/search');
    cy.url().should('include', 'q=jazz');
    cy.url().should('include', 'genres=Jazz');
  });

  it('should preserve existing URL parameters when filtering on search page', () => {
    // Start with existing parameters
    cy.visit('/search?q=music&location=Paris');
    cy.url().should('include', '/search');
    cy.url().should('include', 'q=music');
    cy.url().should('include', 'location=Paris');
    
    // Wait for page load
    cy.contains('Résultats pour').should('be.visible');
    
    // Add a genre filter
    cy.get('[data-cy="filters-button"]').click();
    cy.get('[data-cy="filter-panel"]').within(() => {
      cy.contains('button', 'Rock').click();
      cy.contains('button', 'Appliquer').click();
    });
    
    // All parameters should be preserved
    cy.url().should('include', '/search');
    cy.url().should('include', 'q=music');
    cy.url().should('include', 'location=Paris');
    cy.url().should('include', 'genres=Rock');
  });

  it('should test PublicSearchBar navigation context logic', () => {
    // Test the key part of our fix: different behavior based on current page
    
    // From directory: should navigate to search
    cy.visit('/directory');
    cy.get('[data-cy="public-search-bar"]').should('exist');
    cy.get('[data-cy="public-search-bar"] input[type="text"]').first().type('jazz');
    cy.get('[data-cy="public-search-bar"] button[type="button"]').first().click();
    cy.url().should('include', '/search?q=jazz');
    
    // From search: should stay on search and update parameters
    cy.get('[data-cy="public-search-bar"] input[type="text"]').first().clear().type('rock');
    cy.get('[data-cy="public-search-bar"] button[type="button"]').first().click();
    cy.url().should('include', '/search?q=rock');
    cy.url().should('not.include', 'jazz'); // Previous query should be replaced
  });
});