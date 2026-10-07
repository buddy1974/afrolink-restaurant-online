#!/usr/bin/env node
/**
 * Prepare a new Afrolink photo for the gallery:
 *   - applies EXIF orientation, then strips ALL metadata (GPS, device, date)
 *   - limits the long edge to 2000 px
 *   - writes a progressive JPEG into src/assets/gallery/
 *
 * Usage:  npm run prepare-image -- "<path to source photo>" <new-name>.jpg
 * Then add an entry for <new-name>.jpg in src/data/gallery.ts.
 */
import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { basename, join } from 'node:path';

const [src, name] = process.argv.slice(2);
if (!src || !name) {
  console.error('Usage: npm run prepare-image -- "<source photo>" <new-name>.jpg');
  process.exit(1);
}
if (!existsSync(src)) {
  console.error(`Source not found: ${src}`);
  process.exit(1);
}
if (!/^[a-z0-9-]+\.jpg$/.test(name)) {
  console.error('Name must be lowercase-kebab-case and end in .jpg, e.g. egusi-soup-2.jpg');
  process.exit(1);
}

const out = join('src', 'assets', 'gallery', basename(name));
if (existsSync(out)) {
  console.error(`Refusing to overwrite existing ${out}`);
  process.exit(1);
}

const info = await sharp(src)
  .rotate() // honour EXIF orientation; sharp drops metadata unless .withMetadata() is called
  .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 88, progressive: true, mozjpeg: true })
  .toFile(out);

console.log(`Wrote ${out} (${info.width}×${info.height}). Now add it to src/data/gallery.ts.`);
