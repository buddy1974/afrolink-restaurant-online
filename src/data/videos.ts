/**
 * VIDEOS — click-to-play only. Nothing from YouTube/Facebook loads until a
 * visitor presses play (privacy + performance). Only one video plays at a time.
 *
 * Verified 2026-10-08:
 * - YouTube: oEmbed returned 200 (public + embedding allowed); title/author from oEmbed.
 * - Facebook: video pages and the official video plugin returned the video; titles are
 *   Afrolink's own post captions (shortened, emoji removed).
 * Each id appears once (duplicates removed).
 */

export type VideoPlatform = 'youtube' | 'facebook';

export interface VideoEntry {
  id: string;
  platform: VideoPlatform;
  title: string;
  /** Who made the video — shown for attribution. */
  author: string;
  /** Public page of the video (fallback link, no JS). */
  url: string;
  /** 'landscape' = 16:9, 'portrait' = 9:16 (Shorts / phone video). */
  format: 'landscape' | 'portrait';
}

export const featuredVideo: VideoEntry = {
  id: '51D8Zxd5_84',
  platform: 'youtube',
  title: 'Trying Authentic Nigerian Food in Germany',
  author: 'David On The Go',
  url: 'https://www.youtube.com/watch?v=51D8Zxd5_84',
  format: 'landscape',
};

export const videos: VideoEntry[] = [
  {
    id: 'FYzFX_LzRLU',
    platform: 'youtube',
    title: 'At Afrolink, 19 April 2025 — clip 1',
    author: 'Afrolink Restaurant & Bar',
    url: 'https://www.youtube.com/shorts/FYzFX_LzRLU',
    format: 'portrait',
  },
  {
    id: 'TZjJoRjCMXg',
    platform: 'youtube',
    title: 'At Afrolink, 19 April 2025 — clip 2',
    author: 'Afrolink Restaurant & Bar',
    url: 'https://www.youtube.com/shorts/TZjJoRjCMXg',
    format: 'portrait',
  },
  {
    id: '24293417526931827',
    platform: 'facebook',
    title: 'Soft yam, rich egusi, and that deep Naija flavour',
    author: 'Afrolink',
    url: 'https://www.facebook.com/afrolink24/videos/24293417526931827/',
    format: 'portrait',
  },
  {
    id: '2417411605311803',
    platform: 'facebook',
    title: 'Golden plantains, sizzling beef and veggies',
    author: 'Afrolink',
    url: 'https://www.facebook.com/afrolink24/videos/2417411605311803/',
    format: 'portrait',
  },
  {
    id: '1006924598092438',
    platform: 'facebook',
    title: 'Crispy yam meets stockfish',
    author: 'Afrolink',
    url: 'https://www.facebook.com/afrolink24/videos/1006924598092438/',
    format: 'portrait',
  },
  {
    id: '1201502541298754',
    platform: 'facebook',
    title: 'When okra meets egusi and garri',
    author: 'Afrolink',
    url: 'https://www.facebook.com/afrolink24/videos/1201502541298754/',
    format: 'portrait',
  },
];

/** Embed URL, loaded only after the visitor clicks play. */
export function embedSrc(v: VideoEntry): string {
  if (v.platform === 'youtube') {
    return `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(v.url)}&show_text=false&autoplay=true&mute=false`;
}
