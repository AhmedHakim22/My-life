import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';

describe('Weekly Study Timetable (جدول المحاضرات الجامعي) — CRUD & Multi-device Sync', () => {
  beforeEach(async () => {
    for (const table of db.tables) {
      await table.clear();
    }
  });

  it('adds a new timetable slot and updates Dexie and store reactively', async () => {
    const store = useAppStore.getState();

    const newId = await store.addTimetableSlot({
      day: 'الأربعاء',
      startTime: '09:00',
      endTime: '11:00',
      subjectName: 'Nanofabrication Cleanroom Lab',
      subjectCode: 'NAC 3512',
      format: 'Campus',
      hall: 'معمل النانو المركزي',
      notes: 'ارتداء بدلة الغرفة النظيفة إلزامي'
    });

    expect(newId).toBeDefined();

    // Verify Dexie persistence
    const saved = await db.timetableSlots.get(newId);
    expect(saved).toBeDefined();
    expect(saved?.day).toBe('الأربعاء');
    expect(saved?.startTime).toBe('09:00');
    expect(saved?.endTime).toBe('11:00');
    expect(saved?.subjectName).toBe('Nanofabrication Cleanroom Lab');
    expect(saved?.subjectCode).toBe('NAC 3512');
    expect(saved?.format).toBe('Campus');
    expect(saved?.hall).toBe('معمل النانو المركزي');
    expect(saved?.notes).toBe('ارتداء بدلة الغرفة النظيفة إلزامي');
    expect(saved?.updatedAt).toBeDefined();

    // Verify reactive store
    const storeSlots = useAppStore.getState().timetableSlots;
    const foundInStore = storeSlots.find(s => s.id === newId);
    expect(foundInStore).toBeDefined();
    expect(foundInStore?.subjectName).toBe('Nanofabrication Cleanroom Lab');
  });

  it('updates an existing timetable slot with modified day, time, and mode', async () => {
    const store = useAppStore.getState();

    const slotId = await store.addTimetableSlot({
      day: 'الخميس',
      startTime: '10:00',
      endTime: '12:00',
      subjectName: 'Quantum Mechanics II',
      subjectCode: 'NAC 3505',
      format: 'Campus',
      hall: 'مدرج 3',
      notes: null
    });

    // Update to online lecture with new time and notes
    await store.updateTimetableSlot(slotId, {
      startTime: '14:00',
      endTime: '16:00',
      format: 'Online',
      hall: 'Zoom / Teams',
      notes: 'رابط المحاضرة يرسل عبر تليجرام'
    });

    const updated = await db.timetableSlots.get(slotId);
    expect(updated?.startTime).toBe('14:00');
    expect(updated?.endTime).toBe('16:00');
    expect(updated?.format).toBe('Online');
    expect(updated?.hall).toBe('Zoom / Teams');
    expect(updated?.notes).toBe('رابط المحاضرة يرسل عبر تليجرام');

    // Store state
    const storeSlot = useAppStore.getState().timetableSlots.find(s => s.id === slotId);
    expect(storeSlot?.format).toBe('Online');
    expect(storeSlot?.startTime).toBe('14:00');
  });

  it('deletes a timetable slot, removes it from Dexie and store, and registers a tombstone', async () => {
    const store = useAppStore.getState();

    const slotId = await store.addTimetableSlot({
      day: 'الجمعة',
      startTime: '16:00',
      endTime: '18:00',
      subjectName: 'Seminar on Green Nanotech',
      subjectCode: 'NAC 3599',
      format: 'Online',
      hall: 'Online',
      notes: null
    });

    expect(await db.timetableSlots.get(slotId)).toBeDefined();

    // Delete slot
    await store.deleteTimetableSlot(slotId);

    // Verify removed from Dexie
    const postDelete = await db.timetableSlots.get(slotId);
    expect(postDelete).toBeUndefined();

    // Verify removed from store
    const storeSlots = useAppStore.getState().timetableSlots;
    expect(storeSlots.some(s => s.id === slotId)).toBe(false);

    // Verify tombstone was generated
    const tombstones = await db.tombstones.where('entityId').equals(slotId).toArray();
    expect(tombstones.length).toBeGreaterThanOrEqual(1);
    expect(tombstones[0].entityType).toBe('timetableSlots');
  });
});
