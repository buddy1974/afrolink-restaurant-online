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
| ADR-010 | 2026-10-08 | Trilingual site: DE at `/` (x-default), EN `/en/`, FR `/fr/`; first-visit browser-language redirect from `/` only | Proposed — pending Marcel |
| ADR-011 | 2026-10-08 | Allergen/additive data model: nothing declared without kitchen sign-off; website becomes the electronic record once verified | Proposed — pending Marcel |
| ADR-012 | 2026-10-08 | Enquiry builder composes WhatsApp text client-side; no form backend, no stored data, no ordering/payment | Proposed — pending Marcel |
| ADR-013 | 2026-10-08 | Claims register gates marketing claims by verification status | Accepted |
| ADR-014 | 2026-10-08 | Hero image: genuine watermarked Egusi + pounded yam (883x540); Nkwobi moved to Specialities/gallery | Superseded by ADR-015 |
| ADR-015 | 2026-10-09 | Approved dark-and-gold design; owner-supplied dish images per menu item; "Image coming soon" placeholders | Accepted (owner brief 2026-10-09) |
| ADR-016 | 2026-10-09 | Retire old grilled-fish / porridge-yam photos; second owner image batch (12 dishes); water notice; SEO package | Accepted (owner brief 2026-10-09) |
| ADR-017 | 2026-10-09 | Search-discovery architecture: dedicated menu, soups, 31 dish, delivery, catering, reservations, gallery and contact pages (DE/EN/FR); no city/doorway pages; no fufu page | Implemented on preview — awaiting Marcel's production approval |
| ADR-018 | 2026-10-09 | Allergen baseline = Afrolink's previous-menu declarations (first-party), shown with source status; absence of codes ≠ allergen-free | Implemented (owner correction 2026-10-09) |
| ADR-023 | 2026-10-10 | IndexNow via GitHub Actions on Vercel deployment events; state = content fingerprints in git tag `indexnow-state`; gated by `INDEXNOW_ENABLED`; hourly read-only production monitor | Implemented on preview — activation pending Marcel |
| ADR-022 | 2026-10-10 | Public brand voice: Afrolink presents its allergen/additive declarations as its own menu information (no provenance, verification or audit wording); provenance, original codes and reconciliation notes stay internal | Implemented (owner instruction 2026-10-10) — supersedes the public labelling part of ADR-018 |
| ADR-021 | 2026-10-10 | Consent architecture: no device access without need; server-side language redirect; language memory, external videos and rating memory opt-in; no arrival banner; settings dialog + cookie policy | Implemented on preview |
| ADR-020 | 2026-10-10 | Legal release gate: privacy policy generated from verified behaviour (config-dependent sections), Impressum with supervisory authority + § 36 VSBG, no ODR link, three-state operator data | Implemented — owner data outstanding |
| ADR-019 | 2026-10-09 | Dish ratings: Vercel Functions + Neon Postgres, anonymous cookie + HMAC keys, Bayesian ranking, audited moderation, feature flag OFF until approval | Implemented and tested locally — production activation requires approval |

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

### ADR-010 — Multilingual architecture
Distinct URLs per language (SEO, shareable, no reliance on browser translation). `/` stays German because the printed QR codes point there and German is the sensible fallback in Germany. A head script redirects first-time visitors whose browser prefers English or French (before German) to `/en/` or `/fr/`; it never runs for bots, never on `/en/` or `/fr/`, and always respects a language the visitor chose (`localStorage` key `afl-lang`). hreflang (de-DE, en, fr, x-default) on every page and in the sitemap. Dish names are never translated; descriptions are.

### ADR-011 — Allergens & additives
Research (LMIV Art. 9/44/Annex II, LMIDV § 4, LMZDV § 5, FrSaftErfrischGetrV § 6, LAVES guidance, Verbraucherzentrale NRW) in `docs/compliance/legal-requirements-matrix.md`. Each dish/drink has a record (`pending` until the kitchen signs off with name + date). "Possible" allergens are internal, sourced only from Afrolink's own menu text, the dish name or product type. The public page shows "being verified – ask staff" and does not claim a written record exists. `npm run allergen-matrix` exports the kitchen worksheet.

### ADR-012 — Enquiries
Delivery, catering, reservations, dietary questions and group orders are enquiries. The builder composes a message in the browser (WhatsApp deep link, copy, or call). Nothing is stored or transmitted by the site. No checkout/payment until an ordering and fulfilment model is approved.

### ADR-013 — Claims register
`src/data/claims.ts` holds every marketing claim with status (verified / owner-provided / customer-opinion / awaiting) and evidence. Only enabled verified or owner-provided claims (or attributed opinions) render; tests enforce it. "500+ regulars", "20+ years" and "No. 1 in Essen" are disabled pending evidence.

### ADR-015 — Approved design implementation (2026-10-09)
- Design tokens switched to a dark-and-gold system (`src/styles/global.css`): the former light "paper" surface is now a raised dark surface, gold is a flat accent (no gradients/glows). Buttons unified (gold solid, outlined secondary).
- Hero uses `egusi-soup.png` (owner instruction), full-bleed on desktop with a dark readability scrim, image-first on mobile; watermark kept in frame.
- Restaurant highlights band replaces the scrolling ticker (static, no motion, same claims register gating; avoids duplicating the same messages twice).
- Soups showcase gives `vegetable-soup.png` prominence with the owner statement "soups are served with pounded yam or garri".
- Image-rich menu: dish cards with images mapped in `src/data/dish-images.ts`; only images named for a dish are used; all other dishes show a branded "Image coming soon" placeholder. A visible note states images are serving suggestions.
- Diabetes-related dietary adaptation offered as a kitchen enquiry only, explicitly without medical or nutritional promises.
- The approved mockup file was not available in the repository or on the machine; implementation follows the written brief. Speculative allergen icons from the mockup are not implemented (ADR-011 safeguards).
- Owner image originals moved (not deleted) from `public/` to git-ignored `owner-assets/menu-originals/`; optimized copies in `src/assets/menu/`.

