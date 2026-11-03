import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Microscope, Sprout, ArrowRight, PawPrint, ScanText } from 'lucide-react';
import { BestSellers } from '@/components/home/BestSellers';
import {
  TrustSection,
  ReviewsSection,
  FAQSection,
  CommunitySection,
  NewsletterSection,
  SubscriptionPerks,
  SectionHeading,
} from '@/components/sections/Sections';
import { ProductImage } from '@/components/product/ProductImage';
import { findProduct, petProducts } from '@/data/products';
import { getStoreProducts } from '@/lib/catalog/server';
import { getContent, lines, safeLink } from '@/lib/content';
import { JsonLd } from '@/components/seo/JsonLd';
import { LEGAL_NAME, SITE_URL } from '@/lib/site';
import { ADVISORS, GENERAL_FAQS, IMAGES, PET_IMAGES } from '@/data/content';
import { PLACEHOLDER_EXPERTS, PLACEHOLDER_REVIEWS } from '@/data/placeholders';
import { PlaceholderNote } from '@/components/ui/Placeholder';
import { getSettings, placeholdersOn } from '@/lib/settings';
import { latestReviews } from '@/lib/reviews';
import { unsplashSrcSet } from '@/lib/utils/format';
import { Brand, brandify } from '@/components/brand/Brand';
import { AskButton } from '@/components/advisor/AskButton';
import { advisorEnabled } from '@/lib/advisor';

// Value row under the hero (Thorne-like). Only claims we can stand behind today: no GMP / tested / Made in USA
// wording until Supliful's paperwork arrives (docs/TODO.md).
const VALUES = [
  ['Doses on the front.', 'Every bottle shows how much is in each serving.'],
  ['Evidence, graded.', 'Our guides rate the research honestly, nulls included.'],
  ['Free US shipping.', 'On every order, subscription or not.'],
  ['90-day guarantee.', "Not for you? We'll refund it."],
];

// Shop by goal: one tile per core product, tinted in its label colour.
const GOAL_TILES: { label: string; line: string; slug: string; href: string }[] = [
  { label: 'Sleep', line: 'Wind down and recover', slug: 'magnesium-complex', href: '/goals/sleep-stress' },
  { label: 'Calm', line: 'Everyday stress balance', slug: 'ashwagandha', href: '/goals/sleep-stress' },
  { label: 'Focus', line: 'Clear, steady thinking', slug: 'lions-mane', href: '/goals/brain-focus' },
  { label: 'Strength', line: 'Power and performance', slug: 'creatine', href: '/goals/muscle-performance' },
  { label: 'Energy', line: 'Cellular energy and heart', slug: 'coq10', href: '/goals/energy' },
  { label: 'Mobility', line: 'Joint comfort', slug: 'turmeric-complex', href: '/goals/joints-mobility' },
];

