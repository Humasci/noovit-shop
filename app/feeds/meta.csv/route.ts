import { getStoreProducts } from '@/lib/catalog/server';
import { catalogCsv, toFeedItem } from '@/lib/feeds';

export async function GET() {
  const items = (await getStoreProducts()).map(toFeedItem);
  return new Response(catalogCsv(items, 'id'), { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
