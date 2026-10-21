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
  Moon
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
          id: 'FAITH' as ActiveTab,
          label: 'العبادات والنيات',
          desc: 'مواقيت الصلاة، الورد القرآني (3 صفحات)، قيام الليل، ومكتبة النيات',
          icon: <Moon className="w-5 h-5 text-emerald-400" />,
          color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20'
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 w-full max-w-md space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-white">
              جميع مساحات مَسار
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto scrollbar-none">
          {menuSections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                {sec.title}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {sec.items.map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full p-3 rounded-2xl border bg-gradient-to-r ${item.color} flex items-center gap-3 text-right hover:border-slate-600 transition-all pressable cursor-pointer`}
                  >
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-extrabold text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800 text-center">
          <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            مَسار الإصدار 1.3.1 — خصوصية محلية أولاً 🔒
          </span>
        </div>
      </div>
    </div>
  );
};
