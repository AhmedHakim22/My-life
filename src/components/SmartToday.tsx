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
  Zap,
  Target
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { CloudSyncModal } from './CloudSyncModal';
import { fireConfettiSuccess } from '../lib/confetti';
import { getCairoDateString } from '../lib/dateUtils';

export const SmartToday: React.FC = () => {
  const { 
    prayers, 
    bestNextAction, 
    tasks, 
    goals,
    completeTask, 
    postponeTask, 
    readTwoPagesAction,
    bookDetails, 
    habits, 
    toggleHabitToday,
    rankProgress,
    setActiveTab,
    syncStatus
  } = useAppStore();

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const currentReadingBook = bookDetails.find(b => b.shelf === 'Reading') || bookDetails[0];
  const pendingTasks = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS');
  // Truthful Top 3 ranked priorities according to recommendation engine
  const todayTasks = bestNextAction 
    ? [bestNextAction.task, ...bestNextAction.alternativeTasks].slice(0, 3)
    : pendingTasks.slice(0, 3);

  // Format today date in Arabic
  const todayFormatted = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const handleCompleteTask = async (taskId: string) => {
    fireConfettiSuccess();
    await completeTask(taskId);
  };

  const handleReadTwoPages = async (resourceId: string) => {
    fireConfettiSuccess();
    await readTwoPagesAction(resourceId);
  };

  const handleToggleHabit = async (habitId: string) => {
    const todayStr = getCairoDateString();
    const habit = habits.find(h => h.id === habitId);
    if (habit && habit.lastCompletedDate !== todayStr) {
      fireConfettiSuccess();
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
            صباح النور يا بطل 👋
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all pressable cursor-pointer ${
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

          {/* Rank Badge with 3D Orbital Glow (Trend 8) */}
          <button
            type="button"
            onClick={() => setActiveTab('JOURNAL')}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-950/70 to-slate-900 border border-purple-500/40 hover:border-purple-400/80 rounded-2xl px-3 py-1.5 transition-all pressable cursor-pointer shadow-lg shadow-purple-950/40"
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

      {/* 2. Cairo Astronomical Prayer Awareness Bar (Trend 4 Glassmorphism & Trend 3 Gradients) */}
      <section className="glass-panel-emerald rounded-2xl p-3.5 flex items-center justify-between shadow-lg relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 border border-emerald-400/30 shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
              <span>صلاة {prayers.nextPrayer.nameArabic} القادمة</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="text-[11px] text-emerald-300/90 font-mono mt-0.5">
              الساعة <strong>{prayers.nextPrayer.timeFormatted}</strong> (متبقي {prayers.freeWindowMinutes} دقيقة)
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold text-emerald-200 bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-600/40 shadow-inner">
            القاهرة 📍
          </span>
          <span className="text-[9px] text-emerald-400/70 font-mono">حساب فلكي دقيق</span>
        </div>
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
                className="flex-1 bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 pressable cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>أنجزتها الآن (+25 XP)</span>
              </button>

              <button
                type="button"
                onClick={() => postponeTask(bestNextAction.task.id)}
                className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 font-bold text-xs py-3 px-3.5 rounded-xl flex items-center justify-center gap-1.5 border border-slate-700/60 pressable cursor-pointer"
                title="تأجيل المهمة لوقت لاحق"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تأجيل</span>
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
                  className="w-5 h-5 rounded-lg border-2 border-slate-600 hover:border-sky-400 hover:bg-sky-500/20 flex items-center justify-center shrink-0 transition-colors pressable cursor-pointer"
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
              </div>
            </div>
          ))}
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
            const isCompleted = habit.lastCompletedDate === todayStr;

            return (
              <button
                type="button"
                key={habit.id}
                onClick={() => handleToggleHabit(habit.id)}
                className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between h-24 pressable cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
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

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 font-mono mt-2">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{habit.streakCount} أيام متواصلة</span>
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
