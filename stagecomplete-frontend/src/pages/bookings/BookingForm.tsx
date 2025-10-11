import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import {
  createBooking,
  updateBooking,
  getBooking,
} from '../../services/bookingService';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';

const bookingSchema = z.object({
  title: z.string().min(3, 'Titre requis (min 3 caractères)'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date requise'),
  endDate: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  duration: z.coerce.number().optional(),
  budget: z.coerce.number().optional(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional().default('CONFIRMED'),
  eventType: z.string().min(1, 'Type d\'événement requis'),
  notes: z.string().optional(),
  tags: z.string().optional(), // Géré comme string puis splitté
});

export const BookingForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  // Charger le booking si édition
  const { data: existingBooking } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBooking(token!, id!),
    enabled: !!token && isEditing,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      status: 'CONFIRMED',
      eventType: 'CONCERT',
    },
  });

  // Remplir le formulaire si édition
  useEffect(() => {
    if (existingBooking) {
      reset({
        title: existingBooking.title,
        description: existingBooking.description || '',
        date: existingBooking.date ? new Date(existingBooking.date).toISOString().slice(0, 16) : '',
        endDate: existingBooking.endDate ? new Date(existingBooking.endDate).toISOString().slice(0, 16) : '',
        location: existingBooking.location || '',
        address: existingBooking.address || '',
        duration: existingBooking.duration,
        budget: existingBooking.budget,
        status: existingBooking.status as any,
        eventType: existingBooking.eventType,
        notes: existingBooking.notes || '',
        tags: existingBooking.tags ? existingBooking.tags.join(', ') : '',
      });
    }
  }, [existingBooking, reset]);

  const createMutation = useMutation({
    mutationFn: (data: any) => createBooking(token!, data),
    onSuccess: async () => {
      // Invalider et attendre que les queries soient rafraîchies
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['booking-stats'] });
      // Petit délai pour s'assurer que React Query a traité les invalidations
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate('/artist/bookings');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateBooking(token!, id!, data),
    onSuccess: async () => {
      // Invalider et attendre que les queries soient rafraîchies
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['booking', id] });
      await queryClient.invalidateQueries({ queryKey: ['booking-stats'] });
      // Petit délai pour s'assurer que React Query a traité les invalidations
      await new Promise(resolve => setTimeout(resolve, 100));
      navigate('/artist/bookings');
    },
  });

  const onSubmit = (data: any) => {
    const bookingData: any = {
      ...data,
      // Convert datetime-local format to ISO string with seconds
      date: data.date ? new Date(data.date).toISOString() : data.date,
      tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    };

    // Only add endDate if it has a value
    if (data.endDate && data.endDate !== '') {
      bookingData.endDate = new Date(data.endDate).toISOString();
    }

    if (isEditing) {
      updateMutation.mutate(bookingData);
    } else {
      createMutation.mutate(bookingData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isEditing ? '✏️ Modifier' : '➕ Créer'} un Booking
        </h1>
        <p className="text-base-content/70 mt-1">
          {isEditing ? 'Modifiez les détails de votre booking' : 'Ajoutez un nouveau booking à votre calendrier'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body space-y-6">
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Titre *</span>
            </label>
            <input
              {...register('title')}
              type="text"
              className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
              placeholder="Ex: Concert au Jazz Club Paris"
            />
            {errors.title && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.title.message}</span>
              </label>
            )}
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              {...register('description')}
              className="textarea textarea-bordered h-24"
              placeholder="Détails de l'événement..."
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Date et heure de début *</span>
              </label>
              <input
                {...register('date')}
                type="datetime-local"
                className={`input input-bordered ${errors.date ? 'input-error' : ''}`}
              />
              {errors.date && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.date.message}</span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Date et heure de fin</span>
              </label>
              <input
                {...register('endDate')}
                type="datetime-local"
                className="input input-bordered"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Lieu</span>
              </label>
              <input
                {...register('location')}
                type="text"
                className="input input-bordered"
                placeholder="Nom de la venue"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Adresse</span>
              </label>
              <input
                {...register('address')}
                type="text"
                className="input input-bordered"
                placeholder="Adresse complète"
              />
            </div>
          </div>

          {/* Event Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <option value="REHEARSAL">Répétition</option>
                <option value="STUDIO">Session studio</option>
                <option value="OTHER">Autre</option>
              </select>
              {errors.eventType && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.eventType.message}</span>
                </label>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Statut</span>
              </label>
              <select {...register('status')} className="select select-bordered">
                <option value="CONFIRMED">✅ Confirmé</option>
                <option value="PENDING">⏳ En attente</option>
                <option value="ACCEPTED">👍 Accepté</option>
                <option value="REJECTED">❌ Refusé</option>
                <option value="CANCELLED">🚫 Annulé</option>
                <option value="COMPLETED">✔️ Terminé</option>
              </select>
            </div>
          </div>

          {/* Duration & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Durée (minutes)</span>
              </label>
              <input
                {...register('duration')}
                type="number"
                className="input input-bordered"
                placeholder="120"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Cachet (€)</span>
              </label>
              <input
                {...register('budget')}
                type="number"
                step="0.01"
                className="input input-bordered"
                placeholder="500.00"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Tags</span>
              <span className="label-text-alt">Séparez par des virgules</span>
            </label>
            <input
              {...register('tags')}
              type="text"
              className="input input-bordered"
              placeholder="acoustique, jazz, trio"
            />
          </div>

          {/* Notes */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Notes privées</span>
            </label>
            <textarea
              {...register('notes')}
              className="textarea textarea-bordered h-24"
              placeholder="Notes personnelles, rider technique, contacts..."
            />
          </div>

          {/* Actions */}
          <div className="card-actions justify-end pt-4 border-t border-base-300">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/artist/bookings')}
              disabled={isPending}
            >
              <X className="w-4 h-4" />
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isPending ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
