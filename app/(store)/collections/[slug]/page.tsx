import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getStoreCollections, getStoreProducts } from '@/lib/catalog/server';
import { ProductCard } from '@/components/product/ProductCard';
import { TrustSection } from '@/components/sections/Sections';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';
import { productPath } from '@/lib/urls';

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
  if (!data) return { title: 'Page not found | Noovit', robots: { index: false } };
  const { collection: c } = data;
  return {
    title: c.seoTitle || (`${c.title} Supplements | Noovit`.length <= 60 && !/supplement/i.test(c.title) ? `${c.title} Supplements | Noovit` : `${c.title} | Noovit`),
    description: c.seoDescription || (c.description && c.description.length >= 70 ? c.description : `${c.title}: ${c.description ? c.description.replace(/\.?$/, '. ') : ''}Evidence-led supplements with every dose clearly labeled. Free US shipping, 90-day guarantee.`.slice(0, 160)),
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
      <JsonLd data={pageLd({ path: `/collections/${collection.slug}`, name: collection.title, crumbs: [['Shop', '/shop'], [collection.title, `/collections/${collection.slug}`]], items: items.map((p) => ({ name: p.name, path: productPath(p.slug) })) })} />
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
