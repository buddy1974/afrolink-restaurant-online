# Change Log — `afrolink-restaurant-online`

## 2026-10-10 — SEO hardening: IndexNow (gated), production monitor, CI, audit fixes (branch `discovery-ratings-2026-10`, preview only)
- **IndexNow** (not activated):
  - key file `public/<key>.txt`;
  - content-fingerprint change detection against the last *accepted* state (git tag `indexnow-state`);
  - URL and page validation; bounded retries (429/5xx/network);
  - workflow triggered by successful Production deployments plus a daily reconciliation;
  - submission only when `INDEXNOW_ENABLED=true` (docs/indexnow.md).
- **Production monitor:** hourly read-only checks of nameservers, `www`/apex A (public DoH + authoritative), verification CNAMEs, TLS, redirects, homepage, sitemap, robots, 404, IndexNow key and the vercel.app noindex header.
- **CI:** `npm run verify` on every push.
- **Fixes:**
  - og:image / twitter:image / JSON-LD image URLs no longer carry Vercel's per-deployment `?dpl=` parameter;
  - five dish OG images now have their true 1.91:1 size declared (they were narrower than the declared 1200×630);
  - `X-Robots-Tag: noindex` on `*.vercel.app` hosts;
  - stale comment about the language redirect corrected.
- **Tests:** 79 → 123, covering IndexNow, the monitor (with an R-032 replay) and site-wide SEO integrity.
- **Unchanged:** prices, menu, photos, allergen information, business data and DNS.

## 2026-10-10 — Bing Webmaster Tools setup (no code change, no deploy)
- Site added and verified via a DNS CNAME at the apex (Vercel DNS).
- Sitemap submitted → Success, 141 URLs.
- 48 priority URLs submitted.
- Homepage live test: can be indexed, no issues. Details in docs/seo.md.
- **Incident:**
  - A second verification CNAME under `www` broke wildcard resolution of `www` for about 20–30 min (~16:08–16:30 CEST).
  - Fixed by removing that record; verified on the authoritative and public resolvers and with a live HTTP check.
  - New risk R-032.

## 2026-10-10 — Released to production (`main` fast-forwarded 42b6bd9 → c82b71a, approved by Marcel: "approve production, push")
- Contains: brand voice / allergen presentation (f390e6d), Mackerel Fish Slices (5687a84), SEO metadata fixes (c82b71a).
- Live checks on www.afrolink-restaurant.online:
  - 14 key routes return 200; sitemap has 141 URLs;
  - audit of all 141 pages is clean (titles and descriptions unique, canonicals, hreflang, OG/Twitter, JSON-LD);
  - Makrelenstücke shows "€5 pro Stück" with UnitPriceSpecification in DE/EN/FR;
  - other fish prices unchanged (€18, €25/€30);
  - no provenance wording on the site; `/api/ratings` → `{"enabled":false}`.
- The Search Console sitemap URL is unchanged; Google re-reads it automatically (141 URLs from now on).

## 2026-10-10 — Google Search Console finalization + on-page SEO (branch `discovery-ratings-2026-10`)
- Search Console (production, no deploy needed):
  - Domain property verified;
  - `https://www.afrolink-restaurant.online/sitemap.xml` submitted → Success, 138 pages discovered;
  - URL Inspection and live tests for 9 priority URLs, each with an indexing request. Only `/` was already indexed. Details in docs/seo.md.
- Production audit of all 138 URLs: canonicals, hreflang, OG/Twitter, icons, JSON-LD and prices all correct.
- On-page fixes (preview only, awaiting approval):
  - home H1 text "Afrolink Restaurant & Bar" (missing space);
  - home titles shortened and naming Nigerian cuisine (DE/EN/FR);
  - home descriptions ≤ 162 characters naming Essen-Frohnhausen;
  - contact descriptions name Essen-Frohnhausen (confirmed by OpenStreetMap);
  - EN delivery title "African & Nigerian Food Delivery in Essen".
- New docs/seo-keyword-map.md (autocomplete-based intent research and page mapping). Tests: 79.

