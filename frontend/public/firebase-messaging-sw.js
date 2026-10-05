/* eslint-disable no-undef */
// Firebase Cloud Messaging Service Worker for MRD CINEMA EDITZ
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const urlParams = new URLSearchParams(location.search);
const firebaseConfig = {
  apiKey: urlParams.get('apiKey') || '',
  authDomain: urlParams.get('authDomain') || '',
  projectId: urlParams.get('projectId') || '',
  storageBucket: urlParams.get('storageBucket') || '',
  messagingSenderId: urlParams.get('messagingSenderId') || '',
  appId: urlParams.get('appId') || ''
};

if (firebaseConfig.projectId && firebaseConfig.apiKey) {
  try {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('[SW] onBackgroundMessage received:', payload);
      const title = payload.notification?.title || payload.data?.title || 'MRD CINEMA EDITZ - New Lead';
      const body = payload.notification?.body || payload.data?.body || 'You have received a new project enquiry.';
      const icon = payload.notification?.icon || payload.data?.icon || '/icons/icon-192x192.png';
      const link = payload.fcmOptions?.link || payload.data?.url || '/admin/enquiries';

      const notificationOptions = {
        body: body,
        icon: icon,
        badge: icon,
        tag: 'mrd-lead-' + (payload.data?.enquiry_id || Date.now()),
        renotify: true,
        requireInteraction: true,
        data: {
          url: link,
          enquiry_id: payload.data?.enquiry_id
        }
      };

      return self.registration.showNotification(title, notificationOptions);
    });
  } catch (err) {
    console.warn('[SW] Firebase messaging init warning:', err);
  }
}

// Push event listener for fallback background delivery
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const notification = payload.notification || {};
    const data = payload.data || {};

    const title = notification.title || data.title || 'MRD CINEMA EDITZ';
    const body = notification.body || data.body || 'New enquiry received.';
    const icon = notification.icon || data.icon || '/icons/icon-192x192.png';
    const clickUrl = (payload.fcmOptions && payload.fcmOptions.link) || data.url || '/admin/enquiries';

    const notificationOptions = {
      body: body,
      icon: icon,
      badge: icon,
      tag: 'mrd-enquiry-' + (data.enquiry_id || Date.now()),
      renotify: true,
      requireInteraction: true,
      data: {
        url: clickUrl,
        enquiry_id: data.enquiry_id
      }
    };

    event.waitUntil(
      self.registration.showNotification(title, notificationOptions)
    );
  } catch (err) {
    console.error('[SW] Error parsing push data:', err);
  }
});

// Notification click event listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) || '/admin/enquiries';
  const fullUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes('/admin') && 'focus' in client) {
          if ('navigate' in client) {
            client.navigate(fullUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(fullUrl);
      }
    })
  );
});
