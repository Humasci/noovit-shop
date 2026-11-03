// Social post templates in the science palette (3 Nov). Writes PNGs to design/social/:
//   evidence-<slug>.png  1080×1080  "Evidence check": ingredient, one structure/function finding, honest grade
//   dose-<slug>.png      1080×1080  "The dose": what studies used, on the light cell field
//   molecule-<slug>.png  1080×1080  "Meet the molecule": the key compound as a protein-style render
//   story-ask-ai.png     1080×1920  Story: Ask Noovit AI
//   story-evidence.png   1080×1920  Story: evidence-graded guides (DNA helix band)
// Copy is hand-written to stay within structure/function language (no disease names), matching the guides' grades.
// Usage: npm run social   (edit POSTS below to add more)
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import { Resvg } from '@resvg/resvg-js';
import { cellsSvg, helixSvg, proteinSvg, SCIENCE as S } from '@/lib/labels/web-art';
import { SEED_PRODUCTS } from '@/data/products';
import { wordmark, wrap } from '@/lib/labels/svg';

type Grade = 'Moderate' | 'Limited' | 'Early' | 'Insufficient';
const POSTS: { slug: string; name: string; finding: string; grade: Grade; dose: string; doseLine: string }[] = [
  { slug: 'creatine', name: 'Creatine', finding: 'Strength and lean mass, alongside resistance training', grade: 'Moderate', dose: '3–5 g', doseLine: 'a day: the amount most studies used' },
  { slug: 'ashwagandha', name: 'Ashwagandha', finding: 'Lower perceived stress and cortisol in stressed adults', grade: 'Moderate', dose: '240–600 mg', doseLine: 'of extract a day, for 8–12 weeks, in studies' },
  { slug: 'magnesium', name: 'Magnesium', finding: 'Sleep quality: a few small trials, mixed results', grade: 'Limited', dose: '310–420 mg', doseLine: 'a day: what adults need, from food and supplements' },
  { slug: 'lions-mane', name: "Lion's mane", finding: 'Memory and thinking in healthy middle-aged and older adults', grade: 'Limited', dose: '1–3 g', doseLine: 'of dried mushroom a day, for 4–16 weeks, in studies' },
  { slug: 'coq10', name: 'CoQ10', finding: 'Energy and exercise tolerance: small, mixed studies', grade: 'Limited', dose: '100–300 mg', doseLine: 'a day with a meal that contains fat, in studies' },
  { slug: 'turmeric', name: 'Turmeric', finding: 'Muscle soreness after exercise: early, small trials', grade: 'Limited', dose: '~1,000 mg', doseLine: 'of curcuminoids a day, for 4–12 weeks, in studies' },
];
const GRADES: Grade[] = ['Insufficient', 'Early', 'Limited', 'Moderate'];

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const nest = (svg: string, w: number, h: number, x = 0, y = 0) => {
  const end = svg.indexOf('>');
  const open = svg.slice(0, end).replace(/\s(width|height|x|y)="[^"]*"/g, '');
  return `${open} x="${x}" y="${y}" width="${w}" height="${h}"${svg.slice(end)}`;
};
const text = (x: number, y: number, t: string, size: number, fill: string, opts = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-family="Inter" ${opts}>${esc(t)}</text>`;
const head = (x: number, y: number, lines: string[], size: number, fill: string) =>
  lines.map((l, i) => `<text x="${x}" y="${y + i * size * 1.08}" font-size="${size}" font-weight="600" letter-spacing="${-size * 0.025}" fill="${fill}" font-family="Manrope">${esc(l)}</text>`).join('');

function meter(x: number, y: number, grade: Grade) {
  const k = GRADES.indexOf(grade);
  return GRADES.map((g, i) => `<rect x="${x + i * 62}" y="${y}" width="54" height="10" rx="5" fill="${i <= k ? S.teal : '#ffffff'}" opacity="${i <= k ? 1 : 0.18}"/>`).join('') +
    text(x + 4 * 62 + 14, y + 10, `${grade} evidence`, 26, '#fff', 'font-weight="600"');
}

function evidencePost(p: (typeof POSTS)[number]) {
  const W = 1080, H = 1080;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  ${nest(cellsSvg(`social-${p.slug}`, true, W, H), W, H)}
  <rect width="${W}" height="${H}" fill="${S.night}" opacity="0.25"/>
  ${text(80, 130, 'EVIDENCE CHECK', 24, '#fff', 'font-weight="600" letter-spacing="5" opacity="0.7"')}
  ${head(76, 250, [p.name], 108, '#fff')}
  ${head(80, 400, wrap(p.finding, 760, 50, 0.52).slice(0, 3), 50, '#fff')}
  ${meter(80, 700, p.grade)}
  ${text(80, 760, 'Graded from published human studies, including the ones that found nothing.', 24, '#fff', 'opacity="0.7"')}
  ${text(80, 980, `Full guide · noovit.com/guides/${p.slug}`, 26, '#fff', 'font-weight="500" opacity="0.85"')}
  ${wordmark(1000 - (3.46 * 38) / 2, 990, 38, 'print', '#ffffff')}
</svg>`;
}

