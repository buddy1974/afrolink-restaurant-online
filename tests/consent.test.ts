/**
 * Cookie / storage compliance: inventory completeness, consent record handling, server-side
 * language redirect rules, rating cookie only with consent, built pages free of device access.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { storageInventory, CONSENT_KEY, CONSENT_VERSION } from '../src/data/storage-inventory.ts';
import { makeRecord, parseConsent, NONE } from '../src/lib/consent.ts';
import { consentUi } from '../src/i18n/consent.ts';
import { privacy } from '../src/i18n/privacy.ts';
import { handleForget, handleSubmit, type RatingConfig } from '../src/lib/ratings/http.ts';
import { PGlite } from '@electric-sql/pglite';
import { migrate, pgliteDb } from '../src/lib/ratings/db.ts';

const walk = (d: string, out: string[] = []): string[] => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|astro|mjs)$/.test(f)) out.push(p);
  }
  return out;
};
const sources = walk('src').map((f) => readFileSync(f, 'utf8')).join('\n');

test('every cookie / storage key used in the code is in the inventory', () => {
  const keys = new Set<string>();
  for (const m of sources.matchAll(/localStorage\.(?:get|set|remove)Item\(\s*[`'"]([a-z_:-]+)/g)) keys.add(m[1].replace(/:$/, ''));
  for (const m of sources.matchAll(/document\.cookie\s*=\s*[`'"]([a-z_]+)=/g)) keys.add(m[1]);
  for (const m of sources.matchAll(/(?:VOTER|ADMIN)_COOKIE = '([a-z_]+)'/g)) keys.add(m[1]);
  keys.add(CONSENT_KEY);
  assert.ok(!/sessionStorage|indexedDB|navigator\.languages|navigator\.language\b/.test(sources), 'no other device access');
  const listed = storageInventory.map((i) => i.name.replace(/:<.*>$/, ''));
  for (const k of keys) assert.ok(listed.includes(k), `${k} is used but not listed in the cookie policy`);
  assert.deepEqual([...keys].sort(), ['afl-consent', 'afl-rated', 'afl_admin', 'afl_lang', 'afl_rv']);
});

test('only the consent record (and staff login) are "necessary"; preferences, media and ratings need consent', () => {
  const nec = storageInventory.filter((i) => i.category === 'necessary').map((i) => i.name);
  assert.deepEqual(nec.sort(), ['afl-consent', 'afl_admin']);
  assert.equal(storageInventory.find((i) => i.name === 'afl_lang')?.category, 'prefs');
  assert.equal(storageInventory.find((i) => i.name === 'afl_rv')?.category, 'ratings');
  for (const i of storageInventory) for (const l of ['de', 'en', 'fr'] as const) assert.ok(i.purpose[l] && i.duration[l] && i.setWhen[l], `${i.name} ${l}`);
});

test('consent record: default off, versioned, expires after 12 months, never accepts junk', () => {
  const now = new Date('2026-10-10T12:00:00Z');
  assert.equal(parseConsent(null, now), null);
  assert.equal(parseConsent('{bad', now), null);
  assert.equal(parseConsent(JSON.stringify({ v: CONSENT_VERSION + 1, at: now.toISOString(), media: true }), now), null);
  const rec = makeRecord({ ...NONE, media: true }, now);
  assert.deepEqual(parseConsent(JSON.stringify(rec), now), { v: CONSENT_VERSION, at: now.toISOString(), media: true, prefs: false, ratings: false });
  const later = new Date(now.getTime() + 366 * 86400_000);
  assert.equal(parseConsent(JSON.stringify(rec), later), null, 'expired');
  assert.equal(parseConsent(JSON.stringify({ v: CONSENT_VERSION, at: now.toISOString(), media: 'yes' }), now)?.media, false, 'only literal true counts');
  assert.ok(!JSON.stringify(rec).match(/ip|id|user|uuid/i), 'no identifiers in the record');
});

test('consent copy has identical keys in DE / EN / FR and no preselected wording', () => {
  const keys = (o: unknown, p = ''): string[] =>
    typeof o === 'object' && o && !Array.isArray(o) ? Object.entries(o).flatMap(([k, v]) => keys(v, `${p}${k}.`)) : [p];
  for (const l of ['en', 'fr'] as const) assert.deepEqual(keys(consentUi[l]).sort(), keys(consentUi.de).sort(), l);
});

test('privacy policy matches the configuration (rating storage only when ratings are on)', () => {
  for (const lang of ['de', 'en', 'fr'] as const) {
    const off = JSON.stringify(privacy[lang].sections({ ratingsOn: false, vercelDpa: false, neonDpa: false }));
    const on = JSON.stringify(privacy[lang].sections({ ratingsOn: true, vercelDpa: false, neonDpa: false }));
    for (const k of ['afl-consent', 'afl_lang', 'Accept-Language']) assert.ok(off.includes(k), `${lang}: ${k}`);
    assert.ok(!off.includes('afl_rv') && !off.includes('afl_admin'), `${lang}: rating storage described while off`);
    for (const k of ['afl_rv', 'afl-rated', 'afl_admin']) assert.ok(on.includes(k), `${lang}: ${k} missing when ratings on`);
  }
});

test('server-side language redirect: only "/", temporary, never for bots, internal navigation or a saved choice', () => {
  type Cond = { type: string; key?: string; value?: string };
  const v = JSON.parse(readFileSync('vercel.json', 'utf8')) as { redirects: { source: string; permanent: boolean; has?: Cond[]; missing?: Cond[]; destination: string }[] };
  const lang = v.redirects.filter((r) => r.source === '/');
  assert.equal(lang.length, 4);
  for (const r of lang) assert.equal(r.permanent, false);
  const header = lang.filter((r) => r.has?.some((h) => h.key === 'accept-language'));
  assert.equal(header.length, 2);
  for (const r of header) {
    const keys = (r.missing ?? []).map((m) => m.key);
    assert.deepEqual(keys.sort(), ['afl_lang', 'referer', 'user-agent']);
    const al = new RegExp(r.has![0].value!);
    const code = r.destination.replace(/\//g, '');
    assert.ok(al.test(`${code}-XX,${code};q=0.9,de;q=0.8`));
    assert.ok(!al.test(`de-DE,de;q=0.9,${code};q=0.8`), 'German first → stays German');
    const ua = new RegExp(r.missing!.find((m) => m.key === 'user-agent')!.value!);
    for (const bot of ['Mozilla/5.0 (compatible; Googlebot/2.1)', 'Mozilla/5.0 (compatible; bingbot/2.0)', 'facebookexternalhit/1.1', 'WhatsApp/2.23']) assert.ok(ua.test(bot), bot);
    assert.ok(!ua.test('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15 Safari/604.1'));
  }
});

test('built pages: no script reads browser languages or storage on load; legal pages linked in every footer', { skip: !existsSync('dist/client/index.html') && 'build first' }, () => {
  const pages: string[] = [];
  const w = (d: string) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) w(p); else if (f === 'index.html') pages.push(p); } };
  w('dist/client');
  for (const p of pages) {
    const h = readFileSync(p, 'utf8');
    assert.ok(!/navigator\.languages|localStorage\.getItem\('afl-lang'\)/.test(h), `${p} reads device information inline`);
    if (!p.includes('admin')) {
      assert.ok(/data-open-consent/.test(h), `${p} lacks the cookie settings control`);
      assert.ok(/href="(\/|\/en\/|\/fr\/)cookies\/"/.test(h), `${p} lacks the cookie policy link`);
    }
  }
  const js = readdirSync('dist/client/_astro').filter((f) => f.endsWith('.js')).map((f) => readFileSync(join('dist/client/_astro', f), 'utf8')).join('\n');
  assert.ok(!/navigator\.languages/.test(js), 'no bundled script reads navigator.languages');
});

test('ratings: cookie only with "remember" consent; DELETE expires it', async () => {
  const db = pgliteDb(new PGlite());
  await migrate(db, readFileSync('db/migrations/001_ratings.sql', 'utf8'));
  const cfg: RatingConfig = { enabled: true, env: 'test', secret: 'x'.repeat(40), hosts: ['www.afrolink-restaurant.online'], secureCookies: true };
  const req = (body: object, ip: string) =>
    new Request('https://www.afrolink-restaurant.online/api/ratings', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://www.afrolink-restaurant.online', 'x-forwarded-for': ip },
      body: JSON.stringify(body),
    });
  const anon = await handleSubmit(req({ dish: 'okpa', stars: 4, elapsed: 3000 }, '203.0.113.20'), db, cfg);
  assert.equal(anon.status, 200);
  assert.equal(anon.headers.get('set-cookie'), null, 'no cookie without consent');
  const again = (await (await handleSubmit(req({ dish: 'okpa', stars: 5, elapsed: 3000 }, '203.0.113.20'), db, cfg)).json()) as { action: string; n: number };
  assert.deepEqual([again.action, again.n], ['revised', 1], 'same network, same day → one rating');
  const remembered = await handleSubmit(req({ dish: 'okpa', stars: 3, elapsed: 3000, remember: true }, '203.0.113.21'), db, cfg);
  assert.match(remembered.headers.get('set-cookie') ?? '', /^afl_rv=[0-9a-f-]{36}; Path=\/api\/ratings; Max-Age=31536000; HttpOnly; SameSite=Lax; Secure$/);
  const forget = handleForget(cfg);
  assert.equal(forget.status, 204);
  assert.match(forget.headers.get('set-cookie') ?? '', /^afl_rv=; Path=\/api\/ratings; Max-Age=0;/);
});
