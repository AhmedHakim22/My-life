import React, { useState } from 'react';
import { 
  Activity, 
  Dumbbell, 
  Flame, 
  Heart, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Info, 
  ShieldCheck, 
  TrendingUp, 
  X,
  Bed,
  Car,
  Briefcase
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { getCairoDateString } from '../lib/dateUtils';
import { fireConfettiSuccess } from '../lib/confetti';
import type { MovementLog, WorkoutLog, ExerciseDetail } from '../types';

export const FitnessWorkspace: React.FC = () => {
  const { 
    movementLogs, 
    workoutLogs, 
    availabilityRules, 
    logMovement, 
    logWorkout, 
    deleteWorkout, 
    addAvailabilityRule, 
    deleteAvailabilityRule,
    showToast 
  } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<'MOVEMENT' | 'WORKOUTS' | 'AVAILABILITY'>('MOVEMENT');
  const todayStr = getCairoDateString();

  // Movement Form State
  const [moveMinutes, setMoveMinutes] = useState<number>(25);
  const [moveType, setMoveType] = useState<MovementLog['activityType']>('WALK');
  const [moveIntensity, setMoveIntensity] = useState<'LIGHT' | 'MODERATE' | 'VIGOROUS'>('MODERATE');
  const [moveNotes, setMoveNotes] = useState<string>('');

  // Workout Form State
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutType, setWorkoutType] = useState<WorkoutLog['activityType']>('GYM_STRENGTH');
  const [workoutMinutes, setWorkoutMinutes] = useState<number>(45);
  const [workoutNotes, setWorkoutNotes] = useState<string>('');
  const [exercisesList, setExercisesList] = useState<ExerciseDetail[]>([
    { id: '1', name: 'سكوات (Squat)', sets: [{ setNumber: 1, reps: 10, weightKg: 40 }, { setNumber: 2, reps: 8, weightKg: 50 }] }
  ]);

  // Today Movement Total
  const todayMoves = movementLogs.filter(m => m.date === todayStr);
  const todayMoveMinutesTotal = todayMoves.reduce((sum, m) => sum + m.durationMinutes, 0);
  const dailyTargetMinutes = 20; // Personal minimum 20 mins
  const isDailyMoveMet = todayMoveMinutesTotal >= dailyTargetMinutes;

  // Weekly stats (last 7 days)
  const last7DaysTotalMinutes = movementLogs.slice(-14).reduce((sum, m) => sum + m.durationMinutes, 0);
  const weeklyPersonalBenchmark = dailyTargetMinutes * 7; // 140 min
  const whoBenchmark = 150; // WHO population guideline

  const handleSaveMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (moveMinutes <= 0) return;
    await logMovement(moveMinutes, moveType, moveNotes || undefined);
    if (todayMoveMinutesTotal + moveMinutes >= dailyTargetMinutes) {
      fireConfettiSuccess();
    }
    setMoveNotes('');
  };

  const handleSaveWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutTitle.trim() || workoutMinutes <= 0) return;
    await logWorkout({
      date: todayStr,
      title: workoutTitle.trim(),
      activityType: workoutType,
      durationMinutes: workoutMinutes,
      exercises: exercisesList.filter(ex => ex.name.trim().length > 0),
      notes: workoutNotes || undefined
    });
    // Also record duration as movement
    await logMovement(workoutMinutes, 'GYM', `جلسة تمرين: ${workoutTitle}`);
    fireConfettiSuccess();
    setIsWorkoutModalOpen(false);
    setWorkoutTitle('');
    setWorkoutNotes('');
  };

  return (
    <div className="space-y-4 pb-28 pt-2 relative">
      {/* Ambient Orange/Rose Fitness Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <header className="apple-card border border-rose-500/25 rounded-[28px] p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-black text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-500/40 flex items-center gap-1 w-fit shadow-sm">
              <Activity className="w-3.5 h-3.5 text-rose-400" />
              اللياقة والنشاط الحركي اليومي
            </span>
            <h1 className="text-xl font-black text-white flex items-center gap-2 pt-0.5">
              <span>الصحة والرياضة</span>
              <Dumbbell className="w-5 h-5 text-rose-400" />
            </h1>
            <p className="text-xs text-slate-300">
              «المؤمن القوي خيرٌ وأحب إلى الله» — حد أدنى 20 دقيقة حركة يومية وجلسات تمرين منظمة.
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="apple-segmented-container grid grid-cols-3 gap-1 mt-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSubTab('MOVEMENT')}
            className={`py-2 px-1 rounded-2xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 pressable ${
              activeSubTab === 'MOVEMENT'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>الحركة اليومية ({todayMoveMinutesTotal}/20 د)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('WORKOUTS')}
            className={`py-2 px-1 rounded-2xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 pressable ${
              activeSubTab === 'WORKOUTS'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>الجيم والتمارين ({workoutLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('AVAILABILITY')}
            className={`py-2 px-1 rounded-2xl transition-all cursor-pointer text-center flex items-center justify-center gap-1.5 pressable ${
              activeSubTab === 'AVAILABILITY'
                ? 'apple-pill-active'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>قواعد التفرغ والنوم</span>
          </button>
        </div>
      </header>

      {/* SUB-TAB 1: DAILY MOVEMENT */}
      {activeSubTab === 'MOVEMENT' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* 20-Min Movement KPI Card */}
          <div className="glass-panel border border-rose-500/30 rounded-3xl p-4.5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">
                  الحد الأدنى الحركي اليومي
                </span>
                <h3 className="text-lg font-black text-white">
                  {todayMoveMinutesTotal} من {dailyTargetMinutes} دقيقة حركة اليوم
                </h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isDailyMoveMet 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {isDailyMoveMet ? 'تحقق هدف الـ 20 دقيقة 🏃‍♂️🎉' : `متبقي ${Math.max(0, dailyTargetMinutes - todayMoveMinutesTotal)} دقيقة`}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 neo-sunken h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((todayMoveMinutesTotal / dailyTargetMinutes) * 100))}%` }}
              />
            </div>

            {/* Scientific Distinction Note */}
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Info className="w-3.5 h-3.5" />
                <span>التمييز العلمي بين الحركة والتمرين:</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                عادة الـ 20 دقيقة (140 دقيقة/أسبوع) هي خط أساس شخصي لمنع الخمول، لكنها لا تعني تلقائياً استيفاء معيار منظمة الصحة العالمية (150–300 دقيقة نشاط متوسط الشدة + تمارين مقاومة يومين أسبوعياً).
              </p>
            </div>
          </div>

          {/* Quick Movement Logger */}
          <form onSubmit={handleSaveMovement} className="glass-panel border border-slate-800 rounded-3xl p-4.5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-rose-400" />
              <span>تسجيل نشاط حركي جديد اليوم</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">المدة (بالدقائق):</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={moveMinutes}
                    onChange={e => setMoveMinutes(Math.max(1, Number(e.target.value)))}
                    min={1}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => setMoveMinutes(20)}
                    className="bg-slate-800 hover:bg-slate-700 text-[10px] text-rose-400 font-bold px-2 py-2 rounded-xl shrink-0"
                  >
                    20 د
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">نوع النشاط:</label>
                <select
                  value={moveType}
                  onChange={e => setMoveType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="WALK">مشي سريع 🚶‍♂️</option>
                  <option value="RUN">جري أو هرولة 🏃‍♂️</option>
                  <option value="CYCLING">دراجة 🚴‍♂️</option>
                  <option value="STRETCHING">إطالات واسترخاء 🧘‍♂️</option>
                  <option value="MOBILITY">تمارين مرونة ومفاصل 🤸‍♂️</option>
                  <option value="GYM">تمرين حديد وقوة 🏋️‍♂️</option>
                  <option value="SPORT">رياضة وكرة قدم ⚽</option>
                  <option value="CUSTOM">نشاط مخصص ⚡</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">ملاحظة أو مسافة (اختياري):</label>
              <input
                type="text"
                value={moveNotes}
                onChange={e => setMoveNotes(e.target.value)}
                placeholder="مثال: مشي من الجامعة للمنزل، 2.5 كم..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-400 hover:to-orange-500 text-white font-black text-xs py-2.5 rounded-xl shadow-md shadow-rose-950/40 pressable cursor-pointer"
            >
              تسجيل النشاط الحركي 🏃‍♂️💨
            </button>
          </form>

          {/* Movement History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 px-1">سجل الأنشطة الحركية الأخيرة:</h4>
            {movementLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center">لا توجد سجلات بعد — ابدأ بمشي 20 دقيقة اليوم 🌿</p>
            ) : (
              movementLogs.slice(-6).reverse().map(log => (
                <div key={log.id} className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{log.durationMinutes} دقيقة</span>
                    <span className="text-slate-400 mr-2">({log.activityType})</span>
                    {log.meets20MinBaseline && (
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full font-bold mr-2 border border-emerald-700/40">
                        استوفى الـ 20 د ✅
                      </span>
                    )}
                    {log.notes && <p className="text-[11px] text-slate-500 mt-0.5">{log.notes}</p>}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{log.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WORKOUTS & GYM */}
      {activeSubTab === 'WORKOUTS' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">جلسات تمرين الجيم والقوة</h3>
              <p className="text-xs text-slate-400">تتبع التدريب بالأوزان، المجموعات، والتكرارات.</p>
            </div>

            <button
              type="button"
              onClick={() => setIsWorkoutModalOpen(true)}
              className="bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-rose-950/40 pressable cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل تمرين</span>
            </button>
          </div>

          {workoutLogs.length === 0 ? (
            <div className="glass-panel border border-slate-800/80 rounded-3xl p-8 text-center space-y-3">
              <Dumbbell className="w-10 h-10 text-rose-400/50 mx-auto" />
              <h4 className="text-sm font-bold text-white">لا توجد تمارين مسجلة حتى الآن</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                سجل جلسات الجيم (صدر، أرجل، ظهر، كارديو) مع المجموعات والأوزان للحفاظ على التدرج في الحمل والتحسن المستمر.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {workoutLogs.map(w => (
                <div key={w.id} className="glass-panel border border-slate-800/80 rounded-3xl p-4.5 space-y-3 shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-rose-400" />
                        <h4 className="text-sm font-extrabold text-white">{w.title}</h4>
                        <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                          {w.durationMinutes} دقيقة
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{w.date} • {w.activityType}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteWorkout(w.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Exercises Details */}
                  {w.exercises && w.exercises.length > 0 && (
                    <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 space-y-2">
                      <span className="text-[10px] text-slate-400 font-bold block">التمارين والمجموعات:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {w.exercises.map((ex, idx) => (
                          <div key={idx} className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                            <span className="font-bold text-slate-200">{ex.name}</span>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {ex.sets.map(s => `${s.reps}x${s.weightKg || 0}kg`).join(' | ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: AVAILABILITY & SLEEP */}
      {activeSubTab === 'AVAILABILITY' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="glass-panel border border-slate-800 rounded-3xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
              <Bed className="w-4 h-4" />
              <span>نافذة النوم المحمية (Protected Sleep Window)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              النظام يحمي أوقات نومك الأساسية (مثلاً: 23:30 إلى 06:30) ولا يضع أي مهام دراسية أو عمل في هذه الفترة مطلقاً.
            </p>
          </div>

          <div className="glass-panel border border-slate-800 rounded-3xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Briefcase className="w-4 h-4" />
              <span>ميزانية عمل فالكون الأسبوعية</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              يتم حجز كتل زمنية ثابتة لمتجر فالكون ومتابعة الموردين والطلبات لمنع تداخلها مع مذاكرة النانو أو فترات الامتحانات.
            </p>
          </div>
        </div>
      )}

      {/* Log Workout Modal */}
      {isWorkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-rose-400" />
                <h3 className="text-sm font-bold text-white">تسجيل جلسة تمرين جديدة</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsWorkoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkout} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">اسم التمرين:</label>
                <input
                  type="text"
                  value={workoutTitle}
                  onChange={e => setWorkoutTitle(e.target.value)}
                  placeholder="مثال: Push Day — صدر وتراي، كارديو وأرجل..."
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">النوع:</label>
                  <select
                    value={workoutType}
                    onChange={e => setWorkoutType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="GYM_STRENGTH">جيم وتمارين مقاومة 🏋️‍♂️</option>
                    <option value="CARDIO">كارديو وجري 🏃‍♂️</option>
                    <option value="HIIT">تمرين مكثف HIIT ⚡</option>
                    <option value="RECOVERY">استشفاء نشط وإطالات 🧘‍♂️</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-bold block mb-1">المدة (بالدقائق):</label>
                  <input
                    type="number"
                    value={workoutMinutes}
                    onChange={e => setWorkoutMinutes(Math.max(1, Number(e.target.value)))}
                    min={1}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">ملاحظات التمرين (اختياري):</label>
                <input
                  type="text"
                  value={workoutNotes}
                  onChange={e => setWorkoutNotes(e.target.value)}
                  placeholder="مثال: أداء ممتاز، رفع الوزن في البنش..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWorkoutModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  حفظ جلسة التمرين 💪
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
