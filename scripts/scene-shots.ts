// Scene shots (FourFive-style, owner 19 Nov): the labelled bottle set into a bed of its ingredient, with 3 callouts.
// npx tsx scripts/scene-shots.ts <slug> <texture.jpg> <out.png> ["Callout 1|Callout 2|Callout 3"]
import sharp from 'sharp';
import { findProduct } from '@/data/products';
import { SEED_PRODUCTS } from '@/data/products';
import { studioCutout } from '@/lib/labels/studio';

const [slug, texture, out, callouts = ''] = process.argv.slice(2);
const S = 1600;

(async () => {
  const p = findProduct(SEED_PRODUCTS, slug);
  if (!p) throw new Error(`no product ${slug}`);
  const bg = await sharp(texture).resize(S, S, { fit: 'cover' }).modulate({ brightness: 0.55, saturation: 0.85 }).blur(2).toBuffer();
  const cut = await studioCutout(p, [200, 196, 188]);
  const bh = Math.round(S * 0.74), bw = Math.round((cut.width / cut.height) * bh);
  // Tighten the mask a few pixels (the studio photo's edge pixels carry its grey backdrop and shadow), then feather.
  const raw = await sharp(cut.data, { raw: { width: cut.width, height: cut.height, channels: 4 } }).resize(bw, bh).raw().toBuffer();
  const a0 = Buffer.alloc(bw * bh); for (let i = 0; i < bw * bh; i++) a0[i] = raw[i * 4 + 3];
  // Erode by R px (min filter, separable), then a small box blur to feather.
  const R = 4, F = 2;
  const minPass = (src: Uint8Array, horiz: boolean) => {
    const dst = new Uint8Array(src.length);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      let m = 255;
      for (let d = -R; d <= R; d++) { const xx = horiz ? x + d : x, yy = horiz ? y : y + d; m = Math.min(m, xx < 0 || yy < 0 || xx >= bw || yy >= bh ? 0 : src[yy * bw + xx]); }
      dst[y * bw + x] = m;
    }
    return dst;
  };
  const boxPass = (src: Uint8Array, horiz: boolean) => {
    const dst = new Uint8Array(src.length);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      let sum = 0, n = 0;
      for (let d = -F; d <= F; d++) { const xx = horiz ? x + d : x, yy = horiz ? y : y + d; if (xx >= 0 && yy >= 0 && xx < bw && yy < bh) { sum += src[yy * bw + xx]; n++; } }
      dst[y * bw + x] = Math.round(sum / n);
    }
    return dst;
  };
  const a1 = boxPass(boxPass(minPass(minPass(a0, true), false), true), false);
  for (let i = 0; i < bw * bh; i++) raw[i * 4 + 3] = a1[i];
  const bottle = await sharp(raw, { raw: { width: bw, height: bh, channels: 4 } }).png().toBuffer();
  const left = Math.round(S * 0.66 - bw / 2), top = Math.round(S * 0.53 - bh / 2);
  // Shadow: the bottle's silhouette, black, blurred and offset down-right, plus a dark contact pool at the base.
  const alpha = await sharp(bottle).extractChannel('alpha').toBuffer();
  const sil = await sharp({ create: { width: bw, height: bh, channels: 3, background: '#000' } }).joinChannel(alpha).png().toBuffer();
  // sharp runs composite after other operations, so place first, then blur in a second pass.
  const placed = await sharp({ create: { width: S, height: S, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: sil, left: left + 40, top: top + 36 }]).png().toBuffer();
  const shadowSoft = await sharp(placed).blur(36).png().toBuffer();
  const items = callouts ? callouts.split('|') : [];
  const lines = items.map((c, i) => {
    const y = 520 + i * 300;
    const words = c.toUpperCase().split(' '); const half = Math.ceil(words.length / 2);
    const l1 = words.length > 2 ? words.slice(0, half).join(' ') : words.join(' '), l2 = words.length > 2 ? words.slice(half).join(' ') : '';
    return `<circle cx="210" cy="${y - 80}" r="40" fill="none" stroke="#fff" stroke-width="3"/><circle cx="210" cy="${y - 80}" r="8" fill="#F26A21"/>
      <text x="210" y="${y + 6}" fill="#fff" font-family="Inter, Arial" font-size="30" letter-spacing="3" text-anchor="middle">${l1}</text>
      <text x="210" y="${y + 46}" fill="#fff" font-family="Inter, Arial" font-size="30" letter-spacing="3" text-anchor="middle">${l2}</text>`;
  }).join('');
  const bracket = items.length ? `<path d="M380 ${440} H430 V${440 + (items.length - 1) * 300} H380" fill="none" stroke="#fff" stroke-width="3"/><path d="M430 ${440 + ((items.length - 1) * 300) / 2} H${left - 20}" stroke="#fff" stroke-width="3"/>` : '';
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}">${bracket}${lines}</svg>`);
  await sharp(bg).composite([{ input: shadowSoft }, { input: bottle, left, top }, { input: svg }]).png().toFile(out);
  console.log('wrote', out);
})();
