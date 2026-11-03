import { Product } from '@/types';
import { moleculeArt } from './molecule';
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
  const art = hasShape(p.slug)
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
