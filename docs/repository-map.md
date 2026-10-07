# Repository Map — `afrolink-restaurant-online` (repo dir: afropages.online)

| Field | Value |
|-------|-------|
| Document tier | 1 — repository charter |
| Repository name | afrolink-restaurant-online (GitHub: buddy1974/afrolink-restaurant-online, renamed from afropages-online 2026-10-07; local dir still `afropages.online`) |
| Owner (DRI) | Marcel — Maxpromo Digital |
| Repository class | Client (Afrolink Restaurant & Bar, Essen) |
| Lifecycle stage | MVP — built locally, awaiting visual approval; not deployed |
| Security tier | S0 — static public site, no user data, no forms, no backend |
| Review cadence | On every menu/price change |
| Last reviewed | 2026-10-07 |
| Status | Complete |

## 1. Folder Structure

| Folder | Contains | Notes |
|--------|----------|-------|
| `src/data/` | **All content**: `menu.ts`, `drinks.ts`, `business.ts`, `hours.ts`, `gallery.ts`, `seo.ts`, `format.ts` | Edit content here only — never in components |
| `src/components/` | One component per section (Header, Hero, MenuNav, FoodMenu, Drinks, Gallery, About, HoursContact, Footer) + `Icon`, `Rule` | `Rule.astro` = the single graphic device |
| `src/layouts/Base.astro` | `<head>`: SEO, Open Graph, Twitter, favicons, schema.org JSON-LD | |
| `src/pages/` | `index.astro`, `robots.txt.ts`, `sitemap.xml.ts` | One page |
| `src/assets/gallery/` | Genuine Afrolink food photos (EXIF/GPS stripped) | Add via `npm run prepare-image` |
| `src/assets/venue/` | Interior photos (dining room, welcome sign) | |
| `src/assets/brand/` | Afrolink logo 2025 (PNG, from client folder) | |
| `src/styles/global.css` | Design tokens, type scale, buttons | |
| `public/` | Favicon set, OG image, web manifest | Generated from genuine logo/photo |
| `scripts/prepare-image.mjs` | Strips metadata, resizes new photos | |
| `tests/content.test.ts` | Locks menu/prices/hours/contact to the brief | |
| `legacy/afropages-mvp/` | Former Afropages placeholder (index.html/style.css) | Preserved, not built |

## 2. Critical Logic

| Area | Location | Why critical |
|------|----------|--------------|
| Prices & dishes | `src/data/menu.ts`, `src/data/drinks.ts` | Customer-facing prices |
| Contact & WhatsApp | `src/data/business.ts` | QR-code users call/message from here |
| Canonical domain | `astro.config.mjs` (`site`), `src/data/business.ts` (`siteUrl`) | QR codes point to www.afrolink-restaurant.online |
| Content tests | `tests/content.test.ts` | Must be updated together with any price change |

## 3. Commands

`npm run dev` · `npm run build` · `npm run preview` · `npm run lint` · `npm run typecheck` · `npm test` · `npm run verify` (lint + typecheck + build + tests) · `npm run prepare-image -- "<source>" <name>.jpg`
