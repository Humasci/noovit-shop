import { Product } from '@/types';

// Particle shapes (3 Nov): symbolic forms built from the same fine glossy beads as the V2 molecules, used in their
// place for three products. Lion's Mane → a brain (focus); Magnesium → a wave-shaped mineral ore (the mineral);
// Creatine → a triple spiral (strength). Each shape is a mask in a 0–1 box returning a shade (or null).

const n = (v: number) => Math.round(v * 100) / 100;
const SPECTRUM = ['#E57AB5', '#33BFA8', '#4C8DE0', '#8C6AD6'];
function seeded(str: string) {
  let h = 2166136261;
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}
function hsl(hex: string) {
  const [r, g, b] = (hex.match(/\w\w/g) ?? []).map((h) => parseInt(h, 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  let h = 0;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [((h * 60) % 360 + 360) % 360, s, l];
}
function tone(hex: string, dl: number) {
  const [h, s, l0] = hsl(hex);
  const l = Math.max(0, Math.min(1, l0 + dl));
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
}

type Mask = (u: number, v: number) => number | null; // shade −1 (deep) … +1 (light)
const inEll = (u: number, v: number, cx: number, cy: number, rx: number, ry: number) => ((u - cx) / rx) ** 2 + ((v - cy) / ry) ** 2;
function segDist(u: number, v: number, a: number[], b: number[]) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy || 1e-9;
  const t = Math.max(0, Math.min(1, ((u - a[0]) * dx + (v - a[1]) * dy) / L));
  return { d: Math.hypot(u - a[0] - dx * t, v - a[1] - dy * t), t };
}

// Brain, side view: cerebrum + cerebellum + brainstem, with folds (gyri) as darker winding lines.
const brain: Mask = (u, v) => {
  const cer = Math.min(inEll(u, v, 0.48, 0.42, 0.4, 0.29), inEll(u, v, 0.28, 0.47, 0.22, 0.24), inEll(u, v, 0.66, 0.46, 0.25, 0.25));
  const cbl = inEll(u, v, 0.66, 0.72, 0.16, 0.1);
  const stem = segDist(u, v, [0.55, 0.66], [0.5, 0.9]).d < 0.05 ? 0.5 : 9;
  const d = Math.min(cer, cbl, stem);
  if (d > 1) return null;
  const rim = 1 - d; // 0 at edge → 1 inside
  if (cer <= 1 && cer <= cbl) {
    const fold = Math.abs(Math.sin(u * 23 + Math.sin(v * 17) * 2.4 + Math.sin(u * 9 + v * 13) * 1.3));
    const lateral = Math.abs(v - (0.47 + (u - 0.45) * 0.25 + Math.sin(u * 9) * 0.02)) < 0.012 && u > 0.18 && u < 0.85; // lateral sulcus
    return lateral || fold < 0.16 ? -0.9 : (0.5 - u) * 0.6 + (0.4 - v) * 0.8 + rim * 0.2;
  }
  if (cbl <= 1) return Math.abs(Math.sin(v * 70)) < 0.25 ? -0.8 : 0.1;
  return -0.2;
};

// Magnesium ore: a dense fan of wavy crystal blades rising from a rocky base (like the "wave" ore specimens).
function oreMask(): Mask {
  const rnd = seeded('magnesium-ore');
  const blades: { pts: number[][]; w: number; light: number }[] = [];
  for (let i = 0; i < 46; i++) {
    const t = i / 45;
    const bx = 0.3 + 0.54 * t + (rnd() - 0.5) * 0.05, by = 0.86 + Math.abs(t - 0.5) * -0.08;
    const ang = (t - 0.5) * 1.25 + (rnd() - 0.5) * 0.3; // fan
    const L = 0.38 + 0.36 * Math.sin(t * Math.PI) * (0.7 + 0.5 * rnd());
    const pts: number[][] = [];
    for (let k = 0; k <= 6; k++) {
      const s = k / 6, wave = Math.sin(s * 3.2 + i * 0.7) * 0.035 * s; // the wave in each blade
      pts.push([bx + Math.sin(ang) * L * s + Math.cos(ang) * wave, by - Math.cos(ang) * L * s + Math.sin(ang) * wave]);
    }
    blades.push({ pts, w: 0.018 + 0.022 * rnd(), light: rnd() });
  }
  return (u, v) => {
    if (inEll(u, v, 0.57, 0.9, 0.29, 0.1) <= 1) return -0.6 + 0.3 * Math.sin(u * 40 + v * 30); // base rock
    let best: number | null = null;
    for (const b of blades) {
      for (let k = 0; k < b.pts.length - 1; k++) {
        const { d, t } = segDist(u, v, b.pts[k], b.pts[k + 1]);
        const s = (k + t) / (b.pts.length - 1);
        const w = b.w * (1 - s * 0.75);
        if (d < w) {
          const side = (d / w) * (k % 2 ? 1 : -1);
          const sh = -0.5 + b.light * 0.9 + s * 0.5 - Math.abs(side) * 0.4;
          best = best === null ? sh : Math.max(best, sh);
        }
      }
    }
    return best;
  };
}

// Triple spiral (triskelion): three arms from the centre, each curling into a spiral.
function triskeleMask(): Mask {
  const paths: number[][][] = [];
  for (let k = 0; k < 3; k++) {
    const th = -Math.PI / 2 + (k * 2 * Math.PI) / 3;
    const C = [0.5 + Math.cos(th) * 0.24, 0.53 + Math.sin(th) * 0.24]; // spiral centre
    const R0 = 0.19, phi0 = th + Math.PI * 0.95;
    const S = [C[0] + R0 * Math.cos(phi0), C[1] + R0 * Math.sin(phi0)];
    const pts: number[][] = [];
    const ctrl = [0.5 + Math.cos(th + 0.9) * 0.1, 0.53 + Math.sin(th + 0.9) * 0.1];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      pts.push([(1 - t) ** 2 * 0.5 + 2 * (1 - t) * t * ctrl[0] + t * t * S[0], (1 - t) ** 2 * 0.53 + 2 * (1 - t) * t * ctrl[1] + t * t * S[1]]);
    }
    for (let i = 1; i <= 60; i++) {
      const t = i / 60, r = R0 * (1 - t * 0.92), phi = phi0 - t * Math.PI * 3.3;
      pts.push([C[0] + r * Math.cos(phi), C[1] + r * Math.sin(phi)]);
    }
    paths.push(pts);
  }
  return (u, v) => {
    let best: number | null = null;
    for (const pts of paths)
      for (let i = 0; i < pts.length - 1; i++) {
        const w = 0.052 - (i / pts.length) * 0.02;
        const { d } = segDist(u, v, pts[i], pts[i + 1]);
        if (d < w) {
          const sh = 0.4 - (d / w) * 0.7 + (0.5 - v) * 0.4;
          best = best === null ? sh : Math.max(best, sh);
        }
      }
    return best;
  };
}

