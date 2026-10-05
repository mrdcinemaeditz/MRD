import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Mail, CheckCheck, ArrowUpRight, Sparkles, Clock } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { onForegroundMessage, isFirebaseConfigured } from '../../services/firebase';

export const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestUnread, setLatestUnread] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { success, error, info } = useToast();

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await adminService.getUnreadEnquiriesCount();
      setUnreadCount(data.unread_count || 0);
      setLatestUnread(data.latest_unread || []);
    } catch (err) {
      // Silently ignore background polling errors
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Foreground push notification listener
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    let unsubscribe = null;
    const setupPushListener = async () => {
      try {
        unsubscribe = await onForegroundMessage((payload) => {
          console.log('[NotificationBell] Push received in foreground:', payload);
          fetchNotifications();

          const title = payload?.notification?.title || payload?.data?.title || 'New Client Enquiry';
          const body = payload?.notification?.body || payload?.data?.body || 'A new project proposal was submitted.';
          const targetUrl = payload?.data?.url || '/admin/enquiries';

          // 1. Show in-app toast notification
          if (info) {
            info(`${title}: ${body}`);
          }

          // 2. Show native browser popup notification even when looking at the tab
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              const popup = new Notification(title, {
                body: body,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-192x192.png',
                tag: 'mrd-fg-' + Date.now(),
                requireInteraction: false
              });

              popup.onclick = () => {
                window.focus();
                navigate(targetUrl);
                popup.close();
              };
            } catch (popupErr) {
              console.warn('[NotificationBell] Could not spawn native Notification constructor:', popupErr);
            }
          }
        });
      } catch (err) {
        console.warn('[NotificationBell] Could not attach push listener:', err);
      }
    };

    setupPushListener();

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [fetchNotifications, info]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      await adminService.markAllEnquiriesRead();
      setUnreadCount(0);
      setLatestUnread([]);
      success('All enquiries marked as read');
    } catch (err) {
      error('Failed to mark enquiries as read');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEnquiry = (enquiryId) => {
    setDropdownOpen(false);
    navigate(`/admin/enquiries?selected=${enquiryId}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-[#F5C869] hover:border-[#D4A346]/40 transition-all active:scale-95"
        title="Notifications"
        aria-label="Enquiry Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-gold-gradient text-black font-mono-code font-extrabold text-[9px] shadow-lg shadow-[#D4A346]/50 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#121216] border border-[#D4A346]/40 shadow-2xl shadow-black/90 p-4 z-50 backdrop-blur-xl animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                Client Inquiries
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#D4A346]/20 border border-[#D4A346]/40 text-[#F5C869] text-[10px] font-mono-code font-bold">
                  {unreadCount} New
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                className="text-[11px] text-zinc-400 hover:text-[#F5C869] transition-colors flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List of Latest Unread Inquiries */}
          <div className="py-2 space-y-2 max-h-80 overflow-y-auto divide-y divide-zinc-800/40">
            {latestUnread.length === 0 ? (
              <div className="py-8 text-center text-zinc-500 text-xs">
                <Mail className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                <p>No unread enquiries at the moment.</p>
                <span className="text-[10px] text-zinc-600">You're all caught up!</span>
              </div>
            ) : (
              latestUnread.map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => handleOpenEnquiry(enq.id)}
                  className="pt-2.5 pb-1 px-2 rounded-xl hover:bg-zinc-900/80 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-[#F5C869] transition-colors truncate">
                          {enq.name}
                        </span>
                        {enq.brand_name && (
                          <span className="text-[10px] text-zinc-400 truncate">
                            • {enq.brand_name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                        {enq.message}
                      </p>
                    </div>

                    <span className="text-[9px] text-zinc-500 font-mono-code shrink-0">
                      {new Date(enq.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono-code mt-1.5">
                    <span className="text-[#F5C869]">{enq.budget_range}</span>
                    <span>•</span>
                    <span className="truncate">{enq.service_type}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer View All Link */}
          <div className="pt-3 border-t border-zinc-800 text-center">
            <Link
              to="/admin/enquiries"
              onClick={() => setDropdownOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#F5C869] hover:underline"
            >
              <span>View All Enquiries</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
