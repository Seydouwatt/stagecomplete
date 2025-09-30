import { Given, When, Then, And } from '@badeball/cypress-cucumber-preprocessor';

// User setup with different completion levels
Given('I am an artist with a {int}% complete profile', (percentage) => {
  cy.fixture('test-users.json').then((users) => {
    const profiles = {
      25: users.artists.incomplete_25,
      40: users.artists.incomplete_40,
      50: users.artists.incomplete_50,
      58: users.artists.incomplete_58,
      70: users.artists.incomplete_70,
      85: users.artists.complete_85,
      90: users.artists.complete_90
    };

    const userProfile = profiles[percentage];
    if (!userProfile) {
      // Create a profile with the specified percentage
      cy.createArtistWithCompletionLevel(percentage);
    } else {
      cy.loginAsArtist(userProfile.email, userProfile.password);
    }

    cy.wrap(percentage).as('completionPercentage');
  });
});

Given('I am a newly registered artist', () => {
  cy.fixture('test-users.json').then((users) => {
    const newArtist = users.artists.fresh;
    cy.registerArtist({
      name: newArtist.name,
      email: newArtist.email,
      password: newArtist.password,
      role: 'ARTIST'
    });
    cy.wrap(0).as('completionPercentage');
  });
});

Given('only my name and email are filled', () => {
  // User has only minimal registration data
  cy.wrap(12.5).as('completionPercentage'); // Only partial basic info
});

// Completion prompt verifications
Then('I should see the ProfileCompletionPrompt component', () => {
  cy.get('[data-testid="profile-completion-prompt"]').should('be.visible');
});

Then('I should not see the ProfileCompletionPrompt component', () => {
  cy.get('[data-testid="profile-completion-prompt"]').should('not.exist');
});

Then('I should not see the standard hero section', () => {
  cy.get('[data-testid="dashboard-hero-standard"]').should('not.exist');
});

Then('I should see the standard hero section', () => {
  cy.get('[data-testid="dashboard-hero-standard"]').should('be.visible');
});

// Then('I should see {string}', (text) => {
//   cy.contains(text).should('be.visible');
// });

Then('I should see the CTA {string}', (ctaText) => {
  cy.contains('button', ctaText).should('be.visible');
});

Then('the quick actions should be business-oriented', () => {
  cy.get('[data-testid="quick-actions"]').within(() => {
    cy.contains('New event').should('be.visible');
    cy.contains('Find venues').should('be.visible');
    cy.contains('Upload content').should('be.visible');
  });
});

// Detailed prompt content testing
Then('I should see the ProfileCompletionPrompt component with:', (dataTable) => {
  const elements = dataTable.hashes();

  elements.forEach(element => {
    const selectors = {
      'Main title': '[data-testid="completion-prompt-title"]',
      'Percentage': '[data-testid="completion-percentage"]',
      'Progress bar': '[data-testid="completion-progress-bar"]',
      'Missing items section': '[data-testid="missing-items-section"]',
      'Sales arguments': '[data-testid="completion-benefits"]',
      'Primary CTA': '[data-testid="assistant-cta"]',
      'Secondary CTA': '[data-testid="manual-completion-cta"]'
    };

    cy.get(selectors[element['Element']])
      .should('be.visible')
      .should('contain', element['Expected content']);
  });
});

// Missing elements testing
When('I look at the ProfileCompletionPrompt component', () => {
  cy.get('[data-testid="profile-completion-prompt"]').scrollIntoView();
});

Then('I should see the following missing elements:', (dataTable) => {
  const missingItems = dataTable.hashes();

  missingItems.forEach((item, index) => {
    cy.get('[data-testid="missing-items-list"] [data-testid="missing-item"]')
      .eq(index)
      .within(() => {
        cy.contains(item['Missing element']).should('be.visible');
        cy.contains(item['Description']).should('be.visible');
        cy.get(`[data-testid="${item['Icon'].toLowerCase()}"]`).should('be.visible');
      });
  });
});

Then('I should see a maximum of {int} displayed elements', (maxItems) => {
  cy.get('[data-testid="missing-items-list"] [data-testid="missing-item"]')
    .should('have.length.at.most', maxItems);
});

Then('if there are more, I should see {string}', (moreText) => {
  cy.get('[data-testid="missing-items-list"]').then(($list) => {
    const itemsCount = $list.find('[data-testid="missing-item"]').length;
    if (itemsCount >= 4) {
      cy.get('[data-testid="more-items-indicator"]')
        .should('be.visible')
        .should('contain', 'others');
    }
  });
});

// Adaptive quick actions testing
When('I look at the Quick Actions section', () => {
  cy.get('[data-testid="quick-actions"]').scrollIntoView();
});

