'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { TrustSection } from '@/components/sections/Sections';
import { PRODUCT_TYPES, PUBLIC_DIETARY_TAGS, asLowAs } from '@/data/products';
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
      className={`shrink-0 rounded border px-4 py-1.5 text-sm font-semibold transition-colors ${
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
  const [sheetOpen, setSheetOpen] = useState(false); // phones: filters and sort in a bottom sheet

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSheetOpen(false);
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [sheetOpen]);

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
          <p className="mt-4 text-[var(--color-muted)]">Evidence-based doses · Third-party tested · Made in the USA</p>
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

      {/* Sticky only from tablet up: on phones the filter bar would cover a third of the screen. */}
      <div className="z-30 border-b border-[var(--color-line)] bg-[var(--color-canvas)] md:sticky md:top-[82px]">
        <div className="container px-4 py-3 sm:px-6 md:py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              <span className="mr-1 hidden shrink-0 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] sm:inline">Product Type</span>
              {TYPE_TABS.filter((t) => t.value === 'all' || t.value === 'best-sellers' || products.some((p) => p.productType === t.value)).map((t) => (
                <Pill key={t.value} active={type === t.value} onClick={() => setType(t.value)}>
                  {t.label}
                </Pill>
              ))}
            </div>
            {/* Phones: one button opens the bottom sheet with diet filters and sort. */}
            <button
              onClick={() => setSheetOpen(true)}
              className="flex items-center justify-center gap-2 rounded border border-[var(--color-line)] bg-white py-2 text-sm font-semibold md:hidden"
              aria-haspopup="dialog"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters &amp; sort
              {tags.length > 0 && <span className="rounded-full bg-[var(--color-navy)] px-1.5 text-xs text-white">{tags.length}</span>}
            </button>
            <div className="hidden items-center justify-between gap-3 md:flex">
              <button onClick={() => setShowDiet(!showDiet)} className="flex shrink-0 items-center gap-1 text-sm font-semibold">
                <SlidersHorizontal className="h-4 w-4" /> {showDiet ? 'Fewer filters' : 'More filters'}
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="min-w-0 rounded border border-[var(--color-line)] bg-white px-3 py-2 text-sm font-semibold sm:px-4"
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
            <div className="no-scrollbar mt-3 hidden items-center gap-2 overflow-x-auto md:flex">
              <span className="mr-1 hidden shrink-0 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)] sm:inline">For Every Body</span>
              {PUBLIC_DIETARY_TAGS.map((t) => (
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

      {sheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button aria-label="Close filters" className="absolute inset-0 bg-black/40" onClick={() => setSheetOpen(false)} />
          <div role="dialog" aria-modal="true" aria-labelledby="filters-title" className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-[var(--color-canvas)] p-5 pb-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 id="filters-title" className="text-xl">Filters &amp; sort</h2>
              <button onClick={() => setSheetOpen(false)} aria-label="Close" className="-mr-2 p-2"><X className="h-5 w-5" /></button>
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">For every body</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {PUBLIC_DIETARY_TAGS.map((t) => (
                <Pill key={t.value} active={tags.includes(t.value)} onClick={() => toggleTag(t.value)}>
                  {t.label}
                </Pill>
              ))}
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">Sort by</p>
            <div className="mt-2 divide-y divide-[var(--color-line)] rounded border border-[var(--color-line)] bg-white">
              {SORTS.map((o) => (
                <label key={o.value} className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm">
                  {o.label}
                  <input type="radio" name="sort" checked={sort === o.value} onChange={() => setSort(o.value)} className="accent-[var(--color-navy)]" />
                </label>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => { setTags([]); setSort('featured'); }} className="btn-outline flex-1">Clear all</button>
              <button onClick={() => setSheetOpen(false)} className="btn-primary flex-[2]">
                Show {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container px-4 py-8 sm:px-6 md:py-12">
        {groups.length === 0 ? (
          <p className="py-20 text-center text-[var(--color-muted)]">No products match your search criteria.</p>
        ) : (
          <div className="space-y-12 md:space-y-16">
            {groups.map((g) => (
              <section key={g.value}>
                <h2 className="mb-5 text-2xl md:mb-8 md:text-3xl">
                  {g.label} <span className="text-[var(--color-muted)]">({g.items.length})</span>
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
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
    </>
  );
}
