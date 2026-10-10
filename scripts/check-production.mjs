#!/usr/bin/env node
/**
 * Production smoke check: DNS (public + authoritative), TLS, canonical host, redirects,
 * homepage, sitemap, robots.txt, 404, verification records, IndexNow key — docs/indexnow.md.
 *
 *   node scripts/check-production.mjs
 *
 * Environment (all optional):
 *   DNS_VERIFICATION_RECORDS  "name=target,name=target" (names relative to the apex)
 *   MIN_SITEMAP_URLS          minimum sitemap size (default 100)
 *   EXPECT_INDEXNOW_KEY       "true"/"false"; default: whether this checkout contains the key file
 *   EXPECT_ALIAS_NOINDEX      "true"/"false"; default: whether this checkout's vercel.json has the rule
 * Exit code 1 if any check fails (warnings do not fail).
 */
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { parseVerificationRecords, runChecks } from './seo/production-checks.mjs';
import { INDEXNOW_KEY } from './seo/site.mjs';

// The code that is (about to be) live defines what production must serve.
const flag = (name, fallback) => (process.env[name] ? process.env[name] === 'true' : fallback);
const repoFile = (f) => new URL(`../${f}`, import.meta.url);
const hasKeyFile = existsSync(repoFile(`public/${INDEXNOW_KEY}.txt`));
const hasAliasRule = existsSync(repoFile('vercel.json')) && readFileSync(repoFile('vercel.json'), 'utf8').includes('X-Robots-Tag');

const results = await runChecks({
  verificationRecords: parseVerificationRecords(process.env.DNS_VERIFICATION_RECORDS),
  minSitemapUrls: Number(process.env.MIN_SITEMAP_URLS ?? 100),
  expectIndexNowKey: flag('EXPECT_INDEXNOW_KEY', hasKeyFile),
  expectAliasNoindex: flag('EXPECT_ALIAS_NOINDEX', hasAliasRule),
});
const icon = { pass: 'PASS', warn: 'WARN', fail: 'FAIL' };
for (const r of results) console.log(`${icon[r.status]}  ${r.check.padEnd(58)} ${r.detail}`);
const count = (s) => results.filter((r) => r.status === s).length;
console.log(`\n${results.length} checks: ${count('pass')} pass, ${count('warn')} warn, ${count('fail')} fail`);
if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = results.map((r) => `| ${icon[r.status]} | ${r.check} | ${r.detail.replaceAll('|', '\\|')} |`);
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Production check\n| | check | detail |\n|---|---|---|\n${rows.join('\n')}\n`);
}
process.exitCode = count('fail') ? 1 : 0;
