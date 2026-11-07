// Educational infographics in the "molecular city" style (3–4 Nov): a central bead-built illustration, hexagon
// close-ups joined by thin lines, and short captions. Accuracy rules: captions are facts from NIH pages and our
// verified guides (no product claims); every molecule is PubChem's own 2D structure (data/skeletons.json), drawn as
// is or cropped, never bent; schematic parts (cells, fibres, bone) are labelled "illustration, not to scale".
// Writes design/social/infographic-<topic>.png (1800×1200). Usage: npm run infographic
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { Resvg } from '@resvg/resvg-js';
import { SEED_PRODUCTS } from '@/data/products';
import { ballStick } from '@/lib/labels/molecule';
import { particleShape } from '@/lib/labels/shapes';
import { wordmark, wrap } from '@/lib/labels/svg';

const W = 1800, H = 1200;
const NIGHT = '#0B0F2E', MAGENTA = '#C4458F', ROSE = '#E57AB5', CREAM = '#F3E6CF', TEAL = '#2DB6A8', LAV = '#B9A9F2', COBALT = '#3E5BD6', GOLD = '#E8C547';
const n = (v: number) => Math.round(v * 10) / 10;
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const defs: string[] = [];
const grads = new Set<string>();
function bead(c: string) {
  const id = `g${c.slice(1)}`;
  if (!grads.has(id)) {
    grads.add(id);
    defs.push(`<radialGradient id="${id}" cx="0.35" cy="0.3" r="0.75"><stop offset="0" stop-color="#fff" stop-opacity="0.85"/><stop offset="0.45" stop-color="${c}"/><stop offset="1" stop-color="#05071a" stop-opacity="0.9"/></radialGradient>`);
  }
  return `url(#${id})`;
}
const dot = (x: number, y: number, r: number, c: string, o = 1) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${bead(c)}"${o < 1 ? ` opacity="${o}"` : ''}/>`;

// Beads filling an ellipse, lit from the upper left.
function blob(cx: number, cy: number, rx: number, ry: number, cols: string[], r = 4, density = 1, rot = 0) {
  const out: string[] = [];
  const count = Math.round(((rx * ry) / (r * r)) * 0.9 * density);
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd());
    let x = Math.cos(a) * d * rx, y = Math.sin(a) * d * ry;
    [x, y] = [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)];
    out.push(dot(cx + x, cy + y, r * (0.7 + 0.6 * rnd()), cols[Math.floor(rnd() * cols.length)]));
  }
  return out.join('');
}
// A mitochondrion: capsule of magenta beads with lighter folded inner membranes (cristae).
function mito(cx: number, cy: number, len: number, rot: number, r = 3) {
  const out = [blob(cx, cy, len / 2, len / 4.2, [MAGENTA, '#9E2F72', ROSE], r, 1.1, rot)];
  for (let k = -2; k <= 2; k++) {
    const off = (k / 2.6) * (len / 2);
    for (let t = -1; t <= 1; t += 0.12) {
      const x = off + Math.sin(t * 3) * 2, y = t * (len / 4.6) * Math.cos((k / 3) * 1.2);
      out.push(dot(cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot), r * 0.8, '#FFB3D9'));
    }
  }
  return out.join('');
}

// ---- central cell ----
const CX = 900, CY = 640;
function cell() {
  const out: string[] = [];
  out.push(`<ellipse cx="${CX}" cy="${CY}" rx="380" ry="270" fill="url(#mem)" stroke="#AFC2FF" stroke-opacity="0.35" stroke-width="3"/>`);
  for (let i = 0; i < 180; i++) { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * 0.92; out.push(dot(CX + Math.cos(a) * d * 370, CY + Math.sin(a) * d * 260, 1.5 + rnd() * 2, [LAV, COBALT, TEAL][Math.floor(rnd() * 3)], 0.6)); }
  const spots: [number, number, number][] = [[-250, -60, 0.4], [-200, 90, -0.6], [-90, 170, 0.1], [80, 185, -0.3], [220, 120, 0.8], [270, -40, -0.2], [180, -160, 0.5], [-40, -200, -0.1], [-230, -170, 0.9], [300, 60, 1.4], [-300, 40, 1.2], [40, -230, 0.2]];
  for (const [x, y, r] of spots) out.push(mito(CX + x, CY + y, 78 + rnd() * 26, r));
  out.push(blob(CX - 10, CY - 10, 120, 100, [CREAM, '#E9D6B4', '#FFF6E6'], 5, 1.3)); // nucleus
  return out.join('');
}

