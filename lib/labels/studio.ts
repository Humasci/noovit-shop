import 'server-only';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { Product } from '@/types';
import { FRONT, frontLabel, labelPaper } from './svg';

// Studio photo (16 Nov, owner's pick): a photoreal studio shot of our white bottle (assets/mockups/studio-bottle.jpg,
// 2000 × 1493, soft grey backdrop, ribbed cap) with our label wrapped onto it. The template's own label area is
// measured, then replaced pixel by pixel: each pixel maps to a point on the flat label (cylinder unwrap), and the
// template's light and shade are carried over from its label (per-column and per-row medians, so its printed text
// doesn't leak through). The result keeps the photo's real lighting with the approved label artwork exactly.
const FILE = path.join(process.cwd(), 'assets/mockups/studio-bottle.jpg');
const SCALE = 6; // label art render resolution, px per label unit
const U0 = -40, U1 = FRONT.w + 40; // label units rendered (front panel plus the wrap round the sides)
const HIGHLIGHT = 0.6; // share of the template's key-light highlight kept (deep label colours bloom more than its own)
const SHADOW = 0.7; // share of the template's fall-off into shadow kept, so type on the dark side stays readable

type Template = {
  W: number; H: number; data: Buffer;
  x0: number; x1: number; cx: number; R: number;
  top: Float32Array; bot: Float32Array; // label edges per column (NaN outside the label)
  shadeX: Float32Array; shadeY: Float32Array; // lighting ratios
  pxPerUnit: number;
  plate: Float32Array; // the empty studio backdrop (RGB per pixel), estimated from the photo's clean left and right edges
  mask: Float32Array; // 1 inside the bottle (cap, shoulders, body), soft at the edges; used to place it on any backdrop
};

