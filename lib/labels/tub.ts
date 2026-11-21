import 'server-only';
import path from 'path';
import sharp from 'sharp';

// Owner-supplied tub photos (21 Nov): every creatine product is a powder tub, not a capsule bottle. The owner made
// photoreal tub renders with our labels (assets/mockups/tub-creatine.jpg, single; tub-lineup.jpg, four tubs). Each
// tub is used as a "transmission" map: photo ÷ its own backdrop (estimated per row from the clean left margin). Multiplied
// onto any backdrop colour, the tub keeps its true colours and its soft shadow lands on the new backdrop, so it drops
// into product photos and group shots next to the studio bottles without visible edges.
type TubSrc = { file: string; box: [number, number, number, number]; shadowRight: number; padLeft?: number };
const TUBS: Record<string, TubSrc> = {
  creatine: { file: 'tub-creatine.jpg', box: [673, 289, 1317, 1318], shadowRight: 640 },
  'creatine-for-men': { file: 'tub-lineup.jpg', box: [579, 295, 980, 935], shadowRight: 30 , padLeft: 8 },
  'creatine-for-women': { file: 'tub-lineup.jpg', box: [1015, 296, 1421, 936], shadowRight: 28 , padLeft: 8 },
  'creatine-hydration': { file: 'tub-lineup.jpg', box: [1451, 296, 1861, 935], shadowRight: 120 , padLeft: 8 },
};
export const hasTubPhoto = (slug: string) => slug in TUBS;

type Trans = { T: Float32Array; w: number; h: number; tub: [number, number, number, number] };
const cache = new Map<string, Promise<Trans>>();
const srcCache = new Map<string, Promise<{ data: Buffer; W: number; H: number; C: number; bg: number[][] }>>();

