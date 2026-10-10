/**
 * Production availability, DNS and TLS checks (incident R-032: a DNS record created below
 * `www` silently removed the wildcard answer for `www`).
 *
 * No IP address is pinned: Vercel's anycast addresses change. The checks assert *behaviour*
 * (names resolve, the site answers, redirects and TLS are right), not specific values —
 * except the DNS verification records, whose exact targets are configured by the caller.
 *
 * Network access is injectable (`doh`, `authResolve`, `fetchImpl`, `tlsInfo`) for tests.
 */
import { promises as dnsp } from 'node:dns';
import tls from 'node:tls';
import { APEX, HOST, INDEXNOW_KEY_URL, SITE_URL } from './site.mjs';
import { parseSitemap, verifyKeyFile } from './indexnow.mjs';
import { pageFacts } from './page-facts.mjs';

export const EXPECTED_NAMESERVERS = ['ns1.vercel-dns.com', 'ns2.vercel-dns.com'];
const DOH = {
  cloudflare: (name, type) => `https://cloudflare-dns.com/dns-query?name=${name}&type=${type}`,
  google: (name, type) => `https://dns.google/resolve?name=${name}&type=${type}`,
};
const TYPE = { A: 1, NS: 2, CNAME: 5, AAAA: 28 };

/** DNS-over-HTTPS JSON query → { status, answers: [data] } for the requested type only. */
export async function dohQuery(provider, name, type, fetchImpl = fetch) {
  const res = await fetchImpl(DOH[provider](name, type), { headers: { accept: 'application/dns-json' }, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`${provider} DoH HTTP ${res.status}`);
  const j = await res.json();
  return { status: j.Status, answers: (j.Answer ?? []).filter((a) => a.type === TYPE[type]).map((a) => String(a.data).replace(/\.$/, '').toLowerCase()) };
}

/** A records straight from an authoritative nameserver (bypasses every cache). */
export async function authoritativeA(nameserver, name) {
  // Look the nameserver up via public resolvers: the host's own resolver may be unusable.
  const lookup = new dnsp.Resolver({ timeout: 5_000, tries: 2 });
  lookup.setServers(['1.1.1.1', '8.8.8.8']);
  const [ip] = await lookup.resolve4(nameserver);
  const r = new dnsp.Resolver({ timeout: 5_000, tries: 2 });
  r.setServers([ip]);
  return r.resolve4(name);
}

/** Certificate facts for host:443 (validation by Node's default CA store). */
export function tlsInfo(host, timeoutMs = 10_000) {
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port: 443, servername: host, timeout: timeoutMs }, () => {
      const cert = socket.getPeerCertificate();
      resolve({
        authorized: socket.authorized,
        error: socket.authorizationError ? String(socket.authorizationError) : null,
        validTo: cert.valid_to ? new Date(cert.valid_to).toISOString() : null,
        altNames: String(cert.subjectaltname ?? '').split(/,\s*/).map((s) => s.replace(/^DNS:/, '')),
      });
      socket.end();
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ authorized: false, error: 'timeout', validTo: null, altNames: [] });
    });
    socket.on('error', (e) => resolve({ authorized: false, error: e.message, validTo: null, altNames: [] }));
  });
}

/** Does a certificate SAN entry cover `host` (exact or single-label wildcard)? */
export function sanCovers(altNames, host) {
  return altNames.some((n) => n === host || (n.startsWith('*.') && host.split('.').slice(1).join('.') === n.slice(2)));
}

/** "name=target,name=target" (names relative to the apex) → [{ name, target }]. */
export function parseVerificationRecords(spec) {
  return (spec ?? '')
    .split(/[,;\s]+/)
    .filter(Boolean)
    .map((pair) => {
      const [name, target] = pair.split('=');
      return { name: name.trim().toLowerCase(), target: (target ?? '').trim().replace(/\.$/, '').toLowerCase() };
    });
}

/** Shorten a verification token for logs ("f95e…3117") — tokens are public in DNS but stay out of reports. */
export const mask = (s) => (s.length > 10 ? `${s.slice(0, 4)}…${s.slice(-4)}` : s);

