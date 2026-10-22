import { create } from 'zustand';
import { db, seedInitialDataIfNeeded, seedAhmedStudyPlannerIfNeeded, cleanupLegacyDemoArtifacts } from '../db';
import type {
  LifeDomain,
  Goal,
  GoalMilestone,
  GoalLink,
  CustomCategory,
  Skill,
  LearningResource,
  BookDetails,
  CourseDetails,
  CourseModule,
  CourseLesson,
  SkillResource,
  SkillEvidence,
  UniversitySubject,
  StudySession,
  Task,
  Habit,
  HabitLog,
  XPTransaction,
  JournalEntry,
  TimetableSlot,
  AcademicQuiz,
  AcademicAssignment,
  StudentActivityTask,
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
  WeeklySchedulePlan
} from '../types';
import { getCairoPrayerTimes, type DayPrayersResult } from '../engines/prayer';
import { getCairoDateString, getCairoTomorrowDateString } from '../lib/dateUtils';
import { recommendBestNextAction, type NextActionRecommendation } from '../engines/recommender';
import { calculateUserRank, generateXPIdempotencyKey, type UserRankProgress } from '../engines/gamification';
import { evaluateHabitStreak } from '../engines/habits';
import { calculateNextRevision, type StudyGrade } from '../engines/fsrs';
import { 
  checkSupabaseConnection, 
  pushAllToSupabase, 
  pullAllFromSupabase, 
  processSyncQueue 
} from '../lib/sync';

export type ActiveTab = 
  | 'TODAY' 
  | 'GOALS' 
  | 'UNIVERSITY' 
  | 'LEARNING' 
  | 'BOOKS' 
  | 'FALCON' 
  | 'JOURNAL' 
  | 'HABITS' 
  | 'ANALYTICS' 
  | 'SETTINGS' 
  | 'FAITH' 
  | 'FITNESS' 
  | 'SCHEDULE' 
  | 'MORE';

interface AppState {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Data
  isLoaded: boolean;
  domains: LifeDomain[];
  goals: Goal[];
  goalMilestones: GoalMilestone[];
  goalLinks: GoalLink[];
  categories: CustomCategory[];
  skills: Skill[];
  learningResources: LearningResource[];
  bookDetails: BookDetails[];
  courseDetails: CourseDetails[];
  courseModules: CourseModule[];
  courseLessons: CourseLesson[];
  skillResources: SkillResource[];
  skillEvidence: SkillEvidence[];
  universitySubjects: UniversitySubject[];
  studySessions: StudySession[];
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLog[];
  xpTransactions: XPTransaction[];
  journalEntries: JournalEntry[];

  // Ahmed's Study Planner System
  timetableSlots: TimetableSlot[];
  academicQuizzes: AcademicQuiz[];
  academicAssignments: AcademicAssignment[];
  studentActivities: StudentActivityTask[];

  // MASAAR V2 Extended Entities
  intentions: Intention[];
  goalIntentions: GoalIntention[];
  worshipLogs: WorshipLog[];
  quranLogs: QuranReadingLog[];
  qiyamSessions: QiyamSession[];
  movementLogs: MovementLog[];
  workoutLogs: WorkoutLog[];
  availabilityRules: AvailabilityRule[];
  scheduleBlocks: ScheduleBlock[];
  schedulePlans: WeeklySchedulePlan[];
  tombstones: Tombstone[];
  xpResetEvents: XPResetEvent[];

  // Computed / Engine states
  prayers: DayPrayersResult;
  bestNextAction: NextActionRecommendation | null;
  rankProgress: UserRankProgress;

  // Modals & UI
  isQuickCaptureOpen: boolean;
  setQuickCaptureOpen: (open: boolean) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Core Actions
  loadAllData: () => Promise<void>;
  
  // 1. One-Tap Atomic Read 2 Pages Action
  readTwoPagesAction: (bookResourceId?: string) => Promise<void>;
  undoReadTwoPagesAction: (bookResourceId?: string) => Promise<void>;
  
