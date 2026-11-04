import { Product } from '@/types';
import { moleculeArt, ballStickArt, hasBallStick } from './molecule';
import { particleShape, hasShape } from './shapes';

// Website graphics in the V2 label style (3 Nov): the product's key molecule built from fine glossy beads,
// dissolving into loose particles, and a free "particle drift" for section backgrounds. Served as SVG by
// app/art/[name]/route.ts so pages stay light.

const n = (v: number) => Math.round(v * 100) / 100;
const SPECTRUM = ['#E57AB5', '#33BFA8', '#4C8DE0', '#8C6AD6'];

function seeded(str: string) {
  let h = 2166136261;
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}

export function moleculeSvg(p: Product, w = 800, h = 800, style: 'spectrum' | 'family' = 'spectrum') {
  // Drawn in a small 220-unit box (the bead size is tuned for label units) and scaled up by the viewBox, so the
  // beads stay visible at web sizes. Molecule lower-left; the dissolve trail drifts up and to the right.
  const S = 220;
  const art = hasBallStick(p.slug)
    ? ballStickArt(p, S * 0.5, S * 0.52, S * 0.9, S * 0.8, p.color, { spectrum: style === 'spectrum' })
    : hasShape(p.slug)
    ? particleShape(p, S * 0.08, S * 0.2, S * 0.72, p.color, { spectrum: style === 'spectrum', disperse: style === 'spectrum', bead: 1.15 })
    : moleculeArt(p, S * 0.42, S * 0.56, S * 0.72, S * 0.56, p.color, style === 'spectrum' ? { palette: 'spectrum', disperse: true } : {});
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${w}" height="${h}">${art}</svg>`;
}

