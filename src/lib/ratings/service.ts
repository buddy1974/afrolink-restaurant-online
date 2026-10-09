/**
 * Rating service — all database logic. Every function takes the Db and the environment name
 * ('production' | 'preview' | 'development' | 'test'), so QA data never mixes with real ratings.
 */
import type { Db } from './db.ts';
import type { DishStats } from './ranking.ts';
import { allFoodItems } from '../../data/menu.ts';

/** Dishes that can currently be rated (stable ids from the menu). */
export function ratableDishIds(): Set<string> {
  return new Set(
    allFoodItems()
      .filter(({ item }) => item.available !== false)
      .map(({ item }) => item.id),
  );
}

export type SubmitResult = 'created' | 'revised' | 'unchanged' | 'locked';

/**
 * Create or revise the voter's single rating for a dish — one atomic statement (CTE), so
 * concurrent double-submits cannot create duplicates (unique env+dish+voter).
 * A rating excluded by moderation cannot be revised ('locked').
 */
export async function submitRating(
  db: Db,
  input: { env: string; dishId: string; stars: number; voterHash: string; ipDayHash: string | null },
): Promise<SubmitResult> {
  const rows = await db.query<{ inserted: boolean | null; prev_status: string | null; changed: boolean }>(
    `with prev as (
       select id, stars, status from rating where env = $1 and dish_id = $2 and voter_hash = $3
     ), up as (
       insert into rating (env, dish_id, voter_hash, stars) values ($1, $2, $3, $4)
       on conflict (env, dish_id, voter_hash) do update
         set stars = excluded.stars, updated_at = now(), revisions = rating.revisions + 1
         where rating.status = 'active' and rating.stars <> excluded.stars
       returning id, stars, (xmax = 0) as inserted
     ), ev as (
       insert into rating_event (env, rating_id, dish_id, action, old_stars, new_stars, actor, ip_day_hash)
       select $1, up.id, $2, case when up.inserted then 'create' else 'revise' end,
              case when up.inserted then null else (select stars from prev) end, up.stars, 'guest', $5
       from up
       returning id
     )
     select (select inserted from up) as inserted,
            (select status from prev) as prev_status,
            exists (select 1 from ev) as changed`,
    [input.env, input.dishId, input.voterHash, input.stars, input.ipDayHash],
  );
  const r = rows[0];
  if (r?.changed) return r.inserted ? 'created' : 'revised';
  if (r?.prev_status === 'excluded') return 'locked';
  return 'unchanged';
}

/**
 * Sliding-window rate limit. Returns false (and records nothing) when any limit is exceeded;
 * otherwise records one hit per key.
 */
export async function allowRate(db: Db, limits: { key: string; max: number; windowSeconds: number }[]): Promise<boolean> {
  for (const l of limits) {
    const [{ c }] = await db.query<{ c: number }>(
      `select count(*)::int as c from rate_hit where key = $1 and at > now() - make_interval(secs => $2)`,
      [l.key, l.windowSeconds],
    );
    if (c >= l.max) return false;
  }
  for (const l of limits) await db.query(`insert into rate_hit (key) values ($1)`, [l.key]);
  return true;
}

/** Housekeeping: drop old rate-limit rows and forget daily IP hashes after 30 days. */
export async function purge(db: Db): Promise<void> {
  await db.query(`delete from rate_hit where at < now() - interval '2 days'`);
  await db.query(`update rating_event set ip_day_hash = null where ip_day_hash is not null and at < now() - interval '30 days'`);
}

export interface StatsFilter {
  from?: string; // inclusive ISO date (rating created_at)
  to?: string; // exclusive ISO date
  dishIds?: string[];
}

const iso = (v: unknown): string | null => (v == null ? null : v instanceof Date ? v.toISOString() : new Date(String(v)).toISOString());

/** Per-dish aggregates of valid (active) ratings. */
export async function dishStats(db: Db, env: string, f: StatsFilter = {}): Promise<DishStats[]> {
  const rows = await db.query<Record<string, unknown>>(
    `select dish_id,
            count(*)::int as n, coalesce(sum(stars), 0)::int as sum,
            count(*) filter (where stars = 1)::int as d1, count(*) filter (where stars = 2)::int as d2,
            count(*) filter (where stars = 3)::int as d3, count(*) filter (where stars = 4)::int as d4,
            count(*) filter (where stars = 5)::int as d5,
            count(*) filter (where created_at > now() - interval '30 days')::int as n30,
            max(updated_at) as last
       from rating
      where env = $1 and status = 'active'
        and ($2::timestamptz is null or created_at >= $2::timestamptz)
        and ($3::timestamptz is null or created_at < $3::timestamptz)
        and ($4::text[] is null or dish_id = any($4::text[]))
      group by dish_id`,
    [env, f.from ?? null, f.to ?? null, f.dishIds ?? null],
  );
  return rows.map((r) => ({
    dishId: String(r.dish_id),
    n: Number(r.n),
    sum: Number(r.sum),
    dist: [Number(r.d1), Number(r.d2), Number(r.d3), Number(r.d4), Number(r.d5)],
    n30: Number(r.n30),
    last: iso(r.last),
  }));
}

