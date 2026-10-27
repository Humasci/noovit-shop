import { Product } from '@/types';
import { CROSS_GAP, MARK_CROSS, crossTile } from '@/lib/brand/cross';

// Noovit label system, drawn as SVG strings so one design feeds three places:
//  - the print draft of the full wrap-around label (fullLabelSvg, real units: 1 = 0.01 inch),
//  - the bottle images on the website (bottleSvg in 'web' mode, fonts from next/font CSS variables),
//  - the PNG images for feeds and social previews (bottleSvg in 'print' mode, rendered with the TTFs in assets/fonts).
// All copy comes from the product record, so every product's label stays consistent with its page.

export type FontMode = 'web' | 'print';

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
  if (p.form === 'powder') {
    const grams = Number(p.dosage.match(/\((\d+)\s*g\)/)?.[1]);
    return grams ? `Net Wt ${grams * p.servings} g (${(grams * p.servings / 28.35).toFixed(1)} oz)` : `${p.servings} Servings`;
  }
  return `${units} ${UNITS[p.form][units === 1 ? 0 : 1]}`;
}


// ---------- Brand marks ----------

// Funnel Display Medium "n" outline at 100 units (x 3.25–57.75, baseline 0, x-height 50.9), so the icon needs no font.
const N_PATH =
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
const BAND = 158; // colour block above, white band below; identity and net quantity sit in the bottom 30%

// Darker shade of the product colour for small text on white.
function shade(hex: string, k = 0.35) {
  return '#' + (hex.match(/\w\w/g) ?? []).map((h) => Math.round(parseInt(h, 16) * (1 - k)).toString(16).padStart(2, '0')).join('');
}

// The "complex details" line under the product name (draft copy; match it to the supplier's formula).
const SUBTITLES: Record<string, string> = {
  'probiotic-complex': '12 Strains, 40B CFU + Prebiotic',
  'glucosamine-complex': 'With Chondroitin, MSM & Curcumin',
  'collagen-complex': 'With Hyaluronic Acid & Vitamin C',
  'menopause-complex': 'Black Cohosh, Sage, D3 & B6',
  'magnesium-complex': '3 Forms of Magnesium + Zinc & D3',
  zinc: 'Zinc Picolinate 25mg + Copper',
  'iron-complex': 'Gentle Bisglycinate + Vitamin C',
  'vitamin-d3-k2': '2000 IU D3 + 75mcg K2 (MK-7)',
  'turmeric-complex': '95% Curcuminoids + Black Pepper',
  'berberine-complex': '500mg Berberine HCl + Chromium',
  ashwagandha: '600mg Root Extract, 5% Withanolides',
  multivitamin: '23 Active Vitamins & Minerals',
  'biotin-complex': 'With Zinc & Selenium',
  creatine: 'Micronised Monohydrate, 5g Serving',
  'mushroom-blend-powder': "Lion's Mane, Cordyceps, Reishi & Chaga",
  'focus-complex': "Lion's Mane, Bacopa & L-Theanine",
  'lions-mane': '1000mg Fruiting Body Extract',
  'l-theanine': '200mg Pure L-Theanine',
  nac: 'N-Acetyl Cysteine 600mg',
};
const shortName = (s: string) => s.replace(/\s*\(.*?\)/g, '').replace(/ Extract| Sulfate| Citrate| Glycinate| Bisglycinate| Picolinate| Malate/g, '');
export function labelSubtitle(p: Product) {
  if (SUBTITLES[p.slug]) return SUBTITLES[p.slug];
  const extras = p.ingredients.slice(1, 3).map((i) => shortName(i.name));
  return extras.length ? `With ${extras.join(' & ')}` : `${p.ingredients[0]?.amount ?? ''} ${shortName(p.ingredients[0]?.name ?? '')}`.trim();
}

// Origin claim. FTC rule: an unqualified "Made in USA" needs all or virtually all ingredients to be domestic too;
// with imported ingredients use e.g. "Made in the USA with imported ingredients". Confirm with the supplier.
export const ORIGIN_CLAIM = 'Made in the USA';

