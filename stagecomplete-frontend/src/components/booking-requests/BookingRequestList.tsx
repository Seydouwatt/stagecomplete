import React, { useState } from 'react';
import { BookingRequestCard } from './BookingRequestCard';
import { RespondModal } from './RespondModal';
import { useBookingRequests, useRespondToBookingRequest } from '../../hooks/useBookingRequests';
import type { BookingRequest } from '../../types/booking-request';
import { Inbox } from 'lucide-react';

interface BookingRequestListProps {
  statusFilter?: string;
  isArtist?: boolean;
}

export const BookingRequestList: React.FC<BookingRequestListProps> = ({
  statusFilter,
  isArtist = false,
}) => {
  const { requests, isLoading } = useBookingRequests(statusFilter);
  const respondMutation = useRespondToBookingRequest();
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  const [respondModalOpen, setRespondModalOpen] = useState(false);
  const [respondAction, setRespondAction] = useState<'accept' | 'decline' | 'cancel'>('accept');

  const handleAccept = (request: BookingRequest) => {
    setSelectedRequest(request);
    setRespondAction('accept');
    setRespondModalOpen(true);
  };

  const handleDecline = (request: BookingRequest) => {
    setSelectedRequest(request);
    setRespondAction('decline');
    setRespondModalOpen(true);
  };

  const handleCancel = (request: BookingRequest) => {
    setSelectedRequest(request);
    setRespondAction('cancel');
    setRespondModalOpen(true);
  };

  const handleConfirmResponse = (reason?: string) => {
    if (!selectedRequest) return;

    respondMutation.mutate(
      {
        id: selectedRequest.id,
        data: {
          action: respondAction,
          reason,
        },
      },
      {
        onSuccess: () => {
          setRespondModalOpen(false);
          setSelectedRequest(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-base-content/60">
        <Inbox className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium">Aucune demande</p>
        <p className="text-sm">
          {statusFilter
            ? `Aucune demande avec le statut "${statusFilter}"`
            : 'Aucune demande de réservation'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <BookingRequestCard
            key={request.id}
            request={request}
            isArtist={isArtist}
            onAccept={() => handleAccept(request)}
            onDecline={() => handleDecline(request)}
            onCancel={() => handleCancel(request)}
          />
        ))}
      </div>

      {/* Modal de réponse */}
      <RespondModal
        isOpen={respondModalOpen}
        onClose={() => setRespondModalOpen(false)}
        onConfirm={handleConfirmResponse}
        action={respondAction}
        request={selectedRequest}
        isLoading={respondMutation.isPending}
      />
    </>
  );
};
