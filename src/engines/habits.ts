import type { Habit, HabitLog } from '../types';

export interface HabitEvaluationResult {
  updatedStreak: number;
  updatedConsecutiveMisses: number;
  streakReset: boolean;
  isTodayCompleted: boolean;
  isTodayRestDay: boolean;
  statusMessage: string;
}

/**
 * Evaluates habit streak according to the approved 3-consecutive-miss rule:
 * - Completed today: streak + 1, consecutiveMisses = 0
 * - Today is rest day: no penalty, streak maintained
 * - Missed an eligible day: consecutiveMisses + 1
 * - Only resets streak to 0 if consecutiveMisses reaches 3!
 */
export function evaluateHabitStreak(
  habit: Habit,
  todayLog?: HabitLog,
  currentDate: Date = new Date()
): HabitEvaluationResult {
  const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 5 = Friday
  const isTodayRestDay = habit.restDays.includes(dayOfWeek);
  const isTodayCompleted = todayLog?.status === 'COMPLETED';

  let updatedStreak = habit.streakCount;
  let updatedConsecutiveMisses = habit.consecutiveMisses;
  let streakReset = false;
  let statusMessage = '';

  if (isTodayCompleted) {
    // If not already counted today
    const todayStr = currentDate.toISOString().split('T')[0];
    if (habit.lastCompletedDate !== todayStr) {
      updatedStreak += 1;
    }
    updatedConsecutiveMisses = 0;
    statusMessage = 'تم الإنجاز اليوم، وعاش على الاستمرار!';
  } else if (isTodayRestDay) {
    statusMessage = 'اليوم راحة معتمدة مسبقاً، وسلسلتك محمية.';
  } else {
    // Eligible day missed or pending
    if (todayLog?.status === 'MISSED') {
      updatedConsecutiveMisses += 1;
      if (updatedConsecutiveMisses >= 3) {
        updatedStreak = 0;
        streakReset = true;
        statusMessage = 'تم إعادة ضبط السلسلة بعد 3 أيام متتالية من الفوات. فرصة جديدة للبدء!';
      } else {
        statusMessage = `فاتك ${updatedConsecutiveMisses} من 3 أيام سماح؛ بادر بالإنجاز لإنقاذ السلسلة!`;
      }
    } else {
      statusMessage = 'بانتظار إنجازك اليوم لتغذية السلسلة.';
    }
  }

  return {
    updatedStreak,
    updatedConsecutiveMisses,
    streakReset,
    isTodayCompleted,
    isTodayRestDay,
    statusMessage
  };
}
