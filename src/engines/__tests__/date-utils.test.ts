import { describe, it, expect } from 'vitest';
import { getCairoDateString, getCairoTomorrowDateString, getCairoTimeString } from '../../lib/dateUtils';

describe('Cairo Timezone Date Utilities', () => {
  it('formats dates consistently in Africa/Cairo timezone without UTC shift', () => {
    // 11:30 PM UTC on Oct 21 is 1:30 AM Cairo time on Oct 22 (UTC+2 in winter or UTC+3 in summer)
    const lateUtcDate = new Date('2026-10-21T22:30:00Z');
    const cairoDate = getCairoDateString(lateUtcDate);
    // At 22:30 UTC, Cairo is in the next calendar day (Oct 22)
    expect(cairoDate).toBe('2026-10-22');
  });

  it('calculates Cairo tomorrow date accurately across day boundaries', () => {
    const baseDate = new Date('2026-10-22T10:00:00Z');
    const tomorrow = getCairoTomorrowDateString(baseDate);
    expect(tomorrow).toBe('2026-10-23');
  });

  it('formats 24-hour time string in Cairo timezone', () => {
    const noonUtc = new Date('2026-10-22T12:00:00Z');
    const timeStr = getCairoTimeString(noonUtc);
    expect(timeStr).toMatch(/^\d{2}:\d{2}$/);
  });
});
