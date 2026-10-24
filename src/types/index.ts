/**
 * Domain Types & Interfaces — MASAAR Life OS
 * Follows Canonical Learning Graph Specification (docs/data-model.md)
 */

export type Horizon = 'LONG_TERM' | 'ANNUAL' | 'QUARTERLY' | 'MONTHLY';
export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ACHIEVED' | 'PAUSED' | 'ARCHIVED';

export interface LifeDomain {
  id: string;
  name: string;
  icon: string;
  color: string;
  sortOrder: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  domainId?: string;
  parentGoalId?: string;
  title: string;
  whyItMatters: string;
  horizon: Horizon;
  targetDate?: string;
  status: GoalStatus;
  progressPercentage: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  // Plan & Hierarchy Metadata (Ahmed 2027 Goals Architecture)
  planId?: string;
  refId?: string;
  previousGoalId?: string;
  lifeArea?: string;
  blessedIntentionSuggestion?: string;
  successCriteria?: string;
  actionTemplates?: string[];
  metadata?: Record<string, any>;
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  title: string;
  targetDate?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  sortOrder: number;
  weight: number;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalLink {
  id: string;
  goalId: string;
  entityType: 'SKILL' | 'RESOURCE' | 'PROJECT' | 'TASK' | 'SUBJECT';
  entityId: string;
  relationship?: 'PRIMARY' | 'SUPPORTING';
  createdAt: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  parentId?: string;
  type: 'SKILL' | 'BOOK' | 'COURSE' | 'RESOURCE' | 'GENERAL';
  color?: string;
  icon?: string;
  sortOrder: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  parentSkillId?: string;
  name: string;
  category: string;
  categoryId?: string;
  baselineLevel: number;
  targetLevel: number;
  contentProgress: number; // 0 - 100 (Courses/Videos consumed)
  demonstratedCompetence: number; // 0 - 100 (Projects/Evidence)
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type ResourceType = 'BOOK' | 'COURSE' | 'VIDEO' | 'PLAYLIST' | 'PAPER' | 'PROJECT' | 'CUSTOM';
export type ResourceStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'DROPPED';

export interface LearningResource {
  id: string;
  type: ResourceType;
  title: string;
  description?: string;
  sourceUrl?: string;
  provider?: string;
  categoryId?: string;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  courseResourceId: string;
  title: string;
  sortOrder: number;
  createdAt: string;
}

export interface CourseLesson {
  id: string;
  courseResourceId: string;
  moduleId?: string;
  title: string;
  durationMinutes?: number;
  videoUrl?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;
  sortOrder: number;
  notes?: string;
  createdAt: string;
}

export interface BookDetails {
  resourceId: string; // PK -> LearningResource.id
  author?: string;
  isbn?: string;
  coverUrl?: string;
  totalPages: number;
  currentPage: number;
  shelf: 'Want to Read' | 'Reading' | 'Finished' | 'Paused' | 'Dropped';
  rating?: number;
}

export interface ReadingSession {
  id: string;
  bookResourceId: string;
  pagesRead: number;
  startPage: number;
  endPage: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
}

export interface CourseDetails {
  resourceId: string; // PK -> LearningResource.id
  instructor?: string;
  totalLessons: number;
  completedLessons: number;
  durationMinutes: number;
  thumbnailUrl?: string;
}

export interface SkillResource {
  skillId: string;
  resourceId: string;
}

export interface SkillEvidence {
  id: string;
  skillId: string;
  title: string;
  url?: string;
  verificationDate: string;
  notes?: string;
}

export interface UniversitySubject {
  id: string;
  name: string;
  code: string;
  academicYear: number;
  semester: number;
  professor?: string;
  examDate?: string; // YYYY-MM-DD
  midExamDate?: string;
  focus?: 'High' | 'Normal';
  hall?: string;
  scheduleDescription?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  createdAt: string;
  updatedAt: string;
}

export type StudySessionType = 'LECTURE' | 'LAB' | 'TUTORIAL' | 'ASSIGNMENT' | 'EXAM_PREP';
export type StudySessionStatus = 'STUDIED' | 'UNDERSTOOD' | 'REVISED' | 'SOLVED' | 'COMPLETED' | 'SUBMITTED';

export interface StudySession {
  id: string;
  subjectId: string;
  type: StudySessionType;
  title: string;
  lectureNumber?: number;
  status: StudySessionStatus;
  materialReady?: boolean;
  studyDone?: boolean;
  reviseDone?: boolean;
  solveDone?: boolean;
  priority?: 'High' | 'Normal';
  notes?: string;
  submittedDate?: string;
  // FSRS fields
  fsrsStability: number;
  fsrsDifficulty: number;
  fsrsLastReview?: string;
  fsrsNextReview?: string;
  updatedAt?: string;
}

export interface TimetableSlot {
  id: string;
  day: 'السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';
  startTime: string; // e.g. "08:00"
  endTime: string | null;   // null = ending time unknown
  subjectName: string;
  subjectCode: string;
  format: 'Campus' | 'Online';
  hall: string;      // e.g. "مدرج 5", "مدرج ج"
  notes?: string | null;
  updatedAt?: string;
}

export interface AcademicQuiz {
  id: string;
  topic: string;
  subjectId: string;
  subjectName: string;
  quizDate: string;  // YYYY-MM-DD
  syllabusScope?: string;
  prepared: boolean;
  attended: boolean;
  myScore?: number;
  outOf?: number;
}

export interface AcademicAssignment {
  id: string;
  taskName: string;
  subjectId: string;
  subjectName: string;
  deadline: string;  // YYYY-MM-DD
  lecture?: string;
  completed: boolean;
  submitted: boolean;
  blocked: boolean;
  score?: number;
}

export interface StudentActivityTask {
  id: string;
  activityName: 'NASA Space Apps' | 'Sciora' | string;
  taskName: string;
  deadline?: string;
  done: boolean;
  delegated?: boolean;
  followUpDate?: string;
  notes?: string;
}

export type TaskPriority = 'P1_URGENT_IMPORTANT' | 'P2_IMPORTANT' | 'P3_NORMAL';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'POSTPONED' | 'CANCELLED';

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string; // YYYY-MM-DD
  estimatedMinutes: number;
  isLocked: boolean; // Fixed commitments cannot be auto-postponed
  postponementCount: number;
  goalId?: string;
  skillId?: string;
  studySessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskPostponement {
  id: string;
  taskId: string;
  postponedAt: string;
  reason?: string;
  newDueDate: string;
}

export type HabitTargetType = 'BOOLEAN' | 'PAGES' | 'MINUTES';

export interface Habit {
  id: string;
  title: string;
  targetType: HabitTargetType;
  targetValue: number;
  streakCount: number;
  consecutiveMisses: number; // Resets only at 3
  restDays: number[]; // e.g. [5] for Friday
  lastCompletedDate?: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: 'COMPLETED' | 'REST_DAY' | 'SKIPPED' | 'MISSED';
  valueRecorded: number;
  triggerSource?: string;
}

export type XPCategory = 'STUDY' | 'READING' | 'HABIT' | 'SKILL_PROJECT' | 'MILESTONE' | 'CHALLENGE';

export interface XPTransaction {
  id: string;
  idempotencyKey: string; // composite hash to prevent duplicates
  amount: number;
  category: XPCategory;
  reason: string;
  createdAt: string;
}

export type JournalMode = 'FREE_WRITING' | 'GUIDED_5_PROMPTS';

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mode: JournalMode;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SyncQueueItem {
  id?: number;
  tableName: string;
  recordId: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: any;
  createdAt: number;
  retryCount: number;
}

// ==========================================
// MASAAR V2 — Life OS Extended Types
// ==========================================

export interface Tombstone {
  id: string; // e.g. "tomb-subj-spectro" or "tomb-book-123"
  entityType: 'BOOK' | 'RESOURCE' | 'SUBJECT' | 'TIMETABLE_SLOT' | 'CATEGORY' | 'GOAL' | 'HABIT' | 'INTENTION' | 'WORKOUT' | 'SKILL' | 'TASK' | 'JOURNAL' | 'CHALLENGE' | string;
  entityId: string;
  deletedAt: string;
  reason?: string;
}

export interface XPResetEvent {
  id: string;
  resetAt: string;
  previousTotalXP: number;
  transactionsArchivedCount: number;
  backupKey: string;
  reason?: string;
}

export interface Intention {
  id: string;
  title: string;
  purpose?: string;
  reference?: string; // spiritual or personal reference
  isArchived: boolean;
  reviewReminderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoalIntention {
  id: string;
  goalId: string;
  intentionId: string;
  createdAt: string;
}

export interface WorshipLog {
  id: string;
  date: string; // YYYY-MM-DD (Cairo)
  prayerName: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha' | 'Jummah';
  status: 'COMPLETED' | 'MISSED' | 'EXCUSED';
  inMosque?: boolean;
  notes?: string;
  createdAt: string;
}

export interface QuranReadingLog {
  id: string;
  date: string; // YYYY-MM-DD
  pagesRead: number;
  surahStart?: string;
  surahEnd?: string;
  notes?: string;
  createdAt: string;
}

export interface QiyamSession {
  id: string;
  date: string; // Start date YYYY-MM-DD
  startTime: string; // e.g. "23:30"
  endTime: string; // e.g. "00:20" (supports cross-midnight)
  durationMinutes: number;
  rakahsCount?: number;
  notes?: string;
  createdAt: string;
}

export interface MovementLog {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  activityType: 'WALK' | 'RUN' | 'CYCLING' | 'STRETCHING' | 'SPORT' | 'MOBILITY' | 'GYM' | 'CUSTOM';
  meets20MinBaseline: boolean;
  intensity?: 'LIGHT' | 'MODERATE' | 'VIGOROUS';
  notes?: string;
  createdAt: string;
}

export interface ExerciseDetail {
  id: string;
  name: string;
  sets: { setNumber: number; reps: number; weightKg?: number }[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  title: string;
  activityType: 'GYM_STRENGTH' | 'CARDIO' | 'HIIT' | 'RECOVERY';
  durationMinutes: number;
  exercises?: ExerciseDetail[];
  notes?: string;
  createdAt: string;
}

export interface AvailabilityRule {
  id: string;
  dayOfWeek: 'السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';
  type: 'SLEEP' | 'PRAYER_BUFFER' | 'MEAL' | 'WORK_FALCON' | 'COMMUTE' | 'RESERVE_BUFFER' | 'FOCUS_STUDY';
  startTime: string;
  endTime: string;
  isLocked: boolean;
  label: string;
}

export interface ScheduleBlock {
  id: string;
  taskId?: string;
  title: string;
  day: 'السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';
  startTime: string;
  endTime: string;
  durationMinutes: number;
  type: 'FIXED_CLASS' | 'TASK' | 'STUDY_SESSION' | 'PRAYER' | 'BUFFER' | 'WORK';
  isLocked: boolean;
  goalId?: string;
  subjectCode?: string;
}

export interface WeeklySchedulePlan {
  id: string;
  weekStartDate: string; // YYYY-MM-DD
  totalWakefulMinutes: number;
  fixedCommitmentMinutes: number;
  prayerBufferMinutes: number;
  travelAndMealsMinutes: number;
  safetyBufferMinutes: number;
  availableFlexibleMinutes: number;
  requiredFlexibleMinutes: number;
  unscheduledMinutes: number;
  isOverloaded: boolean;
  status: 'DRAFT' | 'COMMITTED';
  generatedAt: string;
}

// ==========================================
// MASAAR V2 — Challenges Engine (90-Day & Custom)
// ==========================================

export type ChallengeCategory = 'HEALTH' | 'FITNESS' | 'FAITH' | 'LEARNING' | 'STUDY' | 'READING' | 'MINDSET' | 'PRODUCTIVITY' | 'OTHER';

export interface ChallengeTaskTemplate {
  id: string;
  title: string;
  durationMinutes: number;
  category?: ChallengeCategory;
  icon?: string;
  isMandatory?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  category?: ChallengeCategory;
  durationDays: number; // e.g. 90
  status: 'ACTIVE' | 'QUEUED' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  currentDay: number; // 1 to durationDays
  completedDaysCount: number;
  xpReward: number; // e.g. 1000
  trophyIcon?: string;
  tasks: ChallengeTaskTemplate[];
  nextChallengeId?: string; // Sequential chain
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeDayLog {
  id: string; // e.g. "chlog-${challengeId}-${date}"
  challengeId: string;
  date: string; // YYYY-MM-DD
  dayNumber: number; // e.g. 1 to 90
  status: 'COMPLETED' | 'PARTIAL' | 'MISSED' | 'REST';
  completedTaskIds: string[];
  totalMinutesSpent: number;
  reflectionNote?: string;
  createdAt: string;
  updatedAt: string;
}

