import 'server-only';
import { readFileSync } from 'fs';
import path from 'path';
import { Product } from '@/types';
import { BAND, FRONT, frontPanel, scene } from './svg';

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

export function usesPhoto(p: Product) {
  return !p.bundleComponents?.length && (p.form === 'capsules' || p.form === 'softgels');
}

const r = (v: number) => Math.round(v * 100) / 100;

// Framed tight so the bottle fills ~90% of the image height, as competitors' Shopping images do.
// `closeUp` crops to the label for a detail shot (the second gallery image).
// `art` draws a custom label (label units, x from -ext to FRONT.w + ext so it wraps round the bottle); default is the standard front panel.
export type LabelArt = (p: Product, ext: number) => string;
const defaultArt: LabelArt = (p, ext) => `
      <rect x="${r(-ext)}" y="0" width="${r(ext + 1)}" height="${BAND}" fill="${p.color}"/>
      <rect x="${FRONT.w - 1}" y="0" width="${r(ext + 1)}" height="${BAND}" fill="${p.color}"/>
      <rect x="${r(-ext)}" y="${BAND}" width="${r(FRONT.w + ext * 2)}" height="${FRONT.h - BAND}" fill="#fff"/>
      ${frontPanel(p, 'print')}`;

export function photoBottleSvg(p: Product, backdrop: 'scene' | 'white' = 'scene', closeUp = false, artFn: LabelArt = defaultArt) {
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
    clips.push(`<clipPath id="s${k}"><rect x="${r(xa - 0.4)}" y="${TOP - 2}" width="${r(xb - xa + 0.8)}" height="${BOTTOM - TOP + 4}"/></clipPath>`);
    strips.push(`<g clip-path="url(#s${k})"><use href="#art" transform="matrix(${r(kx * 1000) / 1000} 0 0 ${r(s * 1000) / 1000} ${r(xa - (FRONT.w / 2 + ua) * kx)} ${TOP})"/></g>`);
  }
  const bg = backdrop === 'white' ? '<rect width="1024" height="1024" fill="#fff"/>' : `<g transform="scale(2.56)">${scene(`ph-${p.slug}`)}</g>`;
  const blend = backdrop === 'white' ? '' : ' style="mix-blend-mode:multiply"';
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${closeUp ? '205 310 600 600' : '75 82 860 860'}">
  <defs>
    ${art}
    ${clips.join('')}
    <clipPath id="band"><rect x="${CX - R}" y="${TOP}" width="${R * 2}" height="${BOTTOM - TOP}"/></clipPath>
  </defs>
  ${bg}
  <image href="${photo}" width="1024" height="1024"${blend}/>
  <g>
    <g clip-path="url(#band)">
      ${strips.join('')}
      <rect x="${CX - R}" y="${TOP}" width="${R * 2}" height="1.2" fill="#000" opacity="0.10"/>
      <rect x="${CX - R}" y="${BOTTOM - 1.2}" width="${R * 2}" height="1.2" fill="#000" opacity="0.10"/>
      <image href="${photo}" width="1024" height="1024" style="mix-blend-mode:multiply"/>
      ${backdrop === 'white' ? '' : `<rect x="${CX - R}" y="${TOP}" width="${R * 2}" height="${BOTTOM - TOP}" fill="#f7f1e9" style="mix-blend-mode:multiply"/>`}
    </g>
  </g>
</svg>`;
}
