import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';
import { CHALLENGE_90_DAYS_PRESET, CHALLENGE_30_DAYS_PRESET } from '../challengesPresets';

describe('Challenges Engine & 90-Day Challenge System', () => {
  beforeEach(async () => {
    // Clear challenges and logs before each test
    await db.transaction('rw', [db.challenges, db.challengeLogs, db.xpTransactions], async () => {
      await db.challenges.clear();
      await db.challengeLogs.clear();
      await db.xpTransactions.clear();
    });
    useAppStore.setState({ challenges: [], challengeLogs: [], xpTransactions: [] });
  });

  it('validates the 90-day × 90-minute challenge preset specifications', () => {
    expect(CHALLENGE_90_DAYS_PRESET.title).toContain('روتين التسعين يوم');
    expect(CHALLENGE_90_DAYS_PRESET.durationDays).toBe(90);
    expect(CHALLENGE_90_DAYS_PRESET.tasks.length).toBe(7);

    const totalMinutes = CHALLENGE_90_DAYS_PRESET.tasks.reduce((sum, t) => sum + (t.durationMinutes || 0), 0);
    expect(totalMinutes).toBe(90);
    expect(CHALLENGE_90_DAYS_PRESET.xpReward).toBe(1000);
  });

  it('enforces maximum 3 concurrent active challenges constraint', async () => {
    const store = useAppStore.getState();

    // Create 4 challenges
    const c1Id = await store.createChallenge({
      title: 'تحدي 1',
      description: 'وصف 1',
      durationDays: 10,
      tasks: [{ id: 't1', title: 'مهمة 1', durationMinutes: 10, isMandatory: true }],
      status: 'QUEUED',
      category: 'FITNESS',
      xpReward: 100
    });

    const c2Id = await store.createChallenge({
      title: 'تحدي 2',
      description: 'وصف 2',
      durationDays: 10,
      tasks: [{ id: 't2', title: 'مهمة 2', durationMinutes: 10, isMandatory: true }],
      status: 'QUEUED',
      category: 'STUDY',
      xpReward: 100
    });

    const c3Id = await store.createChallenge({
      title: 'تحدي 3',
      description: 'وصف 3',
      durationDays: 10,
      tasks: [{ id: 't3', title: 'مهمة 3', durationMinutes: 10, isMandatory: true }],
      status: 'QUEUED',
      category: 'READING',
      xpReward: 100
    });

    const c4Id = await store.createChallenge({
      title: 'تحدي 4',
      description: 'وصف 4',
      durationDays: 10,
      tasks: [{ id: 't4', title: 'مهمة 4', durationMinutes: 10, isMandatory: true }],
      status: 'QUEUED',
      category: 'MINDSET',
      xpReward: 100
    });

    // Activate first 3
    const res1 = await store.activateChallenge(c1Id);
    expect(res1.success).toBe(true);

    const res2 = await store.activateChallenge(c2Id);
    expect(res2.success).toBe(true);

    const res3 = await store.activateChallenge(c3Id);
    expect(res3.success).toBe(true);

    // Try to activate 4th -> Must be blocked!
    const res4 = await store.activateChallenge(c4Id);
    expect(res4.success).toBe(false);
    expect(res4.reason).toBe('MAX_3_ACTIVE_REACHED');

    const activeList = useAppStore.getState().challenges.filter(c => c.status === 'ACTIVE');
    expect(activeList.length).toBe(3);
  });

  it('supports 1-tap toggling and undo for daily challenge tasks', async () => {
    const store = useAppStore.getState();

    const chalId = await store.createChallenge({
      ...CHALLENGE_30_DAYS_PRESET,
      title: 'تحدي القراءة 30 يوم',
      status: 'ACTIVE'
    });

    const challenge = useAppStore.getState().challenges.find(c => c.id === chalId)!;
    const firstTaskId = challenge.tasks[0].id;

    // Tap to complete
    await store.toggleChallengeTaskToday(chalId, firstTaskId);

    let logs = await db.challengeLogs.where('challengeId').equals(chalId).toArray();
    expect(logs.length).toBe(1);
    expect(logs[0].completedTaskIds).toContain(firstTaskId);

    // Tap again to undo
    await store.toggleChallengeTaskToday(chalId, firstTaskId);

    logs = await db.challengeLogs.where('challengeId').equals(chalId).toArray();
    expect(logs[0].completedTaskIds).not.toContain(firstTaskId);
  });

  it('awards XP upon manual completion of a challenge', async () => {
    const store = useAppStore.getState();

    const chalId = await store.createChallenge({
      title: 'تحدي تجريبي',
      description: 'تجربة',
      durationDays: 7,
      tasks: [{ id: 't1', title: 'مهمة', durationMinutes: 15, isMandatory: true }],
      status: 'ACTIVE',
      category: 'FAITH',
      xpReward: 500
    });

    await store.completeChallengeManually(chalId);

    const updated = useAppStore.getState().challenges.find(c => c.id === chalId)!;
    expect(updated.status).toBe('COMPLETED');
    expect(updated.completedDaysCount).toBe(7);

    const xpTx = await db.xpTransactions.where('category').equals('CHALLENGE').toArray();
    expect(xpTx.length).toBe(1);
    expect(xpTx[0].amount).toBe(500);
  });
});
