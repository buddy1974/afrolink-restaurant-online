# Known Risks — `afrolink-restaurant-online`

| Field | Value |
|-------|-------|
| Owner (DRI) | Marcel — Maxpromo Digital |
| Lifecycle stage | MVP (local, not deployed) |
| Last reviewed | 2026-10-07 |

## Risk Register

| ID | Risk | Type | Severity | Mitigation | Owner | Status |
|----|------|------|----------|------------|-------|--------|
| R-001 | **No Impressum / Datenschutzerklärung.** A commercial German website needs an Impressum (§5 DDG) and a privacy notice. Legal entity/owner data has not been supplied. | Legal | **High — blocks production** | Marcel supplies legal details; add `/impressum` and `/datenschutz` pages + footer links | Marcel | Open |
| R-002 | Spirit serving size "0,2 L" is probably wrong (typical 2 cl / 4 cl) | Content | Medium | Shown as supplied, flagged `verified: false`; confirm with Afrolink | Marcel | Open |
| R-003 | "Lunch" is listed as a service but opening starts 15:00 | Content | Low | Kept as supplied; confirm with Afrolink | Marcel | Open |
| R-004 | Repo / GitHub remote is named `afropages-online` (a different product) | Process | Medium | Repo renamed to `afrolink-restaurant-online` (ADR-001) | Marcel | Resolved |
| R-005 | Gallery photos are phone/WhatsApp quality with mixed lighting; some only 720×960 | Quality | Low | Professional shoot recommended; the gallery is data-driven, so swapping is trivial | Marcel | Open |
| R-006 | Photo usage rights assumed (photos come from the client folder) | Legal | Low | Confirm with Afrolink | Marcel | Open |
| R-007 | Gallery captions inferred from the client's file names (e.g. PLANTAINS-SUYA, PEPPERSOUP) | Content | Low | Afrolink confirms; uncertain photos have descriptive alt text and no caption | Marcel | Open |
| R-008 | Domain added in Vercel but DNS (Cloudflare, `asa`/`kirk.ns.cloudflare.com`) still points to a Hostinger default page; the printed QR code shows that page until DNS is changed | Ops | **High** | In Cloudflare set `@` and `www` → `A 76.76.21.21`, proxy off (DNS only), remove old Hostinger records; then verify HTTPS | Marcel | Open — action required |
| R-009 | The logo is a 2025 raster PNG (cartoon style); the 2026 gold "AFROLINK Restaurant & Bar" lockup exists only inside the menu PSD | Brand | Low | Supply a vector/transparent export of the current lockup if preferred | Marcel | Open |

| R-010 | 2026-10-08 brief says "do not assume the landline is the WhatsApp number"; 2026-10-07 brief stated it **is**. WhatsApp links (`wa.me/4920184674196`) kept | Content | Medium | Marcel to re-confirm; change one constant in `business.ts` if wrong | Marcel | Open |
| R-011 | Monday opening changed to 16:00 by the 2026-10-08 brief (was 15:00) | Content | Low | Applied; confirm with Afrolink and update Google Business Profile to match | Marcel | Open |
| R-012 | `public/` contains 34 untracked images incl. ChatGPT re-renders; if deployed by CLI from this folder they would become public URLs | Process | Medium | Moved (not deleted) to git-ignored `owner-assets/public-candidates/`; `.vercelignore` excludes it from CLI deploys | Marcel | Resolved 2026-10-08 |
| R-013 | Instagram `@afrolinkrestaurant` could not be verified without login (TikTok, YouTube, Facebook, Google link verified) | Content | Low | Marcel to open the link once | Marcel | Open |
| R-014 | TikTok handle switched to `@afrolink_restaurant` (166 followers); old `@afrolink.de` has 71k followers — may be the real main account | Content | Medium | Marcel to confirm the correct handle | Marcel | Open |

| R-015 | **Allergen/additive information not verified** (0/59 items). Website says so and refers guests to staff, but LMIDV § 4 requires a written record for oral information | Legal / safety | **High** | Kitchen completes the matrix; written record (Kladde) in the restaurant; publish verified records | Marcel / kitchen | Open |
| R-016 | No genuine review texts supplied; carousel hidden. Rating is a manual snapshot that can go stale | Content | Low | Add excerpts to `src/data/reviews.ts`; update `google.asOf` periodically | Marcel | Open |
| R-017 | Dish descriptions taken from the 2026 printed menu (owner material) — may not match current recipes | Content | Medium | Owner confirms; edit `src/data/menu.ts` | Marcel | Open |
| R-018 | Delivery offered "by arrangement" — no area, fees or times defined | Business | Medium | Define a delivery policy when ready; until then all via enquiry | Marcel | Open |
| R-019 | Hero photo is 883x540 — slightly soft on high-density desktop screens | Quality | Low | Supply a higher-resolution Egusi + pounded yam photo | Marcel | Open |

| R-020 | Owner-supplied dish images (2026-10-09) appear to be AI-composited presentation images (Afrolink table settings combined with dish imagery similar to web photos). Rights/provenance unconfirmed; they may not show the dish exactly as served | Legal / content | **Medium** | Labelled on site as serving suggestions; owner to confirm rights and provenance or replace with own photos | Marcel | Open |
| R-021 | Approved visual mockup not available to the implementer; no pixel comparison possible | Process | Low | Supply the mockup file for a comparison pass | Marcel | Open |
| R-022 | "Nigerian" wording in SEO copy describes dish origin; owner has not explicitly confirmed positioning | Content | Low | Owner confirmation requested in docs/seo.md | Marcel | Open |
| R-023 | Search Console / Bing not verified; indexing unconfirmed. GBP data (hours, website, menu link) may differ from the site | SEO | Medium | Owner steps in docs/seo.md | Marcel | Open |
| R-024 | Owner images for Extra Garri / Extra Rice / Extra Yam supplied, but these extras are not on the verified menu | Content | Low | Owner to confirm; not published | Marcel | Open |

## Security Concerns
None material: static site, no forms, no cookies, no third-party scripts, no secrets. Security headers are set in `vercel.json`.
