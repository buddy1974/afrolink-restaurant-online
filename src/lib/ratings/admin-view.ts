/**
 * Data assembly for the management dashboard and the six-month report (server-side only).
 */
import type { Db } from './db.ts';
import { ci95, favourites, highestRated, mostRated, rank, round1, type RankedDish } from './ranking.ts';
import { dishStats, getLaunch, moderationLog, monthly, recent, sixMonthsAfter, suspicious, totals, type StatsFilter } from './service.ts';
import { foodMenu } from '../../data/menu.ts';

export function dishNames(): Record<string, { name: string; category: string; categoryId: string }> {
  const out: Record<string, { name: string; category: string; categoryId: string }> = {};
  for (const c of foodMenu) for (const i of c.items) out[i.id] = { name: i.display?.de ?? i.name, category: c.title.de, categoryId: c.id };
  return out;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** ?from=YYYY-MM-DD&to=YYYY-MM-DD (inclusive) &cat=<category id> */
export function filterFromUrl(url: URL): StatsFilter & { cat?: string; fromDate?: string; toDate?: string } {
  const from = url.searchParams.get('from') ?? '';
  const to = url.searchParams.get('to') ?? '';
  const cat = url.searchParams.get('cat') ?? '';
  const f: StatsFilter & { cat?: string; fromDate?: string; toDate?: string } = {};
  if (DATE.test(from)) {
    f.from = `${from}T00:00:00+01:00`;
    f.fromDate = from;
  }
  if (DATE.test(to)) {
    const d = new Date(`${to}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    f.to = `${d.toISOString().slice(0, 10)}T00:00:00+01:00`;
    f.toDate = to;
  }
  const category = foodMenu.find((c) => c.id === cat);
  if (category) {
    f.cat = cat;
    f.dishIds = category.items.map((i) => i.id);
  }
  return f;
}

export interface EmergingRow {
  dishId: string;
  recentAvg: number;
  recentN: number;
  earlierAvg: number | null;
  earlierN: number;
}

export async function dashboard(db: Db, env: string, f: StatsFilter) {
  const names = dishNames();
  const [stats, months, tot, sus, latest, modLog, launch] = await Promise.all([
    dishStats(db, env, f),
    monthly(db, env, f),
    totals(db, env, f),
    suspicious(db, env),
    recent(db, env, 60),
    moderationLog(db, env, 30),
    getLaunch(db, env),
  ]);
  const ranked = rank(stats);
  const overall = ranked.reduce<[number, number, number, number, number]>(
    (a, d) => [a[0] + d.dist[0], a[1] + d.dist[1], a[2] + d.dist[2], a[3] + d.dist[3], a[4] + d.dist[4]],
    [0, 0, 0, 0, 0],
  );
  const n = overall.reduce((a, b) => a + b, 0);
  const mean = n ? overall.reduce((a, c, i) => a + c * (i + 1), 0) / n : null;

  // Emerging favourites: last 30 days vs. everything before (within the filter), min 3 recent ratings.
  const cutoff = new Date(Date.now() - 30 * 86400_000).toISOString();
  const [recentStats, earlierStats] = await Promise.all([
    dishStats(db, env, { ...f, from: f.from && f.from > cutoff ? f.from : cutoff }),
    dishStats(db, env, { ...f, to: f.to && f.to < cutoff ? f.to : cutoff }),
  ]);
  const emerging: EmergingRow[] = recentStats
    .filter((r) => r.n >= 3)
    .map((r) => {
      const e = earlierStats.find((x) => x.dishId === r.dishId);
      return { dishId: r.dishId, recentAvg: r.sum / r.n, recentN: r.n, earlierAvg: e && e.n ? e.sum / e.n : null, earlierN: e?.n ?? 0 };
    })
    .filter((r) => r.recentAvg >= 4 && (r.earlierAvg == null || r.recentAvg - r.earlierAvg >= 0.3))
    .sort((a, b) => b.recentAvg - a.recentAvg);

  const weaker = ranked.filter((d) => d.n >= 5 && (d.score ?? 5) < 3.5).sort((a, b) => (a.score ?? 0) - (b.score ?? 0));

  return {
    names,
    ranked: [...ranked].sort((a, b) => names[a.dishId]?.category.localeCompare(names[b.dishId]?.category ?? '') || b.n - a.n),
    top: highestRated(ranked).slice(0, 10),
    most: mostRated(ranked).slice(0, 10),
    favourites: favourites(ranked),
    emerging,
    weaker,
    overall,
    mean,
    months,
    totals: tot,
    suspicious: sus,
    latest,
    modLog,
    launch,
    evaluationEnd: launch ? sixMonthsAfter(launch) : null,
  };
}

export function fmtAvg(x: number | null | undefined): string {
  return x == null ? '–' : round1(x).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function ciText(d: RankedDish): string {
  const h = ci95(d.dist);
  return h == null ? 'n < 2' : `± ${h.toFixed(2)}`;
}

/** Category-level aggregates for the report. */
export function byCategory(ranked: RankedDish[]) {
  const names = dishNames();
  const map = new Map<string, { category: string; n: number; sum: number; dishes: number }>();
  for (const d of ranked) {
    const c = names[d.dishId]?.category ?? '(früheres Gericht)';
    const e = map.get(c) ?? { category: c, n: 0, sum: 0, dishes: 0 };
    e.n += d.n;
    e.sum += d.sum;
    e.dishes += 1;
    map.set(c, e);
  }
  return [...map.values()].map((e) => ({ ...e, avg: e.n ? e.sum / e.n : null })).sort((a, b) => b.n - a.n);
}
