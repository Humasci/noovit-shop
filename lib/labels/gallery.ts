import 'server-only';
import { Product } from '@/types';
import { bottle, shade, wordmark, wrap } from './svg';
import { photoBottleSvg, usesPhoto } from './photo';
import { COMPARE, GalleryVariant, HIGHLIGHTS } from './gallery-data';

// Extra gallery images for the core products (1000 × 1000), in the spirit of FourFive's: the bottle on a light tint
// of its colour with three fact callouts, and a plain dose comparison for products with an above-average dose.

const NAVY = '#14213d';
const INK = '#4b5563';
const PAPER = '#faf8f3';
const H = `font-family="'Manrope'"`;
const B = `font-family="'Inter'"`;
const n = (v: number) => Math.round(v * 100) / 100;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// Product colour mixed into white: the light studio tint behind the bottle.
function tint(hex: string, k: number): `#${string}` {
  const c = (hex.match(/\w\w/g) ?? []).map((h) => Math.round(255 - (255 - parseInt(h, 16)) * k));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const caps = (x: number, y: number, t: string, size: number, fill: string, anchor = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="600" letter-spacing="${n(size * 0.16)}" fill="${fill}" ${B}>${esc(t.toUpperCase())}</text>`;

// The bottle, as its own nested image so it can be placed and scaled freely.
function bottleAt(p: Product, x: number, y: number, size: number, bg: `#${string}`) {
  if (usesPhoto(p)) {
    // The photo's own background is a touch darker than the flat tint, so its edges fade out instead of showing a box.
    const id = `fade-${x}-${y}`;
    return `<defs><radialGradient id="${id}g" cx="0.5" cy="0.5" r="0.5"><stop offset="0.72" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
      <mask id="${id}" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${size}" height="${size}"><rect x="${x}" y="${y}" width="${size}" height="${size}" fill="url(#${id}g)"/></mask></defs>
      <g mask="url(#${id})">${photoBottleSvg(p, bg).replace('<svg ', `<svg x="${x}" y="${y}" width="${size}" height="${size}" `)}</g>`;
  }
  // Drawn bottles and tubs: 400 × 460 drawing box centred on x = 200.
  const s = size / 460;
  return `<g transform="translate(${n(x + size / 2 - 200 * s)} ${n(y)}) scale(${n(s)})">${bottle(p, 'print', `g-${p.slug}`)}</g>`;
}

// A few square tiles falling from the top-right corner: the brand's mosaic, quietly.
function tiles(color: string) {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const out: string[] = [];
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 9; c++) {
      const w = (1 - r / 6) * (1 - c / 9);
      if (rnd() < w * 1.3) out.push(`<rect x="${960 - c * 22}" y="${20 + r * 22}" width="16" height="16" rx="2" fill="${color}" opacity="${n(0.15 + 0.5 * w * rnd())}"/>`);
    }
  return out.join('');
}

function highlights(p: Product) {
  const items = HIGHLIGHTS[p.slug];
  const bg = tint(p.color, 0.14);
  const dark = shade(p.color, 0.3);
  const callouts = items
    .map(([value, caption], i) => {
      const y = 340 + i * 190;
      const [num, unit] = value.match(/^([\d,.]+)\s(mg|g)$/)?.slice(1) ?? [value, ''];
      const big = num.length > 6 ? 58 : 72;
      return `${i ? `<rect x="70" y="${y - 110}" width="360" height="1.5" fill="${NAVY}" opacity="0.15"/>` : ''}
        <text x="66" y="${y}" font-size="${big}" font-weight="700" letter-spacing="${n(-0.03 * big)}" fill="${dark}" ${H}>${esc(num)}${unit ? `<tspan font-size="${n(big * 0.45)}" font-weight="600" dx="6">${unit}</tspan>` : ''}</text>
        ${wrap(caption, 350, 24, 0.5).slice(0, 2).map((l, k) => `<text x="70" y="${y + 40 + k * 30}" font-size="24" font-weight="500" fill="${INK}" ${B}>${esc(l)}</text>`).join('')}`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
  <rect width="1000" height="1000" fill="${bg}"/>
  ${tiles(p.color)}
  ${caps(70, 130, "In every serving", 20, dark)}
  <text x="68" y="190" font-size="48" font-weight="600" letter-spacing="-1" fill="${NAVY}" ${H}>${esc(p.name)}</text>
  ${callouts}
  ${bottleAt(p, 450, 215, 560, bg)}
  ${wordmark(70 + 3.46 * 30 / 2, 940, 30, 'print')}
</svg>`;
}

function compare(p: Product) {
  const c = COMPARE[p.slug];
  const dark = shade(p.color, 0.3);
  const max = Math.max(c.ours.value, c.typical.high) * 1.15;
  const X0 = 70, W = 860;
  const w = (v: number) => (v / max) * W;
  const bar = (y: number, label: string, valueText: string, solid: number, faded: number, fill: string) => `
    ${caps(X0, y - 18, label, 18, NAVY)}
    <rect x="${X0}" y="${y}" width="${n(w(solid))}" height="72" rx="4" fill="${fill}"/>
    ${faded > solid ? `<rect x="${n(X0 + w(solid) + 3)}" y="${y}" width="${n(w(faded) - w(solid) - 3)}" height="72" rx="4" fill="${fill}" opacity="0.45"/>` : ''}
    <text x="${n(X0 + w(faded) + 18)}" y="${y + 48}" font-size="34" font-weight="700" fill="${NAVY}" ${H}>${esc(valueText)}</text>`;
  const typicalText = c.typical.low === c.typical.high ? `${c.typical.low} ${c.unit}` : `${c.typical.low}–${c.typical.high} ${c.unit}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
  <rect width="1000" height="1000" fill="${PAPER}"/>
  ${tiles(p.color)}
  ${caps(X0, 130, 'Dose per serving', 20, dark)}
  ${wrap(c.heading, 560, 46, 0.55).slice(0, 2).map((l, i) => `<text x="68" y="${195 + i * 56}" font-size="46" font-weight="600" letter-spacing="-1" fill="${NAVY}" ${H}>${esc(l)}</text>`).join('')}
  ${bottleAt(p, 650, 90, 330, PAPER)}
  <rect x="${X0}" y="470" width="1.5" height="330" fill="${NAVY}" opacity="0.25"/>
  ${bar(530, c.ours.label, `${c.ours.value} ${c.unit}`, c.ours.value, c.ours.value, p.color)}
  ${bar(700, c.typical.label, typicalText, c.typical.low, c.typical.high, '#9aa1ab')}
  ${wrap(c.footnote, 860, 18, 0.5).map((l, i) => `<text x="${X0}" y="${872 + i * 26}" font-size="18" fill="${INK}" ${B}>${esc(l)}</text>`).join('')}
  ${wordmark(70 + 3.46 * 26 / 2, 960, 26, 'print')}
</svg>`;
}

export function gallerySvg(p: Product, v: GalleryVariant) {
  return v === 'highlights' ? highlights(p) : compare(p);
}
