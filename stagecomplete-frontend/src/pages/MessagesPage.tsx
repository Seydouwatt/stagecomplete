import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useConversations } from '../hooks/useMessages';
import { MessageThread } from '../components/messages/MessageThread';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Calendar,
  MapPin,
  User,
  ChevronLeft,
  Circle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Euro,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Conversation } from '../types/message';

export const MessagesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const isArtist = user?.role === 'ARTIST';

  // Récupérer toutes les conversations
  const { conversations, isLoading } = useConversations();

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'TENTATIVE':
        return <AlertCircle className="w-4 h-4 text-info" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <Circle className="w-4 h-4 text-base-content/50" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'CONFIRMED':
        return 'Confirmé';
      case 'PENDING':
        return 'En attente';
      case 'TENTATIVE':
        return 'À confirmer';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return status;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Si une conversation est sélectionnée, afficher le thread de messages
  if (selectedConversation) {
    return (
      <div className="space-y-6">
        {/* Header avec retour */}
        <div className="flex items-center gap-4 pb-4 border-b border-base-300">
          <button
            onClick={() => setSelectedConversation(null)}
            className="btn btn-ghost btn-sm btn-square"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold">
                {selectedConversation.title}
              </h2>
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedConversation.status)}
                <span className="text-sm text-base-content/70">
                  {getStatusLabel(selectedConversation.status)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{selectedConversation.participant.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedConversation.date)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Encart booking request */}
        {selectedConversation.bookingRequest && (
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Demande de booking</h3>
                <span className={`badge badge-sm ${
                  selectedConversation.bookingRequest.status === 'PENDING' || selectedConversation.bookingRequest.status === 'VIEWED'
                    ? 'badge-warning'
                    : selectedConversation.bookingRequest.status === 'ACCEPTED'
                    ? 'badge-success'
                    : selectedConversation.bookingRequest.status === 'DECLINED'
                    ? 'badge-error'
                    : 'badge-ghost'
                }`}>
                  {selectedConversation.bookingRequest.status === 'PENDING' ? 'En attente' :
                   selectedConversation.bookingRequest.status === 'VIEWED' ? 'Vue' :
                   selectedConversation.bookingRequest.status === 'ACCEPTED' ? 'Acceptee' :
                   selectedConversation.bookingRequest.status === 'DECLINED' ? 'Declinee' :
                   selectedConversation.bookingRequest.status === 'CANCELLED' ? 'Annulee' :
                   selectedConversation.bookingRequest.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-base-content/70 mt-2">
                {selectedConversation.bookingRequest.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {selectedConversation.bookingRequest.duration} min
                  </span>
                )}
                {selectedConversation.bookingRequest.budget && (
                  <span className="flex items-center gap-1">
                    <Euro className="w-3 h-3" /> {selectedConversation.bookingRequest.budget}€
                  </span>
                )}
              </div>
              {!isArtist && ['PENDING', 'VIEWED', 'DECLINED'].includes(selectedConversation.bookingRequest.status) && (
                <Link
                  to={`/venue/booking-requests/${selectedConversation.bookingRequest.id}/edit`}
                  className="btn btn-sm btn-outline btn-primary mt-2"
                >
                  <ExternalLink className="w-3 h-3" />
                  Modifier la demande
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Thread de messages */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-0">
            <MessageThread eventId={selectedConversation.eventId} />
          </div>
        </div>
      </div>
    );
  }

  // Liste des conversations (événements)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">💬 Messages</h1>
        <p className="text-base-content/70 mt-1">
          Communiquez avec {isArtist ? 'les venues' : 'les artistes'} pour vos événements
        </p>
      </div>

      {/* Liste des conversations */}
      <div className="space-y-4">
        {!conversations || conversations.length === 0 ? (
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Aucune conversation</h3>
              <p className="text-base-content/70">
                {isArtist ?
                  "Les conversations avec les venues apparaîtront ici une fois que vous aurez reçu des demandes de booking" :
                  "Les conversations avec les artistes apparaîtront ici une fois que vous aurez envoyé vos demandes de booking"
                }
              </p>
            </div>
          </div>
        ) : (
          conversations.map((conversation, index) => {
            const hasUnread = conversation.unreadCount > 0;
            const lastMessage = conversation.lastMessage;

            return (
              <motion.div
                key={conversation.eventId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full text-left card bg-base-100 border border-base-300 hover:shadow-lg transition-all ${
                    hasUnread ? 'border-primary/50 bg-primary/5' : 'hover:border-primary/30'
                  }`}
                >
                  <div className="card-body p-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative">
                          {conversation.participant.avatar ? (
                            <img
                              src={conversation.participant.avatar}
                              alt={conversation.participant.name}
                              className="rounded-full"
                            />
                          ) : (
                            <User className="w-6 h-6 text-primary" />
                          )}
                          {hasUnread && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-base-100"></span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-lg truncate ${hasUnread ? 'text-primary' : ''}`}>
                              {conversation.participant.name}
                            </h3>
                            <p className="text-base-content/70 text-sm truncate">
                              {conversation.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(conversation.status)}
                            {hasUnread && (
                              <span className="badge badge-primary badge-sm">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dernier message */}
                        {lastMessage && (
                          <p className={`text-sm mb-2 line-clamp-1 ${hasUnread ? 'font-medium text-base-content' : 'text-base-content/60'}`}>
                            <span className="text-base-content/50 mr-1">
                              {lastMessage.senderName}:
                            </span>
                            {lastMessage.content}
                          </p>
                        )}

                        {/* Booking request badge si présent */}
                        {conversation.bookingRequest && conversation.status === 'PENDING' && (
                          <div className="mb-2">
                            <span className="badge badge-warning badge-sm">
                              Demande de booking en attente
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-base-content/50">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(conversation.date)}</span>
                          </div>
                          {lastMessage && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>
                                {new Date(lastMessage.createdAt).toLocaleDateString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};