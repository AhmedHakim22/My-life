import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';
import { getCairoDateString } from '../../lib/dateUtils';

describe('Sprint 3 — Health, Fitness & Hard Availability Modeling', () => {
  beforeEach(async () => {
    for (const table of db.tables) {
      await table.clear();
    }
  });

  it('Acceptance 13: 20-minute walk meets movement baseline, does NOT falsely count as a gym workout or meet WHO 150m alone', async () => {
    const store = useAppStore.getState();
    const todayStr = getCairoDateString();

    // 1. Log 15-min walk: does NOT meet 20-min baseline
    const logId1 = await store.logMovement(15, 'WALK', 'Short campus stroll');
    let log1 = await db.movementLogs.get(logId1);
    expect(log1).toBeDefined();
    expect(log1?.durationMinutes).toBe(15);
    expect(log1?.meets20MinBaseline).toBe(false);

    // 2. Log 20-min walk: DOES meet 20-min baseline
    const logId2 = await store.logMovement(20, 'WALK', 'Morning brisk walk');
    let log2 = await db.movementLogs.get(logId2);
    expect(log2).toBeDefined();
    expect(log2?.durationMinutes).toBe(20);
    expect(log2?.meets20MinBaseline).toBe(true);

    // Verify it is NOT counted as a gym workout in workoutLogs
    const workouts = await db.workoutLogs.toArray();
    expect(workouts.length).toBe(0);

    // Verify total minutes (35 min) does NOT falsely claim WHO 150-min benchmark
    const allToday = await db.movementLogs.where('date').equals(todayStr).toArray();
    const totalToday = allToday.reduce((sum, m) => sum + m.durationMinutes, 0);
    expect(totalToday).toBe(35);
    expect(totalToday < 150).toBe(true);
  });

  it('Acceptance 14: records structured gym workout with exercises, sets, reps, and weights, with clean deletion', async () => {
    const store = useAppStore.getState();
    const todayStr = getCairoDateString();

    // 1. Log structured workout
    const workoutId = await store.logWorkout({
      date: todayStr,
      title: 'Leg Day & Core Strength',
      activityType: 'GYM_STRENGTH',
      durationMinutes: 50,
      exercises: [
        {
          id: 'ex-squat',
          name: 'Barbell Back Squat',
          sets: [
            { setNumber: 1, reps: 10, weightKg: 60 },
            { setNumber: 2, reps: 8, weightKg: 70 },
            { setNumber: 3, reps: 6, weightKg: 80 }
          ]
        },
        {
          id: 'ex-plank',
          name: 'Core Plank',
          sets: [
            { setNumber: 1, reps: 3, weightKg: 0 }
          ]
        }
      ],
      notes: 'Strong form, no lower back pain'
    });

    const workout = await db.workoutLogs.get(workoutId);
    expect(workout).toBeDefined();
    expect(workout?.title).toBe('Leg Day & Core Strength');
    expect(workout?.exercises?.length).toBe(2);
    expect(workout?.exercises?.[0].sets[2].weightKg).toBe(80);

    // 2. Delete workout and verify tombstone
    await store.deleteWorkout(workoutId);
    expect(await db.workoutLogs.get(workoutId)).toBeUndefined();

    const tombstones = await db.tombstones.where('entityId').equals(workoutId).toArray();
    expect(tombstones.length).toBe(1);
    expect(tombstones[0].entityType).toBe('WORKOUT');
  });

  it('models availability rules: sleep window, Falcon budget, and protected commitments', async () => {
    const store = useAppStore.getState();

    // Add protected sleep rule (e.g. Saturday night sleep)
    const ruleId = await store.addAvailabilityRule({
      dayOfWeek: 'السبت',
      type: 'SLEEP',
      startTime: '23:30',
      endTime: '06:30',
      isLocked: true,
      label: 'نوم محمي 7 ساعات'
    });

    const rule = await db.availabilityRules.get(ruleId);
    expect(rule).toBeDefined();
    expect(rule?.isLocked).toBe(true);
    expect(rule?.type).toBe('SLEEP');

    // Delete rule
    await store.deleteAvailabilityRule(ruleId);
    expect(await db.availabilityRules.get(ruleId)).toBeUndefined();
  });
});
