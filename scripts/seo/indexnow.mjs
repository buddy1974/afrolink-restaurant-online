/**
 * IndexNow change detection and submission (protocol: https://www.indexnow.org/documentation).
 *
 * Model
 * - A *snapshot* is the fingerprint (scripts/seo/page-facts.mjs) of every URL in the live
 *   production sitemap.
 * - The *state* is the snapshot as it was last successfully announced to IndexNow.
 * - A run compares the live snapshot with the state and announces only the difference:
 *   added URLs, removed URLs (once they answer 404/410/redirect) and URLs whose content,
 *   metadata, canonical/hreflang, structured data or images changed — per language, because
 *   each localized URL has its own fingerprint.
 * - The state advances only for URLs the endpoint accepted, so a failed or skipped run never
 *   loses a change: the next run (next deployment or the daily reconciliation) sends it again.
 *
 * Everything that touches the network takes an injectable `fetch`/`sleep`, so tests never
 * contact real endpoints.
 */
import { pageFacts, fingerprint } from './page-facts.mjs';
import { HOST, INDEXNOW_ENDPOINT, INDEXNOW_KEY, INDEXNOW_KEY_URL, PRIVATE_PREFIXES, SITE_URL } from './site.mjs';

export const STATE_VERSION = 1;
/** Protocol limit per POST (indexnow.org/documentation). */
export const MAX_URLS_PER_REQUEST = 10_000;
const KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;

/* ───────────────────────────── URL validation ───────────────────────────── */

/**
 * Why `url` must not be submitted, or null if it is a well-formed public production URL.
 * Page-level checks (status, canonical, noindex) happen in `checkPage`.
 */
export function urlProblem(url, { host = HOST, disallow = PRIVATE_PREFIXES } = {}) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return 'not a valid URL';
  }
  if (u.href !== url) return `not in canonical form (normalizes to ${u.href})`;
  if (u.protocol !== 'https:') return 'not HTTPS';
  if (u.hostname !== host) return `wrong host ${u.hostname}`;
  if (u.port) return 'explicit port';
  if (u.username || u.password) return 'credentials in URL';
  if (u.search) return 'query string';
  if (u.hash) return 'fragment';
  if (!/^\/(?:[a-z0-9-]+\/)*$/.test(u.pathname)) return `unexpected path shape ${u.pathname}`;
  const blocked = disallow.find((p) => u.pathname.startsWith(p));
  if (blocked) return `private route ${blocked}`;
  return null;
}

/** robots.txt `Disallow` prefixes for `User-agent: *` (the only group this site uses). */
export function robotsDisallow(robotsTxt) {
  const out = [];
  let applies = false;
  for (const raw of robotsTxt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const [, field, value] = m;
    if (/^user-agent$/i.test(field)) applies = value.trim() === '*';
    else if (applies && /^disallow$/i.test(field) && value.trim()) out.push(value.trim());
  }
  return out;
}

