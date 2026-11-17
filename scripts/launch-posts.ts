// Launch social set (15 Nov), built from the real bottle-photo mockups with the approved E2 dark labels.
// Writes PNGs to design/social/launch/:
//   brand-intro.png        1080×1350  pre-launch: "The dose, on the front." + line-up, join the list
//   launch.png             1080×1350  launch day: "Now open." + line-up, offer facts
//   story-launch.png       1080×1920  launch story
//   intro-<slug>.png       1080×1350  one card per product: bottle, dose, benefit*, price
// Copy rules: structure/function claims only, * → FDA disclaimer on the card; no trust claims (GMP, third-party
// tested, Made in USA) until proven; prices from data/products.ts (launch prices, never a fake "was" price).
// Usage: npx tsx --conditions=react-server scripts/launch-posts.ts
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { SEED_PRODUCTS } from '@/data/products';
import { heroDose, labelCategory, wordmark, wrap, balance } from '@/lib/labels/svg';
import { studioPhotoPng, studioGroupPng, studioBackdrop } from '@/lib/labels/studio';

let BG = '#E2E2E2'; // page colour: set to the studio photo's own backdrop so no square shows
const PHOTOS: Record<string, string> = {}; // slug → studio photo (data URI), filled before rendering
const INK = '#1B1F33';
const SOFT = '#5A5A66';
const LINEUP = ['magnesium-complex', 'ashwagandha', 'lions-mane', 'coq10', 'turmeric-complex']; // capsule bottles (the photo is the bottle; creatine's tub is drawn separately)
const product = (slug: string) => SEED_PRODUCTS.find((p) => p.slug === slug)!;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const text = (x: number, y: number, t: string, size: number, fill: string, opts = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-family="Inter" ${opts}>${esc(t)}</text>`;
const head = (x: number, y: number, lines: string[], size: number, fill: string, anchor = 'start') =>
  lines.map((l, i) => `<text x="${x}" y="${y + i * size * 1.06}" text-anchor="${anchor}" font-size="${size}" font-weight="600" letter-spacing="${-size * 0.03}" fill="${fill}" font-family="Manrope">${esc(l)}</text>`).join('');
const caps = (x: number, y: number, t: string, size: number, fill: string, anchor = 'start') =>
  text(x, y, t.toUpperCase(), size, fill, `font-weight="600" letter-spacing="${size * 0.22}" text-anchor="${anchor}"`);

// One studio bottle photo (square), placed at (x, y) with size s. The mask keeps the bottle's band (so neighbours can
// stand close) and fades the photo's edges into the page.
let clipId = 0;
function bottleAt(slug: string, x: number, y: number, s: number, band: [number, number] = [0.12, 0.88]) {
  const id = `cb${clipId++}`;
  return `<linearGradient id="${id}-fade" x1="0" y1="${y}" x2="0" y2="${y + s}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#000"/><stop offset="0.04" stop-color="#fff"/><stop offset="0.96" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
    <mask id="${id}-m" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${s}" height="${s}"><rect x="${x + s * band[0]}" y="${y}" width="${s * (band[1] - band[0])}" height="${s}" fill="url(#${id}-fade)"/></mask>
    <g mask="url(#${id}-m)"><image href="${PHOTOS[slug]}" x="${x}" y="${y}" width="${s}" height="${s}"/></g>`;
}
// Line-ups are one group shot (lib/labels/studio.ts → studioGroupPng): every bottle on one shared backdrop, shadows
// and all, so no tiles or edges show. Builders run twice: the first pass only collects the line-ups they need.
const GROUPS = new Map<string, { slugs: string[]; w: number; s: number; step: number; png?: string }>();
function lineup(slugs: string[], cx: number, y: number, s: number, step: number, w = 1080) {
  const key = JSON.stringify([slugs, w, s, step]);
  if (!GROUPS.has(key)) GROUPS.set(key, { slugs, w, s, step });
  const png = GROUPS.get(key)!.png;
  return png ? `<image href="${png}" x="${cx - w / 2}" y="${y}" width="${w}" height="${s}"/>` : '';
}
const frame = (W: number, H: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${BG}"/>${body}</svg>`;
const FOOT = (W: number, H: number) => wordmark(W / 2, H - 70, 44, 'print', INK);

function brandIntro() {
  const W = 1080, H = 1350;
  return frame(W, H, `
    ${caps(W / 2, 150, 'Coming soon', 24, SOFT, 'middle')}
    ${head(W / 2, 250, ['The dose,', 'on the front.'], 96, INK, 'middle')}
    ${text(W / 2, 450, 'Evidence-led supplements. The amount per serving,', 32, SOFT, 'text-anchor="middle"')}
    ${text(W / 2, 494, 'printed big where you can see it.', 32, SOFT, 'text-anchor="middle"')}
    ${lineup(['magnesium-complex', 'ashwagandha', 'lions-mane'], W / 2, 560, 560, 320)}
    ${text(W / 2, 1210, 'Join the list at noovit.com', 34, INK, 'font-weight="600" text-anchor="middle"')}
    ${FOOT(W, H)}`);
}

function launch() {
  const W = 1080, H = 1350;
  return frame(W, H, `
    ${caps(W / 2, 150, 'Now open', 24, SOFT, 'middle')}
    ${head(W / 2, 250, ['Meet Noovit.'], 104, INK, 'middle')}
    ${text(W / 2, 340, 'Evidence-led supplements, with the dose on the front.', 32, SOFT, 'text-anchor="middle"')}
    ${lineup(LINEUP, W / 2, 470, 380, 208)}
    ${text(W / 2, 1000, 'Free US shipping  ·  90-day guarantee  ·  Subscribe & save $5', 30, INK, 'font-weight="500" text-anchor="middle"')}
    <rect x="${W / 2 - 230}" y="1060" width="460" height="96" rx="48" fill="${INK}"/>
    ${text(W / 2, 1120, 'Shop at noovit.com', 34, '#fff', 'font-weight="600" text-anchor="middle"')}
    ${FOOT(W, H)}`);
}

function storyLaunch() {
  const W = 1080, H = 1920;
  return frame(W, H, `
    ${caps(W / 2, 260, 'Now open', 28, SOFT, 'middle')}
    ${head(W / 2, 390, ['The dose,', 'on the front.'], 112, INK, 'middle')}
    ${lineup(['magnesium-complex', 'ashwagandha', 'lions-mane'], W / 2, 640, 580, 330)}
    ${text(W / 2, 1380, 'Free US shipping  ·  90-day guarantee', 34, INK, 'font-weight="500" text-anchor="middle"')}
    <rect x="${W / 2 - 260}" y="1480" width="520" height="110" rx="55" fill="${INK}"/>
    ${text(W / 2, 1550, 'Shop at noovit.com', 40, '#fff', 'font-weight="600" text-anchor="middle"')}
    ${wordmark(W / 2, 1800, 52, 'print', INK)}`);
}

function intro(slug: string) {
  const W = 1080, H = 1350;
  const p = product(slug);
  const dose = heroDose(p);
  const benefit = balance(wrap(p.shortBenefit.replace(/\.$/, '') + '*', 820, 34, 0.5).slice(0, 2));
  const sub = p.basePrice - 5;
  return frame(W, H, `
    ${bottleAt(slug, 140, 40, 800)}
    ${caps(W / 2, 930, labelCategory(p) ?? '', 22, SOFT, 'middle')}
    ${head(W / 2, 1000, [p.name], 64, INK, 'middle')}
    ${dose ? text(W / 2, 1056, `${dose.value} ${dose.unit} per serving`, 32, INK, 'font-weight="600" text-anchor="middle"') : ''}
    ${benefit.map((l, i) => text(W / 2, 1110 + i * 42, l, 30, SOFT, 'text-anchor="middle"')).join('')}
    ${text(W / 2, 1222, `$${p.basePrice}  ·  $${sub} with Subscribe & save  ·  Free US shipping`, 26, INK, 'font-weight="500" text-anchor="middle"')}
    ${text(W / 2, 1300, '*These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.', 15, SOFT, 'text-anchor="middle"')}`);
}

const fontFiles = readdirSync('assets/fonts').filter((f) => f.endsWith('.ttf')).map((f) => `assets/fonts/${f}`);
const out = 'design/social/launch';
mkdirSync(out, { recursive: true });
const render = (svg: string, file: string) => {
  writeFileSync(`${out}/${file}`, new Resvg(svg, { fitTo: { mode: 'width', value: 1080 }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng());
  console.log(`${out}/${file}`);
};
(async () => {
for (const slug of LINEUP) PHOTOS[slug] = `data:image/png;base64,${(await studioPhotoPng(product(slug), 1000)).toString('base64')}`;
const bg = await studioBackdrop();
BG = '#' + bg.map((v) => v.toString(16).padStart(2, '0')).join('');
brandIntro(); launch(); storyLaunch(); // first pass: collect the line-ups
for (const g of GROUPS.values()) {
  const png = await studioGroupPng(g.slugs.map(product), g.w * 2, g.s * 2, { size: g.s * 2, step: g.step * 2, y: 0, bg });
  g.png = `data:image/png;base64,${png.toString('base64')}`;
}
render(brandIntro(), 'brand-intro.png');
render(launch(), 'launch.png');
render(storyLaunch(), 'story-launch.png');
for (const slug of LINEUP) render(intro(slug), `intro-${slug}.png`);
})();
