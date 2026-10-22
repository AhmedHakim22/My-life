import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getNotificationSettings, 
  saveNotificationSettings, 
  isNotificationSupported, 
  getNotificationPermission,
  sendLocalNotification
} from '../../lib/notifications';

// In-memory localStorage polyfill for Node test environment
const mockStorage: Record<string, string> = {};
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, val: string) => { mockStorage[key] = val; },
    removeItem: (key: string) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
  };
}

describe('Notifications Engine', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('loads default notification settings when empty', () => {
    const settings = getNotificationSettings();
    expect(settings.enabled).toBe(true);
    expect(settings.prayers).toBe(true);
    expect(settings.habits).toBe(true);
    expect(settings.falcon).toBe(true);
    expect(settings.sound).toBe(true);
  });

  it('persists and restores updated notification preferences', () => {
    saveNotificationSettings({
      enabled: true,
      prayers: false,
      habits: true,
      falcon: true,
      study: false,
      sound: false
    });

    const reloaded = getNotificationSettings();
    expect(reloaded.prayers).toBe(false);
    expect(reloaded.study).toBe(false);
    expect(reloaded.sound).toBe(false);
    expect(reloaded.habits).toBe(true);
  });

  it('gracefully checks support in test environment', () => {
    const supported = isNotificationSupported();
    expect(typeof supported).toBe('boolean');
    const status = getNotificationPermission();
    expect(['granted', 'denied', 'default', 'unsupported']).toContain(status);
  });

  it('respects the enabled=false toggle without crashing', async () => {
    saveNotificationSettings({
      enabled: false,
      prayers: true,
      habits: true,
      falcon: true,
      study: true,
      sound: true
    });

    const delivered = await sendLocalNotification('Test Title', { body: 'Test Body' });
    expect(delivered).toBe(false);
  });
});
