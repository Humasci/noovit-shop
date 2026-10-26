import { Frequency, Product, PurchaseMode } from '@/types';
import { getProductBySlug, packOptions } from '@/data/products';
import { FREQUENCIES, priceLookupKey } from '@/lib/stripe/catalog';

export interface CheckoutItemInput {
  slug: string;
  mode: PurchaseMode;
  bottles: number;
  frequency?: Frequency;
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItemInput[];
  ageConfirmed?: boolean;
  autoRenewConsent?: boolean;
}

export interface ValidatedLine {
  product: Product;
  lookupKey: string;
  quantity: number;
}

export type ValidationResult =
  | { ok: true; lines: ValidatedLine[]; frequency?: Frequency; ageRestricted: boolean }
  | { ok: false; error: string };

export const MAX_QTY = 20;

export function validateCheckout(body: unknown): ValidationResult {
  const req = body as CheckoutRequest;
  if (!req || !Array.isArray(req.items) || req.items.length === 0) return { ok: false, error: 'Your cart is empty.' };
  if (req.items.length > 30) return { ok: false, error: 'Too many items in cart.' };

  const lines: ValidatedLine[] = [];
  const frequencies = new Set<Frequency>();

  for (const item of req.items) {
    const product = getProductBySlug(String(item?.slug));
    if (!product) return { ok: false, error: 'A product in your cart is no longer available.' };
    if (item.mode !== 'one-time' && item.mode !== 'subscribe') return { ok: false, error: 'Invalid purchase option.' };
    if (!packOptions(product, item.mode).some((o) => o.bottles === item.bottles)) {
      return { ok: false, error: `Invalid pack size for ${product.name}.` };
    }
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return { ok: false, error: 'Invalid quantity.' };

    let frequency: Frequency | undefined;
    if (item.mode === 'subscribe') {
      if (!FREQUENCIES.includes(item.frequency as Frequency)) return { ok: false, error: 'Invalid delivery frequency.' };
      frequency = item.frequency;
      frequencies.add(frequency!);
    }

    const lookupKey = priceLookupKey(product.slug, item.mode, item.bottles, frequency);
    const existing = lines.find((l) => l.lookupKey === lookupKey);
    if (existing) existing.quantity = Math.min(existing.quantity + qty, MAX_QTY);
    else lines.push({ product, lookupKey, quantity: qty });
  }

  if (frequencies.size > 1) return { ok: false, error: 'All subscription items must share one delivery frequency.' };
  const frequency = [...frequencies][0];
  if (frequency && !req.autoRenewConsent) return { ok: false, error: 'Please agree to the subscription terms to continue.' };

  const ageRestricted = lines.some((l) => l.product.ageRestricted);
  if (ageRestricted && !req.ageConfirmed) return { ok: false, error: 'Please confirm you are 18 or older to buy Creatine.' };

  return { ok: true, lines, frequency, ageRestricted };
}
