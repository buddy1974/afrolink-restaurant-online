/**
 * IndexNow: key verification, URL validation, change detection, submission semantics and the
 * activation gate. Every network call is mocked — no test contacts IndexNow or production.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { siteUrl } from '../src/data/business.ts';
import { APEX, HOST, INDEXNOW_ENDPOINT, INDEXNOW_KEY, INDEXNOW_KEY_URL, PRIVATE_PREFIXES, SITE_URL } from '../scripts/seo/site.mjs';
import {
  checkPage,
  classifyRemoved,
  diffSnapshots,
  interpretResponse,
  nextState,
  parseSitemap,
  parseState,
  retryAfterMs,
  robotsDisallow,
  submitUrls,
  takeSnapshot,
  urlProblem,
  verifyKeyFile,
} from '../scripts/seo/indexnow.mjs';
import { fingerprint, pageFacts, stripDeploymentParams } from '../scripts/seo/page-facts.mjs';

/* ───────────── helpers ───────────── */

type Route = { status?: number; body?: string; headers?: Record<string, string> } | (() => never);
interface Call {
  url: string;
  init?: RequestInit;
}

/** fetch double: answers from a route table, records every call; a function route throws. */
function mockFetch(routes: Record<string, Route | Route[]>) {
  const calls: Call[] = [];
  const seen: Record<string, number> = {};
  const impl = async (input: string | URL, init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    const entry = routes[url];
    if (entry === undefined) return new Response('not found', { status: 404 });
    const n = (seen[url] = (seen[url] ?? -1) + 1);
    const r = Array.isArray(entry) ? entry[Math.min(n, entry.length - 1)] : entry;
    if (typeof r === 'function') r();
    const { status = 200, body = '', headers = {} } = r as Exclude<Route, () => never>;
    return new Response(status === 204 || status === 304 ? null : body, { status, headers });
  };
  return { impl: impl as typeof fetch, calls };
}

const page = (path: string, { canonical = `${SITE_URL}${path}`, robots = 'index, follow', text = 'Hello', title = 'T', extraHead = '' } = {}) =>
  `<!doctype html><html lang="de-DE"><head><title>${title}</title><meta name="description" content="D"><meta name="robots" content="${robots}"><link rel="canonical" href="${canonical}">${extraHead}</head><body><h1>${text}</h1></body></html>`;
