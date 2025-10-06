// Calendar helper functions

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  dayNumber: number;
}

export const DAYS_OF_WEEK = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

/**
 * Get all days to display for a given month (including padding days from prev/next month)
 */
export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Calculate padding days from previous month
  const daysFromPrevMonth = firstDayOfWeek;
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - daysFromPrevMonth);

  // Calculate total days to show (always show 6 weeks = 42 days)
  const days: CalendarDay[] = [];
  const totalDays = 42;

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const isCurrentMonth = date.getMonth() === month;
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;

    days.push({
      date,
      isCurrentMonth,
      isToday,
      isWeekend,
      dayNumber: date.getDate(),
    });
  }

  return days;
}

/**
 * Format date to YYYY-MM-DD for API calls
 */
export function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get bookings for a specific day
 */
export function getBookingsForDay(bookings: any[], date: Date): any[] {
  return bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    return isSameDay(bookingDate, date);
  });
}

/**
 * Format time from ISO string
 */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
