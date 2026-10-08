# Content Claims Audit — 2026-10-08

Every factual claim on the website, classified. Source files are given so claims can be changed in one place.

| Claim | Where shown | Classification | Evidence / note | Source file |
|---|---|---|---|---|
| Menu: 33 dishes/variants and prices | Menu | **Verified** (owner brief 2026-10-07) | Locked by `tests/content.test.ts` | `src/data/menu.ts` |
| Drinks: 28 items, prices, sizes | Menu → Drinks | **Verified** (owner brief) — spirit "0,2 L" **awaiting confirmation** | Flagged `verified:false` | `src/data/drinks.ts` |
| Dish descriptions (24 dishes) | Menu | **Owner-provided** (Afrolink printed menu 2026) — confirm still current | `descriptionSource: 'printed-menu-2026'` | `src/data/menu.ts` |
| "Hot" tag on Nkwobi, Pepper Soup | Menu | **Owner-provided** (printed menu says "scharf") | Test enforces basis | `src/data/menu.ts` |
| Address, phones | Everywhere | **Verified** (owner brief) | Tests | `src/data/business.ts` |
| Landline is WhatsApp | Header, contact, CTAs | **Owner-provided** — not technically verifiable from outside (R-010) | Brief 2026-10-07; caution in brief 2026-10-08 | `src/data/business.ts` |
| Opening hours (Mon 16:00) | Hero, hours, schema.org | **Owner-provided** (brief 2026-10-08) — changed from 15:00 | Tests | `src/data/hours.ts` |
| 4.6 ★, 145 Google reviews | Hero, ticker, reviews | **Verified** as a dated snapshot (owner screenshot 2026-10-08); not live | `google.asOf` | `src/data/business.ts` |
| Open since May 2022 | Ticker | **Owner-provided** (opening flyer "NEW OPENING 07.05.2022") | — | `src/data/claims.ts` |
| No pork | Ticker, menu notice, dietary | **Owner-provided** (brief 2026-10-08) | Not a halal claim (stated) | `src/i18n/ui.ts` |
| Delivery in Essen by arrangement; further by negotiation | Ticker, services | **Owner-provided** (brief 2026-10-08) | No fees/radius/times stated | `src/i18n/ui.ts` |
| Catering for celebrations & companies | Ticker, services | **Owner-provided** | Enquiry categories only, no packages | `src/i18n/ui.ts` |
| Authentic West African cuisine in Essen | Ticker, hero | **Verified** (Google category; menu) | — | `src/data/claims.ts` |
| Services list (dine-in … free parking) | About | **Owner-provided** (brief 2026-10-07); "Lunch" questionable (R-003) | — | `src/data/business.ts` |
| David On The Go visit | Hero link, reviews | **Verified** (YouTube oEmbed: title + author) | — | `src/data/videos.ts` |
| "500+ regular customers" | — | **Awaiting confirmation** — not shown | Disabled | `src/data/claims.ts` |
| "20+ years of experience" | — | **Awaiting confirmation** — not shown (team vs. restaurant since 2022) | Disabled | `src/data/claims.ts` |
| "Best/No. 1 African restaurant in Essen" | — | **Customer opinion** — not shown (no review text supplied) | Disabled until attributed | `src/data/claims.ts` |
| Review excerpts | — | None shown — no genuine Afrolink review text supplied | Carousel renders only with entries | `src/data/reviews.ts` |
| Allergens/additives | Allergen page | **Awaiting confirmation** — nothing declared | 0/59 verified | `src/data/allergens.ts` |
