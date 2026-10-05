import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Trash2, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const EnquiriesManager = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const { success, error } = useToast();

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const res = await adminService.getEnquiries({ status: statusFilter });
      setEnquiries(res.enquiries || []);
    } catch (err) {
      error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminService.updateEnquiryStatus(id, status);
      setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status } : e)));
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status });
      }
      success(`Status updated to ${status}`);
    } catch (err) {
      error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await adminService.deleteEnquiry(id);
      setEnquiries(enquiries.filter((e) => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      success('Inquiry deleted');
    } catch (err) {
      error('Failed to delete inquiry');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">CLIENT ENQUIRIES & LEADS</h1>
          <p className="text-xs text-zinc-400 mt-1">Manage inbound booking requests, budgets, and project quotes.</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-[#D4A346]"
        >
          <option value="">All Inquiries</option>
          <option value="new">Unread / New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* List of Enquiries */}
        <div className="lg:col-span-6 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-zinc-500 text-xs">Loading leads...</div>
          ) : enquiries.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs rounded-2xl bg-[#121216] border border-[#24221C]">
              No inquiries found in this category.
            </div>
          ) : (
            enquiries.map((enq) => {
              const isSelected = selectedEnquiry?.id === enq.id;
              return (
                <div
                  key={enq.id}
                  onClick={() => {
                    setSelectedEnquiry(enq);
                    if (enq.status === 'new') handleUpdateStatus(enq.id, 'read');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A22] border-[#D4A346]'
                      : 'bg-[#121216] border-[#24221C] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{enq.name}</h4>
                      {enq.status === 'new' && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
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
                    <span className="text-[#F5C869]">{enq.budget_range}</span>
                    <span>•</span>
                    <span>{enq.service_type}</span>
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
                  <h3 className="font-heading font-bold text-lg text-white">{selectedEnquiry.name}</h3>
                  <p className="text-xs text-[#D4A346] font-medium">{selectedEnquiry.brand_name || 'Direct Client'}</p>
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

                {selectedEnquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5 text-xs text-zinc-300 hover:border-emerald-500"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span className="truncate">{selectedEnquiry.phone}</span>
                  </a>
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
                <span>Reply via Email</span>
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
