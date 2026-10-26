// Sync the catalog in data/products.ts into Stripe products + prices.
// Usage: npm run stripe:sync [-- --dry-run] [-- --live]
import Stripe from 'stripe';
import { products } from '@/data/products';
import { planPrices, stripeProductId, PlannedPrice } from '@/lib/stripe/catalog';
import { stripe } from '@/lib/stripe/server';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run') || !process.env.STRIPE_SECRET_KEY;
const MANAGED = { managed_by: 'noovit-sync' };

function matches(existing: Stripe.Price, planned: PlannedPrice) {
  const recurring = existing.recurring;
  return (
    existing.unit_amount === planned.unitAmount &&
    existing.currency === 'usd' &&
    (planned.intervalDays
      ? recurring?.interval === 'day' && recurring.interval_count === planned.intervalDays
      : recurring === null)
  );
}

async function main() {
  const plan = products.map((p) => ({ product: p, prices: planPrices(p) }));
  const priceCount = plan.reduce((n, p) => n + p.prices.length, 0);

  if (dryRun) {
    console.log(`Dry run: ${plan.length} products, ${priceCount} prices.`);
    for (const { product, prices } of plan) {
      console.log(`\n${stripeProductId(product.slug)}  ${product.name}`);
      for (const pr of prices) console.log(`  ${pr.lookupKey.padEnd(52)} $${(pr.unitAmount / 100).toFixed(2)}`);
    }
    if (!process.env.STRIPE_SECRET_KEY) console.log('\nSTRIPE_SECRET_KEY not set — nothing was sent to Stripe.');
    return;
  }

  const key = process.env.STRIPE_SECRET_KEY!;
  if (key.startsWith('sk_live_') && !args.has('--live')) {
    throw new Error('Refusing to sync to a LIVE Stripe account without --live.');
  }

  const s = stripe();
  const stats = { productsCreated: 0, productsUpdated: 0, pricesCreated: 0, pricesReplaced: 0, pricesUnchanged: 0, archived: 0 };

  const existingPrices = new Map<string, Stripe.Price>();
  for await (const price of s.prices.list({ active: true, limit: 100 })) {
    if (price.lookup_key) existingPrices.set(price.lookup_key, price);
  }

  for (const { product, prices } of plan) {
    const id = stripeProductId(product.slug);
    const taxCode = product.productType === 'pets' ? process.env.STRIPE_TAX_CODE_PETS : process.env.STRIPE_TAX_CODE_SUPPLEMENTS;
    const fields = {
      name: product.name,
      description: product.shortBenefit,
      active: true,
      metadata: { ...MANAGED, slug: product.slug, product_type: product.productType },
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

    for (const planned of prices) {
      const existing = existingPrices.get(planned.lookupKey);
      if (existing && matches(existing, planned)) {
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
      if (existing) {
        await s.prices.update(existing.id, { active: false });
        stats.pricesReplaced++;
      } else {
        stats.pricesCreated++;
      }
    }
  }

  // Archive managed products that were removed from the catalog.
  const wanted = new Set(plan.map(({ product }) => stripeProductId(product.slug)));
  for await (const p of s.products.list({ active: true, limit: 100 })) {
    if (p.metadata.managed_by === MANAGED.managed_by && !wanted.has(p.id)) {
      await s.products.update(p.id, { active: false });
      stats.archived++;
    }
  }

  console.log('Stripe sync complete:', stats);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
