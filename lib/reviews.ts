import 'server-only';
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { CATALOG_TAG } from '@/lib/catalog/server';
import { Review } from '@/types';

// Latest approved reviews for the storefront carousels. Empty until real customers review, and the
// sections that show them hide themselves when there are none.
async function load(limit: number): Promise<Review[]> {
  if (!dbConfigured()) return [];
  const { data, error } = await db()
    .from('reviews')
    .select('id, product_slug, name, rating, title, body, verified_buyer, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('Could not load reviews', error);
    return [];
  }
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    productSlug: r.product_slug,
    rating: r.rating,
    title: r.title,
    body: r.body,
    date: r.created_at.slice(0, 10),
    verified: r.verified_buyer,
  }));
}

// Approving a review already calls updateTag(CATALOG_TAG), which refreshes this too.
export const latestReviews = unstable_cache(load, ['latest-reviews-v1'], { tags: [CATALOG_TAG] });
