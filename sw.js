const CACHE_NAME = 'ah-jewellers-v2';
const ASSETS_TO_CACHE = [
  './',
  // Note: For production builds, CSS files often have content hashes (e.g., index.123abc.css).
  // You might need a build-time solution to dynamically generate this list,
  // or ensure your build outputs a stable CSS filename (e.g., './index.css').
  './index.html',
  './logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Install Event: Cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Fetch Event: Serve from cache if available, otherwise fetch from network
// and cache the network response for future use.
self.addEventListener('fetch', (event) => {
  // Bypass service worker cache for gold rates API to ensure instant updates
  if (event.request.url.includes('npoint.io')) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request. It's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            // Clone the response. It's a stream and can only be consumed once.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch((error) => {
          // This catch is for network errors, not HTTP errors.
          console.error('Service Worker: Fetch failed:', error);
          // Depending on the request type, you might want to return a fallback response.
          throw error; // Re-throw the error to indicate fetch failure
        });
      })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