// Site backdrop for product photos (17 Nov, owner: cream, not grey). Sage is the alternative accent.
export const BACKDROP: [number, number, number] = [0xef, 0xe9, 0xdf]; // cream #EFE9DF (CSS --studio)
export const SAGE: [number, number, number] = [0xd9, 0xe0, 0xd2]; // sage #D9E0D2
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
  // Empty backdrop: per row, a quadratic in x fitted to the backdrop on both sides of the bottle (clear of the bottle and
  // its shadow), which captures the studio light's soft centre; then smoothed down the rows.
  // Bottle - plate = the bottle, its label and its shadow alone.
  const leftEnd = Math.max(40, x0 - Math.round(W * 0.04)), rightStart = Math.min(W - 40, x1 + Math.round(W * 0.12));
  const shadowTop = Math.round(bot[Math.round(cx)] - H * 0.12);
  const coef: number[][] = []; // per row: [a, b, c] per channel → 9 numbers
  for (let y = 0; y < H; y++) {
    const xs: number[] = [];
    for (let x = 8; x < leftEnd; x += 6) xs.push(x);
    // Near the base, the right side holds the bottle's cast shadow: fit those rows from the left side only, or the
    // shadow would count as backdrop and vanish once the bottle is placed on another colour.
    if (y < shadowTop) for (let x = rightStart; x < W - 8; x += 6) xs.push(x);
    const row: number[] = [];
    for (let c = 0; c < 3; c++) {
      // least squares for v = a + b·u + c·u², u = x / W
      let s0 = 0, s1 = 0, s2 = 0, s3 = 0, s4 = 0, t0 = 0, t1 = 0, t2 = 0;
      for (const x of xs) { const u = x / W, v = data[(y * W + x) * 3 + c]; s0++; s1 += u; s2 += u * u; s3 += u ** 3; s4 += u ** 4; t0 += v; t1 += v * u; t2 += v * u * u; }
      const M = [[s0, s1, s2], [s1, s2, s3], [s2, s3, s4]], T = [t0, t1, t2];
      const det = (m: number[][]) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
      if (y >= shadowTop) { row.push(t0 / s0, 0, 0); continue; } // one side only: flat backdrop for the row
      const D = det(M);
      for (let k = 0; k < 3; k++) row.push(det(M.map((r, i) => r.map((v, j) => (j === k ? T[i] : v)))) / D);
    }
    coef.push(row);
  }
  const plate = new Float32Array(W * H * 3);
  for (let y = 0; y < H; y++) {
    const acc = new Array(9).fill(0); let nRows = 0;
    for (let j = Math.max(0, y - 12); j <= Math.min(H - 1, y + 12); j++, nRows++) for (let k = 0; k < 9; k++) acc[k] += coef[j][k];
    for (let x = 0; x < W; x++) { const u = x / W; for (let c = 0; c < 3; c++) { const [A, B, C] = acc.slice(c * 3, c * 3 + 3).map((v) => v / nRows); plate[(y * W + x) * 3 + c] = A + B * u + C * u * u; } }
  }
  // Bottle mask, column by column: from the first row that differs from the backdrop (cap or shoulder) down to the
  // base, which follows the label's bottom curve plus the label-to-base distance measured at the centre. Then
  // softened by a small blur so the edge is anti-aliased.
  const plum = (i: number) => 0.299 * plate[i] + 0.587 * plate[i + 1] + 0.114 * plate[i + 2];
  const pix = (i: number) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  const cxi = Math.round(cx);
  let baseC = Math.round(bot[cxi]);
  for (let y = Math.round(bot[cxi]); y < Math.min(H - 1, bot[cxi] + H * 0.2); y++) { const i = (y * W + cxi) * 3; if (pix(i) > plum(i) + 10) baseC = y; }
  const baseOffset = baseC - bot[cxi];
  const hard = new Float32Array(W * H);
  for (let x = Math.max(0, x0 - 6); x <= Math.min(W - 1, x1 + 6); x++) {
    const xe = Math.min(x1, Math.max(x0, x));
    let tp = -1;
    for (let y = Math.round(H * 0.05); y < bot[xe]; y++) { const i = (y * W + x) * 3; if (Math.abs(pix(i) - plum(i)) > 16) { tp = y; break; } }
    if (tp < 0) continue;
    const bt = Math.round(bot[xe] + baseOffset * (0.55 + 0.45 * Math.sqrt(Math.max(0, 1 - ((x - cx) / R) ** 2))));
    // columns just outside the label edge only count where the pixel really differs (the bottle's rounded side)
    for (let y = tp; y <= Math.min(H - 1, bt); y++) {
      if (x < x0 || x > x1) { const i = (y * W + x) * 3; if (Math.abs(pix(i) - plum(i)) <= 12) continue; }
      hard[y * W + x] = 1;
    }
  }
  const mask = new Float32Array(W * H);
  const tmp = new Float32Array(W * H);
  const rad = 2;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let a = 0, n = 0; for (let d = -rad; d <= rad; d++) { const xx = x + d; if (xx >= 0 && xx < W) { a += hard[y * W + xx]; n++; } } tmp[y * W + x] = a / n; }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let a = 0, n = 0; for (let d = -rad; d <= rad; d++) { const yy = y + d; if (yy >= 0 && yy < H) { a += tmp[yy * W + x]; n++; } } mask[y * W + x] = a / n; }
  return { W, H, data, x0, x1, cx, R, top, bot, shadeX, shadeY, pxPerUnit: (yBot - yTop) / FRONT.h, plate, mask };
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
      const k = kx > 1 ? 1 + (kx - 1) * HIGHLIGHT : 1 - (1 - kx) * SHADOW;
      const lit = c.map((ch) => Math.min(255, ch * k));
      // Anti-alias the top and bottom edges against the template (which shows the white bottle beyond the label).
      const cover = Math.min(1, y + 1 - top, bot - y);
      const i = (y * t.W + x) * 3;
      for (let ch = 0; ch < 3; ch++) out[i + ch] = Math.round(lit[ch] * cover + out[i + ch] * (1 - cover));
    }
  }
  return { data: out, width: t.W, height: t.H, box: { x0: t.x0, x1: t.x1 } };
}

