import { getStoreProducts } from '@/lib/catalog/server';
import { googleCsv, toFeedItem } from '@/lib/feeds';

// Google feed as CSV, for the Google Sheet version of the feed (IMPORTDATA). Always current: built per request.
export const dynamic = 'force-dynamic';

export async function GET() {
  const items = (await getStoreProducts()).filter((p) => p.productType !== 'pets').map(toFeedItem);
  return new Response(googleCsv(items), { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
