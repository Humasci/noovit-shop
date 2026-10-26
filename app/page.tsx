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
import { Stars } from '@/components/ui/Stars';
import { ProductImage } from '@/components/product/ProductImage';
import { getProductBySlug } from '@/data/products';
import { EXPERTS, GENERAL_FAQS, IMAGES, PET_IMAGES } from '@/data/content';

// PLACEHOLDER: swap these for press/retailer logos once you have them.
const MARQUEE = ['Clean Ingredients', 'Third-Party Tested', 'GMP Certified', 'Nutritionist Formulated', 'Made in the USA', 'Vegan Options', '90-Day Guarantee'];

const SPOTLIGHT = ['probiotic-complex', 'glucosamine-complex', 'turmeric-complex', 'marine-collagen-complex'];

export default function HomePage() {
  const spotlight = SPOTLIGHT.map((s) => getProductBySlug(s)!);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={IMAGES.hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10" />
        <div className="container relative px-6 py-20 md:py-32">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
              <Stars size={14} /> 4.8/5 from 25,000+ customers
            </div>
            <h1 className="text-balance text-4xl md:text-6xl">Feel the difference of supplements done right.</h1>
            <p className="mt-5 text-lg text-[var(--color-ink)]/80">
              Clean, nutritionist-formulated supplements made in the USA and third-party tested — for gut health, sleep, joints, skin and energy.
            </p>
            <Link href="/shop" className="btn btn-primary mt-8">
              Shop Now
            </Link>
            <ul className="mt-6 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:gap-6">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--color-green)]" /> 90-day money-back guarantee</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--color-green)]" /> Free delivery</li>
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

      <BestSellers />

      <TrustSection />

      {/* Product spotlight */}
      <section className="section">
        <div className="container px-6">
          <div className="grid items-center gap-10 rounded-3xl bg-[var(--color-navy)] p-8 text-white md:grid-cols-2 md:p-14">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#93c5fd]">Customer favourites</p>
              <h2 className="text-3xl text-white md:text-4xl">Our most-loved formulas</h2>
              <ul className="mt-6 space-y-3">
                {spotlight.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} className="flex items-center gap-3 text-lg font-semibold hover:text-[#93c5fd]">
                      <Stars size={14} /> {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/shop" className="btn mt-8 bg-white text-[var(--color-navy)] hover:bg-[#93c5fd]">
                Shop Now
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {spotlight.map((p) => (
                <ProductImage key={p.slug} product={p} className="aspect-square w-full rounded-2xl" />
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
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-pets)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white">
                <PawPrint className="h-4 w-4" /> New · Noovit Pets
              </p>
              <h2 className="text-3xl md:text-4xl">Clean supplements for dogs and cats</h2>
              <p className="mt-3 text-[var(--color-muted)]">Vet-formulated chews and powders for digestion, joints, calm and coat — in the same cart as yours.</p>
              <span className="btn mt-6 bg-[var(--color-pets)] text-white group-hover:bg-[var(--color-pets-dark)]">Shop Pets</span>
            </div>
            <img src={PET_IMAGES.hero} alt="A cat and dog cuddling" className="h-full min-h-64 w-full object-cover" loading="lazy" />
          </Link>
        </div>
      </section>

      {/* Nutritionists */}
      <section className="section bg-[var(--color-soft)]">
        <div className="container grid gap-12 px-6 lg:grid-cols-[1fr_2fr]">
          <div>
            <SectionHeading eyebrow="Expert formulated" title="Build your routine with our nutritionists" center={false} />
            <p className="-mt-6 text-[var(--color-muted)]">Every formula is reviewed by our panel of qualified nutrition professionals.</p>
            <Link href="/shop" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-blue)]">
              Explore our best sellers <ArrowRight className="h-4 w-4" />
            </Link>
            <div>
              <Link href="/shop" className="btn btn-primary mt-6">Shop Now</Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {EXPERTS.map((e, i) => (
              <div key={i} className="flex gap-4 rounded-2xl bg-white p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-lg font-bold text-white">
                  {e.credentials[0]}
                </div>
                <div>
                  <p className="font-bold">{e.name}</p>
                  <p className="text-xs font-semibold text-[var(--color-blue)]">{e.credentials}</p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">&ldquo;{e.quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section">
        <div className="container grid items-center gap-12 px-6 md:grid-cols-2">
          <img src={IMAGES.approach} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover" loading="lazy" />
          <div>
            <SectionHeading eyebrow="Our approach" title="Nutrition backed by evidence, made for real life" center={false} />
            <div className="space-y-6">
              <div className="flex gap-4">
                <Microscope className="h-8 w-8 shrink-0 text-[var(--color-blue)]" />
                <div>
                  <h3 className="text-lg">Researched doses</h3>
                  <p className="text-[var(--color-muted)]">We use the forms and amounts studied in research — not pixie dust.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Sprout className="h-8 w-8 shrink-0 text-[var(--color-blue)]" />
                <div>
                  <h3 className="text-lg">Nothing you don&apos;t need</h3>
                  <p className="text-[var(--color-muted)]">No artificial colours, fillers or unnecessary additives.</p>
                </div>
              </div>
            </div>
            <Link href="/about" className="mt-8 inline-flex items-center gap-1 font-bold text-[var(--color-blue)]">
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <ReviewsSection />
      <FAQSection faqs={GENERAL_FAQS.slice(0, 5)} />
      <CommunitySection />
      <NewsletterSection />
      <SubscriptionPerks />
    </>
  );
}
