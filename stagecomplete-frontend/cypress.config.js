import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';

// Import API helpers for database operations
import * as apiHelpers from './cypress/support/api-helpers.js';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.{cy.js,cy.ts,feature}',
    async setupNodeEvents(on, config) {
      // Add Cucumber preprocessor plugin
      await addCucumberPreprocessorPlugin(on, config);

      // Configure esbuild bundler with Cucumber plugin
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // Add custom tasks with real database operations
      on('task', {
        async createTestUser({ email, password, type }) {
          console.log(`Creating real test user: ${email || 'auto-generated'} (${type})`);
          const user = await apiHelpers.createTestUser(type);
          return user || { success: false };
        },

        // Booking request tasks - now using real API
        async seedBookingRequests({ artistToken, count, status }) {
          console.log(`🔍 DEBUG seedBookingRequests: artistToken = ${artistToken ? 'EXISTS (' + artistToken.substring(0, 30) + '...)' : '❌ UNDEFINED'}`);
          console.log(`Creating ${count} real booking requests with status ${status}`);
          // If no token provided, create a test artist first
          let token = artistToken;
          if (!token) {
            console.log('⚠️ No artistToken provided, creating new test artist...');
            const artist = await apiHelpers.createTestUser('ARTIST');
            token = artist?.token;
          }
          if (!token) return [];

          const requests = await apiHelpers.createBookingRequests(token, count, status);
          return requests;
        },

        async seedPendingRequests({ count }) {
          return this.seedBookingRequests({ count, status: 'PENDING' });
        },

        // Manual bookings tasks - now using real API
        async seedManualBookings({ artistToken, count }) {
          console.log(`🔍 DEBUG seedManualBookings: artistToken = ${artistToken ? 'EXISTS (' + artistToken.substring(0, 30) + '...)' : '❌ UNDEFINED'}`);
          console.log(`Creating ${count} real manual bookings in database`);
          // If no token provided, create a test artist first
          let token = artistToken;
          if (!token) {
            console.log('⚠️ No artistToken provided, creating new test artist...');
            const artist = await apiHelpers.createTestUser('ARTIST');
            token = artist?.token;
          }
          if (!token) return [];

          const bookings = await apiHelpers.createManualBookings(token, count);
          return bookings;
        },

        async seedManualBooking({ artistToken, date }) {
          console.log(`Creating real manual booking on ${date} in database`);
          // If no token provided, create a test artist first
          let token = artistToken;
          if (!token) {
            const artist = await apiHelpers.createTestUser('ARTIST');
            token = artist?.token;
          }
          if (!token) return null;

          const bookingData = {
            title: 'Concert',
            date: date,
            eventType: 'CONCERT',  // Required field
            location: 'Test Venue',
            description: 'Test booking for E2E',
            status: 'CONFIRMED',
            budget: 500
          };

          const response = await apiHelpers.makeAuthRequest('POST', '/bookings', token, bookingData);
          return response;
        },

        // Platform events tasks - now using real API (by accepting booking requests)
        async seedPlatformEvents({ artistToken, count, status }) {
          console.log(`Creating ${count} real platform events in database`);
          // If no token provided, create a test artist first
          let token = artistToken;
          if (!token) {
            const artist = await apiHelpers.createTestUser('ARTIST');
            token = artist?.token;
          }
          if (!token) return [];

          const events = await apiHelpers.createPlatformEvents(token, count);
          return events;
        },

        async seedPlatformEvent({ artistToken, eventId, status, date }) {
          console.log(`Creating real platform event ${eventId || 'with date ' + date} with status ${status} in database`);
          // If no token provided, create a test artist first
          let token = artistToken;
          if (!token) {
            const artist = await apiHelpers.createTestUser('ARTIST');
            token = artist?.token;
          }
          if (!token) return null;

          // Create a platform event by accepting a booking request
          // If date is provided, use createPlatformEventWithDate, otherwise use createPlatformEvents
          if (date) {
            const event = await apiHelpers.createPlatformEventWithDate(token, date);
            return event;
          } else {
            const events = await apiHelpers.createPlatformEvents(token, 1);
            return events[0] || null;
          }
        },

        // Artist data seeding - now returns real data from database
        async seedArtistData({ artistToken, data }) {
          console.log(`Setting up real artist data in database:`, data);
          // If no token provided, create a test artist first
          let token = artistToken;
          if (!token) {
            const artist = await apiHelpers.createTestUser('ARTIST');
            token = artist?.token;
          }
          if (!token) return { success: false };

          // Create the requested data
          const promises = [];

          if (data['Demandes en attente']) {
            promises.push(apiHelpers.createBookingRequests(token, data['Demandes en attente'], 'PENDING'));
          }
          if (data['Bookings manuels']) {
            promises.push(apiHelpers.createManualBookings(token, data['Bookings manuels']));
          }
          if (data['Bookings plateforme']) {
            promises.push(apiHelpers.createPlatformEvents(token, data['Bookings plateforme']));
          }

          await Promise.all(promises);

          return {
            pendingRequests: data['Demandes en attente'] || 0,
            manualBookings: data['Bookings manuels'] || 0,
            platformBookings: data['Bookings plateforme'] || 0,
            success: true,
          };
        },

        // Messages tasks - now using real database
        async seedConfirmedEvents({ artistToken, count }) {
          console.log(`Creating ${count} real confirmed events in database`);
          // If no token provided, create a test artist first
          let token = artistToken;
          if (!token) {
            const artist = await apiHelpers.createTestUser('ARTIST');
            token = artist?.token;
          }
          if (!token) return [];

          // Create platform events which are confirmed by default
          const events = await apiHelpers.createPlatformEvents(token, count);
          return events;
        },

        async seedConfirmedEvent({ artistToken, eventName, venueName }) {
          console.log(`Creating real confirmed event: ${eventName} at ${venueName} in database`);
          // If no token provided, create a test artist first
          let token = artistToken;
          if (!token) {
            const artist = await apiHelpers.createTestUser('ARTIST');
            token = artist?.token;
          }
          if (!token) return null;

          // Create a confirmed platform event
          const events = await apiHelpers.createPlatformEvents(token, 1);
          if (events[0]) {
            events[0].title = eventName;
            // Note: venue name would be set during the booking request creation
          }
          return events[0] || null;
        },

        async seedMessagesInThread({ eventId, token, count }) {
          console.log(`Creating ${count} real messages in thread for event ${eventId}`);
          if (!token || !eventId) return [];

          const messages = [];
          for (let i = 1; i <= count; i++) {
            messages.push({
              content: `Message ${i}`,
              sentAt: new Date(Date.now() - (count - i) * 60000).toISOString()
            });
          }

          const createdMessages = await apiHelpers.createMessages(eventId, token, messages);
          return createdMessages;
        },

        seedVenueEvents({ count }) {
          console.log(`Creating ${count} venue events`);
          const events = [];
          for (let i = 1; i <= count; i++) {
            events.push({
              id: `venue-event-${i}`,
              title: `Venue Event ${i}`,
              startDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
              status: 'CONFIRMED',
              artist: { profile: { name: `Artist ${i}` } },
            });
          }
          return events;
        },

        seedEventsWithStatuses({ events }) {
          console.log('Creating events with statuses:', events);
          return events.map((event, i) => ({
            id: `status-event-${i}`,
            title: event.name,
            status: event.status,
            startDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
            venue: { profile: { name: 'Test Venue' } },
          }));
        },

        seedUnreadMessages({ eventName, count }) {
          console.log(`Creating ${count} unread messages for ${eventName}`);
          return Array.from({ length: count }, (_, i) => ({
            id: `unread-${i}`,
            content: `Unread message ${i + 1}`,
            read: false,
            eventName,
          }));
        },

        seedArtistWithConversations({ count }) {
          console.log(`Creating artist with ${count} conversations`);
          return {
            artist: { email: 'artist@test.com', password: 'Test123!' },
            conversations: Array.from({ length: count }, (_, i) => ({
              id: `conversation-${i}`,
              eventName: `Event ${i + 1}`,
              venueName: `Venue ${i + 1}`,
            })),
          };
        },

        // Workflow tasks
        seedActiveConversation() {
          console.log('Setting up active conversation');
          return {
            artist: { email: 'artist@test.com', password: 'Test123!' },
            venue: { email: 'venue@test.com', password: 'Test123!' },
            eventId: 'active-event',
            conversationId: 'active-conversation',
          };
        },

        createOldBookingRequest({ date }) {
          console.log(`Creating old booking request from ${date}`);
          return {
            id: 'old-request',
            createdAt: date,
            status: 'EXPIRED',
            eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          };
        },

        simulateIncomingMessage({ message, from }) {
          console.log(`Simulating message: "${message}" from ${from}`);
          // This would typically trigger a WebSocket event or API call
          return { success: true, message, from };
        },

        sendMessage({ from, message }) {
          console.log(`Sending message: "${message}" from ${from}`);
          return { success: true, message, from };
        },

        // Cleanup task
        cleanupTestData() {
          console.log('Cleaning up test data');
          // In a real implementation, this would clean the database
          return { success: true };
        },

        // Helper for registering artist - now using real API
        async registerArtist(artistData) {
          console.log(`Registering real artist: ${artistData.email} in database`);
          const result = await apiHelpers.createTestUser('ARTIST');
          if (result) {
            // Update with custom data if provided
            if (artistData.name && result.token) {
              await apiHelpers.completeArtistProfile(result.token);
            }
          }
          return result || { success: false };
        }
      });

      return config;
    },
    supportFile: 'cypress/support/e2e.js',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
  env: {
    apiUrl: 'http://localhost:3000/api',
  },
});