// At-home test kit packaging drafts (owner, 28 Nov: "modelled after our cards"). Each kit box copies the kit card on
// the site (components/tests/KitCard.tsx): white face, the one mosaic corner top-right in the service line's colour,
// a small colour square + category in caps, the kit name, what it measures, then the markers / sample line.
// The box adds a colour side panel (wordmark + category) and a footer band, so a shelf of kits reads by colour.
//   design/packaging/kits/<slug>.front.png   flat front panel (5" × 7" at 300 dpi), for the lab/printer brief
//   design/packaging/kits/<slug>.box.png     simple 3D mock-up (front + side) on the studio backdrop
//   design/packaging/kits/lineup.png         four boxes together
// Drafts only: final dielines come from the lab partner (IHD Lab) once they confirm box sizes and print options.
// Run: npx tsx --conditions=react-server scripts/kit-packaging.ts
import { readdirSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { wordmark as wm, ORANGE } from '@/lib/labels/svg';
// On the colour band and side panel the cross goes white (orange on saffron or berry turns muddy).
const wordmark = (cx: number, y: number, size: number, mode: 'print', color: string) => wm(cx, y, size, mode, color).split(`fill="${ORANGE}"`).join(`fill="${color}"`);
import { CORNER_TILES } from '@/components/brand/MosaicCorner';
import { TEST_KITS, TEST_CATEGORIES } from '@/lib/tests';

const NAVY = '#14213d';
const INK = '#1f2937';
const MUTED = '#6b7280';
const LINE = '#e5e7eb';
const CREAM = '#efe9df';
const OUT = 'design/packaging/kits';
const FONT_DIR = path.join(process.cwd(), 'assets/fonts');
const fontFiles = readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).map((f) => path.join(FONT_DIR, f));
const render = (svg: string, width: number) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const out = (file: string, png: Buffer) => { mkdirSync(path.dirname(file), { recursive: true }); writeFileSync(file, png); };

// Greedy word wrap by an average glyph width (good enough for drafts; Inter ≈ 0.53 em, Manrope ≈ 0.56 em).
function wrap(text: string, size: number, maxW: number, em = 0.53) {
  const words = text.split(' '), lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length * size * em > maxW && cur) { lines.push(cur); cur = w; } else cur = next;
  }
  if (cur) lines.push(cur);
  return lines;
}
const textLines = (lines: string[], x: number, y: number, lh: number, attrs: string) =>
  lines.map((l, i) => `<text x="${x}" y="${y + i * lh}" ${attrs}>${esc(l)}</text>`).join('');

const corner = (right: number, top: number, tile: number, color: string) => {
  const gap = tile * (3 / 11), step = tile + gap, x0 = right - 4 * step + gap;
  return CORNER_TILES.map((t) => `<rect x="${x0 + t.c * step}" y="${top + t.r * step}" width="${tile}" height="${tile}" rx="${tile * 0.16}" fill="${color}" opacity="${t.o}"/>`).join('');
};

// Front panel, 1500 × 2100 (5" × 7" at 300 dpi).
const W = 1500, H = 2100, M = 120;
function front(kit: (typeof TEST_KITS)[number]) {
  const cat = TEST_CATEGORIES.find((c) => c.id === kit.category)!;
  const color = cat.color;
  const nameLines = wrap(kit.name, 128, W - 2 * M - 120, 0.56);
  const nameY = 520;
  const shortY = nameY + nameLines.length * 140 + 40;
  const shortLines = wrap(kit.short, 52, W - 2 * M - 80);
  const n = kit.markers.length;
  const sample = kit.collection.replace(/,? at home/i, '');
  const metaY = shortY + shortLines.length * 72 + 70;
  // Inside: the markers, numbered like the "Test panel" card on the kit page.
  const listY = metaY + 150;
  const rows = kit.markers.slice(0, 7).map((mk, i) => {
    const y = listY + 40 + i * 92;
    return `<line x1="${M}" y1="${y - 58}" x2="${W - M}" y2="${y - 58}" stroke="${LINE}" stroke-width="3"/>
      <text x="${M}" y="${y}" font-family="Inter" font-size="30" fill="${MUTED}">${String(i + 1).padStart(2, '0')}</text>
      <text x="${M + 80}" y="${y}" font-family="Inter" font-weight="600" font-size="40" fill="${NAVY}">${esc(mk.name)}</text>`;
  }).join('');
  const listEnd = listY + 40 + (Math.min(n, 7) - 1) * 92 + 34;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="#ffffff"/>
    ${corner(W - 90, 90, 64, color)}
    <rect x="${M}" y="${M + 160}" width="30" height="30" rx="6" fill="${color}"/>
    <text x="${M + 52}" y="${M + 186}" font-family="Inter" font-weight="600" font-size="36" letter-spacing="3.6" fill="${MUTED}">${esc(cat.name.toUpperCase())}</text>
    ${textLines(nameLines, M, nameY, 140, `font-family="Manrope" font-weight="600" font-size="128" letter-spacing="-3" fill="${NAVY}"`)}
    ${textLines(shortLines, M, shortY, 72, `font-family="Inter" font-size="52" fill="${INK}" fill-opacity="0.82"`)}
    <text x="${M}" y="${metaY}" font-family="Inter" font-size="38" fill="${MUTED}">${n} ${n === 1 ? 'marker' : 'markers'} · ${esc(sample)} at home</text>
    <text x="${M}" y="${listY - 40}" font-family="Inter" font-weight="600" font-size="30" letter-spacing="3" fill="${MUTED}">WHAT IT MEASURES</text>
    ${rows}
    <line x1="${M}" y1="${listEnd}" x2="${W - M}" y2="${listEnd}" stroke="${LINE}" stroke-width="3"/>
    <rect x="0" y="${H - 250}" width="${W}" height="250" fill="${color}"/>
    <g transform="translate(0 0)">${wordmark(M + (3.46 * 92) / 2, H - 100, 92, 'print', '#ffffff')}</g>
    <text x="${W - M}" y="${H - 140}" text-anchor="end" font-family="Inter" font-weight="600" font-size="38" fill="#ffffff">At-home test kit</text>
    <text x="${W - M}" y="${H - 86}" text-anchor="end" font-family="Inter" font-size="32" fill="#ffffff" fill-opacity="0.85">Prepaid return · Results online · 18+</text>
  </svg>`;
}

// Side panel (1.75" deep): the service-line colour with the wordmark running up, like the bottle label's edge.
const D = 525;
function side(kit: (typeof TEST_KITS)[number]) {
  const cat = TEST_CATEGORIES.find((c) => c.id === kit.category)!;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${D}" height="${H}" viewBox="0 0 ${D} ${H}">
    <rect width="${D}" height="${H}" fill="${cat.color}"/>
    <g transform="translate(${D / 2 + 40} ${H / 2}) rotate(-90)">${wordmark(0, 0, 150, 'print', '#ffffff')}</g>
    <text transform="translate(${D / 2 - 120} ${H - 140}) rotate(-90)" font-family="Inter" font-weight="600" font-size="34" letter-spacing="3.4" fill="#ffffff" fill-opacity="0.9">${esc(cat.name.toUpperCase())}</text>
  </svg>`;
}

