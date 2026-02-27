/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'kisan-mitra-v1';
const urlsToCache = [
  '/',
  '/kisan-mitra-ai-0.2/',
  '/kisan-mitra-ai-0.2/index.html',
  '/kisan-mitra-ai-0.2/styles.css',
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Cache addAll error:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network-first strategy with cache fallback
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API calls to external services
  if (
    request.url.includes('googleapis.com') ||
    request.url.includes('openweathermap.org') ||
    request.url.includes('firebase')
  ) {
    return;
  }

  // Network-first strategy for most requests
  event.respondWith(
    fetch(request)
      .then(response => {
        // Clone response for caching
        const responseClone = response.clone();

        if (response.ok) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
        }

        return response;
      })
      .catch(() => {
        // Return cached response if network fails
        return caches.match(request).then(response => {
          return (
            response ||
            new Response(
              'Offline: Content not available. Please check your internet connection.',
              { status: 503, statusText: 'Service Unavailable' }
            )
          );
        });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync for offline chat messages
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(
      // Sync pending messages when connection restored
      caches.open(CACHE_NAME).then(cache => {
        return cache.keys().then(requests => {
          const pendingMessages = requests.filter(req =>
            req.url.includes('/api/messages')
          );

          return Promise.all(
            pendingMessages.map(req => {
              return fetch(req).then(response => {
                if (response.ok) {
                  return cache.delete(req);
                }
              });
            })
          );
        });
      })
    );
  }
});

// Periodic background sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-weather') {
    event.waitUntil(
      // Update weather every 6 hours
      fetch('/api/weather').then(response => {
        if (response.ok) {
          return caches.open(CACHE_NAME).then(cache => {
            return cache.put('/api/weather', response);
          });
        }
      })
    );
  }
});

console.log('Service Worker Loaded for Kisan Mitra');
export {};
