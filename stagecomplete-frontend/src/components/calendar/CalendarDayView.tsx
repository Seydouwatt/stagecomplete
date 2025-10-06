import React from 'react';
import { clsx } from 'clsx';
import { getBookingsForDay, formatTime } from './helpers';
import type { Booking } from '../../services/bookingService';
import { Clock, MapPin, Euro } from 'lucide-react';

interface CalendarDayViewProps {
  currentDate: Date;
  bookings: Booking[];
  onDayClick: (date: Date) => void;
  onBookingClick: (booking: Booking) => void;
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'border-green-500 bg-green-500/10',
  TENTATIVE: 'border-yellow-500 bg-yellow-500/10',
  CANCELLED: 'border-red-500 bg-red-500/10',
  COMPLETED: 'border-blue-500 bg-blue-500/10',
};

const STATUS_TEXT_COLORS: Record<string, string> = {
  CONFIRMED: 'text-green-700',
  TENTATIVE: 'text-yellow-700',
  CANCELLED: 'text-red-700',
  COMPLETED: 'text-blue-700',
};

// Generate hourly slots (00:00 to 23:00)
function getHourlySlots(): string[] {
  const slots: string[] = [];
  for (let i = 0; i < 24; i++) {
    slots.push(`${String(i).padStart(2, '0')}:00`);
  }
  return slots;
}

export const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  currentDate,
  bookings,
  onDayClick,
  onBookingClick,
}) => {
  const dayBookings = getBookingsForDay(bookings, currentDate);
  const hourlySlots = getHourlySlots();

  // Sort bookings by time
  const sortedBookings = [...dayBookings].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="w-full">
      {/* Day header */}
      <div className="mb-6 text-center">
        <div className="text-4xl font-bold text-primary mb-2">
          {currentDate.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
        {dayBookings.length > 0 && (
          <div className="text-base-content/60">
            {dayBookings.length} événement{dayBookings.length > 1 ? 's' : ''} prévu{dayBookings.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Timeline view */}
      <div className="flex gap-4">
        {/* Time labels */}
        <div className="w-16 flex-shrink-0">
          {hourlySlots.map((slot) => (
            <div key={slot} className="h-16 text-xs text-base-content/60 text-right pr-2 -mt-2">
              {slot}
            </div>
          ))}
        </div>

        {/* Events timeline */}
        <div className="flex-1 relative border-l border-base-300">
          {/* Hour grid lines */}
          {hourlySlots.map((slot) => (
            <div key={slot} className="h-16 border-b border-base-200" />
          ))}

          {/* Bookings overlay */}
          {sortedBookings.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-base-content/40">
                <div className="text-6xl mb-4">📭</div>
                <div className="text-lg">Aucun événement ce jour</div>
                <button
                  onClick={() => onDayClick(currentDate)}
                  className="btn btn-sm btn-primary mt-4"
                >
                  Créer un événement
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 p-2 space-y-2">
              {sortedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className={clsx(
                    'p-4 rounded-lg border-l-4 cursor-pointer',
                    'hover:shadow-lg transition-shadow',
                    STATUS_COLORS[booking.status]
                  )}
                  onClick={() => onBookingClick(booking)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className={clsx('font-bold text-lg mb-1', STATUS_TEXT_COLORS[booking.status])}>
                        {booking.title}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-base-content/70 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(booking.date)}</span>
                          {booking.endDate && (
                            <span>- {formatTime(booking.endDate)}</span>
                          )}
                        </div>
                        {booking.duration && (
                          <span className="badge badge-sm badge-ghost">
                            {booking.duration} min
                          </span>
                        )}
                      </div>
                      {booking.description && (
                        <div className="text-sm text-base-content/60 mb-2">
                          {booking.description}
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        {booking.location && (
                          <div className="flex items-center gap-1 text-base-content/70">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.location}</span>
                          </div>
                        )}
                        {booking.budget && (
                          <div className="flex items-center gap-1 text-success font-semibold">
                            <Euro className="w-4 h-4" />
                            <span>{booking.budget}€</span>
                          </div>
                        )}
                      </div>
                      {booking.tags && booking.tags.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {booking.tags.map((tag: string, i: number) => (
                            <span key={i} className="badge badge-xs badge-outline">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="badge badge-sm">
                      {booking.eventType}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
