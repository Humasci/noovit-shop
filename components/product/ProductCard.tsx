'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils/format';
import { useCart } from '@/lib/store/cart';
import { track } from '@/lib/analytics';
import { asLowAs, packOptions } from '@/data/products';
import { ProductImage } from './ProductImage';
import { Stars } from '@/components/ui/Stars';

// Hover: orange tiles assemble in the image corner, one after another.
const CORNER: [number, number, number][] = [[0, 0, 0.95], [1, 0, 0.6], [0, 1, 0.7], [2, 0, 0.3], [1, 1, 0.35], [0, 2, 0.4], [3, 0, 0.15], [0, 3, 0.15]];

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const add = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    const [single] = packOptions(product, 'one-time');
    addItem({ product, mode: 'one-time', ...single });
    track({ name: 'add_to_cart', item: { id: product.slug, name: product.name, price: single.pricePerBottle * single.bottles } });
  };

  return (
    <div className="group flex flex-col">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden rounded-2xl bg-[var(--color-soft)]">
        <ProductImage product={product} className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" />
        <span aria-hidden className="pointer-events-none absolute right-3 top-3">
          {CORNER.map(([c, r, o], k) => (
            <i
              key={k}
              className="absolute h-2.5 w-2.5 scale-50 rounded-[2px] bg-[var(--color-orange)] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-[var(--o)] motion-reduce:transition-none"
              style={{ right: c * 12, top: r * 12, ['--o' as string]: o, transitionDelay: `${k * 40}ms` }}
            />
          ))}
        </span>
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
            <button
              onClick={add}
              className="relative overflow-hidden whitespace-nowrap rounded-full border-2 border-[var(--color-accent)] px-4 py-1.5 text-sm font-bold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-white"
            >
              {/* Tile fill: the button fills left to right with opal squares, then confirms */}
              <span aria-hidden className="absolute inset-0 grid grid-cols-8 grid-rows-2">
                {Array.from({ length: 16 }, (_, k) => (
                  <i key={k} className={`bg-[var(--color-accent)] transition-opacity duration-150 ${added ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: added ? `${(k % 8) * 35 + Math.floor(k / 8) * 15}ms` : '0ms' }} />
                ))}
              </span>
              <span className={`relative ${added ? 'text-white' : ''}`}>{added ? '✓ Added' : 'Add to Cart'}</span>
            </button>
          ) : (
            <span className="whitespace-nowrap text-sm font-bold text-[var(--color-muted)]">Out of stock</span>
          )}
          <span className="whitespace-nowrap text-sm text-[var(--color-muted)]">
            as low as <span className="font-bold text-[var(--color-navy)]">{formatPrice(asLowAs(product))}</span>
            <span className="block text-xs">{product.servings}-day supply per bottle</span>
          </span>
        </div>
      </div>
    </div>
  );
}
