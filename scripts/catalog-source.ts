// Catalog access for CLI scripts (which can't import server-only modules).
import { createClient } from '@supabase/supabase-js';
import { SEED_PRODUCTS } from '@/data/products';
import { buildProduct, ProductRow } from '@/lib/catalog/build';

export function scriptDb() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
}

export async function readCatalog() {
  const client = scriptDb();
  if (!client) return { products: SEED_PRODUCTS, source: 'data/products.ts' };
  const { data, error } = await client.from('products').select('*').order('sort_order');
  if (error) throw error;
  if (!data?.length) return { products: SEED_PRODUCTS, source: 'data/products.ts (database is empty)' };
  return { products: (data as ProductRow[]).map((r) => buildProduct(r)), source: 'database' };
}
