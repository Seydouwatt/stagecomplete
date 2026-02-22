import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingRequestService } from '../services/bookingRequestService';
import type {
  BookingRequest,
  CreateBookingRequestDto,
  UpdateBookingRequestDto,
  RespondBookingRequestDto,
} from '../types/booking-request';
import { toast } from '../stores/useToastStore';

/**
 * Hook pour récupérer toutes les booking requests
 */
export const useBookingRequests = (status?: string) => {
  const { data, isLoading, error, refetch } = useQuery<BookingRequest[]>({
    queryKey: ['booking-requests', status],
    queryFn: () => bookingRequestService.getAll(status),
    staleTime: 30000, // Cache 30 secondes
  });

  return {
    requests: data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook pour récupérer une booking request
 */
export const useBookingRequest = (id: string | null) => {
  const { data, isLoading, error } = useQuery<BookingRequest>({
    queryKey: ['booking-request', id],
    queryFn: () => bookingRequestService.getOne(id!),
    enabled: !!id,
  });

  return {
    request: data,
    isLoading,
    error,
  };
};

/**
 * Hook pour créer une booking request (venue)
 */
export const useCreateBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequestDto) => bookingRequestService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
      queryClient.invalidateQueries({ queryKey: ['booking-requests', 'stats'] });
      toast.success('Demande de réservation envoyée');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création de la demande');
    },
  });
};

/**
 * Hook pour modifier une booking request (venue)
 */
export const useUpdateBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookingRequestDto }) =>
      bookingRequestService.update(id, data),
    onSuccess: (_updatedRequest, variables) => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
      queryClient.invalidateQueries({ queryKey: ['booking-request', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['booking-requests', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['messages/conversations'] });
      toast.success('Demande modifiée et renvoyée');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    },
  });
};

/**
 * Hook pour répondre à une booking request (accept/decline/cancel)
 */
export const useRespondToBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RespondBookingRequestDto }) =>
      bookingRequestService.respond(id, data),
    onSuccess: (_updatedRequest, variables) => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
      queryClient.invalidateQueries({ queryKey: ['booking-request', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['booking-requests', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });

      const action = variables.data.action;
      if (action === 'accept') {
        toast.success('Demande acceptée ! L\'événement a été créé.');
      } else if (action === 'decline') {
        toast.success('Demande déclinée');
      } else if (action === 'cancel') {
        toast.success('Demande annulée');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la réponse à la demande');
    },
  });
};

/**
 * Hook pour les statistiques de booking requests
 */
export const useBookingRequestStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['booking-requests', 'stats'],
    queryFn: () => bookingRequestService.getStats(),
    staleTime: 60000, // Cache 1 minute
  });

  return {
    stats: data || { pending: 0, accepted: 0, declined: 0 },
    isLoading,
  };
};
