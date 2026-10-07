// @ts-check
import { defineConfig } from 'astro/config';

// Canonical production origin — the destination of the printed QR codes.
// Keep in sync with src/data/business.ts (siteUrl).
export default defineConfig({
  site: 'https://www.afrolink-restaurant.online',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
  image: {
    // Responsive srcset widths used by <Picture>/<Image>.
    breakpoints: [360, 480, 640, 800, 1080, 1400, 1800],
  },
});
