// Wrap a flat label around a (tilted) cylinder in a photo, keeping the photo's light and anything skin-coloured in front.
// node wrap.cjs config.json
const sharp = require('/home/user/noovit-shop/node_modules/sharp');
const cfg = require(require('path').resolve(process.argv[2]));
(async () => {
  const img = await sharp(cfg.img).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = img.info.width, H = img.info.height, src = img.data;
  const lab = await sharp(cfg.label).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const LW = lab.info.width, LH = lab.info.height, L = lab.data;
  // blurred luminance of the original (removes the old label's text) for lighting
  const lumBuf = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) lumBuf[i] = Math.round(0.299 * src[i * 3] + 0.587 * src[i * 3 + 1] + 0.114 * src[i * 3 + 2]);
  const bl = await sharp(lumBuf, { raw: { width: W, height: H, channels: 1 } }).median(cfg.median ?? 15).blur(cfg.blur ?? 18).raw().toBuffer({ resolveWithObject: true });
  const bch = bl.info.channels; const blur = { at: (m) => bl.data[m * bch] };
  const a = (cfg.tilt * Math.PI) / 180;
  const ax = [-Math.sin(a), Math.cos(a)], px = [Math.cos(a), Math.sin(a)];
  const [cx, cy] = cfg.top, r = cfg.r, len = cfg.len, bow = cfg.bow ?? 0.12;
  const uC = cfg.uCenter ?? 0.5, uS = cfg.uSpan ?? 0.5;
  const out = Buffer.from(src);
  const orig = Buffer.from(src);
  const jarGate = (m) => { const k = m * 3, R = orig[k], G = orig[k + 1], B = orig[k + 2]; const red = R / (G + 1), lum = 0.299 * R + 0.587 * G + 0.114 * B; const neutral = Math.abs(R - B) < 22 && Math.abs(R - G) < 18 && lum > 90 ? 1 : 0; return Math.max(Math.min(1, Math.max(0, (red - 1.4) / 0.35)), lum < 50 ? 1 : 0, neutral); };
  // reference lighting: median of blurred lum inside the band
  const samples = [];
  const [bx0, by0, bx1, by1] = cfg.box;
  for (let y = by0; y < by1; y += 4) for (let x = bx0; x < bx1; x += 4) {
    const dx = x - cx, dy = y - cy, t = dx * ax[0] + dy * ax[1], s = (dx * px[0] + dy * px[1]) / r;
    if (Math.abs(s) < 0.9 && t > 0 && t < len) samples.push(blur.at(y * W + x));
  }
  samples.sort((p, q) => p - q);
  const med = samples[samples.length >> 1] || 40, hi = samples[Math.floor(samples.length * 0.97)] || med + 40;
  const skin = cfg.strictSkin ? ((R, G, B) => R > 90 && G > 0.5 * R && G < 0.93 * R && B > 0.5 * G && B < G) : (R, G, B) => (R > 90 && G > 40 && B > 20 && R > G && R > B && R - Math.min(G, B) > 18 && Math.abs(R - G) > 12) || (cfg.nails !== false && R > 150 && R >= G && R > B + 8 && G > B);
  const sm = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
  // skin mask, softened
  const sk = Buffer.alloc(W * H);
  for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) { const k = (y * W + x) * 3; if (cfg.autoSkin !== false && skin(src[k], src[k + 1], src[k + 2])) sk[y * W + x] = 255; }
  for (const poly of cfg.keep ?? []) { // extra keep-original polygons (e.g. fingers in shadow)
    for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) { let ins = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins; } if (ins) sk[y * W + x] = 255; }
  }
  const skM = await sharp(sk, { raw: { width: W, height: H, channels: 1 } }).median(cfg.skinMedian ?? 21).raw().toBuffer({ resolveWithObject: true }); const skMono = Buffer.alloc(W * H); for (let i = 0; i < W * H; i++) skMono[i] = skM.data[i * skM.info.channels];
  for (const poly of cfg.keep ?? []) for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) { let ins = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins; } if (ins) skMono[y * W + x] = 255; }
  const skR = await sharp(skMono, { raw: { width: W, height: H, channels: 1 } }).blur(cfg.skinBlur ?? 2.5).raw().toBuffer({ resolveWithObject: true });
  const sch = skR.info.channels; const skB = { at: (m) => skR.data[m * sch] };
  const rAt = (t0) => (cfg.r1 ? r + (cfg.r1 - r) * Math.min(1.2, Math.max(-0.4, t0 / len)) : r);
  if (cfg.jar) { // make the whole container opaque and dark first (translucent jars), keeping highlights
    const J = cfg.jar;
    for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) {
      const dx = x - cx, dy = y - cy, t0 = dx * ax[0] + dy * ax[1], rr = rAt(t0) * (J.grow ?? 1), sv = (dx * px[0] + dy * px[1]) / rr;
      if (Math.abs(sv) >= 1) continue;
      const cc = Math.sqrt(1 - sv * sv);
      if (t0 < J.tStart - (J.capStart ?? J.cap) * rr * cc || t0 > J.tEnd + (J.capEnd ?? J.cap) * rr * cc) continue;
      const k = (y * W + x) * 3, R = src[k], G = src[k + 1], B = src[k + 2];
      let edge = Math.min(1, (1 - Math.abs(sv)) / 0.02);
      if (J.colorGate) { // only jar-coloured pixels (red tint or dark), so the larger outline never darkens skin behind
        const red = R / (G + 1), lum = 0.299 * R + 0.587 * G + 0.114 * B;
        const g = Math.max(Math.min(1, Math.max(0, (red - 1.4) / 0.35)), lum < 50 && t0 <= J.tEnd && t0 >= J.tStart ? 1 : 0, Math.abs(sv) < 0.9 && Math.abs(R - B) < 22 && Math.abs(R - G) < 18 && lum > 90 && t0 > 0 && t0 < len ? 1 : 0);
        edge *= g;
      }
      const l = Math.max(R * 0.35, G, B), v = 0.32 * l + Math.max(0, l - (J.hiFrom ?? 140)) * (J.hiK ?? 1.1);
      const nav = [0.75, 0.85, 1.0];
      for (let ch = 0; ch < 3; ch++) { const nv = Math.min(255, v * nav[ch] + 12); out[k + ch] = Math.round(nv * edge + src[k + ch] * (1 - edge)); src[k + ch] = out[k + ch]; }
    }
  }
  for (let y = by0; y < by1; y++) for (let x = bx0; x < bx1; x++) {
    const dx = x - cx, dy = y - cy;
    const t00 = dx * ax[0] + dy * ax[1], rt = rAt(t00);
    const s = (dx * px[0] + dy * px[1]) / rt;
    if (Math.abs(s) >= 1) continue;
    const c = Math.sqrt(1 - s * s);
    const bw = cfg.bow1 !== undefined ? bow + (cfg.bow1 - bow) * Math.min(1, Math.max(0, t00 / len)) : bow;
    const t = t00 - bw * rt * c;
    const v = t / len;
    if (v < 0 || v > 1) continue;
    const u = uC + (Math.asin(s) / Math.PI) * uS * 2 / 1; // s=±1 -> uC ± uS/2... see below
    const uu = uC + (Math.asin(s) / Math.PI) * uS;
    const fx = uu * (LW - 1), fy = v * (LH - 1);
    if (fx < 0 || fx > LW - 1) continue;
    const x0 = Math.floor(fx), y0 = Math.floor(fy), x1 = Math.min(LW - 1, x0 + 1), y1 = Math.min(LH - 1, y0 + 1), wx = fx - x0, wy = fy - y0;
    const m = y * W + x, k = m * 3;
    const lt = Math.min(med + (cfg.clipHi ?? 20), Math.max(med - (cfg.clipLo ?? 40), blur.at(m))); // old label's whites clipped out
    const hl = cfg.hl ?? { s0: -0.35, w: 0.18, k: 0.18 }; // soft vertical highlight like the photo's own
    const light = (cfg.base ?? 0.8) * (0.5 + 0.5 * c) + (cfg.gain ?? 0.3) * (lt - med) / 255 + hl.k * Math.exp(-(((s - hl.s0) / hl.w) ** 2));
    const spec = 255 * (cfg.specK ?? 0.06) * Math.exp(-(((s - hl.s0) / (hl.w * 0.6)) ** 2));
    const sMax = cfg.sMax ?? 1; const edge = sm(sMax, sMax - 0.015, Math.abs(s)) * sm(0, 0.004, v) * sm(1, 0.996, v);
    const keep = skB.at(m) / 255;
    const alpha = edge * (1 - keep) * (cfg.labelGate && Math.abs(s) > (cfg.gateFrom ?? 0.88) ? jarGate(m) : 1);
    for (let ch = 0; ch < 3; ch++) {
      const val = (L[(y0 * LW + x0) * 3 + ch] * (1 - wx) + L[(y0 * LW + x1) * 3 + ch] * wx) * (1 - wy) + (L[(y1 * LW + x0) * 3 + ch] * (1 - wx) + L[(y1 * LW + x1) * 3 + ch] * wx) * wy;
      const shaded = Math.min(255, Math.max(0, val * light + spec));
      out[k + ch] = Math.round(shaded * alpha + src[k + ch] * (1 - alpha));
    }
  }
  // grain to match the photo
  await sharp(out, { raw: { width: W, height: H, channels: 3 } }).jpeg({ quality: 92 }).toFile(cfg.out);
  if (cfg.preview) await sharp(cfg.out).extract({ left: bx0, top: by0, width: bx1 - bx0, height: by1 - by0 }).resize({ width: 800 }).toFile(cfg.preview);
})();
