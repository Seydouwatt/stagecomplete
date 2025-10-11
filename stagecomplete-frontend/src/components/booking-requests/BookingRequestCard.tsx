import React from 'react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  Euro,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
} from 'lucide-react';
import type { BookingRequest } from '../../types/booking-request';

interface BookingRequestCardProps {
  request: BookingRequest;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
  onViewDetails?: () => void;
  showActions?: boolean;
  isArtist?: boolean;
}

export const BookingRequestCard: React.FC<BookingRequestCardProps> = ({
  request,
  onAccept,
  onDecline,
  onCancel,
  onViewDetails,
  showActions = true,
  isArtist = false,
}) => {
  const getStatusBadge = () => {
    const statusConfig = {
      PENDING: { label: 'En attente', className: 'badge-warning' },
      VIEWED: { label: 'Vue', className: 'badge-info' },
      ACCEPTED: { label: 'Acceptée', className: 'badge-success' },
      DECLINED: { label: 'Déclinée', className: 'badge-error' },
      CANCELLED: { label: 'Annulée', className: 'badge-ghost' },
      EXPIRED: { label: 'Expirée', className: 'badge-ghost' },
    };

    const config = statusConfig[request.status];
    return (
      <div className={clsx('badge', config.className)}>
        {config.label}
      </div>
    );
  };

  const canRespond = request.status === 'PENDING' || request.status === 'VIEWED';
  const canCancel = request.status === 'PENDING' || request.status === 'VIEWED';

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
      <div className="card-body">
        {/* En-tête avec statut */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-12">
                <span className="text-lg">
                  {isArtist
                    ? request.venue.profile.name.charAt(0)
                    : request.artist.profile.name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Nom et type */}
            <div>
              <h3 className="font-bold text-lg">
                {isArtist ? request.venue.profile.name : request.artist.profile.name}
              </h3>
              <p className="text-sm text-base-content/60">{request.eventType}</p>
            </div>
          </div>

          {getStatusBadge()}
        </div>

        {/* Détails de la demande */}
        <div className="space-y-2">
          {/* Date de l'événement */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-medium">
              {format(new Date(request.eventDate), 'EEEE d MMMM yyyy', {
                locale: fr,
              })}
            </span>
          </div>

          {/* Durée */}
          {request.duration && (
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <Clock className="w-4 h-4" />
              <span>{request.duration} minutes</span>
            </div>
          )}

          {/* Budget */}
          {request.budget && (
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <Euro className="w-4 h-4" />
              <span>{request.budget}€</span>
            </div>
          )}

          {/* Message */}
          {request.message && (
            <div className="mt-4 p-3 bg-base-200 rounded-lg">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-base-content/60 mt-0.5" />
                <p className="text-sm text-base-content/80 whitespace-pre-wrap">
                  {request.message}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Métadonnées */}
        <div className="text-xs text-base-content/50 mt-4">
          Demande créée le{' '}
          {format(new Date(request.createdAt), 'd MMM yyyy à HH:mm', {
            locale: fr,
          })}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="card-actions justify-end mt-4 gap-2">
            {/* Bouton Voir les détails */}
            <button
              onClick={onViewDetails}
              className="btn btn-ghost btn-sm"
            >
              <Eye className="w-4 h-4" />
              Détails
            </button>

            {/* Actions pour artiste */}
            {isArtist && canRespond && (
              <>
                <button
                  onClick={onDecline}
                  className="btn btn-error btn-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Décliner
                </button>
                <button
                  onClick={onAccept}
                  className="btn btn-success btn-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Accepter
                </button>
              </>
            )}

            {/* Action pour venue */}
            {!isArtist && canCancel && (
              <button
                onClick={onCancel}
                className="btn btn-error btn-outline btn-sm"
              >
                Annuler
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
