import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Droplet, Flower2, Activity, HeartPulse, Brain, User, PawPrint, FlaskConical, ShieldCheck } from 'lucide-react';
import { TEST_CATEGORY_LIST, TEST_KITS, type TestCategoryId } from '@/lib/tests';
import { TestsWaitlist } from '@/components/tests/TestsWaitlist';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';
import { MosaicField } from '@/components/brand/MosaicField';
import { existsSync } from 'fs';
import path from 'path';

// Hero photo (owner's kit-box render, 21 Nov): shown once public/images/tests/hero-kits.jpg exists.
const HERO = '/images/tests/hero-kits.jpg';
const hasHero = () => existsSync(path.join(process.cwd(), 'public', HERO));

export const metadata: Metadata = {
  title: 'At-Home Health Tests: Iron, Hormones, Thyroid | Noovit',
  description: 'At-home test kits are coming: iron and nutrients, perimenopause hormones, thyroid, cholesterol, A1c, cortisol and more. Join the waitlist.',
  alternates: { canonical: '/at-home-tests' },
};

const ICONS: Record<TestCategoryId, typeof Droplet> = { nutrients: Droplet, womens: Flower2, thyroid: Activity, heart: HeartPulse, organs: FlaskConical, stress: Brain, mens: User, sexual: ShieldCheck, pets: PawPrint };

// Human kits only, grouped by category (owner, 21 Nov). Pet kits live on /pets; a link at the end points there.
const HUMAN = TEST_KITS.filter((k) => !k.pets);
const GROUPS = TEST_CATEGORY_LIST.filter((c) => c.id !== 'pets').map((c) => ({ ...c, kits: HUMAN.filter((k) => k.category === c.id) })).filter((g) => g.kits.length);

export default function TestsPage() {
  return (
    <>
      <JsonLd data={pageLd({ path: '/at-home-tests', name: 'At-home health tests', description: metadata.description ?? undefined, crumbs: [['At-home tests', '/at-home-tests']], items: HUMAN.map((k) => ({ name: k.name, path: `/at-home-tests/${k.slug}` })) })} />
      <section className="relative overflow-hidden bg-[var(--studio)]">
        {/* mosaic tiles breaking out of the top-right corner (brand cross tiles) */}
        {!hasHero() && <MosaicField cols={20} rows={12} tile={16} gap={4} anchor="top-right" maxOpacity={0.75} className="pointer-events-none absolute right-0 top-0 hidden md:block" />}
        <div className={`container relative grid gap-10 px-6 py-14 md:py-20 ${hasHero() ? 'lg:grid-cols-[1fr_1.15fr] lg:items-center' : ''}`}>
          <div>
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
          {hasHero() && (
            <div className="relative">
              <img src={HERO} alt="Noovit at-home test kit boxes on a stone table (concept)" width={1800} height={1004} className="w-full rounded-3xl object-cover shadow-[0_20px_40px_-24px_rgba(20,33,61,0.35)]" />
              <MosaicField cols={6} rows={5} tile={10} gap={3} anchor="top-right" maxOpacity={0.9} className="pointer-events-none absolute -right-3 -top-3" />
            </div>
          )}
        </div>
      </section>

      {/* Grouped by category, with jump links (owner, 21 Nov; was one mixed grid). */}
      <section className="section">
        <div className="container px-6">
          <nav aria-label="Categories" className="sticky top-[4.25rem] z-10 -mx-6 mb-10 flex gap-2 overflow-x-auto bg-white/95 px-6 py-3 backdrop-blur">
            {GROUPS.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="shrink-0 rounded-full bg-[var(--color-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] hover:bg-[var(--color-navy)] hover:text-white">{g.name}</a>
            ))}
          </nav>
          <div className="space-y-14">
            {GROUPS.map((g) => {
              const Icon = ICONS[g.id];
              return (
                <div key={g.id} id={g.id} className="scroll-mt-36">
                  <div className="flex items-center gap-3 border-b border-[var(--color-line)] pb-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-navy)] text-white"><Icon className="h-4 w-4" /></span>
                    <h2 className="text-2xl md:text-3xl">{g.name}</h2>
                    <span className="ml-auto text-sm text-[var(--color-muted)]">{g.kits.length} {g.kits.length === 1 ? 'kit' : 'kits'}</span>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {g.kits.map((k) => (
                      <KitLink key={k.slug} sensitive={k.sensitive} href={`/at-home-tests/${k.slug}`} className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-line)] bg-white p-6 transition hover:border-[var(--color-navy)]">
                        <MosaicField cols={6} rows={5} tile={10} gap={3} anchor="top-right" color="var(--color-navy)" maxOpacity={0.55} animate={false} seed={k.slug.length} className="pointer-events-none absolute right-0 top-0 transition-opacity duration-300 group-hover:opacity-0" />
                        <MosaicField cols={6} rows={5} tile={10} gap={3} anchor="top-right" maxOpacity={0.95} animate={false} seed={k.slug.length} className="pointer-events-none absolute right-0 top-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <h3 className="pr-16 text-xl">{k.name}</h3>
                        <p className="mt-2 flex-1 text-sm text-[var(--color-ink)]/80">{k.short}</p>
                        <p className="mt-4 text-xs text-[var(--color-muted)]">Coming soon · {k.markers.length} {k.markers.length === 1 ? 'marker' : 'markers'} · {k.collection}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-navy)]">See what it measures <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                      </KitLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pet kits are not shown here; one quiet link to Noovit Pets instead. */}
          <Link href="/pets" className="mt-16 flex items-center justify-between gap-4 rounded-3xl bg-[var(--color-pets-soft)] px-6 py-5 text-[var(--color-pets-dark)] hover:brightness-[0.98]">
            <span className="flex items-center gap-3 font-semibold"><PawPrint className="h-5 w-5" /> Testing for your dog or cat? Pet kits are on Noovit Pets.</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <p className="container px-6 pb-10 pt-4 text-center text-xs text-[var(--color-muted)]">
        At-home tests are wellness screens, not a diagnosis. Results outside the normal range should always be discussed with a doctor.
      </p>
    </>
  );
}

// Privacy-sensitive kits open with a full page load (plain <a>), so analytics tags from this page don't carry over.
function KitLink({ sensitive, ...props }: React.ComponentProps<typeof Link> & { sensitive?: boolean }) {
  return sensitive ? <a {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)} href={String(props.href)} /> : <Link {...props} />;
}
