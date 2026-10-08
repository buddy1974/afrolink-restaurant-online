/**
 * SEO metadata and schema.org structured data, generated from the content data.
 * No ratings/reviews markup: the Google rating is a manual snapshot, and self-serving review
 * markup is not eligible for restaurants' own sites.
 */
import { business, phones, siteUrl, social } from './business';
import { foodMenu, type MenuItem } from './menu';
import { drinksMenu } from './drinks';
import { openingHours } from './hours';
import { schemaPrice } from './format';
import { htmlLang, locales, routes, type Lang, type RouteKey } from '../i18n/config';

export const themeColor = '#1a1613';

export function absolute(pathname: string): string {
  return `${siteUrl}${pathname}`;
}

/** hreflang alternates for a route (German is x-default). */
export function alternates(route: RouteKey) {
  return [
    ...locales.map((lang) => ({ hreflang: htmlLang[lang], href: absolute(routes[route][lang]) })),
    { hreflang: 'x-default', href: absolute(routes[route].de) },
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

export function restaurantJsonLd(lang: Lang, imageUrl: string, logoUrl: string) {
  const foodSections = foodMenu
    .map((c) => ({ ...c, items: c.items.filter((i) => i.available !== false) }))
    .filter((c) => c.items.length)
    .map((c) => ({
      '@type': 'MenuSection',
      name: c.title[lang],
      hasMenuItem: c.items.flatMap((i) =>
        i.variants
          ? i.variants.map((v) => ({ '@type': 'MenuItem', name: `${i.name}, ${v.label[lang]}`, offers: offer(v.price) }))
          : [
              {
                '@type': 'MenuItem',
                name: i.name,
                ...(i.description ? { description: i.description[lang] } : {}),
                offers: offer(i.price!),
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
    sameAs: social.map((s) => s.href),
    openingHoursSpecification: openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: h.opens,
      closes: h.closes,
    })),
    hasMenu: {
      '@type': 'Menu',
      url: `${absolute(routes.home[lang])}#menu`,
      inLanguage: htmlLang[lang],
      hasMenuSection: [...foodSections, ...drinkSections],
    },
  };
}
