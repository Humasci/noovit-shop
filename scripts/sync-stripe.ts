// Sync the catalog into Stripe products + prices.
// Reads the database catalog when SUPABASE_* is set, otherwise data/products.ts.
// Usage: npm run stripe:sync [-- --dry-run] [-- --live]
import { planPrices, stripeProductId } from '@/lib/stripe/catalog';
import { syncProducts } from '@/lib/stripe/sync';
import { stripe } from '@/lib/stripe/server';
import { readCatalog } from './catalog-source';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run') || !process.env.STRIPE_SECRET_KEY;

async function main() {
  const { products, source } = await readCatalog();
  console.log(`Catalog source: ${source} (${products.length} products)`);

  if (dryRun) {
    const priceCount = products.reduce((n, p) => n + planPrices(p).length, 0);
    console.log(`Dry run: ${products.length} products, ${priceCount} prices.`);
    for (const product of products) {
      console.log(`\n${stripeProductId(product.slug)}  ${product.name}`);
      for (const pr of planPrices(product)) console.log(`  ${pr.lookupKey.padEnd(52)} $${(pr.unitAmount / 100).toFixed(2)}`);
    }
    if (!process.env.STRIPE_SECRET_KEY) console.log('\nSTRIPE_SECRET_KEY not set — nothing was sent to Stripe.');
    return;
  }

  if (process.env.STRIPE_SECRET_KEY!.startsWith('sk_live_') && !args.has('--live')) {
    throw new Error('Refusing to sync to a LIVE Stripe account without --live.');
  }
  console.log('Stripe sync complete:', await syncProducts(stripe(), products, { archiveMissing: true }));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
