/**
 * Rating system: database logic, HTTP handlers, anti-abuse, ranking maths, analytics, management
 * auth and CSV export — against an embedded Postgres (PGlite), so no real ratings are touched.
 */
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { migrate, pgliteDb, type Db } from '../src/lib/ratings/db.ts';
import { dishStats, ensureLaunch, getLaunch, moderate, monthly, sixMonthsAfter, submitRating, totals, exportRows, ratableDishIds } from '../src/lib/ratings/service.ts';
import { bayesian, ci95, favourites, highestRated, mostRated, rank, round1, type DishStats } from '../src/lib/ratings/ranking.ts';
import { handleSubmit, handleSummary, validate, LIMITS, type RatingConfig } from '../src/lib/ratings/http.ts';
import { handleExport, handleModerate, toCsv, type AdminConfig } from '../src/lib/ratings/admin-http.ts';
import { ADMIN_COOKIE, adminToken, hashPassword, verifyAdminToken, verifyPassword } from '../src/lib/ratings/security.ts';

let db: Db;
const SECRET = 'test-secret-test-secret-test-secret-0123456789';
const HOST = 'www.afrolink-restaurant.online';

before(async () => {
  db = pgliteDb(new PGlite());
  const n = await migrate(db, readFileSync('db/migrations/001_ratings.sql', 'utf8'));
  assert.ok(n >= 8, 'migration statements');
});

const cfg = (env: string, extra: Partial<RatingConfig> = {}): RatingConfig => ({
  enabled: true,
  env,
  secret: SECRET,
  hosts: [HOST],
  secureCookies: true,
  ...extra,
});

function post(body: unknown, opts: { origin?: string; cookie?: string; ip?: string; type?: string } = {}) {
  const headers = new Headers({
    'content-type': opts.type ?? 'application/json',
    origin: opts.origin ?? `https://${HOST}`,
    'x-forwarded-for': opts.ip ?? '203.0.113.7',
  });
  if (opts.cookie) headers.set('cookie', opts.cookie);
  return new Request(`https://${HOST}/api/ratings`, { method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body) });
}
const voterCookie = (res: Response) => res.headers.get('set-cookie')?.split(';')[0];

test('every current food item can be rated; ids are stable menu ids', () => {
  const ids = ratableDishIds();
  assert.equal(ids.size, 34);
  for (const id of ['egusi-soup', 'jollof-rice', 'isiewu', 'tilapia', 'extra-pounded-yam']) assert.ok(ids.has(id), id);
});

test('validation: only integer stars 1–5 for real dishes', () => {
  assert.deepEqual(validate({ dish: 'egusi-soup', stars: 5 }), { ok: true, dish: 'egusi-soup', stars: 5 });
  for (const stars of [0, 6, 4.5, '5', null, undefined, -1, NaN]) {
    assert.equal(validate({ dish: 'egusi-soup', stars } as never).ok, false, `stars=${String(stars)}`);
  }
  assert.deepEqual(validate({ dish: 'pork-chop', stars: 4 }), { ok: false, error: 'invalid-dish' });
  assert.deepEqual(validate({ dish: 'Egusi Soup', stars: 4 }), { ok: false, error: 'invalid-dish' });
});

test('create → revise → unchanged; one rating per voter and dish (atomic under concurrency)', async () => {
  const base = { env: 't1', dishId: 'egusi-soup', voterHash: 'v1', ipDayHash: 'ip1' };
  assert.equal(await submitRating(db, { ...base, stars: 4 }), 'created');
  assert.equal(await submitRating(db, { ...base, stars: 5 }), 'revised');
  assert.equal(await submitRating(db, { ...base, stars: 5 }), 'unchanged');
  await Promise.all([1, 2, 3, 4, 5].map((s) => submitRating(db, { ...base, voterHash: 'v-race', stars: s })));
  const [{ c }] = await db.query<{ c: number }>(`select count(*)::int as c from rating where env='t1' and voter_hash='v-race'`);
  assert.equal(c, 1);
  const [s] = await dishStats(db, 't1');
  assert.equal(s.n, 2);
  const events = await db.query<{ action: string }>(`select action from rating_event where env='t1' and dish_id='egusi-soup' and rating_id=(select id from rating where env='t1' and voter_hash='v1')`);
  assert.deepEqual(events.map((e) => e.action), ['create', 'revise']);
});

