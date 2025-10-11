import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import type { BookingRequest } from '../../types/booking-request';

interface RespondModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  action: 'accept' | 'decline' | 'cancel';
  request: BookingRequest | null;
  isLoading?: boolean;
}

export const RespondModal: React.FC<RespondModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  request,
  isLoading = false,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen || !request) return null;

  const config = {
    accept: {
      title: 'Accepter la demande',
      icon: <CheckCircle className="w-12 h-12 text-success" />,
      message: 'Voulez-vous accepter cette demande de réservation ?',
      detail: 'Un événement sera automatiquement créé dans votre calendrier.',
      confirmText: 'Accepter',
      confirmClass: 'btn-success',
      showReasonField: false,
    },
    decline: {
      title: 'Décliner la demande',
      icon: <XCircle className="w-12 h-12 text-error" />,
      message: 'Voulez-vous décliner cette demande de réservation ?',
      detail: 'Vous pouvez optionnellement fournir une raison.',
      confirmText: 'Décliner',
      confirmClass: 'btn-error',
      showReasonField: true,
    },
    cancel: {
      title: 'Annuler la demande',
      icon: <AlertCircle className="w-12 h-12 text-warning" />,
      message: 'Voulez-vous annuler cette demande de réservation ?',
      detail: "L'artiste sera notifié de l'annulation.",
      confirmText: 'Annuler la demande',
      confirmClass: 'btn-warning',
      showReasonField: true,
    },
  };

  const currentConfig = config[action];

  const handleConfirm = () => {
    onConfirm(reason.trim() || undefined);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{currentConfig.title}</h3>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Icône */}
        <div className="flex justify-center my-6">
          {currentConfig.icon}
        </div>

        {/* Message */}
        <div className="text-center space-y-2 mb-6">
          <p className="font-medium">{currentConfig.message}</p>
          <p className="text-sm text-base-content/60">{currentConfig.detail}</p>
        </div>

        {/* Détails de la demande */}
        <div className="bg-base-200 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">De:</span>{' '}
              {action === 'cancel' ? request.artist.profile.name : request.venue.profile.name}
            </div>
            <div>
              <span className="font-medium">Type:</span> {request.eventType}
            </div>
            <div>
              <span className="font-medium">Date:</span>{' '}
              {new Date(request.eventDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            {request.budget && (
              <div>
                <span className="font-medium">Budget:</span> {request.budget}€
              </div>
            )}
          </div>
        </div>

        {/* Champ de raison (optionnel) */}
        {currentConfig.showReasonField && (
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text">
                Raison {action === 'decline' ? '(optionnel)' : ''}
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24"
              placeholder={
                action === 'decline'
                  ? 'Expliquez pourquoi vous déclinez...'
                  : 'Expliquez pourquoi vous annulez...'
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Actions */}
        <div className="modal-action">
          <button
            onClick={handleClose}
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Retour
          </button>
          <button
            onClick={handleConfirm}
            className={clsx('btn', currentConfig.confirmClass, isLoading && 'loading')}
            disabled={isLoading}
          >
            {currentConfig.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
