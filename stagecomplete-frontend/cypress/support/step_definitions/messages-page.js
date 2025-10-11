import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Given steps
Given('I have {int} confirmed events with different venues', (count) => {
  cy.task('seedConfirmedEvents', { count });
});

Given('I am logged in as a new artist with no events', () => {
  const newArtist = {
    email: `artist-${Date.now()}@test.com`,
    password: 'Test123!',
    name: 'New Artist'
  };
  cy.registerArtist(newArtist);
});

Given('I have a confirmed event {string} with venue {string}', (eventName, venueName) => {
  cy.task('seedConfirmedEvent', { eventName, venueName });
});

Given('I am in a message thread for event {string}', (eventName) => {
  cy.visit('/messages');
  cy.contains('[data-cy="conversation-card"]', eventName).click();
  cy.get('[data-cy="message-thread"]').should('be.visible');
});

Given('I am in a message thread with a venue', () => {
  cy.visit('/messages');
  cy.get('[data-cy="conversation-card"]').first().click();
  cy.get('[data-cy="message-thread"]').should('be.visible');
});

Given('I am in a message thread with {int} previous messages', (messageCount) => {
  cy.task('seedMessagesInThread', { count: messageCount });
  cy.visit('/messages');
  cy.get('[data-cy="conversation-card"]').first().click();
});

