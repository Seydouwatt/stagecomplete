import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../constants';
import type { Notification, NotificationUnreadCount } from '../types/notification';

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

export const notificationService = {
  // Lister les notifications
  async getAll(isRead?: boolean): Promise<Notification[]> {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.LIST, {
      params: isRead !== undefined ? { isRead } : undefined,
    });
    return response.data;
  },

  // Obtenir le nombre de notifications non lues
  async getUnreadCount(): Promise<NotificationUnreadCount> {
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return response.data;
  },

  // Marquer une notification comme lue
  async markAsRead(id: string): Promise<Notification> {
    const response = await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    return response.data;
  },

  // Marquer toutes les notifications comme lues
  async markAllAsRead(): Promise<void> {
    await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },

  // Supprimer une notification
  async delete(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
  },
};

export default notificationService;