const html = { 'content-type': 'text/html; charset=utf-8' };
const sitemap = (urls: string[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>`;
const robots = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
const noSleep = { sleep: async () => {} };

/* ───────────── key & identity ───────────── */

test('key: valid format, served from /<key>.txt at the site root, file holds exactly the key', () => {
  assert.match(INDEXNOW_KEY, /^[A-Za-z0-9-]{8,128}$/);
  assert.equal(INDEXNOW_KEY_URL, `${SITE_URL}/${INDEXNOW_KEY}.txt`);
  const file = `public/${INDEXNOW_KEY}.txt`;
  assert.ok(existsSync(file), 'key file is published from public/');
  assert.equal(readFileSync(file, 'utf8'), INDEXNOW_KEY, 'no whitespace or newline around the key');
  const keyLike = readdirSync('public').filter((f) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(f));
  assert.deepEqual(keyLike, [`${INDEXNOW_KEY}.txt`], 'exactly one key file (rotate by replacing, not adding)');
});

test('identity: tooling host matches the site configuration', () => {
  assert.equal(SITE_URL, siteUrl);
  assert.equal(HOST, new URL(siteUrl).hostname);
  assert.equal(`www.${APEX}`, HOST);
  assert.match(readFileSync('astro.config.mjs', 'utf8'), new RegExp(`site: '${SITE_URL}'`));
  assert.equal(INDEXNOW_ENDPOINT, 'https://api.indexnow.org/indexnow');
  assert.deepEqual(PRIVATE_PREFIXES, robotsDisallow(robots), 'private prefixes mirror robots.txt');
});

test('key file is built, never listed in the sitemap', { skip: !existsSync('dist/client/index.html') && 'build first' }, () => {
  assert.equal(readFileSync(`dist/client/${INDEXNOW_KEY}.txt`, 'utf8'), INDEXNOW_KEY);
  assert.ok(!readFileSync('dist/client/sitemap.xml', 'utf8').includes(INDEXNOW_KEY));
});

test('verifyKeyFile: OK only when the live file holds the key', async () => {
  const ok = mockFetch({ [INDEXNOW_KEY_URL]: { body: `${INDEXNOW_KEY}\n` } });
  assert.deepEqual(await verifyKeyFile({ fetchImpl: ok.impl }), { ok: true });
  const wrong = mockFetch({ [INDEXNOW_KEY_URL]: { body: 'something-else' } });
  assert.equal((await verifyKeyFile({ fetchImpl: wrong.impl })).ok, false);
  const missing = mockFetch({});
  assert.match((await verifyKeyFile({ fetchImpl: missing.impl })).problem!, /404/);
  assert.match((await verifyKeyFile({ key: 'short', fetchImpl: ok.impl })).problem!, /does not match/);
});

/* ───────────── URL validation ───────────── */

test('urlProblem: accepts canonical production page URLs only', () => {
  for (const ok of [`${SITE_URL}/`, `${SITE_URL}/speisekarte/egusi-soup/`, `${SITE_URL}/fr/carte/mackerel-fish-slices/`]) {
    assert.equal(urlProblem(ok), null, ok);
  }
  const bad: Record<string, RegExp> = {
    'http://www.afrolink-restaurant.online/': /HTTPS/,
    'https://afrolink-restaurant.online/': /wrong host/,
    'https://afrolink-restaurant-online.vercel.app/': /wrong host/,
    'https://afrolink-restaurant-online-git-discovery-ratings-2026-10-buddy1974s-projects.vercel.app/kontakt/': /wrong host/,
    'https://www.afrolink-restaurant.online/kontakt/?utm_source=x': /query/,
    'https://www.afrolink-restaurant.online/kontakt/#map': /fragment/,
    'https://www.afrolink-restaurant.online:8443/': /port|canonical form/,
    'https://user:pw@www.afrolink-restaurant.online/': /credentials/,
    'https://www.afrolink-restaurant.online/api/ratings/': /private route/,
    'https://www.afrolink-restaurant.online/admin/ratings/': /private route/,
    'https://www.afrolink-restaurant.online/Kontakt/': /path shape/,
    'https://www.afrolink-restaurant.online/kontakt': /path shape/,
    'https://www.afrolink-restaurant.online//kontakt/': /path shape/,
    'https://www.afrolink-restaurant.online/a/../kontakt/': /canonical form/,
    'https://WWW.afrolink-restaurant.online/': /canonical form/,
    'not a url': /valid URL/,
  };
  for (const [url, why] of Object.entries(bad)) assert.match(urlProblem(url) ?? 'accepted', why, url);
});

test('sitemap parsing: duplicates, foreign hosts and private routes are rejected', () => {
  const r = parseSitemap(sitemap([`${SITE_URL}/`, `${SITE_URL}/`, 'https://x.vercel.app/', `${SITE_URL}/api/ratings/`, `${SITE_URL}/kontakt/`]));
  assert.deepEqual(r.urls, [`${SITE_URL}/`, `${SITE_URL}/kontakt/`]);
  assert.equal(r.problems.length, 3);
  assert.deepEqual(parseSitemap('<html></html>').problems, ['not a sitemaps.org <urlset>']);
  assert.match(parseSitemap(sitemap([])).problems.join(), /no URLs/);
});

/* ───────────── page checks ───────────── */

test('checkPage: only 200 HTML pages with self-canonical, no noindex and valid JSON-LD', async () => {
  const u = `${SITE_URL}/kontakt/`;
  const cases: [Route, RegExp | null][] = [
    [{ body: page('/kontakt/'), headers: html }, null],
    [{ body: page('/kontakt/', { canonical: `${SITE_URL}/` }), headers: html }, /canonical/],
    [{ body: page('/kontakt/', { canonical: 'https://afrolink-restaurant-online.vercel.app/kontakt/' }), headers: html }, /canonical/],
    [{ body: page('/kontakt/', { robots: 'noindex, follow' }), headers: html }, /meta robots/],
    [{ body: page('/kontakt/'), headers: { ...html, 'x-robots-tag': 'noindex' } }, /X-Robots-Tag/],
    [{ body: page('/kontakt/', { extraHead: '<script type="application/ld+json">{bad</script>' }), headers: html }, /JSON-LD/],
    [{ status: 308, headers: { location: `${SITE_URL}/` } }, /HTTP 308/],
    [{ status: 404 }, /HTTP 404/],
    [{ body: '{}', headers: { 'content-type': 'application/json' } }, /content-type/],
    [() => { throw new Error('ECONNRESET'); }, /network error/],
  ];
  for (const [route, problem] of cases) {
    const r = await checkPage(u, { fetchImpl: mockFetch({ [u]: route }).impl });
    if (problem) assert.match(r.problem ?? 'none', problem);
    else assert.ok(r.fp && !r.problem, JSON.stringify(r));
  }
});

/* ───────────── fingerprints ───────────── */

test('fingerprint changes with anything a search engine reads, ignores build noise', () => {
  const base = page('/kontakt/', { text: 'Berzeliusstraße 7' });
  const fp = (h: string) => fingerprint(pageFacts(h));
  const same = [
    base.replace('<head>', '<head><link rel="stylesheet" href="/_astro/a.B1.css"><script type="module" src="/_astro/x.C2.js"></script>'),
    base.replace('<h1>', '<style>.x{}</style><script>var t=1</script><h1>'),
    base.replace('</h1>', '</h1><img src="/_astro/p.Ab.jpg?dpl=dpl_123" alt="Egusi">').replace('<h1>', '<h1>'),
  ];
  assert.equal(fp(same[0]), fp(base), 'CSS/JS bundles are not content');
  assert.equal(fp(same[1]), fp(base), 'inline scripts/styles are not content');
  assert.equal(
    fp(base.replace('</h1>', '</h1><img src="/_astro/p.Ab.jpg?dpl=dpl_123" alt="Egusi">')),
    fp(base.replace('</h1>', '</h1><img src="/_astro/p.Ab.jpg?dpl=dpl_999" alt="Egusi">')),
    'Vercel deployment parameter is ignored',
  );
  const changed = {
    text: base.replace('Berzeliusstraße 7', 'Berzeliusstraße 9'),
    title: base.replace('<title>T</title>', '<title>T2</title>'),
    description: base.replace('content="D"', 'content="D2"'),
    canonical: page('/kontakt/', { canonical: `${SITE_URL}/en/contact/`, text: 'Berzeliusstraße 7' }),
    hreflang: base.replace('</head>', `<link rel="alternate" hreflang="fr" href="${SITE_URL}/fr/contact/"></head>`),
    jsonLd: base.replace('</head>', '<script type="application/ld+json">{"@type":"Offer","price":"5.00"}</script></head>'),
    image: base.replace('</h1>', '</h1><img src="/_astro/new.Zz.jpg" alt="Egusi">'),
    alt: base.replace('</h1>', '</h1><img src="/_astro/p.Ab.jpg" alt="Fufu">'),
    robots: base.replace('index, follow', 'noindex'),
  };
  for (const [what, h] of Object.entries(changed)) assert.notEqual(fp(h), fp(base), what);
  const price = (p: string) => base.replace('</head>', `<script type="application/ld+json">{"@type":"Offer","price":"${p}"}</script></head>`);
  assert.notEqual(fp(price('5.00')), fp(price('6.00')), 'a price change is a content change');
});

test('stripDeploymentParams keeps other query parameters intact', () => {
  assert.equal(stripDeploymentParams('a.jpg?dpl=dpl_X'), 'a.jpg');
  assert.equal(stripDeploymentParams('a.jpg?dpl=dpl_X&w=2'), 'a.jpg?w=2');
  assert.equal(stripDeploymentParams('a.jpg?w=2&amp;dpl=dpl_X&amp;h=3'), 'a.jpg?w=2&amp;h=3');
  assert.equal(stripDeploymentParams('a.jpg?w=2&dpl=dpl_X 1x, b.jpg?dpl=dpl_X 2x'), 'a.jpg?w=2 1x, b.jpg 2x');
});

/* ───────────── change detection ───────────── */

test('diff: new, updated and deleted URLs; unchanged pages are not resent', () => {
  const prev = { [`${SITE_URL}/`]: 'a', [`${SITE_URL}/en/`]: 'b', [`${SITE_URL}/old/`]: 'c' };
  const cur = { [`${SITE_URL}/`]: 'a', [`${SITE_URL}/en/`]: 'B', [`${SITE_URL}/fr/`]: 'd' };
  assert.deepEqual(diffSnapshots(prev, cur), { added: [`${SITE_URL}/fr/`], removed: [`${SITE_URL}/old/`], changed: [`${SITE_URL}/en/`] });
  assert.deepEqual(diffSnapshots(cur, cur), { added: [], removed: [], changed: [] });
});

test('removed URLs are announced only once they are gone or redirected', async () => {
  const u = `${SITE_URL}/old/`;
  const verdict = async (route: Route) => (await classifyRemoved(u, { fetchImpl: mockFetch({ [u]: route }).impl })).submit;
  assert.equal(await verdict({ status: 404 }), true);
  assert.equal(await verdict({ status: 410 }), true);
  assert.equal(await verdict({ status: 308, headers: { location: `${SITE_URL}/new/` } }), true);
  assert.equal(await verdict({ status: 200 }), false, 'still live: only dropped from the sitemap');
  assert.equal(await verdict({ status: 302, headers: { location: '/' } }), false, 'temporary redirect is not a move');
  assert.equal(await verdict(() => { throw new Error('timeout'); }), false);
});

test('snapshot: any unreadable page is a problem, never a silent "removal"', async () => {
  const urls = [`${SITE_URL}/`, `${SITE_URL}/kontakt/`];
  const ok = mockFetch({
    [`${SITE_URL}/robots.txt`]: { body: robots },
    [`${SITE_URL}/sitemap.xml`]: { body: sitemap(urls) },
    [urls[0]]: { body: page('/'), headers: html },
    [urls[1]]: { body: page('/kontakt/'), headers: html },
  });
  const good = await takeSnapshot({ fetchImpl: ok.impl });
  assert.deepEqual(good.problems, []);
  assert.deepEqual(Object.keys(good.pages), urls);

  const flaky = mockFetch({
    [`${SITE_URL}/robots.txt`]: { body: robots },
    [`${SITE_URL}/sitemap.xml`]: { body: sitemap(urls) },
    [urls[0]]: { body: page('/'), headers: html },
    [urls[1]]: { status: 503 },
  });
  const bad = await takeSnapshot({ fetchImpl: flaky.impl });
  assert.equal(bad.problems.length, 1);
  assert.match(bad.problems[0], /kontakt.*503/);

  const noSitemap = await takeSnapshot({ fetchImpl: mockFetch({ [`${SITE_URL}/robots.txt`]: { body: robots } }).impl });
  assert.match(noSitemap.problems.join(), /sitemap HTTP 404/);
});

/* ───────────── submission ───────────── */

const urls = [`${SITE_URL}/`, `${SITE_URL}/en/`];

test('submit: one POST with host, key, keyLocation and de-duplicated URLs', async () => {
  const f = mockFetch({ [INDEXNOW_ENDPOINT]: { status: 200 } });
  const r = await submitUrls([...urls, urls[0]], { fetchImpl: f.impl, ...noSleep });
  assert.equal(f.calls.length, 1);
  const body = JSON.parse(String(f.calls[0].init!.body));
  assert.deepEqual(body, { host: HOST, key: INDEXNOW_KEY, keyLocation: INDEXNOW_KEY_URL, urlList: urls });
  assert.equal(f.calls[0].init!.method, 'POST');
  assert.match(String((f.calls[0].init!.headers as Record<string, string>)['content-type']), /application\/json; charset=utf-8/);
  assert.deepEqual(r.accepted, urls);
});

test('submit: refuses preview, apex, private and malformed URLs before any request', async () => {
  for (const bad of ['https://afrolink-restaurant-online.vercel.app/', 'https://afrolink-restaurant.online/', `${SITE_URL}/api/ratings/`, `${SITE_URL}/x?y=1`]) {
    const f = mockFetch({ [INDEXNOW_ENDPOINT]: { status: 200 } });
    await assert.rejects(submitUrls([...urls, bad], { fetchImpl: f.impl, ...noSleep }), /refusing to submit/);
    assert.equal(f.calls.length, 0, bad);
  }
});

test('submit: 202 is accepted (key validation pending), not "indexed"', async () => {
  const r = await submitUrls(urls, { fetchImpl: mockFetch({ [INDEXNOW_ENDPOINT]: { status: 202 } }).impl, ...noSleep });
  assert.deepEqual(r.accepted, urls);
  assert.match(r.results[0]!.meaning, /validation pending/);
});

test('submit: invalid key / URLs / format are final — no retry', async () => {
  for (const status of [400, 403, 422]) {
    const f = mockFetch({ [INDEXNOW_ENDPOINT]: { status } });
    const r = await submitUrls(urls, { fetchImpl: f.impl, ...noSleep });
    assert.equal(f.calls.length, 1, `HTTP ${status} is not retried`);
    assert.deepEqual(r.failed, urls);
    assert.deepEqual(r.accepted, []);
  }
});

test('submit: 429 is retried after Retry-After, then accepted', async () => {
  const waits: number[] = [];
  const f = mockFetch({ [INDEXNOW_ENDPOINT]: [{ status: 429, headers: { 'retry-after': '7' } }, { status: 200 }] });
  const r = await submitUrls(urls, { fetchImpl: f.impl, sleep: async (ms: number) => void waits.push(ms) });
  assert.equal(f.calls.length, 2);
  assert.deepEqual(waits, [7000]);
  assert.deepEqual(r.accepted, urls);
});

test('submit: network errors and 5xx retry with backoff, bounded by maxAttempts', async () => {
  const waits: number[] = [];
  const f = mockFetch({ [INDEXNOW_ENDPOINT]: () => { throw new TypeError('fetch failed: timeout'); } });
  const r = await submitUrls(urls, { fetchImpl: f.impl, sleep: async (ms: number) => void waits.push(ms), maxAttempts: 3, baseDelayMs: 100 });
  assert.equal(f.calls.length, 3);
  assert.deepEqual(waits, [100, 200]);
  assert.deepEqual(r.failed, urls);
  assert.match(r.results[0]!.meaning, /network error/);

  const g = mockFetch({ [INDEXNOW_ENDPOINT]: { status: 503 } });
  const r2 = await submitUrls(urls, { fetchImpl: g.impl, ...noSleep, maxAttempts: 4 });
  assert.equal(g.calls.length, 4);
  assert.equal(r2.results[0]!.attempts, 4);
});

test('submit: partial batch failure reports exactly the failed URLs', async () => {
  const f = mockFetch({ [INDEXNOW_ENDPOINT]: [{ status: 200 }, { status: 400 }] });
  const r = await submitUrls([...urls, `${SITE_URL}/fr/`], { fetchImpl: f.impl, ...noSleep, batchSize: 2 });
  assert.deepEqual(r.accepted, urls);
  assert.deepEqual(r.failed, [`${SITE_URL}/fr/`]);
});

test('response semantics and Retry-After parsing', () => {
  assert.deepEqual([200, 202, 400, 403, 422, 429, 500, 503].map((s) => interpretResponse(s).ok), [true, true, false, false, false, false, false, false]);
  assert.deepEqual([400, 403, 422, 429, 500].map((s) => interpretResponse(s).retry), [false, false, false, true, true]);
  assert.equal(retryAfterMs('3'), 3000);
  assert.equal(retryAfterMs('9999'), 120_000, 'bounded');
  assert.equal(retryAfterMs(new Date(Date.now() + 5000).toUTCString(), Date.now()) !== null, true);
  assert.equal(retryAfterMs('garbage'), null);
  assert.equal(retryAfterMs(null), null);
});

/* ───────────── state & idempotency ───────────── */

test('state advances only for accepted URLs; a rerun sends nothing; failures are resent', () => {
  const prev = nextState(null, { a: '1', b: '1' }, { accepted: ['a', 'b'], acceptedRemovals: [] });
  const live = { a: '2', b: '2', c: '1' };
  const d = diffSnapshots(prev.pages, live);
  assert.deepEqual(d, { added: ['c'], removed: [], changed: ['a', 'b'] });
  // b failed to submit: it must stay "changed" for the next run.
  const after = nextState(prev, live, { accepted: ['a', 'c'], acceptedRemovals: [] });
  assert.deepEqual(diffSnapshots(after.pages, live), { added: [], removed: [], changed: ['b'] });
  const done = nextState(after, live, { accepted: ['b'], acceptedRemovals: [] });
  assert.deepEqual(diffSnapshots(done.pages, live), { added: [], removed: [], changed: [] }, 'idempotent');
  // Removal accepted → gone from state; not accepted → retried.
  const s = nextState(done, { a: '2' }, { accepted: [], acceptedRemovals: ['c'] });
  assert.deepEqual(Object.keys(s.pages), ['a', 'b']);
});

test('state parsing rejects missing, corrupt, foreign or old-version state', () => {
  const good = JSON.stringify(nextState(null, { [`${SITE_URL}/`]: 'x' }, { accepted: [`${SITE_URL}/`], acceptedRemovals: [] }));
  assert.ok(parseState(good));
  assert.equal(parseState(''), null);
  assert.equal(parseState('{not json'), null);
  assert.equal(parseState(JSON.stringify({ ...JSON.parse(good), host: 'evil.example' })), null);
  assert.equal(parseState(JSON.stringify({ ...JSON.parse(good), version: 0 })), null);
});

/* ───────────── activation gate ───────────── */

test('CLI: usage errors exit 2 and nothing is contacted', () => {
  const r = spawnSync(process.execPath, ['scripts/indexnow.mjs', 'launch'], { encoding: 'utf8' });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /unknown command/);
  const r2 = spawnSync(process.execPath, ['scripts/indexnow.mjs', 'bootstrap'], { encoding: 'utf8' });
  assert.equal(r2.status, 2);
});

test('CLI: submission requires both --submit and INDEXNOW_ENABLED=true', () => {
  const src = readFileSync('scripts/indexnow.mjs', 'utf8');
  assert.match(src, /const enabled = process\.env\.INDEXNOW_ENABLED === 'true';/);
  assert.match(src, /if \(opts\.cmd === 'plan' \|\| !opts\.submit \|\| !enabled\)/);
  // The only call to submitUrls comes after that gate and after the key-file check.
  const gate = src.indexOf("if (opts.cmd === 'plan' || !opts.submit || !enabled)");
  assert.ok(gate > 0 && src.indexOf('verifyKeyFile()', gate) > gate && src.indexOf('submitUrls(toSubmit', gate) > src.indexOf('verifyKeyFile()', gate));
  // An incomplete snapshot aborts before anything else.
  assert.ok(src.indexOf('if (snap.problems.length)') < gate);
});

test('workflow: production deployments only, gated by the repository variable, state saved only on acceptance', () => {
  const wf = readFileSync('.github/workflows/indexnow.yml', 'utf8');
  assert.match(wf, /github\.event\.deployment_status\.state == 'success'/);
  assert.match(wf, /github\.event\.deployment\.environment == 'Production'/);
  assert.match(wf, /INDEXNOW_ENABLED: \$\{\{ vars\.INDEXNOW_ENABLED \}\}/);
  assert.match(wf, /if \[ "\$INDEXNOW_ENABLED" != "true" \] && \[ "\$MODE" != "plan" \]; then[\s\S]*?MODE=plan/);
  assert.match(wf, /if \[ -s "\$STATE_OUT" \]/);
  assert.match(wf, /cancel-in-progress: false/);
  assert.match(wf, /permissions:\s*\n\s*contents: write/);
  assert.doesNotMatch(wf, /secrets\./, 'no secrets are needed or exposed');
  const mon = readFileSync('.github/workflows/production-monitor.yml', 'utf8');
  assert.match(mon, /contents: read/);
});

test('vercel.json: noindex for *.vercel.app only, never for the canonical host', () => {
  const cfg = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const rule = cfg.headers.find((h: { headers: { key: string }[] }) => h.headers.some((x) => x.key === 'X-Robots-Tag'));
  assert.ok(rule);
  assert.deepEqual(rule.headers, [{ key: 'X-Robots-Tag', value: 'noindex' }]);
  const re = new RegExp(`^${rule.has[0].value}$`);
  assert.equal(rule.has[0].type, 'host');
  for (const h of ['afrolink-restaurant-online.vercel.app', 'afrolink-restaurant-online-git-x-buddy1974s-projects.vercel.app']) assert.ok(re.test(h), h);
  for (const h of [HOST, APEX, 'vercel.app.example.com']) assert.ok(!re.test(h), h);
});

test('git: the IndexNow key is the only new public text file and contains no secret material', () => {
  const tracked = execFileSync('git', ['ls-files', '--others', '--cached', '--exclude-standard', 'public'], { encoding: 'utf8' }).split('\n');
  assert.ok(tracked.includes(`public/${INDEXNOW_KEY}.txt`));
  assert.match(readFileSync(`public/${INDEXNOW_KEY}.txt`, 'utf8'), /^[0-9a-f]{32}$/);
});
