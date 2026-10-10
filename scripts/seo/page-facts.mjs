/**
 * Search-relevant facts of a rendered page, and a stable fingerprint of them.
 *
 * Used by IndexNow change detection (scripts/indexnow.mjs) and the SEO checks: two renders of
 * the same content must produce the same fingerprint, while any change a search engine would
 * care about (text, metadata, canonical/hreflang, structured data, images) must change it.
 * Build artefacts that do not change what a page says (CSS/JS bundle hashes, inline scripts,
 * styles) are deliberately ignored.
 */
import { createHash } from 'node:crypto';

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** Decode the HTML entities Astro emits (named basics + numeric). */
export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const cp = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

/** Value of attribute `name` in a single tag string (double- or single-quoted). */
export function attr(tag, name) {
  const m = tag.match(new RegExp(String.raw`\s${name}\s*=\s*(?:"([^"]*)"|'([^']*)')`, 'i'));
  if (m) return decodeEntities(m[1] ?? m[2]);
  // Bare boolean attribute (Astro renders alt="" as `alt`): present, empty value.
  return new RegExp(String.raw`\s${name}(?=[\s/>])`, 'i').test(tag) ? '' : undefined;
}

const tags = (html, name) => [...html.matchAll(new RegExp(String.raw`<${name}\b[^>]*>`, 'gi'))].map((m) => m[0]);

const clean = (s) => decodeEntities(s.replace(/<[^>]+>/g, ' ')).replace(/[\s\u00ad]+/g, ' ').trim();

/** Sort object keys recursively so equal data always serializes identically. */
function stable(v) {
  if (Array.isArray(v)) return v.map(stable);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, stable(v[k])]));
  return v;
}

/** Parse every JSON-LD block; invalid blocks are reported, not silently dropped. */
export function jsonLd(html) {
  const out = [];
  const errors = [];
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const v = JSON.parse(m[1]);
      out.push(...(Array.isArray(v) ? v : [v]));
    } catch (e) {
      errors.push(String(e.message));
    }
  }
  return { nodes: out, errors };
}

/**
 * Remove Vercel's per-deployment asset parameter (`?dpl=dpl_…`, added by Skew Protection) so
 * two deployments of identical content compare equal.
 */
export function stripDeploymentParams(html) {
  return html.replace(/(\?|&amp;|&)dpl=dpl_[A-Za-z0-9]+(&amp;|&)?/g, (_m, pre, post) => (pre === '?' && post ? '?' : post && pre !== '?' ? pre : ''));
}

/** Extract the facts search engines read from one HTML document. */
export function pageFacts(rawHtml) {
  const html = stripDeploymentParams(rawHtml);
  const head = (html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i) ?? [, ''])[1];
  const metas = tags(head, 'meta');
  const metaBy = (key, val) => metas.filter((t) => (attr(t, key) ?? '').toLowerCase() === val).map((t) => attr(t, 'content') ?? '');
  const links = tags(head, 'link');
  const body = (html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i) ?? [, ''])[1];
  // Visible text: drop scripts, styles, templates and SVG markup first.
  const visible = body
    .replace(/<(script|style|template|noscript|svg)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const ld = jsonLd(html);
  return {
    lang: attr((html.match(/<html\b[^>]*>/i) ?? [''])[0], 'lang') ?? null,
    title: clean((head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i) ?? [, ''])[1]),
    description: metaBy('name', 'description')[0] ?? null,
    robots: metaBy('name', 'robots')[0] ?? null,
    canonical: links.filter((t) => (attr(t, 'rel') ?? '').toLowerCase() === 'canonical').map((t) => attr(t, 'href')),
    hreflang: links
      .filter((t) => (attr(t, 'rel') ?? '').toLowerCase() === 'alternate' && attr(t, 'hreflang'))
      .map((t) => [attr(t, 'hreflang'), attr(t, 'href')])
      .sort((a, b) => (a[0] + a[1]).localeCompare(b[0] + b[1])),
    og: Object.fromEntries(
      metas.filter((t) => /^(og|restaurant):/.test(attr(t, 'property') ?? '')).map((t) => [attr(t, 'property'), attr(t, 'content')]),
    ),
    twitter: Object.fromEntries(
      metas.filter((t) => /^twitter:/.test(attr(t, 'name') ?? '')).map((t) => [attr(t, 'name'), attr(t, 'content')]),
    ),
    jsonLd: ld.nodes.map(stable),
    jsonLdErrors: ld.errors,
    headings: [...visible.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => [Number(m[1]), clean(m[2])]),
    images: tags(visible, 'img').map((t) => ({ src: attr(t, 'src') ?? null, alt: attr(t, 'alt') ?? null })),
    text: clean(visible),
  };
}

/** sha256 of the stable serialization of a page's facts. */
export function fingerprint(facts) {
  return createHash('sha256').update(JSON.stringify(stable(facts))).digest('hex');
}
