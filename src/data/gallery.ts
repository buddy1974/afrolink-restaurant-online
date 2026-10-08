/**
 * FOOD GALLERY — genuine Afrolink photographs only.
 *
 * Sources (client folder KUNDEN-OBERDORF/afrolink-restaurant):
 * - `watermarked: true` → the client's ENHANCED versions of the real WhatsApp photos
 *   (social-images/AI-Optimized/enhanced_* / final_set_watermarked_*) with the Afrolink
 *   watermark bottom-right. Only resized + metadata stripped; watermark kept in frame.
 * - others → original photos where no enhanced version exists.
 * Not used: ChatGPT re-renders (AI-regenerated pixels), photos showing guests or staff,
 * collages and screenshots.
 *
 * To ADD a photo: `npm run prepare-image -- "<source>" <name>.jpg`, then add an entry with
 * `alt` in all three languages. `caption` only where the client's own file name identifies the dish.
 */
import type { L10n } from '../i18n/config';

export interface GalleryEntry {
  file: string;
  alt: L10n;
  caption?: L10n;
  feature?: boolean;
  watermarked?: boolean;
}

const same = (s: string): L10n => ({ de: s, en: s, fr: s });

export const gallery: GalleryEntry[] = [
  {
    file: 'plantain-peppered-meat.jpg',
    alt: {
      de: 'Gebratene Kochbananen mit gepfeffertem Rindfleisch und Paprika',
      en: 'Fried plantain topped with peppered beef and bell peppers',
      fr: 'Bananes plantain frites garnies de bœuf poivré et de poivrons',
    },
    feature: true,
    watermarked: true,
  },
  {
    file: 'nkwobi.jpg',
    alt: {
      de: 'Nkwobi mit Zwiebelringen und roter Paprika in einer Holzschale',
      en: 'Nkwobi garnished with onion rings and red pepper, served in a wooden bowl',
      fr: 'Nkwobi garni de rondelles d’oignon et de poivron rouge, servi dans un bol en bois',
    },
    caption: same('Nkwobi'),
    watermarked: true,
  },
  {
    file: 'egusi-yam.jpg',
    alt: { de: 'Egusi-Suppe mit gekochtem Yam', en: 'Egusi soup served with boiled yam', fr: 'Soupe egusi servie avec de l’igname bouillie' },
    caption: { de: 'Egusi Soup mit Yam', en: 'Egusi Soup with yam', fr: 'Egusi Soup avec igname' },
    watermarked: true,
  },
  {
    file: 'jollof-rice.jpg',
    alt: { de: 'Jollof-Reis mit gebratenem Fleisch auf einem weißen Teller', en: 'Jollof rice with pieces of fried meat on a white plate', fr: 'Riz jollof avec des morceaux de viande frite sur une assiette blanche' },
    caption: same('Jollof Rice'),
  },
  {
    file: 'suya-plantain.jpg',
    alt: {
      de: 'Gepfeffertes Fleisch mit Zwiebeln und Paprika neben gebratenen Kochbananen',
      en: 'Peppered meat with onions and bell peppers beside fried plantain',
      fr: 'Viande poivrée aux oignons et poivrons, à côté de bananes plantain frites',
    },
    caption: { de: 'Suya mit Kochbananen', en: 'Suya with plantain', fr: 'Suya et banane plantain' },
  },
  {
    file: 'okra-soup.jpg',
    alt: {
      de: 'Okrasuppe in einer weißen Schale neben einer Portion Swallow',
      en: 'Okra soup in a white dish next to a portion of swallow',
      fr: 'Soupe de gombo dans un plat blanc, à côté d’une portion de « swallow »',
    },
    caption: same('Okra Soup'),
    watermarked: true,
  },
  {
    file: 'pepper-soup.jpg',
    alt: {
      de: 'Pepper Soup mit Fleisch und Yam in einer Kupferschale',
      en: 'Pepper soup with meat and yam in a copper bowl',
      fr: 'Pepper soup avec viande et igname dans un bol en cuivre',
    },
    caption: same('Pepper Soup'),
    feature: true,
    watermarked: true,
  },
  {
    file: 'assorted-meat-yam.jpg',
    alt: {
      de: 'Gemischtes Fleisch mit Paprika und gekochtem Yam',
      en: 'Assorted meat with peppers served with boiled yam',
      fr: 'Assortiment de viandes aux poivrons, servi avec de l’igname bouillie',
    },
    caption: { de: 'Assorted Plate mit Yam', en: 'Assorted Plate with Yam', fr: 'Assorted Plate avec igname' },
    watermarked: true,
  },
  {
    file: 'porridge-yam.jpg',
    alt: {
      de: 'Porridge Yam in kräftig roter Palmölsauce mit Kochbananen',
      en: 'Porridge yam in a rich red palm-oil sauce with plantain',
      fr: 'Porridge d’igname dans une sauce rouge à l’huile de palme, avec banane plantain',
    },
    caption: same('Porridge Yam'),
  },
  {
    file: 'clay-pot-soup.jpg',
    alt: {
      de: 'Suppe im Tontopf mit Zwiebelringen und gebratenen Kochbananen',
      en: 'Soup served in a clay pot with onion rings and fried plantain',
      fr: 'Soupe servie dans un pot en terre, avec rondelles d’oignon et bananes plantain frites',
    },
    watermarked: true,
  },
  {
    file: 'peppered-meat-plantain-yam.jpg',
    alt: {
      de: 'Gepfeffertes Fleisch mit gewürfelter Paprika, gebratenen Kochbananen und Yam',
      en: 'Peppered meat with diced bell peppers, fried plantain and yam',
      fr: 'Viande poivrée aux poivrons en dés, bananes plantain frites et igname',
    },
    watermarked: true,
  },
  {
    file: 'grilled-fish-plantain.jpg',
    alt: {
      de: 'Ganzer gegrillter Fisch mit gewürfelter Paprika und Zwiebeln, Kochbananen und Tomate',
      en: 'Whole grilled fish topped with diced peppers and onions, with plantain and tomato',
      fr: 'Poisson entier grillé garni de poivrons et d’oignons en dés, avec banane plantain et tomate',
    },
  },
  {
    file: 'rice-plantain-fish.jpg',
    alt: {
      de: 'Jollof-Reis mit gebratenen Kochbananen und Fisch auf einem achteckigen Teller',
      en: 'Jollof rice with fried plantain and fish on an octagonal plate',
      fr: 'Riz jollof avec bananes plantain frites et poisson, sur une assiette octogonale',
    },
    feature: true,
  },
  {
    file: 'leafy-soup.jpg',
    alt: {
      de: 'Grüne Blattgemüse-Suppe mit Fleisch auf einem blau gemusterten Teller',
      en: 'Leafy green soup with meat on a blue-patterned plate',
      fr: 'Soupe de feuilles vertes avec viande, sur une assiette à motifs bleus',
    },
    watermarked: true,
  },
  {
    file: 'yam-peppered-meat.jpg',
    alt: { de: 'Yam mit gepfeffertem Fleisch, roter Paprika und Zwiebeln', en: 'Yam with peppered meat, red pepper and onions', fr: 'Igname avec viande poivrée, poivron rouge et oignons' },
    watermarked: true,
  },
  {
    file: 'fish-in-sauce.jpg',
    alt: { de: 'Fisch in kräftiger dunkler Sauce auf einem gemusterten Teller', en: 'Fish in a rich dark sauce on a patterned plate', fr: 'Poisson dans une sauce sombre et relevée, sur une assiette à motifs' },
    watermarked: true,
  },
  {
    file: 'rice-meat.jpg',
    alt: { de: 'Zwei Portionen Reis mit gebratenem Fleisch auf einem ovalen Teller', en: 'Two mounds of rice with fried meat on an oval plate', fr: 'Deux dômes de riz avec viande frite sur une assiette ovale' },
    watermarked: true,
  },
  {
    file: 'meat-broth.jpg',
    alt: { de: 'Zartes Fleisch in heller Brühe in einer weißen Schale', en: 'Tender meat in a light broth in a white bowl', fr: 'Viande tendre dans un bouillon léger, dans un bol blanc' },
    watermarked: true,
  },
  {
    file: 'plantain-meat-sauce.jpg',
    alt: {
      de: 'Gekochte Kochbananen mit Fleisch in Sauce in einer geteilten Schale',
      en: 'Boiled plantain with meat in sauce in a divided dish',
      fr: 'Bananes plantain bouillies et viande en sauce dans un plat à compartiments',
    },
    watermarked: true,
  },
  {
    file: 'yam-meat.jpg',
    alt: { de: 'Gekochter Yam mit Fleisch und Zwiebeln auf einem weißen Teller', en: 'Boiled yam with meat and onions on a white plate', fr: 'Igname bouillie avec viande et oignons, sur une assiette blanche' },
    watermarked: true,
  },
  {
    file: 'takeaway-plantain.jpg',
    alt: {
      de: 'Gebratene Kochbananen mit gepfeffertem Fleisch und Gemüse in einer Takeaway-Box',
      en: 'Fried plantain with peppered meat and vegetables packed in a takeaway box',
      fr: 'Bananes plantain frites avec viande poivrée et légumes, dans une boîte à emporter',
    },
    watermarked: true,
  },
  {
    file: 'white-rice-stew.jpg',
    alt: { de: 'Weißer Reis in einer geteilten Schale mit Fleischeintopf', en: 'White rice in a divided dish with meat stew', fr: 'Riz blanc dans un plat à compartiments, avec ragoût de viande' },
  },
  {
    file: 'pounded-yam-soup.jpg',
    alt: {
      de: 'Weiße Swallow-Portionen in einer geteilten Schale mit dunkler Suppe',
      en: 'White swallow portions in a divided dish with a dark soup',
      fr: 'Portions de « swallow » blanc dans un plat à compartiments, avec une soupe sombre',
    },
  },
];
