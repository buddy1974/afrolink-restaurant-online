/**
 * DISH IMAGES — one image per menu item, or none ("Image coming soon" placeholder).
 *
 * Sources:
 * - 'owner-2026-10-09': dish images supplied by the owner on 2026-10-09 in public/ and named by
 *   dish (originals kept in owner-assets/menu-originals/). They are styled presentation images
 *   on Afrolink's own table settings; they are labelled on the site as serving suggestions.
 * - 'afrolink-photo': genuine Afrolink photographs from the client folder, identified by the
 *   client's own file names (see src/data/gallery.ts).
 * Only map an image to a dish when the file is named for that dish.
 * `watermarked: true` keeps the bottom-right Afrolink watermark in frame when cropped.
 */
import type { L10n } from '../i18n/config';

export interface DishImage {
  /** "<folder>/<file>" under src/assets. */
  file: string;
  alt: L10n;
  source: 'owner-2026-10-09' | 'afrolink-photo';
  watermarked?: boolean;
}

const owner = (file: string, alt: L10n, watermarked = false): DishImage => ({ file: `menu/${file}`, alt, source: 'owner-2026-10-09', watermarked });
const photo = (file: string, alt: L10n, watermarked = false): DishImage => ({ file: `gallery/${file}`, alt, source: 'afrolink-photo', watermarked });

export const dishImages: Record<string, DishImage> = {
  // Soups — served with pounded yam or garri
  'egusi-soup': owner('egusi-soup.jpg', { de: 'Egusi-Suppe mit Pounded Yam', en: 'Egusi soup with pounded yam', fr: 'Soupe egusi avec pounded yam' }, true),
  'afang-soup': owner('afang-soup.jpg', { de: 'Afang-Suppe mit Swallow-Beilage', en: 'Afang soup with a swallow side', fr: 'Soupe afang avec accompagnement « swallow »' }),
  edikaikong: owner('edikaikong.jpg', { de: 'Edikaikong mit Swallow-Beilage', en: 'Edikaikong with a swallow side', fr: 'Edikaikong avec accompagnement « swallow »' }),
  'ogbono-soup': owner('ogbono-soup.jpg', { de: 'Ogbono-Suppe mit Swallow-Beilage', en: 'Ogbono soup with a swallow side', fr: 'Soupe ogbono avec accompagnement « swallow »' }),
  'ofe-nsala': owner('ofe-nsala.jpg', { de: 'Ofe Nsala mit Swallow-Beilage', en: 'Ofe Nsala with a swallow side', fr: 'Ofe Nsala avec accompagnement « swallow »' }),
  'okra-soup': owner('okra-soup.jpg', { de: 'Okrasuppe mit Swallow-Beilage', en: 'Okra soup with a swallow side', fr: 'Soupe de gombo avec accompagnement « swallow »' }, true),
  'banga-soup': owner('banga-soup.jpg', { de: 'Banga-Suppe mit Swallow-Beilage', en: 'Banga soup with a swallow side', fr: 'Soupe banga avec accompagnement « swallow »' }),
  'efo-riro': owner('efo-riro.jpg', { de: 'Efo Riro mit Swallow-Beilage', en: 'Efo Riro with a swallow side', fr: 'Efo Riro avec accompagnement « swallow »' }),
  'bitterleaf-soup': owner('bitterleaf-soup.jpg', { de: 'Bitterleaf-Suppe mit Swallow-Beilage', en: 'Bitterleaf soup with a swallow side', fr: 'Soupe de feuilles amères avec accompagnement « swallow »' }),
  'fishermans-soup': owner('fishermans-soup.jpg', { de: 'Fisherman’s Soup mit Garnelen und Fisch', en: 'Fisherman’s soup with prawns and fish', fr: 'Fisherman’s soup aux crevettes et au poisson' }),
  'black-soup': owner('black-soup.jpg', { de: 'Black Soup mit Swallow-Beilage', en: 'Black soup with a swallow side', fr: 'Black soup avec accompagnement « swallow »' }),
  'oha-soup': owner('oha-soup.jpg', { de: 'Oha-Suppe mit Swallow-Beilage', en: 'Oha soup with a swallow side', fr: 'Soupe oha avec accompagnement « swallow »' }),
  // Rice
  'fried-rice': owner('fried-rice.jpg', { de: 'Fried Rice mit Gemüse', en: 'Fried rice with vegetables', fr: 'Riz sauté aux légumes' }),
  'jollof-rice': owner('jollof.jpg', { de: 'Jollof-Reis mit Fleisch und Kochbananen', en: 'Jollof rice with meat and plantain', fr: 'Riz jollof avec viande et banane plantain' }, true),
  'white-rice': owner('white-rice-stew.jpg', { de: 'Weißer Reis mit Eintopf und Kochbananen', en: 'White rice with stew and plantain', fr: 'Riz blanc avec ragoût et banane plantain' }),
  // Beans, yam & plantain
  'porridge-yam': photo('porridge-yam.jpg', { de: 'Porridge Yam in roter Palmölsauce', en: 'Porridge yam in a red palm-oil sauce', fr: 'Porridge d’igname à l’huile de palme' }),
  'assorted-plate': owner('assorted.jpg', { de: 'Assorted Plate mit Kochbananen', en: 'Assorted plate with plantain', fr: 'Assiette assortie avec banane plantain' }),
  // Specialities
  suya: photo('suya-plantain.jpg', { de: 'Suya mit Kochbananen', en: 'Suya with plantain', fr: 'Suya avec banane plantain' }),
  'pepper-soup': photo('pepper-soup.jpg', { de: 'Pepper Soup mit Fleisch und Yam', en: 'Pepper soup with meat and yam', fr: 'Pepper soup avec viande et igname' }, true),
  nkwobi: photo('nkwobi.jpg', { de: 'Nkwobi mit Zwiebelringen und Paprika', en: 'Nkwobi with onion rings and pepper', fr: 'Nkwobi aux oignons et poivron' }, true),
  // Fish
  tilapia: owner('tilapia.jpg', { de: 'Gegrillte Tilapia mit Kochbananen', en: 'Grilled tilapia with plantain', fr: 'Tilapia grillé avec banane plantain' }, true),
};

/** Featured photograph for the soups showcase (owner instruction: give it prominence). */
export const vegetableSoupFeature: DishImage = owner('vegetable-soup.jpg', {
  de: 'Grüne Blattgemüsesuppe mit Fleisch und Pounded Yam',
  en: 'Leafy vegetable soup with meat and pounded yam',
  fr: 'Soupe de légumes-feuilles avec viande et pounded yam',
});

/** Principal hero photograph (owner instruction). */
export const heroImage: DishImage = dishImages['egusi-soup'];
