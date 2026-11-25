// Builds docs/vapi/noovit-knowledge.md: the knowledge file for the Vapi phone agent (setup: docs/vapi/AGENT.md).
// Run: npm run vapi:knowledge (reads the live catalog when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set, else the
// seed in data/products.ts). Re-run and re-upload the file in Vapi after any catalog, price or policy change.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { Product } from '@/types';
import { readCatalog } from './catalog-source';
import { asLowAs, packOptions, PUBLIC_DIETARY_TAGS } from '@/data/products';
import { GENERAL_FAQS, SUBSCRIPTION_PERKS } from '@/data/content';
import { TEST_KITS } from '@/lib/tests';
import { PROGRAM, WEEKS, FAQS as PROGRAM_FAQS } from '@/lib/programs/perimenopause';
import { GUIDES } from '@/lib/guides';
import { productPath, testPath, HUB_URL } from '@/lib/urls';
import { LEGAL_NAME } from '@/lib/site';

const ROOT = process.cwd();
const OUT = join(ROOT, 'docs/vapi/noovit-knowledge.md');
const EMAIL = 'hello@noovit.com';
const CORE_ORDER = ['lions-mane', 'magnesium-complex', 'ashwagandha', 'creatine', 'creatine-for-women', 'coq10', 'turmeric-complex'];

// Voice-friendly amounts: "1500mg" → "1,500 mg".
const amount = (s: string) =>
  s.replace(/(\d[\d,.]*)\s*(mg|mcg|g|IU)\b/gi, (_, n: string, u: string) => {
    const num = Number(n.replace(/,/g, ''));
    return `${Number.isFinite(num) && !n.includes('.') ? num.toLocaleString('en-US') : n} ${u}`;
  });
const money = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
// Plain sentence for voice: no claim asterisks (the disclaimer is stated once below), always a final period.
const sentence = (s: string) => s.replace(/\*/g, '').trim().replace(/\s+/g, ' ').replace(/([^.!?])$/, '$1.');

