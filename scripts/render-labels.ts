// Writes print drafts of the full wrap-around labels to design/labels/<slug>.svg (fonts as names; open in
// Affinity/Illustrator with Funnel Display, Manrope and Inter installed, then outline text and export CMYK PDF/X).
// Usage: npm run labels [-- slug ...]
import { writeFileSync, mkdirSync } from 'fs';
import { SEED_PRODUCTS } from '@/data/products';
import { fullLabelSvg } from '@/lib/labels/svg';

const only = process.argv.slice(2);
mkdirSync('design/labels', { recursive: true });
for (const p of SEED_PRODUCTS) {
  if (only.length ? !only.includes(p.slug) : p.productType === 'pets') continue;
  writeFileSync(`design/labels/${p.slug}.svg`, fullLabelSvg(p, { mode: 'print' }));
  writeFileSync(`design/labels/${p.slug}.guides.svg`, fullLabelSvg(p, { mode: 'print', guides: true }));
  console.log(`design/labels/${p.slug}.svg`);
}
