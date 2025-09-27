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
  const timestamp = Date.now();
  const defaultUser = {
    name: 'Test Artist',
    email: `test-artist-${timestamp}@stagecomplete.fr`,
    password: 'TestPass123!',
    role: 'ARTIST'
  };

  const user = { ...defaultUser, ...userData };

  // Ensure unique email if not provided
  if (userData.email && !userData.email.includes(timestamp)) {
    user.email = `${userData.email.split('@')[0]}-${timestamp}@${userData.email.split('@')[1]}`;
  }

  cy.visit('/register');
  cy.get('[data-cy="name"]').type(user.name);
  cy.get('[data-cy="register-email"]').type(user.email);
  cy.get('[data-cy="register-password"]').type(user.password);
  cy.get('[data-cy="register-role-artist"]').check({ force: true });
  cy.get('[data-cy="register-submit"]').click();

  // Should be redirected to dashboard after successful registration
  cy.url().should('include', '/dashboard', { timeout: 10000 });

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
  // Le profil est déjà créé dans le test précédent
  // Il suffit de vérifier qu'on est sur la bonne page
  cy.visit('/artist/portfolio');
  cy.contains('Mon Profil Artiste').should('be.visible');

  // Remplir les informations générales
  cy.fillArtistGeneralInfo({
    stageName: 'The Testers',
    bio: 'We are a test band for Cypress E2E testing.',
    location: 'Test City, Test Country',
    website: 'https://thetesters.com'
  });
  
  // Passer à l'onglet membres et ajouter un membre
  cy.switchToTab('members');
  cy.selectArtistType('BAND');
  cy.addMember({
    name: 'Alice',
    role: 'Vocalist',
    email: 'alice@test.com',
    instruments: ['Vocals']
  });
  cy.addMember({
    name: 'Bob',
    role: 'Guitarist',
    email: 'bob@test.com',
    instruments: ['Guitare']
  });
  
  // Passer à l'onglet tarifs et remplir les informations
  cy.switchToTab('pricing');
  cy.get('input[name="minimum_rate"]').type('100');
  cy.get('input[name="maximum_rate"]').type('500');
  cy.get('textarea[name="conditions"]').type('Travel expenses not included');
  
  // Passer à l'onglet public et remplir les informations
  cy.switchToTab('public');
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