/**
 * SEO metadata and schema.org structured data, generated from the content data.
 * No ratings/reviews markup: the Google rating is a manual snapshot, and self-serving review
 * markup is not eligible for restaurants' own sites.
 */
import { business, mapsHref, phones, siteUrl, social } from './business';
import { dishName, foodMenu, type MenuItem } from './menu';
import { drinksMenu } from './drinks';
import { openingHours } from './hours';
import { schemaPrice } from './format';
import { htmlLang, locales, routes, type Lang, type Paths } from '../i18n/config';

export const themeColor = '#1a1613';

export function absolute(pathname: string): string {
  return `${siteUrl}${pathname}`;
}

/**
 * Absolute URL of a built asset for metadata that search engines and social networks store
 * (og:image, twitter:image, JSON-LD image). With Vercel Skew Protection the adapter appends a
 * per-deployment `?dpl=` parameter to every asset URL, so the stored image URL would change on
 * each deploy although the hashed file name already makes it immutable. Visible <img>/<link>
 * URLs keep the parameter (that is what Skew Protection is for).
 */
export function absoluteAsset(src: string): string {
  const url = new URL(src, siteUrl);
  url.searchParams.delete('dpl');
  return url.href;
}

/** hreflang alternates for a page's localized paths (German is x-default). */
export function alternates(paths: Paths) {
  return [
    ...locales.map((lang) => ({ hreflang: htmlLang[lang], href: absolute(paths[lang]) })),
    { hreflang: 'x-default', href: absolute(paths.de) },
  ];
}

function itemPrices(item: MenuItem): number[] {
  return item.variants ? item.variants.map((v) => v.price) : item.price != null ? [item.price] : [];
}

/** Price range derived from the actual food menu, e.g. "€4–€35". */
export function priceRange(): string {
  const all = foodMenu.flatMap((c) => c.items.filter((i) => i.available !== false).flatMap(itemPrices));
  const f = (c: number) => `€${Math.round(c / 100)}`;
  return `${f(Math.min(...all))}–${f(Math.max(...all))}`;
}

const offer = (cents: number) => ({ '@type': 'Offer', price: schemaPrice(cents), priceCurrency: 'EUR' });

/** Offer for an item; per-unit prices (e.g. per slice) carry a UnitPriceSpecification. */
function offerFor(item: MenuItem, lang: Lang) {
  const base = offer(item.price!);
  if (!item.priceUnit) return base;
  return {
    ...base,
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: schemaPrice(item.price!),
      priceCurrency: 'EUR',
      referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitText: item.priceUnit[lang] },
    },
  };
}

export function restaurantJsonLd(lang: Lang, imageUrl: string, logoUrl: string) {
  const foodSections = foodMenu
    .map((c) => ({ ...c, items: c.items.filter((i) => i.available !== false) }))
    .filter((c) => c.items.length)
    .map((c) => ({
      '@type': 'MenuSection',
      name: c.title[lang],
      hasMenuItem: c.items.flatMap((i) =>
        i.variants
          ? i.variants.map((v) => ({ '@type': 'MenuItem', name: `${dishName(i, lang)}, ${v.label[lang]}`, offers: offer(v.price) }))
          : [
              {
                '@type': 'MenuItem',
                name: dishName(i, lang),
                ...(i.description ? { description: i.description[lang] } : {}),
                offers: offerFor(i, lang),
              },
            ],
      ),
    }));
  const drinkSections = drinksMenu
    .filter((c) => c.items.length)
    .map((c) => ({
      '@type': 'MenuSection',
      name: c.title[lang],
      hasMenuItem: c.items
        .filter((i) => i.available !== false)
        .map((i) => ({ '@type': 'MenuItem', name: i.display ? i.display[lang] : i.name, offers: offer(i.price) })),
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${siteUrl}/#restaurant`,
    name: business.name,
    url: absolute(routes.home[lang]),
    mainEntityOfPage: absolute(routes.home[lang]),
    image: [imageUrl],
    logo: logoUrl,
    telephone: phones.landline.international,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      postalCode: business.address.postalCode,
      addressLocality: business.address.city,
      addressCountry: business.address.countryCode,
    },
    servesCuisine: [...business.cuisine],
    priceRange: priceRange(),
    acceptsReservations: true,
    hasMap: mapsHref,
    // Only profiles verified as Afrolink's own (Instagram could not be checked without login).
    sameAs: social.filter((s) => s.verified).map((s) => s.href),
    openingHoursSpecification: openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: h.opens,
      closes: h.closes,
    })),
    menu: absolute(routes.menu[lang]),
    hasMenu: {
      '@type': 'Menu',
      '@id': `${absolute(routes.menu[lang])}#menu`,
      url: absolute(routes.menu[lang]),
      inLanguage: htmlLang[lang],
      hasMenuSection: [...foodSections, ...drinkSections],
    },
  };
}

/** WebSite node (home pages), so search engines see the three language versions as one site. */
export function websiteJsonLd(lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: business.name,
    url: absolute(routes.home[lang]),
    inLanguage: htmlLang[lang],
    publisher: { '@id': `${siteUrl}/#restaurant` },
  };
}

export interface Crumb {
  name: string;
  href: string;
}

/** BreadcrumbList for the visible breadcrumb trail (absolute URLs). */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absolute(c.href) })),
  };
}

/** WebPage node linked to the site and the restaurant. */
export function webPageJsonLd(lang: Lang, href: string, name: string, description: string, extra: Record<string, unknown> = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${absolute(href)}#webpage`,
    url: absolute(href),
    name,
    description,
    inLanguage: htmlLang[lang],
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#restaurant` },
    ...extra,
  };
}

/** A dish as schema.org MenuItem (no ratings — dish ratings are not eligible for review snippets). */
export function menuItemJsonLd(item: MenuItem, lang: Lang, href: string, description: string, image: string | null) {
  const offers = item.variants
    ? item.variants.map((v) => ({ ...offer(v.price), name: v.label[lang] }))
    : [offerFor(item, lang)];
  return {
    '@context': 'https://schema.org',
    '@type': 'MenuItem',
    '@id': `${absolute(href)}#dish`,
    name: dishName(item, lang),
    description,
    url: absolute(href),
    ...(image ? { image } : {}),
    offers: offers.length === 1 ? offers[0] : offers,
  };
}

/** A service offered by the restaurant (only facts stated by the owner). */
export function serviceJsonLd(lang: Lang, href: string, name: string, description: string, serviceType: string, areaServed?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${absolute(href)}#service`,
    name,
    description,
    serviceType,
    url: absolute(href),
    inLanguage: htmlLang[lang],
    provider: { '@id': `${siteUrl}/#restaurant` },
    ...(areaServed ? { areaServed: { '@type': 'City', name: areaServed } } : {}),
  };
}

/** The full menu as a standalone Menu node (menu page). */
export function menuJsonLd(lang: Lang) {
  return { '@context': 'https://schema.org', ...restaurantJsonLd(lang, '', '').hasMenu };
}
