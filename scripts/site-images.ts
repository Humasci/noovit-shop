// Site photography from the studio bottle (lib/labels/studio.ts): group shots used on the homepage, About, FAQ and
// newsletter. Re-run after a label or colour change: npx tsx --conditions=react-server scripts/site-images.ts
// Writes public/images/lineup-3.png (hero, square), lineup-5.png (4:3) and prints the studio backdrop colour,
// which the pages use behind these images (--studio in app/globals.css) so no edge shows.
import { writeFileSync } from 'fs';
import sharp from 'sharp';
import { SEED_PRODUCTS } from '@/data/products';
import { studioGroupPng, studioBackdrop, BACKDROP, SAGE } from '@/lib/labels/studio';

const P = (s: string) => SEED_PRODUCTS.find((p) => p.slug === s)!;
(async () => {
  const bg = await studioBackdrop();
  const three = await studioGroupPng(['magnesium-complex', 'lions-mane', 'ashwagandha'].map(P), 1600, 1600, { size: 940, step: 500, y: 330, bg });
  writeFileSync('public/images/lineup-3.png', await sharp(three).png({ compressionLevel: 9, palette: false }).toBuffer());
  const five = await studioGroupPng(['magnesium-complex', 'ashwagandha', 'lions-mane', 'coq10', 'turmeric-complex'].map(P), 1600, 1200, { size: 560, step: 300, y: 330, bg });
  writeFileSync('public/images/lineup-5.png', five);
  // Hero: three bottles, wide, for the full-bleed homepage hero (text sits on the same backdrop to the left).
  const hero = await studioGroupPng(['magnesium-complex', 'lions-mane', 'ashwagandha'].map(P), 1500, 1200, { size: 860, step: 470, y: 230, bg });
  writeFileSync('public/images/lineup-hero.png', hero);
  // Featured products on a soft tint of their own label colour (FourFive-style), for the homepage feature cards.
  // Cards alternate cream and sage (owner, 17 Nov).
  for (const [slug, t] of [['lions-mane', SAGE], ['magnesium-complex', BACKDROP]] as const) {
    writeFileSync(`public/images/feature-${slug}.png`, await studioGroupPng([P(slug)], 1200, 1200, { size: 1100, step: 0, y: 60, bg: [...t] as [number, number, number] }));
    console.log('feature', slug, '#' + t.map((v) => v.toString(16).padStart(2, '0')).join(''));
  }
  console.log('backdrop', '#' + bg.map((v) => v.toString(16).padStart(2, '0')).join(''));
})();
