import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Publication Wizard Step Definitions

Given('I am on my artist dashboard', () => {
  cy.visit('/dashboard');
  cy.get('[data-cy="artist-dashboard"]').should('be.visible');
});


Then('I should see the publication wizard with {int} steps', (steps) => {
  cy.get('[data-cy="publication-wizard"]').should('be.visible');
  cy.get('[data-cy="wizard-steps"]').should('have.length', steps);
});

Then('I should see the quality score at {int}%', (score) => {
  cy.get('[data-cy="quality-score"]').should('contain', `${score}%`);
});

Given('I am on the publication wizard step {int}', (stepNumber) => {
  cy.visit('/dashboard');
  cy.contains('button', 'Publier mon profil').click();

  // Navigate to specific step if not step 1
  if (stepNumber > 1) {
    for (let i = 1; i < stepNumber; i++) {
      cy.get('[data-cy="wizard-next-btn"]').click();
    }
  }

  cy.get(`[data-cy="wizard-step-${stepNumber}"]`).should('be.visible');
});

When('I upload a main photo', () => {
  const fileName = 'test-artist-photo.jpg';
  cy.fixture(fileName, 'base64').then(fileContent => {
    cy.get('[data-cy="main-photo-upload"] input[type="file"]').invoke('val', '');
    cy.get('[data-cy="main-photo-upload"]').selectFile({
      contents: Cypress.Buffer.from(fileContent, 'base64'),
      fileName: fileName,
      mimeType: 'image/jpeg'
    }, { force: true });
  });
});

When('I enter {string} as artist name', (artistName) => {
  cy.get('[data-cy="artist-name-input"]').clear().type(artistName);
});

When('I enter a description of at least {int} characters', (minLength) => {
  const description = 'Je suis un artiste passionné avec plus de 10 ans d\'expérience dans le jazz et le blues. Ma musique combine tradition et innovation.';
  cy.get('[data-cy="artist-description"]').clear().type(description);
  cy.get('[data-cy="artist-description"]').should('have.value').and('have.length.greaterThan', minLength - 1);
});

When('I select {string} as artist type', (artistType) => {
  cy.get('[data-cy="artist-type-select"]').click();
  cy.get(`[data-cy="artist-type-option-${artistType.toLowerCase()}"]`).click();
});

When('I select {string} and {string} as genres', (genre1, genre2) => {
  cy.get('[data-cy="genres-select"]').click();
  cy.get(`[data-cy="genre-option-${genre1.toLowerCase()}"]`).click();
  cy.get(`[data-cy="genre-option-${genre2.toLowerCase()}"]`).click();
  cy.get('[data-cy="genres-select"]').click(); // Close dropdown
});

When('I enter {string} as base location', (location) => {
  cy.get('[data-cy="base-location-input"]').clear().type(location);
});

Then('the quality score should increase to at least {int}%', (minScore) => {
  cy.get('[data-cy="quality-score"]').should('contain', `${minScore}%`).or('contain', `${minScore + 5}%`).or('contain', `${minScore + 10}%`);
});

Then('I should be able to proceed to step {int}', (stepNumber) => {
  cy.get('[data-cy="wizard-next-btn"]').should('not.be.disabled');
  cy.get('[data-cy="wizard-next-btn"]').click();
  cy.get(`[data-cy="wizard-step-${stepNumber}"]`).should('be.visible');
});

Given('I have existing portfolio photos', () => {
  // Assume there are already some photos in the portfolio
  cy.get('[data-cy="existing-portfolio-photos"]').should('exist');
});

When('I add additional portfolio photos', () => {
  const fileName = 'test-portfolio-photo.jpg';
  cy.fixture(fileName, 'base64').then(fileContent => {
    cy.get('[data-cy="portfolio-photos-upload"] input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(fileContent, 'base64'),
      fileName: fileName,
      mimeType: 'image/jpeg'
    }, { force: true });
  });
});

When('I add YouTube links for videos', () => {
  cy.get('[data-cy="youtube-links-input"]').clear().type('https://youtube.com/watch?v=example1\nhttps://youtube.com/watch?v=example2');
});

When('I add SoundCloud links for audio', () => {
  cy.get('[data-cy="soundcloud-links-input"]').clear().type('https://soundcloud.com/artist/track1\nhttps://soundcloud.com/artist/track2');
});

When('I add Instagram and Facebook social links', () => {
  cy.get('[data-cy="instagram-link-input"]').clear().type('https://instagram.com/artistname');
  cy.get('[data-cy="facebook-link-input"]').clear().type('https://facebook.com/artistname');
});

Given('my quality score is at least {int}%', (minScore) => {
  cy.get('[data-cy="quality-score"]').should('contain', `${minScore}%`).or('contain', `${minScore + 5}%`).or('contain', `${minScore + 10}%`).or('contain', '100%');
});

When('I preview my public profile', () => {
  cy.get('[data-cy="preview-public-profile-btn"]').click();
});