// Policy text lives in the policy page (a Next.js page can't export it), so read the sections from its source.
function policySections(block: string, wanted?: string[]) {
  const src = readFileSync(join(ROOT, 'app/(store)/policies/[slug]/page.tsx'), 'utf8');
  const start = src.indexOf(`${block}: {`);
  if (start < 0) throw new Error(`Policy block ${block} not found in app/(store)/policies/[slug]/page.tsx`);
  const next = src.indexOf('\n  },\n', start);
  const body = src.slice(start, next < 0 ? undefined : next);
  const re = /\{ (?:id: '[^']*', )?h: '((?:[^'\\]|\\.)*)', p: '((?:[^'\\]|\\.)*)' \}/g;
  const out: { h: string; p: string }[] = [];
  for (const m of body.matchAll(re)) out.push({ h: m[1].replace(/\\'/g, "'"), p: m[2].replace(/\\'/g, "'") });
  const picked = wanted ? out.filter((s) => wanted.includes(s.h)) : out;
  if (!picked.length || (wanted && picked.length !== wanted.length)) throw new Error(`Policy sections missing in ${block}`);
  return picked;
}

function allergens(p: Product) {
  const notes: string[] = [];
  const contains = p.otherIngredients.match(/Contains:\s*([^.]*(?:\([^)]*\))?[^.]*)\./i);
  if (contains) notes.push(`Contains ${contains[1].trim()}.`);
  else if (/shellfish/i.test(`${p.otherIngredients} ${p.whoFor}`)) notes.push('Contains shellfish.');
  if (/milk/i.test(p.otherIngredients) && !/milk/i.test(notes.join(' '))) notes.push('Contains milk.');
  if (/shellfish/i.test(`${p.otherIngredients} ${p.whoFor}`)) notes.push('Not for anyone with a shellfish allergy.');
  return notes;
}

function productBlock(p: Product, bySlug: Map<string, Product>) {
  const lines: string[] = [`### ${p.name}`];
  const bundle = !!p.bundleItems?.length;
  if (bundle) lines.push('- Type: bundle (a stack of separate products sold together at one price).');
  lines.push(`- What it is for: ${sentence(p.shortBenefit)}`);
  if (p.tagline) lines.push(`- Headline: ${p.tagline}`);
  lines.push(`- Web page: noovit dot com${productPath(p.slug)}`);
  if (bundle) {
    const parts = p.bundleItems!.map((b) => ({ item: b, prod: bySlug.get(b.slug) }));
    const names = parts.map(({ item, prod }) => `${item.quantity > 1 ? `${item.quantity} × ` : ''}${prod?.name ?? item.slug}${prod?.form === 'powder' ? ' (1 tub)' : ' (1 bottle)'}`);
    lines.push(`- What's inside: ${names.join(', ')}. Each product's own entry in this file has its ingredients and doses.`);
    const separate = parts.reduce((sum, { item, prod }) => sum + (prod ? prod.basePrice * item.quantity : 0), 0);
    const sub = packOptions(p, 'subscribe')[0].pricePerBottle;
    lines.push(`- Price: ${money(p.basePrice)} one-time, or ${money(sub)} per delivery with Subscribe & Save.${separate > p.basePrice ? ` Buying the same products separately at full price costs ${money(separate)}.` : ''}`);
  } else {
    lines.push(`- Description: ${sentence(p.description)}`);
    lines.push(`- Key ingredients per serving: ${p.ingredients.map((i) => `${i.name}, ${amount(i.amount)}${i.description ? ` (${amount(i.description)})` : ''}`).join('; ')}.`);
    lines.push(`- Other ingredients: ${sentence(p.otherIngredients)}`);
    lines.push(`- Size: ${p.servings} servings${p.netWeight ? `, net weight ${p.netWeight}` : ''}, ${p.form}.`);
    const one = packOptions(p, 'one-time');
    const sub = packOptions(p, 'subscribe');
    lines.push(`- Price: ${money(p.basePrice)} for one ${p.form === 'powder' ? 'tub' : 'bottle'}, one-time.`);
    lines.push(`- Multi-packs, one-time: ${one.filter((o) => o.bottles > 1).map((o) => `${o.bottles} for ${money(o.pricePerBottle)} each`).join('; ')}.`);
    lines.push(`- Subscribe & Save, per delivery: ${sub.map((o) => `${o.bottles} for ${money(o.pricePerBottle)} each`).join('; ')}. Lowest price per unit: ${money(asLowAs(p))}.`);
  }
  lines.push(`- How to take it: ${sentence(p.dosage)}`);
  lines.push(`- Who it's for: ${sentence(p.whoFor)}`);
  const tags = PUBLIC_DIETARY_TAGS.filter((t) => p.dietaryTags.includes(t.value)).map((t) => t.label);
  if (tags.length) lines.push(`- Dietary: ${tags.join(', ')}.`);
  const warn = [...allergens(p)];
  if (p.ageRestricted) warn.push('Adults 18 and over only.');
  if (warn.length) lines.push(`- Important: ${warn.join(' ')}`);
  for (const f of p.extraFaqs ?? []) lines.push(`- Q: ${f.q} A: ${sentence(f.a)}`);
  return lines.join('\n');
}

async function main() {
  const { products, source } = await readCatalog();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const rank = (p: Product) => { const i = CORE_ORDER.indexOf(p.slug); return i < 0 ? CORE_ORDER.length : i; };
  const visible = products
    .filter((p) => p.status !== 'hidden' && p.productType !== 'pets')
    .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
  const singles = visible.filter((p) => !p.bundleItems?.length);
  const bundles = visible.filter((p) => p.bundleItems?.length);
  const humanKits = TEST_KITS.filter((k) => !k.pets);
  const petKits = TEST_KITS.filter((k) => k.pets);
  const petsOnSale = products.some((p) => p.status !== 'hidden' && p.productType === 'pets');

  const shipping = policySections("'delivery-returns'");
  const terms = policySections('terms', ['Use of this site', 'Eligibility', 'Orders and pricing', 'Subscriptions']);

  const md = `# Noovit knowledge file (for the phone assistant)

Generated by \`scripts/vapi-knowledge.ts\` from the store's data (${source}), ${new Date().toISOString().slice(0, 10)}. Do not edit by hand: re-run \`npm run vapi:knowledge\` and upload the new file in Vapi.

These are the only facts the assistant may use. If something is not here, the assistant says it does not have that information and offers ${EMAIL}.

## About Noovit
- Noovit is a US online store for dietary supplements, at noovit dot com. The company is ${LEGAL_NAME}, a Wyoming limited liability company.
- What makes Noovit different: every ingredient and amount is printed on the label, with no proprietary blends. The free guides grade the research honestly, including studies that found no effect.
- Contact: email ${EMAIL} (say "hello at noovit dot com"), or the contact form at noovit dot com/contact. The team replies within one business day.
- Prices are in US dollars and are launch prices. Noovit ships to US addresses only.
- Payment is by card, Apple Pay or Google Pay on a secure checkout page on the website. Noovit never takes card details by phone.
- These statements have not been evaluated by the Food and Drug Administration. Noovit products are not intended to diagnose, treat, cure, or prevent any disease.

## Shipping, returns and guarantee
${shipping.map((s) => `- ${s.h}: ${s.p}`).join('\n')}

## Orders, eligibility and subscriptions
${terms.map((s) => `- ${s.h}: ${s.p}`).join('\n')}
${SUBSCRIPTION_PERKS.map((s) => `- ${s.title}: ${s.text}`).join('\n')}
- Subscribe & Save takes $5 off each bottle or tub. Two units per delivery take $7.50 off each, three take $10 off each.
- Buying once without subscribing: 3 bottles take $5 off each, 6 bottles take $10 off each.
- Bundles (stacks) are already discounted. Subscribing takes a further $5 off a bundle.
- Shipping is free on every order, with or without a subscription.
- To manage a subscription: go to noovit dot com/account ("My Account"), enter the email used to order, and a secure sign-in link arrives by email. In the account you can see orders and tracking, skip the next order, pause, resume or cancel a subscription, change the shipping address, update the card and see invoices. No password needed. To change how often it arrives or swap a product, email ${EMAIL}.

## General questions
${GENERAL_FAQS.map((f) => `- Q: ${f.q} A: ${sentence(f.a)}`).join('\n')}
- Q: Is it dairy and lactose free? A: Yes, unless the label states otherwise.

## Products (${singles.length})
Core range first. All doses are per serving.

${singles.map((p) => productBlock(p, bySlug)).join('\n\n')}

## Bundles (${bundles.length})
A bundle is a set of separate products sold together at a lower price.

${bundles.map((p) => productBlock(p, bySlug)).join('\n\n')}

## Product quiz and guides
- The quiz at noovit dot com/quiz takes about two minutes. It asks about goals (such as sleep and stress, energy, focus, joints, muscle), age range, diet, activity, pregnancy or breastfeeding, and medication, then suggests products. It is general information, not medical advice.
- Free evidence guides at noovit dot com/guides explain what the research says about an ingredient, how strong the evidence is, typical doses, side effects and who should avoid it. Topics: ${GUIDES.map((g) => g.ingredient).join(', ')}.
- Shop by audience: Women's Health at noovit dot com${HUB_URL.women}, Men's Health at noovit dot com${HUB_URL.men}.

## At-home tests (all coming soon)
- None of the at-home tests are available yet. There is no price yet. Each test page has a waitlist: tap Notify me to hear when it launches. All tests are listed at noovit dot com${HUB_URL.tests}.
- The tests are for wellness screening, not diagnosis. Results should be discussed with a doctor.
- When summarizing a call or taking a message, do not name the test the caller asked about.
${humanKits.map((k) => (k.sensitive ? `- ${k.name}: coming soon.` : `- ${k.name}: ${sentence(k.short)}${/finger-prick/i.test(k.short) ? '' : ` ${sentence(k.collection)}`} Coming soon. Page: noovit dot com${testPath(k.slug)}`)).join('\n')}
${petKits.length ? `\nPet tests (coming soon, for dogs and cats${petsOnSale ? '' : '; Noovit has no pet supplements for sale yet'}):\n${petKits.map((k) => `- ${k.name}: ${sentence(k.short)} Coming soon.`).join('\n')}` : ''}

## Free program: ${PROGRAM.name}
- ${PROGRAM.tagline} Free sign-up with an email address at noovit dot com${PROGRAM.path}. You get a printable starter kit and one short email a week for six weeks.
- Weeks: ${WEEKS.map((w) => `${w.n}. ${w.title}`).join('; ')}.
${PROGRAM_FAQS.map((f) => `- Q: ${f.q} A: ${sentence(f.a)}`).join('\n')}
`;

  mkdirSync(join(ROOT, 'docs/vapi'), { recursive: true });
  writeFileSync(OUT, md);
  console.log(`Wrote ${OUT}: ${singles.length} products, ${bundles.length} bundles, ${humanKits.length + petKits.length} tests (source: ${source}).`);
}

main().catch((e) => { console.error(e); process.exit(1); });
