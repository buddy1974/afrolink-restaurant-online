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
