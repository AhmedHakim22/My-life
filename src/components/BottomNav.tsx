import React, { useState } from 'react';
import { 
  Compass, 
  Target, 
  GraduationCap, 
  Cpu, 
  MoreHorizontal, 
  Plus 
} from 'lucide-react';
import { useAppStore, type ActiveTab } from '../stores/appStore';
import { MoreMenuModal } from './MoreMenuModal';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setQuickCaptureOpen } = useAppStore();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const mainNavItems: { id: ActiveTab | 'MORE'; label: string; icon: React.ReactNode }[] = [
    { id: 'TODAY', label: 'اليوم', icon: <Compass className="w-5 h-5" /> },
    { id: 'GOALS', label: 'الأهداف', icon: <Target className="w-5 h-5" /> },
    { id: 'UNIVERSITY', label: 'الجامعة', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'LEARNING', label: 'التعلم', icon: <Cpu className="w-5 h-5" /> },
    { id: 'MORE', label: 'المزيد', icon: <MoreHorizontal className="w-5 h-5" /> }
  ];

  const handleNavClick = (id: ActiveTab | 'MORE') => {
    if (id === 'MORE') {
      setIsMoreMenuOpen(true);
    } else {
      setActiveTab(id);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-2xl border-t border-slate-800/80 px-3 pb-safe pt-1 sm:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between h-16 relative">
          {mainNavItems.map((item, index) => {
            const isActive = activeTab === item.id;
            return (
              <React.Fragment key={item.id}>
                {/* Center Floating Quick Capture (+) Button */}
                {index === 2 && (
                  <div className="relative -mt-6 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setQuickCaptureOpen(true)}
                      aria-label="تسجيل سريع"
                      className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-400 to-blue-600 text-slate-950 flex items-center justify-center shadow-xl shadow-sky-500/30 border border-sky-300/40 pressable cursor-pointer group"
                    >
                      <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                    <span className="text-[9px] font-bold text-sky-400/90 mt-0.5">إضافة</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center justify-center w-12 h-full relative pressable cursor-pointer ${
                    isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {/* Active Indicator Glow Pip */}
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

      {/* More Menu Modal */}
      <MoreMenuModal
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
      />
    </>
  );
};
