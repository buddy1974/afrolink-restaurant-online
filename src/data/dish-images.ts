/**
 * DISH IMAGES — one image per menu item, or none ("Image coming soon" placeholder).
 *
 * Sources:
 * - 'owner-2026-10-09': dish images supplied by the owner on 2026-10-09 in public/ and named by
 *   dish (originals kept in owner-assets/menu-originals/). They are styled presentation images
 *   on Afrolink's own table settings; they are labelled on the site as serving suggestions.
 * - 'afrolink-photo': genuine Afrolink photographs from the client folder, identified by the
 *   client's own file names (see src/data/gallery.ts).
 * - Second owner batch (same date, same styling) added the remaining dishes; originals kept in
 *   owner-assets/menu-originals/. extra-garri / extra-rice / extra-yams are used since the extras
 *   correction of 2026-10-09 (see docs/image-inventory.md).
 * Only map an image to a dish when the file is named for that dish and the picture shows it.
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
  'coconut-rice': owner('coconut-rice.jpg', { de: 'Coconut Rice mit Paprika und Fleisch', en: 'Coconut rice with peppers and meat', fr: 'Riz coco aux poivrons et à la viande' }),
  'white-rice': owner('white-rice-stew.jpg', { de: 'Weißer Reis mit Eintopf und Kochbananen', en: 'White rice with stew and plantain', fr: 'Riz blanc avec ragoût et banane plantain' }),
  // Beans, yam & plantain
  'beans-plantain': owner('beans-plantain.jpg', { de: 'Bohnen in roter Sauce mit gebratenen Kochbananen', en: 'Beans in a red sauce with fried plantain', fr: 'Haricots en sauce rouge avec bananes plantain frites' }),
  'porridge-yam': owner('yam-porridge.jpg', { de: 'Porridge Yam mit Blattgemüse in roter Sauce', en: 'Porridge yam with leafy greens in a red sauce', fr: 'Porridge d’igname aux légumes-feuilles en sauce rouge' }),
  'fried-yam-egg-sauce': owner('fried-yam-egg-sauce.jpg', { de: 'Gebratene Yamsstücke mit Tomaten-Ei-Sauce', en: 'Fried yam pieces with tomato and egg sauce', fr: 'Morceaux d’igname frite avec sauce tomate aux œufs' }),
  'assorted-plate': owner('assorted.jpg', { de: 'Assorted Plate mit Kochbananen', en: 'Assorted plate with plantain', fr: 'Assiette assortie avec banane plantain' }),
  // Specialities
  suya: owner('suya.jpg', { de: 'Suya mit Zwiebelringen, Tomate, Gurke und Chili', en: 'Suya with onion rings, tomato, cucumber and chilli', fr: 'Suya avec rondelles d’oignon, tomate, concombre et piment' }),
  stockfish: owner('stockfish.jpg', { de: 'Stockfisch in roter Sauce mit Zwiebeln', en: 'Stockfish in a red sauce with onions', fr: 'Stockfisch en sauce rouge aux oignons' }),
  snail: owner('snail.jpg', { de: 'Riesenschnecken in Tomaten-Zwiebel-Sauce', en: 'Giant snails in a tomato and onion sauce', fr: 'Escargots géants en sauce tomate et oignon' }),
  okpa: owner('okpa.jpg', { de: 'Okpa in Stücken auf einem Teller', en: 'Okpa cut into pieces on a plate', fr: 'Okpa coupé en morceaux dans une assiette' }),
  abacha: owner('abacha.jpg', { de: 'Abacha (Cassavasalat) mit frischer Garnitur', en: 'Abacha (cassava salad) with a fresh garnish', fr: 'Abacha (salade de manioc) avec garniture fraîche' }),
  isiewu: owner('isiewu.jpg', { de: 'Isiewu in einer Holzschale mit roten Zwiebeln und Kräutern', en: 'Isiewu in a wooden bowl with red onion and herbs', fr: 'Isiewu dans un bol en bois, avec oignon rouge et herbes' }),
  'pepper-soup': photo('pepper-soup.jpg', { de: 'Pepper Soup mit Fleisch und Yam', en: 'Pepper soup with meat and yam', fr: 'Pepper soup avec viande et igname' }, true),
  nkwobi: photo('nkwobi.jpg', { de: 'Nkwobi mit Zwiebelringen und Paprika', en: 'Nkwobi with onion rings and pepper', fr: 'Nkwobi aux oignons et poivron' }, true),
  // Fish
  tilapia: owner('tilapia.jpg', { de: 'Ganze Tilapia mit Kochbananen', en: 'Whole tilapia with plantain', fr: 'Tilapia entier avec banane plantain' }, true),
  'fried-fish-plantain': owner('fried-fish-plantain.jpg', { de: 'Gebratener Fisch mit Kochbananen, Zwiebelringen und Paprika', en: 'Fried fish with plantain, onion rings and peppers', fr: 'Poisson frit avec banane plantain, rondelles d’oignon et poivrons' }),
  // Extras
  'extra-pounded-yam': owner('extra-pounded-yam.jpg', { de: 'Eine Portion Pounded Yam', en: 'A portion of pounded yam', fr: 'Une portion de pounded yam' }),
  'extra-garri': owner('extra-garri.jpg', { de: 'Eine Portion Garri (Eba) auf einem Teller', en: 'A portion of garri (eba) on a plate', fr: 'Une portion de garri (eba) dans une assiette' }),
  'extra-rice': owner('extra-rice.jpg', { de: 'Ein Teller gekochter weißer Reis', en: 'A plate of boiled white rice', fr: 'Une assiette de riz blanc' }),
  'extra-yam': owner('extra-yam.jpg', { de: 'Gekochte Yamscheiben in einer Schale', en: 'Boiled yam slices in a dish', fr: 'Tranches d’igname bouillie dans un plat' }),
};

/** Featured photograph for the soups showcase (owner instruction: give it prominence). */
export const vegetableSoupFeature: DishImage = owner('vegetable-soup.jpg', {
  de: 'Grüne Blattgemüsesuppe mit Fleisch und Pounded Yam',
  en: 'Leafy vegetable soup with meat and pounded yam',
  fr: 'Soupe de légumes-feuilles avec viande et pounded yam',
});

/** Principal hero photograph (owner instruction). */
export const heroImage: DishImage = dishImages['egusi-soup'];
