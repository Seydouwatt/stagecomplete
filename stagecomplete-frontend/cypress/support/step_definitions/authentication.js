import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Authentication specific steps

Given('que je suis sur la page d\'accueil', () => {
  cy.visit('/');
});

Given('qu\'un artiste existe avec l\'email {string} et le mot de passe {string}', (email, password) => {
  // This would typically create a test user via API
  // For now, we assume the user exists or create one
  cy.request({
    method: 'POST',
    url: Cypress.env('apiUrl') + '/auth/register',
    body: {
      name: 'Test Existing Artist',
      email: email,
      password: password,
      accountType: 'ARTIST'
    },
    failOnStatusCode: false
  });
});

Given('que je suis connecté en tant qu\'artiste', () => {
  // Use custom command to login
  cy.registerArtist().then((user) => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(user.email);
    cy.get('input[type="password"]').type(user.password);
    cy.get('button[type="submit"]').click();
    cy.wait('@login');
    cy.url().should('include', '/dashboard');
  });
});

When('je remplis le formulaire d\'inscription avec:', (dataTable) => {
  const data = {};
  dataTable.rawTable.forEach(([key, value]) => {
    data[key] = value;
  });

  cy.get('input[name="name"]').type(data.nom);
  cy.get('input[name="email"]').type(data.email);
  cy.get('input[name="password"]').type(data.mot_de_passe);
  cy.get('select[name="accountType"]').select(data.type_compte);
});

When('je soumets le formulaire', () => {
  cy.get('button[type="submit"]').click();
  cy.wait('@register');
});

When('je clique sur mon profil dans l\'en-tête', () => {
  cy.get('[data-testid="user-menu-trigger"]').click();
});

When('je clique sur {string}', (buttonText) => {
  cy.contains(buttonText).click();
});

Then('je devrais être redirigé vers le dashboard artiste', () => {
  cy.url().should('include', '/dashboard');
  cy.get('[data-testid="artist-dashboard"]').should('be.visible');
});

Then('je devrais voir {string}', (text) => {
  cy.contains(text).should('be.visible');
});

Then('ma session devrait être sauvegardée', () => {
  cy.window().then((window) => {
    const authData = window.localStorage.getItem('stagecomplete-auth');
    expect(authData).to.not.be.null;
    const parsedData = JSON.parse(authData);
    expect(parsedData.state.token).to.exist;
  });
});

Then('je devrais voir une erreur {string}', (errorMessage) => {
  cy.get('[data-testid="error-message"]').should('contain', errorMessage);
});

Then('je devrais toujours être connecté', () => {
  cy.get('[data-testid="user-menu-trigger"]').should('be.visible');
});

Then('je devrais voir mon dashboard artiste', () => {
  cy.get('[data-testid="artist-dashboard"]').should('be.visible');
});

Then('je devrais être redirigé vers la page d\'accueil', () => {
  cy.url().should('not.include', '/dashboard');
  cy.url().should('match', /\/$|\/login|\/register/);
});

Then('ma session devrait être effacée', () => {
  cy.window().then((window) => {
    const authData = window.localStorage.getItem('stagecomplete-auth');
    if (authData) {
      const parsedData = JSON.parse(authData);
      expect(parsedData.state.token).to.be.null;
    }
  });
});