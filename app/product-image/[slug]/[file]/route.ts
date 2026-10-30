import { getStoreProduct } from '@/lib/catalog/server';
import { BottleVariant } from '@/lib/labels/svg';
import { renderBottlePng } from '@/lib/labels/png';
import { GalleryVariant, galleryVariants } from '@/lib/labels/gallery-data';

const VARIANTS: (BottleVariant | GalleryVariant)[] = ['front', 'duo', 'facts', 'highlights', 'compare'];

// Storefront mockups: /product-image/<slug>/<variant>-<hash>.png. The hash comes from the label content
// (see productImageSrc), so a changed label gets a new URL and the image can be cached forever.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  const { slug, file } = await params;
  const variant = file.match(/^([a-z]+)-[a-z0-9]+\.png$/)?.[1] as BottleVariant | GalleryVariant | undefined;
  if (!variant || !VARIANTS.includes(variant)) return new Response('Not found', { status: 404 });
  const product = await getStoreProduct(slug);
  if (!product) return new Response('Not found', { status: 404 });
  if ((variant === 'highlights' || variant === 'compare') && !galleryVariants(product).includes(variant)) return new Response('Not found', { status: 404 });

  return new Response(new Uint8Array(renderBottlePng(product, variant)), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
