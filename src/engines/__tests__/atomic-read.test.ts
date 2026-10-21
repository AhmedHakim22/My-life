import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';
import { getCairoDateString } from '../../lib/dateUtils';

describe('Atomic Read 2 Pages Action & Guardrails', () => {
  beforeEach(async () => {
    await db.transaction('rw', db.tables, async () => {
      for (const table of db.tables) {
        await table.clear();
      }
    });
  });

  it('updates book progress, records reading session, completes habit, and awards idempotent XP in one transaction', async () => {
    const store = useAppStore.getState();
    const todayStr = getCairoDateString();

    // 1. Setup Book and Habit
    await db.learningResources.put({
      id: 'res-nano-book',
      type: 'BOOK',
      title: 'Nanotechnology: Understanding Small Systems',
      status: 'IN_PROGRESS',
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z'
    });

    await db.bookDetails.put({
      resourceId: 'res-nano-book',
      author: 'Rogers & Adams',
      totalPages: 100,
      currentPage: 10,
      shelf: 'Reading'
    });

    await db.habits.put({
      id: 'habit-read-2-pages',
      title: 'قراءة صفحتين يومياً',
      targetType: 'PAGES',
      targetValue: 2,
      streakCount: 0,
      consecutiveMisses: 0,
      restDays: [5],
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z'
    });

    await store.loadAllData();

    // 2. Perform Atomic Read
    await store.readTwoPagesAction('res-nano-book');

    // 3. Verify Book Details updated to page 12
    const book = await db.bookDetails.get('res-nano-book');
    expect(book?.currentPage).toBe(12);

    // 4. Verify Reading Session created with exactly 2 pages
    const sessions = await db.readingSessions.where('bookResourceId').equals('res-nano-book').toArray();
    expect(sessions.length).toBe(1);
    expect(sessions[0].pagesRead).toBe(2);
    expect(sessions[0].startPage).toBe(10);
    expect(sessions[0].endPage).toBe(12);

    // 5. Verify Habit completed
    const habit = await db.habits.get('habit-read-2-pages');
    expect(habit?.streakCount).toBe(1);
    expect(habit?.lastCompletedDate).toBe(todayStr);

    // 6. Verify XP Transaction added
    const xpEntries = await db.xpTransactions.where('category').equals('READING').toArray();
    expect(xpEntries.length).toBe(1);
    expect(xpEntries[0].amount).toBe(15);
    expect(xpEntries[0].reason).toContain('Nanotechnology');
  });

  it('guards against zero-page reads when book is already completed', async () => {
    const store = useAppStore.getState();

    await db.learningResources.put({
      id: 'res-finished-book',
      type: 'BOOK',
      title: 'كتاب مكتمل',
      status: 'COMPLETED',
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z'
    });

    await db.bookDetails.put({
      resourceId: 'res-finished-book',
      totalPages: 50,
      currentPage: 50,
      shelf: 'Finished'
    });

    await store.loadAllData();

    // Perform read on finished book
    await store.readTwoPagesAction('res-finished-book');

    // No reading sessions should be recorded
    const sessions = await db.readingSessions.where('bookResourceId').equals('res-finished-book').toArray();
    expect(sessions.length).toBe(0);

    // No XP should be awarded
    const xpEntries = await db.xpTransactions.where('category').equals('READING').toArray();
    expect(xpEntries.length).toBe(0);
  });
});
