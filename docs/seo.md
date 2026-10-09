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

Unchanged: not verified, sitemap not submitted, indexing unconfirmed (owner logins needed). After deployment, submit `https://www.afrolink-restaurant.online/sitemap.xml` and inspect `/speisekarte/`, `/speisekarte/egusi-soup/`, `/lieferung/` and `/catering/`.