test('moderation excludes from averages, is audited, can be restored; excluded ratings are locked', async () => {
  const env = 't2';
  await submitRating(db, { env, dishId: 'suya', stars: 1, voterHash: 'a', ipDayHash: null });
  await submitRating(db, { env, dishId: 'suya', stars: 5, voterHash: 'b', ipDayHash: null });
  const [row] = await db.query<{ id: number }>(`select id from rating where env=$1 and voter_hash='a'`, [env]);
  assert.equal(await moderate(db, env, Number(row.id), 'exclude', 'automated', ''), true);
  assert.equal(await moderate(db, env, Number(row.id), 'exclude', 'automated', ''), false, 'already excluded');
  let [s] = await dishStats(db, env);
  assert.deepEqual([s.n, s.sum], [1, 5]);
  assert.equal(await submitRating(db, { env, dishId: 'suya', stars: 4, voterHash: 'a', ipDayHash: null }), 'locked');
  assert.equal((await totals(db, env)).excluded, 1);
  assert.equal(await moderate(db, env, Number(row.id), 'restore', 'other', 'restored after review'), true);
  [s] = await dishStats(db, env);
  assert.deepEqual([s.n, s.sum], [2, 6]);
  const log = await db.query<{ action: string; actor: string }>(`select action, actor from rating_event where env=$1 and actor='admin' order by id`, [env]);
  assert.deepEqual(log.map((l) => l.action), ['exclude', 'restore']);
  // Stars are never changed by moderation.
  const [after] = await db.query<{ stars: number }>(`select stars from rating where id=$1`, [row.id]);
  assert.equal(Number(after.stars), 1);
});

test('HTTP: origin, content type, size, unknown dish, bad stars', async () => {
  const c = cfg('t3');
  assert.equal((await handleSubmit(post({ dish: 'okpa', stars: 4, elapsed: 5000 }, { origin: 'https://evil.example' }), db, c)).status, 403);
  assert.equal((await handleSubmit(post({ dish: 'okpa', stars: 4, elapsed: 5000 }, { type: 'text/plain' }), db, c)).status, 415);
  assert.equal((await handleSubmit(post('x'.repeat(2000)), db, c)).status, 413);
  assert.equal((await handleSubmit(post('{not json'), db, c)).status, 400);
  assert.equal((await handleSubmit(post({ dish: 'unknown', stars: 4, elapsed: 5000 }), db, c)).status, 404);
  assert.equal((await handleSubmit(post({ dish: 'okpa', stars: 9, elapsed: 5000 }), db, c)).status, 400);
  assert.equal((await handleSubmit(post({ dish: 'okpa', stars: 4 }), db, cfg('t3', { enabled: false }))).status, 503);
  assert.equal((await dishStats(db, 't3')).length, 0, 'nothing stored');
});

test('HTTP: bots (honeypot / instant submit) get a fake success and nothing is stored', async () => {
  const c = cfg('t4');
  const r1 = await handleSubmit(post({ dish: 'okpa', stars: 5, website: 'spam', elapsed: 5000 }), db, c);
  const r2 = await handleSubmit(post({ dish: 'okpa', stars: 5, elapsed: 50 }), db, c);
  assert.equal(r1.status, 200);
  assert.equal(r2.status, 200);
  assert.equal((await dishStats(db, 't4')).length, 0);
});

test('HTTP: anonymous cookie → revisions instead of duplicates; summary never leaks identifiers', async () => {
  const c = cfg('t5');
  const first = await handleSubmit(post({ dish: 'abacha', stars: 3, elapsed: 4000, remember: true }, { ip: '198.51.100.1' }), db, c);
  assert.equal(first.status, 200);
  const cookie = voterCookie(first)!;
  assert.match(first.headers.get('set-cookie')!, /HttpOnly; SameSite=Lax; Secure/);
  const again = await handleSubmit(post({ dish: 'abacha', stars: 4, elapsed: 4000, remember: true }, { cookie, ip: '198.51.100.1' }), db, c);
  const body = (await again.json()) as { action: string; n: number; avg: number };
  assert.equal(body.action, 'revised');
  assert.equal(body.n, 1);
  assert.equal(body.avg, 4);
  const sum = await handleSummary(db, c);
  const text = await sum.text();
  assert.ok(!/voter|ip_|hash/i.test(text), 'no identifiers in public summary');
  const json = JSON.parse(text) as { enabled: boolean; dishes: Record<string, { n: number; avg: number }> };
  assert.equal(json.enabled, true);
  assert.deepEqual([json.dishes.abacha.n, json.dishes.abacha.avg], [1, 4]);
  const rows = await db.query<Record<string, unknown>>(`select * from rating where env='t5'`);
  assert.ok(!JSON.stringify(rows).includes('198.51.100.1'), 'raw IP never stored');
});

