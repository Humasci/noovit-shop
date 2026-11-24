import type { Metadata } from 'next';
import { ShopBrowser, TypeFilter } from '@/components/shop/ShopBrowser';
import { getStoreCollections, getStoreProducts } from '@/lib/catalog/server';
import { PRODUCT_TYPES } from '@/data/products';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageLd } from '@/lib/structured-data';
import { productPath } from '@/lib/urls';
import { TEST_KITS } from '@/lib/tests';
import { kitSummary } from '@/components/tests/KitCard';

// Human at-home test kits (owner, 24 Nov: tests on the shop page too). Pet kits stay on /pets.
const KITS = TEST_KITS.filter((k) => !k.pets).map(kitSummary);

export const metadata: Metadata = {
  title: 'Shop Supplements and At-Home Tests | Noovit',
  description: 'Evidence-led supplements for sleep, stress, focus, joints, skin and energy, plus at-home health tests (coming soon). Filter by vegan, gluten-free and more.',
  alternates: { canonical: '/shop' },
};

const TYPES: string[] = ['all', 'best-sellers', 'tests', ...PRODUCT_TYPES.map((t) => t.value)];

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
      kits={KITS}
      initialType={initialType}
      collections={collections.map((c) => ({ slug: c.slug, title: c.title }))}
    />
    </>
  );
}
