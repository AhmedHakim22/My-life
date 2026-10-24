/**
 * Cairo Timezone Date Utilities
 * Ensures all daily planning, habit streaks, prayer margins, and logs
 * operate strictly on Africa/Cairo local date without UTC day-shift bugs.
 */

export type ArabicDay = 'السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';

export const ARABIC_DAYS: ArabicDay[] = [
  'السبت',
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة'
];

export function getCairoDateString(date: Date = new Date()): string {
  // Returns 'YYYY-MM-DD' in Africa/Cairo timezone
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function getCairoTomorrowDateString(date: Date = new Date()): string {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getCairoDateString(tomorrow);
}

export function getCairoTimeString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Cairo',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
}

/**
 * Returns the Saturday (week start) for any given date in Cairo calendar time.
 * Handles month and year boundaries safely.
 */
export function getCairoSaturdayWeekStart(dateOrStr?: Date | string): string {
  let targetDate: Date;
  if (typeof dateOrStr === 'string' && dateOrStr) {
    const parts = dateOrStr.split('-').map(Number);
    targetDate = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  } else if (dateOrStr instanceof Date) {
    targetDate = new Date(dateOrStr.getTime());
  } else {
    const cairoToday = getCairoDateString();
    const parts = cairoToday.split('-').map(Number);
    targetDate = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  }

  const dayOfWeek = targetDate.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const satOffset = dayOfWeek === 6 ? 0 : -(dayOfWeek + 1);
  targetDate.setDate(targetDate.getDate() + satOffset);
  return getCairoDateString(targetDate);
}

/**
 * Safely adds or subtracts days from a 'YYYY-MM-DD' string without UTC distortion.
 */
export function addDaysToDateString(dateStr: string, days: number): string {
  const parts = dateStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  d.setDate(d.getDate() + days);
  return getCairoDateString(d);
}

/**
 * Returns the exact 7 calendar dates for a Saturday-started week.
 */
export function getWeekDates(weekStartDate: string): { dateStr: string; arabicDay: ArabicDay }[] {
  return ARABIC_DAYS.map((arabicDay, index) => ({
    dateStr: addDaysToDateString(weekStartDate, index),
    arabicDay
  }));
}

/**
 * Maps a 'YYYY-MM-DD' date string to its Arabic day name ('السبت' .. 'الجمعة').
 */
export function getArabicDayFromDate(dateStr: string): ArabicDay {
  const parts = dateStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
  const dayIndex = d.getDay(); // 0 = Sun, ..., 6 = Sat
  // Map Sun (0) -> 'الأحد', Mon (1) -> 'الاثنين', ..., Sat (6) -> 'السبت'
  const mapping: Record<number, ArabicDay> = {
    6: 'السبت',
    0: 'الأحد',
    1: 'الاثنين',
    2: 'الثلاثاء',
    3: 'الأربعاء',
    4: 'الخميس',
    5: 'الجمعة'
  };
  return mapping[dayIndex] || 'السبت';
}

/**
 * Checks if a given date falls within the Cairo University Midterm Exam Period (7-21 November 2026).
 */
export function isDateInMidtermExamPeriod(dateStr: string): boolean {
  if (!dateStr) return false;
  return dateStr >= '2026-11-07' && dateStr <= '2026-11-21';
}
