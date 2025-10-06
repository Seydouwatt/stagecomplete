describe('Browse Navigation Context Fix', () => {
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

  it('should stay on Browse page when searching from Browse', () => {
    // Login first to access protected Browse page
    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password');
    cy.get('button[type="submit"]').click();
    
    // Visit Browse page
    cy.visit('/browse');
    cy.url().should('include', '/browse');
    
    // Verify we have the Browse page layout
    cy.get('[data-cy="browse-page"]').should('exist');
    
    // Perform a search using PublicSearchBar
    cy.get('[data-cy="public-search-bar"]').should('exist');
    cy.get('[data-cy="public-search-bar"] input[type="text"]').first().type('jazz');
    cy.get('[data-cy="public-search-bar"] button').click();
    
    // Should stay on Browse page with query parameter
    cy.url().should('include', '/browse');
    cy.url().should('include', 'q=jazz');
    
    // Should still have Browse page layout
    cy.get('[data-cy="browse-page"]').should('exist');
  });

  it('should navigate to Search page when searching from home', () => {
    // Visit home page
    cy.visit('/');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // Perform a search - this should navigate to search page
    cy.get('[data-cy="public-search-bar"]').should('exist');
    cy.get('[data-cy="public-search-bar"] input[type="text"]').first().type('jazz');
    cy.get('[data-cy="public-search-bar"] button').click();
    
    // Should navigate to Search page (not Browse)
    cy.url().should('include', '/search');
    cy.url().should('include', 'q=jazz');
  });

  it('should stay on Browse when applying filters', () => {
    // Start on Browse page with a search
    cy.visit('/browse?q=jazz');
    cy.url().should('include', '/browse');
    cy.url().should('include', 'q=jazz');
    
    // Wait for the page to load
    cy.get('[data-cy="browse-page"]').should('exist');
    
    // Open filters (should exist if Browse page is properly loaded)
    cy.get('[data-cy="filters-button"]').should('exist').click();
    cy.get('[data-cy="filter-panel"]').should('be.visible');
    
    // Apply a filter
    cy.get('[data-cy="filter-panel"]').within(() => {
      // Select a genre
      cy.contains('button', 'Jazz').click();
      // Apply filters
      cy.contains('button', 'Appliquer').click();
    });
    
    // Should stay on Browse page with additional parameters
    cy.url().should('include', '/browse');
    cy.url().should('include', 'q=jazz');
    cy.url().should('include', 'genres=Jazz');
    
    // Should still have Browse page layout
    cy.get('[data-cy="browse-page"]').should('exist');
  });

  it('should preserve URL parameters when adding filters', () => {
    // Start with existing parameters
    cy.visit('/browse?q=music&location=Paris');
    cy.url().should('include', '/browse');
    cy.url().should('include', 'q=music');
    cy.url().should('include', 'location=Paris');
    
    // Add a genre filter
    cy.get('[data-cy="filters-button"]').click();
    cy.get('[data-cy="filter-panel"]').within(() => {
      cy.contains('button', 'Rock').click();
      cy.contains('button', 'Appliquer').click();
    });
    
    // All parameters should be preserved
    cy.url().should('include', '/browse');
    cy.url().should('include', 'q=music');
    cy.url().should('include', 'location=Paris');
    cy.url().should('include', 'genres=Rock');
  });

  it('should load Browse page correctly from direct URL with parameters', () => {
    // Direct access to Browse with parameters
    cy.visit('/browse?q=jazz&genres=Rock&location=Paris');
    
    // Should be on Browse page
    cy.url().should('include', '/browse');
    cy.get('[data-cy="browse-page"]').should('exist');
    
    // Parameters should be preserved
    cy.url().should('include', 'q=jazz');
    cy.url().should('include', 'genres=Rock');
    cy.url().should('include', 'location=Paris');
    
    // Search field should be populated
    cy.get('[data-cy="public-search-bar"] input[type="text"]').first().should('have.value', 'jazz');
  });
});