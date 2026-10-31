// Writes print drafts of the full wrap-around labels to design/labels/ (and, for powders, the 11" × 3" tub label):
//   <slug>.svg         artwork (fonts as names: open in Affinity/Illustrator with Funnel Display and Inter
//                      installed, outline the text and export a CMYK PDF/X)
//   <slug>.guides.svg  the same with trim (red), safe zone (blue) and panel folds
//   <slug>.png         preview with guides
// Usage: npm run labels                 every human product on sale plus hidden drafts of the Focus line
//        npm run labels -- <slug> ...   only these products
import { writeFileSync, mkdirSync, readdirSync } from 'fs';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { SEED_PRODUCTS } from '@/data/products';
import { fullLabelSvg, tubLabelSvg, TUB_LABEL } from '@/lib/labels/svg';

const RETIRED = ['niacinamide', 'odorless-garlic']; // hidden with no supplier; no label needed
const only = process.argv.slice(2);
const fontFiles = readdirSync('assets/fonts').filter((f) => f.endsWith('.ttf')).map((f) => `assets/fonts/${f}`);
mkdirSync('design/labels', { recursive: true });

(async () => {
for (const p of SEED_PRODUCTS) {
  // Bundles ship their component bottles, so they have no label of their own.
  if (only.length ? !only.includes(p.slug) : p.productType === 'pets' || RETIRED.includes(p.slug) || p.bundleItems?.length) continue;
  const guides = fullLabelSvg(p, { mode: 'print', guides: true });
  writeFileSync(`design/labels/${p.slug}.svg`, fullLabelSvg(p, { mode: 'print' }));
  writeFileSync(`design/labels/${p.slug}.guides.svg`, guides);
  const png = new Resvg(guides, { fitTo: { mode: 'width', value: 2000 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
  writeFileSync(`design/labels/${p.slug}.png`, png);
  // Powders ship in Supliful's tub: 11" × 3" label. <slug>.tub.png is the upload file (300 dpi, bleed included).
  if (p.form === 'powder') {
    writeFileSync(`design/labels/${p.slug}.tub.svg`, tubLabelSvg(p));
    const dpi300 = ((TUB_LABEL.trimW + TUB_LABEL.bleed * 2) / 100) * 300;
    // Flattened to plain RGB at 300 dpi: Supliful asks for RGB files.
    const tub = new Resvg(tubLabelSvg(p), { fitTo: { mode: 'width', value: dpi300 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
    await sharp(tub).flatten({ background: '#ffffff' }).removeAlpha().withMetadata({ density: 300 }).png().toFile(`design/labels/${p.slug}.tub.png`);
    writeFileSync(`design/labels/${p.slug}.tub.guides.png`, new Resvg(tubLabelSvg(p, { guides: true }), { fitTo: { mode: 'width', value: 2250 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng());
  }
  console.log(p.slug);
}
})();
