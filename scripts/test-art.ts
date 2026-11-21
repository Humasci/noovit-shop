// At-home test figures (20 Nov; 3D molecules 21 Nov, owner: "keep the style and implement where we can"): the STI figure's dark, glossy-bead
// look applied to the other kits. Hormone and vitamin tests show the molecule the test measures as a bead
// ball-and-stick of PubChem's own 2D structure (data/skeletons.json, scripts/build-skeletons.py; only rotated and
// scaled, CPK colours). The iron test shows red blood cells (schematic, not to scale).
// Run: npx tsx --conditions=react-server scripts/test-art.ts
import { readdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import MOL3D from '../data/molecules3d.json';

// ---------- 3D ball-and-stick (21 Nov, owner: "more 3D texture and defined") ----------
// PubChem 3D conformer (data/molecules3d.json, scripts/build-molecules3d.py), hydrogens included, only rotated and scaled.
// Atoms are glossy spheres (specular highlight, coloured body, dark rim), bonds are shaded cylinders split in the two
// atoms' colours, double bonds drawn as two thinner cylinders, everything painted back to front with depth fade.
type M3 = { cid: number; atoms: [string, number, number, number][]; bonds: [number, number, number][] };
const CPK: Record<string, string> = { C: '#8E95AE', H: '#EEF0F6', O: '#E0443E', N: '#3E6FD8', I: '#940094' };
const RAD: Record<string, number> = { C: 0.42, H: 0.25, O: 0.4, N: 0.4, I: 0.6 }; // ball-and-stick radii, in Å
function mol3d(key: string, cx: number, cy: number, w: number, h: number, yaw = 0.5, pitch = 0.35, roll = 0) {
  const m = (MOL3D as unknown as Record<string, M3>)[key];
  const rot = ([x, y, z]: number[]) => {
    let X = x * Math.cos(roll) - y * Math.sin(roll), Y = x * Math.sin(roll) + y * Math.cos(roll), Z = z;
    [X, Z] = [X * Math.cos(yaw) + Z * Math.sin(yaw), -X * Math.sin(yaw) + Z * Math.cos(yaw)];
    [Y, Z] = [Y * Math.cos(pitch) - Z * Math.sin(pitch), Y * Math.sin(pitch) + Z * Math.cos(pitch)];
    return [X, Y, Z];
  };
  const P = m.atoms.map(([, x, y, z]) => rot([x, y, z]));
  const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]), zs = P.map((p) => p[2]);
  const pad = 0.7, s = Math.min(w / (Math.max(...xs) - Math.min(...xs) + pad * 2), h / (Math.max(...ys) - Math.min(...ys) + pad * 2));
  const mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2;
  const zmin = Math.min(...zs), zmax = Math.max(...zs);
  const depth = (z: number) => (z - zmin) / (zmax - zmin || 1); // 0 far, 1 near (z towards viewer)
  const S = P.map(([x, y, z]) => ({ x: cx + (x - mx) * s, y: cy - (y - my) * s, d: depth(z) }));
  const defs: string[] = [];
  const seen = new Set<string>();
  const ball = (e: string) => { const id = `a3-${e}`; if (!seen.has(id)) { seen.add(id); const c = CPK[e] ?? CPK.C; defs.push(`<radialGradient id="${id}" cx="0.36" cy="0.32" r="0.72" fx="0.3" fy="0.26"><stop offset="0" stop-color="#ffffff"/><stop offset="0.12" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.3" stop-color="${c}"/><stop offset="0.82" stop-color="${c}" stop-opacity="0.92"/><stop offset="1" stop-color="#05061a"/></radialGradient>`); } return id; };
  const items: { z: number; svg: string }[] = [];
  const fade = (d: number) => (0.55 + 0.45 * d).toFixed(2);
  const bondR = 0.12 * s;
  for (const [a, b, order] of m.bonds) {
    const A = S[a], B = S[b];
    const ea = m.atoms[a][0], eb = m.atoms[b][0];
    const L = Math.hypot(B.x - A.x, B.y - A.y) || 1, nx = -(B.y - A.y) / L, ny = (B.x - A.x) / L;
    const offs = order === 2 ? [-1, 1] : order === 3 ? [-1.4, 0, 1.4] : [0];
    const r = order > 1 ? bondR * 0.62 : bondR;
    const mxp = (A.x + B.x) / 2, myp = (A.y + B.y) / 2;
    for (const o of offs) {
      const ox = nx * o * r * 1.35, oy = ny * o * r * 1.35;
      const seg = (x1: number, y1: number, x2: number, y2: number, e: string, d: number) => {
        const c = CPK[e] ?? CPK.C;
        // cylinder: dark core stroke, body, then a thin highlight offset towards the light (top left)
        return `<g opacity="${fade(d)}"><line x1="${(x1 + ox).toFixed(1)}" y1="${(y1 + oy).toFixed(1)}" x2="${(x2 + ox).toFixed(1)}" y2="${(y2 + oy).toFixed(1)}" stroke="#05061a" stroke-width="${(r * 2.3).toFixed(1)}" stroke-linecap="round"/><line x1="${(x1 + ox).toFixed(1)}" y1="${(y1 + oy).toFixed(1)}" x2="${(x2 + ox).toFixed(1)}" y2="${(y2 + oy).toFixed(1)}" stroke="${c}" stroke-width="${(r * 2).toFixed(1)}" stroke-linecap="round"/><line x1="${(x1 + ox - r * 0.35).toFixed(1)}" y1="${(y1 + oy - r * 0.45).toFixed(1)}" x2="${(x2 + ox - r * 0.35).toFixed(1)}" y2="${(y2 + oy - r * 0.45).toFixed(1)}" stroke="#ffffff" stroke-opacity="0.45" stroke-width="${(r * 0.55).toFixed(1)}" stroke-linecap="round"/></g>`;
      };
      items.push({ z: (A.d * 0.75 + B.d * 0.25) - 0.02, svg: seg(A.x, A.y, mxp, myp, ea, A.d) });
      items.push({ z: (B.d * 0.75 + A.d * 0.25) - 0.02, svg: seg(mxp, myp, B.x, B.y, eb, B.d) });
    }
  }
  m.atoms.forEach(([e], i) => {
    const A = S[i], r = (RAD[e] ?? RAD.C) * s * (0.9 + 0.2 * A.d);
    items.push({ z: A.d, svg: `<g opacity="${fade(A.d)}"><circle cx="${A.x.toFixed(1)}" cy="${(A.y + r * 0.08).toFixed(1)}" r="${(r * 1.04).toFixed(1)}" fill="#05061a" fill-opacity="0.6"/><circle cx="${A.x.toFixed(1)}" cy="${A.y.toFixed(1)}" r="${r.toFixed(1)}" fill="url(#${ball(e)})"/></g>` });
  });
  items.sort((p, q) => p.z - q.z);
  return { defs: defs.join(''), body: items.map((i) => i.svg).join(''), cid: m.cid };
}

