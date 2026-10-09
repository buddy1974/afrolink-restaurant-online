/**
 * Database access for ratings. One tiny interface, two drivers:
 * - Neon serverless (HTTP) in Vercel Functions — DATABASE_URL from the Neon integration.
 * - PGlite (embedded Postgres) for automated tests and optional local development
 *   (RATINGS_DEV_DB=pglite). PGlite is a devDependency and is never bundled for production.
 * All queries are parameterised ($1, $2 …); no string concatenation of user input.
 */
import { neon } from '@neondatabase/serverless';

export interface Db {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
}

export function neonDb(url: string): Db {
  const sql = neon(url);
  return {
    query: async <T>(text: string, params: unknown[] = []) => (await sql.query(text, params)) as T[],
  };
}

interface PgliteLike {
  query<T>(text: string, params?: unknown[]): Promise<{ rows: T[] }>;
  exec(sql: string): Promise<unknown>;
}

export function pgliteDb(pg: PgliteLike): Db {
  return { query: async <T>(text: string, params: unknown[] = []) => (await pg.query<T>(text, params)).rows };
}

/** Split a migration file into single statements (no procedural code in our migrations). */
export function splitStatements(sql: string): string[] {
  return sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(/;\s*(?:\n|$)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function migrate(db: Db, sql: string): Promise<number> {
  const statements = splitStatements(sql);
  for (const s of statements) await db.query(s);
  return statements.length;
}

let devDb: Promise<Db> | null = null;

/** The database for the current runtime, or null when none is configured. */
export async function getDb(env: Record<string, string | undefined> = process.env): Promise<Db | null> {
  if (env.DATABASE_URL) return neonDb(env.DATABASE_URL);
  // `import.meta.env.DEV` is false in production builds, so this branch (and the PGlite
  // import) is removed by the bundler and never traced into the Vercel Function.
  if (import.meta.env.DEV && env.RATINGS_DEV_DB === 'pglite' && env.VERCEL_ENV !== 'production') {
    devDb ??= (async () => {
      const mod = '@electric-sql/pglite';
      const { PGlite } = await import(/* @vite-ignore */ mod);
      const pg = new PGlite(env.RATINGS_DEV_DB_PATH ?? './.data/pglite');
      const db = pgliteDb(pg);
      const { readFileSync } = await import('node:fs');
      await migrate(db, readFileSync('db/migrations/001_ratings.sql', 'utf8'));
      return db;
    })();
    return devDb;
  }
  return null;
}
