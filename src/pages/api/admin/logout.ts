import type { APIRoute } from 'astro';
import { configFromEnv } from '../../../lib/ratings/http';
import { adminConfigFromEnv, handleLogout } from '../../../lib/ratings/admin-http';

export const prerender = false;
export const POST: APIRoute = async () => handleLogout(adminConfigFromEnv(configFromEnv()));
