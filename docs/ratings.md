# Dish ratings — architecture, safeguards and activation

_Status 2026-10-09: implemented and tested locally against an embedded Postgres. **Not active in production.** Public rating collection starts only after Marcel's approval (see Activation)._

## 1. Architecture

```
Menu card / dish page (static HTML, hidden rating slot)
  → RatingsClient (browser): GET /api/ratings → shows stars only if { enabled: true }
  → POST /api/ratings {dish, stars, website(honeypot), elapsed}
      → Vercel Function (src/pages/api/ratings.ts → src/lib/ratings/http.ts)
          validation · same-origin · rate limits · anonymous voter key
      → Neon Postgres (src/lib/ratings/service.ts, one atomic SQL statement per vote)
  → aggregates (avg, count, Bayesian score, 30-day count, last activity)
  → menu display, "Discover dishes" sorting, Customer Favourites
  → /admin/ratings/ (management dashboard, CSV, moderation, six-month report)
```

- **Site stays static.** Every page is prerendered; only `/api/ratings`, `/api/admin/*` and `/admin/ratings/*` run on demand (`@astrojs/vercel`, `prerender = false`).
- **Database:** Neon Postgres via the Vercel Marketplace integration (`DATABASE_URL`). Schema: `db/migrations/001_ratings.sql`. Tables: `rating` (one row per voter × dish), `rating_event` (append-only audit trail), `rate_hit` (rate limiting), `setting` (write-once launch date).
- **Stable ids:** ratings use the menu ids from `src/data/menu.ts` (e.g. `egusi-soup`), never names. Ratings for dishes that later leave the menu stay in the database and the dashboard ("not on current menu").
- **Environments are separated twice:** every row carries `env` (`production` / `preview` / `development` / `test`), and the Neon integration gives each preview deployment its own database branch. QA votes never reach production data.

## 2. Customer experience

- 1–5 stars on every menu card and dish page; average to one decimal + count; "Not rated yet" when empty. No placeholder or default stars.
- Native radio group (arrow keys, screen-reader labels "4 stars"), status messages in a live region, no account.
- One active rating per person and dish; submitting again **revises** it ("Your rating has been updated").
- Fully translated (DE/EN/FR): `src/i18n/pages.ts → rating`. Numbers are identical in every language (`4,5` / `4.5`).
- While ratings are disabled or the API is unreachable, nothing rating-related is visible.

## 3. Rankings (src/lib/ratings/ranking.ts)

| View | Definition |
|---|---|
| Highest rated | Bayesian average `(C·m + Σstars)/(C + n)`, C = 5 virtual ratings at the overall mean m; only dishes with n ≥ 3 |
| Most rated | number of valid ratings |
| Most rated (30 days) | ratings created in the last 30 days — labelled as rating activity, **not sales** ("Most Popular" is deliberately not used) |
| Recently rated | latest rating activity |
| Customer Favourites | n ≥ 5 and Bayesian score ≥ 4.0, top 3; hidden until a dish qualifies |

Example (tested): one 5★ vote scores ≈ (5·4.3+5)/6 ≈ 4.4 while 100 ratings averaging 4.6 score ≈ 4.6, so the well-evidenced dish ranks first.

## 4. Anti-abuse and security

| Threat | Safeguard |
|---|---|
| Invalid data | integer 1–5 only; dish must be on the current menu; JSON only; body ≤ 1 KB |
| Cross-site / scripted voting from other sites | same-origin check (Origin header) on every POST |
| Bots | honeypot field + minimum time on page; bots get a fake "ok" and nothing is stored |
| Repeat voting | one row per anonymous voter and dish (unique constraint, atomic upsert) |
| Rapid submissions | per voter 10/min; per network 20/10 min and 60/day (sliding windows in Postgres) |
| Clearing cookies to vote again | network limits + dashboard "suspicious patterns" (many first-time votes from one daily network key; one voter rating ≥ 8 dishes in 10 minutes with identical stars) |
| SQL injection | parameterised queries only |
| Management access | scrypt password hash (`RATINGS_ADMIN_PASSWORD_HASH`), signed 8-hour session cookie (HttpOnly, SameSite=Strict), login limited to 5 attempts / 15 min, same-origin checks, `noindex`, no caching |
| Manipulation by management | there is **no** endpoint to create ratings or change stars. Moderation can only exclude/restore with a fixed reason; every action is logged in `rating_event` and shown in the dashboard. Averages are always computed from data. |
| Leaking identifiers | the public API returns aggregates only; CSV export contains no voter or network keys; dashboard shows shortened hashes |

