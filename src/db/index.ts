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
  StudentActivityTask
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
  }
}

export const db = new MasaarDatabase();

/**
 * Seed initial data if the database is empty.
 * Sets up domains, Falcon, Nanotechnology subjects, and the 2-pages reading habit.
 */
export async function seedInitialDataIfNeeded(): Promise<void> {
  const domainsCount = await db.domains.count();
  if (domainsCount > 0) return; // already seeded

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
  await db.domains.bulkAdd(domains);

  // 2. University Subjects (Nanotechnology)
  const subjects: UniversitySubject[] = [
    {
      id: 'subj-semiconductors',
      name: 'فيزياء وتكنولوجيا أشباه الموصلات',
      code: 'NANO-301',
      academicYear: 3,
      semester: 1,
      professor: 'د. رئيس قسم النانو',
      examDate: '2026-11-15',
      difficulty: 'HARD',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'subj-characterization',
      name: 'طرق التوصيف المجهري والطيفي (SEM/TEM)',
      code: 'NANO-302',
      academicYear: 3,
      semester: 1,
      professor: 'د. أستاذ المجهر الإلكتروني',
      examDate: '2026-11-20',
      difficulty: 'MEDIUM',
      createdAt: now,
      updatedAt: now
    }
  ];
  await db.universitySubjects.bulkAdd(subjects);

  // 3. Study Sessions / Lectures
  const sessions: StudySession[] = [
    {
      id: 'sess-semi-lec3',
      subjectId: 'subj-semiconductors',
      type: 'LECTURE',
      title: 'محاضرة 3: Band Gap Engineering & Quantum Wells',
      status: 'UNDERSTOOD',
      fsrsStability: 2.1,
      fsrsDifficulty: 6.5,
      fsrsLastReview: now,
      fsrsNextReview: todayStr
    },
    {
      id: 'sess-semi-sheet1',
      subjectId: 'subj-semiconductors',
      type: 'ASSIGNMENT',
      title: 'شيت 1: حسابات كثافة الشحنات وفجوة الطاقة',
      status: 'SOLVED',
      submittedDate: undefined,
      fsrsStability: 0,
      fsrsDifficulty: 0
    }
  ];
  await db.studySessions.bulkAdd(sessions);

  // 4. Skills
  const skills: Skill[] = [
    {
      id: 'skill-python',
      name: 'Python for Science & ML',
      category: 'تقني',
      baselineLevel: 2,
      targetLevel: 5,
      contentProgress: 45,
      demonstratedCompetence: 30,
      sortOrder: 1,
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'skill-semiconductors',
      name: 'Semiconductor Device Physics',
      category: 'علمي',
      baselineLevel: 2,
      targetLevel: 5,
      contentProgress: 60,
      demonstratedCompetence: 40,
      sortOrder: 2,
      createdAt: now,
      updatedAt: now
    }
  ];
  await db.skills.bulkAdd(skills);

  // 5. Books & Reading Habit
  const bookResource: LearningResource = {
    id: 'res-book-nanotech',
    type: 'BOOK',
    title: 'Nanotechnology: Understanding Small Systems',
    description: 'مرجع شامل في فيزياء وتطبيقات أنظمة النانو',
    sourceUrl: 'https://openlibrary.org',
    provider: 'Open Library',
    status: 'IN_PROGRESS',
    createdAt: now,
    updatedAt: now
  };
  await db.learningResources.add(bookResource);

  const bookDetail: BookDetails = {
    resourceId: 'res-book-nanotech',
    author: 'Ben Rogers, Jesse Adams',
    totalPages: 412,
    currentPage: 48,
    shelf: 'Reading',
    rating: 5
  };
  await db.bookDetails.add(bookDetail);

  // 6. Habit: Read 2 Pages daily
  const habits: Habit[] = [
    {
      id: 'habit-read-2-pages',
      title: 'قراءة صفحتين يومياً في كتاب النانو',
      targetType: 'PAGES',
      targetValue: 2,
      streakCount: 5,
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
      streakCount: 12,
      consecutiveMisses: 0,
      restDays: [],
      lastCompletedDate: undefined,
      createdAt: now,
      updatedAt: now
    }
  ];
  await db.habits.bulkAdd(habits);

  // 7. Initial Tasks
  const tasks: Task[] = [
    {
      id: 'task-semi-review',
      title: 'مراجعة محاضرة Band Gap Engineering وحل مسألة عليها',
      priority: 'P1_URGENT_IMPORTANT',
      status: 'TODO',
      dueDate: todayStr,
      estimatedMinutes: 35,
      isLocked: false,
      postponementCount: 0,
      studySessionId: 'sess-semi-lec3',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'task-falcon-packaging',
      title: 'متابعة تصميم الكفرات الجديدة مع المورد واعتماد عينة التغليف',
      priority: 'P2_IMPORTANT',
      status: 'TODO',
      dueDate: todayStr,
      estimatedMinutes: 25,
      isLocked: false,
      postponementCount: 0,
      goalId: undefined,
      createdAt: now,
      updatedAt: now
    }
  ];
  await db.tasks.bulkAdd(tasks);

  // 8. Initial XP transaction
  const initialXP: XPTransaction = {
    id: 'xp-init',
    idempotencyKey: 'INIT_BONUS_ONBOARDING',
    amount: 150,
    category: 'MILESTONE',
    reason: 'بدء استخدام نظام مَسار وتفعيل مساحات النانو وفالكون',
    createdAt: now
  };
  await db.xpTransactions.add(initialXP);

  // 9. Seed Ahmed's Real Study Planner System
  await seedAhmedStudyPlannerIfNeeded();
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
