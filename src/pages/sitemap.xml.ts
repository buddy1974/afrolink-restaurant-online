import type { APIRoute } from 'astro';
import { siteUrl } from '../data/business';
import { foodMenu } from '../data/menu';
import { dishPaths, htmlLang, locales, routes, type Paths, type RouteKey } from '../i18n/config';

// Every localized URL, each with its hreflang alternates (German = x-default).
export const GET: APIRoute = () => {
  const pages: Paths[] = [
    ...(Object.keys(routes) as RouteKey[]).map((route) => routes[route]),
    ...foodMenu.flatMap((c) => c.items.filter((i) => i.available !== false).map((i) => dishPaths(i.id))),
  ];
  const urls = pages.flatMap((paths) =>
    locales.map((lang) => {
      const alts = locales
        .map((l) => `    <xhtml:link rel="alternate" hreflang="${htmlLang[l]}" href="${siteUrl}${paths[l]}"/>`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${paths.de}"/>`)
        .join('\n');
      return `  <url>\n    <loc>${siteUrl}${paths[lang]}</loc>\n${alts}\n  </url>`;
    }),
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
