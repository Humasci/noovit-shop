import { readdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { findGuide } from '@/lib/guides';
import { ORANGE, wordmark, wrap } from '@/lib/labels/svg';

// 1200 × 630 social image for a guide (Open Graph / X cards): title, source count, wordmark, a corner of mosaic tiles.
const NAVY = '#14213d';
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const FONT_DIR = path.join(process.cwd(), 'assets/fonts');

function svg(title: string, sources: number) {
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
  <rect width="1200" height="630" fill="#f6f4ef"/>
  ${tiles.join('')}
  <text x="80" y="150" font-size="22" font-weight="600" letter-spacing="3.5" fill="#2f725d" font-family="'Inter'">SUPPLEMENT GUIDE · EVIDENCE-GRADED</text>
  ${lines.map((l, i) => `<text x="76" y="${240 + i * size * 1.12}" font-size="${size}" font-weight="600" letter-spacing="-1.5" fill="${NAVY}" font-family="'Manrope'">${esc(l)}</text>`).join('')}
  <text x="80" y="540" font-size="24" font-weight="500" fill="#5b6472" font-family="'Inter'">${sources} sources · noovit.com/guides</text>
  ${wordmark(1120 - (3.46 * 40) / 2, 552, 40, 'print')}
</svg>`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const g = findGuide((await params).slug);
  if (!g) return new Response('Not found', { status: 404 });
  const title = g.h1 ?? `${g.ingredient}: benefits, uses, dosage & side effects`;
  const fontFiles = readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).map((f) => path.join(FONT_DIR, f));
  const png = new Resvg(svg(title, g.sources.length), { fitTo: { mode: 'width', value: 1200 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400, s-maxage=604800' } });
}
