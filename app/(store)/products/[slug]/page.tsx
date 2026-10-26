import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Leaf, MapPin, FlaskConical, Sparkles, Gem, BadgeDollarSign, ShieldCheck, Zap, BadgeCheck } from 'lucide-react';
import { products, getProductBySlug, getPetProducts } from '@/data/products';
import { REVIEWS, PET_REVIEWS } from '@/data/content';
import { Gallery, PurchaseBox, InfoTabs } from '@/components/product/ProductClient';
import { ProductCard } from '@/components/product/ProductCard';
import { Stars } from '@/components/ui/Stars';
import { ReviewsModule } from '@/components/reviews/ReviewsModule';
import { ReviewsSection, FAQSection, SubscriptionPerks, SectionHeading } from '@/components/sections/Sections';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  return product ? { title: `${product.name} — Noovit`, description: product.description } : {};
}

const VALUES = [
  { icon: Sparkles, title: 'Effective Nutrition', text: 'Researched forms and doses.' },
  { icon: Leaf, title: 'Clean Ingredients', text: 'No artificial colours or fillers.' },
  { icon: Gem, title: 'Premium Formulas', text: 'Made in GMP-certified facilities.' },
  { icon: BadgeDollarSign, title: '90-Day Guarantee', text: 'Love it or get your money back.' },
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();

  const isPet = product.productType === 'pets';
  const productReviews = [...(isPet ? PET_REVIEWS : REVIEWS)].sort(
    (a, b) => Number(b.productSlug === product.slug) - Number(a.productSlug === product.slug)
  );
  const related = (isPet ? getPetProducts() : products.filter((p) => p.bestSeller)).filter((p) => p.id !== product.id).slice(0, 4);
  const quality = [
    isPet
      ? { icon: Leaf, label: 'Vet Formulated' }
      : { icon: Leaf, label: product.dietaryTags.includes('vegan') ? 'Vegan & Gluten-Free' : 'Gluten-Free' },
    { icon: MapPin, label: 'Made in the USA' },
    { icon: FlaskConical, label: '3rd Party Tested' },
  ];

  return (
    <>
      <nav className="container px-6 pt-6 text-xs text-[var(--color-muted)]">
        <Link href="/">Home</Link> / {isPet ? <Link href="/pets">Noovit Pets</Link> : <Link href="/shop">Shop</Link>} / <span className="text-[var(--color-ink)]">{product.name}</span>
      </nav>

      <section className="container grid gap-10 px-6 py-8 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Gallery product={product} />
        </div>
        <div>
          <div className="flex gap-2">
            {isPet && (
              <span className="rounded-full bg-[var(--color-pets)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                Noovit Pets · {product.species?.map((s) => (s === 'dog' ? 'Dogs' : 'Cats')).join(' & ')}
              </span>
            )}
            {product.bestSeller && (
              <span className="rounded-full bg-[var(--color-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-navy)]">
                Best Seller
              </span>
            )}
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl">{product.name}</h1>
          <a href="#write" className="mt-3 flex items-center gap-2 text-sm">
            <Stars rating={product.rating} /> <span className="font-semibold">{product.reviewCount.toLocaleString()} Reviews</span>
          </a>
          <p className="mt-4 text-lg text-[var(--color-muted)]">{product.shortBenefit}</p>

          <div className="mt-6">
            <PurchaseBox product={product} />
          </div>

          {/* PLACEHOLDER: replace with a real nutritionist's note, photo and signature. */}
          <figure className="mt-8 flex gap-4 rounded-2xl border border-[var(--color-line)] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] font-bold text-white">{isPet ? 'V' : 'N'}</div>
            <div>
              <blockquote className="text-sm italic">
                &ldquo;{product.name} is one I recommend often — it {product.shortBenefit.charAt(0).toLowerCase() + product.shortBenefit.slice(1)}&rdquo;
              </blockquote>
              <figcaption className="mt-2 text-xs font-bold">
                {isPet ? 'Vet Advisor Name' : 'Advisor Name'}{' '}
                <span className="font-semibold text-[var(--color-blue)]">· {isPet ? 'DVM' : 'Registered Nutritionist'}</span>
              </figcaption>
            </div>
          </figure>

          <div className="mt-8">
            <InfoTabs product={product} />
          </div>
        </div>
      </section>

      {/* Review snippets */}
      <section className="section bg-[var(--color-soft)]">
        <div className="container px-6">
          <SectionHeading title="See what people think" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productReviews.slice(0, 4).map((r) => (
              <article key={r.id} className="rounded-2xl bg-white p-5">
                <Stars rating={r.rating} size={14} />
                <p className="mt-3 text-sm">{r.body}</p>
                <p className="mt-3 flex items-center gap-1 text-xs font-bold">
                  {r.name} <BadgeCheck className="h-3.5 w-3.5 text-[var(--color-green)]" />
                  <span className="font-semibold text-[var(--color-green)]">Verified Buyer</span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section">
        <div className="container px-6">
          <SectionHeading title={isPet ? 'More for your pet' : 'Build your health routine'} sub="Pairs well with" />
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Ingredient quality */}
      <section className="section bg-[var(--color-soft)]">
        <div className="container px-6">
          <SectionHeading eyebrow="Inside the bottle" title="Ingredients that earn their place" />
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {quality.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold">
                <Icon className="h-4 w-4 text-[var(--color-blue)]" /> {label}
              </span>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {product.ingredients.slice(0, 3).map((i) => (
              <div key={i.name} className="rounded-2xl bg-white p-6">
                <p className="text-sm font-bold text-[var(--color-blue)]">{i.amount}</p>
                <h3 className="mt-1 text-lg">{i.name}</h3>
                {i.description && <p className="mt-2 text-sm text-[var(--color-muted)]">{i.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand values */}
      <section className="section">
        <div className="container px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-[var(--color-line)] p-6">
                <Icon className="h-8 w-8 text-[var(--color-blue)]" strokeWidth={1.5} />
                <h3 className="mt-4 text-lg">{title}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/about" className="font-bold text-[var(--color-blue)]">Learn More →</Link>
          </div>
        </div>
      </section>

      <ReviewsSection reviews={isPet ? PET_REVIEWS : undefined} title={isPet ? 'Happy pets, happy parents' : undefined} />

      {/* Benefits grid */}
      <section className="section bg-[var(--color-navy)] text-white">
        <div className="container px-6">
          <h2 className="mb-10 text-center text-3xl text-white md:text-4xl">Why {product.name}?</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {product.benefits.map((b, i) => {
              const Icon = [Zap, ShieldCheck, Sparkles, Leaf][i % 4];
              return (
                <div key={b} className="rounded-2xl bg-white/5 p-6">
                  <Icon className="h-8 w-8 text-[#93c5fd]" strokeWidth={1.5} />
                  <p className="mt-4 font-semibold">{b}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FAQSection faqs={product.faqs} />
      <SubscriptionPerks />
      <ReviewsModule reviews={productReviews} total={product.reviewCount} rating={product.rating} productSlug={product.slug} />
    </>
  );
}
