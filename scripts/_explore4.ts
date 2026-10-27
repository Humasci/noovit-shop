import { writeFileSync, readdirSync } from 'fs';
import { Resvg } from '@resvg/resvg-js';
import { SEED_PRODUCTS } from '@/data/products';
import { labelCounts } from '@/lib/labels/svg';

const OUT = '/tmp/claude-0/-home-user-noovit-shop/735d34ee-e5f5-5126-a92e-a77d3bdffd66/scratchpad/explore/';
const fontFiles = readdirSync('assets/fonts').filter((f) => f.endsWith('.ttf')).map((f) => `assets/fonts/${f}`);
const png = (svg: string, w: number, file: string) =>
  writeFileSync(OUT + file, new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng());

const ORANGE = '#ff5f00', CREAM = '#fbf7f2';
const N = 'M20.33 0L9.00 0L9.00-38.58L3.25-38.58L3.25-50.00L15.08-50.00L15.08-42.08L18.58-42.08Q21.25-46.33 25.71-48.63Q30.17-50.92 36.50-50.92L36.50-50.92Q46.50-50.92 52.13-45.29Q57.75-39.67 57.75-30.25L57.75-30.25L57.75 0L46.42 0L46.42-28.25Q46.42-34.42 43.13-37.67Q39.83-40.92 33.42-40.92L33.42-40.92Q27.00-40.92 23.67-37.67Q20.33-34.42 20.33-28.25L20.33-28.25L20.33 0Z';
const n = (x: number, base: number, s: number, c: string) => `<path transform="translate(${x} ${base}) scale(${s / 100})" d="${N}" fill="${c}"/>`;
const sq = (x: number, y: number, s: number, c: string, o: number) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.12}" fill="${c}" opacity="${o}"/>`;
const cross = (x: number, y: number, s: number, c: string, g = s * 0.16) =>
  [[1, 0, 0.6], [0, 1, 0.4], [1, 1, 1], [2, 1, 0.8], [1, 2, 0.5]].map(([cx, cy, o]) => sq(x + cx * (s + g), y + cy * (s + g), s, c, o)).join('');
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const wrapText = (t: string, max: number) => { const out: string[] = []; let l = ''; for (const w of t.split(' ')) { if (l && (l + ' ' + w).length > max) { out.push(l); l = w; } else l = l ? l + ' ' + w : w; } if (l) out.push(l); return out; };

