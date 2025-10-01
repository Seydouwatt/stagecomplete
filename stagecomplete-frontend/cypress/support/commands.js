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
 * Create a complete artist profile (100% completion) via API
 * This creates an artist with all required fields to reach 100% profile completion:
 * - Name + artistDescription (basic_info)
 * - artistType
 * - cover_photo (portfolio.photos[0])
 * - baseLocation
 * - genres (at least 1)
 * - instruments (at least 1)
 * - portfolio_photos (at least 2)
 * - priceRange
 */
Cypress.Commands.add('createCompleteArtistProfile', () => {
  const completeProfileData = {
    artistDescription: 'Artiste professionnel avec 10 ans d\'expérience en musique live et studio',
    artistType: 'SOLO',
    artistDiscipline: 'MUSIC',
    baseLocation: 'Paris, France',
    genres: ['Jazz', 'Blues', 'Soul'],
    instruments: ['Piano', 'Chant'],
    priceRange: '500-2000',
    socialLinks: {
      instagram: 'https://instagram.com/completeartist',
      youtube: 'https://youtube.com/@completeartist'
    },
    portfolio: {
      photos: [
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', // 1x1 red pixel
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 blue pixel
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==' // 1x1 green pixel
      ],
      videos: []
    },
    yearsActive: 10,
    isPublic: false
  };

  // Wait for auth token to be available in localStorage (with retry)
  cy.window().should((win) => {
    const authStore = JSON.parse(win.localStorage.getItem('stagecomplete-auth') || '{}');
    const token = authStore?.state?.token;
    expect(token).to.exist;
  }).then((win) => {
    const authStore = JSON.parse(win.localStorage.getItem('stagecomplete-auth') || '{}');
    const token = authStore?.state?.token;

    // Update artist profile via API
    cy.request({
      method: 'PUT',
      url: 'http://localhost:3000/api/artist/profile',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: completeProfileData,
      failOnStatusCode: false
    }).then((response) => {
      cy.log(`📡 API Response Status: ${response.status}`);
      if (response.status === 200) {
        cy.log('✅ Complete artist profile created (100% completion)');
        cy.log(`Profile: ${completeProfileData.genres.length} genres, ${completeProfileData.instruments.length} instruments, ${completeProfileData.portfolio.photos.length} photos`);
        cy.log(JSON.stringify(response.body));
      } else {
        cy.log(`⚠️ Profile update failed with status ${response.status}`);
        cy.log(JSON.stringify(response.body));
        throw new Error(`Profile update failed: ${response.status} - ${JSON.stringify(response.body)}`);
      }
    });
  });
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