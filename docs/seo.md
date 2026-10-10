# SEO — Afrolink Restaurant & Bar (www.afrolink-restaurant.online)

_Last updated: 2026-10-09. Nothing in this document claims that a search engine has crawled, indexed or ranked the site. Submission and indexing still need confirmation by the owner._

## Technical setup (implemented)
| Item | Status |
|---|---|
| Canonical host | `https://www.afrolink-restaurant.online`. Apex → www 308 (Vercel domain config + `vercel.json`). HTTP → HTTPS by Vercel |
| Pages (12, all indexable) | `/`, `/en/`, `/fr/` + Impressum/Imprint/Mentions légales, Datenschutz/Privacy/Confidentialité, Allergene/Allergens/Allergènes |
| Canonical | Self-referencing absolute URL per page and language |
| hreflang | `de-DE`, `en`, `fr` + `x-default` → German. German is the default because the restaurant, its customers and the QR code are German-language; the auto-redirect for EN/FR browsers runs only on `/` and never for bots |
| Sitemap | `/sitemap.xml`, 12 URLs, each with `xhtml:link` alternates. Referenced in `robots.txt` |
| robots | `robots.txt`: `Allow: /`. Meta `index, follow, max-image-preview:large`. No `noindex` anywhere |
| Preview URLs | Vercel preview deployments are behind Vercel Authentication (401) and are never canonical |
| Titles / descriptions | Localised per language, with local intent ("Afrikanisches Restaurant", "Essen") and real dish names |
| Headings | One `h1` per page (brand on home, page title on legal pages), section `h2`, category `h3` |
| Open Graph / Twitter | Branded 1200×630 `og-image.jpg` (genuine Egusi photo + name + address). `og:type` is `restaurant.restaurant` on home and `website` on legal pages. Localised `og:locale` + alternates |
| Structured data | Home pages: `Restaurant` + `WebSite` (JSON-LD), see below. No rating or review markup |
| Images | Responsive AVIF/WebP, explicit dimensions, descriptive file names and localised alt text. Hero eager/high priority, everything else lazy |

## Structured data (`src/data/seo.ts`) — verified facts only
Included: name, url, mainEntityOfPage, image (OG image), logo, telephone (landline), postal address, `hasMap` (Google Maps search link), `servesCuisine` (West African, African — from the Google Business Profile category), `priceRange` (computed from the real menu prices, currently €4–€35), `acceptsReservations`, `sameAs` (only verified profiles: Facebook, TikTok, YouTube; Instagram is excluded until verified), `openingHoursSpecification` (from `hours.ts`), `menu` URL and the full `hasMenu` with all sections and prices.

Deliberately omitted (not verified): `aggregateRating`/`review` (self-serving review markup is not eligible), `paymentAccepted`, `geo` coordinates, `areaServed`/delivery radius, `award`, `email`.

Validate after each deploy:
- Rich Results Test: https://search.google.com/test/rich-results?url=https://www.afrolink-restaurant.online/
- Schema Markup Validator: https://validator.schema.org/

## Local SEO for Essen
NAP shown identically everywhere (site, JSON-LD, OG tags): **Afrolink Restaurant & Bar, Berzeliusstraße 7, 45144 Essen, Germany · +49 201 84674196 (landline, also WhatsApp) · +49 1521 7130788 (mobile).**

Target queries are covered with natural copy only. There are no doorway pages and no keyword lists.

| Query | Where it is covered |
|---|---|
| Afrikanisches Restaurant Essen / African restaurant Essen / restaurant africain Essen | Title, description, hero tagline, About text |
| Westafrikanisch / West African | Highlights, About, menu lede |
| Nigerianisches Restaurant / Nigerian restaurant | Description + About ("many of them Nigerian classics such as egusi, ofe nsala or nkwobi"). Owner should confirm the wording (see below) |
| afrikanisches Essen bestellen / delivery | Delivery & catering section, highlights, enquiry form |
| African catering Essen / afrikanisches Catering | Services + enquiry section |
| Egusi Soup / Jollof Rice / Tilapia Essen | Menu items, alt text, description, "New to West African food?" guide |
| Fufu | Explained honestly: pounded yam and garri are "similar to fufu". Fufu itself is **not** claimed as a menu item |

