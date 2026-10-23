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

  it('updates goal details and reflects changes accurately', async () => {
    const store = useAppStore.getState();

    const goalId = await store.createGoal({
      title: 'هدف قبل التعديل',
      whyItMatters: 'سبب قديم',
      horizon: 'MONTHLY',
      status: 'IN_PROGRESS',
      isArchived: false
    });

    await store.updateGoal(goalId, {
      title: 'هدف بعد التعديل والتصحيح',
      whyItMatters: 'سبب جديد ومحدث',
      horizon: 'QUARTERLY',
      status: 'PAUSED'
    });

    const updated = await db.goals.get(goalId);
    expect(updated?.title).toBe('هدف بعد التعديل والتصحيح');
    expect(updated?.whyItMatters).toBe('سبب جديد ومحدث');
    expect(updated?.horizon).toBe('QUARTERLY');
    expect(updated?.status).toBe('PAUSED');
  });

  it('updates milestone weight and recalculates progress immediately', async () => {
    const store = useAppStore.getState();

    const goalId = await store.createGoal({
      title: 'هدف لاختبار تعديل المعالم',
      whyItMatters: 'اختبار دقة قياس الأوزان',
      horizon: 'QUARTERLY',
      status: 'IN_PROGRESS',
      isArchived: false
    });

    const msA = await store.addGoalMilestone({
      goalId,
      title: 'المعلم الأول',
      status: 'COMPLETED',
      sortOrder: 1,
      weight: 20
    });

    const msB = await store.addGoalMilestone({
      goalId,
      title: 'المعلم الثاني',
      status: 'PENDING',
      sortOrder: 2,
      weight: 80
    });

    let goal = await db.goals.get(goalId);
    expect(goal?.progressPercentage).toBe(20);

    // User measured wrong and adjusts weights: msA becomes 50%, msB becomes 50%
    await store.updateMilestone(msA, { weight: 50 });
    await store.updateMilestone(msB, { weight: 50 });

    goal = await db.goals.get(goalId);
    // 50 / (50 + 50) = 50%
    expect(goal?.progressPercentage).toBe(50);
  });

  it('deletes a goal cleanly: removes milestones, junctions, unlinks tasks, and records tombstones', async () => {
    const store = useAppStore.getState();

    const parentGoalId = await store.createGoal({
      title: 'الهدف الأب المراد حذفه',
      whyItMatters: 'فحص الحذف النظيف',
      horizon: 'ANNUAL',
      status: 'IN_PROGRESS',
      isArchived: false
    });

    const childGoalId = await store.createGoal({
      title: 'هدف فرعي',
      whyItMatters: 'فحص فك الارتباط',
      horizon: 'QUARTERLY',
      parentGoalId,
      status: 'IN_PROGRESS',
      isArchived: false
    });

    const msId = await store.addGoalMilestone({
      goalId: parentGoalId,
      title: 'معلم الهدف الأب',
      status: 'PENDING',
      sortOrder: 1,
      weight: 100
    });

    await store.addTask(
      'مهمة مرتبطة بالهدف الأب',
      'P2_IMPORTANT',
      30,
      '2026-10-23',
      parentGoalId
    );

    let tasks = await db.tasks.where('goalId').equals(parentGoalId).toArray();
    expect(tasks.length).toBe(1);

    // Delete the parent goal
    await store.deleteGoal(parentGoalId);

    // Goal is deleted from DB
    const deletedGoal = await db.goals.get(parentGoalId);
    expect(deletedGoal).toBeUndefined();

    // Milestone is deleted from DB
    const deletedMs = await db.goalMilestones.get(msId);
    expect(deletedMs).toBeUndefined();

    // Task is unlinked (not deleted, goalId set to undefined)
    const task = await db.tasks.get(tasks[0].id);
    expect(task).toBeDefined();
    expect(task?.goalId).toBeUndefined();

    // Child goal has parentGoalId unlinked
    const childGoal = await db.goals.get(childGoalId);
    expect(childGoal).toBeDefined();
    expect(childGoal?.parentGoalId).toBeUndefined();

    // Tombstones recorded for goal and milestone
    const goalTomb = await db.tombstones.where('entityId').equals(parentGoalId).first();
    expect(goalTomb).toBeDefined();
    const msTomb = await db.tombstones.where('entityId').equals(msId).first();
    expect(msTomb).toBeDefined();
  });
});
