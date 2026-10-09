/**
 * HTTP handlers for the public rating API, written against plain Request/Response so they can be
 * tested without a server. The Astro routes in src/pages/api/ are thin wrappers.
 */
import type { Db } from './db.ts';
import { rank, round1, FAVOURITE_MIN_RATINGS, MIN_RATINGS_TOP } from './ranking.ts';
import { allowRate, dishStats, ensureLaunch, purge, ratableDishIds, submitRating } from './service.ts';
import { VOTER_COOKIE, clientIp, cookieHeader, ipDayHash, isVoterId, newVoterId, readCookie, sameOrigin, voterHash } from './security.ts';

export interface RatingConfig {
  enabled: boolean;
  env: string;
  secret: string;
  /** Hosts allowed as Origin for POST (the production domain is always allowed). */
  hosts: string[];
  secureCookies: boolean;
  now?: () => Date;
}

export function configFromEnv(env: Record<string, string | undefined> = process.env): RatingConfig {
  const vercelEnv = env.VERCEL_ENV ?? 'development';
  return {
    enabled: env.RATINGS_ENABLED === 'true' && !!env.RATINGS_SECRET && env.RATINGS_SECRET.length >= 32,
    env: vercelEnv,
    secret: env.RATINGS_SECRET ?? '',
    hosts: ['www.afrolink-restaurant.online', ...(env.VERCEL_URL ? [env.VERCEL_URL] : []), ...(env.VERCEL_BRANCH_URL ? [env.VERCEL_BRANCH_URL] : [])],
    secureCookies: vercelEnv !== 'development',
  };
}

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'x-robots-tag': 'noindex', ...headers },
  });

/** Public summary per dish. Never exposes voter or IP data. */
export async function handleSummary(db: Db | null, cfg: RatingConfig): Promise<Response> {
  if (!cfg.enabled || !db) return json({ enabled: false }, 200, { 'cache-control': 'no-store' });
  try {
    if (cfg.env === 'production') await ensureLaunch(db, cfg.env);
    const ids = ratableDishIds();
    const ranked = rank((await dishStats(db, cfg.env)).filter((s) => ids.has(s.dishId)));
    const dishes: Record<string, { n: number; avg: number | null; score: number | null; n30: number; last: string | null }> = {};
    for (const d of ranked) dishes[d.dishId] = { n: d.n, avg: d.avg == null ? null : round1(d.avg), score: d.score, n30: d.n30, last: d.last };
    return json(
      { enabled: true, minTop: MIN_RATINGS_TOP, minFavourite: FAVOURITE_MIN_RATINGS, dishes },
      200,
      // Browsers always revalidate; Vercel's edge may serve a summary for up to 20 s.
      { 'cache-control': 'no-cache', 'cdn-cache-control': 'max-age=20, stale-while-revalidate=40' },
    );
  } catch {
    return json({ enabled: false, error: 'unavailable' }, 503, { 'cache-control': 'no-store' });
  }
}

export interface PostBody {
  dish?: unknown;
  stars?: unknown;
  /** Honeypot: must be empty. */
  website?: unknown;
  /** Milliseconds the form was open before sending (bots send instantly). */
  elapsed?: unknown;
}

export type Validation = { ok: true; dish: string; stars: number } | { ok: false; error: 'invalid-dish' | 'invalid-stars' | 'bad-request' };

export function validate(body: PostBody, ids = ratableDishIds()): Validation {
  if (typeof body !== 'object' || body === null) return { ok: false, error: 'bad-request' };
  if (typeof body.dish !== 'string' || !ids.has(body.dish)) return { ok: false, error: 'invalid-dish' };
  if (typeof body.stars !== 'number' || !Number.isInteger(body.stars) || body.stars < 1 || body.stars > 5) return { ok: false, error: 'invalid-stars' };
  return { ok: true, dish: body.dish, stars: body.stars };
}

export const LIMITS = {
  ipPer10Min: 20,
  ipPerDay: 60,
  voterPerMinute: 10,
  minElapsedMs: 1200,
};

export async function handleSubmit(request: Request, db: Db | null, cfg: RatingConfig): Promise<Response> {
  if (!cfg.enabled || !db) return json({ ok: false, error: 'disabled' }, 503);
  if (!sameOrigin(request, cfg.hosts)) return json({ ok: false, error: 'forbidden' }, 403);
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return json({ ok: false, error: 'bad-request' }, 415);
  const raw = await request.text();
  if (raw.length > 1024) return json({ ok: false, error: 'bad-request' }, 413);
  let body: PostBody;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'bad-request' }, 400);
  }
  const v = validate(body);
  if (!v.ok) return json({ ok: false, error: v.error }, v.error === 'invalid-dish' ? 404 : 400);

  const now = cfg.now?.() ?? new Date();
  // Bots: honeypot filled or form sent implausibly fast → pretend success, store nothing.
  const elapsed = typeof body.elapsed === 'number' ? body.elapsed : 0;
  if ((typeof body.website === 'string' && body.website !== '') || elapsed < LIMITS.minElapsedMs) {
    return json({ ok: true, action: 'created' });
  }

  let voterId = readCookie(request.headers, VOTER_COOKIE);
  const headers: Record<string, string> = {};
  if (!isVoterId(voterId)) {
    voterId = newVoterId();
    headers['set-cookie'] = cookieHeader(VOTER_COOKIE, voterId, {
      maxAge: 365 * 24 * 3600,
      path: '/api/ratings',
      sameSite: 'Lax',
      secure: cfg.secureCookies,
    });
  }
  const vHash = voterHash(cfg.secret, voterId);
  const ipHash = ipDayHash(cfg.secret, clientIp(request.headers), now);

  try {
    const allowed = await allowRate(db, [
      { key: `ip10:${ipHash}`, max: LIMITS.ipPer10Min, windowSeconds: 600 },
      { key: `ipday:${ipHash}`, max: LIMITS.ipPerDay, windowSeconds: 86400 },
      { key: `voter:${vHash}`, max: LIMITS.voterPerMinute, windowSeconds: 60 },
    ]);
    if (!allowed) return json({ ok: false, error: 'rate-limited' }, 429, { ...headers, 'retry-after': '600' });
    const action = await submitRating(db, { env: cfg.env, dishId: v.dish, stars: v.stars, voterHash: vHash, ipDayHash: ipHash });
    if (Math.random() < 0.02) await purge(db);
    if (action === 'locked') return json({ ok: false, error: 'locked' }, 409, headers);
    const [s] = rank(await dishStats(db, cfg.env)).filter((d) => d.dishId === v.dish);
    return json({ ok: true, action, dish: v.dish, n: s?.n ?? 0, avg: s?.avg == null ? null : round1(s.avg) }, 200, { ...headers, 'cache-control': 'no-store' });
  } catch {
    return json({ ok: false, error: 'unavailable' }, 503, headers);
  }
}
