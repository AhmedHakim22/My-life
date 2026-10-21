import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';

describe('Goal Center & Progress Engine', () => {
  beforeEach(async () => {
    await db.transaction('rw', db.tables, async () => {
      for (const table of db.tables) {
        await table.clear();
      }
    });
  });

  it('calculates goal progress transparently from weighted milestones and linked tasks', async () => {
    const store = useAppStore.getState();

    // 1. Create an Annual Goal
    const goalId = await store.createGoal({
      title: 'التأهل لتدريب أشباه الموصلات (Qualify for Semiconductor Internship)',
      whyItMatters: 'بناء أساس علمي وعملي في تصنيع الرقائق الإلكترونية',
      horizon: 'ANNUAL',
      targetDate: '2027-06-30',
      status: 'IN_PROGRESS',
      isArchived: false
    });

    expect(goalId).toBeDefined();

    // Initial progress should be 0%
    let goal = await db.goals.get(goalId);
    expect(goal?.progressPercentage).toBe(0);

    // 2. Add two milestones: Milestone A (weight 40), Milestone B (weight 60)
    const msA = await store.addGoalMilestone({
      goalId,
      title: 'إنهاء كورس فيزياء أشباه الموصلات',
      status: 'PENDING',
      sortOrder: 1,
      weight: 40
    });

    const msB = await store.addGoalMilestone({
      goalId,
      title: 'تنفيذ مشروع محاكاة الخلية الشمسية بـ Python',
      status: 'PENDING',
      sortOrder: 2,
      weight: 60
    });

    // 3. Complete Milestone A (40% weight)
    await store.toggleMilestone(msA);

    goal = await db.goals.get(goalId);
    // 40 / 100 = 40%
    expect(goal?.progressPercentage).toBe(40);
    expect(goal?.status).toBe('IN_PROGRESS');

    // 4. Add a linked daily task
    await store.addTask(
      'مراجعة شيت أشباه الموصلات وحل مسائل Band Gap',
      'P1_URGENT_IMPORTANT',
      45,
      '2026-10-22',
      goalId
    );

    const tasks = await db.tasks.where('goalId').equals(goalId).toArray();
    expect(tasks.length).toBe(1);

    // 5. Complete Milestone B -> 100% of milestones completed
    await store.toggleMilestone(msB);

    // 6. Complete the linked task -> 100% of tasks completed
    await store.completeTask(tasks[0].id);

    goal = await db.goals.get(goalId);
    expect(goal?.progressPercentage).toBe(100);
    expect(goal?.status).toBe('ACHIEVED');
  });

  it('handles archiving and unarchiving goals cleanly', async () => {
    const store = useAppStore.getState();

    const goalId = await store.createGoal({
      title: 'هدف تجريبي للأرشفة',
      whyItMatters: 'فحص دورة حياة الهدف',
      horizon: 'QUARTERLY',
      status: 'IN_PROGRESS',
      isArchived: false
    });

    await store.archiveGoal(goalId);
    let goal = await db.goals.get(goalId);
    expect(goal?.isArchived).toBe(true);

    await store.archiveGoal(goalId);
    goal = await db.goals.get(goalId);
    expect(goal?.isArchived).toBe(false);
  });
});
