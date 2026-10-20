/**
 * Utility to parse and classify video URLs (Direct MP4/WebM, YouTube, Vimeo).
 */

const CATEGORY_FALLBACKS = {
  'weddings': '/videos/weddings.mp4',
  'car-bike-delivery': '/videos/car-bike-delivery.mp4',
  'brand-shoots': '/videos/brand-shoots.mp4',
  'events': '/videos/events.mp4',
  'birthdays': '/videos/birthdays.mp4',
  'interior-shoots': '/videos/interior-shoots.mp4',
  'restaurants': '/videos/restaurants.mp4',
  'saloons': '/videos/saloons.mp4',
  'clothing': '/videos/clothing.mp4'
};

export const getCategoryFallbackUrl = (categorySlug = '', title = '') => {
  if (categorySlug && CATEGORY_FALLBACKS[categorySlug]) {
    return CATEGORY_FALLBACKS[categorySlug];
  }
  const titleLower = (title || '').toLowerCase();
  for (const [slug, path] of Object.entries(CATEGORY_FALLBACKS)) {
    if (titleLower.includes(slug.replace(/-/g, ' ')) || titleLower.includes(slug)) {
      return path;
    }
  }
  return '/videos/weddings.mp4';
};

export const parseVideoSource = (url, categorySlug = '', title = '') => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return {
      type: 'direct',
      src: getCategoryFallbackUrl(categorySlug, title),
      id: null
    };
  }

  const clean = url.trim();

  // YouTube match: regular watch, share (youtu.be), embed, shorts
  const ytMatch = clean.match(
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      id: ytMatch[1],
      src: clean
    };
  }

  // Vimeo match: vimeo.com/123456789 or player.vimeo.com/video/123456789
  const vimeoMatch = clean.match(
    /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)|player\.vimeo\.com\/video\/(\d+))/
  );
  const vimeoId = vimeoMatch ? (vimeoMatch[1] || vimeoMatch[2]) : null;
  if (vimeoId) {
    return {
      type: 'vimeo',
      id: vimeoId,
      src: clean
    };
  }

  // Direct MP4 / WebM / local asset / ActiveStorage file
  if (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.ogg') ||
    clean.startsWith('/videos/') ||
    clean.includes('/rails/active_storage/') ||
    clean.startsWith('blob:')
  ) {
    return {
      type: 'direct',
      src: clean,
      id: null
    };
  }

  // If external non-embed or unrecognized, fall back to matching category MP4
  return {
    type: 'direct',
    src: getCategoryFallbackUrl(categorySlug, title),
    id: null
  };
};
