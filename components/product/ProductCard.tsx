'use client';

import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils/format';
import { useCart } from '@/lib/store/cart';
import { track } from '@/lib/analytics';
import { asLowAs, packOptions } from '@/data/products';
import { ProductImage } from './ProductImage';
import { Stars } from '@/components/ui/Stars';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);

  const add = () => {
    const [single] = packOptions(product, 'one-time');
    addItem({ product, mode: 'one-time', ...single });
    track({ name: 'add_to_cart', item: { id: product.slug, name: product.name, price: single.pricePerBottle * single.bottles } });
  };

  return (
    <div className="group flex flex-col">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden rounded-2xl bg-[var(--color-soft)]">
        <ProductImage product={product} className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" />
        {product.bestSeller && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-navy)]">
            Best Seller
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-bold hover:text-[var(--color-accent)]">{product.name}</h3>
        </Link>
        {product.reviewCount > 0 && (
          <div className="mt-1 flex items-center gap-2">
            <Stars rating={product.rating} size={14} />
            <span className="text-xs text-[var(--color-muted)]">({product.reviewCount.toLocaleString()})</span>
          </div>
        )}
        <p className="mt-2 flex-1 text-sm text-[var(--color-muted)]">{product.shortBenefit}</p>
        <div className="mt-4 flex flex-col-reverse items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          {product.status === 'active' ? (
            <button onClick={add} className="whitespace-nowrap text-sm font-bold text-[var(--color-accent)] underline-offset-4 hover:underline">
              Add to Cart
            </button>
          ) : (
            <span className="whitespace-nowrap text-sm font-bold text-[var(--color-muted)]">Out of stock</span>
          )}
          <span className="whitespace-nowrap text-sm text-[var(--color-muted)]">
            as low as <span className="font-bold text-[var(--color-navy)]">{formatPrice(asLowAs(product))}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
