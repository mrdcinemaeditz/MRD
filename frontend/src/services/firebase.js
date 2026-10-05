import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId &&
    vapidKey
  );
};

// Safe lazy Firebase app initialization
export const getFirebaseApp = () => {
  if (!isFirebaseConfigured()) return null;
  if (getApps().length > 0) return getApp();
  try {
    return initializeApp(firebaseConfig);
  } catch (err) {
    console.warn('[Firebase] App initialization error:', err);
    return null;
  }
};

let messagingInstance = null;

export const getFirebaseMessaging = async () => {
  if (typeof window === 'undefined') return null;
  if (!isFirebaseConfigured()) return null;

  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  if (!messagingInstance) {
    try {
      const app = getFirebaseApp();
      if (app) {
        messagingInstance = getMessaging(app);
      }
    } catch (err) {
      console.warn('[Firebase] Messaging initialization error:', err);
      return null;
    }
  }
  return messagingInstance;
};

export const requestFCMToken = async (serviceWorkerRegistration) => {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      throw new Error('Firebase Messaging is not supported or credentials are not configured yet.');
    }

    if (!vapidKey) {
      throw new Error('VITE_FIREBASE_VAPID_KEY is missing in frontend environment.');
    }

    const currentToken = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: serviceWorkerRegistration
    });

    return currentToken;
  } catch (error) {
    console.error('[Firebase] Error retrieving FCM registration token:', error);
    throw error;
  }
};

export const onForegroundMessage = async (callback) => {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => {};

  try {
    return onMessage(messaging, (payload) => {
      if (callback) {
        callback(payload);
      }
    });
  } catch (err) {
    console.warn('[Firebase] Failed to attach onMessage listener:', err);
    return () => {};
  }
};
