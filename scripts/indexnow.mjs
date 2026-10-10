#!/usr/bin/env node
/**
 * IndexNow for www.afrolink-restaurant.online — see docs/indexnow.md.
 *
 *   node scripts/indexnow.mjs plan      [--state f] [--report f]          dry run: what would be announced
 *   node scripts/indexnow.mjs run       [--state f] [--state-out f] [--submit] [--full] [--wait-seconds n] [--commit sha]
 *   node scripts/indexnow.mjs bootstrap --state-out f                     record the live site as announced, submit nothing
 *   node scripts/indexnow.mjs verify-key                                  check https://<host>/<key>.txt
 *
 * Submitting needs BOTH `--submit` and the environment variable INDEXNOW_ENABLED=true
 * (set as a GitHub repository variable only after owner approval). Without them `run`
 * behaves exactly like `plan`. A new state is written only for URLs the endpoint accepted.
 *
 * Exit codes: 0 done / nothing to do / dry run · 1 problem (nothing changed) · 2 usage error.
 */
import { appendFileSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { SITE_URL, INDEXNOW_KEY_URL } from './seo/site.mjs';
import {
  classifyRemoved,
  diffSnapshots,
  nextState,
  parseState,
  submitUrls,
  takeSnapshot,
  verifyKeyFile,
} from './seo/indexnow.mjs';

const log = (...a) => console.log('[indexnow]', ...a);
const summary = (md) => process.env.GITHUB_STEP_SUMMARY && appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md}\n`);

function parseArgs(argv) {
  const [cmd = 'plan', ...rest] = argv;
  const opts = { cmd };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (['--submit', '--full'].includes(a)) opts[a.slice(2)] = true;
    else if (['--state', '--state-out', '--report', '--wait-seconds', '--commit', '--site'].includes(a)) opts[a.slice(2)] = rest[++i];
    else throw new Error(`unknown option ${a}`);
  }
  return opts;
}

const list = (title, urls) => (urls.length ? `${title} (${urls.length}):\n${urls.map((u) => `  - ${u}`).join('\n')}` : `${title}: none`);

async function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
    if (!['plan', 'run', 'bootstrap', 'verify-key'].includes(opts.cmd)) throw new Error(`unknown command ${opts.cmd}`);
    if (opts.cmd === 'bootstrap' && !opts['state-out']) throw new Error('bootstrap needs --state-out');
  } catch (e) {
    console.error(`[indexnow] ${e.message}`);
    return 2;
  }
  const siteUrl = opts.site ?? SITE_URL;

  if (opts.cmd === 'verify-key') {
    const k = await verifyKeyFile();
    log(k.ok ? `key file OK: ${INDEXNOW_KEY_URL}` : `key file problem: ${k.problem}`);
    return k.ok ? 0 : 1;
  }

  const wait = Number(opts['wait-seconds'] ?? 0);
  if (wait > 0) {
    log(`waiting ${wait}s for the deployment to settle`);
    await new Promise((r) => setTimeout(r, wait * 1000));
  }

  const snap = await takeSnapshot({ siteUrl });
  log(`snapshot: ${Object.keys(snap.pages).length}/${snap.urlCount ?? 0} sitemap URLs fingerprinted`);
  if (snap.problems.length) {
    // A page that could not be read would look "removed" — never act on an incomplete snapshot.
    log(`ABORT: ${snap.problems.length} problem(s); nothing submitted, state unchanged`);
    for (const p of snap.problems.slice(0, 20)) log(`  - ${p}`);
    if (snap.problems.length > 20) log(`  … and ${snap.problems.length - 20} more`);
    summary(`### IndexNow: aborted\n${snap.problems.slice(0, 50).map((p) => `- ${p}`).join('\n')}`);
    return 1;
  }

  if (opts.cmd === 'bootstrap') {
    writeFileSync(opts['state-out'], JSON.stringify(nextState(null, snap.pages, { accepted: Object.keys(snap.pages), acceptedRemovals: [], commit: opts.commit ?? null })));
    log(`bootstrap: recorded ${Object.keys(snap.pages).length} URLs as announced (nothing submitted)`);
    summary(`### IndexNow: baseline recorded\n${Object.keys(snap.pages).length} URLs, nothing submitted.`);
    return 0;
  }

  const stateText = opts.state && existsSync(opts.state) ? readFileSync(opts.state, 'utf8') : '';
  const state = parseState(stateText);
  if (!state && !opts.full) {
    log('no valid state found: run `bootstrap` (record without submitting) or `run --full` (announce every URL once)');
    summary('### IndexNow: no baseline\nRun the workflow with mode `bootstrap` or `full`.');
    return opts.cmd === 'plan' ? 0 : 1;
  }

  const diff = opts.full
    ? { added: Object.keys(snap.pages).sort(), removed: [], changed: [] }
    : diffSnapshots(state.pages, snap.pages);
  const removedChecks = await Promise.all(diff.removed.map((u) => classifyRemoved(u)));
  const removals = removedChecks.filter((r) => r.submit).map((r) => r.url);
  for (const r of removedChecks.filter((x) => !x.submit)) log(`not announcing removed ${r.url}: ${r.reason}`);
  const toSubmit = [...new Set([...diff.added, ...diff.changed, ...removals])];

  log(list('added', diff.added));
  log(list('changed', diff.changed));
  log(list('removed', diff.removed));
  const report = { at: new Date().toISOString(), commit: opts.commit ?? null, full: !!opts.full, ...diff, removedChecks, toSubmit };
  if (opts.report) writeFileSync(opts.report, JSON.stringify(report, null, 2));

  const enabled = process.env.INDEXNOW_ENABLED === 'true';
  if (opts.cmd === 'plan' || !opts.submit || !enabled) {
    const why = opts.cmd === 'plan' ? 'plan only' : !opts.submit ? 'no --submit' : 'INDEXNOW_ENABLED is not "true"';
    log(`DRY RUN (${why}): would submit ${toSubmit.length} URL(s); state unchanged`);
    summary(`### IndexNow: dry run (${why})\nWould submit ${toSubmit.length} URL(s): ${diff.added.length} added, ${diff.changed.length} changed, ${removals.length} removed.`);
    return 0;
  }

  if (!toSubmit.length) {
    log('nothing changed since the last announcement');
    summary('### IndexNow: nothing to announce');
    return 0;
  }

  const key = await verifyKeyFile();
  if (!key.ok) {
    log(`ABORT: ${key.problem}; nothing submitted`);
    summary(`### IndexNow: aborted\n${key.problem}`);
    return 1;
  }

  const result = await submitUrls(toSubmit, { log });
  const accepted = new Set(result.accepted);
  const state2 = nextState(state, snap.pages, {
    accepted: [...diff.added, ...diff.changed].filter((u) => accepted.has(u)),
    acceptedRemovals: removals.filter((u) => accepted.has(u)),
    commit: opts.commit ?? null,
  });
  if (opts['state-out'] && accepted.size) writeFileSync(opts['state-out'], JSON.stringify(state2));
  log(`accepted ${result.accepted.length}, failed ${result.failed.length} (acceptance is not indexing)`);
  summary(
    `### IndexNow: submitted\n| batch | URLs | HTTP | meaning | attempts |\n|---|---|---|---|---|\n${result.results
      .map((r) => `| ${r.batch} | ${r.urls.length} | ${r.status || '—'} | ${r.meaning} | ${r.attempts} |`)
      .join('\n')}\n\nAccepted means received by IndexNow — not indexed.`,
  );
  return result.failed.length ? 1 : 0;
}

// exitCode (not exit()) lets pending sockets close cleanly — exit() can abort libuv on Windows.
main().then(
  (code) => {
    process.exitCode = code;
  },
  (e) => {
    console.error('[indexnow] unexpected error:', e);
    process.exitCode = 1;
  },
);
