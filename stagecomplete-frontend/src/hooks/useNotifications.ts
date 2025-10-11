import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../types/notification';
import { toast } from '../stores/useToastStore';

/**
 * Hook pour récupérer les notifications
 */
export const useNotifications = (isRead?: boolean) => {
  const { data, isLoading, error, refetch } = useQuery<Notification[]>({
    queryKey: ['notifications', isRead],
    queryFn: () => notificationService.getAll(isRead),
    refetchInterval: 15000, // Poll toutes les 15 secondes
    staleTime: 0,
  });

  return {
    notifications: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook pour le compteur de notifications non lues
 */
export const useUnreadNotificationsCount = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 10000, // Poll toutes les 10 secondes
    staleTime: 0,
  });

  return {
    count: data?.count || 0,
    isLoading,
  };
};

/**
 * Hook pour marquer une notification comme lue
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
    onError: (error: any) => {
      console.error('Error marking notification as read:', error);
    },
  });
};

/**
 * Hook pour marquer toutes les notifications comme lues
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('Toutes les notifications ont été marquées comme lues');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
};

/**
 * Hook pour supprimer une notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast.success('Notification supprimée');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });
};
