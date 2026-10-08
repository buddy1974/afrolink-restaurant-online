/**
 * Verified business facts for Afrolink Restaurant & Bar.
 * Source of truth: Marcel's brief (2026-10-07). Do not add unverified claims
 * (no ratings, reviews, awards, delivery).
 */

export const siteUrl = 'https://www.afrolink-restaurant.online';

export const business = {
  name: 'Afrolink Restaurant & Bar',
  shortName: 'Afrolink',
  category: 'West African Restaurant',
  tagline: 'Authentic African Cuisine',
  intro:
    'Authentic West African cooking in the heart of Essen. Traditional soups, rice dishes, grilled fish, meat and African specialities prepared for dine-in and takeaway.',
  about: [
    'Afrolink Restaurant & Bar serves authentic West African food in Essen — traditional soups, rice dishes, beans, yam and plantain, fish, meat and African specialities.',
    'Eat in at the restaurant and bar, or take your order away with you.',
  ],
  cuisine: ['West African', 'African'],
  address: {
    street: 'Berzeliusstraße 7',
    postalCode: '45144',
    city: 'Essen',
    country: 'Germany',
    countryCode: 'DE',
  },
} as const;

export const phones = {
  /** Landline — also the official WhatsApp number. */
  landline: {
    label: 'Landline & WhatsApp',
    display: '0201 84674196',
    international: '+49 201 84674196',
    href: 'tel:+4920184674196',
  },
  mobile: {
    label: 'Mobile',
    display: '+49 1521 7130788',
    international: '+49 1521 7130788',
    href: 'tel:+4915217130788',
  },
} as const;

/**
 * WhatsApp: Marcel's brief of 2026-10-07 states the 0201 landline is ALSO the
 * official WhatsApp number. The brief of 2026-10-08 says not to assume this —
 * kept as previously verified, flagged for re-confirmation (docs/known-risks R-010).
 */
export const whatsapp = {
  href: 'https://wa.me/4920184674196',
  display: '0201 84674196',
} as const;

const addressQuery = `${business.name}, ${business.address.street}, ${business.address.postalCode} ${business.address.city}`;

export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`;

/** Official profiles (brief 2026-10-08). */
export const social = [
  { name: 'Facebook', handle: 'afrolink24', href: 'https://www.facebook.com/afrolink24' },
  { name: 'Instagram', handle: '@afrolinkrestaurant', href: 'https://www.instagram.com/afrolinkrestaurant' },
  { name: 'TikTok', handle: '@afrolink_restaurant', href: 'https://www.tiktok.com/@afrolink_restaurant' },
  { name: 'YouTube', handle: '@afrolink45144', href: 'https://www.youtube.com/@afrolink45144' },
] as const;

/** Google Business Profile (reviews). Link only — no ratings are reproduced on the site. */
export const googleReviews = {
  href: 'https://share.google/4DyZ4gz5CwbrWi8qv',
} as const;

/** Services as confirmed. Afrolink does NOT offer delivery — never add it. */
export const services = [
  'Dine-in',
  'Takeaway',
  'Table service',
  'Reservations accepted',
  'Bar on site',
  'Lunch',
  'Dinner',
  'Late-night food',
  'Good for kids',
  'Free street parking',
  'Free parking lot',
] as const;
