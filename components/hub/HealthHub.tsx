import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getStoreProducts } from '@/lib/catalog/server';
import { getPublishedPosts } from '@/lib/blog';
import { findProduct } from '@/data/products';
import type { WomenSection } from '@/lib/women';
import { ProductCard } from '@/components/product/ProductCard';
import { TrustSection } from '@/components/sections/Sections';
import { MasonryGallery } from '@/components/hub/MasonryGallery';

// Shared layout for the Women's Health and Men's Health hubs: a full-bleed hero photo fading into the page colour
// (like Pets), sections with products and guides, a responsive photo masonry, the quiz and the trust row.
export interface HubConfig {
  crumb: string;
  title: string;
  intro: string;
  hero: { src: string; alt: string; position?: string };
  sections: WomenSection[];
  gallery: { src: string; alt: string }[];
  galleryTitle: string;
  footnote?: string;
}

export async function HealthHub({ cfg }: { cfg: HubConfig }) {
  const [products, posts] = await Promise.all([getStoreProducts(), getPublishedPosts().catch(() => [])]);
  const live = new Set(posts.map((p) => p.slug));
  const sections = cfg.sections
    .map((s) => ({
      ...s,
      items: s.products.map((slug) => findProduct(products, slug)).filter((p): p is NonNullable<typeof p> => Boolean(p)),
      // Journal links only once the post is published (scheduled posts would 404).
      guides: s.guides.filter((g) => !g.href.startsWith('/blog/') || live.has(g.href.slice(6))),
    }))
    .filter((s) => s.items.length > 0);

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--studio)]">
        <img src={cfg.hero.src} alt={cfg.hero.alt} className={`absolute inset-0 h-full w-full object-cover ${cfg.hero.position ?? 'object-center'}`} fetchPriority="high" />
        {/* Phones: a soft wash so the text reads over the photo. From md: solid behind the text only, then the photo
            shows clearly on the right (owner, 20 Nov: "show the picture better"). */}
        <div className="absolute inset-0 bg-[var(--studio)]/75 md:hidden" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[var(--studio)] from-30% via-[var(--studio)]/60 via-45% to-transparent to-65% md:block" />
        <div className="container relative px-6 py-16 md:py-28 lg:py-36">
          <div className="max-w-xl">
            <nav className="mb-4 text-xs text-[var(--color-muted)]">
              <Link href="/">Home</Link> / <span className="text-[var(--color-ink)]">{cfg.crumb}</span>
            </nav>
            <h1 className="text-balance text-4xl text-[var(--color-navy)] md:text-6xl">{cfg.title}</h1>
            <p className="mt-5 text-lg text-[var(--color-ink)]/80">{cfg.intro}</p>
            <nav aria-label="Sections" className="mt-7 flex flex-wrap gap-2">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--color-navy)] hover:bg-white/70">{s.title}</a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {sections.map((s, i) => (
        <section key={s.id} id={s.id} className={`section scroll-mt-24 ${i % 2 ? 'bg-[var(--color-soft)]' : ''}`}>
          <div className="container px-6">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-3xl md:text-4xl">{s.title}</h2>
              <p className="mt-3 text-[var(--color-ink)]/80">{s.intro}</p>
            </div>
            {/* One grid per section (owner, 20 Nov): the photo is a wide tile beside the product cards (alternating
                sides), so rows line up with no empty space. Phones: photo on top, then the cards. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-flow-dense lg:grid-cols-4">
              {s.image && (
                <img
                  src={s.image}
                  alt={s.imageAlt ?? ''}
                  loading="lazy"
                  className={`aspect-[4/3] h-full w-full rounded-3xl object-cover sm:col-span-2 lg:aspect-auto ${i % 2 ? 'lg:col-start-3' : 'lg:col-start-1'} ${s.portrait ? 'object-[center_30%]' : 'object-center'}`}
                />
              )}
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

      <MasonryGallery images={cfg.gallery} title={cfg.galleryTitle} />

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
        {cfg.footnote ?? 'Taking medication or managing a health condition? Talk to your doctor before starting a supplement.'}{' '}
        *These statements have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </>
  );
}
