import type { APIRoute } from 'astro';
import { siteUrl } from '../data/business';
import { htmlLang, locales, routes, type RouteKey } from '../i18n/config';

// Every localized URL, each with its hreflang alternates (German = x-default).
export const GET: APIRoute = () => {
  const urls = (Object.keys(routes) as RouteKey[]).flatMap((route) =>
    locales.map((lang) => {
      const alts = locales
        .map((l) => `    <xhtml:link rel="alternate" hreflang="${htmlLang[l]}" href="${siteUrl}${routes[route][l]}"/>`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${routes[route].de}"/>`)
        .join('\n');
      return `  <url>\n    <loc>${siteUrl}${routes[route][lang]}</loc>\n${alts}\n  </url>`;
    }),
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