// ---- hexagon close-ups ----
const hexPath = (cx: number, cy: number, r: number) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 6 + (i * Math.PI) / 3; return `${n(cx + r * Math.cos(a))},${n(cy + r * Math.sin(a))}`; }).join(' ');
function hex(id: string, cx: number, cy: number, inner: string) {
  const r = 108;
  defs.push(`<clipPath id="${id}"><polygon points="${hexPath(cx, cy, r)}"/></clipPath>`);
  return `<g clip-path="url(#${id})"><polygon points="${hexPath(cx, cy, r)}" fill="#141A4D"/>${inner}</g><polygon points="${hexPath(cx, cy, r)}" fill="none" stroke="#fff" stroke-width="4"/>`;
}

// ---- hexagon contents (all drawn in the hexagon's own box, ~210 px across) ----
const mol = (key: string, cx: number, cy: number, w: number, h: number, opts: { rotate?: number; zoom?: number } = {}) =>
  ballStick(key, cx, cy, w, h, '#7FD6CC', { carbon: '#3A4466', rotate: opts.rotate ?? 0, zoom: opts.zoom });
const atpSynthase = (cx: number, cy: number) => {
  const out: string[] = [blob(cx, cy + 55, 70, 10, [LAV, COBALT], 3.5, 1.2)];
  for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2; out.push(blob(cx + Math.cos(a) * 30, cy - 20 + Math.sin(a) * 30, 13, 13, [GOLD, '#F2D97A', '#C9A227'], 3.2)); }
  out.push(blob(cx, cy + 22, 7, 30, [TEAL, '#7FE0D6'], 3, 1.4));
  return out.join('');
};
const bilayer = (cx: number, cy: number) => {
  const out: string[] = [];
  for (let row = 0; row < 2; row++) for (let x = -110; x <= 110; x += 13) {
    const y = cy + (row ? 26 : -26);
    out.push(`<line x1="${cx + x}" y1="${y}" x2="${cx + x}" y2="${cy + (row ? 4 : -4)}" stroke="${LAV}" stroke-width="2" stroke-opacity="0.6"/>`, dot(cx + x, y, 6, row ? COBALT : '#6E7BE8'));
  }
  return out.join('');
};
const miniCells = (cx: number, cy: number) =>
  [[-45, -25, 42], [40, -35, 36], [-10, 40, 46], [60, 40, 30]].map(([x, y, r]) =>
    `<circle cx="${cx + x}" cy="${cy + y}" r="${r}" fill="#24308A" fill-opacity="0.6" stroke="#AFC2FF" stroke-opacity="0.5" stroke-width="2"/>` + blob(cx + x, cy + y, r * 0.45, r * 0.45, [CREAM, '#E9D6B4'], 2.6, 1.2)).join('');
