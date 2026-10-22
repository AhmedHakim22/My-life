import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudOff, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Database, 
  AlertTriangle,
  X
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({ isOpen, onClose }) => {
  const { syncStatus, checkCloudStatus, syncWithCloud, showToast } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopySQL = async () => {
    try {
      // In browser, fetch quick_migration.sql or schema.sql
      let response = await fetch('/supabase/quick_migration.sql');
      if (!response.ok) {
        response = await fetch('/supabase/schema.sql');
      }
      let sqlText = '';
      if (response.ok) {
        sqlText = await response.text();
      } else {
        sqlText = `-- يرجى فتح ملف supabase/quick_migration.sql داخل مجلد المشروع ونسخ محتواه`;
      }

      await navigator.clipboard.writeText(sqlText);
      setCopied(true);
      showToast('تم نسخ كود SQL المحدث للحافظة بنجاح 📋');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast('يرجى نسخ الملف يدوياً من مجلد public/supabase/quick_migration.sql');
    }
  };

  const handleRecheck = async () => {
    setIsChecking(true);
    await checkCloudStatus();
    setIsChecking(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="apple-card border border-white/[0.12] rounded-t-[32px] sm:rounded-[26px] max-w-md w-full p-5 sm:p-6 text-slate-100 shadow-2xl space-y-4 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto"
        dir="rtl"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Swipe/Pull Indicator */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto -mt-1 mb-2 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-sky-500/15 text-sky-400 rounded-2xl border border-sky-400/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">مزامنة سحابة سوبا بيز (Supabase)</h2>
              <p className="text-xs text-[#8e8e93] font-mono">Project: phogtpgejvstfxkrhjqz</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#8e8e93] hover:text-white flex items-center justify-center pressable cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State A: Ready & Tables Exist */}
        {syncStatus.isConnected && syncStatus.tablesFound && (
          <div className="space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-300">السحابة متصلة وجاهزة 100%</h4>
                <p className="text-xs text-slate-300 mt-1">
                  تم التحقق من الجداول ومفاتيح الربط بنجاح. بياناتك مشفرة ومحمية وتتم مزامنتها تلقائياً.
                </p>
                {syncStatus.lastSyncedAt && (
                  <p className="text-[11px] text-emerald-400/80 mt-2 font-mono">
                    آخر مزامنة ناجحة: {syncStatus.lastSyncedAt}
                  </p>
                )}
              </div>
            </div>

            <div className="p-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs text-sky-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>المزامنة التلقائية اللحظية (Realtime Auto-Sync) مفعّلة تلقائياً بين الهاتف واللابتوب ⚡</span>
            </div>

            <button
              type="button"
              onClick={syncWithCloud}
              disabled={syncStatus.isSyncing}
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              <span>{syncStatus.isSyncing ? 'جارِ المزامنة الآن...' : 'مزامنة كل البيانات يدوياً الآن'}</span>
            </button>

            {/* Quick update helper */}
            <div className="p-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span>تحديث جداول السحابة التكميلية</span>
                <span className="text-[10px] text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full font-mono">SQL v2.0</span>
              </div>
              <p className="text-[11px] text-[#8e8e93] leading-relaxed">
                إذا أردت إنشاء جداول التحديات ومواقيت الصلاة في سوبا بيز، انسخ كود التحديث السريع وشغله في محرر SQL بضغطة واحدة:
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopySQL}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold flex items-center justify-center gap-1.5 pressable cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-sky-400" />
                  <span>{copied ? 'تم النسخ!' : 'نسخ كود التحديث'}</span>
                </button>
                <a
                  href="https://supabase.com/dashboard/project/phogtpgejvstfxkrhjqz/sql/new"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 border border-sky-400/20 text-xs font-bold flex items-center justify-center gap-1.5 pressable"
                >
                  <span>فتح SQL Editor</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* State B: Connected but Tables Missing (Needs 1-click SQL Run) */}
        {syncStatus.isConnected && !syncStatus.tablesFound && (
          <div className="space-y-4">
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-300">الاتصال ناجح.. فاضل خطوة واحدة بس!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  المشروع مربوط بسوبا بيز تمام، ولكن محتاجين ننشئ جداول قاعدة البيانات (17 جدول) داخل مشروعك لأول مرة.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-slate-200">الخطوات البسيطة (تأخذ 15 ثانية):</h5>
              
              <ol className="text-xs text-slate-300 space-y-2.5 pr-4 list-decimal">
                <li>
                  <span>افتح صفحة استعلامات SQL في مشروعك على سوبا بيز:</span>
                  <a
                    href="https://supabase.com/dashboard/project/phogtpgejvstfxkrhjqz/sql/new"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-bold mt-1 text-[11px]"
                  >
                    <span>فتح محرر سوبا بيز (SQL Editor)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>
                  <span>انسخ كود الجداول المجهز بالكامل:</span>
                  <button
                    type="button"
                    onClick={handleCopySQL}
                    className="mt-1 flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition font-medium border border-slate-600"
                  >
                    <Copy className="w-3.5 h-3.5 text-sky-400" />
                    <span>{copied ? 'تم النسخ بنجاح! 📋' : 'نسخ كود supabase/schema.sql'}</span>
                  </button>
                </li>
                <li>
                  <span>الصق الكود في الصفحة واضغط الزر الأخضر <b>Run</b> (أو اضغط Ctrl + Enter).</span>
                </li>
              </ol>
            </div>

            <button
              type="button"
              onClick={handleRecheck}
              disabled={isChecking}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'جارِ فحص الجداول...' : 'شغّلت الكود؟ اضغط هنا للتحقق الآن 🚀'}</span>
            </button>
          </div>
        )}

        {/* State C: Not Connected or Loading */}
        {!syncStatus.isConnected && (
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex items-start gap-3">
              <CloudOff className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-300">جارِ فحص الاتصال بسوبا بيز...</h4>
                <p className="text-xs text-slate-400 mt-1">
                  المفاتيح مسجلة في ملف البيئة. بنحاول الاتصال بمشروعك الآن.
                </p>
                {syncStatus.error && (
                  <p className="text-[11px] text-amber-400/90 mt-2 font-mono">
                    ملاحظة: {syncStatus.error}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleRecheck}
              disabled={isChecking}
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'جارِ الفحص...' : 'إعادة محاولة الاتصال'}</span>
            </button>
          </div>
        )}

        {/* Local-First Privacy Guarantee */}
        <div className="border-t border-slate-800/80 pt-3 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>مَسار مصمم بمعمارية Local-First: كل شيء يعمل بدون نت، والمزامنة السحابية اختيارية لحفظ نسخ احتياطية.</span>
        </div>

        {/* Full-Width Close Button for Easy Mobile Dismissal */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold transition-all pressable cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
          >
            <X className="w-4 h-4" />
            <span>إغلاق النافذة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
