import type { Metadata } from 'next';
import { getStoreProducts } from '@/lib/catalog/server';
import { ReviewsModule } from '@/components/reviews/ReviewsModule';
import { TrustSection } from '@/components/sections/Sections';

export const metadata: Metadata = {
  title: 'Customer Reviews — Noovit',
  description: 'Read honest reviews of Noovit supplements, or share your own experience. Every review is checked before it is published.',
  alternates: { canonical: '/reviews' },
};

export default async function ReviewsPage() {
  const products = await getStoreProducts();
  return (
    <>
      <section className="bg-[var(--color-soft)] py-16 text-center">
        <div className="container px-6">
          <h1 className="text-4xl md:text-5xl">Customer reviews</h1>
          <p className="mt-3 text-[var(--color-muted)]">Honest reviews from our customers. Buyers we can match to an order are marked as verified.</p>
        </div>
      </section>
      <ReviewsModule productOptions={products.map((p) => ({ slug: p.slug, name: p.name }))} />
      <TrustSection />
    </>
  );
}
