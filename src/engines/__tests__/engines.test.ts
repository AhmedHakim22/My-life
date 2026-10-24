import { describe, it, expect } from 'vitest';
import { getCairoPrayerTimes } from '../prayer';
import { calculateNextRevision } from '../fsrs';
import { calculateUserRank, generateXPIdempotencyKey, SCIENTIFIC_RANKS } from '../gamification';
import { evaluateHabitStreak } from '../habits';
import { recommendBestNextAction } from '../recommender';
import type { StudySession, XPTransaction, Habit, Task, UniversitySubject } from '../../types';

describe('1. Cairo Prayer Engine (adhan-js)', () => {
  it('should compute valid astronomical prayer times for Cairo coordinates', () => {
    const result = getCairoPrayerTimes(new Date('2026-10-21T10:00:00Z'));
    expect(result.fajr.timeFormatted).toBeTruthy();
    expect(result.dhuhr.timeFormatted).toBeTruthy();
    expect(result.asr.timeFormatted).toBeTruthy();
    expect(result.maghrib.timeFormatted).toBeTruthy();
    expect(result.isha.timeFormatted).toBeTruthy();
    expect(result.nextPrayer.nameArabic).toBeTruthy();
    expect(result.freeWindowMinutes).toBeGreaterThanOrEqual(0);
  });
});

describe('2. Study Revision Engine (ts-fsrs)', () => {
  it('should compute next review date and increased stability on GOOD rating', () => {
    const session: StudySession = {
      id: 'sess-1',
      subjectId: 'subj-1',
      type: 'LECTURE',
      title: 'Nanotechnology 101',
      status: 'STUDIED',
      fsrsStability: 0,
      fsrsDifficulty: 0
    };

    const result = calculateNextRevision(session, 'GOOD', new Date('2026-10-21T12:00:00Z'));
    expect(result.stability).toBeGreaterThan(0);
    expect(result.difficulty).toBeGreaterThan(0);
    expect(result.daysUntilNext).toBeGreaterThanOrEqual(1);
    expect(result.nextReviewDate.getTime()).toBeGreaterThan(new Date('2026-10-21T12:00:00Z').getTime());
  });
});

describe('3. Scientific Gamification & Professor of Science Gate', () => {
  it('should assign level 1 (Knowledge Seeker) for new users with 0 XP', () => {
    const rank = calculateUserRank([]);
    expect(rank.currentRank.level).toBe(1);
    expect(rank.currentRank.titleArabic).toBe('طالب عِلْم');
  });

  it('should award Junior Researcher at 1000 XP', () => {
    const txs: XPTransaction[] = [
      {
        id: 'tx-1',
        idempotencyKey: 'READING:1:2026-10-21',
        amount: 1200,
        category: 'READING',
        reason: 'Reading books',
        createdAt: new Date().toISOString()
      }
    ];
    const rank = calculateUserRank(txs);
    expect(rank.currentRank.level).toBe(2);
    expect(rank.currentRank.titleArabic).toBe('باحث مساعد');
  });

  it('MUST BLOCK Professor of Science rank if user has 100,000 XP but has NOT completed 180 calendar days!', () => {
    // User has 100,000 XP but only started 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const txs: XPTransaction[] = [
      {
        id: 'tx-big',
        idempotencyKey: 'BIG_XP_1',
        amount: 100000,
        category: 'STUDY',
        reason: 'Huge study sprint',
        createdAt: thirtyDaysAgo.toISOString()
      }
    ];

    const rank = calculateUserRank(txs, thirtyDaysAgo);
    expect(rank.totalXP).toBe(100000);
    // Level must NOT be 7 (Professor of Science)! Must remain at Level 6 (Senior Scientist)
    expect(rank.currentRank.level).toBe(6);
    expect(rank.currentRank.titleArabic).toBe('عَالِم وباحث أول');
    expect(rank.isProfessorEligible).toBe(false);
    expect(rank.professorBlockerReason).toContain('شرط الـ 6 أشهر');
  });

  it('should GRANT Professor of Science when XP >= 60,000 AND calendar days >= 180 AND active days >= 120', () => {
    const twoHundredDaysAgo = new Date();
    twoHundredDaysAgo.setDate(twoHundredDaysAgo.getDate() - 200);

    // Generate 125 distinct active day transactions
    const txs: XPTransaction[] = [];
    for (let i = 0; i < 125; i++) {
      const d = new Date(twoHundredDaysAgo);
      d.setDate(d.getDate() + i);
      txs.push({
        id: `tx-${i}`,
        idempotencyKey: `DAY_${i}`,
        amount: 500, // 125 * 500 = 62,500 XP
        category: 'STUDY',
        reason: 'Daily study',
        createdAt: d.toISOString()
      });
    }

    const rank = calculateUserRank(txs, twoHundredDaysAgo);
    expect(rank.totalXP).toBe(62500);
    expect(rank.currentRank.level).toBe(7);
    expect(rank.currentRank.titleArabic).toBe('أستاذ علوم');
    expect(rank.isProfessorEligible).toBe(true);
  });

  it('should generate deterministic idempotency keys', () => {
    const key1 = generateXPIdempotencyKey('READING', 'book-123', '2026-10-21');
    const key2 = generateXPIdempotencyKey('READING', 'book-123', '2026-10-21');
    expect(key1).toBe(key2);
    expect(key1).toBe('READING:BOOK-123:2026-10-21');
  });
});

