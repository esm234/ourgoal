// Data Backup and Restore System
// Preserves important user data when clearing cache

interface BackupData {
  timestamp: number;
  version: string;
  data: {
    // Pomodoro data
    pomodoroSettings?: any;
    pomodoroStats?: any;
    pomodoroHistory?: any;

    // Study plan data
    studyPlanProgress?: any;
    completedDays?: any;

    // User preferences
    userPreferences?: any;
    themeSettings?: any;

    // Other important data
    [key: string]: any;
  };
}

// Keys that should be preserved during cache clear
const PRESERVE_KEYS = [
  // Pomodoro data
  'pomodoro-settings',
  'pomodoro-stats',
  'pomodoro-history',
  'pomodoro-session-data',
  'pomodoro-daily-stats',

  // Study plan data
  'study-plan-progress',
  'completed-days',
  'current-study-plan',

  // User preferences
  'user-preferences',
  'theme-settings',
  'audio-preferences',
  'notification-settings',

  // Auth data (if any local storage)
  'user-session',
  'remember-me',

  // App settings
  'app-version',
  'first-visit',
  'tutorial-completed',
  
  // Notifications data
  'ourgoal_local_notifications',
  'ourgoal_system_notifications',
  'ourgoal_notification_settings',
  'ourgoal_notification_stats',
  'ourgoal_update_notification_shown'
];

export const backupImportantData = (): BackupData => {
  const backup: BackupData = {
    timestamp: Date.now(),
    version: '2.1.0',
    data: {}
  };

  // Backup all important keys
  PRESERVE_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      try {
        // Try to parse as JSON, fallback to string
        backup.data[key] = JSON.parse(value);
      } catch {
        backup.data[key] = value;
      }
    }
  });

  // Also backup any keys that start with important prefixes
  const importantPrefixes = ['pomodoro-', 'study-', 'user-', 'app-'];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && importantPrefixes.some(prefix => key.startsWith(prefix))) {
      if (!PRESERVE_KEYS.includes(key)) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          try {
            backup.data[key] = JSON.parse(value);
          } catch {
            backup.data[key] = value;
          }
        }
      }
    }
  }

  console.log('📦 Data backup created:', Object.keys(backup.data));
  return backup;
};

export const restoreImportantData = (backup: BackupData): void => {
  console.log('🔄 Restoring important data...');

  Object.entries(backup.data).forEach(([key, value]) => {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
    } catch (error) {
      console.warn(`Failed to restore ${key}:`, error);
    }
  });

  console.log('✅ Data restoration completed');
};

export const safeCacheClear = async (): Promise<void> => {
  console.log('🧹 Starting safe cache clear...');

  // 1. Backup important data
  const backup = backupImportantData();

  // 2. Store backup temporarily in a safe place
  const backupKey = `temp-backup-${Date.now()}`;
  localStorage.setItem(backupKey, JSON.stringify(backup));

  try {
    // 3. Clear application cache
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log('🗑️ Clearing cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }

    // 4. Clear service worker cache
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => {
          console.log('🗑️ Updating service worker');
          return registration.update();
        })
      );
    }

    // 5. Clear localStorage except backup
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key !== backupKey) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));

    // 6. Restore important data
    const backupData = localStorage.getItem(backupKey);
    if (backupData) {
      const parsedBackup: BackupData = JSON.parse(backupData);
      restoreImportantData(parsedBackup);
    }

    // 7. Clean up temporary backup
    localStorage.removeItem(backupKey);

    console.log('✅ Safe cache clear completed');

  } catch (error) {
    console.error('❌ Cache clear failed:', error);

    // Restore from backup if something went wrong
    const backupData = localStorage.getItem(backupKey);
    if (backupData) {
      const parsedBackup: BackupData = JSON.parse(backupData);
      restoreImportantData(parsedBackup);
      localStorage.removeItem(backupKey);
    }

    throw error;
  }
};

export const forceRefreshWithDataPreservation = (): void => {
  console.log('🔄 Force refresh with data preservation...');

  // Backup data before refresh
  const backup = backupImportantData();
  sessionStorage.setItem('pre-refresh-backup', JSON.stringify(backup));

  // Force reload
  window.location.reload();
};

// Auto-restore on page load
export const autoRestoreOnLoad = (): void => {
  const backup = sessionStorage.getItem('pre-refresh-backup');
  if (backup) {
    try {
      const parsedBackup: BackupData = JSON.parse(backup);
      restoreImportantData(parsedBackup);
      sessionStorage.removeItem('pre-refresh-backup');
      console.log('✅ Auto-restored data after refresh');
    } catch (error) {
      console.error('❌ Auto-restore failed:', error);
    }
  }
};

// Note: Export/Import functions removed as they're handled elsewhere in the app
