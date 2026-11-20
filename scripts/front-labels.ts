// Front panels only (no Supplement Facts), as flat PNGs for image tools (owner, 20 Nov: "creative labels" for Gemini).
// npx tsx --conditions=react-server scripts/front-labels.ts slug1 slug2 ...  → design/labels/fronts/<slug>.front.png
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { SEED_PRODUCTS } from '@/data/products';
import { FRONT, frontLabel, labelPaper } from '@/lib/labels/svg';

const W = 1800; // px wide; 220 × 225 units → ~1840 px tall
const fonts = readdirSync('assets/fonts').filter((f) => f.endsWith('.ttf')).map((f) => path.join('assets/fonts', f));
mkdirSync('design/labels/fronts', { recursive: true });
for (const slug of process.argv.slice(2)) {
  const p = SEED_PRODUCTS.find((x) => x.slug === slug);
  if (!p) { console.error('no product', slug); continue; }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FRONT.w} ${FRONT.h}" width="${FRONT.w}" height="${FRONT.h}"><rect width="${FRONT.w}" height="${FRONT.h}" fill="${labelPaper(p)}"/>${frontLabel(p, 'print', 0)}</svg>`;
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles: fonts, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
  writeFileSync(`design/labels/fronts/${slug}.front.png`, png);
  console.log('wrote', slug);
}
