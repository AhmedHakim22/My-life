import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { importAhmed2027GoalsPlan } from '../ahmedGoalsImporter';
import { importAhmed2026BridgeGoalsPlan } from '../ahmedGoals2026BridgeImporter';
import type { Goal } from '../../types';

describe("Ahmed's 2026 Bridge Plan (Nov & Dec 2026) — Importer & Linking Tests", () => {
  beforeEach(async () => {
    for (const table of db.tables) {
      await table.clear();
    }
  });

  it('runs a clean dry-run verifying all 32 bridge goals and 64 tasks without database mutation', async () => {
    // 1. First import 2027 architecture
    await importAhmed2027GoalsPlan({ dryRun: false });
    const initialGoalsCount = await db.goals.count();
    const initialTasksCount = await db.tasks.count();
    expect(initialGoalsCount).toBe(195);
    expect(initialTasksCount).toBe(0);

    // 2. Dry run 2026 bridge plan
    const report = await importAhmed2026BridgeGoalsPlan({ dryRun: true });

    expect(report.dryRun).toBe(true);
    expect(report.totalGoalsInPlan).toBe(32);
    expect(report.totalTasksInPlan).toBe(64);
    expect(report.goalsCountsByHorizon.annual).toBe(8);
    expect(report.goalsCountsByHorizon.quarterly).toBe(8);
    expect(report.goalsCountsByHorizon.monthly).toBe(16);
    expect(report.goalsAdded).toBe(32);
    expect(report.tasksAdded).toBe(64);

    // Verify DB count did NOT change during dry run
    expect(await db.goals.count()).toBe(initialGoalsCount);
    expect(await db.tasks.count()).toBe(0);
  });

  it('imports all 32 bridge goals and 64 tasks, linking them cleanly to 2031 Visions and 2027 Goals', async () => {
    // 1. Seed 2027 Architecture
    await importAhmed2027GoalsPlan({ dryRun: false });

    // 2. Import 2026 Bridge
    const report = await importAhmed2026BridgeGoalsPlan({ dryRun: false });

    expect(report.goalsAdded).toBe(32);
    expect(report.tasksAdded).toBe(64);

    // Total goals is now 195 + 32 = 227
    const totalGoals = await db.goals.count();
    expect(totalGoals).toBe(227);

    // Total tasks is now 64
    const totalTasks = await db.tasks.count();
    expect(totalTasks).toBe(64);

    // 3. Verify hierarchy for University Track:
    // Monthly Nov -> Quarterly Q4 -> Annual Bridge -> Vision Science
    const novUniGoal = await db.goals.get('B26-M11-UNI');
    expect(novUniGoal).toBeDefined();
    expect(novUniGoal?.horizon).toBe('MONTHLY');
    expect(novUniGoal?.parentGoalId).toBe('B26-Q4-UNI');
    expect(novUniGoal?.bridge2026).toBe(true);
    expect(novUniGoal?.relatedExisting2027GoalIds).toContain('A-UNI');

    const q4UniGoal = await db.goals.get('B26-Q4-UNI');
    expect(q4UniGoal).toBeDefined();
    expect(q4UniGoal?.horizon).toBe('QUARTERLY');
    expect(q4UniGoal?.parentGoalId).toBe('B26-A-UNI');

    const annualUniGoal = await db.goals.get('B26-A-UNI');
    expect(annualUniGoal).toBeDefined();
    expect(annualUniGoal?.horizon).toBe('ANNUAL');
    expect(annualUniGoal?.parentGoalId).toBe('V-SCIENCE');

    // 4. Verify 2027 goals remained completely untouched
    const aUni2027 = await db.goals.get('A-UNI');
    expect(aUni2027).toBeDefined();
    expect(aUni2027?.parentGoalId).toBe('V-SCIENCE');
    expect(aUni2027?.bridge2026).toBeFalsy();
  });

  it('guarantees idempotency — running twice produces exactly 0 duplicate goals and 0 duplicate tasks', async () => {
    await importAhmed2027GoalsPlan({ dryRun: false });

    // 1st run
    const firstReport = await importAhmed2026BridgeGoalsPlan({ dryRun: false });
    expect(firstReport.goalsAdded).toBe(32);
    expect(firstReport.tasksAdded).toBe(64);

    const goalsCount1 = await db.goals.count();
    const tasksCount1 = await db.tasks.count();

    // 2nd run
    const secondReport = await importAhmed2026BridgeGoalsPlan({ dryRun: false });
    expect(secondReport.goalsAdded).toBe(0);
    expect(secondReport.tasksAdded).toBe(0);
    expect(secondReport.goalsPreservedOrMatched).toBe(32);
    expect(secondReport.tasksPreservedOrMatched).toBe(64);

    const goalsCount2 = await db.goals.count();
    const tasksCount2 = await db.tasks.count();
    expect(goalsCount2).toBe(goalsCount1);
    expect(tasksCount2).toBe(tasksCount1);
  });

  it('strictly enforces 0 XP baseline: all tasks are TODO, goals have 0 progress, no XP transactions created', async () => {
    await importAhmed2027GoalsPlan({ dryRun: false });
    await importAhmed2026BridgeGoalsPlan({ dryRun: false });

    // No XP was awarded
    const xpCount = await db.xpTransactions.count();
    expect(xpCount).toBe(0);

    // All 64 tasks are TODO
    const allTasks = await db.tasks.toArray();
    expect(allTasks.length).toBe(64);
    for (const t of allTasks) {
      expect(t.status).toBe('TODO');
      expect(t.postponementCount).toBe(0);
      expect(t.dueDate).toBeDefined();
    }

    // Bridge goals have progress 0
    const bridgeGoals = await db.goals.filter(g => g.bridge2026 === true).toArray();
    expect(bridgeGoals.length).toBe(32);
    for (const bg of bridgeGoals) {
      expect(bg.progressPercentage).toBe(0);
      expect(bg.status).toBe('IN_PROGRESS');
    }
  });

  it('respects midterm exam protection period (Nov 7-21) and marks protected tasks with P1 priority', async () => {
    await importAhmed2027GoalsPlan({ dryRun: false });
    await importAhmed2026BridgeGoalsPlan({ dryRun: false });

    // Midterm exam task during Nov 7-21
    const examTask = await db.tasks.get('UNI11-03');
    expect(examTask).toBeDefined();
    expect(examTask?.dueDate).toBe('2026-11-21');
    expect(examTask?.priority).toBe('P1_URGENT_IMPORTANT');
    expect(examTask?.isLocked).toBe(true);

    // Protected university goal tasks
    const uniTask1 = await db.tasks.get('UNI11-01');
    expect(uniTask1).toBeDefined();
    expect(uniTask1?.priority).toBe('P1_URGENT_IMPORTANT');
  });

  it('preserves existing custom "قراءة 75" and links B26-A-READ to it seamlessly', async () => {
    // Pre-create custom reading goal with user progress
    const customReadingGoal: Goal = {
      id: 'custom-reading-uuid-999',
      title: 'قراءة 75 كتاباً وتطوير الثقافة',
      whyItMatters: 'نص أحمد المخصص',
      horizon: 'LONG_TERM',
      targetDate: '2030-01-01',
      status: 'IN_PROGRESS',
      progressPercentage: 42,
      isArchived: false,
      createdAt: '2026-08-01T12:00:00.000Z',
      updatedAt: '2026-08-01T12:00:00.000Z'
    };
    await db.goals.put(customReadingGoal);

    // Import 2027 (will preserve custom-reading-uuid-999 as V-READ)
    await importAhmed2027GoalsPlan({ dryRun: false });

    // Import 2026 Bridge
    await importAhmed2026BridgeGoalsPlan({ dryRun: false });

    // Verify B26-A-READ is linked to custom-reading-uuid-999
    const bridgeReadGoal = await db.goals.get('B26-A-READ');
    expect(bridgeReadGoal).toBeDefined();
    expect(bridgeReadGoal?.parentGoalId).toBe('custom-reading-uuid-999');

    // Verify user progress on reading goal is untouched
    const preservedReading = await db.goals.get('custom-reading-uuid-999');
    expect(preservedReading?.progressPercentage).toBe(42);
  });
});
