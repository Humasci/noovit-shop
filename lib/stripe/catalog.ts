import { Frequency, Product, PurchaseMode } from '@/types';
import { packOptions } from '@/data/products';

export const FREQUENCIES: Frequency[] = [30, 60, 90];

export const stripeProductId = (slug: string) => `noovit_${slug}`;

// Checkout resolves prices by lookup key, so Stripe price IDs never need to live in code.
export const priceLookupKey = (slug: string, mode: PurchaseMode, bottles: number, frequency?: Frequency) =>
  mode === 'subscribe' ? `noovit_${slug}_sub_${bottles}b_${frequency}d` : `noovit_${slug}_once_${bottles}b`;

export interface PlannedPrice {
  lookupKey: string;
  productId: string;
  unitAmount: number;
  intervalDays?: Frequency;
  nickname: string;
  metadata: Record<string, string>;
}

export function planPrices(product: Product): PlannedPrice[] {
  const plan: PlannedPrice[] = [];
  const add = (mode: PurchaseMode, bottles: number, pricePerBottle: number, frequency?: Frequency) =>
    plan.push({
      lookupKey: priceLookupKey(product.slug, mode, bottles, frequency),
      productId: stripeProductId(product.slug),
      unitAmount: Math.round(pricePerBottle * bottles * 100),
      intervalDays: frequency,
      nickname: `${bottles} ${bottles === 1 ? 'bottle' : 'bottles'} · ${mode === 'subscribe' ? `every ${frequency} days` : 'one-time'}`,
      metadata: { slug: product.slug, mode, bottles: String(bottles), ...(frequency ? { frequency_days: String(frequency) } : {}) },
    });

  for (const o of packOptions(product, 'one-time')) add('one-time', o.bottles, o.pricePerBottle);
  for (const f of FREQUENCIES) for (const o of packOptions(product, 'subscribe')) add('subscribe', o.bottles, o.pricePerBottle, f);
  return plan;
}
