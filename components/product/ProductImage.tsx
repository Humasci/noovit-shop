import Image from 'next/image';
import { Product } from '@/types';
import { bottleSvg, BottleVariant, MOCKUP_VERSION } from '@/lib/labels/svg';
import { GalleryVariant, galleryKey } from '@/lib/labels/gallery-data';

export type ImageVariant = BottleVariant | GalleryVariant;
const isGallery = (v: ImageVariant): v is GalleryVariant => v === 'highlights' || v === 'compare';

// Short content hash of the mockup, so its URL changes whenever the label does (and can be cached forever).
function hash(s: string) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export const productImageSrc = (product: Product, variant: ImageVariant = 'front') =>
  `/product-image/${product.slug}/${variant}-${hash((isGallery(variant) ? galleryKey(product, variant) + bottleSvg(product, 'front') : bottleSvg(product, variant)) + MOCKUP_VERSION)}.png`;

const LABELS: Record<ImageVariant, string> = { front: 'bottle', duo: 'label close-up', facts: 'supplement facts', highlights: 'what is in every serving', compare: 'dose per serving compared' };

// Uploaded photos win for the main image; otherwise a branded bottle drawn from the label design (lib/labels/svg.ts),
// served as a resized, cached image. `inline` draws the SVG in place instead (the admin editor's live preview).
export function ProductImage({
  product,
  variant = 'front',
  className = '',
  sizes = '(min-width: 1024px) 25vw, 50vw',
  priority = false,
  inline = false,
}: {
  product: Product;
  variant?: ImageVariant;
  className?: string;
  sizes?: string;
  priority?: boolean;
  inline?: boolean;
}) {
  const alt = `${product.name} ${LABELS[variant]}`;
  if (variant === 'front' && product.images?.length) {
    return <img src={product.images[0]} alt={product.name} className={`object-cover ${className}`} loading={priority ? 'eager' : 'lazy'} />;
  }
  if (inline) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`overflow-hidden [&>svg]:h-full [&>svg]:w-full ${className}`}
        // Built from our own product data with every text value escaped.
        dangerouslySetInnerHTML={{ __html: bottleSvg(product, isGallery(variant) ? 'front' : variant) }}
      />
    );
  }
  return (
    <Image
      src={productImageSrc(product, variant)}
      alt={alt}
      width={1000}
      height={1000}
      sizes={sizes}
      priority={priority}
      className={`bg-[var(--color-soft)] object-cover ${className}`}
    />
  );
}
