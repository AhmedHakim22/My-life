/**
 * Cairo Timezone Date Utilities
 * Ensures all daily planning, habit streaks, prayer margins, and logs
 * operate strictly on Africa/Cairo local date without UTC day-shift bugs.
 */

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
