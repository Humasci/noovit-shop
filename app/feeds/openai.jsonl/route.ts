import { getStoreProducts } from '@/lib/catalog/server';
import { openaiFeed, toFeedItem } from '@/lib/feeds';
import { SITE_URL } from '@/lib/site';

// ChatGPT shopping feed (OpenAI merchant portal → hosted HTTPS URL). Always current: built per request.
export const dynamic = 'force-dynamic';

export async function GET() {
  const items = (await getStoreProducts()).filter((p) => p.productType !== 'pets').map(toFeedItem);
  return new Response(openaiFeed(items, SITE_URL), { headers: { 'Content-Type': 'application/jsonl; charset=utf-8' } });
}
