import { Product } from '@/types';

// The supplement quiz: questions, and a transparent scoring model that maps answers to products.
// Pure functions, used client-side. Only products currently on sale can be recommended.

export type Sex = 'female' | 'male' | 'other';
export type Age = '18-29' | '30-44' | '45-59' | '60+';
export type Activity = 'low' | 'moderate' | 'high';

export interface QuizAnswers {
  sex?: Sex;
  age?: Age;
  goals: string[];
  symptoms: string[];
  diet: string[]; // 'vegan' | 'vegetarian' | 'gluten-free'
  activity?: Activity;
  pregnant?: 'pregnant' | 'breastfeeding' | 'no';
  medication?: 'yes' | 'no';
}

export const GOALS: { id: string; label: string; female?: boolean }[] = [
  { id: 'brain', label: 'Brain & focus' },
  { id: 'gut', label: 'Gut health' },
  { id: 'joints', label: 'Joints & mobility' },
  { id: 'beauty', label: 'Hair, skin & nails' },
  { id: 'immunity', label: 'Immunity' },
  { id: 'energy', label: 'Energy' },
  { id: 'sleep', label: 'Sleep & stress' },
  { id: 'heart', label: 'Heart & blood sugar' },
  { id: 'muscle', label: 'Muscle & performance' },
  { id: 'menopause', label: 'Menopause support', female: true },
];

export const SYMPTOMS: { id: string; label: string; female?: boolean }[] = [
  { id: 'fog', label: 'Brain fog' },
  { id: 'tired', label: 'Low energy' },
  { id: 'sleep', label: 'Poor sleep' },
  { id: 'stress', label: 'Feeling stressed' },
  { id: 'bloating', label: 'Bloating or gas' },
  { id: 'irregular', label: 'Irregular digestion' },
  { id: 'stiff', label: 'Stiff or achy joints' },
  { id: 'nails', label: 'Brittle nails or thinning hair' },
  { id: 'skin', label: 'Dull or dry skin' },
  { id: 'colds', label: 'Catching colds often' },
  { id: 'cramps', label: 'Muscle cramps' },
  { id: 'flushes', label: 'Hot flushes', female: true },
];

export const DIETS = [
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'gluten-free', label: 'Gluten-free' },
];

// Weights per product: goal and symptom matches, plus small demographic nudges.
interface Weights {
  goals?: Record<string, number>;
  symptoms?: Record<string, number>;
  base?: number;
  sex?: Sex; // only for this sex (or "other")
  bonus?: (a: QuizAnswers) => number;
}

const WEIGHTS: Record<string, Weights> = {
  'probiotic-complex': { goals: { gut: 3, immunity: 1 }, symptoms: { bloating: 3, irregular: 3, colds: 1 } },
  'glucosamine-complex': { goals: { joints: 3 }, symptoms: { stiff: 3 }, bonus: (a) => (a.age === '45-59' || a.age === '60+' ? 1 : 0) },
  'collagen-complex': { goals: { beauty: 3, joints: 1 }, symptoms: { skin: 3, nails: 2, stiff: 1 } },
  'menopause-complex': { goals: { menopause: 4 }, symptoms: { flushes: 4, sleep: 1, stress: 1 }, sex: 'female', bonus: (a) => (a.age === '45-59' ? 1 : 0) },
  'magnesium-complex': { goals: { sleep: 3, muscle: 1, energy: 1 }, symptoms: { sleep: 3, stress: 2, cramps: 3, tired: 1 } },
  zinc: { goals: { immunity: 3, beauty: 1 }, symptoms: { colds: 3, skin: 1 } },
  'iron-complex': { goals: { energy: 2 }, symptoms: { tired: 3, fog: 1 }, bonus: (a) => (a.sex === 'female' && a.age !== '60+' ? 1 : 0) },
  'vitamin-d3-k2': { goals: { immunity: 2, heart: 1, energy: 1, joints: 1 }, symptoms: { colds: 1, tired: 1 }, bonus: (a) => (a.age === '45-59' || a.age === '60+' ? 1 : 0) },
  'turmeric-complex': { goals: { joints: 2, heart: 1 }, symptoms: { stiff: 2 } },
  'berberine-complex': { goals: { heart: 3 } },
  ashwagandha: { goals: { sleep: 2, energy: 1, brain: 1 }, symptoms: { stress: 3, sleep: 2, fog: 1 } },
  multivitamin: { goals: { energy: 1, immunity: 1, brain: 1 }, symptoms: { tired: 1 }, base: 1 },
  'biotin-complex': { goals: { beauty: 3 }, symptoms: { nails: 3, skin: 1 } },
  creatine: { goals: { muscle: 4, brain: 1 }, bonus: (a) => (a.activity === 'high' ? 2 : 0) },
  'mushroom-blend-powder': { goals: { brain: 2, energy: 2, immunity: 1 }, symptoms: { fog: 2, tired: 1 } },
  'focus-complex': { goals: { brain: 4 }, symptoms: { fog: 3, stress: 1 } },
  'lions-mane': { goals: { brain: 3 }, symptoms: { fog: 2 } },
  'l-theanine': { goals: { brain: 2, sleep: 1 }, symptoms: { stress: 2 } },
};

export interface Recommendation {
  product: Product;
  score: number;
  reasons: string[];
}

const label = (list: { id: string; label: string }[], id: string) => list.find((x) => x.id === id)?.label ?? id;

// Diet and life-stage filters always win over scores.
function allowed(p: Product, a: QuizAnswers) {
  const w = WEIGHTS[p.slug];
  if (w?.sex && a.sex && a.sex !== w.sex && a.sex !== 'other') return false;
  if (a.diet.includes('vegan') && !p.dietaryTags.includes('vegan')) return false;
  if (a.diet.includes('gluten-free') && !p.dietaryTags.includes('gluten-free')) return false;
  if (a.pregnant === 'pregnant' && !p.dietaryTags.includes('pregnancy-safe')) return false;
  if (a.pregnant === 'breastfeeding' && !p.dietaryTags.includes('postpartum-safe')) return false;
  return true;
}

export function recommend(products: Product[], a: QuizAnswers, count = 3): Recommendation[] {
  const scored = products
    .filter((p) => p.productType !== 'pets' && p.status === 'active' && allowed(p, a))
    .map((p) => {
      const w = WEIGHTS[p.slug] ?? {};
      const reasons: string[] = [];
      let score = w.base ?? 0;
      for (const g of a.goals) if (w.goals?.[g]) { score += w.goals[g]; reasons.push(label(GOALS, g)); }
      for (const s of a.symptoms) if (w.symptoms?.[s]) { score += w.symptoms[s]; reasons.push(label(SYMPTOMS, s)); }
      score += w.bonus?.(a) ?? 0;
      return { product: p, score, reasons: [...new Set(reasons)].slice(0, 3) };
    })
    .filter((r) => r.score > 0)
    .sort((x, y) => y.score - x.score || Number(y.product.bestSeller) - Number(x.product.bestSeller));
  return scored.slice(0, count);
}

// Products for a goal, strongest match first (used by the "Shop by goal" pages). Same weights as the quiz.
export function productsForGoal(products: Product[], goal: string) {
  return products
    .filter((p) => p.productType !== 'pets' && p.status !== 'hidden' && (WEIGHTS[p.slug]?.goals?.[goal] ?? 0) > 0)
    .sort((a, b) => (WEIGHTS[b.slug]?.goals?.[goal] ?? 0) - (WEIGHTS[a.slug]?.goals?.[goal] ?? 0) || Number(b.bestSeller) - Number(a.bestSeller));
}