const enzyme = (cx: number, cy: number) => blob(cx, cy, 80, 62, [TEAL, '#1F8C83', LAV, COBALT], 4, 1.2) + dot(cx + 18, cy - 8, 11, '#B9C7D6') + `<circle cx="${cx + 18}" cy="${cy - 8}" r="17" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-dasharray="3 3"/>`;
const fibre = (cx: number, cy: number, w = 200) => {
  const out: string[] = [];
  for (let row = -2; row <= 2; row++) for (let x = -w / 2; x <= w / 2; x += 7) {
    const band = Math.floor((x + w / 2) / 28) % 2;
    out.push(dot(cx + x, cy + row * 15 + Math.sin(x / 30) * 2, 4.2, band ? '#D25A9C' : '#F2B6D4'));
  }
  return out.join('');
};
const bone = (cx: number, cy: number) => {
  const out: string[] = [];
  for (let gy = -3; gy <= 3; gy++) for (let gx = -4; gx <= 4; gx++) {
    const x = cx + gx * 24 + (gy % 2) * 12, y = cy + gy * 21;
    if ((x - cx) ** 2 / 110 ** 2 + (y - cy) ** 2 / 80 ** 2 > 1) continue;
    out.push(`<circle cx="${x}" cy="${y}" r="9" fill="none" stroke="#EFE6D2" stroke-width="5" stroke-opacity="0.85"/>`);
  }
  return out.join('');
};
const brandShape = (slug: string, cx: number, cy: number, size: number) =>
  particleShape(SEED_PRODUCTS.find((p) => p.slug === slug)! as never, cx - size / 2, cy - size / 2, size, '#7FA6D8', { spectrum: true, bead: 2.4 });

// ---- central illustrations ----
function muscle() {
  const out: string[] = [`<ellipse cx="${CX}" cy="${CY}" rx="400" ry="230" fill="url(#mem)" stroke="#AFC2FF" stroke-opacity="0.3" stroke-width="3"/>`];
  for (let k = -2; k <= 2; k++) out.push(fibre(CX, CY + k * 82, 640 - Math.abs(k) * 90));
  for (const [x, y] of [[-200, -42], [120, -40], [-60, 40], [230, 42], [-260, 124], [40, -124]]) out.push(mito(CX + x, CY + y, 60, 0, 2.4));
  return out.join('');
}

// Ashwagandha: a schematic taproot with side roots (pale, as the dried root is) and a few leaves at the crown.
const ROOT = ['#E9D6B4', '#D9C29A', '#F3E6CF', '#C8AE82'], LEAF = ['#3F8F5A', '#6DBE7E', '#2E6B45'];
function strand(p0: number[], p1: number[], p2: number[], w0: number, w1: number, cols: string[], r = 3.4) {
  const out: string[] = [];
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) + Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
  const steps = Math.max(8, Math.round(len / (r * 1.1)));
  for (let s = 0; s <= steps; s++) {
    const t = s / steps, u = 1 - t;
    const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
    const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
    const d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, w = w0 + (w1 - w0) * t;
    const k = Math.max(1, Math.round(w / (r * 1.5)));
    for (let j = 0; j < k; j++) { const o = (rnd() - 0.5) * w; out.push(dot(x + nx * o, y + ny * o, r * (0.75 + 0.5 * rnd()), cols[Math.floor(rnd() * cols.length)])); }
  }
  return out.join('');
}
function root() {
  const out: string[] = [`<ellipse cx="${CX}" cy="${CY + 20}" rx="420" ry="300" fill="url(#mem)" fill-opacity="0.55"/>`];
  for (const [a, l] of [[-2.25, 115], [-1.8, 150], [-1.3, 140], [-0.85, 110]]) {
    const ex = CX + Math.cos(a) * l, ey = 410 + Math.sin(a) * l;
    out.push(strand([CX, 410], [CX + Math.cos(a) * l * 0.5, 410 + Math.sin(a) * l * 0.5 - 6], [ex, ey], 3, 2, ['#5E8F6A'], 2.2));
    out.push(blob(ex, ey, 48, 22, LEAF, 3, 1.4, a));
  }
  out.push(strand([CX, 400], [CX + 30, 650], [CX - 10, 930], 64, 6, ROOT, 4)); // taproot
  const sides: [number, number, number, number][] = [[470, -1, 170, 120], [520, 1, 190, 140], [600, -1, 230, 170], [650, 1, 220, 180], [730, -1, 170, 150], [780, 1, 160, 130], [850, -1, 110, 90]];
  for (const [y, s, dx, dy] of sides) {
    const x0 = CX + 30 * Math.sin(((y - 400) / 530) * Math.PI) * 0.6;
    out.push(strand([x0, y], [x0 + s * dx * 0.6, y + dy * 0.2], [x0 + s * dx, y + dy], 18, 3, ROOT, 3.2));
    out.push(strand([x0 + s * dx * 0.6, y + dy * 0.35], [x0 + s * dx * 0.8, y + dy * 0.45], [x0 + s * dx * 0.95, y + dy * 0.75 + 30], 6, 2, ROOT, 2.4));
  }
  return out.join('');
}
// Cross-section of the root: bark, cortex and woody core (schematic).
const rootSection = (cx: number, cy: number) =>
  blob(cx, cy, 92, 92, ['#B89A6A', '#C8AE82'], 3.6, 1.2) + blob(cx, cy, 78, 78, ['#F3E6CF', '#E9D6B4'], 3.6, 1.3) + blob(cx, cy, 34, 34, ['#D9C29A', '#C8AE82', '#E8C547'], 3.2, 1.4);
