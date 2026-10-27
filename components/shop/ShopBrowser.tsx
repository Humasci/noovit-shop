'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { TrustSection, ReviewsSection } from '@/components/sections/Sections';
import { PRODUCT_TYPES, DIETARY_TAGS, asLowAs } from '@/data/products';
import { DietaryTag, Product, ProductType } from '@/types';

export type TypeFilter = ProductType | 'all' | 'best-sellers';
type Sort = 'featured' | 'az' | 'za' | 'low' | 'high';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'az', label: 'Alphabetically, A–Z' },
  { value: 'za', label: 'Alphabetically, Z–A' },
  { value: 'low', label: 'Price, low to high' },
  { value: 'high', label: 'Price, high to low' },
];

const TYPE_TABS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'best-sellers', label: 'Best Sellers' },
  ...PRODUCT_TYPES,
];

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
        active ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white' : 'border-[var(--color-line)] hover:border-[var(--color-navy)]'
      }`}
    >
      {children}
    </button>
  );
}

export function ShopBrowser({
  products,
  initialType,
  collections = [],
}: {
  products: Product[];
  initialType: TypeFilter;
  collections?: { slug: string; title: string }[];
}) {
  const [type, setType] = useState<TypeFilter>(initialType);
  const [tags, setTags] = useState<DietaryTag[]>([]);
  const [sort, setSort] = useState<Sort>('featured');
  const [showDiet, setShowDiet] = useState(true);

  const filtered = useMemo(() => {
    const list = products.filter(
      (p) =>
        (type === 'all' || (type === 'best-sellers' ? p.bestSeller : p.productType === type)) &&
        tags.every((t) => p.dietaryTags.includes(t))
    );
    const sorters: Record<Sort, (a: (typeof list)[0], b: (typeof list)[0]) => number> = {
      featured: () => 0,
      az: (a, b) => a.name.localeCompare(b.name),
      za: (a, b) => b.name.localeCompare(a.name),
      low: (a, b) => asLowAs(a) - asLowAs(b),
      high: (a, b) => asLowAs(b) - asLowAs(a),
    };
    return [...list].sort(sorters[sort]);
  }, [products, type, tags, sort]);

  const groups = PRODUCT_TYPES.map((t) => ({ ...t, items: filtered.filter((p) => p.productType === t.value) })).filter(
    (g) => g.items.length > 0
  );

  const toggleTag = (t: DietaryTag) => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <>
      <section className="bg-[var(--color-soft)] py-14">
        <div className="container px-6 text-center">
          <h1 className="mx-auto max-w-3xl text-balance text-3xl md:text-5xl">Clean, science-driven nutrition for every body.</h1>
          <p className="mt-4 text-[var(--color-muted)]">Nutritionist formulated · Third-party tested · Made in the USA</p>
          {collections.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {collections.map((c) => (
                <Link key={c.slug} href={`/collections/${c.slug}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--color-navy)] shadow-sm hover:bg-[var(--color-navy)] hover:text-white">
                  {c.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="sticky top-[65px] z-30 border-b border-[var(--color-line)] bg-white">
        <div className="container px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              <span className="mr-1 shrink-0 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Product Type</span>
              {TYPE_TABS.filter((t) => t.value === 'all' || t.value === 'best-sellers' || products.some((p) => p.productType === t.value)).map((t) => (
                <Pill key={t.value} active={type === t.value} onClick={() => setType(t.value)}>
                  {t.label}
                </Pill>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowDiet(!showDiet)} className="flex items-center gap-1 text-sm font-semibold">
                <SlidersHorizontal className="h-4 w-4" /> {showDiet ? 'Fewer filters' : 'More filters'}
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-semibold"
                aria-label="Sort by"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    Sort: {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {showDiet && (
            <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto">
              <span className="mr-1 shrink-0 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">For Every Body</span>
              {DIETARY_TAGS.map((t) => (
                <Pill key={t.value} active={tags.includes(t.value)} onClick={() => toggleTag(t.value)}>
                  {t.label}
                </Pill>
              ))}
              {tags.length > 0 && (
                <button onClick={() => setTags([])} className="shrink-0 text-sm font-semibold text-[var(--color-accent)] underline">
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container px-6 py-12">
        {groups.length === 0 ? (
          <p className="py-20 text-center text-[var(--color-muted)]">No products match your search criteria.</p>
        ) : (
          <div className="space-y-16">
            {groups.map((g) => (
              <section key={g.value}>
                <h2 className="mb-8 text-2xl md:text-3xl">
                  {g.label} <span className="text-[var(--color-muted)]">({g.items.length})</span>
                </h2>
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
                  {g.items.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <TrustSection />
      <ReviewsSection />
    </>
  );
}
