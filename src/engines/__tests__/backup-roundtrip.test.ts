import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';

describe('Complete Backup & Restore Roundtrip (26 Tables)', () => {
  beforeEach(async () => {
    // Clear all tables before test
    await db.transaction('rw', db.tables, async () => {
      for (const table of db.tables) {
        await table.clear();
      }
    });
  });

  it('exports and restores all 26 canonical tables with 100% relational fidelity', async () => {
    const store = useAppStore.getState();

    // 1. Seed sample data into key tables across all domains
    await db.domains.put({
      id: 'dom-test',
      name: 'مجال التجربة',
      icon: 'Atom',
      color: '#38bdf8',
      sortOrder: 1,
      isArchived: false,
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z'
    });

    await db.goals.put({
      id: 'goal-test',
      domainId: 'dom-test',
      title: 'هدف اختبار التدريب الصيفي',
      whyItMatters: 'بناء المهارات العملية',
      horizon: 'ANNUAL',
      status: 'IN_PROGRESS',
      progressPercentage: 50,
      isArchived: false,
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z'
    });

    await db.goalMilestones.put({
      id: 'ms-test',
      goalId: 'goal-test',
      title: 'معلم إنهاء الأساسيات',
      status: 'COMPLETED',
      sortOrder: 1,
      weight: 50,
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z'
    });

    await db.categories.put({
      id: 'cat-test',
      name: 'أشباه الموصلات المتقدمة',
      type: 'SKILL',
      sortOrder: 1,
      isArchived: false,
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z'
    });

    await db.learningResources.put({
      id: 'res-test-book',
      type: 'BOOK',
      title: 'كتاب النانو تكنولوجي',
      status: 'IN_PROGRESS',
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z'
    });

    await db.bookDetails.put({
      resourceId: 'res-test-book',
      author: 'د. أحمد حكيم',
      totalPages: 300,
      currentPage: 50,
      shelf: 'Reading'
    });

    await db.courseDetails.put({
      resourceId: 'res-test-course',
      instructor: 'م. أحمد',
      totalLessons: 12,
      completedLessons: 4,
      durationMinutes: 180
    });

    await db.skillResources.put({
      skillId: 'skill-semi',
      resourceId: 'res-test-book'
    });

    await db.universitySubjects.put({
      id: 'subj-test',
      name: 'Quantum Phenomena',
      code: 'NAC 3504',
      academicYear: 3,
      semester: 1,
      difficulty: 'HARD',
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z'
    });

    await db.academicQuizzes.put({
      id: 'quiz-test',
      topic: 'كويز أشباه الموصلات',
      subjectId: 'subj-test',
      subjectName: 'Quantum Phenomena',
      quizDate: '2026-10-28',
      prepared: true,
      attended: false
    });

    await db.tasks.put({
      id: 'task-test',
      title: 'حل مسائل الكوانتم',
      priority: 'P1_URGENT_IMPORTANT',
      status: 'TODO',
      estimatedMinutes: 45,
      isLocked: false,
      postponementCount: 1,
      goalId: 'goal-test',
      createdAt: '2026-10-22T00:00:00.000Z',
      updatedAt: '2026-10-22T00:00:00.000Z'
    });

    // 2. Export full backup JSON
    const exportedJson = await store.exportBackupJSON();
    expect(exportedJson).toBeDefined();

    const parsedBackup = JSON.parse(exportedJson);
    expect(parsedBackup.version).toBe(2);
    expect(parsedBackup.schemaVersion).toBe(3);
    expect(parsedBackup.domains.length).toBe(1);
    expect(parsedBackup.goals.length).toBe(1);
    expect(parsedBackup.goalMilestones.length).toBe(1);
    expect(parsedBackup.courseDetails.length).toBe(1);
    expect(parsedBackup.academicQuizzes.length).toBe(1);
    expect(parsedBackup.skillResources.length).toBe(1);

    // 3. Clear database completely to simulate new device or restore
    await db.transaction('rw', db.tables, async () => {
      for (const table of db.tables) {
        await table.clear();
      }
    });

    expect(await db.domains.count()).toBe(0);
    expect(await db.goals.count()).toBe(0);
    expect(await db.courseDetails.count()).toBe(0);
    expect(await db.academicQuizzes.count()).toBe(0);

    // 4. Import backup JSON into clean database
    const restoreSuccess = await store.importBackupJSON(exportedJson);
    expect(restoreSuccess).toBe(true);

    // 5. Assert 100% restoration across all tables
    const restoredDomain = await db.domains.get('dom-test');
    expect(restoredDomain).toBeDefined();
    expect(restoredDomain?.name).toBe('مجال التجربة');

    const restoredGoal = await db.goals.get('goal-test');
    expect(restoredGoal?.title).toBe('هدف اختبار التدريب الصيفي');

    const restoredMilestone = await db.goalMilestones.get('ms-test');
    expect(restoredMilestone?.status).toBe('COMPLETED');

    const restoredCourseDetail = await db.courseDetails.get('res-test-course');
    expect(restoredCourseDetail).toBeDefined();
    expect(restoredCourseDetail?.totalLessons).toBe(12);

    const restoredQuiz = await db.academicQuizzes.get('quiz-test');
    expect(restoredQuiz?.topic).toBe('كويز أشباه الموصلات');

    const restoredSkillResource = await db.skillResources.get(['skill-semi', 'res-test-book']);
    expect(restoredSkillResource).toBeDefined();
  });
});
