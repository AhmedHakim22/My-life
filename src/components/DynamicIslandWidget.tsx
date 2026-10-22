import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sun, 
  Moon, 
  Trophy, 
  Clock, 
  ArrowRight,
  Maximize2,
  Minimize2,
  Check
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { fireConfettiSuccess } from '../lib/confetti';
import { getCairoDateString } from '../lib/dateUtils';

export const DynamicIslandWidget: React.FC = () => {
  const { 
    bestNextAction, 
    prayers, 
    challenges, 
    challengeLogs, 
    completeTask, 
    showToast,
    setActiveTab 
  } = useAppStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Active challenge lookup
  const todayStr = getCairoDateString();
  const activeChallenge = challenges.find(c => c.status === 'ACTIVE');
  const challengeLog = activeChallenge ? challengeLogs.find(l => l.challengeId === activeChallenge.id && l.date === todayStr) : null;
  const challengeCompletedCount = challengeLog?.completedTaskIds.length || 0;
  const challengeTotalCount = activeChallenge?.tasks.length || 0;

  // Next prayer
  const nextPrayer = prayers?.nextPrayer;
  const freeMinutes = prayers?.freeWindowMinutes ?? 0;

  // If user dismissed it for the session or if there's no data to show
  if (isDismissed) {
    return (
      <div className="fixed top-2 left-3 z-40 sm:hidden">
        <button
          type="button"
          onClick={() => setIsDismissed(false)}
          className="w-8 h-8 rounded-full bg-slate-950/80 border border-sky-400/40 text-sky-300 flex items-center justify-center shadow-lg shadow-sky-500/20 backdrop-blur-xl pressable cursor-pointer"
          title="إظهار الكبسولة الذكية"
          aria-label="إظهار الكبسولة الذكية"
        >
          <Sparkles className="w-4 h-4 fill-sky-300" />
        </button>
      </div>
    );
  }

  const handleCompleteCurrentTask = async (taskId: string) => {
    fireConfettiSuccess();
    await completeTask(taskId);
    showToast('رائع يا بطل! تم إنجاز المهمة بنجاح (+25 XP) 🎉');
  };

  return (
    <aside 
      aria-label="الكبسولة الذكية للتنبيهات الحية"
      className="sticky top-2 z-30 w-full max-w-md sm:max-w-xl mx-auto px-2 pointer-events-none transition-all duration-300 ease-out"
    >
      <div className="pointer-events-auto">
        {!isExpanded ? (
          /* ========================================================
             COLLAPSED: Sleek Apple Dynamic Island Mini Capsule
             ======================================================== */
          <div
            onClick={() => setIsExpanded(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(true); } }}
            className="group h-10 px-3.5 rounded-full bg-[#16171d]/90 backdrop-blur-3xl border border-white/[0.12] hover:border-white/[0.22] shadow-[0_12px_36px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-between gap-2.5 transition-all cursor-pointer select-none pressable"
          >
            {/* Right: Next Prayer Countdown */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
              <div className="flex items-center gap-1 text-[11px] font-bold text-white">
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-sky-300">{nextPrayer?.nameArabic || 'الصلاة'}:</span>
                <span className="font-mono text-white">{nextPrayer?.timeFormatted || '--:--'}</span>
                <span className="text-[10px] text-[#8e8e93] font-mono hidden xs:inline">({freeMinutes}د)</span>
              </div>
            </div>

            {/* Center: Glowing Pulse / Status */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-[10px] text-sky-300 font-bold truncate max-w-[130px] sm:max-w-[170px]">
              <Sparkles className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="truncate">
                {bestNextAction?.task?.title || (activeChallenge ? activeChallenge.title : 'يومك منظم')}
              </span>
            </div>

            {/* Left: Challenge indicator or Expand Icon */}
            <div className="flex items-center gap-1.5 shrink-0 text-[#8e8e93] group-hover:text-white transition-colors">
              {activeChallenge && (
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.2 rounded-md hidden xs:inline">
                  {challengeCompletedCount}/{challengeTotalCount} 🏆
                </span>
              )}
              <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </div>
          </div>
        ) : (
          /* ========================================================
             EXPANDED: Apple visionOS Live Activity Card
             ======================================================== */
          <div className="apple-card-glow rounded-[26px] p-4 space-y-3 shadow-2xl border border-sky-400/25 animate-in fade-in zoom-in-95 duration-150">
            {/* Header: Title & Close/Minimize Controls */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                <span className="text-xs font-bold text-white tracking-wide">
                  الجزيرة التفاعلية • Live Activity
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-full text-[#8e8e93] hover:text-white hover:bg-white/10 transition-colors pressable cursor-pointer"
                  title="تصغير الكبسولة"
                  aria-label="تصغير الكبسولة"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => { setIsExpanded(false); setIsDismissed(true); }}
                  className="text-[10px] font-bold text-[#8e8e93] hover:text-rose-300 px-2 py-0.5 rounded-lg hover:bg-rose-500/15 transition-colors pressable cursor-pointer"
                  title="إخفاء مؤقت"
                >
                  إخفاء
                </button>
              </div>
            </div>

            {/* Quick Two-Pillar Metric Strip: Prayer & Challenge */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Prayer Pillar */}
              <div 
                onClick={() => setActiveTab('FAITH')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTab('FAITH'); } }}
                className="p-2.5 rounded-2xl bg-black/30 border border-white/[0.06] hover:border-white/[0.12] flex items-center justify-between cursor-pointer transition-all pressable"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8e8e93] font-bold">صلاة {nextPrayer?.nameArabic || 'القادمة'}</div>
                    <div className="font-mono font-bold text-white text-xs">{nextPrayer?.timeFormatted}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                  {freeMinutes} د
                </span>
              </div>

              {/* Challenge Pillar */}
              <div 
                onClick={() => setActiveTab('CHALLENGES')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTab('CHALLENGES'); } }}
                className="p-2.5 rounded-2xl bg-black/30 border border-white/[0.06] hover:border-white/[0.12] flex items-center justify-between cursor-pointer transition-all pressable"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center shrink-0">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[#8e8e93] font-bold truncate">تحدي الـ 90</div>
                    <div className="font-mono font-bold text-amber-300 text-xs">
                      {activeChallenge ? `اليوم ${activeChallenge.currentDay || 1}/90` : 'لا يوجد'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                  {challengeCompletedCount}/{challengeTotalCount}
                </span>
              </div>
            </div>

            {/* Best Next Action Hero Area inside Live Activity */}
            {bestNextAction ? (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#8e8e93] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    <span>المهمة الحالية الموصى بها الآن:</span>
                  </span>
                  <span className="text-[10px] font-mono text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-400/20">
                    {bestNextAction.task.estimatedMinutes} دقيقة
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-black/30 border border-white/[0.06] flex items-center justify-between gap-3">
                  <span className="text-xs sm:text-sm font-bold text-white truncate flex-1">
                    {bestNextAction.task.title}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCompleteCurrentTask(bestNextAction.task.id)}
                    className="apple-btn-primary text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shrink-0 pressable cursor-pointer shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>تم (+25 XP)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>جميع المهام ذات الأولوية منجزة بنجاح! راحة مستحقة ✨</span>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
