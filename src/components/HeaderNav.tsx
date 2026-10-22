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
  Trophy,
  Bell
} from 'lucide-react';
import { useAppStore, type ActiveTab } from '../stores/appStore';
import { getNotificationPermission } from '../lib/notifications';

export const HeaderNav: React.FC = () => {
  const { activeTab, setActiveTab, setQuickCaptureOpen, setSyncModalOpen, setNotifModalOpen, syncStatus } = useAppStore();
  const notifPermission = typeof window !== 'undefined' ? getNotificationPermission() : 'default';

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
    { id: 'FALCON', label: 'العمل', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'JOURNAL', label: 'اليوميات', icon: <BookMarked className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#07080b]/80 backdrop-blur-3xl border-b border-white/[0.08] px-4 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-[#1c1d24] border border-white/[0.12] flex items-center justify-center text-sky-400 font-black text-sm shadow-sm">
            مـ
          </div>
          <div>
            <div className="text-sm font-black text-white tracking-tight flex items-center gap-1.5">
              <span>مَسار</span>
              <span className="text-[10px] text-sky-400 font-mono font-bold bg-sky-500/10 border border-sky-400/20 px-2 py-0.2 rounded-full">V2.0</span>
            </div>
            <span className="text-[10px] text-[#8e8e93] hidden sm:inline">Personal Life Coach & Study OS</span>
          </div>
        </div>

        {/* Desktop / Tablet Navigation Pills */}
        <nav className="hidden sm:flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/[0.08] backdrop-blur-xl">
          {desktopNavItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 pressable cursor-pointer ${
                  isActive
                    ? 'apple-pill-active'
                    : 'text-[#8e8e93] hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Quick Actions: Quick Capture, Notification Bell & Sync Status */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Notification Center Button */}
          <button
            type="button"
            onClick={() => setNotifModalOpen(true)}
            className={`relative p-2 rounded-xl border text-xs font-bold transition-all pressable cursor-pointer ${
              notifPermission === 'granted'
                ? 'bg-sky-500/10 border-sky-400/25 text-sky-400'
                : 'bg-white/[0.04] border-white/[0.08] text-[#8e8e93] hover:text-white'
            }`}
            title="الإشعارات والتنبيهات"
            aria-label="الإشعارات والتنبيهات"
          >
            <Bell className="w-4 h-4" />
            {notifPermission === 'granted' && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400 ring-2 ring-[#07080b]" />
            )}
            {notifPermission !== 'granted' && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#07080b] animate-ping" />
            )}
          </button>

          {/* Cloud Sync Status Pill */}
          <button
            type="button"
            onClick={() => setSyncModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all pressable cursor-pointer ${
              syncStatus.isConnected && syncStatus.tablesFound
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : syncStatus.isConnected
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 animate-pulse'
                : 'bg-white/[0.04] border-white/[0.08] text-[#8e8e93] hover:text-white'
            }`}
            title="سحابة سوبا بيز"
          >
            <Cloud className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin text-sky-400' : ''}`} />
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              syncStatus.isConnected && syncStatus.tablesFound
                ? 'bg-emerald-400'
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
            className="apple-btn-primary text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm pressable cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">تسجيل سريع</span>
          </button>
        </div>
      </div>
    </header>
  );
};
