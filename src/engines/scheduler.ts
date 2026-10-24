import type { 
  Task, 
  TimetableSlot, 
  AvailabilityRule, 
  ScheduleBlock, 
  WeeklySchedulePlan,
  WeeklyItem,
  WeekMode,
  Goal,
  AcademicQuiz
} from '../types';
import { getCairoPrayerTimes, type DayPrayersResult } from './prayer';
import { 
  getCairoSaturdayWeekStart, 
  getWeekDates, 
  isDateInMidtermExamPeriod, 
  type ArabicDay 
} from '../lib/dateUtils';

export interface TimeInterval {
  startMinutes: number; // minutes from 00:00 (e.g. 08:00 = 480)
  endMinutes: number;   // minutes from 00:00 (e.g. 10:00 = 600)
  label: string;
  isHardConstraint: boolean;
}

export interface DayCapacityResult {
  day: ArabicDay;
  dateStr?: string;
  wakefulMinutes: number;
  fixedCommitmentMinutes: number;
  prayerBufferMinutes: number;
  travelAndBreakMinutes: number;
  safetyBufferMinutes: number;
  availableFlexibleMinutes: number;
  freeGaps: { startMinutes: number; endMinutes: number; durationMinutes: number }[];
}

/**
 * Parses "HH:mm" into minutes from start of day.
 */
export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Formats minutes from start of day into "HH:mm".
 */
export function minutesToTimeString(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(24 * 60 - 1, totalMinutes));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Computes interval union to prevent double-subtracting overlapping fixed commitments.
 * Mathematical interval merging algorithm.
 */
