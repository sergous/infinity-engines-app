// Базовый кастомный сервис-воркер для PWA на основе документации Expo
const CACHE_NAME = 'expo-pwa-cache-v1';

// Основные ресурсы для кэширования
const STATIC_RESOURCES_TO_CACHE = [
  '/',
  '/index.html',
  '/static/**/*', // Это будет заменено в процессе сборки
];

// Функция для чистки старых кэшей
const clearOldCaches = async () => {
  const cacheKeys = await caches.keys();
  const oldCacheKeys = cacheKeys.filter(key => key !== CACHE_NAME);
  const deletionPromises = oldCacheKeys.map(key => caches.delete(key));
  return Promise.all(deletionPromises);
};

// Установка сервис-воркера
self.addEventListener('install', event => {
  console.log('Service Worker installing');
  
  event.waitUntil(
    (async () => {
      try {
        // Открываем новый кэш
        const cache = await caches.open(CACHE_NAME);
        
        // Кэшируем статические ресурсы
        await cache.addAll(STATIC_RESOURCES_TO_CACHE);
        
        // Активируем сервис-воркер немедленно
        await self.skipWaiting();
        
        console.log('Service Worker successfully installed');
      } catch (error) {
        console.error('Service Worker installation failed:', error);
      }
    })()
  );
});

// Активация сервис-воркера
self.addEventListener('activate', event => {
  console.log('Service Worker activating');
  
  event.waitUntil(
    (async () => {
      try {
        // Очищаем старые кэши
        await clearOldCaches();
        
        // Берем контроль над всеми клиентами
        await self.clients.claim();
        
        console.log('Service Worker successfully activated');
      } catch (error) {
        console.error('Service Worker activation failed:', error);
      }
    })()
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  // Обрабатываем только GET-запросы
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    (async () => {
      try {
        // Стратегия Cache First - сначала проверяем кэш
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Если ресурса нет в кэше, идем в сеть
        const response = await fetch(event.request);
        
        // Если это валидный ответ, кэшируем его
        if (response && response.status === 200) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, response.clone());
        }
        
        return response;
      } catch (error) {
        console.error('Service Worker fetch error:', error);
        
        // Если сеть недоступна, возвращаем заглушку для офлайн-режима
        return new Response('Вы не в сети. Пожалуйста, проверьте соединение с интернетом.');
      }
    })()
  );
});
