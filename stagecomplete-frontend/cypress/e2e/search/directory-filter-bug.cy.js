describe('Directory Filter Bug Fix', () => {
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
            genres: ['Jazz', 'Drum & Bass'],
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
        genres: ['Jazz', 'Rock', 'Blues', 'Drum & Bass'],
        instruments: ['Piano', 'Guitare'],
        locations: ['Paris', 'Lyon']
      }
    }).as('filtersAPI');
  });

  it('should reproduce the exact user bug: directory?q=zrz loses query when filtering', () => {
    // STEP 1: Start with search results on directory page (user scenario)
    cy.visit('/directory?q=zrz');
    cy.url().should('include', '/directory');
    cy.url().should('include', 'q=zrz');
    
    // Should be in search results mode (not discovery home page)
    cy.contains('Résultats pour').should('be.visible');
    cy.contains('"zrz"').should('be.visible');
    
    // STEP 2: Open filters (this should work)
    cy.get('[data-cy="filters-button"]').should('exist').click();
    cy.get('[data-cy="filter-panel"]').should('be.visible');
    
    // STEP 3: Select a filter (this is where the bug happens)
    cy.get('[data-cy="filter-panel"]').within(() => {
      cy.contains('button', 'Drum & Bass').click();
      cy.contains('button', 'Appliquer').click();
    });
    
    // STEP 4: Verify the bug is FIXED
    // URL should preserve the original query AND add the genre
    cy.url().should('include', '/directory');
    cy.url().should('include', 'q=zrz'); // THIS WAS MISSING BEFORE THE FIX
    cy.url().should('include', 'genres=Drum'); // Genre should be added
    
    // Page should STAY in search results mode (not go back to discovery home)
    cy.contains('Résultats pour').should('be.visible');
    cy.contains('"zrz"').should('be.visible');
    
    // Filter should be visible as active
    cy.get('[data-cy="active-filters"]').should('exist');
    cy.get('[data-cy="active-filters"]').contains('Drum & Bass').should('exist');
  });

  it('should preserve query when adding multiple filters', () => {
    // Start with a search
    cy.visit('/directory?q=music');
    cy.url().should('include', 'q=music');
    cy.contains('Résultats pour').should('be.visible');
    
    // Add first filter
    cy.get('[data-cy="filters-button"]').click();
    cy.get('[data-cy="filter-panel"]').within(() => {
      cy.contains('button', 'Jazz').click();
      cy.contains('button', 'Appliquer').click();
    });
    
    // Query should be preserved
    cy.url().should('include', 'q=music');
    cy.url().should('include', 'genres=Jazz');
    cy.contains('Résultats pour').should('be.visible');
    
    // Add second filter
    cy.get('[data-cy="filters-button"]').click();
    cy.get('[data-cy="filter-panel"]').within(() => {
      cy.get('[data-cy="location-input"]').type('Paris');
      cy.contains('button', 'Appliquer').click();
    });
    
    // Both query and previous filters should be preserved
    cy.url().should('include', 'q=music');
    cy.url().should('include', 'genres=Jazz');
    cy.url().should('include', 'location=Paris');
    cy.contains('Résultats pour').should('be.visible');
  });

  it('should handle URL encoding correctly', () => {
    // Start with a complex search term
    cy.visit('/directory?q=test%20with%20spaces');
    cy.url().should('include', 'q=test%20with%20spaces');
    
    // Add filter
    cy.get('[data-cy="filters-button"]').click();
    cy.get('[data-cy="filter-panel"]').within(() => {
      cy.contains('button', 'Drum & Bass').click();
      cy.contains('button', 'Appliquer').click();
    });
    
    // Query should be preserved with proper encoding
    cy.url().should('include', 'q=test');
    cy.url().should('include', 'genres=Drum');
    cy.contains('Résultats pour').should('be.visible');
  });
});