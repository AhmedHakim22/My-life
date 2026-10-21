import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  Milestone, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Archive, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Link2, 
  Layers, 
  Clock, 
  TrendingUp,
  AlertCircle,
  Eye,
  Check,
  X
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import type { Goal, Horizon, GoalMilestone, Task } from '../types';
import { fireConfettiSuccess } from '../lib/confetti';
import { getCairoDateString } from '../lib/dateUtils';

export const GoalsWorkspace: React.FC = () => {
  const { 
    goals, 
    goalMilestones, 
    goalLinks,
    tasks,
    domains, 
    createGoal, 
    updateGoal, 
    archiveGoal, 
    deleteGoal,
    addGoalMilestone,
    toggleMilestone,
    deleteMilestone,
    completeTask,
    addTask
  } = useAppStore();

  const [selectedHorizon, setSelectedHorizon] = useState<Horizon | 'ALL'>('ALL');
  const [showArchived, setShowArchived] = useState(false);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  // Modals state
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [selectedGoalForMilestone, setSelectedGoalForMilestone] = useState<string | null>(null);
  const [selectedGoalForTask, setSelectedGoalForTask] = useState<string | null>(null);

  // New Goal Form
  const [newTitle, setNewTitle] = useState('');
  const [newWhyItMatters, setNewWhyItMatters] = useState('');
  const [newHorizon, setNewHorizon] = useState<Horizon>('ANNUAL');
  const [newDomainId, setNewDomainId] = useState<string>('');
  const [newTargetDate, setNewTargetDate] = useState('');
  const [newParentGoalId, setNewParentGoalId] = useState<string>('');

  // New Milestone Form
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneWeight, setNewMilestoneWeight] = useState(25);
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  // New Linked Task Form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('P2_IMPORTANT');
  const [newTaskMinutes, setNewTaskMinutes] = useState(30);

  // Filtered Goals
  const filteredGoals = goals.filter(g => {
    const matchesArchived = showArchived ? g.isArchived : !g.isArchived;
    const matchesHorizon = selectedHorizon === 'ALL' || g.horizon === selectedHorizon;
    return matchesArchived && matchesHorizon;
  });

  // KPI Calculations
  const activeGoalsCount = goals.filter(g => !g.isArchived && g.status !== 'ACHIEVED').length;
  const achievedGoalsCount = goals.filter(g => g.status === 'ACHIEVED').length;
  const totalMilestones = goalMilestones.length;
  const completedMilestones = goalMilestones.filter(m => m.status === 'COMPLETED').length;

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await createGoal({
      title: newTitle.trim(),
      whyItMatters: newWhyItMatters.trim(),
      horizon: newHorizon,
      domainId: newDomainId || undefined,
      parentGoalId: newParentGoalId || undefined,
      targetDate: newTargetDate || undefined,
      status: 'IN_PROGRESS',
      isArchived: false
    });

    fireConfettiSuccess();
    setNewTitle('');
    setNewWhyItMatters('');
    setNewTargetDate('');
    setNewParentGoalId('');
    setIsAddGoalModalOpen(false);
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForMilestone || !newMilestoneTitle.trim()) return;

    await addGoalMilestone({
      goalId: selectedGoalForMilestone,
      title: newMilestoneTitle.trim(),
      weight: Number(newMilestoneWeight) || 25,
      targetDate: newMilestoneDate || undefined,
      status: 'PENDING',
      sortOrder: goalMilestones.filter(m => m.goalId === selectedGoalForMilestone).length + 1
    });

    setNewMilestoneTitle('');
    setSelectedGoalForMilestone(null);
  };

  const handleAddLinkedTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForTask || !newTaskTitle.trim()) return;

    await addTask(
      newTaskTitle.trim(),
      newTaskPriority,
      newTaskMinutes,
      getCairoDateString(),
      selectedGoalForTask
    );

    fireConfettiSuccess();
    setNewTaskTitle('');
    setSelectedGoalForTask(null);
  };

  const getHorizonBadge = (h: Horizon) => {
    switch (h) {
      case 'LONG_TERM':
        return { label: 'رؤية 3-5 سنوات', bg: 'bg-indigo-950/80 border-indigo-700/50 text-indigo-300' };
      case 'ANNUAL':
        return { label: 'هدف سنوي', bg: 'bg-emerald-950/80 border-emerald-700/50 text-emerald-300' };
      case 'QUARTERLY':
        return { label: 'هدف ربع سنوي Q', bg: 'bg-sky-950/80 border-sky-700/50 text-sky-300' };
      case 'MONTHLY':
        return { label: 'هدف شهري', bg: 'bg-amber-950/80 border-amber-700/50 text-amber-300' };
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded-full">
              الهرم الاستراتيجي
            </span>
            <span className="text-xs text-slate-400">Goals & Roadmaps</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
            <span>مركز الأهداف والمسارات</span>
            <Target className="w-6 h-6 text-sky-400" />
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 pressable cursor-pointer ${
              showArchived 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{showArchived ? 'الأهداف النشطة' : 'الأرشيف'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddGoalModalOpen(true)}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-sky-500/25 border border-sky-300/40 pressable cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>هدف استراتيجي جديد</span>
          </button>
        </div>
      </div>

      {/* 2. Top Strategic KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="glass-panel p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold">أهداف نشطة</span>
          <div className="text-xl font-black text-sky-400 mt-0.5 font-mono">{activeGoalsCount}</div>
        </div>
        <div className="glass-panel p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold">معالم منجزة</span>
          <div className="text-xl font-black text-emerald-400 mt-0.5 font-mono">
            {completedMilestones} <span className="text-xs text-slate-500">/ {totalMilestones}</span>
          </div>
        </div>
        <div className="glass-panel p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold">أهداف محققة</span>
          <div className="text-xl font-black text-purple-400 mt-0.5 font-mono">{achievedGoalsCount}</div>
        </div>
        <div className="glass-panel p-3 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold">نسبة التحقق</span>
          <div className="text-xl font-black text-amber-400 mt-0.5 font-mono">
            {totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* 3. Horizon Segmented Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'ALL', label: 'جميع الآفاق' },
          { id: 'LONG_TERM', label: 'رؤية 3-5 سنوات 🔮' },
          { id: 'ANNUAL', label: 'أهداف سنوية 🎯' },
          { id: 'QUARTERLY', label: 'ربع سنوية Q 🚀' },
          { id: 'MONTHLY', label: 'أهداف الشهر 📅' },
        ].map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedHorizon(item.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all pressable cursor-pointer ${
              selectedHorizon === item.id
                ? 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold shadow-md shadow-sky-500/20'
                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 4. Goals List */}
      {filteredGoals.length === 0 ? (
        <div className="glass-panel rounded-3xl p-8 text-center space-y-3 border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto text-sky-400">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">
            {showArchived ? 'لا توجد أهداف مؤرشفة' : 'لا توجد أهداف في هذا الأفق الزمني'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            اربط طموحاتك الكبرى بخطوات ومراحل واضحة. ابدأ بإضافة هدفك السنوي أو ربع السنوي الآن.
          </p>
          {!showArchived && (
            <button
              type="button"
              onClick={() => setIsAddGoalModalOpen(true)}
              className="mt-2 bg-sky-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl pressable cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة هدف أول</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGoals.map(goal => {
            const isExpanded = expandedGoalId === goal.id;
            const badge = getHorizonBadge(goal.horizon);
            const domain = domains.find(d => d.id === goal.domainId);
            const milestones = goalMilestones.filter(m => m.goalId === goal.id);
            const linkedTasks = tasks.filter(t => t.goalId === goal.id);
            const parentGoal = goals.find(g => g.id === goal.parentGoalId);

            return (
              <div
                key={goal.id}
                className="glass-panel rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-all overflow-hidden"
              >
                {/* Goal Card Header */}
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        {domain && (
                          <span 
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-900/80 border-slate-700"
                            style={{ color: domain.color }}
                          >
                            {domain.name}
                          </span>
                        )}
                        {parentGoal && (
                          <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                            <span>متفرع من:</span>
                            <strong className="text-slate-300">{parentGoal.title}</strong>
                          </span>
                        )}
                      </div>

                      <h2 className="text-base font-extrabold text-white leading-tight">
                        {goal.title}
                      </h2>
                    </div>

                    <div className="text-left font-mono">
                      <span className="text-base font-black text-sky-400">
                        {goal.progressPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Why It Matters */}
                  {goal.whyItMatters && (
                    <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
                      💡 <strong className="text-slate-200">الدافع والأثر:</strong> {goal.whyItMatters}
                    </p>
                  )}

                  {/* Explainable Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>
                        المعالم: {milestones.filter(m => m.status === 'COMPLETED').length} من {milestones.length} مكتملة
                      </span>
                      {goal.targetDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-sky-400" />
                          المستهدف: {goal.targetDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expand / Collapse & Quick Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                    <button
                      type="button"
                      onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                      className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 pressable cursor-pointer"
                    >
                      <span>{isExpanded ? 'إخفاء التفاصيل والمعالم' : 'عرض المعالم والمهام المرتبطة'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedGoalForMilestone(goal.id)}
                        className="text-[11px] font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 pressable cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-sky-400" />
                        <span>معلم</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedGoalForTask(goal.id)}
                        className="text-[11px] font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 pressable cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-emerald-400" />
                        <span>مهمة</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => archiveGoal(goal.id)}
                        aria-label="أرشفة الهدف"
                        className="p-1 text-slate-500 hover:text-amber-400 pressable cursor-pointer"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section: Milestones & Linked Tasks */}
                {isExpanded && (
                  <div className="bg-slate-950/60 p-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
                    {/* A. Milestones List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <Milestone className="w-3.5 h-3.5 text-sky-400" />
                          <span>المعالم المرحلية (Milestones)</span>
                        </h4>
                        <span className="text-[10px] text-slate-500">الأوزان تحدد نسبة الإنجاز</span>
                      </div>

                      {milestones.length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic p-2 bg-slate-900/40 rounded-xl">
                          لا توجد معالم مرحلية مضافة بعد. أضف معلماً لتقسيم هذا الهدف الكبير إلى مراحل قابلة للقياس.
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {milestones.map(ms => {
                            const isDone = ms.status === 'COMPLETED';
                            return (
                              <div
                                key={ms.id}
                                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                                  isDone 
                                    ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-400' 
                                    : 'bg-slate-900/70 border-slate-800 text-slate-200'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleMilestone(ms.id)}
                                  className="flex items-center gap-2.5 flex-1 min-w-0 text-right pressable cursor-pointer"
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                                  )}
                                  <span className={`text-xs font-medium truncate ${isDone ? 'line-through text-slate-500' : ''}`}>
                                    {ms.title}
                                  </span>
                                </button>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded">
                                    وزن {ms.weight}%
                                  </span>
                                  {ms.targetDate && (
                                    <span className="text-[10px] text-slate-500">
                                      {ms.targetDate}
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => deleteMilestone(ms.id)}
                                    className="text-slate-600 hover:text-rose-400 p-0.5 pressable cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* B. Linked Daily Execution Tasks */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/40">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>المهام اليومية المرتبطة بهذا الهدف</span>
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-400">
                          {linkedTasks.filter(t => t.status === 'DONE').length} / {linkedTasks.length} منجزة
                        </span>
                      </div>

                      {linkedTasks.length === 0 ? (
                        <p className="text-[11px] text-slate-500 italic p-2 bg-slate-900/40 rounded-xl">
                          لا توجد مهام يومية مرتبطة حالياً. يمكنك ربط أي مهمة أو إضافة مهمة جديدة مباشرة.
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {linkedTasks.map(t => {
                            const isDone = t.status === 'DONE';
                            return (
                              <div
                                key={t.id}
                                className={`p-2 rounded-xl border flex items-center justify-between ${
                                  isDone 
                                    ? 'bg-slate-950/30 border-slate-900 text-slate-500 line-through' 
                                    : 'bg-slate-900/50 border-slate-800 text-slate-200'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => !isDone && completeTask(t.id)}
                                  className="flex items-center gap-2 flex-1 min-w-0 text-right pressable cursor-pointer"
                                >
                                  {isDone ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  )}
                                  <span className="text-xs truncate">{t.title}</span>
                                </button>
                                <span className="text-[10px] font-mono text-slate-500">
                                  {t.estimatedMinutes} دقيقة
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Add Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl p-5 w-full max-w-lg space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-sky-400" />
                <span>إضافة هدف استراتيجي جديد</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsAddGoalModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  عنوان الهدف *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="مثال: التأهل لتدريب أشباه الموصلات، إطلاق أول تشكيلة فالكون..."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  لماذا هذا الهدف مهم؟ (الدافع والأثر الحقيقي) *
                </label>
                <textarea
                  value={newWhyItMatters}
                  onChange={e => setNewWhyItMatters(e.target.value)}
                  placeholder="ما الذي سيتغير في مستقبلك أو شخصيتك إذا حققته؟"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    الأفق الزمني
                  </label>
                  <select
                    value={newHorizon}
                    onChange={e => setNewHorizon(e.target.value as Horizon)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="ANNUAL">هدف سنوي (12 شهر)</option>
                    <option value="QUARTERLY">هدف ربع سنوي (3 أشهر)</option>
                    <option value="MONTHLY">هدف شهري</option>
                    <option value="LONG_TERM">رؤية كبرى (3-5 سنوات)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    مجال الحياة
                  </label>
                  <select
                    value={newDomainId}
                    onChange={e => setNewDomainId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="">عام / شخصي</option>
                    {domains.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    التاريخ المستهدف للإنجاز
                  </label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={e => setNewTargetDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    تابع لهدف أكبر (هرمية الأهداف)
                  </label>
                  <select
                    value={newParentGoalId}
                    onChange={e => setNewParentGoalId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="">بدون (هدف رئيسي مستقل)</option>
                    {goals.filter(g => !g.isArchived).map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-extrabold text-xs px-5 py-2 rounded-xl shadow-lg shadow-sky-500/25 pressable cursor-pointer"
                >
                  حفظ الهدف والبدء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add Milestone Modal */}
      {selectedGoalForMilestone && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl p-5 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Milestone className="w-5 h-5 text-sky-400" />
                <span>إضافة معلم مرحلي (Milestone)</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setSelectedGoalForMilestone(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  عنوان المعلم *
                </label>
                <input
                  type="text"
                  value={newMilestoneTitle}
                  onChange={e => setNewMilestoneTitle(e.target.value)}
                  placeholder="مثال: إنهاء كورس أشباه الموصلات، تسليم مسودة البحث..."
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    الوزن النسبي (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={newMilestoneWeight}
                    onChange={e => setNewMilestoneWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    تاريخ الاستحقاق
                  </label>
                  <input
                    type="date"
                    value={newMilestoneDate}
                    onChange={e => setNewMilestoneDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedGoalForMilestone(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 text-slate-950 font-extrabold text-xs px-5 py-2 rounded-xl shadow-lg shadow-sky-500/25 pressable cursor-pointer"
                >
                  إضافة المعلم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Add Linked Task Modal */}
      {selectedGoalForTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>إضافة مهمة تنفيذية مرتبطة بالهدف</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setSelectedGoalForTask(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLinkedTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  عنوان المهمة *
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="خطوة إجرائية صغيرة قابلة للإنجاز اليوم..."
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    الأولوية
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="P1_URGENT_IMPORTANT">أولوية قصوى P1</option>
                    <option value="P2_IMPORTANT">أولوية استراتيجية P2</option>
                    <option value="P3_NORMAL">مهمة عادية P3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    المدة التقديرية (دقيقة)
                  </label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    value={newTaskMinutes}
                    onChange={e => setNewTaskMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedGoalForTask(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 text-slate-950 font-extrabold text-xs px-5 py-2 rounded-xl shadow-lg shadow-emerald-500/25 pressable cursor-pointer"
                >
                  إضافة المهمة للهدف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
