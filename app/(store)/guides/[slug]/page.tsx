import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import { ChevronDown } from 'lucide-react';
import { GUIDES, findGuide, Evidence } from '@/lib/guides';
import { findGoal } from '@/lib/goals';
import { getStoreProducts } from '@/lib/catalog/server';
import { getSettings, placeholdersOn } from '@/lib/settings';
import { SITE_URL } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { ProductCard } from '@/components/product/ProductCard';
import { PlaceholderNote } from '@/components/ui/Placeholder';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = findGuide((await params).slug);
  if (!g) return {};
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { type: 'article', title: g.metaTitle, description: g.metaDescription, url: `/guides/${g.slug}`, siteName: 'Noovit', locale: 'en_US' },
  };
}

// "…text [1][2]" → text with superscript links to the numbered sources at the bottom.
function Cited({ text }: { text: string }) {
  const parts = text.split(/\s*(\[\d+\])/);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[(\d+)\]$/);
        return m ? (
          <sup key={i}>
            <a href={`#source-${m[1]}`} className="px-0.5 text-[var(--color-accent)] no-underline hover:underline" aria-label={`Source ${m[1]}`}>
              [{m[1]}]
            </a>
          </sup>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        );
      })}
    </>
  );
}

const plain = (text: string) => text.replace(/\s*\[\d+\]/g, '');

const EVIDENCE_STYLE: Record<Evidence, string> = {
  Moderate: 'bg-[var(--color-accent)] text-white',
  Limited: 'bg-[var(--color-soft)] text-[var(--color-accent-dark)]',
  Early: 'bg-[var(--color-pets-soft)] text-[var(--color-pets-dark)]',
  Insufficient: 'bg-gray-100 text-gray-700',
};

