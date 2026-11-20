// STI illustration (20 Nov, owner): schematic organisms in a glossy bead "molecular surface" style (science palette),
// labelled with thin leader lines like a journal figure. Schematic shapes from standard microbiology descriptions,
// not structural models, and not to scale (accuracy rule in CLAUDE.md). Run: npx tsx scripts/sti-art.ts
import { readdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';

type Bead = { x: number; y: number; z: number; r: number; c: string };
const PAL = { teal: '#2DB6A8', magenta: '#C4458F', lavender: '#B9A9F2', violet: '#7A5CE0', cobalt: '#3E5BD6', gold: '#E0B23A', haze: '#D9DFF5' };
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function fib(n: number) { const pts: [number, number, number][] = []; const g = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), t = g * i; pts.push([Math.cos(t) * r, y, Math.sin(t) * r]); } return pts; }
const rot = ([x, y, z]: number[], ax: number, ay: number) => { const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax); const x1 = x * cy + z * sy, z1 = -x * sy + z * cy; const y1 = y * cx - z1 * sx, z2 = y * cx * 0 + y * sx + z1 * cx; return [x1, y1, z2]; };

function sphere(cx: number, cy: number, R: number, n: number, br: number, color: string, spikes?: { n: number; len: number; c: string; size: number }): Bead[] {
  const out: Bead[] = [];
  for (const p of fib(n)) { const [x, y, z] = rot(p, 0.4, 0.5); out.push({ x: cx + x * R, y: cy + y * R, z, r: br * (0.85 + rnd() * 0.3), c: color }); }
  if (spikes) for (const p of fib(spikes.n)) { const [x, y, z] = rot(p, 0.9, 0.2); for (let k = 0; k < 3; k++) { const a = (k / 3) * Math.PI * 2; const off = spikes.size * 0.9; const d = R + spikes.len; out.push({ x: cx + x * d + Math.cos(a) * off * 0.6, y: cy + y * d + Math.sin(a) * off * 0.6, z: z + 0.05, r: spikes.size, c: spikes.c }); } out.push({ x: cx + x * (R + spikes.len * 0.45), y: cy + y * (R + spikes.len * 0.45), z, r: spikes.size * 0.55, c: spikes.c }); }
  return out;
}
function ellipsoid(cx: number, cy: number, rx: number, ry: number, n: number, br: number, color: string, tilt = 0): Bead[] {
  return fib(n).map((p) => { const [x, y, z] = rot(p, 0.3, 0.6); const X = x * rx, Y = y * ry; return { x: cx + X * Math.cos(tilt) - Y * Math.sin(tilt), y: cy + X * Math.sin(tilt) + Y * Math.cos(tilt), z, r: br * (0.85 + rnd() * 0.3), c: color }; });
}
function strand(points: [number, number][], br: number, color: string, z = 0.2): Bead[] { return points.map(([x, y], i) => ({ x, y, z: z + Math.sin(i * 0.7) * 0.15, r: br, c: color })); }

const W = 1600, H = 900;
const beads: Bead[] = [];
const labels: { x: number; y: number; lx: number; ly: number; name: string; kind: string; align: 'start' | 'end'; side: 'above' | 'below' }[] = [];