function dosePost(p: (typeof POSTS)[number]) {
  const W = 1080, H = 1080;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  ${nest(cellsSvg(`dose-${p.slug}`, false, W, H), W, H)}
  ${text(80, 130, `THE DOSE · ${p.name.toUpperCase()}`, 24, S.indigo, 'font-weight="600" letter-spacing="5"')}
  ${head(72, 420, [p.dose], 170, S.night)}
  ${head(80, 520, wrap(p.doseLine, 700, 44, 0.52).slice(0, 3), 44, S.indigo)}
  ${text(80, 900, 'Doses, side effects and who should avoid it:', 26, S.indigo)}
  ${text(80, 942, `noovit.com/guides/${p.slug}`, 28, S.night, 'font-weight="600"')}
  ${wordmark(1000 - (3.46 * 38) / 2, 990, 38, 'print')}
</svg>`;
}

const MOLECULES: { slug: string; product: string; name: string; line: string; note?: string }[] = [
  { slug: 'ashwagandha', product: 'ashwagandha', name: 'Withaferin A', line: 'One of the withanolides, the compounds ashwagandha extracts like KSM-66 are standardized for.' },
  { slug: 'turmeric', product: 'turmeric-complex', name: 'Curcumin', line: "Turmeric's main active compound, and the reason a 95% curcuminoid extract is on the label.", note: 'Drawn from its structure in PubChem (ball-and-stick).' },
  { slug: 'coq10', product: 'coq10', name: 'Coenzyme Q10', line: 'A compound your body makes and uses to produce energy in cells. Levels fall with age.' },
];
function moleculePost(m: (typeof MOLECULES)[number]) {
  const W = 1080, H = 1080;
  const p = SEED_PRODUCTS.find((x) => x.slug === m.product)!;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${S.night}"/>
  ${nest(proteinSvg(p as never, 640, 640), 640, 640, 460, 170)}
  ${text(80, 130, 'MEET THE MOLECULE', 24, '#fff', 'font-weight="600" letter-spacing="5" opacity="0.7"')}
  ${head(76, 240, wrap(m.name, 640, 84, 0.55).slice(0, 2), 84, '#fff')}
  ${head(80, 820, wrap(m.line, 900, 34, 0.5).slice(0, 3), 34, '#fff')}
  ${text(80, 980, m.note ?? 'Built from its real 3D structure (PubChem).', 24, '#fff', 'opacity="0.6"')}
  ${wordmark(1000 - (3.46 * 38) / 2, 990, 38, 'print', '#ffffff')}
</svg>`;
}

function storyAskAi() {
  const W = 1080, H = 1920;
  const bubble = (y: number, t: string, right: boolean) => {
    const lines = wrap(t, 700, 36, 0.5);
    const h = lines.length * 48 + 52, x = right ? W - 80 - 780 : 80;
    return `<rect x="${x}" y="${y}" width="780" height="${h}" rx="36" fill="${right ? '#ffffff' : '#ffffff'}" opacity="${right ? 0.14 : 1}"/>` +
      lines.map((l, i) => text(x + 40, y + 62 + i * 48, l, 36, right ? '#fff' : S.night)).join('');
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  ${nest(cellsSvg('story-ask', true, W, H), W, H)}
  ${text(80, 260, 'NEW · NOOVIT AI', 28, '#fff', 'font-weight="600" letter-spacing="6" opacity="0.7"')}
  ${head(76, 400, ['Questions?', 'Ask Noovit AI.'], 112, '#fff')}
  ${bubble(760, 'Can I take magnesium and ashwagandha together?', true)}
  ${bubble(960, "Many people do. If you take thyroid or sleep medicine, check with your doctor first. Here's our guide…", false)}
  <rect x="80" y="1560" width="560" height="110" rx="55" fill="#fff"/>
  ${text(130, 1630, 'Ask at noovit.com', 40, S.night, 'font-weight="600"')}
  ${text(80, 1740, "AI answers can be wrong and aren't medical advice.", 26, '#fff', 'opacity="0.6"')}
  ${wordmark(W / 2, 1840, 48, 'print', '#ffffff')}
</svg>`;
}

function storyEvidence() {
  const W = 1080, H = 1920;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${S.night}"/>
  ${nest(helixSvg('story-evidence', 1600, 700, true, false), 1600 * 0.9, 700 * 0.9, -280, 1080)}
  ${text(80, 260, 'EVIDENCE-GRADED GUIDES', 28, '#fff', 'font-weight="600" letter-spacing="6" opacity="0.7"')}
  ${head(76, 400, ['What the', 'research', 'actually shows.'], 112, '#fff')}
  ${head(80, 820, wrap('Every ingredient, graded from published human studies. Including the ones that found nothing.', 880, 42, 0.5).slice(0, 3), 42, '#fff')}
  <rect x="80" y="1700" width="560" height="110" rx="55" fill="#fff"/>
  ${text(130, 1770, 'noovit.com/guides', 40, S.night, 'font-weight="600"')}
  ${wordmark(W - 200, 1775, 44, 'print', '#ffffff')}
</svg>`;
}

const fontFiles = readdirSync('assets/fonts').filter((f) => f.endsWith('.ttf')).map((f) => `assets/fonts/${f}`);
const render = (svg: string, w: number, file: string) => {
  writeFileSync(file, new Resvg(svg, { fitTo: { mode: 'width', value: w }, font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' } }).render().asPng());
  console.log(file);
};
mkdirSync('design/social', { recursive: true });
for (const p of POSTS) {
  render(evidencePost(p), 1080, `design/social/evidence-${p.slug}.png`);
  render(dosePost(p), 1080, `design/social/dose-${p.slug}.png`);
}
for (const m of MOLECULES) render(moleculePost(m), 1080, `design/social/molecule-${m.slug}.png`);
render(storyAskAi(), 1080, 'design/social/story-ask-ai.png');
render(storyEvidence(), 1080, 'design/social/story-evidence.png');
