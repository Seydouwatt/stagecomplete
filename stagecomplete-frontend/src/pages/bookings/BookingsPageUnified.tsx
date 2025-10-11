import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import {
  Calendar,
  List,
  Plus,
  Bell,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import des services
import { getBookings, getBookingStats } from '../../services/bookingService';
import { bookingRequestService } from '../../services/bookingRequestService';
import { eventService } from '../../services/eventService';

// Import des composants existants
import { BookingRequestList } from '../../components/booking-requests/BookingRequestList';
import { CalendarView } from '../../components/calendar';

type TabType = 'requests' | 'all-bookings' | 'calendar';

export const BookingsPageUnified: React.FC = () => {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const isArtist = user?.role === 'ARTIST';

  // Fetch booking requests (demandes reçues)
  const { data: bookingRequests, isLoading: loadingRequests } = useQuery({
    queryKey: ['booking-requests'],
    queryFn: () => bookingRequestService.getAll(),
    enabled: !!token && isArtist,
  });

  // Fetch manual bookings (bookings créés manuellement)
  const { data: manualBookings, isLoading: loadingManual } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => getBookings(token!),
    enabled: !!token,
  });

  // Fetch events (bookings acceptés via la plateforme)
  const { data: events, isLoading: loadingEvents } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventService.getMyEvents(),
    enabled: !!token && isArtist,
  });

  // Stats pour les bookings
  const { data: stats } = useQuery({
    queryKey: ['booking-stats'],
    queryFn: () => getBookingStats(token!),
    enabled: !!token,
  });

  // Compter les demandes en attente
  const pendingRequestsCount = bookingRequests?.filter(
    req => req.status === 'PENDING' && !req.viewedByArtist
  ).length || 0;

  // Helper pour obtenir la date d'un booking ou event
  const getDate = (item: any) => {
    return item.date || item.startDate;
  };

  // Combiner tous les bookings pour l'onglet "Tous mes bookings"
  const allBookings = [
    ...(manualBookings || []).map(b => ({
      ...b,
      source: 'manual' as const,
      type: 'booking' as const
    })),
    ...(events || []).map(e => ({
      ...e,
      source: 'platform' as const,
      type: 'event' as const,
      date: e.startDate, // Normaliser le champ date
    }))
  ].sort((a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime());

  const isLoading = loadingRequests || loadingManual || loadingEvents;

  const getStatusBadge = (status: string) => {
    const badges = {
      CONFIRMED: 'badge-success',
      TENTATIVE: 'badge-warning',
      CANCELLED: 'badge-error',
      COMPLETED: 'badge-info',
      PENDING: 'badge-warning',
      ACCEPTED: 'badge-success',
      DECLINED: 'badge-error',
      VIEWED: 'badge-info',
    };
    return badges[status as keyof typeof badges] || 'badge-ghost';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      CONFIRMED: 'Confirmé',
      TENTATIVE: 'Provisoire',
      CANCELLED: 'Annulé',
      COMPLETED: 'Terminé',
      PENDING: 'En attente',
      ACCEPTED: 'Accepté',
      DECLINED: 'Décliné',
      VIEWED: 'Consulté',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'ACCEPTED':
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />;
      case 'DECLINED':
      case 'CANCELLED':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">📅 Mes Bookings</h1>
          <p className="text-base-content/70 mt-1">
            Gérez vos demandes et votre calendrier complet
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/artist/bookings/new" className="btn btn-primary btn-sm">
            <Plus className="w-4 h-4" />
            Ajouter un booking
          </Link>
        </div>
      </div>

      {/* Stats Cards (si on a des stats) */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat bg-base-100 rounded-lg border border-base-300">
            <div className="stat-title">Nouvelles demandes</div>
            <div className="stat-value text-warning">{pendingRequestsCount}</div>
            <div className="stat-desc">À traiter</div>
          </div>
          <div className="stat bg-base-100 rounded-lg border border-base-300">
            <div className="stat-title">À venir</div>
            <div className="stat-value text-secondary">{stats.upcoming}</div>
            <div className="stat-desc">Bookings confirmés</div>
          </div>
          <div className="stat bg-base-100 rounded-lg border border-base-300">
            <div className="stat-title">Ce mois</div>
            <div className="stat-value text-accent">{stats.thisMonth}</div>
            <div className="stat-desc">En {new Date().toLocaleString('fr-FR', { month: 'long' })}</div>
          </div>
          <div className="stat bg-base-100 rounded-lg border border-base-300">
            <div className="stat-title">Revenue total</div>
            <div className="stat-value text-success">{stats.totalRevenue}€</div>
            <div className="stat-desc">Cumul des cachets</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200">
        <button
          className={`tab ${activeTab === 'requests' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <Bell className="w-4 h-4 mr-2" />
          Demandes reçues
          {pendingRequestsCount > 0 && (
            <span className="badge badge-warning badge-sm ml-2">{pendingRequestsCount}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'all-bookings' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('all-bookings')}
        >
          <List className="w-4 h-4 mr-2" />
          Tous mes bookings
        </button>
        <button
          className={`tab ${activeTab === 'calendar' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Calendrier
        </button>
      </div>

      {/* Content based on active tab */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          {/* Tab 1: Demandes reçues */}
          {activeTab === 'requests' && (
            <div>
              <BookingRequestList
                isArtist={isArtist}
              />
            </div>
          )}

          {/* Tab 2: Tous mes bookings */}
          {activeTab === 'all-bookings' && (
            <div className="space-y-4">
              {allBookings.length === 0 ? (
                <div className="card bg-base-100 border border-base-300">
                  <div className="card-body text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold mb-2">Aucun booking pour le moment</h3>
                    <p className="text-base-content/70 mb-4">
                      Vos bookings acceptés et créés manuellement apparaîtront ici
                    </p>
                    <Link to="/artist/bookings/new" className="btn btn-primary">
                      <Plus className="w-4 h-4" />
                      Créer mon premier booking
                    </Link>
                  </div>
                </div>
              ) : (
                allBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    data-cy="booking-card"
                    data-booking-type={booking.source === 'platform' ? 'platform-booking' : 'manual-booking'}
                    className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="card-body">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="card-title text-xl">
                              {booking.title || `Événement du ${new Date(getDate(booking)).toLocaleDateString('fr-FR')}`}
                            </h3>
                            <span className={`badge ${getStatusBadge(booking.status)} badge-sm`}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1">{getStatusLabel(booking.status)}</span>
                            </span>
                            {booking.source === 'platform' && (
                              <span className="badge badge-primary badge-sm">
                                Via plateforme
                              </span>
                            )}
                            {booking.source === 'manual' && (
                              <span className="badge badge-ghost badge-sm">
                                Manuel
                              </span>
                            )}
                          </div>

                          {booking.description && (
                            <p className="text-base-content/70 mb-3">{booking.description}</p>
                          )}

                          <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-primary" />
                              <span className="font-medium">
                                {new Date(getDate(booking)).toLocaleDateString('fr-FR', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>

                            {booking.location && (
                              <div className="flex items-center gap-1">
                                <span className="text-base-content/70">{booking.location}</span>
                              </div>
                            )}

                            {(booking as any).budget && (
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-success">{(booking as any).budget}€</span>
                              </div>
                            )}

                            {booking.type === 'event' && booking.venue && (
                              <div className="flex items-center gap-1">
                                <span className="text-base-content/70">
                                  Avec: {booking.venue.profile?.name || 'Venue'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {booking.type === 'event' && (
                            <Link
                              to={`/messages/${booking.id}`}
                              data-cy="platform-booking-message-icon"
                              className="btn btn-sm btn-ghost btn-square"
                              title="Messages"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Link>
                          )}
                          {booking.type === 'booking' && (
                            <Link
                              to={`/artist/bookings/${booking.id}/edit`}
                              className="btn btn-sm btn-ghost btn-square"
                              title="Modifier"
                            >
                              <Plus className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Calendrier */}
          {activeTab === 'calendar' && (
            <div data-cy="calendar-view" className="card bg-base-100 shadow-lg border border-base-300 p-6">
              <CalendarView
                bookings={allBookings.map(item => ({
                  ...item,
                  title: item.title || '',
                  date: getDate(item),
                  eventType: (item as any).eventType || 'EVENT',
                })) as any}
                onDayClick={(date) => {
                  // Navigate to create booking with pre-filled date
                  const isoDate = date.toISOString().slice(0, 16);
                  window.location.href = `/artist/bookings/new?date=${isoDate}`;
                }}
                onBookingClick={(booking: any) => {
                  if (booking.type === 'event') {
                    window.location.href = `/messages/${booking.id}`;
                  } else {
                    window.location.href = `/artist/bookings/${booking.id}/edit`;
                  }
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};