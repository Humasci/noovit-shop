import { Product } from '@/types';
import { bottleSvg, BottleVariant, MOCKUP_VERSION } from '@/lib/labels/svg';
import { GalleryVariant, galleryKey, galleryVariants } from '@/lib/labels/gallery-data';

export type ImageVariant = BottleVariant | GalleryVariant;
export const isGallery = (v: ImageVariant): v is GalleryVariant => v === 'highlights' || v === 'compare';

// Short content hash of the mockup, so its URL changes whenever the label does (and can be cached forever).
function hash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export const productImageSrc = (product: Product, variant: ImageVariant = 'front') =>
  `/product-image/${product.slug}/${variant}-${hash((isGallery(variant) ? galleryKey(product, variant) + bottleSvg(product, 'front') : bottleSvg(product, variant)) + MOCKUP_VERSION)}.png`;

// Every gallery image in page order (front, fact images, label close-up, Supplement Facts), as absolute URLs for
// structured data and product feeds. Uploaded photos replace the drawn front.
export const productGalleryUrls = (product: Product, siteUrl: string) => {
  const drawn = (['front', ...galleryVariants(product), 'duo', 'facts'] as ImageVariant[]).map((v) => `${siteUrl}${productImageSrc(product, v)}`);
  return product.images.length ? [...product.images, ...drawn.slice(1)] : drawn;
};
