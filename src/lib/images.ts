import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

export interface ProjectImage {
  file: ImageMetadata;
  name: string;
}

export interface RetouchPair {
  before: ProjectImage;
  after: ProjectImage;
}

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/projects/**/*.{jpg,jpeg,JPG,JPEG,png,webp}',
  { eager: true },
);

/** All images for a given project slug, sorted by filename. */
export function getProjectImages(slug: string): ProjectImage[] {
  return Object.entries(modules)
    .filter(([path]) => path.includes(`/assets/projects/${slug}/`))
    .map(([path, mod]) => ({
      file: mod.default,
      name: path.split('/').pop() ?? path,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** The cover: a file named "cover.*" if present, otherwise the first. */
export function getCover(images: ProjectImage[]): ProjectImage {
  return images.find((img) => /^cover\./i.test(img.name)) ?? images[0];
}

/** The "in context" hover shot: "alt.*", or the second non-cover gallery image. */
export function getAlt(images: ProjectImage[], cover: ProjectImage): ProjectImage | undefined {
  const alt = images.find((img) => /^alt\./i.test(img.name));
  if (alt) return alt;
  return images.filter((img) => img !== cover && !/^(before|after)-/i.test(img.name))[1];
}

/** Matches `before-XX.*` with `after-XX.*`. */
export function getRetouchPairs(images: ProjectImage[]): RetouchPair[] {
  const pairs: RetouchPair[] = [];
  for (const before of images) {
    const m = before.name.match(/^before-(.+?)\.[^.]+$/i);
    if (!m) continue;
    const after = images.find((img) => new RegExp(`^after-${m[1]}\\.`, 'i').test(img.name));
    if (after) pairs.push({ before, after });
  }
  return pairs;
}

/** Gallery images (everything except before-/after- files), capped at `max`. */
export function getShowcase(images: ProjectImage[], max = 30): ProjectImage[] {
  return images.filter((img) => !/^(before|after)-/i.test(img.name)).slice(0, max);
}

/** An image whose filename starts with `prefix`, or `fallback` if none matches. */
export function findImage(
  images: ProjectImage[],
  prefix: string,
  fallback: ProjectImage,
): ProjectImage {
  return images.find((img) => img.name.startsWith(prefix)) ?? fallback;
}

/** URL of the large version used by the lightbox (`data-full`). */
export async function getFullUrl(file: ImageMetadata): Promise<string> {
  const img = await getImage({ src: file, width: Math.min(2400, file.width), format: 'webp' });
  return img.src;
}
