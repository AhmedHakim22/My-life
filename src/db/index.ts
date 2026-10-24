import Dexie, { type Table } from 'dexie';
import type {
  LifeDomain,
  Goal,
  Skill,
  LearningResource,
  BookDetails,
  ReadingSession,
  CourseDetails,
  SkillResource,
  SkillEvidence,
  UniversitySubject,
  StudySession,
  Task,
  TaskPostponement,
  Habit,
  HabitLog,
  XPTransaction,
  JournalEntry,
  SyncQueueItem,
  TimetableSlot,
  AcademicQuiz,
  AcademicAssignment,
  StudentActivityTask,
  CustomCategory,
  GoalMilestone,
  GoalLink,
  CourseModule,
  CourseLesson,
  Tombstone,
  XPResetEvent,
  Intention,
  GoalIntention,
  WorshipLog,
  QuranReadingLog,
  QiyamSession,
  MovementLog,
  WorkoutLog,
  AvailabilityRule,
  ScheduleBlock,
  WeeklySchedulePlan,
  Challenge,
  ChallengeDayLog
} from '../types';

export class MasaarDatabase extends Dexie {
  appMeta!: Table<{ id: string; appliedAt: string; [key: string]: any }, string>;
  domains!: Table<LifeDomain, string>;
  goals!: Table<Goal, string>;
  skills!: Table<Skill, string>;
  learningResources!: Table<LearningResource, string>;
  bookDetails!: Table<BookDetails, string>;
  readingSessions!: Table<ReadingSession, string>;
  courseDetails!: Table<CourseDetails, string>;
  skillResources!: Table<SkillResource, [string, string]>;
  skillEvidence!: Table<SkillEvidence, string>;
  universitySubjects!: Table<UniversitySubject, string>;
  studySessions!: Table<StudySession, string>;
  tasks!: Table<Task, string>;
  taskPostponements!: Table<TaskPostponement, string>;
  habits!: Table<Habit, string>;
  habitLogs!: Table<HabitLog, string>;
  xpTransactions!: Table<XPTransaction, string>;
  journalEntries!: Table<JournalEntry, string>;
  syncQueue!: Table<SyncQueueItem, number>;
  timetableSlots!: Table<TimetableSlot, string>;
  academicQuizzes!: Table<AcademicQuiz, string>;
  academicAssignments!: Table<AcademicAssignment, string>;
  studentActivities!: Table<StudentActivityTask, string>;
  // Version 3 Entities
  categories!: Table<CustomCategory, string>;
  goalMilestones!: Table<GoalMilestone, string>;
  goalLinks!: Table<GoalLink, string>;
  courseModules!: Table<CourseModule, string>;
  courseLessons!: Table<CourseLesson, string>;
  // Version 4 Entities (MASAAR V2)
  tombstones!: Table<Tombstone, string>;
  xpResetEvents!: Table<XPResetEvent, string>;
  intentions!: Table<Intention, string>;
  goalIntentions!: Table<GoalIntention, string>;
  worshipLogs!: Table<WorshipLog, string>;
  quranLogs!: Table<QuranReadingLog, string>;
  qiyamSessions!: Table<QiyamSession, string>;
  movementLogs!: Table<MovementLog, string>;
  workoutLogs!: Table<WorkoutLog, string>;
  availabilityRules!: Table<AvailabilityRule, string>;
  scheduleBlocks!: Table<ScheduleBlock, string>;
  schedulePlans!: Table<WeeklySchedulePlan, string>;
  // Version 5 Entities (Challenges Engine)
  challenges!: Table<Challenge, string>;
  challengeLogs!: Table<ChallengeDayLog, string>;