// The template was shot on cool grey, so its white plastic reads grey on a warm backdrop. Neutral, light pixels
// (cap, shoulders, base) take the backdrop's light: scaled by backdrop / studio grey, weighted by how neutral and how
// light they are, so the coloured label is untouched.
const STUDIO_GREY = 202;
function warm(r: number, g: number, b: number, bg: [number, number, number]): [number, number, number] {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx ? (mx - mn) / mx : 0;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const w = Math.max(0, 1 - sat * 4) * Math.min(1, Math.max(0, (lum - 70) / 70)) * 0.85;
  const f = (c: number, k: number) => Math.min(255, c * (1 + (bg[k] / STUDIO_GREY - 1) * w));
  return [f(r, 0), f(g, 1), f(b, 2)];
}

// The labelled photo placed on any backdrop colour: the bottle keeps its true colours (mask), and the backdrop takes
// the photo's shadow and soft light as a brightness ratio against the empty studio, so it looks photographed there.
export async function studioOnBackdrop(p: Product, bg: [number, number, number] = BACKDROP) {
  const t = await (cached ??= analyse());
  const r = await studioPhotoRaw(p);
  const out = Buffer.alloc(r.data.length);
  for (let k = 0, m = 0; k < r.data.length; k += 3, m++) {
    const a = t.mask[m];
    const lp = 0.299 * t.plate[k] + 0.587 * t.plate[k + 1] + 0.114 * t.plate[k + 2];
    const li = 0.299 * r.data[k] + 0.587 * r.data[k + 1] + 0.114 * r.data[k + 2];
    const shade = Math.max(0.3, Math.min(1, li / lp));
    const wm = warm(r.data[k], r.data[k + 1], r.data[k + 2], bg);
    for (let c = 0; c < 3; c++) out[k + c] = Math.round(a * wm[c] + (1 - a) * bg[c] * shade);
  }
  return { ...r, data: out };
}

// Square product image (PNG). 'front': the whole bottle at ~85% of the height; 'closeup': the label, filling the frame.
export async function studioPhotoPng(p: Product, size = 1000, crop: 'front' | 'closeup' = 'front', bg: [number, number, number] = BACKDROP) {
  const r = await studioOnBackdrop(p, bg);
  const t = await (cached ??= analyse());
  const cxp = (r.box.x0 + r.box.x1) / 2;
  const box =
    crop === 'closeup'
      ? (() => { const side = Math.round((r.box.x1 - r.box.x0) * 1.12); const cy = (t.top[Math.round(t.cx)] + t.bot[Math.round(t.cx)]) / 2; return { left: Math.round(cxp - side / 2), top: Math.round(cy - side / 2), side }; })()
      : (() => { const side = Math.round(r.height * 0.87); return { left: Math.round(cxp - side / 2), top: Math.round(r.height * 0.075), side }; })();
  return sharp(r.data, { raw: { width: r.width, height: r.height, channels: 3 } })
    .extract({ left: Math.max(0, box.left), top: Math.max(0, box.top), width: box.side, height: box.side })
    .resize(size, size)
    .png()
    .toBuffer();
}

