import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import VimeoPlayer from '@vimeo/player';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { parseVideoSource } from '../../utils/videoUrlParser';
import { loadYouTubeIframeApi } from '../../utils/youtubeApiLoader';
import { videoPlaybackCoordinator } from '../../utils/videoPlaybackCoordinator';

/**
 * Reusable AutoplayVideoPlayer Component
 * 
 * Complies with strict autoplay-on-scroll requirements:
 * - Detects video type from URL (Direct MP4/WebM, YouTube, Vimeo).
 * - Direct files: <video> with muted, loop, playsinline, preload="metadata", and poster.
 * - YouTube: YouTube IFrame Player API (enablejsapi=1, mute=1, playsinline=1), API script loaded only once.
 * - Vimeo: Vimeo Player SDK (@vimeo/player) with muted: true, SDK loaded only once.
 * - Visibility: Plays when >= 60% (0.6) visible in viewport/slider; pauses when < 60% or scrolled out.
 * - Single active playback: Only the single most visible video plays at any time.
 * - Lazy-loading: Shows thumbnail first, mounts iframe/embed only when near viewport (250px rootMargin).
 * - Prefers-reduced-motion: Does not autoplay if user prefers reduced motion.
 * - User controls: Tap-to-unmute and click-to-pause/play available.
 * - rootRef support: Observers can use horizontal slider container as root.
 */
