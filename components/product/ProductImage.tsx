import Image from 'next/image';
import { Product } from '@/types';
import { bottleSvg } from '@/lib/labels/svg';
import { ImageVariant, isGallery, productImageSrc } from '@/lib/labels/image-url';
import { productSpec } from '@/lib/seo';

export type { ImageVariant };
export { productImageSrc };

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
  // Alt text names the product and what it is ("Magnesium Sleep+, magnesium glycinate 275 mg: bottle"): helps Image search.
  const spec = productSpec(product);
  const alt = `${product.name}${spec ? `, ${spec}` : ''}: ${LABELS[variant]}`;
  if (variant === 'front' && product.images?.length) {
    return <img src={product.images[0]} alt={alt} className={`object-cover ${className}`} loading={priority ? 'eager' : 'lazy'} />;
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
