import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db, seedAhmedStudyPlannerIfNeeded, seedInitialDataIfNeeded } from '../../db';
import { useAppStore } from '../../stores/appStore';

describe('Sprint 1 — Automatic University Curriculum Seeding (Excel Source)', () => {
  beforeEach(async () => {
    // Clear all tables
    for (const table of db.tables) {
      await table.clear();
    }
  });

  it('automatically seeds 8 subjects and 8 weekly slots on fresh profile without any button', async () => {
    const store = useAppStore.getState();
    await store.loadAllData();

    const subjects = await db.universitySubjects.toArray();
    const slots = await db.timetableSlots.toArray();

    expect(subjects.length).toBe(8);
    expect(slots.length).toBe(8);

    // Verify exact subjects from Excel
    const codes = subjects.map(s => s.code).sort();
    expect(codes).toEqual([
      'NAA 3507',
      'NAA 3508',
      'NAB 3502',
      'NAC 3501',
      'NAC 3503',
      'NAC 3504',
      'NAC 3510',
      'NAP 3509'
    ]);

    // Verify Monday Molecular Spectroscopy end time is strictly null
    const mondaySlot = slots.find(s => s.day === 'الاثنين' && s.subjectCode === 'NAC 3503');
    expect(mondaySlot).toBeDefined();
    expect(mondaySlot?.startTime).toBe('19:00');
    expect(mondaySlot?.endTime).toBeNull();

    // Verify no unverified exam dates were invented
    for (const sub of subjects) {
      expect(sub.examDate).toBeUndefined();
      expect(sub.midExamDate).toBeUndefined();
    }
  });

  it('runs safely on existing profile with custom courses, adding only missing entities without duplication', async () => {
    const now = new Date().toISOString();
    // Simulate an existing profile that already has Molecular Spectroscopy and a custom course
    await db.universitySubjects.put({
      id: 'subj-spectro',
      name: 'Molecular Spectroscopy (Customized by Ahmed)',
      code: 'NAC 3503',
      academicYear: 3,
      semester: 1,
      professor: 'أ.د. حسين مصطفى',
      focus: 'High',
      hall: 'Online',
      difficulty: 'HARD',
      createdAt: now,
      updatedAt: now
    });

    await db.universitySubjects.put({
      id: 'custom-nanotech-lab',
      name: 'Advanced Cleanroom Nanofabrication Lab',
      code: 'CUST 9999',
      academicYear: 3,
      semester: 1,
      professor: 'دكتور زائر',
      focus: 'High',
      hall: 'مختبر النانو',
      difficulty: 'HARD',
      createdAt: now,
      updatedAt: now
    });

    const store = useAppStore.getState();
    await store.loadAllData();

    const subjects = await db.universitySubjects.toArray();
    // 8 bundled + 1 custom = 9 subjects
    expect(subjects.length).toBe(9);

    // The customized existing subject name was preserved!
    const spectro = await db.universitySubjects.get('subj-spectro');
    expect(spectro?.name).toBe('Molecular Spectroscopy (Customized by Ahmed)');

    // The custom course was preserved!
    const custom = await db.universitySubjects.get('custom-nanotech-lab');
    expect(custom).toBeDefined();

    // Exactly 8 weekly slots
    const slots = await db.timetableSlots.toArray();
    expect(slots.length).toBe(8);
  });

  it('repeated reloads do not duplicate curriculum records or slots', async () => {
    const store = useAppStore.getState();
    // First load
    await store.loadAllData();
    expect((await db.universitySubjects.toArray()).length).toBe(8);
    expect((await db.timetableSlots.toArray()).length).toBe(8);

    // Second load
    await store.loadAllData();
    expect((await db.universitySubjects.toArray()).length).toBe(8);
    expect((await db.timetableSlots.toArray()).length).toBe(8);

    // Third load
    await store.loadAllData();
    expect((await db.universitySubjects.toArray()).length).toBe(8);
    expect((await db.timetableSlots.toArray()).length).toBe(8);
  });

  it('does NOT resurrect a subject if the user explicitly deleted and tombstoned it', async () => {
    const store = useAppStore.getState();
    await store.loadAllData();

    // User deletes Management and Economics ('subj-mgmt')
    await db.universitySubjects.delete('subj-mgmt');
    await db.tombstones.put({
      id: 'tomb-subj-mgmt',
      entityType: 'SUBJECT',
      entityId: 'subj-mgmt',
      deletedAt: new Date().toISOString()
    });

    // Clear migration marker to simulate migration rerun
    await db.appMeta.delete('curriculum-2026-semester1-excel-v2');

    // Run seed again
    await seedAhmedStudyPlannerIfNeeded();

    // subj-mgmt should NOT be resurrected
    const mgmt = await db.universitySubjects.get('subj-mgmt');
    expect(mgmt).toBeUndefined();

    const remaining = await db.universitySubjects.toArray();
    expect(remaining.length).toBe(7);
  });
});