function bottle(slug: string, uid: string) {
  const p = SEED_PRODUCTS.find((x) => x.slug === slug)!;
  const { units } = labelCounts(p);
  const unit = { capsules: 'CAPSULES', softgels: 'SOFTGELS', chews: 'CHEWS', powder: 'SERVINGS' }[p.form];
  const words = p.name.split(' ');
  const name = words.length > 1 ? [words[0], words.slice(1).join(' ')] : [p.name];
  // Geometry (400×460 scene, viewed slightly from above so circles read as ellipses)
  const cx = 200, R = 94, X0 = cx - R, X1 = cx + R; // body radius
  const capR = 56, capTop = 64, capBot = 124, e = 0.12; // ellipse ratio (ry = r·e)
  const shoulderTop = 132, bodyTop = 180, base = 410;
  const LT = 190, LB = 388, split = 334; // label top/bottom, colour/white split
  const arc = (y: number, r: number, down = true) => `A${r} ${r * e} 0 0 ${down ? 0 : 1} ${cx + (down ? r : -r)} ${y}`;
  const body = `M${cx - 50} ${shoulderTop - 6} C${cx - 50} ${shoulderTop + 18} ${X0} ${shoulderTop + 16} ${X0} ${bodyTop} V${base} ${arc(base, R)} V${bodyTop} C${X1} ${shoulderTop + 16} ${cx + 50} ${shoulderTop + 18} ${cx + 50} ${shoulderTop - 6} Z`;
  const band = (y1: number, y2: number) => `M${X0} ${y1} ${arc(y1, R)} V${y2} A${R} ${R * e} 0 0 1 ${X0} ${y2} Z`;
  const ribs = Array.from({ length: 36 }, (_, i) => `<rect x="${cx - capR + 2 + i * 3.05}" y="${capTop}" width="1.2" height="${capBot - capTop + capR * e}" fill="#000" opacity="${0.05 + 0.05 * Math.abs(Math.sin(i / 5))}"/>`).join('');
  const room = R * 2 - 56;
  const fs = Math.min(23, room / (Math.max(...name.map((t) => t.length)) * 0.6));
  const ben = wrapText(p.shortBenefit.replace(/\.$/, '') + '*', 28).slice(0, 2);
  const vSize = 22;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 460"><defs>
    <linearGradient id="bg${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${CREAM}"/><stop offset="0.82" stop-color="#f3ece3"/><stop offset="0.82" stop-color="#ebe2d6"/><stop offset="1" stop-color="#f2ebe2"/></linearGradient>
    <linearGradient id="cyl${uid}" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.30"/><stop offset="0.06" stop-color="#000" stop-opacity="0.12"/><stop offset="0.16" stop-color="#000" stop-opacity="0.02"/>
      <stop offset="0.27" stop-color="#fff" stop-opacity="0.38"/><stop offset="0.34" stop-color="#fff" stop-opacity="0.10"/><stop offset="0.6" stop-color="#000" stop-opacity="0.0"/>
      <stop offset="0.84" stop-color="#000" stop-opacity="0.08"/><stop offset="0.95" stop-color="#000" stop-opacity="0.22"/><stop offset="1" stop-color="#000" stop-opacity="0.34"/>
    </linearGradient>
    <linearGradient id="shoulder${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="#000" stop-opacity="0.04"/></linearGradient>
    <linearGradient id="cap${uid}" x1="0" x2="1"><stop offset="0" stop-color="#c8ced5"/><stop offset="0.25" stop-color="#ffffff"/><stop offset="0.55" stop-color="#f2f4f6"/><stop offset="1" stop-color="#b9c0c8"/></linearGradient>
    <radialGradient id="captop${uid}" cx="0.4" cy="0.4" r="0.7"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e7eb"/></radialGradient>
    <filter id="soft${uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="hl${uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
    <clipPath id="body${uid}"><path d="${body}"/></clipPath>
    <clipPath id="label${uid}"><path d="${band(LT, LB)}"/></clipPath>
  </defs>
  <rect width="400" height="460" fill="url(#bg${uid})"/>
  <ellipse cx="${cx}" cy="${base + 10}" rx="${R + 14}" ry="16" fill="#000" opacity="0.18" filter="url(#soft${uid})"/>
  <ellipse cx="${cx}" cy="${base + 3}" rx="${R - 6}" ry="7" fill="#000" opacity="0.18" filter="url(#hl${uid})"/>
  <g clip-path="url(#body${uid})">
    <rect x="${X0 - 10}" y="${shoulderTop - 20}" width="${R * 2 + 20}" height="${base - shoulderTop + 40}" fill="#fafafa"/>
    <rect x="${X0 - 10}" y="${shoulderTop - 20}" width="${R * 2 + 20}" height="${bodyTop - shoulderTop + 30}" fill="url(#shoulder${uid})"/>
    <g clip-path="url(#label${uid})">
      <rect x="${X0}" y="${LT - 20}" width="${R * 2}" height="${split - LT + 20}" fill="${p.color}"/>
      <path d="M${X0} ${split} ${arc(split, R)} V${LB + 20} H${X0} Z" fill="#fff"/>
      <g transform="translate(${X0 + 22} ${LT + 18}) scale(0.3)">${n(0, 82, 100, '#fff') + cross(60, 16, 7.4, ORANGE)}</g>
      ${name.map((t, i) => `<text x="${X0 + 24}" y="${LT + 86 + i * fs}" font-family="Funnel Display" font-weight="600" font-size="${fs.toFixed(1)}" letter-spacing="-0.3" fill="#fff">${esc(t)}</text>`).join('')}
      <text x="${X0 + 24}" y="${split - 16}" font-family="Inter" font-weight="500" font-size="8" fill="#fff" opacity="0.92">${esc(p.benefits.at(-1) ?? '')}</text>
      <g transform="translate(${X1 - 20} ${split - 16}) rotate(-90)">
        <text x="0" y="0" font-family="Funnel Display" font-weight="500" font-size="${vSize}" letter-spacing="-0.2"><tspan fill="#fff">noo</tspan><tspan fill="#fff" fill-opacity="0.62">vit</tspan></text>
        ${cross(2.977 * vSize + 1.2, -0.74 * vSize, vSize * 0.125, ORANGE)}
      </g>
      ${ben.map((t, i) => `<text x="${X0 + 24}" y="${split + 18 + i * 9}" font-family="Inter" font-size="6.8" fill="#4b5563">${esc(t)}</text>`).join('')}
      <text x="${X0 + 24}" y="${LB - 12}" font-family="Inter" font-weight="600" font-size="5.6" letter-spacing="0.9" fill="${p.color}">DIETARY SUPPLEMENT</text>
      <text x="${X1 - 24}" y="${split + 31}" text-anchor="end" font-family="Funnel Display" font-weight="600" font-size="24" fill="${p.color}">${units}</text>
      <text x="${X1 - 24}" y="${split + 41}" text-anchor="end" font-family="Inter" font-weight="600" font-size="5.4" letter-spacing="0.7" fill="${p.color}">${unit}</text>
    </g>
    <path d="${band(LT, LT + 0.01)}" fill="none"/>
    <path d="M${X0} ${LT} ${arc(LT, R)}" fill="none" stroke="#000" stroke-opacity="0.07" stroke-width="1"/>
    <path d="M${X0} ${LB} ${arc(LB, R)}" fill="none" stroke="#000" stroke-opacity="0.07" stroke-width="1"/>
    <rect x="${X0 - 10}" y="${shoulderTop - 20}" width="${R * 2 + 20}" height="${base - shoulderTop + 40}" fill="url(#cyl${uid})"/>
    <rect x="${cx - R * 0.5}" y="${bodyTop - 30}" width="9" height="${base - bodyTop + 10}" rx="4.5" fill="#fff" opacity="0.32" filter="url(#hl${uid})"/>
  </g>
  <path d="M${cx - 52} ${capBot + 4} A52 ${52 * e} 0 0 0 ${cx + 52} ${capBot + 4} V${capBot + 14} A52 ${52 * e} 0 0 1 ${cx - 52} ${capBot + 14} Z" fill="#e9ecef"/>
  <path d="M${cx - capR} ${capTop} V${capBot} ${arc(capBot, capR)} V${capTop} Z" fill="url(#cap${uid})"/>
  <g clip-path="none">${ribs}</g>
  <ellipse cx="${cx}" cy="${capTop}" rx="${capR}" ry="${capR * e}" fill="url(#captop${uid})" stroke="#d5dade" stroke-width="0.8"/>
</svg>`;
}
const slugs = ['magnesium-complex', 'glucosamine-complex', 'focus-complex', 'iron-complex'];
png(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 460">${slugs.map((s, i) => `<g transform="translate(${i * 400} 0)">${bottle(s, 'b' + i).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</g>`).join('')}</svg>`, 2000, 'bottle3d.png');
console.log('done');
