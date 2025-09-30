import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Profile Quality Step Definitions

Given('the quality scoring system is active', () => {
  cy.intercept('GET', '**/api/auth/artist/profile/quality', {
    fixture: 'quality-score.json'
  }).as('getQualityScore');
});

Then('I should see my current profile quality score \\({int}-{int}%\\)', (min, max) => {
  cy.get('[data-cy="quality-score"]').should('be.visible');
  cy.get('[data-cy="quality-score"]').should('contain', '%');
  cy.get('[data-cy="quality-score"]').invoke('text').then((text) => {
    const score = parseInt(text.match(/\d+/)[0]);
    expect(score).to.be.within(min, max);
  });
});

Then('the score should be calculated based on:', (dataTable) => {
  const factors = dataTable.hashes();

  cy.get('[data-cy="quality-breakdown"]').should('be.visible');

  factors.forEach((row) => {
    const factor = row['Quality Factor'];
    const points = row['Points'];
    const status = row['Status'];

    switch(factor) {
      case 'Main photo uploaded':
      case 'Portfolio photos (first photo)':
        cy.get('[data-cy="quality-factor-photo"]').should('contain', points);
        break;
      case 'Artist description >50 chars':
        cy.get('[data-cy="quality-factor-description"]').should('contain', points);
        break;
      case 'Genres selected (3+)':
        cy.get('[data-cy="quality-factor-genres"]').should('contain', points);
        break;
      case 'Social links added':
        cy.get('[data-cy="quality-factor-social"]').should('contain', points);
        break;
    }
  });
});

Then('the total should equal {int}%', (total) => {
  cy.get('[data-cy="quality-total"]').should('contain', `${total}%`);
});

Given('my profile quality score is below {int}%', (threshold) => {
  cy.intercept('GET', '**/api/auth/artist/profile/quality', {
    body: {
      score: threshold - 10,
      breakdown: {
        mainPhoto: false,
        description: true,
        genres: false,
        socialLinks: false
      }
    }
  }).as('getLowQualityScore');

  cy.visit('/dashboard');
  cy.wait('@getLowQualityScore');
});

When('I view my profile dashboard', () => {
  cy.get('[data-cy="profile-dashboard"]').should('be.visible');
});

Then('I should see personalized improvement suggestions:', (dataTable) => {
  const suggestions = dataTable.hashes();

  cy.get('[data-cy="improvement-suggestions"]').should('be.visible');

  suggestions.forEach((row) => {
    const currentScore = row['Current Score'];
    const suggestion = row['Suggestion'];

    if (currentScore === '0-20%') {
      cy.get('[data-cy="suggestion-photo"]').should('contain', 'Ajoutez des photos');
    } else if (currentScore === '21-40%') {
      cy.get('[data-cy="suggestion-description"]').should('contain', 'Complétez votre description');
    }
  });
});

Then('suggestions should be actionable with direct links', () => {
  cy.get('[data-cy="suggestion-link"]').should('have.attr', 'href');
  cy.get('[data-cy="suggestion-action"]').should('be.visible');
});

Given('I am editing my profile', () => {
  cy.visit('/dashboard/profile');
  cy.get('[data-cy="profile-edit-form"]').should('be.visible');
});

When('I upload a main photo', () => {
  // Note: Main photo is now the first portfolio photo
  const fileName = 'test-artist-photo.jpg';
  cy.fixture(fileName, 'base64').then(fileContent => {
    // Navigate to Portfolio tab if not already there
    cy.get('body').then($body => {
      if ($body.find('[data-cy="portfolio-tab"]').length > 0) {
        cy.get('[data-cy="portfolio-tab"]').click();
      }
    });

    cy.get('[data-cy="portfolio-photos-upload"] input[type="file"]').first().selectFile({
      contents: Cypress.Buffer.from(fileContent, 'base64'),
      fileName: fileName,
      mimeType: 'image/jpeg'
    }, { force: true });
  });

  // Wait for image to be processed
  cy.wait(500);
});