  constructor() {
    super('MasaarLifeOSDB');
    this.version(1).stores({
      domains: 'id, sortOrder, isArchived',
      goals: 'id, domainId, horizon, status, isArchived',
      skills: 'id, parentSkillId, category, sortOrder',
      learningResources: 'id, type, status',
      bookDetails: 'resourceId, shelf',
      readingSessions: 'id, bookResourceId, date',
      courseDetails: 'resourceId',
      skillResources: '[skillId+resourceId], skillId, resourceId',
      skillEvidence: 'id, skillId',
      universitySubjects: 'id, academicYear, semester, examDate',
      studySessions: 'id, subjectId, type, status, fsrsNextReview',
      tasks: 'id, priority, status, dueDate, postponementCount, goalId, studySessionId',
      taskPostponements: 'id, taskId',
      habits: 'id, streakCount, consecutiveMisses',
      habitLogs: 'id, habitId, date, [habitId+date]',
      xpTransactions: 'id, &idempotencyKey, category, createdAt',
      journalEntries: 'id, date, mode',
      syncQueue: '++id, tableName, recordId, createdAt'
    });

    this.version(2).stores({
      timetableSlots: 'id, day, startTime, subjectName',
      academicQuizzes: 'id, subjectId, quizDate, prepared, attended',
      academicAssignments: 'id, subjectId, deadline, completed, submitted',
      studentActivities: 'id, activityName, deadline, done'
    });

    this.version(3).stores({
      categories: 'id, parentId, type, sortOrder, isArchived',
      goalMilestones: 'id, goalId, targetDate, status, sortOrder',
      goalLinks: 'id, goalId, entityType, entityId, [goalId+entityId]',
      courseModules: 'id, courseResourceId, sortOrder',
      courseLessons: 'id, moduleId, courseResourceId, status, sortOrder',
      goals: 'id, domainId, parentGoalId, horizon, status, isArchived',
      skills: 'id, parentSkillId, category, categoryId, sortOrder',
      learningResources: 'id, type, status, categoryId',
      tasks: 'id, priority, status, dueDate, postponementCount, goalId, skillId, studySessionId'
    });

    this.version(4).stores({
      appMeta: 'id',
      tombstones: 'id, [entityType+entityId], entityId, deletedAt',
      xpResetEvents: 'id, resetAt',
      intentions: 'id, isArchived, createdAt',
      goalIntentions: 'id, goalId, intentionId, [goalId+intentionId]',
      worshipLogs: 'id, date, prayerName, status',
      quranLogs: 'id, date, pagesRead',
      qiyamSessions: 'id, date, durationMinutes',
      movementLogs: 'id, date, activityType, meets20MinBaseline',
      workoutLogs: 'id, date, activityType',
      availabilityRules: 'id, dayOfWeek, type',
      scheduleBlocks: 'id, day, startTime, type, isLocked, taskId',
      schedulePlans: 'id, weekStartDate, status'
    });

    this.version(5).stores({
      challenges: 'id, status, currentDay, startDate',
      challengeLogs: 'id, challengeId, date, [challengeId+date], status'
    });

    this.version(6).stores({
      goals: 'id, domainId, parentGoalId, horizon, status, isArchived, planId, refId'
    });
  }
}

export const db = new MasaarDatabase();

/**
 * Seed initial data if the database is empty.
 * Sets up domains, Falcon, Nanotechnology subjects, and the 2-pages reading habit.
 */
