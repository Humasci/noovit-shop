// Replace a plain "+" with the noovit mosaic cross in AI-made product images (owner, 24 Nov: some Gemini renders drew
// a solid plus next to the wordmark). Finds solid orange plus shapes, paints over them with the surrounding label colour
// and draws the five-tile mosaic cross (lib/brand/cross.ts) in the same place, size, colour and angle.
// A real mosaic cross is five separate tiles, so it is never picked up as one solid plus.
// Run: npx tsx scripts/fix-cross.ts <image> [--angle deg] [--min-fill 0.22] [--min-size 7] [--scale 1.05] [--dry]
// (overwrites the image unless --dry; check the result, photos can contain orange shapes that are not a logo)
import sharp from 'sharp';
import { MARK_CROSS, CROSS_GAP, crossTile } from '@/lib/brand/cross';

type Comp = { minX: number; minY: number; maxX: number; maxY: number; n: number; r: number; g: number; b: number; cx: number; cy: number };

function isOrange(r: number, g: number, b: number) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if (mx < 120 || mx - mn < 70 || mx !== r) return false;
  const h = (60 * (g - b)) / (mx - mn); // hue in degrees, red = 0
  return h >= 8 && h <= 42 && (mx - mn) / mx > 0.5;
}

async function main() {
  const args = process.argv.slice(2);
  const file = args[0];
  const opt = (k: string) => { const i = args.indexOf(k); return i > 0 ? args[i + 1] : undefined; };
  const angle = Number(opt('--angle') ?? 0) || 0;
  const dry = args.includes('--dry');
  const minFill = Number(opt('--min-fill') ?? 0.22);
  const minSize = Number(opt('--min-size') ?? 7);
  const region = opt('--region')?.split(',').map(Number); // x,y,w,h: only look here
  const scale = Number(opt('--scale') ?? 1.05); // mosaic cross width relative to the old plus
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const mask = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) mask[i] = isOrange(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]) ? 1 : 0;

  const seen = new Uint8Array(W * H);
  const comps: Comp[] = [];
  for (let s = 0; s < W * H; s++) {
    if (!mask[s] || seen[s]) continue;
    const c: Comp = { minX: W, minY: H, maxX: 0, maxY: 0, n: 0, r: 0, g: 0, b: 0, cx: 0, cy: 0 };
    const stack = [s];
    seen[s] = 1;
    while (stack.length) {
      const p = stack.pop()!, x = p % W, y = (p / W) | 0;
      c.n++; c.cx += x; c.cy += y; c.r += data[p * 3]; c.g += data[p * 3 + 1]; c.b += data[p * 3 + 2];
      c.minX = Math.min(c.minX, x); c.maxX = Math.max(c.maxX, x); c.minY = Math.min(c.minY, y); c.maxY = Math.max(c.maxY, y);
      for (const q of [p - 1, p + 1, p - W, p + W]) if (q >= 0 && q < W * H && mask[q] && !seen[q] && Math.abs((q % W) - x) <= 1) { seen[q] = 1; stack.push(q); }
    }
    comps.push(c);
  }

  // A solid plus: square-ish box, a quarter to two thirds filled, the centre filled, the corners empty.
  const pluses = comps.filter((c) => {
    if (region && (c.minX < region[0] || c.minY < region[1] || c.maxX > region[0] + region[2] || c.maxY > region[1] + region[3])) return false;
    const w = c.maxX - c.minX + 1, h = c.maxY - c.minY + 1;
    if (w < minSize || h < minSize || w > 160 || h > 160) return false;
    if (w / h < 0.6 || w / h > 1.6) return false;
    const fill = c.n / (w * h);
    if (fill < minFill || fill > 0.7) return false;
    const at = (fx: number, fy: number) => mask[Math.round(c.minY + fy * (h - 1)) * W + Math.round(c.minX + fx * (w - 1))];
    const corners = at(0.08, 0.08) + at(0.92, 0.08) + at(0.08, 0.92) + at(0.92, 0.92);
    return at(0.5, 0.5) === 1 && corners <= 1;
  });
  console.log(`${file}: ${pluses.length} plain plus sign(s)`, pluses.map((c) => `[${c.minX},${c.minY} ${c.maxX - c.minX + 1}×${c.maxY - c.minY + 1}]`).join(' '));
  if (dry || !pluses.length) return;

  const out = Buffer.from(data);
  const overlays: string[] = [];
  for (const c of pluses) {
    const w = c.maxX - c.minX + 1, h = c.maxY - c.minY + 1;
    const pad = Math.ceil(Math.max(w, h) * 0.12) + 2;
    const x0 = Math.max(1, c.minX - pad), x1 = Math.min(W - 2, c.maxX + pad), y0 = Math.max(1, c.minY - pad), y1 = Math.min(H - 2, c.maxY + pad);
    // Paint over: each pixel blends the label colour just outside the box, left/right and above/below.
    const px = (x: number, y: number, k: number) => data[(y * W + x) * 3 + k];
    // Edge samples that sit on other artwork (the wordmark's letters) are skipped: only samples close to the median
    // edge brightness count, weighted by distance.
    const lum = (x: number, y: number) => 0.3 * px(x, y, 0) + 0.59 * px(x, y, 1) + 0.11 * px(x, y, 2);
    const edge: number[] = [];
    for (let x = x0; x <= x1; x++) edge.push(lum(x, y0 - 1), lum(x, y1 + 1));
    for (let y = y0; y <= y1; y++) edge.push(lum(x0 - 1, y), lum(x1 + 1, y));
    edge.sort((a, b) => a - b);
    const med = edge[edge.length >> 1];
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const src: [number, number, number][] = [[x0 - 1, y, x - x0 + 1], [x1 + 1, y, x1 + 1 - x], [x, y0 - 1, y - y0 + 1], [x, y1 + 1, y1 + 1 - y]];
      let wsum = 0;
      const acc = [0, 0, 0];
      for (const [sx, sy, d] of src) {
        if (Math.abs(lum(sx, sy) - med) > 28) continue;
        const wgt = 1 / d;
        wsum += wgt;
        for (let k = 0; k < 3; k++) acc[k] += px(sx, sy, k) * wgt;
      }
      if (wsum) for (let k = 0; k < 3; k++) out[(y * W + x) * 3 + k] = Math.round(acc[k] / wsum);
    }
    // The mosaic cross, centred where the plus was, the same overall width, in the plus's own (lit) orange.
    const size = Math.max(w, h) * scale;
    const t = crossTile(MARK_CROSS, size), step = t * (1 + CROSS_GAP);
    const col = `rgb(${Math.round(c.r / c.n)},${Math.round(c.g / c.n)},${Math.round(c.b / c.n)})`;
    const cx = c.minX + w / 2, cy = c.minY + h / 2;
    const tiles = MARK_CROSS.tiles.map(({ c: cc, r, o }) => `<rect x="${(cc * step - size / 2).toFixed(2)}" y="${(r * step - size / 2).toFixed(2)}" width="${t.toFixed(2)}" height="${t.toFixed(2)}" rx="${(t * 0.12).toFixed(2)}" fill="${col}" opacity="${o}"/>`).join('');
    overlays.push(`<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${angle})">${tiles}</g>`);
  }
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${overlays.join('')}</svg>`);
  const img = sharp(out, { raw: { width: W, height: H, channels: 3 } }).composite([{ input: svg }]);
  const buf = file.endsWith('.png') ? await img.png().toBuffer() : await img.jpeg({ quality: 92, mozjpeg: true }).toBuffer();
  await sharp(buf).toFile(file);
  console.log(`  replaced ${pluses.length} → ${file}`);
}
main();
