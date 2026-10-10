/** Public rating API — GET: per-dish summary · POST: create or revise one's rating. On-demand. */
import type { APIRoute } from 'astro';
import { getDb } from '../../lib/ratings/db';
import { configFromEnv, handleForget, handleSubmit, handleSummary } from '../../lib/ratings/http';

export const prerender = false;

export const GET: APIRoute = async () => {
  const cfg = configFromEnv();
  return handleSummary(cfg.enabled ? await getDb() : null, cfg);
};

export const POST: APIRoute = async ({ request }) => {
  const cfg = configFromEnv();
  return handleSubmit(request, cfg.enabled ? await getDb() : null, cfg);
};

/** Consent withdrawn: forget this device (expires the rating cookie). */
export const DELETE: APIRoute = async () => handleForget(configFromEnv());
