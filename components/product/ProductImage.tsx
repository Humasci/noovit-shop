import { Product } from '@/types';
import { bottleSvg, BottleVariant } from '@/lib/labels/svg';

export type ImageVariant = BottleVariant;

// Uploaded photos win for the main image; otherwise a branded bottle drawn from the label design (lib/labels/svg.ts).
export function ProductImage({
  product,
  variant = 'front',
  className = '',
}: {
  product: Product;
  variant?: ImageVariant;
  className?: string;
}) {
  if (variant === 'front' && product.images?.length) {
    return <img src={product.images[0]} alt={product.name} className={`object-cover ${className}`} loading="lazy" />;
  }
  return (
    <div
      role="img"
      aria-label={`${product.name} ${variant === 'facts' ? 'supplement facts' : 'bottle'}`}
      className={`overflow-hidden [&>svg]:h-full [&>svg]:w-full ${className}`}
      // Built from our own product data with every text value escaped.
      dangerouslySetInnerHTML={{ __html: bottleSvg(product, variant) }}
    />
  );
}
