import { Product } from '@/types';
import MOLECULES from '@/data/molecules.json';
import SKELETONS from '@/data/skeletons.json';


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

// Brand spectrum for the 'spectrum' palette: glossy pink, teal, blue and violet, with the product colour leading.
const SPECTRUM = ['#E57AB5', '#33BFA8', '#4C8DE0', '#8C6AD6'];
export interface MoleculeOpts { palette?: 'family' | 'spectrum'; disperse?: boolean }

// Draws the molecule centred on (cx, cy) inside a width × height box. Each atom is built from many small beads
// on its visible surface (the "made of particles" look), not one big ball. Long molecules (CoQ10, curcumin) are
// bent into an arc so they read as a shape rather than a stick; tiny ones (creatine, Mg bisglycinate) appear as a
// small cluster of copies at different depths. `disperse`: one end dissolves into loose beads drifting away.
export function moleculeArt(p: Product, cx: number, cy: number, height: number, width: number, color = p.color, opts: MoleculeOpts = {}) {
  const atoms = DATA[p.slug];
  if (!atoms) return '';
  const rnd = seeded(p.slug + 'mol');
  const { q, e1, e2, e3 } = axes(atoms.map((a) => [a[1], a[2], a[3]]));
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  // Local frame: y = longest axis. Bend long molecules round an arc (up to ~220°).
  let local = q.map((v) => [dot(v, e2), dot(v, e1), dot(v, e3)]);
  const len = Math.max(...local.map((v) => v[1])) - Math.min(...local.map((v) => v[1]));
  const thick = (Math.max(...local.map((v) => v[0])) - Math.min(...local.map((v) => v[0]))) || 1;
  const aspect = len / thick;
  if (aspect > 2.2) {
    const sweep = Math.min(3.8, (aspect - 1.6) * 0.75);
    const Rb = len / sweep;
    const yMid = (Math.max(...local.map((v) => v[1])) + Math.min(...local.map((v) => v[1]))) / 2;
    local = local.map(([x, y, z]) => {
      const t = (y - yMid) / Rb;
      return [(Rb + x) * Math.cos(t) - Rb, (Rb + x) * Math.sin(t), z + 0.6 * Math.sin(t * 1.7)];
    });
  }
  const view = (tx: number, ty: number, rz: number) =>
    local.map(([x0, y0, z0]) => {
      let x = x0, y = y0, z = z0;
      [y, z] = [y * Math.cos(tx) - z * Math.sin(tx), y * Math.sin(tx) + z * Math.cos(tx)];
      [x, z] = [x * Math.cos(ty) + z * Math.sin(ty), -x * Math.sin(ty) + z * Math.cos(ty)];
      [x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)];
      return [x, y, z];
    });
  const span = Math.max(...local.map((v) => Math.hypot(...v))) * 2;
  const copies = atoms.length < 30
    ? [{ tx: 0.4, ty: 0.3, rz: -0.6, dx: 0.1, dy: 0.15, sc: 1, dz: 0 }, { tx: 1.3, ty: -0.6, rz: 0.9, dx: -0.42, dy: -0.5, sc: 0.72, dz: -6 }, { tx: -0.7, ty: 1.1, rz: 2.2, dx: 0.48, dy: -0.62, sc: 0.58, dz: -10 }]
    : [{ tx: 0.42, ty: 0.32, rz: aspect > 2.2 ? 0.25 : -0.62, dx: 0, dy: 0, sc: 1, dz: 0 }];
  const el: string[] = [], P: number[][] = [], R: number[] = [];
  for (const c of copies) {
    view(c.tx, c.ty, c.rz).forEach(([x, y, z], i) => {
      el.push(atoms[i][0]);
      P.push([x * c.sc + c.dx * span, y * c.sc + c.dy * span, z * c.sc + c.dz]);
      R.push((RADIUS[atoms[i][0]] ?? 1.7) * 0.9 * c.sc);
    });
  }
  const ext = (k: number) => [Math.min(...P.map((pt, i) => pt[k] - R[i])), Math.max(...P.map((pt, i) => pt[k] + R[i]))];
  const [x0, x1] = ext(0), [y0, y1] = ext(1), [z0, z1] = ext(2);
  const s = Math.min(height / (y1 - y0), width / (x1 - x0));
  // Screen space; z kept in the same units for occlusion, and as 0..1 depth for shading.
  const S = P.map(([x, y, z]) => [cx + (x - (x0 + x1) / 2) * s, cy + (y - (y0 + y1) / 2) * s, (z - z0) * s]);
  const rad = R.map((v) => v * s);
  const zMax = (z1 - z0) * s || 1;

  const base: Record<string, string> = {
    C: tone(color, 0, 0.04),
    O: tone(color, -26, 0.16, 0.05),
    N: tone(color, 28, 0.08),
    H: tone(color, -8, 0.3, -0.15),
    Mg: '#ff7a2b',
    S: tone(color, 60, 0.1),
  };
  const defs: string[] = [];
  const grads = new Set<string>();
  // Bead shading: lit from the upper left; 5 depth buckets so the back of the molecule falls into shadow.
  const beadGrad = (c: string, depth: number) => {
    const b = Math.max(0, Math.min(4, Math.floor(depth * 5)));
    const id = `mb-${p.slug}-${c.slice(1)}-${b}`.replace(/[^\w-]/g, '');
    if (!grads.has(id)) {
      grads.add(id);
      const cc = tone(c, 0, -0.18 * (4 - b) / 4, -0.08 * (4 - b) / 4);
      defs.push(`<radialGradient id="${id}" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="${tone(cc, 0, 0.26)}"/><stop offset="0.5" stop-color="${cc}"/><stop offset="1" stop-color="${tone(cc, 0, -0.22, 0.05)}"/></radialGradient>`);
    }
    return id;
  };
  const pick = seeded(p.slug + 'hue');
  const bead = Math.max(0.75, Math.min(1.35, Math.min(width, height) / 70)); // bead radius in label units
  type B = { x: number; y: number; z: number; r: number; c: string };
  const beads: B[] = [];
  for (let i = 0; i < S.length; i++) {
    const [ax, ay, az] = S[i];
    const rr = rad[i];
    const count = Math.max(3, Math.min(60, Math.round(((rr * rr) / (bead * bead)) * 1.5)));
    for (let k = 0; k < count; k++) {
      // Random direction on the hemisphere facing the viewer.
      const u = rnd(), v = rnd();
      const th = 2 * Math.PI * u, ph = Math.acos(v);
      const dx = Math.sin(ph) * Math.cos(th), dy = Math.sin(ph) * Math.sin(th), dz = Math.cos(ph);
      const bx = ax + dx * rr * 0.9, by = ay + dy * rr * 0.9, bz = az + dz * rr * 0.9;
      let hidden = false;
      for (let j = 0; j < S.length && !hidden; j++) {
        if (j === i) continue;
        const ddx = bx - S[j][0], ddy = by - S[j][1], ddz = bz - S[j][2];
        if (ddx * ddx + ddy * ddy + ddz * ddz < (rad[j] * 0.88) ** 2) hidden = true;
      }
      if (hidden) continue;
      const e = el[i];
      const c = opts.palette === 'spectrum'
        ? (e === 'H' ? tone(color, 0, 0.3, -0.2) : pick() < 0.45 ? color : SPECTRUM[Math.floor(pick() * SPECTRUM.length)])
        : tone(base[e] ?? color, (pick() - 0.5) * 8, (pick() - 0.5) * 0.08);
      beads.push({ x: bx, y: by, z: bz, r: bead * (0.75 + 0.5 * rnd()) * (0.85 + 0.3 * (az / zMax)), c });
    }
  }
  // Dissolve: beads near the far end drift away, and a trail of loose beads continues past it.
  if (opts.disperse) {
    const dr = seeded(p.slug + 'drift');
    const along = (b: B) => (b.x - cx) * 0.7 - (b.y - cy) * 0.7; // up-right
    const vals = beads.map(along);
    const lo = Math.min(...vals), hi = Math.max(...vals);
    beads.forEach((b, i) => {
      const t = (vals[i] - lo) / (hi - lo || 1);
      if (t > 0.65 && dr() < (t - 0.65) * 2.4) { const d = dr() * width * 0.3 * t; b.x += d * 0.8; b.y -= d * 0.6; }
    });
    const tip = beads[vals.indexOf(hi)];
    for (let k = 0; k < 40; k++) {
      const u = dr();
      beads.push({ x: tip.x + u * width * 0.45 + (dr() - 0.5) * 10, y: tip.y - u * height * 0.35 + (dr() - 0.5) * 14, z: dr() * zMax, r: bead * (0.6 + dr() * 0.8) * (1 - u * 0.4), c: beads[Math.floor(dr() * beads.length)].c });
    }
  }
  beads.sort((a, b) => a.z - b.z);
  const out = beads.map((b) => `<circle cx="${n(b.x)}" cy="${n(b.y)}" r="${n(b.r)}" fill="url(#${beadGrad(b.c, b.z / zMax)})"/>`);
  return `<g><defs>${defs.join('')}</defs>${out.join('')}</g>`;
}


