import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../constants';
import type { Message, CreateMessageDto, MessageUnreadCount, Conversation } from '../types/message';

// Configuration axios (réutilise la config de authService)
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

export const messageService = {
  // Créer un message
  async create(data: CreateMessageDto): Promise<Message> {
    const response = await api.post(API_ENDPOINTS.MESSAGES.CREATE, data);
    return response.data;
  },

  // Lister les messages d'un event
  async getByEvent(eventId: string): Promise<Message[]> {
    const response = await api.get(API_ENDPOINTS.MESSAGES.LIST, {
      params: { eventId },
    });
    return response.data;
  },

  // Marquer comme lu
  async markAsRead(messageId: string): Promise<Message> {
    const response = await api.put(API_ENDPOINTS.MESSAGES.MARK_READ(messageId));
    return response.data;
  },

  // Obtenir le nombre de messages non lus
  async getUnreadCount(): Promise<MessageUnreadCount> {
    const response = await api.get(API_ENDPOINTS.MESSAGES.UNREAD_COUNT);
    return response.data;
  },

  // Obtenir toutes les conversations (events avec messages)
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
    return response.data;
  },
};

export default messageService;
