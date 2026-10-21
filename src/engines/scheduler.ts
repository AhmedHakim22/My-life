import type { 
  Task, 
  TimetableSlot, 
  AvailabilityRule, 
  ScheduleBlock, 
  WeeklySchedulePlan,
  Goal
} from '../types';
import type { DayPrayersResult } from './prayer';

export interface TimeInterval {
  startMinutes: number; // minutes from 00:00 (e.g. 08:00 = 480)
  endMinutes: number;   // minutes from 00:00 (e.g. 10:00 = 600)
  label: string;
  isHardConstraint: boolean;
}

export interface DayCapacityResult {
  day: 'السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة';
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
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
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
  day: 'السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة',
  daySlots: TimetableSlot[],
  prayers: DayPrayersResult,
  availabilityRules: AvailabilityRule[] = [],
  safetyBufferRatio = 0.15 // 15% configurable safety buffer
): DayCapacityResult {
  // 1. Wakeful window: Default 06:30 to 23:30 (7 hours sleep protected = 1020 wakeful minutes)
  let wakefulStart = 6 * 60 + 30; // 06:30
  let wakefulEnd = 23 * 60 + 30;  // 23:30

  // Override from sleep rules if provided
  const sleepRule = availabilityRules.find(r => r.dayOfWeek === day && r.type === 'SLEEP');
  if (sleepRule) {
    wakefulStart = timeStringToMinutes(sleepRule.endTime);
    wakefulEnd = timeStringToMinutes(sleepRule.startTime);
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

/**
 * Generates Weekly Schedule Plan, allocating tasks without overlapping hard constraints.
 * Detects and reports Overload truthfully.
 */
export function generateWeeklySchedulePlan(
  tasks: Task[],
  timetableSlots: TimetableSlot[],
  prayers: DayPrayersResult,
  availabilityRules: AvailabilityRule[] = [],
  goals: Goal[] = [],
  safetyBufferRatio = 0.15
): { plan: WeeklySchedulePlan; scheduleBlocks: ScheduleBlock[] } {
  const days: ('السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة')[] = [
    'السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'
  ];

  const now = new Date().toISOString();
  const todayStr = now.split('T')[0];

  const scheduleBlocks: ScheduleBlock[] = [];
  let totalWakeful = 0;
  let totalFixed = 0;
  let totalAvailableFlexible = 0;

  // 1. Compute Day Capacities
  const dayCapacities = days.map(day => {
    const daySlots = timetableSlots.filter(s => s.day === day);
    const cap = computeDayCapacity(day, daySlots, prayers, availabilityRules, safetyBufferRatio);
    totalWakeful += cap.wakefulMinutes;
    totalFixed += cap.fixedCommitmentMinutes;
    totalAvailableFlexible += cap.availableFlexibleMinutes;

    // Add fixed university slots as locked blocks
    for (const slot of daySlots) {
      scheduleBlocks.push({
        id: `block-slot-${slot.id}`,
        title: slot.subjectName,
        day,
        startTime: slot.startTime,
        endTime: slot.endTime || minutesToTimeString(timeStringToMinutes(slot.startTime) + 90),
        durationMinutes: slot.endTime 
          ? timeStringToMinutes(slot.endTime) - timeStringToMinutes(slot.startTime)
          : 90,
        type: 'FIXED_CLASS',
        isLocked: true,
        subjectCode: slot.subjectCode
      });
    }

    return cap;
  });

  // 2. Rank Tasks for Scheduling
  // Goal-linked tasks (+30), P1 urgency (+50), P2 (+30), P3 (+10)
  const pendingTasks = tasks.filter(t => t.status !== 'DONE');
  const rankedTasks = [...pendingTasks].sort((a, b) => {
    let scoreA = a.priority === 'P1_URGENT_IMPORTANT' ? 50 : a.priority === 'P2_IMPORTANT' ? 30 : 10;
    let scoreB = b.priority === 'P1_URGENT_IMPORTANT' ? 50 : b.priority === 'P2_IMPORTANT' ? 30 : 10;
    if (a.goalId) scoreA += 30;
    if (b.goalId) scoreB += 30;
    return scoreB - scoreA;
  });

  const totalRequiredFlexibleMinutes = rankedTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 45), 0);

  // 3. Allocate Tasks into Feasible Free Gaps
  let remainingTasks = [...rankedTasks];

  for (const cap of dayCapacities) {
    let dayRemainingAvailable = cap.availableFlexibleMinutes;

    for (const gap of cap.freeGaps) {
      let gapPointer = gap.startMinutes;

      while (remainingTasks.length > 0 && dayRemainingAvailable >= 30) {
        const task = remainingTasks[0];
        const taskDuration = task.estimatedMinutes || 45;

        if (gapPointer + taskDuration <= gap.endMinutes && dayRemainingAvailable >= taskDuration) {
          scheduleBlocks.push({
            id: `sched-task-${task.id}`,
            taskId: task.id,
            title: task.title,
            day: cap.day,
            startTime: minutesToTimeString(gapPointer),
            endTime: minutesToTimeString(gapPointer + taskDuration),
            durationMinutes: taskDuration,
            type: 'TASK',
            isLocked: false,
            goalId: task.goalId
          });

          gapPointer += taskDuration;
          dayRemainingAvailable -= taskDuration;
          remainingTasks.shift();
        } else {
          // Cannot fit this task in this gap
          break;
        }
      }
    }
  }

  // 4. Overload Calculation
  const unscheduledMinutes = Math.max(0, totalRequiredFlexibleMinutes - totalAvailableFlexible);
  const isOverloaded = unscheduledMinutes > 0;

  const plan: WeeklySchedulePlan = {
    id: `plan-week-${todayStr}`,
    weekStartDate: todayStr,
    totalWakefulMinutes: totalWakeful,
    fixedCommitmentMinutes: totalFixed,
    prayerBufferMinutes: 7 * 150,
    travelAndMealsMinutes: 7 * 60,
    safetyBufferMinutes: Math.round(totalAvailableFlexible * safetyBufferRatio),
    availableFlexibleMinutes: totalAvailableFlexible,
    requiredFlexibleMinutes: totalRequiredFlexibleMinutes,
    unscheduledMinutes,
    isOverloaded,
    status: 'DRAFT',
    generatedAt: now
  };

  return { plan, scheduleBlocks };
}
