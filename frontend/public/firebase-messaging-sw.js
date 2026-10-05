/* eslint-disable no-undef */
// Firebase Cloud Messaging Service Worker for MRD CINEMA EDITZ
// Handles background push notifications when admin tab is closed or in background.

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Parse config from URL parameters if passed during registration, or fallback to defaults
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
  firebase.initializeApp(firebaseConfig);
}

// Background message event listener
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const notification = payload.notification || {};
    const data = payload.data || {};

    const title = notification.title || data.title || 'MRD CINEMA EDITZ';
    const body = notification.body || data.body || 'New enquiry received.';
    const icon = notification.icon || data.icon || '/icons/icon-192x192.png';
    const badge = notification.badge || data.badge || '/icons/icon-192x192.png';
    const clickUrl = (payload.fcmOptions && payload.fcmOptions.link) || data.url || '/admin/enquiries';

    const notificationOptions = {
      body: body,
      icon: icon,
      badge: badge,
      tag: 'mrd-enquiry-' + (data.enquiry_id || Date.now()),
      renotify: true,
      requireInteraction: true,
      data: {
        url: clickUrl,
        enquiry_id: data.enquiry_id,
        received_at: Date.now()
      }
    };

    event.waitUntil(
      self.registration.showNotification(title, notificationOptions)
    );
  } catch (err) {
    console.error('[ServiceWorker] Error handling push event:', err);
  }
});

// Notification click event listener
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url) || '/admin/enquiries';
  const fullUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If an existing admin window is open, focus it and navigate
      for (const client of windowClients) {
        if (client.url.includes('/admin') && 'focus' in client) {
          if ('navigate' in client) {
            client.navigate(fullUrl);
          }
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(fullUrl);
      }
    })
  );
});
