import { Product } from '@/types';

// Noovit label system, drawn as SVG strings so one design feeds three places:
//  - the print draft of the full wrap-around label (fullLabelSvg, real units: 1 = 0.01 inch),
//  - the bottle images on the website (bottleSvg in 'web' mode, fonts from next/font CSS variables),
//  - the PNG images for feeds and social previews (bottleSvg in 'print' mode, rendered with the TTFs in assets/fonts).
// All copy comes from the product record, so every product's label stays consistent with its page.

export type FontMode = 'web' | 'print';

const NAVY = '#14213d';
const INK = '#374151';
const OPAL = '#5fa68d';
const OPAL_DARK = '#3a8069';

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

const TAG_LABELS: Record<string, string> = { vegan: 'Vegan', 'gluten-free': 'Gluten-free', 'sugar-free': 'Sugar-free' };
const tagLine = (p: Product) => p.dietaryTags.filter((t) => t in TAG_LABELS).map((t) => TAG_LABELS[t]).join('  ·  ');

// ---------- Wordmark ----------

// "noovit" + raised plus, centred on cx with the baseline at y. Width of "noovit" in Funnel Display 500 = 2.977em.
export function wordmark(cx: number, y: number, size: number, mode: FontMode, color = NAVY, plus = OPAL) {
  const w = 2.977 * size;
  const p = 0.4 * size; // plus box
  const gap = 0.04 * size;
  const left = cx - (w + gap + p) / 2;
  const px = left + w + gap;
  const top = y - 0.71 * size;
  const bar = p * 0.215;
  return `<g aria-label="noovit">
    <text x="${n(left)}" y="${n(y)}" font-size="${size}" font-weight="500" letter-spacing="${n(-0.01 * size)}" fill="${color}" ${font('logo', mode)}>noovit</text>
    <rect x="${n(px + (p - bar) / 2)}" y="${n(top)}" width="${n(bar)}" height="${n(p)}" rx="${n(bar * 0.2)}" fill="${plus}"/>
    <rect x="${n(px)}" y="${n(top + (p - bar) / 2)}" width="${n(p)}" height="${n(bar)}" rx="${n(bar * 0.2)}" fill="${plus}"/>
  </g>`;
}

// ---------- Front panel (220 × 225 units = 2.2" × 2.25") ----------

export const FRONT = { w: 220, h: 225 };

function nameLines(name: string) {
  for (const size of [27, 25, 23, 21]) {
    const lines = wrap(name, 190, size, 0.6);
    if (lines.length <= 2) return { lines, size };
  }
  return { lines: wrap(name, 190, 20, 0.6), size: 20 };
}

const BAND = 162; // top of the colour band; statement of identity and net quantity sit in the bottom 30%

// Drawn at (0,0); callers translate/scale it. `bleed` extends the colour band past the bottom edge.
// Hierarchy: wordmark → eyebrow (proof point) → product name → benefit → colour band with identity + quantity.
export function frontPanel(p: Product, mode: FontMode, bleed = 0) {
  const cx = FRONT.w / 2;
  const { lines, size } = nameLines(p.name);
  const nameY = 62 + size;
  const benefitY = nameY + (lines.length - 1) * size * 1.04 + 17;
  const benefit = wrap(p.shortBenefit.replace(/\.$/, '') + '*', 172, 9, 0.56).slice(0, 2);
  const tags = tagLine(p);
  return `<g>
    <rect x="0" y="0" width="${FRONT.w}" height="${FRONT.h + bleed}" fill="#fff"/>
    ${wordmark(cx, 34, 22, mode)}
    <text x="${cx}" y="58" text-anchor="middle" font-size="6.8" font-weight="600" letter-spacing="1.3" fill="${OPAL_DARK}" ${font('body', mode)}>${esc((p.benefits.at(-1) ?? '').toUpperCase())}</text>
    ${textBlock(lines, cx, nameY, size, size * 1.04, `text-anchor="middle" font-weight="600" letter-spacing="${n(-0.02 * size)}" fill="${NAVY}" ${font('head', mode)}`)}
    ${textBlock(benefit, cx, benefitY, 9, 11.5, `text-anchor="middle" fill="${INK}" ${font('body', mode)}`)}
    <rect x="0" y="${BAND}" width="${FRONT.w}" height="${FRONT.h - BAND + bleed}" fill="${p.color}"/>
    ${tags ? `<text x="${cx}" y="${BAND + 14}" text-anchor="middle" font-size="6.3" font-weight="500" letter-spacing="0.6" fill="#fff" opacity="0.92" ${font('body', mode)}>${esc(tags)}</text>` : ''}
    <text x="${cx}" y="${BAND + 30}" text-anchor="middle" font-size="7.2" font-weight="600" letter-spacing="1.6" fill="#fff" ${font('body', mode)}>DIETARY SUPPLEMENT</text>
    <text x="${cx}" y="${BAND + 46}" text-anchor="middle" font-size="13" font-weight="700" letter-spacing="0.8" fill="#fff" ${font('body', mode)}>${esc(netQuantity(p).toUpperCase())}</text>
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

export type BottleVariant = 'front' | 'duo' | 'capsules' | 'facts';

function bottle(p: Product, x: number, y: number, scale: number, mode: FontMode, uid: string) {
  const jar = p.form === 'powder' || p.form === 'chews';
  const w = jar ? 190 : 156;
  const h = jar ? 205 : 236;
  const capW = jar ? w - 16 : w * 0.62;
  const capH = jar ? 34 : 40;
  const labelScale = (w - 2) / FRONT.w;
  const labelH = FRONT.h * labelScale;
  const labelY = (h - labelH) / 2 + (jar ? 6 : 10);
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${scale})">
    <ellipse cx="${w / 2}" cy="${h + 8}" rx="${w / 2 + 8}" ry="11" fill="#000" opacity="0.07"/>
    <rect x="${n((w - capW) / 2)}" y="${-capH + 4}" width="${n(capW)}" height="${capH}" rx="7" fill="#1b2232"/>
    <rect x="${n((w - capW) / 2)}" y="${-capH + 4}" width="${n(capW)}" height="${capH}" rx="7" fill="url(#cap-${uid})"/>
    <rect x="0" y="0" width="${w}" height="${h}" rx="${jar ? 20 : 26}" fill="#fdfdfd"/>
    <clipPath id="clip-${uid}"><rect x="0" y="0" width="${FRONT.w}" height="${FRONT.h}"/></clipPath>
    <g clip-path="url(#clip-${uid})" transform="translate(1 ${n(labelY)}) scale(${n(labelScale)})">${frontPanel(p, mode)}</g>
    <rect x="0" y="0" width="${w}" height="${h}" rx="${jar ? 20 : 26}" fill="url(#shade-${uid})"/>
    <line x1="1" x2="${w - 1}" y1="${n(labelY)}" y2="${n(labelY)}" stroke="#000" stroke-opacity="0.06"/>
  </g>`;
}

