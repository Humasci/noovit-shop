import 'server-only';
import { readFileSync } from 'fs';
import path from 'path';
import { Product } from '@/types';
import { FRONT, frontLabel, labelPaper, scene } from './svg';

// Photo mockup: our label wrapped onto Supliful's blank bottle photo (assets/mockups, 1024×1024).
// The label is sliced into thin vertical strips placed on a cylinder,
// and the photo is multiplied back over the label so its own light and shadow fall on the print.
// The supplier's stock capsules are edited out of the photo (assets/mockups/README.md), so ours don't look like every
// other brand on the same bottle.
const DIR = path.join(process.cwd(), 'assets/mockups');
let photoData: string | null = null;
const load = () => (photoData ??= `data:image/jpeg;base64,${readFileSync(path.join(DIR, 'bottle-photo.jpg')).toString('base64')}`);

// Bottle geometry measured on the photo (1024 px): body centre and radius, label top and bottom.
const CX = 505;
const R = 215;
const TOP = 372;
const BOTTOM = 846;
const STRIPS = 48;
// Seen from slightly above, the label's top and bottom edges are ellipses: at the front they sit lower than at the
// sides (measured on the photo: ~10 px at the shoulder seam, ~22 px near the base). The label follows that curve
// instead of a flat rectangle, so its corners turn round the bottle like a real wrap.
const BOW_TOP = 9;
const BOW_BOTTOM = 20;

export function usesPhoto(p: Product) {
  return !p.bundleComponents?.length && (p.form === 'capsules' || p.form === 'softgels');
}

const r = (v: number) => Math.round(v * 100) / 100;

// Framed tight so the bottle fills ~90% of the image height, as competitors' Shopping images do.
// `closeUp` crops to the label for a detail shot (the second gallery image).
// `art` draws a custom label (label units, x from -ext to FRONT.w + ext so it wraps round the bottle); default is the standard front panel.
export type LabelArt = (p: Product, ext: number) => string;
// E2 dark label (14 Nov, owner's pick): the deep product-colour paper wraps round to the bottle's sides; the front
// panel draws the type and the bright colour edge.
const defaultArt: LabelArt = (p, ext) => `
      <rect x="${r(-ext)}" y="0" width="${r(FRONT.w + ext * 2)}" height="${FRONT.h}" fill="${labelPaper(p)}"/>
      ${frontLabel(p, 'print', 0)}`;

// Studio lighting on the printed label (14 Nov): the photo's own shading barely shows through a dark label, so the
// cylinder is lit here. Key light from the front-left: a soft specular band left of centre and a fainter one on the
// right, the label turning away into shadow at both edges, a fine matte paper grain, a lit top lip and a shadow
// line under the bottom edge.
const X0 = CX - R;
const LIGHT_DEFS = `
    <linearGradient id="lt-roll" x1="${X0}" x2="${X0 + 2 * R}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#000" stop-opacity="0.62"/><stop offset="0.07" stop-color="#000" stop-opacity="0.34"/>
      <stop offset="0.2" stop-color="#000" stop-opacity="0.1"/><stop offset="0.36" stop-color="#000" stop-opacity="0"/>
      <stop offset="0.66" stop-color="#000" stop-opacity="0.04"/><stop offset="0.86" stop-color="#000" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.66"/>
    </linearGradient>
    <linearGradient id="lt-spec" x1="${X0}" x2="${X0 + 2 * R}" gradientUnits="userSpaceOnUse">
      <stop offset="0.18" stop-color="#fff" stop-opacity="0"/><stop offset="0.27" stop-color="#fff" stop-opacity="0.16"/>
      <stop offset="0.31" stop-color="#fff" stop-opacity="0.24"/><stop offset="0.36" stop-color="#fff" stop-opacity="0.1"/>
      <stop offset="0.46" stop-color="#fff" stop-opacity="0"/><stop offset="0.76" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.81" stop-color="#fff" stop-opacity="0.07"/><stop offset="0.86" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="lt-v" x1="0" y1="${TOP}" x2="0" y2="${BOTTOM}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff" stop-opacity="0.05"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.12"/>
    </linearGradient>
    <filter id="lt-grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>
      <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.9 0"/>
    </filter>`;