function loadSrc(file: string) {
  if (!srcCache.has(file)) srcCache.set(file, (async () => {
    const { data, info } = await sharp(path.join(process.cwd(), 'assets/mockups', file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = info.width, H = info.height, C = info.channels;
    const bg: number[][] = [];
    for (let y = 0; y < H; y++) { const s = [0, 0, 0]; for (let x = 5; x < 60; x++) for (let c = 0; c < 3; c++) s[c] += data[(y * W + x) * C + c]; bg.push(s.map((v) => v / 55)); }
    return { data, W, H, C, bg };
  })());
  return srcCache.get(file)!;
}

function transmission(slug: string): Promise<Trans> {
  if (!cache.has(slug)) cache.set(slug, (async () => {
    const t = TUBS[slug];
    const s = await loadSrc(t.file);
    const [bx0, by0, bx1, by1] = t.box;
    const TW = bx1 - bx0, TH = by1 - by0, lineup = t.padLeft !== undefined;
    // Window: the tub plus room for its shadow. Line-up tubs get a generated floor shadow (their real shadows run into
    // the neighbouring tubs), so their window can extend past the neighbours: nothing outside the tub is copied.
    const x0 = Math.max(0, bx0 - 40), x1 = lineup ? bx1 + Math.round(TW * 0.9) : Math.min(s.W - 1, bx1 + t.shadowRight);
    const y0 = Math.max(0, by0 - 40), y1 = by1 + 90;
    const w = x1 - x0 + 1, h = y1 - y0 + 1, F = 60;
    const T = new Float32Array(w * h * 3).fill(1);
    // Line-up tubs: the backdrop is measured right beside the tub (the gaps either side, per row, blended across), so
    // backdrop inside the tub's box comes out as "no change" and no rectangle can show. Single photo: left margin.
    const near = (sy: number, xa: number, xb: number) => { const v = [0, 0, 0]; let n = 0; for (let sx = Math.max(0, xa); sx <= Math.min(s.W - 1, xb); sx++) { const i = (sy * s.W + sx) * s.C; for (let c = 0; c < 3; c++) v[c] += s.data[i + c]; n++; } return v.map((q) => q / Math.max(1, n)); };
    const bgL: number[][] = [], bgR: number[][] = [];
    for (let y = 0; y < h; y++) { const sy = Math.min(s.H - 1, y + y0); bgL.push(lineup ? near(sy, bx0 - 22, bx0 - 6) : s.bg[sy]); bgR.push(lineup ? near(sy, bx1 + 6, bx1 + 18) : s.bg[sy]); }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const sx = x + x0, sy = y + y0, o = (y * w + x) * 3;
      const din = Math.min(sx - bx0, bx1 - sx, sy - by0, by1 - sy);
      const inTub = Math.max(0, Math.min(1, (din + 3) / 3));
      const f = Math.max(0, Math.min(1, (sx - bx0) / Math.max(1, bx1 - bx0)));
      const bgp = [0, 1, 2].map((c) => bgL[y][c] * (1 - f) + bgR[y][c] * f);
      let out = [1, 1, 1];
      if (sx < s.W && sy < s.H) {
        const i = (sy * s.W + sx) * s.C;
        const v3 = [0, 1, 2].map((c) => Math.min(1.12, s.data[i + c] / bgp[c]));
        const lum = (v3[0] + v3[1] + v3[2]) / 3, chroma = Math.max(...v3) - Math.min(...v3), mx = Math.max(...v3);
        if (lineup) {
          // How surely this is tub: white plastic (bluer than the warm backdrop, even in shade, or brighter) or label
          // colour; soft thresholds keep the edges anti-aliased. Anything else becomes plain backdrop + a generated soft
          // floor shadow (light from the upper left, so it falls right of the base).
          const ramp = (q: number, a0: number, span: number) => Math.min(1, Math.max(0, (q - a0) / span));
          const sure = Math.max(ramp(v3[2] / v3[0], 1.01, 0.04), ramp(lum, 1.02, 0.04), ramp(chroma, 0.08, 0.06), ramp(0.86 - lum, 0, 0.08)) * inTub; // last: darker than any backdrop shadow
          const dx = (sx - (bx0 + TW * 0.8)) / (TW * 0.55), dy = (sy - (by1 - TH * 0.01)) / (TH * 0.035);
          const sh = 0.2 * Math.exp(-(dx * dx + dy * dy));
          out = v3.map((v) => sure * v + (1 - sure) * (1 - sh));
        } else {
          // Single photo: inside the tub copied as is where clearly tub; other pixels scaled so no channel brightens.
          const tub = lum > 1.04 || chroma > 0.12 ? v3 : v3.map((v) => v / Math.max(1, mx));
          if (inTub > 0) out = tub.map((v, c) => inTub * v + (1 - inTub) * Math.min(1, v3[c]));
          else {
            // its own shadow (darkening only), fading out at the window edge
            const e = Math.min(1, Math.min(x, w - 1 - x, y, h - 1 - y) / F), fe = e * e * (3 - 2 * e);
            out = v3.map((v) => 1 + (Math.min(1, v) - 1) * fe);
          }
        }
      } else if (lineup) {
        const dx = (sx - (bx0 + TW * 0.8)) / (TW * 0.55), dy = (sy - (by1 - TH * 0.01)) / (TH * 0.035);
        out = [1, 1, 1].map(() => 1 - 0.2 * Math.exp(-(dx * dx + dy * dy)));
      }
      T[o] = out[0]; T[o + 1] = out[1]; T[o + 2] = out[2];
    }
    return { T, w, h, tub: [bx0 - x0, by0 - y0, bx1 - x0, by1 - y0] };
  })());
  return cache.get(slug)!;
}

// Multiply the tub onto an RGB float canvas: centred on cx, its base at `bottom`, scaled to `height` px tall.
export async function placeTub(canvas: Float32Array, cw: number, ch: number, slug: string, cx: number, bottom: number, height: number) {
  const tr = await transmission(slug);
  const [tx0, ty0, tx1, ty1] = tr.tub;
  const k = height / (ty1 - ty0); // output px per source px
  const ox = cx - ((tx0 + tx1) / 2) * k, oy = bottom - ty1 * k;
  const X0 = Math.max(0, Math.floor(ox)), X1 = Math.min(cw - 1, Math.ceil(ox + tr.w * k)), Y0 = Math.max(0, Math.floor(oy)), Y1 = Math.min(ch - 1, Math.ceil(oy + tr.h * k));
  for (let y = Y0; y <= Y1; y++) for (let x = X0; x <= X1; x++) {
    const sx = (x + 0.5 - ox) / k - 0.5, sy = (y + 0.5 - oy) / k - 0.5;
    if (sx < 0 || sy < 0 || sx > tr.w - 1 || sy > tr.h - 1) continue;
    const ix = Math.min(tr.w - 2, Math.floor(sx)), iy = Math.min(tr.h - 2, Math.floor(sy)), ax = sx - ix, ay = sy - iy;
    const d = (y * cw + x) * 3;
    for (let c = 0; c < 3; c++) {
      const g = (xx: number, yy: number) => tr.T[(yy * tr.w + xx) * 3 + c];
      const v = (g(ix, iy) * (1 - ax) + g(ix + 1, iy) * ax) * (1 - ay) + (g(ix, iy + 1) * (1 - ax) + g(ix + 1, iy + 1) * ax) * ay;
      canvas[d + c] = Math.min(255, canvas[d + c] * v);
    }
  }
}

// Square product image of a tub on `bg`: 'front' = whole tub at ~78% of the height (it's squat, so a little smaller than
// the bottles' 85% keeps the label readable without crowding); 'closeup' = the label filling the frame.
export async function tubPhotoPng(slug: string, size: number, crop: 'front' | 'closeup', bg: [number, number, number]) {
  const tr = await transmission(slug);
  const [tx0, ty0, tx1, ty1] = tr.tub;
  const tubH = ty1 - ty0, tubW = tx1 - tx0;
  const canvas = new Float32Array(size * size * 3);
  for (let i = 0; i < canvas.length; i++) canvas[i] = bg[i % 3];
  if (crop === 'front') await placeTub(canvas, size, size, slug, size / 2, size * 0.89, size * 0.78);
  else {
    // label band sits from ~20% to ~92% of the tub height; frame its width with a little margin
    const k = size / (tubW * 1.08), h = tubH * k, cyLabel = 0.57;
    await placeTub(canvas, size, size, slug, size / 2, size / 2 + h * (1 - cyLabel), h);
  }
  const out = Buffer.alloc(size * size * 3);
  for (let i = 0; i < out.length; i++) out[i] = Math.round(canvas[i]);
  return sharp(out, { raw: { width: size, height: size, channels: 3 } }).png().toBuffer();
}
