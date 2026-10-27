// Writes print drafts of the full wrap-around labels to design/labels/:
//   <slug>.svg         artwork (fonts as names: open in Affinity/Illustrator with Funnel Display, Manrope and Inter
//                      installed, outline the text and export a CMYK PDF/X)
//   <slug>.guides.svg  the same with trim (red), safe zone (blue) and panel folds
//   <slug>.png         preview with guides
// Usage: npm run labels                 every human product on sale plus hidden drafts of the Focus line
//        npm run labels -- <slug> ...   only these products
import { writeFileSync, mkdirSync, readdirSync } from 'fs';
import { Resvg } from '@resvg/resvg-js';
import { SEED_PRODUCTS } from '@/data/products';
import { fullLabelSvg } from '@/lib/labels/svg';

const RETIRED = ['niacinamide', 'odorless-garlic']; // hidden with no supplier; no label needed
const only = process.argv.slice(2);
const fontFiles = readdirSync('assets/fonts').filter((f) => f.endsWith('.ttf')).map((f) => `assets/fonts/${f}`);
mkdirSync('design/labels', { recursive: true });

for (const p of SEED_PRODUCTS) {
  if (only.length ? !only.includes(p.slug) : p.productType === 'pets' || RETIRED.includes(p.slug)) continue;
  const guides = fullLabelSvg(p, { mode: 'print', guides: true });
  writeFileSync(`design/labels/${p.slug}.svg`, fullLabelSvg(p, { mode: 'print' }));
  writeFileSync(`design/labels/${p.slug}.guides.svg`, guides);
  const png = new Resvg(guides, { fitTo: { mode: 'width', value: 2000 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
  writeFileSync(`design/labels/${p.slug}.png`, png);
  console.log(p.slug);
}
