/**
 * MASAAR Notification Engine
 * Supports Web Notifications API, Service Worker Push/Local notifications,
 * Synthesized Web Audio chime, and Mobile Haptic Vibration.
 */

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

export interface NotificationSettings {
  enabled: boolean;
  prayers: boolean;
  habits: boolean;
  falcon: boolean;
  study: boolean;
  sound: boolean;
}

const SETTINGS_KEY = 'masaar_notification_settings_v1';

const defaultSettings: NotificationSettings = {
  enabled: true,
  prayers: true,
  habits: true,
  falcon: true,
  study: true,
  sound: true
};

/**
 * Loads user notification preferences from localStorage.
 */
export function getNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

/**
 * Saves user notification preferences to localStorage.
 */
export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Could not save notification settings:', err);
  }
}

/**
 * Checks whether Web Notifications are supported in the current browser.
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && ('Notification' in window);
}

/**
 * Gets the current Notification permission status.
 */
export function getNotificationPermission(): NotificationPermissionStatus {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission as NotificationPermissionStatus;
}

/**
 * Checks if running on iOS (iPhone / iPad).
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/**
 * Checks if app is installed and running as a standalone PWA.
 */
export function isStandalonePWA(): boolean {
  if (typeof window === 'undefined') return false;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isNavStandalone = (navigator as unknown as { standalone?: boolean }).standalone;
  return Boolean(isStandalone || isNavStandalone);
}

/**
 * Plays a pleasant, subtle dual-tone synthesized Apple-like chime
 * using the Web Audio API without requiring any external mp3 files.
 */
export function playNotificationChime(): void {
  const settings = getNotificationSettings();
  if (!settings.sound) return;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1: High note (A5 - 880Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: Harmonious lower note (D5 - 587.33Hz) slightly delayed
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(587.33, now + 0.08);
    gain2.gain.setValueAtTime(0, now + 0.08);
    gain2.gain.linearRampToValueAtTime(0.14, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.45);
  } catch (err) {
    console.debug('Could not play audio chime:', err);
  }
}

/**
 * Triggers mobile haptic vibration if supported.
 */
export function triggerHapticFeedback(): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([80, 40, 80]);
    }
  } catch {
    // Ignore environments where vibrate is restricted
  }
}

/**
 * Requests Notification permission from the browser.
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNotificationSupported()) return 'unsupported';

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const current = getNotificationSettings();
      saveNotificationSettings({ ...current, enabled: true });
    }
    return permission as NotificationPermissionStatus;
  } catch (err) {
    console.warn('Notification permission request failed:', err);
    return getNotificationPermission();
  }
}

export interface SendNotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: unknown;
  silent?: boolean;
}

/**
 * Sends a local notification using either ServiceWorker or Web Notification API,
 * accompanied by synthesized chime and mobile haptic vibration.
 */
export async function sendLocalNotification(
  title: string, 
  options: SendNotificationOptions = {}
): Promise<boolean> {
  const settings = getNotificationSettings();
  if (!settings.enabled) return false;

  // Sound and vibration feedback
  if (!options.silent) {
    playNotificationChime();
    triggerHapticFeedback();
  }

  const notificationOptions: NotificationOptions = {
    body: options.body || '',
    icon: options.icon || '/pwa-192x192.png',
    badge: options.badge || '/favicon.ico',
    tag: options.tag || 'masaar-notification',
    dir: 'rtl',
    lang: 'ar',
    ...options
  };

  // 1. Try via Service Worker (Best for PWA, Android, and iOS 16.4+ standalone)
  if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && 'showNotification' in registration) {
        await registration.showNotification(title, notificationOptions);
        return true;
      }
    } catch (swErr) {
      console.debug('Service Worker notification fallback to window.Notification:', swErr);
    }
  }

  // 2. Fallback to standard window.Notification API
  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      new Notification(title, notificationOptions);
      return true;
    } catch (winErr) {
      console.warn('Failed to display window Notification:', winErr);
    }
  }

  return false;
}

/**
 * Sends a test notification to verify delivery, chime, and vibrations.
 */
export async function sendTestNotification(): Promise<boolean> {
  return sendLocalNotification('مَسار — الإشعارات الذكية 🔔', {
    body: 'تم تفعيل إشعارات مَسار بنجاح على هاتفك! ستصلك تنبيهات الصلوات والعادات والعمل في موعدها.',
    tag: 'masaar-test'
  });
}
