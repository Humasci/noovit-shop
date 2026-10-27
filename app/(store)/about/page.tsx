import Link from 'next/link';
import type { Metadata } from 'next';
import { IMAGES } from '@/data/content';
import { humanProducts } from '@/data/products';
import { getStoreProducts } from '@/lib/catalog/server';
import { TrustSection, ReviewsSection, SubscriptionPerks, SectionHeading } from '@/components/sections/Sections';
import { latestReviews } from '@/lib/reviews';
import { getSettings, placeholdersOn } from '@/lib/settings';
import { PLACEHOLDER_REVIEWS } from '@/data/placeholders';

export const metadata: Metadata = {
  title: 'About Noovit — Clean, Evidence-Based Supplements',
  description: 'Why we started Noovit: simple, well-dosed supplements with clear labels, free US shipping and subscriptions you can cancel anytime.',
  alternates: { canonical: '/about' },
};

const stats = (formulas: number) => [
  { value: String(formulas), label: 'Targeted formulas' },
  { value: 'Free', label: 'US shipping' },
  { value: '90', label: 'Day guarantee' },
  { value: '0', label: 'Fees to cancel' },
];

export default async function AboutPage() {
  const STATS = stats(humanProducts(await getStoreProducts()).length);
  const real = await latestReviews(12);
  const placeholder = !real.length && placeholdersOn(await getSettings());
  const reviewProps = { reviews: placeholder ? PLACEHOLDER_REVIEWS : real, placeholder };
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={IMAGES.support} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[var(--color-navy)]/70" />
        <div className="container relative px-6 py-28 text-center text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-light)]">About Noovit</p>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl text-white md:text-6xl">Supplements you can actually understand.</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
            We started Noovit because the supplement aisle was full of proprietary blends, underdosed formulas and confusing labels.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our story" title="Built on evidence, not marketing" center={false} />
            <div className="space-y-4 text-[var(--color-muted)]">
              <p>Every Noovit formula starts with the research: which forms absorb best, which doses were actually studied, and what can be left out.</p>
              <p>We work with qualified nutrition professionals to design each product, manufacture in GMP-certified US facilities, and send every batch to independent labs for purity and potency testing.</p>
              <p>The result is a focused range of supplements with clear labels, honest claims and a 90-day guarantee behind them.</p>
            </div>
          </div>
          <img src={IMAGES.nutrition} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover" />
        </div>
      </section>

      <section className="bg-[var(--color-navy)] py-14 text-white">
        <div className="container grid grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold">{s.value}</p>
              <p className="mt-1 text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <TrustSection />
      <ReviewsSection {...reviewProps} />
      <SubscriptionPerks />

      <section className="section text-center">
        <div className="container px-6">
          <h2 className="text-3xl md:text-4xl">Ready to build your routine?</h2>
          <Link href="/shop" className="btn btn-primary mt-6">Shop All</Link>
        </div>
      </section>
    </>
  );
}
