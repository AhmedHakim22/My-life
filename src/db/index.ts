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
  CourseLesson
} from '../types';

export class MasaarDatabase extends Dexie {
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
      name: 'فالكون — براند الكفرات والإكسسوارات',
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
      title: 'قراءة صفحتين يومياً',
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
      title: 'الورد القرآني اليومي',
      targetType: 'BOOLEAN',
      targetValue: 1,
      streakCount: 0,
      consecutiveMisses: 0,
      restDays: [],
      lastCompletedDate: undefined,
      createdAt: now,
      updatedAt: now
    }
  ];
  await db.habits.bulkPut(habits);

  // 3. Seed Ahmed's Real Nanotechnology Curriculum & Timetable
  await seedAhmedStudyPlannerIfNeeded();
}

/**
 * Saves a pre-migration JSON snapshot in localStorage for safe rollback.
 */
export async function takePreMigrationSnapshot(): Promise<void> {
  try {
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
 * Seeds or updates Ahmed's 8 Nanotechnology subjects, Weekly Timetable, Quizzes, and NASA/Sciora activities.
 */
export async function seedAhmedStudyPlannerIfNeeded(): Promise<void> {
  const spectroSubject = await db.universitySubjects.get('subj-spectro');
  if (spectroSubject) return; // Already seeded Ahmed's curriculum

  const now = new Date().toISOString();

  // 1. Ahmed's Exact 8 Nanotechnology Subjects (Cairo University)
  const ahmedSubjects: UniversitySubject[] = [
    {
      id: 'subj-spectro',
      name: 'Molecular Spectroscopy',
      code: 'NAC 3503',
      academicYear: 3,
      semester: 1,
      professor: 'أ.د. حسين مصطفى',
      focus: 'High',
      hall: 'Online',
      scheduleDescription: 'الاثنين 19:00 (Online)',
      examDate: '2026-11-18',
      midExamDate: '2026-11-18',
      difficulty: 'HARD',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'subj-biomed',
      name: 'Nanotechnology in Biomedicine',
      code: 'NAB 3502',
      academicYear: 3,
      semester: 1,
      professor: 'أ.د. طارق عبد الموجود',
      focus: 'High',
      hall: 'مدرج 5',
      scheduleDescription: 'الثلاثاء 12:00 - 14:00',
      examDate: '2026-11-19',
      midExamDate: '2026-11-19',
      difficulty: 'HARD',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'subj-thermo',
      name: 'Thermodynamics and Phase',
      code: 'NAC 3510',
      academicYear: 3,
      semester: 1,
      professor: 'د. محمود عادل',
      focus: 'Normal',
      hall: 'مدرج 5',
      scheduleDescription: 'السبت 08:00 - 10:00',
      examDate: '2026-11-08',
      midExamDate: '2026-11-08',
      difficulty: 'HARD',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'subj-quantum',
      name: 'Quantum Phenomena I',
      code: 'NAC 3504',
      academicYear: 3,
      semester: 1,
      professor: 'أ.د. محمد شبل',
      focus: 'Normal',
      hall: 'مدرج ج',
      scheduleDescription: 'السبت 10:00 - 12:00',
      examDate: '2026-11-10',
      midExamDate: '2026-11-10',
      difficulty: 'HARD',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'subj-water',
      name: 'Application of Nanomaterials for Water Treatment',
      code: 'NAC 3501',
      academicYear: 3,
      semester: 1,
      professor: 'أ.د. رندا محمد',
      focus: 'Normal',
      hall: 'مدرج ج',
      scheduleDescription: 'السبت 14:00 - 16:00',
      examDate: '2026-11-12',
      midExamDate: '2026-11-12',
      difficulty: 'MEDIUM',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'subj-mgmt',
      name: 'Management and Economics',
      code: 'NAA 3508',
      academicYear: 3,
      semester: 1,
      professor: 'أ.د. نهى محمد سيد',
      focus: 'Normal',
      hall: 'مدرج 7',
      scheduleDescription: 'الأحد 10:00 - 12:00',
      examDate: '2026-11-14',
      midExamDate: '2026-11-14',
      difficulty: 'EASY',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'subj-solid',
      name: 'Solid State',
      code: 'NAP 3509',
      academicYear: 3,
      semester: 1,
      professor: 'أ.د. عبير عبدالله حسن',
      focus: 'Normal',
      hall: 'مدرج 23',
      scheduleDescription: 'الأحد 14:00 - 16:00',
      examDate: '2026-11-16',
      midExamDate: '2026-11-16',
      difficulty: 'HARD',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'subj-cs',
      name: 'Computer Science',
      code: 'NAA 3507',
      academicYear: 3,
      semester: 1,
      professor: 'د. محمد الجيار',
      focus: 'Normal',
      hall: 'مدرج 5',
      scheduleDescription: 'الأحد 16:00 - 19:00',
      examDate: '2026-11-17',
      midExamDate: '2026-11-17',
      difficulty: 'MEDIUM',
      createdAt: now,
      updatedAt: now
    }
  ];
  await db.universitySubjects.bulkPut(ahmedSubjects);

  // 2. Ahmed's Initial Sessions
  const ahmedSessions: StudySession[] = [
    {
      id: 'sess-spectro-lec1',
      subjectId: 'subj-spectro',
      type: 'LECTURE',
      title: 'Molecular Spectroscopy — Lecture 1',
      lectureNumber: 1,
      status: 'STUDIED',
      materialReady: true,
      studyDone: false,
      reviseDone: false,
      solveDone: false,
      priority: 'High',
      notes: 'ملف المحاضرة متاح — جاهزة للبدء',
      fsrsStability: 0,
      fsrsDifficulty: 0
    },
    {
      id: 'sess-biomed-lec1',
      subjectId: 'subj-biomed',
      type: 'LECTURE',
      title: 'Nanotechnology in Biomedicine — Lecture 1',
      lectureNumber: 1,
      status: 'STUDIED',
      materialReady: true,
      studyDone: false,
      reviseDone: false,
      solveDone: false,
      priority: 'High',
      notes: 'ملف المحاضرة متاح — جاهزة للبدء',
      fsrsStability: 0,
      fsrsDifficulty: 0
    }
  ];
  await db.studySessions.bulkPut(ahmedSessions);

  // 3. Weekly Timetable Slots
  const timetable: TimetableSlot[] = [
    { id: 'slot-sat-1', day: 'السبت', startTime: '08:00', endTime: '10:00', subjectName: 'Thermodynamics and Phase', subjectCode: 'NAC 3510', format: 'Campus', hall: 'مدرج 5' },
    { id: 'slot-sat-2', day: 'السبت', startTime: '10:00', endTime: '12:00', subjectName: 'Quantum Phenomena I', subjectCode: 'NAC 3504', format: 'Campus', hall: 'مدرج ج' },
    { id: 'slot-sat-3', day: 'السبت', startTime: '14:00', endTime: '16:00', subjectName: 'Application of Nanomaterials for Water Treatment', subjectCode: 'NAC 3501', format: 'Campus', hall: 'مدرج ج' },
    { id: 'slot-sun-1', day: 'الأحد', startTime: '10:00', endTime: '12:00', subjectName: 'Management and Economics', subjectCode: 'NAA 3508', format: 'Campus', hall: 'مدرج 7' },
    { id: 'slot-sun-2', day: 'الأحد', startTime: '14:00', endTime: '16:00', subjectName: 'Solid State', subjectCode: 'NAP 3509', format: 'Campus', hall: 'مدرج 23' },
    { id: 'slot-sun-3', day: 'الأحد', startTime: '16:00', endTime: '19:00', subjectName: 'Computer Science', subjectCode: 'NAA 3507', format: 'Campus', hall: 'مدرج 5' },
    { id: 'slot-mon-1', day: 'الاثنين', startTime: '19:00', endTime: '21:00', subjectName: 'Molecular Spectroscopy', subjectCode: 'NAC 3503', format: 'Online', hall: 'Online' },
    { id: 'slot-tue-1', day: 'الثلاثاء', startTime: '12:00', endTime: '14:00', subjectName: 'Nanotechnology in Biomedicine', subjectCode: 'NAB 3502', format: 'Campus', hall: 'مدرج 5' }
  ];
  await db.timetableSlots.bulkPut(timetable);

  // 4. NASA & Sciora Student Activities
  const activities: StudentActivityTask[] = [
    { id: 'act-nasa-bootcamp', activityName: 'NASA Space Apps', taskName: 'NASA Space Apps — Bootcamp', deadline: '2026-10-24', done: false, notes: 'بوتكامب تدريبي' },
    { id: 'act-nasa-day1', activityName: 'NASA Space Apps', taskName: 'NASA Space Apps — Day 1', deadline: '2026-11-14', done: false, notes: 'يوم المسابقة الأول' },
    { id: 'act-nasa-day2', activityName: 'NASA Space Apps', taskName: 'NASA Space Apps — Day 2', deadline: '2026-11-15', done: false, notes: 'يوم المسابقة الثاني والتسليم' },
    { id: 'act-sciora-tasks', activityName: 'Sciora', taskName: 'متابعة مهام فريق Sciora', done: false, notes: 'مواعيد مرنة' }
  ];
  await db.studentActivities.bulkPut(activities);
}