const lighting = () => `
      <rect x="${X0}" y="${TOP}" width="${2 * R}" height="${BOTTOM - TOP + BOW_BOTTOM}" filter="url(#lt-grain)" opacity="0.07" style="mix-blend-mode:overlay"/>
      <rect x="${X0}" y="${TOP}" width="${2 * R}" height="${BOTTOM - TOP + BOW_BOTTOM}" fill="url(#lt-v)"/>
      <rect x="${X0}" y="${TOP}" width="${2 * R}" height="${BOTTOM - TOP + BOW_BOTTOM}" fill="url(#lt-roll)"/>
      <rect x="${X0}" y="${TOP}" width="${2 * R}" height="${BOTTOM - TOP + BOW_BOTTOM}" fill="url(#lt-spec)" style="mix-blend-mode:screen"/>
      <path d="${edge(TOP, BOW_TOP)}" fill="none" stroke="#fff" stroke-width="1.6" opacity="0.22"/>
      <path d="${edge(BOTTOM - 1.2, BOW_BOTTOM)}" fill="none" stroke="#000" stroke-width="2.4" opacity="0.28"/>`;
// The label's top or bottom edge as a polyline round the cylinder (bow px lower at the front than at the sides).
const edge = (y: number, bow: number, reverse = false) => {
  const pts = Array.from({ length: 41 }, (_, i) => {
    const a = -Math.PI / 2 + (Math.PI * i) / 40;
    return `${r(CX + R * Math.sin(a))} ${r(y + bow * Math.cos(a))}`;
  });
  return 'M' + (reverse ? pts.reverse() : pts).join(' L');
};
const bandPath = () => `${edge(TOP, BOW_TOP)} L${edge(BOTTOM, BOW_BOTTOM, true).slice(1)} Z`;

// `backdrop`: the cream scene, plain white (feeds), or a hex tint (gallery images), multiplied under the photo.
export function photoBottleSvg(p: Product, backdrop: 'scene' | 'white' | `#${string}` = 'scene', closeUp = false, artFn: LabelArt = defaultArt) {
  const photo = load();
  const s = (BOTTOM - TOP) / FRONT.h; // px per label unit
  const ext = (R * Math.PI) / 2 / s - FRONT.w / 2; // label units needed to wrap to the bottle's sides
  const art = `<g id="art">${artFn(p, ext)}</g>`;
  const clips: string[] = [];
  const strips: string[] = [];
  for (let k = 0; k < STRIPS; k++) {
    const a = -Math.PI / 2 + (Math.PI * k) / STRIPS;
    const b = a + Math.PI / STRIPS;
    const xa = CX + R * Math.sin(a);
    const xb = CX + R * Math.sin(b);
    const ua = (R * a) / s; // label units from the panel centre
    const ub = (R * b) / s;
    const kx = (xb - xa) / (ub - ua);
    const c = Math.cos((a + b) / 2); // 1 at the front, 0 at the silhouette
    const t = TOP + BOW_TOP * c, bt = BOTTOM + BOW_BOTTOM * c;
    const sy = (bt - t) / FRONT.h;
    clips.push(`<clipPath id="s${k}"><rect x="${r(xa - 1)}" y="${r(t)}" width="${r(xb - xa + 2)}" height="${r(bt - t)}"/></clipPath>`); // 1 px overlap: no seams when scaled down
    strips.push(`<g clip-path="url(#s${k})"><use href="#art" transform="matrix(${r(kx * 1000) / 1000} 0 0 ${r(sy * 1000) / 1000} ${r(xa - (FRONT.w / 2 + ua) * kx)} ${r(t)})"/></g>`);
  }
  const tint = backdrop === 'scene' ? '#f7f1e9' : backdrop === 'white' ? null : backdrop;
  const bg =
    backdrop === 'white' ? '<rect width="1024" height="1024" fill="#fff"/>'
    : backdrop === 'scene' ? `<g transform="scale(2.56)">${scene(`ph-${p.slug}`)}</g>`
    : `<rect width="1024" height="1024" fill="${backdrop}"/>`;
  const blend = backdrop === 'white' ? '' : ' style="mix-blend-mode:multiply"';
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${closeUp ? '205 310 600 600' : '75 82 860 860'}">
  <defs>
    ${art}
    ${clips.join('')}
    <clipPath id="band"><path d="${bandPath()}"/></clipPath>
    ${LIGHT_DEFS}
  </defs>
  ${bg}
  <image href="${photo}" width="1024" height="1024"${blend}/>
  <g>
    <g clip-path="url(#band)">
      ${strips.join('')}
      <path d="${edge(TOP + 0.6, BOW_TOP)}" fill="none" stroke="#000" stroke-width="1.2" opacity="0.10"/>
      <path d="${edge(BOTTOM - 0.6, BOW_BOTTOM)}" fill="none" stroke="#000" stroke-width="1.2" opacity="0.10"/>
      <image href="${photo}" width="1024" height="1024" style="mix-blend-mode:multiply"/>
      ${tint ? `<rect x="${CX - R}" y="${TOP}" width="${R * 2}" height="${BOTTOM - TOP + BOW_BOTTOM}" fill="${tint}" style="mix-blend-mode:multiply"/>` : ''}
      ${lighting()}
    </g>
  </g>
</svg>`;
}
