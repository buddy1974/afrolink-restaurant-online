/**
 * Production identity for search-engine tooling (IndexNow, production checks).
 * Keep in sync with src/data/business.ts (siteUrl) and astro.config.mjs (site);
 * tests/indexnow.test.ts enforces this.
 */
export const SITE_URL = 'https://www.afrolink-restaurant.online';
export const HOST = 'www.afrolink-restaurant.online';
export const APEX = 'afrolink-restaurant.online';

/**
 * IndexNow key. Public by design: the protocol proves control of the host by serving this key
 * at https://<host>/<key>.txt (public/<key>.txt). It is not a credential for anything else.
 * To rotate: create a new key file, change this constant, deploy, then delete the old file.
 */
export const INDEXNOW_KEY = '02502a44c56d8c91cfdb71a09707b9a9';
export const INDEXNOW_KEY_URL = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
/** Shared endpoint: a submission is forwarded to all participating engines (indexnow.org/faq). */
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

/** Path prefixes that must never be submitted (mirrors robots.txt). */
export const PRIVATE_PREFIXES = ['/admin/', '/api/'];
