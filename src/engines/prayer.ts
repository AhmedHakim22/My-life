import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export type PrayerDstMode = 'AUTO' | 'SUMMER' | 'WINTER';

export interface CairoPrayerInfo {
  name: string;
  nameArabic: string;
  time: Date;
  timeFormatted: string;
  isNext: boolean;
  minutesRemaining?: number;
}

export interface DayPrayersResult {
  fajr: CairoPrayerInfo;
  sunrise: CairoPrayerInfo;
  dhuhr: CairoPrayerInfo;
  asr: CairoPrayerInfo;
  maghrib: CairoPrayerInfo;
  isha: CairoPrayerInfo;
  nextPrayer: CairoPrayerInfo;
  freeWindowMinutes: number; // minutes until next prayer
  dstMode: PrayerDstMode;
  isSummerTime: boolean;
  dstOffsetHours: number;
  dstLabel: string;
}

// Cairo Coordinates: 30.0444° N, 31.2357° E
const CAIRO_LAT = 30.0444;
const CAIRO_LNG = 31.2357;

/**
 * Authoritative Egyptian Daylight Saving Time (DST) detector.
 * Law No. 24 of 2023:
 * - Summer time (UTC+3) starts on the last Friday of April at 00:00
 * - Winter time (UTC+2) starts on the last Thursday of October at 24:00 (i.e. Friday at 00:00)
 */
export function isEgyptianSummerTime(date: Date = new Date()): boolean {
  const year = date.getFullYear();

  // Find last Friday of April
  let aprDay = 30;
  while (new Date(year, 3, aprDay).getDay() !== 5) {
    aprDay--;
  }
  const summerStart = new Date(year, 3, aprDay, 0, 0, 0);

  // Find last Thursday of October
  let octDay = 31;
  while (new Date(year, 9, octDay).getDay() !== 4) {
    octDay--;
  }
  const summerEnd = new Date(year, 9, octDay, 23, 59, 59, 999);

  return date >= summerStart && date <= summerEnd;
}

/**
 * Returns the effective UTC offset in hours for Cairo (+3 for Summer, +2 for Winter)
 */
export function getEgyptianDstOffsetHours(date: Date = new Date(), mode: PrayerDstMode = 'AUTO'): number {
  if (mode === 'SUMMER') return 3;
  if (mode === 'WINTER') return 2;
  return isEgyptianSummerTime(date) ? 3 : 2;
}

/**
 * Formats a UTC Date to 12-hour Arabic string with explicit offset (e.g., '05:34 ص' or '12:41 م')
 */
export function formatPrayerTimeWithOffset(utcDate: Date, offsetHours: number): string {
  const utcMs = utcDate.getTime();
  const cairoTime = new Date(utcMs + offsetHours * 3600000);
  let h = cairoTime.getUTCHours();
  const m = cairoTime.getUTCMinutes().toString().padStart(2, '0');
  const period = h >= 12 ? 'م' : 'ص';
  h = h % 12 || 12;
  const hStr = h.toString().padStart(2, '0');
  return `${hStr}:${m} ${period}`;
}

