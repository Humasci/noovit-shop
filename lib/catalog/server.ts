import 'server-only';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { SEED_PRODUCTS, findProduct } from '@/data/products';
import { Collection, Product } from '@/types';
import { buildProduct, ProductRow, RealRating } from './build';

export const CATALOG_TAG = 'catalog';

async function realRatings() {
  const { data, error } = await db().from('reviews').select('product_slug, rating').eq('status', 'approved');
  if (error) throw error;
  const map = new Map<string, RealRating>();
  for (const r of data ?? []) {
    const cur = map.get(r.product_slug) ?? { rating: 0, count: 0 };
    map.set(r.product_slug, { rating: (cur.rating * cur.count + r.rating) / (cur.count + 1), count: cur.count + 1 });
  }
  return map;
}

// Uncached read, for the admin and for anything that must see edits immediately.
export async function loadCatalog(): Promise<Product[]> {
  if (!dbConfigured()) return SEED_PRODUCTS;
  const { data, error } = await db().from('products').select('*').order('sort_order').order('slug');
  if (error) throw error;
  if (!data?.length) {
    console.warn('products table is empty — showing the seed catalog. Run npm run catalog:seed.');
    return SEED_PRODUCTS;
  }
  const ratings = await realRatings();
  return (data as ProductRow[]).map((row) => buildProduct(row, ratings.get(row.slug)));
}

// Cached for the storefront; admin saves call updateTag(CATALOG_TAG).
export const getCatalog = unstable_cache(loadCatalog, ['catalog-v1'], { tags: [CATALOG_TAG] });

// Everything a shopper may see (hidden products excluded).
export async function getStoreProducts() {
  return (await getCatalog()).filter((p) => p.status !== 'hidden');
}

export async function getStoreProduct(slug: string) {
  const p = findProduct(await getCatalog(), slug);
  return p && p.status !== 'hidden' ? p : undefined;
}

interface CollectionRow {
  slug: string;
  title: string;
  description: string;
  image: string | null;
  product_slugs: string[];
  status: 'active' | 'hidden';
  seo_title: string | null;
  seo_description: string | null;
}

export const toCollection = (r: CollectionRow): Collection => ({
  slug: r.slug,
  title: r.title,
  description: r.description,
  image: r.image,
  productSlugs: r.product_slugs ?? [],
  status: r.status,
  seoTitle: r.seo_title,
  seoDescription: r.seo_description,
});

export async function loadCollections(): Promise<Collection[]> {
  if (!dbConfigured()) return [];
  const { data, error } = await db().from('collections').select('*').order('sort_order').order('title');
  if (error) throw error;
  return (data as CollectionRow[]).map(toCollection);
}

export const getCollections = unstable_cache(loadCollections, ['collections-v1'], { tags: [CATALOG_TAG] });

export async function getStoreCollections() {
  return (await getCollections()).filter((c) => c.status === 'active');
}