/* ───────────── Evaluation window ───────────── */

export function launchKey(env: string): string {
  return `launch_at:${env}`;
}

/** Record the public launch moment once (never overwritten, never backdated). */
export async function ensureLaunch(db: Db, env: string): Promise<string> {
  await db.query(`insert into setting (key, value) values ($1, now()::text) on conflict (key) do nothing`, [launchKey(env)]);
  return (await getLaunch(db, env))!;
}

export async function getLaunch(db: Db, env: string): Promise<string | null> {
  const rows = await db.query<{ set_at: unknown }>(`select set_at from setting where key = $1`, [launchKey(env)]);
  return rows.length ? iso(rows[0].set_at) : null;
}

export function sixMonthsAfter(isoDate: string): string {
  const d = new Date(isoDate);
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 6, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()));
  return end.toISOString();
}

/* ───────────── Moderation (audited; stars can never be edited by management) ───────────── */

export const MODERATION_REASONS = ['automated', 'same-person-multiple', 'abusive-pattern', 'test-data', 'other'] as const;
export type ModerationReason = (typeof MODERATION_REASONS)[number];

export async function moderate(
  db: Db,
  env: string,
  ratingId: number,
  action: 'exclude' | 'restore',
  reason: ModerationReason,
  note: string,
): Promise<boolean> {
  const from = action === 'exclude' ? 'active' : 'excluded';
  const to = action === 'exclude' ? 'excluded' : 'active';
  const rows = await db.query<{ id: number }>(
    `with up as (
       update rating set status = $4, updated_at = updated_at where id = $2 and env = $1 and status = $3
       returning id, dish_id, stars
     )
     insert into rating_event (env, rating_id, dish_id, action, old_stars, new_stars, actor, reason, note)
     select $1, up.id, up.dish_id, $5, up.stars, up.stars, 'admin', $6, $7 from up
     returning rating_id as id`,
    [env, ratingId, from, to, action, reason, note.slice(0, 500)],
  );
  return rows.length === 1;
}

/* ───────────── Management analytics ───────────── */

export interface MonthRow {
  month: string; // YYYY-MM
  ratings: number;
  avg: number | null;
  voters: number;
}

export async function monthly(db: Db, env: string, f: StatsFilter = {}): Promise<MonthRow[]> {
  const rows = await db.query<Record<string, unknown>>(
    `select to_char(date_trunc('month', created_at at time zone 'Europe/Berlin'), 'YYYY-MM') as month,
            count(*)::int as ratings, avg(stars)::float as avg, count(distinct voter_hash)::int as voters
       from rating
      where env = $1 and status = 'active'
        and ($2::timestamptz is null or created_at >= $2::timestamptz)
        and ($3::timestamptz is null or created_at < $3::timestamptz)
        and ($4::text[] is null or dish_id = any($4::text[]))
      group by 1 order by 1`,
    [env, f.from ?? null, f.to ?? null, f.dishIds ?? null],
  );
  return rows.map((r) => ({ month: String(r.month), ratings: Number(r.ratings), avg: r.avg == null ? null : Number(r.avg), voters: Number(r.voters) }));
}

export interface Totals {
  active: number;
  excluded: number;
  voters: number;
  revisions: number;
}

export async function totals(db: Db, env: string, f: StatsFilter = {}): Promise<Totals> {
  const [r] = await db.query<Record<string, unknown>>(
    `select count(*) filter (where status = 'active')::int as active,
            count(*) filter (where status = 'excluded')::int as excluded,
            count(distinct voter_hash) filter (where status = 'active')::int as voters,
            coalesce(sum(revisions), 0)::int as revisions
       from rating
      where env = $1
        and ($2::timestamptz is null or created_at >= $2::timestamptz)
        and ($3::timestamptz is null or created_at < $3::timestamptz)
        and ($4::text[] is null or dish_id = any($4::text[]))`,
    [env, f.from ?? null, f.to ?? null, f.dishIds ?? null],
  );
  return { active: Number(r.active), excluded: Number(r.excluded), voters: Number(r.voters), revisions: Number(r.revisions) };
}

