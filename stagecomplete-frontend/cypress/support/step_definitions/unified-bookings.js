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
  // This would need to be set up through API or database seeding
  cy.task('seedBookingRequests', { artistId: testArtist.id, count, status: 'PENDING' });
});

Given('I have {int} manual bookings', (count) => {
  cy.task('seedManualBookings', { artistId: testArtist.id, count });
});

Given('I have {int} accepted platform booking', (count) => {
  cy.task('seedPlatformEvents', { artistId: testArtist.id, count, status: 'CONFIRMED' });
});

Given('I have an accepted platform booking with id {string}', (eventId) => {
  cy.task('seedPlatformEvent', {
    artistId: testArtist.id,
    eventId,
    status: 'CONFIRMED'
  });
});

Given('I have {int} manual booking on {string}', (count, date) => {
  cy.task('seedManualBooking', {
    artistId: testArtist.id,
    date: new Date(date).toISOString()
  });
});

Given('I have {int} platform event on {string}', (count, date) => {
  cy.task('seedPlatformEvent', {
    artistId: testArtist.id,
    date: new Date(date).toISOString(),
    status: 'CONFIRMED'
  });
});

Given('I have:', (dataTable) => {
  const data = {};
  dataTable.hashes().forEach(row => {
    data[row.Type] = parseInt(row.Count);
  });
  cy.task('seedArtistData', { artistId: testArtist.id, data });
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

Then('I should see a badge with {string} on the {string} tab', (count, tabName) => {
  cy.contains('.tabs button', tabName)
    .find('.badge')
    .should('contain', count);
});

Then('I should see {int} booking request cards when viewing the requests tab', (count) => {
  cy.get('[data-cy="booking-request-card"]').should('have.length', count);
});

Then('I should see {int} total bookings', (count) => {
  cy.get('[data-cy="booking-card"]').should('have.length', count);
});

Then('I should see {string} badge on manual bookings', (badge) => {
  cy.get('[data-cy="manual-booking"]').each($el => {
    cy.wrap($el).contains('.badge', badge).should('be.visible');
  });
});

Then('I should see {string} badge on platform bookings', (badge) => {
  cy.get('[data-cy="platform-booking"]').each($el => {
    cy.wrap($el).contains('.badge', badge).should('be.visible');
  });
});


Then('I should see {string} in my bookings list', (bookingTitle) => {
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

Then('I should see a {string} button', (buttonText) => {
  cy.contains('button', buttonText).should('be.visible');
});

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