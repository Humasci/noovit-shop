import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Microscope, Sprout, ArrowRight, PawPrint } from 'lucide-react';
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
import { SITE_URL } from '@/lib/site';
import { GENERAL_FAQS, IMAGES, PET_IMAGES } from '@/data/content';
import { latestReviews } from '@/lib/reviews';
import { unsplashSrcSet } from '@/lib/utils/format';
import { Brand, brandify } from '@/components/brand/Brand';
import { MosaicField } from '@/components/brand/MosaicField';

// PLACEHOLDER: swap these for press/retailer logos once you have them.
const MARQUEE = ['Clean Ingredients', 'Third-Party Tested', 'GMP Certified', 'Evidence-Based Doses', 'Made in the USA', 'Vegan Options', '90-Day Guarantee'];

const SPOTLIGHT = ['probiotic-complex', 'glucosamine-complex', 'turmeric-complex', 'collagen-complex'];

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function HomePage() {
  const [products, content, reviews] = await Promise.all([getStoreProducts(), getContent(), latestReviews(12)]);
  const spotlight = SPOTLIGHT.map((s) => findProduct(products, s)).filter((p) => p !== undefined);
  const petsLive = petProducts(products).length > 0;

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'Noovit', url: SITE_URL }} />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img
          src={content.hero_image}
          srcSet={unsplashSrcSet(content.hero_image)}
          sizes="100vw"
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10" />
        {/* Brand mosaic: small orange tiles breaking in from the top-right, and the hero dissolving into the strip below */}
        <MosaicField cols={30} rows={18} anchor="top-right" seed={3} className="right-0 top-0 hidden md:block" />
        <MosaicField cols={140} rows={3} anchor="bottom" color="var(--color-soft)" density={1} maxOpacity={1} animate={false} seed={5} className="bottom-0 left-0" />
        <div className="container relative px-6 py-20 md:py-32">
          <div className="max-w-xl">
            {content.hero_badge && (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
                {brandify(content.hero_badge)}
              </div>
            )}
            <h1 className="text-balance text-4xl md:text-6xl">{brandify(content.hero_headline)}</h1>
            {content.hero_subheadline && <p className="mt-5 text-lg text-[var(--color-ink)]/80">{brandify(content.hero_subheadline)}</p>}
            {content.hero_cta_label && (
              <Link href={safeLink(content.hero_cta_link) || '/shop'} className="btn btn-primary mt-8">
                {content.hero_cta_label}
              </Link>
            )}
            <ul className="mt-6 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:gap-6">
              {lines(content.hero_bullets, 3).map((b) => (
                <li key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--color-green)]" /> {brandify(b)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-[var(--color-line)] bg-[var(--color-soft)] py-5">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-navy)]/60">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i}>{m} ✦</span>
          ))}
        </div>
      </div>

      <BestSellers products={products} />

      <TrustSection />

      {/* Product spotlight */}
      <section className="section">
        <div className="container px-6">
          <div className="grid items-center gap-10 rounded-3xl bg-[var(--color-navy)] p-8 text-white md:grid-cols-2 md:p-14">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent-light)]">Where to start</p>
              <h2 className="text-3xl text-white md:text-4xl">Our core formulas</h2>
              <ul className="mt-6 space-y-3">
                {spotlight.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} className="flex items-center gap-3 text-lg font-semibold hover:text-[var(--color-accent-light)]">
                      <ArrowRight className="h-4 w-4" /> {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/shop" className="btn mt-8 bg-white text-[var(--color-navy)] hover:bg-[var(--color-accent-light)]">
                Shop Now
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {spotlight.map((p) => (
                <ProductImage key={p.slug} product={p} sizes="(min-width: 768px) 22vw, 45vw" className="aspect-square w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Noovit Pets teaser */}
      <section className="pb-4">
        <div className="container px-6">
          <Link href="/pets" className="group grid overflow-hidden rounded-3xl bg-[var(--color-pets-soft)] md:grid-cols-2">
            <div className="p-10 md:p-14">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-pets)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-navy)]">
                <PawPrint className="h-4 w-4" /> {petsLive ? 'New' : 'Coming soon'} · <Brand /> Pets
              </p>
              <h2 className="text-3xl md:text-4xl">Clean supplements for dogs and cats</h2>
              <p className="mt-3 text-[var(--color-muted)]">Vet-formulated chews for digestion, joints, calm and coat — in the same cart as yours.</p>
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
                  <p className="text-[var(--color-muted)]">No artificial colours, fillers or unnecessary additives.</p>
                </div>
              </div>
            </div>
            <Link href="/about" className="mt-8 inline-flex items-center gap-1 font-bold text-[var(--color-accent)]">
              More about our approach <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={reviews} />
      <FAQSection faqs={GENERAL_FAQS.slice(0, 5)} />
      <CommunitySection />
      <NewsletterSection />
      <SubscriptionPerks />
    </>
  );
}