### ADR-016 — Image cleanup, extras, water notice, SEO (2026-10-09)
- `grilled-fish-plantain.jpg` and `porridge-yam.jpg` were removed from all data files. Their sources moved to `owner-assets/retired/` (not deleted). The unused legacy category `image` field was removed. A test guards against reuse.
- 12 owner-named images were inspected and mapped one-to-one to their dishes. All 31 food items now have an image. Owner presentation images stay out of the gallery, which remains genuine photography only (no duplicates). See `docs/image-inventory.md`.
- `extra-garri/rice/yams` images were not used: those extras are not on the verified menu. Extras: only Extra Pounded Yam at €4. A test enforces €4 for every extra.
- Water notice (DE/EN/FR) in the drinks section: charged separately, not complimentary. There is no automatic charge and no obligation wording. Water stays €1.00 / 0,33 L.
- Prices keep the printed-menu format ("€15", "€3.50") identically in all three languages, as before.
- SEO: localised titles/descriptions with local intent, a short dish guide, `WebSite` JSON-LD, `menu`/`hasMap`/`mainEntityOfPage`, `sameAs` limited to verified profiles, `og:type` fixed, branded OG image. `priceRange` stays: it is computed from real prices, not invented. See `docs/seo.md`.
- "Nigerian" is used to describe dish origin (Egusi, Ofe Nsala, Nkwobi), not as a certification. The owner is asked to confirm it.

### ADR-017 — Search-discovery architecture (2026-10-09)
- New routes via one catch-all page (`src/pages/[...slug].astro`) generated from `src/i18n/config.ts` routes and `src/data/menu.ts`; 126 pages total, all in the sitemap with hreflang.
- Header navigation now points to the dedicated pages on every page (clearer hierarchy for guests and Google's sitelink signals); the home page keeps its full content including the menu.
- Dish copy separates cultural background (`src/data/dish-content.ts`, researched, cited in docs/research) from Afrolink facts (generated from menu data). No recipe claims.
- Rejected: city landing pages (doorway risk, one location); a fufu page (not served).

### ADR-018 — Allergen baseline from Afrolink's previous menu (2026-10-09)
- Source: `AfroLink Restaurant Menu.docx` (client folder). 29 historical descriptions, 14 coded dishes, 7 codes, preserved verbatim in `src/data/allergens.ts` and `docs/compliance/historical-allergen-register.md`.
- Website: "declared on Afrolink's previous menu" + reconciliation note (12 dishes); "no written information yet, ask staff" (19 dishes); "confirmed for the current recipe" only after kitchen sign-off.
- Not transferred: Ofe Akwu → Banga, Porridge Cocoyam → Porridge Yam (different dish names; kitchen to confirm).
- The "Forensic Menu & Allergen Audit" document referenced in the brief was not found on disk; the register was rebuilt from the original menu and matches the owner's correction list exactly.

### ADR-019 — Dish ratings (2026-10-09)
- Static site + `@astrojs/vercel` adapter; only `/api/*` and `/admin/*` are on-demand.
- Neon Postgres (Vercel Marketplace, EU region), parameterised SQL, append-only audit table, write-once launch date, env column + preview branches.
- No rating schema markup (not eligible). See docs/ratings.md.
- `RATINGS_ENABLED` is unset in production: nothing is collected until Marcel approves.

### Tooling note
`eslint-plugin-jsx-a11y` does not support ESLint 10; the maintained fork `eslint-plugin-jsx-a11y-x` (officially supported by `eslint-plugin-astro`) is used. `role="list"` on styled lists is allowed on purpose (Safari/VoiceOver drops list semantics otherwise).

### ADR-023 — IndexNow and production monitoring (2026-10-10)
**Context:**
- Bing and other engines accept IndexNow change notifications.
- The brief requires sending only real changes, never preview or private URLs, and no new services.
- Incident R-032 showed that a DNS regression can go unnoticed.

**Decision:**
- **Trigger:** a GitHub Actions workflow on `deployment_status` (Vercel already reports Production deployments to GitHub) plus a daily reconciliation run.
- **Change detection:** a fingerprint of what search engines read on each live sitemap URL, compared with the last state IndexNow *accepted*.
- **State:** JSON in an annotated git tag. No database, branch or Vercel build is involved.
- **Gate:** submission only with `INDEXNOW_ENABLED=true`.
- **Monitoring:** a separate hourly read-only monitor checks DNS (including the authoritative nameservers), TLS and HTTP.

**Rejected:**
- **Vercel deploy hook:** no post-deploy hook exists for static output, and it would need a function plus a secret.
- **Sitemap diff only:** it misses content changes at unchanged URLs.
- **Building the previous commit in CI:** two builds per deploy, and the baseline is wrong after a failed submission.
- **Artifact or cache storage:** expires.
- **State branch:** Vercel would build it.

**Evidence:**
- The fingerprint is equal between Vercel production and a local build for 141/141 pages.
- 27 IndexNow tests and 8 monitor tests pass with mocked network.
- Mutation checks (gate, retry bound, `dpl` normalisation) are each caught by a test.
