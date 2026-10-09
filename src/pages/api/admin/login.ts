import type { APIRoute } from 'astro';
import { getDb } from '../../../lib/ratings/db';
import { configFromEnv } from '../../../lib/ratings/http';
import { adminConfigFromEnv, handleLogin } from '../../../lib/ratings/admin-http';

export const prerender = false;
export const POST: APIRoute = async ({ request }) => handleLogin(request, await getDb(), adminConfigFromEnv(configFromEnv()));
