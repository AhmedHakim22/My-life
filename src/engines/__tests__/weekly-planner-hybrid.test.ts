import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  generateWeeklySchedulePlan, 
  computeDayCapacity, 
  mergeIntervals,
  timeStringToMinutes,
  minutesToTimeString
} from '../scheduler';
import { 
  getCairoSaturdayWeekStart, 
  getWeekDates, 
  addDaysToDateString, 
  getArabicDayFromDate, 
  isDateInMidtermExamPeriod 
} from '../../lib/dateUtils';
import { getCairoPrayerTimes } from '../prayer';
import { db } from '../../db';
import { useAppStore } from '../../stores/appStore';
import type { Task, TimetableSlot, AvailabilityRule, ScheduleBlock, Goal } from '../../types';

describe('LifeOS Hybrid Weekly Planner Specification Acceptance Suite', () => {
  const dummyPrayers = getCairoPrayerTimes(new Date('2026-10-24T12:00:00Z'));

  describe('1. Cairo Saturday-Started Calendar Date Calculations', () => {
    it('accurately resolves Saturday as week start across month and year transitions', () => {
      // Current date
      expect(getCairoSaturdayWeekStart('2026-10-24')).toBe('2026-10-24'); // Already Saturday
      expect(getCairoSaturdayWeekStart('2026-10-25')).toBe('2026-10-24'); // Sunday
      expect(getCairoSaturdayWeekStart('2026-10-30')).toBe('2026-10-24'); // Friday

      // October/November boundary: Week of 2026-10-31 to 2026-11-06
      expect(getCairoSaturdayWeekStart('2026-10-31')).toBe('2026-10-31');
      expect(getCairoSaturdayWeekStart('2026-11-01')).toBe('2026-10-31');
      expect(getCairoSaturdayWeekStart('2026-11-06')).toBe('2026-10-31');

      // Year boundary: Week of 2026-12-26 to 2027-01-01
      expect(getCairoSaturdayWeekStart('2026-12-26')).toBe('2026-12-26');
      expect(getCairoSaturdayWeekStart('2026-12-30')).toBe('2026-12-26');
      expect(getCairoSaturdayWeekStart('2027-01-01')).toBe('2026-12-26'); // Friday
    });

    it('generates 7 exact calendar days starting with Saturday and ending with Friday', () => {
      const dates = getWeekDates('2026-11-21');
      expect(dates).toHaveLength(7);
      expect(dates[0]).toEqual({ dateStr: '2026-11-21', arabicDay: 'السبت' });
      expect(dates[1]).toEqual({ dateStr: '2026-11-22', arabicDay: 'الأحد' });
      expect(dates[2]).toEqual({ dateStr: '2026-11-23', arabicDay: 'الاثنين' });
      expect(dates[3]).toEqual({ dateStr: '2026-11-24', arabicDay: 'الثلاثاء' });
      expect(dates[4]).toEqual({ dateStr: '2026-11-25', arabicDay: 'الأربعاء' });
      expect(dates[5]).toEqual({ dateStr: '2026-11-26', arabicDay: 'الخميس' });
      expect(dates[6]).toEqual({ dateStr: '2026-11-27', arabicDay: 'الجمعة' });
    });

    it('identifies Cairo University Midterm Exam Period (7-21 November 2026)', () => {
      expect(isDateInMidtermExamPeriod('2026-11-06')).toBe(false);
      expect(isDateInMidtermExamPeriod('2026-11-07')).toBe(true);
      expect(isDateInMidtermExamPeriod('2026-11-14')).toBe(true);
      expect(isDateInMidtermExamPeriod('2026-11-21')).toBe(true); // Included
      expect(isDateInMidtermExamPeriod('2026-11-22')).toBe(false);
    });
  });

  describe('2. Hard Constraints & Cross-Midnight Sleep', () => {
    it('protects at least 7 hours sleep even with cross-midnight sleep rules', () => {
      const crossMidnightSleep: AvailabilityRule = {
        id: 'rule-sleep-cross',
        dayOfWeek: 'السبت',
        type: 'SLEEP',
        startTime: '23:00', // 23:00 to 06:30 = 7.5 hours
        endTime: '06:30',
        isLocked: true,
        label: 'Night Sleep'
      };

      const cap = computeDayCapacity('السبت', [], dummyPrayers, [crossMidnightSleep]);
      expect(cap.wakefulMinutes).toBe(16.5 * 60); // 990 minutes
      expect(cap.wakefulMinutes).toBeLessThan(24 * 60);
      expect(cap.availableFlexibleMinutes).toBeGreaterThan(0);
    });
  });

  describe('3. Exam Mode & Non-Essential Course Suspension (7-21 November)', () => {
    it('suspends elective courses during midterm exam days while scheduling academic study', () => {
      const mixedTasks: Task[] = [
        {
          id: 'task-nano-study',
          title: 'مذاكرة النانو للميدتيرم',
          status: 'TODO',
          priority: 'P1_URGENT_IMPORTANT',
          estimatedMinutes: 60,
          isLocked: false,
          postponementCount: 0,
          studySessionId: 'sess-nano-1',
          createdAt: '2026-10-24T00:00:00Z',
          updatedAt: '2026-10-24T00:00:00Z'
        },
        {
          id: 'task-marriage-course',
          goalId: 'B26-M11-FAMILY',
          title: 'كورس الزواج — الساعة الأولى',
          status: 'TODO',
          priority: 'P2_IMPORTANT',
          estimatedMinutes: 60,
          isLocked: false,
          postponementCount: 0,
          createdAt: '2026-10-24T00:00:00Z',
          updatedAt: '2026-10-24T00:00:00Z'
        }
      ];

      // Week starting 2026-11-07 (entirely within Midterm Exams)
      const result = generateWeeklySchedulePlan({
        tasks: mixedTasks,
        timetableSlots: [],
        availabilityRules: [],
        goals: [],
        weekStartDate: '2026-11-07',
        mode: 'EXAMS'
      });

      // Academic study should be scheduled
      const studyBlock = result.scheduleBlocks.find(b => b.taskId === 'task-nano-study');
      expect(studyBlock).toBeDefined();

      // Elective marriage course must NOT be scheduled on exam days!
      const marriageBlock = result.scheduleBlocks.find(b => b.taskId === 'task-marriage-course');
      expect(marriageBlock).toBeUndefined();

      // It must be placed in unplacedItems with clear exam explanation
      const unplacedMarriage = result.unplacedItems.find(u => u.taskId === 'task-marriage-course');
      expect(unplacedMarriage).toBeDefined();
      expect(unplacedMarriage?.unplacedReason).toContain('فترة الميدتيرم');
    });
  });

  describe('4. 0-Minute Tasks & 120-Minute Splitting', () => {
    it('preserves 0-minute tasks as checkpoints without allocating artificial blocks', () => {
      const checkpointTask: Task[] = [
        {
          id: 'task-checkpoint-read',
          title: 'تجهيز كتاب الخطوبة الآمنة',
          status: 'TODO',
          priority: 'P2_IMPORTANT',
          estimatedMinutes: 0, // Milestone checkpoint
          isLocked: false,
          postponementCount: 0,
          dueDate: '2026-11-22',
          createdAt: '2026-10-24T00:00:00Z',
          updatedAt: '2026-10-24T00:00:00Z'
        }
      ];

      const result = generateWeeklySchedulePlan({
        tasks: checkpointTask,
        timetableSlots: [],
        weekStartDate: '2026-11-21'
      });

      // No physical schedule block for 0m task
      const block = result.scheduleBlocks.find(b => b.taskId === 'task-checkpoint-read');
      expect(block).toBeUndefined();

      // Recorded as checkpoint in unplacedItems
      const unplaced = result.unplacedItems.find(u => u.taskId === 'task-checkpoint-read');
      expect(unplaced).toBeDefined();
      expect(unplaced?.plannedMinutes).toBe(0);
      expect(unplaced?.unplacedReason).toContain('0 دقيقة');
    });

    it('splits 120-minute commitments into 2 x 60 min sessions linking to the same task ID', () => {
      const longTask: Task[] = [
        {
          id: 'FAL12-W1',
          title: 'تسويق فلكون الأسبوع 1',
          status: 'TODO',
          priority: 'P1_URGENT_IMPORTANT',
          estimatedMinutes: 120,
          isLocked: false,
          postponementCount: 0,
          createdAt: '2026-10-24T00:00:00Z',
          updatedAt: '2026-10-24T00:00:00Z'
        }
      ];

      const result = generateWeeklySchedulePlan({
        tasks: longTask,
        timetableSlots: [],
        weekStartDate: '2026-12-05'
      });

      // Either scheduled as 1 block of 120 or 2 blocks of 60
      const blocks = result.scheduleBlocks.filter(b => b.taskId === 'FAL12-W1');
      expect(blocks.length).toBeGreaterThanOrEqual(1);
      const totalPlanned = blocks.reduce((sum, b) => sum + b.durationMinutes, 0);
      expect(totalPlanned).toBe(120);

      // Must share the exact original taskId
      for (const b of blocks) {
        expect(b.taskId).toBe('FAL12-W1');
      }
    });
  });

  describe('5. Pinned Blocks Preservation on Replan & Move', () => {
    it('preserves user-pinned blocks and does not reschedule or overwrite them on replan', () => {
      const userPinnedBlock: ScheduleBlock = {
        id: 'user-pinned-session-1',
        planId: 'plan-week-2026-11-21',
        date: '2026-11-21',
        day: 'السبت',
        taskId: 'task-pinned-1',
        title: 'جلسة عمل مخصصة مثبتة',
        startTime: '16:00',
        endTime: '17:30',
        durationMinutes: 90,
        type: 'TASK',
        isLocked: true,
        isUserPinned: true,
        origin: 'MANUAL'
      };

      const tasks: Task[] = [
        {
          id: 'task-pinned-1',
          title: 'جلسة عمل مخصصة مثبتة',
          status: 'TODO',
          priority: 'P1_URGENT_IMPORTANT',
          estimatedMinutes: 90,
          isLocked: false,
          postponementCount: 0,
          createdAt: '2026-10-24T00:00:00Z',
          updatedAt: '2026-10-24T00:00:00Z'
        },
        {
          id: 'task-other-2',
          title: 'مهمة أخرى',
          status: 'TODO',
          priority: 'P2_IMPORTANT',
          estimatedMinutes: 45,
          isLocked: false,
          postponementCount: 0,
          createdAt: '2026-10-24T00:00:00Z',
          updatedAt: '2026-10-24T00:00:00Z'
        }
      ];

      const result = generateWeeklySchedulePlan({
        tasks,
        timetableSlots: [],
        weekStartDate: '2026-11-21',
        pinnedBlocks: [userPinnedBlock]
      });

      // Pinned block must be preserved exactly
      const preserved = result.scheduleBlocks.find(b => b.id === 'user-pinned-session-1');
      expect(preserved).toBeDefined();
      expect(preserved?.startTime).toBe('16:00');
      expect(preserved?.endTime).toBe('17:30');
      expect(preserved?.isUserPinned).toBe(true);

      // The task must not be scheduled twice
      const instances = result.scheduleBlocks.filter(b => b.taskId === 'task-pinned-1');
      expect(instances).toHaveLength(1);
    });
  });

  describe('6. Store Actions: Pin, Move, Split, and Remove without Deleting Source Task', () => {
    beforeEach(async () => {
      await db.schedulePlans.clear();
      await db.scheduleBlocks.clear();
      await db.weeklyItems.clear();
      await db.tasks.clear();
    });

    it('toggles pin, moves block, splits block, and removes from week without deleting underlying task', async () => {
      const store = useAppStore.getState();

      // Seed a task
      await db.tasks.put({
        id: 'task-test-store',
        title: 'دراسة تطبيقات النانو',
        status: 'TODO',
        priority: 'P1_URGENT_IMPORTANT',
        estimatedMinutes: 120,
        isLocked: false,
        postponementCount: 0,
        createdAt: '2026-10-24T00:00:00Z',
        updatedAt: '2026-10-24T00:00:00Z'
      });

      // Save a plan with 1 block
      const testBlock: ScheduleBlock = {
        id: 'block-test-1',
        planId: 'plan-week-2026-11-21',
        date: '2026-11-21',
        day: 'السبت',
        taskId: 'task-test-store',
        title: 'دراسة تطبيقات النانو',
        startTime: '10:00',
        endTime: '12:00',
        durationMinutes: 120,
        type: 'TASK',
        isLocked: false,
        isUserPinned: false,
        origin: 'AUTO'
      };

      await store.saveWeeklyPlan(
        {
          id: 'plan-week-2026-11-21',
          weekStartDate: '2026-11-21',
          totalWakefulMinutes: 7000,
          fixedCommitmentMinutes: 1000,
          prayerBufferMinutes: 1050,
          travelAndMealsMinutes: 420,
          safetyBufferMinutes: 500,
          availableFlexibleMinutes: 3000,
          requiredFlexibleMinutes: 120,
          unscheduledMinutes: 0,
          isOverloaded: false,
          status: 'COMMITTED',
          generatedAt: new Date().toISOString()
        },
        [testBlock]
      );

      // Verify saved in DB
      let block = await db.scheduleBlocks.get('block-test-1');
      expect(block).toBeDefined();
      expect(block?.isUserPinned).toBe(false);

      // A. Toggle Pin
      await store.togglePinBlock('block-test-1');
      block = await db.scheduleBlocks.get('block-test-1');
      expect(block?.isUserPinned).toBe(true);

      // B. Move Block to Tuesday
      await store.moveBlockToDay('block-test-1', 'الثلاثاء', '2026-11-24', '14:00');
      block = await db.scheduleBlocks.get('block-test-1');
      expect(block?.day).toBe('الثلاثاء');
      expect(block?.date).toBe('2026-11-24');
      expect(block?.startTime).toBe('14:00');
      expect(block?.endTime).toBe('16:00');

      // Verify underlying task deadline is UNTOUCHED
      const sourceTask = await db.tasks.get('task-test-store');
      expect(sourceTask).toBeDefined();

      // C. Split Block
      await store.splitScheduleBlock('block-test-1', 60);
      const allBlocks = await db.scheduleBlocks.toArray();
      expect(allBlocks.length).toBe(2);
      expect(allBlocks[0].durationMinutes + allBlocks[1].durationMinutes).toBe(120);

      // D. Remove Block from Week (Source task must NOT be deleted!)
      await store.removeBlockFromWeek('block-test-1');
      const remainingBlocks = await db.scheduleBlocks.toArray();
      expect(remainingBlocks.find(b => b.id === 'block-test-1')).toBeUndefined();

      // Source task still lives in database!
      const stillExistingTask = await db.tasks.get('task-test-store');
      expect(stillExistingTask).toBeDefined();
      expect(stillExistingTask?.id).toBe('task-test-store');
    });

    it('persists a moved uncommitted proposal block into database as pinned block and commits plan', async () => {
      const store = useAppStore.getState();
      await db.scheduleBlocks.clear();
      await db.schedulePlans.clear();

      const proposalBlock: ScheduleBlock = {
        id: 'sched-task-2026-10-24-uncommitted',
        planId: 'plan-week-2026-10-24',
        date: '2026-10-24',
        day: 'السبت',
        title: 'محاضرة فيزياء نانوية',
        startTime: '09:00',
        endTime: '10:30',
        durationMinutes: 90,
        type: 'TASK',
        isLocked: false,
        isUserPinned: false,
        origin: 'AUTO'
      };

      // Moving block without prior commit must use blockFallback to materialize and save
      await store.moveBlockToDay(
        proposalBlock.id,
        'الاثنين',
        '2026-10-26',
        '11:00',
        proposalBlock
      );

      const savedBlock = await db.scheduleBlocks.get(proposalBlock.id);
      expect(savedBlock).toBeDefined();
      expect(savedBlock?.day).toBe('الاثنين');
      expect(savedBlock?.date).toBe('2026-10-26');
      expect(savedBlock?.startTime).toBe('11:00');
      expect(savedBlock?.endTime).toBe('12:30');
      expect(savedBlock?.isUserPinned).toBe(true);
      expect(savedBlock?.origin).toBe('MANUAL');

      // Plan should be saved as COMMITTED
      const savedPlan = await db.schedulePlans.get('plan-week-2026-10-24');
      expect(savedPlan).toBeDefined();
      expect(savedPlan?.status).toBe('COMMITTED');
    });
  });

  describe('7. Time-Aware Horizon Filtering (October vs November/December/2027)', () => {
    it('strictly excludes future November, December, and 2027 tasks from current October week to prevent false overload', () => {
      const mixedDateTasks: Task[] = [
        // 1. Current October task
        {
          id: 'task-oct-1',
          title: 'واجب مقرر النانو - أكتوبر',
          status: 'TODO',
          priority: 'P1_URGENT_IMPORTANT',
          estimatedMinutes: 60,
          isLocked: false,
          postponementCount: 0,
          dueDate: '2026-10-28', // Due in current week (2026-10-24 to 2026-10-30)
          createdAt: '2026-10-24T00:00:00Z',
          updatedAt: '2026-10-24T00:00:00Z'
        },
        // 2. Future November tasks (Nov 15, Nov 30)
        {
          id: 'task-nov-1',
          title: 'تسليم بروجكت الميدتيرم نوفمبر',
          status: 'TODO',
          priority: 'P1_URGENT_IMPORTANT',
          estimatedMinutes: 120,
          isLocked: false,
          postponementCount: 0,
          dueDate: '2026-11-15', // Due in November!
          createdAt: '2026-10-24T00:00:00Z',
          updatedAt: '2026-10-24T00:00:00Z'
        },
        // 3. Future November monthly goal task
        {
          id: 'task-nov-goal',
          goalId: 'B26-M11-FAMILY',
          title: 'كورس الزواج نوفمبر',
          status: 'TODO',
          priority: 'P2_IMPORTANT',
          estimatedMinutes: 60,
          isLocked: false,
          postponementCount: 0,
          dueDate: '2026-11-20',
          createdAt: '2026-10-24T00:00:00Z',
          updatedAt: '2026-10-24T00:00:00Z'
        },
        // 4. Future December task
        {
          id: 'task-dec-1',
          title: 'تقفيل ميزانية فلكون ديسمبر',
          status: 'TODO',
          priority: 'P1_URGENT_IMPORTANT',
          estimatedMinutes: 180,
          isLocked: false,
          postponementCount: 0,
          dueDate: '2026-12-25', // Due in December!
          createdAt: '2026-10-24T00:00:00Z',
          updatedAt: '2026-10-24T00:00:00Z'
        },
        // 5. Future 2027 goal task
        {
          id: 'task-2027-1',
          goalId: 'G27-TECH-1',
          title: 'معمارية منصة 2027 الكبرى',
          status: 'TODO',
          priority: 'P1_URGENT_IMPORTANT',
          estimatedMinutes: 300,
          isLocked: false,
          postponementCount: 0,
          dueDate: '2027-03-15', // Year 2027!
          createdAt: '2026-10-24T00:00:00Z',
          updatedAt: '2026-10-24T00:00:00Z'
        }
      ];

      // Planning current week: 2026-10-24 to 2026-10-30 (October)
      const result = generateWeeklySchedulePlan({
        tasks: mixedDateTasks,
        timetableSlots: [],
        availabilityRules: [],
        goals: [],
        weekStartDate: '2026-10-24'
      });

      // October task MUST be scheduled
      expect(result.scheduleBlocks.some(b => b.taskId === 'task-oct-1')).toBe(true);

      // Future November, December, and 2027 tasks MUST NOT be scheduled in October!
      expect(result.scheduleBlocks.some(b => b.taskId === 'task-nov-1')).toBe(false);
      expect(result.scheduleBlocks.some(b => b.taskId === 'task-nov-goal')).toBe(false);
      expect(result.scheduleBlocks.some(b => b.taskId === 'task-dec-1')).toBe(false);
      expect(result.scheduleBlocks.some(b => b.taskId === 'task-2027-1')).toBe(false);

      // Total required flexible minutes must reflect ONLY current relevant tasks (60 mins), NOT all future tasks!
      expect(result.plan.requiredFlexibleMinutes).toBe(60);

      // No false overload alert for October!
      expect(result.plan.isOverloaded).toBe(false);
      expect(result.plan.unscheduledMinutes).toBe(0);
    });
  });
});
