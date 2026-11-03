import 'server-only';
import { Product } from '@/types';
import { GUIDES } from '@/lib/guides';
import { GENERAL_FAQS } from '@/data/content';
import type { Post } from '@/lib/blog';
import SNAPSHOTS from '@/data/advisor-snapshots.json';

// Retrieval for the AI advisor (RAG): before each answer we pick the most relevant passages from (1) our own site:
// evidence guides with their verified sources, product data, FAQs and published Journal posts, and (2) snapshots
// of outside pages the owner chose (data/advisor-sources.json → `npm run advisor:snapshot` → data/advisor-snapshots.json).
// BM25 keyword search in memory: no vector DB, no extra service.

interface Snapshot { url: string; title: string; publisher?: string; chunks: string[] }
const SNAPS = (SNAPSHOTS as unknown as { sources: Snapshot[] }).sources ?? [];

export interface Passage { id: string; title: string; url: string; text: string }

const STOP = new Set('a an and are as at be but by can do does for from has have how i if in into is it its me my of on or should so that the their them there these they this to was we what when which who why will with you your about any also just more most not than then too very would could take taking'.split(' '));
// Everyday words → the terms our content uses.
const SYNONYMS: Record<string, string[]> = {
  sleep: ['sleep', 'insomnia', 'magnesium', 'melatonin', 'night'], insomnia: ['sleep', 'insomnia'],
  stress: ['stress', 'cortisol', 'anxiety', 'ashwagandha', 'calm'], anxiety: ['stress', 'anxiety', 'calm'], calm: ['calm', 'stress', 'ashwagandha'],
  focus: ['focus', 'memory', 'cognitive', 'brain', 'lion', 'mane'], memory: ['memory', 'cognitive', 'brain'], brain: ['brain', 'cognitive', 'memory', 'lion'],
  energy: ['energy', 'fatigue', 'tiredness', 'coq10', 'ubiquinone'], tired: ['fatigue', 'tiredness', 'energy'],
  muscle: ['muscle', 'strength', 'creatine', 'performance'], gym: ['strength', 'muscle', 'creatine'], strength: ['strength', 'creatine', 'muscle'],
  joint: ['joint', 'joints', 'turmeric', 'curcumin', 'mobility'], joints: ['joint', 'turmeric', 'mobility'], knee: ['joint', 'turmeric'],
  heart: ['heart', 'cardiovascular', 'coq10'], pregnant: ['pregnancy', 'pregnant', 'breastfeeding'], pregnancy: ['pregnancy', 'pregnant'],
  statin: ['statin', 'statins', 'coq10'], thyroid: ['thyroid', 'ashwagandha'], blood: ['blood', 'thinner', 'warfarin'],
};
const stem = (w: string) => w.replace(/(ies)$/, 'y').replace(/(ing|ed|es|s)$/, '');
function tokens(text: string) {
  return text.toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/).filter((w) => w.length > 1 && !STOP.has(w)).map(stem);
}

