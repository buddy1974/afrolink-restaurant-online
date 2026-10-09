// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

/**
 * Workaround for @astrojs/vercel 11.0.13 + Astro 7: the function entry imports the adapter's
 * index.js, which leaves a side-effect-only `import "rolldown"` (the bundler) in the server
 * bundle; rolldown's native binding is not available inside the Vercel Function, so every
 * on-demand request crashed. Nothing from rolldown is used at runtime, so the server build
 * gets an empty module instead. Remove once the adapter no longer pulls it in.
 * @type {import('vite').Plugin}
 */
const stubBundlerInServer = {
  name: 'afrolink:stub-rolldown-in-server-bundle',
  enforce: 'pre',
  applyToEnvironment: (env) => env.name === 'ssr',
  resolveId: (id) => (id === 'rolldown' ? '\0afrolink-empty-rolldown' : null),
  load: (id) =>
    id === '\0afrolink-empty-rolldown'
      ? "export const rolldown = () => { throw new Error('rolldown is build-time only'); };"
      : null,
};

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
  vite: { plugins: [stubBundlerInServer] },
});