Then('the quality score should immediately increase by {int}%', (increase) => {
  cy.get('[data-cy="quality-score"]').should('be.visible');
  cy.get('[data-cy="score-change"]').should('contain', `+${increase}%`);
});

Then('I should see a visual confirmation of the improvement', () => {
  cy.get('[data-cy="score-improvement-animation"]').should('be.visible');
  cy.get('[data-cy="success-badge"]').should('be.visible');
});

When('I add a description of {int}+ characters', (minLength) => {
  const description = 'Je suis un artiste passionné avec une grande expérience dans mon domaine musical.';
  cy.get('[data-cy="artist-description"]').clear().type(description);
  cy.get('[data-cy="artist-description"]').should('have.value').and('have.length.greaterThan', minLength - 1);
});

Then('the score should increase by {int}% more', (increase) => {
  cy.get('[data-cy="score-change"]').should('contain', `+${increase}%`);
});

Then('the progress bar should update smoothly', () => {
  cy.get('[data-cy="progress-bar"]').should('have.css', 'transition-duration').and('not.eq', '0s');
  cy.get('[data-cy="progress-bar"]').should('be.visible');
});

Given('I want to improve my profile quality', () => {
  cy.visit('/dashboard');
  cy.get('[data-cy="quality-section"]').should('be.visible');
});

When('I access the profile completion checklist', () => {
  cy.get('[data-cy="completion-checklist-btn"]').click();
});

Then('I should see all quality factors with their status:', (dataTable) => {
  const factors = dataTable.hashes();

  cy.get('[data-cy="completion-checklist"]').should('be.visible');

  factors.forEach((row) => {
    const factor = row['Factor'];
    const status = row['Status'];
    const action = row['Action'];

    switch(factor) {
      case 'Photo principale':
      case 'Portfolio photos (first photo)':
        cy.get('[data-cy="checklist-photo"]').should('be.visible');
        cy.get('[data-cy="checklist-photo"] .status').should('contain', status === '✅' ? 'Complété' : 'À faire');
        break;
      case 'Description':
        cy.get('[data-cy="checklist-description"]').should('be.visible');
        break;
      case 'Genres musicaux':
        cy.get('[data-cy="checklist-genres"]').should('be.visible');
        break;
      case 'Liens sociaux':
        cy.get('[data-cy="checklist-social"]').should('be.visible');
        break;
    }
  });
});

Then('each item should be clickable to jump to the relevant section', () => {
  cy.get('[data-cy="checklist-item"]').first().click();
  cy.get('[data-cy="profile-section"]').should('be.visible');
});

Given('my profile meets quality standards', () => {
  cy.intercept('GET', '**/api/auth/artist/profile/quality', {
    body: {
      score: 85,
      badges: ['Profil Vérifié'],
      tier: 'verified'
    }
  }).as('getHighQualityScore');

  cy.visit('/dashboard');
  cy.wait('@getHighQualityScore');
});

When('my score reaches certain thresholds:', (dataTable) => {
  const thresholds = dataTable.hashes();

  thresholds.forEach((row) => {
    const score = row['Score'];
    const badge = row['Badge'];
    const benefit = row['Benefit'];

    cy.intercept('GET', '**/api/auth/artist/profile/quality', {
      body: {
        score: parseInt(score.split('-')[0]),
        badges: [badge],
        benefits: [benefit]
      }
    }).as(`getScore${score.replace('-', '')}`);
  });
});

Then('I should receive the appropriate badge', () => {
  cy.get('[data-cy="profile-badge"]').should('be.visible');
  cy.get('[data-cy="badge-name"]').should('not.be.empty');
});

Then('the badge should appear on my public profile', () => {
  cy.visit('/artist/my-public-slug');
  cy.get('[data-cy="public-profile-badge"]').should('be.visible');
});

