import { getStoreProducts } from '@/lib/catalog/server';
import { googleFeed, toFeedItem } from '@/lib/feeds';
import { SITE_URL } from '@/lib/site';

export async function GET() {
  const items = (await getStoreProducts()).map(toFeedItem);
  return new Response(googleFeed(items, SITE_URL), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