// HIV: enveloped sphere with spike trimers
beads.push(...sphere(330, 300, 118, 700, 9, PAL.lavender, { n: 34, len: 26, c: PAL.teal, size: 8 }));
labels.push({ x: 250, y: 205, lx: 90, ly: 110, name: 'HIV', kind: 'Virus · enveloped, with spike proteins', align: 'start', side: 'above' });
// Hepatitis C: smaller enveloped virus
beads.push(...sphere(330, 660, 78, 380, 8, PAL.magenta, { n: 26, len: 12, c: PAL.gold, size: 6 }));
labels.push({ x: 272, y: 712, lx: 90, ly: 830, name: 'Hepatitis C', kind: 'Virus · enveloped', align: 'start', side: 'below' });
// Gonorrhea: diplococcus (two kidney beans) with pili
beads.push(...ellipsoid(735, 290, 70, 90, 420, 9, PAL.teal, 0.1));
beads.push(...ellipsoid(885, 300, 70, 90, 420, 9, PAL.teal, -0.1));
for (let k = 0; k < 9; k++) { const a = Math.PI * (0.15 + rnd() * 0.7) * (k % 3 === 0 ? -0.35 : 1), x0 = k % 2 ? 735 : 885, len = 40 + rnd() * 45; const pts: [number, number][] = []; for (let t = 0; t < 1; t += 0.05) pts.push([x0 + Math.cos(a) * (90 + len * t) + Math.sin(t * 9) * 6, 295 + Math.sin(a) * (90 + len * t)]); beads.push(...strand(pts, 2.6, PAL.haze, -0.3)); }
labels.push({ x: 812, y: 215, lx: 700, ly: 90, name: 'Gonorrhea', kind: 'Bacterium · paired cells with pili', align: 'start', side: 'above' });
// Syphilis: tight corkscrew spirochete
{ const pts: [number, number][] = []; for (let t = 0; t <= 1; t += 0.0035) { const x = 640 + t * 340, y = 660 + Math.sin(t * Math.PI * 2 * 9) * 24 + Math.sin(t * Math.PI) * -30; pts.push([x, y]); } beads.push(...pts.map(([x, y], i) => ({ x, y, z: Math.cos(i * 0.21 * 9 / 2.6), r: 7, c: PAL.gold }))); }
labels.push({ x: 820, y: 668, lx: 640, ly: 820, name: 'Syphilis', kind: 'Bacterium · corkscrew spirochete', align: 'start', side: 'below' });
// Chlamydia: inclusion inside a host cell with many small bodies
beads.push(...ellipsoid(1260, 270, 170, 125, 900, 5, 'rgba(185,169,242,0.35)'));
for (let k = 0; k < 140; k++) { const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 85; beads.push({ x: 1230 + Math.cos(a) * r, y: 280 + Math.sin(a) * r * 0.8, z: 0.6 + rnd() * 0.3, r: 6 + rnd() * 4, c: k % 3 ? PAL.magenta : PAL.violet }); }
labels.push({ x: 1360, y: 175, lx: W - 50, ly: 70, name: 'Chlamydia', kind: 'Bacterium · lives inside cells', align: 'end', side: 'above' });
// Trichomonas: pear-shaped parasite with 4 flagella and an undulating membrane
{ const body: Bead[] = fib(650).map((p) => { const [x, y, z] = rot(p, 0.2, 0.4); const taper = 1 - 0.45 * ((y + 1) / 2); return { x: 1290 + x * 90 * taper, y: 700 + y * 115, z, r: 8.5, c: PAL.cobalt }; }); beads.push(...body);
  for (let k = 0; k < 4; k++) { const pts: [number, number][] = []; for (let t = 0; t < 1; t += 0.03) pts.push([1290 - 40 + k * 26 + Math.sin(t * 7 + k) * 14, 590 - t * 95]); beads.push(...strand(pts, 3.2, PAL.haze, 0.4)); }
  const um: [number, number][] = []; for (let t = 0; t < 1; t += 0.02) um.push([1385 + Math.sin(t * 22) * 8 - t * 45, 600 + t * 200]); beads.push(...strand(um, 4, PAL.teal, 0.8)); }
labels.push({ x: 1360, y: 780, lx: W - 50, ly: 845, name: 'Trichomoniasis', kind: 'Parasite · Trichomonas vaginalis', align: 'end', side: 'below' });

// ---- render
const grad = new Map<string, string>();
const gid = (c: string) => { if (!grad.has(c)) grad.set(c, `g${grad.size}`); return grad.get(c)!; };
beads.sort((a, b) => a.z - b.z);
const circles = beads.map((b) => { const shade = 0.55 + 0.45 * ((b.z + 1) / 2); return `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${(b.r * (0.8 + 0.3 * ((b.z + 1) / 2))).toFixed(1)}" fill="url(#${gid(b.c)})" opacity="${shade.toFixed(2)}"/>`; }).join('');
const defs = [...grad].map(([c, id]) => `<radialGradient id="${id}" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/><stop offset="0.25" stop-color="${c}"/><stop offset="1" stop-color="#05061a"/></radialGradient>`).join('');
const lab = labels.map((l) => { const ex = l.lx, ey = l.side === 'above' ? l.ly + 30 : l.ly - 36; return `<path d="M${l.x} ${l.y} L${ex} ${ey}" stroke="#D9DFF5" stroke-opacity="0.55" stroke-width="1.2" fill="none"/><circle cx="${l.x}" cy="${l.y}" r="3" fill="#D9DFF5"/><text x="${l.lx}" y="${l.ly - 8}" font-family="Manrope" font-weight="700" font-size="26" fill="#ffffff" text-anchor="${l.align}">${l.name}</text><text x="${l.lx}" y="${l.ly + 18}" font-family="Inter" font-size="15" fill="#D9DFF5" fill-opacity="0.8" text-anchor="${l.align}">${l.kind}</text>`; }).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs}<radialGradient id="bg" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#141A4D"/><stop offset="1" stop-color="#05061a"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#bg)"/>${circles}${lab}<text x="${W / 2}" y="${H - 24}" font-family="Inter" font-size="14" fill="#D9DFF5" fill-opacity="0.6" text-anchor="middle">Schematic illustrations, not to scale</text></svg>`;
const fonts = readdirSync('assets/fonts').filter((f) => f.endsWith('.ttf')).map((f) => path.join('assets/fonts', f));
const png = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles: fonts, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
// Saved as a web JPEG (the PNG is ~0.9 MB).
import('sharp').then(({ default: sharp }) => sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile('public/images/tests/sti-organisms.jpg')).then(() => console.log('beads', beads.length));
