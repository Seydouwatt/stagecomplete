import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configure axios interceptor for auth
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('stagecomplete-auth');
  if (authData) {
    const parsed = JSON.parse(authData);
    if (parsed.state?.token) {
      config.headers.Authorization = `Bearer ${parsed.state.token}`;
    }
  }
  return config;
});

export interface Event {
  id: string;
  title?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  status: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED' | 'COMPLETED';
  artistId: string;
  venueId: string;
  artist: {
    id: string;
    profile: {
      name: string;
      avatar?: string;
    };
  };
  venue: {
    id: string;
    profile: {
      name: string;
      avatar?: string;
    };
  };
  messages?: any[];
  createdAt: string;
  updatedAt: string;
}

export const eventService = {
  /**
   * Get all events for the current user (artist or venue)
   */
  async getMyEvents(): Promise<Event[]> {
    const { data } = await api.get('/events');
    return data;
  },

  /**
   * Get a specific event by ID
   */
  async getEventById(eventId: string): Promise<Event> {
    const { data } = await api.get(`/events/${eventId}`);
    return data;
  },

  /**
   * Get events with a specific status
   */
  async getEventsByStatus(status: Event['status']): Promise<Event[]> {
    const { data } = await api.get(`/events?status=${status}`);
    return data;
  },

  /**
   * Update event status
   */
  async updateEventStatus(eventId: string, status: Event['status']): Promise<Event> {
    const { data } = await api.patch(`/events/${eventId}`, { status });
    return data;
  },

  /**
   * Get upcoming events
   */
  async getUpcomingEvents(): Promise<Event[]> {
    const { data } = await api.get('/events/upcoming');
    return data;
  },

  /**
   * Get past events
   */
  async getPastEvents(): Promise<Event[]> {
    const { data } = await api.get('/events/past');
    return data;
  },

  /**
   * Export events to iCal format
   */
  async exportEventsIcal(): Promise<Blob> {
    const { data } = await api.get('/events/export/ical', {
      responseType: 'blob',
    });
    return data;
  },
};