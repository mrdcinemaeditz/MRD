import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Mail, Phone, Clock, Trash2, CheckCircle2, 
  MessageSquare, Sparkles, CheckCheck, Filter, AlertCircle 
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const EnquiriesManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedIdFromUrl = searchParams.get('selected');

  const [enquiries, setEnquiries] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const { success, error } = useToast();

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const res = await adminService.getEnquiries({ status: statusFilter });
      const list = res.enquiries || [];
      setEnquiries(list);
      setUnreadCount(res.unread_count || 0);

      // Auto-select from URL param or retain selected
      if (selectedIdFromUrl) {
        const found = list.find((e) => e.id.toString() === selectedIdFromUrl);
        if (found) {
          handleSelectEnquiry(found);
        }
      }
    } catch (err) {
      error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter]);

  const handleSelectEnquiry = async (enq) => {
    setSelectedEnquiry(enq);

    // If unread, mark it as read immediately
    if (!enq.read || enq.status === 'new') {
      try {
        const res = await adminService.markEnquiryRead(enq.id);
        setEnquiries((prev) =>
          prev.map((item) =>
            item.id === enq.id ? { ...item, read: true, status: res.enquiry?.status || 'read' } : item
          )
        );
        setSelectedEnquiry((prev) => (prev?.id === enq.id ? { ...prev, read: true, status: res.enquiry?.status || 'read' } : prev));
        setUnreadCount(res.unread_count || 0);
      } catch (err) {
        // Silently continue
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await adminService.markAllEnquiriesRead();
      setEnquiries((prev) =>
        prev.map((item) => ({
          ...item,
          read: true,
          status: item.status === 'new' ? 'read' : item.status
        }))
      );
      if (selectedEnquiry) {
        setSelectedEnquiry((prev) => ({ ...prev, read: true, status: prev.status === 'new' ? 'read' : prev.status }));
      }
      setUnreadCount(0);
      success('All enquiries marked as read');
    } catch (err) {
      error('Failed to mark all as read');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminService.updateEnquiryStatus(id, status);
      setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status, read: status !== 'new' } : e)));
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status, read: status !== 'new' });
      }
      success(`Status updated to ${status}`);
    } catch (err) {
      error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      const res = await adminService.deleteEnquiry(id);
      setEnquiries(enquiries.filter((e) => e.id !== id));
      setUnreadCount(res.unread_count || 0);
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      success('Inquiry deleted');
    } catch (err) {
      error('Failed to delete inquiry');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">CLIENT ENQUIRIES & LEADS</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage inbound quote inquiries, client proposals, and email conversations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#D4A346]/40 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#D4A346]" />
              <span>Mark all as read</span>
            </button>
          )}

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#121216]">All Enquiries</option>
              <option value="unread" className="bg-[#121216]">Unread Only ({unreadCount})</option>
              <option value="read" className="bg-[#121216]">Read / Reviewed</option>
              <option value="replied" className="bg-[#121216]">Replied</option>
              <option value="archived" className="bg-[#121216]">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List of Enquiries */}
        <div className="lg:col-span-6 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-zinc-500 text-xs">Loading leads...</div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs rounded-2xl bg-[#121216] border border-[#24221C]">
              No inquiries found under this filter.
            </div>
          ) : (
            enquiries.map((enq) => {
              const isSelected = selectedEnquiry?.id === enq.id;
              const isUnread = !enq.read || enq.status === 'new';

              return (
                <div
                  key={enq.id}
                  onClick={() => handleSelectEnquiry(enq)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#1A1A22] border-[#D4A346] shadow-lg shadow-[#D4A346]/10'
                      : isUnread
                      ? 'bg-[#15151B] border-amber-500/40 hover:border-amber-500'
                      : 'bg-[#121216] border-[#24221C] hover:border-zinc-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Unread Glow Dot */}
                  {isUnread && (
                    <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-gold-gradient shadow-md shadow-[#D4A346]" />
                  )}

                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-xs font-bold ${isUnread ? 'text-white font-extrabold' : 'text-zinc-200'}`}>
                        {enq.name}
                      </h4>
                      {isUnread && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 uppercase">
                          NEW
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono-code">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-medium">{enq.brand_name || 'Individual Creator'}</p>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{enq.message}</p>

                  <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono-code mt-2">
                    <span className="text-[#F5C869] font-semibold">{enq.budget_range}</span>
                    <span>•</span>
                    <span className="truncate">{enq.service_type}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Enquiry Detailed View */}
        <div className="lg:col-span-6">
          {selectedEnquiry ? (
            <div className="p-6 rounded-3xl bg-[#121216] border border-[#24221C] space-y-6 sticky top-24 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-lg text-white">{selectedEnquiry.name}</h3>
                    {(!selectedEnquiry.read || selectedEnquiry.status === 'new') && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#D4A346] font-medium mt-0.5">
                    {selectedEnquiry.brand_name || 'Direct Client'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleUpdateStatus(selectedEnquiry.id, e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>

                  <button
                    onClick={() => handleDelete(selectedEnquiry.id)}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-300 hover:border-[#D4A346]"
                >
                  <Mail className="w-4 h-4 text-[#D4A346]" />
                  <span className="truncate">{selectedEnquiry.email}</span>
                </a>

                {selectedEnquiry.phone ? (
                  <a
                    href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-300 hover:border-emerald-500"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span className="truncate">{selectedEnquiry.phone}</span>
                  </a>
                ) : (
                  <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-500">
                    <Phone className="w-4 h-4 text-zinc-600" />
                    <span>No phone provided</span>
                  </div>
                )}
              </div>

              {/* Scope & Budget Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
                  <span className="text-zinc-500 block mb-0.5">Budget Tier</span>
                  <span className="text-white font-bold font-mono-code">{selectedEnquiry.budget_range}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800">
                  <span className="text-zinc-500 block mb-0.5">Service Requested</span>
                  <span className="text-white font-semibold">{selectedEnquiry.service_type}</span>
                </div>
              </div>

              {/* Message */}
              <div>
                <span className="text-xs text-zinc-400 block mb-1 font-medium">Project Scope & Notes:</span>
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-200 leading-relaxed whitespace-pre-line">
                  {selectedEnquiry.message}
                </div>
              </div>

              <a
                href={`mailto:${selectedEnquiry.email}?subject=Re:%20Project%20Inquiry%20-%20MRD%20CINEMA%20EDITZ`}
                className="w-full py-3 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#D4A346]/20"
              >
                <Mail className="w-4 h-4" />
                <span>Reply via Direct Email</span>
              </a>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#121216]/50 border border-[#24221C] text-zinc-500 text-xs">
              Select an inquiry on the left to inspect proposal details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
