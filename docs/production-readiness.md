# Production Readiness — `afrolink-restaurant-online`

| Field | Value |
|-------|-------|
| Owner (DRI) | Marcel — Maxpromo Digital |
| Lifecycle stage | MVP → Production (pending) |
| Last reviewed | 2026-10-07 |

## Status: NOT production-ready — blocked by R-001 and pending approvals

| Item | Evidence | Status |
|------|----------|--------|
| Lint (ESLint + strict jsx-a11y) | `npm run lint`, 2026-10-07 | PASS |
| Typecheck (`astro check`) | 0 errors / 0 warnings / 0 hints | PASS |
| Content tests (menu, drinks, hours, contact, no delivery, rendered page) | `npm test` | PASS |
| Production build | `npm run build` | PASS |
| Responsive QA 375 / 390 / 430 / 768 / 1024 / 1440 | Measured in Chrome: no horizontal overflow, no clipped prices | PASS |
| WCAG AA colour contrast | Lowest pair 5.37:1 | PASS |
| Impressum / Datenschutz | — | **MISSING (R-001)** |
| Marcel visual approval | Local build accepted 2026-10-07 | Done |
| GitHub repository decision | Renamed to afrolink-restaurant-online | Done |
| Vercel project + domain | Project `afrolink-restaurant-online` (GitHub-connected), production deployed 2026-10-07; www + apex added, apex → www 308 | Done — **DNS pending in Cloudflare (R-008)** |
| Production smoke test | afrolink-restaurant-online.vercel.app: 200, menu/drinks/gallery, tel/WhatsApp links, address, 272 assets OK | PASS |
| Lighthouse on production | — | To run once the custom domain resolves |
