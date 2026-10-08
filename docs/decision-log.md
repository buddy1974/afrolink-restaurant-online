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
| ADR-007 | 2026-10-08 | Gallery/menu imagery from client's enhanced watermarked photos; ChatGPT re-renders not used | Proposed — pending Marcel |
| ADR-008 | 2026-10-08 | Click-to-play video facades (YouTube nocookie / Facebook plugin), one video at a time | Accepted |
| ADR-009 | 2026-10-08 | Brief 2026-10-08 data applied: Monday 16:00, new TikTok handle, Instagram, YouTube, Google reviews | Accepted (per brief) |

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

### ADR-007 — Imagery (redesign 2026-10-08)
Source of truth: client folder `social-images/AI-Optimized/enhanced_*` and `final_set_watermarked_*` — upscaled/colour-corrected versions of the real WhatsApp photos with the Afrolink watermark. Used as-is (resize + metadata strip only); crops are anchored so the bottom-right watermark stays visible; portrait photos in the menu are shown whole on a paper mat. The 34 files Marcel placed in `public/` were reviewed: the `ChatGPT Image …` files are AI re-renders of real photos (pixels regenerated) and one carries burned-in old menu text; they conflict with "no fake food photography", so they are **not used and not committed** pending Marcel's decision. `mounted.png` (collage), UUID screenshots and photos showing people were also excluded. The enhanced file mapped to "jollof" turned out to be a different rice photo — kept uncaptioned as `rice-meat.jpg`; the genuine JOLLOF-RICE photo stays.

### ADR-008 — Video embeds
All videos render as local posters (or typographic cards) and load the platform iframe only on click: YouTube via `youtube-nocookie.com`, Facebook via the official video plugin. Starting a video removes any other playing iframe. Without JS the card links to the video page. Availability verified 2026-10-08 (YouTube oEmbed 200 for all three; Facebook videos public and returned by the plugin; all four Facebook videos are 9:16). Posters use a real Afrolink dish photo only when the video's own caption names that dish.

### ADR-009 — 2026-10-08 brief data
Monday changed 15:00 → 16:00 (display grouping Tue–Thu / Fri–Sat / Sun–Mon). TikTok changed `@afrolink.de` → `@afrolink_restaurant` (both exist; the old one is a much larger account named "Afrolink" — confirm which is Afrolink's). Added Instagram, YouTube channel, Google reviews link (no ratings reproduced). WhatsApp kept on the landline as verified in the 2026-10-07 brief, despite the 2026-10-08 caution — see R-010.

### Tooling note
`eslint-plugin-jsx-a11y` does not support ESLint 10; the maintained fork `eslint-plugin-jsx-a11y-x` (officially supported by `eslint-plugin-astro`) is used. `role="list"` on styled lists is allowed on purpose (Safari/VoiceOver drops list semantics otherwise).