describe('4. Habits Grace Streak Engine (3 Consecutive Misses Rule)', () => {
  const baseHabit: Habit = {
    id: 'habit-1',
    title: 'قراءة صفحتين',
    targetType: 'PAGES',
    targetValue: 2,
    streakCount: 10,
    consecutiveMisses: 0,
    restDays: [5], // Friday is rest day
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('should maintain streak without penalty on a scheduled rest day (Friday)', () => {
    // Day 5 is Friday
    const friday = new Date('2026-10-23T12:00:00Z'); // Friday
    const res = evaluateHabitStreak(baseHabit, undefined, friday);
    expect(res.isTodayRestDay).toBe(true);
    expect(res.updatedStreak).toBe(10);
    expect(res.streakReset).toBe(false);
    expect(res.updatedConsecutiveMisses).toBe(0);
  });

  it('should NOT reset streak on 1st or 2nd consecutive miss', () => {
    const thursday = new Date('2026-10-22T12:00:00Z'); // Thursday (eligible)
    
    // First miss
    const res1 = evaluateHabitStreak(baseHabit, { id: 'l1', habitId: 'h1', date: '2026-10-22', status: 'MISSED', valueRecorded: 0 }, thursday);
    expect(res1.updatedStreak).toBe(10);
    expect(res1.updatedConsecutiveMisses).toBe(1);
    expect(res1.streakReset).toBe(false);

    // Second miss
    const habitWith1Miss = { ...baseHabit, consecutiveMisses: 1 };
    const res2 = evaluateHabitStreak(habitWith1Miss, { id: 'l2', habitId: 'h1', date: '2026-10-22', status: 'MISSED', valueRecorded: 0 }, thursday);
    expect(res2.updatedStreak).toBe(10);
    expect(res2.updatedConsecutiveMisses).toBe(2);
    expect(res2.streakReset).toBe(false);
  });

  it('should reset streak to 0 ONLY on 3rd consecutive miss', () => {
    const thursday = new Date('2026-10-22T12:00:00Z');
    const habitWith2Misses = { ...baseHabit, consecutiveMisses: 2 };
    
    const res3 = evaluateHabitStreak(habitWith2Misses, { id: 'l3', habitId: 'h1', date: '2026-10-22', status: 'MISSED', valueRecorded: 0 }, thursday);
    expect(res3.updatedStreak).toBe(0);
    expect(res3.updatedConsecutiveMisses).toBe(3);
    expect(res3.streakReset).toBe(true);
  });
});

describe('5. Deterministic Best Next Action Recommender', () => {
  const prayers = getCairoPrayerTimes(new Date('2026-10-21T10:00:00Z'));
  const subjects: UniversitySubject[] = [
    {
      id: 'subj-nano',
      name: 'فيزياء النانو',
      code: 'NANO-301',
      academicYear: 3,
      semester: 1,
      examDate: '2026-10-25', // Exam in 4 days!
      difficulty: 'HARD',
      createdAt: '',
      updatedAt: ''
    }
  ];

  it('should prioritize urgent university exam study task within free prayer window', () => {
    const tasks: Task[] = [
      {
        id: 'task-casual',
        title: 'ترتيب ملفات الكمبيوتر',
        priority: 'P3_NORMAL',
        status: 'TODO',
        estimatedMinutes: 60,
        isLocked: false,
        postponementCount: 0,
        createdAt: '',
        updatedAt: ''
      },
      {
        id: 'task-exam',
        title: 'حل مسائل Band Gap Engineering',
        priority: 'P1_URGENT_IMPORTANT',
        status: 'TODO',
        estimatedMinutes: 30,
        isLocked: false,
        postponementCount: 0,
        studySessionId: 'sess-nano-1',
        createdAt: '',
        updatedAt: ''
      }
    ];

    const recommendation = recommendBestNextAction(
      tasks,
      prayers,
      subjects,
      [{ id: 'sess-nano-1', subjectId: 'subj-nano', type: 'LECTURE', title: '', status: 'STUDIED', fsrsStability: 0, fsrsDifficulty: 0 }],
      new Date('2026-10-21T10:00:00Z')
    );

    expect(recommendation).not.toBeNull();
    expect(recommendation?.task.id).toBe('task-exam');
    expect(recommendation?.category).toBe('STUDY');
    expect(recommendation?.rationaleArabic).toContain('امتحان فيزياء النانو');
  });

  it('should trigger postponement intervention when a task has been postponed 3 or more times', () => {
    const tasks: Task[] = [
      {
        id: 'task-postponed',
        title: 'كتابة تقرير معمل النانو',
        priority: 'P2_IMPORTANT',
        status: 'TODO',
        estimatedMinutes: 30,
        isLocked: false,
        postponementCount: 3, // Postponed 3 times!
        createdAt: '',
        updatedAt: ''
      }
    ];

    const recommendation = recommendBestNextAction(tasks, prayers, [], [], new Date('2026-10-21T10:00:00Z'));
    expect(recommendation?.isPostponementIntervention).toBe(true);
    expect(recommendation?.interventionProposal).toContain('المهمة دي اتأجلت 3 مرات');
  });

  it('should automatically synthesize recommendation when tasks list is empty but lectures need revision', () => {
    const subjects: UniversitySubject[] = [
      { id: 'subj-thermo', name: 'Thermodynamics', code: 'NAC 3510', academicYear: 3, semester: 1, difficulty: 'MEDIUM', createdAt: '', updatedAt: '' }
    ];
    const sessions: StudySession[] = [
      { 
        id: 'sess-thermo-1', 
        subjectId: 'subj-thermo', 
        type: 'LECTURE', 
        title: 'محاضرة 1: الديناميكا الحرارية', 
        status: 'STUDIED', 
        studyDone: true, 
        reviseDone: false, // Needs revision!
        fsrsStability: 0, 
        fsrsDifficulty: 0 
      }
    ];

    const recommendation = recommendBestNextAction(
      [], // Empty tasks list!
      prayers,
      subjects,
      sessions,
      new Date('2026-10-21T10:00:00Z')
    );

    expect(recommendation).not.toBeNull();
    expect(recommendation?.category).toBe('STUDY');
    expect(recommendation?.task.title).toContain('مراجعة: محاضرة 1: الديناميكا الحرارية');
    expect(recommendation?.rationaleArabic).toContain('مراجعة وتثبيت قبل النسيان');
  });

  it('should prioritize urgent approaching exams when proposing study actions', () => {
    const subjects: UniversitySubject[] = [
      { 
        id: 'subj-spectro', 
        name: 'Molecular Spectroscopy', 
        code: 'NAC 3503', 
        academicYear: 3, 
        semester: 1, 
        examDate: '2026-10-25', // Exam in 4 days!
        difficulty: 'HARD',
        createdAt: '',
        updatedAt: ''
      }
    ];
    const sessions: StudySession[] = [
      { 
        id: 'sess-spectro-2', 
        subjectId: 'subj-spectro', 
        type: 'LECTURE', 
        title: 'محاضرة 2: الأطياف الجزيئية', 
        status: 'STUDIED', 
        studyDone: true, 
        reviseDone: false, 
        fsrsStability: 0, 
        fsrsDifficulty: 0 
      }
    ];

    const recommendation = recommendBestNextAction(
      [],
      prayers,
      subjects,
      sessions,
      new Date('2026-10-21T10:00:00Z')
    );

    expect(recommendation).not.toBeNull();
    expect(recommendation?.rationaleArabic).toContain('امتحان Molecular Spectroscopy بعد 4 أيام فقط');
    expect(recommendation?.task.priority).toBe('P1_URGENT_IMPORTANT');
    expect(recommendation?.score).toBeGreaterThanOrEqual(100);
  });
});
