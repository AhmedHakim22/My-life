import React, { useEffect, useState } from 'react';
import { useAppStore } from './stores/appStore';
import { HeaderNav } from './components/HeaderNav';
import { BottomNav } from './components/BottomNav';
import { SmartToday } from './components/SmartToday';
import { GoalsWorkspace } from './components/GoalsWorkspace';
import { UniversityWorkspace } from './components/UniversityWorkspace';
import { LearningWorkspace } from './components/LearningWorkspace';
import { BookLibrary } from './components/BookLibrary';
import { FalconWorkspace } from './components/FalconWorkspace';
import { JournalWorkspace } from './components/JournalWorkspace';
import { AnalyticsView } from './components/AnalyticsView';
import { FaithWorkspace } from './components/FaithWorkspace';
import { FitnessWorkspace } from './components/FitnessWorkspace';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { WifiOff, Loader2, BookMarked, GraduationCap } from 'lucide-react';

export const App: React.FC = () => {
  const { isLoaded, loadAllData, activeTab, toastMessage } = useAppStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [journalSubTab, setJournalSubTab] = useState<'JOURNAL' | 'ANALYTICS'>('JOURNAL');

  useEffect(() => {
    loadAllData();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadAllData]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#070a12] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-9 h-9 text-sky-400 animate-spin" />
        <p className="text-xs font-mono tracking-wider">جاري تحميل مَسار وقاعدة البيانات المحلية...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="bg-amber-950/80 border-b border-amber-800/60 py-1.5 px-3 text-center text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1.5 shadow-md sticky top-0 z-50 backdrop-blur-md">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>أنت تعمل أوفلاين.. جميع تعديلاتك محفوظة بأمان محلياً في المتصفح</span>
        </div>
      )}

      {/* Responsive Top Header Navigation (Tablet & Desktop) */}
      <HeaderNav />

      {/* Main Responsive Container */}
      <main className="flex-1 max-w-md sm:max-w-3xl lg:max-w-6xl w-full mx-auto px-3 sm:px-6">
        {activeTab === 'TODAY' && <SmartToday />}
        {activeTab === 'GOALS' && <GoalsWorkspace />}
        {activeTab === 'UNIVERSITY' && <UniversityWorkspace />}
        {activeTab === 'LEARNING' && <LearningWorkspace />}
        {activeTab === 'FAITH' && <FaithWorkspace />}
        {activeTab === 'FITNESS' && <FitnessWorkspace />}
        {activeTab === 'BOOKS' && <BookLibrary />}
        {activeTab === 'FALCON' && <FalconWorkspace />}
        {activeTab === 'JOURNAL' && (
          <div className="space-y-3 pb-24 pt-3">
            {/* Segmented Switcher between Journaling & Scientific Ladder Analytics */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950/80 neo-sunken border border-slate-800 text-xs font-bold max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setJournalSubTab('JOURNAL')}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 pressable cursor-pointer ${
                  journalSubTab === 'JOURNAL'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold shadow-md shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookMarked className="w-4 h-4" />
                <span>اليوميات والتأمل</span>
              </button>
              <button
                type="button"
                onClick={() => setJournalSubTab('ANALYTICS')}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 pressable cursor-pointer ${
                  journalSubTab === 'ANALYTICS'
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold shadow-md shadow-purple-500/25'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>الرتب العلمية والأثر</span>
              </button>
            </div>

            {journalSubTab === 'JOURNAL' ? <JournalWorkspace /> : <AnalyticsView />}
          </div>
        )}
      </main>

      {/* Floating Quick Capture Modal */}
      <QuickCaptureModal />

      {/* Bottom Navigation for Mobile */}
      <BottomNav />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto z-50 glass-panel border border-sky-400/40 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl text-xs font-bold text-center animate-in fade-in slide-in-from-bottom duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
