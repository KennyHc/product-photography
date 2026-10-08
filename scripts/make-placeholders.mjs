// Generates muted placeholder JPEGs so the site builds and looks complete
// before real photos exist. Deterministic. Only writes files that do not
// exist; pass --force to overwrite.
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets');
const force = process.argv.includes('--force');

// Background tone, then a darker product tone of the same hue.
const TONES = [
  ['#d9d6cf', '#8f8a7e'],
  ['#c9cfd2', '#79868e'],
  ['#d6cdc4', '#948576'],
  ['#cdd3c8', '#808c76'],
  ['#d2c9cf', '#8c7a86'],
  ['#bfc5cc', '#6f7b88'],
];

const SQUARE = [2000, 2000];
const FOUR_FIVE = [2000, 2500];
const PORTRAIT = [1600, 2400];
const LANDSCAPE = [2400, 1600];
const SIZES = [SQUARE, FOUR_FIVE, PORTRAIT, LANDSCAPE, FOUR_FIVE, SQUARE, LANDSCAPE, PORTRAIT];

const slugs = ['sample-ecommerce', 'sample-lifestyle', 'sample-still-life', 'sample-flat-lay'];

let toneIndex = 0;
let written = 0;

/** Product silhouette: variant 0 bottle, 1 box, 2 jar. */
function silhouette(variant, cx, cy, size, fill) {
  const s = size;
  if (variant === 0) {
    const w = s * 0.5;
    const h = s * 1.1;
    const neckW = w * 0.4;
    const neckH = h * 0.22;
    return `
      <rect x="${cx - w / 2}" y="${cy - h / 2 + neckH}" width="${w}" height="${h - neckH}" rx="${w * 0.12}" fill="${fill}"/>
      <rect x="${cx - neckW / 2}" y="${cy - h / 2}" width="${neckW}" height="${neckH + 4}" rx="${neckW * 0.12}" fill="${fill}"/>`;
  }
  if (variant === 1) {
    const w = s * 0.9;
    const h = s * 0.7;
    return `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${s * 0.04}" fill="${fill}"/>`;
  }
  const w = s * 0.7;
  const h = s * 0.75;
  return `
    <rect x="${cx - w / 2}" y="${cy - h / 2 + h * 0.18}" width="${w}" height="${h * 0.82}" rx="${w * 0.1}" fill="${fill}"/>
    <rect x="${cx - w * 0.54}" y="${cy - h / 2}" width="${w * 1.08}" height="${h * 0.2}" rx="${w * 0.05}" fill="${fill}"/>`;
}

function svg({ w, h, bg, fg, variant, label, filter = '' }) {
  const short = Math.min(w, h);
  const size = short * 0.35;
  const cx = w / 2;
  const cy = h / 2;
  const groundY = cy + size * 0.58;
  const fontSize = Math.round(short * 0.018);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" fill="${bg}"/>
    <ellipse cx="${cx}" cy="${groundY}" rx="${size * 0.55}" ry="${size * 0.07}" fill="${fg}" opacity="0.28"/>
    <g ${filter}>${silhouette(variant, cx, cy, size, fg)}</g>
    <text x="${short * 0.04}" y="${h - short * 0.04}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="${fontSize}" fill="#33363b" opacity="0.7">${label}</text>
  </svg>`);
}

async function write(file, buffer) {
  if (!force && existsSync(file)) return;
  mkdirSync(dirname(file), { recursive: true });
  await sharp(buffer).jpeg({ quality: 82 }).toFile(file);
  written++;
}

async function make(slug, name, [w, h], opts = {}) {
  const [bg, fg] = TONES[toneIndex++ % TONES.length];
  const label = `${slug} · ${name} · ${w}×${h}`;
  const buf = svg({ w, h, bg: opts.bg ?? bg, fg: opts.fg ?? fg, variant: opts.variant ?? toneIndex % 3, label });
  let img = sharp(buf);
  if (opts.after) img = img.modulate({ brightness: 1.06, saturation: 1.05 }).sharpen();
  if (opts.before) img = img.modulate({ brightness: 0.94, saturation: 0.55 }).blur(1.4);
  await write(join(root, 'projects', slug, name), await img.png().toBuffer());
}

for (const slug of slugs) {
  await make(slug, 'cover.jpg', FOUR_FIVE);
  await make(slug, 'alt.jpg', FOUR_FIVE);
  for (let i = 0; i < 8; i++) {
    await make(slug, `0${i + 1}.jpg`, SIZES[i]);
  }
  if (slug === 'sample-ecommerce') {
    toneIndex = 3;
    await make(slug, 'before-01.jpg', FOUR_FIVE, { before: true, variant: 0 });
    toneIndex = 3;
    await make(slug, 'after-01.jpg', FOUR_FIVE, { after: true, variant: 0 });
  }
}

// Home heroes: darker, lower third darkest.
function heroSvg(w, h, label) {
  const short = Math.min(w, h);
  const size = short * 0.4;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a4e55"/><stop offset="0.66" stop-color="#3a3d42"/><stop offset="1" stop-color="#1c1d20"/>
    </linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <ellipse cx="${w / 2}" cy="${h * 0.58 + size * 0.58}" rx="${size * 0.6}" ry="${size * 0.07}" fill="#000" opacity="0.35"/>
    ${silhouette(0, w / 2, h * 0.5, size, '#aeb4bc')}
    <text x="${short * 0.04}" y="${h * 0.62}" font-family="Inter, Helvetica, Arial, sans-serif" font-size="${Math.round(short * 0.018)}" fill="#c9ccd1" opacity="0.7">${label}</text>
  </svg>`);
}
await write(join(root, 'home', 'hero.jpg'), await sharp(heroSvg(2400, 1500, 'home · hero.jpg · 2400×1500')).png().toBuffer());
await write(join(root, 'home', 'hero-portrait.jpg'), await sharp(heroSvg(1600, 2400, 'home · hero-portrait.jpg · 1600×2400')).png().toBuffer());

console.log(`Wrote ${written} file(s).`);
console.log('Placeholders generated. Replace them with real photos and delete the placeholders before launch.');
