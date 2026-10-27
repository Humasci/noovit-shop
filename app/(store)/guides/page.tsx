import Link from 'next/link';
import type { Metadata } from 'next';
import { GUIDES } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Supplement Guides — Benefits, Dosage & Side Effects | Noovit',
  description: 'Plain-English, evidence-graded guides to supplements: what they are, what the research says, how much to take, side effects and interactions.',
  alternates: { canonical: '/guides' },
};

export default function GuidesIndex() {
  return (
    <>
      <section className="bg-[var(--color-soft)] py-16">
        <div className="container px-6">
          <h1 className="text-4xl md:text-5xl">Supplement guides</h1>
          <p className="mt-3 max-w-2xl text-[var(--color-muted)]">
            What each ingredient is, what the research actually shows, how much to take, and who should avoid it. Every claim is graded and sourced.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container grid gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
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