// A plain 3D mock-up: front face, side face skewed back, soft floor shadow, on the studio cream.
function boxMock(kit: (typeof TEST_KITS)[number], scale = 0.42) {
  const f = `data:image/png;base64,${render(front(kit), W).toString('base64')}`;
  const s = `data:image/png;base64,${render(side(kit), D).toString('base64')}`;
  const fw = W * scale, fh = H * scale, sw = D * scale * 0.55, rise = 46 * scale * 2;
  return { fw, fh, sw, rise, body: (x: number, y: number) => `
    <ellipse cx="${x + fw / 2 + sw / 2}" cy="${y + fh + 6}" rx="${fw * 0.62}" ry="${18}" fill="#000" opacity="0.10" filter="url(#blur)"/>
    <image href="${f}" x="${x}" y="${y}" width="${fw}" height="${fh}" preserveAspectRatio="none"/>
    <rect x="${x}" y="${y}" width="${fw}" height="${fh}" fill="none" stroke="#000" stroke-opacity="0.06" stroke-width="1.5"/>
    <g transform="matrix(1 ${-rise / sw} 0 1 ${x + fw} ${y})">
      <image href="${s}" x="0" y="0" width="${sw}" height="${fh}" preserveAspectRatio="none"/>
      <rect x="0" y="0" width="${sw}" height="${fh}" fill="#000" opacity="0.14"/>
    </g>
    <path d="M${x} ${y} L${x + fw} ${y} L${x + fw + sw} ${y - rise} L${x + sw} ${y - rise} Z" fill="#f4f4f2" stroke="#000" stroke-opacity="0.05"/>` };
}
const defs = `<defs><filter id="blur" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="10"/></filter></defs>`;

const kits = TEST_KITS.filter((k) => !k.pets);
for (const k of kits) {
  out(`${OUT}/${k.slug}.front.png`, render(front(k), W));
  const b = boxMock(k);
  const cw = 1100, ch = 1100, x = (cw - b.fw - b.sw) / 2, y = (ch - b.fh) / 2 + b.rise / 2;
  out(`${OUT}/${k.slug}.box.png`, render(`<svg xmlns="http://www.w3.org/2000/svg" width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">${defs}<rect width="${cw}" height="${ch}" fill="${CREAM}"/>${b.body(x, y)}</svg>`, cw));
}
// Line-up: the four launch-candidate kits, one per colour.
const four = ['iron-test', 'perimenopause-test', 'thyroid-test', 'cholesterol-test'].map((s) => kits.find((k) => k.slug === s)!);
const mocks = four.map((k) => boxMock(k, 0.25));
const gapX = 50, totalW = mocks.reduce((a, m) => a + m.fw + m.sw, 0) + gapX * 3;
const LW = 2000, LH = 1100;
let lx = (LW - totalW) / 2;
const body = mocks.map((m) => { const s = m.body(lx, (LH - m.fh) / 2 + m.rise / 2); lx += m.fw + m.sw + gapX; return s; }).join('');
out(`${OUT}/lineup.png`, render(`<svg xmlns="http://www.w3.org/2000/svg" width="${LW}" height="${LH}" viewBox="0 0 ${LW} ${LH}">${defs}<rect width="${LW}" height="${LH}" fill="${CREAM}"/>${body}</svg>`, LW));
console.log(`${kits.length} kits → ${OUT}`);