**Honest limitations:** anonymous ratings are not verified purchases. A determined person can clear cookies or switch networks; limits and pattern detection reduce but cannot eliminate this. Ratings reflect the guests who choose to rate, not all guests, and say nothing about sales.

## 5. Privacy (GDPR / TDDDG)

- Stored: dish, stars, timestamps, `voter_hash` = HMAC(secret, random cookie id), `ip_day_hash` = HMAC(secret, IP + date) — rotates daily, **deleted after 30 days**; rate-limit rows deleted after 2 days. No IP addresses, names, e-mails or user agents.
- Cookie `afl_rv` (12 months, path `/api/ratings`, HttpOnly, Secure, SameSite=Lax) is set **only when a guest submits a rating** → strictly necessary for the requested function (§ 25(2) no. 2 TDDDG); no consent banner needed for it.
- Legal basis Art. 6(1)(f) GDPR. The privacy page shows the ratings section and the rating cookies (`src/i18n/privacy.ts`) automatically in builds with `RATINGS_ENABLED=true`. **Owner/legal review required**; the Neon region must be in the EU (Frankfurt) as stated there, and Neon must be added to the processor list.

## 6. Structured data

No `aggregateRating` / `Review` markup anywhere. Google does not show review snippets for self-serving reviews on LocalBusiness/Restaurant pages, and `MenuItem` is not a supported review-snippet type (see `docs/research/seo-menu-allergen-research-2026-10-09.md`, section 1c). Ratings are used for on-site discovery only.

## 7. Six-month evaluation

- The launch moment is recorded **automatically and once** (`setting: launch_at:production`) the first time the public API answers with ratings enabled in production. It cannot be backdated or edited from the UI.
- `/admin/ratings/report/` shows the window [launch, launch + 6 months] with category patterns, strongest/weakest dishes (with 95 % confidence intervals), favourites, monthly trend, unrated dishes and data-quality caveats. Before the end date it is labelled "interim".

## 8. Operating costs (estimate, check current pricing)

- Neon Free plan: 1 GB storage, 100 compute-hours/month per project, up to 10 branches; scales to zero after 5 idle minutes (first request after a pause is slower). A restaurant's rating volume fits easily in the free plan.
- Vercel: a few function invocations per page view with ratings visible; within normal plan limits for this traffic.
- No third-party CAPTCHA or analytics service.

## 9. Activation (requires Marcel's approval)

1. Vercel → project → Storage → **Create Neon database** (region **Frankfurt / aws-eu-central-1**), connect to Production + Preview (preview branching on). This sets `DATABASE_URL`.
2. Generate locally: `openssl rand -base64 32` → set `RATINGS_SECRET` (Preview and Production, separate values recommended).
3. `npm run ratings:hash-password` → set `RATINGS_ADMIN_PASSWORD_HASH` (password stays with Marcel).
4. Preview first: set `RATINGS_ENABLED=true` for **Preview** only, run `vercel env pull .env.preview --environment=preview` and `node --env-file=.env.preview scripts/db-migrate.mjs`, redeploy, verify, delete `.env.preview`.
5. After approval: migrate the production branch, set `RATINGS_ENABLED=true` for **Production**, redeploy. The six-month window starts with the first public request.
6. To pause collection: set `RATINGS_ENABLED=false` and redeploy (data is kept).
