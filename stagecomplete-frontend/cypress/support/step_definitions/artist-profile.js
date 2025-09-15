import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Artist profile specific steps

Given('que j\'ai un profil groupe avec {int} membres', (memberCount) => {
  // This would set up a test artist with the specified number of members
  cy.window().then((window) => {
    window.localStorage.setItem('test-artist-members', memberCount.toString());
  });
});

Given('que j\'ai complété mon profil artiste', () => {
  // Set up a completed artist profile
  cy.window().then((window) => {
    window.localStorage.setItem('test-artist-complete', 'true');
  });
});

Given('que mon profil n\'est pas complet', () => {
  // Ensure profile is incomplete
  cy.window().then((window) => {
    window.localStorage.removeItem('test-artist-complete');
  });
});

When('je remplis les informations générales avec:', (dataTable) => {
  const data = {};
  dataTable.rawTable.forEach(([key, value]) => {
    data[key] = value;
  });

  if (data.nom_de_scene) {
    cy.get('input[name="stageName"]').clear().type(data.nom_de_scene);
  }
  if (data.bio) {
    cy.get('textarea[name="bio"]').clear().type(data.bio);
  }
  if (data.localisation) {
    cy.get('input[name="location"]').clear().type(data.localisation);
  }
  if (data.site_web) {
    cy.get('input[name="website"]').clear().type(data.site_web);
  }
});

When('je passe à l\'onglet {string}', (tabName) => {
  const tabMap = {
    'Artistique': 'artistic',
    'Membres': 'members',
    'Tarifs': 'pricing',
    'Public': 'public'
  };
  const tabId = tabMap[tabName] || tabName.toLowerCase();
  cy.switchToTab(tabId);
});

When('je sélectionne le type d\'artiste {string}', (artistType) => {
  cy.selectArtistType(artistType);
});

When('je sélectionne les genres musicaux:', (dataTable) => {
  dataTable.raw().forEach(([genre]) => {
    cy.get('[data-testid="genres-select"]').type(`${genre}{enter}`);
  });
});

When('je saisis {string} comme années d\'expérience', (years) => {
  cy.get('input[name="yearsActive"]').clear().type(years);
});

When('j\'ajoute un membre avec:', (dataTable) => {
  const data = {};
  dataTable.rawTable.forEach(([key, value]) => {
    data[key] = value;
  });

  cy.get('[data-testid="add-member-btn"]').click();
  
  if (data.nom) {
    cy.get('input[name="name"]').type(data.nom);
  }
  if (data.role) {
    cy.get('input[name="role"]').type(data.role);
  }
  if (data.email) {
    cy.get('input[name="email"]').type(data.email);
  }
  if (data.instruments) {
    const instruments = data.instruments.split(', ');
    instruments.forEach(instrument => {
      cy.get('[data-testid="instruments-select"]').type(`${instrument}{enter}`);
    });
  }
  if (data.experience) {
    cy.get('select[name="experience"]').select(data.experience);
  }
  if (data.fondateur === 'true') {
    cy.get('input[name="isFounder"]').check();
  }
  
  cy.get('[data-testid="save-member-btn"]').click();
  cy.wait('@createMember');
});

When('je clique sur {string} pour le {word} membre', (action, memberPosition) => {
  const positionMap = {
    'premier': 0,
    'deuxième': 1,
    'troisième': 2
  };
  const index = positionMap[memberPosition] || 0;
  
  cy.get(`[data-testid="member-card-${index}"] [data-testid="${action.toLowerCase()}-btn"]`).click();
});

When('je modifie le rôle en {string}', (newRole) => {
  cy.get('input[name="role"]').clear().type(newRole);
});

When('j\'ajoute l\'instrument {string}', (instrument) => {
  cy.get('[data-testid="instruments-select"]').type(`${instrument}{enter}`);
});

When('je clique sur {string}', (buttonText) => {
  cy.contains(buttonText).click();
});

When('je confirme la suppression', () => {
  cy.get('[data-testid="confirm-delete-btn"]').click();
});

When('je laisse le nom vide', () => {
  cy.get('input[name="name"]').clear();
});

When('je saisis un email invalide {string}', (invalidEmail) => {
  cy.get('input[name="email"]').clear().type(invalidEmail);
});

When('je remplis les tarifs avec:', (dataTable) => {
  const data = {};
  dataTable.rawTable.forEach(([key, value]) => {
    data[key] = value;
  });

  if (data.tarif_minimum) {
    cy.get('input[name="priceMin"]').clear().type(data.tarif_minimum);
  }
  if (data.tarif_maximum) {
    cy.get('input[name="priceMax"]').clear().type(data.tarif_maximum);
  }
  if (data.conditions) {
    cy.get('textarea[name="pricingConditions"]').clear().type(data.conditions);
  }
});

Then('je devrais voir qu\'un membre par défaut est créé', () => {
  cy.get('[data-testid="member-card"]').should('have.length', 1);
  cy.get('[data-testid="member-card"]').should('contain', 'Artiste principal');
});

Then('je devrais voir {string}', (message) => {
  cy.contains(message).should('be.visible');
});

Then('je devrais voir {int} membres dans la liste', (count) => {
  cy.get('[data-testid="member-card"]').should('have.length', count);
});

Then('le membre devrait afficher {string} comme rôle', (role) => {
  cy.get('[data-testid="member-card"]').first().should('contain', role);
});

Then('je devrais voir les erreurs de validation:', (dataTable) => {
  dataTable.raw().forEach(([error]) => {
    cy.get('[data-testid="validation-errors"]').should('contain', error);
  });
});

Then('je devrais voir un aperçu de ma fiche publique', () => {
  cy.get('[data-testid="public-profile-preview"]').should('be.visible');
});

Then('je devrais voir toutes mes informations affichées correctement', () => {
  cy.get('[data-testid="public-profile-preview"]').within(() => {
    cy.get('[data-testid="artist-name"]').should('be.visible');
    cy.get('[data-testid="artist-bio"]').should('be.visible');
    cy.get('[data-testid="artist-location"]').should('be.visible');
  });
});

Then('je devrais voir tous mes membres listés', () => {
  cy.get('[data-testid="public-profile-preview"]').within(() => {
    cy.get('[data-testid="members-list"]').should('be.visible');
    cy.get('[data-testid="member-item"]').should('have.length.at.least', 1);
  });
});

// Dashboard specific steps
When('je suis sur le dashboard', () => {
  cy.visit('/dashboard');
  cy.get('[data-testid="artist-dashboard"]').should('be.visible');
});

When('je clique sur {string}', (linkText) => {
  cy.contains(linkText).click();
});

Then('le dashboard devrait s\'adapter au mobile', () => {
  cy.get('[data-testid="artist-dashboard"]').should('have.class', 'mobile-responsive');
});

Then('les graphiques devraient être affichés en carousel', () => {
  cy.get('[data-testid="charts-carousel"]').should('be.visible');
});

Then('la navigation devrait être optimisée pour mobile', () => {
  cy.get('[data-testid="mobile-navigation"]').should('be.visible');
});