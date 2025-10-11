import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { eventService } from '../services/eventService';
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
  AlertCircle
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const isArtist = user?.role === 'ARTIST';

  // Récupérer les événements confirmés
  const { data: events, isLoading } = useQuery({
    queryKey: ['events-for-messages'],
    queryFn: () => eventService.getMyEvents(),
    select: (data) => data.filter(e =>
      e.status === 'CONFIRMED' ||
      e.status === 'TENTATIVE'
    ),
  });

  // Compter les messages non lus (simulation - à implémenter avec le vrai système)
  const getUnreadCount = (_event: any) => {
    // TODO: Implémenter le comptage des messages non lus
    return 0;
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'TENTATIVE':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <Circle className="w-4 h-4 text-base-content/50" />;
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

  // Si un événement est sélectionné, afficher le thread de messages
  if (selectedEvent) {
    return (
      <div className="space-y-6">
        {/* Header avec retour */}
        <div className="flex items-center gap-4 pb-4 border-b border-base-300">
          <button
            onClick={() => setSelectedEvent(null)}
            className="btn btn-ghost btn-sm btn-square"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">
              {selectedEvent.title || `Événement du ${formatDate(selectedEvent.startDate)}`}
            </h2>
            <div className="flex items-center gap-4 text-sm text-base-content/70 mt-1">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>
                  {isArtist ?
                    selectedEvent.venue?.profile?.name :
                    selectedEvent.artist?.profile?.name
                  }
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedEvent.startDate)}</span>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thread de messages */}
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body p-0">
            <MessageThread eventId={selectedEvent.id} />
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

      {/* Liste des événements/conversations */}
      <div className="space-y-4">
        {!events || events.length === 0 ? (
          <div className="card bg-base-100 border border-base-300">
            <div className="card-body text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Aucune conversation</h3>
              <p className="text-base-content/70">
                {isArtist ?
                  "Les conversations avec les venues apparaîtront ici une fois que vous aurez accepté des demandes de booking" :
                  "Les conversations avec les artistes apparaîtront ici une fois que vos demandes seront acceptées"
                }
              </p>
            </div>
          </div>
        ) : (
          events.map((event, index) => {
            const unreadCount = getUnreadCount(event);
            const otherParty = isArtist ? event.venue : event.artist;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full text-left card bg-base-100 border border-base-300 hover:shadow-lg transition-all hover:border-primary/50"
                >
                  <div className="card-body p-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {otherParty?.profile?.avatar ? (
                            <img
                              src={otherParty.profile.avatar}
                              alt={otherParty.profile.name}
                              className="rounded-full"
                            />
                          ) : (
                            <User className="w-6 h-6 text-primary" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-lg truncate">
                            {otherParty?.profile?.name || 'Inconnu'}
                          </h3>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(event.status)}
                            {unreadCount > 0 && (
                              <span className="badge badge-primary badge-sm">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-base-content/70 text-sm mb-2 line-clamp-1">
                          {event.title || `Événement du ${formatDate(event.startDate)}`}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-base-content/50">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-[150px]">{event.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{event.messages?.length || 0} messages</span>
                          </div>
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