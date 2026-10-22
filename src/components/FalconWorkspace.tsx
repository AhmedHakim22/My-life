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
  Check
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { fireConfettiSuccess } from '../lib/confetti';

export const FalconWorkspace: React.FC = () => {
  const { tasks, completeTask, uncompleteTask, toggleTaskStatus, deleteTask, addTask, showToast } = useAppStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<'ALL' | 'MARKETING' | 'PRODUCTION' | 'OPS'>('ALL');

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

  // Mocked monthly order progress (e.g. 24 of 50 target)
  const targetOrders = 50;
  const currentOrders = 24;
  const orderProgressPercent = Math.round((currentOrders / targetOrders) * 100);

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
              <p className="text-xs text-[#8e8e93] mt-0.5">متابعة مشاريع العمل، التسويق، والإنتاجية</p>
            </div>
          </div>
        </div>

        {/* Monthly Target Progress */}
        <div className="space-y-1.5 pt-1 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-slate-200">
            <span className="flex items-center gap-1.5 font-bold">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              مبيعات الشهر المستهدفة (أوردرات):
            </span>
            <span className="font-mono font-extrabold text-amber-300">
              {currentOrders} من {targetOrders} أوردر ({orderProgressPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-950/80 h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${orderProgressPercent}%` }}
            />
          </div>
        </div>

        {/* 3 KPI Metric Badges */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="apple-widget p-2.5 rounded-2xl">
            <div className="text-[10px] text-slate-400">الحملة الحالية</div>
            <div className="text-xs font-bold text-white mt-0.5 truncate">كفرات الشتاء ❄️</div>
          </div>
          <div className="apple-widget p-2.5 rounded-2xl">
            <div className="text-[10px] text-slate-400">مهام قيد التنفيذ</div>
            <div className="text-xs font-black text-amber-400 font-mono mt-0.5">
              {falconTasks.filter(t => t.status === 'TODO').length} مهام
            </div>
          </div>
          <div className="apple-widget p-2.5 rounded-2xl">
            <div className="text-[10px] text-slate-400">أولوية الأسبوع</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5 truncate">شيت التغليف 📦</div>
          </div>
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
    </div>
  );
};
