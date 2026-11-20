import { moleculeArt, hasMolecule, moleculeField, ballStickArt, hasBallStick } from './molecule';
import { FOR_HER_BERRY, FOR_HER_LABEL } from '@/lib/for-her';
import { illustrationField, hasIllustration } from './illustration';
import { particleShape, hasShape } from './shapes';
import { Product } from '@/types';
import { CROSS_GAP, MARK_CROSS, crossTile } from '@/lib/brand/cross';
import { GOALS, goalsForProduct } from '@/lib/quiz';
import { LEGAL_NAME } from '@/lib/site';

// Noovit label system, drawn as SVG strings so one design feeds three places:
//  - the print draft of the full wrap-around label (fullLabelSvg, real units: 1 = 0.01 inch),
//  - the bottle images on the website (bottleSvg in 'web' mode, fonts from next/font CSS variables),
//  - the PNG images for feeds and social previews (bottleSvg in 'print' mode, rendered with the TTFs in assets/fonts).
// All copy comes from the product record, so every product's label stays consistent with its page.

export type FontMode = 'web' | 'print';

// Bump when the photo mockup (lib/labels/photo.ts) changes, so cached product image URLs refresh.
export const MOCKUP_VERSION = 'studio-v12'; // v12 (20 Nov): For Her badge off Ashwagandha // v11 (20 Nov): women's range colours // v10 (20 Nov): For Her badge // v9 (19 Nov): "organic" removed from Lion's Mane // v6 (17 Nov): cream backdrop // studio-v1 (16 Nov): photoreal studio bottle (lib/labels/studio.ts); was photo-v14 // v12 (14 Nov): elegant dark label; v13: studio lighting; v14: label edges curve round the bottle

const NAVY = '#14213d';
const INK = '#4b5563';
export const ORANGE = '#ff5f00';

const FONTS = {
  logo: { web: "var(--font-funnel), 'Funnel Display', sans-serif", print: "'Funnel Display'" },
  head: { web: "var(--font-manrope), 'Manrope', sans-serif", print: "'Manrope'" },
  body: { web: "var(--font-inter), 'Inter', sans-serif", print: "'Inter'" },
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const font = (kind: keyof typeof FONTS, mode: FontMode) => (mode === 'web' ? `style="font-family:${FONTS[kind].web}"` : `font-family="${FONTS[kind].print}"`);
const n = (v: number) => Math.round(v * 100) / 100;

// Greedy word wrap by an average character width (em), good enough for short label copy.
export function wrap(text: string, maxWidth: number, size: number, em = 0.52) {
  const maxChars = Math.max(4, Math.floor(maxWidth / (size * em)));
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}

// Re-splits a two-line wrap at the most even point, so the second line never holds a single orphaned word.
export function balance(lines: string[]) {
  if (lines.length !== 2) return lines;
  const words = lines.join(' ').split(' ');
  let best = lines;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    if (a.length > lines[0].length) break; // never make line one longer than the wrap allowed
    if (b.length > a.length + 2) continue; // keep the second line no longer than the first (clear of the count)
    const diff = Math.abs(a.length - b.length);
    if (diff < bestDiff) [best, bestDiff] = [[a, b], diff];
  }
  return best;
}

function textBlock(lines: string[], x: number, y: number, size: number, lead: number, attrs: string) {
  return lines.map((l, i) => `<text x="${n(x)}" y="${n(y + i * lead)}" font-size="${size}" ${attrs}>${esc(l)}</text>`).join('');
}

// ---------- Product facts used on the label ----------

const UNITS: Record<Product['form'], [string, string]> = {
  capsules: ['Capsule', 'Capsules'],
  softgels: ['Softgel', 'Softgels'],
  chews: ['Soft Chew', 'Soft Chews'],
  powder: ['Scoop', 'Scoops'],
};

// "Take 2 capsules daily" → 2 per serving; "twice daily" / "3 times daily" multiply the daily amount.
export function labelCounts(p: Product) {
  const per = Number(p.dosage.match(/(\d+)\s*(capsule|softgel|chew|scoop)/i)?.[1] ?? 1);
  const times = /3 times|three times/i.test(p.dosage) ? 3 : /twice/i.test(p.dosage) && !/once or twice/i.test(p.dosage) ? 2 : 1;
  const units = p.form === 'powder' ? p.servings : p.servings * per * times;
  return { perServing: per, units, servingsPerContainer: p.form === 'powder' ? p.servings : Math.round(units / per) };
}

export function netQuantity(p: Product) {
  const { units } = labelCounts(p);
  if (p.netWeight) return `Net Wt ${p.netWeight}`;
  if (p.form === 'powder') {
    const grams = Number(p.dosage.match(/\((\d+)\s*g\)/)?.[1]);
    return grams ? `Net Wt ${grams * p.servings} g (${(grams * p.servings / 28.35).toFixed(1)} oz)` : `${p.servings} Servings`;
  }
  return `${units} ${UNITS[p.form][units === 1 ? 0 : 1]}`;
}


// ---------- Brand marks ----------

// Funnel Display Medium "n" outline at 100 units (x 3.25–57.75, baseline 0, x-height 50.9), so the icon needs no font.
export const N_PATH =
  'M20.33 0L9.00 0L9.00-38.58L3.25-38.58L3.25-50.00L15.08-50.00L15.08-42.08L18.58-42.08Q21.25-46.33 25.71-48.63Q30.17-50.92 36.50-50.92L36.50-50.92Q46.50-50.92 52.13-45.29Q57.75-39.67 57.75-30.25L57.75-30.25L57.75 0L46.42 0L46.42-28.25Q46.42-34.42 43.13-37.67Q39.83-40.92 33.42-40.92L33.42-40.92Q27.00-40.92 23.67-37.67Q20.33-34.42 20.33-28.25L20.33-28.25L20.33 0Z';

// The logo mark's mosaic cross (five tiles, lib/brand/cross.ts). (x, y) = top-left, `size` = overall width.
export function mosaicCross(x: number, y: number, size: number, color = ORANGE) {
  const t = crossTile(MARK_CROSS, size);
  const step = t * (1 + CROSS_GAP);
  return MARK_CROSS.tiles.map(({ c, r, o }) => `<rect x="${n(x + c * step)}" y="${n(y + r * step)}" width="${n(t)}" height="${n(t)}" rx="${n(t * 0.12)}" fill="${color}" opacity="${o}"/>`).join('');
}

// The n⁺ icon in a 100×100 box.
export function icon(fg = NAVY, accent = ORANGE) {
  return `<path transform="translate(6 82)" d="${N_PATH}" fill="${fg}"/>${mosaicCross(66, 14, 26, accent)}`;
}

// "noovit" + mosaic cross. Width of "noovit" in Funnel Display 500 = 2.977em; "vit" can take a second tone.
function wordmarkRaw(x: number, y: number, size: number, mode: FontMode, c1: string, c2: string, c2Opacity = 1, accent = ORANGE) {
  return `<text x="${n(x)}" y="${n(y)}" font-size="${size}" font-weight="500" letter-spacing="${n(-0.01 * size)}" ${font('logo', mode)}><tspan fill="${c1}">noo</tspan><tspan fill="${c2}" fill-opacity="${c2Opacity}">vit</tspan></text>
    ${mosaicCross(x + 3.02 * size, y - 0.8 * size, size * 0.44, accent)}`;
}

// Centred horizontal wordmark (baseline at y).
export function wordmark(cx: number, y: number, size: number, mode: FontMode, color = NAVY) {
  return `<g aria-label="noovit">${wordmarkRaw(cx - (3.02 + 0.44) * size / 2, y, size, mode, color, color)}</g>`;
}

// ---------- Front panel (220 × 225 units = 2.2" × 2.25") ----------

export const FRONT = { w: 220, h: 225 };
export const BAND = 150; // colour block above, white band below; dose and net quantity sit in the bottom third

// Darker shade of the product colour for small text on white.
export function shade(hex: string, k = 0.35) {
  return '#' + (hex.match(/\w\w/g) ?? []).map((h) => Math.round(parseInt(h, 16) * (1 - k)).toString(16).padStart(2, '0')).join('');
}

// The "complex details" line under the product name (draft copy; match it to the supplier's formula).
const SUBTITLES: Record<string, string> = {
  'probiotic-complex': '12 Strains, 40B CFU + Prebiotic',
  'glucosamine-complex': 'With Chondroitin, MSM & Curcumin',
  'collagen-complex': 'With Hyaluronic Acid & Vitamin C',
  'menopause-complex': 'Black Cohosh, Sage, D3 & B6',
  'magnesium-complex': '275mg Magnesium as Glycinate',
  'magnesium-for-men': '275mg Magnesium as Glycinate',
  zinc: 'Zinc Picolinate 25mg + Copper',
  'iron-complex': 'Gentle Bisglycinate + Vitamin C',
  'vitamin-d3-k2': '2000 IU D3 + 75mcg K2 (MK-7)',
  'turmeric-complex': 'Turmeric + Glucosamine, Boswellia & Ginger',
  'berberine-complex': '500mg Berberine HCl + Chromium',
  ashwagandha: 'KSM-66® 600mg + D3, B6, B12 & Maca',
  multivitamin: '23 Active Vitamins & Minerals',
  'biotin-complex': 'With Zinc & Selenium',
  creatine: 'Pure Monohydrate, 5g Serving',
  'creatine-for-women': 'Pure Monohydrate, 5g Serving',
  'creatine-for-men': 'Pure Monohydrate, 5g Serving',
  'creatine-hydration': '5g Creatine + Electrolytes, Lemon',
  'mushroom-blend-powder': "Lion's Mane, Cordyceps, Reishi & Chaga",
  'focus-complex': "Lion's Mane, Bacopa & L-Theanine",
  'lions-mane': "1000mg Fruiting Body + Mycelium",
  coq10: '200mg Coenzyme Q10 (Ubiquinone)',
  'l-theanine': '200mg Pure L-Theanine',
  nac: 'N-Acetyl Cysteine 600mg',
  nmn: '500mg NMN, 99.9% Purity',
  'nad-plus': '500mg NAD+, Quercetin & Resveratrol',
  colostrum: '2,300mg Colostrum, 25% IgG',
  'deep-sleep': 'Melatonin 2mg + Calming Herbs',
};
const shortName = (s: string) => s.replace(/\s*\(.*?\)/g, '').replace(/ Extract| Sulfate| Citrate| Glycinate| Bisglycinate| Picolinate| Malate/g, '');
export function labelSubtitle(p: Product) {
  if (SUBTITLES[p.slug]) return SUBTITLES[p.slug];
  const extras = p.ingredients.slice(1, 3).map((i) => shortName(i.name));
  return extras.length ? `With ${extras.join(' & ')}` : `${p.ingredients[0]?.amount ?? ''} ${shortName(p.ingredients[0]?.name ?? '')}`.trim();
}

// Origin claim. FTC rule: an unqualified "Made in USA" needs all or virtually all ingredients to be domestic too;
// with imported ingredients use e.g. "Made in the USA with imported ingredients". Confirm with the supplier.
// Removed from the labels (14 Nov) until Supliful confirms which products qualify; set a string here to print it again.
export const ORIGIN_CLAIM: string | null = null;

// One line when the whole name fits large; otherwise the first word on line one and the rest (set a little smaller)
// on line two. Sized to clear the vertical wordmark.
function nameLines(name: string, room: number) {
  const one = Math.min(26, room / (name.length * 0.6));
  const words = name.split(' ');
  if (one >= 20 || words.length === 1) return { lines: [name], size: one };
  const lines = [words[0], words.slice(1).join(' ')];
  return { lines, size: Math.min(26, room / (Math.max(lines[0].length, lines[1].length * 0.82) * 0.6)) };
}

