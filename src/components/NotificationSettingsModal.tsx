import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  Moon, 
  Briefcase, 
  GraduationCap, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendTestNotification, 
  getNotificationSettings, 
  saveNotificationSettings,
  isIOS,
  isStandalonePWA,
  type NotificationPermissionStatus,
  type NotificationSettings
} from '../lib/notifications';
import { useAppStore } from '../stores/appStore';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useAppStore();
  const [permission, setPermission] = useState<NotificationPermissionStatus>('default');
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings());
  const [isTesting, setIsTesting] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPermission(getNotificationPermission());
      setSettings(getNotificationSettings());
      setIsIosDevice(isIOS());
      setIsStandalone(isStandalonePWA());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') {
      showToast('تم تفعيل إشعارات المتصفح بنجاح! 🔔');
      await sendTestNotification();
    } else if (result === 'denied') {
      showToast('تم حظر الإشعارات من إعدادات المتصفح. يرجى تفعيلها يدوياً.');
    }
  };

  const handleTestNotification = async () => {
    setIsTesting(true);
    const sent = await sendTestNotification();
    setIsTesting(false);
    if (sent) {
      showToast('تم إرسال إشعار تجريبي بنجاح! تفقد شريط الإشعارات 📣');
    } else {
      showToast('تعذر إظهار الإشعار. تأكد من تفعيل الإذن في المتصفح.');
    }
  };

  const updateSetting = <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#07080b]/80 backdrop-blur-md overflow-y-auto p-0 sm:p-4 flex flex-col justify-end sm:justify-center items-center animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-[#14151a] border border-white/[0.12] rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 w-full max-w-md my-0 sm:my-auto max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Swipe/Pull Indicator */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-400 shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">إعدادات الإشعارات والتنبيهات</h2>
              <p className="text-[11px] text-[#8e8e93]">تنبيهات مواقيت الصلاة، العادات، والمبيعات</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="text-[#8e8e93] hover:text-white p-1 rounded-xl hover:bg-white/[0.06] pressable cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Status Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          permission === 'granted'
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
            : permission === 'denied'
            ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
            : 'bg-sky-950/30 border-sky-500/30 text-sky-200'
        }`}>
          <div className="flex items-start gap-3">
            {permission === 'granted' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 space-y-1">
              <div className="text-xs font-extrabold">
                {permission === 'granted' && 'الإشعارات مفعّلة بنجاح على هذا الجهاز 🟢'}
                {permission === 'default' && 'إذن الإشعارات لم يتم منحه بعد 🟡'}
                {permission === 'denied' && 'الإشعارات محظورة من إعدادات المتصفح 🔴'}
                {permission === 'unsupported' && 'المتصفح لا يدعم إشعارات الويب المباشرة ℹ️'}
              </div>
              <p className="text-[11px] opacity-80 leading-relaxed">
                {permission === 'granted' && 'ستصلك التنبيهات مع نغمة هادئة واهتزاز خفيف للمهام والصلوات.'}
                {permission === 'default' && 'اضغط على الزر أدناه لمنح الإذن لتلقي التنبيهات المهمة في وقتها.'}
                {permission === 'denied' && 'اضغط على علامة القفل بجانب شريط العنوان في المتصفح ثم اختر السماح بالإشعارات.'}
                {permission === 'unsupported' && 'يرجى فتح التطبيق من متصفح حديث مثل Chrome أو إضافة التطبيق للشاشة الرئيسية.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3.5 flex flex-wrap gap-2 pt-2 border-t border-white/[0.08]">
            {permission !== 'granted' ? (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="apple-btn-primary flex-1 py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md pressable cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>تفعيل الإشعارات الآن</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleTestNotification}
                disabled={isTesting}
                className="flex-1 bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/[0.12] py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all pressable cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>{isTesting ? 'جاري الإرسال...' : 'إرسال إشعار تجريبي 📣'}</span>
              </button>
            )}
          </div>
        </div>

        {/* iPhone / iOS Special Guide */}
        {isIosDevice && !isStandalone && (
          <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>مستخدمي آيفون (iOS 16.4+) 📱</span>
            </div>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              وفقاً لقواعد نظام Apple، لتلقي إشعارات الويب حتى عند إغلاق المتصفح:
            </p>
            <ol className="text-[11px] text-slate-300 space-y-1.5 pr-4 list-decimal">
              <li className="flex items-center gap-1.5">
                <span>اضغط زر المشاركة أسفل Safari</span>
                <Share2 className="w-3.5 h-3.5 text-sky-400 inline" />
              </li>
              <li className="flex items-center gap-1.5">
                <span>اختر "إضافة إلى الصفحة الرئيسية"</span>
                <PlusSquare className="w-3.5 h-3.5 text-sky-400 inline" />
              </li>
              <li>افتح التطبيق من الشاشة الرئيسية وفعّل الإشعارات من هذه النافذة.</li>
            </ol>
          </div>
        )}

        {/* Alert Categories & Switches */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-extrabold text-slate-300 tracking-wide">أنواع التنبيهات النشطة</h3>

          {/* 1. Prayer Times */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">مواقيت الصلاة الخمس</div>
                <div className="text-[10px] text-[#8e8e93]">تنبيه عند حلول موعد كل صلاة وقبلها بـ 10 دقائق</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.prayers}
              onChange={e => updateSetting('prayers', e.target.checked)}
              className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
            />
          </div>

          {/* 2. Habits & Quran */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">الورد القرآني والعادات المسائية</div>
                <div className="text-[10px] text-[#8e8e93]">تذكير مسائي لقراءة الورد وتثبيت خط العادات</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.habits}
              onChange={e => updateSetting('habits', e.target.checked)}
              className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
            />
          </div>

          {/* 3. Falcon Work & Sales */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">تنبيهات العمل والمبيعات</div>
                <div className="text-[10px] text-[#8e8e93]">إشعار عند تسجيل مبيعات جديدة وتحقيق المستهدف اليومي</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.falcon}
              onChange={e => updateSetting('falcon', e.target.checked)}
              className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
            />
          </div>

          {/* 4. University & Study */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">الجدول الدراسي والجامعة</div>
                <div className="text-[10px] text-[#8e8e93]">تذكير بمواعيد المحاضرات وجلسات المذاكرة المجدولة</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.study}
              onChange={e => updateSetting('study', e.target.checked)}
              className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
            />
          </div>

          {/* 5. Sound Chime */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                {settings.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white">نغمة التنبيه الهادئة (Chime)</div>
                <div className="text-[10px] text-[#8e8e93]">تشغيل نغمة صوتية أبل ناعمة مع كل تنبيه</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={e => updateSetting('sound', e.target.checked)}
              className="w-5 h-5 accent-sky-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-white/[0.08] hover:bg-white/[0.12] text-white py-3 rounded-2xl text-xs font-bold pressable cursor-pointer"
          >
            حفظ وإغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