test('HTTP: rapid repeated submissions are rate limited', async () => {
  const c = cfg('t6');
  const first = await handleSubmit(post({ dish: 'snail', stars: 3, elapsed: 4000, remember: true }, { ip: '192.0.2.50' }), db, c);
  const cookie = voterCookie(first)!;
  const statuses: number[] = [];
  for (let i = 0; i < LIMITS.voterPerMinute + 2; i++) {
    const r = await handleSubmit(post({ dish: 'snail', stars: (i % 5) + 1, elapsed: 4000, remember: true }, { cookie, ip: '192.0.2.50' }), db, c);
    statuses.push(r.status);
  }
  assert.ok(statuses.includes(429), `expected a 429, got ${statuses.join(',')}`);
  assert.equal(statuses.filter((s) => s === 200).length, LIMITS.voterPerMinute - 1);
});

test('ranking: Bayesian average beats a single 5-star vote; favourites need enough evidence', () => {
  const one: DishStats = { dishId: 'one', n: 1, sum: 5, dist: [0, 0, 0, 0, 1], n30: 1, last: '2026-10-09T10:00:00Z' };
  const many: DishStats = { dishId: 'many', n: 100, sum: 460, dist: [0, 2, 8, 18, 72], n30: 20, last: '2026-10-08T10:00:00Z' };
  const mid: DishStats = { dishId: 'mid', n: 10, sum: 30, dist: [2, 2, 2, 2, 2], n30: 0, last: '2026-10-01T10:00:00Z' };
  const ranked = rank([one, many, mid]);
  assert.equal(highestRated(ranked, 1)[0].dishId, 'many');
  assert.equal(highestRated(ranked).some((d) => d.dishId === 'one'), false, 'needs ≥ 3 ratings to be ranked');
  assert.equal(mostRated(ranked)[0].dishId, 'many');
  assert.deepEqual(favourites(ranked).map((d) => d.dishId), ['many']);
  const m = (5 + 460 + 30) / 111;
  assert.ok(Math.abs(bayesian(one, m)! - (5 * m + 5) / 6) < 1e-9);
  assert.equal(round1(4.25), 4.3);
  assert.equal(round1(4.24), 4.2);
  assert.equal(ci95([0, 0, 0, 0, 1]), null);
  assert.ok(ci95(many.dist)! > 0 && ci95(many.dist)! < 0.3);
});

test('analytics: monthly trend, date filters and distribution from controlled data', async () => {
  const env = 't7';
  const rows: [string, number, string][] = [
    ['egusi-soup', 5, '2026-11-03T12:00:00Z'],
    ['egusi-soup', 4, '2026-11-20T12:00:00Z'],
    ['jollof-rice', 2, '2026-11-21T12:00:00Z'],
    ['egusi-soup', 3, '2026-12-05T12:00:00Z'],
    ['jollof-rice', 5, '2027-01-15T12:00:00Z'],
  ];
  for (const [i, [dish, stars, at]] of rows.entries()) {
    await db.query(`insert into rating (env, dish_id, voter_hash, stars, created_at, updated_at) values ($1,$2,$3,$4,$5,$5)`, [env, dish, `voter${i}`, stars, at]);
  }
  const m = await monthly(db, env);
  assert.deepEqual(m.map((x) => [x.month, x.ratings]), [['2026-11', 3], ['2026-12', 1], ['2027-01', 1]]);
  assert.ok(Math.abs(m[0].avg! - 11 / 3) < 1e-9);
  const dec = await dishStats(db, env, { from: '2026-12-01T00:00:00Z', to: '2027-01-01T00:00:00Z' });
  assert.deepEqual(dec.map((d) => [d.dishId, d.n, d.sum]), [['egusi-soup', 1, 3]]);
  const egusi = (await dishStats(db, env, { dishIds: ['egusi-soup'] }))[0];
  assert.deepEqual(egusi.dist, [0, 0, 1, 1, 1]);
  const exp = await exportRows(db, env, { from: '2026-11-15T00:00:00Z' });
  assert.equal(exp.length, 4);
  assert.ok(!('voter' in exp[0]) && !JSON.stringify(exp).includes('voter0'), 'export has no voter identifiers');
});

