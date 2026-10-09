// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Canonical production origin — the destination of the printed QR codes.
// Keep in sync with src/data/business.ts (siteUrl).
// Every page is prerendered (static). Only the rating API and the management area
// (`export const prerender = false`) run as Vercel Functions.
export default defineConfig({
  site: 'https://www.afrolink-restaurant.online',
  adapter: vercel(),
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  image: {
    // Responsive srcset widths used by <Picture>/<Image>.
    breakpoints: [360, 480, 640, 800, 1080, 1400, 1800],
  },
});
