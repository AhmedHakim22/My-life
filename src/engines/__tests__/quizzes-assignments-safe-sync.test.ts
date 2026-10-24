import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db, seedAhmedAcademicQuizzesAndAssignmentsIfNeeded } from '../../db';
import { unpackShadowState } from '../../lib/sync';
import type { AcademicQuiz, AcademicAssignment } from '../../types';

describe('Quizzes and Assignments Safety and Non-Destructive Sync', () => {
  beforeEach(async () => {
    await db.academicQuizzes.clear();
    await db.academicAssignments.clear();
    await db.tombstones.clear();
  });

  it('unpackShadowState NEVER deletes local academicQuizzes or academicAssignments when remote has empty arrays', async () => {
    // 1. User has local quizzes and assignments
    const myQuiz: AcademicQuiz = {
      id: 'quiz-user-1',
      topic: 'كويز فيزياء الكم',
      subjectId: 'subj-quantum',
      subjectName: 'Quantum Phenomena I',
      quizDate: '2026-10-25',
      prepared: false,
      attended: false
    };

    const myAssignment: AcademicAssignment = {
      id: 'asgn-user-1',
      taskName: 'شيت البرمجة 1',
      subjectId: 'subj-cs',
      subjectName: 'Computer Science',
      deadline: '2026-10-26',
      completed: false,
      submitted: false,
      blocked: false
    };

    await db.academicQuizzes.put(myQuiz);
    await db.academicAssignments.put(myAssignment);

    expect(await db.academicQuizzes.count()).toBe(1);
    expect(await db.academicAssignments.count()).toBe(1);

    // 2. Incoming shadow state from remote with empty arrays
    const remoteEmptyShadow = {
      version: 1,
      updatedAt: new Date().toISOString(),
      deviceRole: 'PRIMARY',
      data: {
        academicQuizzes: [],
        academicAssignments: []
      }
    };

    const success = await unpackShadowState(remoteEmptyShadow);
    expect(success).toBe(true);

    // 3. User's local records MUST NOT BE WIPED!
    const remainingQuizzes = await db.academicQuizzes.toArray();
    const remainingAssignments = await db.academicAssignments.toArray();

    expect(remainingQuizzes.length).toBe(1);
    expect(remainingQuizzes[0].id).toBe('quiz-user-1');

    expect(remainingAssignments.length).toBe(1);
    expect(remainingAssignments[0].id).toBe('asgn-user-1');
  });

  it('seedAhmedAcademicQuizzesAndAssignmentsIfNeeded populates defaults when empty, and respects tombstones', async () => {
    expect(await db.academicQuizzes.count()).toBe(0);
    expect(await db.academicAssignments.count()).toBe(0);

    // 1. Run seed when empty
    await seedAhmedAcademicQuizzesAndAssignmentsIfNeeded();

    const seededQuizzes = await db.academicQuizzes.toArray();
    const seededAssignments = await db.academicAssignments.toArray();

    expect(seededQuizzes.length).toBeGreaterThanOrEqual(3);
    expect(seededAssignments.length).toBeGreaterThanOrEqual(3);

    // Check that Quantum quiz links to Ahmed's actual lectures
    const quantumQuiz = seededQuizzes.find(q => q.subjectId === 'subj-quantum');
    expect(quantumQuiz).toBeDefined();
    expect(quantumQuiz?.lectureIds?.length).toBeGreaterThan(0);

    // 2. Simulate user intentionally deleting a quiz (creates tombstone)
    const deletedQuizId = seededQuizzes[0].id;
    await db.academicQuizzes.delete(deletedQuizId);
    await db.tombstones.put({
      id: `tomb-${deletedQuizId}`,
      entityType: 'academicQuizzes',
      entityId: deletedQuizId,
      deletedAt: new Date().toISOString()
    });

    // Clear remainder so count is 0 again
    await db.academicQuizzes.clear();
    expect(await db.academicQuizzes.count()).toBe(0);

    // Re-run seed
    await seedAhmedAcademicQuizzesAndAssignmentsIfNeeded();

    // The tombstoned quiz MUST NOT be re-seeded!
    const reseededQuiz = await db.academicQuizzes.get(deletedQuizId);
    expect(reseededQuiz).toBeUndefined();
  });
});
