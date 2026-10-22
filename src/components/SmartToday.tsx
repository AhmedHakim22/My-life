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
  Trash2
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
    syncStatus
  } = useAppStore();

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [lastCompletedTaskId, setLastCompletedTaskId] = useState<string | null>(null);
  const [lastCompletedHabitId, setLastCompletedHabitId] = useState<string | null>(null);
  const [justReadBookId, setJustReadBookId] = useState<string | null>(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const currentReadingBook = bookDetails.find(b => b.shelf === 'Reading') || bookDetails[0];
  const pendingTasks = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter(t => t.status === 'DONE');
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
      {/* 3D Ambient Glowing Orbs in Background (Trend 8 & Trend 3) */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-64 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Header & Personalized Welcome (Trend 9 Bold Typography & Trend 10 Personalized AI Experience) */}
      <header className="glass-panel rounded-3xl p-4.5 flex items-center justify-between border border-white/10 shadow-xl shadow-black/40 relative overflow-hidden">
        {/* Subtle decorative glow line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="text-[11px] font-bold text-sky-400 tracking-wider uppercase">
              مَسار • المدرب اليومي الذكي
            </span>
          </div>

          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            صباح النور يا أحمد 👋
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {todayFormatted} • جاهز لإنجاز أهدافك؟
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Cloud Sync Button */}
          <button
            type="button"
            onClick={() => setIsSyncModalOpen(true)}
            className={`min-h-[44px] flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all pressable cursor-pointer ${
              syncStatus.isConnected && syncStatus.tablesFound
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : syncStatus.isConnected
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 animate-pulse'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            title="مزامنة سوبا بيز"
          >
            <Cloud className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
            <span className="text-[10px]">
              {syncStatus.isConnected && syncStatus.tablesFound ? 'متصل ☁️' : syncStatus.isConnected ? 'إعداد ⚙️' : 'سحابة'}
            </span>
          </button>

          {/* Rank Badge with 3D Orbital Glow */}
          <button
            type="button"
            onClick={() => setActiveTab('JOURNAL')}
            className="min-h-[44px] flex items-center gap-2 bg-gradient-to-r from-purple-950/70 to-slate-900 border border-purple-500/40 hover:border-purple-400/80 rounded-2xl px-3 py-1.5 transition-all pressable cursor-pointer shadow-lg shadow-purple-950/40"
          >
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-[11px] font-extrabold text-purple-200 leading-tight">
                {rankProgress.currentRank.titleArabic}
              </div>
              <div className="text-[10px] text-purple-300/80 font-mono font-bold">
                {rankProgress.totalXP} XP
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* Overload Alert Quick Banner */}
      {weeklyPlan.isOverloaded && (
        <button
          type="button"
          onClick={() => setActiveTab('SCHEDULE')}
          className="w-full bg-rose-950/70 border border-rose-500/50 p-2.5 rounded-2xl text-xs text-rose-200 flex items-center justify-between gap-2 pressable cursor-pointer shadow-lg hover:border-rose-400 min-h-[44px]"
        >
          <div className="flex items-center gap-2 text-right">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-bold">
              تنبيه الحمل الزائد: المهام تتجاوز السعة بـ {Math.round((weeklyPlan.unscheduledMinutes / 60) * 10) / 10} ساعة
            </span>
          </div>
          <span className="text-[10px] text-rose-300 font-bold bg-rose-900/80 px-2 py-1 rounded-full shrink-0 flex items-center gap-1">
            <span>المخطط</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </button>
      )}

      {/* 2. Contextual Awareness: Next Prayer & Next University Commitment */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Next Prayer Card */}
        <button
          type="button"
          onClick={() => setActiveTab('FAITH')}
          className="glass-panel-emerald rounded-2xl p-3 flex items-center justify-between shadow-lg relative overflow-hidden text-right pressable cursor-pointer border border-emerald-500/30 hover:border-emerald-400/50 min-h-[56px]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 border border-emerald-400/30 shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                <span>صلاة {prayers.nextPrayer.nameArabic} القادمة</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="text-[11px] text-emerald-300/90 font-mono mt-0.5">
                الساعة <strong>{prayers.nextPrayer.timeFormatted}</strong> (متبقي {prayers.freeWindowMinutes} د)
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-600/40">
            القاهرة 📍
          </span>
        </button>

        {/* Next Academic Commitment Card */}
        <button
          type="button"
          onClick={() => setActiveTab('UNIVERSITY')}
          className="glass-panel rounded-2xl p-3 flex items-center justify-between shadow-lg relative overflow-hidden text-right pressable cursor-pointer border border-purple-500/30 hover:border-purple-400/50 min-h-[56px]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300 border border-purple-400/30 shrink-0">
              <School className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-purple-200 flex items-center gap-1">
                <span>الجامعة • {todayArabicDay}</span>
              </div>
              <div className="text-[11px] text-purple-300/90 truncate mt-0.5 font-medium">
                {nextClass ? (
                  <>
                    <strong className="text-white">{nextClass.subjectName}</strong> ({nextClass.startTime})
                  </>
                ) : todaySlots.length > 0 ? (
                  'انتهت محاضرات اليوم بحمد الله 🎓'
                ) : (
                  'لا توجد محاضرات مجدولة اليوم 🌴'
                )}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-700/40 shrink-0">
            {todaySlots.length} حصص
          </span>
        </button>
      </section>

      {/* 3. Domain Pulse Quick Glance Row (Faith, Fitness, Goals, Academics) */}
      <section className="grid grid-cols-4 gap-2">
        {/* Faith Quran Pulse */}
        <button
          type="button"
          onClick={() => setActiveTab('FAITH')}
          className="glass-panel p-2.5 rounded-2xl border border-slate-800 text-center pressable cursor-pointer hover:border-emerald-500/40 transition-all min-h-[52px]"
        >
          <span className="text-[10px] text-slate-400 font-bold block flex items-center justify-center gap-1">
            <Moon className="w-3 h-3 text-emerald-400" />
            <span>القرآن</span>
          </span>
          <span className={`text-xs font-black font-mono mt-0.5 block ${
            todayQuranPages >= 3 ? 'text-emerald-400' : 'text-slate-300'
          }`}>
            {todayQuranPages}/3 ص {todayQuranPages >= 3 ? '✓' : ''}
          </span>
        </button>

        {/* Fitness Movement Pulse */}
        <button
          type="button"
          onClick={() => setActiveTab('FITNESS')}
          className="glass-panel p-2.5 rounded-2xl border border-slate-800 text-center pressable cursor-pointer hover:border-rose-500/40 transition-all min-h-[52px]"
        >
          <span className="text-[10px] text-slate-400 font-bold block flex items-center justify-center gap-1">
            <Dumbbell className="w-3 h-3 text-rose-400" />
            <span>الحركة</span>
          </span>
          <span className={`text-xs font-black font-mono mt-0.5 block ${
            todayMovementMinutes >= 20 ? 'text-rose-400' : 'text-slate-300'
          }`}>
            {todayMovementMinutes}/20 د {todayMovementMinutes >= 20 ? '✓' : ''}
          </span>
        </button>

        {/* Goals Pulse */}
        <button
          type="button"
          onClick={() => setActiveTab('GOALS')}
          className="glass-panel p-2.5 rounded-2xl border border-slate-800 text-center pressable cursor-pointer hover:border-sky-500/40 transition-all min-h-[52px]"
        >
          <span className="text-[10px] text-slate-400 font-bold block flex items-center justify-center gap-1">
            <Target className="w-3 h-3 text-sky-400" />
            <span>الأهداف</span>
          </span>
          <span className="text-xs font-black text-sky-400 font-mono mt-0.5 block">
            {activeGoalsCount} نشطة
          </span>
        </button>

        {/* Weekly Schedule Plan */}
        <button
          type="button"
          onClick={() => setActiveTab('SCHEDULE')}
          className="glass-panel p-2.5 rounded-2xl border border-slate-800 text-center pressable cursor-pointer hover:border-sky-500/40 transition-all min-h-[52px]"
        >
          <span className="text-[10px] text-slate-400 font-bold block flex items-center justify-center gap-1">
            <Calendar className="w-3 h-3 text-sky-400" />
            <span>المخطط</span>
          </span>
          <span className={`text-xs font-black font-mono mt-0.5 block ${
            weeklyPlan.isOverloaded ? 'text-rose-400' : 'text-teal-400'
          }`}>
            {weeklyPlan.isOverloaded ? 'حمل زائد' : 'متزن ✓'}
          </span>
        </button>
      </section>

      {/* 3. Hero Card: Best Next Action (Explainable Recommender - Trend 10 & Trend 4) */}
      {bestNextAction ? (
        <section className="glass-panel-glow rounded-3xl p-5 shadow-2xl relative overflow-hidden border border-sky-400/30">
          {/* Top highlight pill */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[11px] font-extrabold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 fill-sky-300" />
              <span>التوصية الذكية الأنسب لك الآن</span>
            </span>

            <span className="text-[10px] font-mono text-sky-300/80 bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-800/40">
              {bestNextAction.task.estimatedMinutes} دقيقة
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-base sm:text-lg font-black text-white leading-snug">
              {bestNextAction.task.title}
            </h2>

            {/* Explainable Reasoning Card */}
            <div className="bg-sky-950/50 p-3 rounded-2xl border border-sky-800/50 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-300">
                <Target className="w-3.5 h-3.5 text-sky-400" />
                <span>لماذا اختار مَسار هذه الخطوة بالذات؟</span>
              </div>
              <p className="text-xs text-sky-200/90 leading-relaxed pr-5">
                {bestNextAction.rationaleArabic}
              </p>
            </div>

            {/* Micro-interaction Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCompleteTask(bestNextAction.task.id)}
                className="flex-1 min-h-[48px] bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 pressable cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>أنجزتها الآن (+25 XP)</span>
              </button>

              <button
                type="button"
                onClick={() => postponeTask(bestNextAction.task.id)}
                className="min-h-[48px] bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 font-bold text-xs py-3 px-3.5 rounded-xl flex items-center justify-center gap-1.5 border border-slate-700/60 pressable cursor-pointer"
                title="تأجيل المهمة لوقت لاحق"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تأجيل</span>
              </button>

              <button
                type="button"
                onClick={() => deleteTask(bestNextAction.task.id)}
                className="min-h-[48px] bg-slate-800/80 hover:bg-rose-950/50 hover:text-rose-400 text-slate-400 font-bold text-xs py-3 px-3 rounded-xl flex items-center justify-center border border-slate-700/60 pressable cursor-pointer transition-colors"
                title="حذف المهمة نهائياً"
                aria-label="حذف المهمة"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="glass-panel rounded-3xl p-6 text-center space-y-2.5 border border-emerald-500/20">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="text-base font-bold text-white">يومك منظم ورايق ومفيش مهام متأخرة! ✨</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            تقدر تقرأ صفحتين في كتاب النانو، أو تسجل فكرة جديدة لفالكون، أو تضيف مهمة من علامة (+) بالأسفل.
          </p>
        </section>
      )}

      {/* 3.1 Undo Accidental Completion Banner */}
      {lastCompletedTaskId && (() => {
        const justCompleted = tasks.find(t => t.id === lastCompletedTaskId);
        if (!justCompleted || justCompleted.status !== 'DONE') return null;
        return (
          <div className="bg-emerald-950/80 border border-emerald-500/50 p-3 rounded-2xl flex items-center justify-between gap-2 shadow-lg animate-in slide-in-from-top duration-200">
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
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 pressable cursor-pointer shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تراجع (إلغاء الإنجاز) ↩️</span>
            </button>
          </div>
        );
      })()}

      {/* 4. Postponement Intervention Alert (3-Miss Threshold) */}
      {bestNextAction?.isPostponementIntervention && (
        <div className="bg-amber-950/60 border border-amber-600/50 rounded-2xl p-3.5 flex items-start gap-3 text-right shadow-lg">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-200">تدخل ودي لإعادة جدولة الأولويات (3 تأجيلات متتالية)</h4>
            <p className="text-xs text-amber-300/80 leading-relaxed">
              {bestNextAction.interventionProposal}
            </p>
          </div>
        </div>
      )}

      {/* 5. Atomic Action: Read 2 Pages Card (Trend 2 Neumorphism depth & Trend 6 Confetti) */}
      {currentReadingBook && (
        <section className="glass-panel rounded-2xl p-4 flex items-center justify-between shadow-lg border border-white/5 relative overflow-hidden">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            {/* Book icon/cover */}
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)] shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">عادة صفحتين فقط</span>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-700/40">
                  +15 XP
                </span>
              </div>

              {/* Progress Bar (Trend 2 Neo-Sunken) */}
              <div className="w-full bg-slate-950/80 neo-sunken h-2 rounded-full overflow-hidden max-w-[190px]">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((currentReadingBook.currentPage / Math.max(1, currentReadingBook.totalPages)) * 100))}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 font-mono truncate">
                صفحة <strong className="text-emerald-400">{currentReadingBook.currentPage}</strong> من {currentReadingBook.totalPages}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleReadTwoPages(currentReadingBook.resourceId)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs py-2.5 px-3.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 pressable cursor-pointer shrink-0"
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
          <div className="bg-emerald-950/80 border border-emerald-500/50 p-3 rounded-2xl flex items-center justify-between gap-2 shadow-lg animate-in slide-in-from-top duration-200">
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
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 pressable cursor-pointer shadow"
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
          <div className="bg-emerald-950/80 border border-emerald-500/50 p-3 rounded-2xl flex items-center justify-between gap-2 shadow-lg animate-in slide-in-from-top duration-200">
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
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 pressable cursor-pointer shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تراجع (إلغاء الإنجاز) ↩️</span>
            </button>
          </div>
        );
      })()}

      {/* 3.3 Undo Read 2 Pages Banner */}
      {justReadBookId && (
        <div className="bg-teal-950/80 border border-teal-500/50 p-3 rounded-2xl flex items-center justify-between gap-2 shadow-lg animate-in slide-in-from-top duration-200">
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
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0 pressable cursor-pointer shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تراجع عن الصفحتين ↩️</span>
          </button>
        </div>
      )}

      {/* 6. Top 3 Priorities Checklist */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              أولويات اليوم ({pendingTasks.length})
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">أول 3 مهام مقترحة</span>
        </div>

        <div className="space-y-2">
          {todayTasks.map(task => (
            <div
              key={task.id}
              className="glass-panel hover:bg-slate-800/60 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleCompleteTask(task.id)}
                  aria-label="إكمال المهمة"
                  className="w-7 h-7 rounded-xl border-2 border-slate-600 hover:border-sky-400 hover:bg-sky-500/20 flex items-center justify-center shrink-0 transition-colors pressable cursor-pointer"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-200 truncate">{task.title}</span>
                  {task.goalId && (() => {
                    const linkedGoal = goals.find(g => g.id === task.goalId);
                    if (!linkedGoal) return null;
                    return (
                      <span className="text-[10px] text-sky-400 font-medium truncate flex items-center gap-1 mt-0.5">
                        <Target className="w-2.5 h-2.5 shrink-0 text-sky-400" />
                        <span className="truncate">{linkedGoal.title}</span>
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {task.estimatedMinutes}د
                </span>
                {task.postponementCount > 0 && (
                  <span className="text-[9px] text-amber-300 font-bold bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-800/40">
                    أُجلت {task.postponementCount}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 pressable cursor-pointer transition-colors"
                  title="حذف المهمة"
                  aria-label="حذف المهمة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* Collapsible Completed Tasks List for Easy Undo / Toggle */}
          {completedTasks.length > 0 && (
            <div className="pt-2 border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-200 flex items-center justify-between w-full py-1.5 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800 transition-colors pressable cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>المهام المنجزة ({completedTasks.length}) — اضغط للإلغاء أو التراجع</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showCompletedTasks ? 'rotate-180' : ''}`} />
              </button>

              {showCompletedTasks && (
                <div className="space-y-1.5 pt-2 animate-in fade-in duration-200">
                  {completedTasks.map(task => (
                    <div
                      key={task.id}
                      className="glass-panel bg-slate-950/40 border border-slate-800/60 rounded-2xl p-2.5 flex items-center justify-between gap-3 text-slate-400"
                    >
                      <button
                        type="button"
                        onClick={() => uncompleteTask(task.id)}
                        className="flex items-center gap-2.5 flex-1 min-w-0 text-right pressable cursor-pointer group"
                        title="اضغط لإلغاء الإنجاز وإعادة المهمة كغير مكتملة"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:text-amber-400 shrink-0 transition-colors" />
                        <span className="text-xs line-through text-slate-400 group-hover:text-slate-200 truncate">{task.title}</span>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => uncompleteTask(task.id)}
                          className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-950/50 border border-amber-800/40 px-2.5 py-1 rounded-xl flex items-center gap-1 pressable cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>إلغاء الإنجاز ↩️</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 pressable cursor-pointer transition-colors"
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
        </div>
      </section>

      {/* 7. Today's Habits & Streaks (Trend 3 Vibrant Gradients & Trend 6 Micro-interactions) */}
      <section className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
              العادات والروتين اليومي
            </h2>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
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
                className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between h-24 pressable cursor-pointer relative group ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-400/60'
                    : 'glass-panel border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <span className="text-xs font-bold leading-snug line-clamp-2">{habit.title}</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isCompleted ? 'bg-emerald-400 text-slate-950 scale-105 shadow-[0_0_8px_#34d399]' : 'border-2 border-slate-600'
                  }`}>
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full mt-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 font-mono">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{habit.streakCount} أيام متواصلة</span>
                  </div>

                  {isCompleted && (
                    <span className="text-[9px] text-amber-400/90 font-bold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40 flex items-center gap-0.5">
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
