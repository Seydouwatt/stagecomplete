// API Helpers for Cypress tests using local database
const API_URL = 'http://localhost:3000/api';

// Helper to make authenticated requests
export async function makeAuthRequest(method, endpoint, token, data = null) {
  const options = {
    method,
    url: `${API_URL}${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(options.url, {
    method: options.method,
    headers: options.headers,
    body: options.body
  });

  if (!response.ok && response.status !== 409) {
    const text = await response.text();
    console.error(`API Error: ${response.status} - ${text}`);
  }

  return response.json().catch(() => null);
}

// Create a test user (artist or venue)
export async function createTestUser(type = 'ARTIST') {
  const timestamp = Date.now();
  const email = `test-${type.toLowerCase()}-${timestamp}@test.com`;
  const userData = {
    email,
    password: 'Test123!',
    name: `Test ${type} ${timestamp}`,
    role: type
  };

  try {
    // Register user
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!registerResponse.ok && registerResponse.status !== 409) {
      // User might already exist, try to login
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        return {
          user: loginData.user,
          token: loginData.access_token,
          email: userData.email,
          password: userData.password
        };
      }
    }

    const registerData = await registerResponse.json();

    // Login to get token
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password
      })
    });

    const loginData = await loginResponse.json();

    return {
      user: loginData.user,
      token: loginData.access_token,
      email: userData.email,
      password: userData.password
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    return null;
  }
}

// Create booking requests
export async function createBookingRequests(artistToken, count = 3, status = 'PENDING') {
  const requests = [];

  // First create a venue user
  const venue = await createTestUser('VENUE');
  if (!venue) return [];

  for (let i = 0; i < count; i++) {
    const requestData = {
      artistId: null, // Will be set from token
      eventDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
      eventType: 'CONCERT',
      duration: 120,
      budget: 500 + (i * 100),
      message: `Test booking request ${i + 1}`,
      status
    };

    try {
      const response = await makeAuthRequest('POST', '/booking-requests', venue.token, requestData);
      if (response) {
        requests.push(response);
      }
    } catch (error) {
      console.error(`Error creating booking request ${i + 1}:`, error);
    }
  }

  return requests;
}

// Create manual bookings
export async function createManualBookings(artistToken, count = 2) {
  const bookings = [];

  for (let i = 0; i < count; i++) {
    const bookingData = {
      title: `Manual Booking ${i + 1}`,
      date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
      location: `Venue ${i + 1}`,
      description: `Description for manual booking ${i + 1}`,
      status: 'CONFIRMED',
      price: 300 + (i * 50)
    };

    try {
      const response = await makeAuthRequest('POST', '/bookings', artistToken, bookingData);
      if (response) {
        bookings.push(response);
      }
    } catch (error) {
      console.error(`Error creating manual booking ${i + 1}:`, error);
    }
  }

  return bookings;
}

// Accept a booking request to create a platform event
export async function acceptBookingRequest(requestId, artistToken, message = 'Accepted!') {
  try {
    const response = await makeAuthRequest('POST', `/booking-requests/${requestId}/respond`, artistToken, {
      action: 'accept',
      reason: message
    });
    return response;
  } catch (error) {
    console.error('Error accepting booking request:', error);
    return null;
  }
}

// Create platform events (by accepting booking requests)
export async function createPlatformEvents(artistToken, count = 1) {
  const events = [];

  // First create booking requests
  const requests = await createBookingRequests(artistToken, count, 'PENDING');

  // Then accept them to create events
  for (const request of requests) {
    const event = await acceptBookingRequest(request.id, artistToken);
    if (event) {
      events.push(event);
    }
  }

  return events;
}

// Get artist's events
export async function getArtistEvents(artistToken) {
  try {
    const response = await makeAuthRequest('GET', '/events', artistToken);
    return response || [];
  } catch (error) {
    console.error('Error getting artist events:', error);
    return [];
  }
}

// Get artist's bookings
export async function getArtistBookings(artistToken) {
  try {
    const response = await makeAuthRequest('GET', '/bookings', artistToken);
    return response || [];
  } catch (error) {
    console.error('Error getting artist bookings:', error);
    return [];
  }
}

// Get artist's booking requests
export async function getArtistBookingRequests(artistToken) {
  try {
    const response = await makeAuthRequest('GET', '/booking-requests', artistToken);
    return response || [];
  } catch (error) {
    console.error('Error getting booking requests:', error);
    return [];
  }
}

// Clean up test data (optional - for test isolation)
export async function cleanupTestData(token) {
  // This would delete test data if we have endpoints for that
  // For now, we'll just log
  console.log('Test cleanup would happen here');
  return { success: true };
}

// Helper to login existing user
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        user: data.user,
        token: data.access_token
      };
    }
  } catch (error) {
    console.error('Error logging in:', error);
  }
  return null;
}

// Create messages for an event
export async function createMessages(eventId, token, messages) {
  const createdMessages = [];

  for (const message of messages) {
    try {
      const response = await makeAuthRequest('POST', `/events/${eventId}/messages`, token, {
        content: message.content || `Message ${Date.now()}`,
        sentAt: message.sentAt || new Date().toISOString()
      });
      if (response) {
        createdMessages.push(response);
      }
    } catch (error) {
      console.error('Error creating message:', error);
    }
  }

  return createdMessages;
}

// Update artist profile to be complete
export async function completeArtistProfile(artistToken) {
  const profileData = {
    bio: "Test artist bio for E2E testing",
    genres: ["Jazz", "Blues"],
    instruments: ["Guitare", "Piano"],
    experienceYears: 5,
    performanceTypes: ["CONCERT", "PRIVATE_EVENT"],
    pricing: {
      basePrice: 500,
      currency: "EUR",
      additionalInfo: "Négociable selon la distance"
    },
    socialLinks: {
      instagram: "https://instagram.com/testartist",
      youtube: "https://youtube.com/testartist"
    },
    photos: [],
    videos: []
  };

  try {
    const response = await makeAuthRequest('PUT', '/artist/profile', artistToken, profileData);
    return response;
  } catch (error) {
    console.error('Error updating artist profile:', error);
    return null;
  }
}

export default {
  createTestUser,
  createBookingRequests,
  createManualBookings,
  createPlatformEvents,
  acceptBookingRequest,
  getArtistEvents,
  getArtistBookings,
  getArtistBookingRequests,
  cleanupTestData,
  loginUser,
  createMessages,
  completeArtistProfile
};