Then('I should see the following actions:', (dataTable) => {
  const actions = dataTable.hashes();

  actions.forEach((action, index) => {
    cy.get('[data-testid="quick-actions"] [data-testid="quick-action"]')
      .eq(index)
      .within(() => {
        cy.contains(action['Action']).should('be.visible');
        cy.contains(action['Description']).should('be.visible');
      });
  });
});

Then('I should not see business-oriented actions', () => {
  cy.get('[data-testid="quick-actions"]').within(() => {
    cy.contains('New event').should('not.exist');
    cy.contains('Find venues').should('not.exist');
  });
});

Then('I should see the following business actions:', (dataTable) => {
  const businessActions = dataTable.hashes();

  businessActions.forEach((action, index) => {
    cy.get('[data-testid="quick-actions"] [data-testid="quick-action"]')
      .eq(index)
      .within(() => {
        cy.contains(action['Action']).should('be.visible');
        cy.contains(action['Description']).should('be.visible');
      });
  });
});

// Real-time update testing
When('I add {int} musical genres', (genreCount) => {
  cy.get('[data-testid="genres-section"]').within(() => {
    for (let i = 0; i < genreCount; i++) {
      cy.get('[data-testid="add-genre-button"]').click();
      cy.get('[data-testid="genre-select"]').select(['Jazz', 'Rock', 'Pop'][i]);
      cy.get('[data-testid="confirm-genre"]').click();
    }
  });
});

When('I add {int} instruments', (instrumentCount) => {
  cy.get('[data-testid="instruments-section"]').within(() => {
    for (let i = 0; i < instrumentCount; i++) {
      cy.get('[data-testid="add-instrument-button"]').click();
      cy.get('[data-testid="instrument-select"]').select(['Guitar', 'Piano', 'Drums'][i]);
      cy.get('[data-testid="confirm-instrument"]').click();
    }
  });
});

When('I add my location {string}', (location) => {
  cy.get('[data-testid="location-section"]').within(() => {
    cy.get('[data-testid="location-input"]').type(location);
    cy.get('[data-testid="save-location"]').click();
  });
});

When('I return to the dashboard', () => {
  cy.visit('/dashboard');
  cy.waitForPageLoad();
});

Then('the completion percentage should have increased', () => {
  cy.get('@completionPercentage').then((initialPercentage) => {
    cy.get('[data-testid="completion-percentage"]').then(($el) => {
      const currentPercentage = parseInt($el.text().match(/(\d+)%/)[1]);
      expect(currentPercentage).to.be.greaterThan(initialPercentage);
    });
  });
});

Then('the progress bar should update', () => {
  cy.get('[data-testid="completion-progress-bar"] [data-testid="progress-fill"]')
    .should('have.css', 'width')
    .and('not.equal', '0px');
});

Then('some elements should disappear from the {string} list', () => {
  cy.get('[data-testid="missing-items-list"] [data-testid="missing-item"]')
    .should('have.length.lessThan', 8); // Less than total possible
});

// Threshold switching testing
Given('I see the assistant prompt on the dashboard', () => {
  cy.get('[data-testid="profile-completion-prompt"]').should('be.visible');
});

When('I add enough information to reach {int}%', (targetPercentage) => {
  // Add information to reach target percentage
  cy.addProfileDataToReachPercentage(targetPercentage);
});

Then('the assistant prompt should disappear', () => {
  cy.get('[data-testid="profile-completion-prompt"]').should('not.exist');
});

Then('the standard hero section should appear', () => {
  cy.get('[data-testid="dashboard-hero-standard"]').should('be.visible');
});

Then('the quick actions should switch to business actions', () => {
  cy.get('[data-testid="quick-actions"]').within(() => {
    cy.contains('New event').should('be.visible');
    cy.contains('Complete profile').should('not.exist');
  });
});

// Sales arguments testing
Given('I am an artist with an incomplete profile', () => {
  cy.createArtistWithCompletionLevel(30);
});

Given('I see the completion prompt on the dashboard', () => {
  cy.get('[data-testid="profile-completion-prompt"]').should('be.visible');
});

Then('I should see the {string} section', (sectionTitle) => {
  cy.contains(sectionTitle).should('be.visible');
});

Then('I should see the following benefits:', (dataTable) => {
  const benefits = dataTable.hashes();

  benefits.forEach(benefit => {
    cy.get('[data-testid="completion-benefits"]').within(() => {
      cy.contains(benefit['Benefit']).should('be.visible');
      cy.get(`[data-testid="${benefit['Icon'].toLowerCase()}-icon"]`).should('be.visible');
    });
  });
});

Then('each benefit should have a green check icon', () => {
  cy.get('[data-testid="completion-benefits"] [data-testid="benefit-item"]').each(($benefit) => {
    cy.wrap($benefit).within(() => {
      cy.get('[data-testid="check-icon"]')
        .should('be.visible')
        .should('have.css', 'color', 'rgb(34, 197, 94)'); // text-green-500
    });
  });
});

