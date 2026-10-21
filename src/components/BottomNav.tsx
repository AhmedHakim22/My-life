import React from 'react';
import { Compass, GraduationCap, BookOpen, Briefcase, BookMarked, Plus } from 'lucide-react';
import { useAppStore, type ActiveTab } from '../stores/appStore';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setQuickCaptureOpen } = useAppStore();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'TODAY', label: 'اليوم الذكي', icon: <Compass className="w-5 h-5" /> },
    { id: 'UNIVERSITY', label: 'الأكاديمية', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'BOOKS', label: 'الكتب والتعلم', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'FALCON', label: 'فالكون', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'JOURNAL', label: 'اليوميات', icon: <BookMarked className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-2xl border-t border-slate-800/80 px-3 pb-safe pt-1">
      <div className="max-w-md mx-auto flex items-center justify-between h-16 relative">
        {navItems.map((item, index) => {
          const isActive = activeTab === item.id;
          return (
            <React.Fragment key={item.id}>
              {/* Center Floating Quick Capture (+) Button (Trend 2 & Trend 6) */}
              {index === 2 && (
                <div className="relative -mt-7 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setQuickCaptureOpen(true)}
                    aria-label="تسجيل سريع"
                    className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-400 to-blue-600 text-slate-950 flex items-center justify-center shadow-xl shadow-sky-500/30 border border-sky-300/40 pressable cursor-pointer group"
                  >
                    <Plus className="w-7 h-7 stroke-[2.5] group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                  <span className="text-[10px] font-bold text-sky-400/90 mt-1">إضافة</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-14 h-full relative pressable cursor-pointer ${
                  isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active Indicator Glow Pip (Trend 6) */}
                {isActive && (
                  <span className="absolute top-1.5 w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                )}

                <div className={`transition-all duration-200 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : ''}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] mt-1 tracking-tight font-medium ${isActive ? 'font-bold text-sky-300' : ''}`}>
                  {item.label}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
