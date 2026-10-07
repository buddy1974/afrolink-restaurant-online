# Decision Log — `afrolink-restaurant-online`

| Field | Value |
|-------|-------|
| Document tier | 2 — decision record |
| Owner (DRI) | Marcel — Maxpromo Digital |
| Last reviewed | 2026-10-07 |

## ADR Index

| ADR | Date | Title | Status |
|-----|------|-------|--------|
| ADR-001 | 2026-10-07 | Astro static site in this repository; Afropages placeholder preserved under `legacy/`; repo renamed | Accepted (Marcel, 2026-10-07) |
| ADR-002 | 2026-10-07 | Self-hosted fonts, no third-party requests | Accepted |
| ADR-003 | 2026-10-07 | Gallery uses genuine client photos (EXIF stripped, no people) | Proposed — pending Marcel |
| ADR-004 | 2026-10-07 | Spirits 0,2 L kept as supplied, flagged `verified: false` | Accepted (per brief) |
| ADR-005 | 2026-10-07 | Isiewu / Tilapia shown as one dish with size rows | Proposed — pending Marcel |
| ADR-006 | 2026-10-07 | Site language English only (matches brief) | Proposed — pending Marcel |

## ADR Records

### ADR-001 — Framework & repository
**Context:** The repo `afropages.online` (GitHub `buddy1974/afropages-online`) held a plain-HTML "Afropages directory" placeholder. Marcel instructed building the Afrolink menu site here.
**Decision:** Astro 7 static build (zero JS by default, built-in image optimisation, Vercel-native). The old `index.html`/`style.css` were moved with `git mv` to `legacy/afropages-mvp/`.
**Resolved 2026-10-07:** on Marcel's instruction the GitHub repo was renamed `afropages-online` → `afrolink-restaurant-online` (no webhooks, deployments or Vercel project were linked to the old name; GitHub redirects the old URL).

### ADR-002 — Fonts
Loading Google Fonts remotely is a GDPR risk in Germany; fonts are bundled from `@fontsource-variable`.

### ADR-003 — Gallery photos
Source: client folder `KUNDEN-OBERDORF/afrolink-restaurant/`. 18 food photos and 2 interior shots selected. Excluded: photos showing guests or staff, CCTV footage, the composite storefront graphic, screenshots, AI-generated images. All metadata stripped. Dish captions only where the client's own file name identifies the dish.

### ADR-004 — Spirit serving size
The brief says keep the source value 0,2 L and do not silently correct it. Stored once as `SPIRIT_GLASS` with `verified: false`.

### ADR-005 — Size variants
"Isiewu, Small Plate €18 / Big Plate €35" and "Tilapia, Medium €25 / Large €30" are shown as one dish name with indented size rows. Names, sizes and prices are unchanged.

### ADR-006 — Language
The brief copy is English; `lang="en"`. A German version is a likely follow-up for local SEO.

### Tooling note
`eslint-plugin-jsx-a11y` does not support ESLint 10; the maintained fork `eslint-plugin-jsx-a11y-x` (officially supported by `eslint-plugin-astro`) is used. `role="list"` on styled lists is allowed on purpose (Safari/VoiceOver drops list semantics otherwise).
