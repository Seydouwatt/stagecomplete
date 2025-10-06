import React from 'react';
import { clsx } from 'clsx';
import { DAYS_OF_WEEK, getBookingsForDay, formatTime } from './helpers';
import type { Booking } from '../../services/bookingService';

interface CalendarWeekViewProps {
  currentDate: Date;
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

// Get start of week (Monday)
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Get days of current week
function getWeekDays(date: Date): Date[] {
  const weekStart = getWeekStart(date);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  return days;
}

export const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  currentDate,
  bookings,
  onDayClick,
  onBookingClick,
}) => {
  const weekDays = getWeekDays(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = (date: Date) => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="w-full">
      {/* Week header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map((date, index) => {
          const dayBookings = getBookingsForDay(bookings, date);
          return (
            <div
              key={index}
              className={clsx(
                'text-center p-4 rounded-lg border-2 transition-all cursor-pointer',
                'hover:border-primary hover:shadow-md',
                isToday(date) ? 'border-primary bg-primary/10' : 'border-base-300',
                isWeekend(date) && 'bg-base-200/50'
              )}
              onClick={() => onDayClick(date)}
            >
              <div className="text-xs font-semibold text-base-content/60 mb-1">
                {DAYS_OF_WEEK[index]}
              </div>
              <div
                className={clsx(
                  'text-2xl font-bold',
                  isToday(date) ? 'text-primary' : 'text-base-content'
                )}
              >
                {date.getDate()}
              </div>
              {dayBookings.length > 0 && (
                <div className="text-xs text-base-content/60 mt-1">
                  {dayBookings.length} event{dayBookings.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Week timeline */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((date, index) => {
          const dayBookings = getBookingsForDay(bookings, date);
          return (
            <div
              key={index}
              className={clsx(
                'min-h-[400px] border border-base-300 rounded-lg p-2 bg-base-100',
                isWeekend(date) && 'bg-base-200/30'
              )}
              onClick={() => onDayClick(date)}
            >
              {/* Bookings list for the day */}
              <div className="space-y-2">
                {dayBookings.length === 0 ? (
                  <div className="text-center text-base-content/40 text-sm pt-8">
                    Aucun événement
                  </div>
                ) : (
                  dayBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className={clsx(
                        'p-2 rounded cursor-pointer text-white text-xs',
                        'hover:opacity-80 transition-opacity',
                        STATUS_COLORS[booking.status]
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick(booking);
                      }}
                    >
                      <div className="font-semibold truncate">{formatTime(booking.date)}</div>
                      <div className="truncate">{booking.title}</div>
                      {booking.location && (
                        <div className="truncate opacity-80 text-[10px]">{booking.location}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