/** Follow redirects manually; returns the hop list. */
export async function redirectChain(url, fetchImpl = fetch, maxHops = 5) {
  const hops = [];
  let current = url;
  for (let i = 0; i <= maxHops; i++) {
    const res = await fetchImpl(current, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
    await res.body?.cancel?.();
    const location = res.headers.get('location');
    hops.push({ url: current, status: res.status, location });
    if (![301, 302, 303, 307, 308].includes(res.status) || !location) break;
    current = new URL(location, current).href;
  }
  return hops;
}

/**
 * Run every check. Each result: { check, status: 'pass'|'warn'|'fail', detail }.
 * Options: verificationRecords, minSitemapUrls, expectIndexNowKey, expectAliasNoindex,
 * aliasHost, now, and the injectable network functions.
 */
export async function runChecks(opts = {}) {
  const {
    fetchImpl = fetch,
    doh = (p, n, t) => dohQuery(p, n, t, fetchImpl),
    authResolve = authoritativeA,
    getTls = tlsInfo,
    verificationRecords = [],
    minSitemapUrls = 100,
    expectIndexNowKey = false,
    expectAliasNoindex = false,
    aliasHost = 'afrolink-restaurant-online.vercel.app',
    now = new Date(),
  } = opts;
  const results = [];
  const add = (check, status, detail) => results.push({ check, status, detail });
  const guard = async (check, fn) => {
    try {
      await fn();
    } catch (e) {
      add(check, 'fail', `error: ${e.message}`);
    }
  };

  // 1. Delegation: the zone is still served by Vercel DNS.
  await guard('dns: nameservers', async () => {
    const { answers } = await doh('cloudflare', APEX, 'NS');
    const ok = EXPECTED_NAMESERVERS.every((n) => answers.includes(n)) && answers.length === EXPECTED_NAMESERVERS.length;
    add('dns: nameservers', ok ? 'pass' : 'fail', answers.join(', ') || 'none');
  });

  // 2. A records for www and apex: public resolvers and the authoritative servers.
  for (const name of [HOST, APEX]) {
    for (const provider of Object.keys(DOH)) {
      await guard(`dns: ${name} A via ${provider}`, async () => {
        const { status, answers } = await doh(provider, name, 'A');
        add(`dns: ${name} A via ${provider}`, status === 0 && answers.length ? 'pass' : 'fail', status === 0 ? `${answers.length} address(es)` : `DNS status ${status}`);
      });
    }
    for (const ns of EXPECTED_NAMESERVERS) {
      await guard(`dns: ${name} A at ${ns}`, async () => {
        const ips = await authResolve(ns, name);
        add(`dns: ${name} A at ${ns}`, ips.length ? 'pass' : 'fail', `${ips.length} address(es)`);
      });
    }
    // Vercel serves this domain over IPv4 only today; an AAAA answer appearing is a change worth seeing.
    await guard(`dns: ${name} AAAA`, async () => {
      const { answers } = await doh('cloudflare', name, 'AAAA');
      add(`dns: ${name} AAAA`, answers.length ? 'warn' : 'pass', answers.length ? `unexpected IPv6 answer(s): ${answers.length}` : 'none (IPv4 only, as configured)');
    });
  }

  // 3. Search-engine verification records (Google, Bing) still point where they must.
  if (!verificationRecords.length) add('dns: verification records', 'warn', 'not configured (set DNS_VERIFICATION_RECORDS)');
  for (const { name, target } of verificationRecords) {
    const fqdn = `${name}.${APEX}`;
    await guard(`dns: verification ${mask(name)}`, async () => {
      const { answers } = await doh('cloudflare', fqdn, 'CNAME');
      add(`dns: verification ${mask(name)}`, answers.includes(target) ? 'pass' : 'fail', answers.includes(target) ? 'points to the configured target' : `expected ${mask(target)}, got ${answers.map(mask).join(', ') || 'nothing'}`);
    });
  }

  // 4. TLS on the canonical host.
  await guard('tls: certificate', async () => {
    const t = await getTls(HOST);
    const days = t.validTo ? Math.floor((Date.parse(t.validTo) - now.getTime()) / 86_400_000) : -1;
    const covers = sanCovers(t.altNames, HOST);
    const status = !t.authorized || !covers || days < 7 ? 'fail' : days < 21 ? 'warn' : 'pass';
    add('tls: certificate', status, `${t.authorized ? 'trusted' : `untrusted (${t.error})`}, ${covers ? 'covers' : 'does NOT cover'} ${HOST}, ${days} days left`);
  });

  // 5. Canonical host and redirects.
  const redirectCases = [
    [`http://${APEX}/`, `${SITE_URL}/`],
    [`https://${APEX}/`, `${SITE_URL}/`],
    [`http://${HOST}/`, `${SITE_URL}/`],
    [`https://${APEX}/kontakt/`, `${SITE_URL}/kontakt/`],
  ];
  for (const [from, to] of redirectCases) {
    await guard(`http: ${from}`, async () => {
      const hops = await redirectChain(from, fetchImpl);
      const last = hops.at(-1);
      const permanent = hops.slice(0, -1).every((h) => [301, 308].includes(h.status));
      const ok = last.url === to && last.status === 200 && permanent && hops.length <= 3;
      add(`http: ${from}`, ok ? 'pass' : 'fail', hops.map((h) => `${h.status}`).join(' → ') + ` → ${last.url}`);
    });
  }

  // 6. Homepage, sitemap, robots, 404.
  await guard('http: homepage', async () => {
    const res = await fetchImpl(`${SITE_URL}/`, { redirect: 'manual', headers: { 'user-agent': 'afrolink-monitor/1 (bot)' }, signal: AbortSignal.timeout(15_000) });
    const facts = pageFacts(await res.text());
    const ok = res.status === 200 && facts.canonical[0] === `${SITE_URL}/` && !/noindex/i.test(facts.robots ?? '');
    add('http: homepage', ok ? 'pass' : 'fail', `HTTP ${res.status}, canonical ${facts.canonical[0] ?? 'missing'}, robots ${facts.robots ?? 'none'}`);
  });
  await guard('http: sitemap', async () => {
    const res = await fetchImpl(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(15_000) });
    const sm = parseSitemap(await res.text());
    const ok = res.status === 200 && !sm.problems.length && sm.urls.length >= minSitemapUrls;
    add('http: sitemap', ok ? 'pass' : 'fail', `HTTP ${res.status}, ${sm.urls.length} URLs${sm.problems.length ? `, problems: ${sm.problems.slice(0, 3).join('; ')}` : ''}`);
  });
  await guard('http: robots.txt', async () => {
    const res = await fetchImpl(`${SITE_URL}/robots.txt`, { signal: AbortSignal.timeout(15_000) });
    const body = await res.text();
    const ok = res.status === 200 && body.includes(`Sitemap: ${SITE_URL}/sitemap.xml`) && !/^Disallow:\s*\/\s*$/m.test(body);
    add('http: robots.txt', ok ? 'pass' : 'fail', `HTTP ${res.status}${ok ? '' : ', sitemap reference missing or site disallowed'}`);
  });
  await guard('http: unknown page is 404', async () => {
    const res = await fetchImpl(`${SITE_URL}/__monitor-missing-page__/`, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
    await res.body?.cancel?.();
    add('http: unknown page is 404', res.status === 404 ? 'pass' : 'fail', `HTTP ${res.status}`);
  });

  // 7. IndexNow key and the duplicate-host guard (enabled once deployed).
  if (expectIndexNowKey) {
    await guard('indexnow: key file', async () => {
      const k = await verifyKeyFile({ fetchImpl });
      add('indexnow: key file', k.ok ? 'pass' : 'fail', k.ok ? INDEXNOW_KEY_URL : k.problem);
    });
  }
  await guard('http: vercel.app alias noindex', async () => {
    const res = await fetchImpl(`https://${aliasHost}/`, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
    await res.body?.cancel?.();
    const noindex = /noindex/i.test(res.headers.get('x-robots-tag') ?? '');
    add('http: vercel.app alias noindex', noindex ? 'pass' : expectAliasNoindex ? 'fail' : 'warn', `HTTP ${res.status}, X-Robots-Tag ${res.headers.get('x-robots-tag') ?? 'none'}`);
  });

  return results;
}
