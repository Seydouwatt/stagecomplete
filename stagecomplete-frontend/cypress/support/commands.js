// Custom Cypress commands for StageComplete testing

/**
 * Login as a test user
 */
Cypress.Commands.add('loginAsArtist', (email = 'test-artist@stagecomplete.fr', password = 'TestPass123!') => {
  cy.visit('/login');
  cy.wait(500); // Wait for re-render
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
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

/**
 * Create a test artist with specific credentials
 */
Cypress.Commands.add('createTestArtist', (email, password) => {
  // Register the user through the UI
  cy.visit('/register');
  cy.get('input[name="name"]').type('Test Artist Band');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('input[value="ARTIST"]').check({ force: true });
  cy.get('button[type="submit"]').click();

  // Should be redirected to dashboard after successful registration
  cy.url().should('include', '/dashboard', { timeout: 10000 });
});

/**
 * Set incomplete profile state
 */
Cypress.Commands.add('setIncompleteProfile', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('profileIncomplete', 'true');
  });
});

/**
 * Create a complete artist profile for testing
 */
Cypress.Commands.add('createCompleteArtistProfile', () => {
  cy.visit('/artist/profile');
  cy.fillArtistGeneralInfo({
    stageName: 'Solo Artist Pro',
    bio: 'Professional artist for 10 years',
    location: 'Paris, France',
    website: 'https://soloartist.com'
  });
  cy.switchToTab('artistic');
  cy.selectArtistType('SOLO');
  cy.get('input[name="yearsOfExperience"]').type('10');
  cy.get('button[type="submit"]').click();
});

/**
 * Create band profile with specified number of members
 */
Cypress.Commands.add('createBandProfileWithMembers', (memberCount) => {
  cy.visit('/artist/profile');
  cy.switchToTab('members');
  cy.selectArtistType('BAND');

  for (let i = 0; i < memberCount; i++) {
    cy.addMember({
      name: `Member ${i + 1}`,
      role: `Role ${i + 1}`,
      email: `member${i + 1}@test.com`
    });
  }
});