Opening hours audit: `src/data/hours.ts` (Mon 16–24, Tue–Thu 15–24, Fri–Sat 15–01, Sun 16–24) matches the owner brief of 2026-10-08. It is identical on the site and in the JSON-LD. The owner must make sure the Google Business Profile shows the same hours.

## Google Business Profile — recommendations (NOT applied; needs owner authorisation)
Nothing in the Google Business Profile has been changed. Suggested by priority:
1. **Website**: `https://www.afrolink-restaurant.online/`. **Menu link**: `https://www.afrolink-restaurant.online/#menu`.
2. **Hours**: match the site (above), including holiday hours when relevant.
3. **Categories**: primary "West African restaurant" (current). Possible secondary categories if accurate: "African restaurant", "Nigerian restaurant", "Caterer", "Bar".
4. **Services/attributes**: dine-in, takeaway, delivery (by arrangement), catering, reservations — only what is actually offered.
5. **Phone**: landline +49 201 84674196 as primary, mobile as additional.
6. **Photos**: upload genuine photos of dishes, interior and exterior regularly. Use descriptive names and no stock images.
7. **Menu**: add dishes and prices in the GBP menu editor, identical to the site.
8. **Reviews**: reply to reviews. Use a "write a review" short link from the GBP dashboard (Ask for reviews) and add it as `google.writeReviewHref` in `src/data/business.ts` to activate the button.
9. **Social links**: add Facebook, TikTok, YouTube (and Instagram once confirmed).

