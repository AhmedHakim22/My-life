import React, { useState } from 'react';
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
import { CloudSyncModal } from './CloudSyncModal';

export const HeaderNav: React.FC = () => {
  const { activeTab, setActiveTab, setQuickCaptureOpen, syncStatus } = useAppStore();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

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
    <header className="sticky top-0 z-40 bg-[#060911]/80 backdrop-blur-3xl border-b border-white/[0.08] px-4 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-sky-400 via-sky-500 to-blue-600 p-0.5 shadow-md shadow-sky-500/30">
            <div className="w-full h-full bg-[#060911] rounded-[14px] flex items-center justify-center text-sky-400 font-black text-sm">
              مـ
            </div>
          </div>
          <div>
            <div className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
              <span>مَسار</span>
              <span className="text-[10px] text-sky-300 font-mono font-extrabold bg-sky-950/70 border border-sky-500/30 px-1.5 py-0.2 rounded-full">V2.0</span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:inline">Personal Life Coach & Study OS</span>
          </div>
        </div>

        {/* Desktop / Tablet Navigation Pills */}
        <nav className="hidden sm:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
          {desktopNavItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 pressable cursor-pointer ${
                  isActive
                    ? 'bg-sky-400 text-slate-950 font-black shadow-lg shadow-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
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
          {/* Cloud Sync Status Pill */}
          <button
            type="button"
            onClick={() => setIsSyncModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all pressable cursor-pointer ${
              syncStatus.isConnected && syncStatus.tablesFound
                ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : syncStatus.isConnected
                ? 'bg-amber-500/15 border-amber-400/40 text-amber-300 animate-pulse'
                : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200'
            }`}
            title="سحابة سوبا بيز"
          >
            <Cloud className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin text-sky-400' : ''}`} />
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              syncStatus.isConnected && syncStatus.tablesFound
                ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                : syncStatus.isConnected
                ? 'bg-amber-400'
                : 'bg-slate-500'
            }`} />
            <span className="hidden md:inline text-[11px]">
              {syncStatus.isConnected && syncStatus.tablesFound ? 'سوبا بيز متصل' : syncStatus.isConnected ? 'إعداد الجداول' : 'محلي'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setQuickCaptureOpen(true)}
            className="apple-btn-primary text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-500/25 pressable cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">تسجيل سريع</span>
          </button>
        </div>
      </div>

      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </header>
  );
};
