import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Check, Plus } from 'lucide-react';
import { bestSellers, petProducts } from '@/data/products';
import { getStoreProduct, getStoreProducts } from '@/lib/catalog/server';
import { productImageUrl, productUrl } from '@/lib/site';
import { JsonLd } from '@/components/seo/JsonLd';
import { Gallery, PurchaseBox, TrackViewItem } from '@/components/product/ProductClient';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductImage } from '@/components/product/ProductImage';
import { Product } from '@/types';
import { Stars } from '@/components/ui/Stars';
import { PlaceholderNote } from '@/components/ui/Placeholder';
import { guidesForProduct } from '@/lib/guides';
import { GOAL_PAGES } from '@/lib/goals';
import { goalsForProduct, relatedByGoal } from '@/lib/quiz';
import { getSettings, placeholdersOn } from '@/lib/settings';
import { ReviewsModule } from '@/components/reviews/ReviewsModule';
import { FAQSection, SectionHeading } from '@/components/sections/Sections';
import { netQuantity } from '@/lib/labels/svg';
import { asLowAs } from '@/data/products';
import { formatPrice } from '@/lib/utils/format';

export async function generateStaticParams() {
  return (await getStoreProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getStoreProduct((await params).slug);
  if (!product) return {};
  const title = product.seoTitle || `${product.name} — Noovit`;
  const description = product.seoDescription || product.description;
  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { title, description, url: `/products/${product.slug}`, images: [{ url: productImageUrl(product) }] },
  };
}

const USPS = ['Evidence-based doses', 'Free US shipping', '90-day money-back guarantee', 'Cancel anytime online', 'Clean ingredients'];

// Collapsible row for the right-hand column (native <details>: works without JavaScript and is crawlable).
function Row({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="group border-b border-[var(--color-line)] py-4" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--color-navy)]">
        {title}
        <Plus aria-hidden className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45" />
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]">{children}</div>
    </details>
  );
}

