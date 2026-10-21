import React, { useRef } from 'react';
import { 
  GraduationCap, 
  Crown, 
  Flame, 
  ShieldCheck, 
  Download, 
  Upload, 
  Sparkles, 
  Clock, 
  History,
  Award,
  Layers
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { SCIENTIFIC_RANKS } from '../engines/gamification';
import { fireConfettiSuccess, fireConfettiLevelUp } from '../lib/confetti';

export const AnalyticsView: React.FC = () => {
  const { rankProgress, xpTransactions, exportBackupJSON, importBackupJSON, showToast } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    fireConfettiSuccess();
    const json = await exportBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `masaar-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير النسخة الاحتياطية بنجاح 💾');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const success = await importBackupJSON(text);
    if (success) {
      fireConfettiLevelUp();
      showToast('تمت استعادة بياناتك بنجاح 100% ✨');
    } else {
      showToast('خطأ في استيراد الملف. تأكد من سلامة ملف الـ JSON');
    }
  };

  return (
    <div className="space-y-4 pt-3 relative">
      {/* 3D Ambient Purple Glow (Trend 8) */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header (Trend 9 Bold Typography & Trend 4 Glassmorphism) */}
      <header className="glass-panel rounded-3xl p-4.5 flex items-center justify-between border border-white/10 shadow-xl shadow-black/40">
        <div>
          <span className="text-[11px] font-bold text-purple-400 tracking-wider uppercase">
            التحفيز العلمي والأكاديمي
          </span>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
            الرتب العلمية والأثر الأكاديمي 📊
          </h1>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-300 font-black shadow-[0_0_12px_rgba(168,85,247,0.25)]">
          <Award className="w-5 h-5" />
        </div>
      </header>

      {/* 1. Scientific Ladder Hero Card (Trend 3 Gradients & Trend 8 3D Elements) */}
      <section className="glass-panel-purple rounded-3xl p-5 space-y-4 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* 3D Orbital Badge (Trend 8) */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-xl shadow-purple-900/40 font-black shrink-0 relative">
              <GraduationCap className="w-7 h-7 stroke-[2]" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-slate-950" />
            </div>

            <div>
              <span className="text-[10px] text-purple-300 font-mono font-bold uppercase tracking-wider bg-purple-950/80 px-2 py-0.5 rounded-md border border-purple-700/50">
                المستوى {rankProgress.currentRank.level} من 7
              </span>
              <h2 className="text-lg font-black text-white mt-1">
                {rankProgress.currentRank.titleArabic}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {rankProgress.currentRank.titleEnglish}
              </p>
            </div>
          </div>

          <div className="text-left font-mono">
            <span className="text-xl font-black text-purple-300">
              {rankProgress.totalXP}
            </span>
            <span className="text-xs text-slate-400 font-bold"> XP</span>
          </div>
        </div>

        {/* Progress to Next Level */}
        {rankProgress.nextRank ? (
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-200">
              <span>الترقية القادمة: <strong className="text-purple-300">{rankProgress.nextRank.titleArabic}</strong></span>
              <span className="font-mono text-purple-400 font-bold">{rankProgress.progressToNextPercentage}%</span>
            </div>

            {/* Neo-Sunken Progress Bar (Trend 2) */}
            <div className="w-full bg-slate-950 neo-sunken h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 via-indigo-400 to-sky-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${rankProgress.progressToNextPercentage}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 text-left font-mono">
              متبقي {rankProgress.nextRank.minXP - rankProgress.totalXP} XP للترقية إلى رتبة {rankProgress.nextRank.titleArabic}
            </p>
          </div>
        ) : (
          <div className="bg-amber-950/40 p-3 rounded-2xl border border-amber-600/40 text-center">
            <span className="text-xs font-bold text-amber-300">أعلى رتبة علمية مكتملة 👑</span>
          </div>
        )}

        {/* 2. Professor of Science Gate Status (6-Month Time-Lock) */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>شرط رتبة أستاذ علوم (6 أشهر موثقة)</span>
            </div>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
              rankProgress.isProfessorEligible 
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700' 
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}>
              {rankProgress.isProfessorEligible ? 'مؤهل للتتويج 👑' : 'قيد التقدم ⏳'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">الأيام التقويمية</div>
              <div className="font-extrabold text-purple-300 font-mono mt-0.5">
                {rankProgress.calendarDaysSinceStart} من 180 يوم
              </div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">الأيام النشطة المسجلة</div>
              <div className="font-extrabold text-sky-400 font-mono mt-0.5">
                {rankProgress.distinctActiveDays} من 120 يوم
              </div>
            </div>
          </div>

          {!rankProgress.isProfessorEligible && rankProgress.professorBlockerReason && (
            <p className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2 rounded-xl border border-amber-800/40 text-center font-medium">
              ⚠️ {rankProgress.professorBlockerReason}
            </p>
          )}
        </div>
      </section>

      {/* 3. XP Transaction Ledger */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span>دفتر أستاذ الـ XP الموثق ({xpTransactions.length})</span>
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">حماية ضد التكرار 🛡️</span>
        </div>

        <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
          {xpTransactions.slice().reverse().map(tx => (
            <div
              key={tx.id}
              className="glass-panel border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm"
            >
              <div>
                <div className="text-xs font-medium text-slate-200 truncate">{tx.reason}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{tx.createdAt.split('T')[0]}</div>
              </div>

              <span className="text-xs font-black font-mono text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-xl border border-purple-700/40 shrink-0">
                +{tx.amount} XP
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. One-Click Backup Export & Restore */}
      <section className="glass-panel rounded-3xl p-5 space-y-3.5 border border-white/10 shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white">ملكية البيانات التامة (Local-First Backup)</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          بياناتك ملكك بالكامل. يمكنك تنزيل نسخة احتياطية شاملة بصيغة JSON وحفظها على هاتفك، واستعادتها في أي وقت دون اعتماد على أي طرف خارجي.
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleExport}
            className="glass-panel hover:bg-slate-800/80 text-white text-xs font-bold py-3 px-3.5 rounded-2xl border border-slate-700/80 flex items-center justify-center gap-2 pressable cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>تصدير نسخة (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="glass-panel hover:bg-slate-800/80 text-white text-xs font-bold py-3 px-3.5 rounded-2xl border border-slate-700/80 flex items-center justify-center gap-2 pressable cursor-pointer shadow-md"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>استعادة من ملف</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
      </section>
    </div>
  );
};
