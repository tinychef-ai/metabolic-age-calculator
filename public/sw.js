// Service Worker for PWA functionality
const CACHE_NAME = 'metabolic-age-calculator-v2';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - only cache specific resources
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Don't cache dynamic content or API calls
  if (event.request.url.includes('script.google.com') || 
      event.request.url.includes('netlify.app') ||
      event.request.url.includes('localhost')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => {
      // If network fails, try cache
      return caches.match(event.request);
    })
  );
});
