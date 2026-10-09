#!/usr/bin/env node
/**
 * Apply the ratings schema to the database in DATABASE_URL (idempotent).
 *   Preview:    vercel env pull .env.preview --environment=preview  →  node --env-file=.env.preview scripts/db-migrate.mjs
 *   Production: only after approval (docs/ratings.md → Activation).
 * Prints nothing secret.
 */
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}
const sql = neon(url);
const statements = readFileSync(new URL('../db/migrations/001_ratings.sql', import.meta.url), 'utf8')
  .split('\n')
  .filter((l) => !l.trim().startsWith('--'))
  .join('\n')
  .split(/;\s*(?:\n|$)/)
  .map((s) => s.trim())
  .filter(Boolean);
for (const s of statements) await sql.query(s);
const tables = await sql.query(
  `select table_name from information_schema.tables where table_schema = 'public' and table_name in ('rating','rating_event','rate_hit','setting') order by 1`,
);
console.log(`Applied ${statements.length} statements. Tables: ${tables.map((t) => t.table_name).join(', ')}`);