/** <loc> entries of a sitemap, with the problems found (duplicates, foreign hosts …). */
export function parseSitemap(xml, opts = {}) {
  if (!/<urlset\b[^>]*xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(xml)) {
    return { urls: [], problems: ['not a sitemaps.org <urlset>'] };
  }
  const locs = [...xml.matchAll(/<loc>\s*([^<]*?)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  const problems = [];
  const seen = new Set();
  const urls = [];
  for (const loc of locs) {
    const why = urlProblem(loc, opts);
    if (why) problems.push(`${loc}: ${why}`);
    else if (seen.has(loc)) problems.push(`${loc}: duplicate`);
    else {
      seen.add(loc);
      urls.push(loc);
    }
  }
  if (!locs.length) problems.push('sitemap lists no URLs');
  return { urls, problems };
}

/* ───────────────────────────── page checks ───────────────────────────── */

/**
 * Fetch one page without following redirects and decide whether it may be announced.
 * Returns { url, status, fp?, problem? }.
 */
export async function checkPage(url, { fetchImpl = fetch, timeoutMs = 20_000 } = {}) {
  let res;
  try {
    res = await fetchImpl(url, { redirect: 'manual', signal: AbortSignal.timeout(timeoutMs), headers: { 'user-agent': 'afrolink-indexnow/1 (+https://www.afrolink-restaurant.online/)' } });
  } catch (e) {
    return { url, status: 0, problem: `network error: ${e.message}` };
  }
  const status = res.status;
  if (status !== 200) {
    await res.body?.cancel?.();
    return { url, status, location: res.headers.get('location') ?? undefined, problem: `HTTP ${status}` };
  }
  const type = res.headers.get('content-type') ?? '';
  if (!/text\/html/i.test(type)) return { url, status, problem: `content-type ${type}` };
  const xRobots = res.headers.get('x-robots-tag') ?? '';
  if (/noindex/i.test(xRobots)) return { url, status, problem: `X-Robots-Tag ${xRobots}` };
  const facts = pageFacts(await res.text());
  if (facts.robots && /noindex/i.test(facts.robots)) return { url, status, problem: `meta robots ${facts.robots}` };
  if (facts.canonical.length !== 1 || facts.canonical[0] !== url) return { url, status, problem: `canonical ${JSON.stringify(facts.canonical)}` };
  if (facts.jsonLdErrors.length) return { url, status, problem: `invalid JSON-LD: ${facts.jsonLdErrors[0]}` };
  return { url, status, fp: fingerprint(facts) };
}

/** Run `fn` over `items` with at most `limit` in flight; results keep input order. */
export async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

/**
 * Live snapshot of production: sitemap → validated URLs → fingerprint per page.
 * Any sitemap problem or page that cannot be announced is returned in `problems`; the caller
 * must not advance the state from a snapshot with problems (it could hide changes).
 */
export async function takeSnapshot({ siteUrl = SITE_URL, fetchImpl = fetch, concurrency = 4, timeoutMs } = {}) {
  const problems = [];
  const robotsRes = await fetchImpl(`${siteUrl}/robots.txt`, { signal: AbortSignal.timeout(20_000) });
  const robots = robotsRes.ok ? await robotsRes.text() : '';
  if (!robotsRes.ok) problems.push(`robots.txt HTTP ${robotsRes.status}`);
  if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) problems.push('robots.txt does not reference the sitemap');
  const disallow = [...new Set([...PRIVATE_PREFIXES, ...robotsDisallow(robots)])];

  const smRes = await fetchImpl(`${siteUrl}/sitemap.xml`, { signal: AbortSignal.timeout(20_000) });
  if (!smRes.ok) return { pages: {}, problems: [...problems, `sitemap HTTP ${smRes.status}`] };
  const sm = parseSitemap(await smRes.text(), { host: new URL(siteUrl).hostname, disallow });
  problems.push(...sm.problems);

  const checks = await mapLimit(sm.urls, concurrency, (u) => checkPage(u, { fetchImpl, timeoutMs }));
  const pages = {};
  for (const c of checks) {
    if (c.problem) problems.push(`${c.url}: ${c.problem}`);
    else pages[c.url] = c.fp;
  }
  return { pages, problems, urlCount: sm.urls.length };
}

/* ───────────────────────────── diff ───────────────────────────── */

/** URLs added, removed and changed between the announced state and the live snapshot. */
export function diffSnapshots(previous, current) {
  const prev = previous ?? {};
  const added = Object.keys(current).filter((u) => !(u in prev)).sort();
  const removed = Object.keys(prev).filter((u) => !(u in current)).sort();
  const changed = Object.keys(current).filter((u) => u in prev && prev[u] !== current[u]).sort();
  return { added, removed, changed };
}

/**
 * Decide what a removed URL means now. Per indexnow.org/faq, 404/410 pages and redirects
 * should be submitted so engines drop or move them. A removed URL that still answers 200 is
 * only out of the sitemap — announcing it would mislead, so it is reported instead.
 */
export async function classifyRemoved(url, { fetchImpl = fetch } = {}) {
  try {
    const res = await fetchImpl(url, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(20_000) });
    if ([404, 410].includes(res.status)) return { url, submit: true, reason: `HTTP ${res.status}` };
    if ([301, 308].includes(res.status)) return { url, submit: true, reason: `moved to ${res.headers.get('location')}` };
    return { url, submit: false, reason: `still answers HTTP ${res.status} — left out of the sitemap only` };
  } catch (e) {
    return { url, submit: false, reason: `network error: ${e.message}` };
  }
}

/* ───────────────────────────── submission ───────────────────────────── */

/** IndexNow response semantics (indexnow.org/documentation). */
export function interpretResponse(status) {
  if (status === 200) return { ok: true, retry: false, meaning: 'URLs received' };
  if (status === 202) return { ok: true, retry: false, meaning: 'URLs received; key validation pending' };
  if (status === 400) return { ok: false, retry: false, meaning: 'bad request (invalid format)' };
  if (status === 403) return { ok: false, retry: false, meaning: 'key not valid (key file missing or content differs)' };
  if (status === 422) return { ok: false, retry: false, meaning: 'URLs do not belong to the host, or key does not match the schema' };
  if (status === 429) return { ok: false, retry: true, meaning: 'too many requests' };
  if (status >= 500) return { ok: false, retry: true, meaning: `server error ${status}` };
  return { ok: false, retry: false, meaning: `unexpected status ${status}` };
}

