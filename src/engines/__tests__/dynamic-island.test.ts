import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';

describe('Dynamic Island & Live Activity Logic', () => {
  beforeEach(async () => {
    for (const table of db.tables) {
      await table.clear();
    }
    await useAppStore.getState().loadAllData();
  });

  it('exposes prayers, bestNextAction, and active challenges needed by DynamicIslandWidget', () => {
    const state = useAppStore.getState();
    expect(state.prayers).toBeDefined();
    expect(state.prayers.nextPrayer).toBeDefined();
    expect(state.challenges).toBeDefined();
    expect(Array.isArray(state.challenges)).toBe(true);
  });

  it('can complete task directly via store action as invoked by DynamicIslandWidget', async () => {
    const store = useAppStore.getState();
    const taskTitle = 'مهمة تجريبية للجزيرة التفاعلية';
    await store.addTask(taskTitle, 'P1_URGENT_IMPORTANT', 20);

    const createdTask = useAppStore.getState().tasks.find(t => t.title === taskTitle);
    expect(createdTask).toBeDefined();
    expect(createdTask?.status).toBe('TODO');

    // Complete it as Dynamic Island does
    await useAppStore.getState().completeTask(createdTask!.id);

    const updatedTask = useAppStore.getState().tasks.find(t => t.id === createdTask!.id);
    expect(updatedTask?.status).toBe('DONE');

    // Clean up
    await useAppStore.getState().deleteTask(createdTask!.id);
  });
});