// 100 beads, `k` lit: "at least 5% withanolides".
const percentGrid = (cx: number, cy: number, k: number) => {
  const out: string[] = [];
  for (let i = 0; i < 100; i++) { const gx = i % 10, gy = Math.floor(i / 10); const lit = gy === 4 && gx >= 3 && gx < 3 + k; out.push(dot(cx - 67.5 + gx * 15, cy - 67.5 + gy * 15, lit ? 6.5 : 5.5, lit ? TEAL : '#6E7BE8', lit ? 1 : 0.45)); }
  return out.join('');
};

interface Hex { cx: number; cy: number; ax: number; ay: number; inner: string; title: string; text: string; side: 'l' | 'r' }
interface Topic { slug: string; title: string; subtitle: string; centre: () => string; hexes: Hex[]; sources: string }
const POS = { tl: [560, 330], tr: [1240, 290], r: [1360, 650], br: [1240, 980], bl: [560, 980] } as const;
const at = (k: keyof typeof POS) => ({ cx: POS[k][0], cy: POS[k][1] });

const TOPICS: Topic[] = [
  {
    slug: 'coq10', title: 'CoQ10', subtitle: 'Where your cells make energy', centre: cell, sources: 'NIH NCCIH; noovit.com/guides/coq10',
    hexes: [
      { ...at('tl'), ax: CX - 250, ay: CY - 60, side: 'l', inner: mito(560, 330, 170, 0.35, 5), title: 'Mitochondria', text: 'Most of the energy your cells use is made inside mitochondria, often called the power plants of the cell.' },
      { ...at('tr'), ax: CX + 180, ay: CY - 160, side: 'r', inner: mol('coq10', 1240, 290, 190, 190, { rotate: -0.25, zoom: 3 }), title: 'Coenzyme Q10', text: 'Its ring end carries electrons; its long fatty tail anchors it in the inner membrane of mitochondria, along the chain that powers energy production.' },
      { ...at('r'), ax: CX + 300, ay: CY + 60, side: 'r', inner: atpSynthase(1360, 650), title: 'ATP synthase', text: 'That flow drives ATP synthase, a tiny molecular motor that makes ATP, the energy currency your cells run on.' },
      { ...at('br'), ax: CX + 220, ay: CY + 200, side: 'r', inner: bilayer(1240, 980), title: 'Cell membranes', text: 'In its reduced form (ubiquinol), CoQ10 also works as an antioxidant inside cell membranes.' },
      { ...at('bl'), ax: CX - 40, ay: CY + 40, side: 'l', inner: miniCells(560, 980), title: 'Made by your body', text: 'Your body makes its own CoQ10. Levels are highest in the heart, liver, kidneys and pancreas, and tend to fall with age.' },
    ],
  },
  {
    slug: 'magnesium', title: 'Magnesium', subtitle: 'A mineral at work in every cell', centre: cell, sources: 'NIH Office of Dietary Supplements; noovit.com/guides/magnesium',
    hexes: [
      { ...at('tl'), ax: CX - 250, ay: CY - 60, side: 'l', inner: enzyme(560, 330), title: '300+ enzymes', text: 'Magnesium is a helper (cofactor) for more than 300 enzyme systems, including those that make protein and run muscle and nerve function.' },
      { ...at('tr'), ax: CX + 180, ay: CY - 160, side: 'r', inner: mol('atp', 1240, 290, 190, 150, { rotate: 0 }), title: 'Magnesium and ATP', text: 'Inside cells, most ATP, the energy molecule, is bound to magnesium. The Mg–ATP pair is the form many enzymes use.' },
      { ...at('r'), ax: CX + 300, ay: CY + 60, side: 'r', inner: fibre(1360, 650, 190), title: 'Muscles and nerves', text: 'Magnesium helps control muscle contraction and nerve signals, working alongside calcium and potassium.' },
      { ...at('br'), ax: CX + 220, ay: CY + 200, side: 'r', inner: bone(1240, 980), title: 'Stored in bone', text: 'About 50–60% of the body’s magnesium is in bone. Most of the rest is inside soft tissues; less than 1% is in the blood.' },
      { ...at('bl'), ax: CX - 40, ay: CY + 40, side: 'l', inner: brandShape('magnesium-complex', 560, 980, 190), title: 'How much you need', text: 'Adults need 310–420 mg a day. About half of US adults get less than that from food.' },
    ],
  },
  {
    slug: 'creatine', title: 'Creatine', subtitle: 'Fast energy for working muscle', centre: muscle, sources: 'Peer-reviewed reviews cited at noovit.com/guides/creatine',
    hexes: [
      { ...at('tl'), ax: CX - 300, ay: CY - 82, side: 'l', inner: mol('creatine-h', 560, 330, 180, 170, { rotate: 0.4 }), title: 'Made by your body', text: 'Your kidneys and liver make about 1 g of creatine a day from three amino acids: arginine, glycine and methionine.' },
      { ...at('tr'), ax: CX + 200, ay: CY - 82, side: 'r', inner: fibre(1240, 290, 190), title: 'Stored in muscle', text: 'About 95% of the body’s creatine is in skeletal muscle, roughly two-thirds of it as phosphocreatine.' },
      { ...at('r'), ax: CX + 330, ay: CY, side: 'r', inner: mol('phosphocreatine', 1360, 650, 180, 170, { rotate: 0.2 }), title: 'Phosphocreatine', text: 'Phosphocreatine is creatine carrying a phosphate group: a quick-release store of energy.' },
      { ...at('br'), ax: CX + 230, ay: CY + 82, side: 'r', inner: mol('atp', 1240, 980, 190, 150, { rotate: 0 }), title: 'Rebuilding ATP', text: 'In short, intense efforts, the enzyme creatine kinase hands that phosphate to ADP, rebuilding ATP within seconds.' },
      { ...at('bl'), ax: CX - 60, ay: CY + 164, side: 'l', inner: brandShape('creatine', 560, 980, 180), title: 'Food and supplements', text: 'Meat and fish provide around 1 g a day. Studies of creatine monohydrate typically use 3–5 g a day.' },
    ],
  },
  {
    slug: 'ashwagandha', title: 'Ashwagandha', subtitle: 'A root extract studied for stress', centre: root, sources: 'NIH NCCIH; NIH LiverTox; trials cited at noovit.com/guides/ashwagandha',
    hexes: [
      { ...at('tl'), ax: CX + 10, ay: 520, side: 'l', inner: rootSection(560, 330), title: 'The root', text: 'Ashwagandha (Withania somnifera) is a shrub used in Ayurveda. Supplements are usually made from its root, or root and leaf.' },
      { ...at('tr'), ax: CX + 150, ay: 600, side: 'r', inner: mol('withaferin-a', 1240, 290, 190, 170, { rotate: 0 }), title: 'Withanolides', text: 'Its main active compounds are thought to be withanolides, steroid-like molecules such as withaferin A (shown). Which ones matter is unclear.' },
      { ...at('r'), ax: CX + 200, ay: 760, side: 'r', inner: percentGrid(1360, 650, 5), title: 'Standardized extract', text: 'KSM-66 is a root-only extract standardized to at least 5% withanolides, so each dose contains a consistent amount.' },
      { ...at('br'), ax: CX + 15, ay: 860, side: 'r', inner: mol('cortisol', 1240, 980, 190, 160, { rotate: 0 }), title: 'Stress and cortisol', text: 'In 8–12 week trials of stressed adults, 240–600 mg of extract a day lowered perceived stress and cortisol, a stress hormone. Most trials were small.' },
      { ...at('bl'), ax: 790, ay: 660, side: 'l', inner: miniCells(560, 980), title: 'Safety first', text: 'Rare liver injury has been reported, and it can raise thyroid hormones. Avoid in pregnancy; ask your doctor if you take thyroid medicine.' },
    ],
  },
];

