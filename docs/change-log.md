# Change Log — `afrolink-restaurant-online`

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
