import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getStoreProducts } from '@/lib/catalog/server';
import { getPublishedPosts } from '@/lib/blog';
import { findProduct } from '@/data/products';
import { WOMEN_SECTIONS } from '@/lib/women';
import { ProductCard } from '@/components/product/ProductCard';
import { TrustSection } from '@/components/sections/Sections';
import { IMAGES } from '@/data/content';
import { unsplashSrcSet } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: "Women's Health Supplements: Strength, Sleep, Menopause | Noovit",
  description: "Evidence-led supplements for women: creatine for strength, magnesium glycinate and ashwagandha for sleep and stress, plus support for perimenopause, energy and iron. Free US shipping.",
  alternates: { canonical: '/women' },
};

export default async function WomenPage() {
  const [products, posts] = await Promise.all([getStoreProducts(), getPublishedPosts().catch(() => [])]);
  const live = new Set(posts.map((p) => p.slug));
  const sections = WOMEN_SECTIONS.map((s) => ({
    ...s,
    items: s.products.map((slug) => findProduct(products, slug)).filter((p): p is NonNullable<typeof p> => Boolean(p)),
    // Journal links only once the post is published (scheduled posts would 404).
    guides: s.guides.filter((g) => !g.href.startsWith('/blog/') || live.has(g.href.slice(6))),
  })).filter((s) => s.items.length > 0);

  return (
    <>
      <section className="bg-[var(--studio)]">
        <div className="container grid items-center gap-8 px-6 py-12 md:grid-cols-2 md:py-16">
          <div>
            <nav className="mb-4 text-xs text-[var(--color-muted)]">
              <Link href="/">Home</Link> / <span className="text-[var(--color-ink)]">Women&apos;s Health</span>
            </nav>
            <h1 className="text-balance text-4xl text-[var(--color-navy)] md:text-5xl">Women&apos;s health, backed by evidence</h1>
            <p className="mt-5 max-w-lg text-lg text-[var(--color-ink)]/80">
              Strength, sleep, stress and the changes of midlife. Researched ingredients at clear doses, printed on the front of every bottle.
            </p>
            <nav aria-label="Sections" className="mt-7 flex flex-wrap gap-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--color-navy)] hover:bg-white/70">{s.title}</a>
              ))}
            </nav>
          </div>
          <img
            src={IMAGES.womanTrain}
            srcSet={unsplashSrcSet(IMAGES.womanTrain)}
            sizes="(min-width: 768px) 50vw, 100vw"
            alt="Woman training with weights"
            className="aspect-[4/3] w-full rounded-3xl object-cover"
          />
        </div>
      </section>

      {sections.map((s, i) => (
        <section key={s.id} id={s.id} className={`section scroll-mt-24 ${i % 2 ? 'bg-[var(--color-soft)]' : ''}`}>
          <div className="container px-6">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-3xl md:text-4xl">{s.title}</h2>
              <p className="mt-3 text-[var(--color-ink)]/80">{s.intro}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
              {s.items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {s.guides.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {s.guides.map((g) => (
                  <li key={g.href}>
                    <Link href={g.href} className="inline-flex items-center gap-1 font-semibold text-[var(--color-navy)] hover:underline">{g.label} <ArrowRight className="h-4 w-4" /></Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container px-6">
          <div className="mx-auto max-w-xl rounded-3xl bg-[var(--color-soft)] p-8 text-center">
            <h2 className="text-2xl">Not sure where to start?</h2>
            <p className="mt-2 text-[var(--color-muted)]">The 2-minute quiz suggests products for your goals, diet and life stage.</p>
            <Link href="/quiz" className="btn btn-primary mt-5">Take the quiz</Link>
          </div>
        </div>
      </section>
      <TrustSection />
      <p className="container px-6 pb-10 text-center text-xs text-[var(--color-muted)]">
        Pregnant, breastfeeding, taking medication or managing a health condition? Talk to your doctor before starting a supplement.
        *These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </>
  );
}
