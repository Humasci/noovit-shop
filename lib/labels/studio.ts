import 'server-only';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { Product } from '@/types';
import { FRONT, frontLabel, labelPaper } from './svg';

// Studio photo (16 Nov, owner's pick): a photoreal studio shot of our white bottle (assets/mockups/studio-bottle.jpg,
// 1493 × 2000, soft grey backdrop, ribbed cap) with our label wrapped onto it. The template's own label area is
// measured, then replaced pixel by pixel: each pixel maps to a point on the flat label (cylinder unwrap), and the
// template's light and shade are carried over from its label (per-column and per-row medians, so its printed text
// doesn't leak through). The result keeps the photo's real lighting with the approved label artwork exactly.
const FILE = path.join(process.cwd(), 'assets/mockups/studio-bottle.jpg');
const SCALE = 6; // label art render resolution, px per label unit
const U0 = -40, U1 = FRONT.w + 40;
const HIGHLIGHT = 0.6; // share of the template's key-light highlight kept (deep label colours bloom more than its teal) // label units rendered (front panel plus the wrap round the sides)

type Template = {
  W: number; H: number; data: Buffer;
  x0: number; x1: number; cx: number; R: number;
  top: Float32Array; bot: Float32Array; // label edges per column (NaN outside the label)
  shadeX: Float32Array; shadeY: Float32Array; // lighting ratios
  pxPerUnit: number;
};
let cached: Promise<Template> | null = null;

const median = (a: number[]) => { const s = [...a].sort((p, q) => p - q); return s.length ? s[s.length >> 1] : 0; };
const smooth = (a: Float32Array, win: number) => {
  const out = new Float32Array(a.length);
  for (let i = 0; i < a.length; i++) {
    const w: number[] = [];
    for (let j = Math.max(0, i - win); j <= Math.min(a.length - 1, i + win); j++) if (!Number.isNaN(a[j])) w.push(a[j]);
    out[i] = w.length ? median(w) : NaN;
  }
  return out;
};

