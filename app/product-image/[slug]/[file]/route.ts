import { getStoreProduct, getStoreProducts } from '@/lib/catalog/server';
import { SEED_PRODUCTS } from '@/data/products';
import { studioGroupPng, BACKDROP } from '@/lib/labels/studio';
import { BottleVariant } from '@/lib/labels/svg';
import { renderBottlePng } from '@/lib/labels/png';
import { GalleryVariant, galleryVariants } from '@/lib/labels/gallery-data';
import { productImageSrc } from '@/lib/labels/image-url';

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
  // Only the current hash is rendered (21 Nov audit: random hashes would force a fresh render each time); old or
  // made-up hashes redirect to the current image.
  const current = productImageSrc(product, variant);
  if (!current.endsWith(`/${file}`)) return Response.redirect(new URL(current, _req.url), 308);

  // Stacks and bundles (20 Nov): the front is a studio group shot of the bottles in the stack, on the cream backdrop.
  if (variant === 'front' && product.bundleItems?.length) {
    const all = await getStoreProducts();
    const parts = product.bundleItems.map((b) => all.find((p) => p.slug === b.slug) ?? SEED_PRODUCTS.find((p) => p.slug === b.slug)).filter((p) => p !== undefined);
    if (parts.length) {
      const n = parts.length, size = n > 2 ? 620 : 780, step = n > 2 ? 360 : 440;
      const png = await studioGroupPng(parts as never, 1200, 1200, { size, step, y: 1200 / 2 - size / 2 + 40, bg: BACKDROP });
      return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } });
    }
  }

  return new Response(new Uint8Array(await renderBottlePng(product, variant)), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
