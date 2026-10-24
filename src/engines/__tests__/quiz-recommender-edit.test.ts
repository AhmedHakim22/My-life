import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { recommendBestNextAction, getCalendarDaysDiff } from '../recommender';
import { getCairoPrayerTimes } from '../prayer';
import { useAppStore } from '../../stores/appStore';
import { db } from '../../db';
import type { AcademicQuiz, StudySession, UniversitySubject, Task } from '../../types';

describe('Quiz Recommender Engine & Lecture Linkage', () => {
  const mockCurrentDate = new Date('2026-10-24T12:00:00');
  const prayers = getCairoPrayerTimes(mockCurrentDate);

  const mockSubjects: UniversitySubject[] = [
    {
      id: 'subj-nano',
      name: 'نانوتكنولوجي',
      code: 'NANO301',
      academicYear: 3,
      semester: 1,
      difficulty: 'MEDIUM',
      focus: 'High',
      createdAt: '2026-10-24T00:00:00Z',
      updatedAt: '2026-10-24T00:00:00Z'
    }
  ];

  const mockSessions: StudySession[] = [
    {
      id: 'sess-nano-1',
      subjectId: 'subj-nano',
      type: 'LECTURE',
      title: 'مقدمة في الجسيمات النانوية',
      lectureNumber: 1,
      status: 'STUDIED',
      materialReady: true,
      studyDone: false,
      reviseDone: false,
      solveDone: false,
      priority: 'High',
      fsrsStability: 0,
      fsrsDifficulty: 0
    },
    {
      id: 'sess-nano-2',
      subjectId: 'subj-nano',
      type: 'LECTURE',
      title: 'تطبيقات النانو في الكيمياء',
      lectureNumber: 2,
      status: 'STUDIED',
      materialReady: false,
      studyDone: false,
      reviseDone: false,
      solveDone: false,
      priority: 'Normal',
      fsrsStability: 0,
      fsrsDifficulty: 0
    }
  ];

  it('correctly calculates calendar days difference', () => {
    expect(getCalendarDaysDiff('2026-10-24', mockCurrentDate)).toBe(0);
    expect(getCalendarDaysDiff('2026-10-25', mockCurrentDate)).toBe(1);
    expect(getCalendarDaysDiff('2026-10-26', mockCurrentDate)).toBe(2);
    expect(getCalendarDaysDiff('2026-10-27', mockCurrentDate)).toBe(3);
    expect(getCalendarDaysDiff('2026-10-23', mockCurrentDate)).toBe(-1);
  });

  it('recommends an approaching quiz tomorrow as #1 Best Next Action with >= 200 score and P1 priority', () => {
    const tomorrowQuiz: AcademicQuiz = {
      id: 'quiz-nano-1',
      topic: 'كويز أجهزة النانو',
      subjectId: 'subj-nano',
      subjectName: 'نانوتكنولوجي',
      quizDate: '2026-10-25', // Tomorrow
      syllabusScope: 'المحاضرة 1',
      lectureIds: ['sess-nano-1'],
      prepared: false,
      attended: false
    };

    const rec = recommendBestNextAction(
      [],
      prayers,
      mockSubjects,
      mockSessions,
      mockCurrentDate,
      [],
      [tomorrowQuiz],
      []
    );

    expect(rec).not.toBeNull();
    expect(rec?.task.id).toBe('synth-quiz-quiz-nano-1');
    expect(rec?.score).toBeGreaterThanOrEqual(200);
    expect(rec?.task.priority).toBe('P1_URGENT_IMPORTANT');
    expect(rec?.task.title).toContain('كويز غداً');
    expect(rec?.task.title).toContain('محاضرة 1');
    expect(rec?.rationaleArabic).toContain('الاستعداد إلزامي اليوم');
  });

  it('boosts lectures covered by upcoming quiz into top priority alternative tasks', () => {
    const tomorrowQuiz: AcademicQuiz = {
      id: 'quiz-nano-1',
      topic: 'كويز أجهزة النانو',
      subjectId: 'subj-nano',
      subjectName: 'نانوتكنولوجي',
      quizDate: '2026-10-25', // Tomorrow
      lectureIds: ['sess-nano-1'],
      prepared: false,
      attended: false
    };

    const rec = recommendBestNextAction(
      [],
      prayers,
      mockSubjects,
      mockSessions,
      mockCurrentDate,
      [],
      [tomorrowQuiz],
      []
    );

    expect(rec).not.toBeNull();
    // The top recommendation is the quiz preparation itself
    expect(rec?.task.id).toBe('synth-quiz-quiz-nano-1');

    // The covered lecture (sess-nano-1) must be in the alternative tasks with high priority
    const lectureAlternative = rec?.alternativeTasks.find(t => t.studySessionId === 'sess-nano-1');
    expect(lectureAlternative).toBeDefined();
    expect(lectureAlternative?.priority).toBe('P1_URGENT_IMPORTANT');
  });

  it('recommends a quiz today with ultra-high priority (score >= 220)', () => {
    const todayQuiz: AcademicQuiz = {
      id: 'quiz-today',
      topic: 'كويز سريع في المعمل',
      subjectId: 'subj-nano',
      subjectName: 'نانوتكنولوجي',
      quizDate: '2026-10-24', // Today
      prepared: false,
      attended: false
    };

    const rec = recommendBestNextAction(
      [],
      prayers,
      mockSubjects,
      mockSessions,
      mockCurrentDate,
      [],
      [todayQuiz],
      []
    );

    expect(rec).not.toBeNull();
    expect(rec?.task.id).toBe('synth-quiz-quiz-today');
    expect(rec?.score).toBeGreaterThanOrEqual(220);
    expect(rec?.task.priority).toBe('P1_URGENT_IMPORTANT');
    expect(rec?.task.title).toContain('كويز اليوم');
  });
});

