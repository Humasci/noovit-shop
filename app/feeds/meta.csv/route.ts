import { getStoreProducts } from '@/lib/catalog/server';
import { catalogCsv, toFeedItem } from '@/lib/feeds';

// Always current (prices, products, launch switch): built per request, the catalog itself is cached.
export const dynamic = 'force-dynamic';

export async function GET() {
  const items = (await getStoreProducts()).map(toFeedItem);
  return new Response(catalogCsv(items, 'id'), { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
