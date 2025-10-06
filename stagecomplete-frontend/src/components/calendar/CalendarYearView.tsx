import React from 'react';
import { clsx } from 'clsx';
import { MONTHS } from './helpers';
import type { Booking } from '../../services/bookingService';

interface CalendarYearViewProps {
  currentDate: Date;
  bookings: Booking[];
  onMonthClick: (year: number, month: number) => void;
}

// Get bookings count for a specific month
function getMonthBookingsCount(bookings: Booking[], year: number, month: number): number {
  return bookings.filter((booking) => {
    const date = new Date(booking.date);
    return date.getFullYear() === year && date.getMonth() === month;
  }).length;
}

// Get mini calendar for a month (just day numbers in grid)
function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Add padding days from previous month
  const firstDayOfWeek = firstDay.getDay();
  const paddingDays = (firstDayOfWeek + 6) % 7;

  for (let i = paddingDays; i > 0; i--) {
    const date = new Date(firstDay);
    date.setDate(date.getDate() - i);
    days.push(date);
  }

  // Add actual month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  return days;
}

export const CalendarYearView: React.FC<CalendarYearViewProps> = ({
  currentDate,
  bookings,
  onMonthClick,
}) => {
  const year = currentDate.getFullYear();

  return (
    <div className="w-full">
      {/* Year header */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-primary">{year}</h2>
      </div>

      {/* 12 months grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {MONTHS.map((monthName, monthIndex) => {
          const monthDays = getMonthDays(year, monthIndex);
          const bookingsCount = getMonthBookingsCount(bookings, year, monthIndex);
          const today = new Date();
          const isCurrentMonth =
            today.getFullYear() === year && today.getMonth() === monthIndex;

          return (
            <div
              key={monthIndex}
              className={clsx(
                'card bg-base-100 border cursor-pointer transition-all',
                'hover:shadow-lg hover:border-primary',
                isCurrentMonth ? 'border-primary border-2' : 'border-base-300'
              )}
              onClick={() => onMonthClick(year, monthIndex)}
            >
              <div className="card-body p-4">
                {/* Month name */}
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className={clsx(
                      'font-bold text-sm',
                      isCurrentMonth ? 'text-primary' : 'text-base-content'
                    )}
                  >
                    {monthName}
                  </h3>
                  {bookingsCount > 0 && (
                    <span className="badge badge-primary badge-sm">
                      {bookingsCount}
                    </span>
                  )}
                </div>

                {/* Mini calendar grid */}
                <div className="grid grid-cols-7 gap-0.5 text-[10px]">
                  {/* Week days header */}
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <div key={i} className="text-center text-base-content/40 font-semibold">
                      {day}
                    </div>
                  ))}
                  {/* Days */}
                  {monthDays.slice(0, 35).map((date, i) => {
                    const isCurrentMonthDay = date.getMonth() === monthIndex;
                    const isToday =
                      date.getDate() === today.getDate() &&
                      date.getMonth() === today.getMonth() &&
                      date.getFullYear() === today.getFullYear();
                    const hasBookings = bookings.some((booking) => {
                      const bookingDate = new Date(booking.date);
                      return (
                        bookingDate.getDate() === date.getDate() &&
                        bookingDate.getMonth() === date.getMonth() &&
                        bookingDate.getFullYear() === date.getFullYear()
                      );
                    });

                    return (
                      <div
                        key={i}
                        className={clsx(
                          'text-center py-0.5 rounded',
                          isCurrentMonthDay ? 'text-base-content' : 'text-base-content/20',
                          isToday && 'bg-primary text-primary-content font-bold',
                          hasBookings && !isToday && 'bg-primary/20 font-semibold'
                        )}
                      >
                        {date.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