const SHAPES: Record<string, () => Mask> = {
  'lions-mane': () => brain,
  'magnesium-complex': oreMask,
  creatine: triskeleMask,
};
export const hasShape = (slug: string) => slug in SHAPES;

// Fills a square box (x, y, size) with beads in the product colour + brand spectrum; one corner dissolves.
export function particleShape(p: Product, x: number, y: number, size: number, color = p.color, opts: { spectrum?: boolean; disperse?: boolean; bead?: number } = {}) {
  const make = SHAPES[p.slug];
  if (!make) return '';
  const mask = make();
  const rnd = seeded(p.slug + 'beads');
  const bead = opts.bead ?? Math.max(0.6, Math.min(1.3, size / 85));
  const step = bead * 1.9;
  const defs = new Map<string, string>();
  const grad = (c: string) => {
    const id = `ps-${p.slug}-${c.slice(1)}`;
    if (!defs.has(id)) defs.set(id, `<radialGradient id="${id}" cx="0.36" cy="0.32" r="0.72"><stop offset="0" stop-color="${tone(c, 0.24)}"/><stop offset="0.5" stop-color="${c}"/><stop offset="1" stop-color="${tone(c, -0.2)}"/></radialGradient>`);
    return id;
  };
  const beads: string[] = [];
  const loose: string[] = [];
  for (let py = y; py < y + size; py += step * 0.87)
    for (let px = x; px < x + size; px += step) {
      const bx = px + (rnd() - 0.5) * step * 0.6, by = py + (rnd() - 0.5) * step * 0.6;
      const u = (bx - x) / size, v = (by - y) / size;
      const sh = mask(u, v);
      if (sh === null) continue;
      const base = opts.spectrum && rnd() > 0.55 ? SPECTRUM[Math.floor(rnd() * SPECTRUM.length)] : color;
      const c = tone(base, Math.max(-0.32, Math.min(0.22, sh * (sh < 0 ? 0.32 : 0.18) + (rnd() - 0.5) * 0.08)));
      let cx = bx, cy = by;
      // Dissolve: beads near the top-right corner drift outwards.
      if (opts.disperse) {
        const k = u * 0.6 + (1 - v) * 0.6 - 0.85;
        if (k > 0 && rnd() < k * 2.2) { const d = rnd() * size * 0.18 * k * 3; cx += d * 0.8; cy -= d * 0.6; }
      }
      beads.push(`<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(bead * (0.75 + 0.45 * rnd()))}" fill="url(#${grad(c)})"/>`);
    }
  if (opts.disperse)
    for (let i = 0; i < 26; i++) {
      const t = rnd();
      const c = opts.spectrum && rnd() > 0.5 ? SPECTRUM[Math.floor(rnd() * SPECTRUM.length)] : color;
      loose.push(`<circle cx="${n(x + size * (0.78 + t * 0.32))}" cy="${n(y + size * (0.22 - t * 0.28) + (rnd() - 0.5) * size * 0.12)}" r="${n(bead * (0.5 + 0.6 * rnd()) * (1 - t * 0.5))}" fill="url(#${grad(c)})" opacity="${n(0.5 + 0.5 * (1 - t))}"/>`);
    }
  return `<g><defs>${[...defs.values()].join('')}</defs>${loose.join('')}${beads.join('')}</g>`;
}