// ---------- Molecule field (3 Nov): a square-ish block of fine beads in the label's top-right corner ----------
// The block's outline is the same kind of shape on every product (bleeds off the top and right edges, ragged
// inner edges with a few stray beads), so the range reads as one family. Inside, the product's real molecule
// shows through as denser, deeper beads over a light tinted ground; a few accent beads mark "data points".
export function moleculeField(p: Product, x0: number, y0: number, x1: number, y1: number, color = p.color) {
  const atoms = DATA[p.slug];
  const rnd = seeded(p.slug + 'field');
  // Molecule silhouette laid out inside the block (reuse the bead renderer's geometry via a hidden pass).
  const mol: { x: number; y: number; r: number; z: number }[] = [];
  if (atoms) {
    const w = x1 - x0, h = y1 - y0;
    const svg = moleculeArt(p, x0 + w * 0.56, y0 + h * 0.52, h * 0.8, w * 0.72, color);
    for (const m of svg.matchAll(/<circle cx="([\d.-]+)" cy="([\d.-]+)" r="([\d.]+)" fill="url\(#mb-[^"]*-(\d)\)"/g))
      mol.push({ x: +m[1], y: +m[2], r: +m[3], z: +m[4] / 4 });
  }
  // Ragged edges: smooth noise along the left and bottom boundaries.
  const wave = (t: number, seed: number) => Math.sin(t * 0.09 + seed) * 6 + Math.sin(t * 0.23 + seed * 2.1) * 3.5 + Math.sin(t * 0.51 + seed * 3.7) * 1.8;
  const sL = rnd() * 10, sB = rnd() * 10;
  const inMask = (x: number, y: number) => {
    const left = x0 + 6 + wave(y, sL), bottom = y1 - 6 + wave(x, sB);
    const dl = x - left, db = bottom - y;
    if (dl > 0 && db > 0) return Math.min(1, Math.min(dl, db) / 7); // soft rim
    return Math.min(dl, db) > -9 && rnd() < 0.06 ? 0.4 : 0; // stray beads just outside
  };
  const light = tone(color, -18, 0.3, -0.05);
  const mid = tone(color, 12, 0.14);
  const defs = new Map<string, string>();
  const grad = (c: string) => {
    const id = `mf-${p.slug}-${c.slice(1)}`.replace(/[^\w-]/g, '');
    if (!defs.has(id)) defs.set(id, `<radialGradient id="${id}" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="${tone(c, 0, 0.22)}"/><stop offset="0.55" stop-color="${c}"/><stop offset="1" stop-color="${tone(c, 0, -0.2, 0.05)}"/></radialGradient>`);
    return id;
  };
  const beads: { x: number; y: number; r: number; c: string; o: number; z: number }[] = [];
  const step = 2.5;
  for (let y = y0 - 4; y < y1 + 12; y += step * 0.87)
    for (let x = x0 - 12; x < x1 + 4; x += step) {
      const bx = x + (rnd() - 0.5) * 1.6, by = y + (rnd() - 0.5) * 1.6;
      const m = inMask(bx, by);
      if (m <= 0 || rnd() > 0.35 + 0.6 * m) continue;
      // Inside the molecule silhouette?
      let hit: { z: number } | null = null;
      for (const a of mol) if ((bx - a.x) ** 2 + (by - a.y) ** 2 < (a.r * 1.6) ** 2 && (!hit || a.z > hit.z)) hit = a;
      // Ground colour drifts from a light, cooler tint (top-left) to the product's mid tone (bottom-right).
      const t = Math.max(0, Math.min(1, ((bx - x0) / (x1 - x0)) * 0.5 + ((by - y0) / (y1 - y0)) * 0.5));
      const c = hit ? tone(color, (rnd() - 0.5) * 10, -0.14 * (1 - hit.z) + (rnd() - 0.5) * 0.06) : rnd() < t * 0.7 ? mid : light;
      beads.push({ x: bx, y: by, r: (hit ? 1.05 : 0.8) * (0.75 + 0.5 * rnd()) * (0.6 + 0.4 * m), c, o: hit ? 1 : 0.55 + 0.4 * m, z: hit ? 1 + hit.z : rnd() });
    }
  // Accent "data points": a few small deep beads and one orange, over the lower half of the block.
  const deep = tone(color, 0, -0.3);
  for (let k = 0; k < 14; k++) beads.push({ x: x0 + (x1 - x0) * (0.25 + 0.7 * rnd()), y: y0 + (y1 - y0) * (0.5 + 0.45 * rnd()), r: 0.7 + rnd() * 0.5, c: deep, o: 0.9, z: 3 });
  beads.push({ x: x0 + (x1 - x0) * 0.62, y: y0 + (y1 - y0) * 0.7, r: 1.4, c: '#ff7a2b', o: 1, z: 4 });
  beads.sort((a, b) => a.z - b.z);
  const out = beads.map((b) => `<circle cx="${n(b.x)}" cy="${n(b.y)}" r="${n(b.r)}" fill="url(#${grad(b.c)})"${b.o < 1 ? ` fill-opacity="${n(b.o)}"` : ''}/>`);
  return `<g><defs>${[...defs.values()].join('')}</defs>${out.join('')}</g>`;
}

