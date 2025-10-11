import { Given, When, Then, After } from '@badeball/cypress-cucumber-preprocessor';

// Test data
const testArtist = {
  email: 'artist@test.com',
  password: 'Test123!',
  name: 'Test Artist'
};

const testVenue = {
  email: 'venue@test.com',
  password: 'Test123!',
  name: 'Blue Note Jazz'
};

// Given steps
// Note: "I am logged in as an artist" is already defined in common.js

Given('I am logged in as a new artist with no bookings', () => {
  const newArtist = {
    email: `new-artist-${Date.now()}@test.com`,
    password: 'Test123!',
    name: 'New Artist'
  };
  cy.registerArtist(newArtist);
});

Given('I have {int} pending booking requests', (count) => {
  // Use the currently logged-in artist's token
  // IMPORTANT: Wrap in cy.then() to ensure it executes AFTER the token is stored
  cy.then(() => {
    const artistToken = Cypress.env('currentArtistToken');
    const artistEmail = Cypress.env('currentArtistEmail');

    // Debug logging
    cy.log(`🔍 DEBUG: artistToken = ${artistToken ? 'EXISTS (' + artistToken.substring(0, 30) + '...)' : '❌ UNDEFINED'}`);
    cy.log(`🔍 DEBUG: artistEmail = ${artistEmail || '❌ UNDEFINED'}`);

    return cy.task('seedBookingRequests', { artistToken, count, status: 'PENDING' }).then((result) => {
      cy.log(`✅ Created ${count} pending booking requests for logged-in artist`);
    });
  });
});

Given('I have {int} manual bookings', (count) => {
  cy.then(() => {
    const artistToken = Cypress.env('currentArtistToken');
    const artistEmail = Cypress.env('currentArtistEmail');

    // Debug logging
    cy.log(`🔍 DEBUG: artistToken = ${artistToken ? 'EXISTS (' + artistToken.substring(0, 30) + '...)' : '❌ UNDEFINED'}`);
    cy.log(`🔍 DEBUG: artistEmail = ${artistEmail || '❌ UNDEFINED'}`);

    return cy.task('seedManualBookings', { artistToken, count }).then(() => {
      cy.log(`✅ Created ${count} manual bookings for logged-in artist`);
    });
  });
});

Given('I have {int} accepted platform booking', (count) => {
  cy.then(() => {
    const artistToken = Cypress.env('currentArtistToken');
    return cy.task('seedPlatformEvents', { artistToken, count, status: 'CONFIRMED' }).then(() => {
      cy.log(`✅ Created ${count} platform events for logged-in artist`);
    });
  });
});

Given('I have an accepted platform booking with id {string}', (expectedEventId) => {
  cy.then(() => {
    const artistToken = Cypress.env('currentArtistToken');
    return cy.task('seedPlatformEvent', {
      artistToken,
      eventId: expectedEventId,
      status: 'CONFIRMED'
    }).then((event) => {
      // Store the actual event ID that was created (database generates the ID)
      if (event && event.id) {
        Cypress.env('lastCreatedEventId', event.id);
        cy.log(`✅ Created platform event with ID: ${event.id} for logged-in artist`);
      }
    });
  });
});

Given('I have {int} manual booking on {string}', (count, date) => {
  cy.then(() => {
    const artistToken = Cypress.env('currentArtistToken');
    return cy.task('seedManualBooking', {
      artistToken,
      date: new Date(date).toISOString()
    }).then(() => {
      cy.log(`✅ Created manual booking on ${date} for logged-in artist`);
    });
  });
});

Given('I have {int} platform event on {string}', (count, date) => {
  cy.then(() => {
    const artistToken = Cypress.env('currentArtistToken');
    return cy.task('seedPlatformEvent', {
      artistToken,
      date: new Date(date).toISOString(),
      status: 'CONFIRMED'
    }).then(() => {
      cy.log(`✅ Created platform event on ${date} for logged-in artist`);
    });
  });
});

