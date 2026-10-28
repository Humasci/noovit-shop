'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils/format';
import { useCart } from '@/lib/store/cart';
import { track } from '@/lib/analytics';
import { asLowAs, packOptions } from '@/data/products';
import { ProductImage } from './ProductImage';
import { GOAL_PAGES } from '@/lib/goals';
import { goalsForProduct } from '@/lib/quiz';
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

  const goal = product.bundleItems?.length ? 'Bundle' : GOAL_PAGES.find((g) => g.goal === goalsForProduct(product.slug)[0])?.name;
  const from = asLowAs(product);
  const off = Math.round((1 - from / product.basePrice) * 100);

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-[var(--color-line)] bg-white">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden bg-[var(--color-soft)]">
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
        <span className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {goal && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-navy)]">{goal}</span>
          )}
          {product.bestSeller && (
            <span className="rounded-full bg-[var(--color-navy)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">Best seller</span>
          )}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.reviewCount > 0 && (
          <div className="mb-1 flex items-center gap-2">
            <Stars rating={product.rating} size={13} />
            <span className="text-xs text-[var(--color-muted)]">{product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()})</span>
          </div>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-base font-semibold hover:text-[var(--color-accent)] md:text-lg">{product.name}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-[var(--color-muted)]">{product.tagline || product.shortBenefit}</p>
        <p className="mt-3 text-sm">
          <span className="font-semibold text-[var(--color-navy)]">From {formatPrice(from)}</span>{' '}
          {off > 0 && <s className="text-[var(--color-muted)]">{formatPrice(product.basePrice)}</s>}{' '}
          {off > 0 && <span className="font-semibold text-[var(--color-accent)]">{off}% off</span>}
          <span className="block text-xs text-[var(--color-muted)]">{product.servings}-day supply{product.bundleItems?.length ? '' : ' per bottle'}</span>
        </p>
        {product.status === 'active' ? (
          <button
            onClick={add}
            className="relative mt-3 overflow-hidden whitespace-nowrap rounded border-[1.5px] border-[var(--color-navy)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--color-navy)] transition-colors hover:bg-[var(--color-navy)] hover:text-white"
          >
            {/* Tile fill: the button fills left to right with navy squares, then confirms */}
            <span aria-hidden className="absolute inset-0 grid grid-cols-8 grid-rows-2">
              {Array.from({ length: 16 }, (_, k) => (
                <i key={k} className={`bg-[var(--color-navy)] transition-opacity duration-150 ${added ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: added ? `${(k % 8) * 35 + Math.floor(k / 8) * 15}ms` : '0ms' }} />
              ))}
            </span>
            <span className={`relative ${added ? 'text-white' : ''}`}>{added ? '✓ Added' : 'Add to cart'}</span>
          </button>
        ) : (
          <span className="mt-3 text-sm font-bold text-[var(--color-muted)]">Out of stock</span>
        )}
      </div>
    </div>
  );
}