// Group shot: several bottles on one shared backdrop of colour `bg`, as if photographed together. Each bottle is
// placed with its mask (true colours) and its shadow is applied to whatever is already on the canvas, so neighbours'
// shadows overlap naturally and no tile edges show. `size` is each bottle's square crop (same framing as the product
// photo), `step` the distance between bottle centres. Returns a PNG of width × height.
export async function studioGroupPng(products: Product[], width: number, height: number, opts: { size: number; step: number; y: number; bg: [number, number, number] }) {
  const t = await (cached ??= analyse());
  const canvas = new Float32Array(width * height * 3);
  for (let i = 0; i < canvas.length; i++) canvas[i] = opts.bg[i % 3];
  const side = Math.round(t.H * 0.87), top = Math.round(t.H * 0.075);
  const x0 = width / 2 - ((products.length - 1) * opts.step) / 2 - opts.size / 2;
  // Per bottle: the labelled photo, a mask (alpha) and the shadow ratio, packed as RGBA + a grey map, each cut to the
  // product-photo framing and resized together (same pipeline, so they stay aligned).
  const shadeFull = Buffer.alloc(t.W * t.H);
  for (let m = 0, k = 0; m < t.W * t.H; m++, k += 3) {
    const lp = 0.299 * t.plate[k] + 0.587 * t.plate[k + 1] + 0.114 * t.plate[k + 2];
    const li = 0.299 * t.data[k] + 0.587 * t.data[k + 1] + 0.114 * t.data[k + 2];
    shadeFull[m] = Math.round(Math.max(0.3, Math.min(1, li / lp)) * 255);
  }
  const resize = async (buf: Buffer, channels: 1 | 4, left: number) => {
    const { data, info } = await sharp(buf, { raw: { width: t.W, height: t.H, channels } })
      .extract({ left: Math.max(0, left), top, width: side, height: side })
      .resize(opts.size, opts.size)
      .raw()
      .toBuffer({ resolveWithObject: true });
    return { data, ch: info.channels };
  };
  for (const [i, p] of products.entries()) {
    const r = await studioPhotoRaw(p);
    const left = Math.round((r.box.x0 + r.box.x1) / 2 - side / 2);
    const rgba = Buffer.alloc(t.W * t.H * 4);
    for (let m = 0; m < t.W * t.H; m++) {
      rgba[m * 4] = r.data[m * 3]; rgba[m * 4 + 1] = r.data[m * 3 + 1]; rgba[m * 4 + 2] = r.data[m * 3 + 2];
      rgba[m * 4 + 3] = Math.round(t.mask[m] * 255);
    }
    const [px, sh] = await Promise.all([resize(rgba, 4, left), resize(shadeFull, 1, left)]);
    const ox = Math.round(x0 + i * opts.step), oy = Math.round(opts.y);
    for (let yy = 0; yy < opts.size; yy++) {
      const cy = oy + yy; if (cy < 0 || cy >= height) continue;
      for (let xx = 0; xx < opts.size; xx++) {
        const cx = ox + xx; if (cx < 0 || cx >= width) continue;
        const m = yy * opts.size + xx, di = (cy * width + cx) * 3;
        const a = px.data[m * px.ch + 3] / 255;
        const e = Math.min(xx, opts.size - 1 - xx, yy, opts.size - 1 - yy) / (opts.size * 0.06);
        const w = e >= 1 ? 1 : e * e * (3 - 2 * e);
        const shade = 1 - (1 - sh.data[m * sh.ch] / 255) * w;
        const wm = warm(px.data[m * px.ch], px.data[m * px.ch + 1], px.data[m * px.ch + 2], opts.bg);
        for (let c = 0; c < 3; c++) canvas[di + c] = a * wm[c] + (1 - a) * canvas[di + c] * shade;
      }
    }
  }
  const out = Buffer.alloc(width * height * 3);
  for (let k = 0; k < out.length; k++) out[k] = Math.max(0, Math.min(255, Math.round(canvas[k])));
  return sharp(out, { raw: { width, height, channels: 3 } }).png().toBuffer();
}

