import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBookingRequest, useUpdateBookingRequest, useRespondToBookingRequest } from '../hooks/useBookingRequests';
import { ChevronLeft, Calendar, Clock, DollarSign, MessageSquare, Save, Trash2 } from 'lucide-react';

const editSchema = z.object({
  eventDate: z.string().min(1, 'Date requise'),
  eventType: z.string().min(1, 'Type requis'),
  duration: z.coerce.number().min(30, 'Min 30 minutes').optional().or(z.literal('')),
  budget: z.coerce.number().min(0, 'Budget positif').optional().or(z.literal('')),
  message: z.string().optional(),
});

type EditFormData = z.infer<typeof editSchema>;

export const BookingRequestEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { request, isLoading } = useBookingRequest(id || null);
  const updateMutation = useUpdateBookingRequest();
  const cancelMutation = useRespondToBookingRequest();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(editSchema) as any,
  });

  useEffect(() => {
    if (request) {
      const date = new Date(request.eventDate);
      const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      reset({
        eventDate: local,
        eventType: request.eventType,
        duration: request.duration || '',
        budget: request.budget || '',
        message: request.message || '',
      });
    }
  }, [request, reset]);

  const onSubmit = (data: EditFormData) => {
    if (!id) return;
    updateMutation.mutate(
      {
        id,
        data: {
          eventDate: new Date(data.eventDate).toISOString(),
          eventType: data.eventType,
          duration: data.duration ? Number(data.duration) : undefined,
          budget: data.budget ? Number(data.budget) : undefined,
          message: data.message,
        },
      },
      {
        onSuccess: () => {
          navigate('/messages');
        },
      },
    );
  };

  const handleCancel = () => {
    if (!id || !confirm('Annuler cette demande de booking ?')) return;
    cancelMutation.mutate(
      { id, data: { action: 'cancel' } },
      { onSuccess: () => navigate('/venue/booking-requests') },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-base-content/70">Demande introuvable</p>
        <Link to="/venue/booking-requests" className="btn btn-ghost mt-4">
          Retour
        </Link>
      </div>
    );
  }

  const canEdit = ['PENDING', 'VIEWED', 'DECLINED'].includes(request.status);
  const canCancel = ['PENDING', 'VIEWED'].includes(request.status);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm btn-square">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Modifier la demande</h1>
          <p className="text-base-content/70">
            pour {request.artist.profile.name}
          </p>
        </div>
      </div>

      {/* Status info */}
      {request.status === 'DECLINED' && (
        <div className="alert alert-warning">
          Cette demande a ete declinee. Modifiez-la et renvoyez pour relancer la discussion.
        </div>
      )}

      {!canEdit && (
        <div className="alert alert-info">
          Cette demande ne peut plus etre modifiee (statut: {request.status}).
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-100 border border-base-300">
        <div className="card-body space-y-4">
          {/* Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date et heure *
              </span>
            </label>
            <input
              {...register('eventDate')}
              type="datetime-local"
              disabled={!canEdit}
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
              <span className="label-text font-semibold">Type d'evenement *</span>
            </label>
            <select
              {...register('eventType')}
              disabled={!canEdit}
              className={`select select-bordered ${errors.eventType ? 'select-error' : ''}`}
            >
              <option value="">Selectionner...</option>
              <option value="CONCERT">Concert</option>
              <option value="THEATER">Theatre</option>
              <option value="COMEDY">Comedie</option>
              <option value="FESTIVAL">Festival</option>
              <option value="PRIVATE">Evenement prive</option>
              <option value="CORPORATE">Evenement corporate</option>
              <option value="WEDDING">Mariage</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>

          {/* Duration & Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duree (minutes)
                </span>
              </label>
              <input
                {...register('duration')}
                type="number"
                min="30"
                step="15"
                disabled={!canEdit}
                className="input input-bordered"
                placeholder="Ex: 120"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget (euros)
                </span>
              </label>
              <input
                {...register('budget')}
                type="number"
                min="0"
                step="50"
                disabled={!canEdit}
                className="input input-bordered"
                placeholder="Ex: 500"
              />
            </div>
          </div>

          {/* Message */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </span>
            </label>
            <textarea
              {...register('message')}
              disabled={!canEdit}
              className="textarea textarea-bordered h-24"
              placeholder="Decrivez votre evenement..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-base-300">
            {canEdit && (
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="btn btn-primary flex-1"
              >
                {updateMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Enregistrer et renvoyer
              </button>
            )}

            {canCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="btn btn-error btn-outline"
              >
                <Trash2 className="w-4 h-4" />
                Annuler la demande
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
