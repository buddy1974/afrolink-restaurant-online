/**
 * Production monitor (scripts/check-production.mjs) against simulated DNS/HTTP/TLS — including
 * a replay of incident R-032 (www answered NODATA after a record was created below it).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APEX, HOST, INDEXNOW_KEY, INDEXNOW_KEY_URL, SITE_URL } from '../scripts/seo/site.mjs';
import { mask, parseVerificationRecords, runChecks, sanCovers } from '../scripts/seo/production-checks.mjs';

type Answer = { status: number; answers: string[] };
const ok = (answers: string[]): Answer => ({ status: 0, answers });

function healthyDns(overrides: Record<string, Answer> = {}) {
  const table: Record<string, Answer> = {
    [`${APEX} NS`]: ok(['ns1.vercel-dns.com', 'ns2.vercel-dns.com']),
    [`${HOST} A`]: ok(['216.150.1.1', '216.150.16.1']),
    [`${APEX} A`]: ok(['216.150.1.65']),
    [`${HOST} AAAA`]: ok([]),
    [`${APEX} AAAA`]: ok([]),
    [`tok123456789.${APEX} CNAME`]: ok(['verify.bing.com']),
    ...overrides,
  };
  return async (_provider: string, name: string, type: string) => table[`${name} ${type}`] ?? ok([]);
}

const page = (canonical: string) => `<!doctype html><html><head><link rel="canonical" href="${canonical}"><meta name="robots" content="index, follow"></head><body><h1>x</h1></body></html>`;
const sitemap = (n: number) =>
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Array.from({ length: n }, (_, i) => `<url><loc>${SITE_URL}/p${i}/</loc></url>`).join('')}</urlset>`;

function healthyHttp(overrides: Record<string, () => Response> = {}) {
  const routes: Record<string, () => Response> = {
    [`http://${APEX}/`]: () => new Response(null, { status: 308, headers: { location: `https://${APEX}/` } }),
    [`https://${APEX}/`]: () => new Response(null, { status: 308, headers: { location: `${SITE_URL}/` } }),
    [`http://${HOST}/`]: () => new Response(null, { status: 308, headers: { location: `${SITE_URL}/` } }),
    [`https://${APEX}/kontakt/`]: () => new Response(null, { status: 308, headers: { location: `${SITE_URL}/kontakt/` } }),
    [`${SITE_URL}/`]: () => new Response(page(`${SITE_URL}/`), { status: 200, headers: { 'content-type': 'text/html' } }),
    [`${SITE_URL}/kontakt/`]: () => new Response(page(`${SITE_URL}/kontakt/`), { status: 200 }),
    [`${SITE_URL}/sitemap.xml`]: () => new Response(sitemap(141), { status: 200 }),
    [`${SITE_URL}/robots.txt`]: () => new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, { status: 200 }),
    [INDEXNOW_KEY_URL]: () => new Response(INDEXNOW_KEY, { status: 200 }),
    'https://afrolink-restaurant-online.vercel.app/': () => new Response('', { status: 200, headers: { 'x-robots-tag': 'noindex' } }),
    ...overrides,
  };
  return (async (url: string | URL) => (routes[String(url)] ?? (() => new Response('nf', { status: 404 })))()) as typeof fetch;
}

const goodTls = async () => ({ authorized: true, error: null, validTo: new Date(Date.now() + 80 * 86_400_000).toISOString(), altNames: [`*.${APEX}`, APEX] });

const run = (o: Record<string, unknown> = {}) =>
  runChecks({
    doh: healthyDns(),
    authResolve: async () => ['216.150.1.1'],
    fetchImpl: healthyHttp(),
    getTls: goodTls,
    verificationRecords: [{ name: 'tok123456789', target: 'verify.bing.com' }],
    expectIndexNowKey: true,
    expectAliasNoindex: true,
    ...o,
  });
const failures = (rs: { check: string; status: string }[]) => rs.filter((r) => r.status === 'fail').map((r) => r.check);

test('healthy production passes every check', async () => {
  const rs = await run();
  assert.deepEqual(failures(rs), []);
  assert.ok(rs.length >= 20);
  assert.ok(rs.every((r) => r.status === 'pass'), JSON.stringify(rs.filter((r) => r.status !== 'pass')));
});

test('incident R-032 replay: www NODATA everywhere is caught (public and authoritative)', async () => {
  const rs = await run({
    doh: healthyDns({ [`${HOST} A`]: ok([]) }),
    authResolve: async (_ns: string, name: string) => {
      if (name === HOST) throw Object.assign(new Error(`queryA ENODATA ${HOST}`), { code: 'ENODATA' });
      return ['216.150.1.1'];
    },
    fetchImpl: (async () => {
      throw new TypeError('fetch failed: getaddrinfo ENOTFOUND www.afrolink-restaurant.online');
    }) as typeof fetch,
  });
  const f = failures(rs);
  for (const c of [`dns: ${HOST} A via cloudflare`, `dns: ${HOST} A via google`, `dns: ${HOST} A at ns1.vercel-dns.com`, `dns: ${HOST} A at ns2.vercel-dns.com`, 'http: homepage', 'http: sitemap']) {
    assert.ok(f.includes(c), `${c} must fail`);
  }
  assert.ok(!f.includes(`dns: ${APEX} A via cloudflare`), 'the apex still resolved during the incident');
});

test('nameserver change, missing verification record and NXDOMAIN fail', async () => {
  const rs = await run({
    doh: healthyDns({
      [`${APEX} NS`]: ok(['ns1.example-dns.net', 'ns2.example-dns.net']),
      [`tok123456789.${APEX} CNAME`]: ok([]),
      [`${APEX} A`]: { status: 3, answers: [] },
    }),
  });
  const f = failures(rs);
  assert.ok(f.includes('dns: nameservers'));
  assert.ok(f.some((c) => c.startsWith('dns: verification')));
  assert.ok(f.includes(`dns: ${APEX} A via cloudflare`));
});

test('unexpected IPv6 is a warning, not a failure; no fixed IPs are asserted', async () => {
  const rs = await run({ doh: healthyDns({ [`${HOST} AAAA`]: ok(['2001:db8::1']), [`${HOST} A`]: ok(['203.0.113.9']) }) });
  assert.deepEqual(failures(rs), []);
  assert.equal(rs.find((r) => r.check === `dns: ${HOST} AAAA`)!.status, 'warn');
});

test('TLS: untrusted, wrong name or near expiry fail; under 21 days warns', async () => {
  const tlsRun = async (t: object) => (await run({ getTls: async () => t })).find((r) => r.check === 'tls: certificate')!.status;
  const days = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();
  assert.equal(await tlsRun({ authorized: false, error: 'CERT_HAS_EXPIRED', validTo: days(-1), altNames: [`*.${APEX}`] }), 'fail');
  assert.equal(await tlsRun({ authorized: true, error: null, validTo: days(60), altNames: ['other.example'] }), 'fail');
  assert.equal(await tlsRun({ authorized: true, error: null, validTo: days(5), altNames: [HOST] }), 'fail');
  assert.equal(await tlsRun({ authorized: true, error: null, validTo: days(15), altNames: [HOST] }), 'warn');
});

test('redirects: temporary or wrong-target redirects and a non-canonical homepage fail', async () => {
  const rs = await run({
    fetchImpl: healthyHttp({
      [`https://${APEX}/`]: () => new Response(null, { status: 302, headers: { location: `${SITE_URL}/` } }),
      [`https://${APEX}/kontakt/`]: () => new Response(null, { status: 308, headers: { location: `${SITE_URL}/` } }),
      [`${SITE_URL}/`]: () => new Response(page('https://afrolink-restaurant-online.vercel.app/'), { status: 200 }),
    }),
  });
  const f = failures(rs);
  assert.ok(f.includes(`http: https://${APEX}/`));
  assert.ok(f.includes(`http: https://${APEX}/kontakt/`));
  assert.ok(f.includes('http: homepage'));
});

test('sitemap shrink, foreign URLs, robots without sitemap, soft-404 and missing key fail', async () => {
  const rs = await run({
    fetchImpl: healthyHttp({
      [`${SITE_URL}/sitemap.xml`]: () => new Response(sitemap(12), { status: 200 }),
      [`${SITE_URL}/robots.txt`]: () => new Response('User-agent: *\nDisallow: /\n', { status: 200 }),
      [`${SITE_URL}/__monitor-missing-page__/`]: () => new Response('home', { status: 200 }),
      [INDEXNOW_KEY_URL]: () => new Response('nf', { status: 404 }),
      'https://afrolink-restaurant-online.vercel.app/': () => new Response('', { status: 200 }),
    }),
  });
  const f = failures(rs);
  for (const c of ['http: sitemap', 'http: robots.txt', 'http: unknown page is 404', 'indexnow: key file', 'http: vercel.app alias noindex']) assert.ok(f.includes(c), c);
});

test('helpers: SAN wildcard matching, record parsing, token masking', () => {
  assert.ok(sanCovers([`*.${APEX}`], HOST));
  assert.ok(!sanCovers([`*.${APEX}`], APEX), 'a wildcard does not cover the apex');
  assert.ok(!sanCovers([`*.${APEX}`], `a.b.${APEX}`), 'one label only');
  assert.deepEqual(parseVerificationRecords('Abc=Verify.Bing.com., x=y'), [
    { name: 'abc', target: 'verify.bing.com' },
    { name: 'x', target: 'y' },
  ]);
  assert.deepEqual(parseVerificationRecords(undefined), []);
  assert.equal(mask('0123456789abcdef0123456789abcdef'), '0123…cdef');
});
