'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { petProducts } from '@/data/products';
import { PET_IMAGES } from '@/data/content';
import { Product, Species } from '@/types';

const TABS: { value: Species | 'all'; label: string }[] = [
  { value: 'all', label: 'All Pets' },
  { value: 'dog', label: 'Dogs' },
  { value: 'cat', label: 'Cats' },
];

export function PetsShop({ products, initialSpecies = 'all' }: { products: Product[]; initialSpecies?: Species | 'all' }) {
  const [species, setSpecies] = useState<Species | 'all'>(initialSpecies);
  const items = petProducts(products, species === 'all' ? undefined : species);

  const pick = (s: Species) => {
    setSpecies(s);
    document.getElementById('pet-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="section">
        <div className="container px-6">
          <h2 className="mb-8 text-center text-3xl md:text-4xl">Shop by pet</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {(['dog', 'cat'] as const).map((s) => (
              <button key={s} onClick={() => pick(s)} className="group relative overflow-hidden rounded-3xl text-left">
                <img
                  src={PET_IMAGES[s]}
                  alt={s === 'dog' ? 'Happy dog' : 'Curious cat'}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-3xl font-extrabold">{s === 'dog' ? 'Dogs' : 'Cats'}</p>
                  <p className="mt-1 text-sm font-semibold text-white/90">
                    {petProducts(products, s).length} products · Shop now →
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="pet-products" className="section scroll-mt-24 bg-[var(--color-pets-soft)]">
        <div className="container px-6">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl md:text-4xl">Noovit Pets supplements</h2>
            <div className="flex gap-2">
              {TABS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSpecies(t.value)}
                  className={`rounded px-5 py-2 text-sm font-bold transition-colors ${
                    species === t.value ? 'bg-[var(--color-pets)] text-[var(--color-navy)]' : 'bg-white text-[var(--color-navy)] hover:bg-white/70'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
