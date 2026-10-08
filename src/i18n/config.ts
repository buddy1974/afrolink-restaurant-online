/**
 * Multilingual architecture.
 * - German is the default and lives at "/" (x-default) — the printed QR codes point here.
 * - English at /en/, French at /fr/ — distinct URLs, linked with hreflang.
 * - A small head script may move a first-time visitor whose browser prefers EN/FR
 *   (and who never chose a language) from "/" to /en/ or /fr/. Bots are never redirected.
 */

export const locales = ['de', 'en', 'fr'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'de';

/** A string in every supported language. */
export type L10n = Record<Lang, string>;

export const htmlLang: Record<Lang, string> = { de: 'de-DE', en: 'en', fr: 'fr' };
export const ogLocale: Record<Lang, string> = { de: 'de_DE', en: 'en_GB', fr: 'fr_FR' };
export const langName: Record<Lang, string> = { de: 'Deutsch', en: 'English', fr: 'Français' };

export const routes = {
  home: { de: '/', en: '/en/', fr: '/fr/' },
  imprint: { de: '/impressum/', en: '/en/imprint/', fr: '/fr/mentions-legales/' },
  privacy: { de: '/datenschutz/', en: '/en/privacy/', fr: '/fr/confidentialite/' },
  allergens: { de: '/allergene/', en: '/en/allergens/', fr: '/fr/allergenes/' },
} as const satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

export function path(route: RouteKey, lang: Lang): string {
  return routes[route][lang];
}

export function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && (locales as readonly string[]).includes(v);
}

/** Pick the string for `lang` from a localized value (plain strings pass through). */
export function l(value: L10n | string, lang: Lang): string {
  return typeof value === 'string' ? value : value[lang];
}
