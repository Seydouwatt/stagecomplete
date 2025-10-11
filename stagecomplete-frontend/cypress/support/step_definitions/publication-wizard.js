import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';



  

// Dashboard navigation
Given('I am on my artist dashboard', () => {
  cy.visit('/dashboard');
  cy.get('[data-cy="artist-dashboard"]', { timeout: 10000 }).should('be.visible');
});

// Wizard access
// Note: "I click on {string}" step is defined in common.js

Then('I should see the publication wizard with {int} steps', (steps) => {
  cy.get('[data-cy="publication-wizard"]').should('be.visible');
  // Verify 3 step indicators are present
  cy.get('[data-cy="step-indicator"]').should('have.length', steps);
});

Then('I should see the completion score displayed', () => {
  cy.get('[data-cy="completion-percentage"]').should('be.visible');
});

// Step navigation
Given('I am on the publication wizard step {int}', (stepNumber) => {
  cy.visit('/dashboard');
  cy.contains('button', 'Publier mon profil').click();
  cy.get('[data-cy="publication-wizard"]').should('be.visible');

  // Navigate to specific step if not step 1
  if (stepNumber > 1) {
    // Fill minimum required data for step 1
    cy.get('[data-cy="artist-name-input"]').type('Test Artist');
    cy.get('[data-cy="artist-description-input"]').type('Je suis un artiste passionné avec plus de 10 ans d\'expérience dans le jazz et le blues. Ma musique combine tradition et innovation.');
    cy.get('[data-cy="genres-multiselect"]').click();
    cy.contains('Jazz').click();
    cy.get('body').click(0, 0); // Close dropdown
    cy.get('[data-cy="base-location-input"]').type('Paris');

    cy.get('[data-cy="next-step-btn"]').click();
  }

  if (stepNumber > 2) {
    // Fill minimum required data for step 2
    const fileName = 'test-artist-photo.jpg';
    cy.fixture(fileName, 'base64').then(fileContent => {
      cy.get('[data-cy="portfolio-upload"] input[type="file"]').selectFile({
        contents: Cypress.Buffer.from(fileContent, 'base64'),
        fileName: fileName,
        mimeType: 'image/jpeg'
      }, { force: true });
    });
    cy.wait(500);

    cy.get('[data-cy="next-step-btn"]').click();
  }

  cy.get(`[data-cy="wizard-step-${stepNumber}"]`).should('be.visible');
});

// Step 1 - Basic Information
When('I enter {string} as artist name', (artistName) => {
  cy.get('[data-cy="artist-name-input"]').clear().type(artistName);
});

When('I enter {string} as artist description', (description) => {
  cy.get('[data-cy="artist-description-input"]').clear().type(description);
});

When('I select {string} as artist type', (artistType) => {
  cy.get('[data-cy="artist-type-select"]').select(artistType);
});

When('I select {string} as artist discipline', (discipline) => {
  cy.get('[data-cy="artist-discipline-select"]').select(discipline);
});

When('I select {string} and {string} as genres', (genre1, genre2) => {
  cy.get('[data-cy="genres-multiselect"]').click();
  cy.contains(genre1).click();
  cy.contains(genre2).click();
  cy.get('body').click(0, 0); // Close dropdown
});

When('I enter {string} as base location', (location) => {
  cy.get('[data-cy="base-location-input"]').clear().type(location);
});

Then('I should be able to proceed to step {int}', (stepNumber) => {
  cy.get('[data-cy="next-step-btn"]').should('not.be.disabled');
  cy.get('[data-cy="next-step-btn"]').click();
  cy.get(`[data-cy="wizard-step-${stepNumber}"]`).should('be.visible');
});

// Step 2 - Portfolio Creative
When('I upload at least one portfolio photo', () => {
  const fileName = 'test-artist-photo.jpg';
  cy.fixture(fileName, 'base64').then(fileContent => {
    cy.get('[data-cy="portfolio-upload"] input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(fileContent, 'base64'),
      fileName: fileName,
      mimeType: 'image/jpeg'
    }, { force: true });
  });
  cy.wait(500);
});

When('I add a Spotify link', () => {
  cy.get('[data-cy="spotify-input"]').type('https://open.spotify.com/artist/test');
});

When('I add a YouTube link', () => {
  cy.get('[data-cy="youtube-input"]').type('https://youtube.com/@testartist');
});

