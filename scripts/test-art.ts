// At-home test figures (20 Nov, owner: "keep the style and implement where we can"): the STI figure's dark, glossy-bead
// look applied to the other kits. Hormone and vitamin tests show the molecule the test measures as a bead
// ball-and-stick of PubChem's own 2D structure (data/skeletons.json, scripts/build-skeletons.py; only rotated and
// scaled, CPK colours). The iron test shows red blood cells (schematic, not to scale).
// Run: npx tsx --conditions=react-server scripts/test-art.ts
import { readdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { ballStick } from '../lib/labels/molecule';

const W = 1600, H = 700;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const ELEMENTS: Record<string, [string, string]> = { C: ['Carbon', '#9AA0BC'], O: ['Oxygen', '#E0443E'], N: ['Nitrogen', '#3E6FD8'], I: ['Iodine', '#940094'] };
const CARBON = '#9AA0BC'; // CPK carbon is grey

type Fig = { slug: string; key?: string; name: string; formula?: string; cid?: number; text: string[]; elements?: string[]; rotate?: number };
const FIGS: Fig[] = [
  { slug: 'cortisol-test', key: 'cortisol', name: 'Cortisol', formula: 'C21H30O5', cid: 5754, text: ['The body’s main stress hormone.', 'Levels follow a daily rhythm,', 'highest in the morning.'], elements: ['C', 'O'] },
  { slug: 'testosterone-test', key: 'testosterone', name: 'Testosterone', formula: 'C19H28O2', cid: 6013, text: ['The main male sex hormone.', 'Women make it too,', 'in smaller amounts.'], elements: ['C', 'O'] },
  { slug: 'vitamin-d-test', key: 'calcifediol', name: '25-hydroxyvitamin D', formula: 'C27H44O2', cid: 5283731, text: ['The form of vitamin D in blood', 'that tests measure, and the best', 'marker of vitamin D status.'], elements: ['C', 'O'] },
  { slug: 'thyroid-test', key: 'thyroxine', name: 'Thyroxine (T4)', formula: 'C15H11I4NO4', cid: 5819, text: ['The main hormone the thyroid', 'releases. Its four iodine atoms', 'come from the diet.'], elements: ['C', 'O', 'N', 'I'] },
  { slug: 'cholesterol-test', key: 'cholesterol', name: 'Cholesterol', formula: 'C27H46O', cid: 5997, text: ['A fat-like molecule every cell uses.', 'It travels in the blood inside', 'lipoproteins such as LDL and HDL.'], elements: ['C', 'O'] },
  { slug: 'perimenopause-test', key: 'estradiol', name: 'Estradiol', formula: 'C18H24O2', cid: 5757, text: ['The main estrogen before menopause.', 'Levels swing widely in perimenopause,', 'so one result is a snapshot.'], elements: ['C', 'O'] },
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
    const art = f.key ? ballStick(f.key, 1090, 350, 860, 560, CARBON, { carbon: CARBON, rotate: f.rotate ?? -0.12 }) : cells();
    const legend = (f.elements ?? []).map((e, i) => `<g transform="translate(${90 + i * 130} 520)"><rect width="18" height="18" rx="5" fill="url(#el-${e})"/><text x="28" y="14" font-family="Inter" font-size="15" fill="#D9DFF5" fill-opacity="0.85">${ELEMENTS[e][0]}</text></g>`).join('');
    const foot = f.cid ? `Structure: PubChem CID ${f.cid}, 2D layout. Hydrogens not shown.` : 'Schematic illustration, not to scale';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>
      <radialGradient id="bg" cx="62%" cy="48%" r="75%"><stop offset="0" stop-color="#141A4D"/><stop offset="1" stop-color="#05061a"/></radialGradient>
      ${RBC_TONES.map((c, i) => glossy(`rbc${i}`, c)).join('')}${Object.entries(ELEMENTS).map(([e, [, c]]) => glossy(`el-${e}`, c)).join('')}</defs>
      <rect width="${W}" height="${H}" fill="url(#bg)"/>${art}
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
