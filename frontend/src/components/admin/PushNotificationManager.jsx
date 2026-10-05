import React from 'react';
import {
  BellRing,
  BellOff,
  Send,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { usePushNotifications } from '../../hooks/usePushNotifications';

export const PushNotificationManager = ({ onNotificationReceived }) => {
  const {
    permission,
    isSubscribed,
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
  } = usePushNotifications({ onNewNotification: onNotificationReceived });

  const getStatusBadge = () => {
    if (!isSupported) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
          <AlertTriangle className="w-3.5 h-3.5 text-zinc-500" />
          Unsupported Browser
        </span>
      );
    }

    if (!isConfigured) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          Firebase Credentials Needed
        </span>
      );
    }

    if (permission === 'denied') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <BellOff className="w-3.5 h-3.5" />
          Permission Blocked
        </span>
      );
    }

    if (isSubscribed && permission === 'granted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Push Active & Subscribed
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
        Ready to Enable
      </span>
    );
  };

  return (
    <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-zinc-700">
      {/* Subtle Gold Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A346]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A346]/20 to-[#996D19]/10 border border-[#D4A346]/30 flex items-center justify-center text-[#D4A346]">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Admin Push Notifications (FCM)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#D4A346]/10 text-[#D4A346] border border-[#D4A346]/30">
                HTTP v1
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Receive real-time enquiry alerts on phone & desktop even when the admin panel is closed.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Status & Feedback Messages */}
      {error && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            {permission === 'denied' && (
              <p className="mt-1 text-zinc-400">
                To unblock: Click the lock/settings icon next to the URL in your browser bar, set <strong>Notifications</strong> to <strong>Allow</strong>, and refresh the page.
              </p>
            )}
          </div>
          <button
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-200 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content & Controls */}
      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Current Device
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <Smartphone className="w-4 h-4 text-[#D4A346]" />
              <span className="truncate">{navigator.userAgent.split(' ')[0]}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Browser Permission
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold capitalize text-zinc-200">
              <ShieldCheck className="w-4 h-4 text-[#D4A346]" />
              <span>{permission}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
              Background Delivery
            </span>
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <span className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
              <span>{isSubscribed ? 'Service Worker Active' : 'Not Subscribed'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!isSubscribed ? (
            <button
              onClick={enableNotifications}
              disabled={loading || !isSupported}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#F5C869] to-[#D4A346] text-black shadow-lg shadow-[#D4A346]/10 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <BellRing className="w-4 h-4" />
              )}
              <span>Enable Push on this Device</span>
            </button>
          ) : (
            <>
              <button
                onClick={sendTestNotification}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4A346]" />
                ) : (
                  <Send className="w-4 h-4 text-[#D4A346]" />
                )}
                <span>Send Test Notification</span>
              </button>

              <button
                onClick={disableNotifications}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 active:scale-95 transition-all disabled:opacity-50"
              >
                <BellOff className="w-4 h-4" />
                <span>Disable on this Device</span>
              </button>
            </>
          )}
        </div>

        {/* iOS / iPadOS PWA Guidance Card */}
        {isIOS && !isStandalone && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mt-3">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300">
                <strong className="text-amber-300 block mb-1 font-semibold">
                  iOS Push Notification Requirement (iOS 16.4+)
                </strong>
                To receive push notifications on iPhone or iPad, tap the <strong>Share icon</strong> in Safari and select <strong>"Add to Home Screen"</strong>. Then open the installed app and enable notifications here.
              </div>
            </div>
          </div>
        )}

        {/* Firebase Config Notice if unconfigured */}
        {!isConfigured && (
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-dashed border-[#D4A346]/40 mt-3 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[#D4A346] shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300 space-y-1">
              <p className="font-semibold text-white">
                Firebase Web Push Credentials Setup
              </p>
              <p className="text-zinc-400">
                To enable live push notifications, add your Firebase Web App credentials & VAPID key to <code className="text-[#D4A346]">frontend/.env</code> and your Service Account JSON to <code className="text-[#D4A346]">backend/.env</code>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
