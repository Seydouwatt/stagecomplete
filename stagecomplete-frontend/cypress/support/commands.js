// Custom Cypress commands for StageComplete testing

/**
 * Login as a test user
 */
Cypress.Commands.add('loginAsArtist', (email = 'test-artist@stagecomplete.fr', password = 'TestPass123!') => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.wait('@login');
  cy.url().should('include', '/dashboard');
});

/**
 * Register a new artist account
 */
Cypress.Commands.add('registerArtist', (userData = {}) => {
  const defaultUser = {
    name: 'Test Artist',
    email: `test-${Date.now()}@stagecomplete.fr`,
    password: 'TestPass123!',
    accountType: 'ARTIST'
  };
  
  const user = { ...defaultUser, ...userData };
  
  cy.visit('/register');
  cy.get('input[name="name"]').type(user.name);
  cy.get('input[name="email"]').type(user.email);
  cy.get('input[name="password"]').type(user.password);
  cy.get('select[name="accountType"]').select(user.accountType);
  cy.get('button[type="submit"]').click();
  cy.wait('@register');
  
  return cy.wrap(user);
});

/**
 * Navigate to artist profile form
 */
Cypress.Commands.add('goToArtistProfile', () => {
  cy.get('[data-testid="sidebar-link-profile"]').click();
  cy.url().should('include', '/artist/profile');
});

/**
 * Fill artist profile general info
 */
Cypress.Commands.add('fillArtistGeneralInfo', (profileData = {}) => {
  const defaultProfile = {
    stageName: 'Test Stage Name',
    bio: 'This is a test bio for the artist',
    location: 'Test City, Test Country',
    website: 'https://testartist.com'
  };
  
  const profile = { ...defaultProfile, ...profileData };
  
  if (profile.stageName) {
    cy.get('input[name="stageName"]').clear().type(profile.stageName);
  }
  if (profile.bio) {
    cy.get('textarea[name="bio"]').clear().type(profile.bio);
  }
  if (profile.location) {
    cy.get('input[name="location"]').clear().type(profile.location);
  }
  if (profile.website) {
    cy.get('input[name="website"]').clear().type(profile.website);
  }
});

/**
 * Switch to specific tab in artist profile form
 */
Cypress.Commands.add('switchToTab', (tabName) => {
  cy.get(`[data-testid="tab-${tabName}"]`).click();
  cy.get(`[data-testid="tab-content-${tabName}"]`).should('be.visible');
});

/**
 * Select artist type
 */
Cypress.Commands.add('selectArtistType', (type) => {
  cy.get('select[name="artistType"]').select(type);
});

/**
 * Add a member to the artist group
 */
Cypress.Commands.add('addMember', (memberData = {}) => {
  const defaultMember = {
    name: 'Test Member',
    role: 'Musician',
    email: 'member@test.com',
    instruments: ['Guitare']
  };
  
  const member = { ...defaultMember, ...memberData };
  
  cy.get('[data-testid="add-member-btn"]').click();
  cy.get('input[name="name"]').type(member.name);
  cy.get('input[name="role"]').type(member.role);
  if (member.email) {
    cy.get('input[name="email"]').type(member.email);
  }
  
  // Add instruments if provided
  if (member.instruments && member.instruments.length > 0) {
    member.instruments.forEach(instrument => {
      cy.get('[data-testid="instruments-select"]').type(`${instrument}{enter}`);
    });
  }
  
  cy.get('[data-testid="save-member-btn"]').click();
  cy.wait('@createMember');
});

/**
 * Wait for page to load with loading spinner
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('[data-testid="loading-overlay"]', { timeout: 1000 }).should('not.exist');
});

/**
 * Check toast notification
 */
Cypress.Commands.add('shouldShowToast', (type, message) => {
  cy.get(`[data-testid="toast-${type}"]`).should('be.visible');
  if (message) {
    cy.get(`[data-testid="toast-${type}"]`).should('contain', message);
  }
});

/**
 * Clear all test data (for cleanup)
 */
Cypress.Commands.add('cleanupTestData', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});