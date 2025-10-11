import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';

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

      // Add custom tasks
      on('task', {
        createTestUser({ email, password, type }) {
          console.log(`Creating test user: ${email} (${type})`);
          // In a real implementation, this would create a user in the database
          // For now, just return success
          return { success: true, user: { email, type } };
        },

        // Booking request tasks
        seedBookingRequests({ artistId, count, status }) {
          console.log(`Creating ${count} booking requests with status ${status}`);
          const requests = [];
          for (let i = 1; i <= count; i++) {
            requests.push({
              id: `request-${i}`,
              status: status || 'PENDING',
              eventDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
              eventType: 'CONCERT',
              venue: { profile: { name: `Venue ${i}` } },
              artist: { profile: { name: 'Test Artist' } },
              createdAt: new Date().toISOString(),
            });
          }
          return requests;
        },

        seedPendingRequests({ count }) {
          return this.seedBookingRequests({ count, status: 'PENDING' });
        },

        // Manual bookings tasks
        seedManualBookings({ artistId, count }) {
          console.log(`Creating ${count} manual bookings`);
          const bookings = [];
          for (let i = 1; i <= count; i++) {
            bookings.push({
              id: `manual-booking-${i}`,
              title: `Concert #${i}`,
              date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
              location: `Venue ${i}`,
              status: 'CONFIRMED',
              type: 'manual',
              createdAt: new Date().toISOString(),
            });
          }
          return bookings;
        },

        seedManualBooking({ artistId, date }) {
          console.log(`Creating manual booking on ${date}`);
          return {
            id: 'manual-booking-single',
            title: 'Concert',
            date: date,
            location: 'Test Venue',
            status: 'CONFIRMED',
            type: 'manual',
          };
        },

        // Platform events tasks
        seedPlatformEvents({ artistId, count, status }) {
          console.log(`Creating ${count} platform events with status ${status}`);
          const events = [];
          for (let i = 1; i <= count; i++) {
            events.push({
              id: `platform-event-${i}`,
              title: `Platform Event ${i}`,
              startDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
              status: status || 'CONFIRMED',
              venue: { profile: { name: `Venue ${i}` } },
              artist: { profile: { name: 'Test Artist' } },
              type: 'platform',
              createdAt: new Date().toISOString(),
            });
          }
          return events;
        },

        seedPlatformEvent({ artistId, eventId, status, date }) {
          console.log(`Creating platform event ${eventId} with status ${status}`);
          return {
            id: eventId || 'platform-event-single',
            title: 'Platform Event',
            startDate: date || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
            status: status || 'CONFIRMED',
            venue: { profile: { name: 'Test Venue' } },
            artist: { profile: { name: 'Test Artist' } },
            type: 'platform',
          };
        },

        // Artist data seeding
        seedArtistData({ artistId, data }) {
          console.log(`Seeding artist data:`, data);
          return {
            pendingRequests: data['Demandes en attente'] || 0,
            manualBookings: data['Bookings manuels'] || 0,
            platformBookings: data['Bookings plateforme'] || 0,
            success: true,
          };
        },

        // Messages tasks
        seedConfirmedEvents({ count }) {
          console.log(`Creating ${count} confirmed events`);
          const events = [];
          for (let i = 1; i <= count; i++) {
            events.push({
              id: `event-${i}`,
              title: `Event ${i}`,
              startDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
              status: 'CONFIRMED',
              venue: { profile: { name: `Venue ${i}` } },
            });
          }
          return events;
        },

        seedConfirmedEvent({ eventName, venueName }) {
          console.log(`Creating confirmed event: ${eventName} at ${venueName}`);
          return {
            id: 'event-confirmed',
            title: eventName,
            startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: 'CONFIRMED',
            venue: { profile: { name: venueName } },
          };
        },

        seedMessagesInThread({ count }) {
          console.log(`Creating ${count} messages in thread`);
          const messages = [];
          for (let i = 1; i <= count; i++) {
            messages.push({
              id: `message-${i}`,
              content: `Message ${i}`,
              createdAt: new Date(Date.now() - (count - i) * 60000).toISOString(),
              sender: i % 2 === 0 ? 'artist' : 'venue',
            });
          }
          return messages;
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

        // Helper for registering artist
        registerArtist(artist) {
          console.log(`Registering artist: ${artist.email}`);
          return { success: true, artist };
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