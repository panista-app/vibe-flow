// ==================== sw.js ====================
// فایل Service Worker برای نوتیفیکیشن در پس‌زمینه
// این فایل رو توی هاستت کنار index.html آپلود کن

self.addEventListener('push', function(event) {
    var data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch(e) {
        data = { title: 'Nexo', body: 'یه پیام جدید داری!' };
    }
    
    var title = data.title || '⚡ Nexo';
    var options = {
        body: data.body || 'یه پیام جدید داری!',
        icon: '/icon.png',
        badge: '/badge.png',
        vibrate: [200, 100, 200],
        tag: 'nexo-notification',
        renotify: true,
        requireInteraction: false,
        silent: false,
        dir: 'rtl',
        lang: 'fa'
    };
    
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(clients.claim());
});