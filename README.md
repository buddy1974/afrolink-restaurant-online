# Afrolink Restaurant & Bar — Digital Menu

Trilingual (DE / EN / FR) digital menu website for **Afrolink Restaurant & Bar**, West African restaurant, Berzeliusstraße 7, 45144 Essen.
Destination of the QR codes on Afrolink's printed menu cards.

**Canonical URL:** https://www.afrolink-restaurant.online · **Status:** in production since 2026-10-08 (main); upgrades are reviewed on Vercel preview deployments first.

## Stack

Astro 7 (static output) · self-hosted variable fonts · `astro:assets` image pipeline (AVIF/WebP) · no client framework · no third-party scripts.

## Commands

```bash
npm install
npm run dev            # http://localhost:4321
npm run verify         # lint + typecheck + build + content tests
npm run preview        # serve the production build
npm run prepare-image -- "<photo>" <kebab-name>.jpg   # add a gallery photo (strips EXIF/GPS)
```

## Editing content

All content is data — no need to touch components:

| What | File |
|------|------|
| Food menu, prices, descriptions (DE/EN/FR) | `src/data/menu.ts` |
| Drinks, sizes & prices | `src/data/drinks.ts` |
| Address, phones, WhatsApp, social, services | `src/data/business.ts` |
| Opening hours | `src/data/hours.ts` |
| Gallery photos | `src/data/gallery.ts` + `src/assets/gallery/` |
| SEO, schema.org | `src/data/seo.ts` |
| Interface text DE/EN/FR | `src/i18n/ui.ts` (legal pages: `src/i18n/legal-content.ts`) |
| Allergens & additives (kitchen-verified only) | `src/data/allergens.ts` -> `npm run allergen-matrix` |
| Marketing claims (gated by status) | `src/data/claims.ts` |
| Google rating snapshot, reviews | `src/data/business.ts` (`google`), `src/data/reviews.ts` |
| Impressum / privacy operator data | `src/data/legal.ts` |
| Videos | `src/data/videos.ts` |

Prices are stored in euro cents. After any price change, update `tests/content.test.ts` and run `npm run verify`.

## Documentation

See `docs/` — repository map, architecture, decision log, known risks (incl. **R-001: Impressum/Datenschutz required before production**), release checklist.

The previous Afropages placeholder is preserved in `legacy/afropages-mvp/`.

## Technical Operations Standard

This project follows the global deployment standard located at `../TECH-OPS-STANDARD.md`
(Git → GitHub → Cloudflare/Vercel deployment flow, build and deployment requirements, security patterns).
All infrastructure changes must follow that document.