/** Seconds from a Retry-After header (delta or HTTP date), bounded; null if absent/invalid. */
export function retryAfterMs(header, now = Date.now()) {
  if (!header) return null;
  const secs = Number(header);
  const ms = Number.isFinite(secs) ? secs * 1000 : Date.parse(header) - now;
  return Number.isFinite(ms) && ms >= 0 ? Math.min(ms, 120_000) : null;
}

/** Key file is live and holds exactly the key (otherwise every submission would be 403). */
export async function verifyKeyFile({ key = INDEXNOW_KEY, keyUrl = INDEXNOW_KEY_URL, fetchImpl = fetch } = {}) {
  if (!KEY_PATTERN.test(key)) return { ok: false, problem: 'key does not match [A-Za-z0-9-]{8,128}' };
  try {
    const res = await fetchImpl(keyUrl, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
    if (res.status !== 200) return { ok: false, problem: `${keyUrl} answers HTTP ${res.status}` };
    const body = (await res.text()).trim();
    return body === key ? { ok: true } : { ok: false, problem: `${keyUrl} does not contain the key` };
  } catch (e) {
    return { ok: false, problem: `${keyUrl}: ${e.message}` };
  }
}

/**
 * POST the URLs in batches with bounded retries (429/5xx/network only, exponential backoff,
 * Retry-After honoured). Returns per-batch results; `accepted` lists URLs in batches the
 * endpoint answered 200/202 — an acceptance, not an indexing guarantee.
 */
export async function submitUrls(urls, {
  endpoint = INDEXNOW_ENDPOINT,
  host = HOST,
  key = INDEXNOW_KEY,
  keyLocation = INDEXNOW_KEY_URL,
  fetchImpl = fetch,
  sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
  maxAttempts = 4,
  baseDelayMs = 2_000,
  timeoutMs = 30_000,
  batchSize = MAX_URLS_PER_REQUEST,
  log = () => {},
} = {}) {
  const unique = [...new Set(urls)];
  const bad = unique.map((u) => [u, urlProblem(u, { host })]).filter(([, p]) => p);
  if (bad.length) throw new Error(`refusing to submit invalid URLs: ${bad.map(([u, p]) => `${u} (${p})`).join('; ')}`);
  const batches = [];
  for (let i = 0; i < unique.length; i += Math.min(batchSize, MAX_URLS_PER_REQUEST)) batches.push(unique.slice(i, i + batchSize));

  const results = [];
  for (const [n, batch] of batches.entries()) {
    const body = JSON.stringify({ host, key, keyLocation, urlList: batch });
    let outcome;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      let status = 0;
      let wait = null;
      let meaning;
      try {
        const res = await fetchImpl(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json; charset=utf-8' },
          body,
          signal: AbortSignal.timeout(timeoutMs),
        });
        status = res.status;
        wait = retryAfterMs(res.headers.get('retry-after'));
        await res.body?.cancel?.();
        ({ meaning } = interpretResponse(status));
      } catch (e) {
        meaning = `network error: ${e.message}`;
      }
      const verdict = status ? interpretResponse(status) : { ok: false, retry: true };
      log(`batch ${n + 1}/${batches.length} (${batch.length} URLs) attempt ${attempt}: ${status || 'no response'} ${meaning}`);
      outcome = { batch: n + 1, urls: batch, status, meaning, attempts: attempt, ok: verdict.ok };
      if (verdict.ok || !verdict.retry || attempt === maxAttempts) break;
      await sleep(wait ?? baseDelayMs * 2 ** (attempt - 1));
    }
    results.push(outcome);
  }
  return {
    results,
    accepted: results.filter((r) => r.ok).flatMap((r) => r.urls),
    failed: results.filter((r) => !r.ok).flatMap((r) => r.urls),
  };
}

/* ───────────────────────────── state ───────────────────────────── */

/** Parse a stored state; null for missing/corrupt/foreign state (never guessed). */
export function parseState(text, { host = HOST } = {}) {
  if (!text?.trim()) return null;
  try {
    const s = JSON.parse(text);
    if (s.version !== STATE_VERSION || s.host !== host || typeof s.pages !== 'object' || !s.pages) return null;
    return s;
  } catch {
    return null;
  }
}

/** New state: previous state + accepted changes. Unannounced changes keep their old value. */
export function nextState(previous, current, { accepted, acceptedRemovals, commit = null, now = new Date() }) {
  const pages = { ...(previous?.pages ?? {}) };
  for (const u of accepted) if (u in current) pages[u] = current[u];
  for (const u of acceptedRemovals) delete pages[u];
  return { version: STATE_VERSION, host: HOST, updatedAt: now.toISOString(), commit, pages: Object.fromEntries(Object.entries(pages).sort()) };
}
