import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Check } from 'lucide-react';
import { TEST_KITS, findKit, categoryColor } from '@/lib/tests';
import { TestsWaitlist } from '@/components/tests/TestsWaitlist';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';
import { Reveal } from '@/components/ui/Reveal';
import { MosaicField } from '@/components/brand/MosaicField';
import { getStoreProducts } from '@/lib/catalog/server';
import { ProductCard } from '@/components/product/ProductCard';
import { KIT_PAIR_NOTE, supplementsForKit } from '@/lib/test-pairings';

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
  const catalog = await getStoreProducts();
  const pairs = supplementsForKit(k.slug).map((s) => catalog.find((p) => p.slug === s && p.status === 'active')).filter((p) => p !== undefined);
  const steps = k.pets
    ? ['Order your kit; it ships free.', 'Collect a sample at home in minutes.', 'Read the result, or get it from our testing partner, and share it with your vet.']
    : ['Order your kit; it ships free with a prepaid return.', `Collect your sample at home (${k.collection.replace(/, at home$/, '').toLowerCase()}) and post it back.`, 'Your results arrive online. Details on lab processing and physician review come at launch.'];
  return (
    <>
      <JsonLd data={pageLd({ path: `/at-home-tests/${k.slug}`, name: k.name, description: k.seoDescription, crumbs: [[k.pets ? 'Noovit Pets' : 'At-home tests', k.pets ? '/pets' : '/at-home-tests'], [k.name, `/at-home-tests/${k.slug}`]] })} />
      {/* Hero (21 Nov redesign): intro + waitlist on the left, the "test panel" file card on the right (same file
          language as the evidence-file guides and stack folders). */}
      <section className={k.pets ? 'bg-[var(--color-pets-soft)]' : 'bg-[var(--studio)]'}>
        <div className="container grid gap-10 px-6 py-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:items-start lg:gap-14">
          <div>
            <nav className="mb-5 text-xs text-[var(--color-muted)]">
              <Link href="/">Home</Link> / <Link href={k.pets ? '/pets' : '/at-home-tests'}>{k.pets ? 'Noovit Pets' : 'At-home tests'}</Link> / <span className="text-[var(--color-ink)]">{k.name}</span>
            </nav>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-navy)]">Coming soon</span>
            <h1 className="mt-4 max-w-2xl text-balance text-4xl text-[var(--color-navy)] md:text-5xl">{k.name}</h1>
            <p className="mt-4 max-w-xl text-lg text-[var(--color-ink)]/80">{k.intro}</p>
            <p className="mt-6 max-w-xl text-[var(--color-ink)]/80">We&apos;re finalizing our {k.pets ? 'testing partners' : 'US lab partner'}. Join the list and we&apos;ll email you when it&apos;s ready.</p>
            <TestsWaitlist kit={k.slug} />
          </div>
          <div className="relative pt-8">
            <div className="absolute left-0 top-0 flex h-9 items-center rounded-t-2xl px-5 text-[11px] font-semibold uppercase tracking-wider text-white" style={{ background: categoryColor(k.category) }}>Test panel</div>
            <div className="relative overflow-hidden rounded-3xl rounded-tl-none border border-[var(--color-line)] bg-white p-6 shadow-[0_8px_24px_-12px_rgba(20,33,61,0.18)] sm:p-8">
              <MosaicField cols={7} rows={5} tile={9} gap={3} anchor="top-right" color={categoryColor(k.category)} density={2} floor={0.4} maxOpacity={0.95} className="pointer-events-none absolute right-0 top-0" />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">What it measures</p>
              <ol className="mt-3 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
                {k.markers.map((mk, i) => (
                  <li key={mk.name} className="flex items-baseline gap-3 py-3">
                    <span className="w-6 shrink-0 text-xs tabular-nums text-[var(--color-muted)]">{String(i + 1).padStart(2, '0')}</span>
                    <a href={`#marker-${i + 1}`} className="font-semibold text-[var(--color-navy)] hover:text-[var(--color-accent)]">{mk.name}</a>
                  </li>
                ))}
              </ol>
              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Sample</dt><dd className="mt-1 font-semibold">{k.collection}</dd></div>
                <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Results</dt><dd className="mt-1 font-semibold">{k.pets ? 'Read at home, to share with your vet' : 'Online (details at launch)'}</dd></div>
                <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Shipping</dt><dd className="mt-1 font-semibold">{k.pets ? 'Free' : 'Free, with a prepaid return'}</dd></div>
                <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Who it&apos;s for</dt><dd className="mt-1 font-semibold">{k.pets ? 'Dogs and cats' : 'Adults 18+'}</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>
      {k.figure && (
        <figure className="bg-[#05061a]">
          <img src={k.figure.src} alt={k.figure.alt} width={1600} height={k.figure.height ?? 700} className="mx-auto block h-auto w-full max-w-[1600px]" loading="lazy" />
          {k.figure.caption && <figcaption className="container px-6 pb-6 pt-2 text-center text-xs text-[#D9DFF5]/70">{k.figure.caption}</figcaption>}
        </figure>
      )}

      <section className="section bg-[var(--color-soft)]">
        <div className="container max-w-5xl px-6">
          <h2 className="text-3xl md:text-4xl">What it measures, and its limits</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {k.markers.map((mk, i) => (
              <Reveal key={mk.name} id={`marker-${i + 1}`} className="scroll-mt-28 rounded-3xl border border-[var(--color-line)] bg-white p-6 shadow-[0_1px_2px_rgba(20,33,61,0.04),0_8px_24px_-12px_rgba(20,33,61,0.12)]">
                <span className="rounded-md bg-[var(--color-navy)] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-3 font-display text-xl text-[var(--color-navy)]">{mk.name}</p>
                <p className="mt-2 text-[var(--color-ink)]/85">{mk.why}</p>
                <p className="mt-3 border-t border-dashed border-[var(--color-line)] pt-3 text-sm text-[var(--color-muted)]"><span className="font-semibold">Good to know:</span> {mk.note}</p>
              </Reveal>
            ))}
          </div>

          <h2 className="mt-14 text-3xl md:text-4xl">How it will work</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s} className="rounded-3xl border border-[var(--color-line)] bg-white p-6">
                <p className="font-display text-4xl text-[var(--color-navy)]">{String(i + 1).padStart(2, '0')}</p>
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

          {pairs.length > 0 && (
            <div className="mt-14">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Test, then choose</p>
              <h2 className="mt-2 text-3xl md:text-4xl">Supplements people pair with this test</h2>
              <p className="mt-3 max-w-2xl text-[var(--color-ink)]/80">{KIT_PAIR_NOTE[k.slug]}</p>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                {pairs.map((p) => <ProductCard key={p.id} product={p} hideForHer />)}
              </div>
              <p className="mt-4 text-xs text-[var(--color-muted)]">A test result is a snapshot, not a diagnosis. If yours is out of range, or you take medication, talk to your doctor before starting a supplement.</p>
            </div>
          )}

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
