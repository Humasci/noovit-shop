'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { bestSellers, byAudience } from '@/data/products';
import { Product } from '@/types';

const TABS = [
  { label: 'Best Sellers', get: bestSellers },
  { label: "Women's Health", get: (list: Product[]) => byAudience(list, 'women') },
  { label: "Men's Health", get: (list: Product[]) => byAudience(list, 'men') },
];

export function BestSellers({ products }: { products: Product[] }) {
  const [tab, setTab] = useState(0);
  const items = TABS[tab].get(products).slice(0, 8);

  return (
    <section className="section">
      <div className="container px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="text-3xl md:text-4xl">Best Sellers</h2>
          <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-accent)]">
            Shop All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTab(i)}
              className={`shrink-0 rounded px-5 py-2 text-sm font-bold transition-colors ${
                tab === i ? 'bg-[var(--color-navy)] text-white' : 'bg-[var(--color-soft)] text-[var(--color-navy)] hover:bg-[var(--color-line)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
