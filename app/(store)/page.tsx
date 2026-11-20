import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Microscope, Sprout, ArrowRight, ScanText, PawPrint } from 'lucide-react';
import { BestSellers } from '@/components/home/BestSellers';
import {
  TrustSection,
  CommunitySection,
  ReviewsSection,
  FAQSection,
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
import { ADVISORS, GENERAL_FAQS, IMAGES, PET_IMAGES, WOMEN_IMAGES } from '@/data/content';
import { unsplashSrcSet } from '@/lib/utils/format';
import { PLACEHOLDER_EXPERTS, PLACEHOLDER_REVIEWS } from '@/data/placeholders';
import { getSettings, placeholdersOn } from '@/lib/settings';
import { latestReviews } from '@/lib/reviews';
import { Brand, brandify } from '@/components/brand/Brand';
import { AskButton } from '@/components/advisor/AskButton';
import { advisorEnabled } from '@/lib/advisor';
import { WOMEN_FEATURED } from '@/lib/women';

// Value row under the hero (Thorne-like). Only claims we can stand behind today: no GMP / tested / Made in USA
// wording until Supliful's paperwork arrives (docs/TODO.md).
const VALUES = [
  ['Doses on the front.', 'Every bottle shows how much is in each serving.'],
  ['Evidence, graded.', 'Our guides rate the research honestly, nulls included.'],
  ['Free US shipping.', 'On every order, subscription or not.'],
  ['90-day guarantee.', "Not for you? We'll refund it."],
];

// Shop by goal: one tile per core product, tinted in its label colour.
// The first four active ones show (owner, 17 Nov: four columns); the rest are fallbacks.
const GOAL_TILES: { label: string; line: string; slug: string; href: string }[] = [
  { label: 'Focus', line: 'Clear, steady thinking', slug: 'lions-mane', href: '/goals/brain-focus' },
  { label: 'Sleep', line: 'Wind down and recover', slug: 'magnesium-complex', href: '/goals/sleep-stress' },
  { label: 'Calm', line: 'Everyday stress balance', slug: 'ashwagandha', href: '/goals/sleep-stress' },
  { label: 'Strength', line: 'Power and performance', slug: 'creatine', href: '/goals/muscle-performance' },
  { label: 'Energy', line: 'Cellular energy and heart', slug: 'coq10', href: '/goals/energy' },
  { label: 'Mobility', line: 'Joint comfort', slug: 'turmeric-complex', href: '/goals/joints-mobility' },
];

// The core range (docs/research/COMPETITORS_CORE5.md); hidden products drop out automatically. Up to four are shown.

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function HomePage() {
  const [products, content, realReviews, settings] = await Promise.all([getStoreProducts(), getContent(), latestReviews(12), getSettings()]);
  const placeholders = placeholdersOn(settings);
  const reviewPlaceholder = !realReviews.length && placeholders;
  const reviews = reviewPlaceholder ? PLACEHOLDER_REVIEWS : realReviews;
  const advisorPlaceholder = !ADVISORS.length && placeholders;
  const advisors = (advisorPlaceholder ? PLACEHOLDER_EXPERTS : ADVISORS).slice(0, 2); // two spots (owner, 17 Nov)
  const tiles = GOAL_TILES.map((t) => ({ ...t, product: findProduct(products, t.slug) })).filter((t) => t.product && t.product.status !== 'hidden').slice(0, 4);
  const ask = advisorEnabled();
  const hl = [findProduct(products, 'lions-mane')].find((p) => p && p.status !== 'hidden');
  const petsLive = petProducts(products).some((p) => p.status === 'active');
  const women = WOMEN_FEATURED.map((s) => findProduct(products, s)).filter((p): p is NonNullable<typeof p> => Boolean(p)).slice(0, 3);

  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'Noovit', legalName: LEGAL_NAME, url: SITE_URL, address: { '@type': 'PostalAddress', streetAddress: '30 N Gould St Ste R', addressLocality: 'Sheridan', addressRegion: 'WY', postalCode: '82801', addressCountry: 'US' } }} />
      {/* Hero: one full-bleed studio scene. The copy sits on the same grey backdrop as the bottles
          (public/images/lineup-hero.png, scripts/site-images.ts), so there is no card edge. */}
      <section className="relative overflow-hidden bg-[var(--sage)]">
        <div className="container grid items-center gap-2 px-6 md:grid-cols-[1fr_1fr] md:gap-6">
          <div className="relative z-10 pt-14 md:py-24">
            {content.hero_badge && <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-navy)]/70">{brandify(content.hero_badge)}</p>}
            <h1 className="text-balance text-[2.55rem] leading-[1.04] text-[var(--color-navy)] md:text-[3.2rem] xl:text-[3.83rem]">{brandify(content.hero_headline)}</h1>
            {content.hero_subheadline && <p className="mt-6 max-w-lg text-lg text-[var(--color-ink)]/80 md:text-xl">{brandify(content.hero_subheadline)}</p>}
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={safeLink(content.hero_cta_link) || '/shop'} className="btn btn-primary">{content.hero_cta_label || 'Shop the range'}</Link>
              {ask ? <AskButton label="Ask our AI advisor" className="btn-outline bg-white/60" /> : <Link href="/quiz" className="btn btn-outline bg-white/60">Take the quiz</Link>}
            </div>
            <ul className="mt-8 flex flex-col gap-2 text-sm text-[var(--color-ink)]/75 sm:flex-row sm:gap-6">
              {lines(content.hero_bullets, 3).map((b) => (
                <li key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--color-navy)]" /> {brandify(b)}</li>
              ))}
            </ul>
          </div>
          <Link href="/shop" aria-label="Shop the range" className="block">
            <img src="/images/lineup-hero.png?v=4" alt="Noovit Magnesium Sleep+, Lion's Mane and Ashwagandha Calm+ bottles" className="w-full" fetchPriority="high" />
          </Link>
        </div>
      </section>

      {/* Women's Health: the lead category on the human side (owner, 19 Nov), straight under the hero. */}
      {women.length > 0 && (
        <section className="section">
          <div className="container px-6">
            <div className="grid overflow-hidden rounded-3xl bg-[var(--studio)] md:grid-cols-[1.1fr_1fr]">
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-navy)]/70">Women&apos;s Health</p>
                <h2 className="mt-3 text-balance text-3xl text-[var(--color-navy)] md:text-[2.6rem] md:leading-tight">Strength, sleep and midlife, backed by evidence</h2>
                <p className="mt-4 max-w-md text-[var(--color-ink)]/80">Creatine for strength at every age, magnesium and ashwagandha for sleep and stress, and support through perimenopause and menopause.</p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {women.map((p) => (
                    <Link key={p.id} href={`/products/${p.slug}`} className="group text-center">
                      <ProductImage product={p} sizes="(min-width: 768px) 12vw, 30vw" className="mx-auto aspect-square w-full [mask-image:radial-gradient(closest-side,#000_72%,transparent)] transition-transform duration-700 group-hover:scale-[1.04]" />
                      <span className="mt-1 block text-xs font-semibold text-[var(--color-navy)] md:text-sm">{p.name}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/women" className="btn btn-primary mt-7 self-start">Shop Women&apos;s Health</Link>
              </div>
              <img src={WOMEN_IMAGES.banner} alt="Three women in sportswear" className="h-64 w-full object-cover object-top md:h-full" loading="lazy" />
            </div>
          </div>
        </section>
      )}

      {/* Value row */}
      <section className="relative overflow-hidden border-y border-[var(--color-line)]">
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
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {tiles.map((t) => (
                <Link key={t.label} href={t.href} className="group relative flex flex-col overflow-hidden rounded-3xl bg-[var(--studio)] p-5">
                  <p className="font-display text-xl text-[var(--color-navy)] md:text-2xl">{t.label}</p>
                  <p className="mt-1 text-sm text-[var(--color-ink)]/70">{t.line}</p>
                  {/* The product's studio photo, on the same backdrop colour as the tile */}
                  <ProductImage product={t.product!} sizes="(min-width: 1024px) 20vw, 45vw" className="mx-auto mt-1 aspect-square w-[80%] transition-transform duration-700 [mask-image:radial-gradient(closest-side,#000_72%,transparent)] group-hover:scale-[1.04]" />
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-navy)]">{t.product!.name} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SubscriptionPerks />

      {/* Product highlight masonry (owner, 17 Nov): Lion's Mane large (text above the photo, never on it), with
          highlight and benefit blocks around it. Benefit claims carry * → the FDA disclaimer in the footer. */}
      {hl && (
        <section className="section">
          <div className="container px-6">
            <div className="grid gap-4 md:grid-cols-3 md:grid-rows-[repeat(2,minmax(0,1fr))]">
              <Link href={`/products/${hl.slug}`} className="group flex flex-col overflow-hidden rounded-[2rem] bg-[var(--sage)] md:col-span-2 md:row-span-2">
                <div className="p-8 md:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-navy)]/70">Product highlight · Focus</p>
                  <h2 className="mt-2 max-w-md text-3xl text-[var(--color-navy)] md:text-4xl">{hl.name}: 1,000 mg in every serving</h2>
                  <p className="mt-3 max-w-md text-[var(--color-ink)]/75">Fruiting body and mycelium, two capsules a day, the dose printed on the front.</p>
                  <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-white">
                    Shop {hl.name} · ${hl.basePrice} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <div className="relative mt-auto min-h-[440px] flex-1 md:min-h-[546px]">
                  <img src="/images/feature-lions-mane.png?v=4" alt={`${hl.name} bottle`} className="absolute inset-0 h-full w-full object-contain object-bottom transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                </div>
              </Link>
              <div className="flex flex-col justify-between rounded-[2rem] bg-[var(--color-navy)] p-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Highlight</p>
                <div>
                  <p className="font-display text-6xl">1,000<span className="ml-1 text-2xl">mg</span></p>
                  <p className="mt-2 text-white/75">Lion&apos;s mane per serving, a mainstream, well-used dose.</p>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-[2rem] bg-[var(--studio)] p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Benefit</p>
                <div>
                  <p className="font-display text-2xl text-[var(--color-navy)]">Supports focus, memory and nerve health*</p>
                  <Link href="/guides/lions-mane" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] hover:underline">What the studies show <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                ['How to take it', 'Two capsules a day, with or without food.'],
                ['Clean label', 'Plant-based capsule, no proprietary blend, every amount listed.'],
                ['Subscribe & save', `$${hl.basePrice - 5} a bottle on subscription, free US shipping, cancel anytime.`],
              ].map(([t, d]) => (
                <div key={t} className="rounded-[2rem] bg-[var(--studio)] p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">{t}</p>
                  <p className="mt-3 text-[var(--color-navy)]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Evidence band: links to the graded guides */}
      <section className="relative overflow-hidden bg-[#141A4D] text-white">
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
            <div className="relative grid items-center gap-8 overflow-hidden rounded-[2rem] bg-[#141A4D] p-10 text-white md:grid-cols-[1.3fr_1fr] md:p-16">
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

      {/* Quiz: lifestyle split (Thorne's "science is personal" pattern) */}
      <section className="section">
        <div className="container grid items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
          <img src={IMAGES.womanRun} srcSet={unsplashSrcSet(IMAGES.womanRun)} sizes="(min-width: 768px) 50vw, 100vw" alt="A woman running by a river in winter" className="aspect-[4/3] w-full rounded-3xl object-cover" loading="lazy" />
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">Not sure where to start?</p>
            <h2 className="text-4xl md:text-5xl">Built around your goals.</h2>
            <p className="mt-4 max-w-lg text-lg text-[var(--color-muted)]">
              Tell us your goals, diet and routine and we&apos;ll suggest up to three products, with the reasons why. Two minutes, no sign-up needed.
            </p>
            <ul className="mt-6 grid gap-2 text-sm font-semibold sm:grid-cols-2">
              {['Matched to your goals', 'Filtered for your diet', 'Pregnancy and medication aware', 'Change or cancel anytime'].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 shrink-0 text-[var(--color-accent)]" /> {t}</li>
              ))}
            </ul>
            <Link href="/quiz" className="btn btn-primary mt-8">Take the quiz</Link>
          </div>
        </div>
      </section>

      {/* Nutritionists: real advisors, or labelled placeholders before launch */}
      {advisors.length > 0 && (
        <section className="section bg-[var(--color-soft)]">
          <div className="container grid gap-12 px-6 lg:grid-cols-[1fr_2fr]">
            <div>
              {/* Honest scope: our advisors review the guides and articles; the formulas are the manufacturer's. */}
              <SectionHeading eyebrow="Expert reviewed" title={advisors.length === 1 ? 'Meet our nutrition advisor' : 'Meet our nutrition advisors'} center={false} />
              <p className="-mt-6 text-[var(--color-muted)]">Our ingredient guides and articles are checked by a qualified dietitian before they go live.</p>
              <Link href="/guides" className="btn btn-primary mt-6">Read the guides</Link>
            </div>
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                {advisors.map((e, i) => (
                  <div key={i} className="flex gap-4 rounded-2xl bg-white p-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-lg font-bold text-white">
                      {e.credentials[0]}
                    </div>
                    <div>
                      <p className="font-bold">{e.slug ? <Link href={`/experts/${e.slug}`} className="hover:underline">{e.name}</Link> : e.name}</p>
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
          <img src={IMAGES.womanTrain} srcSet={unsplashSrcSet(IMAGES.womanTrain)} sizes="(min-width: 768px) 50vw, 100vw" alt="A woman training with a dumbbell in a gym" className="aspect-[16/11] w-full rounded-3xl object-cover" loading="lazy" />
          <div>
            <SectionHeading eyebrow="Our approach" title="Evidence-led, and honest about it" center={false} />
            <div className="space-y-6">
              <div className="flex gap-4">
                <Microscope className="h-8 w-8 shrink-0 text-[var(--color-accent)]" />
                <div>
                  <h3 className="text-lg">The dose on the front</h3>
                  <p className="text-[var(--color-muted)]">The amount per serving is printed big on every bottle, and our guides compare it with what studies used.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Sprout className="h-8 w-8 shrink-0 text-[var(--color-accent)]" />
                <div>
                  <h3 className="text-lg">Evidence, graded honestly</h3>
                  <p className="text-[var(--color-muted)]">Every ingredient has a guide with its studies, including the ones that found nothing.</p>
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
      <CommunitySection />

      {/* Noovit Pets teaser, above the FAQ (owner, 17 Nov): "Coming soon" until pet products are on sale. */}
      <section className="pb-4">
        <div className="container px-6">
          <Link href="/pets" className="group grid overflow-hidden rounded-3xl bg-[var(--color-pets-soft)] md:grid-cols-2">
            <div className="p-10 md:p-14">
              <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-pets-dark)]">
                <PawPrint className="h-4 w-4" /> {petsLive ? 'New' : 'Coming soon'} · <Brand /> Pets
              </p>
              <h2 className="text-3xl md:text-4xl">At-home health checks for dogs and cats</h2>
              <p className="mt-3 text-[var(--color-muted)]">Simple urine wellness strips and DNA health tests, so you can spot changes early and know when to call your vet.</p>
              <span className="btn mt-6 bg-[var(--color-pets)] text-[var(--color-navy)] group-hover:brightness-95">{petsLive ? 'Shop Pets' : 'Join the waitlist'}</span>
            </div>
            <img src={PET_IMAGES.teaser} alt="A dog and a cat side by side" className="h-full min-h-64 w-full object-cover" loading="lazy" />
          </Link>
        </div>
      </section>
      <FAQSection faqs={GENERAL_FAQS.slice(0, 5)} />
      <NewsletterSection />


    </>
  );
}