// The labelled bottle cut out of the studio photo (RGBA, alpha = bottle mask), cropped to the bottle, for scene shots
// composited onto other backgrounds (scripts/scene-shots.ts). Neutral whites are warmed towards `tint`.
export async function studioCutout(p: Product, tint: [number, number, number] = BACKDROP) {
  const t = await (cached ??= analyse());
  const r = await studioPhotoRaw(p);
  let minX = t.W, maxX = 0, minY = t.H, maxY = 0;
  for (let m = 0; m < t.W * t.H; m++) if (t.mask[m] > 0.02) { const x = m % t.W, y = (m / t.W) | 0; if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  // The mask stops at the label's bottom edge; the white base below it is found here: pixels clearly brighter than
  // the empty backdrop (plate), between the bottle's sides, row by row until the base ends.
  const lum = (b: ArrayLike<number>, k: number) => 0.299 * b[k] + 0.587 * b[k + 1] + 0.114 * b[k + 2];
  const base = new Map<number, [number, number]>();
  for (let y = maxY - 4; y < t.H; y++) {
    let l = -1, rr = -1, cnt = 0;
    for (let x = Math.max(0, t.x0 - 4); x <= Math.min(t.W - 1, t.x1 + 4); x++) {
      const k = (y * t.W + x) * 3;
      const d = lum(t.data, k) - lum(t.plate, k);
      if (d > 2.5) { if (l < 0) l = x; rr = x; cnt++; }
    }
    if (cnt < (t.x1 - t.x0) * 0.12) { if (y > maxY + 4) break; continue; } // base ends where bright pixels stop
    base.set(y, [l, rr]);
  }
  // The cap's rounded top rim is also missed by the mask (white on a light backdrop): grow upwards from the mask's top
  // while the row has pixels clearly brighter than the backdrop, and widen the first rows of the cap the same way.
  const capTop = new Map<number, [number, number]>();
  {
    // Full cap width, measured well inside the cap where the mask is solid.
    const origTop = minY;
    let l0 = -1, r0 = -1;
    for (let x = minX; x <= maxX; x++) if (t.mask[(origTop + 30) * t.W + x] > 0.5) { if (l0 < 0) l0 = x; r0 = x; }
    // Top of the cap: the highest row that still has bright (white plastic) pixels over the backdrop.
    let capY = origTop;
    for (let y = origTop + 10; y >= 0; y--) {
      let cnt = 0;
      for (let x = l0; x <= r0; x++) { const k = (y * t.W + x) * 3; if (lum(t.data, k) - lum(t.plate, k) > 3) cnt++; }
      if (cnt < (r0 - l0) * 0.1) break;
      capY = y;
    }
    // Rows from there to 30 px down take the full cap width, with the top corners rounded.
    for (let y = capY; y <= origTop + 30; y++) {
      const k = Math.max(0, capY + 7 - y);
      const inset = Math.round(k * k * 1.2);
      capTop.set(y, [l0 + inset, r0 - inset]);
    }
    minY = Math.min(minY, capY);
  }
  // Fill every row from the label's bottom to the end of the base across the bottle's full width (its shaded right
  // side is darker than the backdrop, so brightness alone would only find the left half), rounding the bottom corners.
  const maskBottom = maxY;
  const baseEnd = Math.max(maxY, ...base.keys());
  base.clear();
  let labelBottomMin = maskBottom; // the label's bottom edge curves up at the sides
  for (let x = t.x0; x <= t.x1; x++) if (t.bot[x] && t.bot[x] < labelBottomMin) labelBottomMin = Math.floor(t.bot[x]);
  for (let y = labelBottomMin - 2; y <= baseEnd; y++) {
    const k = Math.max(0, y - (baseEnd - 12));
    const inset = Math.round((k * k) / 5);
    base.set(y, [t.x0 + inset, t.x1 - inset]);
  }
  maxY = baseEnd;
  const w = maxX - minX + 1, h = maxY - minY + 1;
  // The bottle is convex in every row: fill each row between its outermost solid pixels, so small mask gaps (the
  // ribbed cap's highlights) don't show the new background through.
  const fill = new Float32Array(t.W * t.H);
  for (let y = minY; y <= maxY; y++) {
    let l = -1, r = -1;
    for (let x = minX; x <= maxX; x++) if (t.mask[y * t.W + x] > 0.5) { if (l < 0) l = x; r = x; }
    const b = base.get(y) ?? capTop.get(y);
    if (b) { l = l < 0 ? b[0] : Math.min(l, b[0]); r = Math.max(r, b[1]); }
    for (let x = minX; x <= maxX; x++) { const m = y * t.W + x; fill[m] = l >= 0 && x >= l && x <= r ? 1 : t.mask[m]; }
  }
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const m = (y + minY) * t.W + x + minX, k = m * 3, o = (y * w + x) * 4;
    const wm = warm(r.data[k], r.data[k + 1], r.data[k + 2], tint);
    out[o] = wm[0]; out[o + 1] = wm[1]; out[o + 2] = wm[2]; out[o + 3] = Math.round(fill[m] * 255);
  }
  return { data: out, width: w, height: h };
}

// The backdrop colour behind the bottle in the product photo (mid-height), for pages that place group shots.
export async function studioBackdrop(): Promise<[number, number, number]> {
  return BACKDROP;
}
