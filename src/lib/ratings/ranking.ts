/**
 * Ranking maths for dish ratings — shared by the API, the menu UI and the management dashboard.
 *
 * Highest rated: Bayesian (damped) average
 *     score = (C · m + Σstars) / (C + n)
 *   m = mean of all valid ratings (the prior), C = PRIOR_WEIGHT "virtual ratings".
 *   A dish with one 5-star vote is pulled strongly towards m; with many consistent ratings the
 *   score approaches its own mean. Dishes need at least MIN_RATINGS_TOP ratings to be ranked.
 * Most rated:    number of valid ratings (n), ties → score.
 * Trending (30d):number of valid ratings created in the last 30 days — rating ACTIVITY, not sales.
 * Recently rated:latest rating activity (created or revised).
 * Favourites:    n ≥ FAVOURITE_MIN_RATINGS and score ≥ FAVOURITE_MIN_SCORE, best 3.
 */
export const PRIOR_WEIGHT = 5;
export const MIN_RATINGS_TOP = 3;
export const FAVOURITE_MIN_RATINGS = 5;
export const FAVOURITE_MIN_SCORE = 4.0;
export const FAVOURITE_MAX = 3;

export interface DishStats {
  dishId: string;
  /** Number of valid (active) ratings. */
  n: number;
  /** Sum of stars of valid ratings. */
  sum: number;
  /** Count per star value 1..5 (index 0 = 1 star). */
  dist: [number, number, number, number, number];
  /** Valid ratings created in the last 30 days. */
  n30: number;
  /** ISO timestamp of the latest activity, or null. */
  last: string | null;
}

export interface RankedDish extends DishStats {
  avg: number | null;
  score: number | null;
}

/** Mean of all valid ratings across dishes (0 when there are none). */
export function globalMean(stats: DishStats[]): number {
  const n = stats.reduce((a, s) => a + s.n, 0);
  return n === 0 ? 0 : stats.reduce((a, s) => a + s.sum, 0) / n;
}

export function bayesian(s: Pick<DishStats, 'n' | 'sum'>, prior: number, weight = PRIOR_WEIGHT): number | null {
  if (s.n === 0) return null;
  return (weight * prior + s.sum) / (weight + s.n);
}

export function rank(stats: DishStats[]): RankedDish[] {
  const m = globalMean(stats);
  return stats.map((s) => ({ ...s, avg: s.n ? s.sum / s.n : null, score: bayesian(s, m) }));
}

/** Round to one decimal for display (4.25 → 4.3). */
export function round1(x: number): number {
  return Math.round(x * 10 + Number.EPSILON) / 10;
}

const byScore = (a: RankedDish, b: RankedDish) => (b.score ?? 0) - (a.score ?? 0) || b.n - a.n || a.dishId.localeCompare(b.dishId);

export function highestRated(d: RankedDish[], min = MIN_RATINGS_TOP): RankedDish[] {
  return d.filter((x) => x.n >= min).sort(byScore);
}
export function mostRated(d: RankedDish[]): RankedDish[] {
  return d.filter((x) => x.n > 0).sort((a, b) => b.n - a.n || byScore(a, b));
}
export function trending(d: RankedDish[]): RankedDish[] {
  return d.filter((x) => x.n30 > 0).sort((a, b) => b.n30 - a.n30 || byScore(a, b));
}
export function recentlyRated(d: RankedDish[]): RankedDish[] {
  return d.filter((x) => x.last).sort((a, b) => (b.last! < a.last! ? -1 : b.last! > a.last! ? 1 : 0));
}
export function favourites(d: RankedDish[]): RankedDish[] {
  return d
    .filter((x) => x.n >= FAVOURITE_MIN_RATINGS && (x.score ?? 0) >= FAVOURITE_MIN_SCORE)
    .sort(byScore)
    .slice(0, FAVOURITE_MAX);
}

/** 95 % confidence half-width of a mean from its star distribution (normal approximation). */
export function ci95(dist: DishStats['dist']): number | null {
  const n = dist.reduce((a, b) => a + b, 0);
  if (n < 2) return null;
  const mean = dist.reduce((a, c, i) => a + c * (i + 1), 0) / n;
  const variance = dist.reduce((a, c, i) => a + c * (i + 1 - mean) ** 2, 0) / (n - 1);
  return 1.96 * Math.sqrt(variance / n);
}
