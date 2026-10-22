import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Flame, 
  AlertCircle, 
  RotateCcw,
  ArrowRight,
  Sun,
  GraduationCap,
  Cloud,
  Compass,
  ChevronRight,
  ChevronDown,
  Zap,
  Target,
  Moon,
  Dumbbell,
  Calendar,
  AlertTriangle,
  School,
  Trash2,
  Trophy
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { CloudSyncModal } from './CloudSyncModal';
import { fireConfettiSuccess } from '../lib/confetti';
import { getCairoDateString } from '../lib/dateUtils';
import { generateWeeklySchedulePlan } from '../engines/scheduler';

export const SmartToday: React.FC = () => {
  const { 
    prayers, 
    bestNextAction, 
    tasks, 
    goals,
    timetableSlots,
    availabilityRules,
    quranLogs,
    movementLogs,
    completeTask, 
    uncompleteTask,
    toggleTaskStatus,
    postponeTask, 
    deleteTask,
    readTwoPagesAction,
    undoReadTwoPagesAction,
    bookDetails, 
    habits, 
    habitLogs, 
    toggleHabitToday,
    rankProgress,
    setActiveTab,
    syncStatus,
    challenges,
    challengeLogs,
    toggleChallengeTaskToday
  } = useAppStore();

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [lastCompletedTaskId, setLastCompletedTaskId] = useState<string | null>(null);
  const [lastCompletedHabitId, setLastCompletedHabitId] = useState<string | null>(null);
  const [justReadBookId, setJustReadBookId] = useState<string | null>(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const currentReadingBook = bookDetails.find(b => b.shelf === 'Reading') || bookDetails[0];
  const pendingTasks = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter(t => t.status === 'DONE');
  const activeChallenges = challenges.filter(c => c.status === 'ACTIVE');
  // Truthful Top 3 ranked priorities according to recommendation engine
  const todayTasks = bestNextAction 
    ? [bestNextAction.task, ...bestNextAction.alternativeTasks].slice(0, 3)
    : pendingTasks.slice(0, 3);

  // Format today date in Arabic
  const now = new Date();
  const todayFormatted = now.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const arabicDays: ('الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة' | 'السبت')[] = [
    'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
  ];
  const todayArabicDay = arabicDays[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const todayStr = getCairoDateString();

  // Next university class today
  const todaySlots = timetableSlots.filter(s => s.day === todayArabicDay);
  const upcomingSlots = todaySlots
    .map(s => {
      const [h, m] = s.startTime.split(':').map(Number);
      return { ...s, startMinutes: h * 60 + m };
    })
    .filter(s => s.startMinutes >= currentMinutes)
    .sort((a, b) => a.startMinutes - b.startMinutes);
  const nextClass = upcomingSlots[0] || null;

  // Domain pulses
  const todayQuranPages = quranLogs
    .filter(q => q.date === todayStr)
    .reduce((sum, q) => sum + q.pagesRead, 0);

  const todayMovementMinutes = movementLogs
    .filter(m => m.date === todayStr)
    .reduce((sum, m) => sum + m.durationMinutes, 0);

  const activeGoalsCount = goals.filter(g => !g.isArchived && g.status !== 'ACHIEVED').length;

  // Weekly capacity overload
  const { plan: weeklyPlan } = generateWeeklySchedulePlan(
    tasks,
    timetableSlots,
    prayers,
    availabilityRules,
    goals,
    0.15
  );

  const handleCompleteTask = async (taskId: string) => {
    fireConfettiSuccess();
    setLastCompletedTaskId(taskId);
    await completeTask(taskId);
  };

  const handleReadTwoPages = async (resourceId: string) => {
    fireConfettiSuccess();
    setJustReadBookId(resourceId);
    await readTwoPagesAction(resourceId);
  };

  const handleToggleHabit = async (habitId: string) => {
    const todayStr = getCairoDateString();
    const habit = habits.find(h => h.id === habitId);
    const isCurrentlyDone = habitLogs.some(l => l.habitId === habitId && l.date === todayStr && l.status === 'COMPLETED')
      || (habit && habit.lastCompletedDate === todayStr);

    if (!isCurrentlyDone) {
      fireConfettiSuccess();
      setLastCompletedHabitId(habitId);
    } else {
      setLastCompletedHabitId(null);
    }
    await toggleHabitToday(habitId);
  };

  return (
    <div className="space-y-4 pb-24 pt-3 relative">
      {/* 1. Apple iOS Large Title Header */}
      <header className="flex items-center justify-between pt-1 pb-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            <span className="text-[11px] font-bold text-sky-400 tracking-wider">
              مَسار • المرشد اليومي
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            صباح النور <span className="text-sky-300">يا أحمد 👋</span>
          </h1>
          <p className="text-xs text-[#8e8e93] font-medium">
            {todayFormatted} • جاهز لإنجاز أهدافك؟
          </p>
        </div>

        {/* Scientific Rank Badge with Apple Health styling */}
        <button
          type="button"
          onClick={() => setActiveTab('JOURNAL')}
          className="min-h-[44px] px-3.5 py-1.5 rounded-2xl apple-card flex items-center gap-2.5 pressable cursor-pointer border border-white/[0.08] hover:border-white/[0.18]"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-400/20 flex items-center justify-center text-purple-300">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-white">
              {rankProgress.currentRank.titleArabic}
            </div>
            <div className="text-[10px] text-[#8e8e93] font-mono font-bold">
              {rankProgress.totalXP} XP
            </div>
          </div>
        </button>
      </header>

      {/* Overload Alert Quick Banner */}
      {weeklyPlan.isOverloaded && (
        <button
          type="button"
          onClick={() => setActiveTab('SCHEDULE')}
          className="w-full bg-rose-500/10 border border-rose-500/25 p-2.5 rounded-2xl text-xs text-rose-200 flex items-center justify-between gap-2 pressable cursor-pointer shadow-sm hover:border-rose-400/40 min-h-[44px]"
        >
          <div className="flex items-center gap-2 text-right">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-bold">
              تنبيه الحمل الزائد: المهام تتجاوز السعة بـ {Math.round((weeklyPlan.unscheduledMinutes / 60) * 10) / 10} ساعة
            </span>
          </div>
          <span className="text-[10px] text-rose-300 font-bold bg-rose-950/80 px-2 py-1 rounded-full shrink-0 flex items-center gap-1 border border-rose-500/20">
            <span>المخطط</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </button>
      )}

      {/* 2. Contextual Awareness: Next Prayer & Next University Commitment */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Next Prayer Card */}
        <button
          type="button"
          onClick={() => setActiveTab('FAITH')}
          className="apple-card rounded-[22px] p-3.5 flex items-center justify-between shadow-md relative overflow-hidden text-right pressable cursor-pointer border border-white/[0.08] hover:border-white/[0.18] min-h-[64px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/20 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>صلاة {prayers.nextPrayer.nameArabic} القادمة</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-[11px] text-[#8e8e93] font-mono mt-0.5">
                الساعة <strong className="text-emerald-300">{prayers.nextPrayer.timeFormatted}</strong> (متبقي {prayers.freeWindowMinutes} د)
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            القاهرة 📍
          </span>
        </button>

        {/* Next Academic Commitment Card */}
        <button
          type="button"
          onClick={() => setActiveTab('UNIVERSITY')}
          className="apple-card rounded-[22px] p-3.5 flex items-center justify-between shadow-md relative overflow-hidden text-right pressable cursor-pointer border border-white/[0.08] hover:border-white/[0.18] min-h-[64px]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-300 border border-purple-400/20 flex items-center justify-center shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>الجامعة • {todayArabicDay}</span>
              </div>
              <div className="text-[11px] text-[#8e8e93] truncate mt-0.5 font-medium">
                {nextClass ? (
                  <>
                    <strong className="text-purple-300">{nextClass.subjectName}</strong> ({nextClass.startTime})
                  </>
                ) : todaySlots.length > 0 ? (
                  'انتهت محاضرات اليوم بحمد الله 🎓'
                ) : (
                  'لا توجد محاضرات مجدولة اليوم 🌴'
                )}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20 shrink-0">
            {todaySlots.length} حصص
          </span>
        </button>
      </section>

      {/* 3. Apple Health Squircle Activity Widgets (Faith, Fitness, Goals, Challenges, Schedule) */}
      <section className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {/* Quran Widget */}
        <button
          type="button"
          onClick={() => setActiveTab('FAITH')}
          className="apple-widget p-3 flex flex-col justify-between text-right pressable cursor-pointer min-h-[84px]"
        >
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <Moon className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">ورد</span>
          </div>
          <div>
            <div className="text-base font-black font-mono text-white mt-1.5">
              {todayQuranPages}/3 ص
            </div>
            <div className="text-[10px] text-[#8e8e93] font-medium mt-0.5">القرآن الكريم</div>
          </div>
        </button>

        {/* Fitness Widget */}
        <button
          type="button"
          onClick={() => setActiveTab('FITNESS')}
          className="apple-widget p-3 flex flex-col justify-between text-right pressable cursor-pointer min-h-[84px]"
        >
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <Dumbbell className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded-md">20د</span>
          </div>
          <div>
            <div className="text-base font-black font-mono text-white mt-1.5">
              {todayMovementMinutes}/20 د
            </div>
            <div className="text-[10px] text-[#8e8e93] font-medium mt-0.5">الحركة والرياضة</div>
          </div>
        </button>

        {/* Goals Widget */}
        <button
          type="button"
          onClick={() => setActiveTab('GOALS')}
          className="apple-widget p-3 flex flex-col justify-between text-right pressable cursor-pointer min-h-[84px]"
        >
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-xl bg-sky-500/15 text-sky-300 flex items-center justify-center">
              <Target className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] text-sky-300 font-bold bg-sky-500/10 px-1.5 py-0.5 rounded-md">أهداف</span>
          </div>
          <div>
            <div className="text-base font-black font-mono text-white mt-1.5">
              {activeGoalsCount} نشطة
            </div>
            <div className="text-[10px] text-[#8e8e93] font-medium mt-0.5">مسار الأهداف</div>
          </div>
        </button>

        {/* Challenges Widget */}
        <button
          type="button"
          onClick={() => setActiveTab('CHALLENGES')}
          className="apple-widget p-3 flex flex-col justify-between text-right pressable cursor-pointer min-h-[84px]"
        >
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Trophy className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-md">الـ 90</span>
          </div>
          <div>
            <div className="text-base font-black font-mono text-white mt-1.5">
              {activeChallenges.length} نشطة
            </div>
            <div className="text-[10px] text-[#8e8e93] font-medium mt-0.5">التحديات</div>
          </div>
        </button>

        {/* Schedule Widget */}
        <button
          type="button"
          onClick={() => setActiveTab('SCHEDULE')}
          className="apple-widget p-3 flex flex-col justify-between text-right pressable cursor-pointer min-h-[84px]"
        >
          <div className="flex items-center justify-between">
            <span className="w-7 h-7 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded-md">جدول</span>
          </div>
          <div>
            <div className="text-base font-black font-mono text-white mt-1.5">
              {weeklyPlan.isOverloaded ? 'حمل زائد' : 'متزن ✓'}
            </div>
            <div className="text-[10px] text-[#8e8e93] font-medium mt-0.5">المخطط الأسبوعي</div>
          </div>
        </button>
      </section>

      {/* 3. Hero Card: Best Next Action (Apple Intelligence Hero Card) */}
      {bestNextAction ? (
        <section className="apple-card-glow rounded-[26px] p-5 shadow-2xl relative overflow-hidden border border-sky-400/25">
          {/* Top highlight pill */}
          <div className="flex items-center justify-between mb-3.5 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-sky-500/10 text-sky-300 border border-sky-400/25 text-[11px] font-bold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
              <span>التوصية الذكية الأنسب لك الآن</span>
            </span>

            <span className="text-[10px] font-mono text-[#8e8e93] bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.08] font-bold">
              {bestNextAction.task.estimatedMinutes} دقيقة
            </span>
          </div>

          <div className="space-y-3.5 relative z-10">
            <h2 className="text-base sm:text-lg font-black text-white leading-snug">
              {bestNextAction.task.title}
            </h2>

            {/* Explainable Reasoning Inset Card */}
            <div className="bg-black/35 p-3.5 rounded-2xl border border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-400">
                <Target className="w-3.5 h-3.5 text-sky-400" />
                <span>لماذا اختار مَسار هذه الخطوة بالذات؟</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pr-5 font-normal">
                {bestNextAction.rationaleArabic}
              </p>
            </div>

            {/* Micro-interaction Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCompleteTask(bestNextAction.task.id)}
                className="apple-btn-primary flex-1 min-h-[48px] text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 pressable cursor-pointer shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                <span>أنجزتها الآن (+25 XP)</span>
              </button>

              <button
                type="button"
                onClick={() => postponeTask(bestNextAction.task.id)}
                className="min-h-[48px] bg-white/[0.06] hover:bg-white/[0.1] text-white font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-1.5 border border-white/[0.08] pressable cursor-pointer"
                title="تأجيل المهمة لوقت لاحق"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>تأجيل</span>
              </button>

              <button
                type="button"
                onClick={() => deleteTask(bestNextAction.task.id)}
                className="min-h-[48px] bg-white/[0.06] hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 font-bold text-xs py-3 px-3.5 rounded-2xl flex items-center justify-center border border-white/[0.08] pressable cursor-pointer transition-colors"
                title="حذف المهمة نهائياً"
                aria-label="حذف المهمة"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="apple-card rounded-[26px] p-6 text-center space-y-2.5 border border-emerald-500/25">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-400/20 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="text-base font-bold text-white">يومك منظم ورايق ومفيش مهام متأخرة! ✨</h3>
          <p className="text-xs text-[#8e8e93] max-w-xs mx-auto">
            تقدر تقرأ صفحتين في كتاب النانو، أو تسجل فكرة جديدة لفالكون، أو تضيف مهمة من علامة (+) بالأسفل.
          </p>
        </section>
      )}

      {/* 4. Postponement Intervention Alert (3-Miss Threshold) */}
      {bestNextAction?.isPostponementIntervention && (
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3.5 flex items-start gap-3 text-right shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-200">تدخل ودي لإعادة جدولة الأولويات (3 تأجيلات متتالية)</h4>
            <p className="text-xs text-amber-300/90 leading-relaxed">
              {bestNextAction.interventionProposal}
            </p>
          </div>
        </div>
      )}

      {/* 5. Atomic Action: Read 2 Pages Card (Apple Glass Card) */}
      {currentReadingBook && (
        <section className="apple-card rounded-[22px] p-3.5 flex items-center justify-between shadow-md relative overflow-hidden border border-white/[0.08]">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            {/* Book icon/cover */}
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">عادة صفحتين فقط</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-500/20">
                  +15 XP
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden max-w-[190px]">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((currentReadingBook.currentPage / Math.max(1, currentReadingBook.totalPages)) * 100))}%` }}
                />
              </div>

              <p className="text-[11px] text-[#8e8e93] font-mono truncate">
                صفحة <strong className="text-emerald-300">{currentReadingBook.currentPage}</strong> من {currentReadingBook.totalPages}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleReadTwoPages(currentReadingBook.resourceId)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm pressable cursor-pointer shrink-0"
          >
            <span>قرأت صفحتين</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </section>
      )}

      {/* 3.1 Undo Accidental Completion Banner */}
      {lastCompletedTaskId && (() => {
        const justCompleted = tasks.find(t => t.id === lastCompletedTaskId);
        if (!justCompleted || justCompleted.status !== 'DONE') return null;
        return (
          <div className="bg-[#14151a]/95 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between gap-2 shadow-lg backdrop-blur-xl animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2 text-xs text-emerald-200 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">تم إنجاز: <strong>{justCompleted.title}</strong></span>
            </div>
            <button
              type="button"
              onClick={async () => {
                await uncompleteTask(justCompleted.id);
                setLastCompletedTaskId(null);
              }}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 pressable cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تراجع (إلغاء الإنجاز) ↩️</span>
            </button>
          </div>
        );
      })()}

      {/* 3.2 Undo Habit Completion Banner */}
      {lastCompletedHabitId && (() => {
        const h = habits.find(x => x.id === lastCompletedHabitId);
        const todayStr = getCairoDateString();
        const isDoneToday = habitLogs.some(l => l.habitId === lastCompletedHabitId && l.date === todayStr && l.status === 'COMPLETED')
          || (h && h.lastCompletedDate === todayStr);
        if (!h || !isDoneToday) return null;
        return (
          <div className="bg-[#14151a]/95 border border-emerald-500/30 p-3 rounded-2xl flex items-center justify-between gap-2 shadow-lg backdrop-blur-xl animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2 text-xs text-emerald-200 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">تم تسجيل عادة: <strong>{h.title}</strong></span>
            </div>
            <button
              type="button"
              onClick={async () => {
                await toggleHabitToday(h.id);
                setLastCompletedHabitId(null);
              }}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 pressable cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تراجع (إلغاء الإنجاز) ↩️</span>
            </button>
          </div>
        );
      })()}

      {/* 3.3 Undo Read 2 Pages Banner */}
      {justReadBookId && (
        <div className="bg-[#14151a]/95 border border-teal-500/30 p-3 rounded-2xl flex items-center justify-between gap-2 shadow-lg backdrop-blur-xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 text-xs text-teal-200 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="truncate">تم تسجيل قراءة صفحتين بنجاح (+15 XP)</span>
          </div>
          <button
            type="button"
            onClick={async () => {
              await undoReadTwoPagesAction(justReadBookId);
              setJustReadBookId(null);
            }}
            className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 font-bold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 pressable cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تراجع عن الصفحتين ↩️</span>
          </button>
        </div>
      )}

      {/* 6. Top 3 Priorities Checklist (Apple Reminders Inset Grouped Card) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
            </span>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              أولويات اليوم ({pendingTasks.length})
            </h2>
          </div>
          <span className="text-[10px] text-sky-300 font-mono font-bold bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-400/20">
            أول 3 مهام مقترحة
          </span>
        </div>

        {/* Grouped Inset Card for Tasks */}
        <div className="apple-card rounded-[24px] p-0 overflow-hidden divide-y divide-white/[0.06] border border-white/[0.08] shadow-lg">
          {todayTasks.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#8e8e93]">
              لا توجد مهام معلقة لهذا اليوم، استمتع بوقتك أو أضف مهمة جديدة ✨
            </div>
          ) : (
            todayTasks.map(task => (
              <div
                key={task.id}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Apple Reminders Circular Check Ring */}
                  <button
                    type="button"
                    onClick={() => handleCompleteTask(task.id)}
                    aria-label="إكمال المهمة"
                    className="w-6 h-6 rounded-full border-[1.5px] border-white/25 hover:border-sky-400 hover:bg-sky-400/15 flex items-center justify-center shrink-0 transition-all pressable cursor-pointer group active:scale-95"
                    title="اضغط للإنجاز"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs sm:text-sm font-semibold text-white truncate">{task.title}</span>
                    {task.goalId && (() => {
                      const linkedGoal = goals.find(g => g.id === task.goalId);
                      if (!linkedGoal) return null;
                      return (
                        <span className="text-[10px] text-sky-300 font-medium truncate flex items-center gap-1 mt-0.5">
                          <Target className="w-2.5 h-2.5 shrink-0 text-sky-400" />
                          <span className="truncate">{linkedGoal.title}</span>
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-[#8e8e93] font-mono flex items-center gap-1 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                    <Clock className="w-3 h-3 text-[#8e8e93]" />
                    {task.estimatedMinutes}د
                  </span>
                  {task.postponementCount > 0 && (
                    <span className="text-[9px] text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                      أُجلت {task.postponementCount}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-xl text-[#8e8e93] hover:text-rose-400 hover:bg-rose-500/15 pressable cursor-pointer transition-colors"
                    title="حذف المهمة"
                    aria-label="حذف المهمة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Collapsible Completed Tasks List for Easy Undo / Toggle */}
        {completedTasks.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className="text-[11px] font-bold text-[#8e8e93] hover:text-white flex items-center justify-between w-full py-2 px-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] transition-colors pressable cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>المهام المنجزة ({completedTasks.length}) — اضغط للإلغاء أو التراجع</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8e8e93] transition-transform ${showCompletedTasks ? 'rotate-180' : ''}`} />
            </button>

            {showCompletedTasks && (
              <div className="mt-2 apple-card rounded-[24px] p-0 overflow-hidden divide-y divide-white/[0.04] border border-white/[0.06] animate-in fade-in duration-200">
                {completedTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3 sm:p-3.5 flex items-center justify-between gap-3 text-[#8e8e93] hover:bg-white/[0.02]"
                  >
                    <button
                      type="button"
                      onClick={() => uncompleteTask(task.id)}
                      className="flex items-center gap-3 flex-1 min-w-0 text-right pressable cursor-pointer group"
                      title="اضغط لإلغاء الإنجاز وإعادة المهمة كغير مكتملة"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 group-hover:border-amber-400 group-hover:text-amber-300 transition-all">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="text-xs line-through text-[#8e8e93] group-hover:text-white truncate">{task.title}</span>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => uncompleteTask(task.id)}
                        className="text-[10px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 pressable cursor-pointer shadow-sm"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>إلغاء الإنجاز ↩️</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-xl text-[#8e8e93] hover:text-rose-400 hover:bg-rose-500/15 pressable cursor-pointer transition-colors"
                        title="حذف المهمة"
                        aria-label="حذف المهمة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 6.5. Active Challenges Daily Checklist (Apple Inset Style) */}
      {activeChallenges.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                مهام التحديات النشطة ({activeChallenges.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('CHALLENGES')}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>فتح التحديات</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {activeChallenges.map(challenge => {
              const log = challengeLogs.find(l => l.challengeId === challenge.id && l.date === todayStr);
              const completedTaskIds = log?.completedTaskIds || [];
              const totalTasks = challenge.tasks.length;
              const isAllDone = totalTasks > 0 && completedTaskIds.length >= totalTasks;

              return (
                <div
                  key={challenge.id}
                  className="apple-card border border-white/[0.08] rounded-[24px] p-4 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center text-base">
                        {challenge.trophyIcon || '🏆'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{challenge.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 inline-block mt-0.5">
                          اليوم {challenge.currentDay || 1}/{challenge.durationDays}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#8e8e93] bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
                      {completedTaskIds.length}/{totalTasks} منجز
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {challenge.tasks.map(task => {
                      const isDone = completedTaskIds.includes(task.id);
                      return (
                        <div
                          key={task.id}
                          onClick={() => toggleChallengeTaskToday(challenge.id, task.id)}
                          className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2.5 text-xs cursor-pointer select-none transition-all pressable ${
                            isDone
                              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200'
                              : 'bg-white/[0.03] border-white/[0.06] hover:border-white/15 text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                              isDone ? 'bg-emerald-400 text-slate-950' : 'border-[1.5px] border-white/25 text-transparent'
                            }`}>
                              ✓
                            </span>
                            <span className={`truncate text-xs font-medium ${isDone ? 'line-through text-[#8e8e93]' : 'text-white'}`}>
                              {task.icon} {task.title}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#8e8e93] shrink-0">{task.durationMinutes}د</span>
                        </div>
                      );
                    })}
                  </div>

                  {isAllDone && (
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>أتممت جميع مهام التحدي لهذا اليوم بنجاح 🎉</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7. Today's Habits & Streaks (Apple Health Activity Cards) */}
      <section className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </span>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              العادات والروتين اليومي
            </h2>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            سلسلة الـ 3 أيام سماح 🛡️
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {habits.map(habit => {
            const todayStr = getCairoDateString();
            const isCompleted = habitLogs.some(l => l.habitId === habit.id && l.date === todayStr && l.status === 'COMPLETED')
              || habit.lastCompletedDate === todayStr;

            return (
              <button
                type="button"
                key={habit.id}
                onClick={() => handleToggleHabit(habit.id)}
                title={isCompleted ? 'اضغط لإلغاء الإنجاز والتراجع ↩️' : 'اضغط لتسجيل الإنجاز'}
                className={`apple-widget p-3.5 rounded-[22px] border text-right transition-all flex flex-col justify-between min-h-[110px] pressable cursor-pointer relative group ${
                  isCompleted
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-100 shadow-md'
                    : 'bg-[#1a1b22]/70 border-white/[0.08] text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <span className="text-xs font-bold leading-snug line-clamp-2 text-white">{habit.title}</span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isCompleted ? 'bg-emerald-400 text-slate-950 scale-105' : 'border-[1.5px] border-white/25'
                  }`}>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full mt-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 font-mono">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{habit.streakCount} أيام متواصلة</span>
                  </div>

                  {isCompleted && (
                    <span className="text-[9px] text-amber-300 font-bold bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/25 flex items-center gap-0.5 shadow-sm">
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>إلغاء</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Cloud Sync Modal */}
      <CloudSyncModal 
        isOpen={isSyncModalOpen} 
        onClose={() => setIsSyncModalOpen(false)} 
      />
    </div>
  );
};