export const AutoplayVideoPlayer = ({
  url,
  thumbnailUrl,
  title = 'Video',
  categorySlug = '',
  aspectRatio = '9:16',
  playerId,
  className = '',
  rootRef = null,
  onPlayStateChange
}) => {
  const autoId = useId();
  const id = playerId || autoId;

  // Video source detection
  const source = parseVideoSource(url, categorySlug, title);

  // States
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // Element & player refs
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const ytMountRef = useRef(null);
  const vimeoPlayerRef = useRef(null);
  const vimeoMountRef = useRef(null);

  // Internal flags
  const isReadyRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const isMutedRef = useRef(true);

  isMutedRef.current = isMuted;

  // Notify parent on state change
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange({ isPlaying, isMuted });
    }
  }, [isPlaying, isMuted, onPlayStateChange]);

  // Command handlers
  const handlePlayCommand = useCallback(() => {
    if (source.type === 'direct') {
      if (videoRef.current) {
        const p = videoRef.current.play();
        if (p !== undefined) {
          p.then(() => setIsPlaying(true))
           .catch((_err) => {
             // Autoplay rejected or rapid scroll abort
             setIsPlaying(false);
           });
        }
      } else {
        pendingPlayRef.current = true;
      }
    } else if (source.type === 'youtube') {
      if (ytPlayerRef.current && isReadyRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        try {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        } catch (_) {}
      } else {
        pendingPlayRef.current = true;
      }
    } else if (source.type === 'vimeo') {
      if (vimeoPlayerRef.current && isReadyRef.current) {
        vimeoPlayerRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((_err) => {
            setIsPlaying(false);
          });
      } else {
        pendingPlayRef.current = true;
      }
    }
  }, [source.type]);

  const handlePauseCommand = useCallback(() => {
    pendingPlayRef.current = false;

    if (source.type === 'direct') {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else if (source.type === 'youtube') {
      if (ytPlayerRef.current && isReadyRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        try {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } catch (_) {}
      }
    } else if (source.type === 'vimeo') {
      if (vimeoPlayerRef.current && isReadyRef.current) {
        vimeoPlayerRef.current.pause()
          .then(() => setIsPlaying(false))
          .catch(() => {});
      }
    }
  }, [source.type]);

  // Register with coordinator for single-video management
  useEffect(() => {
    videoPlaybackCoordinator.register(id, {
      play: handlePlayCommand,
      pause: handlePauseCommand
    });

    return () => {
      videoPlaybackCoordinator.unregister(id);
    };
  }, [id, handlePlayCommand, handlePauseCommand]);

  // Lazy loading observer: mount iframe/video when near viewport / slider
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const nearObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
          }
        });
      },
      {
        root: rootRef?.current || null,
        rootMargin: '250px 250px 250px 250px'
      }
    );

    nearObserver.observe(el);

    return () => {
      nearObserver.disconnect();
    };
  }, [rootRef]);

  // 60% Viewport / Slider Visibility Observer (threshold: 0.6)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
          videoPlaybackCoordinator.updateVisibility(id, ratio);
        });
      },
      {
        root: rootRef?.current || null,
        threshold: [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1.0]
      }
    );

    visibilityObserver.observe(el);

    return () => {
      visibilityObserver.disconnect();
    };
  }, [id, rootRef]);

  // Initialize YouTube Player when near viewport
  useEffect(() => {
    if (source.type !== 'youtube' || !isNearViewport || !ytMountRef.current) return;

    let destroyed = false;

    loadYouTubeIframeApi().then((YT) => {
      if (destroyed || !ytMountRef.current) return;

      ytPlayerRef.current = new YT.Player(ytMountRef.current, {
        videoId: source.id,
        playerVars: {
          autoplay: 0,
          mute: 1,
          playsinline: 1,
          controls: 0,
          loop: 1,
          playlist: source.id,
          enablejsapi: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3
        },
        events: {
          onReady: (event) => {
            if (destroyed) return;
            isReadyRef.current = true;
            setIsReady(true);
            try {
              event.target.mute();
            } catch (_) {}

            if (pendingPlayRef.current) {
              pendingPlayRef.current = false;
              handlePlayCommand();
            }
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
              setIsPlaying(false);
            }
          }
        }
      });
    }).catch((err) => {
      console.warn('Failed to initialize YouTube IFrame Player:', err);
    });

    return () => {
      destroyed = true;
      isReadyRef.current = false;
      setIsReady(false);
      if (ytPlayerRef.current && typeof ytPlayerRef.current.destroy === 'function') {
        try {
          ytPlayerRef.current.destroy();
        } catch (_) {}
        ytPlayerRef.current = null;
      }
    };
  }, [source.type, source.id, isNearViewport, handlePlayCommand]);

  // Initialize Vimeo Player when near viewport
  useEffect(() => {
    if (source.type !== 'vimeo' || !isNearViewport || !vimeoMountRef.current) return;

    let destroyed = false;
    const vimeoIdNum = parseInt(source.id, 10);

    const player = new VimeoPlayer(vimeoMountRef.current, {
      id: vimeoIdNum,
      muted: true,
      loop: true,
      playsinline: true,
      controls: false,
      autopause: true,
      responsive: true
    });

    vimeoPlayerRef.current = player;

    player.ready().then(() => {
      if (destroyed) return;
      isReadyRef.current = true;
      setIsReady(true);

      if (pendingPlayRef.current) {
        pendingPlayRef.current = false;
        handlePlayCommand();
      }
    }).catch((err) => {
      console.warn('Failed to initialize Vimeo Player:', err);
    });

    player.on('play', () => setIsPlaying(true));
    player.on('pause', () => setIsPlaying(false));
    player.on('ended', () => setIsPlaying(false));

    return () => {
      destroyed = true;
      isReadyRef.current = false;
      setIsReady(false);
      if (vimeoPlayerRef.current) {
        try {
          vimeoPlayerRef.current.destroy();
        } catch (_) {}
        vimeoPlayerRef.current = null;
      }
    };
  }, [source.type, source.id, isNearViewport, handlePlayCommand]);

  // Direct video time update
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  // Tap-to-unmute toggle
  const toggleMute = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (source.type === 'direct') {
      if (videoRef.current) {
        videoRef.current.muted = nextMuted;
      }
    } else if (source.type === 'youtube') {
      if (ytPlayerRef.current && isReadyRef.current) {
        try {
          if (nextMuted) {
            ytPlayerRef.current.mute();
          } else {
            ytPlayerRef.current.unMute();
          }
        } catch (_) {}
      }
    } else if (source.type === 'vimeo') {
      if (vimeoPlayerRef.current && isReadyRef.current) {
        vimeoPlayerRef.current.setMuted(nextMuted).catch(() => {});
      }
    }
  };

  // User manual click-to-play / click-to-pause
  const togglePlayPause = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPlaying) {
      videoPlaybackCoordinator.manualPause(id);
    } else {
      videoPlaybackCoordinator.manualPlay(id);
    }
  };

  const isVertical = aspectRatio === '9:16';

  return (
    // Static outer wrapper observed by IntersectionObserver (never transformed, always in place)
    <div
      ref={containerRef}
      className={`relative w-full min-w-0 select-none ${className}`}
    >
      {/* Inner presentation box with fixed aspect ratio */}
      <div className={`relative w-full ${isVertical ? 'aspect-[9/16]' : 'aspect-video'} bg-zinc-950 overflow-hidden rounded-2xl`}>
        {/* 1. Base Poster Thumbnail (Always visible, prevents blank space) */}
        <img
          src={thumbnailUrl || '/logo.png'}
          alt={title}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = '/logo.png'; }}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isPlaying ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* 2. Direct Video File Player */}
        {source.type === 'direct' && isNearViewport && (
          <video
            ref={videoRef}
            src={source.src}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            poster={thumbnailUrl}
            onLoadedData={() => {
              isReadyRef.current = true;
              setIsReady(true);
              if (pendingPlayRef.current) {
                pendingPlayRef.current = false;
                handlePlayCommand();
              }
            }}
            onTimeUpdate={handleTimeUpdate}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 pointer-events-none ${
              isPlaying && isReady ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* 3. YouTube Embed Player */}
        {source.type === 'youtube' && isNearViewport && (
          <div
            className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-500 pointer-events-none ${
              isPlaying && isReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div ref={ytMountRef} className="w-full h-full pointer-events-none" />
          </div>
        )}

        {/* 4. Vimeo Embed Player */}
        {source.type === 'vimeo' && isNearViewport && (
          <div
            className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-500 pointer-events-none ${
              isPlaying && isReady ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div ref={vimeoMountRef} className="w-full h-full pointer-events-none" />
          </div>
        )}

        {/* 5. Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-85 pointer-events-none" />

        {/* 6. Active Progress Bar */}
        {isPlaying && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20 overflow-hidden pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 transition-[width] duration-150 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* 7. Live Indicator & Tap-to-Unmute Button */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 pointer-events-auto">
          {isPlaying && (
            <span className="px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-mono-code font-bold uppercase tracking-wider flex items-center gap-1 shadow-md shadow-red-600/40 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Playing
            </span>
          )}

          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? 'Tap to Unmute' : 'Tap to Mute'}
            className="p-1.5 rounded-md bg-black/80 hover:bg-red-600 text-white border border-white/20 backdrop-blur-md transition-all shadow-md active:scale-95"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-zinc-300" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-red-400 hover:text-white animate-pulse" />
            )}
          </button>
        </div>

        {/* 8. Center Manual Play / Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <button
            type="button"
            onClick={togglePlayPause}
            title={isPlaying ? 'Click to Pause' : 'Click to Play'}
            className={`pointer-events-auto w-14 h-14 rounded-full bg-red-gradient text-white flex items-center justify-center shadow-2xl shadow-red-600/60 transition-all duration-300 transform active:scale-95 hover:scale-110 ${
              isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-85 hover:opacity-100'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
