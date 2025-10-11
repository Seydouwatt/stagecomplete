import React from 'react';
import { clsx } from 'clsx';
import type { CalendarDay as CalendarDayType } from './helpers';
import { getBookingsForDay } from './helpers';
import type { Booking } from '../../services/bookingService';

interface CalendarDayProps {
  day: CalendarDayType;
  bookings: Booking[];
  onDayClick: (date: Date) => void;
  onBookingClick: (booking: Booking) => void;
}

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-500',
  TENTATIVE: 'bg-yellow-500',
  CANCELLED: 'bg-red-500',
  COMPLETED: 'bg-blue-500',
};

export const CalendarDayCell: React.FC<CalendarDayProps> = ({
  day,
  bookings,
  onDayClick,
  onBookingClick,
}) => {
  const dayBookings = getBookingsForDay(bookings, day.date);
  const hasBookings = dayBookings.length > 0;

  return (
    <div
      className={clsx(
        'min-h-[100px] border border-base-300 p-2 cursor-pointer transition-colors',
        'hover:bg-base-200',
        day.isCurrentMonth ? 'bg-base-100' : 'bg-base-200/50',
        day.isToday && 'ring-2 ring-primary',
        day.isWeekend && 'bg-base-200/30'
      )}
      onClick={() => onDayClick(day.date)}
    >
      {/* Day number */}
      <div
        className={clsx(
          'text-right text-sm font-semibold mb-1',
          day.isToday ? 'text-primary' : 'text-base-content',
          !day.isCurrentMonth && 'text-base-content/40'
        )}
      >
        {day.dayNumber}
      </div>

      {/* Bookings list */}
      <div className="space-y-1">
        {dayBookings.slice(0, 3).map((booking) => (
          <div
            key={booking.id}
            data-cy="calendar-event"
            className={clsx(
              'text-xs px-2 py-1 rounded cursor-pointer',
              'hover:opacity-80 transition-opacity truncate',
              STATUS_COLORS[booking.status],
              'text-white'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onBookingClick(booking);
            }}
            title={`${booking.title} - ${booking.status}`}
          >
            {booking.title}
          </div>
        ))}

        {/* Show "+N more" if more than 3 bookings */}
        {dayBookings.length > 3 && (
          <div className="text-xs text-base-content/60 px-2">
            +{dayBookings.length - 3} autre{dayBookings.length - 3 > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Indicator dot for bookings */}
      {hasBookings && (
        <div className="flex justify-center mt-1 space-x-1">
          {dayBookings.slice(0, 3).map((booking, idx) => (
            <div
              key={idx}
              className={clsx(
                'w-1.5 h-1.5 rounded-full',
                STATUS_COLORS[booking.status]
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
