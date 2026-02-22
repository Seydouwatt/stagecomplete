import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { toast } from '../../stores/useToastStore';
import { X, Calendar, Clock, DollarSign, MessageSquare, Send } from 'lucide-react';

const bookingRequestSchema = z.object({
  eventDate: z.string().min(1, 'Date requise'),
  eventType: z.string().min(1, 'Type d\'événement requis'),
  duration: z.coerce.number().min(30, 'Durée minimale: 30 minutes').optional(),
  budget: z.coerce.number().min(0, 'Budget doit être positif').optional(),
  message: z.string().optional(),
});

type BookingRequestFormData = z.infer<typeof bookingRequestSchema>;

interface BookingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistId: string;
  artistName: string;
  artistAvatar?: string;
}

export const BookingRequestModal: React.FC<BookingRequestModalProps> = ({
  isOpen,
  onClose,
  artistId,
  artistName,
  artistAvatar,
}) => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(bookingRequestSchema) as any,
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: BookingRequestFormData) => {
      const response = await fetch('http://localhost:3000/api/booking-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          artistId,
          eventDate: new Date(data.eventDate).toISOString(),
          eventType: data.eventType,
          duration: data.duration,
          budget: data.budget,
          message: data.message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la création de la demande');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
      queryClient.invalidateQueries({ queryKey: ['messages', 'conversations'] });

      // Afficher un message de succès
      toast.success(`Demande envoyée à ${artistName} ! Vous pouvez maintenant discuter dans la messagerie.`);

      // Réinitialiser le formulaire et fermer
      reset();
      onClose();

      // Naviguer vers la page messages après un court délai
      setTimeout(() => {
        navigate('/messages');
      }, 500);
    },
  });

  const onSubmit = (data: BookingRequestFormData) => {
    createRequestMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {artistAvatar && (
              <img
                src={artistAvatar}
                alt={artistName}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="text-2xl font-bold">Demander un booking</h3>
              <p className="text-base-content/70">avec {artistName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            disabled={createRequestMutation.isPending}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Date & Time */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date et heure de l'événement *
              </span>
            </label>
            <input
              {...register('eventDate')}
              type="datetime-local"
              className={`input input-bordered ${errors.eventDate ? 'input-error' : ''}`}
            />
            {errors.eventDate && (
              <label className="label">
                <span className="label-text-alt text-error">{String(errors.eventDate.message)}</span>
              </label>
            )}
          </div>

          {/* Event Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Type d'événement *</span>
            </label>
            <select
              {...register('eventType')}
              className={`select select-bordered ${errors.eventType ? 'select-error' : ''}`}
            >
              <option value="">Sélectionner...</option>
              <option value="CONCERT">Concert</option>
              <option value="THEATER">Théâtre</option>
              <option value="COMEDY">Comédie</option>
              <option value="FESTIVAL">Festival</option>
              <option value="PRIVATE">Événement privé</option>
              <option value="CORPORATE">Événement corporate</option>
              <option value="WEDDING">Mariage</option>
              <option value="OTHER">Autre</option>
            </select>
            {errors.eventType && (
              <label className="label">
                <span className="label-text-alt text-error">{String(errors.eventType.message)}</span>
              </label>
            )}
          </div>

          {/* Duration & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Durée (minutes)
                </span>
              </label>
              <input
                {...register('duration')}
                type="number"
                min="30"
                step="15"
                className="input input-bordered"
                placeholder="Ex: 120"
              />
              {errors.duration && (
                <label className="label">
                  <span className="label-text-alt text-error">{String(errors.duration.message)}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget proposé (€)
                </span>
              </label>
              <input
                {...register('budget')}
                type="number"
                min="0"
                step="50"
                className="input input-bordered"
                placeholder="Ex: 500"
              />
              {errors.budget && (
                <label className="label">
                  <span className="label-text-alt text-error">{String(errors.budget.message)}</span>
                </label>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message pour l'artiste
              </span>
            </label>
            <textarea
              {...register('message')}
              className="textarea textarea-bordered h-24"
              placeholder="Décrivez votre événement, vos attentes..."
            />
          </div>

          {/* Error message */}
          {createRequestMutation.isError && (
            <div className="alert alert-error">
              <span>{(createRequestMutation.error as Error).message}</span>
            </div>
          )}

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={createRequestMutation.isPending}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createRequestMutation.isPending}
            >
              {createRequestMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Envoi...
                </>
              ) : (
                'Envoyer la demande'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
