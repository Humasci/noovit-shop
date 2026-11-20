import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Check } from 'lucide-react';
import { TEST_KITS, findKit } from '@/lib/tests';
import { TestsWaitlist } from '@/components/tests/TestsWaitlist';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';

export function generateStaticParams() {
  return TEST_KITS.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const k = findKit((await params).slug);
  if (!k) return { title: 'Page not found | Noovit', robots: { index: false } };
  return { title: k.seoTitle, description: k.seoDescription, alternates: { canonical: `/at-home-tests/${k.slug}` } };
}

export default async function TestKitPage({ params }: { params: Promise<{ slug: string }> }) {
  const k = findKit((await params).slug);
  if (!k) notFound();
  const steps = k.pets
    ? ['Order your kit; it ships free.', 'Collect a sample at home in minutes.', 'Read the result, or get it from our testing partner, and share it with your vet.']
    : ['Order your kit; it ships free with a prepaid return.', 'Collect a small finger-prick sample at home and post it back.', 'Results arrive online, reviewed by an independent licensed physician.'];
  return (
    <>
      <JsonLd data={pageLd({ path: `/at-home-tests/${k.slug}`, name: k.name, description: k.seoDescription, crumbs: [[k.pets ? 'Noovit Pets' : 'At-home tests', k.pets ? '/pets' : '/at-home-tests'], [k.name, `/at-home-tests/${k.slug}`]] })} />
      <section className={k.pets ? 'bg-[var(--color-pets-soft)]' : 'bg-[var(--studio)]'}>
        <div className="container px-6 py-14 md:py-20">
          <nav className="mb-4 text-xs text-[var(--color-muted)]">
            <Link href="/">Home</Link> / <Link href="/at-home-tests">At-home tests</Link> / <span className="text-[var(--color-ink)]">{k.name}</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-navy)]/70">Coming soon</p>
          <h1 className="mt-3 max-w-2xl text-balance text-4xl text-[var(--color-navy)] md:text-5xl">{k.name}</h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--color-ink)]/80">{k.intro}</p>
          <p className="mt-3 text-sm font-semibold text-[var(--color-navy)]">{k.collection}</p>
          <p className="mt-6 max-w-xl text-[var(--color-ink)]/80">We&apos;re finalizing our {k.pets ? 'testing partners' : 'US lab partner'}. Join the list and we&apos;ll email you when it&apos;s ready.</p>
          <TestsWaitlist kit={k.slug} />
        </div>
      </section>
      {k.figure && (
        <figure className="bg-[#05061a]">
          <img src={k.figure.src} alt={k.figure.alt} width={1600} height={900} className="mx-auto block h-auto w-full max-w-[1600px]" loading="lazy" />
          {k.figure.caption && <figcaption className="container px-6 pb-6 pt-2 text-center text-xs text-[#D9DFF5]/70">{k.figure.caption}</figcaption>}
        </figure>
      )}

      <section className="section">
        <div className="container max-w-5xl px-6">
          <h2 className="text-3xl md:text-4xl">What it measures, and its limits</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {k.markers.map((mk) => (
              <div key={mk.name} className="rounded-3xl bg-[var(--color-soft)] p-6">
                <p className="font-display text-xl text-[var(--color-navy)]">{mk.name}</p>
                <p className="mt-2 text-[var(--color-ink)]/85">{mk.why}</p>
                <p className="mt-3 text-sm text-[var(--color-muted)]"><span className="font-semibold">Good to know:</span> {mk.note}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-14 text-3xl md:text-4xl">How it will work</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s} className="rounded-3xl border border-[var(--color-line)] p-6">
                <p className="font-display text-4xl text-[var(--color-navy)]">{i + 1}</p>
                <p className="mt-2">{s}</p>
              </li>
            ))}
          </ol>

          <ul className="mt-10 space-y-2 text-sm text-[var(--color-ink)]/85">
            {(k.pets
              ? ['A screening tool, not a diagnosis.', 'Any result outside the range, or any symptoms, means a call to your vet.']
              : ['A wellness screen, not a diagnosis. Results outside the normal range should always be discussed with a doctor.', 'For adults 18+. Availability may vary by state.', 'Your results stay with our lab partner; we never use them for advertising.']
            ).map((t) => (
              <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" /> {t}</li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/at-home-tests" className="btn btn-outline">All at-home tests</Link>
            {k.related?.map((r) => (
              <Link key={r.href} href={r.href} className="btn btn-outline inline-flex items-center gap-1">{r.label} <ArrowRight className="h-4 w-4" /></Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
