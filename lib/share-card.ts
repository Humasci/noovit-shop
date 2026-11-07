import { readdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { ORANGE, wordmark, wrap } from '@/lib/labels/svg';

// 1200 × 630 social share card (Open Graph / X) shared by guides and Journal posts: a small label, the title, a footer
// line, the wordmark and a corner of mosaic tiles, in the science palette.
const NAVY = '#141A4D';
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const FONT_DIR = path.join(process.cwd(), 'assets/fonts');

function svg(kicker: string, title: string, footer: string) {
  const size = title.length > 70 ? 54 : 64;
  const lines = wrap(title, 900, size, 0.55).slice(0, 4);
  const tiles: string[] = [];
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let r = 0; r < 7; r++)
    for (let c = 0; c < 12; c++) {
      const w = (1 - r / 7) * (1 - c / 12);
      if (rnd() < w * 1.4) tiles.push(`<rect x="${1160 - c * 26}" y="${22 + r * 26}" width="20" height="20" rx="2.5" fill="${ORANGE}" opacity="${(0.15 + 0.6 * w * rnd()).toFixed(2)}"/>`);
    }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  ${tiles.join('')}
  <text x="80" y="150" font-size="22" font-weight="600" letter-spacing="3.5" fill="#3E5BD6" font-family="'Inter'">${esc(kicker)}</text>
  ${lines.map((l, i) => `<text x="76" y="${240 + i * size * 1.12}" font-size="${size}" font-weight="600" letter-spacing="-1.5" fill="${NAVY}" font-family="'Manrope'">${esc(l)}</text>`).join('')}
  <text x="80" y="540" font-size="24" font-weight="500" fill="#5b6472" font-family="'Inter'">${esc(footer)}</text>
  ${wordmark(1120 - (3.46 * 40) / 2, 552, 40, 'print')}
</svg>`;
}

export function shareCardPng(kicker: string, title: string, footer: string) {
  const fontFiles = readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).map((f) => path.join(FONT_DIR, f));
  return new Resvg(svg(kicker, title, footer), { fitTo: { mode: 'width', value: 1200 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
}
