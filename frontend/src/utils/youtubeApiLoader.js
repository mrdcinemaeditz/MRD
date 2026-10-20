/**
 * Singleton loader for YouTube IFrame Player API.
 * Ensures https://www.youtube.com/iframe_api is only injected once.
 */
let ytPromise = null;

export const loadYouTubeIframeApi = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not available'));
  }

  // Already loaded and available globally
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }

  // In-flight promise
  if (ytPromise) {
    return ytPromise;
  }

  ytPromise = new Promise((resolve, reject) => {
    // Chain with existing handler if already assigned
    const existingOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof existingOnReady === 'function') {
        try {
          existingOnReady();
        } catch (e) {
          console.warn('Previous onYouTubeIframeAPIReady threw error:', e);
        }
      }
      resolve(window.YT);
    };

    const existingTag = document.getElementById('mrd-youtube-iframe-api');
    if (!existingTag) {
      const tag = document.createElement('script');
      tag.id = 'mrd-youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.onerror = (err) => {
        ytPromise = null;
        reject(err);
      };
      document.head.appendChild(tag);
    }
  });

  return ytPromise;
};