const W = 1600, H = 700;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const ELEMENTS: Record<string, [string, string]> = { C: ['Carbon', '#8E95AE'], H: ['Hydrogen', '#EEF0F6'], O: ['Oxygen', '#E0443E'], N: ['Nitrogen', '#3E6FD8'], I: ['Iodine', '#940094'] };

type Fig = { slug: string; key?: string; name: string; formula?: string; cid?: number; text: string[]; elements?: string[]; view?: [number, number, number] };
const FIGS: Fig[] = [
  { slug: 'cortisol-test', key: 'cortisol', name: 'Cortisol', formula: 'C21H30O5', cid: 5754, text: ['The body’s main stress hormone.', 'Levels follow a daily rhythm,', 'highest in the morning.'], elements: ['C', 'H', 'O'] },
  { slug: 'testosterone-test', key: 'testosterone', name: 'Testosterone', formula: 'C19H28O2', cid: 6013, text: ['The main male sex hormone.', 'Women make it too,', 'in smaller amounts.'], elements: ['C', 'H', 'O'] },
  { slug: 'vitamin-d-test', key: 'calcifediol', name: '25-hydroxyvitamin D', formula: 'C27H44O2', cid: 5283731, text: ['The form of vitamin D in blood', 'that tests measure, and the best', 'marker of vitamin D status.'], elements: ['C', 'H', 'O'] },
  { slug: 'thyroid-test', key: 'thyroxine', name: 'Thyroxine (T4)', formula: 'C15H11I4NO4', cid: 5819, text: ['The main hormone the thyroid', 'releases. Its four iodine atoms', 'come from the diet.'], elements: ['C', 'H', 'O', 'N', 'I'] },
  { slug: 'cholesterol-test', key: 'cholesterol', name: 'Cholesterol', formula: 'C27H46O', cid: 5997, text: ['A fat-like molecule every cell uses.', 'It travels in the blood inside', 'lipoproteins such as LDL and HDL.'], elements: ['C', 'H', 'O'] },
  { slug: 'perimenopause-test', key: 'estradiol', name: 'Estradiol', formula: 'C18H24O2', cid: 5757, text: ['The main estrogen before menopause.', 'Levels swing widely in perimenopause,', 'so one result is a snapshot.'], elements: ['C', 'H', 'O'] },
  { slug: 'iron-test', name: 'Red blood cells', text: ['Most of the body’s iron sits in', 'hemoglobin inside red blood cells.', 'Ferritin shows how much is stored.'] },
];

const sub = (f: string) => f.replace(/(\d+)/g, '<tspan font-size="70%" baseline-shift="-20%">$1</tspan>');
const glossy = (id: string, c: string) => `<radialGradient id="${id}" cx="35%" cy="30%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity="0.95"/><stop offset="0.25" stop-color="${c}"/><stop offset="1" stop-color="#05061a"/></radialGradient>`;

