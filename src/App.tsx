import React, { useEffect, useState, useRef } from 'react';
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
import { ChallengesWorkspace } from './components/ChallengesWorkspace';
import { WeeklyScheduleWorkspace } from './components/WeeklyScheduleWorkspace';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { DynamicIslandWidget } from './components/DynamicIslandWidget';
import { WifiOff, Loader2, BookMarked, GraduationCap } from 'lucide-react';
import { getNotificationSettings, sendLocalNotification } from './lib/notifications';
import { subscribeToRealtimeSync, registerRemoteChangeHandler, pullAllFromSupabase } from './lib/sync';

export const App: React.FC = () => {
  const { isLoaded, loadAllData, activeTab, toastMessage, prayers } = useAppStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [journalSubTab, setJournalSubTab] = useState<'JOURNAL' | 'ANALYTICS'>('JOURNAL');
  const lastNotifiedPrayerRef = useRef<string>('');

  useEffect(() => {
    loadAllData();

    // 1. Initialize Realtime Cross-Device WebSocket Listener
    registerRemoteChangeHandler(() => {
      loadAllData();
    });
    subscribeToRealtimeSync();

    // 2. Initial silent cloud pull to catch changes made on other device while offline
    pullAllFromSupabase().then(res => {
      if (res.count > 0) {
        loadAllData();
      }
    }).catch(console.debug);

    // 3. Auto-sync whenever tab or window gains focus (switching from Phone to Laptop or vice versa)
    const handleSyncOnResume = async () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        const res = await pullAllFromSupabase();
        if (res.count > 0) {
          await loadAllData();
        }
      }
    };

    window.addEventListener('focus', handleSyncOnResume);
    document.addEventListener('visibilitychange', handleSyncOnResume);

    // 4. Periodic background sync every 60s
    const periodicSync = setInterval(async () => {
      if (navigator.onLine && document.visibilityState === 'visible') {
        const res = await pullAllFromSupabase();
        if (res.count > 0) {
          await loadAllData();
        }
      }
    }, 60000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('focus', handleSyncOnResume);
      document.removeEventListener('visibilitychange', handleSyncOnResume);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(periodicSync);
    };
  }, [loadAllData]);

  // Periodic intelligent prayer times reminder check (every 60s)
  useEffect(() => {
    const checkPrayerReminders = () => {
      const settings = getNotificationSettings();
      if (!settings.enabled || !settings.prayers || !prayers?.nextPrayer) return;

      const next = prayers.nextPrayer;
      const mins = next.minutesRemaining ?? -1;

      // Send reminder when 10 minutes or less remain until next prayer
      if (mins <= 10 && mins >= 0) {
        const notifKey = `${next.nameArabic}-${next.timeFormatted}`;
        if (lastNotifiedPrayerRef.current !== notifKey) {
          lastNotifiedPrayerRef.current = notifKey;
          sendLocalNotification(`🕌 حان وقت الاستعداد لصلاة ${next.nameArabic}`, {
            body: `تبقى ${mins === 0 ? 'لحظات' : `${mins} دقائق`} على أذان ${next.nameArabic} (${next.timeFormatted}). وقت الوضوء والاستعداد.`,
            tag: `prayer-${next.nameArabic}`
          });
        }
      }
    };

    const interval = setInterval(checkPrayerReminders, 60000);
    checkPrayerReminders();

    return () => clearInterval(interval);
  }, [prayers]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#070a12] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-9 h-9 text-sky-400 animate-spin" />
        <p className="text-xs font-mono tracking-wider">جاري تحميل مَسار وقاعدة البيانات المحلية...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-slate-950 font-sans">
      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="bg-amber-950/80 border-b border-amber-800/60 py-1.5 px-3 text-center text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1.5 shadow-md sticky top-0 z-50 backdrop-blur-md">
          <WifiOff className="w-3.5 h-3.5 text-amber-400" />
          <span>أنت تعمل أوفلاين.. جميع تعديلاتك محفوظة بأمان محلياً في المتصفح</span>
        </div>
      )}

      {/* Responsive Top Header Navigation (Tablet & Desktop) */}
      <HeaderNav />

      {/* Apple Dynamic Island Live Activity Floating Widget */}
      <DynamicIslandWidget />

      {/* Main Responsive Container with Safe Area Clearance for Mobile Floating Dock */}
      <main className="flex-1 max-w-md sm:max-w-3xl lg:max-w-6xl w-full mx-auto px-3 sm:px-6 pb-[calc(7rem+env(safe-area-inset-bottom,0px))]">
        {activeTab === 'TODAY' && <SmartToday />}
        {activeTab === 'GOALS' && <GoalsWorkspace />}
        {activeTab === 'UNIVERSITY' && <UniversityWorkspace />}
        {activeTab === 'LEARNING' && <LearningWorkspace />}
        {activeTab === 'CHALLENGES' && <ChallengesWorkspace />}
        {activeTab === 'SCHEDULE' && <WeeklyScheduleWorkspace />}
        {activeTab === 'FAITH' && <FaithWorkspace />}
        {activeTab === 'FITNESS' && <FitnessWorkspace />}
        {activeTab === 'BOOKS' && <BookLibrary />}
        {activeTab === 'FALCON' && <FalconWorkspace />}
        {activeTab === 'JOURNAL' && (
          <div className="space-y-3 pb-24 pt-3">
            {/* Segmented Switcher between Journaling & Scientific Ladder Analytics */}
            <div className="apple-segmented-container grid grid-cols-2 text-xs font-bold max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setJournalSubTab('JOURNAL')}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 pressable cursor-pointer ${
                  journalSubTab === 'JOURNAL'
                    ? 'apple-pill-active'
                    : 'text-[#8e8e93] hover:text-white'
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
                    ? 'apple-pill-active'
                    : 'text-[#8e8e93] hover:text-white'
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
        <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto z-50 apple-card border border-white/[0.12] text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-3xl text-xs font-bold text-center animate-in fade-in slide-in-from-bottom duration-150">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