// Mosaic pattern on the label (exploration): square tiles that dissolve one area into another.
export type LabelPattern = 'none' | 'band' | 'top' | 'sides';
function hash(str: string) {
  let h = 2166136261;
  for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
}
function labelMosaic(p: Product, pattern: LabelPattern) {
  if (pattern === 'none') return '';
  const rnd = hash(p.slug + pattern);
  const t = 7, step = 8.4;
  const tile = (x: number, y: number, c: string, o: number) => `<rect x="${n(x)}" y="${n(y)}" width="${t}" height="${t}" rx="0.8" fill="${c}" opacity="${n(o)}"/>`;
  const out: string[] = [];
  if (pattern === 'band') {
    // colour block dissolving into the white band
    [0.7, 0.3, 0.08].forEach((d, row) => {
      for (let x = 0.7; x < FRONT.w; x += step) if (rnd() < d) out.push(tile(x, BAND + 0.7 + row * step, p.color, (0.25 + 0.45 * rnd()) * (1 - row * 0.3)));
    });
  }
  if (pattern === 'top') {
    // Small white tiles falling evenly from the top edge across the full width, thinner (not absent) behind
    // the n⁺ icon and the "vit" end of the vertical wordmark.
    const ts = 3.5, st = 4.2, depth = 52;
    for (let y = 0; y < depth; y += st)
      for (let x = 0.6; x < FRONT.w; x += st) {
        let w = 1 - y / depth;
        if (x > 11 && x < 51 && y > 11 && y < 51) w *= 0.4; // lighter behind the n⁺ icon (drawn on top)
        if (x > FRONT.w - 44 && y > 18) w *= 0.55; // lighter over "vit" and the cross
        if (rnd() < w ** 1.5 * 0.95) out.push(`<rect x="${n(x)}" y="${n(y)}" width="${ts}" height="${ts}" rx="0.4" fill="#fff" opacity="${n((0.12 + 0.55 * rnd()) * w)}"/>`);
      }
  }
  if (pattern === 'sides') {
    // white tiles along both side edges of the colour block
    for (let y = 0.7; y < BAND - step; y += step)
      [[0.7, 0.7], [0.7 + step, 0.35], [FRONT.w - t - 0.7, 0.7], [FRONT.w - t - 0.7 - step, 0.35]].forEach(([x, d]) => {
        if (rnd() < d) out.push(tile(x, y, '#fff', 0.15 + 0.4 * rnd()));
      });
  }
  return out.join('');
}

// Category line above the product name. Falls back to the product's strongest quiz goal.
const CATEGORIES: Record<string, string> = {
  'magnesium-complex': 'Sleep · Recovery',
  'magnesium-for-men': 'Muscle · Sleep',
  ashwagandha: 'Stress · Calm',
  'lions-mane': 'Focus · Clarity',
  creatine: 'Strength · Power',
  'creatine-for-women': 'Strength · Memory',
  'creatine-for-men': 'Strength · Power',
  'creatine-hydration': 'Strength · Hydration',
  coq10: 'Heart · Energy',
  nmn: 'Energy · Healthy Aging',
  'nad-plus': 'Energy · Healthy Aging',
  colostrum: 'Gut · Immunity',
  'deep-sleep': 'Sleep · Rest',
};
export function labelCategory(p: Product) {
  if (CATEGORIES[p.slug]) return CATEGORIES[p.slug];
  const goal = goalsForProduct(p.slug)[0];
  return GOALS.find((g) => g.id === goal)?.label.replace(/ & /g, ' · ') ?? '';
}

// What the hero dose is, under the number. Falls back to the ingredient's short name.
const DOSE_LINES: Record<string, string> = {
  'magnesium-complex': 'Magnesium as glycinate',
  'magnesium-for-men': 'Magnesium as glycinate',
  ashwagandha: 'KSM-66® ashwagandha root',
  'lions-mane': "Lion's mane mushroom",
  creatine: 'Creatine monohydrate',
  'creatine-for-women': 'Creatine monohydrate',
  'creatine-for-men': 'Creatine monohydrate',
  'creatine-hydration': 'Creatine + electrolytes',
  coq10: 'Coenzyme Q10 (ubiquinone)',
  nmn: 'Nicotinamide mononucleotide',
  colostrum: 'Bovine colostrum, 25% IgG',
};

// Single-ingredient products lead with their dose ("275 mg"); blends keep a benefit line instead.
// Blends whose label still leads with one key ingredient's dose (the rest are listed in the facts panel).
const HERO_INGREDIENT: Record<string, RegExp> = {
  ashwagandha: /ksm-66/i,
  'creatine-hydration': /creatine/i,
};

export function heroDose(p: Product) {
  if (p.bundleItems?.length) return null;
  const key = HERO_INGREDIENT[p.slug];
  const ing = key ? p.ingredients.find((i) => key.test(i.name)) : p.ingredients.length === 1 ? p.ingredients[0] : undefined;
  if (!ing) return null;
  const m = ing.amount.match(/^([\d.,]+)\s*(mg|mcg|g|IU)$/i);
  if (!m) return null;
  const value = Number(m[1].replace(/,/g, ''));
  return { value: value.toLocaleString('en-US'), unit: m[2].toUpperCase() === 'IU' ? 'IU' : m[2].toLowerCase(), line: DOSE_LINES[p.slug] ?? shortName(ing.name) };
}

// Drawn at (0,0); callers translate/scale it. `bleed` extends both colour areas past the trim.
// Colour block: icon, category, product name, benefit; the vertical "noovit" wordmark is centred on the right edge.
// White band (bottom third): the dose per serving on the left, the net quantity on the right at legal size
// (21 CFR 101.105: bottom 30% of the panel, digits ≥ 1/8"), then the statement of identity and servings.
// Optional diagonal gradient for a product's colour block (top-left → bottom-right). The site keeps p.color,
// which should be the gradient's middle tone. White text needs both ends dark enough (≥ 3:1 for large type).
export const LABEL_GRADIENTS: Record<string, [string, string]> = {
  ashwagandha: ['#D0705A', '#9C3E62'], // coral → berry (owner's pick, 1 Nov; replaced the brown)
  'lions-mane': ['#2E9C98', '#1F5675'], // teal → petrol (owner's pick, 1 Nov; replaced the tan)
  coq10: ['#C63B4E', '#701C3E'], // ruby → wine (owner's pick, 1 Nov)
};

