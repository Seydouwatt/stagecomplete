import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '../services/messageService';
import type { Message, CreateMessageDto } from '../types/message';
import { toast } from '../stores/useToastStore';

/**
 * Hook pour récupérer les messages d'un event
 */
export const useMessages = (eventId: string | null) => {
  const { data, isLoading, error, refetch } = useQuery<Message[]>({
    queryKey: ['messages', eventId],
    queryFn: () => messageService.getByEvent(eventId!),
    enabled: !!eventId,
    refetchInterval: 5000, // Poll toutes les 5 secondes pour nouveaux messages
    staleTime: 0, // Toujours considérer comme stale
  });

  return {
    messages: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook pour créer un message
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMessageDto) => messageService.create(data),
    onSuccess: (newMessage) => {
      // Invalider et refetch les messages de l'event
      queryClient.invalidateQueries({ queryKey: ['messages', newMessage.eventId] });
      // Invalider le compteur de non-lus
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread-count'] });
      toast.success('Message envoyé');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi du message');
    },
  });
};

/**
 * Hook pour marquer un message comme lu
 */
export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => messageService.markAsRead(messageId),
    onSuccess: (updatedMessage) => {
      // Invalider les messages de l'event
      queryClient.invalidateQueries({ queryKey: ['messages', updatedMessage.eventId] });
      // Invalider le compteur de non-lus
      queryClient.invalidateQueries({ queryKey: ['messages', 'unread-count'] });
    },
    onError: (error: any) => {
      console.error('Error marking message as read:', error);
    },
  });
};

/**
 * Hook pour le compteur de messages non lus
 */
export const useUnreadMessagesCount = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['messages', 'unread-count'],
    queryFn: () => messageService.getUnreadCount(),
    refetchInterval: 10000, // Poll toutes les 10 secondes
    staleTime: 0,
  });

  return {
    count: data?.count || 0,
    byEvent: data?.byEvent || {},
    isLoading,
  };
};
