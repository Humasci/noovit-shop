// Homepage hero (owner, 24 Nov): supplements and at-home test kits in one scene. Our studio bottles (lib/labels/studio.ts
// cutouts, warmed to the room light) stand on the stone table in front of the kit-box render (public/images/tests/hero-kits.jpg).
// Run: npx tsx --conditions=react-server scripts/hero-mix.ts  → public/images/hero-mix.jpg
import sharp from 'sharp';
import { SEED_PRODUCTS } from '@/data/products';
import { studioCutout } from '@/lib/labels/studio';

const P = (s: string) => SEED_PRODUCTS.find((p) => p.slug === s)!;
const W = 1500, H = 1200; // hero slot (5:4)

(async () => {
  // Crop the right part of the kit scene to 5:4, scaled up to the hero size.
  const src = sharp('public/images/tests/hero-kits.jpg');
  const meta = await src.metadata();
  const cropH = meta.height!, cropW = Math.round(cropH * W / H), left = meta.width! - cropW - 40;
  const base = await sharp('public/images/tests/hero-kits.jpg').extract({ left, top: 0, width: cropW, height: cropH }).resize(W, H).raw().toBuffer();

  // Table tone for the warm tint, sampled from the front of the table.
  const tint: [number, number, number] = [0xe9, 0xdf, 0xd2];
  // Real-world scale: a bottle is about 4.6" tall, a kit box about 6.5" wide (the front box is ~500 px wide here).
  const bottles = [
    { slug: 'magnesium-complex', x: 60, h: 400, floor: 1125 },
    { slug: 'ashwagandha', x: 470, h: 400, floor: 1125 },
    { slug: 'lions-mane', x: 255, h: 430, floor: 1165 },
  ];
  const layers: sharp.OverlayOptions[] = [];
  for (const b of bottles) {
    const c = await studioCutout(P(b.slug), tint);
    const scale = b.h / c.height, w = Math.round(c.width * scale);
    // Room light from the upper left: a soft shade across the right of each bottle, kept inside the bottle's outline.
    const shade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${b.h}">
      <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0.45" stop-color="#3a2a1c" stop-opacity="0"/><stop offset="1" stop-color="#3a2a1c" stop-opacity="0.22"/></linearGradient></defs>
      <rect width="${w}" height="${b.h}" fill="url(#g)"/></svg>`);
    const sized = await sharp(c.data, { raw: { width: c.width, height: c.height, channels: 4 } }).resize(w, b.h).modulate({ brightness: 0.97, saturation: 0.84 }).linear(0.92, 14).png().toBuffer();
    // 'atop' paints the shade only where the bottle is, so its outline (alpha) stays intact.
    const img = await sharp(sized).composite([{ input: shade, blend: 'atop' }]).png().toBuffer();
    const floor = b.floor;
    // Soft contact shadow plus a longer shadow falling right (the room light comes from the upper left).
    const sw = Math.round(w * 1.5), sh = 90;
    const shadow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${sw}" height="${sh}">
      <defs><filter id="b"><feGaussianBlur stdDeviation="14"/></filter><filter id="c"><feGaussianBlur stdDeviation="6"/></filter></defs>
      <ellipse cx="${sw * 0.58}" cy="${sh / 2}" rx="${sw * 0.42}" ry="${sh * 0.22}" fill="rgba(70,55,40,0.42)" filter="url(#b)"/>
      <ellipse cx="${sw * 0.36}" cy="${sh / 2}" rx="${w * 0.47}" ry="${sh * 0.13}" fill="rgba(50,38,28,0.6)" filter="url(#c)"/>
    </svg>`);
    layers.push({ input: shadow, left: Math.round(b.x - w * 0.04), top: floor - sh / 2 - 6 });
    layers.push({ input: img, left: b.x, top: floor - b.h });
  }
  await sharp(base, { raw: { width: W, height: H, channels: 3 } })
    .composite(layers)
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile('public/images/hero-mix.jpg');
  console.log('wrote public/images/hero-mix.jpg');
})();