// First word on line one, the rest on line two; sized to clear the vertical wordmark.
function nameLines(name: string, room: number) {
  const words = name.split(' ');
  const lines = words.length > 1 ? [words[0], words.slice(1).join(' ')] : [name];
  const size = Math.min(20, room / (Math.max(...lines.map((l) => l.length)) * 0.6));
  return { lines, size };
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

// Drawn at (0,0); callers translate/scale it. `bleed` extends both colour areas past the trim.
// Colour block: icon, origin, product name, complex details; the vertical "noovit" wordmark is centred on the right edge.
// White band (bottom 30%): benefit, "Dietary Supplement", net quantity.
export function frontPanel(p: Product, mode: FontMode, bleed = 0, pattern: LabelPattern = 'top') {
  const shift = pattern === 'band' ? 10 : 0; // white-band content moves down to make room for the dissolve
  const vSize = 28;
  const vLen = (3.02 + 0.44) * vSize; // wordmark length incl. the cross
  const { lines, size } = nameLines(p.name, FRONT.w - 18 - 54);
  const dark = shade(p.color);
  const { units } = labelCounts(p);
  const qty = netQuantity(p);
  const unitWord = p.form === 'powder' ? qty.replace(/^\S+\s/, '') : UNITS[p.form][units === 1 ? 0 : 1];
  const big = p.form === 'powder' ? qty.split(' ')[0] : String(units);
  const benefit = balance(wrap(p.shortBenefit.replace(/\.$/, '') + '*', 126, 9.6, 0.5).slice(0, 3));
  const sub = balance(wrap(labelSubtitle(p), FRONT.w - 18 - 50, 10, 0.5).slice(0, 2));
  // Name + details sit in the lower part of the colour block, balanced against the icon above.
  const nameY = lines.length > 1 ? 96 : 106;
  const subY = nameY + (lines.length - 1) * size * 1.06 + 16;
  return `<g>
    <rect x="0" y="${-bleed}" width="${FRONT.w}" height="${BAND + bleed}" fill="${p.color}"/>
    <rect x="0" y="${BAND}" width="${FRONT.w}" height="${FRONT.h - BAND + bleed}" fill="#fff"/>
    ${labelMosaic(p, pattern)}
    <g transform="translate(14 14) scale(0.34)">${icon('#fff')}</g>
    <text x="18" y="67" font-size="9.4" font-weight="500" fill="#fff" ${font('body', mode)}>${esc(ORIGIN_CLAIM)}</text>
    ${textBlock(lines, 18, nameY, n(size), n(size * 1.06), `font-weight="600" letter-spacing="${n(-0.01 * size)}" fill="#fff" ${font('head', mode)}`)}
    ${textBlock(sub, 18, subY, 10, 12, `font-weight="500" fill="#fff" opacity="0.92" ${font('body', mode)}`)}
    <g transform="translate(${FRONT.w - 14} ${n(BAND / 2 + vLen / 2)}) rotate(-90)">${wordmarkRaw(0, 0, vSize, mode, '#fff', '#fff', 0.62)}</g>
    ${textBlock(benefit, 18, BAND + 20 + shift, 9.6, 11.6, `font-weight="500" fill="${INK}" ${font('body', mode)}`)}
    <text x="18" y="${FRONT.h - 13 + shift / 4}" font-size="7.6" font-weight="600" letter-spacing="1" fill="${dark}" ${font('body', mode)}>DIETARY SUPPLEMENT</text>
    <text x="${FRONT.w - 18}" y="${BAND + 34 + shift}" text-anchor="end" font-size="21.7" font-weight="600" fill="${dark}" ${font('head', mode)}>${esc(big)}</text>
    <text x="${FRONT.w - 18}" y="${BAND + 52 + shift * 0.6}" text-anchor="end" font-size="9.4" font-weight="600" letter-spacing="0.8" fill="${dark}" ${font('body', mode)}>${esc(unitWord.toUpperCase())}</text>
  </g>`;
}

// ---------- Supplement Facts (draft, from the catalog; replace with the supplier's panel) ----------

export function factsPanel(p: Product, mode: FontMode, w = 190) {
  const { perServing, servingsPerContainer } = labelCounts(p);
  const unit = UNITS[p.form][perServing === 1 ? 0 : 1];
  const f = font('body', mode);
  let y = 17;
  const out: string[] = [`<text x="0" y="${y}" font-size="17" font-weight="700" letter-spacing="-0.3" fill="#000" ${f}>Supplement Facts</text>`];
  y += 4;
  out.push(`<rect x="0" y="${y}" width="${w}" height="0.8" fill="#000"/>`);
  y += 11;
  out.push(`<text x="0" y="${y}" font-size="8" fill="#000" ${f}>Serving Size: ${perServing} ${esc(unit)}${p.form === 'powder' ? ` (${esc(p.dosage.match(/\((\d+\s*g)\)/)?.[1] ?? 'see directions')})` : ''}</text>`);
  y += 11;
  out.push(`<text x="0" y="${y}" font-size="8" fill="#000" ${f}>Servings Per Container: ${servingsPerContainer}</text>`);
  y += 4;
  out.push(`<rect x="0" y="${y}" width="${w}" height="5" fill="#000"/>`);
  y += 13;
  out.push(`<text x="0" y="${y}" font-size="7" font-weight="700" fill="#000" ${f}>Amount Per Serving</text><text x="${w}" y="${y}" text-anchor="end" font-size="7" font-weight="700" fill="#000" ${f}>% Daily Value</text>`);
  y += 3;
  out.push(`<rect x="0" y="${y}" width="${w}" height="1.5" fill="#000"/>`);
  for (const ing of p.ingredients.slice(0, 6)) {
    const name = wrap(ing.name, w - 70, 8);
    y += 11;
    out.push(textBlock(name, 0, y, 8, 10, `fill="#000" ${f}`));
    out.push(`<text x="${w - 30}" y="${y}" text-anchor="end" font-size="8" fill="#000" ${f}>${esc(ing.amount)}</text><text x="${w}" y="${y}" text-anchor="end" font-size="8" fill="#000" ${f}>†</text>`);
    y += (name.length - 1) * 10 + 3;
    out.push(`<rect x="0" y="${y}" width="${w}" height="0.6" fill="#000"/>`);
  }
  y += 2;
  out.push(`<rect x="0" y="${y}" width="${w}" height="5" fill="#000"/>`);
  y += 12;
  out.push(`<text x="0" y="${y}" font-size="7" fill="#000" ${f}>† Daily Value not established.</text>`);
  y += 12;
  const other = wrap(`Other ingredients: ${p.otherIngredients}`, w, 7, 0.5);
  out.push(textBlock(other, 0, y, 7, 9, `fill="#000" ${f}`));
  y += other.length * 9;
  return { svg: `<g>${out.join('')}</g>`, height: y };
}

// ---------- Information panel ----------

const DISCLAIMER = '*These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.';
const IRON_WARNING =
  'WARNING: Accidental overdose of iron-containing products is a leading cause of fatal poisoning in children under 6. Keep this product out of reach of children. In case of accidental overdose, call a doctor or poison control center immediately.';

function infoPanel(p: Product, mode: FontMode, w = 190) {
  const f = font('body', mode);
  const out: string[] = [];
  let y = 9;
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
    y += lines.length * (size + 2) + 3;
  };
  para('Directions:', p.dosage);
  const iron = p.ingredients.some((i) => /\biron\b/i.test(i.name));
  para('Caution:', 'Consult your healthcare provider before use if you are pregnant, nursing, taking medication or have a medical condition.' + (iron ? '' : ' Keep out of reach of children.'));
  if (iron) para('', IRON_WARNING, 6.2);
  para('Store', 'in a cool, dry place. Do not use if the seal under the cap is broken or missing.');
  const disc = wrap(DISCLAIMER, w - 8, 6.6, 0.52);
  out.push(`<rect x="0" y="${n(y - 4)}" width="${w}" height="${n(disc.length * 8.4 + 7)}" fill="none" stroke="${NAVY}" stroke-width="0.6"/>`);
  out.push(textBlock(disc, 4, y + 4, 6.6, 8.4, `font-weight="700" fill="${NAVY}" ${f}`));
  y += disc.length * 8.4 + 10;
  return { svg: `<g>${out.join('')}</g>`, height: y };
}

