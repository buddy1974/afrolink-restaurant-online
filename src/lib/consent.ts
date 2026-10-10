/**
 * Consent state for optional storage/access (§ 25 Abs. 1 TDDDG, Art. 6(1)(a)/7 GDPR).
 * - Default: everything optional is OFF; nothing optional runs before a choice.
 * - The choice is kept locally ("afl-consent") with version and timestamp, expires after 12 months
 *   and is never sent to a server (no consent IDs, no personal data).
 * - Withdrawing a category immediately removes what it stored.
 */
import { CONSENT_KEY, CONSENT_MAX_AGE_DAYS, CONSENT_VERSION } from '../data/storage-inventory.ts';

export type OptionalCategory = 'media' | 'prefs' | 'ratings';
export type Choices = Record<OptionalCategory, boolean>;

export interface ConsentRecord extends Choices {
  v: number;
  /** ISO time of the decision. */
  at: string;
}

export const NONE: Choices = { media: false, prefs: false, ratings: false };

/** Parse a stored record; invalid, outdated-version or expired records count as "no choice". */
export function parseConsent(raw: string | null, now: Date): ConsentRecord | null {
  if (!raw) return null;
  try {
    const r = JSON.parse(raw) as Partial<ConsentRecord>;
    if (r.v !== CONSENT_VERSION || typeof r.at !== 'string') return null;
    const age = now.getTime() - new Date(r.at).getTime();
    if (!(age >= 0) || age > CONSENT_MAX_AGE_DAYS * 86400_000) return null;
    return { v: r.v, at: r.at, media: r.media === true, prefs: r.prefs === true, ratings: r.ratings === true };
  } catch {
    return null;
  }
}

export function makeRecord(choices: Choices, now: Date): ConsentRecord {
  return { v: CONSENT_VERSION, at: now.toISOString(), media: !!choices.media, prefs: !!choices.prefs, ratings: !!choices.ratings };
}

/* ───────────── Browser helpers ───────────── */

const EVENT = 'afl:consent';

export function readChoices(): Choices {
  try {
    return parseConsent(localStorage.getItem(CONSENT_KEY), new Date()) ?? { ...NONE };
  } catch {
    return { ...NONE };
  }
}

export function hasDecided(): boolean {
  try {
    return parseConsent(localStorage.getItem(CONSENT_KEY), new Date()) !== null;
  } catch {
    return false;
  }
}

export function saveChoices(choices: Choices): void {
  const before = readChoices();
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(makeRecord(choices, new Date())));
  } catch {
    /* storage blocked: optional features simply stay off */
  }
  // Withdrawal takes effect immediately.
  if (before.prefs && !choices.prefs) clearLanguageCookie();
  if (before.ratings && !choices.ratings) forgetRatings();
  window.dispatchEvent(new CustomEvent(EVENT, { detail: choices }));
}

export function setChoice(category: OptionalCategory, value: boolean): void {
  saveChoices({ ...readChoices(), [category]: value });
}

export function onConsentChange(cb: (c: Choices) => void): void {
  window.addEventListener(EVENT, (e) => cb((e as CustomEvent<Choices>).detail));
}

/** Language cookie read by the server-side redirect on "/" (vercel.json); only with prefs consent. */
export function rememberLanguage(lang: string): void {
  if (!readChoices().prefs) return;
  document.cookie = `afl_lang=${encodeURIComponent(lang)}; Max-Age=${365 * 86400}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
}

export function clearLanguageCookie(): void {
  document.cookie = 'afl_lang=; Max-Age=0; Path=/; SameSite=Lax';
}

/** Remove locally remembered ratings and ask the server to expire the HttpOnly rating cookie. */
export function forgetRatings(): void {
  try {
    for (const k of Object.keys(localStorage)) if (k.startsWith('afl-rated:')) localStorage.removeItem(k);
  } catch {
    /* ignore */
  }
  void fetch('/api/ratings', { method: 'DELETE', credentials: 'same-origin' }).catch(() => {});
}