// CTAs and redirections testing
Then('I should be redirected to {string}', (expectedPath) => {
  cy.url().should('include', expectedPath);
});

Then('I should be in the guided assistant process', () => {
  cy.get('[data-testid="profile-wizard"]').should('be.visible');
});

Then('I should be on the profile management page', () => {
  cy.get('[data-testid="artist-profile-form"]').should('be.visible');
});

// Detailed evaluation testing
When('I check the completion evaluation', () => {
  // Access evaluation details (could be via API or debug component)
  cy.window().its('profileCompletion').as('completionData');
});

Then('the following criteria should be evaluated:', (dataTable) => {
  const criteria = dataTable.hashes();

  cy.get('@completionData').then((completion) => {
    criteria.forEach(criterion => {
      const criterionKey = criterion['Criterion'].toLowerCase().replace(/\s+/g, '_');
      expect(completion.criteria).to.have.property(criterionKey);

      const status = criterion['State'] === 'Incomplete' ? false : true;
      expect(completion.criteria[criterionKey].isCompleted).to.equal(status);
    });
  });
});

Then('the global score should be close to {int}%', (expectedScore) => {
  cy.get('@completionData').then((completion) => {
    expect(completion.percentage).to.be.closeTo(expectedScore, 5); // 5% tolerance
  });
});

// Responsive testing
Given('I check the dashboard on mobile', () => {
  cy.viewport('iphone-x');
  cy.visit('/dashboard');
});

Then('the ProfileCompletionPrompt component should adapt', () => {
  cy.get('[data-testid="profile-completion-prompt"]')
    .should('be.visible')
    .should('have.css', 'max-width');
});

Then('all elements should remain readable', () => {
  cy.get('[data-testid="profile-completion-prompt"] *').each(($el) => {
    if ($el.is(':visible')) {
      cy.wrap($el).should('have.css', 'font-size').and('not.equal', '0px');
    }
  });
});

Then('CTAs should be easily clickable', () => {
  cy.get('[data-testid="profile-completion-prompt"] button, [data-testid="profile-completion-prompt"] a').each(($cta) => {
    cy.wrap($cta)
      .should('be.visible')
      .should('have.css', 'min-height')
      .and('match', /^[4-9]\d+px$/); // At least 40px
  });
});

Then('animations should remain smooth', () => {
  cy.get('[data-testid="profile-completion-prompt"]')
    .should('have.css', 'opacity', '1');
});

// Accessibility testing
Given('I navigate with a screen reader', () => {
  // Simulate screen reader navigation
  cy.get('body').trigger('keydown', { key: 'Tab' });
});

Then('the prompt should have appropriate ARIA labels', () => {
  cy.get('[data-testid="profile-completion-prompt"]')
    .should('have.attr', 'aria-label')
    .should('have.attr', 'role');
});

Then('percentages should be clearly announced', () => {
  cy.get('[data-testid="completion-percentage"]')
    .should('have.attr', 'aria-label')
    .and('include', 'percentage');
});

Then('CTAs should have accessible descriptions', () => {
  cy.get('[data-testid="profile-completion-prompt"] button').each(($btn) => {
    cy.wrap($btn)
      .should('satisfy', ($el) => {
        return $el.attr('aria-label') || $el.attr('title') || $el.text().trim();
      });
  });
});

Then('keyboard navigation should work correctly', () => {
  cy.get('[data-testid="profile-completion-prompt"]').within(() => {
    cy.get('button, a').first().focus();
    cy.focused().should('exist');

    // Test Tab navigation
    cy.get('body').trigger('keydown', { key: 'Tab' });
    cy.focused().should('exist');
  });
});

// Custom commands
Cypress.Commands.add('createArtistWithCompletionLevel', (percentage) => {
  // Create an artist with specified completion level
  const baseData = {
    name: `TestArtist${percentage}`,
    email: `test${percentage}@completion.com`,
    password: 'TestPass123!'
  };

  cy.registerArtist(baseData).then(() => {
    // Add data according to percentage
    if (percentage >= 25) {
      cy.addBasicProfileData();
    }
    if (percentage >= 50) {
      cy.addMusicData();
    }
    if (percentage >= 75) {
      cy.addPortfolioData();
    }
  });
});

Cypress.Commands.add('addProfileDataToReachPercentage', (targetPercentage) => {
  // Progressively add data to reach percentage
  cy.visit('/artist/portfolio');

  if (targetPercentage >= 65) {
    cy.get('[data-testid="bio-input"]').type('Passionate music artist');
    cy.get('[data-testid="genres-section"] [data-testid="add-genre"]').click();
    cy.get('[data-testid="genre-select"]').select('Jazz');
    cy.get('[data-testid="instruments-section"] [data-testid="add-instrument"]').click();
    cy.get('[data-testid="instrument-select"]').select('Piano');
  }

  cy.get('[data-testid="save-profile"]').click();
});