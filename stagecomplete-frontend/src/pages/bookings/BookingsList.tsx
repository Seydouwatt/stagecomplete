import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import {
  getBookings,
  deleteBooking,
  getBookingStats,
  exportBookingsIcal,
} from '../../services/bookingService';
import type { Booking } from '../../services/bookingService';
import { Calendar, List, Plus, Download, Trash2, Edit, MapPin, Euro, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { usePremiumFeatures } from '../../hooks/usePremiumFeatures';
import { CalendarView } from '../../components/calendar';

export const BookingsList: React.FC = () => {
  const { token, uiPreferences, setBookingsViewMode } = useAuthStore();
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { isPremium } = usePremiumFeatures();
  const queryClient = useQueryClient();
  const viewMode = uiPreferences.bookingsViewMode;

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => getBookings(token!),
    enabled: !!token,
  });

  const { data: stats } = useQuery({
    queryKey: ['booking-stats'],
    queryFn: () => getBookingStats(token!),
    enabled: !!token,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBooking(token!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking-stats'] });
    },
  });

  const handleExport = async () => {
    if (!isPremium) {
      alert('📥 Export calendrier réservé aux membres Premium ! Passez à Premium pour exporter vos bookings.');
      return;
    }
    try {
      const blob = await exportBookingsIcal(token!);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'stagecomplete-bookings.ics';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting calendar:', error);
      alert('Erreur lors de l\'export du calendrier');
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      CONFIRMED: 'badge-success',
      TENTATIVE: 'badge-warning',
      CANCELLED: 'badge-error',
      COMPLETED: 'badge-info',
    };
    return badges[status as keyof typeof badges] || 'badge-ghost';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      CONFIRMED: 'Confirmé',
      TENTATIVE: 'Provisoire',
      CANCELLED: 'Annulé',
      COMPLETED: 'Terminé',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">📅 Mes Bookings</h1>
          <p className="text-base-content/70 mt-1">
            Gérez votre calendrier de spectacles et événements
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setBookingsViewMode('list')}
            title="Vue liste"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setBookingsViewMode('calendar')}
            title="Vue calendrier"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            className={`btn btn-sm btn-secondary ${!isPremium ? 'btn-disabled' : ''}`}
            onClick={handleExport}
            title={isPremium ? 'Exporter en iCal' : 'Premium requis'}
          >
            <Download className="w-4 h-4" />
            {!isPremium && <span className="badge badge-xs badge-warning ml-1">Pro</span>}
          </button>
          <Link to="/artist/bookings/new" className="btn btn-sm btn-primary">
            <Plus className="w-4 h-4" />
            Nouveau
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat bg-base-100 rounded-lg border border-base-300">
            <div className="stat-title">Total</div>
            <div className="stat-value text-primary">{stats.total}</div>
            <div className="stat-desc">Tous les bookings</div>
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

      {/* Liste */}
      {viewMode === 'list' && (
        <div className="grid gap-4">
          {!bookings || bookings.length === 0 ? (
            <div className="card bg-base-100 border border-base-300">
              <div className="card-body text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold mb-2">Aucun booking pour le moment</h3>
                <p className="text-base-content/70 mb-4">
                  Commencez à gérer votre calendrier en créant votre premier booking !
                </p>
                <Link to="/artist/bookings/new" className="btn btn-primary">
                  <Plus className="w-4 h-4" />
                  Créer mon premier booking
                </Link>
              </div>
            </div>
          ) : (
            bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                className="card bg-base-100 shadow-lg border border-base-300 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="card-body">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="card-title text-xl mb-2">
                        {booking.title}
                        <span className={`badge ${getStatusBadge(booking.status)} badge-sm ml-2`}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </h3>
                      {booking.description && (
                        <p className="text-base-content/70 mb-3">{booking.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {new Date(booking.date).toLocaleDateString('fr-FR', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          {booking.endDate && (
                            <span className="text-base-content/60">
                              {' '}
                              → {new Date(booking.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        {booking.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-secondary" />
                            <span>{booking.location}</span>
                          </div>
                        )}
                        {booking.budget && (
                          <div className="flex items-center gap-1">
                            <Euro className="w-4 h-4 text-success" />
                            <span className="font-semibold">{booking.budget}€</span>
                          </div>
                        )}
                      </div>
                      {booking.tags && booking.tags.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {booking.tags.map((tag, i) => (
                            <span key={i} className="badge badge-outline badge-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/artist/bookings/${booking.id}/edit`}
                        className="btn btn-sm btn-ghost btn-square"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="btn btn-sm btn-ghost btn-square text-error hover:bg-error/10"
                        onClick={() => handleDelete(booking.id, booking.title)}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Calendar view */}
      {viewMode === 'calendar' && (
        <div className="card bg-base-100 shadow-lg border border-base-300 p-6">
          <CalendarView
            bookings={bookings || []}
            onDayClick={(date) => {
              // Navigate to create booking with pre-filled date
              const isoDate = date.toISOString().slice(0, 16);
              navigate(`/artist/bookings/new?date=${isoDate}`);
            }}
            onBookingClick={(booking) => {
              setSelectedBooking(booking);
            }}
          />
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-2xl">{selectedBooking.title}</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedBooking(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`badge ${getStatusBadge(selectedBooking.status)}`}>
                  {getStatusLabel(selectedBooking.status)}
                </span>
                <span className="badge badge-outline">{selectedBooking.eventType}</span>
              </div>

              {selectedBooking.description && (
                <div>
                  <h4 className="font-semibold mb-1">Description</h4>
                  <p className="text-base-content/70">{selectedBooking.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date et heure
                  </h4>
                  <p className="text-base-content/70">
                    {new Date(selectedBooking.date).toLocaleString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  {selectedBooking.endDate && (
                    <p className="text-sm text-base-content/60">
                      Fin: {new Date(selectedBooking.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>

                {selectedBooking.location && (
                  <div>
                    <h4 className="font-semibold mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Lieu
                    </h4>
                    <p className="text-base-content/70">{selectedBooking.location}</p>
                    {selectedBooking.address && (
                      <p className="text-sm text-base-content/60">{selectedBooking.address}</p>
                    )}
                  </div>
                )}
              </div>

              {(selectedBooking.duration || selectedBooking.budget) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedBooking.duration && (
                    <div>
                      <h4 className="font-semibold mb-1">Durée</h4>
                      <p className="text-base-content/70">{selectedBooking.duration} minutes</p>
                    </div>
                  )}
                  {selectedBooking.budget && (
                    <div>
                      <h4 className="font-semibold mb-1 flex items-center gap-2">
                        <Euro className="w-4 h-4" />
                        Cachet
                      </h4>
                      <p className="text-base-content/70 font-semibold">{selectedBooking.budget}€</p>
                    </div>
                  )}
                </div>
              )}

              {selectedBooking.tags && selectedBooking.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.tags.map((tag, i) => (
                      <span key={i} className="badge badge-outline">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedBooking.notes && (
                <div>
                  <h4 className="font-semibold mb-1">Notes privées</h4>
                  <p className="text-base-content/70 text-sm whitespace-pre-wrap">
                    {selectedBooking.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedBooking(null)}
              >
                Fermer
              </button>
              <Link
                to={`/artist/bookings/${selectedBooking.id}/edit`}
                className="btn btn-primary"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </Link>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setSelectedBooking(null)}></div>
        </div>
      )}
    </div>
  );
};
