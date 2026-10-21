import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';
import { calculateQiyamDuration, getPrayerBuffers } from '../prayer';
import { getCairoDateString } from '../../lib/dateUtils';

describe('Sprint 2 — Faith, Intentions, Quran & Qiyam al-Layl Engine', () => {
  beforeEach(async () => {
    for (const table of db.tables) {
      await table.clear();
    }
  });

  it('verifies Quran reading threshold: 2 pages fails 3-page threshold, 3 pages succeeds, with 0 fake XP', async () => {
    const store = useAppStore.getState();
    const todayStr = getCairoDateString();

    // Setup initial Quran habit
    await db.habits.add({
      id: 'habit-quran',
      title: 'الورد القرآني (3 صفحات يومياً)',
      targetType: 'PAGES',
      targetValue: 3,
      streakCount: 0,
      consecutiveMisses: 0,
      restDays: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    await store.loadAllData();

    // 1. Log 2 pages
    await store.logQuranReading(2, 'سورة الكهف');

    let quranLogs = await db.quranLogs.where('date').equals(todayStr).toArray();
    let totalPages = quranLogs.reduce((sum, q) => sum + q.pagesRead, 0);
    expect(totalPages).toBe(2);

    let habit = await db.habits.get('habit-quran');
    // Threshold is 3 pages -> 2 pages does NOT complete habit
    expect(habit?.lastCompletedDate).toBeUndefined();
    expect(habit?.streakCount).toBe(0);

    // 2. Log another 1 page (total = 3 pages)
    await store.logQuranReading(1, 'سورة الكهف');

    quranLogs = await db.quranLogs.where('date').equals(todayStr).toArray();
    totalPages = quranLogs.reduce((sum, q) => sum + q.pagesRead, 0);
    expect(totalPages).toBe(3);

    habit = await db.habits.get('habit-quran');
    // Threshold met! Habit completed for today
    expect(habit?.lastCompletedDate).toBe(todayStr);
    expect(habit?.streakCount).toBe(1);

    // 3. Verify zero fake XP was granted for worship
    const xpEntries = await db.xpTransactions.toArray();
    expect(xpEntries.length).toBe(0);
  });

  it('calculates Qiyam al-Layl duration accurately across midnight (e.g. 23:30 to 00:20 = 50 min)', async () => {
    // Pure calculation test
    const durationMidnightCrossing = calculateQiyamDuration('23:30', '00:20');
    expect(durationMidnightCrossing).toBe(50);

    const durationNormal = calculateQiyamDuration('02:00', '03:15');
    expect(durationNormal).toBe(75);

    // Store logging test
    const store = useAppStore.getState();
    const todayStr = getCairoDateString();

    const sessionId = await store.logQiyamSession({
      date: todayStr,
      startTime: '23:30',
      endTime: '00:20',
      durationMinutes: durationMidnightCrossing,
      rakahsCount: 8,
      notes: 'دعاء وتدبر آيات سورة الإسراء'
    });

    const session = await db.qiyamSessions.get(sessionId);
    expect(session).toBeDefined();
    expect(session?.durationMinutes).toBe(50);
    expect(session?.rakahsCount).toBe(8);
  });

  it('logs daily prayer worship accurately with mosque and completion status', async () => {
    const store = useAppStore.getState();
    const todayStr = getCairoDateString();

    await store.logPrayerWorship('Fajr', 'COMPLETED', true);
    await store.logPrayerWorship('Dhuhr', 'COMPLETED', false);

    const fajrLog = await db.worshipLogs.get(`worship-${todayStr}-Fajr`);
    expect(fajrLog).toBeDefined();
    expect(fajrLog?.prayerName).toBe('Fajr');
    expect(fajrLog?.status).toBe('COMPLETED');
    expect(fajrLog?.inMosque).toBe(true);

    const dhuhrLog = await db.worshipLogs.get(`worship-${todayStr}-Dhuhr`);
    expect(dhuhrLog?.inMosque).toBe(false);

    // Verify buffer helper
    const testDate = new Date('2026-10-22T12:00:00Z');
    const buffers = getPrayerBuffers(testDate, 15, 20);
    expect(buffers.start.getTime()).toBe(testDate.getTime() - 15 * 60000);
    expect(buffers.end.getTime()).toBe(testDate.getTime() + 20 * 60000);
  });

  it('manages private intentions lifecycle and links them deeply to goals', async () => {
    const store = useAppStore.getState();

    // 1. Create a goal
    const goalId = await store.createGoal({
      title: 'Be ready for semiconductor internship',
      whyItMatters: 'Build technical foundation in nano-fabrication',
      horizon: 'ANNUAL',
      status: 'IN_PROGRESS',
      isArchived: false
    });

    // 2. Create an intention
    const intentId = await store.addIntention({
      title: 'إخلاص النية لله ونفع الأمة بالتقنية المتقدمة',
      purpose: 'تحويل دراسة النانوتكنولوجي إلى عبادة وسعي في عمارة الأرض',
      reference: 'وقل اعملوا فسيرى الله عملكم ورسوله والمؤمنون'
    });

    const intent = await db.intentions.get(intentId);
    expect(intent).toBeDefined();
    expect(intent?.title).toContain('إخلاص النية');

    // 3. Link intention to goal
    await store.linkIntentionToGoal(goalId, intentId);

    const links = await db.goalIntentions.toArray();
    expect(links.length).toBe(1);
    expect(links[0].goalId).toBe(goalId);
    expect(links[0].intentionId).toBe(intentId);

    // 4. Update intention
    await store.updateIntention(intentId, {
      purpose: 'تحديث المقصد والنية الصادقة'
    });
    const updated = await db.intentions.get(intentId);
    expect(updated?.purpose).toBe('تحديث المقصد والنية الصادقة');

    // 5. Unlink intention
    await store.unlinkIntentionFromGoal(goalId, intentId);
    expect((await db.goalIntentions.toArray()).length).toBe(0);
    expect(await db.intentions.get(intentId)).toBeDefined();
    expect(await db.goals.get(goalId)).toBeDefined();

    // 6. Delete intention and verify tombstone
    await store.deleteIntention(intentId);
    expect(await db.intentions.get(intentId)).toBeUndefined();
    const tombstones = await db.tombstones.where('entityId').equals(intentId).toArray();
    expect(tombstones.length).toBe(1);
  });
});