// ---------- Full wrap-around label ----------

// Trim 6.5" × 2.25" (650 × 225) with 0.125" bleed. Panels: Supplement Facts | Front | Information.
export const LABEL = { trimW: 650, trimH: 225, bleed: 12.5, factsW: 215, frontW: 220, infoW: 215 };

export function fullLabelSvg(p: Product, opts: { mode?: FontMode; guides?: boolean } = {}) {
  const mode = opts.mode ?? 'print';
  const { trimW, trimH, bleed, factsW, frontW } = LABEL;
  const W = trimW + bleed * 2;
  const H = trimH + bleed * 2;
  const facts = factsPanel(p, mode, factsW - 25);
  const info = infoPanel(p, mode, LABEL.infoW - 25);
  const fx = bleed + factsW;
  const ix = fx + frontW;
  const f = font('body', mode);
  const guides = opts.guides
    ? `<g id="guides-do-not-print" fill="none" stroke-width="0.6">
        <rect x="${bleed}" y="${bleed}" width="${trimW}" height="${trimH}" stroke="#e11d48"/>
        <rect x="${bleed + 10}" y="${bleed + 10}" width="${trimW - 20}" height="${trimH - 20}" stroke="#2563eb" stroke-dasharray="3 3"/>
        <line x1="${fx}" y1="0" x2="${fx}" y2="${H}" stroke="#94a3b8" stroke-dasharray="2 4"/>
        <line x1="${ix}" y1="0" x2="${ix}" y2="${H}" stroke="#94a3b8" stroke-dasharray="2 4"/>
      </g>`
    : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W / 100}in" height="${H / 100}in" viewBox="0 0 ${W} ${H}">
  <title>Noovit label — ${esc(p.name)} (draft)</title>
  <rect width="${W}" height="${H}" fill="#fff"/>
  <g id="facts" transform="translate(${bleed + 13} ${bleed + 12})">${facts.svg}</g>
  <g id="front" transform="translate(${fx} ${bleed})">${frontPanel(p, mode, bleed)}</g>
  <g id="info" transform="translate(${ix + 12} ${bleed + 12})">${info.svg}
    <g transform="translate(0 ${trimH - 24 - 66})">
      <rect width="96" height="66" fill="#fff" stroke="#9ca3af" stroke-width="0.5" stroke-dasharray="2 2"/>
      <text x="48" y="36" text-anchor="middle" font-size="7" fill="#6b7280" ${f}>UPC barcode (GS1)</text>
      <rect x="104" y="0" width="86" height="30" fill="#fff" stroke="#9ca3af" stroke-width="0.5" stroke-dasharray="2 2"/>
      <text x="147" y="18" text-anchor="middle" font-size="6.5" fill="#6b7280" ${f}>LOT / EXP</text>
      <text x="104" y="44" font-size="6.5" font-weight="700" fill="${NAVY}" ${f}>Distributed by Noovit</text>
      <text x="104" y="53" font-size="6.5" fill="${NAVY}" ${f}>[Street address]</text>
      <text x="104" y="62" font-size="6.5" fill="${NAVY}" ${f}>[City, ST ZIP] · noovit.com</text>
    </g>
  </g>
  ${guides}
