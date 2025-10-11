import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../constants';
import type {
  BookingRequest,
  CreateBookingRequestDto,
  RespondBookingRequestDto,
  BookingRequestStats,
} from '../types/booking-request';

// Configuration axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('stagecomplete-auth');
  if (authData) {
    try {
      const { state } = JSON.parse(authData);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
  }
  return config;
});

export const bookingRequestService = {
  // Créer une booking request (venue only)
  async create(data: CreateBookingRequestDto): Promise<BookingRequest> {
    const response = await api.post(API_ENDPOINTS.BOOKING_REQUESTS.CREATE, data);
    return response.data;
  },

  // Lister les booking requests
  async getAll(status?: string): Promise<BookingRequest[]> {
    const response = await api.get(API_ENDPOINTS.BOOKING_REQUESTS.LIST, {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  // Obtenir une booking request
  async getOne(id: string): Promise<BookingRequest> {
    const response = await api.get(API_ENDPOINTS.BOOKING_REQUESTS.GET_ONE(id));
    return response.data;
  },

  // Répondre à une booking request (accept/decline/cancel)
  async respond(id: string, data: RespondBookingRequestDto): Promise<BookingRequest> {
    const response = await api.put(API_ENDPOINTS.BOOKING_REQUESTS.RESPOND(id), data);
    return response.data;
  },

  // Obtenir les statistiques
  async getStats(): Promise<BookingRequestStats> {
    const response = await api.get(API_ENDPOINTS.BOOKING_REQUESTS.STATS);
    return response.data;
  },
};

export default bookingRequestService;
