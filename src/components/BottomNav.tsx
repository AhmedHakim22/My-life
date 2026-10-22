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
      {/* Apple iOS Floating Glass Dock */}
      <nav className="fixed bottom-3 left-3 right-3 z-40 bg-slate-950/80 backdrop-blur-3xl border border-sky-400/30 rounded-[30px] px-3.5 shadow-[0_16px_45px_rgba(0,0,0,0.75),inset_0_1px_1px_rgba(255,255,255,0.35),0_0_25px_rgba(56,189,248,0.18)] sm:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between h-15 relative">
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
                      className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-400 to-sky-500 text-slate-950 flex items-center justify-center shadow-xl shadow-sky-400/50 border border-white/60 active:scale-90 transition-transform cursor-pointer group"
                    >
                      <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                    <span className="text-[9px] font-black text-sky-300 mt-0.5 tracking-wide drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]">إضافة</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 pressable cursor-pointer ${
                    isActive 
                      ? 'bg-sky-400/20 text-sky-200 border border-sky-300/40 shadow-[0_0_18px_rgba(56,189,248,0.45)]' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`transition-all duration-200 ${isActive ? 'scale-110 drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]' : ''}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-black text-sky-200' : 'font-medium'}`}>
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
