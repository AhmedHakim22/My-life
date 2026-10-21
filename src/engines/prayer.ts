import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

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
}

// Cairo Coordinates: 30.0444° N, 31.2357° E
const CAIRO_LAT = 30.0444;
const CAIRO_LNG = 31.2357;

export function getCairoPrayerTimes(date: Date = new Date()): DayPrayersResult {
  const coordinates = new Coordinates(CAIRO_LAT, CAIRO_LNG);
  
  // Egyptian General Authority of Survey parameters
  const params = CalculationMethod.Egyptian();
  const prayerTimes = new PrayerTimes(coordinates, date, params);

  const formatTime = (d: Date) => {
    return d.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const nowMs = date.getTime();
  const prayersRaw = [
    { key: 'fajr', name: 'Fajr', nameArabic: 'الفجر', time: prayerTimes.fajr },
    { key: 'sunrise', name: 'Sunrise', nameArabic: 'الشروق', time: prayerTimes.sunrise },
    { key: 'dhuhr', name: 'Dhuhr', nameArabic: 'الظهر', time: prayerTimes.dhuhr },
    { key: 'asr', name: 'Asr', nameArabic: 'العصر', time: prayerTimes.asr },
    { key: 'maghrib', name: 'Maghrib', nameArabic: 'المغرب', time: prayerTimes.maghrib },
    { key: 'isha', name: 'Isha', nameArabic: 'العشاء', time: prayerTimes.isha }
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
      time: tomorrowPrayers.fajr
    };
  }

  const minutesRemaining = Math.max(0, Math.round((nextPrayerRaw.time.getTime() - nowMs) / 60000));

  const buildInfo = (p: { key: string; name: string; nameArabic: string; time: Date }) => ({
    name: p.name,
    nameArabic: p.nameArabic,
    time: p.time,
    timeFormatted: formatTime(p.time),
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
    freeWindowMinutes: minutesRemaining
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