Then('I should understand the benefits of each level', () => {
  cy.get('[data-cy="badge-benefits"]').should('be.visible');
  cy.get('[data-cy="benefit-description"]').should('contain', 'visibilité');
});

Given('I want to see how my profile appears online', () => {
  cy.visit('/dashboard');
  cy.get('[data-cy="seo-section"]').should('be.visible');
});

When('I access the SEO preview tool', () => {
  cy.get('[data-cy="seo-preview-btn"]').click();
});

Then('I should see simulated search results showing:', (dataTable) => {
  const platforms = dataTable.hashes();

  cy.get('[data-cy="seo-preview-modal"]').should('be.visible');

  platforms.forEach((row) => {
    const platform = row['Platform'];
    const preview = row['Preview'];

    switch(platform) {
      case 'Google search':
        cy.get('[data-cy="google-preview"]').should('be.visible');
        cy.get('[data-cy="google-title"]').should('be.visible');
        cy.get('[data-cy="google-description"]').should('be.visible');
        cy.get('[data-cy="google-url"]').should('be.visible');
        break;
      case 'Facebook share':
        cy.get('[data-cy="facebook-preview"]').should('be.visible');
        cy.get('[data-cy="facebook-image"]').should('be.visible');
        cy.get('[data-cy="facebook-title"]').should('be.visible');
        break;
      case 'Twitter share':
        cy.get('[data-cy="twitter-preview"]').should('be.visible');
        cy.get('[data-cy="twitter-card"]').should('be.visible');
        break;
    }
  });
});

Then('the preview should reflect my current profile data', () => {
  cy.get('[data-cy="preview-title"]').should('contain', 'Jazz Virtuoso');
  cy.get('[data-cy="preview-description"]').should('not.be.empty');
});

Then('I should see suggestions for SEO improvement', () => {
  cy.get('[data-cy="seo-suggestions"]').should('be.visible');
  cy.get('[data-cy="seo-tip"]').should('have.length.greaterThan', 0);
});

Given('I want to create the best possible profile', () => {
  cy.visit('/dashboard/profile');
});

When('I access the profile tips section', () => {
  cy.get('[data-cy="profile-tips-btn"]').click();
});

Then('I should see contextual advice:', (dataTable) => {
  const tips = dataTable.hashes();

  cy.get('[data-cy="profile-tips"]').should('be.visible');

  tips.forEach((row) => {
    const section = row['Section'];
    const tip = row['Tip'];

    switch(section) {
      case 'Photo':
        cy.get('[data-cy="photo-tips"]').should('contain', 'high-quality');
        cy.get('[data-cy="photo-tips"]').should('contain', 'portfolio');
        break;
      case 'Description':
        cy.get('[data-cy="description-tips"]').should('contain', 'musical journey');
        break;
      case 'Genres':
        cy.get('[data-cy="genres-tips"]').should('contain', 'specific');
        break;
      case 'Social Links':
        cy.get('[data-cy="social-tips"]').should('contain', 'active');
        break;
    }
  });
});

Then('tips should be updated based on my current profile state', () => {
  cy.get('[data-cy="contextual-tip"]').should('be.visible');
  cy.get('[data-cy="personalized-advice"]').should('exist');
});

Given('I have a published profile', () => {
  cy.intercept('GET', '**/api/auth/artist/analytics', {
    fixture: 'profile-analytics.json'
  }).as('getAnalytics');

  cy.login('artist@test.com', 'password123');
});

When('I check my profile analytics', () => {
  cy.visit('/dashboard/analytics');
  cy.wait('@getAnalytics');
});

Then('I should see quality-related metrics:', (dataTable) => {
  const metrics = dataTable.hashes();

  cy.get('[data-cy="analytics-dashboard"]').should('be.visible');

  metrics.forEach((row) => {
    const metric = row['Metric'];
    const description = row['Description'];

    switch(metric) {
      case 'Profile views':
        cy.get('[data-cy="profile-views"]').should('be.visible');
        cy.get('[data-cy="profile-views"]').should('contain', '1250');
        break;
      case 'Search appearances':
        cy.get('[data-cy="search-appearances"]').should('be.visible');
        break;
      case 'Contact clicks':
        cy.get('[data-cy="contact-clicks"]').should('be.visible');
        break;
      case 'Quality score trend':
        cy.get('[data-cy="quality-trend"]').should('be.visible');
        break;
    }
  });
});

