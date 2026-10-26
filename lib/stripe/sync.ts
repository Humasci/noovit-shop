import Stripe from 'stripe';
import { Product } from '@/types';
import { planPrices, stripeProductId, PlannedPrice } from './catalog';

const MANAGED = { managed_by: 'noovit-sync' };

export interface SyncStats {
  productsCreated: number;
  productsUpdated: number;
  pricesCreated: number;
  pricesReplaced: number;
  pricesUnchanged: number;
  archived: number;
}

function matches(existing: Stripe.Price, planned: PlannedPrice) {
  const recurring = existing.recurring;
  return (
    existing.unit_amount === planned.unitAmount &&
    existing.currency === 'usd' &&
    (planned.intervalDays ? recurring?.interval === 'day' && recurring.interval_count === planned.intervalDays : recurring === null)
  );
}

// Idempotent: creates missing products/prices, replaces prices whose amount changed (keeping the lookup key),
// and with archiveMissing, deactivates managed Stripe products no longer in the list.
export async function syncProducts(s: Stripe, products: Product[], { archiveMissing = false } = {}): Promise<SyncStats> {
  const stats: SyncStats = { productsCreated: 0, productsUpdated: 0, pricesCreated: 0, pricesReplaced: 0, pricesUnchanged: 0, archived: 0 };

  for (const product of products) {
    const id = stripeProductId(product.slug);
    const taxCode = product.productType === 'pets' ? process.env.STRIPE_TAX_CODE_PETS : process.env.STRIPE_TAX_CODE_SUPPLEMENTS;
    const fields = {
      name: product.name,
      description: product.shortBenefit,
      active: true,
      metadata: { ...MANAGED, slug: product.slug, product_type: product.productType },
      ...(product.images[0] ? { images: product.images.slice(0, 8) } : {}),
      ...(taxCode ? { tax_code: taxCode } : {}),
    };

    try {
      await s.products.retrieve(id);
      await s.products.update(id, fields);
      stats.productsUpdated++;
    } catch (err) {
      if ((err as Stripe.errors.StripeError).code !== 'resource_missing') throw err;
      await s.products.create({ id, ...fields });
      stats.productsCreated++;
    }

    const existing = new Map<string, Stripe.Price>();
    for await (const price of s.prices.list({ product: id, active: true, limit: 100 })) {
      if (price.lookup_key) existing.set(price.lookup_key, price);
    }

    for (const planned of planPrices(product)) {
      const current = existing.get(planned.lookupKey);
      if (current && matches(current, planned)) {
        stats.pricesUnchanged++;
        continue;
      }
      await s.prices.create({
        product: id,
        currency: 'usd',
        unit_amount: planned.unitAmount,
        lookup_key: planned.lookupKey,
        transfer_lookup_key: true,
        nickname: planned.nickname,
        tax_behavior: 'exclusive',
        metadata: { ...MANAGED, ...planned.metadata },
        ...(planned.intervalDays ? { recurring: { interval: 'day' as const, interval_count: planned.intervalDays } } : {}),
      });
      if (current) {
        await s.prices.update(current.id, { active: false });
        stats.pricesReplaced++;
      } else {
        stats.pricesCreated++;
      }
    }
  }

  if (archiveMissing) {
    const wanted = new Set(products.map((p) => stripeProductId(p.slug)));
    for await (const p of s.products.list({ active: true, limit: 100 })) {
      if (p.metadata.managed_by === MANAGED.managed_by && !wanted.has(p.id)) {
        await s.products.update(p.id, { active: false });
        stats.archived++;
      }
    }
  }
  return stats;
}
