'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Clock } from 'lucide-react';
import { Product } from '@/types';
import { GENERAL_FAQS, IMAGES } from '@/data/content';
import { FAQSection, CommunitySection } from '@/components/sections/Sections';

export function FaqBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');
  const q = query.toLowerCase();
  const matches = products.filter((p) => p.name.toLowerCase().includes(q));

  return (
    <>
      <section className="bg-[var(--color-soft)] py-16 text-center">
        <div className="container px-6">
          <h1 className="text-4xl md:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-[var(--color-muted)]">
            Is your question missing?{' '}
            <Link href="/contact" className="font-bold text-[var(--color-accent)] underline">
              Contact us
            </Link>
          </p>
          <p className="mt-2 flex items-center justify-center gap-2 text-sm text-[var(--color-muted)]">
            <Clock className="h-4 w-4" /> Support hours: Mon–Fri, 9am–5pm EST · We reply within one business day
          </p>
        </div>
      </section>

      <FAQSection faqs={GENERAL_FAQS} title="General questions" showButtons={false} />

      <section className="container max-w-3xl px-6">
        <h2 className="mb-4 text-3xl">Product questions</h2>
        <div className="flex items-center gap-2 rounded border bg-white border-[var(--color-line)] px-5 focus-within:ring-2 focus-within:ring-[var(--color-accent)]">
          <Search className="h-4 w-4 text-[var(--color-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            aria-label="Search product questions"
            type="search"
            className="w-full py-3 focus:outline-none"
          />
        </div>
        {matches.length === 0 && <p className="py-10 text-center text-[var(--color-muted)]">No products match your search criteria.</p>}
      </section>

      {matches.map((p) => (
        <FAQSection key={p.id} faqs={p.faqs.slice(0, -2)} title={p.name} showButtons={false} />
      ))}

      <section className="section">
        <div className="container px-6">
          <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-[var(--color-navy)] text-white md:grid-cols-2">
            <div className="p-10 md:p-14">
              <h2 className="text-3xl text-white md:text-4xl">Small daily habits, big long-term results.</h2>
              <Link href="/shop" className="btn mt-6 bg-white text-[var(--color-navy)]">Shop Now</Link>
            </div>
            <img src={IMAGES.approach} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <CommunitySection />
    </>
  );
}