Then('I should see a comparison between private and public view', () => {
  cy.get('[data-cy="profile-comparison"]').should('be.visible');
  cy.get('[data-cy="private-view"]').should('be.visible');
  cy.get('[data-cy="public-view"]').should('be.visible');
});

Then('I should see the generated public URL', () => {
  cy.get('[data-cy="public-url"]').should('be.visible').and('contain', '/artist/');
});

Then('I should see social sharing buttons', () => {
  cy.get('[data-cy="social-sharing-buttons"]').should('be.visible');
  cy.get('[data-cy="share-facebook"]').should('be.visible');
  cy.get('[data-cy="share-twitter"]').should('be.visible');
  cy.get('[data-cy="copy-url-btn"]').should('be.visible');
});

Given('I have completed all wizard steps', () => {
  cy.get('[data-cy="wizard-step-3"]').should('be.visible');
  cy.get('[data-cy="quality-score"]').should('contain', '100%');
});

When('I click {string}', (buttonText) => {
  cy.contains('button', buttonText).click();
});

Then('I should see a success confirmation', () => {
  cy.get('[data-cy="publication-success"]').should('be.visible');
  cy.contains('Profil publié avec succès').should('be.visible');
});

Then('my profile should be marked as public', () => {
  cy.get('[data-cy="profile-status"]').should('contain', 'Public');
});

Then('I should receive the shareable URL', () => {
  cy.get('[data-cy="shareable-url"]').should('be.visible').and('contain', 'http');
});

Then('I should see next steps suggestions', () => {
  cy.get('[data-cy="next-steps"]').should('be.visible');
  cy.contains('Partagez votre profil').should('be.visible');
});

Given('I am in the publication wizard', () => {
  cy.visit('/dashboard');
  cy.contains('button', 'Publier mon profil').click();
  cy.get('[data-cy="publication-wizard"]').should('be.visible');
});

When('I have no main photo', () => {
  // Ensure no photo is uploaded
  cy.get('[data-cy="main-photo-preview"]').should('not.exist');
});

Then('the quality score should show {int} points for missing photo', (points) => {
  cy.get('[data-cy="quality-breakdown"]').should('contain', `Photo principale: -${points} points`);
});

When('I have a description under {int} characters', (maxLength) => {
  cy.get('[data-cy="artist-description"]').clear().type('Artiste');
  cy.get('[data-cy="artist-description"]').should('have.value').and('have.length.lessThan', maxLength);
});

Then('the quality score should show {int} points for short description', (points) => {
  cy.get('[data-cy="quality-breakdown"]').should('contain', `Description courte: -${points} points`);
});

When('I have no genres selected', () => {
  cy.get('[data-cy="selected-genres"]').should('not.exist');
});

Then('the quality score should show {int} points for missing genres', (points) => {
  cy.get('[data-cy="quality-breakdown"]').should('contain', `Genres manquants: -${points} points`);
});

When('I have no social links', () => {
  cy.get('[data-cy="social-links"]').should('be.empty');
});

Then('the quality score should show {int} points for missing social presence', (points) => {
  cy.get('[data-cy="quality-breakdown"]').should('contain', `Réseaux sociaux: -${points} points`);
});

Given('I am in the middle of the publication wizard', () => {
  cy.visit('/dashboard');
  cy.contains('button', 'Publier mon profil').click();
  cy.get('[data-cy="wizard-step-1"]').should('be.visible');

  // Fill some data
  cy.get('[data-cy="artist-name-input"]').type('Test Artist');
  cy.get('[data-cy="wizard-next-btn"]').click();
  cy.get('[data-cy="wizard-step-2"]').should('be.visible');
});

When('I navigate away from the wizard', () => {
  cy.visit('/dashboard');
});

When('I return to the wizard later', () => {
  cy.contains('button', 'Publier mon profil').click();
});

Then('my progress should be saved', () => {
  cy.get('[data-cy="artist-name-input"]').should('have.value', 'Test Artist');
});

Then('I should be able to continue from where I left off', () => {
  cy.get('[data-cy="wizard-step-2"]').should('be.visible');
});

Given('I have made changes in the publication wizard', () => {
  cy.visit('/dashboard');
  cy.contains('button', 'Publier mon profil').click();
  cy.get('[data-cy="artist-name-input"]').type('Modified Artist Name');
});

When('I click {string}', (buttonText) => {
  cy.contains('button', buttonText).click();
});

Then('I should see a confirmation dialog', () => {
  cy.get('[data-cy="confirmation-dialog"]').should('be.visible');
});

When('I confirm cancellation', () => {
  cy.get('[data-cy="confirm-cancel-btn"]').click();
});

Then('my changes should be saved to my profile', () => {
  cy.get('[data-cy="artist-name-display"]').should('contain', 'Modified Artist Name');
});

Then('my profile should remain private', () => {
  cy.get('[data-cy="profile-status"]').should('contain', 'Privé');
});