// The core range (docs/research/COMPETITORS_CORE5.md); hidden products drop out automatically. Up to four are shown.
const ART_V = 5; // bump when the /art graphics change
const SPOTLIGHT = ['magnesium-complex', 'ashwagandha', 'lions-mane', 'creatine', 'coq10', 'turmeric-complex'];

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function HomePage() {
  const [products, content, realReviews, settings] = await Promise.all([getStoreProducts(), getContent(), latestReviews(12), getSettings()]);
  const placeholders = placeholdersOn(settings);
  const reviewPlaceholder = !realReviews.length && placeholders;
  const reviews = reviewPlaceholder ? PLACEHOLDER_REVIEWS : realReviews;
  const advisorPlaceholder = !ADVISORS.length && placeholders;
  const advisors = advisorPlaceholder ? PLACEHOLDER_EXPERTS : ADVISORS;
  const spotlight = SPOTLIGHT.map((s) => findProduct(products, s)).filter((p): p is NonNullable<typeof p> => p !== undefined && p.status !== 'hidden').slice(0, 4);
  const petsLive = petProducts(products).length > 0;
  const hero = findProduct(products, 'lions-mane') ?? spotlight[0];
  const tiles = GOAL_TILES.map((t) => ({ ...t, product: findProduct(products, t.slug) })).filter((t) => t.product && t.product.status !== 'hidden');
  const ask = advisorEnabled();

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'Noovit', legalName: LEGAL_NAME, url: SITE_URL }} />
      {/* Hero: big quiet headline left, the hero product on a tinted panel right (Thorne-like) */}
      <section className="pb-10 pt-10 md:pb-16 md:pt-16">
        <div className="container grid items-center gap-10 px-6 md:grid-cols-[1.05fr_1fr] md:gap-16">
          <div>
            {content.hero_badge && <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">{brandify(content.hero_badge)}</p>}
            <h1 className="text-balance text-5xl leading-[1.02] md:text-7xl">{brandify(content.hero_headline)}</h1>
            {content.hero_subheadline && <p className="mt-6 max-w-lg text-lg text-[var(--color-muted)] md:text-xl">{brandify(content.hero_subheadline)}</p>}
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={safeLink(content.hero_cta_link) || '/shop'} className="btn btn-primary">{content.hero_cta_label || 'Shop the range'}</Link>
              {ask ? <AskButton label="Ask our AI advisor" className="btn-outline" /> : <Link href="/quiz" className="btn btn-outline">Take the quiz</Link>}
            </div>
            <ul className="mt-8 flex flex-col gap-2 text-sm text-[var(--color-muted)] sm:flex-row sm:gap-6">
              {lines(content.hero_bullets, 3).map((b) => (
                <li key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--color-navy)]" /> {brandify(b)}</li>
              ))}
            </ul>
          </div>
          {hero && (
            <Link href={`/products/${hero.slug}`} className="group relative block overflow-hidden rounded-[2rem]" style={{ background: `linear-gradient(160deg, ${hero.color}22, ${hero.color}45)` }}>
              {/* V2 artwork: the key molecule dissolving into particles, behind the bottle */}
              <ProductImage product={hero} priority sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.03] md:aspect-square" />
              <img src={`/art/molecule-${hero.slug}.svg?v=${ART_V}`} alt="" aria-hidden className="pointer-events-none absolute -left-[6%] -top-[4%] w-[46%] mix-blend-multiply" />
              <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[var(--color-navy)]">{hero.name} · ${hero.basePrice}</span>
            </Link>
          )}
        </div>
      </section>

      {/* Value row */}
      <section className="relative overflow-hidden border-y border-[var(--color-line)]">
        <img src={`/art/drift-${hero?.slug ?? 'lions-mane'}.svg?from=right&v=${ART_V}`} alt="" aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-40 lg:block" />
        <div className="container relative grid gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(([title, text]) => (
            <div key={title}>
              <p className="font-display text-2xl text-[var(--color-navy)]">{title}</p>
              <p className="mt-2 text-[var(--color-muted)]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by goal */}
      {tiles.length > 0 && (
        <section className="section">
          <div className="container px-6">
            <div className="mb-10 flex items-end justify-between gap-4">
              <h2 className="text-4xl md:text-5xl">Shop by goal</h2>
              <Link href="/shop" className="hidden items-center gap-1 text-sm font-semibold text-[var(--color-navy)] hover:underline sm:inline-flex">Shop all <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {tiles.map((t) => (
                <Link key={t.label} href={t.href} className="group relative overflow-hidden rounded-3xl p-6 md:p-8" style={{ background: `${t.product!.color}14` }}>
                  <p className="font-display text-2xl text-[var(--color-navy)] md:text-3xl">{t.label}</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{t.line}</p>
                  {/* The product's key molecule, in the V2 particle style */}
                  <img src={`/art/molecule-${t.slug}.svg?v=${ART_V}`} alt="" aria-hidden loading="lazy" className="mx-auto mt-2 aspect-square w-[88%] transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2" />
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-navy)]">{t.product!.name} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Evidence band: microscopy-style artwork in the science palette, linking to the graded guides */}
      <section className="relative overflow-hidden bg-[#141A4D] text-white">
        <img src={`/art/cells-dark.svg?v=${ART_V}`} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
        <div className="container relative grid gap-10 px-6 py-20 md:grid-cols-[1.1fr_1fr] md:py-28">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">The evidence</p>
            <h2 className="text-4xl text-white md:text-5xl">What the research actually shows.</h2>
            <p className="mt-4 max-w-lg text-lg text-white/75">Every ingredient has a guide: the studies, the doses they used, who should avoid it, and an honest grade for how strong the evidence is, including the studies that found nothing.</p>
            <Link href="/guides" className="btn mt-8 bg-white text-[var(--color-navy)] hover:bg-white/90">Read the guides</Link>
          </div>
          <ul className="grid content-center gap-3 sm:grid-cols-2">
            {[['magnesium', 'Magnesium'], ['ashwagandha', 'Ashwagandha'], ['lions-mane', "Lion's mane"], ['creatine', 'Creatine'], ['coq10', 'CoQ10'], ['turmeric', 'Turmeric']].map(([slug, name]) => (
              <li key={slug}>
                <Link href={`/guides/${slug}`} className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-5 py-4 backdrop-blur-sm transition hover:bg-white/10">
                  <span className="font-semibold">{name}</span> <ArrowRight className="h-4 w-4 text-white/70" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BestSellers products={products} />

      <TrustSection />

      {/* AI advisor promo */}
      {ask && (
        <section className="pb-4">
          <div className="container px-6">
            <div className="relative grid items-center gap-8 overflow-hidden rounded-[2rem] bg-[var(--color-navy)] p-10 text-white md:grid-cols-[1.3fr_1fr] md:p-16">
              <img src={`/art/cells-dark-advisor.svg?v=${ART_V}`} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
              <div className="relative">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">New · Noovit AI</p>
                <h2 className="text-4xl text-white md:text-5xl">Questions? Ask Noovit AI.</h2>
                <p className="mt-4 max-w-lg text-lg text-white/75">Sleep, stress, focus or energy: describe your goal and get plain answers about ingredients, doses and which formula may suit you, any time.</p>
                <AskButton label="Start a conversation" className="mt-8 bg-white text-[var(--color-navy)] hover:bg-white/90" />
                <p className="mt-4 text-xs text-white/50">AI answers can be wrong and aren&apos;t medical advice.</p>
              </div>
              <div className="relative space-y-3 text-[15px]">
                <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-white/10 px-4 py-3">Can I take magnesium and ashwagandha together?</p>
                <p className="max-w-[90%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-[var(--color-ink)]">Many people do: they&apos;re often paired in the evening. If you take medicine for thyroid, blood pressure or sleep, check with your doctor first…</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Noovit Pets teaser */}
      <section className="pb-4">
        <div className="container px-6">
          <Link href="/pets" className="group grid overflow-hidden rounded-3xl bg-[var(--color-pets-soft)] md:grid-cols-2">
            <div className="p-10 md:p-14">
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pets-dark)]">
                <PawPrint className="h-4 w-4" /> {petsLive ? 'New' : 'Coming soon'} · <Brand /> Pets
              </p>
              <h2 className="text-3xl md:text-4xl">Clean supplements for dogs and cats</h2>
              <p className="mt-3 text-[var(--color-muted)]">Soft chews for digestion, joints, calm and coat, in the same cart as yours.</p>
              <span className="btn mt-6 bg-[var(--color-pets)] text-[var(--color-navy)] group-hover:brightness-95">{petsLive ? 'Shop Pets' : 'Join the waitlist'}</span>
            </div>
            <img src={PET_IMAGES.hero} srcSet={unsplashSrcSet(PET_IMAGES.hero)} sizes="(min-width: 768px) 50vw, 100vw" alt="A cat and dog cuddling" className="h-full min-h-64 w-full object-cover" loading="lazy" />
          </Link>
        </div>
      </section>

      {/* Quiz */}
      <section className="section bg-[var(--color-soft)]">
        <div className="container grid items-center gap-10 px-6 md:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading eyebrow="Not sure where to start?" title="Find your routine in two minutes" center={false} />
            <p className="-mt-6 max-w-lg text-[var(--color-muted)]">
              Tell us your goals, diet and lifestyle and we&apos;ll suggest up to three products, with the reasons why. No sign-up needed.
            </p>
            <Link href="/quiz" className="btn btn-primary mt-8">Take the quiz</Link>
          </div>
          <ul className="grid gap-3 text-sm font-semibold sm:grid-cols-2">
            {['Matched to your goals', 'Filtered for your diet', 'Pregnancy and medication aware', 'Change or cancel anytime'].map((t) => (
              <li key={t} className="flex items-center gap-2 rounded-2xl bg-white p-4"><Check className="h-4 w-4 shrink-0 text-[var(--color-accent)]" /> {t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Nutritionists: real advisors, or labelled placeholders before launch */}
      {advisors.length > 0 && (
        <section className="section bg-[var(--color-soft)]">
          <div className="container grid gap-12 px-6 lg:grid-cols-[1fr_2fr]">
            <div>
              <SectionHeading eyebrow="Expert formulated" title="Build your routine with our nutritionists" center={false} />
              <p className="-mt-6 text-[var(--color-muted)]">Every formula is reviewed by our panel of qualified nutrition professionals.</p>
              <Link href="/shop" className="btn btn-primary mt-6">Shop Now</Link>
            </div>
            <div>
              {advisorPlaceholder && (
                <PlaceholderNote className="mb-4">
                  Your advisory panel goes here: real name, credential (RD, RDN, MSc, PhD), photo, a short quote, written consent, and disclosure if paid.
                  Add them in data/content.ts (ADVISORS). Until then, the panel and the claim beside it should not go live.
                </PlaceholderNote>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {advisors.map((e, i) => (
                  <div key={i} className="flex gap-4 rounded-2xl bg-white p-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-lg font-bold text-white">
                      {e.credentials[0]}
                    </div>
                    <div>
                      <p className="font-bold">{e.name}</p>
                      <p className="text-xs font-semibold text-[var(--color-accent)]">{e.credentials}</p>
                      <p className="mt-2 text-sm text-[var(--color-muted)]">&ldquo;{e.quote}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Approach */}
      <section className="section">
        <div className="container grid items-center gap-12 px-6 md:grid-cols-2">
          <img src={IMAGES.approach} srcSet={unsplashSrcSet(IMAGES.approach)} sizes="(min-width: 768px) 50vw, 100vw" alt="A table of fresh, colourful whole foods" className="aspect-[4/3] w-full rounded-3xl object-cover" loading="lazy" />
          <div>
            <SectionHeading eyebrow="Our approach" title="Nutrition backed by evidence, made for real life" center={false} />
            <div className="space-y-6">
              <div className="flex gap-4">
                <Microscope className="h-8 w-8 shrink-0 text-[var(--color-accent)]" />
                <div>
                  <h3 className="text-lg">Researched doses</h3>
                  <p className="text-[var(--color-muted)]">We use the forms and amounts studied in research — not pixie dust.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Sprout className="h-8 w-8 shrink-0 text-[var(--color-accent)]" />
                <div>
                  <h3 className="text-lg">Nothing you don&apos;t need</h3>
                  <p className="text-[var(--color-muted)]">No artificial colors, fillers or unnecessary additives.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <ScanText className="h-8 w-8 shrink-0 text-[var(--color-accent)]" strokeWidth={1.5} />
                <div>
                  <h3 className="text-lg">Labels you can read</h3>
                  <p className="text-[var(--color-muted)]">Every ingredient and amount listed, the key dose on the front, and no proprietary blends.</p>
                </div>
              </div>
            </div>
            <Link href="/about" className="mt-8 inline-flex items-center gap-1 font-bold text-[var(--color-accent)]">
              More about our approach <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} placeholder={reviewPlaceholder} />
      <FAQSection faqs={GENERAL_FAQS.slice(0, 5)} />
      <CommunitySection />
      <NewsletterSection />
      <SubscriptionPerks />
    </>
  );
}
