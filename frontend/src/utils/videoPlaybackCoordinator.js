/**
 * Global Video Playback Coordinator
 * Coordinates multiple videos across lists so only ONE video plays at a time.
 * When multiple videos meet the >= 60% viewport visibility threshold, the single
 * most visible video (highest intersection ratio) plays, and all others pause.
 */

class VideoPlaybackCoordinator {
  constructor() {
    this.players = new Map(); // id -> { id, ratio, play: fn, pause: fn, isUserPaused: boolean }
    this.activePlayerId = null;
  }

  /**
   * Register a player instance with its control callbacks
   */
  register(id, { play, pause }) {
    this.players.set(id, {
      id,
      ratio: 0,
      play,
      pause,
      isUserPaused: false
    });
  }

  /**
   * Unregister on component unmount
   */
  unregister(id) {
    if (this.activePlayerId === id) {
      const player = this.players.get(id);
      if (player) {
        try { player.pause(); } catch (_) {}
      }
      this.activePlayerId = null;
    }
    this.players.delete(id);
  }

  /**
   * Update visibility ratio from IntersectionObserver (threshold 0.6)
   */
  updateVisibility(id, ratio) {
    const player = this.players.get(id);
    if (!player) return;

    player.ratio = ratio;

    // If ratio dropped below 60% (0.6), pause if this was active
    if (ratio < 0.6) {
      if (this.activePlayerId === id) {
        player.pause();
        this.activePlayerId = null;
      }
      // Reset manual pause state once user has scrolled the video completely away
      player.isUserPaused = false;
    }

    this.recalculateActive();
  }

  /**
   * Find the single most visible candidate with ratio >= 0.6
   */
  recalculateActive() {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        // If user explicitly requests reduced motion, never autoplay on scroll
        if (this.activePlayerId) {
          const current = this.players.get(this.activePlayerId);
          if (current) current.pause();
          this.activePlayerId = null;
        }
        return;
      }
    }

    let highestRatio = 0.5999;
    let winningId = null;

    for (const [id, player] of this.players.entries()) {
      if (!player.isUserPaused && player.ratio >= 0.6) {
        if (player.ratio > highestRatio) {
          highestRatio = player.ratio;
          winningId = id;
        }
      }
    }

    if (winningId) {
      if (this.activePlayerId !== winningId) {
        // Pause current active player
        if (this.activePlayerId && this.players.has(this.activePlayerId)) {
          this.players.get(this.activePlayerId).pause();
        }
        // Play the winning player
        this.activePlayerId = winningId;
        const winner = this.players.get(winningId);
        if (winner) {
          winner.play();
        }
      }
    } else {
      // No video currently qualifies for >= 60% visibility
      if (this.activePlayerId && this.players.has(this.activePlayerId)) {
        this.players.get(this.activePlayerId).pause();
        this.activePlayerId = null;
      }
    }
  }

  /**
   * User manually clicked play on a specific video
   */
  manualPlay(id) {
    const target = this.players.get(id);
    if (!target) return;

    target.isUserPaused = false;

    // Pause any other currently active video
    if (this.activePlayerId && this.activePlayerId !== id && this.players.has(this.activePlayerId)) {
      this.players.get(this.activePlayerId).pause();
    }

    this.activePlayerId = id;
    target.play();
  }

  /**
   * User manually clicked pause on a specific video
   */
  manualPause(id) {
    const target = this.players.get(id);
    if (!target) return;

    target.isUserPaused = true;
    target.pause();

    if (this.activePlayerId === id) {
      this.activePlayerId = null;
    }
  }

  /**
   * Check if a player is currently the active one
   */
  isActive(id) {
    return this.activePlayerId === id;
  }
}

export const videoPlaybackCoordinator = new VideoPlaybackCoordinator();