// Red blood cells: biconcave discs of beads (thin dimpled centre, fat rim), lit from the top left so the dimple reads.
const RBC_TONES = ['#5E1B2A', '#8E2B3D', '#B83B4F', '#D9586A', '#EE8A95'];
function cells() {
  let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const beads: { x: number; y: number; z: number; r: number; t: number }[] = [];
  const L = [-0.45, -0.55, 0.7]; const ln = Math.hypot(...L); const light = L.map((v) => v / ln);
  const disc = (cx: number, cy: number, R: number, tilt: number, spin: number) => {
    const rotv = ([x, y, z]: number[]) => { const y1 = y * Math.cos(tilt) - z * Math.sin(tilt), z1 = y * Math.sin(tilt) + z * Math.cos(tilt); return [x * Math.cos(spin) - y1 * Math.sin(spin), x * Math.sin(spin) + y1 * Math.cos(spin), z1]; };
    for (let i = 0; i < 3200; i++) {
      const rr = Math.min(1, Math.sqrt(rnd()) * 1.02), a = rnd() * Math.PI * 2, side = rnd() < 0.5 ? -1 : 1;
      const h = 0.12 + 0.34 * Math.pow(rr, 2.2) * (1 - Math.pow(rr, 12)) + 0.06, dh = 0.34 * 2.2 * Math.pow(rr, 1.2);
      const p = rotv([Math.cos(a) * rr, Math.sin(a) * rr, side * h]);
      const n0 = [-dh * Math.cos(a) * side, -dh * Math.sin(a) * side, side]; const nn = Math.hypot(...n0);
      const nr = rotv(n0.map((v) => v / nn));
      const lit = Math.max(0, nr[0] * light[0] + nr[1] * light[1] + nr[2] * light[2]);
      beads.push({ x: cx + p[0] * R, y: cy + p[1] * R, z: p[2], r: R * 0.055 * (0.85 + rnd() * 0.3), t: nr[2] < 0 ? 0 : Math.min(4, Math.floor(lit * 5)) });
    }
  };
  disc(1080, 300, 150, 0.95, 0.3); disc(1340, 430, 120, 0.4, -0.5); disc(890, 520, 105, 1.2, 0.9); disc(1290, 160, 80, 0.7, 1.4);
  beads.sort((a, b) => a.z - b.z);
  return beads.map((b) => `<circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="${b.r.toFixed(1)}" fill="url(#rbc${b.t})"/>`).join('');
}

const fonts = readdirSync('assets/fonts').filter((f) => f.endsWith('.ttf')).map((f) => path.join('assets/fonts', f));
(async () => {
  for (const f of FIGS) {
    const m3 = f.key ? mol3d(f.key, 1090, 350, 880, 600, ...(f.view ?? [0.55, 0.45, 0])) : null;
    const art = m3 ? m3.body : cells();
    const legend = (f.elements ?? []).map((e, i) => `<g transform="translate(${90 + i * 130} 520)"><circle cx="9" cy="9" r="10" fill="url(#el-${e})"/><text x="28" y="14" font-family="Inter" font-size="15" fill="#D9DFF5" fill-opacity="0.85">${ELEMENTS[e][0]}</text></g>`).join('');
    const foot = f.cid ? `3D structure: PubChem CID ${f.cid} (computed conformer). Ball-and-stick model.` : 'Schematic illustration, not to scale';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>
      <radialGradient id="bg" cx="62%" cy="48%" r="75%"><stop offset="0" stop-color="#141A4D"/><stop offset="1" stop-color="#05061a"/></radialGradient>
      ${RBC_TONES.map((c, i) => glossy(`rbc${i}`, c)).join('')}${Object.entries(ELEMENTS).map(([e, [, c]]) => glossy(`el-${e}`, c)).join('')}
      ${m3?.defs ?? ''}</defs><rect width="${W}" height="${H}" fill="url(#bg)"/>${art}
      <text x="90" y="210" font-family="Manrope" font-weight="700" font-size="46" fill="#fff">${esc(f.name)}</text>
      ${f.formula ? `<text x="90" y="256" font-family="Inter" font-size="22" fill="#B9A9F2">${sub(f.formula)}</text>` : ''}
      ${f.text.map((t, i) => `<text x="90" y="${330 + i * 32}" font-family="Inter" font-size="21" fill="#D9DFF5" fill-opacity="0.9">${esc(t)}</text>`).join('')}
      ${legend}
      <text x="90" y="${H - 40}" font-family="Inter" font-size="14" fill="#D9DFF5" fill-opacity="0.6">${foot}</text></svg>`;
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles: fonts, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
    await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(`public/images/tests/${f.slug}.jpg`);
    console.log(f.slug);
  }
})();
