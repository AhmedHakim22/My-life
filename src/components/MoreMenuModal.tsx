import React from 'react';
import { 
  BookOpen, 
  Briefcase, 
  BookMarked, 
  GraduationCap, 
  Cloud, 
  ShieldCheck, 
  X,
  Sparkles,
  Layers,
  Heart,
  Moon,
  Dumbbell,
  Calendar,
  Trophy
} from 'lucide-react';
import { useAppStore, type ActiveTab } from '../stores/appStore';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab } = useAppStore();

  if (!isOpen) return null;

  const menuSections = [
    {
      title: 'مساحات العمل الروحانية والإضافية',
      items: [
        {
          id: 'CHALLENGES' as ActiveTab,
          label: 'التحديات وروتين الـ 90 يوم',
          desc: 'روتين الـ 90 يوم × 90 دقيقة، التحديات المخصصة، ومخطط التتبع الشهري والأوسمة',
          icon: <Trophy className="w-5 h-5 text-amber-400" />,
          color: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20'
        },
        {
          id: 'SCHEDULE' as ActiveTab,
          label: 'المخطط الأسبوعي وتوزيع الوقت',
          desc: 'حساب السعة الواقعية، رصد الحمل الزائد، وجدول الحصص والمهام بدون تعارض',
          icon: <Calendar className="w-5 h-5 text-sky-400" />,
          color: 'from-sky-500/10 to-blue-500/10 border-sky-500/20'
        },
        {
          id: 'FAITH' as ActiveTab,
          label: 'العبادات والنيات',
          desc: 'مواقيت الصلاة، الورد القرآني (3 صفحات)، قيام الليل، ومكتبة النيات',
          icon: <Moon className="w-5 h-5 text-emerald-400" />,
          color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20'
        },
        {
          id: 'FITNESS' as ActiveTab,
          label: 'الصحة والرياضة',
          desc: 'تتبع 20 دقيقة حركة يومية، جلسات الجيم، وقواعد النوم والتفرغ',
          icon: <Dumbbell className="w-5 h-5 text-rose-400" />,
          color: 'from-rose-500/10 to-orange-500/10 border-rose-500/20'
        },
        {
          id: 'BOOKS' as ActiveTab,
          label: 'مكتبة الكتب والأرفف',
          desc: 'تتبع قراءة الصفحات، الأرفف، والاقتباسات',
          icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
          color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20'
        },
        {
          id: 'FALCON' as ActiveTab,
          label: 'فالكون — الشريك المؤسس',
          desc: 'مشاريع البراند، الحملات، والمهام الشخصية',
          icon: <Briefcase className="w-5 h-5 text-amber-400" />,
          color: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20'
        },
        {
          id: 'JOURNAL' as ActiveTab,
          label: 'اليوميات والتأمل الخاص',
          desc: 'تدوين حر وتأملات موجهة بخصوصية تامة محلياً',
          icon: <BookMarked className="w-5 h-5 text-sky-400" />,
          color: 'from-sky-500/10 to-blue-500/10 border-sky-500/20'
        }
      ]
    },
    {
      title: 'التقدم العلمي والأداء',
      items: [
        {
          id: 'JOURNAL' as ActiveTab, // Opens analytics view inside journal tab
          label: 'سلم الرتب العلمية والـ XP',
          desc: 'التقدم نحو رتبة أستاذ علوم، الإنجازات، والأثر',
          icon: <GraduationCap className="w-5 h-5 text-purple-400" />,
          color: 'from-purple-500/10 to-indigo-500/10 border-purple-500/20'
        }
      ]
    }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="apple-card border border-white/[0.1] rounded-t-[32px] sm:rounded-[26px] p-5 w-full max-w-md space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto -mt-1 mb-1 sm:hidden" />
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-400/20 flex items-center justify-center text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">
              جميع مساحات مَسار
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] text-[#8e8e93] hover:text-white flex items-center justify-center pressable cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-none">
          {menuSections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <span className="text-[10px] font-bold text-[#8e8e93] uppercase tracking-wider px-1">
                {sec.title}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {sec.items.map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className="w-full p-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.12] flex items-center gap-3 text-right transition-all pressable cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-black/40 border border-white/[0.06] shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[10px] text-[#8e8e93] truncate">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-white/[0.08] text-center">
          <span className="text-[10px] text-[#8e8e93] flex items-center justify-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            مَسار الإصدار 2.0 — خصوصية محلية أولاً 🔒
          </span>
        </div>
      </div>
    </div>
  );
};
