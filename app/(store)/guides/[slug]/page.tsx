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
import { cookies } from 'next/headers';
import { siteLive, PREVIEW_COOKIE, isPreviewToken } from '@/lib/launch';
import { ADMIN_COOKIE, isAdminToken } from '@/lib/admin/session';

async function storeVisible() {
  if (siteLive()) return true;
  const c = await cookies();
  return isAdminToken(c.get(ADMIN_COOKIE)?.value) || isPreviewToken(c.get(PREVIEW_COOKIE)?.value);
}
import { PlaceholderNote } from '@/components/ui/Placeholder';
import { GuideToc } from '@/components/guides/GuideToc';
import { Reveal } from '@/components/ui/Reveal';
import { ReviewedBy } from '@/components/experts/ReviewedBy';
import { reviewFor } from '@/lib/experts';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = findGuide((await params).slug);
  if (!g) return { title: 'Page not found | Noovit', robots: { index: false } };
  return {
    title: g.metaTitle,
    description: g.metaDescription,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: {
      type: 'article',
      title: g.metaTitle,
      description: g.metaDescription,
      url: `/guides/${g.slug}`,
      siteName: 'Noovit',
      locale: 'en_US',
      images: [{ url: `/guide-image/${g.slug}`, width: 1200, height: 630, alt: g.metaTitle }],
    },
    twitter: { card: 'summary_large_image', images: [`/guide-image/${g.slug}`] },
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

// Topic guides' custom headings also label the table of contents (jump links Google can show under the result).
const TOC_KEYS: Record<string, string> = { 'what-is': 'what', benefits: 'benefits', dosage: 'dosage', timing: 'timing', 'side-effects': 'sideEffects', interactions: 'interactions', avoid: 'avoid', compare: 'compare', choose: 'choose', faq: 'faq' };

// Question headings (20 Nov): phrased the way people search, so the answer under them can be lifted as it is.
function headings(g: NonNullable<ReturnType<typeof findGuide>>) {
  const x = g.ingredient.toLowerCase(), t = g.sectionTitles ?? {};
  return {
    what: t.what ?? `What is ${x}?`,
    benefits: t.benefits ?? `What are the benefits of ${x}?`,
    dosage: t.dosage ?? `How much ${x} per day?`,
    timing: t.timing ?? `When is the best time to take ${x}?`,
    sideEffects: t.sideEffects ?? `What are the side effects of ${x}?`,
    interactions: t.interactions ?? 'Interactions with medications and supplements',
    avoid: t.avoid ?? `Who should avoid ${x}?`,
    compare: t.compare ?? g.compare?.title ?? '',
    choose: t.choose ?? `How to choose a ${x} supplement`,
    faq: t.faq ?? `${g.ingredient} FAQ`,
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = findGuide((await params).slug);
  if (!g) notFound();
  const [products, settings, shop] = await Promise.all([getStoreProducts(), getSettings(), storeVisible()]);
  // Pre-launch, public visitors of an early guide don't see products (the shop isn't open); staff and preview links do.
  const related = !shop ? [] : g.relatedProducts.map((s) => products.find((p) => p.slug === s && p.status === 'active')).filter((p) => p !== undefined);
  const goals = !shop ? [] : g.relatedGoals.map(findGoal).filter((x) => x !== undefined);
  const url = `${SITE_URL}/guides/${g.slug}`;
  const title = g.h1 ?? `${g.ingredient}: benefits, uses, dosage & side effects`;
  const h = headings(g);
  const A = g.answers ?? {};
  const toc: [string, string][] = [
    ['what-is', h.what], ['benefits', h.benefits], ['dosage', h.dosage],
    ...(g.timing || A.timing ? [['timing', h.timing] as [string, string]] : []),
    ['side-effects', h.sideEffects], ['interactions', h.interactions], ['avoid', h.avoid],
    ...(g.compare ? [['compare', h.compare] as [string, string]] : []),
    ['choose', h.choose], ['faq', h.faq], ['sources', 'Sources'],
  ];
  // The short answers are questions too: they join the FAQ markup so AI tools get question + answer pairs.
  const blockQA = ([['benefits', h.benefits], ['dosage', h.dosage], ['timing', h.timing], ['sideEffects', h.sideEffects], ['compare', h.compare]] as const)
    .filter(([k]) => A[k])
    .map(([k, q]) => ({ q, a: A[k]! }));

  const review = reviewFor(`guide:${g.slug}`);
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
      ...(review && !g.reviewer
        ? { lastReviewed: review.date, reviewedBy: { '@type': 'Person', name: review.expert.name, description: review.expert.credentials, url: `${SITE_URL}/experts/${review.expert.slug}` } }
        : {}),
      ...(g.reviewer
        ? { lastReviewed: g.updated, reviewedBy: { '@type': 'Person', name: g.reviewer.name, description: g.reviewer.credentials, ...(g.reviewer.url ? { url: g.reviewer.url } : {}) } }
        : {}),
      about: {
        '@type': 'DietarySupplement',
        name: g.ingredient,
        activeIngredient: g.ingredient,
        safetyConsideration: g.avoidIf.map(plain).join('; '),
        ...(g.intake ? { recommendedIntake: { '@type': 'RecommendedDoseSchedule', name: plain(g.intake.recommended), targetPopulation: 'Adults' } } : {}),
        ...(g.intake?.maximum ? { maximumIntake: { '@type': 'MaximumDoseSchedule', name: plain(g.intake.maximum), targetPopulation: 'Adults' } } : {}),
      },
      citation: g.sources.map((s) => ({ '@type': 'CreativeWork', name: s.title, url: s.url })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [...blockQA, ...g.faqs].map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } })),
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

  // Answer first: one short paragraph directly under the question heading.
  const answer = (text?: string) =>
    text ? (
      <p className="mt-3 rounded-2xl border-l-4 border-[var(--color-accent)] bg-[var(--color-soft)] px-5 py-4 text-[var(--color-ink)]">
        <b>Short answer:</b> <Cited text={text} />
      </p>
    ) : null;
  const table = (head: string[], rows: string[][], caption?: string, firstColHeader = true) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
        {caption && <caption className="mb-2 text-left text-sm text-[var(--color-muted)]"><Cited text={caption} /></caption>}
        <thead>
          <tr>{head.map((c, i) => <th key={i} scope="col" className="border-b-2 border-[var(--color-navy)] px-3 py-2 font-semibold">{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[var(--color-line)] align-top">
              {r.map((c, j) => (j === 0 && firstColHeader ? <th key={j} scope="row" className="px-3 py-2 font-semibold"><Cited text={c} /></th> : <td key={j} className="px-3 py-2"><Cited text={c} /></td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ---------- Evidence-file layout (21 Nov prototype, owner: "medical file folder" guides) ----------
  // Same content and structured data as the classic layout: a file header with meta fields and evidence stamps, a
  // sticky TOC with scroll-spy, and each section as a numbered card on a soft page so sections stand out.
  if (g.layout === 'file') {
    const grades = (['Moderate', 'Limited', 'Early', 'Insufficient'] as Evidence[]).map((e) => [e, g.benefits.filter((b) => b.evidence === e).length] as const).filter(([, n]) => n > 0);
    const idx = Object.fromEntries(toc.map(([id], i) => [id, String(i + 1).padStart(2, '0')]));
    const Card = ({ id, title, children, tone }: { id: string; title: string; children: React.ReactNode; tone?: 'warn' }) => (
      <Reveal as="section" id={id} className={`scroll-mt-32 rounded-3xl border p-6 shadow-[0_1px_2px_rgba(20,33,61,0.04),0_8px_24px_-12px_rgba(20,33,61,0.12)] sm:p-8 ${tone === 'warn' ? 'border-red-200 bg-red-50/60' : 'border-[var(--color-line)] bg-white'}`}>
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-[var(--color-navy)] px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white">{idx[id]}</span>
          <span className="h-px flex-1 bg-[var(--color-line)]" />
        </div>
        <h2 className="mt-4 text-2xl text-[var(--color-navy)] sm:text-[1.7rem]">{title}</h2>
        {children}
      </Reveal>
    );
    const Stamp = ({ e }: { e: Evidence }) => (
      <span className={`inline-block -rotate-2 rounded-md border-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${e === 'Moderate' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : e === 'Limited' ? 'border-[var(--color-navy)]/60 text-[var(--color-navy)]' : e === 'Early' ? 'border-[var(--color-pets-dark)]/70 text-[var(--color-pets-dark)]' : 'border-gray-400 text-gray-600'}`}>{e}</span>
    );
    return (
      <div className="bg-[var(--color-soft)]">
        <JsonLd data={structured} />
        <div className="container max-w-6xl px-6 pt-10">
          <nav className="mb-6 text-xs text-[var(--color-muted)]">
            <Link href="/">Home</Link> / <Link href="/guides">Supplement guides</Link> / <span className="text-[var(--color-ink)]">{g.ingredient}</span>
          </nav>
          {/* file header: tab + folder */}
          <div className="relative pt-8">
            <div className="absolute left-0 top-0 flex h-9 items-center rounded-t-2xl bg-[var(--color-navy)] px-5 text-[11px] font-semibold uppercase tracking-wider text-white">Evidence file</div>
            <div className="rounded-3xl rounded-tl-none border border-[var(--color-line)] bg-white p-6 sm:p-10">
              <h1 className="max-w-3xl text-balance text-3xl text-[var(--color-navy)] sm:text-4xl md:text-5xl">{title}</h1>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--color-line)] pt-6 text-sm md:grid-cols-4">
                <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Updated</dt><dd className="mt-1 font-semibold">{fmt(g.updated)}</dd></div>
                <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Sources</dt><dd className="mt-1 font-semibold">{g.sources.length} studies and reviews</dd></div>
                <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Review</dt><dd className="mt-1 font-semibold">{g.reviewer ? `${g.reviewer.name}, ${g.reviewer.credentials}` : review ? <ReviewedBy reviewKey={`guide:${g.slug}`} /> : 'Every source opened and checked'}</dd></div>
                <div><dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Evidence graded</dt><dd className="mt-1.5 flex flex-wrap gap-1.5">{grades.map(([e, n]) => <span key={e} className="flex items-center gap-1"><Stamp e={e} /><span className="text-xs text-[var(--color-muted)]">×{n}</span></span>)}</dd></div>
              </dl>
              <div className="mt-8 grid gap-6 rounded-2xl bg-[var(--color-soft)] p-5 sm:p-6 md:grid-cols-[1.2fr_1fr]">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">In short</p>
                  <p className="mt-2 text-[var(--color-ink)]"><Cited text={g.summary} /></p>
                </div>
                <dl className="grid content-start gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                  {g.quickFacts.map((f) => (
                    <div key={f.label} className="border-t border-[var(--color-line)] pt-2">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">{f.label}</dt>
                      <dd className="mt-0.5 font-semibold">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="container grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
          <aside className="sticky top-[4.25rem] z-20 lg:static"><GuideToc items={toc} /></aside>
          <article className="min-w-0 space-y-6">
            <Card id="what-is" title={h.what}>
              <div className="prose-noovit mt-3">{g.whatItIs.map((p) => <p key={p}><Cited text={p} /></p>)}</div>
            </Card>
            <Card id="benefits" title={h.benefits}>
              {answer(A.benefits)}
              <ul className="mt-5 space-y-3">
                {g.benefits.map((b) => (
                  <li key={b.title} className="rounded-2xl border border-[var(--color-line)] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-lg">{b.title}</h3>
                      <Stamp e={b.evidence} />
                    </div>
                    <p className="mt-2 text-[var(--color-ink)]"><Cited text={b.text} /></p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[var(--color-muted)]">
                <b>Moderate</b> = several good human trials. <b>Limited</b> = few or small trials, or mixed results. <b>Early</b> = lab or biomarker studies only. <b>Insufficient</b> = trials found no clear effect.
              </p>
            </Card>
            <Card id="dosage" title={h.dosage}>
              {answer(A.dosage)}
              {g.dosageTable && table(g.dosageTable.head, g.dosageTable.rows, g.dosageTable.caption)}
              {list(g.dosage)}
            </Card>
            {(g.timing || A.timing) && (
              <Card id="timing" title={h.timing}>
                {answer(A.timing)}
                {g.timing && table(['Goal', 'When to take it'], g.timing.rows)}
              </Card>
            )}
            <Card id="side-effects" title={h.sideEffects}>
              {answer(A.sideEffects)}
              {list(g.sideEffects)}
            </Card>
            <Card id="interactions" title={h.interactions}>{list(g.interactions)}</Card>
            <Card id="avoid" title={h.avoid} tone="warn">{list(g.avoidIf)}</Card>
            {g.compare && (
              <Card id="compare" title={h.compare}>
                {answer(A.compare)}
                {table(g.compare.head, g.compare.rows.map((r) => [r.label, ...r.values]))}
                {g.compare.note && <p className="mt-2 text-sm text-[var(--color-muted)]"><Cited text={g.compare.note} /></p>}
              </Card>
            )}
            <Card id="choose" title={h.choose}>{list(g.howToChoose)}</Card>
            <Card id="faq" title={h.faq}>
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
            </Card>
            {related.length > 0 && (
              <Reveal className="rounded-3xl border border-[var(--color-line)] bg-white p-6 sm:p-8">
                <h2 className="text-2xl">From our range</h2>
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
              </Reveal>
            )}
            <Card id="sources" title="Sources">
              <ol className="mt-4 space-y-2 text-sm">
                {g.sources.map((s, i) => (
                  <li key={s.url + i} id={`source-${i + 1}`} className="grid scroll-mt-32 grid-cols-[2.5rem_1fr] gap-2 border-b border-dashed border-[var(--color-line)] pb-2">
                    <span className="font-semibold tabular-nums text-[var(--color-muted)]">[{i + 1}]</span>
                    <span>{s.label}. <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">{s.title}</a></span>
                  </li>
                ))}
              </ol>
            </Card>
            <p className="px-2 text-xs text-[var(--color-muted)]">
              This article is for general information and is not medical advice. Talk to your doctor or pharmacist before taking a supplement, especially if
              you are pregnant, breastfeeding, take medication or have a medical condition. These statements have not been evaluated by the Food and Drug
              Administration. Supplements are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </article>
        </div>
      </div>
    );
  }

  return (
    <>
    {/* Plain soft header (the particle artwork was retired 17 Nov) */}
    <div className="relative overflow-hidden bg-[var(--color-soft)]">
      <div className="container relative max-w-3xl px-6 pb-10 pt-12">
        <nav className="mb-4 text-xs text-[var(--color-muted)]">
          <Link href="/">Home</Link> / <Link href="/guides">Supplement guides</Link> / <span className="text-[var(--color-ink)]">{g.ingredient}</span>
        </nav>
        <h1 className="max-w-2xl text-balance text-3xl sm:text-4xl md:text-5xl">{title}</h1>
      </div>
    </div>
    <article className="container max-w-3xl px-6 pb-12 pt-6">
      <JsonLd data={structured} />
      <p className="mt-4 text-sm text-[var(--color-muted)]">
        Updated {fmt(g.updated)}
        {g.reviewer && <> · Reviewed by <b className="text-[var(--color-ink)]">{g.reviewer.name}</b>, {g.reviewer.credentials}</>}
        {!g.reviewer && review && <> · <ReviewedBy reviewKey={`guide:${g.slug}`} /></>}
        {' · '}{g.sources.length} sources
      </p>
      {!g.reviewer && !review && placeholdersOn(settings) && (
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
          {toc.map(([id, label]) => (
            <li key={id}><a href={`#${id}`} className="text-[var(--color-accent)] hover:underline">{label}</a></li>
          ))}
        </ol>
      </nav>

      <div className="prose-noovit mt-10">
        <h2 id="what-is">{h.what}</h2>
        {g.whatItIs.map((p) => <p key={p}><Cited text={p} /></p>)}

        <h2 id="benefits">{h.benefits}</h2>
      </div>
      {answer(A.benefits)}
      <div className="prose-noovit mt-4">
        <p className="text-sm text-[var(--color-muted)]">
          Evidence ratings: <b>Moderate</b> = several good human trials; <b>Limited</b> = few or small trials, or mixed results; <b>Early</b> = lab or
          biomarker studies only; <b>Insufficient</b> = trials found no clear effect.
        </p>
      </div>
      <ul className="mt-4 space-y-4">
        {g.benefits.map((b) => (
          <li key={b.title} className="rounded-2xl border border-[var(--color-line)] p-5">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg">{b.title}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${EVIDENCE_STYLE[b.evidence]}`}>Evidence: {b.evidence}</span>
            </div>
            <p className="mt-2 text-[var(--color-ink)]"><Cited text={b.text} /></p>
          </li>
        ))}
      </ul>

      <div className="prose-noovit mt-10">
        <h2 id="dosage">{h.dosage}</h2>
      </div>
      {answer(A.dosage)}
      {g.dosageTable && table(g.dosageTable.head, g.dosageTable.rows, g.dosageTable.caption)}
      {list(g.dosage)}

      {(g.timing || A.timing) && (
        <>
          <div className="prose-noovit mt-10">
            <h2 id="timing">{h.timing}</h2>
          </div>
          {answer(A.timing)}
          {g.timing && table(['Goal', 'When to take it'], g.timing.rows)}
        </>
      )}

      <div className="prose-noovit mt-10">
        <h2 id="side-effects">{h.sideEffects}</h2>
      </div>
      {answer(A.sideEffects)}
      {list(g.sideEffects)}

      <div className="prose-noovit mt-10">
        <h2 id="interactions">{h.interactions}</h2>
      </div>
      {list(g.interactions)}

      <section id="avoid" className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-5">
        <h2 className="text-xl">{h.avoid}</h2>
        {list(g.avoidIf)}
      </section>

      {g.compare && (
        <>
          <div className="prose-noovit mt-10">
            <h2 id="compare">{h.compare}</h2>
          </div>
          {answer(A.compare)}
          {table(g.compare.head, g.compare.rows.map((r) => [r.label, ...r.values]))}
          {g.compare.note && <p className="mt-2 text-sm text-[var(--color-muted)]"><Cited text={g.compare.note} /></p>}
        </>
      )}

      <div className="prose-noovit mt-10">
        <h2 id="choose">{h.choose}</h2>
      </div>
      {list(g.howToChoose)}

      <section id="faq" className="mt-10">
        <h2 className="text-2xl">{h.faq}</h2>
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

      {shop && <div className="mt-12 rounded-3xl bg-[var(--color-soft)] p-6 text-center">
        <h2 className="text-xl">Not sure what’s right for you?</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Our 2-minute quiz suggests supplements based on your goals, diet and medications.</p>
        <Link href="/quiz" className="btn btn-primary mt-4">Take the quiz</Link>
      </div>}

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
    </>
  );
}
