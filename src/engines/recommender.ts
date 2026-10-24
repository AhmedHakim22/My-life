import type { Task, UniversitySubject, StudySession, Goal, AcademicQuiz, AcademicAssignment } from '../types';
import type { DayPrayersResult } from './prayer';
import { getCairoDateString } from '../lib/dateUtils';

/**
 * Calculates calendar day difference between target date 'YYYY-MM-DD' and currentDate.
 * 0 = Today, 1 = Tomorrow, 2 = Day after tomorrow, negative = past.
 */
export function getCalendarDaysDiff(targetDateStr: string, currentDate: Date = new Date()): number {
  if (!targetDateStr) return 999;
  const parts = targetDateStr.split('-').map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return 999;
  const targetMidnight = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
  const currentMidnight = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0);
  const diffMs = targetMidnight.getTime() - currentMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

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
  goals: Goal[] = [],
  quizzes: AcademicQuiz[] = [],
  assignments: AcademicAssignment[] = []
): NextActionRecommendation | null {
  const pendingTasks = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');
  const freeWindow = prayers.freeWindowMinutes; // minutes to next prayer
  const todayStr = getCairoDateString(currentDate);
  const nowIso = currentDate.toISOString();

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

  interface ScoredCandidate {
    task: Task;
    score: number;
    rationaleArabic: string;
    category: 'STUDY' | 'BUSINESS' | 'HABIT' | 'GENERAL';
    freeWindowFit: boolean;
    isPostponementIntervention: boolean;
    interventionProposal?: string;
  }

  const scoredCandidates: ScoredCandidate[] = [];

  // -------------------------------------------------------------------------
  // 1. Score explicitly recorded pending tasks
  // -------------------------------------------------------------------------
  for (const task of pendingTasks) {
    let score = 50; // base score
    let rationale = '';
    let category: 'STUDY' | 'BUSINESS' | 'HABIT' | 'GENERAL' = 'GENERAL';

    // A. Goal impact weighting (High strategic alignment)
    if (task.goalId) {
      const linkedGoal = goalMap.get(task.goalId);
      if (linkedGoal && !linkedGoal.isArchived) {
        score += 30;
        rationale = `تدفع مباشرة نحو هدفك: "${linkedGoal.title}"`;
      }
    }

    // B. Priority weighting
    if (task.priority === 'P1_URGENT_IMPORTANT') {
      score += 35;
      rationale = rationale ? `${rationale} (أولوية قصوى P1)` : 'مهمة ذات أولوية قصوى وأثر مباشر';
    } else if (task.priority === 'P2_IMPORTANT') {
      score += 20;
      if (!rationale) rationale = 'مهمة استراتيجية هامة P2';
    }

    // C. Proximity to Exam or Hard Deadline
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
    } else if (task.title.includes('عمل') || task.title.includes('العمل') || task.title.includes('فالكون') || task.title.includes('Falcon')) {
      category = 'BUSINESS';
      score += 15;
      if (!rationale) rationale = 'مسؤولية مهنية لتطوير العمل ومشاريعك';
    }

    // D. Due Date proximity
    if (task.dueDate) {
      if (task.dueDate <= todayStr) {
        score += 25;
        if (!rationale) rationale = 'مستحقة اليوم';
      }
    }

    // E. Prayer Time Window Fit
    const fitsTimeWindow = task.estimatedMinutes <= freeWindow;
    if (fitsTimeWindow) {
      score += 15;
      rationale += ` (وقتها ${task.estimatedMinutes} دقيقة يكفي قبل ${prayers.nextPrayer.nameArabic})`;
    } else {
      score -= 10;
    }

    // F. Postponement Check (3-miss threshold)
    const isPostponementIntervention = task.postponementCount >= 3;
    let interventionProposal: string | undefined;

    if (isPostponementIntervention) {
      score += 10;
      interventionProposal = `المهمة دي اتأجلت ${task.postponementCount} مرات.. نقترح تقسيمها لخطوتين أصغر أو تقليل نطاقها.`;
    }

    scoredCandidates.push({
      task,
      score,
      rationaleArabic: rationale || 'خطوة جيدة لتثبيت الاستمرارية اليوم',
      category,
      freeWindowFit: fitsTimeWindow,
      isPostponementIntervention,
      interventionProposal
    });
  }

  // -------------------------------------------------------------------------
  // 2. Synthesize candidates from Academic & Study Reality
  // (Unreviewed/Unstudied Lectures, Approaching Exams, Quizzes, Assignments)
  // -------------------------------------------------------------------------
  const coveredSessionIds = new Set(
    pendingTasks.filter(t => Boolean(t.studySessionId)).map(t => t.studySessionId!)
  );

  // A. Unreviewed / Unstudied Lectures
  for (const session of sessions) {
    if (coveredSessionIds.has(session.id)) continue;

    // Check if session needs review, initial study, or problem solving
    const isUnreviewed = session.studyDone && !session.reviseDone;
    const isMaterialReadyUnstudied = !session.studyDone && Boolean(session.materialReady);
    const isUnstudied = !session.studyDone;
    const isUnsolved = session.reviseDone && !session.solveDone;

    if (!isUnreviewed && !isMaterialReadyUnstudied && !isUnstudied && !isUnsolved) {
      continue; // Session is fully completed
    }

    const subject = subjectMap.get(session.subjectId);
    const subjectName = subject?.name || 'الجامعة';

    let daysToExam: number | null = null;
    if (subject?.examDate) {
      daysToExam = Math.max(0, getCalendarDaysDiff(subject.examDate, currentDate));
    } else if (subject?.midExamDate) {
      daysToExam = Math.max(0, getCalendarDaysDiff(subject.midExamDate, currentDate));
    }

    let synthTitle = '';
    let synthRationale = '';
    let synthScore = 55;
    let estimatedMinutes = 40;

    if (isUnreviewed) {
      synthTitle = `مراجعة: ${session.title} — ${subjectName}`;
      synthRationale = `محاضرة تم إنهاء مذاكرتها وبحاجة لمراجعة وتثبيت قبل النسيان 🧠`;
      synthScore = 68;
      estimatedMinutes = 35;
    } else if (isMaterialReadyUnstudied) {
      synthTitle = `مذاكرة: ${session.title} — ${subjectName}`;
      synthRationale = `الماتريال جاهزة ومتاحة للمذاكرة الآن 📖`;
      synthScore = 64;
      estimatedMinutes = 45;
    } else if (isUnsolved) {
      synthTitle = `حل تمارين: ${session.title} — ${subjectName}`;
      synthRationale = `تمت المراجعة وبحاجة لحل تمارين وتطبيقات ✍️`;
      synthScore = 58;
      estimatedMinutes = 40;
    } else {
      synthTitle = `مذاكرة: ${session.title} — ${subjectName}`;
      synthRationale = `محاضرة ضمن منهج ${subjectName} بانتظار المذاكرة`;
      synthScore = 52;
      estimatedMinutes = 45;
    }

    // Check if this lecture is directly covered by an upcoming Quiz!
    const coveringQuizzes = quizzes.filter(q =>
      !q.prepared &&
      q.lectureIds?.includes(session.id) &&
      getCalendarDaysDiff(q.quizDate, currentDate) >= 0 &&
      getCalendarDaysDiff(q.quizDate, currentDate) <= 7
    );

    let isQuizLinked = false;
    let quizBoostPriority = false;
    if (coveringQuizzes.length > 0) {
      const closestQuiz = coveringQuizzes.sort((a, b) =>
        getCalendarDaysDiff(a.quizDate, currentDate) - getCalendarDaysDiff(b.quizDate, currentDate)
      )[0];
      const qDiff = getCalendarDaysDiff(closestQuiz.quizDate, currentDate);
      isQuizLinked = true;
      if (qDiff === 0) {
        synthScore += 80;
        synthRationale = `🚨 داخلة في كويز اليوم (${closestQuiz.topic})! ${synthRationale}`;
        quizBoostPriority = true;
      } else if (qDiff === 1) {
        synthScore += 75;
        synthRationale = `⚡ داخلة في كويز غداً (${closestQuiz.topic})! ${synthRationale}`;
        quizBoostPriority = true;
      } else if (qDiff <= 3) {
        synthScore += 50;
        synthRationale = `🎯 داخلة في كويز بعد ${qDiff} أيام (${closestQuiz.topic}). ${synthRationale}`;
        quizBoostPriority = true;
      } else {
        synthScore += 30;
        synthRationale = `مشمولة في كويز قادم (${closestQuiz.topic}). ${synthRationale}`;
      }
    }

    // Proximity to Exam boost
    if (daysToExam !== null) {
      if (daysToExam <= 7) {
        synthScore += 45;
        synthRationale = `امتحان ${subjectName} بعد ${daysToExam} أيام فقط! ${synthRationale}`;
      } else if (daysToExam <= 14) {
        synthScore += 30;
        synthRationale = `امتحان ${subjectName} يقترب (بعد ${daysToExam} يوماً). ${synthRationale}`;
      } else if (daysToExam <= 30) {
        synthScore += 18;
        synthRationale = `استعداداً لامتحان ${subjectName} (بعد ${daysToExam} يوماً). ${synthRationale}`;
      }
    }

    if (subject?.focus === 'High') {
      synthScore += 10;
    }

    const fitsTimeWindow = estimatedMinutes <= freeWindow;
    if (fitsTimeWindow) {
      synthScore += 10;
      synthRationale += ` (وقتها ${estimatedMinutes} دقيقة مناسب قبل الصلاة)`;
    }

    const synthTask: Task = {
      id: `synth-study-${session.id}`,
      title: synthTitle,
      priority: quizBoostPriority || (daysToExam !== null && daysToExam <= 14) ? 'P1_URGENT_IMPORTANT' : 'P2_IMPORTANT',
      status: 'TODO',
      estimatedMinutes,
      isLocked: false,
      dueDate: todayStr,
      postponementCount: 0,
      studySessionId: session.id,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    scoredCandidates.push({
      task: synthTask,
      score: synthScore,
      rationaleArabic: synthRationale,
      category: 'STUDY',
      freeWindowFit: fitsTimeWindow,
      isPostponementIntervention: false
    });
  }

  // B. Approaching Academic Quizzes
  for (const quiz of quizzes) {
    if (quiz.prepared && quiz.attended) continue;

    const daysToQuiz = getCalendarDaysDiff(quiz.quizDate, currentDate);
    if (daysToQuiz < 0) continue; // Past quiz

    if (daysToQuiz <= 14) {
      let quizScore = 80;
      let rationale = '';
      let priority: Task['priority'] = 'P2_IMPORTANT';

      if (daysToQuiz === 0) {
        // Quiz is TODAY!
        quizScore = quiz.prepared ? 120 : 220;
        priority = 'P1_URGENT_IMPORTANT';
        rationale = `🚨 كويز اليوم في مادة ${quiz.subjectName}: "${quiz.topic}"!`;
      } else if (daysToQuiz === 1) {
        // Quiz is TOMORROW!
        quizScore = quiz.prepared ? 110 : 200;
        priority = 'P1_URGENT_IMPORTANT';
        rationale = `⚡ كويز غداً في مادة ${quiz.subjectName}: "${quiz.topic}" — الاستعداد إلزامي اليوم!`;
      } else if (daysToQuiz === 2) {
        quizScore = quiz.prepared ? 95 : 175;
        priority = 'P1_URGENT_IMPORTANT';
        rationale = `كويز بعد يومين في مادة ${quiz.subjectName}: "${quiz.topic}".`;
      } else if (daysToQuiz === 3) {
        quizScore = quiz.prepared ? 90 : 155;
        priority = 'P1_URGENT_IMPORTANT';
        rationale = `كويز بعد 3 أيام في مادة ${quiz.subjectName}: "${quiz.topic}".`;
      } else if (daysToQuiz <= 7) {
        quizScore = 120 + (7 - daysToQuiz) * 3;
        rationale = `كويز قادم بعد ${daysToQuiz} أيام في مادة ${quiz.subjectName}: "${quiz.topic}".`;
      } else {
        quizScore = 85 + (14 - daysToQuiz);
        rationale = `كويز قادم بعد ${daysToQuiz} يوماً في مادة ${quiz.subjectName}.`;
      }

      // Check for attached lectures or syllabus scope
      let coveredLecturesText = '';
      if (quiz.lectureIds && quiz.lectureIds.length > 0) {
        const coveredNames = quiz.lectureIds
          .map(id => sessionMap.get(id))
          .filter((s): s is StudySession => Boolean(s))
          .map(s => s.lectureNumber ? `محاضرة ${s.lectureNumber}` : s.title);

        if (coveredNames.length > 0) {
          coveredLecturesText = ` (يشمل: ${coveredNames.join('، ')})`;
          rationale += ` يشمل: ${coveredNames.join('، ')}.`;
        }
      } else if (quiz.syllabusScope) {
        coveredLecturesText = ` (${quiz.syllabusScope})`;
        rationale += ` نطاق المنهج: ${quiz.syllabusScope}.`;
      }

      const estMin = 35;
      const fits = estMin <= freeWindow;
      if (fits) {
        quizScore += 10;
        rationale += ` (وقتها ${estMin} دقيقة مناسب قبل الصلاة)`;
      }

      const synthQuizTask: Task = {
        id: `synth-quiz-${quiz.id}`,
        title: daysToQuiz === 0
          ? `🚨 كويز اليوم: ${quiz.topic} — ${quiz.subjectName}${coveredLecturesText}`
          : daysToQuiz === 1
          ? `🎯 الاستعداد لكويز غداً: ${quiz.topic} — ${quiz.subjectName}${coveredLecturesText}`
          : `التحضير لكويز: ${quiz.topic} — ${quiz.subjectName}${coveredLecturesText}`,
        priority,
        status: 'TODO',
        estimatedMinutes: estMin,
        isLocked: false,
        dueDate: quiz.quizDate || todayStr,
        postponementCount: 0,
        createdAt: nowIso,
        updatedAt: nowIso
      };

      scoredCandidates.push({
        task: synthQuizTask,
        score: quizScore,
        rationaleArabic: rationale,
        category: 'STUDY',
        freeWindowFit: fits,
        isPostponementIntervention: false
      });
    }
  }

  // C. Approaching Academic Assignments
  for (const assign of assignments) {
    if (assign.completed && assign.submitted) continue;

    const daysToDue = getCalendarDaysDiff(assign.deadline || '', currentDate);
    if (daysToDue < 0) continue;

    if (daysToDue <= 10) {
      const assignScore = 70 + Math.max(0, 10 - daysToDue);
      const estMin = 45;
      const fits = estMin <= freeWindow;

      const synthAssignTask: Task = {
        id: `synth-assign-${assign.id}`,
        title: `إنجاز تكليف: ${assign.taskName} — ${assign.subjectName}`,
        priority: daysToDue <= 2 ? 'P1_URGENT_IMPORTANT' : 'P2_IMPORTANT',
        status: 'TODO',
        estimatedMinutes: estMin,
        isLocked: false,
        dueDate: assign.deadline || todayStr,
        postponementCount: 0,
        createdAt: nowIso,
        updatedAt: nowIso
      };

      scoredCandidates.push({
        task: synthAssignTask,
        score: assignScore,
        rationaleArabic: `موعد تسليم التكليف بعد ${daysToDue} أيام 📋`,
        category: 'STUDY',
        freeWindowFit: fits,
        isPostponementIntervention: false
      });
    }
  }

  // If no tasks and no academic candidates exist
  if (scoredCandidates.length === 0) return null;

  // Sort descending by score
  scoredCandidates.sort((a, b) => b.score - a.score);

  const top = scoredCandidates[0];
  const alternatives = scoredCandidates.slice(1, 4).map(s => s.task);

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