## Search Console / Bing Webmaster Tools — readiness
Existing connections were checked on 2026-10-09: there is no `google-site-verification` / `msvalidate.01` meta tag or verification file in the repository. Whether a **DNS-based** Domain property exists cannot be checked from here (it needs the owner's Google account).

Steps for the owner (needs their logins; not done by the agent):
1. Google Search Console → add a **Domain property** `afrolink-restaurant.online` → verify via the TXT record in Cloudflare DNS.
2. Submit `https://www.afrolink-restaurant.online/sitemap.xml`.
3. URL inspection → request indexing for `/`, `/en/`, `/fr/`.
4. Monitor: Pages (index coverage), Core Web Vitals, Enhancements.
5. Bing Webmaster Tools → "Import from Google Search Console" (or DNS verification) → submit the same sitemap.

Tell the agent once verification is done so the status can be recorded here. **Status: not submitted, not verified, indexing unconfirmed.**

## Owner confirmations requested
- "Nigerian" wording: the site says many dishes are Nigerian classics (Egusi, Ofe Nsala, Nkwobi). Please confirm you are happy to be found as a Nigerian restaurant as well.
- Payment methods accepted (cash/card/EC) — would allow `paymentAccepted` in the structured data.

---

# Search-discovery architecture (2026-10-09, branch `discovery-ratings-2026-10`)

_Research, sources and the competitor scan: `docs/research/seo-menu-allergen-research-2026-10-09.md`. Rankings and sitelinks are decided by Google; nothing here guarantees them._

## Page architecture (126 indexable pages = 42 per language)

| Purpose | DE | EN | FR |
|---|---|---|---|
| Restaurant (home) | `/` | `/en/` | `/fr/` |
| Full menu | `/speisekarte/` | `/en/menu/` | `/fr/carte/` |
| African soups hub | `/speisekarte/suppen/` | `/en/menu/soups/` | `/fr/carte/soupes/` |
| 31 dish pages | `/speisekarte/<id>/` | `/en/menu/<id>/` | `/fr/carte/<id>/` |
| Delivery in Essen | `/lieferung/` | `/en/delivery/` | `/fr/livraison/` |
| Catering & events | `/catering/` | `/en/catering/` | `/fr/traiteur/` |
| Reservations | `/reservierung/` | `/en/reservations/` | `/fr/reservation/` |
| Gallery | `/galerie/` | `/en/gallery/` | `/fr/galerie/` |
| Contact & directions | `/kontakt/` | `/en/contact/` | `/fr/contact/` |
| Legal (existing) | Impressum, Datenschutz, Allergene | … | … |

Dish ids are the stable menu ids (authentic names, never translated), e.g. `/speisekarte/egusi-soup/`.

**Deliberately not built:**
- `/menu/fufu/`: Afrolink serves pounded yam and garri, not fufu. The Pounded Yam page (`extra-pounded-yam`) and the soups hub explain the relationship honestly ("similar to fufu").
- City pages for Düsseldorf, Bochum, Duisburg, Dortmund, Oberhausen or Mülheim: Afrolink has one location in Essen, and templated city pages match Google's doorway-spam pattern. The catering page invites enquiries from outside Essen with terms agreed personally. Regional content should only follow a confirmed service relationship (for example, the owner confirms catering in Düsseldorf).

## Sitelink readiness (Google's documented factors)

| Factor | Implementation |
|---|---|
| Descriptive titles | Unique per page and language (tested: 126 unique titles and descriptions, at most 80 characters) |
| Logical hierarchy | Home → Menu → (Soups) → Dish; services at first level |
| Site-wide navigation | Header links to Menu, Delivery, Catering, Reservations, Reviews, Gallery and Contact on every page; footer lists all pages plus six dish entry points |
| Internal anchors | Every dish card name links to its page; the menu page links all 31 dishes; dish pages link related dishes, the soups hub, the menu, reservations and delivery |
| Breadcrumbs | Visible trail + `BreadcrumbList` JSON-LD on every new page |
| Crawlable links | Plain `<a href>`; descriptions and allergen panels are in the HTML, not JS-only |
| Canonical / hreflang | Self-canonical; DE/EN/FR + x-default (German) on every page and in the sitemap |
| Sitemap / robots | 126 URLs with alternates; robots allows everything except `/admin/` and `/api/` |

The target sitelinks ("Egusi Soup", "Jollof Rice", "African Soups", "Tilapia", "Food Menu", "Delivery in Essen", "Catering & Events", "Reservations") now all exist as dedicated pages. Whether Google shows them is Google's decision; monitor in Search Console.

## Structured data per page type

| Page | JSON-LD |
|---|---|
| Home | `Restaurant` (+ `menu` → menu page, `hasMenu`), `WebSite` |
| Menu | `WebPage`, `BreadcrumbList`, `Menu` with all sections and prices |
| Soups | `WebPage`, `BreadcrumbList`, `MenuSection` linking the 12 soup pages |
| Dish | `WebPage`, `BreadcrumbList`, `MenuItem` (name, description, image, exact offers) |
| Delivery | `WebPage`, `BreadcrumbList`, `Service` (areaServed: Essen, owner-confirmed) |
| Catering | `WebPage`, `BreadcrumbList`, `Service` (no areaServed, not confirmed) |
| Others | `WebPage`, `BreadcrumbList` |

No `aggregateRating`, `Review`, `FAQPage`, awards or fabricated offers. Dish ratings are not eligible for review snippets (MenuItem is not a supported type; self-serving reviews are ineligible).

## Keyword research: honest findings

- No keyword-volume or rank-tracking tool was available, so measurable demand is **unknown**. Use the Search Console "Queries" report after indexing.
- Directories (11880, golocal, coolibri, Tripadvisor) dominate "afrikanisches Restaurant Essen". Afrolink's own website did not appear, and coolibri links only to Facebook. Pointing those listings to the website is an easy win (owner).
- For dish + city queries ("Egusi Essen", "Jollof Rice Essen"), little local content was found. The new dish pages target these with genuine content.
- Competitors found: Treasure (Düsseldorf) has one menu page, no dish pages and no online ordering; Atinka (Bochum) delivers via Wolt. No NRW-based West African caterer came up for "afrikanisches Catering NRW".
- "Nigerian" queries are served by the copy "West African and Nigerian food" plus the dish pages. **Owner confirmation of the "Nigerian" positioning is still open (R-022).**

## Google Business Profile: updated recommendations (not applied)

- Menu link → `https://www.afrolink-restaurant.online/speisekarte/`; reservations link → `/reservierung/`; website → home.
- Categories: keep primary "West African restaurant"; consider secondary "African restaurant", "Nigerian restaurant" (if confirmed), "Caterer", "Bar".
- Services: dine-in, takeaway, delivery (by arrangement), catering (by arrangement). No online-ordering link until real ordering exists.
- Description (up to 750 characters, in the owner's words) mentioning soups with pounded yam/garri, jollof, suya, and delivery and catering by arrangement.
- Photos: real dish and interior photos, added regularly.
- Reviews: request via the GBP short link; reply to reviews.
- Keep hours identical to the site.

## Search Console / Bing: status

Superseded by the Google Search Console and Bing Webmaster Tools records below (2026-10-10).

# Google Search Console — finalization (2026-10-10)

Done in the owner's authenticated Chrome session. No DNS changes were needed.

| Item | Result |
|---|---|
| Property | **Domain property** `sc-domain:afrolink-restaurant.online` (covers www and non-www, http and https). This is the only Afrolink property in the account. |
| Ownership | **Verified owner** — method "Domain name provider", "Successfully verified". |
| Sitemaps before | None submitted (no obsolete entries to remove). |
| Sitemap submitted | `https://www.afrolink-restaurant.online/sitemap.xml` (the live endpoint; `/sitemap-index.xml` returns 404 — Astro generates a single `sitemap.xml` here). Submitted **2026-10-10**, last read 2026-10-10, status **Success**, **138 discovered pages**, 0 errors. |
| robots.txt | `Allow: /`, `Disallow: /admin/`, `Disallow: /api/`, `Sitemap: https://www.afrolink-restaurant.online/sitemap.xml`. |
| Reports | Performance / Pages / Experience / Enhancements: "Processing data" (new property). |

### URL Inspection (2026-10-10)
| URL | Google index status before | Live test | Indexing request |
|---|---|---|---|
| `/` | **Indexed** (last crawl 2026-10-09 19:35, Googlebot smartphone; Google-selected canonical = declared canonical) | — | Requested (recrawl for current release) |
| `/speisekarte/` | Not indexed — URL unknown to Google | Available; can be indexed; Breadcrumbs 1 valid | Requested |
| `/en/menu/` | Not indexed — Discovered, currently not indexed (via sitemap) | Available; Breadcrumbs valid | Requested |
| `/fr/carte/` | Not indexed — URL unknown to Google | Available; Breadcrumbs valid | Requested |
| `/speisekarte/egusi-soup/` | Not indexed — URL unknown to Google | Available; Breadcrumbs valid | Requested |
| `/speisekarte/jollof-rice/` | Not indexed — URL unknown to Google | Available; Breadcrumbs valid | Requested |
| `/speisekarte/tilapia/` (fish) | Not indexed — Discovered, currently not indexed | Available; Breadcrumbs valid | Requested |
| `/catering/` | Not indexed — Discovered, currently not indexed | Available; Breadcrumbs valid | Requested |
| `/lieferung/` | Not indexed — Discovered, currently not indexed | Available; Breadcrumbs valid | Requested |

"Requested" means *added to Google's priority crawl queue* — **not indexed**. Mackerel Fish Slices is not in production (preview only) and was not inspected or submitted. Recheck in 3–7 days: Pages report, then re-inspect the URLs above.

### Production technical audit (all 138 sitemap URLs, 2026-10-10)
- All 200; no `noindex` / `X-Robots-Tag`.
- Titles and descriptions unique (138/138).
- Canonical = self = sitemap URL, `https://www.` host.
- `og:url` matches; OG title/description/image present.
- `twitter:card` summary_large_image.
- Exactly one H1 per page.
- hreflang de-DE/en/fr/x-default on every page, reciprocal, identical to the sitemap alternates.
- Redirects: `http://`, non-www → 308 to `https://www.`; unknown URL → 404.
- JSON-LD parses on every page:
  - Restaurant + WebSite on the home pages;
  - WebPage + BreadcrumbList + Menu / MenuSection / MenuItem / Service on the other pages.
  - The 64 live price lines (36 food, 28 drinks) match `src/data/menu.ts` / `drinks.ts` on `main`.
- Icons: favicon.ico, favicon-32.png, apple-touch-icon.png, site.webmanifest and its 192/512/maskable icons all 200.
- `og-image.jpg` is 1200×630 JPEG; the 35 OG images used are all reachable.
- The logo has `alt=""` on purpose (decorative; the link text names Afrolink).
- **Found and fixed (preview only):**
  - the home H1 read "AfrolinkRestaurant & Bar" (no space between spans);
  - the home title was 72 characters (truncated) and did not name "Nigerian";
  - the home description was 192 characters.
- **Accepted:**
  - `/speisekarte` without a trailing slash and `/index.html` also answer 200, but carry the canonical to the slash URL. A platform-wide trailing-slash redirect would also affect `/api/*`, so it was not changed;
  - some dish titles are 61–72 characters.
- **Core Web Vitals:**
  - PageSpeed Insights API quota was exhausted on 2026-10-10, and the web UI did not finish;
  - the Lighthouse runs on this production build earlier on 2026-10-10 gave mobile 92–94 (home), 94 (menu), 98 (dish page), CLS 0 (change-log);
  - Search Console field data: not yet available.

Keyword research and page mapping: `docs/seo-keyword-map.md`.

# Bing Webmaster Tools — setup (2026-10-10)

Done in the owner's authenticated Chrome session, after the Google phase was reviewed.

| Item | Result |
|---|---|
| Site | `https://www.afrolink-restaurant.online/` added manually (it was not in the account). The GSC import (OAuth grant) was not used. |
| Ownership | Verified by a **DNS CNAME** at the apex (`<token>.afrolink-restaurant.online` → `verify.bing.com`) in Vercel DNS. Keep this record; Bing re-checks ownership. |
| Sitemap | `https://www.afrolink-restaurant.online/sitemap.xml` submitted → **Success, 141 URLs discovered**, 0 errors, 0 warnings. |
| URL submission | 48 priority URLs submitted (home, menu, delivery, catering, reservation, contact, gallery, allergens, soups hub, Egusi, Jollof, Suya, Pepper Soup, Tilapia, Mackerel, Pounded Yam; DE/EN/FR). They were submitted twice because the first batch fell inside the DNS incident below. Daily quota is 100. |
| Index status | `/` **indexed in Bing** (an older copy; that copy still shows a short title / description and no markup). Live test of the current page: **"URL can be indexed by Bing"**, no SEO/GEO issues, 2 markup types. `/kontakt/`: "Discovered but not crawled". The other pages are not indexed yet. |
| IndexNow | Not set up. It needs a key file served from the site, i.e. a code change plus a production deploy that needs approval. Recommended next step. |

"Submitted" means queued for Bing's crawler; it is **not** indexing. Recheck in 3–7 days in Site Explorer and URL Inspection.

## Incident: `www` DNS outage during Bing verification (~16:08–16:30 CEST)
- **What happened:**
  - Bing shows one CNAME name without saying which host it belongs to.
  - I added it at the apex and also under `www` (`<token>.www`).
  - `www` itself had no record; it was served by the `*` wildcard ALIAS.
  - Creating a name *below* `www` turned `www` into an existing (empty) DNS node, and wildcards do not match existing names (RFC 4592).
  - So `www.afrolink-restaurant.online` returned **no address** on every resolver, including Vercel's own nameservers.
  - The site was unreachable for visitors whose resolvers looked it up in that window.
- **How it was found:**
  - Bing's live test failed for Afrolink but passed for two other sites in the same account (one Cloudflare-hosted, one Vercel-hosted).
  - A direct DNS check then showed the missing address.
- **Fix:**
  - Removed the `<token>.www` record.
  - `www` resolved again on the authoritative and public resolvers within a minute.
  - The negative-cache TTL is 600 s, so stale failures could last until about 16:40.
  - Bing's live test then passed; the sitemap was resubmitted and succeeded.
- **Impact:**
  - About 20–30 minutes of partial unreachability for `www`.
  - Google or Bing crawls in that window may have recorded DNS errors; both retry automatically.
- **Rule from now on:**
  - Never create DNS names under `www` (or under any other host served only by the wildcard).
  - Add verification records at the apex, or add an explicit `www` record first.
  - After any DNS change, resolve `www` and the apex on the authoritative nameservers.

# Hardening pass: DNS forensics, IndexNow, full technical audit (2026-10-10, preview only)

Branch `discovery-ratings-2026-10`. Nothing here changed DNS or production. IndexNow is built but not activated. Architecture and runbook: docs/indexnow.md.

## DNS forensics (read-only)
| Item | Finding |
|---|---|
| Nameservers | ns1/ns2.vercel-dns.com. Intended = current (`vercel domains inspect`). |
| Domain assignment | `afrolink-restaurant.online` and `www.` → project `afrolink-restaurant-online`. Registrar: third party. |
| Apex | Vercel-managed default ALIAS. A records from Vercel anycast (216.150.x.x, rotating per resolver). |
| Wildcard | `*` ALIAS → `cname.vercel-dns-016.com`. **`www` has no record of its own; it resolves only through the wildcard.** |
| Other records | Google verification CNAME and Bing verification CNAME, both directly under the apex (tokens not reproduced here). CAA `0 issue` for letsencrypt.org, pki.goog and sectigo.com. |
| IPv6 | No AAAA for the apex or `www` (IPv4 only). |
| DNSSEC | Not enabled. There is no DS at the `.online` parent, which is itself signed. This is normal for Vercel DNS and not a defect. |
| Unknown subdomains | They resolve through the wildcard but answer **404** over HTTPS, so no duplicate site exists. |
| TLS | Let's Encrypt `*.afrolink-restaurant.online` (chain YR2 → Root YR → cross-signed by ISRG Root X1). Valid until 2027-01-05 and auto-renewed by Vercel. TLS 1.2 and 1.3 work. HSTS max-age is 2 years, without includeSubDomains (intentionally). |
| Redirects | `http://apex` → `https://apex` → `https://www` (2 × 308); `https://apex/x` → `https://www/x` (308); `http://www` → `https://www` (308). An unknown path answers 404. |
| Resolvers | `www` and the apex resolve at Cloudflare, Google, Quad9 and OpenDNS, and directly at ns1/ns2.vercel-dns.com. |

**Root cause of incident R-032** (the mechanism is established; this is not speculation):
- A record named `<token>.www` made `www` an existing but empty node.
- Under RFC 4592 a wildcard does not answer for names that exist, so `www` returned NODATA, even from the authoritative servers.
- The apex kept working throughout, which matches what was observed during the incident.

**Residual architectural weakness:** `www`, the canonical host, depends on the wildcard. Any future record created *below* `www` would repeat the outage.

**Proposed infrastructure change** (needs owner approval; not executed):
- **Change:** add an explicit `www` record in Vercel DNS whose value is the wildcard's current target (`cname.vercel-dns-016.com`; confirm it in the dashboard first).
- **Expected effect:** `www` stays resolvable even if a record is ever created below it. Today's answers do not change.
- **Risk:** a wrong target would break `www`. Add the record only with the exact value the wildcard uses, then run `node scripts/check-production.mjs`.
- **Rollback:** delete the record (`vercel dns rm <record-id>`). That restores today's wildcard-only setup within the 600 s TTL.

Whatever is decided about that change, the hourly monitor (`scripts/check-production.mjs`) now queries `www` directly at both authoritative nameservers. It would have flagged R-032 within the hour; a unit test replays the incident.

## Technical SEO audit (built site + production, all 141 URLs)
The checks are automated in `tests/seo-integrity.test.ts`, `tests/discovery.test.ts` and `tests/rendered.test.ts`, which run in CI on every push.

| Area | Result |
|---|---|
| Sitemap | Valid sitemaps.org urlset with 141 URLs, all on `https://www.`, no duplicates. **Built pages = sitemap URLs exactly** (no orphans, no gaps). No `lastmod`: no reliable per-page modification date exists, and none is invented. robots.txt references the sitemap. |
| Canonical | One self-referencing canonical per page, equal to its sitemap URL. |
| hreflang | Every page has `de-DE`, `en`, `fr` and `x-default` (= the German page). `<html lang>` equals the page's own hreflang. All alternates are reciprocal, and the HTML alternates equal the sitemap alternates. The server-side language redirect applies only to `/` and never to crawlers. |
| Titles / descriptions | Unique on all 141 pages. **Recommendation (content, not changed):** 44 descriptions are 161–177 characters. Bing flags anything over 160; Google only cuts off the tail ("… – mit Preisen."). Shortening them is a DE/EN/FR copy edit that needs owner approval. |
| Headings | Exactly one H1 per page and no skipped levels. |
| Images | Every `<img>` has an `alt`. The logo is decorative: `alt=""`, which Astro renders as a bare `alt`. |
| Social images | OG and Twitter images are on the canonical host, present in the build, at 1.91:1. **Fixed:** five dish images (Beans & Plantain, Extra Pounded Yam, Fried Fish & Plantain, Mackerel, White Rice & Stew) were declared 1200×630 but were actually narrower. They are now generated at the largest true 1.91:1 size the photo allows, and declared accurately. **Fixed:** the og:image, twitter:image and JSON-LD image URLs no longer carry Vercel's per-deployment `?dpl=` parameter, so they stay stable across deployments (proven with a build that simulates Skew Protection). |
| Icons / manifest | favicon.ico, favicon-32, apple-touch-icon (180×180) and the manifest icons are present, with sizes verified from the files. |
| Structured data | Parses on every page. The Restaurant node on the home pages matches the data files: name, address, landline, opening hours, cuisine, menu. No AggregateRating, Review or certification markup anywhere. The menu JSON-LD offer prices are exactly the approved food and drink prices (DE/EN/FR). Mackerel: €5.00 with a UnitPriceSpecification "pro Stück". |
| Internal links | Every internal `href` resolves to a built file. |
| 404 | Unknown paths answer HTTP 404. The page is Astro's default, in English and unbranded. **Recommendation:** a trilingual branded 404 page (design work, not done). |
| Duplicate hosts | `afrolink-restaurant-online.vercel.app` (the public production alias) served indexable pages, with a canonical to `www`. **Fixed:** `X-Robots-Tag: noindex` for `*.vercel.app` hosts only (vercel.json); the alias stays reachable as a fallback. `/kontakt` (no slash) and `/index.html` answer 200, with canonicals pointing to `/kontakt/` and `/`. They are left as they are, because a trailing-slash redirect would also affect `/api/` calls. |

## Local SEO and business consistency (all 141 pages)
- **Name:** "Afrolink Restaurant & Bar" on every page.
- **Street:** "Berzeliusstraße 7" (261×); "45144 Essen" (postal form) everywhere.
- **Landline:** shown as "0201 84674196", or "+49 201 84674196" in international contexts. All 1,050 `tel:` links use `+4920184674196`.
- **Mobile:** "+49 1521 7130788" (312×).
- **WhatsApp:** all 429 links go to `4920184674196`.
- **Hours:** the displayed ranges equal `src/data/hours.ts` (Tue–Thu 15–00, Fri–Sat 15–01, Sun–Mon 16–00).
- **Social:** one set of profile links. `sameAs` lists only verified profiles. Instagram is shown but is still marked unverified (an owner check).
- **Frohnhausen:** appears only in the home and contact meta descriptions. The visible postal address deliberately stays "45144 Essen", the form Google Business Profile and directories use, for NAP consistency. Adding "Essen-Frohnhausen" to visible copy (for example the contact intro) is an owner content decision.
- **Delivery, catering and reservations:** "by arrangement" wording only. No fees, areas, times or online payment are claimed (tested).

## Search engines: observed status (read-only, 2026-10-10 about 17:00)
| Engine | Observed | Stage |
|---|---|---|
| Google | Domain property verified. Sitemap **Success, 138 discovered**, last read 2026-10-10, before the 141-URL release (Google re-reads it on its own schedule). Pages report and Crawl stats show "processing" / "no data" (new property). The homepage is indexed (inspection earlier today). 9 priority URLs have had indexing *requested*. | Submitted and discovered; 1 indexed |
| Bing | Site verified. Sitemap **Success, 141 discovered**. `/` is **indexed**, from an older copy. `/speisekarte/`: crawled at 16:29, fetch successful, "Indexing allowed: No". The live test now says "URL can be indexed", and the page sends `index, follow` with no X-Robots-Tag. The "No" belongs to the crawl at the end of the DNS incident; recheck. `/catering/` and `/kontakt/`: discovered, not crawled. | 1 indexed; the rest discovered or crawled |

Google has no DNS-error data yet (Crawl stats is empty), so the evidence can neither confirm nor rule out an effect of the outage on Googlebot. Recheck Crawl stats → Host status in a few days.
