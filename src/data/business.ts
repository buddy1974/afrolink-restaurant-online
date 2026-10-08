/**
 * Business facts for Afrolink Restaurant & Bar.
 * Every fact records its status — see docs/content-claims-audit.md.
 */

export const siteUrl = 'https://www.afrolink-restaurant.online';

export const business = {
  name: 'Afrolink Restaurant & Bar',
  shortName: 'Afrolink',
  category: 'West African Restaurant',
  cuisine: ['West African', 'African'],
  address: {
    street: 'Berzeliusstraße 7',
    postalCode: '45144',
    city: 'Essen',
    country: 'Germany',
    countryCode: 'DE',
  },
  /** Opening date per Afrolink's own opening flyer ("NEW OPENING 07.05.2022"). Owner-provided. */
  openedOn: '2022-05-07',
} as const;

export const phones = {
  /** Landline — designated by the owner as the official WhatsApp number (briefs 2026-10-07/08). */
  landline: {
    display: '0201 84674196',
    international: '+49 201 84674196',
    href: 'tel:+4920184674196',
  },
  mobile: {
    display: '+49 1521 7130788',
    international: '+49 1521 7130788',
    href: 'tel:+4915217130788',
  },
} as const;

/**
 * WhatsApp: owner-designated (0201 84674196). It cannot be technically verified from outside
 * that this number is registered with WhatsApp — owner must test once (docs/known-risks R-010).
 */
export const whatsapp = {
  number: '4920184674196',
  display: '0201 84674196',
  href: 'https://wa.me/4920184674196',
} as const;

/** wa.me link with a prefilled message (the text never touches this website's server). */
export function whatsappWithText(text: string): string {
  return `${whatsapp.href}?text=${encodeURIComponent(text)}`;
}

const addressQuery = `${business.name}, ${business.address.street}, ${business.address.postalCode} ${business.address.city}`;
export const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`;

/** Official profiles (brief 2026-10-08). Instagram could not be verified without login. */
export const social = [
  { name: 'Facebook', handle: 'afrolink24', href: 'https://www.facebook.com/afrolink24', verified: true },
  { name: 'Instagram', handle: '@afrolinkrestaurant', href: 'https://www.instagram.com/afrolinkrestaurant', verified: false },
  { name: 'TikTok', handle: '@afrolink_restaurant', href: 'https://www.tiktok.com/@afrolink_restaurant', verified: true },
  { name: 'YouTube', handle: '@afrolink45144', href: 'https://www.youtube.com/@afrolink45144', verified: true },
] as const;

/**
 * Google Business Profile.
 * - `profileHref`: public share link (verified: resolves to "Afrolink Restaurant & Bar").
 * - `writeReviewHref`: the profile's own "Ask for reviews" link (g.page/r/…/review) — not yet
 *   supplied; until then "Write a review" opens the profile.
 * - Rating: MANUAL snapshot from the owner's screenshot. Update `asOf` whenever changed.
 *   Never shown as live, never emitted as schema.org rating markup.
 */
export const google = {
  profileHref: 'https://share.google/4DyZ4gz5CwbrWi8qv',
  writeReviewHref: null as string | null,
  rating: 4.6,
  reviewCount: 145,
  asOf: '2026-10-08',
  source: 'Google Business Profile screenshot supplied by the owner (Screenshot 2026-10-08 192615)',
} as const;

/**
 * Services — keys map to ui.serviceNames. Delivery and catering are offered by arrangement
 * (owner instruction 2026-10-08, superseding the earlier no-delivery policy).
 * "lunch" is kept as supplied although opening starts at 15:00/16:00 (R-003).
 */
export const services = [
  'dineIn',
  'takeaway',
  'delivery',
  'catering',
  'tableService',
  'reservations',
  'bar',
  'lunch',
  'dinner',
  'lateNight',
  'kids',
  'streetParking',
  'parkingLot',
] as const;

export type ServiceKey = (typeof services)[number];
