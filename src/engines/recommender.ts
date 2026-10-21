import type { Task, UniversitySubject, StudySession, Goal } from '../types';
import type { DayPrayersResult } from './prayer';
import { getCairoDateString } from '../lib/dateUtils';

export interface NextActionRecommendation {
  task: Task;
  score: number;
  rationaleArabic: string;
  category: 'STUDY' | 'BUSINESS' | 'HABIT' | 'GENERAL';
  freeWindowFit: boolean;
  isPostponementIntervention: boolean;
  interventionProposal?: string;
  alternativeTasks: Task[];
}

export function recommendBestNextAction(
  tasks: Task[],
  prayers: DayPrayersResult,
  subjects: UniversitySubject[] = [],
  sessions: StudySession[] = [],
  currentDate: Date = new Date(),
  goals: Goal[] = []
): NextActionRecommendation | null {
  const pendingTasks = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');
  if (pendingTasks.length === 0) return null;

  const freeWindow = prayers.freeWindowMinutes; // minutes to next prayer
  const todayStr = getCairoDateString(currentDate);

  // Map subjects for easy exam date lookup
  const subjectMap = new Map<string, UniversitySubject>();
  for (const s of subjects) {
    subjectMap.set(s.id, s);
  }

  // Map sessions for study lookups
  const sessionMap = new Map<string, StudySession>();
  for (const sess of sessions) {
    sessionMap.set(sess.id, sess);
  }

  // Map goals for direct lookup
  const goalMap = new Map<string, Goal>();
  for (const g of goals) {
    goalMap.set(g.id, g);
  }

  const scoredTasks = pendingTasks.map(task => {
    let score = 50; // base score
    let rationale = '';
    let category: 'STUDY' | 'BUSINESS' | 'HABIT' | 'GENERAL' = 'GENERAL';

    // 1. Goal impact weighting (High strategic alignment)
    if (task.goalId) {
      const linkedGoal = goalMap.get(task.goalId);
      if (linkedGoal && !linkedGoal.isArchived) {
        score += 30;
        rationale = `تدفع مباشرة نحو هدفك: "${linkedGoal.title}"`;
      }
    }

    // 2. Priority weighting
    if (task.priority === 'P1_URGENT_IMPORTANT') {
      score += 35;
      rationale = rationale ? `${rationale} (أولوية قصوى P1)` : 'مهمة ذات أولوية قصوى وأثر مباشر';
    } else if (task.priority === 'P2_IMPORTANT') {
      score += 20;
      if (!rationale) rationale = 'مهمة استراتيجية هامة P2';
    }

    // 3. Proximity to Exam or Hard Deadline
    if (task.studySessionId) {
      category = 'STUDY';
      const session = sessionMap.get(task.studySessionId);
      if (session) {
        const subject = subjectMap.get(session.subjectId);
        if (subject?.examDate) {
          const examMs = new Date(subject.examDate).getTime();
          const daysToExam = Math.max(0, Math.round((examMs - currentDate.getTime()) / (1000 * 60 * 60 * 24)));
          if (daysToExam <= 7) {
            score += 40;
            rationale = `امتحان ${subject.name} بعد ${daysToExam} أيام فقط!`;
          } else if (daysToExam <= 21) {
            score += 25;
            rationale = `مادة أساسية (${subject.name}) وامتحانها يقترب`;
          }
        }
      }
    } else if (task.title.includes('فالكون') || task.title.includes('Falcon')) {
      category = 'BUSINESS';
      score += 15;
      if (!rationale) rationale = 'مسؤولية ريادية لتطوير فالكون';
    }

    // 4. Due Date proximity
    if (task.dueDate) {
      if (task.dueDate <= todayStr) {
        score += 25;
        if (!rationale) rationale = 'مستحقة اليوم';
      }
    }

    // 5. Prayer Time Window Fit
    const fitsTimeWindow = task.estimatedMinutes <= freeWindow;
    if (fitsTimeWindow) {
      score += 15;
      rationale += ` (وقتها ${task.estimatedMinutes} دقيقة يكفي قبل ${prayers.nextPrayer.nameArabic})`;
    } else {
      score -= 10;
    }

    // 6. Postponement Check (3-miss threshold)
    const isPostponementIntervention = task.postponementCount >= 3;
    let interventionProposal: string | undefined;

    if (isPostponementIntervention) {
      score += 10; // keep it visible for resolution
      interventionProposal = `المهمة دي اتأجلت ${task.postponementCount} مرات.. نقترح تقسيمها لخطوتين أصغر أو تقليل نطاقها.`;
    }

    return {
      task,
      score,
      rationaleArabic: rationale || 'خطوة جيدة لتثبيت الاستمرارية اليوم',
      category,
      freeWindowFit: fitsTimeWindow,
      isPostponementIntervention,
      interventionProposal
    };
  });

  // Sort descending by score
  scoredTasks.sort((a, b) => b.score - a.score);

  const top = scoredTasks[0];
  const alternatives = scoredTasks.slice(1, 4).map(s => s.task);

  return {
    task: top.task,
    score: top.score,
    rationaleArabic: top.rationaleArabic,
    category: top.category,
    freeWindowFit: top.freeWindowFit,
    isPostponementIntervention: top.isPostponementIntervention,
    interventionProposal: top.interventionProposal,
    alternativeTasks: alternatives
  };
}
