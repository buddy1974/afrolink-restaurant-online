# Release readiness — branch `discovery-ratings-2026-10` (2026-10-09)

Verified code commit: `c21c338` (this document was added afterwards; no site code changed).
Production: unchanged (`6195095` on `main`). **No merge or production deployment without Marcel's explicit approval.**

## Evidence

| Check | Result |
|---|---|
| Lint / typecheck / build | pass / 0 errors / pass |
| Automated tests | 66/66 (incl. embedded-Postgres rating tests, feature-flag and environment-isolation tests) |
| Data audit vs production commit | 0 food price changes, 0 drink changes, categories identical; only additions: Extra Garri, Extra Rice, Extra Yam (€4) |
| Images | 34 dishes, 34 distinct images, all present; every menu photo opens the lightbox (1,600 px source) |
| Multilingual | no German UI strings on any EN/FR page; dish content complete in DE/EN/FR |
| Sitemap | 135 URLs, 135 unique, each = a built page, canonical = loc, no built page missing; robots excludes /admin/ and /api/ |
| OG images | og:image file exists for all 135 pages |
| Accessibility (axe, WCAG 2.2 AA + best practice) | 0 violations on all 135 pages at 390 px (panels opened) + 23 pages at 1440 px |
| Layout | no horizontal overflow at 375/390/430/768/1024/1280/1440 on 12 page types |
| Rating flow (browser, local test DB) | rate, revise, persist, second guest, DE/EN/FR, invalid input rejected, management login, CSV without identifiers, audited moderation, 401 without login |
| Preview `afrolink-restaurant-online-3ky1sh3bg…` | 20 routes checked: pages 200, unknown URL 404, `/api/ratings` → `{"enabled":false}`, function in fra1 (9.25 MB); menu page identical to the local build (apart from Vercel's `?dpl=` asset parameter) |

### Lighthouse (mobile, simulated throttling, local compressed server, German locale)

Same setup for both builds — previews are behind Vercel login, so production-like measurement is only possible after deployment.

| Page | Production build (main) | This branch |
|---|---|---|
| Home `/` | 86–92 (LCP 3.3 s) | 89–91 (LCP 3.3 s) |
| Menu `/speisekarte/` | — | 92 |
| Dish page | — | 94–95 |
| Delivery | — | 97 |
| Desktop home / menu | — | 100 / 100 |

On the real production infrastructure the current home page scores 95–98 (measured today). Accessibility 100, SEO 100, CLS 0 on all measured pages. Best practices 96 locally only because the local static server has no `/api/ratings`; on Vercel the endpoint answers 200.

Performance fixes in this review: `content-visibility` removed (it made Chrome treat the off-screen soup photo as the LCP element), rating client loaded on idle, allergen panel markup inserted on first open, de-duplicated descriptions, fewer `srcset` variants.

## 1. Ready to publish
- Search-discovery pages (menu, soups, 34 dish pages, delivery, catering, reservations, gallery, contact) in DE/EN/FR, breadcrumbs, structured data, sitemap.
- Interactive menu: descriptions (hover/tap/keyboard), lightbox, allergen panels, Extras section (4 × €4).
- Allergen display with honest source labels (previous-menu declarations; "ask staff" otherwise).
- Rating code with the feature flag **off** (nothing visible, nothing collected).

## 2. Ready after configuration (Marcel, separate approval)
- Ratings: Neon database (Frankfurt) via Vercel Storage, `RATINGS_SECRET`, `RATINGS_ADMIN_PASSWORD_HASH`, preview test, then `RATINGS_ENABLED=true` in production. The six-month window starts with the first public request. Runbook: `docs/ratings.md`.
- Search Console / Bing verification and sitemap submission (owner logins).

## 3. Requires owner confirmation
- Extra Yam (added from its named image).
- "Nigerian" wording in SEO copy; dish background texts (tone/accuracy).
- Navigation change: header links go to the dedicated pages instead of scrolling the home page.
- Ratings privacy text and Neon as processor (before activation).
- Catering outside Essen (currently "please ask").

## 4. Must not publish until resolved
- **Definitive allergen statements.** Nothing is published as kitchen-confirmed; keep it that way until the kitchen reconciles the current recipes (`docs/compliance/allergen-reconciliation-workflow.md`). The site itself may go live with the current, clearly labelled display — but the restaurant must keep its written allergen record / notice on site (online information alone is not sufficient for dine-in guests).
- **Ratings in production** until steps in section 2 are done and approved.
- Impressum/Datenschutz operator data remain incomplete — see `docs/compliance/legal-release-gate-2026-10-10.md` (questions 1–10). The legal texts were corrected on 2026-10-10.