export interface SuspiciousRow {
  kind: 'ip-day-burst' | 'voter-burst';
  key: string; // shortened hash, never the IP
  day: string;
  ratings: number;
  dishes: number;
  sameStars: boolean;
}

/**
 * Patterns worth a look (not automatic exclusion):
 * - one daily IP hash creating many ratings on one day (several devices behind one network are
 *   normal in a restaurant, so the threshold is generous);
 * - one voter rating many dishes within 10 minutes, all with the same star value.
 */
export async function suspicious(db: Db, env: string, ipThreshold = 15, voterThreshold = 8): Promise<SuspiciousRow[]> {
  const ip = await db.query<Record<string, unknown>>(
    `select ip_day_hash as key, to_char(min(at), 'YYYY-MM-DD') as day, count(*)::int as ratings,
            count(distinct dish_id)::int as dishes, (count(distinct new_stars) = 1) as same
       from rating_event
      where env = $1 and action = 'create' and ip_day_hash is not null
      group by ip_day_hash having count(*) >= $2 order by 3 desc limit 50`,
    [env, ipThreshold],
  );
  const voter = await db.query<Record<string, unknown>>(
    `select voter_hash as key, to_char(min(created_at), 'YYYY-MM-DD') as day, count(*)::int as ratings,
            count(distinct dish_id)::int as dishes, (count(distinct stars) = 1) as same
       from rating
      where env = $1 and status = 'active'
      group by voter_hash
     having count(*) >= $2 and max(created_at) - min(created_at) < interval '10 minutes' and count(distinct stars) = 1
      order by 3 desc limit 50`,
    [env, voterThreshold],
  );
  const map = (kind: SuspiciousRow['kind']) => (r: Record<string, unknown>): SuspiciousRow => ({
    kind,
    key: String(r.key).slice(0, 10),
    day: String(r.day),
    ratings: Number(r.ratings),
    dishes: Number(r.dishes),
    sameStars: Boolean(r.same),
  });
  return [...ip.map(map('ip-day-burst')), ...voter.map(map('voter-burst'))];
}

export interface RecentRow {
  id: number;
  dishId: string;
  stars: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  revisions: number;
  voter: string; // shortened hash
}

export async function recent(db: Db, env: string, limit = 50): Promise<RecentRow[]> {
  const rows = await db.query<Record<string, unknown>>(
    `select id, dish_id, stars, status, created_at, updated_at, revisions, voter_hash
       from rating where env = $1 order by updated_at desc limit $2`,
    [env, limit],
  );
  return rows.map((r) => ({
    id: Number(r.id),
    dishId: String(r.dish_id),
    stars: Number(r.stars),
    status: String(r.status),
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
    revisions: Number(r.revisions),
    voter: String(r.voter_hash).slice(0, 8),
  }));
}

export async function moderationLog(db: Db, env: string, limit = 50) {
  const rows = await db.query<Record<string, unknown>>(
    `select rating_id, dish_id, action, reason, note, at from rating_event
      where env = $1 and actor = 'admin' order by at desc limit $2`,
    [env, limit],
  );
  return rows.map((r) => ({
    ratingId: Number(r.rating_id),
    dishId: String(r.dish_id),
    action: String(r.action),
    reason: r.reason == null ? '' : String(r.reason),
    note: r.note == null ? '' : String(r.note),
    at: iso(r.at)!,
  }));
}

/** One row per rating (no voter or IP data) for management analysis. */
export async function exportRows(db: Db, env: string, f: StatsFilter = {}) {
  const rows = await db.query<Record<string, unknown>>(
    `select id, dish_id, stars, status, revisions, created_at, updated_at
       from rating
      where env = $1
        and ($2::timestamptz is null or created_at >= $2::timestamptz)
        and ($3::timestamptz is null or created_at < $3::timestamptz)
        and ($4::text[] is null or dish_id = any($4::text[]))
      order by created_at`,
    [env, f.from ?? null, f.to ?? null, f.dishIds ?? null],
  );
  return rows.map((r) => ({
    id: Number(r.id),
    dishId: String(r.dish_id),
    stars: Number(r.stars),
    status: String(r.status),
    revisions: Number(r.revisions),
    createdAt: iso(r.created_at)!,
    updatedAt: iso(r.updated_at)!,
  }));
}

export async function ping(db: Db): Promise<number> {
  const t = Date.now();
  await db.query('select 1');
  return Date.now() - t;
}