// ---------- Ball-and-stick in beads (flat 2D layout) ----------
// For molecules people recognise from their textbook shape (curcumin): atoms as glossy beads, bonds as short bead
// chains, double bonds doubled. Data: data/skeletons.json (PubChem 2D, built by scripts/build-skeletons.py).
type Skel2D = { atoms: [string, number, number][]; bonds: [number, number, number][] };
const SK = SKELETONS as unknown as Record<string, Skel2D>;
// Products drawn as ball-and-stick (their textbook 2D shape) instead of the 3D bead cloud.
const BALL_STICK = ['turmeric-complex', 'coq10'];
export const hasBallStick = (slug: string) => BALL_STICK.includes(slug) && !!SK[slug];
export const ballStickArt = (p: Product, cx: number, cy: number, width: number, height: number, color = p.color, opts: BallStickOpts = {}) =>
  ballStick(p.slug, cx, cy, width, height, color, opts);

// Element colours follow the standard CPK convention (O red, N blue, P orange, H white); carbon takes the product
// colour. Atoms are rounded square tiles, the shape of the tiles in the noovit cross: accurate structure, our style.
// `zoom`: a close-up (crop) centred on the oxygens' centroid; the rest of the molecule runs off the edge (clip it).
export interface BallStickOpts { spectrum?: boolean; rotate?: number; oxygen?: string; tiles?: boolean; carbon?: string; zoom?: number }
export function ballStick(key: string, cx: number, cy: number, width: number, height: number, color: string, opts: BallStickOpts = {}) {
  const sk = SK[key];
  if (!sk) return '';
  const rot = opts.rotate ?? -0.42;
  const tiles = opts.tiles ?? true;
  const pts0 = sk.atoms.map(([, x, y]) => [x - 0.5, y - 0.5]);
  const rotd = pts0.map(([x, y]) => [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)]);
  const xs = rotd.map((q) => q[0]), ys = rotd.map((q) => q[1]);
  const sx = Math.max(...xs) - Math.min(...xs) || 1, sy = Math.max(...ys) - Math.min(...ys) || 1;
  let s = Math.min(width / sx, height / sy) * 0.92;
  let mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2;
  if (opts.zoom) {
    const oi = sk.atoms.map((a, i) => (a[0] === 'O' ? i : -1)).filter((i) => i >= 0);
    mx = oi.reduce((t, i) => t + rotd[i][0], 0) / oi.length;
    my = oi.reduce((t, i) => t + rotd[i][1], 0) / oi.length;
    s *= opts.zoom;
  }
  const P = rotd.map(([x, y]) => [cx + (x - mx) * s, cy + (y - my) * s]);
  // Real bond length in this drawing: the median distance between bonded atoms.
  const lens = sk.bonds.map(([a, b]) => Math.hypot(P[a][0] - P[b][0], P[a][1] - P[b][1])).sort((a, b) => a - b);
  const bondLen = lens[Math.floor(lens.length / 2)] || 1;
  const atomR: Record<string, number> = { C: 0.3, O: 0.32, N: 0.31, P: 0.34, H: 0.19 };
  const col = (e: string) => {
    if (e === 'O') return opts.oxygen ?? '#E0443E';
    if (e === 'N') return '#3E6FD8';
    if (e === 'P') return '#F08A24';
    if (e === 'H') return '#EEF0F6';
    return opts.carbon ?? (opts.spectrum ? '#2B2F45' : tone(color, 0, -0.12));
  };
  const defs = new Map<string, string>();
  const g = (c: string) => {
    const id = `bs-${key}-${c.slice(1)}`;
    if (!defs.has(id)) defs.set(id, `<radialGradient id="${id}" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="${tone(c, 0, 0.3)}"/><stop offset="0.5" stop-color="${c}"/><stop offset="1" stop-color="${tone(c, 0, -0.25)}"/></radialGradient>`);
    return `url(#${id})`;
  };
  const out: string[] = [];
  const stickC = opts.spectrum ? '#8A90A8' : tone(color, 0, 0.15, -0.2);
  for (const [a, b, order] of sk.bonds) {
    const [x1, y1] = P[a], [x2, y2] = P[b];
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
    const offs = order === 2 ? [-1, 1] : order === 3 ? [-1, 0, 1] : [0];
    const r = bondLen * (order >= 2 ? 0.07 : 0.09);
    for (const o of offs) {
      const k = steps(L, r * 1.6);
      for (let i = 0; i <= k; i++) {
        const t = i / k;
        out.push(`<circle cx="${n(x1 + (x2 - x1) * t + nx * o * bondLen * 0.11)}" cy="${n(y1 + (y2 - y1) * t + ny * o * bondLen * 0.11)}" r="${n(r)}" fill="${stickC}"/>`);
      }
    }
  }
  sk.atoms.forEach(([e], i) => {
    const r = bondLen * (atomR[e] ?? atomR.C);
    const [x, y] = P[i];
    out.push(tiles
      ? `<rect x="${n(x - r)}" y="${n(y - r)}" width="${n(2 * r)}" height="${n(2 * r)}" rx="${n(r * 0.3)}" fill="${g(col(e))}"/>`
      : `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${g(col(e))}"/>`);
  });
  return `<g><defs>${[...defs.values()].join('')}</defs>${out.join('')}</g>`;
}
const steps = (L: number, d: number) => Math.max(1, Math.round(L / d));
