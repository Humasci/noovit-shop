// Educational infographic in the "molecular city" style (3 Nov): a central bead-built cell, hexagon close-ups
// joined by thin lines, and short captions. Facts only (from lib/guides.ts and the NIH NCCIH page), no claims.
// Writes design/social/infographic-coq10.png (1800×1200, web/social). Usage: npm run infographic
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { Resvg } from '@resvg/resvg-js';
import { SEED_PRODUCTS } from '@/data/products';
import { helixSvg } from '@/lib/labels/web-art';
import { moleculeArt } from '@/lib/labels/molecule';
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
const coq = SEED_PRODUCTS.find((p) => p.slug === 'coq10')!;
const coqArt = (cx: number, cy: number) => `<g transform="translate(${cx - 110} ${cy - 110}) scale(1)">${moleculeArt(coq as never, 110, 110, 200, 180, '#2DB6A8', { palette: 'spectrum' })}</g>`;
const atpSynthase = (cx: number, cy: number) => {
  const out: string[] = [blob(cx, cy + 55, 70, 10, [LAV, COBALT], 3.5, 1.2)]; // membrane
  for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2; out.push(blob(cx + Math.cos(a) * 30, cy - 20 + Math.sin(a) * 30, 13, 13, [GOLD, '#F2D97A', '#C9A227'], 3.2)); }
  out.push(blob(cx, cy + 22, 7, 30, [TEAL, '#7FE0D6'], 3, 1.4));
  return out.join('');
};
const bilayer = (cx: number, cy: number) => {
  const out: string[] = [];
  for (let row = 0; row < 2; row++) for (let x = -110; x <= 110; x += 13) {
    const y = cy + (row ? 26 : -26);
    out.push(`<line x1="${cx + x}" y1="${y}" x2="${cx + x + (rnd() - 0.5) * 4}" y2="${cy + (row ? 4 : -4)}" stroke="${LAV}" stroke-width="2" stroke-opacity="0.6"/>`, dot(cx + x, y, 6, row ? COBALT : '#6E7BE8'));
  }
  for (let i = 0; i < 5; i++) out.push(blob(cx - 80 + i * 40, cy, 10, 3, [TEAL, GOLD], 2.4, 1.5));
  return out.join('');
};
const helixBit = (cx: number, cy: number) => `<svg x="${cx - 150}" y="${cy - 80}" width="300" height="160" viewBox="300 100 900 500">${helixSvg('info', 1600, 700, true, false).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>`;

const HEX: { cx: number; cy: number; ax: number; ay: number; inner: string; title: string; text: string; side: 'l' | 'r' }[] = [
  { cx: 560, cy: 330, ax: CX - 250, ay: CY - 60, inner: mito(560, 330, 170, 0.35, 5), title: 'Mitochondria', side: 'l', text: 'Most of the energy your cells use is made inside mitochondria, often called the power plants of the cell.' },
  { cx: 1240, cy: 290, ax: CX + 180, ay: CY - 160, inner: coqArt(1240, 290), title: 'Coenzyme Q10', side: 'r', text: 'CoQ10 sits in the inner membrane of mitochondria and passes electrons along the chain that powers energy production.' },
  { cx: 1360, cy: 650, ax: CX + 300, ay: CY + 60, inner: atpSynthase(1360, 650), title: 'ATP synthase', side: 'r', text: 'That flow drives ATP synthase, a tiny molecular motor that makes ATP, the energy currency your cells run on.' },
  { cx: 1240, cy: 980, ax: CX + 220, ay: CY + 200, inner: bilayer(1240, 980), title: 'Cell membranes', side: 'r', text: 'In its reduced form (ubiquinol), CoQ10 also works as an antioxidant inside cell membranes.' },
  { cx: 560, cy: 980, ax: CX - 40, ay: CY + 40, inner: helixBit(560, 980), title: 'Made by your body', side: 'l', text: 'Your body makes its own CoQ10. Levels are highest in the heart, liver, kidneys and pancreas, and tend to fall with age.' },
];

function caption(h: (typeof HEX)[number]) {
  const lines = wrap(h.text, 300, 22, 0.5).slice(0, 5);
  const x = h.side === 'l' ? h.cx - 130 - 320 : h.cx + 130;
  const y = h.cy - 60;
  return `<text x="${x}" y="${y}" font-size="26" font-weight="700" fill="#fff" font-family="Inter">${esc(h.title)}</text>` +
    lines.map((l, i) => `<text x="${x}" y="${y + 34 + i * 30}" font-size="22" fill="#fff" fill-opacity="0.78" font-family="Inter">${esc(l)}</text>`).join('');
}

const body = [
  `<rect width="${W}" height="${H}" fill="${NIGHT}"/>`,
  cell(),
  ...HEX.map((h) => `<line x1="${h.cx}" y1="${h.cy}" x2="${h.ax}" y2="${h.ay}" stroke="#fff" stroke-opacity="0.7" stroke-width="2"/><circle cx="${h.ax}" cy="${h.ay}" r="7" fill="none" stroke="#fff" stroke-width="2.5"/>`),
  ...HEX.map((h, i) => hex(`hx${i}`, h.cx, h.cy, h.inner) + caption(h)),
  `<text x="70" y="110" font-size="72" font-weight="300" fill="#fff" font-family="Manrope">CoQ10</text>`,
  `<text x="70" y="160" font-size="34" font-weight="300" fill="#fff" fill-opacity="0.85" font-family="Manrope">Where your cells make energy</text>`,
  `<text x="70" y="1170" font-size="18" fill="#fff" fill-opacity="0.55" font-family="Inter">Educational illustration, not to scale. Sources: NIH NCCIH; noovit.com/guides/coq10</text>`,
  wordmark(1660, 1165, 40, 'print', '#ffffff'),
].join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs><radialGradient id="mem" cx="0.42" cy="0.38" r="0.7"><stop offset="0" stop-color="#3B4DB8" stop-opacity="0.35"/><stop offset="0.85" stop-color="#1B2470" stop-opacity="0.55"/><stop offset="1" stop-color="#AFC2FF" stop-opacity="0.35"/></radialGradient>${defs.join('')}</defs>${body}</svg>`;

const fontFiles = readdirSync('assets/fonts').filter((f) => f.endsWith('.ttf')).map((f) => `assets/fonts/${f}`);
mkdirSync('design/social', { recursive: true });
writeFileSync('design/social/infographic-coq10.png', new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng());
console.log('design/social/infographic-coq10.png');
