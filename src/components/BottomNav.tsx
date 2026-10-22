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
      {/* Apple visionOS & iOS Floating Glass Dock */}
      <nav className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] left-3 right-3 z-40 bg-[#16171d]/85 backdrop-blur-3xl border border-white/[0.1] rounded-[28px] px-3 shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] sm:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between h-14 relative">
          {mainNavItems.map((item, index) => {
            const isActive = activeTab === item.id;
            return (
              <React.Fragment key={item.id}>
                {/* Center Floating Quick Capture (+) Button */}
                {index === 2 && (
                  <div className="relative -mt-5 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setQuickCaptureOpen(true)}
                      aria-label="تسجيل سريع"
                      className="w-12 h-12 rounded-2xl apple-btn-primary flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer group"
                    >
                      <Plus className="w-6 h-6 stroke-[3] text-[#031422] group-hover:rotate-90 transition-transform duration-200" />
                    </button>
                    <span className="text-[9px] font-bold text-sky-400 mt-0.5 tracking-wide">إضافة</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-150 pressable cursor-pointer ${
                    isActive 
                      ? 'bg-sky-400/15 text-sky-400' 
                      : 'text-[#8e8e93] hover:text-white'
                  }`}
                >
                  <div className={`transition-transform duration-150 ${isActive ? 'scale-105 text-sky-400' : ''}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-sky-400' : 'font-medium'}`}>
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
