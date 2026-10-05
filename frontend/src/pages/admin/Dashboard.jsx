import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, Eye, Heart, MessageSquare, Mail, AlertTriangle, 
  Users, ArrowUpRight, Plus, Sparkles, CheckCircle2 
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await adminService.getDashboardStats();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-2 border-[#D4A346] border-t-transparent animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentEnquiries = data?.recent_enquiries || [];
  const recentComments = data?.recent_comments || [];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">STUDIO DASHBOARD</h1>
          <p className="text-xs text-zinc-400 mt-1">Real-time overview of portfolio performance, engagement, and client leads.</p>
        </div>

        <Link
          to="/admin/videos?action=new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-gradient text-black font-heading font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D4A346]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Reel</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121216] border border-[#24221C] space-y-1">
          <div className="flex items-center justify-between text-[#F5C869]">
            <Video className="w-5 h-5" />
            <span className="text-[10px] uppercase font-mono-code text-zinc-500">Total</span>
          </div>
          <span className="font-mono-code font-bold text-2xl text-white block">{stats.total_videos || 0}</span>
          <span className="text-xs text-zinc-400">Published Reels</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121216] border border-[#24221C] space-y-1">
          <div className="flex items-center justify-between text-[#F5C869]">
            <Eye className="w-5 h-5" />
            <span className="text-[10px] uppercase font-mono-code text-zinc-500">Impressions</span>
          </div>
          <span className="font-mono-code font-bold text-2xl text-gold-gradient block">
            {Number(stats.total_views || 0).toLocaleString()}
          </span>
          <span className="text-xs text-zinc-400">Total Views</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121216] border border-[#24221C] space-y-1">
          <div className="flex items-center justify-between text-red-400">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] uppercase font-mono-code text-zinc-500">Engagement</span>
          </div>
          <span className="font-mono-code font-bold text-2xl text-white block">
            {Number(stats.total_likes || 0).toLocaleString()}
          </span>
          <span className="text-xs text-zinc-400">Total Likes</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#121216] border border-[#24221C] space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <Mail className="w-5 h-5" />
            <span className="text-[10px] uppercase font-mono-code text-emerald-500">New Leads</span>
          </div>
          <span className="font-mono-code font-bold text-2xl text-white block">
            {stats.pending_enquiries || 0}
          </span>
          <span className="text-xs text-zinc-400">Unread Enquiries</span>
        </div>
      </div>

      {/* Flagged / Moderation Alert if any */}
      {stats.flagged_comments > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-zinc-200">
              You have <strong className="text-amber-300">{stats.flagged_comments}</strong> comments pending review or flagged by visitors.
            </p>
          </div>
          <Link to="/admin/comments" className="text-xs font-semibold text-[#F5C869] hover:underline whitespace-nowrap">
            Review Now →
          </Link>
        </div>
      )}

      {/* Split Grids: Recent Enquiries & Recent Comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enquiries */}
        <div className="p-6 rounded-2xl bg-[#121216] border border-[#24221C] space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-heading font-bold text-sm text-white">Recent Client Enquiries</h3>
            <Link to="/admin/enquiries" className="text-xs text-[#F5C869] hover:underline flex items-center gap-1">
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnquiries.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No enquiries received yet.</p>
            ) : (
              recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-white">{enq.name}</h4>
                      {enq.brand_name && <span className="text-[10px] text-zinc-400">({enq.brand_name})</span>}
                      {enq.status === 'new' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">NEW</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{enq.message}</p>
                    <span className="text-[10px] text-zinc-500 font-mono-code mt-1 block">{enq.budget_range} • {enq.service_type}</span>
                  </div>
                  <Link to="/admin/enquiries" className="text-xs text-[#D4A346] hover:text-white p-1">
                    Open
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="p-6 rounded-2xl bg-[#121216] border border-[#24221C] space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="font-heading font-bold text-sm text-white">Recent Reel Comments</h3>
            <Link to="/admin/comments" className="text-xs text-[#F5C869] hover:underline flex items-center gap-1">
              <span>Moderation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentComments.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-6">No comments to display.</p>
            ) : (
              recentComments.map((comment) => (
                <div key={comment.id} className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{comment.user?.name}</span>
                    <span className="text-[10px] text-zinc-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-2">{comment.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
