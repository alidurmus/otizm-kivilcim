// Kıvılcım Platform Service Worker
// Provides offline functionality for autism education platform

const CACHE_NAME = 'kivilcim-v1.0.0';
const STATIC_CACHE_NAME = 'kivilcim-static-v1.0.0';
const AUDIO_CACHE_NAME = 'kivilcim-audio-v1.0.0';

// Core files that must be cached for offline functionality
const CORE_CACHE_FILES = [
  '/',
  '/modules',
  '/exercise/alphabet-reading',
  '/exercise/vocabulary', 
  '/exercise/literacy',
  '/exercise/mathematics',
  '/exercise/basic-concepts',
  '/exercise/puzzle',
  '/sensory-settings',
  '/manifest.json'
];

// Static assets to cache
const STATIC_CACHE_FILES = [
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

// Audio files for offline Turkish learning
const AUDIO_CACHE_FILES = [
  '/audio/letters/a.mp3',
  '/audio/letters/b.mp3', 
  '/audio/letters/c.mp3',
  '/audio/letters/ç.mp3',
  '/audio/letters/d.mp3',
  '/audio/letters/e.mp3',
  '/audio/letters/f.mp3',
  '/audio/letters/g.mp3',
  '/audio/letters/ğ.mp3',
  '/audio/letters/h.mp3',
  '/audio/letters/ı.mp3',
  '/audio/letters/i.mp3',
  '/audio/letters/j.mp3',
  '/audio/letters/k.mp3',
  '/audio/letters/l.mp3',
  '/audio/letters/m.mp3',
  '/audio/letters/n.mp3',
  '/audio/letters/o.mp3',
  '/audio/letters/ö.mp3',
  '/audio/letters/p.mp3',
  '/audio/letters/r.mp3',
  '/audio/letters/s.mp3',
  '/audio/letters/ş.mp3',
  '/audio/letters/t.mp3',
  '/audio/letters/u.mp3',
  '/audio/letters/ü.mp3',
  '/audio/letters/v.mp3',
  '/audio/letters/y.mp3',
  '/audio/letters/z.mp3'
];

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache core application files
      caches.open(CACHE_NAME).then((cache) => {
        console.log('📁 Service Worker: Caching core files');
        return cache.addAll(CORE_CACHE_FILES);
      }),
      
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('🖼️ Service Worker: Caching static assets');
        return cache.addAll(STATIC_CACHE_FILES);
      }),
      
      // Cache essential Turkish audio files
      caches.open(AUDIO_CACHE_NAME).then((cache) => {
        console.log('🔊 Service Worker: Caching Turkish audio files');
        return cache.addAll(AUDIO_CACHE_FILES.slice(0, 10)); // Cache first 10 letters initially
      })
    ]).then(() => {
      console.log('✅ Service Worker: Installation complete');
      self.skipWaiting(); // Activate immediately
    }).catch((error) => {
      console.error('❌ Service Worker: Installation failed', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old cache versions
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== AUDIO_CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch event - handle requests with offline support
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (url.pathname.startsWith('/audio/')) {
    // Audio files - cache-first strategy
    event.respondWith(handleAudioRequest(request));
  } else if (url.pathname.startsWith('/api/')) {
    // API requests - network-first with fallback
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith('/_next/')) {
    // Next.js assets - cache-first
    event.respondWith(handleStaticAssets(request));
  } else {
    // Pages and other requests - network-first with cache fallback
    event.respondWith(handlePageRequest(request));
  }
});

// Handle audio file requests (cache-first for offline learning)
async function handleAudioRequest(request) {
  try {
    const cache = await caches.open(AUDIO_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('🔊 Audio cache hit:', request.url);
      return cachedResponse;
    }
    
    // Try network and cache the result
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
        console.log('🔊 Audio cached from network:', request.url);
      }
      return networkResponse;
    } catch (networkError) {
      console.log('❌ Audio network failed, no cache available:', request.url);
      
      // Return offline fallback audio or silent response
      return new Response('', { 
        status: 204, 
        statusText: 'Audio not available offline' 
      });
    }
  } catch (error) {
    console.error('❌ Audio request error:', error);
    return new Response('', { status: 500 });
  }
}

// Handle API requests (network-first with limited offline fallback)
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful API responses for limited offline support
    if (networkResponse.ok && request.url.includes('/api/speech/voices')) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (networkError) {
    console.log('🌐 API network failed, checking cache:', request.url);
    
    // Try cache for voice list API
    if (request.url.includes('/api/speech/voices')) {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        console.log('📱 API cache hit (offline mode):', request.url);
        return cachedResponse;
      }
    }
    
    // Return offline error response
    return new Response(JSON.stringify({
      error: 'Offline mode - API not available',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle static assets (cache-first)
async function handleStaticAssets(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('❌ Static asset error:', error);
    throw error;
  }
}

// Handle page requests (network-first with cache fallback)
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful page responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (networkError) {
    console.log('🌐 Page network failed, checking cache:', request.url);
    
    // Try cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('📱 Page cache hit (offline mode):', request.url);
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/').then(response => {
      return response || new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Kıvılcım - Çevrimdışı</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              min-height: 100vh;
              margin: 0;
            }
            .offline-container {
              max-width: 500px;
              margin: 0 auto;
              background: rgba(255,255,255,0.1);
              padding: 40px;
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            .offline-icon { font-size: 64px; margin-bottom: 20px; }
            h1 { color: #fff; margin-bottom: 20px; }
            p { color: #f0f0f0; line-height: 1.6; margin-bottom: 30px; }
            .retry-btn {
              background: #4CAF50;
              color: white;
              border: none;
              padding: 15px 30px;
              border-radius: 25px;
              font-size: 16px;
              cursor: pointer;
              transition: background 0.3s;
            }
            .retry-btn:hover { background: #45a049; }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="offline-icon">📱</div>
            <h1>Çevrimdışı Mod</h1>
            <p>İnternet bağlantınızı kontrol edin. Bazı özellikler çevrimdışı çalışabilir.</p>
            <button class="retry-btn" onclick="window.location.reload()">
              🔄 Tekrar Dene
            </button>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    });
  }
}

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    // Sync any offline progress data
    const progressData = await getOfflineProgressData();
    if (progressData.length > 0) {
      console.log('📊 Syncing offline progress data');
      await syncProgressToServer(progressData);
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Placeholder functions for offline data management
async function getOfflineProgressData() {
  // Get progress data stored in IndexedDB during offline use
  return [];
}

async function syncProgressToServer(data) {
  // Sync progress data to server when online
  console.log('📤 Syncing progress data:', data);
}

// Push notification handling for engagement
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    console.log('📱 Push notification received:', data);
    
    const options = {
      body: data.body || 'Kıvılcım eğitim zamanı!',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: data.url || '/',
      actions: [
        {
          action: 'open',
          title: 'Uygulamayı Aç',
          icon: '/icon-192.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Kıvılcım', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification.data);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

console.log('🔧 Kıvılcım Service Worker loaded successfully'); 