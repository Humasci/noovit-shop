// Logo files for outside use (AI image tools, partners): the real wordmark in Funnel Display Medium with the mosaic
// cross, rendered with our font files (assets/fonts), never a system fallback font.
// Run: npx tsx --conditions=react-server scripts/brand-logo.ts → design/brand/*.png
import { readdirSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { wordmark, mosaicCross, NAVY, ORANGE } from '@/lib/labels/svg';

const FONT_DIR = path.join(process.cwd(), 'assets/fonts');
const fontFiles = readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).map((f) => path.join(FONT_DIR, f));
const png = (svg: string, width: number) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();

mkdirSync('design/brand', { recursive: true });
for (const [name, bg, fg] of [['noovit-logo-navy', '#ffffff', NAVY], ['noovit-logo-white', '#1E2A3A', '#ffffff']] as const) {
  // Baseline 285 centres the word and the raised cross vertically in the 360-unit-high canvas.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360"><rect width="1200" height="360" fill="${bg}"/>${wordmark(600, 285, 260, 'print', fg)}</svg>`;
  writeFileSync(`design/brand/${name}.png`, png(svg, 2400));
}
writeFileSync('design/brand/noovit-mosaic-cross.png', png(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect width="600" height="600" fill="#ffffff"/>${mosaicCross(100, 100, 400, ORANGE)}</svg>`, 1200));
console.log('design/brand: logo PNGs written');
