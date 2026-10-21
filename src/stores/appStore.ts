import { create } from 'zustand';
import { db, seedInitialDataIfNeeded } from '../db';
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
  StudentActivityTask
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

export type ActiveTab = 'TODAY' | 'GOALS' | 'UNIVERSITY' | 'LEARNING' | 'BOOKS' | 'FALCON' | 'JOURNAL' | 'MORE';

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
  
  // 2. Task Actions
  completeTask: (taskId: string) => Promise<void>;
  postponeTask: (taskId: string, reason?: string, targetNewDate?: string) => Promise<void>;
  addTask: (title: string, priority: Task['priority'], estimatedMinutes?: number, dueDate?: string, goalId?: string, skillId?: string, studySessionId?: string) => Promise<void>;

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

  // Skills & Learning Graph Actions
  linkSkillResource: (skillId: string, resourceId: string) => Promise<void>;
  unlinkSkillResource: (skillId: string, resourceId: string) => Promise<void>;
  addSkillEvidence: (evidence: Omit<SkillEvidence, 'id'>) => Promise<string>;

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
      studentActivities
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
      db.studentActivities.toArray()
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
    await get().loadAllData();
    get().showToast('تم حذف التصنيف');
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

    if (existingLog && existingLog.status === 'COMPLETED') {
      // Toggle off
      await db.habitLogs.delete(existingLog.id);
      await db.habits.update(habitId, {
        streakCount: Math.max(0, habit.streakCount - 1)
      });
      get().showToast('تم إلغاء تسجيل العادة اليوم');
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

  // 8. Complete Backup / Export / Restore (Version 2 with 26 Tables)
  exportBackupJSON: async () => {
    const allData = {
      version: 2,
      schemaVersion: 3,
      exportedAt: new Date().toISOString(),
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
      journalEntries: await db.journalEntries.toArray()
    };
    return JSON.stringify(allData, null, 2);
  },

  importBackupJSON: async (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.version) return false;

      await db.transaction('rw', [
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
        db.journalEntries
      ], async () => {
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
