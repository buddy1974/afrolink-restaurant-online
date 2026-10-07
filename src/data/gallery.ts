/**
 * FOOD GALLERY — genuine Afrolink photographs only (no stock, no AI images).
 *
 * To ADD a photo:
 *   1. Put the JPG/PNG in  src/assets/gallery/  (strip GPS/EXIF first —
 *      `npm run prepare-image -- <source> <name>.jpg` does that and resizes).
 *   2. Add an entry below with `file` = the filename and a factual `alt`.
 * To REMOVE a photo: delete its entry (and optionally the file).
 *
 * `caption` is shown on hover / in the lightbox. Only use a dish name when the
 * photo is known to show that dish; otherwise leave caption empty.
 * `feature: true` gives the image a larger tile on desktop.
 * A missing file fails the build with a clear message (see Gallery.astro).
 *
 * Source: Afrolink client folder (WhatsApp photos, April 2025) — EXIF stripped.
 * Pending: professional photo shoot; replace/extend entries when delivered.
 */

export interface GalleryEntry {
  file: string;
  alt: string;
  caption?: string;
  feature?: boolean;
}

export const gallery: GalleryEntry[] = [
  { file: 'rice-plantain-fish.jpg', alt: 'Jollof rice with fried plantain and fish on an octagonal plate', feature: true },
  { file: 'nkwobi.jpg', alt: 'Nkwobi garnished with onion rings and red pepper, served in a wooden bowl', caption: 'Nkwobi' },
  { file: 'jollof-rice.jpg', alt: 'Jollof rice with pieces of fried meat on a white plate', caption: 'Jollof Rice' },
  { file: 'egusi-yam.jpg', alt: 'Egusi soup served with boiled yam', caption: 'Egusi Soup with yam' },
  { file: 'suya-plantain.jpg', alt: 'Peppered meat with onions and bell peppers beside fried plantain', caption: 'Suya with plantain' },
  { file: 'pepper-soup.jpg', alt: 'Pepper soup with meat and yam in a copper bowl', caption: 'Pepper Soup', feature: true },
  { file: 'porridge-yam.jpg', alt: 'Porridge yam in a rich red palm-oil sauce with plantain', caption: 'Porridge Yam' },
  { file: 'okra-soup.jpg', alt: 'Okra soup in a white dish next to a portion of swallow', caption: 'Okra Soup' },
  { file: 'assorted-meat-yam.jpg', alt: 'Assorted meat with peppers served with boiled yam', caption: 'Assorted Plate with Yam' },
  { file: 'grilled-fish-plantain.jpg', alt: 'Whole grilled fish topped with diced peppers and onions, with plantain and tomato' },
  { file: 'plantain-peppered-meat.jpg', alt: 'Fried plantain topped with peppered meat and bell peppers', feature: true },
  { file: 'pounded-yam-soup.jpg', alt: 'Pounded yam portions in a divided dish with a dark soup' },
  { file: 'yam-peppered-meat.jpg', alt: 'Yam with peppered meat, carrots and onions on a floral plate' },
  { file: 'white-rice-stew.jpg', alt: 'White rice in a divided dish with meat stew' },
  { file: 'leafy-soup.jpg', alt: 'Leafy green soup with meat on a blue-patterned plate' },
  { file: 'clay-pot-soup.jpg', alt: 'Soup served in a clay pot with onion rings and fried plantain' },
  { file: 'plantain-meat-sauce.jpg', alt: 'Boiled plantain with meat in sauce in a divided dish' },
  { file: 'yam-meat.jpg', alt: 'Boiled yam with meat and onions on a white plate' },
];
