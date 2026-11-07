// The site-wide social share image (Open Graph / X), used by every page that has no image of its own (home, shop,
// goals, about...). 1200×630, science palette. Writes app/opengraph-image.png. Usage: npx tsx scripts/og-default.ts
import { readdirSync, writeFileSync } from 'fs';
import { Resvg } from '@resvg/resvg-js';
import { cellsSvg, SCIENCE as S } from '@/lib/labels/web-art';
import { wordmark } from '@/lib/labels/svg';

const W = 1200, H = 630;
const nest = (svg: string) => { const end = svg.indexOf('>'); return `${svg.slice(0, end).replace(/\s(width|height|x|y)="[^"]*"/g, '')} x="0" y="0" width="${W}" height="${H}"${svg.slice(end)}`; };
const head = (y: number, t: string, size: number) => `<text x="80" y="${y}" font-size="${size}" font-weight="600" letter-spacing="${-size * 0.025}" fill="#fff" font-family="Manrope">${t}</text>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  ${nest(cellsSvg('og-default', true, W, H))}
  <rect width="${W}" height="${H}" fill="${S.night}" opacity="0.35"/>
  <text x="82" y="130" font-size="22" font-weight="600" letter-spacing="5" fill="#fff" opacity="0.75" font-family="Inter">EVIDENCE-LED SUPPLEMENTS</text>
  ${head(260, 'The dose on the front', 72)}${head(338, 'of every bottle.', 72)}
  <text x="82" y="420" font-size="28" fill="#fff" opacity="0.85" font-family="Inter">Graded research guides · Free US shipping · 90-day guarantee</text>
  ${wordmark(80 + (3.46 * 54) / 2, 545, 54, 'print', '#ffffff')}
</svg>`;
const fontFiles = readdirSync('assets/fonts').filter((f) => f.endsWith('.ttf')).map((f) => `assets/fonts/${f}`);
writeFileSync('app/opengraph-image.png', new Resvg(svg, { fitTo: { mode: 'width', value: W }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng());
writeFileSync('app/opengraph-image.alt.txt', 'Noovit: evidence-led supplements with the dose on the front of every bottle.');
console.log('app/opengraph-image.png');
