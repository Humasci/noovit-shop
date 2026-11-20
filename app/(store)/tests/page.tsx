import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Droplet, Flower2, Activity, HeartPulse, Brain, User, PawPrint } from 'lucide-react';
import { TEST_CATEGORY_LIST, kitsIn, type TestCategoryId } from '@/lib/tests';
import { TestsWaitlist } from '@/components/tests/TestsWaitlist';

export const metadata: Metadata = {
  title: 'At-Home Health Tests: Iron, Hormones, Thyroid, Cholesterol | Noovit',
  description: 'At-home test kits are coming to Noovit: iron and nutrients, perimenopause hormones, thyroid, heart and metabolic, cortisol, and checks for pets. Join the waitlist.',
  alternates: { canonical: '/tests' },
};

const ICONS: Record<TestCategoryId, typeof Droplet> = { nutrients: Droplet, womens: Flower2, thyroid: Activity, heart: HeartPulse, stress: Brain, mens: User, pets: PawPrint };

export default function TestsPage() {
  return (
    <>
      <section className="bg-[var(--studio)]">
        <div className="container px-6 py-14 md:py-20">
          <nav className="mb-4 text-xs text-[var(--color-muted)]">
            <Link href="/">Home</Link> / <span className="text-[var(--color-ink)]">At-home tests</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-navy)]/70">Coming soon</p>
          <h1 className="mt-3 max-w-2xl text-balance text-4xl text-[var(--color-navy)] md:text-5xl">At-home health tests</h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--color-ink)]/80">
            Know your numbers, then choose what helps. Simple kits you collect at home, processed by a certified US lab and reviewed by a licensed physician. Launching with our lab partners soon.
          </p>
          <TestsWaitlist />
        </div>
      </section>

      {TEST_CATEGORY_LIST.map((c, i) => {
        const Icon = ICONS[c.id];
        return (
          <section key={c.id} id={c.id} className={`section scroll-mt-24 ${i % 2 ? 'bg-[var(--color-soft)]' : ''}`}>
            <div className="container px-6">
              <div className="mb-6 flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full ${c.id === 'pets' ? 'bg-[var(--color-pets)]' : 'bg-[var(--color-navy)] text-white'}`}><Icon className="h-5 w-5" /></span>
                <div>
                  <h2 className="text-2xl md:text-3xl">{c.name}</h2>
                  <p className="text-[var(--color-muted)]">{c.line}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {kitsIn(c.id).map((k) => (
                  <Link key={k.slug} href={`/tests/${k.slug}`} className="group flex flex-col rounded-3xl border border-[var(--color-line)] bg-white p-6 transition hover:border-[var(--color-navy)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Coming soon · {k.markers.length} {k.markers.length === 1 ? 'marker' : 'markers'}</p>
                    <h3 className="mt-2 text-xl">{k.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-[var(--color-ink)]/80">{k.short}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-navy)]">See what it measures <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <p className="container px-6 pb-10 pt-4 text-center text-xs text-[var(--color-muted)]">
        At-home tests are wellness screens, not a diagnosis. Results outside the normal range should always be discussed with a doctor (or, for pets, your vet).
      </p>
    </>
  );
}
