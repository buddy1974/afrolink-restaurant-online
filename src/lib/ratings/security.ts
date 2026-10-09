/**
 * Anonymous voter identity, abuse keys and management authentication.
 * Nothing here stores or returns raw personal data:
 * - the anonymous cookie id is only ever stored as an HMAC (voter_hash);
 * - IP addresses are only used as a daily-rotating HMAC (ip_day_hash) for rate limiting.
 */
import { createHmac, randomUUID, scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

export const VOTER_COOKIE = 'afl_rv';
export const ADMIN_COOKIE = 'afl_admin';
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

export function hmac(secret: string, value: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function newVoterId(): string {
  return randomUUID();
}

/** Accept only ids we could have issued (UUID v4 shape). */
export function isVoterId(v: string | undefined | null): v is string {
  return !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export function voterHash(secret: string, voterId: string): string {
  return hmac(secret, `voter:${voterId}`);
}

/** Client IP as seen by Vercel's edge (first x-forwarded-for entry). */
export function clientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return headers.get('x-real-ip') ?? 'unknown';
}

export function ipDayHash(secret: string, ip: string, now: Date): string {
  return hmac(secret, `ip:${ip}:${now.toISOString().slice(0, 10)}`);
}

export function readCookie(headers: Headers, name: string): string | undefined {
  const raw = headers.get('cookie');
  if (!raw) return undefined;
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return undefined;
}

export function cookieHeader(name: string, value: string, opts: { maxAge: number; path: string; sameSite: 'Lax' | 'Strict'; secure: boolean }): string {
  return [
    `${name}=${encodeURIComponent(value)}`,
    `Path=${opts.path}`,
    `Max-Age=${opts.maxAge}`,
    'HttpOnly',
    `SameSite=${opts.sameSite}`,
    ...(opts.secure ? ['Secure'] : []),
  ].join('; ');
}

/* ───────────── Management password (scrypt) ───────────── */

/** Format: scrypt$<N>$<r>$<p>$<salt b64>$<hash b64>. Generate with `npm run ratings:hash-password`. */
export function hashPassword(password: string, salt = randomBytes(16)): string {
  const N = 16384;
  const r = 8;
  const p = 1;
  const hash = scryptSync(password, salt, 32, { N, r, p });
  return ['scrypt', N, r, p, salt.toString('base64'), hash.toString('base64')].join('$');
}

export function verifyPassword(password: string, stored: string | undefined): boolean {
  if (!stored) return false;
  const [scheme, N, r, p, salt, hash] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64');
  const actual = scryptSync(password, Buffer.from(salt, 'base64'), expected.length, { N: Number(N), r: Number(r), p: Number(p) });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/* ───────────── Management session (signed, expiring) ───────────── */

export function adminToken(secret: string, now: Date, seconds = ADMIN_SESSION_SECONDS): string {
  const exp = Math.floor(now.getTime() / 1000) + seconds;
  return `${exp}.${hmac(secret, `admin:${exp}`)}`;
}

export function verifyAdminToken(secret: string, token: string | undefined, now: Date): boolean {
  if (!token) return false;
  const [exp, sig] = token.split('.');
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < now.getTime() / 1000) return false;
  const expected = Buffer.from(hmac(secret, `admin:${exp}`));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Same-origin check for state-changing requests (CSRF / cross-site scripted voting). */
export function sameOrigin(request: Request, allowedHosts: string[]): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const host = new URL(origin).host;
    return allowedHosts.includes(host) || host === new URL(request.url).host;
  } catch {
    return false;
  }
}