test('six-month window: launch recorded once, never backdated', async () => {
  const env = 't8';
  assert.equal(await getLaunch(db, env), null);
  const before = Date.now();
  const first = await ensureLaunch(db, env);
  assert.ok(new Date(first).getTime() >= before - 5000, 'launch is "now", not backdated');
  await new Promise((r) => setTimeout(r, 20));
  assert.equal(await ensureLaunch(db, env), first, 'write-once');
  assert.equal(sixMonthsAfter('2026-10-09T10:00:00.000Z'), '2027-04-09T10:00:00.000Z');
});

test('management auth: scrypt password, signed expiring session, protected endpoints', async () => {
  const stored = hashPassword('correct horse battery');
  assert.ok(verifyPassword('correct horse battery', stored));
  assert.ok(!verifyPassword('wrong', stored));
  assert.ok(!verifyPassword('x', undefined));
  const now = new Date('2026-10-09T10:00:00Z');
  const token = adminToken(SECRET, now, 60);
  assert.ok(verifyAdminToken(SECRET, token, now));
  assert.ok(!verifyAdminToken(SECRET, token, new Date(now.getTime() + 61_000)), 'expired');
  assert.ok(!verifyAdminToken(SECRET, token.replace(/.$/, (c) => (c === 'A' ? 'B' : 'A')), now), 'tampered');
  assert.ok(!verifyAdminToken('other-secret-other-secret-other-secret', token, now), 'wrong key');

  const admin: AdminConfig = { ...cfg('t9'), passwordHash: stored, now: () => now };
  const form = (headers: Record<string, string>) =>
    new Request(`https://${HOST}/api/admin/moderate`, { method: 'POST', headers, body: new URLSearchParams({ id: '1', action: 'exclude', reason: 'test-data' }) });
  assert.equal((await handleModerate(form({ origin: `https://${HOST}` }), db, admin)).status, 401, 'no session');
  assert.equal(
    (await handleModerate(form({ origin: 'https://evil.example', cookie: `${ADMIN_COOKIE}=${adminToken(SECRET, now)}` }), db, admin)).status,
    403,
    'cross-site',
  );
  const exportReq = new Request(`https://${HOST}/api/admin/export.csv`);
  assert.equal((await handleExport(exportReq, db, admin, {}, {})).status, 401);
});

test('CSV export neutralises spreadsheet formulas and quotes cells', () => {
  const csv = toCsv([{ a: '=HYPERLINK("x")', b: 'Fisherman\'s "Soup"', c: 5 }], ['a', 'b', 'c']);
  assert.equal(csv, 'a,b,c\r\n"\'=HYPERLINK(""x"")","Fisherman\'s ""Soup""","5"\r\n');
});

test('feature flag: ratings stay off unless flag AND a strong secret AND a database are present', async () => {
  const { configFromEnv } = await import('../src/lib/ratings/http.ts');
  assert.equal(configFromEnv({}).enabled, false, 'no variables');
  assert.equal(configFromEnv({ RATINGS_ENABLED: 'true' }).enabled, false, 'flag without secret');
  assert.equal(configFromEnv({ RATINGS_ENABLED: 'true', RATINGS_SECRET: 'short' }).enabled, false, 'weak secret');
  assert.equal(configFromEnv({ RATINGS_ENABLED: 'false', RATINGS_SECRET: SECRET }).enabled, false, 'flag off');
  const on = configFromEnv({ RATINGS_ENABLED: 'true', RATINGS_SECRET: SECRET, VERCEL_ENV: 'production' });
  assert.equal(on.enabled, true);
  assert.equal(on.env, 'production');
  assert.equal(configFromEnv({ RATINGS_ENABLED: 'true', RATINGS_SECRET: SECRET }).env, 'development', 'local runs never write production rows');
  // enabled but no database → public API reports disabled, submissions are refused
  const sum = (await (await handleSummary(null, on)).json()) as { enabled: boolean };
  assert.equal(sum.enabled, false);
  assert.equal((await handleSubmit(post({ dish: 'okpa', stars: 4, elapsed: 5000 }), null, on)).status, 503);
});

test('environments never see each other\'s ratings', async () => {
  await submitRating(db, { env: 'preview', dishId: 'okpa', stars: 1, voterHash: 'qa', ipDayHash: null });
  assert.equal((await dishStats(db, 'production')).some((d) => d.dishId === 'okpa'), false);
  assert.equal((await dishStats(db, 'preview')).find((d) => d.dishId === 'okpa')?.n, 1);
});