export async function seedInitialDataIfNeeded(): Promise<void> {
  const domainsCount = await db.domains.count();
  const habitsCount = await db.habits.count();
  if (domainsCount > 0 || habitsCount > 0) return; // already seeded

  const now = new Date().toISOString();
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Domains
  const domains: LifeDomain[] = [
    {
      id: 'dom-university',
      name: 'جامعة القاهرة — تقنية النانو',
      icon: 'Atom',
      color: '#38bdf8',
      sortOrder: 1,
      isArchived: false,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'dom-falcon',
      name: 'العمل — المشاريع والريادة',
      icon: 'Briefcase',
      color: '#f59e0b',
      sortOrder: 2,
      isArchived: false,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'dom-skills',
      name: 'المهارات والتعلم المستمر',
      icon: 'Cpu',
      color: '#8b5cf6',
      sortOrder: 3,
      isArchived: false,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'dom-reading',
      name: 'مكتبة القراءة والكتب',
      icon: 'BookOpen',
      color: '#10b981',
      sortOrder: 4,
      isArchived: false,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'dom-spiritual',
      name: 'العبادات والورد اليومي',
      icon: 'Moon',
      color: '#14b8a6',
      sortOrder: 5,
      isArchived: false,
      createdAt: now,
      updatedAt: now
    }
  ];
  await db.domains.bulkPut(domains);

  // 2. Habits (Honest zero baseline — no fabricated streaks)
  const habits: Habit[] = [
    {
      id: 'habit-read-2-pages',
      title: 'قراءة الكتب العامة (صفحتين يومياً)',
      targetType: 'PAGES',
      targetValue: 2,
      streakCount: 0,
      consecutiveMisses: 0,
      restDays: [5], // الجمعة راحة
      lastCompletedDate: undefined,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'habit-quran',
      title: 'الورد القرآني (3 صفحات يومياً)',
      targetType: 'PAGES',
      targetValue: 3,
      streakCount: 0,
      consecutiveMisses: 0,
      restDays: [],
      lastCompletedDate: undefined,
      createdAt: now,
      updatedAt: now
    }
  ];
  await db.habits.bulkPut(habits);
}

/**
 * Request persistent browser storage to guarantee local IndexedDB is never evicted
 * by browser cleanup policies on mobile or desktop.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persisted();
      if (!isPersisted) {
        const granted = await navigator.storage.persist();
        console.log('📦 Persistent browser storage granted:', granted);
        return granted;
      }
      return true;
    } catch (e) {
      console.debug('Storage persistence request quiet error:', e);
      return false;
    }
  }
  return false;
}

/**
 * Saves a pre-migration JSON snapshot in localStorage for safe rollback.
 */
export async function takePreMigrationSnapshot(): Promise<void> {
  try {
    if (typeof localStorage === 'undefined') return;
    const backup: Record<string, any[]> = {};
    const tableNames = db.tables.map(t => t.name);
    for (const name of tableNames) {
      backup[name] = await db.table(name).toArray();
    }
    localStorage.setItem('MASAAR_PRE_MIGRATION_BACKUP_V2', JSON.stringify({
      timestamp: new Date().toISOString(),
      tables: backup
    }));
  } catch (err) {
    console.warn('Could not save local pre-migration snapshot:', err);
  }
}

/**
 * Opt-in demo dataset for testing purposes only.
 * NEVER invoked silently on production data.
 */
export async function seedDemoProgressForTesting(): Promise<void> {
  const now = new Date().toISOString();
  const todayStr = now.split('T')[0];

  await db.transaction('rw', [
    db.goals,
    db.goalMilestones,
    db.skills,
    db.learningResources,
    db.bookDetails,
    db.tasks,
    db.habits
  ], async () => {
    // Demo Goal
    await db.goals.put({
      id: 'demo-goal-semi',
      title: 'Qualify for a Semiconductor Internship',
      whyItMatters: 'Build technical foundation in nano-fabrication for industry placement',
      horizon: 'ANNUAL',
      targetDate: '2027-06-30',
      status: 'IN_PROGRESS',
      progressPercentage: 20,
      isArchived: false,
      createdAt: now,
      updatedAt: now
    });

    await db.goalMilestones.put({
      id: 'demo-ms-q1',
      goalId: 'demo-goal-semi',
      title: 'Complete Semiconductor Physics & Fabrication Course',
      targetDate: '2027-03-31',
      status: 'IN_PROGRESS',
      sortOrder: 1,
      weight: 40,
      createdAt: now,
      updatedAt: now
    });

    // Demo Skills
    await db.skills.put({
      id: 'demo-skill-semi',
      name: 'Semiconductor Physics',
      category: 'علمي',
      baselineLevel: 1,
      targetLevel: 5,
      contentProgress: 15,
      demonstratedCompetence: 10,
      sortOrder: 1,
      createdAt: now,
      updatedAt: now
    });

    await db.skills.put({
      id: 'demo-skill-python',
      name: 'Python',
      category: 'تقني',
      baselineLevel: 1,
      targetLevel: 5,
      contentProgress: 25,
      demonstratedCompetence: 20,
      sortOrder: 2,
      createdAt: now,
      updatedAt: now
    });
  });
}