function buildCorpus(products: Product[], posts: Post[]): Passage[] {
  const out: Passage[] = [];
  for (const g of GUIDES) {
    const url = `/guides/${g.slug}`;
    const t = `${g.ingredient} guide`;
    out.push({ id: `${g.slug}-summary`, title: t, url, text: `${g.summary} ${g.quickFacts.map((f) => `${f.label}: ${f.value}.`).join(' ')}` });
    if (g.whatItIs.length) out.push({ id: `${g.slug}-what`, title: `${t}: what it is`, url, text: g.whatItIs.join(' ') });
    for (const b of g.benefits) out.push({ id: `${g.slug}-b-${b.title}`, title: `${t}: ${b.title} (evidence: ${b.evidence})`, url, text: b.text });
    if (g.dosage.length) out.push({ id: `${g.slug}-dose`, title: `${t}: dosage`, url, text: g.dosage.join(' ') });
    const safety = [...g.sideEffects, ...g.interactions, ...g.avoidIf];
    if (safety.length) out.push({ id: `${g.slug}-safety`, title: `${t}: side effects, interactions, who should avoid it`, url, text: safety.join(' ') });
    for (const f of g.faqs) out.push({ id: `${g.slug}-faq-${f.q}`, title: `${t}: ${f.q}`, url, text: f.a });
  }
  for (const p of products) {
    if (p.status !== 'active' || p.productType === 'pets') continue;
    const url = `/products/${p.slug}`;
    out.push({
      id: `p-${p.slug}`, title: `${p.name} (product, $${p.basePrice})`, url,
      text: `${p.description} ${p.shortBenefit} Ingredients per serving: ${p.ingredients.map((i) => `${i.name} ${i.amount}`).join('; ')}. Directions: ${p.dosage} Other ingredients: ${p.otherIngredients}${p.ageRestricted ? ' Adults 18+ only.' : ''} ${(p.faqs ?? []).map((f) => `${f.q} ${f.a}`).join(' ')}`,
    });
  }
  for (const f of GENERAL_FAQS) out.push({ id: `faq-${f.q}`, title: `Noovit FAQ: ${f.q}`, url: '/faq', text: f.a });
  for (const post of posts) {
    const plain = post.body.replace(/<[^>]+>/g, ' ').replace(/[#*_>`]/g, ' ').replace(/\s+/g, ' ');
    for (let i = 0; i < plain.length; i += 1000) out.push({ id: `blog-${post.slug}-${i}`, title: `Journal: ${post.title}`, url: `/blog/${post.slug}`, text: (i ? '' : `${post.excerpt} `) + plain.slice(i, i + 1100) });
  }
  for (const snap of SNAPS)
    snap.chunks.forEach((c, i) => out.push({ id: `snap-${snap.url}-${i}`, title: `${snap.title}${snap.publisher ? ` (${snap.publisher})` : ''}`, url: snap.url, text: c }));
  return out;
}

// BM25 index, rebuilt when the catalog changes (keyed on the product slugs + prices).
let cache: { key: string; docs: Passage[]; tf: Map<string, number>[]; df: Map<string, number>; len: number[]; avg: number } | null = null;
function index(products: Product[], posts: Post[]) {
  const key = products.map((p) => `${p.slug}:${p.status}:${p.basePrice}`).join('|') + posts.map((p) => p.updatedAt).join('|');
  if (cache?.key === key) return cache;
  const docs = buildCorpus(products, posts);
  const df = new Map<string, number>();
  const tf = docs.map((d) => {
    const m = new Map<string, number>();
    for (const w of tokens(`${d.title} ${d.title} ${d.text}`)) m.set(w, (m.get(w) ?? 0) + 1);
    for (const w of m.keys()) df.set(w, (df.get(w) ?? 0) + 1);
    return m;
  });
  const len = tf.map((m) => [...m.values()].reduce((a, b) => a + b, 0));
  cache = { key, docs, tf, df, len, avg: len.reduce((a, b) => a + b, 0) / (len.length || 1) };
  return cache;
}

export function retrieve(products: Product[], posts: Post[], query: string, k = 6): Passage[] {
  const ix = index(products, posts);
  const q = new Set<string>();
  for (const w of tokens(query)) { q.add(w); for (const s of SYNONYMS[w] ?? []) q.add(stem(s)); }
  const N = ix.docs.length, k1 = 1.4, b = 0.75;
  const scored = ix.docs.map((d, i) => {
    let s = 0;
    for (const w of q) {
      const f = ix.tf[i].get(w);
      if (!f) continue;
      const idf = Math.log(1 + (N - (ix.df.get(w) ?? 0) + 0.5) / ((ix.df.get(w) ?? 0) + 0.5));
      s += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * ix.len[i]) / ix.avg)));
    }
    return { d, s };
  });
  return scored.filter((x) => x.s > 0).sort((a, b2) => b2.s - a.s).slice(0, k).map((x) => x.d);
}

// The retrieved passages, as the text block that goes in front of the shopper's latest question.
export function sourcesBlock(passages: Passage[]) {
  if (!passages.length) return '<sources>\nNo matching passages in our reviewed content.\n</sources>';
  return `<sources>\n${passages.map((p, i) => `[${i + 1}] ${p.title} — link: ${p.url}\n${p.text.slice(0, 1200)}`).join('\n\n')}\n</sources>`;
}