  // 2. Task Actions
  completeTask: (taskId: string) => Promise<void>;
  uncompleteTask: (taskId: string) => Promise<void>;
  toggleTaskStatus: (taskId: string) => Promise<void>;
  postponeTask: (taskId: string, reason?: string, targetNewDate?: string) => Promise<void>;
  addTask: (title: string, priority: Task['priority'], estimatedMinutes?: number, dueDate?: string, goalId?: string, skillId?: string, studySessionId?: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;

  // Goal Center Actions
  createGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'progressPercentage'>) => Promise<string>;
  updateGoal: (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => Promise<void>;
  archiveGoal: (id: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addGoalMilestone: (milestone: Omit<GoalMilestone, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  toggleMilestone: (id: string) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;
  recalculateGoalProgress: (goalId: string) => Promise<void>;
  linkEntityToGoal: (goalId: string, entityType: GoalLink['entityType'], entityId: string) => Promise<void>;
  unlinkEntityFromGoal: (goalId: string, entityId: string) => Promise<void>;

  // Category Actions
  addCategory: (category: Omit<CustomCategory, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>) => Promise<string>;
  deleteCategory: (id: string) => Promise<void>;
  deleteCategoryWithOption: (id: string, action: 'UNCATEGORIZE' | 'DELETE_CHILDREN') => Promise<void>;

  // Skills & Learning Graph Actions
  linkSkillResource: (skillId: string, resourceId: string) => Promise<void>;
  unlinkSkillResource: (skillId: string, resourceId: string) => Promise<void>;
  addSkillEvidence: (evidence: Omit<SkillEvidence, 'id'>) => Promise<string>;
  updateSkill: (skillId: string, updates: Partial<Skill>) => Promise<void>;
  deleteSkill: (skillId: string) => Promise<void>;

  // Content Management: Books & Resources CRUD + Deletion Tombstones
  deleteBook: (resourceId: string) => Promise<void>;
  editBook: (resourceId: string, updates: { title?: string; author?: string; totalPages?: number; shelf?: 'Reading' | 'Want to Read' | 'Finished' }) => Promise<void>;
  archiveBook: (resourceId: string) => Promise<void>;
  deleteLearningResource: (resourceId: string) => Promise<void>;

  // Faith & Intentions Actions
  addIntention: (intention: Omit<Intention, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>) => Promise<string>;
  updateIntention: (id: string, updates: Partial<Intention>) => Promise<void>;
  deleteIntention: (id: string) => Promise<void>;
  linkIntentionToGoal: (goalId: string, intentionId: string) => Promise<void>;
  unlinkIntentionFromGoal: (goalId: string, intentionId: string) => Promise<void>;
  logPrayerWorship: (prayerName: WorshipLog['prayerName'], status: WorshipLog['status'], inMosque?: boolean) => Promise<void>;
  deletePrayerWorship: (prayerName: WorshipLog['prayerName']) => Promise<void>;
  logQuranReading: (pagesRead: number, surahStart?: string, surahEnd?: string, notes?: string) => Promise<void>;
  deleteQuranLog: (logId: string) => Promise<void>;
  logQiyamSession: (session: Omit<QiyamSession, 'id' | 'createdAt'>) => Promise<string>;
  deleteQiyamSession: (id: string) => Promise<void>;

  // Health & Fitness Actions
  logMovement: (durationMinutes: number, activityType: MovementLog['activityType'], notes?: string) => Promise<string>;
  logWorkout: (workout: Omit<WorkoutLog, 'id' | 'createdAt'>) => Promise<string>;
  deleteWorkout: (id: string) => Promise<void>;

  // Availability & Scheduling Actions
  addAvailabilityRule: (rule: Omit<AvailabilityRule, 'id'>) => Promise<string>;
  deleteAvailabilityRule: (id: string) => Promise<void>;

  // XP Baseline & Reset Actions
  createPreResetBackup: () => Promise<string>;
  resetXPToZeroBaseline: (reason?: string) => Promise<void>;

  // 3. University Study Actions
  addUniversitySubject: (subject: Omit<UniversitySubject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateUniversitySubject: (id: string, updates: Partial<Omit<UniversitySubject, 'id' | 'createdAt'>>) => Promise<void>;
  deleteUniversitySubject: (id: string) => Promise<void>;
  addStudySession: (session: { subjectId: string; title: string; type: StudySession['type']; status?: StudySession['status']; lectureNumber?: number }) => Promise<string>;
  deleteStudySession: (sessionId: string) => Promise<void>;
  updateSessionStatus: (sessionId: string, newStatus: StudySession['status']) => Promise<void>;
  recordStudyReview: (sessionId: string, grade: StudyGrade) => Promise<void>;

  // Ahmed's Study Planner Actions
  addQuiz: (quiz: Omit<AcademicQuiz, 'id'>) => Promise<string>;
  toggleQuizPrepared: (id: string) => Promise<void>;
  toggleQuizAttended: (id: string) => Promise<void>;
  recordQuizScore: (id: string, score: number, outOf: number) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;

  addAssignment: (assignment: Omit<AcademicAssignment, 'id'>) => Promise<string>;
  toggleAssignmentCompleted: (id: string) => Promise<void>;
  toggleAssignmentSubmitted: (id: string) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;

  addStudentActivity: (act: Omit<StudentActivityTask, 'id'>) => Promise<string>;
  toggleStudentActivityDone: (id: string) => Promise<void>;
  deleteStudentActivity: (id: string) => Promise<void>;

  toggleLectureStep: (sessionId: string, step: 'study' | 'revise' | 'solve' | 'material') => Promise<void>;

  // 4. Book Actions
  addBook: (title: string, author?: string, totalPages?: number, coverUrl?: string) => Promise<void>;
  updateBookPage: (resourceId: string, newPage: number) => Promise<void>;

  // 5. Skill & Course Actions
  addSkill: (name: string, category: string, targetLevel?: number) => Promise<void>;
  addCourseResource: (title: string, sourceUrl?: string, instructor?: string, durationMinutes?: number, totalLessons?: number) => Promise<string>;

  // 6. Habit Actions
  toggleHabitToday: (habitId: string) => Promise<void>;

  // 7. Journal Actions
  addJournalEntry: (content: string, mode: JournalEntry['mode'], tags?: string[]) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;

  // 8. Backup / Export / Restore
  exportBackupJSON: () => Promise<string>;
  importBackupJSON: (jsonString: string) => Promise<boolean>;

  // 9. Cloud Sync (Supabase)
  syncStatus: {
    isConfigured: boolean;
    isConnected: boolean;
    tablesFound: boolean;
    lastSyncedAt: string | null;
    isSyncing: boolean;
    error: string | null;
  };
  checkCloudStatus: () => Promise<void>;
  syncWithCloud: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'TODAY',
  setActiveTab: (tab) => set({ activeTab: tab }),

  isLoaded: false,
  domains: [],
  goals: [],
  goalMilestones: [],
  goalLinks: [],
  categories: [],
  skills: [],
  learningResources: [],
  bookDetails: [],
  courseDetails: [],
  courseModules: [],
  courseLessons: [],
  skillResources: [],
  skillEvidence: [],
  universitySubjects: [],
  studySessions: [],
  tasks: [],
  habits: [],
  habitLogs: [],
  xpTransactions: [],
  journalEntries: [],
  timetableSlots: [],
  academicQuizzes: [],
  academicAssignments: [],
  studentActivities: [],
  intentions: [],
  goalIntentions: [],
  worshipLogs: [],
  quranLogs: [],
  qiyamSessions: [],
  movementLogs: [],
  workoutLogs: [],
  availabilityRules: [],
  scheduleBlocks: [],
  schedulePlans: [],
  tombstones: [],
  xpResetEvents: [],

  prayers: getCairoPrayerTimes(),
  bestNextAction: null,
  rankProgress: calculateUserRank([]),

  isQuickCaptureOpen: false,
  setQuickCaptureOpen: (open) => set({ isQuickCaptureOpen: open }),
  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 3500);
  },

  syncStatus: {
    isConfigured: false,
    isConnected: false,
    tablesFound: false,
    lastSyncedAt: null,
    isSyncing: false,
    error: null
  },

  checkCloudStatus: async () => {
    try {
      const res = await checkSupabaseConnection();
      set(state => ({
        syncStatus: {
          ...state.syncStatus,
          isConfigured: true,
          isConnected: res.connected,
          tablesFound: res.tablesFound,
          error: res.error || null
        }
      }));
    } catch (e: any) {
      set(state => ({
        syncStatus: {
          ...state.syncStatus,
          isConnected: false,
          error: e.message || 'فشل الاتصال'
        }
      }));
    }
  },

  syncWithCloud: async () => {
    set(state => ({ syncStatus: { ...state.syncStatus, isSyncing: true, error: null } }));
    get().showToast('جارِ مزامنة البيانات مع سحابة سوبا بيز... 🔄');

    // 1. Pull changes first to reconcile
    await pullAllFromSupabase();

    // 2. Push local state
    const pushRes = await pushAllToSupabase();
    if (!pushRes.success) {
      set(state => ({
        syncStatus: {
          ...state.syncStatus,
          isSyncing: false,
          error: pushRes.error || 'فشلت المزامنة'
        }
      }));
      get().showToast(`تنبيه: ${pushRes.error}`);
      return;
    }

    await processSyncQueue();

    const nowStr = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    set(state => ({
      syncStatus: {
        ...state.syncStatus,
        isSyncing: false,
        isConnected: true,
        tablesFound: true,
        lastSyncedAt: nowStr,
        error: null
      }
    }));
    get().showToast(`تمت المزامنة بنجاح! تم رفع ${pushRes.syncedCount} عنصر إلى السحابة ☁️✨`);
  },

  loadAllData: async () => {
    await seedInitialDataIfNeeded();
    // Independent automatic curriculum seed from Excel (no button required)
    await seedAhmedStudyPlannerIfNeeded();
    // Automatic cleanup of legacy v1 demo artifacts (e.g. Band Gap Engineering task)
    await cleanupLegacyDemoArtifacts();

    const [
      domains,
      goals,
      goalMilestones,
      goalLinks,
      categories,
      skills,
      learningResources,
      bookDetails,
      courseDetails,
      courseModules,
      courseLessons,
      skillResources,
      skillEvidence,
      universitySubjects,
      studySessions,
      tasks,
      habits,
      habitLogs,
      xpTransactions,
      journalEntries,
      timetableSlots,
      academicQuizzes,
      academicAssignments,
      studentActivities,
      intentions,
      goalIntentions,
      worshipLogs,
      quranLogs,
      qiyamSessions,
      movementLogs,
      workoutLogs,
      availabilityRules,
      scheduleBlocks,
      schedulePlans,
      tombstones,
      xpResetEvents
    ] = await Promise.all([
      db.domains.toArray(),
      db.goals.toArray(),
      db.goalMilestones.toArray(),
      db.goalLinks.toArray(),
      db.categories.toArray(),
      db.skills.toArray(),
      db.learningResources.toArray(),
      db.bookDetails.toArray(),
      db.courseDetails.toArray(),
      db.courseModules.toArray(),
      db.courseLessons.toArray(),
      db.skillResources.toArray(),
      db.skillEvidence.toArray(),
      db.universitySubjects.toArray(),
      db.studySessions.toArray(),
      db.tasks.toArray(),
      db.habits.toArray(),
      db.habitLogs.toArray(),
      db.xpTransactions.toArray(),
      db.journalEntries.toArray(),
      db.timetableSlots.toArray(),
      db.academicQuizzes.toArray(),
      db.academicAssignments.toArray(),
      db.studentActivities.toArray(),
      db.intentions.toArray(),
      db.goalIntentions.toArray(),
      db.worshipLogs.toArray(),
      db.quranLogs.toArray(),
      db.qiyamSessions.toArray(),
      db.movementLogs.toArray(),
      db.workoutLogs.toArray(),
      db.availabilityRules.toArray(),
      db.scheduleBlocks.toArray(),
      db.schedulePlans.toArray(),
      db.tombstones.toArray(),
      db.xpResetEvents.toArray()
    ]);

    const prayers = getCairoPrayerTimes();
    const bestNextAction = recommendBestNextAction(tasks, prayers, universitySubjects, studySessions, new Date(), goals);
    const rankProgress = calculateUserRank(xpTransactions);

    set({
      isLoaded: true,
      domains,
      goals,
      goalMilestones,
      goalLinks,
      categories,
      skills,
      learningResources,
      bookDetails,
      courseDetails,
      courseModules,
      courseLessons,
      skillResources,
      skillEvidence,
      universitySubjects,
      studySessions,
      tasks,
      habits,
      habitLogs,
      xpTransactions,
      journalEntries,
      timetableSlots,
      academicQuizzes,
      academicAssignments,
      studentActivities,
      intentions,
      goalIntentions,
      worshipLogs,
      quranLogs,
      qiyamSessions,
      movementLogs,
      workoutLogs,
      availabilityRules,
      scheduleBlocks,
      schedulePlans,
      tombstones,
      xpResetEvents,
      prayers,
      bestNextAction,
      rankProgress
    });

    // Check cloud connection asynchronously
    get().checkCloudStatus().catch(console.warn);
  },

  // 1. One-Tap Atomic Read 2 Pages Action (Safe, Transactional, Validated)
  readTwoPagesAction: async (bookResourceId) => {
    const todayStr = getCairoDateString();
    const now = new Date().toISOString();

    // Default to the first in-progress reading book
    let targetBook = get().bookDetails.find(b => b.shelf === 'Reading') || get().bookDetails[0];
    if (bookResourceId) {
      targetBook = get().bookDetails.find(b => b.resourceId === bookResourceId) || targetBook;
    }

    if (!targetBook) {
      get().showToast('لا يوجد كتاب حالي في وضع القراءة');
      return;
    }

    const startPage = targetBook.currentPage;
    if (startPage >= targetBook.totalPages) {
      get().showToast('أنت أتممت قراءة هذا الكتاب بالكامل بالفعل! 🎉');
      return;
    }

    const endPage = Math.min(targetBook.totalPages, startPage + 2);
    const pagesRead = endPage - startPage;
    if (pagesRead <= 0) return;

    const bookResource = get().learningResources.find(r => r.id === targetBook.resourceId);
    const bookTitle = bookResource?.title || 'الكتاب';

    // Atomic transaction across all affected tables
    await db.transaction('rw', [
      db.bookDetails,
      db.readingSessions,
      db.habits,
      db.habitLogs,
      db.xpTransactions
    ], async () => {
      // A. Update Book Details
      await db.bookDetails.update(targetBook.resourceId, {
        currentPage: endPage,
        shelf: endPage >= targetBook.totalPages ? 'Finished' : 'Reading'
      });

      // B. Record Reading Session
      await db.readingSessions.add({
        id: `read-${Date.now()}`,
        bookResourceId: targetBook.resourceId,
        pagesRead,
        startPage,
        endPage,
        date: todayStr,
        notes: 'قراءة صفحتين سريعة',
        createdAt: now
      });

      // C. Update or Complete Reading Habit
      const readingHabit = get().habits.find(h => h.id === 'habit-read-2-pages' || h.targetType === 'PAGES');
      if (readingHabit) {
        const evalRes = evaluateHabitStreak(
          readingHabit,
          { id: `log-${Date.now()}`, habitId: readingHabit.id, date: todayStr, status: 'COMPLETED', valueRecorded: pagesRead },
          new Date()
        );
        await db.habits.update(readingHabit.id, {
          streakCount: evalRes.updatedStreak,
          consecutiveMisses: 0,
          lastCompletedDate: todayStr
        });
        await db.habitLogs.put({
          id: `hlog-${readingHabit.id}-${todayStr}`,
          habitId: readingHabit.id,
          date: todayStr,
          status: 'COMPLETED',
          valueRecorded: pagesRead,
          triggerSource: 'READ_2_PAGES_ACTION'
        });
      }

      // D. Award Idempotent XP (+15 XP)
      const idempotencyKey = generateXPIdempotencyKey('READ_2_PAGES', targetBook.resourceId, todayStr);
      try {
        await db.xpTransactions.add({
          id: `xp-${Date.now()}`,
          idempotencyKey,
          amount: 15,
          category: 'READING',
          reason: `قراءة ${pagesRead} صفحة في "${bookTitle}"`,
          createdAt: now
        });
      } catch (e) {
        // Ignored if already awarded today
      }
    });

    await get().loadAllData();
    get().showToast(`عاش! تم تسجيل ${pagesRead} صفحة في "${bookTitle}"، وعادة القراءة كملت (+15 XP) 🎉`);
  },

  undoReadTwoPagesAction: async (bookResourceId) => {
    const todayStr = getCairoDateString();
    let targetBook = get().bookDetails.find(b => b.shelf === 'Reading') || get().bookDetails[0];
    if (bookResourceId) {
      targetBook = get().bookDetails.find(b => b.resourceId === bookResourceId) || targetBook;
    }
    if (!targetBook) return;

    // Find latest reading session for this book today
    const sessions = await db.readingSessions
      .where('bookResourceId').equals(targetBook.resourceId)
      .filter(s => s.date === todayStr)
      .reverse()
      .sortBy('createdAt');

    const latestSession = sessions[0];
    const pagesToRevert = latestSession ? latestSession.pagesRead : 2;

    await db.transaction('rw', [
      db.bookDetails,
      db.readingSessions,
      db.habits,
      db.habitLogs,
      db.xpTransactions
    ], async () => {
      // Revert book page
      const newPage = Math.max(0, targetBook.currentPage - pagesToRevert);
      await db.bookDetails.update(targetBook.resourceId, {
        currentPage: newPage,
        shelf: 'Reading'
      });

      // Delete latest session
      if (latestSession) {
        await db.readingSessions.delete(latestSession.id);
      }

      // Revert reading habit if no more reading sessions today
      const remainingTodaySessions = await db.readingSessions
        .where('date').equals(todayStr)
        .toArray();

      const readingHabit = get().habits.find(h => h.id === 'habit-read-2-pages' || h.targetType === 'PAGES');
      if (readingHabit && remainingTodaySessions.length === 0) {
        await db.habitLogs.where({ habitId: readingHabit.id, date: todayStr }).delete();
        await db.habits.update(readingHabit.id, {
          streakCount: Math.max(0, readingHabit.streakCount - 1),
          lastCompletedDate: undefined
        });
      }

      // Rollback XP
      const idempotencyKey = generateXPIdempotencyKey('READ_2_PAGES', targetBook.resourceId, todayStr);
      await db.xpTransactions.where('idempotencyKey').equals(idempotencyKey).delete();
    });

    await get().loadAllData();
    get().showToast('تم التراجع عن قراءة الصفحتين بنجاح ↩️');
  },

  // 2. Task Actions
  completeTask: async (taskId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const now = new Date().toISOString();
    const todayStr = getCairoDateString();

    await db.tasks.update(taskId, {
      status: 'DONE',
      updatedAt: now
    });

    // Award XP based on priority
    const xpAmount = task.priority === 'P1_URGENT_IMPORTANT' ? 50 : 25;
    const idempotencyKey = generateXPIdempotencyKey('TASK_COMPLETE', taskId, todayStr);

    try {
      await db.xpTransactions.add({
        id: `xp-task-${Date.now()}`,
        idempotencyKey,
        amount: xpAmount,
        category: 'STUDY',
        reason: `إنجاز مهمة: ${task.title}`,
        createdAt: now
      });
    } catch (e) {
      // Already awarded
    }

    // Check if task is linked to a goal or milestone to recalculate
    if (task.goalId) {
      await get().recalculateGoalProgress(task.goalId);
    }

    await get().loadAllData();
    get().showToast(`تم إنجاز المهمة بنجاح! (+${xpAmount} XP) ⚡`);
  },

  uncompleteTask: async (taskId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    const now = new Date().toISOString();

    await db.tasks.update(taskId, {
      status: 'TODO',
      updatedAt: now
    });

    // Remove any XP awarded for completing this task so points remain 100% honest
    const targetKeyPrefix = `TASK_COMPLETE:${taskId}`.toUpperCase();
    const txList = await db.xpTransactions.filter(tx => 
      tx.idempotencyKey.toUpperCase().includes(targetKeyPrefix) ||
      Boolean(task.title && tx.reason.includes(task.title))
    ).toArray();
    for (const tx of txList) {
      await db.xpTransactions.delete(tx.id);
    }

    // Recalculate goal progress if linked
    if (task.goalId) {
      await get().recalculateGoalProgress(task.goalId);
    }

    await get().loadAllData();
    get().showToast(`تم التراجع وإلغاء إنجاز المهمة "${task.title}" ↩️`);
  },

  toggleTaskStatus: async (taskId) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;
    if (task.status === 'DONE') {
      await get().uncompleteTask(taskId);
    } else {
      await get().completeTask(taskId);
    }
  },

  postponeTask: async (taskId, reason, targetNewDate) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.isLocked) {
      get().showToast('هذه المهمة موعد ثابت محمي لا يمكن ترحيلها تلقائياً 🔒');
      return;
    }

