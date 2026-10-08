import type { ImageMetadata } from 'astro';

// Every photo in src/assets/gallery is addressable by filename.
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/gallery/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

/** Resolve a gallery filename; fails the build with a clear message if missing. */
export function galleryImage(file: string, usedBy: string): ImageMetadata {
  const mod = files[`../assets/gallery/${file}`];
  if (!mod) {
    throw new Error(`${usedBy}: "${file}" is missing from src/assets/gallery/.`);
  }
  return mod.default;
}
