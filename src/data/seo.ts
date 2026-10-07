/**
 * SEO metadata and schema.org structured data, generated from the content data.
 * No ratings, reviews or awards — none have been verified.
 */
import { business, phones, siteUrl, social } from './business';
import { foodMenu, type MenuItem } from './menu';
import { drinksMenu } from './drinks';
import { openingHours } from './hours';
import { schemaPrice } from './format';

export const seo = {
  title: 'Afrolink Restaurant & Bar — West African Restaurant in Essen | Menu',
  description:
    'Menu, drinks, opening hours and contact for Afrolink Restaurant & Bar, Berzeliusstraße 7, 45144 Essen. Authentic West African soups, rice, yam, plantain, fish and specialities — dine-in and takeaway.',
  canonical: `${siteUrl}/`,
  locale: 'en_GB',
  themeColor: '#1a1613',
};

function itemPrices(item: MenuItem): number[] {
  return item.variants ? item.variants.map((v) => v.price) : item.price != null ? [item.price] : [];
}

/** Price range derived from the actual food menu, e.g. "€4–€35". */
export function priceRange(): string {
  const all = foodMenu.flatMap((c) => c.items.filter((i) => i.available !== false).flatMap(itemPrices));
  const fmt = (c: number) => `€${Math.round(c / 100)}`;
  return `${fmt(Math.min(...all))}–${fmt(Math.max(...all))}`;
}

const offer = (cents: number) => ({ '@type': 'Offer', price: schemaPrice(cents), priceCurrency: 'EUR' });

function menuItems(items: MenuItem[]) {
  return items
    .filter((i) => i.available !== false)
    .flatMap((i) =>
      i.variants
        ? i.variants.map((v) => ({ '@type': 'MenuItem', name: `${i.name}, ${v.label}`, offers: offer(v.price) }))
        : [{ '@type': 'MenuItem', name: i.name, ...(i.note ? { description: i.note } : {}), offers: offer(i.price!) }],
    );
}

export function restaurantJsonLd(imageUrl: string, logoUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${siteUrl}/#restaurant`,
    name: business.name,
    url: `${siteUrl}/`,
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
      name: 'Food & Drinks',
      url: `${siteUrl}/#menu`,
      inLanguage: 'en',
      hasMenuSection: [...foodMenu, ...drinksMenu]
        .filter((c) => c.items.length > 0)
        .map((c) => ({
          '@type': 'MenuSection',
          name: c.title,
          hasMenuItem: menuItems(c.items as MenuItem[]),
        })),
    },
  };
}
