import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/ratings/db';
import { configFromEnv } from '../../../lib/ratings/http';
import { adminConfigFromEnv, handleExport } from '../../../lib/ratings/admin-http';
import { dishNames, filterFromUrl } from '../../../lib/ratings/admin-view';

export const prerender = false;
export const GET: APIRoute = async ({ request, url }) =>
  handleExport(request, await getDb(), adminConfigFromEnv(configFromEnv()), filterFromUrl(url), dishNames());