const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const SECTIONS = [
  ['what-is', 'What is it?'],
  ['benefits', 'Benefits & evidence'],
  ['dosage', 'Dosage'],
  ['side-effects', 'Side effects'],
  ['interactions', 'Interactions'],
  ['avoid', 'Who should avoid it'],
  ['choose', 'How to choose a supplement'],
  ['faq', 'FAQ'],
  ['sources', 'Sources'],
] as const;
// Topic guides' custom headings also label the table of contents.
const TOC_KEYS: Record<string, string> = { 'what-is': 'what', benefits: 'benefits', dosage: 'dosage', 'side-effects': 'sideEffects', interactions: 'interactions', avoid: 'avoid', choose: 'choose', faq: 'faq' };

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = findGuide((await params).slug);
  if (!g) notFound();
  const [products, settings] = await Promise.all([getStoreProducts(), getSettings()]);
  const related = g.relatedProducts.map((s) => products.find((p) => p.slug === s && p.status === 'active')).filter((p) => p !== undefined);
  const goals = g.relatedGoals.map(findGoal).filter((x) => x !== undefined);
  const url = `${SITE_URL}/guides/${g.slug}`;
  const title = g.h1 ?? `${g.ingredient}: benefits, uses, dosage & side effects`;
  const t = g.sectionTitles ?? {};

  const structured = [
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      '@id': url,
      url,
      headline: title,
      name: g.metaTitle,
      description: g.metaDescription,
      datePublished: g.published,
      dateModified: g.updated,
      inLanguage: 'en-US',
      publisher: { '@type': 'Organization', name: 'Noovit', url: SITE_URL },
      ...(g.reviewer
        ? { lastReviewed: g.updated, reviewedBy: { '@type': 'Person', name: g.reviewer.name, description: g.reviewer.credentials, ...(g.reviewer.url ? { url: g.reviewer.url } : {}) } }
        : {}),
      about: {
        '@type': 'DietarySupplement',
        name: g.ingredient,
        activeIngredient: g.ingredient,
        safetyConsideration: g.avoidIf.join('; '),
      },
      citation: g.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: g.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Supplement guides', item: `${SITE_URL}/guides` },
        { '@type': 'ListItem', position: 3, name: g.ingredient, item: url },
      ],
    },
  ];

  const list = (items: string[]) => (
    <ul className="mt-4 list-disc space-y-2 pl-5">
      {items.map((t) => (
        <li key={t}><Cited text={t} /></li>
      ))}
    </ul>
  );

  return (
    <article className="container max-w-3xl px-6 py-12">
      <JsonLd data={structured} />
      <nav className="mb-4 text-xs text-[var(--color-muted)]">
        <Link href="/">Home</Link> / <Link href="/guides">Supplement guides</Link> / <span className="text-[var(--color-ink)]">{g.ingredient}</span>
      </nav>
      <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl">{title}</h1>
      <p className="mt-4 text-sm text-[var(--color-muted)]">
        Updated {fmt(g.updated)}
        {g.reviewer && <> · Reviewed by <b className="text-[var(--color-ink)]">{g.reviewer.name}</b>, {g.reviewer.credentials}</>}
        {' · '}{g.sources.length} sources
      </p>
      {!g.reviewer && placeholdersOn(settings) && (
        <PlaceholderNote className="mt-3">
          “Medically reviewed by [name, RD/MD], [date]” goes here. A named, credentialed reviewer is one of the strongest trust signals for health pages.
        </PlaceholderNote>
      )}

      <section className="mt-8 rounded-3xl bg-[var(--color-soft)] p-6" aria-labelledby="in-short">
        <h2 id="in-short" className="text-lg">In short</h2>
        <p className="mt-2 text-[var(--color-ink)]"><Cited text={g.summary} /></p>
        <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          {g.quickFacts.map((f) => (
            <div key={f.label} className="border-t border-[var(--color-line)] pt-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{f.label}</dt>
              <dd className="mt-0.5 font-semibold">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <nav aria-label="On this page" className="mt-8 rounded-2xl border border-[var(--color-line)] p-5 text-sm">
        <p className="font-semibold">On this page</p>
        <ol className="mt-2 grid gap-1 sm:grid-cols-2">
          {SECTIONS.map(([id, label]) => (
            <li key={id}><a href={`#${id}`} className="text-[var(--color-accent)] hover:underline">{t[TOC_KEYS[id] as keyof typeof t] ?? label}</a></li>
          ))}
        </ol>
      </nav>

      <div className="prose-noovit mt-10">
        <h2 id="what-is">{t.what ?? `What is ${g.ingredient.toLowerCase()}?`}</h2>
        {g.whatItIs.map((p) => <p key={p}><Cited text={p} /></p>)}

        <h2 id="benefits">{t.benefits ?? `${g.ingredient} benefits: what the evidence says`}</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Evidence ratings: <b>Moderate</b> = several good human trials; <b>Limited</b> = few or small trials, or mixed results; <b>Early</b> = lab or
          biomarker studies only; <b>Insufficient</b> = trials found no clear effect.
        </p>
      </div>
      <div className="mt-4 space-y-4">
        {g.benefits.map((b) => (
          <div key={b.title} className="rounded-2xl border border-[var(--color-line)] p-5">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg">{b.title}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${EVIDENCE_STYLE[b.evidence]}`}>Evidence: {b.evidence}</span>
            </div>
            <p className="mt-2 text-[var(--color-ink)]"><Cited text={b.text} /></p>
          </div>
        ))}
      </div>

      <div className="prose-noovit mt-10">
        <h2 id="dosage">{t.dosage ?? `${g.ingredient} dosage`}</h2>
      </div>
      {list(g.dosage)}

      <div className="prose-noovit mt-10">
        <h2 id="side-effects">{t.sideEffects ?? 'Side effects'}</h2>
      </div>
      {list(g.sideEffects)}

      <div className="prose-noovit mt-10">
        <h2 id="interactions">{t.interactions ?? 'Interactions with medications and supplements'}</h2>
      </div>
      {list(g.interactions)}

      <section id="avoid" className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5">
        <h2 className="text-xl">{t.avoid ?? `Who should avoid ${g.ingredient.toLowerCase()}`}</h2>
        {list(g.avoidIf)}
      </section>

      <div className="prose-noovit mt-10">
        <h2 id="choose">{t.choose ?? `How to choose a ${g.ingredient.toLowerCase()} supplement`}</h2>
      </div>
      {list(g.howToChoose)}

      <section id="faq" className="mt-10">
        <h2 className="text-2xl">{t.faq ?? `${g.ingredient} FAQ`}</h2>
        <div className="mt-4 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
          {g.faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                <span>{f.q}</span>
                <ChevronDown aria-hidden className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-[var(--color-ink)]"><Cited text={f.a} /></p>
            </details>
          ))}
        </div>
      </section>

      {(related.length > 0 || goals.length > 0) && (
        <section className="mt-12">
          <h2 className="text-2xl">From our range</h2>
          {related.length > 0 && (
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
          {goals.length > 0 && (
            <p className="mt-4 text-sm">
              Related: {goals.map((x, i) => (<Fragment key={x.slug}>{i > 0 && ' · '}<Link href={`/goals/${x.slug}`} className="text-[var(--color-accent)] hover:underline">{x.name}</Link></Fragment>))}
            </p>
          )}
        </section>
      )}

      <div className="mt-12 rounded-3xl bg-[var(--color-soft)] p-6 text-center">
        <h2 className="text-xl">Not sure what’s right for you?</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Our 2-minute quiz suggests supplements based on your goals, diet and medications.</p>
        <Link href="/quiz" className="btn btn-primary mt-4">Take the quiz</Link>
      </div>

      <section id="sources" className="mt-12">
        <h2 className="text-2xl">Sources</h2>
        <ol className="mt-4 space-y-2 text-sm">
          {g.sources.map((s, i) => (
            <li key={s.url + i} id={`source-${i + 1}`} className="scroll-mt-28">
              <span className="font-semibold">[{i + 1}]</span> {s.label}.{' '}
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">{s.title}</a>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-10 border-t border-[var(--color-line)] pt-6 text-xs text-[var(--color-muted)]">
        This article is for general information and is not medical advice. Talk to your doctor or pharmacist before taking a supplement, especially if
        you are pregnant, breastfeeding, take medication or have a medical condition. These statements have not been evaluated by the Food and Drug
        Administration. Supplements are not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </article>
  );
}
