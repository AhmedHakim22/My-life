import { describe, it, expect } from 'vitest';
import {
  isEgyptianSummerTime,
  getEgyptianDstOffsetHours,
  getCairoPrayerTimes,
  formatPrayerTimeWithOffset
} from '../prayer';

describe('Egyptian Daylight Saving Time (DST) & Dynamic Prayer Times', () => {
  it('correctly detects Summer Time (last Friday of April to last Thursday of October)', () => {
    // 2026: Last Friday of April is April 24, 2026
    // Last Thursday of October is Oct 29, 2026
    const summerDate = new Date('2026-07-15T12:00:00Z');
    expect(isEgyptianSummerTime(summerDate)).toBe(true);

    const winterDate = new Date('2026-12-15T12:00:00Z');
    expect(isEgyptianSummerTime(winterDate)).toBe(false);

    const earlySpringDate = new Date('2026-03-10T12:00:00Z');
    expect(isEgyptianSummerTime(earlySpringDate)).toBe(false);
  });

  it('calculates correct UTC offset hours based on mode', () => {
    const summerDate = new Date('2026-07-15T12:00:00Z');
    const winterDate = new Date('2026-12-15T12:00:00Z');

    // AUTO mode
    expect(getEgyptianDstOffsetHours(summerDate, 'AUTO')).toBe(3);
    expect(getEgyptianDstOffsetHours(winterDate, 'AUTO')).toBe(2);

    // Forced SUMMER mode (+1 hour -> UTC+3)
    expect(getEgyptianDstOffsetHours(winterDate, 'SUMMER')).toBe(3);

    // Forced WINTER mode (UTC+2)
    expect(getEgyptianDstOffsetHours(summerDate, 'WINTER')).toBe(2);
  });

  it('formats prayer times reliably using explicit offset', () => {
    // 12:00 UTC with +2 offset -> 02:00 م (14:00)
    const utcDate = new Date('2026-10-22T12:00:00Z');
    const timeWinter = formatPrayerTimeWithOffset(utcDate, 2);
    expect(timeWinter).toBe('02:00 م');

    // 12:00 UTC with +3 offset -> 03:00 م (15:00)
    const timeSummer = formatPrayerTimeWithOffset(utcDate, 3);
    expect(timeSummer).toBe('03:00 م');
  });

  it('computes all 5 Cairo daily prayers plus sunrise dynamically with DST metadata', () => {
    const testDate = new Date('2026-10-22T08:00:00Z');
    const prayers = getCairoPrayerTimes(testDate, 'AUTO');

    expect(prayers.dstMode).toBe('AUTO');
    expect(prayers.isSummerTime).toBe(true); // Oct 22 is before Oct 29
    expect(prayers.dstOffsetHours).toBe(3);
    expect(prayers.dstLabel).toContain('صيفي');

    // Check prayer strings are formatted
    expect(prayers.fajr.timeFormatted).toMatch(/\d{2}:\d{2}\s?(ص|م)/i);
    expect(prayers.dhuhr.timeFormatted).toMatch(/\d{2}:\d{2}\s?(ص|م)/i);
    expect(prayers.asr.timeFormatted).toMatch(/\d{2}:\d{2}\s?(ص|م)/i);
    expect(prayers.maghrib.timeFormatted).toMatch(/\d{2}:\d{2}\s?(ص|م)/i);
    expect(prayers.isha.timeFormatted).toMatch(/\d{2}:\d{2}\s?(ص|م)/i);
  });
});
