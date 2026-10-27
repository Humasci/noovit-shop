import { getStoreProduct } from '@/lib/catalog/server';
import { renderBottlePng } from '@/lib/labels/png';

// PNG of the branded bottle for product feeds and link previews, drawn from the same label design as the site.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const product = await getStoreProduct((await params).slug);
  if (!product) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(renderBottlePng(product)), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400, s-maxage=604800' },
  });
}