## 2026-10-10 — New item: Mackerel Fish Slices (branch `discovery-ratings-2026-10`, owner brief 2026-10-10)
- Fish category: "Makrelenstücke / Mackerel Fish Slices / Tranches de maquereau", €5.00 **per slice** (shown as "€5 pro Stück / per slice / la tranche"); no accompaniment included. Fried yam or fried plantain on request — no accompaniment price shown (none approved).
- Owner image `fish-slice-mackerel.png` → `src/assets/menu/mackerel-fish-slices.jpg` (original kept in `owner-assets/menu-originals/`, no longer in `public/`).
- Dish pages DE/EN/FR (`/speisekarte/mackerel-fish-slices/`, `/en/menu/…`, `/fr/carte/…`), search (all three names), lightbox, hover/tap description, allergen panel "Fisch / Fish / Poisson" (owner-declared, recorded internally in `OWNER_DECLARED`).
- Data model: optional `display` (owner-supplied localized names), `displayHeading` (soft-hyphen break point), `priceUnit`, `noteIsSides` ("Beilagen / Sides / Accompagnements" label on the dish page). JSON-LD offers carry a `UnitPriceSpecification` for per-unit prices.
- Menu cards: unit shown in small type under the price; long single-word names may break instead of overflowing (also fixes a pre-existing 320 px overflow on Edikaikong, Fisherman's Soup, Stockfish). No other prices or items changed (data diff vs `main`: added 1, changed 0, removed 0).
- Sitemap 138 → 141 URLs; fish count 3. Internal allergen register and kitchen matrix regenerated (matrix now also lists the four extras). Tests: 79.

## 2026-10-10 — Brand voice & allergen presentation (branch `discovery-ratings-2026-10`)
- Removed all public provenance / audit wording ("Angabe aus der bisherigen Afrolink-Speisekarte", "Declared on Afrolink’s previous menu", reconciliation notes, "noch keine geprüfte Kennzeichnung", "In Prüfung", "laut unserer Karte", "keine Live-Anzeige", description-source line) in DE/EN/FR — menu cards, dish pages, allergen page, menu notice, dietary section, reviews.
- Allergen panel: plain "Allergene: … / Zusatzstoffe: …" using the original Afrolink wording (incl. "Sellerie (möglich)", "Geschmacksverstärker", "Farbstoffe"); no old footnote codes; dishes without declaration invite guests to ask (never "allergen-free"); help line "Fragen zu Allergenen oder Zutaten? Unser Team hilft Ihnen gerne weiter."; cross-contact note kept on dish and allergen pages.
- Markup no longer exposes internal status names. Internal register, codes and reconciliation notes unchanged (src/data/allergens.ts, docs/compliance/historical-allergen-register.md).
- Tests: 77 (site-wide banned-phrase check on all 138 pages; declarations shown per dish; internal records intact).

## 2026-10-10 — Released to production (`main` fast-forwarded to `fb64faa`, approved by Marcel: "push all changes to vercel")
- Live checks: apex/http → 308; language redirect correct in 7 header scenarios; 24 routes OK (404 for unknown); sitemap 138; `/api/ratings` → `{"enabled":false}` (ratings off); no Set-Cookie on any response; no cookies/storage/third-party requests on first visit (browser); 580 home assets OK.
- Lighthouse (real network, mobile): home 92–94, menu 94, dish page 98; desktop 100; accessibility/best practices/SEO 100; CLS 0.
- Open: owner legal data (Impressum), processor agreements, on-site allergen information, ratings activation (separate approval).

## 2026-10-10 — Cookie & consent compliance (branch `discovery-ratings-2026-10`)
- Removed client-side language detection (navigator.languages/localStorage); language redirect on "/" now server-side from Accept-Language (vercel.json), never for bots, internal navigation or with a saved choice.
- Privacy settings dialog (Allow all / Necessary only / Save selection, granular, nothing preselected) from every footer; consent record `afl-consent` (local, 12 months, no identifiers); withdrawal deletes affected storage immediately.
- Two-click consent step for YouTube/Facebook videos ("Load video" once or "Always allow external videos").
- "Remember language" (cookie `afl_lang`) only with consent.
- Ratings (still off): device memory only with an unticked opt-in box; otherwise no device storage; `DELETE /api/ratings` expires the cookie on withdrawal.
- New cookie policy page (DE/EN/FR, /cookies/), generated from `src/data/storage-inventory.ts`; privacy policy updated; operator Emeka Nwokorie shown.
- Tests: 75. Evidence: docs/compliance/cookie-consent-2026-10-10.md.

## 2026-10-10 — Legal release gate (branch `discovery-ratings-2026-10`)
- Privacy policy rewritten from verified behaviour (storage keys, hosting/DPF, click-to-load videos, contact + Art. 9 health data, ratings section only when enabled, Art. 21, LDI NRW address); processor agreements claimed only when confirmed.
- Impressum: supervisory authority (Gaststättenerlaubnis), § 36 VSBG, hidden "not applicable" items, no ODR link; operator data model with null/false/value.
- Privacy links beside the video click-to-load notices. Tests: 68.

## 2026-10-09 — Pre-production review (branch `discovery-ratings-2026-10`)
- Performance: removed `content-visibility` again (it made Chrome count the off-screen soup photo as LCP); rating client now loads on idle via dynamic import; allergen panel markup on menu cards is inserted on first open (full info stays on dish and allergen pages); hover/lightbox text taken from the info panel instead of duplicated; CSS chevrons/zoom icon; fewer srcset variants (cards 360/640, gallery 400/800/1200). Home DOM 2,522 → ~2,200 elements; LCP back to the production build's 3.3 s (same local test setup).
- Tests: 66 (feature-flag/no-DB/weak-secret behaviour, environment isolation).
- Audit: no price or category changes vs production except the 3 new extras; 135 sitemap URLs = 135 built pages, canonical = loc; 0 axe violations on all 135 pages.

## 2026-10-09 — Extras correction (branch `discovery-ratings-2026-10`)
- Extras now: Extra Pounded Yam, Extra Garri, Extra Rice, Extra Yam — each €4.00, own image, DE/EN/FR description, dish page, lightbox, allergen panel, rating slot.
- Category counts are computed from the data (test checks every category in all languages).
- No other prices or categories changed. 34 food items, 135 indexable pages, 64 tests.

## 2026-10-09 — Discovery pages, interactive menu, allergen baseline, ratings (branch `discovery-ratings-2026-10`)
- 126 indexable pages (DE/EN/FR): menu, African soups hub, 31 dish pages, delivery, catering, reservations, gallery, contact; breadcrumbs + JSON-LD (WebPage, BreadcrumbList, Menu, MenuSection, MenuItem, Service); sitemap with alternates; robots excludes /admin/ and /api/.
- Header/footer navigation to dedicated pages; dish names link to dish pages; related dishes.
- Original descriptions for all 31 dishes (kind, card summary, cultural background) in DE/EN/FR; desktop hover + "About this dish" disclosure; enlargeable photos in a global accessible lightbox (menu, gallery, dish pages).
- Allergen panel per dish with three source states; historical register restored from Afrolink's previous menu; allergen page shows previous-menu declarations; reconciliation workflow for the kitchen.
- Dish ratings (feature-flagged OFF): API, Neon schema/migration, anti-abuse, Bayesian ranking, discovery sorting, favourites, management dashboard, CSV export, moderation audit, six-month report, privacy section (enabled builds only).
- Vercel adapter (static pages + on-demand API); ESLint ignores build output; tests: 62 (ratings with embedded Postgres, discovery/SEO, allergen baseline).

## 2026-10-09 — Image cleanup, menu extras/water, SEO package (branch `image-seo-2026-10`)
- Removed the old grilled-fish and porridge-yam photos everywhere (gallery, dish image, legacy category images); sources retired, not deleted.
- 12 new owner dish images: Fried Fish & Plantain, Porridge Yam, Abacha, Beans & Plantain, Coconut Rice, Isiewu, Fried Yam & Egg Sauce, Okpa, Snail, Stockfish, Suya, Extra Pounded Yam. 0 placeholders remain.
- Tilapia alt text no longer says "grilled" (the menu says fried or boiled).
- Water notice in DE/EN/FR; "1 Gericht / 1 dish / 1 plat" singular fix.
- SEO: localised titles/descriptions, hero tagline with "Essen", About copy, "New to West African food?" guide, WebSite JSON-LD, menu/hasMap, verified-only sameAs, og:type, branded OG image.
- Docs: `docs/image-inventory.md`, `docs/seo.md` (GBP recommendations, Search Console/Bing steps).
- Tests: 37 (new: batch-2 mapping, retired photos absent, extras €4, water notice).

## 2026-10-09 — Approved dark-and-gold design (branch `design-implementation-2026-10`)
- Dark-and-gold design system; unified gold button system.
- Hero with `egusi-soup.png` (full-bleed desktop, image-first mobile).
- Restaurant highlights band (replaces ticker), gated by the claims register; rating line computed from data.
- Soups showcase featuring `vegetable-soup.png`; soups category note "served with pounded yam or garri" (DE/EN/FR).
- Image-rich menu: 21 dishes with images (12 soups, 3 rice, tilapia, assorted plate + existing Afrolink photos for suya, pepper soup, nkwobi, porridge yam); 10 "Image coming soon" placeholders; serving-suggestion note.
- Jollof -> `jollof.png`, Tilapia -> `tilapia.png`, Assorted -> `assorted.png`.
- Diabetes-related adaptation enquiry (dietary card + enquiry type), no medical/nutritional promises.
- New OG image from the Egusi photo.
- Tests: 33 (new: dish image mapping, soups note, diabetes wording, rendered placeholders).

## 2026-10-08 — Product, UX & compliance upgrade (branch `product-upgrade-2026-10`, preview only)
- Trilingual site (DE `/`, EN `/en/`, FR `/fr/`) with browser-language detection, persistent manual choice, hreflang, localized metadata/JSON-LD, sitemap with alternates.
- New hero with the genuine watermarked Egusi + pounded yam photo, four direct actions, Google rating, today's hours and video link.
- Information ticker driven by a claims register (only verified/owner-provided claims), pausable, reduced-motion safe, paused off screen.
- Interactive menu: sticky category bar with scroll-spy, search across dishes/drinks, owner menu descriptions in 3 languages, "hot" tags from the menu, notices (no pork, heat, allergens), contextual WhatsApp/phone; layout rebuilt per category row (fixes the gap after Coconut Rice); drinks in balanced columns.
- Reviews: dated Google rating snapshot, read/write CTAs, David On The Go video; carousel ready for genuine excerpts.
- Delivery & catering section (how it works, occasions) and an enquiry builder (reservation, delivery, catering, dietary, group, question) composing a WhatsApp message client-side.
- Dietary guidance (no pork, heat, vegetarian/vegan enquiries, allergies -> staff).
- Allergen & additive data model + public pages (DE/EN/FR), internal verification matrix export, legal requirements matrix, kitchen worksheet, owner checklist, claims audit.
- Impressum & Datenschutz pages (DE/EN/FR) — render only supplied facts, visibly incomplete until operator data is provided.
- QA: 27 tests; axe-core 0 violations (24 page/width combos); Lighthouse mobile 93-97 / desktop 100, CLS 0.

## 2026-10-08 — Redesign & correction (branch `redesign-2026-10`, preview only)
- Imagery: 17 enhanced, watermarked Afrolink photos replace the weaker originals; watermark-aware cropping; kitchen photo in About.
- Menu: real dish photo per category (portrait photos matted, uncropped); prices/dishes unchanged.
- Video: "David On The Go" featured under the hero; new "Afrolink on video" section with 2 YouTube Shorts + 4 Facebook videos; click-to-play, one at a time, no third-party request before play.
- Social & reviews: Facebook, Instagram, TikTok (@afrolink_restaurant), YouTube; Google reviews CTA (no ratings shown).
- Reservation band (call / WhatsApp / mobile).
- Hours: Monday 16:00 (brief 2026-10-08); grouping Tue–Thu / Fri–Sat / Sun–Mon.
- Header nav: + Videos. Tests extended (social, videos, no iframe/autoplay on load).

## 2026-10-07 — Production deployment
- GitHub repo renamed `afropages-online` → `afrolink-restaurant-online`.
- Vercel project `afrolink-restaurant-online` created and connected to GitHub; production deployed (https://afrolink-restaurant-online.vercel.app).
- Domains `www.afrolink-restaurant.online` and `afrolink-restaurant.online` added; apex → www 308 redirect set in Vercel.
- DNS change in Cloudflare still required (R-008).

## 2026-10-07 — Afrolink digital menu site (unreleased, local only)
- Replaced the Afropages placeholder (moved to `legacy/afropages-mvp/` with `git mv`) with an Astro 7 static site.
- Structured content data: food menu (33 price lines), drinks (28 lines; Hot Drinks slot empty), business, hours, gallery, SEO.
- Sections: sticky header + mobile nav, hero, sticky category nav with scroll-spy, food menu, drinks, gallery (18 genuine photos, lightbox), about + services, opening hours (today highlighted, Europe/Berlin), contact, footer.
- SEO: title, description, canonical, Open Graph, Twitter card, favicon set, web manifest, robots.txt, sitemap.xml, schema.org Restaurant + Menu JSON-LD generated from data (no ratings).
- Tooling: ESLint (typescript-eslint, eslint-plugin-astro, jsx-a11y-x strict), `astro check`, node:test content tests, `prepare-image` script.
- `vercel.json` (apex → www redirect, caching, security headers). Not deployed.
