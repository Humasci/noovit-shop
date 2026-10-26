import type { Metadata } from 'next';
import { ShopBrowser, TypeFilter } from '@/components/shop/ShopBrowser';
import { getStoreProducts } from '@/lib/catalog/server';
import { PRODUCT_TYPES } from '@/data/products';

export const metadata: Metadata = {
  title: 'Shop All Supplements — Noovit',
  description: 'Clean, science-driven supplements for gut health, sleep, joints, skin, energy, sports and pets. Filter by vegan, gluten-free and more.',
  alternates: { canonical: '/shop' },
};

const TYPES: string[] = ['all', 'best-sellers', ...PRODUCT_TYPES.map((t) => t.value)];

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const initialType = (type && TYPES.includes(type) ? type : 'all') as TypeFilter;
  return <ShopBrowser key={initialType} products={await getStoreProducts()} initialType={initialType} />;
}