// A field of glossy beads that thickens towards one edge (`from`), in the product colour plus the brand spectrum.
export function driftSvg(seed: string, color: string, w = 1600, h = 500, from: 'left' | 'right' | 'bottom' = 'right', count = 520) {
  const rnd = seeded(seed + from);
  const palette = [color, color, ...SPECTRUM];
  const grads = palette.map((c, i) => `<radialGradient id="d${i}" cx="0.36" cy="0.32" r="0.72"><stop offset="0" stop-color="#fff" stop-opacity="0.85"/><stop offset="0.35" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0.9"/></radialGradient>`).join('');
  const beads: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = rnd() ** 2.2; // most beads near the source edge
    const x = from === 'right' ? w - t * w : from === 'left' ? t * w : rnd() * w;
    const y = from === 'bottom' ? h - t * h : rnd() * h;
    const r = (1.2 + rnd() * 4.2) * (1 - t * 0.65);
    beads.push(`<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="url(#d${Math.floor(rnd() * palette.length)})" opacity="${n(0.35 + 0.65 * (1 - t))}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"><defs>${grads}</defs>${beads.join('')}</svg>`;
}

// "Science" palette for website artwork (3 Nov, from the owner's microscopy references): deep indigo → cobalt →
// violet → lavender, with teal and magenta accents. Product colours stay on the bottles.
export const SCIENCE = { night: '#141A4D', indigo: '#26307E', cobalt: '#3E5BD6', violet: '#7A5CE0', lavender: '#B9A9F2', teal: '#2DB6A8', magenta: '#C4458F', haze: '#D9DFF5' };

// Cell field: translucent cells with bead-built nuclei, floating at different depths (back ones soft and blurred).
// `dark` for immersive bands (indigo ground), light for page headers (lavender haze).
export function cellsSvg(seed: string, dark = true, w = 1600, h = 700) {
  const rnd = seeded(seed + (dark ? 'd' : 'l'));
  const S = SCIENCE;
  const ground = dark
    ? `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${S.night}"/><stop offset="0.55" stop-color="${S.indigo}"/><stop offset="1" stop-color="#3A3F9E"/></linearGradient>`
    : `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EEF1FB"/><stop offset="1" stop-color="${S.haze}"/></linearGradient>`;
  // Nucleus: one dense, bumpy mass in cobalt/violet (like a real stained nucleus), not multicolour beads.
  const nucleusCols = [S.cobalt, '#5468E0', S.violet, '#4A55C8'];
  const beadGrads = nucleusCols.map((c, i) => `<radialGradient id="b${i}" cx="0.36" cy="0.32" r="0.72"><stop offset="0" stop-color="#C9D1FF" stop-opacity="0.9"/><stop offset="0.45" stop-color="${c}"/><stop offset="1" stop-color="${S.indigo}"/></radialGradient>`).join('');
  const membrane = `<radialGradient id="m" cx="0.5" cy="0.5" r="0.5"><stop offset="0.6" stop-color="#fff" stop-opacity="0.03"/><stop offset="0.9" stop-color="${dark ? S.lavender : '#fff'}" stop-opacity="${dark ? 0.22 : 0.65}"/><stop offset="1" stop-color="#fff" stop-opacity="${dark ? 0.45 : 0.9}"/></radialGradient>
    <radialGradient id="mg" cx="0.35" cy="0.3" r="0.6"><stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
  const cell = (cx: number, cy: number, r: number, beads: boolean) => {
    const parts = [`<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="url(#m)"/>`];
    const nr = r * 0.56, nx = cx + (rnd() - 0.5) * r * 0.2, ny = cy + (rnd() - 0.5) * r * 0.2;
    if (beads) {
      const count = Math.round((nr * nr) / 4);
      const pts: [number, number, number][] = [];
      for (let i = 0; i < count; i++) {
        const a = rnd() * Math.PI * 2, d = nr * Math.sqrt(rnd());
        const bx = nx + Math.cos(a) * d, by = ny + Math.sin(a) * d;
        pts.push([bx, by, 1 - d / nr]);
      }
      pts.sort((p, q) => p[2] - q[2]);
      for (const [bx, by, depth] of pts) parts.push(`<circle cx="${n(bx)}" cy="${n(by)}" r="${n(1.8 + depth * 1.6)}" fill="url(#b${Math.floor(rnd() * nucleusCols.length)})"/>`);
    } else parts.push(`<circle cx="${n(nx)}" cy="${n(ny)}" r="${n(nr)}" fill="${S.cobalt}" opacity="0.55"/>`);
    parts.push(`<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="url(#mg)"/>`);
    return parts.join('');
  };
  const back: string[] = [], mid: string[] = [], front: string[] = [];
  // Keep the left 45% (where page copy sits) to soft, out-of-focus cells only.
  for (let i = 0; i < 7; i++) back.push(cell(rnd() * w, rnd() * h, 50 + rnd() * 70, false));
  for (let i = 0; i < 5; i++) mid.push(cell(w * (0.55 + rnd() * 0.42), h * (0.1 + rnd() * 0.8), 50 + rnd() * 40, true));
  for (let i = 0; i < 2; i++) front.push(cell(w * (0.78 + rnd() * 0.2), h * (0.15 + rnd() * 0.7), 110 + rnd() * 50, true));
  const specks: string[] = [];
  for (let i = 0; i < 70; i++) specks.push(`<circle cx="${n(rnd() * w)}" cy="${n(rnd() * h)}" r="${n(1 + rnd() * 3)}" fill="${[S.lavender, S.teal, S.magenta, '#fff'][Math.floor(rnd() * 4)]}" opacity="${n(0.25 + rnd() * 0.5)}"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"><defs>${ground}${beadGrads}${membrane}
    <filter id="far" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter><filter id="near" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.5"/></filter></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/><g filter="url(#far)" opacity="0.7">${back.join('')}</g>${specks.join('')}<g>${mid.join('')}</g><g filter="url(#near)">${front.join('')}</g></svg>`;
}

// DNA double helix built from glossy beads (backbones + base-pair rungs), dissolving into loose beads at one end.
// Spectrum colours (pink, teal, blue, violet) like the owner's reference; `w`×`h`, helix runs left → right.
export function helixSvg(seed = 'helix', w = 1600, h = 700, dark = true, ground = true) {
  const rnd = seeded(seed);
  const C = ['#E57AB5', '#33BFA8', '#4C8DE0', '#8C6AD6', '#6E7BE8'];
  const grads = C.map((c, i) => `<radialGradient id="h${i}" cx="0.36" cy="0.32" r="0.72"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="0.42" stop-color="${c}"/><stop offset="1" stop-color="${SCIENCE.night}" stop-opacity="0.9"/></radialGradient>`).join('');
  const beads: { x: number; y: number; z: number; r: number; c: number }[] = [];
  const cy = h * 0.5, amp = h * 0.24, turns = 2.4, x0 = w * 0.3, x1 = w * 0.98;
  const put = (x: number, y: number, z: number, r: number) => {
    // dissolve: the further left, the more beads drift away
    const t = (x - x0) / (x1 - x0);
    if (t < 0.25 && rnd() < (0.25 - t) * 3.2) { x -= rnd() * w * 0.28; y += (rnd() - 0.5) * h * 0.5; r *= 0.5 + rnd() * 0.8; }
    beads.push({ x, y, z, r, c: Math.floor(rnd() * C.length) });
  };
  for (let i = 0; i < 1400; i++) {
    const t = i / 1400, x = x0 + t * (x1 - x0), a = t * turns * Math.PI * 2;
    for (const ph of [0, Math.PI]) {
      const y = cy + Math.sin(a + ph) * amp, z = Math.cos(a + ph);
      for (let k = 0; k < 2; k++) put(x + (rnd() - 0.5) * 10, y + (rnd() - 0.5) * 14, z, 5 + rnd() * 4);
    }
    if (i % 46 === 0) // base-pair rung
      for (let s = 0.12; s < 0.9; s += 0.06) {
        const y = cy + Math.sin(a) * amp * (1 - 2 * s), z = Math.cos(a) * (1 - 2 * s);
        put(x + (rnd() - 0.5) * 6, y, z * 0.8, 4 + rnd() * 2.5);
      }
  }
  for (let i = 0; i < 260; i++) beads.push({ x: rnd() * w * 0.45, y: rnd() * h, z: rnd() * 2 - 1, r: 2 + rnd() * 6, c: Math.floor(rnd() * C.length) });
  beads.sort((a, b) => a.z - b.z);
  const bg = !ground ? '' : dark ? `<rect width="${w}" height="${h}" fill="${SCIENCE.night}"/><rect width="${w}" height="${h}" fill="url(#hg)"/>` : `<rect width="${w}" height="${h}" fill="#E4E8F7"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"><defs>${grads}<linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${SCIENCE.night}"/><stop offset="1" stop-color="${SCIENCE.indigo}"/></linearGradient></defs>${bg}${beads
    .map((b) => `<circle cx="${n(b.x)}" cy="${n(b.y)}" r="${n(b.r * (0.75 + 0.35 * (b.z + 1) / 2))}" fill="url(#h${b.c})" opacity="${n(0.55 + 0.45 * (b.z + 1) / 2)}"/>`)
    .join('')}</svg>`;
}

// "Protein render": the product's molecule as a dense cluster in teal / magenta / lavender / gold on night blue.
export function proteinSvg(p: Product, w = 800, h = 800) {
  const S2 = 220;
  if (hasBallStick(p.slug)) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S2} ${S2}" width="${w}" height="${h}"><rect width="${S2}" height="${S2}" fill="${SCIENCE.night}"/>${ballStickArt(p, S2 * 0.5, S2 * 0.5, S2 * 0.92, S2 * 0.8, '#1FA6A0', { rotate: -1.0 })}</svg>`;
  const art = moleculeArt({ ...p, color: '#1FA6A0' }, S2 * 0.5, S2 * 0.52, S2 * 0.8, S2 * 0.8, '#1FA6A0', { palette: 'spectrum' });
  const recol = art.replace(/#E57AB5/g, '#C4458F').replace(/#33BFA8/g, '#E8C547').replace(/#4C8DE0/g, '#B9A9F2').replace(/#8C6AD6/g, '#A44FA0');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S2} ${S2}" width="${w}" height="${h}"><rect width="${S2}" height="${S2}" fill="${SCIENCE.night}"/>${recol}</svg>`;
}
