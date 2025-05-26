// Service Worker for Our Goal Platform - NO HTML CACHING
const CACHE_NAME = 'ourgoal-static-v' + Date.now(); // Dynamic cache name
const STATIC_CACHE_URLS = [
  // Only cache static assets, NOT HTML pages
  '/new-favicon.jpg',
  '/photo_2025-05-24_16-53-22.jpg'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - NO CACHE for HTML, cache only static assets
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(event.request.url);

  // NEVER cache HTML pages - always fetch from network
  if (event.request.headers.get('accept')?.includes('text/html') ||
      url.pathname === '/' ||
      url.pathname.endsWith('.html') ||
      event.request.mode === 'navigate') {

    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Add no-cache headers to HTML responses
          const newHeaders = new Headers(response.headers);
          newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
          newHeaders.set('Pragma', 'no-cache');
          newHeaders.set('Expires', '0');

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        })
        .catch(() => {
          // Simple offline fallback
          return new Response('Offline - Please check your connection', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }

  // Only cache static assets (images, etc.)
  if (STATIC_CACHE_URLS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }

          return fetch(event.request)
            .then((response) => {
              if (response && response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });
              }
              return response;
            });
        })
    );
    return;
  }

  // All other requests - network only
  event.respondWith(fetch(event.request));
});
