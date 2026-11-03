import { Product } from '@/types';
import SKELETONS from '@/data/skeletons.json';

// Particle illustrations (3 Nov): each product's subject drawn from thousands of fine beads inside the same
// square-ish block in the label's top-right corner (bleeding off the top and right edges, ragged inner edges).
//   magnesium-complex → mineral crystal cluster      ashwagandha → the plant with its roots visible
//   lions-mane → the mushroom with hanging spines     creatine → molecular structure (+ faint lattice)
//   coq10 → molecular structure coiled in a spiral    turmeric-complex → the rhizome (root)
// Shapes are simple primitives in a 0–1 box; beads take the top-most shape's tone with soft directional light.

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

// ---------- primitives (unit box, v grows downwards) ----------
type Pt = [number, number];
interface Shape { hit: (u: number, v: number) => number | null; dh: number; dl: number } // hit → extra lightness (shading) or null
const poly = (pts: Pt[], dh: number, dl: number): Shape => ({
  dh, dl,
  hit: (u, v) => {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if (yi > v !== yj > v && u < ((xj - xi) * (v - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside ? 0 : null;
  },
});
// Tapered capsule from a (radius ra) to b (radius rb); `rings` darkens bands along it (turmeric).
const cap = (a: Pt, b: Pt, ra: number, rb: number, dh: number, dl: number, rings = 0): Shape => ({
  dh, dl,
  hit: (u, v) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1e-9;
    const t = Math.max(0, Math.min(1, ((u - a[0]) * dx + (v - a[1]) * dy) / L2));
    const px = a[0] + dx * t, py = a[1] + dy * t, r = ra + (rb - ra) * t;
    const d = Math.hypot(u - px, v - py);
    if (d > r) return null;
    // Round-body shading: lighter on the upper-left side of the stroke.
    const side = ((u - px) * -0.7 + (v - py) * -0.7) / (r || 1);
    let sh = side * 0.08 - (d / r) ** 2 * 0.06;
    if (rings && (t * rings) % 1 < 0.14) sh -= 0.12;
    return sh;
  },
});
const ell = (c: Pt, rx: number, ry: number, rot: number, dh: number, dl: number, vein = false): Shape => ({
  dh, dl,
  hit: (u, v) => {
    const cs = Math.cos(rot), sn = Math.sin(rot);
    const x = ((u - c[0]) * cs + (v - c[1]) * sn) / rx, y = (-(u - c[0]) * sn + (v - c[1]) * cs) / ry;
    const d = x * x + y * y;
    if (d > 1) return null;
    let sh = (-x * 0.6 - y * 0.6) * 0.07 - d * 0.05;
    if (vein && Math.abs(y) < 0.09 && Math.abs(x) < 0.85) sh -= 0.14; // midrib
    return sh;
  },
});

// ---------- subjects ----------
function crystal(): Shape[] {
  const out: Shape[] = [];
  // [base u, base v, angle (rad, 0 = up), length, width, depth tone]
  const prisms: [number, number, number, number, number, number][] = [
    [0.36, 0.9, -0.62, 0.38, 0.1, -0.08], [0.72, 0.9, 0.7, 0.36, 0.1, -0.08], [0.5, 0.92, 0.32, 0.5, 0.12, -0.03],
    [0.44, 0.92, -0.25, 0.62, 0.15, 0], [0.62, 0.93, 0.08, 0.72, 0.17, 0.03], [0.3, 0.94, -1.0, 0.3, 0.09, 0], [0.82, 0.95, 1.05, 0.28, 0.08, 0],
  ];
  for (const [bu, bv, a, L, w, d] of prisms) {
    const dx = Math.sin(a), dy = -Math.cos(a), nx = Math.cos(a), ny = Math.sin(a);
    const B: Pt = [bu, bv], T: Pt = [bu + dx * L, bv + dy * L], tip: Pt = [T[0] + dx * w * 0.95, T[1] + dy * w * 0.95];
    const off = (p: Pt, k: number): Pt => [p[0] + nx * w * k, p[1] + ny * w * k];
    out.push(poly([off(B, -0.5), B, T, off(T, -0.5)], -6, -0.12 + d));
    out.push(poly([B, off(B, 0.5), off(T, 0.5), T], 4, 0.08 + d));
    out.push(poly([off(T, -0.5), T, tip], -4, 0.06 + d));
    out.push(poly([T, off(T, 0.5), tip], 6, 0.2 + d));
  }
  return out;
}
function ashwagandha(): Shape[] {
  const root = (a: Pt, b: Pt, ra: number, rb: number) => cap(a, b, ra, rb, 22, 0.14);
  const leaf = (c: Pt, rot: number, s = 1) => ell(c, 0.15 * s, 0.062 * s, rot, -8, -0.04, true);
  const berry = (c: Pt, s = 1) => [ell(c, 0.05 * s, 0.056 * s, 0, 14, 0.14), ell([c[0], c[1] + 0.008], 0.028 * s, 0.028 * s, 0, -16, -0.08)];
  return [
    // roots below the crown (v ≈ 0.55): the thick, tapering taproot ashwagandha is known for
    root([0.5, 0.54], [0.46, 0.99], 0.06, 0.012), root([0.49, 0.64], [0.24, 0.9], 0.03, 0.007), root([0.51, 0.66], [0.76, 0.93], 0.028, 0.007),
    root([0.47, 0.76], [0.34, 0.98], 0.02, 0.005), root([0.36, 0.76], [0.16, 0.82], 0.012, 0.004), root([0.62, 0.78], [0.84, 0.82], 0.012, 0.004),
    root([0.48, 0.86], [0.6, 0.99], 0.012, 0.004),
    // stem and branches
    cap([0.5, 0.56], [0.5, 0.06], 0.02, 0.009, -10, -0.12), cap([0.5, 0.42], [0.24, 0.26], 0.012, 0.006, -10, -0.12), cap([0.5, 0.3], [0.78, 0.15], 0.012, 0.006, -10, -0.12),
    leaf([0.18, 0.2], -0.55), leaf([0.28, 0.42], 0.4, 0.9), leaf([0.84, 0.1], 0.55), leaf([0.74, 0.34], -0.45, 0.95), leaf([0.38, 0.1], -1.05, 0.85), leaf([0.62, 0.03], 1.1, 0.7),
    ...berry([0.6, 0.45]), ...berry([0.38, 0.5], 0.9), ...berry([0.64, 0.23], 0.85),
  ];
}
function lionsMane(): Shape[] {
  const out: Shape[] = [];
  // Long, fine, cascading spines hanging from a rounded crown: the shaggy "pom-pom" lion's mane is known for.
  const rnd = seeded('lions-mane-spines');
  const cx = 0.5, cy = 0.28, rx = 0.4, ry = 0.24;
  for (let i = 0; i < 64; i++) {
    const t = i / 63, u = cx - rx * 0.96 + 2 * rx * 0.96 * t + (rnd() - 0.5) * 0.01;
    const k = (u - cx) / rx;
    const top = cy + ry * Math.sqrt(Math.max(0, 1 - k * k)) * 0.55;
    const L = (0.08 + 0.5 * Math.max(0, 1 - k * k) ** 1.4) * (0.7 + 0.5 * rnd()); // rounded, teardrop-like cascade
    out.push(cap([u, top], [u + k * 0.03 + (rnd() - 0.5) * 0.02, top + L], 0.012, 0.003, (rnd() - 0.5) * 12, (rnd() - 0.5) * 0.12 + (i % 2 ? 0.05 : -0.05)));
  }
  // Short spines all over the crown, then the crown itself underneath them.
  for (let i = 0; i < 40; i++) {
    const a = Math.PI * (1.05 + 0.9 * rnd()), r = 0.6 + 0.4 * rnd();
    const u = cx + Math.cos(a) * rx * r, v = cy + Math.sin(a) * ry * r;
    out.push(cap([u, v], [u + (rnd() - 0.5) * 0.02, v + 0.06 + 0.05 * rnd()], 0.01, 0.003, (rnd() - 0.5) * 10, 0.12 + (rnd() - 0.5) * 0.1));
  }
  out.splice(64, 0, ell([cx, cy], rx, ry, 0, 6, 0.1));
  return out;
}
function turmeric(): Shape[] {
  const body = (a: Pt, b: Pt, ra: number, rb: number) => cap(a, b, ra, rb, 0, 0.02, 7);
  const out: Shape[] = [];
  const rnd = seeded('turmeric-hairs');
  for (let i = 0; i < 9; i++) { const u = 0.25 + 0.55 * rnd(); out.push(cap([u, 0.62], [u + (rnd() - 0.5) * 0.1, 0.78 + 0.15 * rnd()], 0.006, 0.002, 18, 0.12)); }
  out.push(
    body([0.32, 0.56], [0.24, 0.22], 0.06, 0.04), body([0.56, 0.52], [0.66, 0.16], 0.065, 0.045), body([0.72, 0.52], [0.93, 0.34], 0.055, 0.04),
    body([0.44, 0.6], [0.4, 0.86], 0.05, 0.035), body([0.66, 0.58], [0.76, 0.84], 0.05, 0.035),
    body([0.12, 0.62], [0.88, 0.5], 0.1, 0.08), // the main rhizome on top
    cap([0.24, 0.22], [0.2, 0.08], 0.018, 0.006, -40, -0.05), cap([0.66, 0.16], [0.7, 0.03], 0.018, 0.006, -40, -0.05), // shoots
  );
  return out;
}
type Skel = { atoms: [string, number, number][]; bonds: [number, number, number][] };
function skeleton(sk: Skel, box: [number, number, number], atomR: number, bondR: number, dl = 0): Shape[] {
  const [ox, oy, sc] = box;
  const P = sk.atoms.map(([, x, y]) => [ox + (x - 0.5) * sc + 0.5, oy + (y - 0.5) * sc + 0.5] as Pt);
  const out: Shape[] = [];
  for (const [a, b, order] of sk.bonds) {
    out.push(cap(P[a], P[b], bondR, bondR, 0, 0.14 + dl));
    if (order === 2) {
      const dx = P[b][0] - P[a][0], dy = P[b][1] - P[a][1], L = Math.hypot(dx, dy) || 1, k = bondR * 2.6;
      out.push(cap([P[a][0] - (dy / L) * k, P[a][1] + (dx / L) * k], [P[b][0] - (dy / L) * k, P[b][1] + (dx / L) * k], bondR * 0.8, bondR * 0.8, 0, 0.2 + dl));
    }
  }
  sk.atoms.forEach(([e], i) => {
    if (e === 'C') out.push(ell(P[i], atomR * 0.7, atomR * 0.7, 0, 0, -0.04 + dl));
    else out.push(ell(P[i], atomR, atomR, 0, e === 'O' ? -30 : 34, (e === 'O' ? 0.06 : 0.02) + dl));
  });
  return out;
}
function subject(slug: string): Shape[] | null {
  const S = SKELETONS as unknown as Record<string, Skel>;
  switch (slug) {
    case 'magnesium-complex': return crystal();
    case 'ashwagandha': return ashwagandha();
    case 'lions-mane': return lionsMane();
    case 'turmeric-complex': return turmeric();
    case 'creatine': return [
      ...skeleton(S.creatine, [-0.28, -0.3, 0.32], 0.04, 0.012, 0.18), ...skeleton(S.creatine, [0.3, 0.32, 0.28], 0.035, 0.011, 0.18),
      ...skeleton(S.creatine, [0.02, 0.04, 0.78], 0.055, 0.016),
    ];
    case 'coq10': return skeleton(S.coq10, [0.02, 0.02, 0.92], 0.024, 0.008);
    default: return null;
  }
}
export const hasIllustration = (slug: string) => subject(slug) !== null;

// The block: (x0, y0)–(x1, y1) in label units; the subject is fitted into its inner square.
export function illustrationField(p: Product, x0: number, y0: number, x1: number, y1: number, color = p.color) {
  const shapes = subject(p.slug);
  if (!shapes) return '';
  const rnd = seeded(p.slug + 'illu');
  const wave = (t: number, seed: number) => Math.sin(t * 0.09 + seed) * 6 + Math.sin(t * 0.23 + seed * 2.1) * 3.5 + Math.sin(t * 0.51 + seed * 3.7) * 1.8;
  const sL = rnd() * 10, sB = rnd() * 10;
  const mask = (x: number, y: number) => {
    const dl = x - (x0 + 6 + wave(y, sL)), db = y1 - 6 + wave(x, sB) - y;
    if (dl > 0 && db > 0) return Math.min(1, Math.min(dl, db) / 7);
    return Math.min(dl, db) > -9 && rnd() < 0.05 ? 0.4 : 0;
  };
  // Subject box: a square inset in the visible block (the top edge bleeds, so keep clear of it).
  const side = Math.min(x1 - x0 - 16, y1 - Math.max(y0, 0) - 10);
  const bx = x0 + (x1 - x0 - side) / 2 + 4, by = Math.max(y0, 0) + (y1 - Math.max(y0, 0) - side) / 2 - 1;
  const ground = tone(color, -16, 0.36, -0.1);
  const defs = new Map<string, string>();
  const grad = (c: string) => {
    const id = `il-${p.slug}-${c.slice(1)}`.replace(/[^\w-]/g, '');
    if (!defs.has(id)) defs.set(id, `<radialGradient id="${id}" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="${tone(c, 0, 0.2)}"/><stop offset="0.55" stop-color="${c}"/><stop offset="1" stop-color="${tone(c, 0, -0.18, 0.04)}"/></radialGradient>`);
    return id;
  };
  const back: string[] = [], front: string[] = [];
  const step = 2.1;
  for (let y = y0 - 4; y < y1 + 12; y += step * 0.87)
    for (let x = x0 - 12; x < x1 + 4; x += step) {
      const px = x + (rnd() - 0.5) * 1.2, py = y + (rnd() - 0.5) * 1.2;
      const u = (px - bx) / side, v = (py - by) / side;
      let hit: { s: Shape; sh: number } | null = null;
      if (u > -0.05 && u < 1.05 && v > -0.05 && v < 1.05)
        for (let k = shapes.length - 1; k >= 0 && !hit; k--) { const sh = shapes[k].hit(u, v); if (sh !== null) hit = { s: shapes[k], sh }; }
      if (hit) {
        const light = (0.5 - u) * 0.08 + (0.5 - v) * 0.05; // overall light from the upper left
        const c = tone(color, hit.s.dh + (rnd() - 0.5) * 6, hit.s.dl + hit.sh + light + (rnd() - 0.5) * 0.05);
        front.push(`<circle cx="${n(px)}" cy="${n(py)}" r="${n(0.78 + 0.42 * rnd())}" fill="url(#${grad(c)})"/>`);
        continue;
      }
      const m = mask(px, py);
      if (m > 0 && rnd() < 0.3 + 0.45 * m)
        back.push(`<circle cx="${n(px)}" cy="${n(py)}" r="${n((0.6 + 0.4 * rnd()) * (0.6 + 0.4 * m))}" fill="${ground}" fill-opacity="${n(0.45 + 0.4 * m)}"/>`);
    }
  // Accent: one orange bead, as in the logo's cross.
  front.push(`<circle cx="${n(bx + side * 0.92)}" cy="${n(by + side * 0.9)}" r="1.4" fill="#ff7a2b"/>`);
  return `<g><defs>${[...defs.values()].join('')}</defs>${back.join('')}${front.join('')}</g>`;
}
