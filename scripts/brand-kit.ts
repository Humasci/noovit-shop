// Brand kit (24 Nov 2026): every logo rendered from the real wordmark (Funnel Display Medium + the five-tile mosaic
// cross) with our own font files, never a system font.
//   design/brand/logo/       logo files (navy, white, icon) for partners and AI image tools
//   design/brand/social/     profile pictures and banners at each platform's size (see design/brand/BRAND_KIT.md)
//   public/brand/            hosted logo images for emails and the Gmail signature
// Run: npx tsx --conditions=react-server scripts/brand-kit.ts
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import { wordmark, icon, mosaicCross, ORANGE } from '@/lib/labels/svg';
import { CORNER_TILES } from '@/components/brand/MosaicCorner';
import { TEST_CATEGORIES } from '@/lib/tests';

const NAVY = '#14213d'; // brand navy (lib/labels/svg.ts)
const CREAM = '#efe9df'; // studio backdrop (--studio)
const INK = '#1f2937';
const FONT_DIR = path.join(process.cwd(), 'assets/fonts');
const fontFiles = readdirSync(FONT_DIR).filter((f) => f.endsWith('.ttf')).map((f) => path.join(FONT_DIR, f));
const render = (svg: string, width: number) => new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng();
// On dark backgrounds the cross's lighter tiles use solid tints of orange (mixed with white) instead of transparency,
// which would turn them brown over navy. Same look as the cross on white.
const tint = (o: number) => '#' + [0xff, 0x5f, 0x00].map((c) => Math.round(c * o + 255 * (1 - o)).toString(16).padStart(2, '0')).join('');
const solidCross = (s: string) => s.replace(new RegExp(`fill="${ORANGE}" opacity="([0-9.]+)"`, 'g'), (_, o) => `fill="${tint(Number(o))}"`);
const out = (file: string, png: Buffer) => { mkdirSync(path.dirname(file), { recursive: true }); writeFileSync(file, png); };
const svg = (w: number, h: number, body: string, bg?: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ''}${body}</svg>`;

// The wordmark is 3.46 em wide (word 3.02 em + cross 0.44 em); the cross rises 0.8 em above the baseline.
const WM_W = 3.46, WM_TOP = 0.8;
// A tight wordmark: `size` = font size, transparent unless bg given.
function logo(size: number, color: string, bg?: string, pad = 0.12) {
  const p = size * pad, w = Math.ceil(WM_W * size + 2 * p), h = Math.ceil(WM_TOP * size + 2 * p);
  const mark = wordmark(w / 2, p + WM_TOP * size, size, 'print', color);
  return { w, h, svg: svg(w, h, color === '#ffffff' ? solidCross(mark) : mark, bg) };
}
// The n⁺ icon centred in a square, at `scale` of the square (circle crops need room: ~0.62).
const iconSquare = (s: number, fg: string, accent: string, bg: string, scale = 0.62) =>
  svg(s, s, `<g transform="translate(${(s * (1 - scale)) / 2} ${(s * (1 - scale)) / 2}) scale(${(s * scale) / 100})">${solidCross(icon(fg, accent))}</g>`, bg);

// Mosaic tiles breaking out of the top-right corner (seeded, so every run is identical).
function mosaicCorner(W: number, H: number, tile: number, cols: number, rows: number) {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const gap = tile * 0.22, out: string[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const d = Math.hypot(c / cols, r / rows); // 0 at the corner
    const o = Math.max(0, 0.85 - d * 1.05) * (0.55 + rnd() * 0.45);
    if (o < 0.08 || rnd() < d * 0.5) continue;
    out.push(`<rect x="${W - (c + 1) * (tile + gap)}" y="${r * (tile + gap)}" width="${tile}" height="${tile}" rx="${tile * 0.12}" fill="${ORANGE}" opacity="${o.toFixed(2)}"/>`);
  }
  return out.join('');
}

const lineup = `data:image/png;base64,${readFileSync('public/images/lineup-5.png').toString('base64')}`; // 1600×1200, cream backdrop
const TAGLINE = 'Evidence-led wellness.';
const SUB = 'Supplements and at-home health tests.';

// A banner: cream, logo + tagline on the left of the safe area, the bottle line-up on the right, tiles in the corner.
function banner(W: number, H: number, safe: { x: number; y: number; w: number; h: number }) {
  const s = Math.min(safe.h * 0.26, safe.w * 0.075); // logo size from the safe area
  const textX = safe.x + safe.w * 0.04;
  const midY = safe.y + safe.h / 2;
  const imgH = Math.min(safe.h * 1.15, H); // the line-up can bleed a little beyond the safe height
  const imgW = imgH * (1600 / 1200);
  const imgX = Math.min(safe.x + safe.w, W * 0.86) - imgW * 0.92; // keep the top-right corner free for the tiles
  const imgY = midY - imgH / 2;
  const tile = Math.max(8, Math.min(W, H) * 0.035);
  const body = `<image href="${lineup}" x="${imgX}" y="${imgY}" width="${imgW}" height="${imgH}" preserveAspectRatio="xMidYMid meet"/>
    ${mosaicCorner(W, H, tile, Math.ceil((W * 0.22) / (tile * 1.22)), Math.ceil((H * 0.45) / (tile * 1.22)))}
    ${wordmark(textX + (WM_W * s) / 2, midY - s * 0.05, s, 'print', NAVY)}
    <text x="${textX}" y="${midY + s * 0.62}" font-family="Manrope" font-weight="600" font-size="${s * 0.34}" fill="${NAVY}">${TAGLINE}</text>
    <text x="${textX}" y="${midY + s * 1.05}" font-family="Inter" font-weight="500" font-size="${s * 0.25}" fill="${INK}" fill-opacity="0.75">${SUB}</text>`;
  return svg(W, H, body, CREAM);
}

// ---------- logo files ----------
for (const [name, color, bg] of [['noovit-logo-navy', NAVY, '#ffffff'], ['noovit-logo-white-on-navy', '#ffffff', NAVY], ['noovit-logo-navy-transparent', NAVY, undefined], ['noovit-logo-white-transparent', '#ffffff', undefined]] as const) {
  const l = logo(300, color, bg, 0.3);
  out(`design/brand/logo/${name}.png`, render(l.svg, l.w * 2));
}
out('design/brand/logo/noovit-icon-navy.png', render(iconSquare(1024, '#ffffff', ORANGE, NAVY, 0.7), 1024));
out('design/brand/logo/noovit-icon-white.png', render(iconSquare(1024, NAVY, ORANGE, '#ffffff', 0.7), 1024));
out('design/brand/logo/noovit-mosaic-cross.png', render(svg(600, 600, mosaicCross(100, 100, 400, ORANGE), '#ffffff'), 1200));

// ---------- hosted email assets (public/brand) ----------
// 2× images, shown at 132 px wide in emails.
{
  const l = logo(100, NAVY, undefined, 0.04);
  out('public/brand/noovit-logo-email.png', render(l.svg, 264));
  out('public/brand/noovit-icon-email.png', render(iconSquare(256, '#ffffff', ORANGE, NAVY, 0.7), 128));
}

// ---------- social ----------
const avatar = (file: string, size: number) => out(file, render(iconSquare(size, '#ffffff', ORANGE, NAVY), size));
const S = 'design/brand/social';
// Meta (Facebook page): profile 720 (shown as a circle), cover 1640×624 (mobile crops the sides: keep content in the centre 1200).
avatar(`${S}/meta/facebook-profile-720.png`, 720);
out(`${S}/meta/facebook-cover-1640x624.png`, render(banner(1640, 624, { x: 220, y: 80, w: 1200, h: 464 }), 1640));
// Instagram: profile 1080 (circle).
avatar(`${S}/instagram/instagram-profile-1080.png`, 1080);
// Story highlight covers (1080×1920, icon centred in the circle crop).
for (const [k, label] of [['shop', 'Shop'], ['science', 'Science'], ['tests', 'Tests'], ['reviews', 'Reviews']] as const) {
  out(`${S}/instagram/highlight-${k}-1080x1920.png`, render(svg(1080, 1920, `<g transform="translate(340 760) scale(4)">${solidCross(icon('#ffffff', ORANGE))}</g><text x="540" y="1260" text-anchor="middle" font-family="Manrope" font-weight="600" font-size="64" fill="#ffffff">${label}</text>`, NAVY), 1080));
}
// TikTok: profile 1080 (circle, shown at 200).
avatar(`${S}/tiktok/tiktok-profile-1080.png`, 1080);
// X: profile 400 (circle), header 1500×500 (the profile picture covers the bottom-left; keep content right of x 360).
avatar(`${S}/x/x-profile-400.png`, 400);
out(`${S}/x/x-header-1500x500.png`, render(banner(1500, 500, { x: 380, y: 60, w: 1060, h: 380 }), 1500));
// LinkedIn company page: logo 400, cover 1128×191 (the logo overlaps the bottom-left).
avatar(`${S}/linkedin/linkedin-logo-400.png`, 400);
out(`${S}/linkedin/linkedin-cover-1128x191.png`, render(banner(1128, 191, { x: 280, y: 20, w: 820, h: 151 }), 2256));
// YouTube: profile 800 (circle), banner 2560×1440 (safe area for all devices: the centre 1546×423), watermark 150.
avatar(`${S}/youtube/youtube-profile-800.png`, 800);
out(`${S}/youtube/youtube-banner-2560x1440.png`, render(banner(2560, 1440, { x: 507, y: 508, w: 1546, h: 423 }), 2560));
out(`${S}/youtube/youtube-watermark-150.png`, render(iconSquare(150, '#ffffff', ORANGE, NAVY, 0.72), 150));

// ---------- kit corner shape (packaging reference) ----------
// The fixed mosaic corner used on at-home test kit cards, in each service line's colour, on the kit-box cream.
// For packaging: the shape sits in the top-right corner of the box front. One PNG per line + one sheet of all.
{
  const corner = (color: string, x: number, y: number, tile: number) => {
    const step = tile * (14 / 11);
    return CORNER_TILES.map((t) => `<rect x="${x + t.c * step}" y="${y + t.r * step}" width="${tile}" height="${tile}" rx="${tile * 0.16}" fill="${color}" opacity="${t.o}"/>`).join('');
  };
  const lines = TEST_CATEGORIES.filter((c) => c.id !== 'pets');
  for (const c of lines) {
    out(`design/brand/mosaic-corner/corner-${c.id}.png`, render(svg(600, 600, corner(c.color, 90, 90, 88), CREAM), 1200));
  }
  const cell = 300;
  const sheet = lines.map((c, i) => {
    const x = (i % 4) * cell, y = Math.floor(i / 4) * (cell + 40);
    return `<rect x="${x + 20}" y="${y + 20}" width="${cell - 40}" height="${cell - 40}" rx="24" fill="${CREAM}"/>${corner(c.color, x + cell - 20 - 20 - 4 * 30 * (14 / 11) + 8, y + 40, 30)}
      <text x="${x + 40}" y="${y + cell - 44}" font-family="Manrope" font-weight="600" font-size="20" fill="${NAVY}">${c.name.replace(/&/g, '&amp;')}</text>
      <text x="${x + 40}" y="${y + cell + 8}" font-family="Inter" font-size="16" fill="${INK}">${c.color}</text>`;
  }).join('');
  out('design/brand/mosaic-corner/all-service-lines.png', render(svg(cell * 4, 2 * (cell + 40), sheet, '#ffffff'), cell * 8));
}

console.log('brand kit written: design/brand/logo, design/brand/social, public/brand');
