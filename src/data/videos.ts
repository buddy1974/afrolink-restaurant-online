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

import type { L10n } from '../i18n/config';

export type VideoPlatform = 'youtube' | 'facebook';

export interface VideoEntry {
  id: string;
  platform: VideoPlatform;
  /** Original title (creator's own wording) — shown as a title, not translated. */
  title: string;
  /** Localized title where the title is ours (Afrolink captions / clip labels). */
  titleL10n?: L10n;
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
    titleL10n: { de: 'Bei Afrolink, 19. April 2025 – Clip 1', en: 'At Afrolink, 19 April 2025 – clip 1', fr: 'Chez Afrolink, 19 avril 2025 – extrait 1' },
    author: 'Afrolink Restaurant & Bar',
    url: 'https://www.youtube.com/shorts/FYzFX_LzRLU',
    format: 'portrait',
  },
  {
    id: 'TZjJoRjCMXg',
    platform: 'youtube',
    title: 'At Afrolink, 19 April 2025 — clip 2',
    titleL10n: { de: 'Bei Afrolink, 19. April 2025 – Clip 2', en: 'At Afrolink, 19 April 2025 – clip 2', fr: 'Chez Afrolink, 19 avril 2025 – extrait 2' },
    author: 'Afrolink Restaurant & Bar',
    url: 'https://www.youtube.com/shorts/TZjJoRjCMXg',
    format: 'portrait',
  },
  {
    id: '24293417526931827',
    platform: 'facebook',
    title: 'Soft yam, rich egusi, and that deep Naija flavour',
    titleL10n: { de: 'Weicher Yam, kräftige Egusi und echter Naija-Geschmack', en: 'Soft yam, rich egusi and that deep Naija flavour', fr: 'Igname fondante, egusi généreuse et vraie saveur naija' },
    author: 'Afrolink',
    url: 'https://www.facebook.com/afrolink24/videos/24293417526931827/',
    format: 'portrait',
  },
  {
    id: '2417411605311803',
    platform: 'facebook',
    title: 'Golden plantains, sizzling beef and veggies',
    titleL10n: { de: 'Goldene Kochbananen, brutzelndes Rindfleisch und Gemüse', en: 'Golden plantains, sizzling beef and veggies', fr: 'Bananes plantain dorées, bœuf grésillant et légumes' },
    author: 'Afrolink',
    url: 'https://www.facebook.com/afrolink24/videos/2417411605311803/',
    format: 'portrait',
  },
  {
    id: '1006924598092438',
    platform: 'facebook',
    title: 'Crispy yam meets stockfish',
    titleL10n: { de: 'Knuspriger Yam trifft Stockfisch', en: 'Crispy yam meets stockfish', fr: 'Igname croustillante et stockfish' },
    author: 'Afrolink',
    url: 'https://www.facebook.com/afrolink24/videos/1006924598092438/',
    format: 'portrait',
  },
  {
    id: '1201502541298754',
    platform: 'facebook',
    title: 'When okra meets egusi and garri',
    titleL10n: { de: 'Wenn Okra auf Egusi und Garri trifft', en: 'When okra meets egusi and garri', fr: 'Quand le gombo rencontre l’egusi et le garri' },
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