describe('Store Quiz Operations', () => {
  beforeEach(async () => {
    await db.academicQuizzes.clear();
  });

  it('allows adding and editing quizzes with lectureIds and syllabusScope', async () => {
    const store = useAppStore.getState();

    const quizId = await store.addQuiz({
      topic: 'Quiz 1 - Optics',
      subjectId: 'subj-phys',
      subjectName: 'فيزياء بصرية',
      quizDate: '2026-11-01',
      syllabusScope: 'م1 و م2',
      lectureIds: ['sess-1', 'sess-2'],
      prepared: false,
      attended: false
    });

    let savedQuiz = await db.academicQuizzes.get(quizId);
    expect(savedQuiz).toBeDefined();
    expect(savedQuiz?.topic).toBe('Quiz 1 - Optics');
    expect(savedQuiz?.lectureIds).toEqual(['sess-1', 'sess-2']);

    // Update the quiz
    await store.updateQuiz(quizId, {
      topic: 'Quiz 1 - Modern Optics Updated',
      quizDate: '2026-11-03',
      lectureIds: ['sess-1', 'sess-2', 'sess-3']
    });

    savedQuiz = await db.academicQuizzes.get(quizId);
    expect(savedQuiz?.topic).toBe('Quiz 1 - Modern Optics Updated');
    expect(savedQuiz?.quizDate).toBe('2026-11-03');
    expect(savedQuiz?.lectureIds).toEqual(['sess-1', 'sess-2', 'sess-3']);
  });

  it('toggles lecture linking to quiz seamlessly via toggleLectureQuizLink', async () => {
    const store = useAppStore.getState();

    const quizId = await store.addQuiz({
      topic: 'Quiz 2 - Waves',
      subjectId: 'subj-phys',
      subjectName: 'فيزياء بصرية',
      quizDate: '2026-11-05',
      lectureIds: ['sess-1'],
      prepared: false,
      attended: false
    });

    // Toggle to link sess-2
    await store.toggleLectureQuizLink('sess-2', quizId);
    let quiz = await db.academicQuizzes.get(quizId);
    expect(quiz?.lectureIds).toContain('sess-1');
    expect(quiz?.lectureIds).toContain('sess-2');

    // Toggle again to unlink sess-1
    await store.toggleLectureQuizLink('sess-1', quizId);
    quiz = await db.academicQuizzes.get(quizId);
    expect(quiz?.lectureIds).not.toContain('sess-1');
    expect(quiz?.lectureIds).toContain('sess-2');
  });

  it('links a lecture to multiple quizzes via linkLectureToQuizzes', async () => {
    const store = useAppStore.getState();

    const q1 = await store.addQuiz({
      topic: 'Quiz A',
      subjectId: 'subj-math',
      subjectName: 'رياضيات',
      quizDate: '2026-11-10',
      lectureIds: [],
      prepared: false,
      attended: false
    });

    const q2 = await store.addQuiz({
      topic: 'Quiz B',
      subjectId: 'subj-math',
      subjectName: 'رياضيات',
      quizDate: '2026-11-12',
      lectureIds: ['sess-other'],
      prepared: false,
      attended: false
    });

    // Link sess-math-1 to both Quiz A and Quiz B
    await store.linkLectureToQuizzes('sess-math-1', [q1, q2]);

    const resQ1 = await db.academicQuizzes.get(q1);
    const resQ2 = await db.academicQuizzes.get(q2);

    expect(resQ1?.lectureIds).toContain('sess-math-1');
    expect(resQ2?.lectureIds).toContain('sess-math-1');
    expect(resQ2?.lectureIds).toContain('sess-other');

    // Now update so sess-math-1 is only in Quiz A
    await store.linkLectureToQuizzes('sess-math-1', [q1]);
    const resQ1After = await db.academicQuizzes.get(q1);
    const resQ2After = await db.academicQuizzes.get(q2);

    expect(resQ1After?.lectureIds).toContain('sess-math-1');
    expect(resQ2After?.lectureIds).not.toContain('sess-math-1');
  });

  it('automatically cleans up lectureId from quizzes when a study session is deleted', async () => {
    const store = useAppStore.getState();

    const sessId = await store.addStudySession({
      subjectId: 'subj-chem',
      title: 'محاضرة الكيمياء العضوية',
      type: 'LECTURE',
      lectureNumber: 1
    });

    const qId = await store.addQuiz({
      topic: 'كويز كيمياء',
      subjectId: 'subj-chem',
      subjectName: 'كيمياء',
      quizDate: '2026-11-08',
      lectureIds: [sessId, 'sess-keep'],
      prepared: false,
      attended: false
    });

    let quiz = await db.academicQuizzes.get(qId);
    expect(quiz?.lectureIds).toContain(sessId);

    // Delete the study session
    await store.deleteStudySession(sessId);

    quiz = await db.academicQuizzes.get(qId);
    expect(quiz?.lectureIds).not.toContain(sessId);
    expect(quiz?.lectureIds).toContain('sess-keep');
  });
});
