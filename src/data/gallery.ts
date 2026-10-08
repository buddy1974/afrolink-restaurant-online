/**
 * FOOD GALLERY — genuine Afrolink photographs only.
 *
 * Sources (client folder KUNDEN-OBERDORF/afrolink-restaurant):
 * - `watermarked: true` → the client's ENHANCED versions of the real WhatsApp
 *   photos (social-images/AI-Optimized/enhanced_* / final_set_watermarked_*),
 *   carrying the Afrolink watermark bottom-right. Only resized + metadata stripped;
 *   watermark untouched and kept in frame when tiles are cropped.
 * - others → original photos where no enhanced version exists.
 * Not used: ChatGPT re-renders (AI-regenerated pixels), photos showing guests or staff,
 * collages and screenshots.
 *
 * To ADD a photo:
 *   1. `npm run prepare-image -- "<source photo>" <new-name>.jpg` (strips GPS/EXIF, resizes).
 *   2. Add an entry below with `file` and a factual `alt`.
 * To REMOVE a photo: delete its entry.
 *
 * `caption` only where the client's own file name identifies the dish.
 * `feature: true` gives the image a larger tile on tablet/desktop.
 */

export interface GalleryEntry {
  file: string;
  alt: string;
  caption?: string;
  feature?: boolean;
  watermarked?: boolean;
}

export const gallery: GalleryEntry[] = [
  { file: 'plantain-peppered-meat.jpg', alt: 'Fried plantain topped with peppered beef and bell peppers', feature: true, watermarked: true },
  { file: 'nkwobi.jpg', alt: 'Nkwobi garnished with onion rings and red pepper, served in a wooden bowl', caption: 'Nkwobi', watermarked: true },
  { file: 'egusi-yam.jpg', alt: 'Egusi soup served with boiled yam', caption: 'Egusi Soup with yam', watermarked: true },
  { file: 'jollof-rice.jpg', alt: 'Jollof rice with pieces of fried meat on a white plate', caption: 'Jollof Rice' },
  { file: 'suya-plantain.jpg', alt: 'Peppered meat with onions and bell peppers beside fried plantain', caption: 'Suya with plantain' },
  { file: 'okra-soup.jpg', alt: 'Okra soup in a white dish next to a portion of swallow', caption: 'Okra Soup', watermarked: true },
  { file: 'pepper-soup.jpg', alt: 'Pepper soup with meat and yam in a copper bowl', caption: 'Pepper Soup', feature: true, watermarked: true },
  { file: 'assorted-meat-yam.jpg', alt: 'Assorted meat with peppers served with boiled yam', caption: 'Assorted Plate with Yam', watermarked: true },
  { file: 'porridge-yam.jpg', alt: 'Porridge yam in a rich red palm-oil sauce with plantain', caption: 'Porridge Yam' },
  { file: 'clay-pot-soup.jpg', alt: 'Soup served in a clay pot with onion rings and fried plantain', watermarked: true },
  { file: 'peppered-meat-plantain-yam.jpg', alt: 'Peppered meat with diced bell peppers, fried plantain and yam', watermarked: true },
  { file: 'grilled-fish-plantain.jpg', alt: 'Whole grilled fish topped with diced peppers and onions, with plantain and tomato' },
  { file: 'rice-plantain-fish.jpg', alt: 'Jollof rice with fried plantain and fish on an octagonal plate', feature: true },
  { file: 'leafy-soup.jpg', alt: 'Leafy green soup with meat on a blue-patterned plate', watermarked: true },
  { file: 'yam-peppered-meat.jpg', alt: 'Yam with peppered meat, red pepper and onions', watermarked: true },
  { file: 'fish-in-sauce.jpg', alt: 'Fish in a rich dark sauce on a patterned plate', watermarked: true },
  { file: 'rice-meat.jpg', alt: 'Two mounds of rice with fried meat on an oval plate', watermarked: true },
  { file: 'meat-broth.jpg', alt: 'Tender meat in a light broth in a white bowl', watermarked: true },
  { file: 'plantain-meat-sauce.jpg', alt: 'Boiled plantain with meat in sauce in a divided dish', watermarked: true },
  { file: 'yam-meat.jpg', alt: 'Boiled yam with meat and onions on a white plate', watermarked: true },
  { file: 'takeaway-plantain.jpg', alt: 'Fried plantain with peppered meat and vegetables packed in a takeaway box', watermarked: true },
  { file: 'white-rice-stew.jpg', alt: 'White rice in a divided dish with meat stew' },
  { file: 'pounded-yam-soup.jpg', alt: 'White swallow portions in a divided dish with a dark soup' },
];
