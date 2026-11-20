import Link from 'next/link';
import type { Metadata } from 'next';
import { humanProducts } from '@/data/products';
import { getStoreProducts } from '@/lib/catalog/server';
import { TrustSection, ReviewsSection, SubscriptionPerks, SectionHeading } from '@/components/sections/Sections';
import { latestReviews } from '@/lib/reviews';
import { getSettings, placeholdersOn } from '@/lib/settings';
import { PLACEHOLDER_REVIEWS } from '@/data/placeholders';
import { ADVISORS } from '@/data/content';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'About Noovit: Evidence-Led Supplements, Clear Doses',
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
      <JsonLd data={pageLd({ path: '/about', name: 'About Noovit', type: 'AboutPage', crumbs: [['About', '/about']] })} />
      <section className="relative overflow-hidden bg-[var(--color-navy)]">
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
              <p>We choose every product from the research: which forms are well studied, what doses trials used, and how our dose compares.</p>
              <p>We pick each formula from what the research supports, list every ingredient and amount on the label, and will publish lab test results as we receive them.</p>
              <p>The result is a focused range of supplements with clear labels, honest claims and a 90-day guarantee behind them.</p>
            </div>
          </div>
          <img src="/images/lineup-5.png?v=4" alt="The Noovit core range" className="aspect-[4/3] w-full rounded-3xl bg-[var(--studio)] object-cover" />
        </div>
      </section>

      <section className="bg-[#141A4D] py-14 text-white">
        <div className="container grid grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold">{s.value}</p>
              <p className="mt-1 text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {ADVISORS.length > 0 && (
        <section className="section">
          <div className="container max-w-3xl px-6">
            <SectionHeading eyebrow="Expert reviewed" title="Who checks our content" />
            <div className="grid gap-4 sm:grid-cols-2">
              {ADVISORS.map((e) => (
                <Link key={e.name} href={e.slug ? `/experts/${e.slug}` : '#'} className="flex gap-4 rounded-2xl bg-[var(--color-soft)] p-5">
                  {e.photo ? <img src={e.photo} alt="" className="h-14 w-14 rounded-full object-cover" /> : <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-lg font-bold text-white">{e.name[0]}</div>}
                  <div>
                    <p className="font-bold">{e.name}</p>
                    <p className="text-xs font-semibold text-[var(--color-accent)]">{e.credentials}</p>
                    {e.bio && <p className="mt-2 line-clamp-3 text-sm text-[var(--color-muted)]">{e.bio}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
