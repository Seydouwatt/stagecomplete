import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarDayCell } from './CalendarDay';
import { getCalendarDays, DAYS_OF_WEEK, MONTHS } from './helpers';
import type { Booking } from '../../services/bookingService';
import { clsx } from 'clsx';

interface CalendarViewProps {
  bookings: Booking[];
  onDayClick?: (date: Date) => void;
  onBookingClick?: (booking: Booking) => void;
}

type ViewMode = 'month' | 'week' | 'day' | 'year';

export const CalendarView: React.FC<CalendarViewProps> = ({
  bookings,
  onDayClick = () => {},
  onBookingClick = () => {},
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const calendarDays = getCalendarDays(currentYear, currentMonth);

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  // Generate year options (current year ± 5 years)
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Title and Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">
              {MONTHS[currentMonth]} {currentYear}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="btn btn-sm btn-ghost btn-circle"
              title="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="btn btn-sm btn-ghost"
              title="Aujourd'hui"
            >
              Aujourd'hui
            </button>
            <button
              onClick={goToNextMonth}
              className="btn btn-sm btn-ghost btn-circle"
              title="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Month and Year Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={currentMonth}
            onChange={handleMonthChange}
            className="select select-sm select-bordered"
          >
            {MONTHS.map((month, index) => (
              <option key={index} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={currentYear}
            onChange={handleYearChange}
            className="select select-sm select-bordered"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle (pour futur) */}
        <div className="btn-group hidden sm:flex">
          <button
            className={clsx(
              'btn btn-sm',
              viewMode === 'day' ? 'btn-active' : 'btn-ghost'
            )}
            onClick={() => setViewMode('day')}
            disabled
            title="Vue jour (bientôt disponible)"
          >
            Jour
          </button>
          <button
            className={clsx(
              'btn btn-sm',
              viewMode === 'week' ? 'btn-active' : 'btn-ghost'
            )}
            onClick={() => setViewMode('week')}
            disabled
            title="Vue semaine (bientôt disponible)"
          >
            Semaine
          </button>
          <button
            className={clsx(
              'btn btn-sm',
              viewMode === 'month' ? 'btn-active' : 'btn-ghost'
            )}
            onClick={() => setViewMode('month')}
          >
            Mois
          </button>
          <button
            className={clsx(
              'btn btn-sm',
              viewMode === 'year' ? 'btn-active' : 'btn-ghost'
            )}
            onClick={() => setViewMode('year')}
            disabled
            title="Vue année (bientôt disponible)"
          >
            Année
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-0 mb-2">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-base-content/70 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border border-base-300 rounded-lg overflow-hidden">
        {calendarDays.map((day, index) => (
          <CalendarDayCell
            key={index}
            day={day}
            bookings={bookings}
            onDayClick={onDayClick}
            onBookingClick={onBookingClick}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span>Confirmé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500"></div>
          <span>Provisoire</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500"></div>
          <span>Annulé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span>Terminé</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
