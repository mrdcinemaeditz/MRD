import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, CheckCircle, AlertTriangle, Trash2, 
  Ban, ShieldAlert, Check, X 
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export const CommentsModeration = () => {
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'reports'
  const [comments, setComments] = useState([]);
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const { success, error } = useToast();

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await adminService.getComments({ status: statusFilter });
      setComments(res.comments || []);
    } catch (err) {
      error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReports();
      setReports(res.reports || []);
    } catch (err) {
      error('Failed to load reported comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'comments') {
      loadComments();
    } else {
      loadReports();
    }
  }, [activeTab, statusFilter]);

  const handleApprove = async (id) => {
    try {
      await adminService.approveComment(id);
      setComments(comments.map((c) => (c.id === id ? { ...c, status: 'approved' } : c)));
      success('Comment approved');
    } catch (err) {
      error('Failed to approve comment');
    }
  };

  const handleFlag = async (id) => {
    try {
      await adminService.flagComment(id);
      setComments(comments.map((c) => (c.id === id ? { ...c, status: 'flagged' } : c)));
      success('Comment flagged');
    } catch (err) {
      error('Failed to flag comment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment permanently?')) return;
    try {
      await adminService.deleteComment(id);
      setComments(comments.filter((c) => c.id !== id));
      success('Comment deleted');
    } catch (err) {
      error('Failed to delete comment');
    }
  };

  const handleBlockUser = async (commentId) => {
    if (!window.confirm('Block this user and remove all their comments?')) return;
    try {
      const res = await adminService.blockUser(commentId);
      success(res.message);
      loadComments();
    } catch (err) {
      error('Failed to block user');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="font-cinematic font-bold text-2xl sm:text-3xl text-white">COMMENTS & MODERATION</h1>
        <p className="text-xs text-zinc-400 mt-1">Review community discussion, approve or remove flagged content, and block spam bots.</p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'comments' ? 'bg-gold-gradient text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            All Comments
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'reports' ? 'bg-gold-gradient text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Reported Comments ({reports.length})</span>
          </button>
        </div>

        {activeTab === 'comments' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
          >
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="flagged">Flagged</option>
            <option value="pending">Pending</option>
          </select>
        )}
      </div>

      {/* Comments List */}
      {activeTab === 'comments' ? (
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-zinc-500 text-xs">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">No comments found matching filter.</div>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[#121216] border border-[#24221C] flex items-start justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{c.user?.name}</span>
                    <span className="text-[10px] text-zinc-500">{new Date(c.created_at).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                      c.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{c.body}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {c.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(c.id)}
                      className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all"
                      title="Approve Comment"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {c.status !== 'flagged' && (
                    <button
                      onClick={() => handleFlag(c.id)}
                      className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-all"
                      title="Flag as inappropriate"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleBlockUser(c.id)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30"
                    title="Block User"
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/30"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Reports Queue */
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">No pending comment reports. Everything is clean!</div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-[#121216] border border-red-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-400">Reported Reason:</span>
                    <span className="text-xs text-white">"{r.reason}"</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">By: {r.reporter?.name} ({r.reporter?.email})</span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 block mb-1">Target Comment:</span>
                  <p className="text-xs text-zinc-200">{r.comment?.body}</p>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleDelete(r.comment?.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-semibold"
                  >
                    Delete Offending Comment
                  </button>
                  <button
                    onClick={() => handleBlockUser(r.comment?.id)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-semibold"
                  >
                    Block Offending User
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