function defs(uid: string, color: string) {
  return `<defs>
    <radialGradient id="bg-${uid}" cx="50%" cy="38%" r="75%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="${color}" stop-opacity="0.2"/></radialGradient>
    <linearGradient id="shade-${uid}" x1="0" x2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0.10"/><stop offset="18%" stop-color="#000" stop-opacity="0.02"/>
      <stop offset="40%" stop-color="#fff" stop-opacity="0.18"/><stop offset="62%" stop-color="#fff" stop-opacity="0"/>
      <stop offset="88%" stop-color="#000" stop-opacity="0.05"/><stop offset="100%" stop-color="#000" stop-opacity="0.14"/>
    </linearGradient>
    <linearGradient id="cap-${uid}" x1="0" x2="1"><stop offset="0%" stop-color="#fff" stop-opacity="0"/><stop offset="35%" stop-color="#fff" stop-opacity="0.16"/><stop offset="100%" stop-color="#000" stop-opacity="0.25"/></linearGradient>
  </defs>`;
}

// Square 400×400 scene. `uid` keeps gradient/clip ids unique when several images share a page.
export function bottleSvg(p: Product, variant: BottleVariant = 'front', opts: { mode?: FontMode; uid?: string; size?: number } = {}) {
  const mode = opts.mode ?? 'web';
  const uid = (opts.uid ?? `${p.slug}-${variant}`).replace(/[^a-z0-9-]/gi, '');
  const jar = p.form === 'powder' || p.form === 'chews';
  const bw = jar ? 190 : 156;
  let body = '';
  if (variant === 'front') body = bottle(p, (400 - bw) / 2, jar ? 128 : 104, 1, mode, uid);
  if (variant === 'duo') body = bottle(p, 48, 132, 0.84, mode, `${uid}a`) + bottle(p, 196, 112, 0.94, mode, `${uid}b`);
  if (variant === 'capsules') {
    body = bottle(p, 52, 112, 0.92, mode, uid);
    const pieces: [number, number, number][] = [[285, 270, 20], [325, 300, -30], [268, 322, 60], [335, 248, 80], [300, 340, -10]];
    body += pieces
      .map(([cx, cy, r], i) =>
        p.form === 'powder'
          ? `<circle cx="${cx}" cy="${cy}" r="${14 - i}" fill="${p.color}" opacity="0.5"/>`
          : `<g transform="rotate(${r} ${cx} ${cy})"><rect x="${cx - 22}" y="${cy - 9}" width="44" height="18" rx="9" fill="#fff" stroke="${p.color}" stroke-width="2"/><rect x="${cx}" y="${cy - 9}" width="22" height="18" rx="9" fill="${p.color}" opacity="0.7"/></g>`
      )
      .join('');
  }
  if (variant === 'facts') {
    const facts = factsPanel(p, mode, 260);
    const s = Math.min(1.2, 330 / facts.height);
    body = `<rect x="50" y="${n(200 - (facts.height * s) / 2 - 18)}" width="300" height="${n(facts.height * s + 36)}" rx="14" fill="#fff" stroke="#e5e7eb"/>
      <g transform="translate(${n(200 - 130 * s)} ${n(200 - (facts.height * s) / 2)}) scale(${n(s)})">${facts.svg}</g>`;
  }
  const size = opts.size ? `width="${opts.size}" height="${opts.size}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" ${size}>${defs(uid, p.color)}<rect width="400" height="400" fill="#fff"/><rect width="400" height="400" fill="url(#bg-${uid})"/>${body}</svg>`;
}
