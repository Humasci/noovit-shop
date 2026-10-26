// Copy the launch catalog from data/products.ts into the database. Existing products are left untouched.
// Usage: npm run catalog:seed
import { SEED_PRODUCTS } from '@/data/products';
import { toProductData } from '@/lib/catalog/build';
import { scriptDb } from './catalog-source';

async function main() {
  const client = scriptDb();
  if (!client) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');

  const rows = SEED_PRODUCTS.map((p, i) => ({ slug: p.slug, data: toProductData(p), status: p.status, sort_order: i * 10 }));
  const { data, error } = await client.from('products').upsert(rows, { onConflict: 'slug', ignoreDuplicates: true }).select('slug');
  if (error) throw error;
  console.log(`Seeded ${data?.length ?? 0} new products (${rows.length - (data?.length ?? 0)} already existed).`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