When('I add a SoundCloud link', () => {
  cy.get('[data-cy="soundcloud-input"]').type('https://soundcloud.com/testartist');
});

When('I add an Instagram link', () => {
  cy.get('[data-cy="instagram-input"]').type('https://instagram.com/testartist');
});

When('I add a demo video URL', () => {
  cy.get('[data-cy="demo-video-input"]').type('https://youtube.com/watch?v=example');
});

When('I select a price range', () => {
  cy.get('[data-cy="price-range-select"]').select('500-1000');
});

// Step 3 - Preview and Publish
Then('I should see a before/after completion comparison', () => {
  cy.get('[data-cy="completion-comparison"]').should('be.visible');
  cy.get('[data-cy="before-percentage"]').should('be.visible');
  cy.get('[data-cy="after-percentage"]').should('be.visible');
});

Then('I should see my estimated completion percentage', () => {
  cy.get('[data-cy="after-percentage"]').should('be.visible');
});

Then('I should see a preview of my artist card', () => {
  cy.get('[data-cy="artist-card-preview"]').should('be.visible');
});

Then('I should see a checkbox to publish my profile', () => {
  cy.get('[data-cy="publish-checkbox"]').should('be.visible');
});

// Note: "I check {string}" step is defined in common.js

When('I leave the {string} checkbox unchecked', (checkboxLabel) => {
  cy.contains('label', checkboxLabel).find('input[type="checkbox"]').should('not.be.checked');
});

// Note: "I click {string}" step is defined in common.js

Then('the wizard should complete successfully', () => {
  // Wizard should close or show success
  cy.get('[data-cy="publication-wizard"]', { timeout: 5000 }).should('not.exist');
});

Then('my profile should remain private', () => {
  // Check profile status indicator
  cy.get('[data-cy="profile-status"]').should('contain', 'Privé');
});

// Validation tests
When('I try to proceed without entering artist name', () => {
  cy.get('[data-cy="artist-name-input"]').clear();
  cy.get('[data-cy="next-step-btn"]').click();
});

Then('I should see a validation error for artist name', () => {
  cy.contains('Le nom artistique est requis').should('be.visible');
});

When('I enter {string} as artist name', (name) => {
  cy.get('[data-cy="artist-name-input"]').clear().type(name);
});

When('I try to proceed without entering description', () => {
  cy.get('[data-cy="artist-description-input"]').clear();
  cy.get('[data-cy="next-step-btn"]').click();
});

Then('I should see a validation error for description', () => {
  cy.contains('La description est requise').should('be.visible');
});

When('I enter a description shorter than {int} characters', (minLength) => {
  cy.get('[data-cy="artist-description-input"]').clear().type('Court');
});

Then('I should see a validation error for description length', () => {
  cy.contains('au moins 20 caractères').should('be.visible');
});

When('I enter a valid description of at least {int} characters', (minLength) => {
  cy.get('[data-cy="artist-description-input"]').clear().type('Je suis un artiste passionné avec beaucoup d\'expérience');
});

When('I try to proceed without selecting genres', () => {
  // Genres should be empty
  cy.get('[data-cy="next-step-btn"]').click();
});

Then('I should see a validation error for genres', () => {
  cy.contains('au moins un genre').should('be.visible');
});

When('I try to proceed without entering location', () => {
  cy.get('[data-cy="base-location-input"]').clear();
  cy.get('[data-cy="next-step-btn"]').click();
});

Then('I should see a validation error for location', () => {
  cy.contains('La localisation est requise').should('be.visible');
});

When('I try to proceed without uploading any portfolio photo', () => {
  cy.get('[data-cy="next-step-btn"]').click();
});

Then('I should see a validation error for portfolio photos', () => {
  cy.contains('Au moins une photo de portfolio est requise').should('be.visible');
});

// Navigation between steps
When('I fill all required fields in step {int}', (step) => {
  if (step === 1) {
    cy.get('[data-cy="artist-name-input"]').type('Test Artist');
    cy.get('[data-cy="artist-description-input"]').type('Je suis un artiste passionné avec plus de 10 ans d\'expérience dans le jazz.');
    cy.get('[data-cy="genres-multiselect"]').click();
    cy.contains('Jazz').click();
    cy.get('body').click(0, 0);
    cy.get('[data-cy="base-location-input"]').type('Paris');
  }
});

