# IndexNow, production monitor and SEO regression checks

_Added 2026-10-10 (branch `discovery-ratings-2026-10`). Status: **implemented and tested, not activated.**_

Search engines learn about changed pages in three ways here. Only the third is new:
1. The sitemap is submitted in Google Search Console and Bing Webmaster Tools. Both re-read it on their own schedule.
2. Manual URL submissions in the consoles (used once on 2026-10-10; see docs/seo.md).
3. **IndexNow:**
   - a notification sent when production content really changes;
   - shared by Bing, Yandex, Seznam, Naver, Yep and the other participating engines;
   - **Google does not use IndexNow**.

IndexNow is a *discovery hint*. An accepted submission (HTTP 200/202) means the engine received the URLs, **not** that they are or will be indexed.

## Protocol facts (checked 2026-10-10 against indexnow.org/documentation and /faq)
- **Key:** 8–128 characters `[A-Za-z0-9-]`, served at `https://<host>/<key>.txt`, with the file containing exactly the key.
- **Scope:** a key file at the root covers every URL on that host. Each host (www vs apex) is separate; only `www` is ever submitted.
- **Request:** `POST https://api.indexnow.org/indexnow`, JSON `{ host, key, keyLocation, urlList }`, at most 10,000 URLs per request.
  - The shared endpoint forwards to all participating engines.
- **Responses:**

  | Code | Meaning |
  |---|---|
  | 200 | received |
  | 202 | received, key validation pending (normal on the first request) |
  | 400 | bad format |
  | 403 | key not valid |
  | 422 | URLs not on the host, or the key does not match the schema |
  | 429 | too many requests |

- **What to submit:** added, updated **and deleted** URLs; deleted means 404/410, and redirected URLs count too. Don't resend unchanged URLs, and wait at least 5 minutes before resending a changed one.
- **Security model:** the key is **public by design**. It proves control of the host because only the site owner can publish `/<key>.txt`.
  - It is not a credential for anything else, so it is committed in the repository (`scripts/seo/site.mjs`, `public/<key>.txt`).
  - Anyone could use it to submit URLs *of this host*. The worst case is a harmless notification about our own pages.

## Components
| File | Role |
|---|---|
| `public/<key>.txt` | Key verification file (exact key, no newline). Deployed like any static file. |
| `scripts/seo/site.mjs` | Host, key, endpoint and private prefixes. A test keeps it equal to `src/data/business.ts` and `astro.config.mjs`. |
| `scripts/seo/page-facts.mjs` | Extracts what search engines read from a page, and computes its fingerprint (sha256). |
| `scripts/seo/indexnow.mjs` | URL validation, live snapshot, diff, removed-URL handling, submission with bounded retries, state. |
| `scripts/indexnow.mjs` | CLI: `plan`, `run`, `bootstrap`, `verify-key`. |
| `.github/workflows/indexnow.yml` | Triggers and gate; keeps state in the `indexnow-state` tag. |
| `scripts/seo/production-checks.mjs`, `scripts/check-production.mjs`, `.github/workflows/production-monitor.yml` | Hourly DNS, TLS, HTTP and IndexNow-key watch. |
| `.github/workflows/ci.yml` | `npm run verify` (lint, typecheck, build, all tests) on every push. |
| `tests/indexnow.test.ts`, `tests/production-checks.test.ts`, `tests/seo-integrity.test.ts` | 44 tests, network fully mocked. |

## How change detection works
- **Fingerprint:** for every URL in the **live** production sitemap, the tool fingerprints:
  - title, description, robots, canonical, hreflang;
  - Open Graph, Twitter and restaurant tags;
  - parsed JSON-LD (prices included), headings;
  - image `src`/`alt`, and visible text.
- **What it ignores:**
  - CSS/JS bundles, inline scripts and styles;
  - Vercel's per-deployment `?dpl=` asset parameter (Skew Protection).
- **Evidence that it is stable:** the fingerprint of production (commit 13ceb78, built by Vercel) equals the fingerprint of a local build for **141/141** pages. Two consecutive production snapshots also matched.
- **The state:**
  - The state is the snapshot as it was last *accepted* by IndexNow. It is stored as JSON in the message of the annotated git tag `indexnow-state`, which points at the commit that was live.
  - No database, branch, queue or service is involved, and Vercel does not deploy tags.
- **A run:**
  1. Takes a live snapshot. **If any sitemap URL cannot be read, it aborts with no submission and no state change.** Otherwise a temporarily unreadable page would look "deleted".
  2. Diffs the snapshot against the state:
     - **added:** new URLs;
     - **changed:** any fingerprint difference, i.e. content, metadata, canonical/hreflang, structured data, images, in any language;
     - **removed:** URLs no longer in the sitemap. They are announced only if they now answer 404/410/301/308. A URL that still answers 200 is reported, not announced.
  3. Validates every URL:
     - HTTPS, exact host `www.afrolink-restaurant.online`;
     - no port, credentials, query or fragment;
     - lowercase `/…/` path shape;
     - not `/admin/`, `/api/` or anything robots.txt disallows;
     - de-duplicated.
  4. Checks every page announced as added or changed: HTTP 200 without redirect, HTML, `canonical` = the URL itself, no `noindex` (meta or header), valid JSON-LD.
  5. Checks that the live key file holds the key, then POSTs.
     - Retries happen only on 429, 5xx and network errors: at most 4 attempts with exponential backoff, honouring `Retry-After` (capped at 120 s).
     - 400/403/422 are final.
  6. Advances the state **only for accepted URLs**. Anything not accepted is sent again on the next run.