/**
 * Automatic versioned curriculum seed from Ahmed_Study_Planner_Simple_Smart_v4.xlsx.
 * Called on EVERY app load, but applies only once per device/profile; does NOT
 * require a button or replace user-created subject/timetable records.
 * Respects tombstones to prevent resurrecting intentionally deleted items.
 */
export async function seedAhmedStudyPlannerIfNeeded(): Promise<void> {
  const markerId = 'curriculum-2026-semester1-excel-v2';
  const marker = await db.appMeta.get(markerId);
  if (marker) return;

  const { AHMED_CURRICULUM } = await import('./ahmedCurriculum');
  const now = new Date().toISOString();

  await db.transaction('rw', [
    db.universitySubjects,
    db.timetableSlots,
    db.appMeta,
    db.tombstones
  ], async () => {
    const existingSubjects = await db.universitySubjects.toArray();
    const existingSlots = await db.timetableSlots.toArray();
    const tombstones = await db.tombstones.toArray();

    // 1. Seed Subjects (missing only, tombstone-guarded)
    for (const subject of AHMED_CURRICULUM.subjects) {
      const isDeletedByUser = tombstones.some(t => t.entityType === 'SUBJECT' && t.entityId === subject.id);
      if (isDeletedByUser) continue;

      const alreadyExists = existingSubjects.some(s =>
        s.id === subject.id ||
        (s.code?.trim().toUpperCase() === subject.code &&
         s.academicYear === 3 && s.semester === 1)
      );

      if (!alreadyExists) {
        await db.universitySubjects.add({
          id: subject.id,
          name: subject.name,
          code: subject.code,
          professor: subject.professor,
          focus: subject.focus,
          hall: subject.hall,
          academicYear: 3,
          semester: 1,
          difficulty: subject.focus === 'High' ? 'HARD' : 'MEDIUM',
          createdAt: now,
          updatedAt: now
        });
      }
    }

    // 2. Previously shipped fixtures invented midterm dates. Correct only
    // untouched original seed fingerprints; keep manually edited records.
    const originalSeedExamDates: Record<string, string> = {
      'subj-spectro': '2026-11-18', 'subj-biomed': '2026-11-19',
      'subj-thermo': '2026-11-08', 'subj-quantum': '2026-11-10',
      'subj-water': '2026-11-12', 'subj-mgmt': '2026-11-14',
      'subj-solid': '2026-11-16', 'subj-cs': '2026-11-17'
    };

    for (const old of existingSubjects) {
      const wrongDate = originalSeedExamDates[old.id];
      if (wrongDate && old.createdAt === old.updatedAt &&
          old.examDate === wrongDate && old.midExamDate === wrongDate) {
        await db.universitySubjects.update(old.id, {
          examDate: undefined,
          midExamDate: undefined,
          updatedAt: now
        });
      }
    }

    // 3. Seed Weekly Slots (missing only, tombstone-guarded)
    for (const slot of AHMED_CURRICULUM.weeklySlots) {
      const isDeletedByUser = tombstones.some(t => t.entityType === 'TIMETABLE_SLOT' && t.entityId === slot.id);
      if (isDeletedByUser) continue;

      const existing = existingSlots.find(s => s.id === slot.id ||
        (s.subjectCode?.trim().toUpperCase() === slot.subjectCode &&
         s.day === slot.day && s.startTime === slot.startTime));

      if (!existing) {
        await db.timetableSlots.add(slot);
      } else if (existing.id === 'slot-mon-1' &&
                 existing.endTime === '21:00' &&
                 existing.subjectCode === 'NAC 3503' &&
                 existing.day === 'الاثنين' &&
                 existing.startTime === '19:00' &&
                 existing.hall === 'Online') {
        // Correct legacy invented Monday end time to null
        await db.timetableSlots.update(existing.id, {
          endTime: null,
          notes: 'وقت الانتهاء غير محدد في المصدر'
        });
      }
    }

    // Mark migration as completed
    await db.appMeta.put({ id: markerId, appliedAt: now });
  });
}