    const newCount = task.postponementCount + 1;
    const now = new Date().toISOString();
    const newDueDate = targetNewDate || getCairoTomorrowDateString();

    await db.tasks.update(taskId, {
      postponementCount: newCount,
      dueDate: newDueDate,
      updatedAt: now
    });

    await db.taskPostponements.add({
      id: `postpone-${Date.now()}`,
      taskId,
      postponedAt: now,
      reason: reason || 'تأجيل تفاوضي',
      newDueDate
    });

    await get().loadAllData();

    if (newCount >= 3) {
      get().showToast(`المهمة دي اتأجلت 3 مرات! بنقترح تقسيمها أو تخفيف نطاقها.`);
    } else {
      get().showToast(`تم ترحيل المهمة إلى ${newDueDate} (${newCount} من 3 تأجيلات).`);
    }
  },

  addTask: async (title, priority, estimatedMinutes = 30, dueDate, goalId, skillId, studySessionId) => {
    const now = new Date().toISOString();
    const todayStr = getCairoDateString();

    const id = `task-${Date.now()}`;
    await db.tasks.add({
      id,
      title,
      priority,
      status: 'TODO',
      dueDate: dueDate || todayStr,
      estimatedMinutes,
      isLocked: false,
      postponementCount: 0,
      goalId,
      skillId,
      studySessionId,
      createdAt: now,
      updatedAt: now
    });

    if (goalId) {
      await db.goalLinks.put({
        id: `glink-task-${Date.now()}`,
        goalId,
        entityType: 'TASK',
        entityId: id,
        relationship: 'PRIMARY',
        createdAt: now
      });
      await get().recalculateGoalProgress(goalId);
    }

    await get().loadAllData();
    get().showToast('تمت إضافة المهمة بنجاح');
  },

  deleteTask: async (taskId) => {
    const task = get().tasks.find(t => t.id === taskId);
    const taskTitle = task?.title || '';

    await db.transaction('rw', [
      db.tasks,
      db.taskPostponements,
      db.scheduleBlocks,
      db.tombstones
    ], async () => {
      await db.tasks.delete(taskId);
      await db.taskPostponements.where('taskId').equals(taskId).delete();
      await db.scheduleBlocks.where('taskId').equals(taskId).delete();
      await db.tombstones.put({
        id: `tomb-task-${taskId}`,
        entityType: 'TASK',
        entityId: taskId,
        deletedAt: new Date().toISOString()
      });
    });

    if (task?.goalId) {
      await get().recalculateGoalProgress(task.goalId);
    }

    await get().loadAllData();
    get().showToast(`تم حذف المهمة "${taskTitle}" بنجاح 🗑️`);
  },

  // Goal Center Actions
  createGoal: async (goalData) => {
    const now = new Date().toISOString();
    const id = `goal-${Date.now()}`;
    await db.goals.add({
      ...goalData,
      id,
      progressPercentage: 0,
      isArchived: false,
      createdAt: now,
      updatedAt: now
    });
    await get().loadAllData();
    get().showToast(`تم إنشاء الهدف "${goalData.title}" بنجاح 🎯`);
    return id;
  },

  updateGoal: async (id, updates) => {
    const now = new Date().toISOString();
    await db.goals.update(id, { ...updates, updatedAt: now });
    await get().loadAllData();
    get().showToast('تم تحديث الهدف بنجاح');
  },

  archiveGoal: async (id) => {
    const goal = get().goals.find(g => g.id === id);
    if (!goal) return;
    const now = new Date().toISOString();
    await db.goals.update(id, { isArchived: !goal.isArchived, updatedAt: now });
    await get().loadAllData();
    get().showToast(goal.isArchived ? 'تم استرجاع الهدف من الأرشيف' : 'تمت أرشفة الهدف بنجاح 📁');
  },

  deleteGoal: async (id) => {
    await db.goals.delete(id);
    await db.goalMilestones.where('goalId').equals(id).delete();
    await db.goalLinks.where('goalId').equals(id).delete();
    await get().loadAllData();
    get().showToast('تم حذف الهدف ومعالمه المرتبطة');
  },

  addGoalMilestone: async (ms) => {
    const now = new Date().toISOString();
    const id = `ms-${Date.now()}`;
    await db.goalMilestones.add({
      ...ms,
      id,
      createdAt: now,
      updatedAt: now
    });
    await get().recalculateGoalProgress(ms.goalId);
    await get().loadAllData();
    get().showToast(`تمت إضافة المعلم: ${ms.title}`);
    return id;
  },

  toggleMilestone: async (id) => {
    const ms = get().goalMilestones.find(m => m.id === id);
    if (!ms) return;
    const nextStatus = ms.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    const now = new Date().toISOString();
    await db.goalMilestones.update(id, {
      status: nextStatus,
      completedAt: nextStatus === 'COMPLETED' ? now : undefined,
      updatedAt: now
    });
    await get().recalculateGoalProgress(ms.goalId);
    await get().loadAllData();
  },

  deleteMilestone: async (id) => {
    const ms = get().goalMilestones.find(m => m.id === id);
    if (!ms) return;
    await db.goalMilestones.delete(id);
    await get().recalculateGoalProgress(ms.goalId);
    await get().loadAllData();
  },

  recalculateGoalProgress: async (goalId: string) => {
    const milestones = await db.goalMilestones.where('goalId').equals(goalId).toArray();
    const linkedTasks = await db.tasks.where('goalId').equals(goalId).toArray();

    let milestoneProgress = 0;
    if (milestones.length > 0) {
      const totalWeight = milestones.reduce((sum, m) => sum + (m.weight || 1), 0);
      const completedWeight = milestones
        .filter(m => m.status === 'COMPLETED')
        .reduce((sum, m) => sum + (m.weight || 1), 0);
      milestoneProgress = Math.round((completedWeight / totalWeight) * 100);
    }

    let taskProgress = 0;
    if (linkedTasks.length > 0) {
      const doneCount = linkedTasks.filter(t => t.status === 'DONE').length;
      taskProgress = Math.round((doneCount / linkedTasks.length) * 100);
    }

    // Combined explainable progress: 70% milestones, 30% tasks (or 100% of available)
    let finalPercentage = 0;
    if (milestones.length > 0 && linkedTasks.length > 0) {
      finalPercentage = Math.round(milestoneProgress * 0.7 + taskProgress * 0.3);
    } else if (milestones.length > 0) {
      finalPercentage = milestoneProgress;
    } else if (linkedTasks.length > 0) {
      finalPercentage = taskProgress;
    }

    await db.goals.update(goalId, {
      progressPercentage: finalPercentage,
      status: finalPercentage === 100 ? 'ACHIEVED' : finalPercentage > 0 ? 'IN_PROGRESS' : 'NOT_STARTED',
      updatedAt: new Date().toISOString()
    });
  },

  linkEntityToGoal: async (goalId, entityType, entityId) => {
    const id = `glink-${Date.now()}`;
    await db.goalLinks.put({
      id,
      goalId,
      entityType,
      entityId,
      relationship: 'PRIMARY',
      createdAt: new Date().toISOString()
    });

    if (entityType === 'TASK') {
      await db.tasks.update(entityId, { goalId, updatedAt: new Date().toISOString() });
      await get().recalculateGoalProgress(goalId);
    }

    await get().loadAllData();
    get().showToast('تم ربط العنصر بالهدف بنجاح 🔗');
  },

  unlinkEntityFromGoal: async (goalId, entityId) => {
    await db.goalLinks.where('goalId').equals(goalId).filter(l => l.entityId === entityId).delete();
    const task = await db.tasks.get(entityId);
    if (task && task.goalId === goalId) {
      await db.tasks.update(entityId, { goalId: undefined, updatedAt: new Date().toISOString() });
      await get().recalculateGoalProgress(goalId);
    }
    await get().loadAllData();
    get().showToast('تم فك الارتباط عن الهدف');
  },

  // Category Actions
  addCategory: async (catData) => {
    const now = new Date().toISOString();
    const id = `cat-${Date.now()}`;
    await db.categories.add({
      ...catData,
      id,
      isArchived: false,
      createdAt: now,
      updatedAt: now
    });
    await get().loadAllData();
    get().showToast(`تمت إضافة التصنيف "${catData.name}"`);
    return id;
  },

  deleteCategory: async (id) => {
    await db.categories.delete(id);
    await db.tombstones.put({
      id: `tomb-cat-${id}`,
      entityType: 'CATEGORY',
      entityId: id,
      deletedAt: new Date().toISOString()
    });
    await get().loadAllData();
    get().showToast('تم حذف التصنيف');
  },

  deleteCategoryWithOption: async (id, action) => {
    await db.transaction('rw', [
      db.categories,
      db.learningResources,
      db.skills,
      db.tombstones
    ], async () => {
      if (action === 'UNCATEGORIZE') {
        const resources = await db.learningResources.where('categoryId').equals(id).toArray();
        for (const r of resources) {
          await db.learningResources.update(r.id, { categoryId: undefined });
        }
        const skills = await db.skills.where('categoryId').equals(id).toArray();
        for (const s of skills) {
          await db.skills.update(s.id, { categoryId: undefined });
        }
      } else {
        const resources = await db.learningResources.where('categoryId').equals(id).toArray();
        for (const r of resources) {
          await db.learningResources.delete(r.id);
        }
        const skills = await db.skills.where('categoryId').equals(id).toArray();
        for (const s of skills) {
          await db.skills.delete(s.id);
        }
      }
      await db.categories.delete(id);
      await db.tombstones.put({
        id: `tomb-cat-${id}`,
        entityType: 'CATEGORY',
        entityId: id,
        deletedAt: new Date().toISOString()
      });
    });
    await get().loadAllData();
    get().showToast('تم حذف التصنيف بنجاح');
  },

  // Content Management: Books & Resources CRUD + Deletion Tombstones
  deleteBook: async (resourceId: string) => {
    const book = get().learningResources.find(r => r.id === resourceId);
    const bookTitle = book?.title || 'الكتاب';
    await db.transaction('rw', [
      db.learningResources,
      db.bookDetails,
      db.readingSessions,
      db.skillResources,
      db.goalLinks,
      db.tombstones
    ], async () => {
      await db.learningResources.delete(resourceId);
      await db.bookDetails.delete(resourceId);
      await db.readingSessions.where('bookResourceId').equals(resourceId).delete();
      // Remove links from skillResources without deleting skills
      await db.skillResources.where('resourceId').equals(resourceId).delete();
      await db.goalLinks.filter(l => l.entityId === resourceId).delete();
      // Record tombstone so neither reload nor sync resurrects this book
      await db.tombstones.put({
        id: `tomb-book-${resourceId}`,
        entityType: 'BOOK',
        entityId: resourceId,
        deletedAt: new Date().toISOString(),
        reason: `User deleted book: ${bookTitle}`
      });
    });
    await get().loadAllData();
    get().showToast(`تم حذف كتاب "${bookTitle}" بنجاح 🗑️`);
  },

  editBook: async (resourceId, updates) => {
    const now = new Date().toISOString();
    if (updates.title) {
      await db.learningResources.update(resourceId, { title: updates.title, updatedAt: now });
    }
    const bookDetailsUpdates: any = { updatedAt: now };
    if (updates.author !== undefined) bookDetailsUpdates.author = updates.author;
    if (updates.totalPages !== undefined) bookDetailsUpdates.totalPages = updates.totalPages;
    if (updates.shelf !== undefined) bookDetailsUpdates.shelf = updates.shelf;
    await db.bookDetails.update(resourceId, bookDetailsUpdates);
    await get().loadAllData();
    get().showToast('تم حفظ تعديلات الكتاب ✏️');
  },

  archiveBook: async (resourceId) => {
    await db.bookDetails.update(resourceId, { shelf: 'Finished' });
    await get().loadAllData();
    get().showToast('تمت أرشفة الكتاب ونقله إلى الكتب المنتهية 📚');
  },

  deleteLearningResource: async (resourceId: string) => {
    const res = get().learningResources.find(r => r.id === resourceId);
    const title = res?.title || 'المورد';
    await db.transaction('rw', [
      db.learningResources,
      db.courseDetails,
      db.courseModules,
      db.courseLessons,
      db.skillResources,
      db.goalLinks,
      db.tombstones
    ], async () => {
      await db.learningResources.delete(resourceId);
      await db.courseDetails.delete(resourceId);
      await db.courseModules.where('courseResourceId').equals(resourceId).delete();
      await db.courseLessons.where('courseResourceId').equals(resourceId).delete();
      await db.skillResources.where('resourceId').equals(resourceId).delete();
      await db.goalLinks.filter(l => l.entityId === resourceId).delete();
      await db.tombstones.put({
        id: `tomb-res-${resourceId}`,
        entityType: 'RESOURCE',
        entityId: resourceId,
        deletedAt: new Date().toISOString()
      });
    });
    await get().loadAllData();
    get().showToast(`تم حذف المورد "${title}" بنجاح 🗑️`);
  },

  // Skills & Learning Graph Actions
  linkSkillResource: async (skillId, resourceId) => {
    await db.skillResources.put({ skillId, resourceId });
    await get().loadAllData();
    get().showToast('تم ربط المورد بالمهارة بنجاح 🔗');
  },

  unlinkSkillResource: async (skillId, resourceId) => {
    await db.skillResources.delete([skillId, resourceId]);
    await get().loadAllData();
    get().showToast('تم فك ارتباط المورد عن المهارة');
  },

  addSkillEvidence: async (evidence) => {
    const id = `ev-${Date.now()}`;
    await db.skillEvidence.add({
      ...evidence,
      id
    });
    await get().loadAllData();
    get().showToast('تم تسجيل شاهد الكفاءة والإتقان 🏆');
    return id;
  },

  updateSkill: async (skillId, updates) => {
    const now = new Date().toISOString();
    await db.skills.update(skillId, {
      ...updates,
      updatedAt: now
    });
    await get().loadAllData();
    get().showToast('تم تحديث بيانات المهارة بنجاح ✨');
  },

  deleteSkill: async (skillId) => {
    const skill = get().skills.find(s => s.id === skillId);
    const skillName = skill?.name || '';

    await db.transaction('rw', [
      db.skills,
      db.skillResources,
      db.skillEvidence,
      db.tasks,
      db.tombstones
    ], async () => {
      // 1. Delete skill record
      await db.skills.delete(skillId);

      // 2. Delete junction links in skillResources
      await db.skillResources.where('skillId').equals(skillId).delete();

      // 3. Delete evidence in skillEvidence
      await db.skillEvidence.where('skillId').equals(skillId).delete();

      // 4. Detach skillId from tasks without deleting tasks themselves
      const linkedTasks = await db.tasks.where('skillId').equals(skillId).toArray();
      for (const t of linkedTasks) {
        await db.tasks.update(t.id, { skillId: undefined });
      }

      // 5. Add tombstone to prevent resurrection on sync or reload
      await db.tombstones.put({
        id: `tomb-skill-${skillId}`,
        entityType: 'SKILL',
        entityId: skillId,
        deletedAt: new Date().toISOString()
      });
    });

    await get().loadAllData();
    get().showToast(`تم حذف مهارة "${skillName}" وفك ارتباطاتها بنجاح 🗑️`);
  },

  // 3. University Study Actions
  addUniversitySubject: async (subjectData) => {
    const now = new Date().toISOString();
    const id = `subj-${Date.now()}`;
    await db.universitySubjects.add({
      ...subjectData,
      id,
      createdAt: now,
      updatedAt: now
    });
    await get().loadAllData();
    get().showToast(`تمت إضافة مادة "${subjectData.name}" بنجاح 🎓`);
    return id;
  },

  updateUniversitySubject: async (id, updates) => {
    const now = new Date().toISOString();
    await db.universitySubjects.update(id, {
      ...updates,
      updatedAt: now
    });
    await get().loadAllData();
    get().showToast('تم حفظ تعديلات المادة بنجاح ✏️');
  },

  deleteUniversitySubject: async (id) => {
    // Delete subject and its study sessions
    const sessions = await db.studySessions.where('subjectId').equals(id).toArray();
    for (const session of sessions) {
      await db.studySessions.delete(session.id);
    }
    await db.universitySubjects.delete(id);
    await get().loadAllData();
    get().showToast('تم حذف المادة وجلساتها بنجاح 🗑️');
  },

  addStudySession: async ({ subjectId, title, type, status = 'STUDIED' }) => {
    const id = `session-${Date.now()}`;
    await db.studySessions.add({
      id,
      subjectId,
      title,
      type,
      status,
      fsrsStability: 0,
      fsrsDifficulty: 0
    });
    await get().loadAllData();
    get().showToast(`تمت إضافة "${title}" بنجاح 📝`);
    return id;
  },

  deleteStudySession: async (sessionId) => {
    await db.studySessions.delete(sessionId);
    await get().loadAllData();
    get().showToast('تم حذف الجلسة بنجاح 🗑️');
  },

  updateSessionStatus: async (sessionId, newStatus) => {
    const now = new Date().toISOString();
    await db.studySessions.update(sessionId, {
      status: newStatus,
      submittedDate: newStatus === 'SUBMITTED' ? now : undefined
    });
    await get().loadAllData();
    get().showToast(`تم تحديث حالة الجلسة إلى: ${newStatus}`);
  },

  recordStudyReview: async (sessionId, grade) => {
    const session = get().studySessions.find(s => s.id === sessionId);
    if (!session) return;

    const fsrsRes = calculateNextRevision(session, grade);
    const now = new Date().toISOString();

    await db.studySessions.update(sessionId, {
      status: 'REVISED',
      fsrsStability: fsrsRes.stability,
      fsrsDifficulty: fsrsRes.difficulty,
      fsrsLastReview: now,
      fsrsNextReview: fsrsRes.nextReviewDate.toISOString().split('T')[0]
    });

    // Award review XP
    await db.xpTransactions.add({
      id: `xp-rev-${Date.now()}`,
      idempotencyKey: generateXPIdempotencyKey('FSRS_REVIEW', sessionId, now.split('T')[0]),
      amount: 30,
      category: 'STUDY',
      reason: `مراجعة FSRS لمقرر النانو: ${session.title}`,
      createdAt: now
    });

    await get().loadAllData();
    get().showToast(`تم تسجيل المراجعة! الميعاد القادم بعد ${fsrsRes.daysUntilNext} أيام (+30 XP) 📚`);
  },

  // Ahmed's Study Planner System Actions
  toggleLectureStep: async (sessionId, step) => {
    const session = get().studySessions.find(s => s.id === sessionId);
    if (!session) return;

    const now = new Date().toISOString();
    const todayStr = now.split('T')[0];
    const updates: Partial<StudySession> = {};

    if (step === 'material') {
      updates.materialReady = !session.materialReady;
    } else if (step === 'study') {
      const newVal = !session.studyDone;
      updates.studyDone = newVal;
      if (newVal) {
        updates.status = 'STUDIED';
        await db.xpTransactions.add({
          id: `xp-std-${Date.now()}`,
          idempotencyKey: generateXPIdempotencyKey('STUDY_LECTURE', sessionId, todayStr),
          amount: 25,
          category: 'STUDY',
          reason: `مذاكرة محاضرة: ${session.title}`,
          createdAt: now
        }).catch(() => {});
        get().showToast(`عاش! أتممت مذاكرة المحاضرة الأولى (+25 XP) 📖`);
      }
    } else if (step === 'revise') {
      const newVal = !session.reviseDone;
      updates.reviseDone = newVal;
      if (newVal) {
        updates.status = 'REVISED';
        await db.xpTransactions.add({
          id: `xp-rev-${Date.now()}`,
          idempotencyKey: generateXPIdempotencyKey('REVISE_LECTURE', sessionId, todayStr),
          amount: 20,
          category: 'STUDY',
          reason: `مراجعة محاضرة: ${session.title}`,
          createdAt: now
        }).catch(() => {});
        get().showToast(`ممتاز! أتممت مراجعة المحاضرة (+20 XP) 🧠`);
      }
    } else if (step === 'solve') {
      const newVal = !session.solveDone;
      updates.solveDone = newVal;
      if (newVal) {
        updates.status = 'SOLVED';
        await db.xpTransactions.add({
          id: `xp-sol-${Date.now()}`,
          idempotencyKey: generateXPIdempotencyKey('SOLVE_LECTURE', sessionId, todayStr),
          amount: 25,
          category: 'STUDY',
          reason: `حل مسائل وشيتات: ${session.title}`,
          createdAt: now
        }).catch(() => {});
        get().showToast(`بطل! حليت مسائل وشيت المحاضرة (+25 XP) ✍️`);
      }
    }

    await db.studySessions.update(sessionId, updates);
    await get().loadAllData();
  },

  addQuiz: async (quizData) => {
    const id = `quiz-${Date.now()}`;
    await db.academicQuizzes.add({
      ...quizData,
      id
    });
    await get().loadAllData();
    get().showToast(`تمت إضافة كويز: ${quizData.topic} 🧠`);
    return id;
  },

  toggleQuizPrepared: async (id) => {
    const quiz = get().academicQuizzes.find(q => q.id === id);
    if (!quiz) return;
    const newVal = !quiz.prepared;
    await db.academicQuizzes.update(id, { prepared: newVal });
    if (newVal) {
      const now = new Date().toISOString();
      await db.xpTransactions.add({
        id: `xp-qp-${Date.now()}`,
        idempotencyKey: generateXPIdempotencyKey('QUIZ_PREPARED', id, now.split('T')[0]),
        amount: 20,
        category: 'STUDY',
        reason: `الاستعداد لكويز: ${quiz.topic}`,
        createdAt: now
      }).catch(() => {});
      get().showToast('تم الاستعداد للكويز جاهزية تامة! (+20 XP) 🎯');
    }
    await get().loadAllData();
  },

  toggleQuizAttended: async (id) => {
    const quiz = get().academicQuizzes.find(q => q.id === id);
    if (!quiz) return;
    const newVal = !quiz.attended;
    await db.academicQuizzes.update(id, { attended: newVal });
    if (newVal) {
      const now = new Date().toISOString();
      await db.xpTransactions.add({
        id: `xp-qa-${Date.now()}`,
        idempotencyKey: generateXPIdempotencyKey('QUIZ_ATTENDED', id, now.split('T')[0]),
        amount: 30,
        category: 'STUDY',
        reason: `حضور وأداء كويز: ${quiz.topic}`,
        createdAt: now
      }).catch(() => {});
      get().showToast('تم أداء الكويز بحمد الله! (+30 XP) 🏆');
    }
    await get().loadAllData();
  },

  recordQuizScore: async (id, score, outOf) => {
    await db.academicQuizzes.update(id, { myScore: score, outOf });
    await get().loadAllData();
    get().showToast(`تم تسجيل نتيجة الكويز: ${score} من ${outOf} 📝`);
  },

  deleteQuiz: async (id) => {
    await db.academicQuizzes.delete(id);
    await get().loadAllData();
    get().showToast('تم حذف الكويز بنجاح 🗑️');
  },

  addAssignment: async (assignmentData) => {
    const id = `asgn-${Date.now()}`;
    await db.academicAssignments.add({
      ...assignmentData,
      id
    });
    await get().loadAllData();
    get().showToast(`تمت إضافة التكليف: ${assignmentData.taskName} 📤`);
    return id;
  },

  toggleAssignmentCompleted: async (id) => {
    const asgn = get().academicAssignments.find(a => a.id === id);
    if (!asgn) return;
    const newVal = !asgn.completed;
    await db.academicAssignments.update(id, { completed: newVal });
    if (newVal) {
      const now = new Date().toISOString();
      await db.xpTransactions.add({
        id: `xp-ac-${Date.now()}`,
        idempotencyKey: generateXPIdempotencyKey('ASSIGNMENT_DONE', id, now.split('T')[0]),
        amount: 25,
        category: 'STUDY',
        reason: `إنهاء حل تكليف: ${asgn.taskName}`,
        createdAt: now
      }).catch(() => {});
      get().showToast('خلصت حل الواجب! فاضل تسليمه للدكتور (+25 XP) ✅');
    }
    await get().loadAllData();
  },

  toggleAssignmentSubmitted: async (id) => {
    const asgn = get().academicAssignments.find(a => a.id === id);
    if (!asgn) return;
    const newVal = !asgn.submitted;
    await db.academicAssignments.update(id, { submitted: newVal });
    if (newVal) {
      const now = new Date().toISOString();
      await db.xpTransactions.add({
        id: `xp-as-${Date.now()}`,
        idempotencyKey: generateXPIdempotencyKey('ASSIGNMENT_SUBMITTED', id, now.split('T')[0]),
        amount: 35,
        category: 'STUDY',
        reason: `التسليم الفعلي لتكليف: ${asgn.taskName}`,
        createdAt: now
      }).catch(() => {});
      get().showToast('تم التسليم الفعلي للواجب بنجاح! (+35 XP) 🚀');
    }
    await get().loadAllData();
  },

  deleteAssignment: async (id) => {
    await db.academicAssignments.delete(id);
    await get().loadAllData();
    get().showToast('تم حذف التكليف 🗑️');
  },

  addStudentActivity: async (actData) => {
    const id = `act-${Date.now()}`;
    await db.studentActivities.add({
      ...actData,
      id
    });
    await get().loadAllData();
    get().showToast(`تمت إضافة مهمة النشاط: ${actData.taskName} 🚀`);
    return id;
  },

  toggleStudentActivityDone: async (id) => {
    const act = get().studentActivities.find(a => a.id === id);
    if (!act) return;
    const newVal = !act.done;
    await db.studentActivities.update(id, { done: newVal });
    if (newVal) {
      const now = new Date().toISOString();
      await db.xpTransactions.add({
        id: `xp-act-${Date.now()}`,
        idempotencyKey: generateXPIdempotencyKey('ACTIVITY_DONE', id, now.split('T')[0]),
        amount: 25,
        category: 'STUDY',
        reason: `إنجاز مهمة نشاط: ${act.taskName}`,
        createdAt: now
      }).catch(() => {});
      get().showToast('تم إنجاز مهمة النشاط بنجاح! (+25 XP) 🌟');
    }
    await get().loadAllData();
  },

  deleteStudentActivity: async (id) => {
    await db.studentActivities.delete(id);
    await get().loadAllData();
    get().showToast('تم حذف مهمة النشاط 🗑️');
  },

  // 4. Book Actions
  addBook: async (title, author, totalPages = 200, coverUrl) => {
    const now = new Date().toISOString();
    const resId = `res-book-${Date.now()}`;

    await db.learningResources.add({
      id: resId,
      type: 'BOOK',
      title,
      sourceUrl: '',
      provider: 'مكتبة شخصية',
      status: 'IN_PROGRESS',
      createdAt: now,
      updatedAt: now
    });

    await db.bookDetails.add({
      resourceId: resId,
      author: author || 'مؤلف غير محدد',
      totalPages,
      currentPage: 0,
      shelf: 'Want to Read',
      coverUrl
    });

    await get().loadAllData();
    get().showToast(`تمت إضافة كتاب "${title}" إلى المكتبة بنجاح 📖`);
  },

  updateBookPage: async (resourceId, newPage) => {
    const book = get().bookDetails.find(b => b.resourceId === resourceId);
    if (!book) return;

    const boundedPage = Math.min(book.totalPages, Math.max(0, newPage));
    await db.bookDetails.update(resourceId, {
      currentPage: boundedPage,
      shelf: boundedPage >= book.totalPages ? 'Finished' : 'Reading'
    });

    await get().loadAllData();
  },

  // 5. Skill & Course Actions
  addSkill: async (name, category, targetLevel = 5) => {
    const now = new Date().toISOString();
    await db.skills.add({
      id: `skill-${Date.now()}`,
      name,
      category,
      baselineLevel: 1,
      targetLevel,
      contentProgress: 0,
      demonstratedCompetence: 0,
      sortOrder: get().skills.length + 1,
      createdAt: now,
      updatedAt: now
    });

    await get().loadAllData();
    get().showToast(`تمت إضافة مهارة "${name}" إلى شجرة المهارات 🌳`);
  },

  addCourseResource: async (title, sourceUrl, instructor, durationMinutes = 120, totalLessons = 0) => {
    const now = new Date().toISOString();
    const resId = `res-course-${Date.now()}`;

    await db.learningResources.add({
      id: resId,
      type: 'COURSE',
      title,
      sourceUrl: sourceUrl || '',
      provider: sourceUrl?.includes('youtube') ? 'YouTube' : 'منصة تعليمية',
      status: 'PLANNED',
      createdAt: now,
      updatedAt: now
    });

    await db.courseDetails.add({
      resourceId: resId,
      instructor: instructor || 'المحاضر',
      totalLessons,
      completedLessons: 0,
      durationMinutes
    });

    await get().loadAllData();
    get().showToast(`تمت إضافة الكورس إلى مركز الموارد التعليمية 🎓`);
    return resId;
  },

  // 6. Habit Actions
  toggleHabitToday: async (habitId) => {
    const habit = get().habits.find(h => h.id === habitId);
    if (!habit) return;

    const todayStr = getCairoDateString();
    const existingLog = get().habitLogs.find(l => l.habitId === habitId && l.date === todayStr);
    const isCurrentlyCompleted = (existingLog && existingLog.status === 'COMPLETED') || habit.lastCompletedDate === todayStr;

    if (isCurrentlyCompleted) {
      // Toggle off / Undo
      if (existingLog) {
        await db.habitLogs.delete(existingLog.id);
      }
      await db.habitLogs.where({ habitId, date: todayStr }).delete();

      // Find previous completed date prior to today
      const previousLogs = await db.habitLogs
        .where('habitId').equals(habitId)
        .filter(l => l.status === 'COMPLETED' && l.date !== todayStr)
        .sortBy('date');
      const lastLog = previousLogs.length > 0 ? previousLogs[previousLogs.length - 1] : null;

      await db.habits.update(habitId, {
        streakCount: Math.max(0, habit.streakCount - 1),
        lastCompletedDate: lastLog ? lastLog.date : undefined
      });

      // Rollback XP transaction
      const habitXpKey = generateXPIdempotencyKey('HABIT', habitId, todayStr);
      await db.xpTransactions.where('idempotencyKey').equals(habitXpKey).delete();

      get().showToast(`تم إلغاء تسجيل عادة "${habit.title}" بنجاح ↩️`);
    } else {
      // Toggle on
      const evalRes = evaluateHabitStreak(
        habit,
        { id: `hlog-${habitId}-${todayStr}`, habitId, date: todayStr, status: 'COMPLETED', valueRecorded: 1 },
        new Date()
      );
      await db.habits.update(habitId, {
        streakCount: evalRes.updatedStreak,
        consecutiveMisses: 0,
        lastCompletedDate: todayStr
      });
      await db.habitLogs.put({
        id: `hlog-${habitId}-${todayStr}`,
        habitId,
        date: todayStr,
        status: 'COMPLETED',
        valueRecorded: 1,
        triggerSource: 'MANUAL_TAP'
      });

      // Award habit XP
      await db.xpTransactions.add({
        id: `xp-h-${Date.now()}`,
        idempotencyKey: generateXPIdempotencyKey('HABIT', habitId, todayStr),
        amount: 10,
        category: 'HABIT',
        reason: `إنجاز عادة: ${habit.title}`,
        createdAt: new Date().toISOString()
      });

      get().showToast(`عاش! العادة اتسجلت واستمرت السلسلة (+10 XP) ✨`);
    }

    await get().loadAllData();
  },

  // 7. Journal Actions
  addJournalEntry: async (content, mode, tags = []) => {
    const now = new Date().toISOString();
    const todayStr = now.split('T')[0];

    await db.journalEntries.add({
      id: `journal-${Date.now()}`,
      date: todayStr,
      mode,
      content,
      tags,
      createdAt: now,
      updatedAt: now
    });

    await get().loadAllData();
    get().showToast('تم حفظ اليومية بخصوصية وأمان تام محلياً 🔒');
  },

  deleteJournalEntry: async (id: string) => {
    await db.journalEntries.delete(id);
    await db.tombstones.put({
      id: `tomb-journal-${id}`,
      entityType: 'JOURNAL',
      entityId: id,
      deletedAt: new Date().toISOString(),
      reason: 'User deleted journal entry'
    });
    await get().loadAllData();
    get().showToast('تم حذف التدوينة بنجاح 🗑️');
  },

  // Faith & Intentions Actions
  addIntention: async (intentionData) => {
    const now = new Date().toISOString();
    const id = `intent-${Date.now()}`;
    await db.intentions.add({
      ...intentionData,
      id,
      isArchived: false,
      createdAt: now,
      updatedAt: now
    });
    await get().loadAllData();
    get().showToast('تم تسجيل النية بخصوصية وبركة 🤲');
    return id;
  },

  updateIntention: async (id, updates) => {
    await db.intentions.update(id, { ...updates, updatedAt: new Date().toISOString() });
    await get().loadAllData();
    get().showToast('تم تحديث النية ✏️');
  },

  deleteIntention: async (id) => {
    await db.intentions.delete(id);
    await db.goalIntentions.where('intentionId').equals(id).delete();
    await db.tombstones.put({
      id: `tomb-intent-${id}`,
      entityType: 'INTENTION',
      entityId: id,
      deletedAt: new Date().toISOString()
    });
    await get().loadAllData();
    get().showToast('تم حذف النية');
  },

  linkIntentionToGoal: async (goalId, intentionId) => {
    const id = `gint-${goalId}-${intentionId}`;
    await db.goalIntentions.put({
      id,
      goalId,
      intentionId,
      createdAt: new Date().toISOString()
    });
    await get().loadAllData();
    get().showToast('تم ربط النية بالهدف بنجاح 🤲🎯');
  },

  unlinkIntentionFromGoal: async (goalId, intentionId) => {
    await db.goalIntentions.filter(gi => gi.goalId === goalId && gi.intentionId === intentionId).delete();
    await get().loadAllData();
    get().showToast('تم فك ارتباط النية عن الهدف');
  },

  logPrayerWorship: async (prayerName, status, inMosque = false) => {
    const todayStr = getCairoDateString();
    const now = new Date().toISOString();
    const id = `worship-${todayStr}-${prayerName}`;

    const existing = await db.worshipLogs.get(id);

    // If already logged with the SAME status and mosque flag, TOGGLE OFF (uncheck/undo)!
    if (existing && existing.status === status && Boolean(existing.inMosque) === Boolean(inMosque)) {
      await db.worshipLogs.delete(id);
      await get().loadAllData();
      get().showToast(`تم إلغاء تسجيل صلاة ${prayerName} ↩️`);
      return;
    }

    await db.worshipLogs.put({
      id,
      date: todayStr,
      prayerName,
      status,
      inMosque,
      createdAt: now
    });
    await get().loadAllData();
    get().showToast(inMosque ? `تم تسجيل صلاة ${prayerName} في المسجد 🕌` : `تم تسجيل أداء صلاة ${prayerName} ✅`);
  },

  deletePrayerWorship: async (prayerName) => {
    const todayStr = getCairoDateString();
    const id = `worship-${todayStr}-${prayerName}`;
    await db.worshipLogs.delete(id);
    await get().loadAllData();
    get().showToast(`تم إلغاء تسجيل صلاة ${prayerName} ↩️`);
  },

  logQuranReading: async (pagesRead, surahStart, surahEnd, notes) => {
    const todayStr = getCairoDateString();
    const now = new Date().toISOString();
    const id = `quran-${todayStr}-${Date.now()}`;
    await db.quranLogs.add({
      id,
      date: todayStr,
      pagesRead,
      surahStart,
      surahEnd,
      notes,
      createdAt: now
    });
    // Check if daily Quran habit met (3 pages)
    const allTodayQuran = await db.quranLogs.where('date').equals(todayStr).toArray();
    const totalPagesToday = allTodayQuran.reduce((sum, q) => sum + q.pagesRead, 0);
    if (totalPagesToday >= 3) {
      const quranHabit = get().habits.find(h => h.id === 'habit-quran');
      if (quranHabit && quranHabit.lastCompletedDate !== todayStr) {
        await db.habits.update('habit-quran', {
          lastCompletedDate: todayStr,
          streakCount: (quranHabit.streakCount || 0) + 1
        });
      }
    }
    await get().loadAllData();
    get().showToast(`تم تسجيل قراءة ${pagesRead} صفحات من القرآن الكريم 📖✨`);
  },

  deleteQuranLog: async (logId: string) => {
    const todayStr = getCairoDateString();
    const targetLog = await db.quranLogs.get(logId);
    if (!targetLog) return;

    await db.quranLogs.delete(logId);

    // Re-check today's total pages
    const remainingTodayQuran = await db.quranLogs.where('date').equals(todayStr).toArray();
    const totalPagesToday = remainingTodayQuran.reduce((sum, q) => sum + q.pagesRead, 0);

    // If total pages dropped below 3, revert habit-quran if it was completed today
    if (totalPagesToday < 3) {
      const quranHabit = get().habits.find(h => h.id === 'habit-quran');
      if (quranHabit && quranHabit.lastCompletedDate === todayStr) {
        const previousLogs = await db.habitLogs
          .where('habitId').equals('habit-quran')
          .filter(l => l.status === 'COMPLETED' && l.date !== todayStr)
          .sortBy('date');
        const lastLog = previousLogs.length > 0 ? previousLogs[previousLogs.length - 1] : null;

        await db.habitLogs.where({ habitId: 'habit-quran', date: todayStr }).delete();
        await db.habits.update('habit-quran', {
          streakCount: Math.max(0, (quranHabit.streakCount || 1) - 1),
          lastCompletedDate: lastLog ? lastLog.date : undefined
        });
      }
    }

    await get().loadAllData();
    get().showToast('تم حذف تسجيل القراءة بنجاح 🗑️');
  },

  logQiyamSession: async (session) => {
    const id = `qiyam-${Date.now()}`;
    await db.qiyamSessions.add({
      ...session,
      id,
      createdAt: new Date().toISOString()
    });
    await get().loadAllData();
    get().showToast(`تقبل الله! تم تسجيل قيام الليل (${session.durationMinutes} دقيقة) 🌙`);
    return id;
  },

  deleteQiyamSession: async (id) => {
    await db.qiyamSessions.delete(id);
    await get().loadAllData();
  },

  // Health & Fitness Actions
  logMovement: async (durationMinutes, activityType, notes) => {
    const todayStr = getCairoDateString();
    const id = `move-${todayStr}-${Date.now()}`;
    const meets20MinBaseline = durationMinutes >= 20;
    await db.movementLogs.add({
      id,
      date: todayStr,
      durationMinutes,
      activityType,
      meets20MinBaseline,
      notes,
      createdAt: new Date().toISOString()
    });
    await get().loadAllData();
    get().showToast(`تم تسجيل النشاط الحركي (${durationMinutes} دقيقة) 🏃‍♂️💨`);
    return id;
  },

  logWorkout: async (workout) => {
    const id = `workout-${Date.now()}`;
    await db.workoutLogs.add({
      ...workout,
      id,
      createdAt: new Date().toISOString()
    });
    await get().loadAllData();
    get().showToast(`عاش يا بطل! تم تسجيل تمرينك (${workout.title}) 💪🏋️‍♂️`);
    return id;
  },

  deleteWorkout: async (id) => {
    await db.workoutLogs.delete(id);
    await db.tombstones.put({
      id: `tomb-workout-${id}`,
      entityType: 'WORKOUT',
      entityId: id,
      deletedAt: new Date().toISOString()
    });
    await get().loadAllData();
    get().showToast('تم حذف سجل التمرين');
  },

  // Availability & Scheduling Actions
  addAvailabilityRule: async (rule) => {
    const id = `rule-${Date.now()}`;
    await db.availabilityRules.add({
      ...rule,
      id
    });
    await get().loadAllData();
    get().showToast(`تمت إضافة قاعدة التفرغ "${rule.label}" ⏱️`);
    return id;
  },

  deleteAvailabilityRule: async (id) => {
    await db.availabilityRules.delete(id);
    await get().loadAllData();
    get().showToast('تم حذف قاعدة التفرغ');
  },

  // XP Baseline & Reset Actions
  createPreResetBackup: async () => {
    const backupStr = await get().exportBackupJSON();
    const backupKey = `MASAAR_PRE_RESET_BACKUP_${Date.now()}`;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(backupKey, backupStr);
      } catch (e) {
        console.warn('Could not store backup in localStorage:', e);
      }
    }
    return backupKey;
  },

  resetXPToZeroBaseline: async (reason = 'Manual baseline reset to 0 XP') => {
    const backupKey = await get().createPreResetBackup();
    const currentTx = await db.xpTransactions.toArray();
    const previousTotalXP = currentTx.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const now = new Date().toISOString();

    await db.transaction('rw', [db.xpTransactions, db.xpResetEvents], async () => {
      await db.xpTransactions.clear();
      await db.xpResetEvents.add({
        id: `xp-reset-${Date.now()}`,
        resetAt: now,
        previousTotalXP,
        transactionsArchivedCount: currentTx.length,
        backupKey,
        reason
      });
    });

    await get().loadAllData();
    get().showToast('تمت إعادة ضبط رصيد الـ XP بنجاح إلى 0 نقطة وحفظ نسخة احتياطية آمنة 🎯✨');
  },

  // 8. Complete Backup / Export / Restore (Version 2 with 39 Tables)
  exportBackupJSON: async () => {
    const allData = {
      version: 2,
      schemaVersion: 4,
      exportedAt: new Date().toISOString(),
      appMeta: await db.appMeta.toArray(),
      tombstones: await db.tombstones.toArray(),
      xpResetEvents: await db.xpResetEvents.toArray(),
      domains: await db.domains.toArray(),
      goals: await db.goals.toArray(),
      goalMilestones: await db.goalMilestones.toArray(),
      goalLinks: await db.goalLinks.toArray(),
      categories: await db.categories.toArray(),
      skills: await db.skills.toArray(),
      learningResources: await db.learningResources.toArray(),
      bookDetails: await db.bookDetails.toArray(),
      readingSessions: await db.readingSessions.toArray(),
      courseDetails: await db.courseDetails.toArray(),
      courseModules: await db.courseModules.toArray(),
      courseLessons: await db.courseLessons.toArray(),
      skillResources: await db.skillResources.toArray(),
      skillEvidence: await db.skillEvidence.toArray(),
      universitySubjects: await db.universitySubjects.toArray(),
      studySessions: await db.studySessions.toArray(),
      timetableSlots: await db.timetableSlots.toArray(),
      academicQuizzes: await db.academicQuizzes.toArray(),
      academicAssignments: await db.academicAssignments.toArray(),
      studentActivities: await db.studentActivities.toArray(),
      tasks: await db.tasks.toArray(),
      taskPostponements: await db.taskPostponements.toArray(),
      habits: await db.habits.toArray(),
      habitLogs: await db.habitLogs.toArray(),
      xpTransactions: await db.xpTransactions.toArray(),
      journalEntries: await db.journalEntries.toArray(),
      intentions: await db.intentions.toArray(),
      goalIntentions: await db.goalIntentions.toArray(),
      worshipLogs: await db.worshipLogs.toArray(),
      quranLogs: await db.quranLogs.toArray(),
      qiyamSessions: await db.qiyamSessions.toArray(),
      movementLogs: await db.movementLogs.toArray(),
      workoutLogs: await db.workoutLogs.toArray(),
      availabilityRules: await db.availabilityRules.toArray(),
      scheduleBlocks: await db.scheduleBlocks.toArray(),
      schedulePlans: await db.schedulePlans.toArray()
    };
    return JSON.stringify(allData, null, 2);
  },

  importBackupJSON: async (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.version) return false;

      await db.transaction('rw', [
        db.appMeta,
        db.tombstones,
        db.xpResetEvents,
        db.domains,
        db.goals,
        db.goalMilestones,
        db.goalLinks,
        db.categories,
        db.skills,
        db.learningResources,
        db.bookDetails,
        db.readingSessions,
        db.courseDetails,
        db.courseModules,
        db.courseLessons,
        db.skillResources,
        db.skillEvidence,
        db.universitySubjects,
        db.studySessions,
        db.timetableSlots,
        db.academicQuizzes,
        db.academicAssignments,
        db.studentActivities,
        db.tasks,
        db.taskPostponements,
        db.habits,
        db.habitLogs,
        db.xpTransactions,
        db.journalEntries,
        db.intentions,
        db.goalIntentions,
        db.worshipLogs,
        db.quranLogs,
        db.qiyamSessions,
        db.movementLogs,
        db.workoutLogs,
        db.availabilityRules,
        db.scheduleBlocks,
        db.schedulePlans
      ], async () => {
        if (data.appMeta?.length) await db.appMeta.bulkPut(data.appMeta);
        if (data.tombstones?.length) await db.tombstones.bulkPut(data.tombstones);
        if (data.xpResetEvents?.length) await db.xpResetEvents.bulkPut(data.xpResetEvents);
        if (data.domains?.length) await db.domains.bulkPut(data.domains);
        if (data.goals?.length) await db.goals.bulkPut(data.goals);
        if (data.goalMilestones?.length) await db.goalMilestones.bulkPut(data.goalMilestones);
        if (data.goalLinks?.length) await db.goalLinks.bulkPut(data.goalLinks);
        if (data.categories?.length) await db.categories.bulkPut(data.categories);
        if (data.skills?.length) await db.skills.bulkPut(data.skills);
        if (data.learningResources?.length) await db.learningResources.bulkPut(data.learningResources);
        if (data.bookDetails?.length) await db.bookDetails.bulkPut(data.bookDetails);
        if (data.readingSessions?.length) await db.readingSessions.bulkPut(data.readingSessions);
        if (data.courseDetails?.length) await db.courseDetails.bulkPut(data.courseDetails);
        if (data.courseModules?.length) await db.courseModules.bulkPut(data.courseModules);
        if (data.courseLessons?.length) await db.courseLessons.bulkPut(data.courseLessons);
        if (data.skillResources?.length) await db.skillResources.bulkPut(data.skillResources);
        if (data.skillEvidence?.length) await db.skillEvidence.bulkPut(data.skillEvidence);
        if (data.universitySubjects?.length) await db.universitySubjects.bulkPut(data.universitySubjects);
        if (data.studySessions?.length) await db.studySessions.bulkPut(data.studySessions);
        if (data.timetableSlots?.length) await db.timetableSlots.bulkPut(data.timetableSlots);
        if (data.academicQuizzes?.length) await db.academicQuizzes.bulkPut(data.academicQuizzes);
        if (data.academicAssignments?.length) await db.academicAssignments.bulkPut(data.academicAssignments);
        if (data.studentActivities?.length) await db.studentActivities.bulkPut(data.studentActivities);
        if (data.tasks?.length) await db.tasks.bulkPut(data.tasks);
        if (data.taskPostponements?.length) await db.taskPostponements.bulkPut(data.taskPostponements);
        if (data.habits?.length) await db.habits.bulkPut(data.habits);
        if (data.habitLogs?.length) await db.habitLogs.bulkPut(data.habitLogs);
        if (data.xpTransactions?.length) await db.xpTransactions.bulkPut(data.xpTransactions);
        if (data.journalEntries?.length) await db.journalEntries.bulkPut(data.journalEntries);
        if (data.intentions?.length) await db.intentions.bulkPut(data.intentions);
        if (data.goalIntentions?.length) await db.goalIntentions.bulkPut(data.goalIntentions);
        if (data.worshipLogs?.length) await db.worshipLogs.bulkPut(data.worshipLogs);
        if (data.quranLogs?.length) await db.quranLogs.bulkPut(data.quranLogs);
        if (data.qiyamSessions?.length) await db.qiyamSessions.bulkPut(data.qiyamSessions);
        if (data.movementLogs?.length) await db.movementLogs.bulkPut(data.movementLogs);
        if (data.workoutLogs?.length) await db.workoutLogs.bulkPut(data.workoutLogs);
        if (data.availabilityRules?.length) await db.availabilityRules.bulkPut(data.availabilityRules);
        if (data.scheduleBlocks?.length) await db.scheduleBlocks.bulkPut(data.scheduleBlocks);
        if (data.schedulePlans?.length) await db.schedulePlans.bulkPut(data.schedulePlans);
      });

      await get().loadAllData();
      get().showToast('تمت استعادة النسخة الاحتياطية بنجاح 100%');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}));
