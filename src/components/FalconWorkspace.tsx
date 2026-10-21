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
  ArrowUpRight
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { fireConfettiSuccess } from '../lib/confetti';

export const FalconWorkspace: React.FC = () => {
  const { tasks, completeTask, addTask, showToast } = useAppStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<'ALL' | 'MARKETING' | 'PRODUCTION' | 'OPS'>('ALL');

  // Filter tasks related to Falcon or business
  const falconTasks = tasks.filter(t => 
    t.title.includes('فالكون') || 
    t.title.includes('Falcon') || 
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
    await addTask(`فالكون: ${newTaskTitle}`, 'P2_IMPORTANT', 30);
    setNewTaskTitle('');
    fireConfettiSuccess();
    showToast(`تمت إضافة مهمة فالكون: "${newTaskTitle}" 🦅`);
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
      {/* 3D Ambient Amber Glow (Trend 8) */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header (Trend 9 Bold Typography & Trend 4 Glassmorphism) */}
      <header className="glass-panel rounded-3xl p-4.5 flex items-center justify-between border border-white/10 shadow-xl shadow-black/40">
        <div>
          <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase">
            براند فالكون • كفرات وإكسسوارات الموبايل
          </span>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
            مساحة رائد الأعمال 🦅
          </h1>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 font-black text-lg shadow-[0_0_12px_rgba(245,158,11,0.25)]">
          F
        </div>
      </header>

      {/* Brand Dashboard & Sales Goal Card (Trend 2 & Trend 3) */}
      <section className="glass-panel-glow rounded-3xl p-5 space-y-4 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              🦅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">Falcon Cases & Accs</h2>
                <span className="text-[10px] bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-700/50 font-mono font-bold">
                  نشط 🚀
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">مسؤوليات الشريك المؤسس والتسويق</p>
            </div>
          </div>
        </div>

        {/* Monthly Target Progress */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-200">
            <span className="flex items-center gap-1.5 font-bold">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              مبيعات الشهر المستهدفة (أوردرات):
            </span>
            <span className="font-mono font-extrabold text-amber-300">
              {currentOrders} من {targetOrders} أوردر ({orderProgressPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-950 neo-sunken h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${orderProgressPercent}%` }}
            />
          </div>
        </div>

        {/* 3 KPI Metric Badges */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="glass-panel p-2.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400">الحملة الحالية</div>
            <div className="text-xs font-bold text-white mt-0.5 truncate">كفرات الشتاء ❄️</div>
          </div>
          <div className="glass-panel p-2.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400">مهام قيد التنفيذ</div>
            <div className="text-xs font-black text-amber-400 font-mono mt-0.5">
              {falconTasks.filter(t => t.status === 'TODO').length} مهام
            </div>
          </div>
          <div className="glass-panel p-2.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400">أولوية الأسبوع</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5 truncate">شيت التغليف 📦</div>
          </div>
        </div>
      </section>

      {/* Quick Add Falcon Task Input */}
      <form onSubmit={handleAddFalconTask} className="glass-panel p-2 rounded-2xl border border-slate-800 flex gap-2 shadow-lg">
        <input
          type="text"
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder="إضافة مهمة تصنيع، شحن، أو ريلز لفالكون..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-900/30 pressable cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>إضافة</span>
        </button>
      </form>

      {/* Falcon Tasks List */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
            قائمة مهام البيزنس الحالية ({falconTasks.length})
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Falcon Pipeline</span>
        </div>

        <div className="space-y-2">
          {falconTasks.map(task => (
            <div
              key={task.id}
              className="glass-panel hover:bg-slate-800/60 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => handleCompleteFalconTask(task.id)}
                  aria-label="إكمال المهمة"
                  className="w-5 h-5 rounded-lg border-2 border-slate-600 hover:border-amber-400 hover:bg-amber-500/20 flex items-center justify-center shrink-0 transition-colors pressable cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-200 truncate">{task.title}</span>
              </div>

              <span className="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-1 bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800">
                <Clock className="w-3 h-3 text-slate-500" />
                {task.estimatedMinutes}د
              </span>
            </div>
          ))}

          {falconTasks.length === 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-400 space-y-1">
              <Package className="w-6 h-6 text-amber-400 mx-auto" />
              <p className="font-bold">لا توجد مهام حالية لفالكون</p>
              <p className="text-[11px] text-slate-500">أضف مهمتك الأولى بالأعلى لمتابعة شحنات وكفرات فالكون!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
