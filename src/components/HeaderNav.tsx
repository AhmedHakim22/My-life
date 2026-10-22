import React from 'react';
import { 
  Compass, 
  Target, 
  GraduationCap, 
  Cpu, 
  BookOpen, 
  Briefcase, 
  BookMarked, 
  Plus, 
  Cloud, 
  Sparkles,
  Wifi,
  WifiOff,
  Moon,
  Dumbbell,
  Calendar,
  Trophy
} from 'lucide-react';
import { useAppStore, type ActiveTab } from '../stores/appStore';

export const HeaderNav: React.FC = () => {
  const { activeTab, setActiveTab, setQuickCaptureOpen, syncStatus } = useAppStore();

  const desktopNavItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'TODAY', label: 'اليوم', icon: <Compass className="w-4 h-4" /> },
    { id: 'GOALS', label: 'الأهداف', icon: <Target className="w-4 h-4" /> },
    { id: 'UNIVERSITY', label: 'الأكاديمية', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'LEARNING', label: 'التعلم', icon: <Cpu className="w-4 h-4" /> },
    { id: 'CHALLENGES', label: 'التحديات', icon: <Trophy className="w-4 h-4" /> },
    { id: 'SCHEDULE', label: 'الجدول الأسبوعي', icon: <Calendar className="w-4 h-4" /> },
    { id: 'FAITH', label: 'العبادات والنيات', icon: <Moon className="w-4 h-4" /> },
    { id: 'FITNESS', label: 'الرياضة', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'BOOKS', label: 'المكتبة', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'FALCON', label: 'فالكون', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'JOURNAL', label: 'اليوميات', icon: <BookMarked className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-2xl border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 shadow-md shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-sky-400 font-black text-sm">
              مـ
            </div>
          </div>
          <div>
            <div className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
              <span>مَسار</span>
              <span className="text-[10px] text-sky-400 font-mono font-bold bg-sky-950/60 border border-sky-800/40 px-1.5 py-0.2 rounded">V2.0</span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline">Personal Life Coach & Study OS</span>
          </div>
        </div>

        {/* Desktop / Tablet Navigation Pills */}
        <nav className="hidden sm:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
          {desktopNavItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 pressable cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-extrabold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Quick Actions: Quick Capture & Sync Status */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setQuickCaptureOpen(true)}
            className="bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-500/20 pressable cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">تسجيل سريع</span>
          </button>
        </div>
      </div>
    </header>
  );
};
