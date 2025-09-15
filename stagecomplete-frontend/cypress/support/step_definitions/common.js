import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Common steps used across multiple features

Given('que l\'application est accessible', () => {
  cy.visit('/');
  cy.get('body').should('be.visible');
});

Given('que les services backend sont démarrés', () => {
  // Check if backend is responding
  cy.request({
    url: Cypress.env('apiUrl') + '/health',
    failOnStatusCode: false
  }).then((response) => {
    expect(response.status).to.be.oneOf([200, 404]); // 404 is ok, means server is running
  });
});

When('je redimensionne la fenêtre en mode mobile', () => {
  cy.viewport('iphone-x');
});

Then('je devrais voir {string}', (text) => {
  cy.contains(text).should('be.visible');
});

Then('je devrais voir les sections suivantes:', (dataTable) => {
  dataTable.raw().forEach(([section]) => {
    cy.contains(section).should('be.visible');
  });
});

Then('je devrais voir les statistiques suivantes:', (dataTable) => {
  dataTable.raw().forEach(([stat]) => {
    cy.contains(stat).should('be.visible');
  });
});

Then('je devrais voir les graphiques suivants:', (dataTable) => {
  dataTable.raw().forEach(([chart]) => {
    cy.contains(chart).should('be.visible');
  });
});

Then('je devrais voir les actions rapides:', (dataTable) => {
  dataTable.raw().forEach(([action]) => {
    cy.contains(action).should('be.visible');
  });
});

Then('je devrais voir un indicateur de complétion', () => {
  cy.get('[data-testid="profile-completion"]').should('be.visible');
});

Then('je devrais voir un lien {string}', (linkText) => {
  cy.contains('a', linkText).should('be.visible');
});

// Navigation steps
When('je vais sur la page de connexion', () => {
  cy.visit('/login');
});

When('je vais sur le dashboard', () => {
  cy.visit('/dashboard');
});

When('je vais sur la page de profil artiste', () => {
  cy.visit('/artist/profile');
});

When('je rafraîchis la page', () => {
  cy.reload();
});

// Form interaction steps
When('je clique sur {string}', (buttonText) => {
  cy.contains(buttonText).click();
});

When('je saisis {string} comme {word}', (value, fieldName) => {
  const fieldMap = {
    'email': 'input[type="email"], input[name="email"]',
    'mot_de_passe': 'input[type="password"], input[name="password"]',
    'nom': 'input[name="name"]',
    'nom_de_scene': 'input[name="stageName"]',
    'localisation': 'input[name="location"]',
    'site_web': 'input[name="website"]'
  };
  
  const selector = fieldMap[fieldName] || `input[name="${fieldName}"]`;
  cy.get(selector).clear().type(value);
});

When('je sélectionne {string} dans {word}', (value, fieldName) => {
  cy.get(`select[name="${fieldName}"]`).select(value);
});

// Wait steps
Then('je devrais attendre que la page se charge', () => {
  cy.waitForPageLoad();
});

// Toast notifications
Then('je devrais voir {string} dans une notification de succès', (message) => {
  cy.shouldShowToast('success', message);
});

Then('je devrais voir {string} dans une notification d\'erreur', (message) => {
  cy.shouldShowToast('error', message);
});

// URL verification
Then('je devrais être redirigé vers {string}', (path) => {
  cy.url().should('include', path);
});

Then('je devrais rester sur la page de connexion', () => {
  cy.url().should('include', '/login');
});

// Cleanup
When('je nettoie les données de test', () => {
  cy.cleanupTestData();
});