</svg>`;
}

// ---------- Bottle mockups for the website ----------

export type BottleVariant = 'front' | 'duo' | 'facts';

// A white HDPE bottle (or a wide tub for powders) seen slightly from above, so every circle is an ellipse.
// The label is the flat front panel above, clipped to the curved band and shaded like a cylinder.
// Drawn in a 400×460 box centred on x = 200.
function bottle(p: Product, mode: FontMode, uid: string, pattern: LabelPattern = 'top') {
  const jar = p.form === 'powder' || p.form === 'chews';
  const cx = 200;
  const e = 0.07; // ellipse ratio for cap and base: ry = r·e (a near-front view)
  const eLabel = 0.022; // label edges read almost straight, like a product photo
  const R = jar ? 112 : 94;
  const capR = jar ? 104 : 56;
  const capTop = jar ? 112 : 64;
  const capBot = jar ? 152 : 124;
  const neck = jar ? 104 : 50;
  const shoulder = jar ? 160 : 132;
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
    : `M${cx - neck} ${shoulder - 6} C${cx - neck} ${shoulder + 18} ${X0} ${shoulder + 16} ${X0} ${bodyTop} V${base} ${arc(base, R)} V${bodyTop} C${X1} ${shoulder + 16} ${cx + neck} ${shoulder + 18} ${cx + neck} ${shoulder - 6} Z`;
  const arcL = (y: number, r: number, sweep = 0) => `A${r} ${n(r * eLabel)} 0 0 ${sweep} ${sweep ? cx - r : cx + r} ${y}`;
  const band = `M${X0} ${n(LT)} ${arcL(n(LT), R)} V${n(LB)} ${arcL(n(LB), R, 1)} Z`;
  const ribs = Array.from({ length: Math.round((capR * 2) / 3.05) - 1 }, (_, i) =>
    `<rect x="${n(cx - capR + 2 + i * 3.05)}" y="${capTop}" width="1.2" height="${n(capBot - capTop + capR * e)}" fill="#000" opacity="${n(0.05 + 0.05 * Math.abs(Math.sin(i / 5)))}"/>`
  ).join('');
  return `<defs>
    <linearGradient id="cyl-${uid}" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.16"/><stop offset="0.12" stop-color="#000" stop-opacity="0.05"/>
      <stop offset="0.36" stop-color="#fff" stop-opacity="0.10"/><stop offset="0.58" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.86" stop-color="#000" stop-opacity="0.05"/><stop offset="1" stop-color="#000" stop-opacity="0.18"/>
    </linearGradient>
    <linearGradient id="sh-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.5"/><stop offset="1" stop-color="#000" stop-opacity="0.04"/></linearGradient>
    <linearGradient id="cap-${uid}" x1="0" x2="1"><stop offset="0" stop-color="#c8ced5"/><stop offset="0.25" stop-color="#fff"/><stop offset="0.55" stop-color="#f2f4f6"/><stop offset="1" stop-color="#b9c0c8"/></linearGradient>
    <radialGradient id="ct-${uid}" cx="0.4" cy="0.4" r="0.7"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#e3e7eb"/></radialGradient>
    <filter id="soft-${uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
    <filter id="hl-${uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
    <clipPath id="body-${uid}"><path d="${body}"/></clipPath>
    <clipPath id="label-${uid}"><path d="${band}"/></clipPath>
  </defs>
  <ellipse cx="${cx}" cy="${base + 10}" rx="${R + 14}" ry="16" fill="#000" opacity="0.18" filter="url(#soft-${uid})"/>
  <ellipse cx="${cx}" cy="${base + 3}" rx="${R - 6}" ry="7" fill="#000" opacity="0.18" filter="url(#hl-${uid})"/>
  <g clip-path="url(#body-${uid})">
    <rect x="${X0 - 10}" y="${shoulder - 20}" width="${R * 2 + 20}" height="${base - shoulder + 40}" fill="#fafafa"/>
    <rect x="${X0 - 10}" y="${shoulder - 20}" width="${R * 2 + 20}" height="${bodyTop - shoulder + 30}" fill="url(#sh-${uid})"/>
    <g clip-path="url(#label-${uid})"><g transform="translate(${n(cx - lw / 2)} ${n(LT)}) scale(${n(scale)})">${frontPanel(p, mode, 30, pattern)}</g></g>
    <path d="M${X0} ${n(LT)} ${arcL(n(LT), R)}" fill="none" stroke="#000" stroke-opacity="0.07"/>
    <path d="M${X0} ${n(LB)} ${arcL(n(LB), R)}" fill="none" stroke="#000" stroke-opacity="0.07"/>
    <rect x="${X0 - 10}" y="${shoulder - 20}" width="${R * 2 + 20}" height="${base - shoulder + 40}" fill="url(#cyl-${uid})"/>
  </g>
  <path d="M${cx - neck - 2} ${capBot + 4} ${arc(capBot + 4, neck + 2)} V${capBot + 14} ${arc(capBot + 14, neck + 2, 1)} Z" fill="#e9ecef"/>
  <path d="M${cx - capR} ${capTop} V${capBot} ${arc(capBot, capR)} V${capTop} Z" fill="url(#cap-${uid})"/>
  ${ribs}
  <ellipse cx="${cx}" cy="${capTop}" rx="${capR}" ry="${n(capR * e)}" fill="url(#ct-${uid})" stroke="#d5dade" stroke-width="0.8"/>`;
}

// Cream scene with a soft floor line.
function scene(uid: string) {
  return `<defs><linearGradient id="bg-${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf7f2"/><stop offset="0.8" stop-color="#f3ece3"/><stop offset="0.8" stop-color="#ebe2d6"/><stop offset="1" stop-color="#f2ebe2"/></linearGradient></defs><rect width="400" height="400" fill="url(#bg-${uid})"/>`;
}

// Square 400×400 image. `uid` keeps gradient/clip ids unique when several images share a page.
export function bottleSvg(p: Product, variant: BottleVariant = 'front', opts: { mode?: FontMode; uid?: string; size?: number; pattern?: LabelPattern } = {}) {
  const mode = opts.mode ?? 'web';
  const uid = (opts.uid ?? `${p.slug}-${variant}`).replace(/[^a-z0-9-]/gi, '');
  const place = (x: number, y: number, s: number, id: string) => `<g transform="translate(${x} ${y}) scale(${s})">${bottle(p, mode, id, opts.pattern)}</g>`;
  let body = '';
  if (variant === 'front') body = place(26, -6, 0.87, uid);
  if (variant === 'duo') body = place(-34, 20, 0.74, `${uid}a`) + place(104, 6, 0.8, `${uid}b`);
  if (variant === 'facts') {
    const facts = factsPanel(p, mode, 260);
    const s = Math.min(1.2, 330 / facts.height);
    body = `<rect x="50" y="${n(200 - (facts.height * s) / 2 - 18)}" width="300" height="${n(facts.height * s + 36)}" rx="14" fill="#fff" stroke="#e5e7eb"/>
      <g transform="translate(${n(200 - 130 * s)} ${n(200 - (facts.height * s) / 2)}) scale(${n(s)})">${facts.svg}</g>`;
  }
  const size = opts.size ? `width="${opts.size}" height="${opts.size}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" ${size}>${scene(uid)}${body}</svg>`;
}