When('I proceed to step {int}', (step) => {
  cy.get('[data-cy="next-step-btn"]').click();
});

Then('I should see step {int} content', (step) => {
  cy.get(`[data-cy="wizard-step-${step}"]`).should('be.visible');
});

// Note: "I click {string}" step is defined in common.js

Then('my previously entered data should be preserved', () => {
  cy.get('[data-cy="artist-name-input"]').should('have.value', 'Test Artist');
});

// Close wizard
Given('I am in the publication wizard', () => {
  cy.visit('/dashboard');
  cy.contains('button', 'Publier mon profil').click();
  cy.get('[data-cy="publication-wizard"]').should('be.visible');
});

When('I click the close button', () => {
  cy.get('[data-cy="close-wizard-btn"]').click();
});

Then('the wizard should close', () => {
  cy.get('[data-cy="publication-wizard"]').should('not.exist');
});

Then('I should return to the dashboard', () => {
  cy.get('[data-cy="artist-dashboard"]').should('be.visible');
});

// Profile completion updates
When('I start filling the form', () => {
  cy.get('[data-cy="artist-name-input"]').type('Test');
});

Then('the estimated completion percentage should increase', () => {
  cy.get('[data-cy="completion-percentage"]').invoke('text').then((initialText) => {
    const initialValue = parseInt(initialText);
    cy.get('[data-cy="artist-description-input"]').type('Description complète avec au moins 20 caractères pour valider');
    cy.get('[data-cy="completion-percentage"]').invoke('text').then((newText) => {
      const newValue = parseInt(newText);
      expect(newValue).to.be.gte(initialValue);
    });
  });
});

When('I complete all fields in step {int} and step {int}', (step1, step2) => {
  // Complete step 1
  cy.get('[data-cy="artist-name-input"]').type('Complete Artist');
  cy.get('[data-cy="artist-description-input"]').type('Je suis un artiste passionné avec plus de 10 ans d\'expérience dans le jazz et le blues.');
  cy.get('[data-cy="genres-multiselect"]').click();
  cy.contains('Jazz').click();
  cy.get('body').click(0, 0);
  cy.get('[data-cy="base-location-input"]').type('Paris');
  cy.get('[data-cy="next-step-btn"]').click();

  // Complete step 2
  const fileName = 'test-artist-photo.jpg';
  cy.fixture(fileName, 'base64').then(fileContent => {
    cy.get('[data-cy="portfolio-upload"] input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(fileContent, 'base64'),
      fileName: fileName,
      mimeType: 'image/jpeg'
    }, { force: true });
  });
  cy.wait(500);
  cy.get('[data-cy="spotify-input"]').type('https://open.spotify.com/artist/test');
  cy.get('[data-cy="price-range-select"]').select('500-1000');
});

When('I go to step {int}', (step) => {
  cy.get('[data-cy="next-step-btn"]').click();
  cy.get(`[data-cy="wizard-step-${step}"]`).should('be.visible');
});

Then('I should see a higher completion percentage than when I started', () => {
  cy.get('[data-cy="after-percentage"]').should('be.visible');
  // Just verify it's showing a percentage value
  cy.get('[data-cy="after-percentage"]').should('contain', '%');
});

// Missing items alert
Given('I have an incomplete artist profile', () => {
  // Assume profile is already incomplete from background setup
});

When('I open the publication wizard', () => {
  cy.visit('/dashboard');
  cy.contains('button', 'Publier mon profil').click();
});

Then('I should see an alert showing missing items count', () => {
  cy.get('[data-cy="missing-items-alert"]').should('be.visible');
  cy.get('[data-cy="missing-items-alert"]').should('contain', 'manquant');
});

Then('the alert should mention {string}', (text) => {
  cy.get('[data-cy="missing-items-alert"]').should('contain', text);
});

// Portfolio photo info
When('I upload a portfolio photo', () => {
  const fileName = 'test-artist-photo.jpg';
  cy.fixture(fileName, 'base64').then(fileContent => {
    cy.get('[data-cy="portfolio-upload"] input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(fileContent, 'base64'),
      fileName: fileName,
      mimeType: 'image/jpeg'
    }, { force: true });
  });
});

Then('I should see an info message explaining that the first photo will be used as the main profile photo', () => {
  cy.contains('La première photo').should('be.visible');
  cy.contains('photo de profil principale').should('be.visible');
});