**Why it does not miss changes:**
- The baseline is "what the engines were last told", never "what was deployed".
- A failed deployment leaves production unchanged, so there is nothing to send.
- A failed or skipped run leaves the state unchanged, so the next run sends the changes.
- A deployment notification that arrives too early is covered twice: the job waits 60 s, and a daily reconciliation run compares live content against the state.
- A redeploy of identical content sends nothing (the runs are idempotent).
- Runs are serialized (`concurrency: indexnow`).

## Triggers
| Trigger | When | Effect |
|---|---|---|
| `deployment_status` | Vercel reports a **successful `Production`** deployment. Preview deployments are ignored. | `run` after 60 s |
| `schedule` | daily 05:23 UTC | `run` (reconciliation) |
| `workflow_dispatch` | manual | `plan` / `run` / `bootstrap` / `full` |

## Activation gate (not activated)
- Submitting needs **both** the repository variable `INDEXNOW_ENABLED=true` **and** `--submit` (the workflow passes it for `run` and `full`).
- Without the variable, every trigger runs a **dry-run plan**: it logs what would be sent and changes nothing.
- The workflows only exist on `main` after a merge. Until then they don't run at all, except CI, which runs on every push.

## Activation procedure (after owner approval)
1. Merge the reviewed branch into `main`. Vercel deploys production, which publishes `/<key>.txt` and the `vercel.app` noindex header.
2. Check: `node scripts/indexnow.mjs verify-key` → `key file OK`, and `node scripts/check-production.mjs` → 0 fail.
3. GitHub → Settings → Secrets and variables → Actions → **Variables**. Set these as *variables*, not secrets:
   - `DNS_VERIFICATION_RECORDS` = `<google-name>=<google-target>,<bing-name>=<bing-target>`. Copy the values from `vercel dns ls afrolink-restaurant.online`; they are DNS-public but kept out of the repository.
   - `INDEXNOW_ENABLED` = `true`.
4. Actions → IndexNow → *Run workflow* → choose **one** mode:
   - `full`: announces all 141 URLs once (one request). Recommended: Bing has 48 manual submissions, the other engines nothing.
   - `bootstrap`: records the live site without sending anything.
5. Check the run summary (HTTP 200 or 202 per batch) and that the tag `indexnow-state` exists (`git ls-remote --tags origin indexnow-state`).
6. Bing Webmaster Tools → IndexNow shows received URLs within about a day.

## Rollback
- **Stop submissions immediately:** delete the variable `INDEXNOW_ENABLED`, or set it to anything else. The next run is a dry run.
- **Stop all runs:** Actions → IndexNow → ⋯ → *Disable workflow*.
- **Reset the baseline:** `git push origin :refs/tags/indexnow-state`. The next run then needs `bootstrap` or `full`.
- **Rotate the key:**
  1. Add the new `public/<key>.txt`, change `INDEXNOW_KEY`, and deploy.
  2. Then remove the old file.
  3. The tests allow exactly one key file, so do the swap in one commit; the new key validates on its first use (202).
- **Remove IndexNow entirely:** revert the commit. Nothing else depends on it.

## Production monitor
`node scripts/check-production.mjs` runs locally, and hourly on GitHub (`production-monitor.yml`) after a merge. It is read-only. A failing run makes GitHub e-mail the repository owner.

| Check | Fails when |
|---|---|
| Nameservers | not exactly ns1/ns2.vercel-dns.com |
| `www` and apex A | empty or NXDOMAIN at Cloudflare DoH, Google DoH **or the authoritative Vercel nameservers queried directly**. This is the R-032 signature: `www` returned NODATA everywhere. |
| AAAA | only *warns* if IPv6 answers appear (the domain is IPv4-only today) |
| Verification CNAMEs | a Google or Bing record from `DNS_VERIFICATION_RECORDS` is missing or points elsewhere (logs show masked tokens) |
| TLS | untrusted chain, the certificate does not cover `www`, or under 7 days left (warns under 21) |
| Redirects | `http`/apex → `https://www` not via permanent 301/308, more than 2 hops, or the wrong target (path kept) |
| Homepage | not 200, canonical not `/`, or `noindex` |
| Sitemap | not 200, not a valid urlset, foreign/duplicate/private URLs, or fewer than 100 URLs |
| robots.txt | missing sitemap line, or `Disallow: /` |
| 404 | an unknown page answers anything but 404 (soft 404) |
| IndexNow key | the key file is missing or wrong (expected automatically once the checkout contains it) |
| `vercel.app` alias | no `X-Robots-Tag: noindex` (expected once `vercel.json` contains the rule) |

No IP address is pinned anywhere. Vercel's anycast addresses change, and the checks assert behaviour, not values.
