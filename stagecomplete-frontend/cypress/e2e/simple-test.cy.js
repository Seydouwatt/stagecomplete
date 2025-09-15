describe('StageComplete Application', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  it('should load the application homepage', () => {
    cy.visit('/');
    cy.get('body').should('be.visible');
    cy.contains('StageComplete').should('be.visible');
  });

  it('should navigate to register page', () => {
    cy.visit('/register');
    cy.contains('Créer mon compte').click();
    cy.url().should('include', '/register');
    cy.get('form').should('be.visible');
  });

  it('should create new artist account and login', () => {
    const testEmail = `test-${Date.now()}@stagecomplete.fr`;
    
    // Register new artist
    cy.visit('/register');
    cy.get('input[name="name"]').type('Test Artist E2E');
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type('TestPass123!');
    cy.get('input[value="ARTIST"]').check({ force: true });
    cy.get('button[type="submit"]').click();
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard', { timeout: 15000 });
    cy.contains('Test Artist E2E').should('be.visible');
  });

  it('should navigate to artist profile form', () => {
    const testEmail = `test-${Date.now()}@stagecomplete.fr`;
    
    // Register and login
    cy.visit('/register');
    cy.get('input[name="name"]').type('Test Profile Artist');
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type('TestPass123!');
    cy.get('input[value="ARTIST"]').check({ force: true });
    cy.get('button[type="submit"]').click();
    
    // Navigate to profile
    cy.url().should('include', '/dashboard', { timeout: 15000 });
    cy.visit('/artist/portfolio');
    // cy.get('form').should('be.visible');
    cy.contains('Mon Profil Artiste').should('be.visible');
  });

  it('should test artist type selection and members tab', () => {
    const testEmail = `test-${Date.now()}@stagecomplete.fr`;
    
    // Register and login
    cy.visit('/register');
    cy.get('input[name="name"]').type('Test Band');
    cy.get('input[name="email"]').type(testEmail);
    cy.get('input[name="password"]').type('TestPass123!');
    cy.get('input[value="ARTIST"]').check({ force: true });
    cy.get('button[type="submit"]').click();
    
    // Go to profile and test members functionality
    cy.url().should('include', '/dashboard', { timeout: 15000 });
    cy.visit('/artist/portfolio');
    
    // Switch to members tab first (where artistType selector is located)
    cy.contains('Membres').click();
    cy.get('[data-testid="members-tab"]').should('be.visible');
    cy.contains('Gestion des membres').should('be.visible');
    
    // Select BAND type in the members tab
    cy.get('[data-testid="artist-type-select"]').select('BAND');
    
    // Verify the change was applied
    cy.get('[data-testid="artist-type-select"]').should('have.value', 'BAND');
  });
});