export function getCairoPrayerTimes(
  date: Date = new Date(),
  dstMode: PrayerDstMode = 'AUTO'
): DayPrayersResult {
  const coordinates = new Coordinates(CAIRO_LAT, CAIRO_LNG);
  
  // Egyptian General Authority of Survey parameters
  const params = CalculationMethod.Egyptian();
  const prayerTimes = new PrayerTimes(coordinates, date, params);

  const offsetHours = getEgyptianDstOffsetHours(date, dstMode);
  const isSummer = offsetHours === 3;
  const dstLabel = isSummer ? 'التوقيت الصيفي (UTC+3)' : 'التوقيت الشتوي (UTC+2)';

  const nowMs = date.getTime();

  // Create localized Date instances with target offset
  const createAdjustedDate = (rawUtcDate: Date) => {
    // If device local timezone is different from Cairo offset, adjust timestamp for comparison
    return new Date(rawUtcDate.getTime());
  };

  const prayersRaw = [
    { key: 'fajr', name: 'Fajr', nameArabic: 'الفجر', time: createAdjustedDate(prayerTimes.fajr), raw: prayerTimes.fajr },
    { key: 'sunrise', name: 'Sunrise', nameArabic: 'الشروق', time: createAdjustedDate(prayerTimes.sunrise), raw: prayerTimes.sunrise },
    { key: 'dhuhr', name: 'Dhuhr', nameArabic: 'الظهر', time: createAdjustedDate(prayerTimes.dhuhr), raw: prayerTimes.dhuhr },
    { key: 'asr', name: 'Asr', nameArabic: 'العصر', time: createAdjustedDate(prayerTimes.asr), raw: prayerTimes.asr },
    { key: 'maghrib', name: 'Maghrib', nameArabic: 'المغرب', time: createAdjustedDate(prayerTimes.maghrib), raw: prayerTimes.maghrib },
    { key: 'isha', name: 'Isha', nameArabic: 'العشاء', time: createAdjustedDate(prayerTimes.isha), raw: prayerTimes.isha }
  ];

  // Find next upcoming prayer
  let nextPrayerRaw = prayersRaw.find(p => p.time.getTime() > nowMs);
  if (!nextPrayerRaw) {
    // Past Isha: next is tomorrow's Fajr
    const tomorrow = new Date(date);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPrayers = new PrayerTimes(coordinates, tomorrow, params);
    nextPrayerRaw = {
      key: 'fajr',
      name: 'Fajr',
      nameArabic: 'الفجر',
      time: createAdjustedDate(tomorrowPrayers.fajr),
      raw: tomorrowPrayers.fajr
    };
  }

  const minutesRemaining = Math.max(0, Math.round((nextPrayerRaw.time.getTime() - nowMs) / 60000));

  const buildInfo = (p: { key: string; name: string; nameArabic: string; time: Date; raw: Date }) => ({
    name: p.name,
    nameArabic: p.nameArabic,
    time: p.time,
    timeFormatted: formatPrayerTimeWithOffset(p.raw, offsetHours),
    isNext: p.key === nextPrayerRaw.key && Math.abs(p.time.getTime() - nextPrayerRaw.time.getTime()) < 1000,
    minutesRemaining: p.key === nextPrayerRaw.key ? minutesRemaining : undefined
  });

  return {
    fajr: buildInfo(prayersRaw[0]),
    sunrise: buildInfo(prayersRaw[1]),
    dhuhr: buildInfo(prayersRaw[2]),
    asr: buildInfo(prayersRaw[3]),
    maghrib: buildInfo(prayersRaw[4]),
    isha: buildInfo(prayersRaw[5]),
    nextPrayer: buildInfo(nextPrayerRaw),
    freeWindowMinutes: minutesRemaining,
    dstMode,
    isSummerTime: isSummer,
    dstOffsetHours: offsetHours,
    dstLabel
  };
}

/**
 * Calculates prayer time window with configurable buffers (e.g. 15m before, 15m after).
 */
export function getPrayerBuffers(prayerTime: Date, bufferBeforeMinutes = 15, bufferAfterMinutes = 15) {
  const start = new Date(prayerTime.getTime() - bufferBeforeMinutes * 60000);
  const end = new Date(prayerTime.getTime() + bufferAfterMinutes * 60000);
  return { start, end };
}

/**
 * Calculates Qiyam al-Layl duration in minutes, with accurate cross-midnight arithmetic.
 * e.g. "23:30" to "00:20" -> 50 minutes.
 */
export function calculateQiyamDuration(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  let startMinutes = sh * 60 + sm;
  let endMinutes = eh * 60 + em;
  if (endMinutes < startMinutes) {
    // Crosses local midnight (e.g. 23:30 to 00:20)
    endMinutes += 24 * 60;
  }
  return Math.max(0, endMinutes - startMinutes);
}