function caption(h: Hex) {
  const all = wrap(h.text, 300, 22, 0.5);
  if (all.length > 6) console.warn(`Caption too long (${all.length} lines): ${h.title}`);
  const lines = all.slice(0, 6);
  const x = h.side === 'l' ? h.cx - 130 - 320 : h.cx + 130;
  const y = h.cy - 60;
  return `<text x="${x}" y="${y}" font-size="26" font-weight="700" fill="#fff" font-family="Inter">${esc(h.title)}</text>` +
    lines.map((l, i) => `<text x="${x}" y="${y + 34 + i * 30}" font-size="22" fill="#fff" fill-opacity="0.78" font-family="Inter">${esc(l)}</text>`).join('');
}

const fontFiles = readdirSync('assets/fonts').filter((f) => f.endsWith('.ttf')).map((f) => `assets/fonts/${f}`);
mkdirSync('design/social', { recursive: true });
for (const t of TOPICS) {
  seed = 7; // colour gradients are shared across topics (their close-ups are built up front)
  const centre = t.centre();
  const hexes = t.hexes.map((h, i) => `<line x1="${h.cx}" y1="${h.cy}" x2="${h.ax}" y2="${h.ay}" stroke="#fff" stroke-opacity="0.7" stroke-width="2"/><circle cx="${h.ax}" cy="${h.ay}" r="7" fill="none" stroke="#fff" stroke-width="2.5"/>` + hex(`hx-${t.slug}-${i}`, h.cx, h.cy, h.inner) + caption(h)).join('');
  const body = `<rect width="${W}" height="${H}" fill="${NIGHT}"/>${centre}${hexes}
    <text x="70" y="110" font-size="72" font-weight="300" fill="#fff" font-family="Manrope">${esc(t.title)}</text>
    <text x="70" y="160" font-size="34" font-weight="300" fill="#fff" fill-opacity="0.85" font-family="Manrope">${esc(t.subtitle)}</text>
    <text x="70" y="1170" font-size="18" fill="#fff" fill-opacity="0.55" font-family="Inter">${esc(`Educational illustration, not to scale. Molecules: PubChem 2D structures. Sources: ${t.sources}`)}</text>
    ${wordmark(1660, 1165, 40, 'print', '#ffffff')}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><radialGradient id="mem" cx="0.42" cy="0.38" r="0.7"><stop offset="0" stop-color="#3B4DB8" stop-opacity="0.35"/><stop offset="0.85" stop-color="#1B2470" stop-opacity="0.55"/><stop offset="1" stop-color="#AFC2FF" stop-opacity="0.35"/></radialGradient>${defs.join('')}</defs>${body}</svg>`;
  const file = `design/social/infographic-${t.slug}.png`;
  writeFileSync(file, new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng());
  console.log(file);
}
