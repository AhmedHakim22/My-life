import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  Sparkles, 
  AlertCircle,
  X,
  Layers,
  ChevronDown,
  Check
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { getCairoDateString } from '../lib/dateUtils';
import { fireConfettiSuccess } from '../lib/confetti';
import { CHALLENGE_90_DAYS_PRESET, CHALLENGE_30_DAYS_PRESET, CHALLENGE_21_DAYS_PRESET } from '../engines/challengesPresets';
import type { Challenge, ChallengeCategory, ChallengeTaskTemplate } from '../types';

export const ChallengesWorkspace: React.FC = () => {
  const { 
    challenges, 
    challengeLogs, 
    createChallenge, 
    deleteChallenge, 
    activateChallenge, 
    pauseChallenge, 
    toggleChallengeTaskToday, 
    completeChallengeManually,
    showToast 
  } = useAppStore();

  const todayStr = getCairoDateString();
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'GRID_90' | 'ALL'>('ACTIVE');
  const [selectedChallengeForGrid, setSelectedChallengeForGrid] = useState<string | null>(null);

  // Modal State for New Challenge
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDurationDays, setNewDurationDays] = useState<number>(30);
  const [newCategory, setNewCategory] = useState<ChallengeCategory>('MINDSET');
  const [newXpReward, setNewXpReward] = useState<number>(300);
  const [newTasks, setNewTasks] = useState<ChallengeTaskTemplate[]>([
    { id: 't1', title: 'مهمة 1', durationMinutes: 15, isMandatory: true, icon: '⚡' }
  ]);
  const [taskInputTitle, setTaskInputTitle] = useState('');
  const [taskInputMinutes, setTaskInputMinutes] = useState<number>(15);
  const [taskInputIcon, setTaskInputIcon] = useState('⭐');

  // Filter lists
  const activeChallenges = challenges.filter(c => c.status === 'ACTIVE');
  const queuedChallenges = challenges.filter(c => c.status === 'QUEUED' || c.status === 'PAUSED');
  const completedChallenges = challenges.filter(c => c.status === 'COMPLETED');
  const isAtMaxActive = activeChallenges.length >= 3;

  // The 90-day challenge instance
  const ninetyDayChallenge = challenges.find(c => c.id === 'challenge-90-days' || c.durationDays === 90);

  // Active challenge for grid viewing
  const gridChallenge = selectedChallengeForGrid 
    ? challenges.find(c => c.id === selectedChallengeForGrid) 
    : (ninetyDayChallenge || activeChallenges[0] || challenges[0]);

  // Today's logs lookup
  const getTodayCompletedTasks = (challengeId: string): string[] => {
    const log = challengeLogs.find(l => l.challengeId === challengeId && l.date === todayStr);
    return log?.completedTaskIds || [];
  };

  // Handle Quick Activation of 90-day preset
  const handleActivate90DaysPreset = async () => {
    if (isAtMaxActive) {
      showToast('⚠️ لديك 3 تحديات نشطة بالفعل! أوقف أو أكمل أحدها أولاً.');
      return;
    }
    let target = challenges.find(c => c.id === 'challenge-90-days');
    if (!target) {
      const id = await createChallenge({
        ...CHALLENGE_90_DAYS_PRESET,
        status: 'ACTIVE'
      });
      target = challenges.find(c => c.id === id);
      showToast('🚀 تم تفعيل روتين التسعين يوم × تسعين دقيقة بنجاح!');
      fireConfettiSuccess();
    } else {
      const res = await activateChallenge(target.id);
      if (res.success) {
        showToast('🚀 تم تفعيل روتين التسعين يوم!');
        fireConfettiSuccess();
      }
    }
  };

  // Add task to form
  const handleAddTaskToForm = () => {
    if (!taskInputTitle.trim()) return;
    const newTask: ChallengeTaskTemplate = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      title: taskInputTitle.trim(),
      durationMinutes: taskInputMinutes > 0 ? taskInputMinutes : 10,
      icon: taskInputIcon || '⭐',
      isMandatory: true
    };
    setNewTasks([...newTasks, newTask]);
    setTaskInputTitle('');
  };

  const handleRemoveTaskFromForm = (taskId: string) => {
    setNewTasks(newTasks.filter(t => t.id !== taskId));
  };

  // Submit new challenge
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('يرجى كتابة عنوان التحدي');
      return;
    }
    if (newTasks.length === 0) {
      showToast('أضف مهمة يومية واحدة على الأقل للتحدي');
      return;
    }

    const shouldStartActive = !isAtMaxActive;
    await createChallenge({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
      durationDays: newDurationDays,
      category: newCategory,
      xpReward: newXpReward,
      status: shouldStartActive ? 'ACTIVE' : 'QUEUED',
      tasks: newTasks
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewTasks([{ id: 't1', title: 'مهمة 1', durationMinutes: 15, isMandatory: true, icon: '⚡' }]);
    
    if (shouldStartActive) {
      showToast('🔥 تم إنشاء التحدي وتفعيله بنجاح!');
    } else {
      showToast('⏳ تم وضع التحدي في قائمة الانتظار لأن لديك 3 تحديات نشطة بالفعل.');
    }
  };

  return (
    <div className="space-y-6 pb-28 max-w-4xl mx-auto px-2 sm:px-4">
      {/* Top Header */}
      <header className="apple-card rounded-[28px] p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_14px_rgba(245,158,11,0.2)]">
                <Trophy className="w-6 h-6" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">نظام التحديات والانضباط</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              روتين الـ 90 يوم والتحديات المتتالية — الحد الأقصى <span className="text-amber-400 font-bold">3 تحديات نشطة</span> معاً.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>تحدي جديد</span>
            </button>
          </div>
        </div>

        {/* Status Bar / Active count banner */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">التحديات النشطة:</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map(idx => (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                    idx <= activeChallenges.length
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                      : 'bg-slate-900/80 text-slate-500 border border-white/5'
                  }`}
                >
                  {idx}
                </div>
              ))}
            </div>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              isAtMaxActive 
                ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40' 
                : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
            }`}>
              {activeChallenges.length} من 3
            </span>
          </div>

          {isAtMaxActive && (
            <span className="text-amber-400 text-[11px] font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              وصلت للحد الأقصى (3 تحديات نشطة) للحفاظ على التركيز.
            </span>
          )}
        </div>

        {/* Tab switchers */}
        <div className="mt-4 apple-segmented-container grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE')}
            className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'ACTIVE'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>النشطة ({activeChallenges.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('GRID_90')}
            className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'GRID_90'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>مخطط الـ 90 يوم</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'ALL'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>الكل ({challenges.length})</span>
          </button>
        </div>
      </header>

      {/* QUICK PRESET BANNER (If 90-day challenge is not currently active) */}
      {(!ninetyDayChallenge || ninetyDayChallenge.status !== 'ACTIVE') && (
        <div className="glass-panel border-2 border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-slate-900/80 to-amber-950/20 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <h3 className="text-base font-bold text-white">روتين التسعين يوم × تسعين دقيقة</h3>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  +1000 XP
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                7 مهام يومية محكمة بإجمالي 90 دقيقة فقط (استحمام بارد، ورد قرآن، رياضة، قراءة، عناية ذاتية، مهارة، وتر ومراجعة). جاهز للتفعيل بنقرة واحدة!
              </p>
            </div>

            <button
              type="button"
              onClick={handleActivate90DaysPreset}
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>تفعيل التحدي الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: ACTIVE CHALLENGES */}
      {activeTab === 'ACTIVE' && (
        <div className="space-y-4">
          {activeChallenges.length === 0 ? (
            <div className="glass-panel border border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">لا توجد تحديات نشطة حالياً</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                ابدأ الآن بتفعيل روتين الـ 90 يوم أو أنشئ تحدياً مخصصاً (رياضي، إيماني، قراءة أو مهارة) لتشعل حماسك وتضاعف نقاط خبرتك!
              </p>
              <button
                type="button"
                onClick={handleActivate90DaysPreset}
                className="mt-2 inline-flex items-center gap-2 bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow hover:bg-amber-400 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>تفعيل روتين الـ 90 يوم</span>
              </button>
            </div>
          ) : (
            activeChallenges.map(challenge => {
              const completedTaskIds = getTodayCompletedTasks(challenge.id);
              const totalTasksCount = challenge.tasks.length;
              const completedTasksCount = completedTaskIds.length;
              const totalMinutes = challenge.tasks.reduce((sum, t) => sum + (t.durationMinutes || 0), 0);
              const completedMinutes = challenge.tasks
                .filter(t => completedTaskIds.includes(t.id))
                .reduce((sum, t) => sum + (t.durationMinutes || 0), 0);
              const isTodayCompleted = completedTasksCount >= totalTasksCount && totalTasksCount > 0;
              const progressPct = Math.min(100, Math.round((challenge.completedDaysCount / challenge.durationDays) * 100));

              return (
                <div
                  key={challenge.id}
                  className="glass-panel border border-amber-500/30 bg-slate-900/80 rounded-3xl p-5 space-y-4 shadow-xl relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                        {challenge.trophyIcon || '🏆'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-black text-white">{challenge.title}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30">
                            اليوم {challenge.currentDay || 1} من {challenge.durationDays}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                            +{challenge.xpReward} XP
                          </span>
                        </div>
                        {challenge.description && (
                          <p className="text-xs text-slate-400 mt-1">{challenge.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChallengeForGrid(challenge.id);
                          setActiveTab('GRID_90');
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                        title="عرض المخطط الشهري"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[11px] hidden sm:inline">المخطط</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => pauseChallenge(challenge.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                        title="إيقاف مؤقت"
                      >
                        <Pause className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] hidden sm:inline">إيقاف</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => completeChallengeManually(challenge.id)}
                        className="p-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                        title="إتمام التحدي الآن"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span className="text-[11px] hidden sm:inline">إتمام</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف تحدي "${challenge.title}"؟`)) {
                            deleteChallenge(challenge.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 text-xs font-semibold cursor-pointer transition-all"
                        title="حذف التحدي"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Overall Challenge Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>إنجاز التحدي العام: {challenge.completedDaysCount} يوماً مكتملة</span>
                      <span className="font-mono font-bold text-amber-400">{progressPct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Today's Tasks Checklist */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>مهام اليوم ({completedTasksCount}/{totalTasksCount})</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {completedMinutes}/{totalMinutes} دقيقة
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {challenge.tasks.map(task => {
                        const isDone = completedTaskIds.includes(task.id);
                        return (
                          <div
                            key={task.id}
                            onClick={() => toggleChallengeTaskToday(challenge.id, task.id)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                              isDone
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <button
                                type="button"
                                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                  isDone
                                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                                    : 'border border-slate-600 bg-slate-900 text-transparent'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>
                              <div className="truncate">
                                <p className={`text-xs font-bold truncate ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                                  {task.icon} {task.title}
                                </p>
                              </div>
                            </div>

                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 whitespace-nowrap">
                              {task.durationMinutes} د
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {isTodayCompleted && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>عاش يا بطل! أتممت جميع مهام التحدي لهذا اليوم بالكامل 🎉</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: INTERACTIVE 90-DAY MONTHLY GRID (Workbook Layout from PDF) */}
      {activeTab === 'GRID_90' && (
        <div className="glass-panel border border-slate-800 bg-slate-900/80 rounded-3xl p-5 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  مخطط التتبع: {gridChallenge?.title || 'روتين الـ 90 يوم'}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                تتبع التزامك اليومي على مدار 3 شهور متتالية (30 يوماً لكل شهر) تماماً كما في كراسة روتين الـ 90 يوم.
              </p>
            </div>

            {challenges.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">اختر التحدي:</span>
                <select
                  value={gridChallenge?.id || ''}
                  onChange={(e) => setSelectedChallengeForGrid(e.target.value)}
                  className="bg-slate-950 text-white text-xs px-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none"
                >
                  {challenges.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.durationDays} يوم)</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Three Months Grid Sections */}
          {[
            { monthNumber: 1, label: 'الشهر الأول (الأيام 1 - 30)', startDay: 1, endDay: 30 },
            { monthNumber: 2, label: 'الشهر الثاني (الأيام 31 - 60)', startDay: 31, endDay: 60 },
            { monthNumber: 3, label: 'الشهر الثالث (الأيام 61 - 90)', startDay: 61, endDay: 90 }
          ].map(section => {
            if (!gridChallenge || gridChallenge.durationDays < section.startDay) return null;
            const currentDayNumber = gridChallenge.currentDay || 1;
            const completedCount = gridChallenge.completedDaysCount || 0;

            return (
              <div key={section.monthNumber} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{section.label}</span>
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    {Math.min(30, Math.max(0, completedCount - section.startDay + 1))} / 30 مكتمل
                  </span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {Array.from({ length: section.endDay - section.startDay + 1 }, (_, i) => {
                    const dayNum = section.startDay + i;
                    if (dayNum > gridChallenge.durationDays) return null;

                    const isDone = dayNum <= completedCount;
                    const isCurrent = dayNum === currentDayNumber && gridChallenge.status === 'ACTIVE';

                    return (
                      <div
                        key={dayNum}
                        className={`h-12 rounded-xl border flex flex-col items-center justify-center transition-all select-none ${
                          isDone
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm'
                            : isCurrent
                            ? 'bg-amber-950/50 border-amber-500 text-amber-300 ring-2 ring-amber-500/40'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="text-xs font-mono font-bold">{dayNum}</span>
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isCurrent ? (
                          <span className="text-[9px] font-bold text-amber-400">اليوم</span>
                        ) : (
                          <span className="text-[10px] text-slate-600">○</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: ALL CHALLENGES (Active, Queued, Completed) */}
      {activeTab === 'ALL' && (
        <div className="space-y-6">
          {/* Queued Challenges */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>في قائمة الانتظار والمجدولة ({queuedChallenges.length})</span>
            </h3>

            {queuedChallenges.length === 0 ? (
              <p className="text-xs text-slate-500">لا توجد تحديات مجدولة في الانتظار.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {queuedChallenges.map(challenge => (
                  <div
                    key={challenge.id}
                    className="glass-panel border border-slate-800/80 bg-slate-900/60 rounded-2xl p-4 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-white">{challenge.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950/60 text-sky-300 border border-sky-500/30">
                          {challenge.durationDays} يوم
                        </span>
                      </div>
                      {challenge.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{challenge.description}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                      <span className="text-xs font-bold text-amber-400">+{challenge.xpReward} XP</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await activateChallenge(challenge.id);
                            if (res.success) {
                              showToast(`تم تفعيل تحدي "${challenge.title}" 🔥`);
                            } else if (res.reason === 'MAX_3_ACTIVE_REACHED') {
                              showToast('⚠️ لا يمكن التفعيل: لديك 3 تحديات نشطة بالفعل! أوقف أو أكمل أحدها أولاً.');
                            }
                          }}
                          className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer transition-all"
                        >
                          <Play className="w-3 h-3 fill-slate-950" />
                          <span>تفعيل</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteChallenge(challenge.id)}
                          className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Challenges */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>التحديات المكتملة والأوسمة ({completedChallenges.length})</span>
            </h3>

            {completedChallenges.length === 0 ? (
              <p className="text-xs text-slate-500">لم يكتمل أي تحدٍ بعد. التزم وأنهِ أول تحدٍ لتحصد الأوسمة!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completedChallenges.map(challenge => (
                  <div
                    key={challenge.id}
                    className="glass-panel border border-emerald-500/30 bg-emerald-950/10 rounded-2xl p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{challenge.trophyIcon || '🏆'}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{challenge.title}</h4>
                        <p className="text-xs text-emerald-400">
                          مكتمل 100% ({challenge.durationDays} يوماً)
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-400">+{challenge.xpReward} XP</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CREATE CUSTOM CHALLENGE */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel border border-slate-800 bg-slate-900 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">إنشاء تحدي مخصص جديد</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم التحدي *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: تحدي الاستيقاظ المبكر والرياضة"
                  className="w-full bg-slate-950 text-white rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">وصف أو هدف التحدي</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="ما الذي تريد الوصول إليه بهذا التحدي؟"
                  rows={2}
                  className="w-full bg-slate-950 text-white rounded-xl px-3.5 py-2 border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">المدة (أيام)</label>
                  <select
                    value={newDurationDays}
                    onChange={(e) => {
                      const d = parseInt(e.target.value);
                      setNewDurationDays(d);
                      setNewXpReward(d === 90 ? 1000 : d === 60 ? 600 : d === 30 ? 300 : d === 21 ? 200 : 100);
                    }}
                    className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                  >
                    <option value={7}>7 أيام (أسبوع)</option>
                    <option value={14}>14 يوماً</option>
                    <option value={21}>21 يوماً (عادة جديدة)</option>
                    <option value={30}>30 يوماً (شهر كامل)</option>
                    <option value={60}>60 يوماً (شهرين)</option>
                    <option value={90}>90 يوماً (روتين 90)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">التصنيف</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ChallengeCategory)}
                    className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                  >
                    <option value="MINDSET">ذهني وتطوير</option>
                    <option value="FITNESS">صحة ورياضة</option>
                    <option value="STUDY">دراسة وأكاديمي</option>
                    <option value="READING">قراءة وكتب</option>
                    <option value="FAITH">إيماني وتعبد</option>
                    <option value="GENERAL">عام</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">المكافأة (XP)</label>
                  <input
                    type="number"
                    value={newXpReward}
                    onChange={(e) => setNewXpReward(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                  />
                </div>
              </div>

              {/* Tasks Builder */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold">المهام اليومية المطلوبة ({newTasks.length})</label>
                  <span className="text-[11px] font-mono text-amber-400">
                    الإجمالي: {newTasks.reduce((s, t) => s + (t.durationMinutes || 0), 0)} دقيقة/يوم
                  </span>
                </div>

                {/* List of added tasks */}
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {newTasks.map(t => (
                    <div key={t.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="font-semibold text-white">{t.icon} {t.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">{t.durationMinutes} د</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTaskFromForm(t.id)}
                          className="text-slate-500 hover:text-rose-400 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input to add a task */}
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={taskInputTitle}
                    onChange={(e) => setTaskInputTitle(e.target.value)}
                    placeholder="اسم المهمة اليومية"
                    className="flex-1 bg-slate-950 text-white rounded-xl px-3 py-2 border border-slate-800"
                  />
                  <input
                    type="number"
                    value={taskInputMinutes}
                    onChange={(e) => setTaskInputMinutes(parseInt(e.target.value) || 10)}
                    className="w-16 bg-slate-950 text-white rounded-xl px-2 py-2 border border-slate-800 text-center"
                    placeholder="دقائق"
                  />
                  <button
                    type="button"
                    onClick={handleAddTaskToForm}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded-xl"
                  >
                    + إضافة
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl shadow cursor-pointer"
                >
                  حفظ وتفعيل التحدي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
