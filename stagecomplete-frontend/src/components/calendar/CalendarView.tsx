import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarDayCell } from './CalendarDay';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarDayView } from './CalendarDayView';
import { CalendarYearView } from './CalendarYearView';
import { getCalendarDays, DAYS_OF_WEEK, MONTHS } from './helpers';
import type { Booking } from '../../services/bookingService';
import { clsx } from 'clsx';
import { useAuthStore, type CalendarViewType } from '../../stores/authStore';

interface CalendarViewProps {
  bookings: Booking[];
  onDayClick?: (date: Date) => void;
  onBookingClick?: (booking: Booking) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  bookings,
  onDayClick = () => {},
  onBookingClick = () => {},
}) => {
  const { uiPreferences, setCalendarViewType } = useAuthStore();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const viewMode = uiPreferences.calendarViewType;

  const calendarDays = getCalendarDays(currentYear, currentMonth);

  const handleViewModeChange = (mode: CalendarViewType) => {
    setCalendarViewType(mode);
  };

  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'year') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'year') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const handleMonthClick = (year: number, month: number) => {
    const newDate = new Date(year, month, 1);
    setCurrentDate(newDate);
    handleViewModeChange('month');
  };

  // Generate year options (current year ± 5 years)
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Get title based on view mode
  const getTitle = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      return `Semaine du ${currentDate.toLocaleDateString('fr-FR')}`;
    } else if (viewMode === 'year') {
      return currentYear.toString();
    }
    return `${MONTHS[currentMonth]} ${currentYear}`;
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Title and Navigation */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold">
              {getTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPrevious}
              className="btn btn-sm btn-ghost btn-circle"
              title={`${viewMode === 'day' ? 'Jour' : viewMode === 'week' ? 'Semaine' : viewMode === 'year' ? 'Année' : 'Mois'} précédent${viewMode === 'year' || viewMode === 'week' ? 'e' : ''}`}
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
              onClick={goToNext}
              className="btn btn-sm btn-ghost btn-circle"
              title={`${viewMode === 'day' ? 'Jour' : viewMode === 'week' ? 'Semaine' : viewMode === 'year' ? 'Année' : 'Mois'} suivant${viewMode === 'year' || viewMode === 'week' ? 'e' : ''}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Month and Year Selectors - only for month view */}
        {viewMode === 'month' && (
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
        )}

        {/* View Mode Toggle */}
        <div className="btn-group">
          <button
            className={clsx(
              'btn btn-sm',
              viewMode === 'day' ? 'btn-active' : 'btn-ghost'
            )}
            onClick={() => handleViewModeChange('day')}
            title="Vue jour"
          >
            Jour
          </button>
          <button
            className={clsx(
              'btn btn-sm',
              viewMode === 'week' ? 'btn-active' : 'btn-ghost'
            )}
            onClick={() => handleViewModeChange('week')}
            title="Vue semaine"
          >
            Semaine
          </button>
          <button
            className={clsx(
              'btn btn-sm',
              viewMode === 'month' ? 'btn-active' : 'btn-ghost'
            )}
            onClick={() => handleViewModeChange('month')}
          >
            Mois
          </button>
          <button
            className={clsx(
              'btn btn-sm',
              viewMode === 'year' ? 'btn-active' : 'btn-ghost'
            )}
            onClick={() => handleViewModeChange('year')}
            title="Vue année"
          >
            Année
          </button>
        </div>
      </div>

      {/* Calendar Content - Switch based on view mode */}
      {viewMode === 'day' && (
        <CalendarDayView
          currentDate={currentDate}
          bookings={bookings}
          onDayClick={onDayClick}
          onBookingClick={onBookingClick}
        />
      )}

      {viewMode === 'week' && (
        <CalendarWeekView
          currentDate={currentDate}
          bookings={bookings}
          onDayClick={onDayClick}
          onBookingClick={onBookingClick}
        />
      )}

      {viewMode === 'month' && (
        <>
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
        </>
      )}

      {viewMode === 'year' && (
        <CalendarYearView
          currentDate={currentDate}
          bookings={bookings}
          onMonthClick={handleMonthClick}
        />
      )}

      {/* Legend - show for all views except day */}
      {viewMode !== 'day' && (
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
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
      )}
    </div>
  );
};

export default CalendarView;