Then('I should understand how quality affects these metrics', () => {
  cy.get('[data-cy="quality-impact-explanation"]').should('be.visible');
  cy.get('[data-cy="correlation-chart"]').should('exist');
});

Given('I want to compare my profile quality', () => {
  cy.visit('/dashboard/analytics');
});

When('I access the benchmarking feature', () => {
  cy.get('[data-cy="benchmarking-tab"]').click();
});

Then('I should see anonymous comparisons:', (dataTable) => {
  const comparisons = dataTable.hashes();

  cy.get('[data-cy="benchmarking-section"]').should('be.visible');

  comparisons.forEach((row) => {
    const comparison = row['Comparison'];
    const data = row['Data'];

    switch(comparison) {
      case 'My score vs average in my genre':
        cy.get('[data-cy="genre-comparison"]').should('be.visible');
        cy.get('[data-cy="genre-percentage"]').should('contain', '%');
        break;
      case 'My score vs top profiles in my city':
        cy.get('[data-cy="city-ranking"]').should('be.visible');
        break;
      case 'Areas where I\'m above/below average':
        cy.get('[data-cy="strength-weaknesses"]').should('be.visible');
        break;
    }
  });
});

Then('all data should be anonymized and aggregated', () => {
  cy.get('[data-cy="privacy-notice"]').should('contain', 'anonymisées');
  cy.get('[data-cy="personal-data"]').should('not.exist');
});

Given('I haven\'t updated my profile recently', () => {
  // Mock last update date as old
  cy.intercept('GET', '**/api/auth/artist/profile', (req) => {
    req.reply((res) => {
      res.body.lastUpdated = '2024-01-01T00:00:00Z';
      return res;
    });
  }).as('getOldProfile');
});

When('the system detects improvement opportunities', () => {
  cy.visit('/dashboard');
  cy.wait('@getOldProfile');
});

Then('I should receive helpful notifications:', (dataTable) => {
  const notifications = dataTable.hashes();

  notifications.forEach((row) => {
    const type = row['Notification Type'];
    const frequency = row['Frequency'];

    switch(type) {
      case 'Weekly quality tips':
        cy.get('[data-cy="weekly-tips-notification"]').should('be.visible');
        break;
      case 'Missing information alerts':
        cy.get('[data-cy="missing-info-alert"]').should('be.visible');
        break;
      case 'Quality score achievements':
        cy.get('[data-cy="achievement-notification"]').should('be.visible');
        break;
    }
  });
});

Then('I should be able to control notification preferences', () => {
  cy.get('[data-cy="notification-settings-link"]').should('be.visible');
  cy.get('[data-cy="notification-settings-link"]').click();
  cy.get('[data-cy="notification-preferences"]').should('be.visible');
});

Given('I want professional feedback on my profile', () => {
  cy.visit('/dashboard/profile');
});

When('I request a profile review', () => {
  cy.get('[data-cy="request-review-btn"]').click();
});

Then('I should receive detailed feedback on:', (dataTable) => {
  const aspects = dataTable.hashes();

  cy.get('[data-cy="review-request-confirmation"]').should('be.visible');

  aspects.forEach((row) => {
    const aspect = row['Review Aspect'];
    const feedback = row['Feedback'];

    cy.get('[data-cy="review-aspects"]').should('contain', aspect);
  });
});

Then('feedback should be actionable and specific', () => {
  cy.get('[data-cy="actionable-feedback"]').should('be.visible');
  cy.get('[data-cy="specific-recommendations"]').should('exist');
});