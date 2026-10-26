import Link from 'next/link';
import type { Metadata } from 'next';
import { IMAGES } from '@/data/content';
import { TrustSection, ReviewsSection, SubscriptionPerks, SectionHeading } from '@/components/sections/Sections';

export const metadata: Metadata = { title: 'About Us — Noovit' };

const STATS = [
  { value: '18', label: 'Targeted formulas' },
  { value: '100%', label: 'Third-party tested' },
  { value: '90', label: 'Day guarantee' },
  { value: '4.8★', label: 'Average rating' },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img src={IMAGES.support} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[var(--color-navy)]/70" />
        <div className="container relative px-6 py-28 text-center text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#93c5fd]">About Noovit</p>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl text-white md:text-6xl">Supplements you can actually understand.</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
            We started Noovit because the supplement aisle was full of proprietary blends, underdosed formulas and confusing labels.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid items-center gap-12 px-6 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our story" title="Built with nutritionists, not marketers" center={false} />
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
      <ReviewsSection />
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
