import React, { useState } from 'react';
import { 
  Moon, 
  BookOpen, 
  HeartHandshake, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  X, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Compass, 
  Sun,
  Flame,
  Calendar,
  Layers,
  Link as LinkIcon
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { getCairoPrayerTimes, calculateQiyamDuration, getPrayerBuffers } from '../engines/prayer';
import { getCairoDateString } from '../lib/dateUtils';
import { fireConfettiSuccess } from '../lib/confetti';
import type { WorshipLog } from '../types';

export const FaithWorkspace: React.FC = () => {
  const { 
    prayers, 
    worshipLogs, 
    quranLogs, 
    qiyamSessions, 
    intentions, 
    goalIntentions,
    goals,
    habits,
    logPrayerWorship,
    logQuranReading,
    logQiyamSession,
    deleteQiyamSession,
    addIntention,
    updateIntention,
    deleteIntention,
    linkIntentionToGoal,
    unlinkIntentionFromGoal,
    showToast
  } = useAppStore();

  const [activeSubTab, setActiveSubTab] = useState<'PRAYERS' | 'QURAN' | 'QIYAM' | 'INTENTIONS'>('PRAYERS');
  const todayStr = getCairoDateString();

  // Quran Log State
  const [quranPagesInput, setQuranPagesInput] = useState<number>(3);
  const [surahStartInput, setSurahStartInput] = useState<string>('');
  const [surahEndInput, setSurahEndInput] = useState<string>('');
  const [quranNotesInput, setQuranNotesInput] = useState<string>('');

  // Qiyam Log State
  const [qiyamStart, setQiyamStart] = useState<string>('23:30');
  const [qiyamEnd, setQiyamEnd] = useState<string>('00:20');
  const [qiyamRakahs, setQiyamRakahs] = useState<number>(8);
  const [qiyamNotes, setQiyamNotes] = useState<string>('');

  // Intention Form Modal State
  const [isIntentionModalOpen, setIsIntentionModalOpen] = useState(false);
  const [editingIntentionId, setEditingIntentionId] = useState<string | null>(null);
  const [intentTitle, setIntentTitle] = useState('');
  const [intentPurpose, setIntentPurpose] = useState('');
  const [intentReference, setIntentReference] = useState('');
  const [selectedGoalIdForIntent, setSelectedGoalIdForIntent] = useState<string>('');

  // Prayers for today
  const prayerList = [
    { key: 'fajr', name: 'الفجر', prayerName: 'Fajr' as const, info: prayers.fajr },
    { key: 'dhuhr', name: 'الظهر', prayerName: 'Dhuhr' as const, info: prayers.dhuhr },
    { key: 'asr', name: 'العصر', prayerName: 'Asr' as const, info: prayers.asr },
    { key: 'maghrib', name: 'المغرب', prayerName: 'Maghrib' as const, info: prayers.maghrib },
    { key: 'isha', name: 'العشاء', prayerName: 'Isha' as const, info: prayers.isha }
  ];

  // Today's Quran total
  const todayQuranEntries = quranLogs.filter(q => q.date === todayStr);
  const todayQuranPagesTotal = todayQuranEntries.reduce((sum, q) => sum + q.pagesRead, 0);
  const quranHabit = habits.find(h => h.id === 'habit-quran');
  const quranTarget = quranHabit?.targetValue || 3;
  const isQuranMet = todayQuranPagesTotal >= quranTarget;

  // Qiyam duration calculation
  const qiyamDurationCalc = calculateQiyamDuration(qiyamStart, qiyamEnd);

  // Handle Quran submit
  const handleLogQuran = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quranPagesInput <= 0) return;
    await logQuranReading(quranPagesInput, surahStartInput || undefined, surahEndInput || undefined, quranNotesInput || undefined);
    if (quranPagesInput + todayQuranPagesTotal >= quranTarget) {
      fireConfettiSuccess();
    }
    setSurahStartInput('');
    setSurahEndInput('');
    setQuranNotesInput('');
  };

  // Handle Qiyam submit
  const handleLogQiyam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (qiyamDurationCalc <= 0) {
      showToast('يرجى التحقق من توقيت البداية والنهاية');
      return;
    }
    await logQiyamSession({
      date: todayStr,
      startTime: qiyamStart,
      endTime: qiyamEnd,
      durationMinutes: qiyamDurationCalc,
      rakahsCount: qiyamRakahs || undefined,
      notes: qiyamNotes || undefined
    });
    fireConfettiSuccess();
    setQiyamNotes('');
  };

  // Handle Intention submit
  const handleSaveIntention = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentTitle.trim()) return;

    if (editingIntentionId) {
      await updateIntention(editingIntentionId, {
        title: intentTitle.trim(),
        purpose: intentPurpose.trim() || undefined,
        reference: intentReference.trim() || undefined
      });
      if (selectedGoalIdForIntent) {
        await linkIntentionToGoal(selectedGoalIdForIntent, editingIntentionId);
      }
    } else {
      const newId = await addIntention({
        title: intentTitle.trim(),
        purpose: intentPurpose.trim() || undefined,
        reference: intentReference.trim() || undefined
      });
      if (selectedGoalIdForIntent) {
        await linkIntentionToGoal(selectedGoalIdForIntent, newId);
      }
    }

    setIntentTitle('');
    setIntentPurpose('');
    setIntentReference('');
    setSelectedGoalIdForIntent('');
    setEditingIntentionId(null);
    setIsIntentionModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-28 pt-2 relative">
      {/* Ambient Spiritual Emerald Glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <header className="glass-panel border border-emerald-500/20 rounded-3xl p-4.5 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                مساحة خاصة 100% • دون نقاط XP
              </span>
            </div>
            <h1 className="text-xl font-black text-white flex items-center gap-2 pt-0.5">
              <span>العبادات والنيات</span>
              <Moon className="w-5 h-5 text-emerald-400" />
            </h1>
            <p className="text-xs text-slate-300">
              «إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ» — ربط المقاصد بالله وحفظ أوقات الصلوات والورد وقيام الليل.
            </p>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 p-1 mt-4 rounded-2xl bg-slate-950/80 neo-sunken border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSubTab('PRAYERS')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeSubTab === 'PRAYERS'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">الصلوات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('QURAN')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeSubTab === 'QURAN'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">القرآن ({todayQuranPagesTotal}/{quranTarget})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('QIYAM')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeSubTab === 'QIYAM'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">قيام الليل</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('INTENTIONS')}
            className={`py-2 px-1 rounded-xl transition-all cursor-pointer text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeSubTab === 'INTENTIONS'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">النيات ({intentions.length})</span>
          </button>
        </div>
      </header>

      {/* SUB-TAB 1: PRAYERS */}
      {activeSubTab === 'PRAYERS' && (
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>مواقيت الصلاة بتوقيت القاهرة (الهيئة المصرية العامة للمساحة)</span>
            <span className="font-mono text-emerald-400 font-bold">{prayers.nextPrayer.nameArabic} القادمة</span>
          </div>

          <div className="space-y-2.5">
            {prayerList.map(item => {
              const logToday = worshipLogs.find(w => w.date === todayStr && w.prayerName === item.prayerName);
              const isCompleted = logToday?.status === 'COMPLETED';
              const isInMosque = logToday?.inMosque;

              return (
                <div
                  key={item.key}
                  className={`glass-panel border rounded-2xl p-3.5 flex items-center justify-between gap-3 transition-all ${
                    item.info.isNext
                      ? 'border-emerald-500/50 bg-emerald-950/20 shadow-lg shadow-emerald-950/30'
                      : 'border-slate-800/80 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      item.info.isNext ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.info.isNext ? 'الآن' : <Clock className="w-4 h-4" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{item.name}</h4>
                        {item.info.isNext && (
                          <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                            متبقي {item.info.minutesRemaining} د
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded-full font-bold border border-teal-700/40">
                            {isInMosque ? 'في المسجد 🕌' : 'أُديت ✅'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {item.info.timeFormatted} • نافذة التفرغ: ±15 دقيقة
                      </p>
                    </div>
                  </div>

                  {/* Prayer Action Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => logPrayerWorship(item.prayerName, 'COMPLETED', true)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        isInMosque
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800/80 hover:bg-emerald-900/50 text-slate-300 hover:text-emerald-300 border border-slate-700/60'
                      }`}
                      title="صليت في المسجد"
                    >
                      المسجد 🕌
                    </button>

                    <button
                      type="button"
                      onClick={() => logPrayerWorship(item.prayerName, 'COMPLETED', false)}
                      className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        isCompleted && !isInMosque
                          ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                          : 'bg-slate-800/80 hover:bg-teal-900/50 text-slate-300 hover:text-teal-300 border border-slate-700/60'
                      }`}
                      title="صليت"
                    >
                      صليت ✅
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: QURAN */}
      {activeSubTab === 'QURAN' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Progress Card */}
          <div className="glass-panel border border-emerald-500/30 rounded-3xl p-4.5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  الورد القرآني اليومي
                </span>
                <h3 className="text-lg font-black text-white">
                  {todayQuranPagesTotal} من {quranTarget} صفحات اليوم
                </h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isQuranMet 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              }`}>
                {isQuranMet ? 'اكتمل الورد اليومي 🎉' : `متبقي ${Math.max(0, quranTarget - todayQuranPagesTotal)} صفحات`}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 neo-sunken h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((todayQuranPagesTotal / quranTarget) * 100))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>سلسلة الورد: <strong className="text-emerald-400 font-mono">{quranHabit?.streakCount || 0} يوم</strong> متواصل</span>
              <span className="text-[11px] text-slate-500">منفصل تماماً عن قراءة الكتب العامة (صفحتين)</span>
            </div>
          </div>

          {/* Quick Log Quran Form */}
          <form onSubmit={handleLogQuran} className="glass-panel border border-slate-800 rounded-3xl p-4.5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>تسجيل قراءة قرآن جديدة اليوم</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">عدد الصفحات:</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={quranPagesInput}
                    onChange={e => setQuranPagesInput(Math.max(1, Number(e.target.value)))}
                    min={1}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setQuranPagesInput(3)}
                    className="bg-slate-800 hover:bg-slate-700 text-[10px] text-emerald-400 font-bold px-2 py-2 rounded-xl shrink-0"
                  >
                    3 صف
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">السورة (اختياري):</label>
                <input
                  type="text"
                  value={surahStartInput}
                  onChange={e => setSurahStartInput(e.target.value)}
                  placeholder="مثال: سورة الكهف..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">خاطرة أو آية استوقفتك (اختياري):</label>
              <input
                type="text"
                value={quranNotesInput}
                onChange={e => setQuranNotesInput(e.target.value)}
                placeholder="تأمل، دعاء، أو موضع تدبر..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-md shadow-emerald-950/40 pressable cursor-pointer"
            >
              تسجيل القراءة في الورد 📖
            </button>
          </form>

          {/* Quran History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 px-1">سجل التلاوات الأخير:</h4>
            {quranLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center">لا توجد تسجيلات بعد — ابدأ بورد اليوم 🌿</p>
            ) : (
              quranLogs.slice(-5).reverse().map(log => (
                <div key={log.id} className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{log.pagesRead} صفحات</span>
                    {log.surahStart && <span className="text-slate-400 mr-2">({log.surahStart})</span>}
                    {log.notes && <p className="text-[11px] text-slate-500 mt-0.5">{log.notes}</p>}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{log.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: QIYAM AL-LAYL */}
      {activeSubTab === 'QIYAM' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Spiritual Guidance Banner */}
          <div className="glass-panel border border-slate-800 rounded-3xl p-4 text-xs text-slate-300 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Moon className="w-4 h-4" />
              <span>قيام الليل وصلاة الوتر</span>
            </div>
            <p className="leading-relaxed">
              «أَفْضَلُ الصَّلَاةِ بَعْدَ الصَّلَاةِ الْمَكْتُوبَةِ الصَّلَاةُ فِي جَوْفِ اللَّيْلِ» — قيام الليل عبادة وسر بين العبد وربه؛ التطبيق لا يفرض أي عدد ركعات افتراضي ولا يمنح نقاطاً، بل يسجل حضورك واستمراريتك.
            </p>
          </div>

          {/* Qiyam Logging Form */}
          <form onSubmit={handleLogQiyam} className="glass-panel border border-slate-800 rounded-3xl p-4.5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>تسجيل جلسة قيام ليل</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">وقت البدء:</label>
                <input
                  type="time"
                  value={qiyamStart}
                  onChange={e => setQiyamStart(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">وقت الانتهاء (يدعم بعد منتصف الليل):</label>
                <input
                  type="time"
                  value={qiyamEnd}
                  onChange={e => setQiyamEnd(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Live Duration Calculation Badge */}
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">المدة المحسوبة بدقة:</span>
              <span className="font-bold text-emerald-400 font-mono">
                {qiyamDurationCalc} دقيقة {qiyamEnd < qiyamStart && '(تجاوز منتصف الليل 🌙)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">عدد الركعات (اختياري):</label>
                <input
                  type="number"
                  value={qiyamRakahs}
                  onChange={e => setQiyamRakahs(Number(e.target.value))}
                  min={1}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">ملاحظة أو دعاء (اختياري):</label>
                <input
                  type="text"
                  value={qiyamNotes}
                  onChange={e => setQiyamNotes(e.target.value)}
                  placeholder="دعاء، خشوع، تدبر..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-md shadow-emerald-950/40 pressable cursor-pointer"
            >
              تسجيل قيام الليل تقبّل الله 🌙
            </button>
          </form>

          {/* Qiyam History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 px-1">سجل قيام الليل:</h4>
            {qiyamSessions.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 text-center">لا توجد جلسات مسجلة بعد 🌙</p>
            ) : (
              qiyamSessions.slice(-5).reverse().map(session => (
                <div key={session.id} className="bg-slate-900/60 border border-slate-800/80 p-3 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{session.durationMinutes} دقيقة</span>
                      {session.rakahsCount && (
                        <span className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded font-mono">
                          {session.rakahsCount} ركعات
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {session.startTime} ← {session.endTime}
                    </span>
                    {session.notes && <p className="text-[11px] text-slate-500 mt-0.5">{session.notes}</p>}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-500">{session.date}</span>
                    <button
                      type="button"
                      onClick={() => deleteQiyamSession(session.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: INTENTIONS LIBRARY */}
      {activeSubTab === 'INTENTIONS' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">مكتبة النيات والمقاصد</h3>
              <p className="text-xs text-slate-400">نياتك الصادقة المرتبطة بأهداف حياتك ودراستك وعملك.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingIntentionId(null);
                setIntentTitle('');
                setIntentPurpose('');
                setIntentReference('');
                setSelectedGoalIdForIntent('');
                setIsIntentionModalOpen(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/40 pressable cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة نية</span>
            </button>
          </div>

          {intentions.length === 0 ? (
            <div className="glass-panel border border-slate-800/80 rounded-3xl p-8 text-center space-y-3">
              <HeartHandshake className="w-10 h-10 text-emerald-400/50 mx-auto" />
              <h4 className="text-sm font-bold text-white">لم تقم بإضافة نيات خاصة بعد</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                النية تحول العمل العادي إلى عبادة. يمكنك صياغة نياتك لدراسة النانوتكنولوجي، بر الوالدين، متجر فالكون، والتعلم وربطها بأهدافك.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {intentions.map(intent => {
                // Find linked goals
                const linked = goalIntentions
                  .filter(gi => gi.intentionId === intent.id)
                  .map(gi => goals.find(g => g.id === gi.goalId))
                  .filter(Boolean);

                return (
                  <div
                    key={intent.id}
                    className="glass-panel border border-slate-800/80 rounded-3xl p-4.5 space-y-3 relative shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
                          <h4 className="text-sm font-extrabold text-white">{intent.title}</h4>
                        </div>
                        {intent.purpose && (
                          <p className="text-xs text-slate-300 leading-relaxed pr-6">
                            {intent.purpose}
                          </p>
                        )}
                        {intent.reference && (
                          <p className="text-[11px] text-emerald-400/80 italic pr-6">
                            «{intent.reference}»
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingIntentionId(intent.id);
                            setIntentTitle(intent.title);
                            setIntentPurpose(intent.purpose || '');
                            setIntentReference(intent.reference || '');
                            const linkedGoal = linked[0];
                            setSelectedGoalIdForIntent(linkedGoal ? linkedGoal.id : '');
                            setIsIntentionModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-sky-300 rounded-lg hover:bg-slate-800"
                          title="تعديل"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteIntention(intent.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Linked Goals Badges */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" />
                        الأهداف المرتبطة:
                      </span>
                      {linked.length === 0 ? (
                        <span className="text-[10px] text-slate-500 italic">غير مرتبطة بهدف محدد</span>
                      ) : (
                        linked.map(g => (
                          <span
                            key={g!.id}
                            className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-700/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                          >
                            <span>🎯 {g!.title}</span>
                            <button
                              type="button"
                              onClick={() => unlinkIntentionFromGoal(g!.id, intent.id)}
                              className="hover:text-rose-400 ml-1 text-slate-400"
                            >
                              ×
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Intention Modal */}
      {isIntentionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {editingIntentionId ? 'تعديل النية' : 'إضافة نية مباركة جديدة'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsIntentionModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIntention} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">النية أو المقصد:</label>
                <input
                  type="text"
                  value={intentTitle}
                  onChange={e => setIntentTitle(e.target.value)}
                  placeholder="مثال: نيل رضا الله، إتقان العلم لنفع الأمة، عفة النفس..."
                  required
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">بيان المقصد والأثر (اختياري):</label>
                <textarea
                  value={intentPurpose}
                  onChange={e => setIntentPurpose(e.target.value)}
                  placeholder="كيف يغير هذا المقصد نظرتك للمذاكرة أو العمل والتعب اليومي؟"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">شاهد شرعي أو حكمة (اختياري):</label>
                <input
                  type="text"
                  value={intentReference}
                  onChange={e => setIntentReference(e.target.value)}
                  placeholder="آية، حديث شريف، أو مقولة مأثورة..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-bold block mb-1">ربط بهدف استراتيجي (اختياري):</label>
                <select
                  value={selectedGoalIdForIntent}
                  onChange={e => setSelectedGoalIdForIntent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- بدون ربط فوري --</option>
                  {goals.map(g => (
                    <option key={g.id} value={g.id}>
                      🎯 {g.title} ({g.horizon})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsIntentionModalOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl shadow-md pressable cursor-pointer"
                >
                  حفظ النية 🤲
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
