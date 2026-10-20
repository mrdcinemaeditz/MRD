import React, { useState } from 'react';
import { Heart, Eye, Sparkles, Clock } from 'lucide-react';
import { videoService } from '../../services/videoService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AutoplayVideoPlayer } from './AutoplayVideoPlayer';

export const ReelCard = ({ video, onSelect, onOpenAuth, rootRef = null }) => {
  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();
  const [liked, setLiked] = useState(video.liked_by_current_user || false);
  const [likesCount, setLikesCount] = useState(video.likes_count || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      if (onOpenAuth) onOpenAuth();
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await videoService.toggleLike(video.id);
      setLiked(res.liked);
      setLikesCount(res.likes_count);
      if (res.liked) success('Added to liked reels');
    } catch (err) {
      setLiked(prevLiked);
      setLikesCount(prevCount);
      error('Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const isReel = video.aspect_ratio === '9:16';

  return (
    <div
      onClick={() => onSelect && onSelect(video)}
      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-[#0A0A0E] border border-zinc-800 hover:border-red-600/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-red-600/20 flex flex-col w-full min-w-0"
    >
      {/* Autoplay Video Player (handles MP4/WebM, YouTube, Vimeo, lazy-load & single active 60% scroll) */}
      <AutoplayVideoPlayer
        url={video.video_url}
        thumbnailUrl={video.thumbnail_url}
        title={video.title}
        categorySlug={video.category?.slug}
        aspectRatio={isReel ? '9:16' : '16:9'}
        playerId={`reel-${video.id}`}
        rootRef={rootRef}
      />

      {/* Top Overlay Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none z-30">
        {video.is_featured && (
          <span className="px-2.5 py-0.5 rounded-full bg-red-gradient text-white font-heading font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-red-600/30 flex items-center gap-1 border border-red-400/30">
            <Sparkles className="w-2.5 h-2.5 text-white" />
            Featured
          </span>
        )}
        {video.category && (
          <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-red-500/40 text-red-400 text-[10px] font-semibold uppercase tracking-wider">
            {video.category.name}
          </span>
        )}
      </div>

      {/* Top-Right Duration Badge (offset next to mute button) */}
      {video.duration && (
        <div className="absolute top-3 right-12 z-30 pointer-events-none px-2 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono-code font-medium text-zinc-300 flex items-center gap-1">
          <Clock className="w-3 h-3 text-red-500" />
          <span>{video.duration}</span>
        </div>
      )}

      {/* Bottom Overlay Info (Title & Stats) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 z-20 pointer-events-none">
        <h3 className="font-heading font-semibold text-sm sm:text-base text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
          {video.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-white/10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono-code">
              <Eye className="w-3.5 h-3.5 text-zinc-500" />
              {Number(video.views_count || 0).toLocaleString()}
            </span>
          </div>

          {/* Like Button */}
          <button
            type="button"
            onClick={handleLike}
            className={`pointer-events-auto flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              liked
                ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-sm shadow-red-500/30'
                : 'bg-black/60 text-zinc-300 hover:text-red-400 hover:bg-black/80 border border-white/10'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current text-red-500' : ''}`} />
            <span>{likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
