import type { Metadata } from 'next';
import { ShopBrowser, TypeFilter } from '@/components/shop/ShopBrowser';
import { getStoreCollections, getStoreProducts } from '@/lib/catalog/server';
import { PRODUCT_TYPES } from '@/data/products';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';
import { productPath } from '@/lib/urls';

export const metadata: Metadata = {
  title: 'Shop All Supplements: Evidence-Led, Clear Doses | Noovit',
  description: 'Clean, science-driven supplements for gut health, sleep, joints, skin, energy, sports and pets. Filter by vegan, gluten-free and more.',
  alternates: { canonical: '/shop' },
};

const TYPES: string[] = ['all', 'best-sellers', ...PRODUCT_TYPES.map((t) => t.value)];

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const initialType = (type && TYPES.includes(type) ? type : 'all') as TypeFilter;
  const [products, collections] = await Promise.all([getStoreProducts(), getStoreCollections()]);
  return (
    <>
    <JsonLd data={pageLd({ path: '/shop', name: 'Shop all supplements', crumbs: [['Shop', '/shop']], items: products.map((p) => ({ name: p.name, path: productPath(p.slug) })) })} />
    <ShopBrowser
      key={initialType}
      products={products}
      initialType={initialType}
      collections={collections.map((c) => ({ slug: c.slug, title: c.title }))}
    />
    </>
  );
}
