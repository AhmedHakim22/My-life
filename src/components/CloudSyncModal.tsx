import React, { useState } from 'react';
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

  if (!isOpen) return null;

  const handleCopySQL = async () => {
    try {
      // In browser, fetch schema.sql or copy from static string
      const response = await fetch('/supabase/schema.sql');
      let sqlText = '';
      if (response.ok) {
        sqlText = await response.text();
      } else {
        sqlText = `-- يرجى فتح ملف supabase/schema.sql داخل مجلد المشروع ونسخ محتواه`;
      }

      await navigator.clipboard.writeText(sqlText);
      setCopied(true);
      showToast('تم نسخ كود SQL إلى الحافظة بنجاح 📋');
      setTimeout(() => setCopied(false), 3000);
    } catch {
      showToast('يرجى نسخ الملف يدوياً من مجلد supabase/schema.sql');
    }
  };

  const handleRecheck = async () => {
    setIsChecking(true);
    await checkCloudStatus();
    setIsChecking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="apple-card border border-white/[0.1] rounded-[26px] max-w-md w-full p-6 text-slate-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        dir="rtl"
      >
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

            <button
              type="button"
              onClick={syncWithCloud}
              disabled={syncStatus.isSyncing}
              className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-sky-500/20 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              <span>{syncStatus.isSyncing ? 'جارِ المزامنة الآن...' : 'مزامنة كل البيانات الآن'}</span>
            </button>
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
      </div>
    </div>
  );
};
