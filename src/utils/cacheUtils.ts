/**
 * Cache management utilities for preventing browser caching issues
 */

/**
 * Clear all browser caches
 */
export const clearAllCaches = async (): Promise<boolean> => {
  try {
    // Clear service worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('Service worker caches cleared');
    }

    // Clear localStorage
    if (typeof Storage !== 'undefined') {
      localStorage.clear();
      console.log('localStorage cleared');
    }

    // Clear sessionStorage
    if (typeof Storage !== 'undefined') {
      sessionStorage.clear();
      console.log('sessionStorage cleared');
    }

    return true;
  } catch (error) {
    console.error('Error clearing caches:', error);
    return false;
  }
};

/**
 * Force reload the page without cache
 */
export const forceReload = (): void => {
  // Try different methods to force reload
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
      // Reload after unregistering service workers
      window.location.reload();
    });
  } else {
    // Force reload without cache
    window.location.reload();
  }
};

/**
 * Add cache busting parameter to URLs
 */
export const addCacheBuster = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_cb=${Date.now()}`;
};

/**
 * Check if browser has cached version
 */
export const hasCachedVersion = async (url: string): Promise<boolean> => {
  if ('caches' in window) {
    try {
      const cache = await caches.open('ourgoal-v1');
      const response = await cache.match(url);
      return !!response;
    } catch (error) {
      console.error('Error checking cache:', error);
      return false;
    }
  }
  return false;
};

/**
 * Initialize cache management
 */
export const initCacheManagement = (): void => {
  // Add version parameter to prevent caching
  const version = Date.now();
  
  // Update document title with version for debugging
  if (process.env.NODE_ENV === 'development') {
    document.title += ` (v${version})`;
  }

  // Listen for beforeunload to clear caches
  window.addEventListener('beforeunload', () => {
    // Clear any temporary caches before leaving
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('temp')) {
            caches.delete(cacheName);
          }
        });
      });
    }
  });

  // Check for updates every 5 minutes
  setInterval(async () => {
    try {
      const response = await fetch('/', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        const lastModified = response.headers.get('last-modified');
        const storedLastModified = localStorage.getItem('lastModified');
        
        if (lastModified && storedLastModified && lastModified !== storedLastModified) {
          console.log('New version detected, clearing caches...');
          await clearAllCaches();
          localStorage.setItem('lastModified', lastModified);
          // Optionally notify user about update
          if (window.confirm('تم تحديث الموقع. هل تريد إعادة تحميل الصفحة؟')) {
            forceReload();
          }
        } else if (lastModified) {
          localStorage.setItem('lastModified', lastModified);
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
};

/**
 * Register service worker with cache management
 */
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered:', registration);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New service worker available');
              // Optionally notify user about update
              if (window.confirm('تحديث جديد متاح. هل تريد إعادة تحميل الصفحة؟')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};