// Default gradient for every product: its own colour (top-left) into a deeper tone nudged ~16° round the colour wheel
// (cool hues forward, warm hues back toward red).
function hueShiftDarken(hex: string, deg: number, k: number) {
  const [r, g, b] = (hex.match(/\w\w/g) ?? []).map((h) => parseInt(h, 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  let h = 0;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = ((h * 60) % 360 + 360) % 360;
  // Warm colours turn muddy toward yellow, so they shift toward red/magenta instead.
  h = (((h + (h < 75 || h > 320 ? -deg : deg)) % 360) + 360) % 360;
  const L = Math.min(0.95, Math.max(0, l * (1 - k))), c = (1 - Math.abs(2 * L - 1)) * sat, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = L - c / 2;
  const [r1, g1, b1] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r1, g1, b1].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
}
export const labelGradient = (p: Product): [string, string] => LABEL_GRADIENTS[p.slug] ?? [p.color, hueShiftDarken(p.color, 16, 0.28)];

function blockFill(p: Product) {
  const g = labelGradient(p);
  const id = `blk-${p.slug}-${g[0].slice(1)}${g[1].slice(1)}`.replace(/[^\w-]/g, '');
  return {
    defs: `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g[0]}"/><stop offset="1" stop-color="${g[1]}"/></linearGradient></defs>`,
    fill: `url(#${id})`,
  };
}

export function frontPanel(p: Product, mode: FontMode, bleed = 0, pattern: LabelPattern = 'top') {
  const shift = pattern === 'band' ? 10 : 0; // white-band content moves down to make room for the dissolve
  const vSize = 26;
  const vLen = (3.02 + 0.44) * vSize; // wordmark length incl. the cross
  const { lines, size } = nameLines(p.name, FRONT.w - 18 - 56);
  const dark = shade(p.color);
  const { units, servingsPerContainer } = labelCounts(p);
  const qty = netQuantity(p);
  // Powders: "280 g" large, "NET WT 9.9 OZ" small; otherwise the count and its unit.
  const wt = qty.match(/^Net Wt (\d+ g) \((.+)\)$/);
  const big = wt ? wt[1] : p.form === 'powder' ? qty.split(' ')[0] : String(units);
  const unitWord = wt ? `Net Wt ${wt[2]}` : p.form === 'powder' ? qty.replace(/^\S+\s/, '') : UNITS[p.form][units === 1 ? 0 : 1];
  const dose = heroDose(p);
  const category = labelCategory(p);
  // Benefit (structure/function claim, starred to the disclaimer on the information panel), bottom of the colour block.
  const benefit = balance(wrap(p.shortBenefit.replace(/\.$/, '') + '*', FRONT.w - 18 - 50, 8.6, 0.5).slice(0, 2));
  const nameY = 90;
  const caps = (x: number, y: number, t: string, sz: number, fill: string, anchor = 'start', weight = 600) =>
    `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" font-size="${sz}" font-weight="${weight}" letter-spacing="${n(sz * 0.14)}" fill="${fill}" ${font('body', mode)}>${esc(t.toUpperCase())}</text>`;
  const y0 = BAND + shift;
  // Left of the white band: the dose, or for blends what is in it (two lines, clear of the net quantity).
  const left = dose
    ? `<text x="17" y="${y0 + 36}" font-size="30" font-weight="700" letter-spacing="-0.9" fill="${dark}" ${font('head', mode)}>${esc(dose.value)}<tspan font-size="12.6" font-weight="600" dx="1.8">${esc(dose.unit)}</tspan></text>
    ${caps(18, y0 + 48, dose.line, 5.8, INK, 'start', 500)}`
    : textBlock(balance(wrap(labelSubtitle(p), 118, 9.4, 0.5).slice(0, 2)), 18, y0 + 24, 9.4, 11.4, `font-weight="600" fill="${dark}" ${font('body', mode)}`);
  const block = blockFill(p);
  return `<g>${block.defs}
    <rect x="0" y="${-bleed}" width="${FRONT.w}" height="${BAND + bleed}" fill="${block.fill}"/>
    <rect x="0" y="${BAND}" width="${FRONT.w}" height="${FRONT.h - BAND + bleed}" fill="#fff"/>
    ${labelMosaic(p, pattern)}
    <g transform="translate(14 14) scale(0.32)">${icon('#fff')}</g>
    ${category ? caps(18, 58, category, 7, '#fff') : ''}
    <text x="18" y="${nameY}" font-size="${n(size)}" font-weight="600" letter-spacing="${n(-0.02 * size)}" fill="#fff" ${font('head', mode)}>${esc(lines[0])}</text>
    ${lines[1] ? `<text x="18" y="${n(nameY + size * 0.98)}" font-size="${n(size * 0.82)}" font-weight="600" letter-spacing="${n(-0.02 * size)}" fill="#fff" ${font('head', mode)}>${esc(lines[1])}</text>` : ''}
    ${textBlock(benefit, 18, BAND - 9 - (benefit.length - 1) * 10.4, 8.6, 10.4, `font-weight="500" fill="#fff" opacity="0.94" ${font('body', mode)}`)}
    <g transform="translate(${FRONT.w - 16} ${n(BAND / 2 + vLen / 2)}) rotate(-90)">${wordmarkRaw(0, 9, vSize, mode, '#fff', '#fff')}</g>
    ${left}
    <text x="${FRONT.w - 18}" y="${y0 + 32}" text-anchor="end" font-size="21" font-weight="600" fill="${dark}" ${font('head', mode)}>${esc(big)}</text>
    ${caps(FRONT.w - 18, y0 + 44, unitWord, unitWord.length > 9 ? 5.6 : 6.6, dark, 'end')}
    <rect x="18" y="${y0 + 54}" width="${FRONT.w - 36}" height="0.6" fill="#d9d4cb"/>
    ${caps(18, FRONT.h - 13, 'Dietary supplement', 6.4, NAVY, 'start', 700)}
    ${caps(FRONT.w - 18, FRONT.h - 13, `${servingsPerContainer} servings`, 5.6, INK, 'end', 500)}
  </g>`;
}

// ---------- Front panel v2 (2 Nov exploration, after an outside design review) ----------
// Horizontal wordmark top-left (no vertical wordmark, no separate n⁺ icon: one orange cross only), half-density
// pixel texture, ingredient-first name (descriptor such as "Sleep+" smaller underneath), every line ≥ 5 pt (7 units).
const V2_DOSE_LINES: Record<string, string> = {
  'magnesium-complex': 'Elemental magnesium',
  'magnesium-for-men': 'Elemental magnesium',
  creatine: 'Creatine per scoop',
  coq10: 'CoQ10 (ubiquinone)',
  ashwagandha: 'KSM-66® ashwagandha',
};
function v2Mosaic(p: Product) {
  const rnd = hash(p.slug + 'v2');
  const out: string[] = [];
  const ts = 3.5, st = 4.2, depth = 34;
  for (let y = 0; y < depth; y += st)
    for (let x = 0.6; x < FRONT.w; x += st) {
      let w = 1 - y / depth;
      if (x < 92 && y > 8) w *= 0.35; // keep the wordmark clear
      if (rnd() < w ** 1.8 * 0.6) out.push(`<rect x="${n(x)}" y="${n(y)}" width="${ts}" height="${ts}" rx="0.4" fill="#fff" opacity="${n((0.1 + 0.4 * rnd()) * w)}"/>`);
    }
  return out.join('');
}
// `fullColour`: the colour runs down the whole front (no white band); dose and count in white.
export function frontPanelV2(p: Product, mode: FontMode, bleed = 0, opts: { doseInBlock?: boolean; fullColour?: boolean } = {}) {
  const fc = !!opts.fullColour;
  const dark = fc ? '#fff' : shade(p.color);
  const ink = fc ? 'rgba(255,255,255,0.82)' : INK;
  const navy = fc ? '#fff' : NAVY;
  const { units, servingsPerContainer } = labelCounts(p);
  const qty = netQuantity(p);
  const wt = qty.match(/^Net Wt (\d+ g) \((.+)\)$/);
  const big = wt ? wt[1] : p.form === 'powder' ? qty.split(' ')[0] : String(units);
  const unitWord = wt ? `Net Wt ${wt[2]}` : p.form === 'powder' ? qty.replace(/^\S+\s/, '') : UNITS[p.form][units === 1 ? 0 : 1];
  const dose = heroDose(p);
  const category = labelCategory(p);
  const words = p.name.split(' ');
  const descriptor = words.length > 1 && /\+$|^Complex$/.test(words[words.length - 1]) ? words.pop()! : '';
  const main = words.join(' ');
  const room = FRONT.w - 36;
  const size = Math.min(30, room / (main.length * 0.56));
  const benefit = balance(wrap(p.shortBenefit.replace(/\.$/, '') + '*', room, 8.4, 0.5).slice(0, 2));
  const caps = (x: number, y: number, t: string, sz: number, fill: string, anchor = 'start', weight = 600) =>
    `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" font-size="${sz}" font-weight="${weight}" letter-spacing="${n(sz * 0.12)}" fill="${fill}" ${font('body', mode)}>${esc(t.toUpperCase())}</text>`;
  const nameY = descriptor ? 84 : 94;
  const block = blockFill(p);
  const doseLine = V2_DOSE_LINES[p.slug] ?? dose?.line ?? '';
  const left = dose
    ? `<text x="18" y="${BAND + 37}" font-size="31" font-weight="700" letter-spacing="-0.9" fill="${dark}" ${font('head', mode)}>${esc(dose.value)}<tspan font-size="13" font-weight="600" dx="1.8">${esc(dose.unit)}</tspan></text>
    ${caps(18, BAND + 50, doseLine, 7, ink, 'start', 500)}`
    : textBlock(balance(wrap(labelSubtitle(p), 120, 9.6, 0.5).slice(0, 2)), 18, BAND + 25, 9.6, 11.6, `font-weight="600" fill="${dark}" ${font('body', mode)}`);
  if (opts.doseInBlock) {
    return `<g>${block.defs}
    <rect x="0" y="${-bleed}" width="${FRONT.w}" height="${BAND + bleed}" fill="${block.fill}"/>
    <rect x="0" y="${BAND}" width="${FRONT.w}" height="${FRONT.h - BAND + bleed}" fill="#fff"/>
    ${v2Mosaic(p)}
    ${wordmarkRaw(18, 34, 17, mode, '#fff', '#fff')}
    ${category ? caps(FRONT.w - 18, 33, category, 7, '#fff', 'end', 600) : ''}
    <text x="18" y="${n(nameY - 6)}" font-size="${n(size)}" font-weight="600" letter-spacing="${n(-0.02 * size)}" fill="#fff" ${font('head', mode)}>${esc(main)}</text>
    ${descriptor ? `<text x="18" y="${n(nameY + 15)}" font-size="17" font-weight="500" fill="#fff" fill-opacity="0.88" ${font('head', mode)}>${esc(descriptor)}</text>` : ''}
    ${textBlock(benefit.slice(0, 1), 18, nameY + (descriptor ? 30 : 14), 8.4, 10.2, `font-weight="500" fill="#fff" opacity="0.94" ${font('body', mode)}`)}
    ${dose ? caps(18, BAND - 12, doseLine, 7, '#fff', 'start', 600) + `<text x="${FRONT.w - 18}" y="${BAND - 11}" text-anchor="end" font-size="17" font-weight="700" fill="#fff" ${font('head', mode)}>${esc(dose.value)} ${esc(dose.unit)}</text>` : ''}
    <text x="18" y="${BAND + 31}" font-size="24" font-weight="700" fill="${dark}" ${font('head', mode)}>${esc(big)}</text>
    ${caps(18, BAND + 43, unitWord, 7, dark, 'start')}
    <text x="${FRONT.w - 18}" y="${BAND + 31}" text-anchor="end" font-size="15" font-weight="600" fill="${dark}" ${font('head', mode)}>${servingsPerContainer}</text>
    ${caps(FRONT.w - 18, BAND + 43, 'Servings', 7, INK, 'end', 500)}
    <rect x="18" y="${BAND + 54}" width="${FRONT.w - 36}" height="0.6" fill="#d9d4cb"/>
    ${caps(18, FRONT.h - 12, 'Dietary supplement', 7, NAVY, 'start', 700)}
  </g>`;
  }
  return `<g>${block.defs}
    <rect x="0" y="${-bleed}" width="${FRONT.w}" height="${BAND + bleed}" fill="${block.fill}"/>
    <rect x="0" y="${BAND}" width="${FRONT.w}" height="${FRONT.h - BAND + bleed}" fill="${fc ? block.fill : '#fff'}"/>${fc ? `<rect x="18" y="${BAND - 1}" width="${FRONT.w - 36}" height="0.6" fill="rgba(255,255,255,0.45)"/>` : ''}
    ${v2Mosaic(p)}
    ${wordmarkRaw(18, 34, 17, mode, '#fff', '#fff')}
    ${category ? caps(FRONT.w - 18, 33, category, 7, '#fff', 'end', 600) : ''}
    <text x="18" y="${n(nameY)}" font-size="${n(size)}" font-weight="600" letter-spacing="${n(-0.02 * size)}" fill="#fff" ${font('head', mode)}>${esc(main)}</text>
    ${descriptor ? `<text x="18" y="${n(nameY + 21)}" font-size="17" font-weight="500" fill="#fff" fill-opacity="0.88" ${font('head', mode)}>${esc(descriptor)}</text>` : ''}
    ${textBlock(benefit, 18, BAND - 11 - (benefit.length - 1) * 10.2, 8.4, 10.2, `font-weight="500" fill="#fff" opacity="0.94" ${font('body', mode)}`)}
    ${left}
    <text x="${FRONT.w - 18}" y="${BAND + 33}" text-anchor="end" font-size="22" font-weight="600" fill="${dark}" ${font('head', mode)}>${esc(big)}</text>
    ${caps(FRONT.w - 18, BAND + 45, unitWord, 7, dark, 'end')}
    <rect x="18" y="${BAND + 56}" width="${FRONT.w - 36}" height="0.6" fill="${fc ? 'rgba(255,255,255,0.45)' : '#d9d4cb'}"/>
    ${caps(18, FRONT.h - 12, 'Dietary supplement', 7, navy, 'start', 700)}
    ${caps(FRONT.w - 18, FRONT.h - 12, `${servingsPerContainer} servings`, 7, ink, 'end', 500)}
  </g>`;
}

// Product "form": a soft abstract shape unique to each product, generated from its formula (lobes and layers
// follow the ingredient count; the seed is the slug), in the product's colour family. Our own take on the
// one-graphic-per-product idea, not a copy of anyone's artwork.
function smoothClosed(pts: [number, number][]) {
  const k = pts.length;
  let d = `M${n(pts[0][0])} ${n(pts[0][1])}`;
  for (let i = 0; i < k; i++) {
    const p0 = pts[(i - 1 + k) % k], p1 = pts[i], p2 = pts[(i + 1) % k], p3 = pts[(i + 2) % k];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`;
  }
  return d + 'Z';
}
export type FormStyle = 'soft' | 'scientific' | 'organic' | 'molecule' | 'molecule-spectrum';
// One closed outline per product (seeded from the slug, lobes from the ingredient count), scaled about its centre.
function formOutline(p: Product, cx: number, cy: number, r: number, salt: string, irregular = 0.3, extraLobes = 0) {
  const rnd = hash(p.slug + salt);
  const lobes = 6 + (Math.max(1, p.ingredients.length) % 4) + extraLobes;
  const rot = rnd() * Math.PI * 2;
  const radii = Array.from({ length: lobes }, () => 1 - irregular / 2 + irregular * rnd());
  return (scale: number, dx = 0, dy = 0, wobble = 0) =>
    smoothClosed(radii.map((k, i) => {
      const a = rot + (i / lobes) * Math.PI * 2;
      const rr = r * scale * (k + wobble * Math.sin(i * 2.3 + scale * 9));
      return [cx + dx + Math.cos(a) * rr, cy + dy + Math.sin(a) * rr] as [number, number];
    }));
}
// Scientific: concentric contour lines (like a topographic or microscope plot) with a few data-point dots.
function formScientific(p: Product, cx: number, cy: number, r: number, color: string) {
  const outline = formOutline(p, cx, cy, r, 'sci', 0.34);
  const rnd = hash(p.slug + 'dots');
  const rings = 9 + Math.min(5, p.ingredients.length);
  const deep = hueShiftDarken(color, 0, 0.1);
  const out: string[] = [];
  for (let i = 0; i < rings; i++) {
    const t = i / (rings - 1);
    const sc = 1 - t * 0.86;
    out.push(`<path d="${outline(sc, (t - 0.5) * r * 0.22, (t - 0.5) * r * -0.12)}" fill="none" stroke="${deep}" stroke-width="${n(0.45 + t * 0.35)}" stroke-opacity="${n(0.35 + t * 0.55)}"/>`);
  }
  const dots = 3 + Math.min(6, p.ingredients.length);
  for (let i = 0; i < dots; i++) {
    const a = rnd() * Math.PI * 2, d = r * (0.25 + 0.7 * rnd());
    out.push(`<circle cx="${n(cx + Math.cos(a) * d)}" cy="${n(cy + Math.sin(a) * d)}" r="${n(1 + rnd() * 1.2)}" fill="${deep}"/>`);
  }
  out.push(`<circle cx="${n(cx + r * 0.08)}" cy="${n(cy - r * 0.04)}" r="2.4" fill="${ORANGE}"/>`);
  return `<g>${out.join('')}</g>`;
}
// Organic: fluid, watercolour-like layers with soft edges and gentle colour drift.
function formOrganic(p: Product, cx: number, cy: number, r: number, color: string) {
  const id = `fo-${p.slug}`.replace(/[^\w-]/g, '');
  const rnd = hash(p.slug + 'org');
  const layers = Math.min(6, 3 + Math.floor(p.ingredients.length / 2));
  const tones = [hueShiftDarken(color, -14, -0.75), hueShiftDarken(color, 10, -0.55), hueShiftDarken(color, -6, -0.4), hueShiftDarken(color, 6, -0.25), hueShiftDarken(color, -4, -0.1), color];
  const out: string[] = [];
  for (let L = 0; L < layers; L++) {
    const outline = formOutline(p, cx, cy, r, 'org' + L, 0.55, 2);
    const sc = 1 - L * (0.62 / layers);
    out.push(`<path d="${outline(sc, (rnd() - 0.5) * r * 0.3, (rnd() - 0.5) * r * 0.3, 0.06)}" fill="${tones[L % tones.length]}" fill-opacity="${n(0.5 + L * 0.06)}" filter="url(#${id}-blur)"/>`);
  }
  return `<g><defs><filter id="${id}-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter></defs><g style="isolation:isolate">${out.join('')}</g></g>`;
}

export function productForm(p: Product, cx: number, cy: number, r: number, color = p.color, style: FormStyle = 'soft') {
  // Symbolic particle shapes replace the molecule for three products (brain, ore, triple spiral).
  if ((style === 'molecule' || style === 'molecule-spectrum') && hasShape(p.slug))
    return particleShape(p, cx - 88, cy - 54, 104, color, { spectrum: style === 'molecule-spectrum', disperse: style === 'molecule-spectrum' });
  // Curcumin reads best as its flat ball-and-stick shape (two rings and the long chain), drawn diagonally.
  if ((style === 'molecule' || style === 'molecule-spectrum') && hasBallStick(p.slug))
    // Centred in the open area right of the copy: between the top rule (y≈48) and the band (186).
    return p.slug === 'coq10'
      ? // CoQ10's tail is ~10× longer than its ring: show the ring end close up, the tail running off the panel.
        ballStickArt(p, FRONT.w - 78, 118, 92, 128, color, { spectrum: style === 'molecule-spectrum', rotate: -0.25, zoom: 3.2 })
      : ballStickArt(p, FRONT.w - 58, 116, 92, 128, color, { spectrum: style === 'molecule-spectrum', rotate: -1.05 });
  if ((style === 'molecule' || style === 'molecule-spectrum') && hasMolecule(p.slug))
    return moleculeArt(p, cx - 34, cy - 2, r * 1.85, r * 1.55, color, style === 'molecule-spectrum' ? { palette: 'spectrum', disperse: true } : {});
  // No molecule or shape data: a generic bead sphere, so the V2 front keeps its particle look.
  if (style === 'molecule' || style === 'molecule-spectrum')
    return particleShape(p, cx - 88, cy - 54, 104, color, { spectrum: style === 'molecule-spectrum', disperse: style === 'molecule-spectrum', fallback: true });
  if (style === 'scientific') return formScientific(p, cx, cy, r, color);
  if (style === 'organic') return formOrganic(p, cx, cy, r, color);
  const rnd = hash(p.slug + 'form');
  const ingr = Math.max(1, p.ingredients.length);
  const layers = Math.min(4, 2 + Math.floor(ingr / 3));
  const lobes = 6 + (ingr % 4);
  // Light-to-deep tones of the product colour, with only a small hue drift (no muddy mixes).
  const tones = [hueShiftDarken(color, -10, -0.55), hueShiftDarken(color, 8, -0.3), color, hueShiftDarken(color, -6, 0.15)];
  const id = `pf-${p.slug}`.replace(/[^\w-]/g, '');
  const defs: string[] = [];
  const out: string[] = [];
  for (let L = 0; L < layers; L++) {
    const rr = r * (1 - L * 0.2);
    const ox = cx + (rnd() - 0.5) * r * 0.4, oy = cy + (rnd() - 0.5) * r * 0.4;
    const rot = rnd() * Math.PI * 2;
    const pts: [number, number][] = [];
    for (let i = 0; i < lobes; i++) {
      const a = rot + (i / lobes) * Math.PI * 2;
      pts.push([ox + Math.cos(a) * rr * (0.78 + 0.3 * rnd()), oy + Math.sin(a) * rr * (0.78 + 0.3 * rnd())]);
    }
    const t = tones[L % tones.length];
    defs.push(`<radialGradient id="${id}-${L}" cx="0.35" cy="0.3" r="0.85"><stop offset="0" stop-color="${hueShiftDarken(t, 0, -0.25)}"/><stop offset="1" stop-color="${t}"/></radialGradient>`);
    out.push(`<path d="${smoothClosed(pts)}" fill="url(#${id}-${L})" fill-opacity="${n(0.5 + L * 0.13)}" style="mix-blend-mode:multiply"/>`);
  }
  return `<g><defs>${defs.join('')}</defs><g style="isolation:isolate">${out.join('')}</g></g>`;
}

// ---------- Front panel "clinical" (3 Nov, owner: Thorne / Pure Encapsulations-like) ----------
// White label, dark type, generous space, no texture. The product colour is a single accent:
// `accent: 'band'` = a colour band along the bottom carrying the net quantity; 'top' = a thin colour bar at the top.
export function frontPanelClinical(p: Product, mode: FontMode, bleed = 0, opts: { accent?: 'band' | 'top'; color?: string; form?: boolean | FormStyle } = {}) {
  const accent = opts.accent ?? 'band';
  const col = opts.color ?? p.color;
  const colText = shade(col, 0.18); // accent colour dark enough for small text on white
  const { units, servingsPerContainer } = labelCounts(p);
  const qty = netQuantity(p);
  const wt = qty.match(/^Net Wt (\d+ g) \((.+)\)$/);
  const big = wt ? wt[1] : p.form === 'powder' ? qty.split(' ')[0] : String(units);
  const unitWord = wt ? `Net Wt ${wt[2]}` : p.form === 'powder' ? qty.replace(/^\S+\s/, '') : UNITS[p.form][units === 1 ? 0 : 1];
  const dose = heroDose(p);
  const category = labelCategory(p);
  const words = p.name.split(' ');
  const descriptor = words.length > 1 && /\+$|^Complex$/.test(words[words.length - 1]) ? words.pop()! : '';
  const main = words.join(' ');
  const room = FRONT.w - 36;
  const size = Math.min(29, room / (main.length * 0.56));
  const benefit = opts.form ? wrap(p.shortBenefit.replace(/\.$/, '') + '*', 96, 8.2, 0.5).slice(0, 3) : balance(wrap(p.shortBenefit.replace(/\.$/, '') + '*', room, 8.2, 0.5).slice(0, 2));
  const caps = (x: number, y: number, t: string, sz: number, fill: string, anchor = 'start', weight = 600) =>
    `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" font-size="${sz}" font-weight="${weight}" letter-spacing="${n(sz * 0.14)}" fill="${fill}" ${font('body', mode)}>${esc(t.toUpperCase())}</text>`;
  const doseLine = V2_DOSE_LINES[p.slug] ?? dose?.line ?? '';
  const top = accent === 'top' ? 12 : 0;
  const nameY = 70 + top;
  const bandY = 186;
  const doseBlock = dose
    ? `<text x="18" y="${accent === 'band' ? 162 : 170}" font-size="27" font-weight="600" letter-spacing="-0.8" fill="${NAVY}" ${font('head', mode)}>${esc(dose.value)}<tspan font-size="12" font-weight="500" dx="1.6">${esc(dose.unit)}</tspan></text>
      ${caps(18, accent === 'band' ? 174 : 182, doseLine, 7, INK, 'start', 500)}`
    : textBlock(balance(wrap(labelSubtitle(p), opts.form ? 100 : 130, 9.4, 0.5).slice(0, 3)), 18, accent === 'band' ? 148 : 156, 9.4, 11.4, `font-weight="600" fill="${NAVY}" ${font('body', mode)}`);
  const qtyBand = `<rect x="0" y="${bandY}" width="${FRONT.w}" height="${FRONT.h - bandY + bleed}" fill="${col}"/>
    ${opts.form ? caps(18, bandY + 15, 'Dietary supplement', 7, '#fff', 'start', 700) + caps(18, bandY + 25, `${servingsPerContainer} servings`, 7, 'rgba(255,255,255,0.85)', 'start', 500) : caps(18, bandY + 23, 'Dietary supplement', 7, '#fff', 'start', 700)}
    <text x="${FRONT.w - 18}" y="${bandY + 16}" text-anchor="end" font-size="16" font-weight="600" fill="#fff" ${font('head', mode)}>${esc(big)}</text>
    ${caps(FRONT.w - 18, bandY + 26, unitWord, 7, '#fff', 'end', 600)}`;
  const qtyWhite = `<rect x="18" y="${FRONT.h - 40}" width="${FRONT.w - 36}" height="0.6" fill="#d9d4cb"/>
    ${caps(18, FRONT.h - 14, 'Dietary supplement', 7, NAVY, 'start', 700)}
    <text x="${FRONT.w - 18}" y="${FRONT.h - 20}" text-anchor="end" font-size="16" font-weight="600" fill="${NAVY}" ${font('head', mode)}>${esc(big)}</text>
    ${caps(FRONT.w - 18, FRONT.h - 10, unitWord, 7, NAVY, 'end', 600)}`;
  return `<g>
    <rect x="0" y="${-bleed}" width="${FRONT.w}" height="${FRONT.h + bleed * 2}" fill="#fff"/>
    ${opts.form ? `<clipPath id="fc-${p.slug}"><rect x="0" y="0" width="${FRONT.w + bleed}" height="186"/></clipPath><g clip-path="url(#fc-${p.slug})">${productForm(p, FRONT.w - 26, 134, 56, col, typeof opts.form === 'string' ? opts.form : 'soft')}</g>` : ''}
    ${accent === 'top' ? `<rect x="0" y="${-bleed}" width="${FRONT.w}" height="${8 + bleed}" fill="${col}"/>` : ''}
    ${wordmarkRaw(18, 27 + top, 15, mode, NAVY, NAVY)}
    ${category ? caps(FRONT.w - 18, 26 + top, category, 7, colText, 'end', 700) : ''}
    <rect x="18" y="${36 + top}" width="${FRONT.w - 36}" height="0.6" fill="#d9d4cb"/>
    <text x="18" y="${n(nameY)}" font-size="${n(size)}" font-weight="600" letter-spacing="${n(-0.02 * size)}" fill="${NAVY}" ${font('head', mode)}>${esc(main)}</text>
    ${descriptor ? `<text x="18" y="${n(nameY + 21)}" font-size="17" font-weight="500" fill="${colText}" ${font('head', mode)}>${esc(descriptor)}</text>` : ''}
    ${textBlock(benefit, 18, nameY + (descriptor ? 40 : 22), 8.2, 10.2, `font-weight="400" fill="${INK}" ${font('body', mode)}`)}
    ${doseBlock}
    ${opts.form ? '' : caps(FRONT.w - 18, accent === 'band' ? 174 : 182, `${servingsPerContainer} servings`, 7, INK, 'end', 500)}
    ${accent === 'band' ? qtyBand : qtyWhite}
  </g>`;
}

// ---------- Front panel "elegant" (14 Nov, owner: premium, clean, minimal, elegant) ----------
// All white, no illustration. Typography carries it: the wordmark, a large lighter-weight name, refined small caps and
// hairlines. The product colour is one quiet accent (a short rule or a slim edge, plus the descriptor).
// `align: 'center'` (E1) is symmetrical with a short colour rule under the wordmark; 'left' (E2) is editorial, with a
// slim colour edge on the left. Net quantity stays at legal size in the bottom 30% (21 CFR 101.105).
// Deep shade of the product colour used as the dark label's background.
// Light product colours (e.g. a pastel) are darkened further, so the paper stays deep enough for white type.
export const elegantPaper = (col: string) => {
  const [r, g, b] = (col.match(/\w\w/g) ?? []).map((h) => parseInt(h, 16) / 255);
  const l = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
  return hueShiftDarken(col, 6, Math.max(0.5, 1 - 0.28 / Math.max(l, 0.01)));
};
// Products whose label paper isn't simply a deep shade of their colour. Turmeric (owner's pick E, 14 Nov): saffron gold
// on charcoal, because any deep orange reads brown.
// Men's versions (20 Nov): spare palette G, gold on navy.
const ELEGANT_PAPER: Record<string, string> = { 'turmeric-complex': '#232327', 'creatine-for-men': '#1E2A3A', 'magnesium-for-men': '#1E2A3A' };
// Spare palettes kept for future products (owner, 14 Nov; first tried for Turmeric). To use one: set the product's colour
// to `color` and add its slug to ELEGANT_PAPER with `paper`. Previews: design/label-v3-2026-11/spare-palettes-G-H.png.
export const SPARE_LABEL_PALETTES = {
  G: { name: 'Gold on navy', color: '#D9A21B', paper: '#1E2A3A' },
  H: { name: 'Gold on deep teal', color: '#E0A526', paper: '#173A3A' },
} as const;
export const labelPaper = (p: Product) => ELEGANT_PAPER[p.slug] ?? elegantPaper(p.color);
// Hero number for blends, so every front has the same big-number anchor (14 Nov). Turmeric: 800 mg root powder +
// 100 mg 95% extract per serving = 900 mg turmeric.
const ELEGANT_HERO: Record<string, { value: string; unit: string; line: string }> = {
  'turmeric-complex': { value: '900', unit: 'mg', line: 'Turmeric root + 95% extract' },
};

export function frontPanelElegant(p: Product, mode: FontMode, bleed = 0, opts: { align?: 'center' | 'left'; color?: string; tone?: 'light' | 'dark'; logo?: number; paper?: string } = {}) {
  // 14 Nov (owner): the brand leads. Wordmark 24 (about 1.5x the 15.6 draft, ~38% of the panel width), product name
  // 30% smaller (max 17.5, was 25). Vertical positions are computed from each element's cap height with one gap, so the
  // spacing between sections is the same on every product, whatever lines it has.
  const logo = opts.logo ?? 24;
  const align = opts.align ?? 'center';
  const col = opts.color ?? p.color;
  // 'dark' (14 Nov): the whole label in a deep shade of the product colour, white type, a brighter colour edge.
  const dark = opts.tone === 'dark';
  const paper = dark ? opts.paper ?? ELEGANT_PAPER[p.slug] ?? elegantPaper(col) : '#fff';
  const accent = dark ? hueShiftDarken(col, 0, -0.45) : col; // edge and rule
  const colText = dark ? hueShiftDarken(col, 0, -0.62) : shade(col, 0.15);
  const ink = dark ? '#ffffff' : NAVY;
  const inkSoft = dark ? 'rgba(255,255,255,0.78)' : INK;
  const hair = dark ? 'rgba(255,255,255,0.28)' : '#cfc9bf';
  const { units, servingsPerContainer } = labelCounts(p);
  const qty = netQuantity(p);
  const wt = qty.match(/^Net Wt (\d+ g) \((.+)\)$/);
  const big = wt ? wt[1] : p.form === 'powder' ? qty.split(' ')[0] : String(units);
  const unitWord = wt ? `Net Wt ${wt[2]}` : p.form === 'powder' ? qty.replace(/^\S+\s/, '') : UNITS[p.form][units === 1 ? 0 : 1];
  const dose = ELEGANT_HERO[p.slug] ?? heroDose(p);
  const category = labelCategory(p);
  const words = p.name.split(' ');
  const descriptor = words.length > 1 && /\+$|^Complex$/.test(words[words.length - 1]) ? words.pop()! : '';
  const main = words.join(' ');
  const center = align === 'center';
  const x0 = center ? FRONT.w / 2 : 24; // left edge sits clear of the colour edge in E2
  const anchor = center ? 'middle' : 'start';
  const room = FRONT.w - (center ? 40 : 46);
  const caps = (y: number, t: string, sz: number, fill: string, weight = 500, x = x0, a = anchor) =>
    `<text x="${n(x)}" y="${n(y)}" text-anchor="${a}" font-size="${sz}" font-weight="${weight}" letter-spacing="${n(sz * 0.2)}" fill="${fill}" ${font('body', mode)}>${esc(t.toUpperCase())}</text>`;
  const doseLine = V2_DOSE_LINES[p.slug] ?? dose?.line ?? '';

  // Type sizes.
  const nameSize = Math.min(17.5, room / (main.length * 0.54));
  const descSize = 11;
  const doseSize = 15;
  const capsSize = 6.2;
  const benSize = 7.2, benLead = 9.4;
  const CAP = 0.72, DESC = 0.22; // cap height and descender as a share of the font size (Manrope / Inter)
  const GAP = 12; // between sections: from the bottom of one to the cap top of the next
  const TIGHT = 4.5; // inside a section (name + descriptor, dose + its caption)

  // Vertical rhythm, top to bottom. Each baseline = previous bottom + gap + this element's cap height.
  const logoY = 39; // the cross tops out at logoY - 0.8 * logo (about 20 units from the top edge)
  const ruleTop = logoY + 10;
  let bottom = ruleTop + 1.1;
  const place = (capH: number, gap: number, descent = 0) => { const y = bottom + gap + capH; bottom = y + descent; return y; };
  const catY = category ? place(capsSize * CAP, GAP) : 0;
  const nameY = place(nameSize * CAP, GAP, nameSize * DESC);
  const descY = descriptor ? place(descSize * CAP, TIGHT, descSize * DESC) : 0;
  let doseBlock = '';
  if (dose) {
    const y = place(doseSize * CAP, GAP);
    const yc = place(capsSize * CAP, 7.5); // dose → its caption: more air than TIGHT (owner, 14 Nov)
    doseBlock = `<text x="${n(x0)}" y="${n(y)}" text-anchor="${anchor}" font-size="${doseSize}" font-weight="500" letter-spacing="-0.3" fill="${ink}" ${font('head', mode)}>${esc(dose.value)}<tspan font-size="8.5" font-weight="500" dx="1.3">${esc(dose.unit)}</tspan></text>
      ${caps(yc, doseLine, capsSize, inkSoft)}`;
  } else {
    const lines = balance(wrap(labelSubtitle(p), room, 7.6, 0.5).slice(0, 2));
    const y = place(7.6 * CAP, GAP);
    bottom += (lines.length - 1) * 9.6 + 7.6 * DESC;
    doseBlock = textBlock(lines, x0, y, 7.6, 9.6, `text-anchor="${anchor}" font-weight="500" fill="${ink}" ${font('body', mode)}`);
  }
  const benefitLines = balance(wrap(p.shortBenefit.replace(/\.$/, '') + '*', room - 10, benSize, 0.5).slice(0, 2));
  const benY = place(benSize * CAP, GAP);
  bottom += (benefitLines.length - 1) * benLead + benSize * DESC;

  // Bottom zone (net quantity at legal size, 21 CFR 101.105), fixed: the count shares a baseline with "Dietary
  // supplement" and its unit line sits below the count's descender ("281 g").
  const ruleY = 182; // bottom block raised 4 units (17 Nov) so it clears the safe zone
  // "For Her" badge (owner, 20 Nov): top-right, level with the wordmark, so the vertical rhythm is unchanged.
  const herW = 50, herH = 13.5, herX = FRONT.w - 20 - herW, herY = logoY - 16.5;
  const forHer = FOR_HER_LABEL.has(p.slug)
    ? `<rect x="${n(herX)}" y="${n(herY)}" width="${herW}" height="${herH}" rx="${n(herH / 2)}" fill="${FOR_HER_BERRY}"/>${caps(herY + herH / 2 + 2.1, 'For Her', 5.9, '#fff', 700, herX + herW / 2 + 0.6, 'middle')}`
    : '';
  if (bottom > ruleY - 8) console.warn(`[labels] ${p.slug}: elegant front content ends at ${n(bottom)}, needs to end by ${ruleY - 8}`);
  return `<g>
    <rect x="0" y="${-bleed}" width="${FRONT.w}" height="${FRONT.h + bleed * 2}" fill="${paper}"/>
    ${center ? '' : `<rect x="0" y="${-bleed}" width="7" height="${FRONT.h + bleed * 2}" fill="${accent}"/>`}
    ${center ? wordmark(x0, logoY, logo, mode, ink) : wordmarkRaw(x0, logoY, logo, mode, ink, ink)}
    <rect x="${n(center ? x0 - 12 : x0)}" y="${ruleTop}" width="24" height="1.1" fill="${accent}"/>
    ${forHer}
    ${category ? caps(catY, category, capsSize, colText, 600) : ''}
    <text x="${n(x0)}" y="${n(nameY)}" text-anchor="${anchor}" font-size="${n(nameSize)}" font-weight="500" letter-spacing="${n(-0.02 * nameSize)}" fill="${ink}" ${font('head', mode)}>${esc(main)}</text>
    ${descriptor ? `<text x="${n(x0)}" y="${n(descY)}" text-anchor="${anchor}" font-size="${descSize}" font-weight="400" letter-spacing="-0.1" fill="${colText}" ${font('head', mode)}>${esc(descriptor)}</text>` : ''}
    ${doseBlock}
    ${textBlock(benefitLines, x0, benY, benSize, benLead, `text-anchor="${anchor}" font-weight="400" fill="${inkSoft}" ${font('body', mode)}`)}
    <rect x="${center ? 20 : x0}" y="${ruleY}" width="${center ? FRONT.w - 40 : FRONT.w - x0 - 20}" height="0.5" fill="${hair}"/>
    ${caps(199, 'Dietary supplement', capsSize, ink, 600, center ? 20 : x0, 'start')}
    ${caps(208.5, `${servingsPerContainer} servings`, capsSize, inkSoft, 500, center ? 20 : x0, 'start')}
    <text x="${FRONT.w - 20}" y="199" text-anchor="end" font-size="16" font-weight="500" fill="${ink}" ${font('head', mode)}>${esc(big)}</text>
    ${caps(209.5, unitWord, capsSize, ink, 600, FRONT.w - 20, 'end')}
  </g>`;
}

// The label in use (14 Nov): E2 dark. Every print label, tub and website image draws its front with this.
export const frontLabel = (p: Product, mode: FontMode, bleed = 0) => frontPanelElegant(p, mode, bleed, { align: 'left', tone: 'dark' });

// ---------- Front panel "field" (3 Nov): clinical white + a square molecule field in the top-right corner ----------
// Left column under the wordmark: category and the dose; the field fills the top-right block (bleeding off the
// top and right edges); the name, descriptor and benefit sit below it; the colour band carries the quantity.
export function frontPanelField(p: Product, mode: FontMode, bleed = 0, opts: { color?: string; art?: 'molecule' | 'illustration' } = {}) {
  const col = opts.color ?? p.color;
  const colText = shade(col, 0.18);
  const { units, servingsPerContainer } = labelCounts(p);
  const qty = netQuantity(p);
  const wt = qty.match(/^Net Wt (\d+ g) \((.+)\)$/);
  const big = wt ? wt[1] : p.form === 'powder' ? qty.split(' ')[0] : String(units);
  const unitWord = wt ? `Net Wt ${wt[2]}` : p.form === 'powder' ? qty.replace(/^\S+\s/, '') : UNITS[p.form][units === 1 ? 0 : 1];
  const dose = heroDose(p);
  const category = labelCategory(p);
  const words = p.name.split(' ');
  const descriptor = words.length > 1 && /\+$|^Complex$/.test(words[words.length - 1]) ? words.pop()! : '';
  const main = words.join(' ');
  const size = Math.min(27, (FRONT.w - 36) / (main.length * 0.56));
  const caps = (x: number, y: number, t: string, sz: number, fill: string, anchor = 'start', weight = 600) =>
    `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" font-size="${sz}" font-weight="${weight}" letter-spacing="${n(sz * 0.14)}" fill="${fill}" ${font('body', mode)}>${esc(t.toUpperCase())}</text>`;
  const doseLine = V2_DOSE_LINES[p.slug] ?? dose?.line ?? '';
  const fieldX = 98, fieldBottom = 106;
  const left = dose
    ? `<text x="18" y="84" font-size="25" font-weight="600" letter-spacing="-0.8" fill="${NAVY}" ${font('head', mode)}>${esc(dose.value)}<tspan font-size="11" font-weight="500" dx="1.4">${esc(dose.unit)}</tspan></text>
      ${wrap(doseLine.toUpperCase(), 74, 7, 0.68).slice(0, 2).map((l, i) => caps(18, 96 + i * 9, l, 7, INK, 'start', 500)).join('')}`
    : textBlock(wrap(labelSubtitle(p), 76, 8.6, 0.5).slice(0, 4), 18, 68, 8.6, 10.4, `font-weight="600" fill="${NAVY}" ${font('body', mode)}`);
  const nameY = 134;
  const benefit = wrap(p.shortBenefit.replace(/\.$/, '') + '*', FRONT.w - 36, 7.6, 0.5).slice(0, 2);
  const benY = descriptor ? nameY + 30 : nameY + 16;
  const bandY = 186;
  return `<g>
    <rect x="0" y="${-bleed}" width="${FRONT.w}" height="${FRONT.h + bleed * 2}" fill="#fff"/>
    <clipPath id="ff-${p.slug}"><rect x="0" y="${-bleed}" width="${FRONT.w + bleed}" height="${fieldBottom + 20 + bleed}"/></clipPath>
    <g clip-path="url(#ff-${p.slug})">${opts.art === 'illustration' && hasIllustration(p.slug) ? illustrationField(p, fieldX, -bleed, FRONT.w + bleed, fieldBottom, col) : moleculeField(p, fieldX, -bleed, FRONT.w + bleed, fieldBottom, col)}</g>
    ${wordmarkRaw(18, 27, 15, mode, NAVY, NAVY)}
    ${category ? caps(18, 44, category, 7, colText, 'start', 700) : ''}
    ${left}
    <text x="18" y="${nameY}" font-size="${n(size)}" font-weight="600" letter-spacing="${n(-0.02 * size)}" fill="${NAVY}" ${font('head', mode)}>${esc(main)}</text>
    ${descriptor ? `<text x="18" y="${nameY + 18}" font-size="15" font-weight="500" fill="${colText}" ${font('head', mode)}>${esc(descriptor)}</text>` : ''}
    ${textBlock(benefit, 18, benY, 7.6, 9.4, `font-weight="400" fill="${INK}" ${font('body', mode)}`)}
    <rect x="0" y="${bandY}" width="${FRONT.w}" height="${FRONT.h - bandY + bleed}" fill="${col}"/>
    ${caps(18, bandY + 17, 'Dietary supplement', 7, '#fff', 'start', 700)}
    ${caps(18, bandY + 28, `${servingsPerContainer} servings`, 7, 'rgba(255,255,255,0.85)', 'start', 500)}
    <text x="${FRONT.w - 18}" y="${bandY + 19}" text-anchor="end" font-size="16" font-weight="600" fill="#fff" ${font('head', mode)}>${esc(big)}</text>
    ${caps(FRONT.w - 18, bandY + 30, unitWord, 7, '#fff', 'end', 600)}
  </g>`;
}

// ---------- Supplement Facts (draft, from the catalog; replace with the supplier's panel) ----------

// FDA reference Daily Values (21 CFR 101.9(c), adults and children 4+) for nutrients we use.
// Botanicals and compounds without a DV keep the † mark. Amounts are read from the label text.
const DAILY_VALUES: [RegExp, number, 'mg' | 'mcg'][] = [
  [/vitamin a\b/i, 900, 'mcg'],
  [/vitamin e\b/i, 15, 'mg'],
  [/vitamin d/i, 20, 'mcg'],
  [/vitamin k/i, 120, 'mcg'],
  [/vitamin c/i, 90, 'mg'],
  [/vitamin b12|cobalamin/i, 2.4, 'mcg'],
  [/vitamin b6|pyridox/i, 1.7, 'mg'],
  [/folate|folic/i, 400, 'mcg'],
  [/biotin/i, 30, 'mcg'],
  [/zinc/i, 11, 'mg'],
  [/iron/i, 18, 'mg'],
  [/copper/i, 0.9, 'mg'],
  [/selenium/i, 55, 'mcg'],
  [/chromium/i, 35, 'mcg'],
  [/magnesium/i, 420, 'mg'],
  [/sodium/i, 2300, 'mg'],
  [/potassium/i, 4700, 'mg'],
];

// "1000 IU" vitamin D → "25 mcg (1,000 IU)" as required since 2020; %DV where a Daily Value exists.
export function factsRow(name: string, amount: string): { amount: string; dv: string } {
  const m = amount.match(/([\d.,]+)\s*(mg|mcg|µg|IU)\b/i);
  if (!m) return { amount, dv: '†' };
  let value = Number(m[1].replace(/,/g, ''));
  let unit = m[2].toLowerCase().replace('µg', 'mcg');
  let shown = amount;
  if (unit === 'iu' && /vitamin d/i.test(name)) {
    value = value / 40;
    unit = 'mcg';
    shown = `${value} mcg (${Number(m[1].replace(/,/g, '')).toLocaleString('en-US')} IU)`;
  }
  const dv = DAILY_VALUES.find(([re]) => re.test(name));
  if (!dv || unit === 'iu') return { amount: shown, dv: '†' };
  const inUnit = unit === dv[2] ? value : unit === 'mg' ? value * 1000 : value / 1000;
  return { amount: shown, dv: `${Math.round((inUnit / dv[1]) * 100)}%` };
}

export function factsPanel(p: Product, mode: FontMode, w = 190) {
  const { perServing, servingsPerContainer } = labelCounts(p);
  const unit = UNITS[p.form][perServing === 1 ? 0 : 1];
  const f = font('body', mode);
  let y = 17;
  const out: string[] = [`<text x="0" y="${y}" font-size="17" font-weight="700" letter-spacing="-0.3" fill="#000" ${f}>Supplement Facts</text>`];
  y += 4;
  out.push(`<rect x="0" y="${y}" width="${w}" height="0.8" fill="#000"/>`);
  y += 11;
  out.push(`<text x="0" y="${y}" font-size="8" fill="#000" ${f}>Serving Size: ${perServing} ${esc(unit)}${p.form === 'powder' ? ` (${esc(p.dosage.match(/\(([\d.]+\s*g)\)/)?.[1] ?? 'see directions')})` : ''}</text>`);
  y += 11;
  out.push(`<text x="0" y="${y}" font-size="8" fill="#000" ${f}>Servings Per Container: ${servingsPerContainer}</text>`);
  y += 4;
  out.push(`<rect x="0" y="${y}" width="${w}" height="5" fill="#000"/>`);
  // Long blends (7+ rows) use tighter spacing so the panel, allergen line included, fits the label at 5 pt.
  const tight = p.ingredients.length > 6;
  y += tight ? 11.5 : 13;
  out.push(`<text x="0" y="${y}" font-size="8" font-weight="700" fill="#000" ${f}>Amount Per Serving</text><text x="${w}" y="${y}" text-anchor="end" font-size="8" font-weight="700" fill="#000" ${f}>% Daily Value</text>`);
  y += 3;
  out.push(`<rect x="0" y="${y}" width="${w}" height="1.5" fill="#000"/>`);
  let undeclared = false;
  const lead = tight ? 8.8 : 10;
  for (const ing of p.ingredients.slice(0, 14)) {
    const row = factsRow(ing.name, ing.amount);
    if (row.dv === '†') undeclared = true;
    const name = wrap(ing.label ?? ing.name, w - 70, 8);
    y += tight ? 8.9 : 11;
    out.push(textBlock(name, 0, y, 8, lead, `fill="#000" ${f}`));
    out.push(`<text x="${w - 34}" y="${y}" text-anchor="end" font-size="8" fill="#000" ${f}>${esc(row.amount)}</text><text x="${w}" y="${y}" text-anchor="end" font-size="8" font-weight="700" fill="#000" ${f}>${esc(row.dv)}</text>`);
    y += (name.length - 1) * lead + (tight ? 2.1 : 3);
    out.push(`<rect x="0" y="${y}" width="${w}" height="0.6" fill="#000"/>`);
  }
  y += 2;
  out.push(`<rect x="0" y="${y}" width="${w}" height="5" fill="#000"/>`);
  y += 12;
  if (undeclared) {
    out.push(`<text x="0" y="${y}" font-size="8" fill="#000" ${f}>† Daily Value not established.</text>`);
    y += tight ? 10 : 12;
  }
  const other = wrap(`Other ingredients: ${p.otherIngredients}`, w, 8, 0.5); // 0.47 let long words cross the safe zone
  out.push(textBlock(other, 0, y, 8, 10, `fill="#000" ${f}`));
  y += other.length * 10;
  // Iron: the mandatory warning (21 CFR 101.17(e)) sits on the information panel, i.e. the panel right of the front,
  // which on our label is this one, set off in a hairline box. Same text, word for word.
  if (p.ingredients.some((i) => /\biron\b/i.test(i.name))) {
    const lines = wrap(IRON_WARNING, w - 8, 7.5, 0.5);
    y += 2;
    out.push(`<rect x="0" y="${n(y)}" width="${w}" height="${n(lines.length * 9 + 7)}" fill="none" stroke="#000" stroke-width="0.6"/>`);
    out.push(textBlock(lines, 4, y + 10, 7.5, 9, `fill="#000" ${f}`).replace('>WARNING:', '><tspan font-weight="700">WARNING:</tspan>'));
    y += lines.length * 9 + 10;
  }
  return { svg: `<g>${out.join('')}</g>`, height: y };
}

// ---------- Information panel ----------

const DISCLAIMER = '*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.';
// Biotin can skew some lab tests (FDA safety communication, 2017/2019): shown on the label and the product page.
export const BIOTIN_NOTE = 'Biotin can interfere with some lab tests, including heart (troponin) and thyroid tests. Tell your doctor and the lab that you take biotin before any blood test.';
export const hasBiotin = (p: Product) => p.ingredients.some((i) => /\bbiotin\b/i.test(i.name));
export const IRON_WARNING =
  'WARNING: Accidental overdose of iron-containing products is a leading cause of fatal poisoning in children under 6. Keep this product out of reach of children. In case of accidental overdose, call a doctor or poison control center immediately.';

function infoPanel(p: Product, mode: FontMode, w = 190) {
  const f = font('body', mode);
  const out: string[] = [];
  let y = 9;
  const gap = 3;
  const para = (label: string, text: string, size = 7) => {
    const lines = wrap(label ? `${label} ${text}` : text, w, size, 0.5);
    out.push(
      lines
        .map((l, i) => {
          const body = i === 0 ? `<tspan font-weight="700">${esc(label)}</tspan>${esc(l.slice(label.length))}` : esc(l);
          return `<text x="0" y="${n(y + i * (size + 2))}" font-size="${size}" fill="${NAVY}" ${f}>${body}</text>`;
        })
        .join('')
    );
    y += lines.length * (size + 2) + gap;
  };
  para('Directions:', p.dosage);
  para('Caution:', 'Do not exceed the recommended dose. Consult your healthcare provider before use if you are pregnant, nursing, taking medication or have a medical condition.' + (p.ageRestricted ? ' Not for use by anyone under 18.' : '') + ' Keep out of reach of children.' + (hasBiotin(p) ? ` ${BIOTIN_NOTE}` : ''));
  para('Store', 'in a cool, dry place. Do not use if the seal under the cap is broken or missing.');
  if (ORIGIN_CLAIM) para('', `${ORIGIN_CLAIM}.`);
  const disc = wrap(DISCLAIMER, w - 8, 7, 0.52);
  out.push(`<rect x="0" y="${n(y - 4)}" width="${w}" height="${n(disc.length * 8.8 + 7)}" fill="none" stroke="${NAVY}" stroke-width="0.6"/>`);
  out.push(textBlock(disc, 4, y + 4, 7, 8.8, `font-weight="700" fill="${NAVY}" ${f}`));
  y += disc.length * 8.8 + 10;
  return { svg: `<g>${out.join('')}</g>`, height: y };
}

// ---------- Full wrap-around label ----------

// Supliful's bottle template (VOX4COQ1, Nov 2026): trim 6.0" × 2.25" (600 × 225) with 0.125" bleed, 1 unit = 0.01".
// Panels in Supliful's order: Information | Front | Supplement Facts. No barcode or LOT/EXP area (Supliful prints neither).
export const LABEL = { trimW: 600, trimH: 225, bleed: 12.5, infoW: 190, frontW: 220, factsW: 190 };

function layoutPanels(p: Product, mode: FontMode) {
  const { trimH, factsW, infoW } = LABEL;
  let facts = factsPanel(p, mode, factsW - 22);
  let factsScale = 1;
  for (let i = 0; i < 3 && facts.height > trimH - 24; i++) {
    factsScale = Math.max(0.875, factsScale * ((trimH - 24) / facts.height));
    facts = factsPanel(p, mode, (factsW - 22) / factsScale);
  }
  return { facts, factsScale, info: infoPanel(p, mode, infoW - 22) };
}

// Which bottle-label panels run past the safe zone (heights include ~7 units of trailing space, so this is cautious).
export function labelOverflow(p: Product) {
  const { facts, factsScale, info } = layoutPanels(p, 'print');
  const room = LABEL.trimH - 24 + 7;
  return [
    ...(facts.height * factsScale > room ? [`facts ${Math.round(facts.height * factsScale - room)} over`] : []),
    ...(info.height > room - 30 ? [`info ${Math.round(info.height - (room - 30))} over`] : []),
  ];
}

// The print label is E2 dark by default (14 Nov): the whole wrap in the deep product colour, the elegant front, and the
// directions and Supplement Facts on white cards so the small type stays dark on white. `style: 'v2'` gives the
// clinical-white particle front, `style: 'a3'` the earlier colour-block front (both on white).
export type LabelStyle = 'elegant' | 'v2' | 'a3';
export function fullLabelSvg(p: Product, opts: { mode?: FontMode; guides?: boolean; style?: LabelStyle } = {}) {
  const mode = opts.mode ?? 'print';
  const style = opts.style ?? 'elegant';
  const v2 = style === 'v2';
  const elegant = style === 'elegant';
  const { trimW, trimH, bleed, frontW, infoW } = LABEL;
  const W = trimW + bleed * 2;
  const H = trimH + bleed * 2;
  // Long panels (blends) are laid out wider, then scaled down to fill the panel's width and fit its height, but
  // never below 0.875, so the smallest (8-unit) facts type stays at 5 pt, Supliful's minimum (1 unit = 0.72 pt).
  // The FDA type-size rules (101.2(c), 101.36(i)) still need checking against Supliful's guide: see docs/TODO.md.
  const { facts, factsScale, info } = layoutPanels(p, mode);
  const fx = bleed + infoW; // front panel's left edge
  const sx = fx + frontW; // facts panel's left edge
  const f = font('body', mode);
  const guides = opts.guides
    ? `<g id="guides-do-not-print" fill="none" stroke-width="0.6">
        <rect x="${bleed}" y="${bleed}" width="${trimW}" height="${trimH}" stroke="#e11d48"/>
        <rect x="${bleed + 10}" y="${bleed + 10}" width="${trimW - 20}" height="${trimH - 20}" stroke="#2563eb" stroke-dasharray="3 3"/>
        <line x1="${fx}" y1="0" x2="${fx}" y2="${H}" stroke="#94a3b8" stroke-dasharray="2 4"/>
        <line x1="${sx}" y1="0" x2="${sx}" y2="${H}" stroke="#94a3b8" stroke-dasharray="2 4"/>
      </g>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W / 100}in" height="${H / 100}in" viewBox="0 0 ${W} ${H}">
  <title>Noovit label — ${esc(p.name)} (draft)</title>
  <rect width="${W}" height="${H}" fill="${elegant ? labelPaper(p) : '#fff'}"/>
  ${elegant ? `<rect x="${bleed + 5}" y="${bleed + 5}" width="${infoW - 10}" height="${trimH - 10}" rx="3" fill="#fff"/>
  <rect x="${sx + 5}" y="${bleed + 5}" width="${LABEL.factsW - 10}" height="${trimH - 10}" rx="3" fill="#fff"/>` : ''}
  <g id="info" transform="translate(${bleed + 12} ${bleed + 12})">${info.svg}
    <g transform="translate(0 ${trimH - 24 - 18.5})">
      <text x="0" y="6" font-size="7" font-weight="700" fill="${NAVY}" ${f}>Distributed by ${LEGAL_NAME}</text>
      <text x="0" y="15.5" font-size="7" fill="${NAVY}" ${f}>30 N Gould St Ste R, Sheridan, WY 82801</text>
    </g>
  </g>
  ${elegant
    ? `<g id="front" transform="translate(${fx} ${bleed})">${frontLabel(p, mode, bleed)}</g>`
    : v2
    ? `<clipPath id="v2front-${p.slug}"><rect x="${fx}" y="0" width="${FRONT.w}" height="${H}"/></clipPath><g clip-path="url(#v2front-${p.slug})"><g id="front" transform="translate(${fx} ${bleed})">${frontPanelClinical(p, mode, bleed, { accent: 'band', color: p.color, form: 'molecule-spectrum' })}</g></g>`
    : `<g id="front" transform="translate(${fx} ${bleed})">${frontPanel(p, mode, bleed)}</g>`}
  <g id="facts" transform="translate(${sx + 10} ${bleed + 12}) scale(${n(factsScale)})">${facts.svg}</g>
  ${guides}
</svg>`;
}

// ---------- Bottle mockups for the website ----------

export type BottleVariant = 'front' | 'duo' | 'facts';

// A white HDPE bottle (or a wide tub for powders) seen slightly from above, so every circle is an ellipse.
// The label is the flat front panel above, clipped to the curved band and shaded like a cylinder.
// Drawn in a 400×460 box centred on x = 200.
export function bottle(p: Product, mode: FontMode, uid: string, pattern: LabelPattern = 'top') {
  const jar = p.form === 'powder' || p.form === 'chews';
  const cx = 200;
  const e = 0.07; // ellipse ratio for cap and base: ry = r·e (a near-front view)
  const eLabel = 0.022; // label edges read almost straight, like a product photo
  const R = jar ? 112 : 94;
  const capR = jar ? 104 : 66;
  const capTop = jar ? 112 : 70;
  const capBot = jar ? 152 : 113;
  const neck = jar ? 104 : 58;
  const shoulder = jar ? 160 : 131;
  const bodyTop = jar ? 166 : 180;
  const base = 410;
  const lw = R * 2 + 4; // a touch wider than the body so no bare bottle shows at the edges
  const scale = lw / FRONT.w;
  const LT = jar ? 176 : 192;
  const LB = LT + FRONT.h * scale;
  const X0 = cx - R;
  const X1 = cx + R;
  const arc = (y: number, r: number, sweep = 0) => `A${r} ${n(r * e)} 0 0 ${sweep} ${sweep ? cx - r : cx + r} ${y}`;
  const body = jar
    ? `M${X0} ${bodyTop} V${base} ${arc(base, R)} V${bodyTop} ${arc(bodyTop, R, 1)} Z`
    : `M${cx - neck} ${shoulder - 6} C${cx - neck - 6} ${shoulder + 8} ${X0} ${shoulder + 6} ${X0} ${bodyTop} V${base} ${arc(base, R)} V${bodyTop} C${X1} ${shoulder + 6} ${cx + neck + 6} ${shoulder + 8} ${cx + neck} ${shoulder - 6} Z`;
  const arcL = (y: number, r: number, sweep = 0) => `A${r} ${n(r * eLabel)} 0 0 ${sweep} ${sweep ? cx - r : cx + r} ${y}`;
  const band = `M${X0} ${n(LT)} ${arcL(n(LT), R)} V${n(LB)} ${arcL(n(LB), R, 1)} Z`;
  const ribs = Array.from({ length: Math.round((capR * 2) / 2.4) - 1 }, (_, i) =>
    `<rect x="${n(cx - capR + 1.6 + i * 2.4)}" y="${capTop + 1}" width="0.8" height="${n(capBot - capTop + capR * e - 1)}" fill="#000" opacity="${n(0.035 + 0.035 * Math.abs(Math.sin(i / 6)))}"/>`
  ).join('');
  return `<defs>
    <linearGradient id="cyl-${uid}" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.07"/><stop offset="0.1" stop-color="#000" stop-opacity="0.015"/>
      <stop offset="0.3" stop-color="#fff" stop-opacity="0.14"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.06"/>
      <stop offset="0.8" stop-color="#000" stop-opacity="0.02"/><stop offset="1" stop-color="#000" stop-opacity="0.09"/>
    </linearGradient>
    <linearGradient id="sh-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.07"/><stop offset="0.35" stop-color="#fff" stop-opacity="0.4"/><stop offset="1" stop-color="#000" stop-opacity="0.03"/></linearGradient>
    <linearGradient id="cap-${uid}" x1="0" x2="1"><stop offset="0" stop-color="#d6d5d1"/><stop offset="0.14" stop-color="#fbfbfa"/><stop offset="0.3" stop-color="#ffffff"/><stop offset="0.7" stop-color="#f1f1ee"/><stop offset="1" stop-color="#cdccc7"/></linearGradient>
    <linearGradient id="ct-${uid}" x1="0" x2="1"><stop offset="0" stop-color="#f4f4f2"/><stop offset="0.3" stop-color="#fff"/><stop offset="1" stop-color="#ececea"/></linearGradient>
    <filter id="soft-${uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="hl-${uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
    <clipPath id="body-${uid}"><path d="${body}"/></clipPath>
    <clipPath id="label-${uid}"><path d="${band}"/></clipPath>
  </defs>
  <ellipse cx="${cx - 14}" cy="${base + 8}" rx="${R + 26}" ry="15" fill="#000" opacity="0.13" filter="url(#soft-${uid})"/>
  <ellipse cx="${cx}" cy="${base + 3}" rx="${R - 4}" ry="6" fill="#000" opacity="0.22" filter="url(#hl-${uid})"/>
  <g clip-path="url(#body-${uid})">
    <rect x="${X0 - 10}" y="${shoulder - 20}" width="${R * 2 + 20}" height="${base - shoulder + 40}" fill="#f8f8f6"/>
    <rect x="${X0 - 10}" y="${shoulder - 20}" width="${R * 2 + 20}" height="${bodyTop - shoulder + 30}" fill="url(#sh-${uid})"/>
    <g clip-path="url(#label-${uid})"><g transform="translate(${n(cx - lw / 2)} ${n(LT)}) scale(${n(scale)})">${pattern === 'top' ? `<rect x="-20" y="-30" width="${FRONT.w + 40}" height="${FRONT.h + 60}" fill="${labelPaper(p)}"/>${frontLabel(p, mode, 30)}` : frontPanel(p, mode, 30, pattern)}</g></g>
    <path d="M${X0} ${n(LT)} ${arcL(n(LT), R)}" fill="none" stroke="#000" stroke-opacity="0.07"/>
    <path d="M${X0} ${n(LB)} ${arcL(n(LB), R)}" fill="none" stroke="#000" stroke-opacity="0.07"/>
    <rect x="${X0 - 10}" y="${shoulder - 20}" width="${R * 2 + 20}" height="${base - shoulder + 40}" fill="url(#cyl-${uid})"/>
  </g>
  <path d="M${cx - neck} ${capBot - 2} ${arc(capBot - 2, neck)} V${shoulder - 4} ${arc(shoulder - 4, neck, 1)} Z" fill="url(#cap-${uid})"/>
  <path d="M${cx - neck} ${capBot + 1} ${arc(capBot + 1, neck)} V${capBot + 5} ${arc(capBot + 5, neck, 1)} Z" fill="#000" opacity="0.08"/>
  <path d="M${cx - capR} ${capTop} V${capBot} ${arc(capBot, capR)} V${capTop} Z" fill="url(#cap-${uid})"/>
  ${ribs}
  <ellipse cx="${cx}" cy="${capTop}" rx="${capR}" ry="${n(capR * e)}" fill="url(#ct-${uid})" stroke="#d5dade" stroke-width="0.8"/>`;
}

// Cream scene with a soft floor line.
// Drawn bottles and tubs sit on the same cream as the studio photos (17 Nov), so the shop grid matches.
export function scene(uid: string) {
  return `<defs><radialGradient id="bg-${uid}" cx="0.5" cy="0.42" r="0.75"><stop offset="0" stop-color="#f3eee5"/><stop offset="1" stop-color="#ebe4d8"/></radialGradient></defs><rect width="400" height="400" fill="url(#bg-${uid})"/>`;
}

// Square 400×400 image. `uid` keeps gradient/clip ids unique when several images share a page.
// backdrop 'white': plain white square with a larger bottle, for Google Shopping / Meta feeds (Merchant Center prefers it).
export function bottleSvg(p: Product, variant: BottleVariant = 'front', opts: { mode?: FontMode; uid?: string; size?: number; pattern?: LabelPattern; backdrop?: 'scene' | 'white' } = {}) {
  const mode = opts.mode ?? 'web';
  const uid = (opts.uid ?? `${p.slug}-${variant}`).replace(/[^a-z0-9-]/gi, '');
  const place = (x: number, y: number, s: number, id: string) => `<g transform="translate(${x} ${y}) scale(${s})">${bottle(p, mode, id, opts.pattern)}</g>`;
  let body = '';
  const parts = p.bundleComponents ?? [];
  const placePart = (q: Product, x: number, y: number, s: number, id: string) => `<g transform="translate(${x} ${y}) scale(${s})">${bottle(q, mode, id, opts.pattern)}</g>`;
  if (parts.length >= 2 && variant !== 'facts') {
    // Bundles show their real bottles: two side by side, or three with the middle one in front.
    body =
      parts.length === 2
        ? placePart(parts[0], -34, 20, 0.74, `${uid}a`) + placePart(parts[1], 104, 6, 0.8, `${uid}b`)
        : placePart(parts[0], -62, 58, 0.62, `${uid}a`) + placePart(parts[2], 158, 58, 0.62, `${uid}c`) + placePart(parts[1], 40, 22, 0.72, `${uid}b`);
  } else {
    if (variant === 'front') body = opts.backdrop === 'white' ? place(14, -22, 0.95, uid) : place(26, -6, 0.87, uid);
    if (variant === 'duo') body = place(-34, 20, 0.74, `${uid}a`) + place(104, 6, 0.8, `${uid}b`);
  }
  if (variant === 'facts') {
    // The panel always fits inside its white card: scale to the card's inner width, or down to fit the height.
    const W = 250;
    const facts = factsPanel(p, mode, W);
    const s = Math.min(1.12, 336 / facts.height);
    const pad = 20;
    const cardW = W * s + pad * 2;
    const cardH = facts.height * s + pad * 2;
    body = `<rect x="${n(200 - cardW / 2)}" y="${n(200 - cardH / 2)}" width="${n(cardW)}" height="${n(cardH)}" rx="6" fill="#fff" stroke="#e3ded5"/>
      <g transform="translate(${n(200 - (W * s) / 2)} ${n(200 - (facts.height * s) / 2)}) scale(${n(s)})">${facts.svg}</g>`;
  }
  const size = opts.size ? `width="${opts.size}" height="${opts.size}"` : '';
  const backdrop = opts.backdrop === 'white' ? '<rect width="400" height="400" fill="#fff"/>' : scene(uid);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" ${size}>${backdrop}${body}</svg>`;
}

// ---------- Supliful tub label (powders) ----------

// Supliful's tub template: trim 11" × 3" with 0.125" bleed (1 unit = 0.01"). Same panels as their template:
// directions and warnings on the left, our front panel in the middle (scaled to the full height), Supplement Facts on
// the right. Text stays 0.25" inside the trim. Their editor adds a lot/QR code bottom-left, so that corner stays clear.
export const TUB_LABEL = { trimW: 1100, trimH: 300, bleed: 12.5 };

export function tubLabelSvg(p: Product, opts: { mode?: FontMode; guides?: boolean; style?: LabelStyle } = {}) {
  const mode = opts.mode ?? 'print';
  const style = opts.style ?? 'elegant'; // as on the bottles (14 Nov)
  const v2 = style === 'v2';
  const elegant = style === 'elegant';
  const { trimW, trimH, bleed } = TUB_LABEL;
  const W = trimW + bleed * 2;
  const H = trimH + bleed * 2;
  const f = font('body', mode);
  const s = trimH / FRONT.h; // front panel scale
  const fw = FRONT.w * s;
  const fx = bleed + (trimW - fw) / 2;
  const info = infoPanel(p, mode, 250);
  const is = Math.min(1.36, 205 / info.height);
  const facts = factsPanel(p, mode, 210);
  const fs = Math.min(1.3, 250 / facts.height);
  const guides = opts.guides
    ? `<g id="guides-do-not-print" fill="none" stroke-width="0.6">
        <rect x="${bleed}" y="${bleed}" width="${trimW}" height="${trimH}" stroke="#e11d48"/>
        <rect x="${bleed + 12.5}" y="${bleed + 12.5}" width="${trimW - 25}" height="${trimH - 25}" stroke="#2563eb" stroke-dasharray="3 3"/>
        <rect x="${bleed + 12.5}" y="${bleed + trimH - 82}" width="70" height="70" stroke="#94a3b8" stroke-dasharray="2 4"/>
      </g>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W / 100}in" height="${H / 100}in" viewBox="0 0 ${W} ${H}">
  <title>Noovit tub label — ${esc(p.name)}</title>
  <rect width="${W}" height="${H}" fill="${elegant ? labelPaper(p) : '#fff'}"/>
  ${elegant ? `<rect x="${bleed + 12}" y="${bleed + 12}" width="${n(fx - bleed - 24)}" height="${trimH - 24}" rx="4" fill="#fff"/>
  <rect x="${n(fx + fw + 12)}" y="${bleed + 12}" width="${n(bleed + trimW - 12 - (fx + fw + 12))}" height="${trimH - 24}" rx="4" fill="#fff"/>` : ''}
  <g id="info" transform="translate(${bleed + 25} ${bleed + 22}) scale(${n(is)})">${info.svg}</g>
  <g id="distributor" transform="translate(${bleed + 100} ${bleed + trimH - 58})">
    <text x="0" y="0" font-size="9" font-weight="700" fill="${NAVY}" ${f}>Distributed by ${LEGAL_NAME}</text>
    <text x="0" y="12" font-size="9" fill="${NAVY}" ${f}>30 N Gould St Ste R, Sheridan, WY 82801</text>
    <text x="0" y="24" font-size="9" fill="${NAVY}" ${f}>noovit.com</text>
  </g>
  ${elegant
    ? `<g id="front" transform="translate(${n(fx)} ${bleed}) scale(${n(s)})">${frontLabel(p, mode, bleed / s)}</g>`
    : v2
    ? `<clipPath id="v2tub-${p.slug}"><rect x="${n(fx)}" y="0" width="${n(fw)}" height="${H}"/></clipPath><g clip-path="url(#v2tub-${p.slug})"><g id="front" transform="translate(${n(fx)} ${bleed}) scale(${n(s)})">${frontPanelClinical(p, mode, bleed / s, { accent: 'band', color: p.color, form: 'molecule-spectrum' })}</g></g>`
    : `<g id="front" transform="translate(${n(fx)} ${bleed}) scale(${n(s)})">${frontPanel(p, mode, bleed / s)}</g>`}
  <g id="facts" transform="translate(${n(elegant ? (fx + fw + 12 + bleed + trimW - 12) / 2 - (210 * fs) / 2 : bleed + trimW - 25 - 210 * fs)} ${bleed + 25}) scale(${n(fs)})">${facts.svg}</g>
  ${guides}
</svg>`;
}
