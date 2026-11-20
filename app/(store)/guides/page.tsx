import Link from 'next/link';
import type { Metadata } from 'next';
import { GUIDES } from '@/lib/guides';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';
import { siteLive } from '@/lib/launch';
import { PUBLIC_EARLY_GUIDES } from '@/lib/public-early';

export const metadata: Metadata = {
  title: 'Supplement Guides: Benefits, Dosage, Side Effects | Noovit',
  description: 'Plain-English, evidence-graded guides to supplements: what they are, what the research says, how much to take, side effects and interactions.',
  alternates: { canonical: '/guides' },
};

export default function GuidesIndex() {
  // Pre-launch the index lists only the guides that are public early (the rest would open the coming-soon page).
  const guides = siteLive() ? GUIDES : GUIDES.filter((g) => PUBLIC_EARLY_GUIDES.includes(g.slug));
  return (
    <>
      <JsonLd data={pageLd({ path: '/guides', name: 'Supplement guides', crumbs: [['Guides', '/guides']], items: guides.map((g) => ({ name: g.ingredient, path: `/guides/${g.slug}` })) })} />
      <section className="relative overflow-hidden bg-[var(--color-soft)] py-20">
        <div className="container relative px-6">
          <h1 className="text-4xl md:text-5xl">Supplement guides</h1>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            What each ingredient is, what the research actually shows, how much to take, and who should avoid it. Every claim is graded and sourced.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="rounded-2xl border border-[var(--color-line)] p-6 hover:border-[var(--color-navy)]">
              <h2 className="text-xl">{g.ingredient}</h2>
              <p className="mt-1 text-sm font-semibold text-[var(--color-accent)]">Benefits, dosage & side effects</p>
              <p className="mt-3 line-clamp-3 text-sm text-[var(--color-muted)]">{g.summary.replace(/\s*\[\d+\]/g, '')}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
