import axios from 'axios';
import { API_URL } from '../constants';

export interface Booking {
  id: string;
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  location?: string;
  address?: string;
  duration?: number;
  budget?: number;
  status: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED' | 'COMPLETED';
  eventType: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  title: string;
  description?: string;
  date: string;
  endDate?: string;
  location?: string;
  address?: string;
  duration?: number;
  budget?: number;
  status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED' | 'COMPLETED';
  eventType: string;
  notes?: string;
  tags?: string[];
}

export interface BookingFilters {
  status?: string;
  fromDate?: string;
  toDate?: string;
  eventType?: string;
}

export interface BookingStats {
  total: number;
  upcoming: number;
  thisMonth: number;
  totalRevenue: number;
}

export const getBookings = async (
  token: string,
  filters?: BookingFilters,
): Promise<Booking[]> => {
  const response = await axios.get(`${API_URL}/bookings`, {
    headers: { Authorization: `Bearer ${token}` },
    params: filters,
  });
  return response.data;
};

export const getBooking = async (token: string, id: string): Promise<Booking> => {
  const response = await axios.get(`${API_URL}/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getBookingStats = async (token: string): Promise<BookingStats> => {
  const response = await axios.get(`${API_URL}/bookings/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMonthlyBookings = async (
  token: string,
  year: number,
  month: number,
): Promise<Booking[]> => {
  const response = await axios.get(`${API_URL}/bookings/calendar/${year}/${month}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createBooking = async (
  token: string,
  data: CreateBookingData,
): Promise<Booking> => {
  const response = await axios.post(`${API_URL}/bookings`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateBooking = async (
  token: string,
  id: string,
  data: Partial<CreateBookingData>,
): Promise<Booking> => {
  const response = await axios.put(`${API_URL}/bookings/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteBooking = async (token: string, id: string): Promise<void> => {
  await axios.delete(`${API_URL}/bookings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const exportBookingsIcal = async (token: string): Promise<Blob> => {
  const response = await axios.get(`${API_URL}/bookings/export/ical`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });
  return response.data;
};
