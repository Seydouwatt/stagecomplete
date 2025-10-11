import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Test users
const venues = {
  'Blue Note Jazz': {
    email: 'bluenote@test.com',
    password: 'Test123!',
    name: 'Blue Note Jazz'
  },
  'Rock Arena': {
    email: 'rockarena@test.com',
    password: 'Test123!',
    name: 'Rock Arena'
  }
};

const artists = {
  'Jazz Trio': {
    email: 'jazztrio@test.com',
    password: 'Test123!',
    name: 'Jazz Trio'
  }
};

// Given steps
Given('I am logged in as a venue {string}', (venueName) => {
  const venue = venues[venueName];
  cy.visit('/login');
  cy.get('input[name="email"]').type(venue.email);
  cy.get('input[name="password"]').type(venue.password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

Given('I am logged in as the artist {string}', (artistName) => {
  const artist = artists[artistName];
  cy.visit('/login');
  cy.get('input[name="email"]').type(artist.email);
  cy.get('input[name="password"]').type(artist.password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

Given('I am logged in as the venue {string}', (venueName) => {
  const venue = venues[venueName];
  cy.visit('/login');
  cy.get('input[name="email"]').type(venue.email);
  cy.get('input[name="password"]').type(venue.password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

Given('I am an artist with {int} pending booking requests', (count) => {
  cy.task('seedPendingRequests', { count });
});

Given('an artist and venue are in an active conversation', () => {
  cy.task('setupActiveConversation');
});

Given('I am a venue', () => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(venues['Blue Note Jazz'].email);
  cy.get('input[name="password"]').type(venues['Blue Note Jazz'].password);
  cy.get('button[type="submit"]').click();
});

Given('I created a booking request {int} days ago', (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  cy.task('createOldBookingRequest', { date: date.toISOString() });
});

// When steps
When('I navigate to an artist profile {string}', (artistName) => {
  cy.visit(`/artist/${artistName.toLowerCase().replace(' ', '-')}`);
});

// Note: "When I click {string}" is already defined in common.js

When('I fill in the booking request form:', (dataTable) => {
  dataTable.hashes().forEach(row => {
    const field = row.Field;
    const value = row.Value;

    if (field === 'eventType') {
      cy.get(`select[name="${field}"]`).select(value);
    } else {
      cy.get(`input[name="${field}"], textarea[name="${field}"]`).type(value);
    }
  });
});

When('I submit the booking request', () => {
  cy.get('button[type="submit"]').contains('Envoyer').click();
});

When('I logout', () => {
  cy.get('[data-testid="nav-logout"]').click();
  cy.url().should('include', '/login');
});

When('I click {string} on the booking request', (action) => {
  cy.get(`[data-cy="booking-request-${action.toLowerCase()}"]`).first().click();
});

When('I provide a response message {string}', (message) => {
  cy.get('[data-cy="response-message"]').type(message);
});

When('I provide a decline reason {string}', (reason) => {
  cy.get('[data-cy="decline-reason"]').type(reason);
});

When('I confirm the acceptance', () => {
  cy.get('[data-cy="confirm-accept"]').click();
});

When('I confirm the decline', () => {
  cy.get('[data-cy="confirm-decline"]').click();
});

When('I type {string} in the message input', (message) => {
  cy.get('[data-cy="message-input"]').type(message);
});

When('I send the message', () => {
  cy.get('[data-cy="send-message"]').click();
});

When('I click on the conversation', () => {
  cy.get('[data-cy="conversation-card"]').first().click();
});

When('I create a booking request for artist {string}', (artistName) => {
  cy.visit(`/artist/${artistName.toLowerCase().replace(' ', '-')}`);
  cy.contains('Demander un booking').click();
  cy.get('input[name="eventDate"]').type('2025-03-01T20:00');
  cy.get('select[name="eventType"]').select('CONCERT');
  cy.get('input[name="budget"]').type('600');
  cy.get('button[type="submit"]').click();
});

When('I accept {int} requests', (count) => {
  for (let i = 0; i < count; i++) {
    cy.get('[data-cy="booking-request-accept"]').eq(i).click();
    cy.get('[data-cy="confirm-accept"]').click();
    cy.wait(500);
  }
});

When('I decline {int} request', (count) => {
  cy.get('[data-cy="booking-request-decline"]').first().click();
  cy.get('[data-cy="decline-reason"]').type('Not available');
  cy.get('[data-cy="confirm-decline"]').click();
});

When('the artist logs in', () => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(artists['Jazz Trio'].email);
  cy.get('input[name="password"]').type(artists['Jazz Trio'].password);
  cy.get('button[type="submit"]').click();
});

When('navigates to {string}', (path) => {
  cy.visit(path);
});

When('the venue sends a message {string}', (message) => {
  // This would be simulated through WebSocket or API
  cy.task('sendMessage', { from: 'venue', message });
});

// Then steps
// Note: "Then I should see {string}" is already defined in common.js

Then('I should see a badge with {string} on the {string} tab', (count, tabName) => {
  cy.contains('.tabs button', tabName)
    .find('.badge')
    .should('contain', count);
});

Then('I should see a booking request from {string}', (venueName) => {
  cy.contains('[data-cy="booking-request-card"]', venueName).should('be.visible');
});

Then('the request should move to {string} tab', (tabName) => {
  cy.contains('.tabs button', tabName).click();
  cy.get('[data-cy="platform-booking"]').should('exist');
});

Then('I should see the event {string}', (eventName) => {
  cy.contains(eventName).should('be.visible');
});

Then('I should see a {string} badge', (badgeText) => {
  cy.contains('.badge', badgeText).should('be.visible');
});

Then('I should be on the messages page for this event', () => {
  cy.url().should('match', /\/messages\/[\w-]+$/);
  cy.get('[data-cy="message-thread"]').should('be.visible');
});

Then('I should see the event details in the header', () => {
  cy.get('[data-cy="event-header"]').should('be.visible');
  cy.get('[data-cy="event-header"]').should('contain', 'Soirée St-Valentin');
});

Then('I should see my message in the thread', () => {
  cy.get('[data-cy="message"]').should('contain', 'Bonjour, pouvez-vous me confirmer');
});

Then('I should see a conversation with {string}', (name) => {
  cy.contains('[data-cy="conversation-card"]', name).should('be.visible');
});

Then('I should see the message {string}', (message) => {
  cy.contains('[data-cy="message"]', message).should('be.visible');
});

Then('I should see both messages in the thread', () => {
  cy.get('[data-cy="message"]').should('have.length.at.least', 2);
});

Then('the request should be marked as {string}', (status) => {
  cy.contains('.badge', status).should('be.visible');
});

Then('I should see {int} events in {string} tab', (count, tabName) => {
  cy.contains('.tabs button', tabName).click();
  cy.get('[data-cy="platform-booking"]').should('have.length', count);
});

Then('the accept/decline buttons should be disabled', () => {
  cy.get('[data-cy="booking-request-accept"]').should('be.disabled');
  cy.get('[data-cy="booking-request-decline"]').should('be.disabled');
});

Then('the artist should see the message appear within {int} seconds', (seconds) => {
  cy.contains('[data-cy="message"]', 'Nouvelle information importante', {
    timeout: seconds * 1000
  }).should('be.visible');
});

Then('the message count badge should update', () => {
  cy.get('[data-cy="message-count-badge"]').should('contain', '1');
});