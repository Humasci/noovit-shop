import type { Metadata } from 'next';
import { REVIEWS } from '@/data/content';
import { products } from '@/data/products';
import { Stars } from '@/components/ui/Stars';
import { ReviewsModule } from '@/components/reviews/ReviewsModule';
import { CommunitySection, TrustSection } from '@/components/sections/Sections';

export const metadata: Metadata = { title: 'Reviews — Noovit' };

export default function ReviewsPage() {
  const total = products.reduce((sum, p) => sum + p.reviewCount, 0);
  return (
    <>
      <section className="bg-[var(--color-soft)] py-16 text-center">
        <div className="container px-6">
          <Stars size={24} className="justify-center" />
          <h1 className="mt-4 text-4xl md:text-5xl">Loved by {total.toLocaleString()}+ customers</h1>
          <p className="mt-3 text-[var(--color-muted)]">Honest reviews from verified buyers.</p>
        </div>
      </section>
      <ReviewsModule reviews={REVIEWS} total={total} />
      <CommunitySection />
      <TrustSection />
    </>
  );
}