async function analyse(): Promise<Template> {
  const { data, info } = await sharp(readFileSync(FILE)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const at = (x: number, y: number) => { const i = (y * W + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };
  // The printed label is the only saturated area on a neutral photo (white bottle and cap, grey backdrop and shadow).
  const isLabel = (x: number, y: number) => { const [r, g, b] = at(x, y); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx > 0 && (mx - mn) / mx > 0.2; };
  const top = new Float32Array(W).fill(NaN), bot = new Float32Array(W).fill(NaN);
  const yA = Math.round(H * 0.3), yB = Math.round(H * 0.9);
  for (let x = 0; x < W; x++) {
    let t = -1, b = -1;
    for (let y = yA; y < yB; y++) if (isLabel(x, y)) { if (t < 0) t = y; b = y; }
    if (t >= 0 && b - t > H * 0.25) { top[x] = t; bot[x] = b + 1; }
  }
  let x0 = 0; while (Number.isNaN(top[x0])) x0++;
  let x1 = W - 1; while (Number.isNaN(top[x1])) x1--;
  // Smooth the edges (detection is pixel-noisy) with a median, then a light box filter.
  const st = smooth(top, 6), sb = smooth(bot, 6);
  for (let x = x0; x <= x1; x++) { top[x] = st[x]; bot[x] = sb[x]; }
  const cx = (x0 + x1) / 2, R = (x1 - x0) / 2 + 2;
  // Lighting: luminance medians per column and per row inside the label, normalised to the label's overall median.
  const lum = (x: number, y: number) => { const [r, g, b] = at(x, y); return 0.299 * r + 0.587 * g + 0.114 * b; };
  // Only the label's coloured background counts: its printed text is white or pale (low saturation) and is skipped,
  // and so are anti-aliased text edges. Returns NaN for a pixel that isn't background.
  const bgLum = (x: number, y: number) => { const [r, g, b] = at(x, y); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return mx > 0 && (mx - mn) / mx > 0.35 && mx < 200 ? 0.299 * r + 0.587 * g + 0.114 * b : NaN; };
  const colMed = new Float32Array(W).fill(NaN);
  for (let x = x0; x <= x1; x++) {
    const v: number[] = [];
    for (let y = Math.ceil(top[x] + 6); y < bot[x] - 6; y += 2) { const l = bgLum(x, y); if (!Number.isNaN(l)) v.push(l); }
    colMed[x] = v.length > 20 ? median(v) : NaN;
  }
  const centre: number[] = [];
  for (let x = Math.round(cx - R * 0.5); x < cx + R * 0.5; x++) if (!Number.isNaN(colMed[x])) centre.push(colMed[x]);
  const base = median(centre);
  const shadeX = smooth(colMed, 24); // removes the template's own colour edge and text columns
  for (let x = x0; x <= x1; x++) shadeX[x] = Number.isNaN(shadeX[x]) ? 1 : shadeX[x] / base;
  const rowMed = new Float32Array(H).fill(NaN);
  const yTop = Math.round(top[Math.round(cx)]), yBot = Math.round(bot[Math.round(cx)]);
  for (let y = yTop; y < yBot; y++) {
    const v: number[] = [];
    for (let x = Math.round(cx - R * 0.4); x < cx + R * 0.4; x += 2) { const l = bgLum(x, y); if (!Number.isNaN(l)) v.push(l); }
    rowMed[y] = v.length > 20 ? median(v) : NaN;
  }
  const shadeY = smooth(rowMed, 40);
  const rowBase = median(Array.from(shadeY.slice(yTop, yBot)).filter((v) => !Number.isNaN(v)));
  for (let y = 0; y < H; y++) shadeY[y] = Number.isNaN(shadeY[y]) ? 1 : shadeY[y] / rowBase;
  return { W, H, data, x0, x1, cx, R, top, bot, shadeX, shadeY, pxPerUnit: (yBot - yTop) / FRONT.h };
}

const fontFiles = () => {
  const dir = path.join(process.cwd(), 'assets/fonts');
  return readdirSync(dir).filter((f) => f.endsWith('.ttf')).map((f) => path.join(dir, f));
};

// The flat label art (front panel plus the sides), rendered at SCALE px per unit.
function labelArt(p: Product) {
  const w = U1 - U0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${U0} 0 ${w} ${FRONT.h}" width="${w * SCALE}" height="${FRONT.h * SCALE}">
    <rect x="${U0}" y="-5" width="${w}" height="${FRONT.h + 10}" fill="${labelPaper(p)}"/>${frontLabel(p, 'print', 0)}</svg>`;
  const img = new Resvg(svg, { fitTo: { mode: 'width', value: w * SCALE }, font: { fontFiles: fontFiles(), loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render();
  return { px: img.pixels, w: img.width, h: img.height };
}

// Full studio photo (template size) with the product's label. Returns raw RGB.
export async function studioPhotoRaw(p: Product) {
  const t = await (cached ??= analyse());
  const art = labelArt(p);
  const out = Buffer.from(t.data);
  const sample = (u: number, v: number) => {
    // bilinear sample of the label art; u, v in label units
    const fx = (u - U0) * SCALE - 0.5, fy = v * SCALE - 0.5;
    const ix = Math.max(0, Math.min(art.w - 2, Math.floor(fx))), iy = Math.max(0, Math.min(art.h - 2, Math.floor(fy)));
    const ax = Math.min(1, Math.max(0, fx - ix)), ay = Math.min(1, Math.max(0, fy - iy));
    const c = [0, 0, 0];
    for (const [dx, dy, wgt] of [[0, 0, (1 - ax) * (1 - ay)], [1, 0, ax * (1 - ay)], [0, 1, (1 - ax) * ay], [1, 1, ax * ay]] as const) {
      const i = ((iy + dy) * art.w + ix + dx) * 4;
      c[0] += art.px[i] * wgt; c[1] += art.px[i + 1] * wgt; c[2] += art.px[i + 2] * wgt;
    }
    return c;
  };
  for (let x = t.x0; x <= t.x1; x++) {
    const s = Math.max(-0.9999, Math.min(0.9999, (x + 0.5 - t.cx) / t.R));
    const u = FRONT.w / 2 + (t.R * Math.asin(s)) / t.pxPerUnit;
    const top = t.top[x], bot = t.bot[x];
    const kx = t.shadeX[x];
    for (let y = Math.floor(top); y < Math.ceil(bot); y++) {
      const v = ((y + 0.5 - top) / (bot - top)) * FRONT.h;
      const c = sample(u, v);
      // The template's light scales the label's colours, as real light does on a matte print (hue kept, brighter or
      // darker). The vertical profile is flat on this photo, so only the across-the-bottle light is used.
      const k = kx > 1 ? 1 + (kx - 1) * HIGHLIGHT : kx;
      const lit = c.map((ch) => Math.min(255, ch * k));
      // Anti-alias the top and bottom edges against the template (which shows the white bottle beyond the label).
      const cover = Math.min(1, y + 1 - top, bot - y);
      const i = (y * t.W + x) * 3;
      for (let ch = 0; ch < 3; ch++) out[i + ch] = Math.round(lit[ch] * cover + out[i + ch] * (1 - cover));
    }
  }
  return { data: out, width: t.W, height: t.H, box: { x0: t.x0, x1: t.x1 } };
}

// Square product image (PNG). 'front': the whole bottle at ~85% of the height; 'closeup': the label, filling the frame.
export async function studioPhotoPng(p: Product, size = 1000, crop: 'front' | 'closeup' = 'front') {
  const r = await studioPhotoRaw(p);
  const t = await (cached ??= analyse());
  const cxp = (r.box.x0 + r.box.x1) / 2;
  const box =
    crop === 'closeup'
      ? (() => { const side = Math.round((r.box.x1 - r.box.x0) * 1.12); const cy = (t.top[Math.round(t.cx)] + t.bot[Math.round(t.cx)]) / 2; return { left: Math.round(cxp - side / 2), top: Math.round(cy - side / 2), side }; })()
      : (() => { const side = Math.round(r.height * 0.74); return { left: Math.round(cxp - side / 2), top: Math.round(r.height * 0.11), side }; })();
  return sharp(r.data, { raw: { width: r.width, height: r.height, channels: 3 } })
    .extract({ left: Math.max(0, box.left), top: Math.max(0, box.top), width: box.side, height: box.side })
    .resize(size, size)
    .png()
    .toBuffer();
}