Given('I have:', (dataTable) => {
  cy.then(() => {
    const artistToken = Cypress.env('currentArtistToken');
    const data = {};
    dataTable.hashes().forEach(row => {
      data[row.Type] = parseInt(row.Count);
    });
    return cy.task('seedArtistData', { artistToken, data }).then(() => {
      cy.log(`✅ Created artist data for logged-in artist`);
    });
  });
});

// When steps
// Note: "When I navigate to {string}" is already defined in browse-navigation.js

When('I click on the {string} tab', (tabName) => {
  cy.contains('.tabs button', tabName).click();
});

// Note: "When I click on {string}" is already defined in common.js

When('I fill in the booking form:', (dataTable) => {
  dataTable.hashes().forEach(row => {
    cy.get(`input[name="${row.Field}"], textarea[name="${row.Field}"]`).type(row.Value);
  });
});

// Note: "When I click {string}" is already defined in common.js

When('I click the message icon for the platform booking', () => {
  cy.get('[data-cy="platform-booking-message-icon"]').first().click();
});

// Then steps
Then('I should see the page title {string}', (title) => {
  cy.contains('h1', title).should('be.visible');
});

Then('I should see {int} tabs:', (count, dataTable) => {
  cy.get('.tabs button').should('have.length', count);
  dataTable.hashes().forEach(row => {
    cy.contains('.tabs button', row['Tab Name']).should('be.visible');
  });
});

Then('the {string} tab should be active by default', (tabName) => {
  cy.contains('.tabs button', tabName).should('have.class', 'tab-active');
});

Then('the {string} tab should be active', (tabName) => {
  cy.contains('.tabs button', tabName).should('have.class', 'tab-active');
});

Then('I should see the bookings list or empty state', () => {
  cy.get('body').then($body => {
    if ($body.find('[data-cy="bookings-list"]').length > 0) {
      cy.get('[data-cy="bookings-list"]').should('be.visible');
    } else {
      cy.contains('Aucun booking pour le moment').should('be.visible');
    }
  });
});

Then('I should see the calendar view', () => {
  cy.get('[data-cy="calendar-view"]').should('be.visible');
});

// Note: "Then I should see a badge with {string} on the {string} tab" is already defined in booking-workflow.js

Then('I should see {int} booking request cards when viewing the requests tab', (count) => {
  cy.get('[data-cy="booking-request-card"]').should('have.length', count);
});

Then('I should see {int} total bookings', (count) => {
  cy.get('[data-cy="booking-card"]').should('have.length', count);
});

Then('I should see {string} badge on manual bookings', (badge) => {
  cy.get('[data-booking-type="manual-booking"]').each($el => {
    cy.wrap($el).contains('.badge', badge).should('be.visible');
  });
});

Then('I should see {string} badge on platform bookings', (badge) => {
  cy.get('[data-booking-type="platform-booking"]').each($el => {
    cy.wrap($el).contains('.badge', badge).should('be.visible');
  });
});


Then('I should see {string} in my bookings list', (bookingTitle) => {
  // S'assurer qu'on est sur l'onglet "Tous mes bookings"
  cy.contains('.tabs button', 'Tous mes bookings').click();
  // Attendre un peu que le contenu se charge
  cy.wait(500);
  // Chercher le booking card avec le titre
  cy.contains('[data-cy="booking-card"]', bookingTitle).should('be.visible');
});

Then('I should see {int} events on the calendar', (count) => {
  cy.get('[data-cy="calendar-event"]').should('have.length', count);
});

Then('I should see an event on {string}', (date) => {
  cy.contains('[data-cy="calendar-event"]', date).should('be.visible');
});

Then('I should see {string} in the requests tab', (text) => {
  cy.contains(text).should('be.visible');
});

// Note: "Then I should see {string}" is already defined in common.js
// Note: "Then I should see a {string} button" is already defined in public-search.js

Then('I should see an empty calendar', () => {
  cy.get('[data-cy="calendar-view"]').should('be.visible');
  cy.get('[data-cy="calendar-event"]').should('not.exist');
});

Then('I should see stats cards with:', (dataTable) => {
  dataTable.hashes().forEach(row => {
    cy.contains('.stat', row.Stat).should('contain', row.Value);
  });
});

// Cleanup
After({ tags: '@cleanup' }, () => {
  cy.task('cleanupTestData');
});