Given('I am logged in as a venue', () => {
  cy.visit('/login');
  cy.get('input[name="email"]').type('venue@test.com');
  cy.get('input[name="password"]').type('Test123!');
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

Given('I have {int} confirmed events with different artists', (count) => {
  cy.task('seedVenueEvents', { count });
});

Given('I am in a message thread', () => {
  cy.visit('/messages');
  cy.get('[data-cy="conversation-card"]').first().click();
  cy.get('[data-cy="message-thread"]').should('be.visible');
});

Given('I have events with different statuses:', (dataTable) => {
  const events = dataTable.hashes().map(row => ({
    name: row.Event,
    status: row.Status
  }));
  cy.task('seedEventsWithStatuses', { events });
});

Given('I have {int} unread messages in {string} conversation', (count, eventName) => {
  cy.task('seedUnreadMessages', { eventName, count });
});

Given('I am logged in as an artist with {int} conversations', (count) => {
  cy.task('seedArtistWithConversations', { count });
  cy.visit('/login');
  cy.get('input[name="email"]').type('artist@test.com');
  cy.get('input[name="password"]').type('Test123!');
  cy.get('button[type="submit"]').click();
});

// When steps
When('I click on the conversation with {string}', (venueName) => {
  cy.contains('[data-cy="conversation-card"]', venueName).click();
});

When('I type {string} in the message input', (message) => {
  cy.get('[data-cy="message-input"]').type(message);
});

When('I press Enter', () => {
  cy.get('[data-cy="message-input"]').type('{enter}');
});

When('the venue sends me a message {string}', (message) => {
  cy.task('simulateIncomingMessage', { message, from: 'venue' });
});

When('I open the conversation', () => {
  cy.get('[data-cy="conversation-card"]').first().click();
});

When('a new message arrives', () => {
  cy.task('simulateIncomingMessage', { message: 'New message', from: 'venue' });
});

When('I click the back button', () => {
  cy.get('[data-cy="back-button"]').click();
});

When('I search for {string}', (searchTerm) => {
  cy.get('[data-cy="search-input"]').type(searchTerm);
});

When('I clear the search', () => {
  cy.get('[data-cy="search-input"]').clear();
});

When('I type a very long message exceeding 1000 characters', () => {
  const longMessage = 'a'.repeat(1001);
  cy.get('[data-cy="message-input"]').type(longMessage);
});

When('I press Shift+Enter', () => {
  cy.get('[data-cy="message-input"]').type('{shift}{enter}');
});

// Then steps
Then('Each conversation card should display:', (dataTable) => {
  const elements = dataTable.hashes();
  cy.get('[data-cy="conversation-card"]').first().within(() => {
    elements.forEach(element => {
      if (element.Present === 'Yes') {
        const elementMap = {
          'Venue name': '[data-cy="venue-name"]',
          'Event date': '[data-cy="event-date"]',
          'Location': '[data-cy="event-location"]',
          'Message count': '[data-cy="message-count"]',
          'Status icon': '[data-cy="status-icon"]'
        };
        cy.get(elementMap[element.Element]).should('be.visible');
      }
    });
  });
});

// Note: "Then I should see {string}" is already defined in common.js

Then('I should see the message thread view', () => {
  cy.get('[data-cy="message-thread"]').should('be.visible');
});

Then('I should see {string} in the header', (text) => {
  cy.get('[data-cy="event-header"]').should('contain', text);
});

Then('I should see event details:', (dataTable) => {
  dataTable.hashes().forEach(row => {
    cy.get('[data-cy="event-details"]').should('contain', row.Value);
  });
});

Then('I should see a back button', () => {
  cy.get('[data-cy="back-button"]').should('be.visible');
});

Then('I should see my message in the thread', () => {
  cy.contains('[data-cy="message"]', 'Merci pour cette opportunité!').should('be.visible');
});

Then('the message should be aligned to the right', () => {
  cy.get('[data-cy="message"]').last().should('have.class', 'message-sent');
});

Then('the message should show the current time', () => {
  cy.get('[data-cy="message"]').last().find('[data-cy="message-time"]').should('be.visible');
});

Then('the input should be cleared', () => {
  cy.get('[data-cy="message-input"]').should('have.value', '');
});

Then('I should see the message appear in the thread within {int} seconds', (seconds) => {
  cy.contains('[data-cy="message"]', 'Pouvez-vous arriver', {
    timeout: seconds * 1000
  }).should('be.visible');
});

Then('the message should be aligned to the left', () => {
  cy.contains('[data-cy="message"]', 'Pouvez-vous arriver')
    .should('have.class', 'message-received');
});

Then('I should see the venue\'s name on the message', () => {
  cy.contains('[data-cy="message"]', 'Pouvez-vous arriver')
    .parent()
    .find('[data-cy="sender-name"]')
    .should('be.visible');
});

Then('the view should scroll to the bottom automatically', () => {
  cy.window().then(win => {
    const element = win.document.querySelector('[data-cy="messages-container"]');
    const isScrolledToBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    expect(isScrolledToBottom).to.be.true;
  });
});

Then('the view should scroll to show the new message', () => {
  cy.get('[data-cy="message"]').last().should('be.visible');
});

Then('I should see {int} conversation cards', (count) => {
  cy.get('[data-cy="conversation-card"]').should('have.length', count);
});

Then('each card should show the artist\'s name', () => {
  cy.get('[data-cy="conversation-card"]').each($card => {
    cy.wrap($card).find('[data-cy="artist-name"]').should('be.visible');
  });
});

Then('I should return to the messages list', () => {
  cy.url().should('include', '/messages');
  cy.url().should('not.match', /\/messages\/[\w-]+$/);
});

Then('I should see all my conversations', () => {
  cy.get('[data-cy="conversation-card"]').should('be.visible');
});

Then('I should see status icons for each conversation:', (dataTable) => {
  dataTable.hashes().forEach(row => {
    cy.contains('[data-cy="conversation-card"]', row.Event)
      .find('[data-cy="status-icon"]')
      .should('have.class', `status-${row['Icon Color'].toLowerCase()}`);
  });
});

Then('{string} should not appear in the list', (eventName) => {
  cy.contains('[data-cy="conversation-card"]', eventName).should('not.exist');
});

Then('I should see a badge with {string} on the {string} conversation', (count, eventName) => {
  cy.contains('[data-cy="conversation-card"]', eventName)
    .find('[data-cy="unread-badge"]')
    .should('contain', count);
});

Then('the unread badge should disappear', () => {
  cy.get('[data-cy="unread-badge"]').should('not.exist');
});

Then('I should only see conversations with {string} venue', (venueName) => {
  cy.get('[data-cy="conversation-card"]').each($card => {
    cy.wrap($card).should('contain', venueName);
  });
});

Then('I should see all {int} conversations again', (count) => {
  cy.get('[data-cy="conversation-card"]').should('have.length', count);
});

Then('the message input should have a placeholder {string}', (placeholder) => {
  cy.get('[data-cy="message-input"]').should('have.attr', 'placeholder', placeholder);
});

Then('I should see a character counter', () => {
  cy.get('[data-cy="character-counter"]').should('be.visible');
});

Then('the send button should be disabled after 1000 characters', () => {
  cy.get('[data-cy="send-message"]').should('be.disabled');
});

Then('a new line should be added to the message', () => {
  cy.get('[data-cy="message-input"]').should('contain', '\n');
});