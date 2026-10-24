import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { importAhmed2027GoalsPlan } from '../ahmedGoalsImporter';
import type { Goal } from '../../types';

describe("Ahmed's 2027 Goals Architecture — Importer & Hierarchy Tests", () => {
  beforeEach(async () => {
    for (const table of db.tables) {
      await table.clear();
    }
  });

  it('runs a clean dry-run verifying all 195 goals without altering database', async () => {
    const report = await importAhmed2027GoalsPlan({ dryRun: true });

    expect(report.dryRun).toBe(true);
    expect(report.totalRecordsInPlan).toBe(195);
    expect(report.countsByHorizon.vision_3_5_years).toBe(8);
    expect(report.countsByHorizon.annual).toBe(11);
    expect(report.countsByHorizon.quarterly).toBe(44);
    expect(report.countsByHorizon.monthly).toBe(132);
    expect(report.goalsAdded).toBe(195);

    // Verify database was NOT touched
    const countInDb = await db.goals.count();
    expect(countInDb).toBe(0);
  });

  it('strictly preserves pre-existing "قراءة 75" goal, retains progress, and links children correctly', async () => {
    const now = new Date().toISOString();
    
    // Seed pre-existing custom reading goal as if user created it in previous sessions
    const existingReadingGoal: Goal = {
      id: 'existing-reading-75-uuid',
      title: 'قراءة 75 كتاباً وتطوير الثقافة',
      whyItMatters: 'نص أحمد الأصلي الذي لا يجوز استبداله',
      horizon: 'LONG_TERM',
      targetDate: '2030-01-01',
      status: 'IN_PROGRESS',
      progressPercentage: 35, // user already has 35% progress
      isArchived: false,
      createdAt: '2026-09-01T10:00:00.000Z',
      updatedAt: '2026-09-01T10:00:00.000Z'
    };
    await db.goals.put(existingReadingGoal);

    // Run import
    const report = await importAhmed2027GoalsPlan({ dryRun: false });

    expect(report.readingGoalPreserved).toBeDefined();
    expect(report.readingGoalPreserved?.id).toBe('existing-reading-75-uuid');
    expect(report.goalsPreservedOrMatched).toBe(1);
    expect(report.goalsAdded).toBe(194); // 195 - 1 = 194

    // Verify existing goal was NOT modified or duplicated
    const preservedGoal = await db.goals.get('existing-reading-75-uuid');
    expect(preservedGoal).toBeDefined();
    expect(preservedGoal?.title).toBe('قراءة 75 كتاباً وتطوير الثقافة');
    expect(preservedGoal?.whyItMatters).toBe('نص أحمد الأصلي الذي لا يجوز استبداله');
    expect(preservedGoal?.progressPercentage).toBe(35); // Progress strictly preserved!

    // Ensure no duplicate V-READ goal was created
    const allGoals = await db.goals.toArray();
    expect(allGoals.length).toBe(195);
    const readingVisions = allGoals.filter(g => g.horizon === 'LONG_TERM' && (g.id === 'V-READ' || g.id === 'existing-reading-75-uuid'));
    expect(readingVisions.length).toBe(1);

    // Verify annual goal A-READ is linked to existing-reading-75-uuid
    const annualReadGoal = await db.goals.get('A-READ');
    expect(annualReadGoal).toBeDefined();
    expect(annualReadGoal?.parentGoalId).toBe('existing-reading-75-uuid');
  });

  it('is completely idempotent — running twice yields exact same records with 0 duplicates', async () => {
    // 1st run
    const firstReport = await importAhmed2027GoalsPlan({ dryRun: false });
    expect(firstReport.goalsAdded).toBe(195);

    const firstCount = await db.goals.count();
    const firstMsCount = await db.goalMilestones.count();
    expect(firstCount).toBe(195);

    // 2nd run
    const secondReport = await importAhmed2027GoalsPlan({ dryRun: false });
    expect(secondReport.goalsAdded).toBe(0);
    expect(secondReport.goalsPreservedOrMatched).toBe(195);

    const secondCount = await db.goals.count();
    const secondMsCount = await db.goalMilestones.count();
    expect(secondCount).toBe(firstCount);
    expect(secondMsCount).toBe(firstMsCount);
  });

  it('establishes a clean, unbroken 4-level hierarchy: Vision -> Annual -> Quarterly -> Monthly', async () => {
    await importAhmed2027GoalsPlan({ dryRun: false });

    // Level 4: Monthly Goal (January Quran)
    const m01Quran = await db.goals.get('M01-QURAN');
    expect(m01Quran).toBeDefined();
    expect(m01Quran?.horizon).toBe('MONTHLY');
    expect(m01Quran?.targetDate).toBe('2027-01-31');
    expect(m01Quran?.parentGoalId).toBe('Q1-QURAN');

    // Level 3: Quarterly Goal (Q1 Quran)
    const q1Quran = await db.goals.get('Q1-QURAN');
    expect(q1Quran).toBeDefined();
    expect(q1Quran?.horizon).toBe('QUARTERLY');
    expect(q1Quran?.targetDate).toBe('2027-03-31');
    expect(q1Quran?.parentGoalId).toBe('A-QURAN');

    // Level 2: Annual Goal (Quran 2027)
    const aQuran = await db.goals.get('A-QURAN');
    expect(aQuran).toBeDefined();
    expect(aQuran?.horizon).toBe('ANNUAL');
    expect(aQuran?.targetDate).toBe('2027-12-31');
    expect(aQuran?.parentGoalId).toBe('V-FAITH');

    // Level 1: Vision 2031 (Faith)
    const vFaith = await db.goals.get('V-FAITH');
    expect(vFaith).toBeDefined();
    expect(vFaith?.horizon).toBe('LONG_TERM');
    expect(vFaith?.targetDate).toBe('2031-12-31');
    expect(vFaith?.parentGoalId).toBeUndefined();

    // Verify milestones were seeded for Q1-QURAN
    const milestones = await db.goalMilestones.where('goalId').equals('Q1-QURAN').toArray();
    expect(milestones.length).toBe(2);
    expect(milestones[0].status).toBe('PENDING');
  });

  it('guarantees 0 XP awarded and all new goals remain planned_not_completed', async () => {
    await importAhmed2027GoalsPlan({ dryRun: false });

    // No XP transactions
    const xpCount = await db.xpTransactions.count();
    expect(xpCount).toBe(0);

    // All imported goals have progress 0 and status IN_PROGRESS
    const goals = await db.goals.toArray();
    for (const g of goals) {
      expect(g.progressPercentage).toBe(0);
      expect(g.status).toBe('IN_PROGRESS');
      expect(g.isArchived).toBe(false);
    }
  });
});
