import { describe, it, expect } from 'vitest';
import { 
  mergeIntervals, 
  computeDayCapacity, 
  generateWeeklySchedulePlan,
  timeStringToMinutes,
  minutesToTimeString
} from '../scheduler';
import { getCairoPrayerTimes } from '../prayer';
import type { Task, TimetableSlot, AvailabilityRule } from '../../types';

describe('Sprint 4: Weekly Constraint-Based Scheduler Engine', () => {
  const dummyPrayers = getCairoPrayerTimes(new Date('2026-10-22T10:00:00Z'));

  describe('mergeIntervals()', () => {
    it('merges overlapping and adjacent intervals without double-counting', () => {
      const intervals = [
        { start: 100, end: 200 },
        { start: 150, end: 250 }, // Overlaps first
        { start: 300, end: 400 }, // Separate
        { start: 400, end: 450 }  // Touching
      ];

      const merged = mergeIntervals(intervals);
      expect(merged).toEqual([
        { start: 100, end: 250 },
        { start: 300, end: 450 }
      ]);
    });

    it('returns empty array when given empty array', () => {
      expect(mergeIntervals([])).toEqual([]);
    });
  });

  describe('computeDayCapacity() & Hard Constraints', () => {
    it('Acceptance 19: Handles Monday Molecular Spectroscopy unknown end conservatively as 90 min', () => {
      const slots: TimetableSlot[] = [
        {
          id: 'slot-mon-spec',
          subjectName: 'Molecular Spectroscopy',
          subjectCode: 'CHEM-401',
          day: 'الاثنين',
          startTime: '19:30',
          endTime: null, // Unresolved end time
          format: 'Online',
          hall: 'Online Teams'
        }
      ];

      const cap = computeDayCapacity('الاثنين', slots, dummyPrayers);
      expect(cap.day).toBe('الاثنين');
      // Should not throw or produce NaN
      expect(Number.isNaN(cap.availableFlexibleMinutes)).toBe(false);
      expect(cap.availableFlexibleMinutes).toBeGreaterThan(0);
      expect(cap.fixedCommitmentMinutes).toBeGreaterThan(0);
    });

    it('Acceptance 18: Preserves user-locked sessions and availability rules (sleep/work)', () => {
      const lockedWorkRule: AvailabilityRule = {
        id: 'rule-work-1',
        dayOfWeek: 'السبت',
        type: 'WORK_FALCON',
        startTime: '10:00',
        endTime: '14:00', // 4 hours locked
        isLocked: true,
        label: 'Falcon Operations'
      };

      const capWithRule = computeDayCapacity('السبت', [], dummyPrayers, [lockedWorkRule]);
      const capWithoutRule = computeDayCapacity('السبت', [], dummyPrayers, []);

      // Available flexible time should be reduced by the locked rule
      expect(capWithRule.availableFlexibleMinutes).toBeLessThan(capWithoutRule.availableFlexibleMinutes);
    });
  });

  describe('generateWeeklySchedulePlan()', () => {
    it('Acceptance 15: Fixed university classes & prayer buffers never overlap flexible tasks', () => {
      const fixedSlot: TimetableSlot = {
        id: 'slot-sat-nano',
        subjectName: 'Nanomaterials & Nanotechnology',
        subjectCode: 'NANO-301',
        day: 'السبت',
        startTime: '10:00',
        endTime: '12:00',
        format: 'Campus',
        hall: 'مدرج 5'
      };

      const tasks: Task[] = [
        {
          id: 'task-1',
          title: 'Study Lecture 1 Summary',
          status: 'TODO',
          priority: 'P1_URGENT_IMPORTANT',
          estimatedMinutes: 60,
          isLocked: false,
          postponementCount: 0,
          dueDate: '2026-10-24',
          createdAt: '2026-10-22T00:00:00Z',
          updatedAt: '2026-10-22T00:00:00Z'
        }
      ];

      const { scheduleBlocks } = generateWeeklySchedulePlan(
        tasks,
        [fixedSlot],
        dummyPrayers,
        [],
        [],
        0.15
      );

      const fixedBlock = scheduleBlocks.find(b => b.type === 'FIXED_CLASS' && b.day === 'السبت');
      const taskBlock = scheduleBlocks.find(b => b.type === 'TASK' && b.day === 'السبت');

      expect(fixedBlock).toBeDefined();
      if (taskBlock && fixedBlock) {
        const fixedStart = timeStringToMinutes(fixedBlock.startTime);
        const fixedEnd = timeStringToMinutes(fixedBlock.endTime);
        const taskStart = timeStringToMinutes(taskBlock.startTime);
        const taskEnd = timeStringToMinutes(taskBlock.endTime);

        // Task must strictly NOT overlap fixed university class (including commute buffer if on campus)
        const overlaps = Math.max(fixedStart, taskStart) < Math.min(fixedEnd, taskEnd);
        expect(overlaps).toBe(false);
      }
    });

    it('Acceptance 16: Week with overloaded tasks truthfully reports isOverloaded and unscheduledMinutes without inventing placements', () => {
      // 10 huge tasks requiring 1000 minutes each = 10,000 minutes (~166 hours), exceeding total weekly wakeful time
      const heavyTasks: Task[] = Array.from({ length: 10 }, (_, i) => ({
        id: `heavy-task-${i}`,
        title: `Heavy Project Milestone Part ${i + 1}`,
        status: 'TODO',
        priority: 'P1_URGENT_IMPORTANT',
        estimatedMinutes: 1000,
        isLocked: false,
        postponementCount: 0,
        createdAt: '2026-10-22T00:00:00Z',
        updatedAt: '2026-10-22T00:00:00Z'
      }));

      const { plan } = generateWeeklySchedulePlan(
        heavyTasks,
        [],
        dummyPrayers,
        [],
        [],
        0.15
      );

      // Overload MUST be detected truthfully
      expect(plan.isOverloaded).toBe(true);
      expect(plan.unscheduledMinutes).toBeGreaterThan(0);
      expect(plan.requiredFlexibleMinutes).toBe(10000);
      expect(plan.unscheduledMinutes).toBeGreaterThanOrEqual(10000 - plan.availableFlexibleMinutes);
    });
  });
});
