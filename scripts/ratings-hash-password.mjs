#!/usr/bin/env node
/**
 * Create the value for RATINGS_ADMIN_PASSWORD_HASH from a management password.
 * Run locally, type the password when asked (it is not echoed), paste ONLY the printed hash into
 * Vercel → Settings → Environment Variables. Never share the password itself.
 */
import { scryptSync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';

const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
rl._writeToOutput = (s) => {
  if (s.includes('Password')) rl.output.write(s);
};
rl.question('Password (min. 12 characters): ', (pw) => {
  rl.close();
  process.stdout.write('\n');
  if (pw.length < 12) {
    console.error('Too short — use at least 12 characters.');
    process.exit(1);
  }
  const salt = randomBytes(16);
  const N = 16384;
  const r = 8;
  const p = 1;
  const hash = scryptSync(pw, salt, 32, { N, r, p });
  console.log(['scrypt', N, r, p, salt.toString('base64'), hash.toString('base64')].join('$'));
});
