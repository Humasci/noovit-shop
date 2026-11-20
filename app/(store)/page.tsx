import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, ArrowRight, PawPrint } from 'lucide-react';
import { CommunitySection, FAQSection, NewsletterSection, SubscriptionPerks } from '@/components/sections/Sections';
import { ProductImage } from '@/components/product/ProductImage';
import { findProduct, petProducts } from '@/data/products';
import { getStoreProducts } from '@/lib/catalog/server';
import { getContent, lines, safeLink } from '@/lib/content';
import { JsonLd } from '@/components/seo/JsonLd';
import { LEGAL_NAME, SITE_URL } from '@/lib/site';
import { GENERAL_FAQS, IMAGES, MEN_IMAGES, PET_IMAGES, WOMEN_IMAGES } from '@/data/content';
import { unsplashSrcSet } from '@/lib/utils/format';
import { Brand, brandify } from '@/components/brand/Brand';
import { AskButton } from '@/components/advisor/AskButton';
import { advisorEnabled } from '@/lib/advisor';
import { WOMEN_FEATURED } from '@/lib/women';
import { MEN_FEATURED, MEN_LIVE } from '@/lib/men';

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
  // Homepage order (owner, 20 Nov): hero · shop by goal · subscription · Women · Men · Pets · community · quiz · FAQ ·
  // newsletter. (Values row, Lion's Mane masonry, evidence band, AI promo, advisors, approach and reviews removed.)
  const [products, content] = await Promise.all([getStoreProducts(), getContent()]);
  const tiles = GOAL_TILES.map((t) => ({ ...t, product: findProduct(products, t.slug) })).filter((t) => t.product && t.product.status !== 'hidden').slice(0, 4);
  const ask = advisorEnabled();
  const petsLive = petProducts(products).some((p) => p.status === 'active');
  const men = MEN_FEATURED.map((s) => findProduct(products, s)).filter((p): p is NonNullable<typeof p> => Boolean(p)).slice(0, 3);
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

      {/* Men's Health (owner, 20 Nov): one homepage section per audience: Women, Men, Pets. */}
      {MEN_LIVE && men.length > 0 && (
        <section className="section">
          <div className="container px-6">
            <div className="grid overflow-hidden rounded-3xl bg-[var(--studio)] md:grid-cols-[1fr_1.1fr]">
              <img src={MEN_IMAGES.banner} alt="A runner sprinting at sunset" className="h-64 w-full object-cover md:h-full" loading="lazy" />
              <div className="flex flex-col justify-center p-8 md:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-navy)]/70">Men&apos;s Health</p>
                <h2 className="mt-3 text-balance text-3xl text-[var(--color-navy)] md:text-[2.6rem] md:leading-tight">Strength, focus and recovery, backed by evidence</h2>
                <p className="mt-4 max-w-md text-[var(--color-ink)]/80">Creatine for strength and power, lion&apos;s mane and CoQ10 for focus and energy, magnesium and ashwagandha for sleep and stress.</p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {men.map((p) => (
                    <Link key={p.id} href={`/products/${p.slug}`} className="group text-center">
                      <ProductImage product={p} sizes="(min-width: 768px) 12vw, 30vw" className="mx-auto aspect-square w-full [mask-image:radial-gradient(closest-side,#000_72%,transparent)] transition-transform duration-700 group-hover:scale-[1.04]" />
                      <span className="mt-1 block text-xs font-semibold text-[var(--color-navy)] md:text-sm">{p.name}</span>
                    </Link>
                  ))}
                </div>
                <Link href="/men" className="btn btn-primary mt-7 self-start">Shop Men&apos;s Health</Link>
              </div>
              
            </div>
          </div>
        </section>
      )}

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
      <CommunitySection />

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

      <FAQSection faqs={GENERAL_FAQS.slice(0, 5)} />
      <NewsletterSection />
    </>
  );
}
