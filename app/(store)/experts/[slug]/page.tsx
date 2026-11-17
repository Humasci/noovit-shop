import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ADVISORS } from '@/data/content';
import { GUIDES } from '@/lib/guides';
import { expertBySlug, fmtReviewDate, leadReviewer } from '@/lib/experts';
import { REVIEW_LOG } from '@/data/content';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/site';

// Advisor profile (E-E-A-T): who reviews our content, their real credential and where to check it, what they have
// reviewed. Only advisors with a slug in data/content.ts (ADVISORS) get a page.
export function generateStaticParams() {
  return ADVISORS.filter((a) => a.slug).map((a) => ({ slug: a.slug! }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = expertBySlug((await params).slug);
  if (!e) return {};
  return { title: `${e.name}, ${e.credentials} — Noovit`, description: e.bio?.slice(0, 155), alternates: { canonical: `/experts/${e.slug}` } };
}

export default async function ExpertPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = expertBySlug((await params).slug);
  if (!e) notFound();
  const isLead = leadReviewer()?.slug === e.slug;
  const reviewed = isLead
    ? Object.entries(REVIEW_LOG)
        .filter(([k]) => k.startsWith('guide:'))
        .map(([k, date]) => ({ guide: GUIDES.find((g) => g.slug === k.slice(6)), date }))
        .filter((r) => r.guide)
    : [];
  return (
    <article className="container max-w-3xl px-6 py-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: e.name,
          jobTitle: e.title ?? 'Nutrition advisor',
          description: e.bio,
          image: e.photo ? `${SITE_URL}${e.photo}` : undefined,
          sameAs: e.profileUrl ? [e.profileUrl] : undefined,
          hasCredential: { '@type': 'EducationalOccupationalCredential', name: e.credentials },
          url: `${SITE_URL}/experts/${e.slug}`,
        }}
      />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">{e.title ?? 'Nutrition advisor'}</p>
      <div className="mt-4 flex items-center gap-5">
        {e.photo ? (
          <img src={e.photo} alt={e.name} className="h-24 w-24 rounded-full object-cover" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-navy)] text-3xl font-bold text-white">{e.name[0]}</div>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl">{e.name}</h1>
          <p className="mt-1 font-semibold text-[var(--color-accent)]">{e.credentials}</p>
        </div>
      </div>
      {e.bio && <p className="mt-8 text-lg text-[var(--color-ink)]">{e.bio}</p>}
      {e.registration && <p className="mt-4 text-sm text-[var(--color-muted)]">Registration: {e.registration}</p>}
      {e.profileUrl && (
        <p className="mt-1 text-sm">
          <a href={e.profileUrl} className="text-[var(--color-accent)] underline" rel="noopener" target="_blank">Professional profile</a>
        </p>
      )}
      <section className="mt-10 rounded-3xl bg-[var(--color-soft)] p-6 text-sm">
        <h2 className="text-lg">What {e.name.split(' ')[0]} does for Noovit</h2>
        <p className="mt-2 text-[var(--color-muted)]">
          Reviews our ingredient guides and Journal articles for scientific accuracy, safety and clear wording before they go live.
          Reviewing content is not an endorsement of any product, and doesn&apos;t replace advice from your own healthcare provider.
        </p>
      </section>
      {reviewed.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl">Guides reviewed</h2>
          <ul className="mt-3 divide-y divide-[var(--color-line)] text-sm">
            {reviewed.map((r) => (
              <li key={r.guide!.slug} className="flex justify-between py-2">
                <Link href={`/guides/${r.guide!.slug}`} className="font-semibold hover:underline">{r.guide!.ingredient}</Link>
                <span className="text-[var(--color-muted)]">{fmtReviewDate(r.date)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
