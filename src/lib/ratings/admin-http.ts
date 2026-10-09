/**
 * Management endpoints (login, logout, moderation, CSV export). Session: signed, expiring,
 * HttpOnly SameSite=Strict cookie; every state change also requires a same-origin request.
 * Management can view, export and exclude/restore ratings with a reason (audited) — it can never
 * create ratings or change star values.
 */
import type { Db } from './db.ts';
import { allowRate, exportRows, moderate, MODERATION_REASONS, type ModerationReason, type StatsFilter } from './service.ts';
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  adminToken,
  clientIp,
  cookieHeader,
  ipDayHash,
  readCookie,
  sameOrigin,
  verifyAdminToken,
  verifyPassword,
} from './security.ts';
import type { RatingConfig } from './http.ts';

export interface AdminConfig extends RatingConfig {
  passwordHash: string | undefined;
}

export function adminConfigFromEnv(base: RatingConfig, env: Record<string, string | undefined> = process.env): AdminConfig {
  return { ...base, passwordHash: env.RATINGS_ADMIN_PASSWORD_HASH };
}

export const noStore = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' };

export function isAdmin(request: Request, cfg: AdminConfig): boolean {
  return !!cfg.secret && verifyAdminToken(cfg.secret, readCookie(request.headers, ADMIN_COOKIE), cfg.now?.() ?? new Date());
}

const redirect = (location: string, extra: Record<string, string> = {}) =>
  new Response(null, { status: 303, headers: { location, ...noStore, ...extra } });

export async function handleLogin(request: Request, db: Db | null, cfg: AdminConfig): Promise<Response> {
  if (!cfg.secret || !cfg.passwordHash) return new Response('Management access is not configured.', { status: 503, headers: noStore });
  if (!sameOrigin(request, cfg.hosts)) return new Response('Forbidden', { status: 403, headers: noStore });
  const now = cfg.now?.() ?? new Date();
  if (db) {
    const ok = await allowRate(db, [{ key: `login:${ipDayHash(cfg.secret, clientIp(request.headers), now)}`, max: 5, windowSeconds: 900 }]);
    if (!ok) return redirect('/admin/ratings/?e=rate');
  }
  const form = await request.formData();
  const password = String(form.get('password') ?? '');
  if (!verifyPassword(password, cfg.passwordHash)) return redirect('/admin/ratings/?e=login');
  return redirect('/admin/ratings/', {
    'set-cookie': cookieHeader(ADMIN_COOKIE, adminToken(cfg.secret, now), {
      maxAge: ADMIN_SESSION_SECONDS,
      path: '/',
      sameSite: 'Strict',
      secure: cfg.secureCookies,
    }),
  });
}

export function handleLogout(cfg: AdminConfig): Response {
  return redirect('/admin/ratings/', {
    'set-cookie': cookieHeader(ADMIN_COOKIE, '', { maxAge: 0, path: '/', sameSite: 'Strict', secure: cfg.secureCookies }),
  });
}

export async function handleModerate(request: Request, db: Db | null, cfg: AdminConfig): Promise<Response> {
  if (!isAdmin(request, cfg)) return new Response('Unauthorized', { status: 401, headers: noStore });
  if (!sameOrigin(request, cfg.hosts)) return new Response('Forbidden', { status: 403, headers: noStore });
  if (!db) return new Response('Database unavailable', { status: 503, headers: noStore });
  const form = await request.formData();
  const id = Number(form.get('id'));
  const action = form.get('action');
  const reason = String(form.get('reason') ?? '') as ModerationReason;
  const note = String(form.get('note') ?? '').trim();
  if (!Number.isInteger(id) || id <= 0 || (action !== 'exclude' && action !== 'restore') || !MODERATION_REASONS.includes(reason)) {
    return new Response('Bad request', { status: 400, headers: noStore });
  }
  if (reason === 'other' && note.length < 5) return redirect('/admin/ratings/?e=note#moderation');
  const done = await moderate(db, cfg.env, id, action, reason, note);
  return redirect(`/admin/ratings/?m=${done ? 'ok' : 'none'}#moderation`);
}

function csvCell(v: unknown): string {
  const s = String(v ?? '');
  // Neutralise spreadsheet formulas, then quote.
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  return [columns.join(','), ...rows.map((r) => columns.map((c) => csvCell(r[c])).join(','))].join('\r\n') + '\r\n';
}

export async function handleExport(
  request: Request,
  db: Db | null,
  cfg: AdminConfig,
  filter: StatsFilter,
  names: Record<string, { name: string; category: string }>,
): Promise<Response> {
  if (!isAdmin(request, cfg)) return new Response('Unauthorized', { status: 401, headers: noStore });
  if (!db) return new Response('Database unavailable', { status: 503, headers: noStore });
  const rows = (await exportRows(db, cfg.env, filter)).map((r) => ({
    rating_id: r.id,
    dish_id: r.dishId,
    dish_name: names[r.dishId]?.name ?? '(not on current menu)',
    category: names[r.dishId]?.category ?? '',
    stars: r.stars,
    status: r.status,
    revisions: r.revisions,
    created_at: r.createdAt,
    updated_at: r.updatedAt,
  }));
  const csv = toCsv(rows, ['rating_id', 'dish_id', 'dish_name', 'category', 'stars', 'status', 'revisions', 'created_at', 'updated_at']);
  return new Response('﻿' + csv, {
    headers: {
      ...noStore,
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="afrolink-ratings-${cfg.env}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
