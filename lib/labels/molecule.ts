import { Product } from '@/types';
import MOLECULES from '@/data/molecules.json';

// Space-filling ("CPK") illustration of each product's key molecule, drawn from real coordinates
// (PubChem 3D conformers; CoQ10 from its 2D layout with added depth; magnesium bisglycinate assembled from
// glycine around Mg). Atoms are shaded spheres in the product's colour family, painted back to front, with a
// fine grain, in the spirit of scientific molecular illustration. Original artwork generated from public data.
//   magnesium-complex → magnesium bisglycinate   ashwagandha → withaferin A (a withanolide)
//   lions-mane → erinacine A   creatine → creatine   coq10 → coenzyme Q10   turmeric-complex → curcumin

type Atom = [string, number, number, number];
const DATA = MOLECULES as unknown as Record<string, Atom[]>;
export const hasMolecule = (slug: string) => !!DATA[slug];

const RADIUS: Record<string, number> = { H: 1.1, C: 1.7, N: 1.55, O: 1.52, Mg: 1.73, S: 1.8 };
const n = (v: number) => Math.round(v * 100) / 100;

function hsl(hex: string) {
  const [r, g, b] = (hex.match(/\w\w/g) ?? []).map((h) => parseInt(h, 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  let h = 0;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [((h * 60) % 360 + 360) % 360, s, l];
}
function toHex(h: number, s: number, l: number) {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
}
const tone = (hex: string, dh: number, dl: number, ds = 0) => {
  const [h, s, l] = hsl(hex);
  return toHex(h + dh, s + ds, l + dl);
};
function seeded(str: string) {
  let h = 2166136261;
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}

// Principal axes (power iteration with deflation) so every molecule is shown along its longest dimension.
function axes(pts: number[][]) {
  const c = [0, 1, 2].map((i) => pts.reduce((s, p) => s + p[i], 0) / pts.length);
  const q = pts.map((p) => p.map((v, i) => v - c[i]));
  const cov = [0, 1, 2].map((i) => [0, 1, 2].map((j) => q.reduce((s, p) => s + p[i] * p[j], 0)));
  const mul = (m: number[][], v: number[]) => m.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
  const norm = (v: number[]) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };
  const eig = (m: number[][]) => { let v = norm([1, 0.7, 0.3]); for (let k = 0; k < 60; k++) v = norm(mul(m, v)); const lam = mul(m, v).reduce((s, x, i) => s + x * v[i], 0); return { v, lam }; };
  const e1 = eig(cov);
  const cov2 = cov.map((r, i) => r.map((x, j) => x - e1.lam * e1.v[i] * e1.v[j]));
  const e2 = eig(cov2).v;
  const e3 = [e1.v[1] * e2[2] - e1.v[2] * e2[1], e1.v[2] * e2[0] - e1.v[0] * e2[2], e1.v[0] * e2[1] - e1.v[1] * e2[0]];
  return { q, e1: e1.v, e2, e3 };
}

// Draws the molecule centred on (cx, cy), its longest axis vertical and fitted to `height`, at most `width` wide.
// Brand spectrum for the 'spectrum' palette: glossy pink, teal, blue and violet, with the product colour leading.
const SPECTRUM = ['#E57AB5', '#33BFA8', '#4C8DE0', '#8C6AD6'];
export interface MoleculeOpts { palette?: 'family' | 'spectrum'; disperse?: boolean }

// Draws the molecule centred on (cx, cy) inside a width × height box, its long axis on a diagonal.
// Small molecules (creatine, magnesium bisglycinate) appear as a few copies at different depths, like a cluster.
// `disperse`: the upper-right end dissolves into loose spheres drifting off round the bottle (away from the text).
export function moleculeArt(p: Product, cx: number, cy: number, height: number, width: number, color = p.color, opts: MoleculeOpts = {}) {
  const atoms = DATA[p.slug];
  if (!atoms) return '';
  const rnd = seeded(p.slug + 'mol');
  const { q, e1, e2, e3 } = axes(atoms.map((a) => [a[1], a[2], a[3]]));
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const project = (tx: number, ty: number, rz: number) =>
    q.map((v) => {
      let x = dot(v, e2), y = dot(v, e1), z = dot(v, e3);
      [y, z] = [y * Math.cos(tx) - z * Math.sin(tx), y * Math.sin(tx) + z * Math.cos(tx)];
      [x, z] = [x * Math.cos(ty) + z * Math.sin(ty), -x * Math.sin(ty) + z * Math.cos(ty)];
      [x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)];
      return [x, y, z];
    });
  const span = Math.max(...q.map((v) => Math.hypot(...v))) * 2;
  const copies = atoms.length < 30
    ? [{ tx: 0.4, ty: 0.3, rz: -0.6, dx: 0.1, dy: 0.15, sc: 1, dz: 0 }, { tx: 1.3, ty: -0.6, rz: 0.9, dx: -0.42, dy: -0.5, sc: 0.72, dz: -6 }, { tx: -0.7, ty: 1.1, rz: 2.2, dx: 0.48, dy: -0.62, sc: 0.58, dz: -10 }]
    : [{ tx: 0.42, ty: 0.32, rz: -0.62, dx: 0, dy: 0, sc: 1, dz: 0 }];
  const el: string[] = [], P: number[][] = [], R: number[] = [];
  for (const c of copies) {
    const pts = project(c.tx, c.ty, c.rz);
    pts.forEach(([x, y, z], i) => {
      el.push(atoms[i][0]);
      P.push([x * c.sc + c.dx * span, y * c.sc + c.dy * span, z * c.sc + c.dz]);
      R.push((RADIUS[atoms[i][0]] ?? 1.7) * 0.9 * c.sc);
    });
  }
  const ext = (k: number) => [Math.min(...P.map((pt, i) => pt[k] - R[i])), Math.max(...P.map((pt, i) => pt[k] + R[i]))];
  const [x0, x1] = ext(0), [y0, y1] = ext(1), [z0, z1] = ext(2);
  const s = Math.min(height / (y1 - y0), width / (x1 - x0));
  let pts = P.map(([x, y, z]) => [cx + (x - (x0 + x1) / 2) * s, cy + (y - (y0 + y1) / 2) * s, (z - z0) / (z1 - z0 || 1)]);
  const rad = R.map((v) => v * s);

  // Element tones in the product's colour family (carbon = the product colour), plus an orange mineral accent.
  const base: Record<string, string> = {
    C: tone(color, 0, 0.05),
    O: tone(color, -26, 0.16, 0.05),
    N: tone(color, 28, 0.08),
    H: tone(color, -8, 0.32, -0.15),
    Mg: '#ff7a2b',
    S: tone(color, 60, 0.1),
  };
  const defs: string[] = [];
  const grads = new Set<string>();
  const grad = (e: string, depth: number) => {
    const b = Math.min(3, Math.floor(depth * 4)); // 4 depth buckets: back atoms darker and flatter
    const id = `mg-${p.slug}-${e}-${b}`.replace(/[^\w-]/g, '');
    if (!grads.has(id)) {
      grads.add(id);
      const c = tone(base[e] ?? color, 0, -0.14 * (3 - b) / 3, -0.1 * (3 - b) / 3);
      defs.push(`<radialGradient id="${id}" cx="0.36" cy="0.3" r="0.75"><stop offset="0" stop-color="${tone(c, 0, 0.2)}"/><stop offset="0.55" stop-color="${c}"/><stop offset="1" stop-color="${tone(c, 0, -0.18, 0.05)}"/></radialGradient>`);
    }
    return id;
  };
  // Glossy gradient for spectrum spheres: bright core, saturated body, deep rim.
  const specGrad = (c: string, depth: number) => {
    const b = Math.min(3, Math.floor(depth * 4));
    const id = `ms-${p.slug}-${c.slice(1)}-${b}`.replace(/[^\w-]/g, '');
    if (!grads.has(id)) {
      grads.add(id);
      const cc = tone(c, 0, -0.1 * (3 - b) / 3);
      defs.push(`<radialGradient id="${id}" cx="0.38" cy="0.32" r="0.72"><stop offset="0" stop-color="${tone(cc, 0, 0.24)}"/><stop offset="0.5" stop-color="${cc}"/><stop offset="1" stop-color="${tone(cc, 0, -0.2, 0.05)}"/></radialGradient>`);
    }
    return id;
  };
  // Spectrum: each atom takes the product colour (about half) or one of the brand hues; hydrogens stay pale.
  const pick = seeded(p.slug + 'hue');
  const hue = el.map((e) => (e === 'H' ? '' : pick() < 0.5 ? color : SPECTRUM[Math.floor(pick() * SPECTRUM.length)]));
  const extra: { x: number; y: number; r: number; c: string; z: number }[] = [];
  if (opts.disperse) {
    const dr = seeded(p.slug + 'drift');
    const along = (x: number, y: number) => (x - cx) * 0.7 - (y - cy) * 0.7; // up-right
    const vals = pts.map(([x, y]) => along(x, y));
    const lo = Math.min(...vals), hi = Math.max(...vals);
    pts = pts.map(([x, y, z], i) => {
      const t = (vals[i] - lo) / (hi - lo || 1);
      if (t > 0.6 && dr() < (t - 0.6) * 2) { const d = dr() * width * 0.35 * t; return [x + d * 0.8, y - d * 0.6, z]; }
      return [x, y, z];
    });
    const tip = pts.reduce((b, pt, i) => (vals[i] > vals[b] ? i : b), 0);
    const loose = 18 + Math.min(24, el.length / 6);
    for (let k = 0; k < loose; k++) {
      const u = dr();
      extra.push({ x: pts[tip][0] + u * width * 0.55 + (dr() - 0.5) * 14, y: pts[tip][1] - u * height * 0.45 + (dr() - 0.5) * 18, r: (0.8 + dr() * 2.2) * (1 - u * 0.5), c: dr() < 0.45 ? color : SPECTRUM[Math.floor(dr() * SPECTRUM.length)], z: dr() });
    }
  }
  const out: string[] = [];
  for (const e of extra.sort((a, b) => a.z - b.z)) {
    out.push(`<circle cx="${n(e.x)}" cy="${n(e.y)}" r="${n(e.r)}" fill="url(#${opts.palette === 'spectrum' ? specGrad(e.c, e.z) : grad('C', e.z)})" fill-opacity="${n(0.5 + 0.5 * e.z)}"/>`);
  }
  const order = pts.map((_, i) => i).sort((a, b) => pts[a][2] - pts[b][2]);
  for (const i of order) {
    const e = el[i];
    const [x, y, z] = pts[i];
    const rr = rad[i];
    const spec = opts.palette === 'spectrum' && hue[i];
    const fill = spec ? `url(#${specGrad(hue[i], z)})` : `url(#${grad(e, z)})`;
    out.push(`<circle cx="${n(x)}" cy="${n(y)}" r="${n(rr)}" fill="${fill}" stroke="${tone(spec ? hue[i] : base[e] ?? color, 0, -0.28)}" stroke-width="${n(Math.max(0.15, rr * 0.05))}" stroke-opacity="0.45"/>`);
    if (spec && rr > 1.6) out.push(`<circle cx="${n(x - rr * 0.32)}" cy="${n(y - rr * 0.36)}" r="${n(rr * 0.2)}" fill="#fff" fill-opacity="0.55"/>`);
    // Grain: a few tiny speckles on the larger atoms (the "molecular surface" texture).
    if (!spec && e !== 'H' && rr > 2.2) {
      for (let k = 0; k < 4; k++) {
        const a = rnd() * Math.PI * 2, d = rr * 0.6 * Math.sqrt(rnd());
        out.push(`<circle cx="${n(x + Math.cos(a) * d)}" cy="${n(y + Math.sin(a) * d)}" r="${n(rr * (0.07 + 0.06 * rnd()))}" fill="${rnd() < 0.5 ? '#fff' : tone(base[e] ?? color, 0, -0.25)}" fill-opacity="${n(0.18 + 0.2 * z)}"/>`);
      }
    }
  }
  return `<g><defs>${defs.join('')}</defs>${out.join('')}</g>`;
}
