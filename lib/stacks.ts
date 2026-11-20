// Stacks and upsells (20 Nov, owner). A stack is a bundle product (bundleItems) priced below its parts bought one at a
// time. Pairings drive "Pairs well with" in the cart; a cart holding every part of a stack is offered the stack instead.
import type { Product } from '@/types';

// What each product pairs best with, strongest first (falls back to best sellers when nothing matches).
export const PAIRINGS: Record<string, string[]> = {
  creatine: ['magnesium-complex', 'creatine-hydration'],
  'creatine-for-women': ['magnesium-complex', 'creatine-hydration'],
  'creatine-for-men': ['magnesium-for-men', 'creatine-hydration'],
  'magnesium-complex': ['ashwagandha', 'creatine'],
  'magnesium-for-men': ['creatine-for-men', 'ashwagandha'],
  ashwagandha: ['magnesium-complex', 'lions-mane'],
  'lions-mane': ['coq10', 'ashwagandha'],
  coq10: ['lions-mane', 'magnesium-complex'],
  'turmeric-complex': ['magnesium-complex', 'coq10'],
  'collagen-complex': ['biotin-complex'],
  'biotin-complex': ['collagen-complex'],
  'iron-complex': ['magnesium-complex'],
  'menopause-complex': ['magnesium-complex', 'creatine-for-women'],
};

export const isStack = (p: Product) => Boolean(p.bundleItems?.length);
export const stackParts = (stack: Product, all: Product[]) =>
  (stack.bundleItems ?? []).map((b) => all.find((p) => p.slug === b.slug)).filter((p): p is Product => Boolean(p));
export const separatePrice = (stack: Product, all: Product[]) => stackParts(stack, all).reduce((sum, p) => sum + p.basePrice, 0);

// Live stacks that contain this product (for "Complete the stack" on its page).
export const stacksWith = (slug: string, all: Product[]) => all.filter((p) => p.status === 'active' && p.bundleItems?.some((b) => b.slug === slug));

// Cart suggestions: partners of what's in the cart, then the fallback list; never something already in the cart.
export function cartPairings(cartSlugs: string[], all: Product[], fallback: Product[]) {
  const inCart = new Set(cartSlugs);
  const live = (s: string) => all.find((p) => p.slug === s && p.status === 'active');
  const picks: Product[] = [];
  for (const s of cartSlugs) for (const q of PAIRINGS[s] ?? []) { const p = live(q); if (p && !inCart.has(p.slug) && !picks.includes(p)) picks.push(p); }
  for (const p of fallback) if (!inCart.has(p.slug) && !picks.includes(p)) picks.push(p);
  return picks;
}

// A live stack whose parts are all in the cart as single one-time bottles: offer to swap them for the stack.
export function swappableStack(cart: { slug: string; mode: string; bottles: number }[], all: Product[]) {
  const singles = new Set(cart.filter((i) => i.mode === 'one-time' && i.bottles === 1).map((i) => i.slug));
  return all.find((p) => p.status === 'active' && p.bundleItems?.length && p.bundleItems.every((b) => singles.has(b.slug)));
}
