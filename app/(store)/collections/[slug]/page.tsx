import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getStoreCollections, getStoreProducts } from '@/lib/catalog/server';
import { ProductCard } from '@/components/product/ProductCard';
import { TrustSection } from '@/components/sections/Sections';

async function load(slug: string) {
  const collection = (await getStoreCollections()).find((c) => c.slug === slug);
  if (!collection) return null;
  const products = await getStoreProducts();
  const items = collection.productSlugs.map((s) => products.find((p) => p.slug === s)).filter((p) => p !== undefined);
  return { collection, items };
}

export async function generateStaticParams() {
  return (await getStoreCollections()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await load((await params).slug);
  if (!data) return {};
  const { collection: c } = data;
  return {
    title: c.seoTitle || `${c.title} — Noovit`,
    description: c.seoDescription || c.description,
    alternates: { canonical: `/collections/${c.slug}` },
    ...(c.image ? { openGraph: { images: [{ url: c.image }] } } : {}),
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const data = await load((await params).slug);
  if (!data) notFound();
  const { collection, items } = data;

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-soft)]">
        {collection.image && (
          <>
            <img src={collection.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/20" />
          </>
        )}
        <div className="container relative px-6 py-16 md:py-24">
          <nav className="mb-4 text-xs text-[var(--color-muted)]">
            <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / <span className="text-[var(--color-ink)]">{collection.title}</span>
          </nav>
          <h1 className="max-w-2xl text-balance text-4xl md:text-5xl">{collection.title}</h1>
          {collection.description && <p className="mt-4 max-w-xl text-lg text-[var(--color-ink)]/80">{collection.description}</p>}
        </div>
      </section>
      <section className="section">
        <div className="container px-6">
          {items.length === 0 ? (
            <p className="text-center text-[var(--color-muted)]">No products here yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
      <TrustSection />
    </>
  );
}
