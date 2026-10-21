import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';

// Simple in-memory localStorage polyfill for Node test environment
const mockStorage: Record<string, string> = {};
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, val: string) => { mockStorage[key] = val; },
    removeItem: (key: string) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
  };
}

describe('Sprint 1 — Controlled 0 XP Baseline Reset', () => {
  beforeEach(async () => {
    for (const table of db.tables) {
      await table.clear();
    }
  });

  it('resets XP to genuine 0 points, records xpResetEvents ledger, and takes a restorable backup', async () => {
    const store = useAppStore.getState();

    // 1. Simulate prior XP transactions (e.g. 500 XP)
    const now = new Date().toISOString();
    await db.xpTransactions.bulkAdd([
      {
        id: 'xp-1',
        idempotencyKey: 'key-1',
        amount: 250,
        category: 'STUDY',
        reason: 'Sample study session',
        createdAt: now
      },
      {
        id: 'xp-2',
        idempotencyKey: 'key-2',
        amount: 250,
        category: 'READING',
        reason: 'Sample reading session',
        createdAt: now
      }
    ]);

    await store.loadAllData();
    expect(useAppStore.getState().rankProgress.totalXP).toBe(500);

    // 2. Perform controlled baseline reset
    await store.resetXPToZeroBaseline('Owner requested clean start for V2');

    // 3. Verify total XP is now exactly 0
    const stateAfter = useAppStore.getState();
    expect(stateAfter.rankProgress.totalXP).toBe(0);
    expect(stateAfter.rankProgress.currentRank.level).toBe(1);
    expect(stateAfter.rankProgress.currentRank.titleArabic).toBe('طالب عِلْم');

    // 4. Verify xpResetEvents ledger contains the audit trail
    const events = await db.xpResetEvents.toArray();
    expect(events.length).toBe(1);
    expect(events[0].previousTotalXP).toBe(500);
    expect(events[0].transactionsArchivedCount).toBe(2);
    expect(events[0].backupKey).toContain('MASAAR_PRE_RESET_BACKUP');

    // 5. Verify pre-reset backup was stored in localStorage
    const savedBackupStr = localStorage.getItem(events[0].backupKey);
    expect(savedBackupStr).toBeDefined();
    const parsedBackup = JSON.parse(savedBackupStr!);
    expect(parsedBackup.xpTransactions.length).toBe(2);
  });
});