// Card with a coloured caps header, as in the reference design's left column.
function Panel({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 overflow-hidden rounded-lg border border-[var(--color-line)] bg-white">
      <h2 className="bg-[var(--color-orange)] px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-navy)]">{title}</h2>
      {children}
    </section>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getStoreProduct((await params).slug);
  if (!product) notFound();
  const all = await getStoreProducts();
  const placeholders = placeholdersOn(await getSettings());

  const isPet = product.productType === 'pets';
  const isBundle = Boolean(product.bundleItems?.length);
  // Bundle components are related by definition; otherwise products serving the same goals (quiz weights).
  const components = (product.bundleItems ?? []).map((b) => all.find((p) => p.slug === b.slug)).filter((p) => p !== undefined);
  const related = isPet
    ? petProducts(all).filter((p) => p.id !== product.id && p.status === 'active').slice(0, 4)
    : components.length
      ? [...components]
      : relatedByGoal(product, all);
  if (!isPet && related.length < 4) related.push(...bestSellers(all).filter((p) => p.id !== product.id && p.status === 'active' && !related.includes(p)).slice(0, 4 - related.length));
  const bundles = all.filter((p) => p.status === 'active' && p.bundleItems?.some((b) => b.slug === product.slug));
  const goals = goalsForProduct(product.slug).map((g) => GOAL_PAGES.find((x) => x.goal === g)).filter((x) => x !== undefined).slice(0, 3);
  const guides = guidesForProduct(product.slug);
  const guide = guides[0] ?? null;

  // Stat strip: figures straight from the label and price, never marketing multipliers.
  const [count, unitWord] = netQuantity(product).split(' ');
  const separately = components.reduce((sum, p) => sum + p.basePrice, 0);
  const stats = isBundle
    ? [
        { value: String(components.length), label: 'products in one bundle' },
        { value: `${product.servings}`, label: 'day supply' },
        { value: formatPrice(product.basePrice / product.servings), label: 'per day' },
        ...(separately > product.basePrice ? [{ value: `${Math.round((1 - product.basePrice / separately) * 100)}%`, label: 'less than buying separately' }] : []),
      ]
    : [
        { value: product.ingredients[0]?.amount ?? '', label: (product.ingredients[0]?.name ?? '').split(' ').slice(0, 2).join(' ') },
        { value: count, label: unitWord.toLowerCase() },
        { value: `${product.servings}`, label: 'day supply' },
        { value: formatPrice(asLowAs(product) / product.servings), label: 'per day, from' },
      ];

  const sections = [
    { id: 'benefits', label: 'Benefits' },
    { id: 'research', label: 'The research' },
    ...(isBundle ? [] : [{ id: 'ingredients', label: 'Ingredients' }]),
    { id: 'faq', label: 'FAQ' },
    { id: 'write', label: 'Reviews' },
  ];

  // aggregateRating only from real, approved reviews — placeholder ratings must never reach Google.
  const structured = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.length ? product.images : [productImageUrl(product)],
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'Noovit' },
    offers: {
      '@type': 'Offer',
      url: productUrl(product),
      priceCurrency: 'USD',
      price: product.basePrice.toFixed(2),
      availability: product.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    ...(product.hasRealReviews
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount } }
      : {}),
  };

  return (
    <>
      <JsonLd data={structured} />
      <TrackViewItem product={product} />
      <nav className="container px-6 pt-6 text-xs text-[var(--color-muted)]">
        <Link href="/">Home</Link> / {isPet ? <Link href="/pets">Noovit Pets</Link> : <Link href="/shop">Shop</Link>} / <span className="text-[var(--color-ink)]">{product.name}</span>
      </nav>

      <section className="container grid gap-10 px-6 py-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Right column first on phones: title and price before the deep content. */}
        <div className="order-2 space-y-6 lg:order-1">
          <div className="hidden lg:block">
            <Gallery product={product} />
          </div>

          <Panel id="benefits" title="Benefits">
            <ul className="divide-y divide-[var(--color-line)]">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 px-5 py-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)]">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="font-semibold text-[var(--color-navy)]">{b}*</span>
                </li>
              ))}
            </ul>
          </Panel>

          {isBundle ? (
            <Panel id="research" title="What's inside">
              <ul className="divide-y divide-[var(--color-line)]">
                {components.map((c) => (
                  <li key={c.slug} className="flex items-center gap-4 px-5 py-4">
                    <ProductImageServer product={c} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/products/${c.slug}`} className="font-semibold text-[var(--color-navy)] hover:underline">{c.name}</Link>
                      <p className="text-sm text-[var(--color-muted)]">{c.shortBenefit}*</p>
                    </div>
                    <span className="text-sm text-[var(--color-muted)]">{formatPrice(c.basePrice)}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : guide ? (
            <Panel id="research" title={`The research on ${guide.ingredient.toLowerCase()}`}>
              <div className="px-5 py-4 text-sm">
                <p>{guide.summary.replace(/\s*\[\d+\]/g, '')}</p>
                <Link href={`/guides/${guide.slug}`} className="mt-3 inline-block font-semibold text-[var(--color-accent)] hover:underline">
                  Read the full guide: studies, doses and evidence grades →
                </Link>
              </div>
            </Panel>
          ) : placeholders ? (
            <Panel id="research" title="The research">
              <div className="p-5">
                <PlaceholderNote>
                  Key human studies for this formula go here: study size, dose, length, result and evidence grade, with links. Comes from the ingredient guide (deep research).
                </PlaceholderNote>
              </div>
            </Panel>
          ) : null}

          {!isBundle && (
            <Panel id="ingredients" title="What's inside, and why">
              <ul className="divide-y divide-[var(--color-line)]">
                {product.ingredients.map((i) => (
                  <li key={i.name} className="flex items-baseline justify-between gap-4 px-5 py-3.5">
                    <span>
                      <span className="font-semibold text-[var(--color-navy)]">{i.name}</span>
                      {i.description && <span className="mt-0.5 block text-sm text-[var(--color-muted)]">{i.description}</span>}
                    </span>
                    <span className="shrink-0 font-semibold text-[var(--color-navy)]">{i.amount}</span>
                  </li>
                ))}
              </ul>
              <p className="border-t border-[var(--color-line)] px-5 py-3 text-xs text-[var(--color-muted)]">Other ingredients: {product.otherIngredients}</p>
            </Panel>
          )}

          {placeholders && (
            <div className="rounded-lg border border-[var(--color-line)] bg-white p-5">
              <p className="label-caps">What to expect</p>
              <PlaceholderNote className="mt-3">
                Timeline goes here (week 1–2, month 1, months 2–3), written honestly from the study durations in the ingredient guide.
              </PlaceholderNote>
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <div className="flex gap-2">
            {isPet && (
              <span className="rounded-sm bg-[var(--color-pets)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-navy)]">
                Noovit Pets · {product.species?.map((sp) => (sp === 'dog' ? 'Dogs' : 'Cats')).join(' & ')}
              </span>
            )}
            {product.bestSeller && <span className="rounded-sm bg-[var(--color-soft)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-navy)]">Best seller</span>}
          </div>
          <h1 className="mt-3 text-balance text-3xl leading-tight md:text-[2.75rem]">
            <span className="text-[var(--color-orange)]">{product.name}:</span> {product.tagline || product.shortBenefit.replace(/\.$/, '')}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
            <a href="#write" className="flex items-center gap-2">
              {product.reviewCount > 0 ? (
                <>
                  <Stars rating={product.rating} /> <span className="underline">{product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()})</span>
                </>
              ) : placeholders ? (
                <span className="flex flex-wrap items-center gap-2">
                  <Stars rating={5} /> <span className="underline">4.8 (1,234)</span>
                  <PlaceholderNote className="py-1">Real average and count show here automatically</PlaceholderNote>
                </span>
              ) : (
                <span className="font-semibold text-[var(--color-accent)]">Be the first to review</span>
              )}
            </a>
            <span className="text-[var(--color-ink)]">
              <a href="#ingredients" className="underline">Ingredients</a> · <a href="#benefits" className="underline">Benefits</a>
            </span>
          </div>
          <div className="mt-5 lg:hidden">
            <Gallery product={product} />
          </div>
          <p className="mt-4 text-[var(--color-ink)]">{product.description}</p>
          <ul className="mt-4 space-y-2">
            {product.benefits.slice(0, 4).map((b) => (
              <li key={b} className="flex items-start gap-3 text-[var(--color-ink)]">
                <span aria-hidden className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[var(--color-orange)]" />
                {b}*
              </li>
            ))}
          </ul>

          <dl className={`mt-6 grid grid-cols-2 overflow-hidden rounded-lg border border-[var(--color-line)] bg-white ${stats.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-4'}`}>
            {stats.map((st) => (
              <div key={st.label} className="border-b border-r border-[var(--color-line)] px-3 py-3 text-center last:border-r-0 sm:border-b-0">
                <dd className="text-lg font-semibold text-[var(--color-navy)]">{st.value}</dd>
                <dt className="mt-0.5 text-[10px] font-semibold uppercase leading-tight tracking-[0.08em] text-[var(--color-muted)]">{st.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-7">
            <PurchaseBox product={product} sections={sections} />
          </div>

          {placeholders && (
            <div className="mt-6 rounded-lg border border-[var(--color-line)] bg-white p-5">
              <PlaceholderNote className="mb-3">
                Clinician trust box: a named dietitian&apos;s note, or the FrontrowMD &ldquo;Clinicians&apos; Choice&rdquo; badge (number of clinicians who share this product, with their faces) once earned.
              </PlaceholderNote>
              <p className="font-display text-lg text-[var(--color-navy)]">Clinicians&apos; Choice</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">[N] clinicians share this product without compensation. View clinicians &amp; learn more</p>
            </div>
          )}

          <div className="mt-6 border-t border-[var(--color-line)]">
            <Row title="How to use" open>
              <p>{product.dosage}</p>
            </Row>
            <Row title="When will I notice a difference?">
              <p>
                Supplements work gradually. Most human studies measure their effects after 4 to 12 weeks of daily use, so take it consistently for at least a month before
                judging.{guide ? <> See the <Link href={`/guides/${guide.slug}`} className="underline">{guide.ingredient.toLowerCase()} guide</Link> for the evidence.</> : null}
              </p>
            </Row>
            <Row title="Ingredients & Supplement Facts">
              <table className="w-full text-sm">
                <tbody>
                  {product.ingredients.map((i) => (
                    <tr key={i.name} className="border-b border-[var(--color-line)]">
                      <td className="py-2 font-semibold">{i.name}</td>
                      <td className="py-2 text-right">{i.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[var(--color-muted)]">Other ingredients: {product.otherIngredients}</p>
            </Row>
            <Row title="Who it's for, and who shouldn't take it">
              <p>{product.whoFor}</p>
              <p className="mt-2">
                {isPet
                  ? 'Check with your veterinarian before use if your pet is pregnant, nursing, on medication or has a health condition.'
                  : `Talk to your doctor or pharmacist before use if you are pregnant or breastfeeding, take medication, or have a medical condition.${product.ageRestricted ? ' For adults 18+ only.' : ''} Keep out of reach of children.`}
              </p>
            </Row>
            {placeholders && (
              <Row title="Is it third-party tested?">
                <PlaceholderNote>Batch lab results (certificate of analysis): lot number, test date, potency vs label, heavy metals and microbes, with the PDF. Add once the supplier provides them.</PlaceholderNote>
              </Row>
            )}
            {(bundles.length > 0 || related.length > 0) && !isBundle && (
              <Row title="Can I take it with other supplements?">
                <p>
                  It pairs well with{' '}
                  {related.slice(0, 3).map((r, i) => (
                    <span key={r.slug}>{i > 0 && (i === Math.min(related.length, 3) - 1 ? ' and ' : ', ')}<Link href={`/products/${r.slug}`} className="underline">{r.name}</Link></span>
                  ))}
                  . If you take medication, check with your pharmacist first.
                </p>
              </Row>
            )}
          </div>

          {bundles[0] && (
            <div className="mt-6 rounded-lg bg-[var(--color-soft)] p-5">
              <p className="label-caps">Save with a bundle</p>
              <p className="mt-1 font-display text-lg text-[var(--color-navy)]">Part of the {bundles[0].name}</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">{bundles[0].shortBenefit}</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="font-semibold">{formatPrice(bundles[0].basePrice)}</span>
                <Link href={`/products/${bundles[0].slug}`} className="btn btn-primary px-5 py-2.5">View bundle</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* USP strip */}
      <div className="overflow-hidden border-y border-[var(--color-line)] bg-white py-4">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap text-sm font-semibold text-[var(--color-navy)]">
          {[...USPS, ...USPS, ...USPS, ...USPS].map((u, i) => (
            <span key={i} className="flex items-center gap-3"><span aria-hidden className="h-2 w-2 rounded-[2px] bg-[var(--color-orange)]" />{u}</span>
          ))}
        </div>
      </div>

      <div id="faq" className="scroll-mt-20">
        <FAQSection faqs={product.faqs} />
      </div>

      {/* Bundles that include this product */}
      {bundles.length > 0 && (
        <section className="section bg-[var(--color-soft)]">
          <div className="container px-6">
            <SectionHeading eyebrow="Save with a bundle" title={`Bundles with ${product.name}`} />
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
              {bundles.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      <section className="section">
        <div className="container px-6">
          <SectionHeading title={isPet ? 'More for your pet' : components.length ? 'In this bundle' : 'Pairs well with'} sub={components.length ? 'Also sold separately' : undefined} />
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {(guides.length > 0 || goals.length > 0) && (
            <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-[var(--color-line)] bg-white p-6">
              <h2 className="text-xl">Learn more</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guides/${g.slug}`} className="font-semibold text-[var(--color-accent)] hover:underline">{g.ingredient}: benefits, dosage, side effects and the research →</Link>
                  </li>
                ))}
                {goals.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/goals/${g.slug}`} className="font-semibold text-[var(--color-accent)] hover:underline">More {g.name.toLowerCase()} supplements →</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <ReviewsModule productSlug={product.slug} pet={isPet} />
      <p className="container px-6 pb-24 pt-6 text-center text-xs text-[var(--color-muted)]">
        *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </>
  );
}

function ProductImageServer({ product }: { product: Product }) {
  return <ProductImage product={product} sizes="64px" className="h-16 w-16 shrink-0 rounded" />;
}
