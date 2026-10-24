import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Pin,
  PinOff,
  ChevronRight, 
  ChevronLeft, 
  Coffee, 
  Compass, 
  Trash2,
  Scissors,
  CalendarDays,
  Target,
  RotateCcw,
  Save,
  Check,
  ChevronDown,
  X,
  ArrowUpDown
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { 
  generateWeeklySchedulePlan, 
  minutesToTimeString, 
  timeStringToMinutes 
} from '../engines/scheduler';
import { 
  getCairoSaturdayWeekStart, 
  getWeekDates, 
  addDaysToDateString,
  isDateInMidtermExamPeriod,
  type ArabicDay 
} from '../lib/dateUtils';
import { fireConfettiSuccess } from '../lib/confetti';
import type { ScheduleBlock, WeekMode, Goal } from '../types';

export const WeeklyScheduleWorkspace: React.FC = () => {
  const { 
    tasks, 
    timetableSlots, 
    availabilityRules, 
    goals, 
    schedulePlans,
    scheduleBlocks,
    academicQuizzes,
    saveWeeklyPlan,
    togglePinBlock,
    moveBlockToDay,
    splitScheduleBlock,
    removeBlockFromWeek,
    replanWeek,
    toggleTaskStatus
  } = useAppStore();

  // Navigation State: Saturday of target week
  const [currentWeekStart, setCurrentWeekStart] = useState<string>(() => getCairoSaturdayWeekStart());
  const [selectedDay, setSelectedDay] = useState<ArabicDay>('السبت');
  const [selectedMode] = useState<WeekMode>('NORMAL');
  const [showUnscheduled, setShowUnscheduled] = useState<boolean>(true);

  // Modal: Move block to another day
  const [movingBlock, setMovingBlock] = useState<ScheduleBlock | null>(null);
  const [targetMoveDay, setTargetMoveDay] = useState<ArabicDay>('السبت');
  const [targetMoveStartTime, setTargetMoveStartTime] = useState<string>('09:00');

  // Compute 7 calendar dates for current week (Saturday -> Friday)
  const weekDays = useMemo(() => getWeekDates(currentWeekStart), [currentWeekStart]);
  const weekEndDate = weekDays[6].dateStr;

  // Auto-detect if week is in midterm exam period
  const hasExamsInWeek = useMemo(() => {
    return weekDays.some(d => isDateInMidtermExamPeriod(d.dateStr));
  }, [weekDays]);

  const activeMode: WeekMode = hasExamsInWeek ? 'EXAMS' : selectedMode;

  // Find existing plan in database
  const existingPlan = schedulePlans.find(p => p.weekStartDate === currentWeekStart);

  // Gather blocks associated with this week
  const weekPlanBlocks = scheduleBlocks.filter(b => 
    b.planId === `plan-week-${currentWeekStart}` || 
    (b.date && b.date >= currentWeekStart && b.date <= weekEndDate)
  );

  // Generate proposal / simulation
  const proposal = useMemo(() => {
    return generateWeeklySchedulePlan({
      tasks,
      timetableSlots,
      availabilityRules,
      goals,
      weekStartDate: currentWeekStart,
      mode: activeMode,
      pinnedBlocks: weekPlanBlocks.filter(b => b.isUserPinned),
      existingPlan,
      quizzes: academicQuizzes
    });
  }, [
    tasks, 
    timetableSlots, 
    availabilityRules, 
    goals, 
    currentWeekStart, 
    activeMode, 
    academicQuizzes, 
    existingPlan,
    weekPlanBlocks.length
  ]);

  const isCommitted = existingPlan?.status === 'COMMITTED';
  const displayPlan = existingPlan || proposal.plan;
  const displayBlocks = (isCommitted && weekPlanBlocks.length > 0) ? weekPlanBlocks : proposal.scheduleBlocks;
  const displayUnplaced = proposal.unplacedItems;

  // Filter blocks for the selected day tab
  const dayBlocks = displayBlocks
    .filter(b => b.day === selectedDay)
    .sort((a, b) => timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime));

  const availableHours = Math.round((displayPlan.availableFlexibleMinutes / 60) * 10) / 10;
  const requiredHours = Math.round((displayPlan.requiredFlexibleMinutes / 60) * 10) / 10;
  const overloadHours = Math.round((displayPlan.unscheduledMinutes / 60) * 10) / 10;

  // Date formatting for header
  const formatDateArabic = (dateStr: string) => {
    const parts = dateStr.split('-').map(Number);
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
  };

  const weekHeaderLabel = `أسبوع ${formatDateArabic(currentWeekStart)} – ${formatDateArabic(weekEndDate)}`;

  // Goal Breadcrumb Helper
  const getBreadcrumb = (goalId?: string) => {
    if (!goalId) return null;
    const goalMap = new Map(goals.map(g => [g.id, g]));
    const goal = goalMap.get(goalId);
    if (!goal) return null;

    if (goal.id.startsWith('B26-') || goal.planId === 'ahmed-lifeos-2026-bridge') {
      let rel2027: string | undefined;
      if (goal.relatedExisting2027GoalIds?.length) {
        rel2027 = goalMap.get(goal.relatedExisting2027GoalIds[0])?.title;
      }
      return (
        <span className="text-[10px] text-amber-300/90 font-medium truncate flex items-center gap-1">
          <Target className="w-2.5 h-2.5 text-amber-400 shrink-0" />
          <span className="truncate">{goal.title}</span>
          {rel2027 && (
            <span className="text-slate-400 text-[9px] shrink-0">
              (يمهد إلى: {rel2027.slice(0, 24)}..)
            </span>
          )}
        </span>
      );
    }

    // Climb to annual / vision
    let annual = '';
    let curr: Goal | undefined = goal;
    while (curr) {
      if (curr.horizon === 'ANNUAL') annual = curr.title;
      curr = curr.parentGoalId ? goalMap.get(curr.parentGoalId) : undefined;
    }

    return (
      <span className="text-[10px] text-sky-300 font-medium truncate flex items-center gap-1">
        <Target className="w-2.5 h-2.5 text-sky-400 shrink-0" />
        <span className="truncate">{goal.title}</span>
        {annual && <span className="text-slate-400 text-[9px] shrink-0">← {annual.slice(0, 20)}..</span>}
      </span>
    );
  };

  // Top 3 Weekly Priority Tasks
  const topPriorityTasks = useMemo(() => {
    const taskIdsInWeek = new Set(displayBlocks.map(b => b.taskId).filter(Boolean));
    return tasks
      .filter(t => taskIdsInWeek.has(t.id))
      .sort((a, b) => {
        const scoreA = a.priority === 'P1_URGENT_IMPORTANT' ? 50 : 20;
        const scoreB = b.priority === 'P1_URGENT_IMPORTANT' ? 50 : 20;
        return scoreB - scoreA;
      })
      .slice(0, 3);
  }, [tasks, displayBlocks]);

  // Handlers
  const handleCommitPlan = async () => {
    fireConfettiSuccess();
    await saveWeeklyPlan(
      { ...proposal.plan, status: 'COMMITTED' },
      proposal.scheduleBlocks,
      [...proposal.weeklyItems, ...proposal.unplacedItems]
    );
  };

  const handleReplan = async () => {
    fireConfettiSuccess();
    await replanWeek(currentWeekStart, activeMode);
  };

  const handleOpenMoveModal = (block: ScheduleBlock) => {
    setMovingBlock(block);
    setTargetMoveDay(block.day);
    setTargetMoveStartTime(block.startTime);
  };

  const handleConfirmMove = async () => {
    if (!movingBlock) return;
    const targetObj = weekDays.find(d => d.arabicDay === targetMoveDay);
    const targetDate = targetObj ? targetObj.dateStr : currentWeekStart;
    await moveBlockToDay(movingBlock.id, targetMoveDay, targetDate, targetMoveStartTime);
    setMovingBlock(null);
  };

  return (
    <div className="space-y-4 pb-28 pt-2 relative" dir="rtl">
      {/* Ambient Blue Schedule Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Header & Week Selector */}
      <header className="apple-card border border-sky-400/30 rounded-[28px] p-4 sm:p-5 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black text-sky-300 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-400/35 flex items-center gap-1 w-fit shadow-sm">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                المخطط الأسبوعي الهجين
              </span>
              {isCommitted ? (
                <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  خطة معتمدة ومحفوظة ✓
                </span>
              ) : (
                <span className="text-[10px] bg-amber-950/80 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold">
                  مسودة مقترحة (غير معتمدة)
                </span>
              )}
              {hasExamsInWeek && (
                <span className="text-[10px] bg-rose-950/80 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                  فترة امتحانات الميدتيرم 🚨
                </span>
              )}
            </div>

            <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 pt-0.5">
              <span>{weekHeaderLabel}</span>
              <Calendar className="w-5 h-5 text-sky-400" />
            </h1>
          </div>

          {/* Week Navigation Buttons */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-950/70 p-1 rounded-2xl border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setCurrentWeekStart(addDaysToDateString(currentWeekStart, -7))}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors pressable cursor-pointer"
              title="الأسبوع السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentWeekStart(getCairoSaturdayWeekStart())}
              className="text-xs font-bold text-sky-300 px-2.5 py-1 rounded-xl hover:bg-sky-500/10 transition-colors pressable cursor-pointer"
            >
              هذا الأسبوع
            </button>
            <button
              type="button"
              onClick={() => setCurrentWeekStart(addDaysToDateString(currentWeekStart, 7))}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors pressable cursor-pointer"
              title="الأسبوع التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Capacity & Overload Summary KPI Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="apple-widget p-3 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 font-bold block">الساعات المتاحة</span>
            <span className="text-sm sm:text-base font-black text-emerald-400 font-mono">{availableHours} س</span>
          </div>

          <div className="apple-widget p-3 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 font-bold block">المطلوب إنجازه</span>
            <span className="text-sm sm:text-base font-black text-sky-300 font-mono">{requiredHours} س</span>
          </div>

          <div className={`apple-widget p-3 rounded-2xl text-center ${
            displayPlan.isOverloaded ? 'border-rose-500/40 bg-rose-950/30' : 'border-sky-400/20'
          }`}>
            <span className="text-[10px] text-slate-400 font-bold block">
              {displayPlan.isOverloaded ? 'حمل زائد (عجز)' : 'ساعات الفائض / الأمان'}
            </span>
            <span className={`text-sm sm:text-base font-black font-mono ${displayPlan.isOverloaded ? 'text-rose-400' : 'text-teal-400'}`}>
              {displayPlan.isOverloaded ? `+${overloadHours} س` : `${Math.max(0, Math.round((availableHours - requiredHours) * 10) / 10)} س`}
            </span>
          </div>
        </div>

        {/* Action Bar: Commit Draft & Replan Buttons */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          {!isCommitted ? (
            <button
              type="button"
              onClick={handleCommitPlan}
              className="apple-btn-primary flex-1 min-h-[44px] text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 pressable cursor-pointer shadow-md font-bold"
            >
              <Save className="w-4 h-4" />
              <span>اعتماد خطة هذا الأسبوع 💾</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReplan}
              className="bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/30 flex-1 min-h-[44px] text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 pressable cursor-pointer font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة توزيع المهام غير المثبتة ⚡</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Top 3 Strategic Priorities of this Week */}
      {topPriorityTasks.length > 0 && (
        <section className="apple-card rounded-[24px] p-4 space-y-2.5 border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-400" />
              أهم أولويات هذا الأسبوع (من أين جاءت؟)
            </span>
          </div>

          <div className="space-y-1.5">
            {topPriorityTasks.map(task => (
              <div 
                key={task.id}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-200 truncate">{task.title}</h4>
                  {getBreadcrumb(task.goalId)}
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06]">
                  {task.estimatedMinutes} دقيقة
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. 7-Day Horizontal Scroll Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {weekDays.map(({ dateStr, arabicDay }) => {
          const isSelected = selectedDay === arabicDay;
          const count = displayBlocks.filter(b => b.day === arabicDay).length;
          const isExam = isDateInMidtermExamPeriod(dateStr);

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => setSelectedDay(arabicDay)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer flex flex-col items-center gap-1 pressable min-w-[72px] shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 text-slate-950 border-white/40 font-black shadow-lg shadow-sky-400/35'
                  : 'bg-slate-950/70 border-sky-400/15 text-slate-400 hover:text-slate-200 hover:border-sky-400/30'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>{arabicDay}</span>
                {isExam && <span className="text-[8px] bg-rose-500 text-white px-1 rounded-full font-black">ميد</span>}
              </div>
              <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-950 font-bold' : 'text-slate-400'}`}>
                {formatDateArabic(dateStr)} ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Day Timeline View */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>الجدول الزمني ليوم <strong className="text-white font-bold">{selectedDay}</strong>:</span>
          <span className="font-mono">{dayBlocks.length} كتل مجدولة</span>
        </div>

        {dayBlocks.length === 0 ? (
          <div className="glass-panel border border-slate-800/80 rounded-3xl p-8 text-center space-y-2">
            <Coffee className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300">يوم راحة أو لا توجد جلسات محجوزة</h4>
            <p className="text-xs text-slate-500">لا توجد محاضرات جامعية ثابتة أو مهام مجدولة في هذا اليوم.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dayBlocks.map(block => {
              const task = block.taskId ? tasks.find(t => t.id === block.taskId) : null;
              const isTaskDone = task?.status === 'DONE';

              return (
                <div
                  key={block.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    block.type === 'FIXED_CLASS'
                      ? 'bg-purple-950/20 border-purple-500/40 shadow-sm'
                      : isTaskDone
                      ? 'bg-slate-950/40 border-slate-900 opacity-75'
                      : block.isUserPinned
                      ? 'bg-amber-950/15 border-amber-500/40 shadow-sm'
                      : 'bg-slate-900/70 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {block.taskId ? (
                      <button
                        type="button"
                        onClick={() => toggleTaskStatus(block.taskId!)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 pressable cursor-pointer transition-colors ${
                          isTaskDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30'
                        }`}
                        title={isTaskDone ? 'اضغط لإلغاء الإنجاز' : 'اضغط لإنجاز المهمة'}
                      >
                        {isTaskDone ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </button>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center text-xs font-bold shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs font-extrabold truncate ${isTaskDone ? 'line-through text-slate-500' : 'text-white'}`}>
                          {block.title}
                        </span>
                        {block.type === 'FIXED_CLASS' && (
                          <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-700/40 px-1.5 py-0.2 rounded-full font-bold">
                            محاضرة ثابتة 🎓
                          </span>
                        )}
                        {block.isUserPinned && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full font-bold">
                            مثبت 📌
                          </span>
                        )}
                        {isTaskDone && (
                          <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-700/40 px-1.5 py-0.2 rounded-full font-bold">
                            تمت ✓
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        {block.startTime} ← {block.endTime} ({block.durationMinutes} دقيقة)
                      </span>

                      {getBreadcrumb(block.goalId)}
                    </div>
                  </div>

                  {/* Micro actions per block */}
                  <div className="flex items-center gap-1 shrink-0">
                    {block.type === 'TASK' && (
                      <>
                        {/* Pin / Unpin Button */}
                        <button
                          type="button"
                          onClick={() => togglePinBlock(block.id)}
                          className={`p-1.5 rounded-lg transition-colors pressable cursor-pointer ${
                            block.isUserPinned
                              ? 'text-amber-300 hover:bg-amber-500/20'
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                          }`}
                          title={block.isUserPinned ? 'إلغاء تثبيت الموعد' : 'تثبيت موعد الجلسة'}
                        >
                          {block.isUserPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                        </button>

                        {/* Move to another day */}
                        <button
                          type="button"
                          onClick={() => handleOpenMoveModal(block)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors pressable cursor-pointer"
                          title="نقل الجلسة ليوم آخر"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Split session if >= 90 mins */}
                        {block.durationMinutes >= 90 && (
                          <button
                            type="button"
                            onClick={() => splitScheduleBlock(block.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors pressable cursor-pointer"
                            title="تقسيم الجلسة إلى فترتين"
                          >
                            <Scissors className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Remove from this week (Task preserved safely!) */}
                        <button
                          type="button"
                          onClick={() => removeBlockFromWeek(block.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors pressable cursor-pointer"
                          title="إزالة من جدول الأسبوع (المهمة الأصلية محفوظة بأمان)"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Section: "لم تُجدول بعد" (Unscheduled Items & Checkpoints) */}
      {displayUnplaced.length > 0 && (
        <section className="apple-card rounded-[24px] p-4 space-y-3 border border-white/[0.08]">
          <button
            type="button"
            onClick={() => setShowUnscheduled(!showUnscheduled)}
            className="w-full flex items-center justify-between text-right pressable cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-white">
                مهام لم تُجدول في ساعات الأسبوع ({displayUnplaced.length})
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showUnscheduled ? 'rotate-180' : ''}`} />
          </button>

          {showUnscheduled && (
            <div className="space-y-2 pt-1 border-t border-white/[0.06]">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                هذه المهام لم تحجز وقتاً بالجدول إما بسبب حماية فترة امتحانات الميدتيرم، أو ضيق السعة، أو لأنها نقاط مراجعة بدون وقت تقديري (0 دقيقة). مهامك الأصلية محفوظة تماماً.
              </p>

              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {displayUnplaced.map(item => (
                  <div 
                    key={item.id}
                    className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="text-xs font-bold text-slate-200 block truncate">{item.labelSnapshot}</span>
                      <span className="text-[10px] text-amber-300/80 font-medium block">
                        السبب: {item.unplacedReason || 'خارج السعة'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06]">
                        {item.plannedMinutes} د
                      </span>
                      {item.taskId && (
                        <button
                          type="button"
                          onClick={() => {
                            // Quick manual placement on today
                            const targetObj = weekDays.find(d => d.arabicDay === selectedDay);
                            const targetDate = targetObj ? targetObj.dateStr : currentWeekStart;
                            moveBlockToDay(
                              `sched-manual-${item.taskId}-${Date.now()}`,
                              selectedDay,
                              targetDate,
                              '16:00'
                            );
                          }}
                          className="text-[10px] text-sky-400 hover:text-sky-300 font-bold underline px-1"
                        >
                          جدولها اليوم
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* MODAL: Move Block to Another Day */}
      {movingBlock && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-sky-400/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">نقل الجلسة ليوم آخر</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setMovingBlock(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="text-[11px] text-slate-400 block">الجلسة المحددة:</span>
                <span className="text-xs font-bold text-white">{movingBlock.title}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">المدة: {movingBlock.durationMinutes} دقيقة</span>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">اختر اليوم المستهدف:</label>
                <select
                  value={targetMoveDay}
                  onChange={e => setTargetMoveDay(e.target.value as ArabicDay)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {weekDays.map(d => (
                    <option key={d.dateStr} value={d.arabicDay}>
                      {d.arabicDay} ({formatDateArabic(d.dateStr)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">وقت البدء:</label>
                <input
                  type="time"
                  value={targetMoveStartTime}
                  onChange={e => setTargetMoveStartTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setMovingBlock(null)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMove}
                  className="apple-btn-primary text-xs font-bold px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  تأكيد النقل وحفظ الموعد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