/**
 * Removes legacy v1 demo artifacts (e.g. Band Gap Engineering task) that were seeded
 * prior to the real study planner, and records tombstones so they never resurrect.
 */
export async function cleanupLegacyDemoArtifacts(): Promise<void> {
  const legacyTaskIds = ['task-semi-review', 'task-falcon-packaging'];
  
  await db.transaction('rw', [
    db.tasks,
    db.taskPostponements,
    db.scheduleBlocks,
    db.studySessions,
    db.universitySubjects,
    db.tombstones
  ], async () => {
    // 1. Find and delete legacy demo tasks specifically
    const legacyTasks = await db.tasks.filter(t => 
      legacyTaskIds.includes(t.id) || 
      t.title === 'مراجعة محاضرة Band Gap Engineering وحل مسألة عليها' ||
      t.title === 'متابعة تصميم الكفرات الجديدة مع المورد واعتماد عينة التغليف'
    ).toArray();

    for (const t of legacyTasks) {
      await db.tasks.delete(t.id);
      await db.taskPostponements.where('taskId').equals(t.id).delete();
      await db.scheduleBlocks.where('taskId').equals(t.id).delete();
      await db.tombstones.put({
        id: `tomb-task-${t.id}`,
        entityType: 'TASK',
        entityId: t.id,
        deletedAt: new Date().toISOString(),
        reason: 'Legacy v1 demo task cleanup'
      });
    }

    // 2. Clean up legacy mock study sessions
    const legacySessions = await db.studySessions.filter(s => 
      s.id.startsWith('sess-semi-') || s.title.includes('Band Gap')
    ).toArray();
    for (const s of legacySessions) {
      await db.studySessions.delete(s.id);
    }

    // 3. Clean up legacy mock subj-semiconductors if present
    const mockSubj = await db.universitySubjects.get('subj-semiconductors');
    if (mockSubj && (mockSubj.code === 'NANO-301' || mockSubj.name.includes('أشباه الموصلات'))) {
      await db.universitySubjects.delete('subj-semiconductors');
      await db.tombstones.put({
        id: 'tomb-subj-semiconductors',
        entityType: 'SUBJECT',
        entityId: 'subj-semiconductors',
        deletedAt: new Date().toISOString(),
        reason: 'Legacy v1 mock subject cleanup'
      });
    }
  });
}

/**
 * Automatically repairs existing lectures for any subject where lectures
 * were saved with duplicate numbers (e.g. multiple "محاضرة 1") or missing lecture numbers.
 * Assigns sequential 1, 2, 3... order based on creation/id.
 */
export async function repairDuplicateLectureNumbersIfNeeded(): Promise<void> {
  const sessions = await db.studySessions.toArray();
  if (sessions.length === 0) return;

  const bySubject = new Map<string, typeof sessions>();
  for (const s of sessions) {
    if (!bySubject.has(s.subjectId)) bySubject.set(s.subjectId, []);
    bySubject.get(s.subjectId)!.push(s);
  }

  for (const [_, list] of bySubject.entries()) {
    const duplicateOrMissing = list.filter(s => !s.lectureNumber || s.lectureNumber === 1);
    if (duplicateOrMissing.length > 1) {
      list.sort((a, b) => a.id.localeCompare(b.id));
      for (let i = 0; i < list.length; i++) {
        const expectedNum = i + 1;
        if (list[i].lectureNumber !== expectedNum) {
          list[i].lectureNumber = expectedNum;
          list[i].updatedAt = new Date().toISOString();
          await db.studySessions.put(list[i]);
        }
      }
    }
  }
}

export { seedAhmed2027GoalsIfNeeded, importAhmed2027GoalsPlan } from '../engines/ahmedGoalsImporter';
export { seedAhmed2026BridgeGoalsIfNeeded, importAhmed2026BridgeGoalsPlan } from '../engines/ahmedGoals2026BridgeImporter';
export { seedAhmedBooks181IfNeeded, importAhmedBooks181 } from '../engines/ahmedBooks181Importer';
