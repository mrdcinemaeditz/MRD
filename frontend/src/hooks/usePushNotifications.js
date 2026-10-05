import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import {
  firebaseConfig,
  isFirebaseConfigured,
  requestFCMToken,
  onForegroundMessage
} from '../services/firebase';

const LOCAL_STORAGE_TOKEN_KEY = 'mrd_fcm_device_token';

export const usePushNotifications = ({ onNewNotification } = {}) => {
  const [permission, setPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported'
  );
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [token, setToken] = useState(
    typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const isSupported =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window;

  const isIOS =
    typeof window !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  const isStandalone =
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true);

  const isConfigured = isFirebaseConfigured();

  // Register the service worker and pass config as query params
  const registerServiceWorker = useCallback(async () => {
    if (!isSupported) return null;

    try {
      const swParams = new URLSearchParams({
        apiKey: firebaseConfig.apiKey || '',
        authDomain: firebaseConfig.authDomain || '',
        projectId: firebaseConfig.projectId || '',
        storageBucket: firebaseConfig.storageBucket || '',
        messagingSenderId: firebaseConfig.messagingSenderId || '',
        appId: firebaseConfig.appId || ''
      }).toString();

      const registration = await navigator.serviceWorker.register(
        `/firebase-messaging-sw.js?${swParams}`,
        { scope: '/' }
      );
      await navigator.serviceWorker.ready;
      return registration;
    } catch (err) {
      console.error('[PushHook] Service Worker registration failed:', err);
      throw err;
    }
  }, [isSupported]);

  // Sync initial state
  useEffect(() => {
    if (!isSupported) {
      setPermission('unsupported');
      return;
    }

    setPermission(Notification.permission);
    const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (storedToken && Notification.permission === 'granted') {
      setIsSubscribed(true);
      setToken(storedToken);
    }
  }, [isSupported]);

  // Listen to foreground FCM messages
  useEffect(() => {
    if (!isConfigured || permission !== 'granted') return;

    let unsubscribe = null;
    const setupListener = async () => {
      try {
        unsubscribe = await onForegroundMessage((payload) => {
          console.log('[PushHook] Foreground message received:', payload);
          if (onNewNotification) {
            onNewNotification(payload);
          }
        });
      } catch (err) {
        console.warn('[PushHook] Could not attach foreground message listener:', err);
      }
    };

    setupListener();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [isConfigured, permission, onNewNotification]);

  // Enable Push Notifications
  const enableNotifications = async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser.');
      return false;
    }

    if (!isConfigured) {
      setError('Firebase is not yet configured with environment variables.');
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 1. Request Browser Permission (User gesture triggered)
      const permResult = await Notification.requestPermission();
      setPermission(permResult);

      if (permResult !== 'granted') {
        setError(
          permResult === 'denied'
            ? 'Notification permission was blocked in your browser. Please unblock notifications in site settings.'
            : 'Notification permission was not granted.'
        );
        setLoading(false);
        return false;
      }

      // 2. Register Service Worker
      const swReg = await registerServiceWorker();

      // 3. Obtain FCM Token
      const fcmToken = await requestFCMToken(swReg);
      if (!fcmToken) {
        throw new Error('Could not retrieve push token from Firebase.');
      }

      // 4. Register Token with Rails Backend
      const platform = isIOS ? 'ios' : 'web';
      await adminService.registerPushDevice({
        token: fcmToken,
        platform: platform,
        user_agent: navigator.userAgent
      });

      // 5. Update local state
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, fcmToken);
      setToken(fcmToken);
      setIsSubscribed(true);
      setSuccessMessage('Push notifications enabled successfully on this device!');
      return true;
    } catch (err) {
      console.error('[PushHook] Error enabling notifications:', err);
      setError(err?.response?.data?.error || err.message || 'Failed to enable push notifications.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Disable Push Notifications
  const disableNotifications = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const storedToken = token || localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
      if (storedToken) {
        await adminService.unregisterPushDevice({ token: storedToken });
      } else {
        await adminService.unregisterPushDevice();
      }

      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
      setToken(null);
      setIsSubscribed(false);
      setSuccessMessage('Push notifications disabled on this device.');
      return true;
    } catch (err) {
      console.error('[PushHook] Error disabling notifications:', err);
      setError(err?.response?.data?.error || err.message || 'Failed to disable notifications.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Send Test Push Notification
  const sendTestNotification = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await adminService.sendTestPushNotification();
      if (res.status === 'unconfigured') {
        setError('Firebase credentials are not configured on the backend server yet.');
        return false;
      }
      setSuccessMessage(res.message || 'Test push notification sent! Check your device notifications.');
      return true;
    } catch (err) {
      console.error('[PushHook] Error sending test notification:', err);
      setError(err?.response?.data?.error || err.message || 'Failed to send test notification.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    permission,
    isSubscribed,
    token,
    loading,
    error,
    successMessage,
    isSupported,
    isIOS,
    isStandalone,
    isConfigured,
    enableNotifications,
    disableNotifications,
    sendTestNotification,
    setError,
    setSuccessMessage
  };
};
