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
  X,
  Edit3,
  Filter,
  FolderTree,
  GitFork
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import type { Goal, Horizon, GoalMilestone, Task } from '../types';
import { fireConfettiSuccess } from '../lib/confetti';
import { getCairoDateString } from '../lib/dateUtils';
import { AHMED_2027_PLAN_CONFIG } from '../db/ahmedGoals2027Data';
import { AHMED_2026_BRIDGE_CONFIG } from '../db/ahmedGoals2026BridgeData';

export const GoalsWorkspace: React.FC = () => {
  const { 
    goals, 
    goalMilestones, 
    goalLinks,
    intentions,
    goalIntentions,
    tasks,
    domains, 
    createGoal, 
    updateGoal, 
    archiveGoal, 
    deleteGoal,
    addGoalMilestone,
    updateMilestone,
    toggleMilestone,
    deleteMilestone,
    completeTask,
    toggleTaskStatus,
    addTask,
    deleteTask,
    linkIntentionToGoal,
    unlinkIntentionFromGoal,
    setActiveTab
  } = useAppStore();

  // Primary View Switcher: Mobile Month Focus vs Full Strategic Hierarchy vs Visual Tree
  type GoalWorkspaceView = 'CURRENT_MONTH' | 'HIERARCHY' | 'TREE';
  const [activeView, setActiveView] = useState<GoalWorkspaceView>('CURRENT_MONTH');

  // Filter States
  const [selectedHorizon, setSelectedHorizon] = useState<Horizon | 'ALL'>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    const cur = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    if (cur <= '2026-11') return '2026-11';
    if (cur === '2026-12') return '2026-12';
    if (cur >= '2027-01' && cur <= '2027-12') return cur;
    return '2026-11';
  });
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');
  const [selectedParentGoalFilter, setSelectedParentGoalFilter] = useState<string>('ALL');
  const [showArchived, setShowArchived] = useState(false);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  // Tree View Expandable Sets
  const [expandedVisions, setExpandedVisions] = useState<Set<string>>(
    new Set(['V-FAITH', 'V-FAMILY', 'V-SCIENCE', 'V-FALCON', 'V-FINANCE', 'V-AI', 'V-HEALTH', 'V-READ'])
  );
  const [expandedAnnuals, setExpandedAnnuals] = useState<Set<string>>(
    new Set(['A-QURAN', 'A-READ', 'A-FALCON', 'A-UNI', 'B26-A-UNI', 'B26-A-SCIENCE', 'B26-A-FAITH', 'B26-A-READ'])
  );
  const [expandedQuarters, setExpandedQuarters] = useState<Set<string>>(
    new Set(['Q1-QURAN', 'Q1-READ', 'Q1-FALCON', 'Q1-UNI', 'B26-Q4-UNI', 'B26-Q4-READ'])
  );

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
  const [newSelectedIntentionId, setNewSelectedIntentionId] = useState<string>('');

  // New Milestone Form
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneWeight, setNewMilestoneWeight] = useState(25);
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  // New Linked Task Form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('P2_IMPORTANT');
  const [newTaskMinutes, setNewTaskMinutes] = useState(30);

  // Edit Goal Form State
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editWhyItMatters, setEditWhyItMatters] = useState('');
  const [editHorizon, setEditHorizon] = useState<Horizon>('ANNUAL');
  const [editDomainId, setEditDomainId] = useState<string>('');
  const [editTargetDate, setEditTargetDate] = useState('');
  const [editParentGoalId, setEditParentGoalId] = useState<string>('');
  const [editSelectedIntentionId, setEditSelectedIntentionId] = useState<string>('');
  const [editStatus, setEditStatus] = useState<Goal['status']>('IN_PROGRESS');

  // Edit Milestone Form State
  const [editingMilestone, setEditingMilestone] = useState<GoalMilestone | null>(null);
  const [editMilestoneTitle, setEditMilestoneTitle] = useState('');
  const [editMilestoneWeight, setEditMilestoneWeight] = useState(25);
  const [editMilestoneDate, setEditMilestoneDate] = useState('');
  const [editMilestoneStatus, setEditMilestoneStatus] = useState<GoalMilestone['status']>('PENDING');

  // Months of 2026 Bridge & 2027 Strategic Architecture
  const PLAN_MONTHS = [
    { key: '2026-11', label: 'نوفمبر 2026', short: 'نوفمبر 26', num: 11, year: 2026, isBridge: true },
    { key: '2026-12', label: 'ديسمبر 2026', short: 'ديسمبر 26', num: 12, year: 2026, isBridge: true },
    { key: '2027-01', label: 'يناير 2027', short: 'يناير', num: 1, year: 2027 },
    { key: '2027-02', label: 'فبراير 2027', short: 'فبراير', num: 2, year: 2027 },
    { key: '2027-03', label: 'مارس 2027', short: 'مارس', num: 3, year: 2027 },
    { key: '2027-04', label: 'أبريل 2027', short: 'أبريل', num: 4, year: 2027 },
    { key: '2027-05', label: 'مايو 2027', short: 'مايو', num: 5, year: 2027 },
    { key: '2027-06', label: 'يونيو 2027', short: 'يونيو', num: 6, year: 2027 },
    { key: '2027-07', label: 'يوليو 2027', short: 'يوليو', num: 7, year: 2027 },
    { key: '2027-08', label: 'أغسطس 2027', short: 'أغسطس', num: 8, year: 2027 },
    { key: '2027-09', label: 'سبتمبر 2027', short: 'سبتمبر', num: 9, year: 2027 },
    { key: '2027-10', label: 'أكتوبر 2027', short: 'أكتوبر', num: 10, year: 2027 },
    { key: '2027-11', label: 'نوفمبر 2027', short: 'نوفمبر 27', num: 11, year: 2027 },
    { key: '2027-12', label: 'ديسمبر 2027', short: 'ديسمبر 27', num: 12, year: 2027 },
  ];

  const formatEgyptianDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const y = parts[0];
      const mIdx = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (mIdx >= 0 && mIdx < 12) {
        return `${d} ${months[mIdx]} ${y}`;
      }
    }
    return dateStr;
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

  // Breadcrumb Ancestor Resolver: رؤية ← سنوي ← ربع سنوي ← شهري
  const getGoalBreadcrumbs = (goal: Goal) => {
    const crumbs: Array<{ id: string; title: string; horizon: Horizon; label: string; bg: string }> = [];
    let curr: Goal | undefined = goal;
    const visited = new Set<string>();

    while (curr && curr.parentGoalId && !visited.has(curr.id)) {
      visited.add(curr.id);
      const parent = goals.find(g => g.id === curr!.parentGoalId || (g.refId && g.refId === curr!.parentGoalId));
      if (parent) {
        const b = getHorizonBadge(parent.horizon);
        crumbs.unshift({
          id: parent.id,
          title: parent.title,
          horizon: parent.horizon,
          label: b.label,
          bg: b.bg
        });
        curr = parent;
      } else {
        break;
      }
    }
    return crumbs;
  };

  // Filtered Goals for CURRENT_MONTH
  const currentMonthGoals = goals.filter(g => {
    const matchesArchived = showArchived ? g.isArchived : !g.isArchived;
    if (!matchesArchived) return false;
    if (g.horizon !== 'MONTHLY') return false;
    const matchesMonth = selectedMonth === 'ALL' || 
      (g.targetDate && g.targetDate.startsWith(selectedMonth)) || 
      (g.startDate && g.startDate.startsWith(selectedMonth)) ||
      (g.refId && (
        (selectedMonth === '2026-11' && g.refId.includes('M11')) ||
        (selectedMonth === '2026-12' && g.refId.includes('M12')) ||
        g.refId.startsWith('M' + selectedMonth.slice(5))
      ));
    const matchesDomain = selectedDomainFilter === 'ALL' || g.domainId === selectedDomainFilter;
    const matchesParent = selectedParentGoalFilter === 'ALL' || g.parentGoalId === selectedParentGoalFilter;
    return matchesMonth && matchesDomain && matchesParent;
  });

  // Filtered Goals for HIERARCHY
  const hierarchyFilteredGoals = goals.filter(g => {
    const matchesArchived = showArchived ? g.isArchived : !g.isArchived;
    if (!matchesArchived) return false;
    const matchesHorizon = selectedHorizon === 'ALL' || g.horizon === selectedHorizon;
    const matchesDomain = selectedDomainFilter === 'ALL' || g.domainId === selectedDomainFilter;
    const matchesParent = selectedParentGoalFilter === 'ALL' || g.parentGoalId === selectedParentGoalFilter;
    const matchesMonth = selectedHorizon !== 'MONTHLY' || selectedMonth === 'ALL' || 
      (g.targetDate && g.targetDate.startsWith(selectedMonth)) ||
      (g.startDate && g.startDate.startsWith(selectedMonth)) ||
      (g.refId && (
        (selectedMonth === '2026-11' && g.refId.includes('M11')) ||
        (selectedMonth === '2026-12' && g.refId.includes('M12')) ||
        g.refId.startsWith('M' + selectedMonth.slice(5))
      ));
    return matchesHorizon && matchesDomain && matchesParent && matchesMonth;
  });

  // KPI Calculations
  const activeGoalsCount = goals.filter(g => !g.isArchived && g.status !== 'ACHIEVED').length;
  const achievedGoalsCount = goals.filter(g => g.status === 'ACHIEVED').length;
  const totalMilestones = goalMilestones.length;
  const completedMilestones = goalMilestones.filter(m => m.status === 'COMPLETED').length;
  const totalMonthlyGoals = goals.filter(g => g.horizon === 'MONTHLY' && !g.isArchived).length;

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoalId = await createGoal({
      title: newTitle.trim(),
      whyItMatters: newWhyItMatters.trim(),
      horizon: newHorizon,
      domainId: newDomainId || undefined,
      parentGoalId: newParentGoalId || undefined,
      targetDate: newTargetDate || undefined,
      status: 'IN_PROGRESS',
      isArchived: false
    });

    if (newSelectedIntentionId) {
      await linkIntentionToGoal(newGoalId, newSelectedIntentionId);
    }

    fireConfettiSuccess();
    setNewTitle('');
    setNewWhyItMatters('');
    setNewTargetDate('');
    setNewParentGoalId('');
    setNewSelectedIntentionId('');
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

  const openEditGoalModal = (goal: Goal) => {
    setEditingGoal(goal);
    setEditTitle(goal.title);
    setEditWhyItMatters(goal.whyItMatters || '');
    setEditHorizon(goal.horizon);
    setEditDomainId(goal.domainId || '');
    setEditTargetDate(goal.targetDate || '');
    setEditParentGoalId(goal.parentGoalId || '');
    setEditStatus(goal.status);

    const linkedIntention = goalIntentions.find(gi => gi.goalId === goal.id);
    setEditSelectedIntentionId(linkedIntention?.intentionId || '');
  };

  const handleSaveEditGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !editTitle.trim()) return;

    await updateGoal(editingGoal.id, {
      title: editTitle.trim(),
      whyItMatters: editWhyItMatters.trim(),
      horizon: editHorizon,
      domainId: editDomainId || undefined,
      targetDate: editTargetDate || undefined,
      parentGoalId: editParentGoalId || undefined,
      status: editStatus
    });

    const currentIntentionLink = goalIntentions.find(gi => gi.goalId === editingGoal.id);
    if (currentIntentionLink && currentIntentionLink.intentionId !== editSelectedIntentionId) {
      await unlinkIntentionFromGoal(editingGoal.id, currentIntentionLink.intentionId);
    }
    if (editSelectedIntentionId && (!currentIntentionLink || currentIntentionLink.intentionId !== editSelectedIntentionId)) {
      await linkIntentionToGoal(editingGoal.id, editSelectedIntentionId);
    }

    setEditingGoal(null);
    fireConfettiSuccess();
  };

  const handleDeleteGoal = async (goal: Goal) => {
    const isConfirmed = window.confirm(`هل أنت متأكد من حذف الهدف "${goal.title}" وجميع معالمه المرتبطة نهائياً؟`);
    if (isConfirmed) {
      await deleteGoal(goal.id);
    }
  };

  const openEditMilestoneModal = (ms: GoalMilestone) => {
    setEditingMilestone(ms);
    setEditMilestoneTitle(ms.title);
    setEditMilestoneWeight(ms.weight || 25);
    setEditMilestoneDate(ms.targetDate || '');
    setEditMilestoneStatus(ms.status);
  };

  const handleSaveEditMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone || !editMilestoneTitle.trim()) return;

    await updateMilestone(editingMilestone.id, {
      title: editMilestoneTitle.trim(),
      weight: Number(editMilestoneWeight) || 25,
      targetDate: editMilestoneDate || undefined,
      status: editMilestoneStatus
    });

    setEditingMilestone(null);
    fireConfettiSuccess();
  };

  const handleDeleteMilestone = async (ms: GoalMilestone) => {
    const isConfirmed = window.confirm(`هل أنت متأكد من حذف المعلم "${ms.title}"؟`);
    if (isConfirmed) {
      await deleteMilestone(ms.id);
    }
  };

  const toggleVisionExpand = (vId: string) => {
    setExpandedVisions(prev => {
      const next = new Set(prev);
      if (next.has(vId)) next.delete(vId);
      else next.add(vId);
      return next;
    });
  };

  const toggleAnnualExpand = (aId: string) => {
    setExpandedAnnuals(prev => {
      const next = new Set(prev);
      if (next.has(aId)) next.delete(aId);
      else next.add(aId);
      return next;
    });
  };

  const toggleQuarterExpand = (qId: string) => {
    setExpandedQuarters(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const expandAllTree = () => {
    const vIds = goals.filter(g => g.horizon === 'LONG_TERM').map(g => g.id);
    const aIds = goals.filter(g => g.horizon === 'ANNUAL').map(g => g.id);
    const qIds = goals.filter(g => g.horizon === 'QUARTERLY').map(g => g.id);
    setExpandedVisions(new Set(vIds));
    setExpandedAnnuals(new Set(aIds));
    setExpandedQuarters(new Set(qIds));
  };

  const collapseAllTree = () => {
    setExpandedVisions(new Set());
    setExpandedAnnuals(new Set());
    setExpandedQuarters(new Set());
  };

  const handleOpenAddSubgoal = (parentGoal: Goal) => {
    let nextHorizon: Horizon = 'ANNUAL';
    if (parentGoal.horizon === 'LONG_TERM') nextHorizon = 'ANNUAL';
    else if (parentGoal.horizon === 'ANNUAL') nextHorizon = 'QUARTERLY';
    else if (parentGoal.horizon === 'QUARTERLY') nextHorizon = 'MONTHLY';
    else nextHorizon = 'MONTHLY';

    setNewHorizon(nextHorizon);
    setNewDomainId(parentGoal.domainId || '');
    setNewParentGoalId(parentGoal.id);
    setIsAddGoalModalOpen(true);
  };

  // Reusable Goal Card Renderer with Breadcrumbs, Explanations, Milestones, and Actions
  const renderGoalCard = (goal: Goal) => {
    const isExpanded = expandedGoalId === goal.id;
    const badge = getHorizonBadge(goal.horizon);
    const domain = domains.find(d => d.id === goal.domainId);
    const milestones = goalMilestones.filter(m => m.goalId === goal.id);
    const linkedTasks = tasks.filter(t => t.goalId === goal.id);
    const breadcrumbs = getGoalBreadcrumbs(goal);
    const linkedIntents = goalIntentions
      .filter(gi => gi.goalId === goal.id)
      .map(gi => intentions.find(i => i.id === gi.intentionId))
      .filter(Boolean);

    return (
      <div
        key={goal.id}
        id={`goal-card-${goal.id}`}
        className="glass-panel rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-all overflow-hidden"
      >
        {/* Goal Card Header */}
        <div className="p-4 space-y-3">
          {/* Breadcrumbs (رؤية ← سنوي ← ربع سنوي) */}
          {breadcrumbs.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 text-[10px] text-slate-400 bg-slate-950/40 px-2.5 py-1.5 rounded-xl border border-slate-800/50">
              <span className="font-bold text-slate-400">المسار الاستراتيجي:</span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.id}>
                  {idx > 0 && <span className="text-slate-600">←</span>}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedParentGoalFilter(crumb.id);
                      setActiveView('HIERARCHY');
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors hover:brightness-125 cursor-pointer ${crumb.bg}`}
                    title={`انتقل إلى الهدف الأب: ${crumb.title}`}
                  >
                    {crumb.label}: {crumb.title}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {goal.refId && (
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-sky-300">
                    {goal.refId}
                  </span>
                )}
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
                {goal.status === 'ACHIEVED' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                    مكتمل 🏆
                  </span>
                )}
                {goal.bridge2026 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950/90 text-purple-300 border border-purple-700/60 flex items-center gap-1">
                    <span>🌉 تمهيد 2026</span>
                  </span>
                )}
                {goal.priority === 'protected' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-700/60 flex items-center gap-1">
                    <span>🛡️ فترة ميدتيرم محمية</span>
                  </span>
                )}
              </div>

              <h2 className="text-base font-extrabold text-white leading-tight">
                {goal.title}
              </h2>
            </div>

            <div className="text-left font-mono shrink-0">
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

          {/* Blessed Intention: Linked or Suggestion */}
          {linkedIntents.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {linkedIntents.map(intent => (
                <span
                  key={intent!.id}
                  className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-bold"
                >
                  <span>🤲 نية: {intent!.title}</span>
                </span>
              ))}
            </div>
          ) : goal.blessedIntentionSuggestion ? (
            <div className="text-[11px] text-emerald-300/90 bg-emerald-950/30 p-2 rounded-xl border border-emerald-800/30 flex items-center gap-1.5">
              <span>🤲</span>
              <span><strong className="font-bold text-emerald-200">النية المقترحة:</strong> {goal.blessedIntentionSuggestion}</span>
            </div>
          ) : null}

          {/* Success Criteria */}
          {goal.successCriteria && (
            <div className="text-[11px] text-sky-300/90 bg-sky-950/30 p-2 rounded-xl border border-sky-800/30 flex items-start gap-1.5">
              <span className="shrink-0 mt-0.5">🎯</span>
              <span><strong className="font-bold text-sky-200">معيار التحقق والنجاح:</strong> {goal.successCriteria}</span>
            </div>
          )}

          {/* Related 2027 Goals Bridge Connection */}
          {goal.relatedExisting2027GoalIds && goal.relatedExisting2027GoalIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] bg-slate-950/60 text-sky-300 p-2 rounded-xl border border-sky-800/40">
              <span className="font-bold text-sky-200">🔗 يمهّد لأهداف 2027 السنوية:</span>
              {goal.relatedExisting2027GoalIds.map(gid => (
                <span key={gid} className="px-1.5 py-0.5 rounded bg-sky-950/80 border border-sky-700/60 text-sky-300 font-mono text-[10px] font-bold">
                  {gid}
                </span>
              ))}
            </div>
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
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-sky-400" />
                  المستهدف: {formatEgyptianDate(goal.targetDate)}
                </span>
              )}
            </div>
          </div>

          {/* Expand / Collapse & Quick Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 pressable cursor-pointer"
              >
                <span>{isExpanded ? 'إخفاء التفاصيل' : 'عرض المعالم والمهام'}</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {linkedTasks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                  className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 px-2 py-0.5 rounded-lg border border-emerald-800/40 flex items-center gap-1 cursor-pointer pressable"
                  title="عرض المهام المرتبطة"
                >
                  <span>📋 {linkedTasks.filter(t => t.status === 'DONE').length}/{linkedTasks.length} مهام</span>
                </button>
              )}

              {goal.horizon === 'MONTHLY' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('SCHEDULE')}
                  className="text-[10px] font-bold text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 px-2 py-0.5 rounded-lg border border-sky-800/40 flex items-center gap-1 cursor-pointer pressable"
                  title="الانتقال للمخطط الأسبوعي وتوزيع المهام"
                >
                  <Calendar className="w-3 h-3 text-sky-400" />
                  <span>خطط للأسبوع</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedGoalForMilestone(goal.id)}
                className="text-[11px] font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded-lg flex items-center gap-1 pressable cursor-pointer"
                title="إضافة معلم مرحلي"
              >
                <Plus className="w-3 h-3 text-sky-400" />
                <span>معلم</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGoalForTask(goal.id)}
                className="text-[11px] font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded-lg flex items-center gap-1 pressable cursor-pointer"
                title="إضافة مهمة تنفيذية"
              >
                <Plus className="w-3 h-3 text-emerald-400" />
                <span>مهمة</span>
              </button>

              {goal.horizon !== 'MONTHLY' && (
                <button
                  type="button"
                  onClick={() => handleOpenAddSubgoal(goal)}
                  className="text-[11px] font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2 py-1 rounded-lg flex items-center gap-1 pressable cursor-pointer hidden sm:flex"
                  title="إضافة هدف فرعي لهذا الهدف"
                >
                  <GitFork className="w-3 h-3 text-indigo-400" />
                  <span>هدف فرعي</span>
                </button>
              )}

              {/* Edit Goal */}
              <button
                type="button"
                onClick={() => openEditGoalModal(goal)}
                aria-label="تعديل الهدف"
                className="p-1 text-slate-400 hover:text-sky-300 hover:bg-slate-800/80 rounded-lg transition pressable cursor-pointer"
                title="تعديل الهدف"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {/* Archive / Restore Goal */}
              <button
                type="button"
                onClick={() => archiveGoal(goal.id)}
                aria-label={goal.isArchived ? "استرجاع الهدف" : "أرشفة الهدف"}
                className={`p-1 rounded-lg transition pressable cursor-pointer ${
                  goal.isArchived ? "text-amber-400 hover:bg-amber-950/40" : "text-slate-400 hover:text-amber-400 hover:bg-slate-800/80"
                }`}
                title={goal.isArchived ? "استرجاع من الأرشيف" : "أرشفة الهدف"}
              >
                <Archive className="w-3.5 h-3.5" />
              </button>

              {/* Delete Goal */}
              <button
                type="button"
                onClick={() => handleDeleteGoal(goal)}
                aria-label="حذف الهدف"
                className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition pressable cursor-pointer"
                title="حذف الهدف نهائياً"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Details Section: Milestones & Linked Tasks & Action Templates */}
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

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-mono font-bold text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded">
                            وزن {ms.weight}%
                          </span>
                          {ms.targetDate && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              {formatEgyptianDate(ms.targetDate)}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditMilestoneModal(ms)}
                            className="p-1 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded transition pressable cursor-pointer"
                            title="تعديل المعلم والوزن"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMilestone(ms)}
                            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded transition pressable cursor-pointer"
                            title="حذف المعلم"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* B. Action Templates (مقترحات التنفيذ من خطة 2027) */}
            {goal.actionTemplates && goal.actionTemplates.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/40">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>خطوات ومقترحات تنفيذية جاهزة للتفعيل</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">اضغط + لإضافتها كمهمة لليوم</span>
                </div>
                <div className="space-y-1">
                  {goal.actionTemplates.map((template, idx) => (
                    <div 
                      key={idx}
                      className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="text-slate-300 flex-1">{template}</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await addTask(
                            template,
                            'P2_IMPORTANT',
                            30,
                            getCairoDateString(),
                            goal.id
                          );
                          fireConfettiSuccess();
                        }}
                        className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 pressable cursor-pointer"
                        title="إضافة هذه الخطوة كمهمة يومية اليوم"
                      >
                        <Plus className="w-3 h-3" />
                        <span>تفعيل كمهمة</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* C. Linked Daily Execution Tasks */}
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
                        className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          isDone 
                            ? 'bg-slate-950/30 border-slate-900 text-slate-500 line-through' 
                            : 'bg-slate-900/60 border-slate-800 text-slate-200'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleTaskStatus(t.id)}
                          className="flex items-start gap-2.5 flex-1 min-w-0 text-right pressable cursor-pointer"
                          title={isDone ? 'اضغط لإلغاء الإنجاز وإعادة المهمة' : 'اضغط لإنجاز المهمة'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium leading-relaxed block">{t.title}</span>
                          </div>
                        </button>
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                          {t.dueDate && (
                            <span className="text-[10px] font-mono text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40 flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5 text-sky-400" />
                              <span>{formatEgyptianDate(t.dueDate)}</span>
                            </span>
                          )}
                          {t.priority === 'P1_URGENT_IMPORTANT' && (
                            <span className="text-[9px] font-bold text-rose-300 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800/50">
                              عاجل
                            </span>
                          )}
                          {t.estimatedMinutes > 0 && (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-950/40 px-1.5 py-0.5 rounded border border-slate-800/40">
                              {t.estimatedMinutes} د
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteTask(t.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg pressable cursor-pointer transition-colors"
                            title="حذف المهمة"
                            aria-label="حذف المهمة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
  };

  return (
    <div className="space-y-4 pb-24 pt-2">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded-full">
              الهرم الاستراتيجي 2027
            </span>
            <span className="text-xs text-slate-400">Ahmed LifeOS Goals</span>
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
            onClick={() => {
              setNewParentGoalId('');
              setNewHorizon('ANNUAL');
              setIsAddGoalModalOpen(true);
            }}
            className="apple-btn-primary text-xs font-black px-4 py-2 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-sky-500/25 pressable cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>هدف استراتيجي جديد</span>
          </button>
        </div>
      </div>

      {/* 2. Top Strategic KPIs (Apple HIG Squircles) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="apple-card p-3.5 rounded-3xl">
          <span className="text-[10px] text-slate-400 font-bold">أهداف نشطة</span>
          <div className="text-xl font-black text-sky-400 mt-1 font-mono">{activeGoalsCount}</div>
        </div>
        <div className="apple-card p-3.5 rounded-3xl">
          <span className="text-[10px] text-slate-400 font-bold">معالم منجزة</span>
          <div className="text-xl font-black text-emerald-400 mt-1 font-mono">
            {completedMilestones} <span className="text-xs text-slate-500">/ {totalMilestones}</span>
          </div>
        </div>
        <div className="apple-card p-3.5 rounded-3xl">
          <span className="text-[10px] text-slate-400 font-bold">أهداف محققة</span>
          <div className="text-xl font-black text-purple-400 mt-1 font-mono">{achievedGoalsCount}</div>
        </div>
        <div className="apple-card p-3.5 rounded-3xl">
          <span className="text-[10px] text-slate-400 font-bold">إجمالي الأهداف الشهرية</span>
          <div className="text-xl font-black text-amber-400 mt-1 font-mono">{totalMonthlyGoals}</div>
        </div>
      </div>

      {/* 3. Primary Mode Switcher: Mobile Month Focus vs Full Strategic Hierarchy vs Visual Tree */}
      <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800/80 gap-1">
        <button
          type="button"
          onClick={() => setActiveView('CURRENT_MONTH')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all pressable cursor-pointer ${
            activeView === 'CURRENT_MONTH'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>أهداف الشهر الحالي</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 font-mono">
            {currentMonthGoals.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('HIERARCHY')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all pressable cursor-pointer ${
            activeView === 'HIERARCHY'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>الهرم الاستراتيجي</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('TREE')}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all pressable cursor-pointer ${
            activeView === 'TREE'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>شجرة الرؤى (8)</span>
        </button>
      </div>

      {/* 4. VIEW A: Current Month Mobile-First Focus */}
      {activeView === 'CURRENT_MONTH' && (
        <div className="space-y-3">
          {/* 14-Month Horizontal Carousel Switcher (Nov 2026 - Dec 2027) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-sky-400" />
                <span>اختر شهر التنفيذ (2026 / 2027):</span>
              </span>
              <span className="text-[10px] font-mono text-sky-400">
                {selectedMonth.startsWith('2026') ? '8 أهداف تمهيدية + مهامها ومواعيدها' : '11 هدفاً شهرياً'}
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PLAN_MONTHS.map(m => {
                const isSelected = selectedMonth === m.key;
                const monthGoalsCount = goals.filter(g => 
                  g.horizon === 'MONTHLY' && 
                  !g.isArchived && 
                  ((g.targetDate && g.targetDate.startsWith(m.key)) || 
                   (g.startDate && g.startDate.startsWith(m.key)) ||
                   (g.refId && (
                      (m.key === '2026-11' && g.refId.includes('M11')) ||
                      (m.key === '2026-12' && g.refId.includes('M12')) ||
                      g.refId.startsWith('M' + m.key.slice(5))
                   )))
                ).length;

                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setSelectedMonth(m.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all flex items-center gap-1.5 pressable cursor-pointer ${
                      isSelected
                        ? m.isBridge
                          ? 'bg-purple-600 text-white border-purple-400 font-extrabold shadow-md shadow-purple-600/30'
                          : 'bg-sky-500 text-slate-950 border-sky-400 font-extrabold shadow-md shadow-sky-500/25'
                        : m.isBridge
                          ? 'bg-purple-950/40 border-purple-800/60 text-purple-300 hover:text-purple-200'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{m.label}</span>
                    {m.isBridge && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-purple-900/80 text-purple-200 border border-purple-700/50">
                        تمهيد
                      </span>
                    )}
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-slate-950/30 text-inherit' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {monthGoalsCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedDomainFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                selectedDomainFilter === 'ALL'
                  ? 'bg-slate-700 text-white border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              جميع المجالات
            </button>
            {domains.map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDomainFilter(d.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                  selectedDomainFilter === d.id
                    ? 'bg-slate-800 text-white border-slate-600'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                style={selectedDomainFilter === d.id ? { borderColor: d.color, color: d.color } : {}}
              >
                {d.name}
              </button>
            ))}
          </div>

          {/* Monthly Goals List */}
          {currentMonthGoals.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center space-y-3 border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto text-sky-400">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">
                لا توجد أهداف شهرية مطابقة للشهر والمجال المحددين
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {selectedMonth.startsWith('2026')
                  ? 'خطة نوفمبر وديسمبر 2026 تحتوي على 8 أهداف تمهيدية مع مهامها ومواعيدها الدقيقة. يمكنك إعادة ضبط الفلتر لعرض جميع مجالات هذا الشهر.'
                  : 'خطتك لعام 2027 تحتوي على 11 هدفاً شهرياً لكل شهر. يمكنك إعادة ضبط الفلتر لعرض جميع مجالات هذا الشهر.'}
              </p>
              {selectedDomainFilter !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setSelectedDomainFilter('ALL')}
                  className="mt-2 bg-sky-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl pressable cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>عرض كل مجالات هذا الشهر</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {currentMonthGoals.map(renderGoalCard)}
            </div>
          )}
        </div>
      )}

      {/* 5. VIEW B: Full Strategic Hierarchy (All Horizons) */}
      {activeView === 'HIERARCHY' && (
        <div className="space-y-3">
          {/* Horizon Segmented Filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'ALL', label: `جميع الآفاق (${goals.filter(g => !g.isArchived).length})` },
              { id: 'LONG_TERM', label: `رؤية 3-5 سنوات 🔮 (${goals.filter(g => g.horizon === 'LONG_TERM' && !g.isArchived).length})` },
              { id: 'ANNUAL', label: `أهداف سنوية 🎯 (${goals.filter(g => g.horizon === 'ANNUAL' && !g.isArchived).length})` },
              { id: 'QUARTERLY', label: `ربع سنوية Q 🚀 (${goals.filter(g => g.horizon === 'QUARTERLY' && !g.isArchived).length})` },
              { id: 'MONTHLY', label: `أهداف الشهر 📅 (${goals.filter(g => g.horizon === 'MONTHLY' && !g.isArchived).length})` },
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

          {/* Life Domain Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedDomainFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                selectedDomainFilter === 'ALL'
                  ? 'bg-slate-700 text-white border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              جميع المجالات
            </button>
            {domains.map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDomainFilter(d.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                  selectedDomainFilter === d.id
                    ? 'bg-slate-800 text-white border-slate-600'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                style={selectedDomainFilter === d.id ? { borderColor: d.color, color: d.color } : {}}
              >
                {d.name}
              </button>
            ))}
          </div>

          {/* Active Parent Goal Filter Badge */}
          {selectedParentGoalFilter !== 'ALL' && (
            <div className="flex items-center justify-between bg-sky-950/40 border border-sky-800/60 p-2.5 rounded-xl text-xs">
              <span className="text-sky-300 font-bold flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5" />
                <span>عرض الأهداف المتفرعة من:</span>
                <strong className="text-white">
                  {goals.find(g => g.id === selectedParentGoalFilter)?.title || selectedParentGoalFilter}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedParentGoalFilter('ALL')}
                className="text-xs text-sky-400 hover:text-sky-200 px-2 py-0.5 rounded bg-sky-900/50 cursor-pointer"
              >
                إلغاء فلتر الأب ✕
              </button>
            </div>
          )}

          {/* Goals List */}
          {hierarchyFilteredGoals.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center space-y-3 border border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mx-auto text-sky-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">
                {showArchived ? 'لا توجد أهداف مؤرشفة' : 'لا توجد أهداف مطابقة للفلاتر المحددة'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                يمكنك توسيع الفلتر لعرض جميع الآفاق والمجالات، أو إضافة هدف جديد مباشرة.
              </p>
              {!showArchived && (
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(true)}
                  className="mt-2 bg-sky-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl pressable cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة هدف جديد</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {hierarchyFilteredGoals.map(renderGoalCard)}
            </div>
          )}
        </div>
      )}

      {/* 6. VIEW C: Interactive Strategic Tree (Visions -> Annual -> Quarter -> Month) */}
      {activeView === 'TREE' && (
        <div className="space-y-3">
          {/* Tree Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={expandAllTree}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                توسيع كل الفروع ⤢
              </button>
              <button
                type="button"
                onClick={collapseAllTree}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                طي كل الفروع ⤡
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">
              8 رؤى كبرى ← 11 هدفاً سنوياً ← 44 هدفاً ربع سنوي ← 132 هدفاً شهرياً
            </span>
          </div>

          {/* Domain Filter Pills for Tree */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedDomainFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                selectedDomainFilter === 'ALL'
                  ? 'bg-slate-700 text-white border-slate-600'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              جميع مجالات الرؤى (8)
            </button>
            {domains.map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDomainFilter(d.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap border transition-all cursor-pointer ${
                  selectedDomainFilter === d.id
                    ? 'bg-slate-800 text-white border-slate-600'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                style={selectedDomainFilter === d.id ? { borderColor: d.color, color: d.color } : {}}
              >
                {d.name}
              </button>
            ))}
          </div>

          {/* Tree Nodes List */}
          <div className="space-y-4">
            {goals
              .filter(g => {
                const matchesArchived = showArchived ? g.isArchived : !g.isArchived;
                if (!matchesArchived) return false;
                if (g.horizon !== 'LONG_TERM') return false;
                if (selectedDomainFilter !== 'ALL' && g.domainId !== selectedDomainFilter) return false;
                return true;
              })
              .map(vision => {
                const isVisionExpanded = expandedVisions.has(vision.id) || (vision.refId ? expandedVisions.has(vision.refId) : false);
                const domain = domains.find(d => d.id === vision.domainId);
                const annualChildren = goals.filter(g => 
                  !g.isArchived && 
                  g.horizon === 'ANNUAL' && 
                  (g.parentGoalId === vision.id || (vision.refId && g.parentGoalId === vision.refId))
                );

                return (
                  <div
                    key={vision.id}
                    className="glass-panel rounded-2xl border border-indigo-900/40 bg-slate-900/80 overflow-hidden"
                  >
                    {/* Vision Node Header */}
                    <div className="p-3.5 bg-gradient-to-r from-indigo-950/70 to-slate-900 flex items-center justify-between gap-2 border-b border-indigo-900/40">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleVisionExpand(vision.id)}
                          className="p-1 text-indigo-300 hover:text-white rounded-lg bg-indigo-900/40 cursor-pointer"
                        >
                          {isVisionExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-700/60 text-indigo-300">
                              🔮 رؤية 3-5 سنوات
                            </span>
                            {vision.refId && (
                              <span className="text-[10px] font-mono font-bold text-indigo-400">
                                [{vision.refId}]
                              </span>
                            )}
                            {domain && (
                              <span className="text-[10px] font-bold" style={{ color: domain.color }}>
                                {domain.name}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-black text-white truncate mt-0.5">
                            {vision.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono font-black text-indigo-400">
                          {vision.progressPercentage}%
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-full border border-slate-800">
                          {annualChildren.length} أهداف سنوية
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditGoalModal(vision)}
                          className="p-1 text-slate-400 hover:text-sky-300 cursor-pointer"
                          title="تعديل الرؤية"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Annual Goals Container */}
                    {isVisionExpanded && (
                      <div className="p-3 pr-5 border-r-2 border-indigo-500/40 mr-2 space-y-3 bg-slate-950/40">
                        {annualChildren.length === 0 ? (
                          <p className="text-xs text-slate-500 italic py-1">
                            لا توجد أهداف سنوية مرتبطة بهذه الرؤية بعد.
                          </p>
                        ) : (
                          annualChildren.map(annual => {
                            const isAnnualExpanded = expandedAnnuals.has(annual.id) || (annual.refId ? expandedAnnuals.has(annual.refId) : false);
                            const quarterChildren = goals.filter(g => 
                              !g.isArchived && 
                              g.horizon === 'QUARTERLY' && 
                              (g.parentGoalId === annual.id || (annual.refId && g.parentGoalId === annual.refId))
                            );

                            return (
                              <div
                                key={annual.id}
                                className="rounded-xl border border-emerald-900/40 bg-slate-900/70 overflow-hidden"
                              >
                                {/* Annual Goal Header */}
                                <div className="p-2.5 bg-gradient-to-r from-emerald-950/50 to-slate-900 flex items-center justify-between gap-2 border-b border-emerald-900/30">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <button
                                      type="button"
                                      onClick={() => toggleAnnualExpand(annual.id)}
                                      className="p-1 text-emerald-300 hover:text-white rounded bg-emerald-950/60 cursor-pointer"
                                    >
                                      {isAnnualExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                    </button>

                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300">
                                          🎯 هدف سنوي
                                        </span>
                                        {annual.refId && (
                                          <span className="text-[9px] font-mono font-bold text-emerald-400">
                                            [{annual.refId}]
                                          </span>
                                        )}
                                      </div>
                                      <h4 className="text-xs font-extrabold text-white truncate mt-0.5">
                                        {annual.title}
                                      </h4>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs font-mono font-black text-emerald-400">
                                      {annual.progressPercentage}%
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">
                                      {quarterChildren.length} ربع سنوية
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => openEditGoalModal(annual)}
                                      className="p-1 text-slate-400 hover:text-sky-300 cursor-pointer"
                                      title="تعديل الهدف السنوي"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Quarterly Goals Container */}
                                {isAnnualExpanded && (
                                  <div className="p-2.5 pr-4 border-r-2 border-emerald-500/40 mr-2 space-y-2 bg-slate-950/60">
                                    {quarterChildren.length === 0 ? (
                                      <p className="text-[11px] text-slate-500 italic py-1">
                                        لا توجد أهداف ربع سنوية مرتبطة بعد.
                                      </p>
                                    ) : (
                                      quarterChildren.map(quarter => {
                                        const isQuarterExpanded = expandedQuarters.has(quarter.id) || (quarter.refId ? expandedQuarters.has(quarter.refId) : false);
                                        const monthChildren = goals.filter(g => 
                                          !g.isArchived && 
                                          g.horizon === 'MONTHLY' && 
                                          (g.parentGoalId === quarter.id || (quarter.refId && g.parentGoalId === quarter.refId))
                                        );

                                        return (
                                          <div
                                            key={quarter.id}
                                            className="rounded-lg border border-sky-900/40 bg-slate-900/50 overflow-hidden"
                                          >
                                            {/* Quarterly Header */}
                                            <div className="p-2 bg-gradient-to-r from-sky-950/40 to-slate-900 flex items-center justify-between gap-2 border-b border-sky-900/30">
                                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                <button
                                                  type="button"
                                                  onClick={() => toggleQuarterExpand(quarter.id)}
                                                  className="p-1 text-sky-300 hover:text-white rounded bg-sky-950/60 cursor-pointer"
                                                >
                                                  {isQuarterExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                </button>

                                                <div className="min-w-0">
                                                  <div className="flex items-center gap-1">
                                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-sky-950 border border-sky-700/60 text-sky-300">
                                                      🚀 ربع سنوي Q
                                                    </span>
                                                    {quarter.refId && (
                                                      <span className="text-[9px] font-mono font-bold text-sky-400">
                                                        [{quarter.refId}]
                                                      </span>
                                                    )}
                                                  </div>
                                                  <h5 className="text-xs font-bold text-slate-200 truncate mt-0.5">
                                                    {quarter.title}
                                                  </h5>
                                                </div>
                                              </div>

                                              <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-[11px] font-mono font-bold text-sky-400">
                                                  {quarter.progressPercentage}%
                                                </span>
                                                <span className="text-[9px] font-mono text-slate-400">
                                                  {monthChildren.length} شهرياً
                                                </span>
                                              </div>
                                            </div>

                                            {/* Monthly Goals Container */}
                                            {isQuarterExpanded && (
                                              <div className="p-2 pr-3 border-r-2 border-amber-500/40 mr-1.5 space-y-1.5 bg-slate-950/80">
                                                {monthChildren.length === 0 ? (
                                                  <p className="text-[10px] text-slate-500 italic py-0.5">
                                                    لا توجد أهداف شهرية مرتبطة بهذا الربع بعد.
                                                  </p>
                                                ) : (
                                                  monthChildren.map(month => (
                                                    <div
                                                      key={month.id}
                                                      className="p-2 rounded-lg border border-amber-900/30 bg-slate-900/80 flex items-center justify-between gap-2"
                                                    >
                                                      <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1">
                                                          <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                                                            📅 شهري
                                                          </span>
                                                          {month.refId && (
                                                            <span className="text-[9px] font-mono font-bold text-amber-400">
                                                              [{month.refId}]
                                                            </span>
                                                          )}
                                                          {month.targetDate && (
                                                            <span className="text-[9px] font-mono text-slate-400">
                                                              {formatEgyptianDate(month.targetDate)}
                                                            </span>
                                                          )}
                                                        </div>
                                                        <p className="text-xs font-medium text-slate-200 truncate mt-0.5">
                                                          {month.title}
                                                        </p>
                                                      </div>

                                                      <div className="flex items-center gap-1.5 shrink-0">
                                                        <span className="text-[11px] font-mono font-bold text-amber-400">
                                                          {month.progressPercentage}%
                                                        </span>
                                                        <button
                                                          type="button"
                                                          onClick={() => openEditGoalModal(month)}
                                                          className="p-1 text-slate-400 hover:text-sky-300 cursor-pointer"
                                                          title="تعديل الهدف الشهري"
                                                        >
                                                          <Edit3 className="w-3 h-3" />
                                                        </button>
                                                      </div>
                                                    </div>
                                                  ))
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
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
                  placeholder="مثال: التأهل لتدريب أشباه الموصلات، إطلاق مشروع عمل جديد..."
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

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  ربط بنية مباركة من مكتبة النيات (اختياري)
                </label>
                <select
                  value={newSelectedIntentionId}
                  onChange={e => setNewSelectedIntentionId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="">-- بدون ربط نية فوري --</option>
                  {intentions.map(i => (
                    <option key={i.id} value={i.id}>🤲 {i.title}</option>
                  ))}
                </select>
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

      {/* 8. Edit Goal Modal */}
      {editingGoal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl p-5 w-full max-w-lg space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-extrabold text-white">تعديل الهدف الاستراتيجي</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingGoal(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  عنوان الهدف *
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="مثال: إتقان الفيزياء الرياضية، إطلاق تطبيق مسار..."
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  الدافع والأثر (لماذا هذا الهدف مهم؟)
                </label>
                <textarea
                  value={editWhyItMatters}
                  onChange={e => setEditWhyItMatters(e.target.value)}
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
                    value={editHorizon}
                    onChange={e => setEditHorizon(e.target.value as Horizon)}
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
                    value={editDomainId}
                    onChange={e => setEditDomainId(e.target.value)}
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
                    value={editTargetDate}
                    onChange={e => setEditTargetDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    حالة الهدف
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as Goal['status'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="IN_PROGRESS">قيد التنفيذ 🎯</option>
                    <option value="ACHIEVED">مكتمل / محقق 🏆</option>
                    <option value="PAUSED">متوقف مؤقتاً ⏸️</option>
                    <option value="NOT_STARTED">لم يبدأ بعد ⏳</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    تابع لهدف أكبر (هرمية الأهداف)
                  </label>
                  <select
                    value={editParentGoalId}
                    onChange={e => setEditParentGoalId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="">بدون (هدف رئيسي مستقل)</option>
                    {goals.filter(g => !g.isArchived && g.id !== editingGoal.id).map(g => (
                      <option key={g.id} value={g.id}>{g.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    ربط بنية مباركة
                  </label>
                  <select
                    value={editSelectedIntentionId}
                    onChange={e => setEditSelectedIntentionId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="">-- بدون نية --</option>
                    {intentions.map(i => (
                      <option key={i.id} value={i.id}>🤲 {i.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteGoal(editingGoal);
                    setEditingGoal(null);
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف الهدف</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingGoal(null)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-extrabold text-xs px-5 py-2 rounded-xl shadow-lg shadow-sky-500/25 pressable cursor-pointer"
                  >
                    حفظ التعديلات
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Edit Milestone Modal */}
      {editingMilestone && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/40 rounded-3xl p-5 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95 duration-200" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-extrabold text-white">تعديل المعلم المرحلي (Milestone)</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setEditingMilestone(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMilestone} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  عنوان المعلم *
                </label>
                <input
                  type="text"
                  value={editMilestoneTitle}
                  onChange={e => setEditMilestoneTitle(e.target.value)}
                  placeholder="مثال: إنهاء كورس أشباه الموصلات، تسليم مسودة البحث..."
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-300">
                      الوزن النسبي (%) *
                    </label>
                    <span className="text-[10px] text-sky-400 font-mono font-bold">
                      {editMilestoneWeight}%
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editMilestoneWeight}
                    onChange={e => setEditMilestoneWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-mono text-center"
                  />
                  <span className="text-[9px] text-slate-400 block mt-1 leading-tight">
                    تعديل الوزن يعيد حساب نسبة إنجاز الهدف تلقائياً
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    تاريخ الاستحقاق
                  </label>
                  <input
                    type="date"
                    value={editMilestoneDate}
                    onChange={e => setEditMilestoneDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  حالة المعلم
                </label>
                <select
                  value={editMilestoneStatus}
                  onChange={e => setEditMilestoneStatus(e.target.value as GoalMilestone['status'])}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="PENDING">قيد الإنجاز (لم يكتمل)</option>
                  <option value="COMPLETED">مكتمل بنجاح ☑</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteMilestone(editingMilestone);
                    setEditingMilestone(null);
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف المعلم</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMilestone(null)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-500 text-slate-950 font-extrabold text-xs px-5 py-2 rounded-xl shadow-lg shadow-sky-500/25 pressable cursor-pointer"
                  >
                    حفظ التعديل
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