export function mergeIntervals(intervals: { start: number; end: number }[]): { start: number; end: number }[] {
  if (intervals.length <= 1) return intervals;

  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end) {
      // Overlapping or touching intervals
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

/**
 * Calculates Day Capacity respecting Hard Constraints, Sleep, and Prayer Buffers.
 */
export function computeDayCapacity(
  day: ArabicDay,
  daySlots: TimetableSlot[],
  prayers: DayPrayersResult,
  availabilityRules: AvailabilityRule[] = [],
  safetyBufferRatio = 0.15,
  pinnedBlocksForDay: ScheduleBlock[] = []
): DayCapacityResult {
  // 1. Wakeful window: Default 06:30 to 23:30 (7 hours sleep protected = 1020 wakeful minutes)
  let wakefulStart = 6 * 60 + 30; // 06:30
  let wakefulEnd = 23 * 60 + 30;  // 23:30

  // Override from sleep rules if provided
  const sleepRule = availabilityRules.find(r => r.dayOfWeek === day && r.type === 'SLEEP');
  if (sleepRule) {
    const sStart = timeStringToMinutes(sleepRule.startTime);
    const sEnd = timeStringToMinutes(sleepRule.endTime);
    // If sleep crosses midnight (e.g. 23:00 to 06:30)
    if (sStart > sEnd) {
      wakefulStart = sEnd;
      wakefulEnd = sStart;
    } else {
      wakefulStart = Math.max(0, sEnd);
      wakefulEnd = Math.min(24 * 60, sStart);
    }
  }

  const wakefulMinutes = Math.max(0, wakefulEnd - wakefulStart);

  // 2. Gather Hard Constraint Intervals
  const rawIntervals: { start: number; end: number }[] = [];

  // A. University Timetable Slots
  for (const slot of daySlots) {
    const start = timeStringToMinutes(slot.startTime);
    let end: number;
    if (slot.endTime) {
      end = timeStringToMinutes(slot.endTime);
    } else {
      // Monday Molecular Spectroscopy unknown end: Model conservatively as 90 min provisional window
      end = start + 90;
    }
    rawIntervals.push({
      start: Math.max(wakefulStart, start),
      end: Math.min(wakefulEnd, end)
    });

    // Campus commute buffer: 30 minutes before and after on-campus sessions
    if (slot.format === 'Campus') {
      rawIntervals.push({
        start: Math.max(wakefulStart, start - 30),
        end: Math.min(wakefulEnd, start)
      });
      rawIntervals.push({
        start: Math.max(wakefulStart, end),
        end: Math.min(wakefulEnd, end + 30)
      });
    }
  }

  // B. 5 Prayer Buffers (15m before and 15m after each prayer)
  const prayerTimesList = [
    prayers.fajr.time,
    prayers.dhuhr.time,
    prayers.asr.time,
    prayers.maghrib.time,
    prayers.isha.time
  ];

  for (const pTime of prayerTimesList) {
    const pMinutes = pTime.getHours() * 60 + pTime.getMinutes();
    rawIntervals.push({
      start: Math.max(wakefulStart, pMinutes - 15),
      end: Math.min(wakefulEnd, pMinutes + 15)
    });
  }

  // C. Other Locked Rules (e.g. Falcon work block, meals)
  for (const rule of availabilityRules.filter(r => r.dayOfWeek === day && r.isLocked && r.type !== 'SLEEP')) {
    rawIntervals.push({
      start: Math.max(wakefulStart, timeStringToMinutes(rule.startTime)),
      end: Math.min(wakefulEnd, timeStringToMinutes(rule.endTime))
    });
  }

  // D. User Pinned Blocks for this day (Hard constraints for auto-scheduling)
  for (const pinned of pinnedBlocksForDay) {
    const pStart = timeStringToMinutes(pinned.startTime);
    const pEnd = timeStringToMinutes(pinned.endTime);
    rawIntervals.push({
      start: Math.max(wakefulStart, pStart),
      end: Math.min(wakefulEnd, pEnd)
    });
  }

  // 3. Mathematical Interval Union
  const mergedCommitments = mergeIntervals(rawIntervals);
  const totalBlockedMinutes = mergedCommitments.reduce((sum, int) => sum + (int.end - int.start), 0);

  // 4. Calculate Free Gaps
  const freeGaps: { startMinutes: number; endMinutes: number; durationMinutes: number }[] = [];
  let currentPointer = wakefulStart;

  for (const block of mergedCommitments) {
    if (block.start > currentPointer) {
      freeGaps.push({
        startMinutes: currentPointer,
        endMinutes: block.start,
        durationMinutes: block.start - currentPointer
      });
    }
    currentPointer = Math.max(currentPointer, block.end);
  }

  if (currentPointer < wakefulEnd) {
    freeGaps.push({
      startMinutes: currentPointer,
      endMinutes: wakefulEnd,
      durationMinutes: wakefulEnd - currentPointer
    });
  }

  const rawAvailableMinutes = freeGaps.reduce((sum, g) => sum + g.durationMinutes, 0);
  const safetyBufferMinutes = Math.round(rawAvailableMinutes * safetyBufferRatio);
  const availableFlexibleMinutes = Math.max(0, rawAvailableMinutes - safetyBufferMinutes);

  return {
    day,
    wakefulMinutes,
    fixedCommitmentMinutes: totalBlockedMinutes,
    prayerBufferMinutes: 5 * 30, // 150m total nominal prayer buffers
    travelAndBreakMinutes: 60,
    safetyBufferMinutes,
    availableFlexibleMinutes,
    freeGaps
  };
}

export interface GenerateWeeklyPlanOptions {
  tasks: Task[];
  timetableSlots: TimetableSlot[];
  prayers?: DayPrayersResult;
  availabilityRules?: AvailabilityRule[];
  goals?: Goal[];
  weekStartDate?: string; // Saturday; YYYY-MM-DD (defaults to current Cairo Saturday)
  mode?: WeekMode;
  pinnedBlocks?: ScheduleBlock[];
  existingPlan?: WeeklySchedulePlan;
  safetyBufferRatio?: number;
  quizzes?: AcademicQuiz[];
}

export interface GenerateWeeklyPlanResult {
  plan: WeeklySchedulePlan;
  scheduleBlocks: ScheduleBlock[];
  weeklyItems: WeeklyItem[];
  unplacedItems: WeeklyItem[];
}

/**
 * Generates Weekly Schedule Plan, allocating tasks without overlapping hard constraints.
 * Supports both options object and legacy positional parameters.
 */
export function generateWeeklySchedulePlan(
  tasksOrOptions: Task[] | GenerateWeeklyPlanOptions,
  legacyTimetableSlots: TimetableSlot[] = [],
  legacyPrayers?: DayPrayersResult,
  legacyAvailabilityRules: AvailabilityRule[] = [],
  legacyGoals: Goal[] = [],
  legacySafetyBufferRatio = 0.15
): GenerateWeeklyPlanResult {
  // Normalize options
  let opts: GenerateWeeklyPlanOptions;
  if (Array.isArray(tasksOrOptions)) {
    opts = {
      tasks: tasksOrOptions,
      timetableSlots: legacyTimetableSlots,
      prayers: legacyPrayers,
      availabilityRules: legacyAvailabilityRules,
      goals: legacyGoals,
      safetyBufferRatio: legacySafetyBufferRatio
    };
  } else {
    opts = tasksOrOptions;
  }

  const {
    tasks,
    timetableSlots,
    availabilityRules = [],
    goals = [],
    pinnedBlocks = [],
    safetyBufferRatio = 0.15,
    quizzes = []
  } = opts;

  const targetWeekStart = opts.weekStartDate || getCairoSaturdayWeekStart();
  const weekDays = getWeekDates(targetWeekStart);
  const nowIso = new Date().toISOString();
  const planId = `plan-week-${targetWeekStart}`;

  // Auto-detect Mode if not explicitly set
  const hasExamsInWeek = weekDays.some(d => isDateInMidtermExamPeriod(d.dateStr));
  const weekMode: WeekMode = opts.mode || (hasExamsInWeek ? 'EXAMS' : 'NORMAL');

  const scheduleBlocks: ScheduleBlock[] = [];
  const weeklyItems: WeeklyItem[] = [];
  const unplacedItems: WeeklyItem[] = [];

  let totalWakeful = 0;
  let totalFixed = 0;
  let totalAvailableFlexible = 0;

  // 1. Compute Day Capacities for all 7 Cairo calendar dates with per-date prayers
  const dayContexts = weekDays.map(({ dateStr, arabicDay }) => {
    const dayDate = new Date(`${dateStr}T12:00:00Z`);
    const dayPrayers = getCairoPrayerTimes(dayDate);
    const daySlots = timetableSlots.filter(s => s.day === arabicDay);
    const dayPinned = pinnedBlocks.filter(b => (b.date === dateStr || b.day === arabicDay) && b.isUserPinned);

    const cap = computeDayCapacity(arabicDay, daySlots, dayPrayers, availabilityRules, safetyBufferRatio, dayPinned);
    cap.dateStr = dateStr;

    totalWakeful += cap.wakefulMinutes;
    totalFixed += cap.fixedCommitmentMinutes;
    totalAvailableFlexible += cap.availableFlexibleMinutes;

    // Add fixed university slots as locked blocks
    for (const slot of daySlots) {
      scheduleBlocks.push({
        id: `block-slot-${dateStr}-${slot.id}`,
        planId,
        date: dateStr,
        day: arabicDay,
        title: slot.subjectName,
        startTime: slot.startTime,
        endTime: slot.endTime || minutesToTimeString(timeStringToMinutes(slot.startTime) + 90),
        durationMinutes: slot.endTime 
          ? timeStringToMinutes(slot.endTime) - timeStringToMinutes(slot.startTime)
          : 90,
        type: 'FIXED_CLASS',
        isLocked: true,
        subjectCode: slot.subjectCode,
        origin: 'FIXED'
      });
    }

    // Preserve pinned blocks
    for (const pb of dayPinned) {
      scheduleBlocks.push({
        ...pb,
        planId,
        date: dateStr,
        day: arabicDay,
        origin: pb.origin || 'MANUAL',
        isUserPinned: true,
        isLocked: true
      });
    }

    return { dateStr, arabicDay, cap, isExamDay: isDateInMidtermExamPeriod(dateStr) };
  });

  // Track task IDs already locked in pinned blocks
  const pinnedTaskIds = new Set(pinnedBlocks.map(b => b.taskId).filter(Boolean));

  const weekEndDate = weekDays[6].dateStr; // e.g. "2026-10-30"

  // 2. Filter & Prepare Candidate Tasks
  // Exclude DONE, CANCELLED, and already pinned tasks
  // Strictly filter out tasks whose deadlines or goals belong to future periods (e.g. Nov/Dec 2026 or 2027 when still in October)
  const candidateTasks = tasks.filter(t => {
    if (t.status === 'DONE' || (t as any).status === 'CANCELLED' || pinnedTaskIds.has(t.id)) {
      return false;
    }

    // Explicitly assigned to this week's plan
    if (t.planId === planId) {
      return true;
    }

    // If assigned to a DIFFERENT week plan, exclude from this week
    if (t.planId && t.planId.startsWith('plan-week-') && t.planId !== planId) {
      return false;
    }

    // If task has a deadline (dueDate):
    if (t.dueDate) {
      // If deadline is after this week's end (e.g. in a future week/month), do NOT schedule it into this week!
      if (t.dueDate > weekEndDate) {
        return false;
      }
      // Task is due in or before this week -> definitely include
      return true;
    }

    // If task has NO deadline:
    // Check if it belongs to a goal that is explicitly in the future
    if (t.goalId) {
      const g = goals.find(goal => goal.id === t.goalId);
      if (g) {
        // November monthly goals (M11) while weekEndDate is in October (< 2026-11-01)
        if ((t.goalId.includes('M11') || t.goalId.includes('NOV') || (g.targetDate && g.targetDate.startsWith('2026-11'))) && weekEndDate < '2026-11-01') {
          return false;
        }
        // December monthly goals (M12) while weekEndDate is before December (< 2026-12-01)
        if ((t.goalId.includes('M12') || t.goalId.includes('DEC') || (g.targetDate && g.targetDate.startsWith('2026-12'))) && weekEndDate < '2026-12-01') {
          return false;
        }
        // 2027 goals while still in 2026 (< 2027-01-01)
        if ((t.goalId.startsWith('G27') || t.goalId.includes('2027') || (g.targetDate && g.targetDate.startsWith('2027'))) && weekEndDate < '2027-01-01') {
          return false;
        }
      }
    }

    return true;
  });

  interface SchedulableItem {
    id: string;
    taskId?: string;
    goalId?: string;
    title: string;
    durationMinutes: number;
    priorityScore: number;
    partIndex?: number;
    deadline?: string;
    isNonEssentialCourse: boolean;
  }

  const schedulableCandidates: SchedulableItem[] = [];

  for (const t of candidateTasks) {
    const rawMin = t.estimatedMinutes !== undefined ? t.estimatedMinutes : 45;

    // 0-minute tasks: Milestone / Status Checkpoint (do NOT artificially expand to 45m)
    if (rawMin === 0) {
      unplacedItems.push({
        id: `witem-${targetWeekStart}-task-${t.id}`,
        weekStartDate: targetWeekStart,
        goalId: t.goalId,
        taskId: t.id,
        sourceType: 'TASK',
        sourceKey: t.id,
        labelSnapshot: t.title,
        plannedMinutes: 0,
        deadline: t.dueDate,
        status: 'PLANNED',
        isUserPinned: false,
        unplacedReason: 'نقطة متابعة / إنجاز بدون مدة زمنية (0 دقيقة)',
        createdAt: nowIso,
        updatedAt: nowIso
      });
      continue;
    }

    // Check if this task is an elective course that should be suspended during Midterm exams (Nov 7-21)
    const isNonEssentialCourse = Boolean(
      (t.goalId && (t.goalId.includes('B26-M11-FAMILY') || t.goalId.includes('B26-M11-FALCON') || t.goalId.includes('B26-M11-AI'))) ||
      t.title.includes('كورس الزواج') ||
      t.title.includes('كورس التسويق') ||
      t.title.includes('كورس الذكاء')
    );

    // Calculate priority score
    let score = t.priority === 'P1_URGENT_IMPORTANT' ? 60 : t.priority === 'P2_IMPORTANT' ? 35 : 15;
    if (t.goalId) score += 30;
    if (t.studySessionId) {
      score += 25;
      // Boost if this session is covered by an upcoming quiz in this week
      const isCoveredByWeekQuiz = quizzes.some(q =>
        !q.prepared &&
        q.lectureIds?.includes(t.studySessionId!) &&
        q.quizDate &&
        weekDays.some(d => d.dateStr === q.quizDate)
      );
      if (isCoveredByWeekQuiz) {
        score += 45;
      }
    }
    if (t.dueDate && t.dueDate <= weekDays[6].dateStr) score += 20;

    // 120-minute tasks: Split into 2 x 60 min sessions if needed
    if (rawMin === 120) {
      schedulableCandidates.push({
        id: `${t.id}-p1`,
        taskId: t.id,
        goalId: t.goalId,
        title: `${t.title} (جلسة 1/2)`,
        durationMinutes: 60,
        priorityScore: score + 2,
        partIndex: 1,
        deadline: t.dueDate,
        isNonEssentialCourse
      });
      schedulableCandidates.push({
        id: `${t.id}-p2`,
        taskId: t.id,
        goalId: t.goalId,
        title: `${t.title} (جلسة 2/2)`,
        durationMinutes: 60,
        priorityScore: score,
        partIndex: 2,
        deadline: t.dueDate,
        isNonEssentialCourse
      });
    } else {
      schedulableCandidates.push({
        id: t.id,
        taskId: t.id,
        goalId: t.goalId,
        title: t.title,
        durationMinutes: rawMin,
        priorityScore: score,
        deadline: t.dueDate,
        isNonEssentialCourse
      });
    }
  }

  // Include upcoming week's quizzes as schedulable preparation candidates if not already placed
  for (const quiz of quizzes) {
    if (quiz.attended && quiz.prepared) continue;
    if (!quiz.quizDate) continue;
    const isQuizInThisWeek = weekDays.some(d => d.dateStr === quiz.quizDate);
    if (isQuizInThisWeek) {
      const alreadyScheduled = pinnedBlocks.some(b => b.taskId === `quiz-${quiz.id}`);
      if (!alreadyScheduled) {
        schedulableCandidates.push({
          id: `candidate-quiz-${quiz.id}`,
          taskId: `quiz-${quiz.id}`,
          title: `🎯 مراجعة واستعداد لكويز: ${quiz.topic} (${quiz.subjectName})`,
          durationMinutes: 45,
          priorityScore: 90,
          deadline: quiz.quizDate,
          isNonEssentialCourse: false
        });
      }
    }
  }

  // Sort candidates descending by score
  schedulableCandidates.sort((a, b) => b.priorityScore - a.priorityScore);

  const totalRequiredFlexibleMinutes = schedulableCandidates.reduce((sum, c) => sum + c.durationMinutes, 0);

  // 3. Best-fit Allocation into Feasible Free Gaps
  let remainingCandidates = [...schedulableCandidates];

  for (const { dateStr, arabicDay, cap, isExamDay } of dayContexts) {
    let dayRemainingAvailable = cap.availableFlexibleMinutes;

    for (const gap of cap.freeGaps) {
      let gapPointer = gap.startMinutes;

      while (remainingCandidates.length > 0 && dayRemainingAvailable >= 30) {
        // Find best-fitting candidate for this gap
        const candidateIndex = remainingCandidates.findIndex(cand => {
          // If today is an Exam Day (Nov 7-21), do NOT schedule elective non-essential courses!
          if (isExamDay && cand.isNonEssentialCourse) return false;
          return (gapPointer + cand.durationMinutes <= gap.endMinutes) && (dayRemainingAvailable >= cand.durationMinutes);
        });

        if (candidateIndex === -1) {
          // No fitting candidate found for the rest of this gap
          break;
        }

        const [candidate] = remainingCandidates.splice(candidateIndex, 1);
        const startTimeStr = minutesToTimeString(gapPointer);
        const endTimeStr = minutesToTimeString(gapPointer + candidate.durationMinutes);

        // Add Schedule Block
        scheduleBlocks.push({
          id: `sched-task-${dateStr}-${candidate.id}`,
          planId,
          date: dateStr,
          day: arabicDay,
          taskId: candidate.taskId,
          goalId: candidate.goalId,
          title: candidate.title,
          startTime: startTimeStr,
          endTime: endTimeStr,
          durationMinutes: candidate.durationMinutes,
          type: 'TASK',
          isLocked: false,
          isUserPinned: false,
          partIndex: candidate.partIndex,
          origin: 'AUTO',
          updatedAt: nowIso
        });

        // Add corresponding WeeklyItem
        weeklyItems.push({
          id: `witem-${targetWeekStart}-${candidate.id}`,
          weekStartDate: targetWeekStart,
          goalId: candidate.goalId,
          taskId: candidate.taskId,
          sourceType: 'TASK',
          sourceKey: candidate.taskId || candidate.id,
          labelSnapshot: candidate.title,
          plannedMinutes: candidate.durationMinutes,
          deadline: candidate.deadline,
          status: 'SCHEDULED',
          isUserPinned: false,
          partIndex: candidate.partIndex,
          createdAt: nowIso,
          updatedAt: nowIso
        });

        // Advance pointer with a 10m buffer between sessions
        gapPointer += candidate.durationMinutes + 10;
        dayRemainingAvailable -= candidate.durationMinutes;
      }
    }
  }

  // 4. Collect Unplaced Tasks Truthfully
  for (const unplaced of remainingCandidates) {
    const reason = unplaced.isNonEssentialCourse && hasExamsInWeek
      ? 'مؤجلة لما بعد الامتحانات (فترة الميدتيرم 7–21 نوفمبر)'
      : 'ضيق الوقت والسعة المتاحة هذا الأسبوع';

    unplacedItems.push({
      id: `witem-${targetWeekStart}-${unplaced.id}`,
      weekStartDate: targetWeekStart,
      goalId: unplaced.goalId,
      taskId: unplaced.taskId,
      sourceType: 'TASK',
      sourceKey: unplaced.taskId || unplaced.id,
      labelSnapshot: unplaced.title,
      plannedMinutes: unplaced.durationMinutes,
      deadline: unplaced.deadline,
      status: 'DEFERRED',
      isUserPinned: false,
      partIndex: unplaced.partIndex,
      unplacedReason: reason,
      createdAt: nowIso,
      updatedAt: nowIso
    });
  }

  // 5. Accurate Unscheduled Minutes (from actually unplaced timed items)
  const unscheduledMinutes = unplacedItems
    .filter(item => item.plannedMinutes > 0)
    .reduce((sum, item) => sum + item.plannedMinutes, 0);

  const isOverloaded = unscheduledMinutes > 0;

  const plan: WeeklySchedulePlan = {
    id: planId,
    weekStartDate: targetWeekStart,
    totalWakefulMinutes: totalWakeful,
    fixedCommitmentMinutes: totalFixed,
    prayerBufferMinutes: 7 * 150,
    travelAndMealsMinutes: 7 * 60,
    safetyBufferMinutes: Math.round(totalAvailableFlexible * safetyBufferRatio),
    availableFlexibleMinutes: totalAvailableFlexible,
    requiredFlexibleMinutes: totalRequiredFlexibleMinutes,
    unscheduledMinutes,
    isOverloaded,
    status: opts.existingPlan?.status || 'DRAFT',
    generatedAt: nowIso,
    mode: weekMode,
    revision: (opts.existingPlan?.revision || 0) + 1,
    plannerVersion: 2
  };

  return { plan, scheduleBlocks, weeklyItems, unplacedItems };
}
