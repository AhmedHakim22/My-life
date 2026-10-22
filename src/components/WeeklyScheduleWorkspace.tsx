import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  ChevronRight, 
  ChevronLeft, 
  ShieldCheck, 
  Coffee, 
  Moon, 
  Compass,
  ArrowRight,
  TrendingDown,
  Trash2
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { generateWeeklySchedulePlan, minutesToTimeString, timeStringToMinutes } from '../engines/scheduler';
import { getCairoPrayerTimes } from '../engines/prayer';

export const WeeklyScheduleWorkspace: React.FC = () => {
  const { 
    tasks, 
    timetableSlots, 
    prayers, 
    availabilityRules, 
    goals, 
    showToast,
    deleteTask,
    toggleTaskStatus
  } = useAppStore();

  const [selectedDay, setSelectedDay] = useState<'السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة'>('السبت');

  // Generate current plan
  const { plan, scheduleBlocks } = generateWeeklySchedulePlan(
    tasks,
    timetableSlots,
    prayers,
    availabilityRules,
    goals,
    0.15
  );

  const days: ('السبت' | 'الأحد' | 'الاثنين' | 'الثلاثاء' | 'الأربعاء' | 'الخميس' | 'الجمعة')[] = [
    'السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'
  ];

  const dayBlocks = scheduleBlocks.filter(b => b.day === selectedDay).sort((a, b) => {
    return timeStringToMinutes(a.startTime) - timeStringToMinutes(b.startTime);
  });

  const availableHours = Math.round((plan.availableFlexibleMinutes / 60) * 10) / 10;
  const requiredHours = Math.round((plan.requiredFlexibleMinutes / 60) * 10) / 10;
  const overloadHours = Math.round((plan.unscheduledMinutes / 60) * 10) / 10;

  return (
    <div className="space-y-4 pb-28 pt-2 relative">
      {/* Ambient Blue Schedule Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <header className="apple-card border border-sky-400/30 rounded-[28px] p-5 shadow-xl relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[11px] font-black text-sky-300 bg-sky-950/80 px-2.5 py-0.5 rounded-full border border-sky-400/35 flex items-center gap-1 w-fit shadow-sm">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            المخطط الأسبوعي الذكي والمحكوم بالسعة
          </span>
          <h1 className="text-xl font-black text-white flex items-center gap-2 pt-0.5">
            <span>مخطط الأسبوع وتوزيع الوقت</span>
            <Calendar className="w-5 h-5 text-sky-400" />
          </h1>
          <p className="text-xs text-slate-300">
            توزيع واقعي للمهام يحترم محاضرات النانو، الصلوات، أوقات النوم، وميزانية العمل دون حجز أوقات وهمية.
          </p>
        </div>

        {/* Capacity & Overload Summary KPI Cards */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="apple-widget p-3 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 font-bold block">الساعات المتاحة</span>
            <span className="text-base font-black text-emerald-400 font-mono">{availableHours} س</span>
          </div>

          <div className="apple-widget p-3 rounded-2xl text-center">
            <span className="text-[10px] text-slate-400 font-bold block">المطلوب إنجازه</span>
            <span className="text-base font-black text-sky-300 font-mono">{requiredHours} س</span>
          </div>

          <div className={`apple-widget p-3 rounded-2xl text-center ${
            plan.isOverloaded ? 'border-rose-500/40 bg-rose-950/30' : 'border-sky-400/20'
          }`}>
            <span className="text-[10px] text-slate-400 font-bold block">
              {plan.isOverloaded ? 'حمل زائد (Overload)' : 'ساعات الفائض / الأمان'}
            </span>
            <span className={`text-base font-black font-mono ${plan.isOverloaded ? 'text-rose-400' : 'text-teal-400'}`}>
              {plan.isOverloaded ? `+${overloadHours} س` : `${Math.max(0, Math.round((availableHours - requiredHours) * 10) / 10)} س`}
            </span>
          </div>
        </div>

        {/* Overload Alert Notification */}
        {plan.isOverloaded && (
          <div className="mt-3 bg-rose-950/70 border border-rose-500/50 p-3 rounded-2xl text-xs text-rose-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">تنبيه الحمل الزائد (+{overloadHours} ساعات لا تكفي هذا الأسبوع):</span>
              <p className="text-[11px] text-rose-300/90 leading-relaxed">
                لديك مهام تتطلب {requiredHours} ساعة بينما وقتك الصافي المتاح هو {availableHours} ساعة فقط بعد خصم المحاضرات والنوم والصلوات.
                النظام لم يقم بجدولة المهام الزائدة عشوائياً. يُنصح بتأجيل المهام منخفضة الأولوية (P3) أو تقليص نطاق بعض الأهداف.
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Day Selector Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {days.map(d => {
          const isSelected = selectedDay === d;
          const count = scheduleBlocks.filter(b => b.day === d).length;

          return (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDay(d)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1.5 pressable ${
                isSelected
                  ? 'bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 text-slate-950 border-white/40 font-black shadow-lg shadow-sky-400/35'
                  : 'bg-slate-950/70 border-sky-400/15 text-slate-400 hover:text-slate-200 hover:border-sky-400/30'
              }`}
            >
              <span>{d}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isSelected ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-900 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Timeline View */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>الجدول الزمني ليوم <strong className="text-white font-bold">{selectedDay}</strong>:</span>
          <span>{dayBlocks.length} كتل زمنية</span>
        </div>

        {dayBlocks.length === 0 ? (
          <div className="glass-panel border border-slate-800/80 rounded-3xl p-8 text-center space-y-2">
            <Coffee className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-300">يوم راحة أو لا توجد التزامات مجدولة</h4>
            <p className="text-xs text-slate-500">لا توجد محاضرات جامعية ثابتة أو مهام محجوزة في هذا اليوم.</p>
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
                      : 'bg-slate-900/70 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {block.taskId ? (
                      <button
                        type="button"
                        onClick={() => toggleTaskStatus(block.taskId!)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 pressable cursor-pointer transition-colors ${
                          isTaskDone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30'
                        }`}
                        title={isTaskDone ? 'اضغط لإلغاء الإنجاز وإعادة المهمة' : 'اضغط لإنجاز المهمة'}
                      >
                        {isTaskDone ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </button>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center text-xs font-bold shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-extrabold ${isTaskDone ? 'line-through text-slate-500' : 'text-white'}`}>
                          {block.title}
                        </span>
                        {block.type === 'FIXED_CLASS' && (
                          <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-700/40 px-2 py-0.2 rounded-full font-bold">
                            محاضرة ثابتة 🎓
                          </span>
                        )}
                        {isTaskDone && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/40 px-2 py-0.2 rounded-full font-bold">
                            تمت ✓
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        {block.startTime} ← {block.endTime} ({block.durationMinutes} دقيقة)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {block.taskId && (
                      <button
                        type="button"
                        onClick={() => deleteTask(block.taskId!)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 pressable cursor-pointer transition-colors"
                        title="حذف هذه المهمة"
                        aria-label="حذف المهمة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {block.isLocked && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                        <Lock className="w-3 h-3 text-slate-500" />
                        محمي
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
