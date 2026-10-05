import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Eye, Sparkles, Clock, Film } from 'lucide-react';
import { videoService } from '../../services/videoService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ReelCard = ({ video, onSelect, onOpenAuth }) => {
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

    // Optimistic UI
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
      className="group relative cursor-pointer rounded-2xl overflow-hidden bg-[#121216] border border-[#24221C] hover:border-[#D4A346]/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#D4A346]/15 flex flex-col"
    >
      {/* Thumbnail Container */}
      <div className={`relative w-full ${isReel ? 'aspect-[9/16]' : 'aspect-video'} bg-zinc-950 overflow-hidden`}>
        <img
          src={video.thumbnail_url || '/logo.png'}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Cinematic Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono-code font-medium text-zinc-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#D4A346]" />
            <span>{video.duration}</span>
          </div>
        )}

        {/* Category & Featured Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {video.is_featured && (
            <span className="px-2.5 py-0.5 rounded-full bg-gold-gradient text-black font-heading font-bold text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
          {video.category && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#121216]/80 backdrop-blur-md border border-[#D4A346]/30 text-[#F5C869] text-[10px] font-medium uppercase tracking-wider">
              {video.category.name}
            </span>
          )}
        </div>

        {/* Center Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center text-black shadow-2xl shadow-[#D4A346]/50 group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-current ml-1" />
          </div>
        </div>

        {/* Bottom Overlay Info (Title & Stats) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <h3 className="font-heading font-semibold text-sm sm:text-base text-white group-hover:text-[#F5C869] transition-colors line-clamp-2 leading-snug">
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
              onClick={handleLike}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                liked
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : 'bg-black/60 text-zinc-300 hover:text-red-400 hover:bg-black/80 border border-white/10'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current text-red-500' : ''}`} />
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
