import type { ImageMetadata } from 'astro';

// Every photo in src/assets/gallery and src/assets/menu is addressable as "<folder>/<file>"
// (a bare filename means the gallery folder, for backwards compatibility).
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/{gallery,menu}/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

/** Resolve an image; fails the build with a clear message if missing. */
export function galleryImage(file: string, usedBy: string): ImageMetadata {
  const key = file.includes('/') ? file : `gallery/${file}`;
  const mod = files[`../assets/${key}`];
  if (!mod) {
    throw new Error(`${usedBy}: "${key}" is missing from src/assets/.`);
  }
  return mod.default;
}
