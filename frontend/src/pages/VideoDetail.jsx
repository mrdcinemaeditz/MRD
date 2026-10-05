import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Heart, Eye, Share2, MessageCircle, Clock, Sparkles, 
  Trash2, Flag, Send, ArrowLeft, Check, AlertCircle, Film
} from 'lucide-react';
import { videoService } from '../services/videoService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ReelCard } from '../components/common/ReelCard';

export const VideoDetail = ({ onOpenAuth }) => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportingCommentId, setReportingCommentId] = useState(null);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    const loadVideoData = async () => {
      setLoading(true);
      try {
        const res = await videoService.getVideo(id);
        setVideo(res.video);
        setRelatedVideos(res.related_videos || []);
        setLiked(res.video?.liked_by_current_user || false);
        setLikesCount(res.video?.likes_count || 0);

        // Load comments
        if (res.video?.id) {
          const commentsRes = await videoService.getComments(res.video.id);
          setComments(commentsRes.comments || []);
        }
      } catch (err) {
        console.error('Failed to load video:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await videoService.toggleLike(video.id);
      setLiked(res.liked);
      setLikesCount(res.likes_count);
    } catch (err) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      error('Failed to update like');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (!commentBody.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await videoService.postComment(video.id, commentBody.trim());
      setComments([res.comment, ...comments]);
      setCommentBody('');
      success('Comment posted!');
    } catch (err) {
      error(err.response?.data?.error || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await videoService.deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      success('Comment deleted');
    } catch (err) {
      error('Failed to delete comment');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportingCommentId) return;

    try {
      await videoService.reportComment(reportingCommentId, reportReason);
      success('Comment reported for moderation.');
      setReportingCommentId(null);
      setReportReason('');
    } catch (err) {
      error('Failed to submit report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#D4A346] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen pt-32 text-center px-4">
        <h2 className="font-cinematic text-2xl text-white mb-2">Video Not Found</h2>
        <p className="text-zinc-400 mb-6">The requested reel or video does not exist.</p>
        <Link to="/portfolio" className="px-6 py-3 rounded-xl bg-gold-gradient text-black font-semibold text-xs uppercase">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const isReel = video.aspect_ratio === '9:16';

  // Helper to format embed url
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const vid = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${vid}?autoplay=0&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const vid = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${vid}?autoplay=0&rel=0`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(video.video_url);

  return (
    <>
      <Helmet>
        <title>{video.seo_title || `${video.title} | MRD CINEMA EDITZ`}</title>
        <meta name="description" content={video.seo_description || video.description} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.description} />
        <meta property="og:image" content={video.thumbnail_url || '/logo.png'} />
        <meta property="og:type" content="video.other" />
      </Helmet>

      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#F5C869] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Player & Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player Box */}
            <div className={`w-full rounded-2xl overflow-hidden bg-black border border-[#24221C] shadow-2xl ${
              isReel ? 'max-w-md mx-auto aspect-[9/16]' : 'aspect-video'
            }`}>
              {video.video_url && video.video_url.endsWith('.mp4') ? (
                <video
                  src={video.video_url}
                  controls
                  poster={video.thumbnail_url}
                  className="w-full h-full object-contain"
                />
              ) : embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <Film className="w-12 h-12 text-[#D4A346] mb-3" />
                  <p className="text-zinc-400 text-sm">{video.title}</p>
                </div>
              )}
            </div>

            {/* Video Header & Actions */}
            <div className="p-6 rounded-2xl bg-[#121216] border border-[#24221C] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {video.category && (
                    <span className="px-3 py-1 rounded-full bg-[#1A1A22] border border-[#D4A346]/40 text-[#F5C869] text-xs font-medium uppercase tracking-wider">
                      {video.category.name}
                    </span>
                  )}
                  {video.duration && (
                    <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-zinc-400 text-xs font-mono-code flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4A346]" />
                      {video.duration}
                    </span>
                  )}
                </div>

                {/* Like & Share Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLikeToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      liked
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#D4A346]/40'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${liked ? 'fill-current text-red-500' : ''}`} />
                    <span>{likesCount} Likes</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#D4A346]/40 text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    <span>{copied ? 'Copied' : 'Share'}</span>
                  </button>
                </div>
              </div>

              <h1 className="font-heading font-bold text-xl sm:text-2xl text-white leading-snug">
                {video.title}
              </h1>

              <div className="flex items-center gap-4 text-xs text-zinc-400 pb-2 border-b border-zinc-800">
                <span className="flex items-center gap-1 font-mono-code">
                  <Eye className="w-4 h-4 text-zinc-500" />
                  {Number(video.views_count || 0).toLocaleString()} Views
                </span>
                <span>•</span>
                <span>Published {new Date(video.published_at || video.created_at).toLocaleDateString()}</span>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                {video.description}
              </p>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {video.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono-code text-zinc-400"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="p-6 rounded-2xl bg-[#121216] border border-[#24221C] space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#D4A346]" />
                  <span>Comments ({comments.length})</span>
                </h3>
              </div>

              {/* Add Comment Input */}
              {isAuthenticated ? (
                <form onSubmit={handleCommentSubmit} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Add a constructive critique or thought..."
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#D4A346] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !commentBody.trim()}
                    className="px-5 py-3 rounded-xl bg-gold-gradient text-black font-semibold text-xs uppercase flex items-center gap-2 disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-center">
                  <p className="text-xs text-zinc-400 mb-2">Sign in to join the conversation and comment on this reel.</p>
                  <button
                    onClick={onOpenAuth}
                    className="px-4 py-1.5 rounded-lg bg-[#D4A346] text-black font-semibold text-xs uppercase"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Comment List */}
              <div className="space-y-4 pt-2">
                {comments.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 flex items-start justify-between gap-3">
                      <div className="flex gap-3 items-start">
                        {comment.user?.avatar_url ? (
                          <img src={comment.user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#D4A346] text-black font-bold flex items-center justify-center text-xs shrink-0">
                            {comment.user?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white">{comment.user?.name}</span>
                            {comment.user?.role === 'admin' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D4A346] text-black uppercase">Creator</span>
                            )}
                            <span className="text-[10px] text-zinc-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{comment.body}</p>
                        </div>
                      </div>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-1">
                        {comment.can_delete && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                            title="Delete comment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isAuthenticated && (
                          <button
                            onClick={() => setReportingCommentId(comment.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-zinc-800 transition-colors"
                            title="Report comment"
                          >
                            <Flag className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Related Videos Column */}
          <div className="space-y-6">
            <h3 className="font-cinematic font-bold text-lg text-white border-b border-zinc-800 pb-3">
              RELATED REELS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {relatedVideos.map((rel) => (
                <Link key={rel.id} to={`/portfolio/${rel.slug || rel.id}`}>
                  <ReelCard video={rel} onOpenAuth={onOpenAuth} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {reportingCommentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-sm w-full p-6 rounded-2xl bg-[#121216] border border-[#D4A346]/40 shadow-2xl">
            <h4 className="font-heading font-bold text-white mb-2">Report Comment</h4>
            <p className="text-xs text-zinc-400 mb-4">Please specify why you are flagging this comment for review.</p>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <textarea
                required
                rows={3}
                placeholder="Reason (e.g. Spam, offensive language, self promotion)..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#D4A346]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReportingCommentId(null)}
                  className="flex-1 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gold-gradient text-black text-xs font-bold uppercase"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
