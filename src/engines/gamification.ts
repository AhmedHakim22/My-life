import type { XPTransaction } from '../types';

export interface ScientificRank {
  level: number;
  titleArabic: string;
  titleEnglish: string;
  minXP: number;
  requiresTimeLock: boolean;
  minCalendarDays?: number;
  minActiveDays?: number;
  badgeIcon: string;
}

export const SCIENTIFIC_RANKS: ScientificRank[] = [
  {
    level: 1,
    titleArabic: 'طالب عِلْم',
    titleEnglish: 'Knowledge Seeker',
    minXP: 0,
    requiresTimeLock: false,
    badgeIcon: 'GraduationCap'
  },
  {
    level: 2,
    titleArabic: 'باحث مساعد',
    titleEnglish: 'Junior Researcher',
    minXP: 1000,
    requiresTimeLock: false,
    badgeIcon: 'Search'
  },
  {
    level: 3,
    titleArabic: 'باحث مُشارك',
    titleEnglish: 'Associate Researcher',
    minXP: 3500,
    requiresTimeLock: false,
    badgeIcon: 'FlaskConical'
  },
  {
    level: 4,
    titleArabic: 'مُحاضِر',
    titleEnglish: 'Lecturer',
    minXP: 8000,
    requiresTimeLock: false,
    badgeIcon: 'Presentation'
  },
  {
    level: 5,
    titleArabic: 'أستاذ مساعد',
    titleEnglish: 'Assistant Professor',
    minXP: 18000,
    requiresTimeLock: false,
    badgeIcon: 'Award'
  },
  {
    level: 6,
    titleArabic: 'عَالِم وباحث أول',
    titleEnglish: 'Senior Scientist',
    minXP: 35000,
    requiresTimeLock: false,
    badgeIcon: 'Sparkles'
  },
  {
    level: 7,
    titleArabic: 'أستاذ علوم',
    titleEnglish: 'Professor of Science',
    minXP: 60000,
    requiresTimeLock: true,
    minCalendarDays: 180, // Exactly 6 months
    minActiveDays: 120,
    badgeIcon: 'Crown'
  }
];

export interface UserRankProgress {
  totalXP: number;
  currentRank: ScientificRank;
  nextRank?: ScientificRank;
  progressToNextPercentage: number;
  calendarDaysSinceStart: number;
  distinctActiveDays: number;
  isProfessorEligible: boolean;
  professorBlockerReason?: string;
}

export function calculateUserRank(
  transactions: XPTransaction[],
  userStartDate: Date = new Date()
): UserRankProgress {
  const totalXP = transactions.reduce((acc, t) => acc + t.amount, 0);

  // Compute distinct active days
  const activeDaysSet = new Set<string>();
  let earliestDate = userStartDate.getTime();

  for (const t of transactions) {
    const d = new Date(t.createdAt);
    activeDaysSet.add(d.toISOString().split('T')[0]);
    if (d.getTime() < earliestDate) {
      earliestDate = d.getTime();
    }
  }

  const nowMs = Date.now();
  const calendarDaysSinceStart = Math.max(0, Math.floor((nowMs - earliestDate) / (1000 * 60 * 60 * 24)));
  const distinctActiveDays = activeDaysSet.size;

  // Find highest qualifying rank
  let currentRank = SCIENTIFIC_RANKS[0];

  for (const rank of SCIENTIFIC_RANKS) {
    if (totalXP >= rank.minXP) {
      if (rank.requiresTimeLock) {
        const has6Months = calendarDaysSinceStart >= (rank.minCalendarDays || 180);
        const hasActiveDays = distinctActiveDays >= (rank.minActiveDays || 120);
        if (has6Months && hasActiveDays) {
          currentRank = rank;
        }
      } else {
        currentRank = rank;
      }
    }
  }

  const currentIndex = SCIENTIFIC_RANKS.findIndex(r => r.level === currentRank.level);
  const nextRank = SCIENTIFIC_RANKS[currentIndex + 1];

  let progressToNextPercentage = 100;
  if (nextRank) {
    const range = nextRank.minXP - currentRank.minXP;
    const currentInRange = totalXP - currentRank.minXP;
    progressToNextPercentage = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));
  }

  // Check professor of science eligibility
  const profRank = SCIENTIFIC_RANKS[6];
  const hasXP = totalXP >= profRank.minXP;
  const hasTime = calendarDaysSinceStart >= 180;
  const hasDays = distinctActiveDays >= 120;
  const isProfessorEligible = hasXP && hasTime && hasDays;

  let professorBlockerReason: string | undefined;
  if (!isProfessorEligible) {
    if (!hasTime) {
      professorBlockerReason = `باقي ${180 - calendarDaysSinceStart} يوماً لإكمال شرط الـ 6 أشهر الزمني`;
    } else if (!hasDays) {
      professorBlockerReason = `باقي ${120 - distinctActiveDays} يوماً نشطاً مسجلاً`;
    } else if (!hasXP) {
      professorBlockerReason = `باقي ${profRank.minXP - totalXP} نقطة XP للوصول للنصاب`;
    }
  }

  return {
    totalXP,
    currentRank,
    nextRank,
    progressToNextPercentage,
    calendarDaysSinceStart,
    distinctActiveDays,
    isProfessorEligible,
    professorBlockerReason
  };
}

/**
 * Creates a unique deterministic idempotency key for transactions to prevent duplicates
 */
export function generateXPIdempotencyKey(
  category: string,
  entityId: string,
  date: string = new Date().toISOString().split('T')[0]
): string {
  return `${category}:${entityId}:${date}`.toUpperCase();
}
