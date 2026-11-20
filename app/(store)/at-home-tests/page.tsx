import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Droplet, Flower2, Activity, HeartPulse, Brain, User, PawPrint } from 'lucide-react';
import { TEST_CATEGORY_LIST, TEST_KITS, type TestCategoryId } from '@/lib/tests';
import { TestsWaitlist } from '@/components/tests/TestsWaitlist';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'At-Home Health Tests: Iron, Hormones, Thyroid | Noovit',
  description: 'At-home test kits are coming: iron and nutrients, perimenopause hormones, thyroid, cholesterol, A1c, cortisol and pet checks. Join the waitlist.',
  alternates: { canonical: '/at-home-tests' },
};

const ICONS: Record<TestCategoryId, typeof Droplet> = { nutrients: Droplet, womens: Flower2, thyroid: Activity, heart: HeartPulse, stress: Brain, mens: User, pets: PawPrint };

export default function TestsPage() {
  return (
    <>
      <JsonLd data={pageLd({ path: '/at-home-tests', name: 'At-home health tests', description: metadata.description ?? undefined, crumbs: [['At-home tests', '/at-home-tests']], items: TEST_KITS.map((k) => ({ name: k.name, path: `/at-home-tests/${k.slug}` })) })} />
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

      {/* One grid of every kit, each tagged with its category (owner, 20 Nov: tighter than one section per category). */}
      <section className="section">
        <div className="container px-6">
          <nav aria-label="Categories" className="mb-8 flex flex-wrap gap-2">
            {TEST_CATEGORY_LIST.map((c) => (
              <span key={c.id} className={`rounded-full px-4 py-2 text-sm font-semibold ${c.id === 'pets' ? 'bg-[var(--color-pets-soft)] text-[var(--color-pets-dark)]' : 'bg-[var(--color-soft)] text-[var(--color-navy)]'}`}>{c.name}</span>
            ))}
          </nav>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEST_KITS.map((k) => {
              const c = TEST_CATEGORY_LIST.find((x) => x.id === k.category)!;
              const Icon = ICONS[k.category];
              return (
                <Link key={k.slug} href={`/at-home-tests/${k.slug}`} className={`group flex flex-col rounded-3xl border p-6 transition hover:border-[var(--color-navy)] ${k.pets ? 'border-[var(--color-pets-soft)] bg-[var(--color-pets-soft)]/40' : 'border-[var(--color-line)] bg-white'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${k.pets ? 'bg-[var(--color-pets)]' : 'bg-[var(--color-navy)] text-white'}`}><Icon className="h-4 w-4" /></span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{c.name}</span>
                  </div>
                  <h2 className="mt-4 text-xl">{k.name}</h2>
                  <p className="mt-2 flex-1 text-sm text-[var(--color-ink)]/80">{k.short}</p>
                  <p className="mt-4 text-xs text-[var(--color-muted)]">Coming soon · {k.markers.length} {k.markers.length === 1 ? 'marker' : 'markers'} · {k.collection}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-navy)]">See what it measures <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <p className="container px-6 pb-10 pt-4 text-center text-xs text-[var(--color-muted)]">
        At-home tests are wellness screens, not a diagnosis. Results outside the normal range should always be discussed with a doctor (or, for pets, your vet).
      </p>
    </>
  );
}
