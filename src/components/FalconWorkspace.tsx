import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Megaphone,
  Flame,
  Package,
  Layers,
  Sparkles,
  ArrowUpRight,
  Trash2,
  Check,
  Edit3,
  Minus,
  X
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { fireConfettiSuccess } from '../lib/confetti';
import { sendLocalNotification } from '../lib/notifications';

interface WorkProjectSettings {
  campaignTitle: string;
  weeklyPriority: string;
  currentOrders: number;
  targetOrders: number;
  metricUnit: string;
}

const STORAGE_KEY = 'masaar_work_project_settings';

const DEFAULT_SETTINGS: WorkProjectSettings = {
  campaignTitle: 'حملة العمل الحالية 🚀',
  weeklyPriority: 'متابعة المبيعات 📦',
  currentOrders: 0, // يبدأ من صفر كما طلب المستخدم
  targetOrders: 50,
  metricUnit: 'أوردر'
};

const getSavedSettings = (): WorkProjectSettings => {
  if (typeof localStorage === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      campaignTitle: parsed.campaignTitle || DEFAULT_SETTINGS.campaignTitle,
      weeklyPriority: parsed.weeklyPriority || DEFAULT_SETTINGS.weeklyPriority,
      currentOrders: typeof parsed.currentOrders === 'number' ? parsed.currentOrders : 0,
      targetOrders: typeof parsed.targetOrders === 'number' && parsed.targetOrders > 0 ? parsed.targetOrders : 50,
      metricUnit: parsed.metricUnit || DEFAULT_SETTINGS.metricUnit
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const FalconWorkspace: React.FC = () => {
  const { tasks, completeTask, uncompleteTask, toggleTaskStatus, deleteTask, addTask, showToast } = useAppStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<'ALL' | 'MARKETING' | 'PRODUCTION' | 'OPS'>('ALL');

  // Work Project Settings (Persistent & Editable)
  const [projectSettings, setProjectSettings] = useState<WorkProjectSettings>(getSavedSettings);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states for the modal
  const [formCampaignTitle, setFormCampaignTitle] = useState(projectSettings.campaignTitle);
  const [formWeeklyPriority, setFormWeeklyPriority] = useState(projectSettings.weeklyPriority);
  const [formCurrentOrders, setFormCurrentOrders] = useState(projectSettings.currentOrders);
  const [formTargetOrders, setFormTargetOrders] = useState(projectSettings.targetOrders);
  const [formMetricUnit, setFormMetricUnit] = useState(projectSettings.metricUnit);

  // Filter tasks related to work, business, or projects
  const falconTasks = tasks.filter(t => 
    t.title.includes('فالكون') || 
    t.title.includes('Falcon') || 
    t.title.includes('عمل') ||
    t.title.includes('العمل') ||
    t.title.includes('شغل') ||
    t.title.includes('مشروع') ||
    t.title.includes('كفر') || 
    t.title.includes('تسويق') ||
    t.title.includes('تغليف') ||
    t.title.includes('شحن') ||
    t.title.includes('انستجرام') ||
    t.title.includes('تيك توك')
  );

  const handleAddFalconTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(`عمل: ${newTaskTitle}`, 'P2_IMPORTANT', 30);
    setNewTaskTitle('');
    fireConfettiSuccess();
    showToast(`تمت إضافة مهمة العمل: "${newTaskTitle}" 💼`);
  };

  const handleCompleteFalconTask = async (taskId: string) => {
    fireConfettiSuccess();
    await completeTask(taskId);
  };

  const handleIncrementOrders = () => {
    fireConfettiSuccess();
    const updated: WorkProjectSettings = {
      ...projectSettings,
      currentOrders: projectSettings.currentOrders + 1
    };
    setProjectSettings(updated);
    setFormCurrentOrders(updated.currentOrders);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    showToast(`🎉 مبروك المبيعة الجديدة! إجمالي المبيعات الآن: ${updated.currentOrders} ${updated.metricUnit}`);
    sendLocalNotification('🎉 مبيعة عمل جديدة!', {
      body: `تم تسجيل مبيعة جديدة بنجاح! إجمالي المبيعات الآن: ${updated.currentOrders} من أصل ${updated.targetOrders} ${updated.metricUnit}. استمر في هذا الزخم!`,
      tag: 'falcon-sale'
    });
  };

  const handleDecrementOrders = () => {
    if (projectSettings.currentOrders <= 0) return;
    const updated: WorkProjectSettings = {
      ...projectSettings,
      currentOrders: Math.max(0, projectSettings.currentOrders - 1)
    };
    setProjectSettings(updated);
    setFormCurrentOrders(updated.currentOrders);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleOpenEditModal = () => {
    setFormCampaignTitle(projectSettings.campaignTitle);
    setFormWeeklyPriority(projectSettings.weeklyPriority);
    setFormCurrentOrders(projectSettings.currentOrders);
    setFormTargetOrders(projectSettings.targetOrders);
    setFormMetricUnit(projectSettings.metricUnit);
    setIsEditModalOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WorkProjectSettings = {
      campaignTitle: formCampaignTitle.trim() || 'حملة العمل الحالية 🚀',
      weeklyPriority: formWeeklyPriority.trim() || 'متابعة المبيعات 📦',
      currentOrders: Math.max(0, formCurrentOrders),
      targetOrders: Math.max(1, formTargetOrders),
      metricUnit: formMetricUnit.trim() || 'أوردر'
    };
    setProjectSettings(updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    setIsEditModalOpen(false);
    showToast('تم حفظ أهداف وتفاصيل العمل بنجاح ✓');
  };

  const orderProgressPercent = Math.min(100, Math.round((projectSettings.currentOrders / Math.max(1, projectSettings.targetOrders)) * 100));

  return (
    <div className="space-y-4 pb-24 pt-3 relative">
      {/* Header */}
      <header className="apple-card rounded-[28px] p-5 flex items-center justify-between shadow-xl">
        <div>
          <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
            مساحة العمل والمشاريع • الإنتاجية والتطوير
          </span>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
            مساحة العمل 💼
          </h1>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/20 flex items-center justify-center text-amber-300 shadow-sm">
          <Briefcase className="w-5 h-5" />
        </div>
      </header>

      {/* Brand & Work Dashboard Card */}
      <section className="apple-card rounded-[28px] p-5 space-y-4 border border-white/[0.08] shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/20 text-amber-300 font-bold text-xl flex items-center justify-center shrink-0">
              💼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">إدارة العمل والمشاريع</h2>
                <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-mono font-bold">
                  نشط 🚀
                </span>
              </div>
              <p className="text-xs text-[#8e8e93] mt-0.5">متابعة مشاريع العمل، المبيعات، والإنتاجية</p>
            </div>
          </div>

          {/* Quick Edit Button */}
          <button
            type="button"
            onClick={handleOpenEditModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-xs font-bold text-amber-300 transition-colors pressable cursor-pointer"
            title="تعديل الحملة وأهداف المبيعات"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>تعديل</span>
          </button>
        </div>

        {/* Monthly Target Progress & Sales Counter */}
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between text-xs text-slate-200">
            <span className="flex items-center gap-1.5 font-bold">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              مبيعات الشهر المستهدفة ({projectSettings.metricUnit}):
            </span>
            <div className="flex items-center gap-2">
              {/* Quick Decrement (-) Button */}
              <button
                type="button"
                onClick={handleDecrementOrders}
                disabled={projectSettings.currentOrders <= 0}
                className="w-6 h-6 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-30 border border-white/[0.08] flex items-center justify-center text-slate-300 transition-colors pressable cursor-pointer"
                title="إنقاص مبيعة واحدة (-1)"
              >
                <Minus className="w-3 h-3" />
              </button>

              <span className="font-mono font-extrabold text-amber-300 text-sm">
                {projectSettings.currentOrders} من {projectSettings.targetOrders} {projectSettings.metricUnit} ({orderProgressPercent}%)
              </span>

              {/* Quick Increment (+) Button */}
              <button
                type="button"
                onClick={handleIncrementOrders}
                className="w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow transition-colors pressable cursor-pointer"
                title="تسجيل مبيعة جديدة (+1)"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${orderProgressPercent}%` }}
            />
          </div>
        </div>

        {/* 3 KPI Metric Badges (Clickable & Editable) */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <button
            type="button"
            onClick={handleOpenEditModal}
            className="apple-widget p-2.5 rounded-2xl hover:border-amber-400/40 transition-colors text-right cursor-pointer"
            title="اضغط للتعديل"
          >
            <div className="text-[10px] text-[#8e8e93]">الحملة / المنتج</div>
            <div className="text-xs font-bold text-white mt-0.5 truncate">{projectSettings.campaignTitle}</div>
          </button>
          <div className="apple-widget p-2.5 rounded-2xl">
            <div className="text-[10px] text-[#8e8e93]">مهام قيد التنفيذ</div>
            <div className="text-xs font-black text-amber-400 font-mono mt-0.5">
              {falconTasks.filter(t => t.status === 'TODO').length} مهام
            </div>
          </div>
          <button
            type="button"
            onClick={handleOpenEditModal}
            className="apple-widget p-2.5 rounded-2xl hover:border-emerald-400/40 transition-colors text-right cursor-pointer"
            title="اضغط للتعديل"
          >
            <div className="text-[10px] text-[#8e8e93]">أولوية الأسبوع</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5 truncate">{projectSettings.weeklyPriority}</div>
          </button>
        </div>
      </section>

      {/* Quick Add Work Task Input */}
      <form onSubmit={handleAddFalconTask} className="apple-card p-2 rounded-2xl border border-white/[0.08] flex gap-2 shadow-sm">
        <input
          type="text"
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder="إضافة مهمة عمل، مشروع، شحن، أو تسويق..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm pressable cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>إضافة</span>
        </button>
      </form>

      {/* Work Tasks List */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            قائمة مهام العمل الحالية ({falconTasks.length})
          </h3>
          <span className="text-[10px] text-[#8e8e93] font-mono">Work Pipeline</span>
        </div>

        <div className="space-y-2">
          {falconTasks.map(task => (
            <div
              key={task.id}
              className="apple-card border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleTaskStatus(task.id)}
                  aria-label="تبديل حالة المهمة"
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all pressable cursor-pointer ${
                    task.status === 'DONE'
                      ? 'bg-amber-500 border-amber-400 text-slate-950'
                      : 'border-white/20 hover:border-amber-400 hover:bg-amber-500/20'
                  }`}
                  title={task.status === 'DONE' ? 'اضغط لإلغاء الإنجاز وإعادة المهمة' : 'اضغط لإنجاز المهمة'}
                >
                  {task.status === 'DONE' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <span className={`text-xs font-medium truncate ${
                  task.status === 'DONE' ? 'line-through text-slate-500' : 'text-slate-200'
                }`}>
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-[#8e8e93] font-mono flex items-center gap-1 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.06]">
                  <Clock className="w-3 h-3 text-[#8e8e93]" />
                  {task.estimatedMinutes}د
                </span>
                <button
                  type="button"
                  onClick={() => deleteTask(task.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/15 rounded-lg pressable cursor-pointer transition-colors"
                  title="حذف المهمة"
                  aria-label="حذف المهمة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {falconTasks.length === 0 && (
            <div className="apple-card p-6 rounded-2xl border border-dashed border-white/10 text-center text-xs text-slate-400 space-y-1">
              <Package className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="font-bold text-white">لا توجد مهام حالية للعمل</p>
              <p className="text-[11px] text-[#8e8e93]">أضف مهمتك الأولى بالأعلى لمتابعة مهام العمل ومشاريعك!</p>
            </div>
          )}
        </div>
      </section>

      {/* Edit Work Project & Sales Target Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            className="apple-card border border-white/[0.1] rounded-[26px] w-full max-w-md p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">تعديل تفاصيل وأهداف العمل</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#8e8e93] hover:text-white flex items-center justify-center pressable cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#8e8e93] block mb-1">
                  اسم الحملة أو المنتج الحالي (بدل كفرات أو غيرها):
                </label>
                <input
                  type="text"
                  value={formCampaignTitle}
                  onChange={e => setFormCampaignTitle(e.target.value)}
                  placeholder="مثال: كفرات الشتاء، براند الملابس، متجر الهدايا..."
                  required
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8e8e93] block mb-1">
                  أولوية الأسبوع:
                </label>
                <input
                  type="text"
                  value={formWeeklyPriority}
                  onChange={e => setFormWeeklyPriority(e.target.value)}
                  placeholder="مثال: شيت التغليف، تصوير ريلز، متابعة المورد..."
                  required
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-[#8e8e93]">
                      المبيعات الحالية:
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormCurrentOrders(0)}
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-bold underline"
                    >
                      تصفير (0)
                    </button>
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={formCurrentOrders}
                    onChange={e => setFormCurrentOrders(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#8e8e93] block mb-1">
                    المستهدف الشهري:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formTargetOrders}
                    onChange={e => setFormTargetOrders(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#8e8e93] block mb-1">
                  وحدة المبيعات:
                </label>
                <input
                  type="text"
                  value={formMetricUnit}
                  onChange={e => setFormMetricUnit(e.target.value)}
                  placeholder="مثال: أوردر، قطعة، عميل..."
                  className="w-full bg-black/40 border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="apple-btn-primary flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm pressable cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>حفظ التعديلات</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="py-2.5 px-4 bg-white/[0.06] hover:bg-white/[0.1] text-[#8e8e93] hover:text-white rounded-xl text-xs font-bold pressable cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
