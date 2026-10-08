# Architecture — `afrolink-restaurant-online`

| Field | Value |
|-------|-------|
| Owner (DRI) | Marcel — Maxpromo Digital |
| Lifecycle stage | MVP (local, not deployed) |
| Last reviewed | 2026-10-07 |

## Stack
- **Astro 7** static site generation; no client framework. Four small bundled scripts: mobile nav, menu scroll-spy, gallery lightbox, "today" highlight in opening hours.
- **Images:** `astro:assets` `<Picture>` → AVIF + WebP + JPEG fallback with responsive `srcset`; lazy-loaded below the fold; hero is eager with `fetchpriority="high"`.
- **Fonts:** self-hosted via `@fontsource-variable` (Archivo, Newsreader). No Google Fonts requests (GDPR).
- **No** third-party scripts, cookies, analytics or embedded maps (Google Maps is an outbound link).
- **Hosting target:** Vercel (static). `vercel.json`: apex → www 301, immutable caching for `/_astro/*`, security headers.

## Multilingual
German at `/` (x-default), English `/en/`, French `/fr/`, plus localized legal pages (`/impressum/`, `/datenschutz/`, `/allergene/` and EN/FR equivalents). Interface strings in `src/i18n/ui.ts` (type- and test-enforced key parity); localized data fields use `L10n` objects. A head script on `/` only redirects first-time visitors whose browser prefers EN/FR; bots and explicit choices are respected.

## Content architecture
All content lives in `src/data/*.ts` as typed data:
- prices in **euro cents**, formatted by `format.ts` (food `€15`, drinks `€3.50`)
- `available: false` hides an item without deleting it
- size variants (Isiewu, Tilapia) as `variants[]`
- drink serving sizes carry `verified: boolean` — spirits are `0,2 L` as supplied, `verified: false`
- empty categories (Hot Drinks) are not rendered
- schema.org `Restaurant` + full `Menu` JSON-LD is generated from the same data (`seo.ts`), so markup and page cannot diverge; `priceRange` is computed from the menu.

## Gallery
`src/data/gallery.ts` lists filenames; `Gallery.astro` resolves them via `import.meta.glob` and **fails the build** if a listed file is missing. Native `<dialog>` lightbox (keyboard arrows, swipe, Esc, focus return) — no library.

## Responsive breakpoints
Header full nav ≥ 75em (1200px), hamburger below. Hero two-column ≥ 56em. Food menu: 1 column → 2 (≥ 48em) → 3 (≥ 75em). Gallery: 2 → 3 → 4 columns.
