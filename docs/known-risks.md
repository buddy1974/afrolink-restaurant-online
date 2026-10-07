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

## Security Concerns
None material: static site, no forms, no cookies, no third-party scripts, no secrets. Security headers are set in `vercel.json`.
