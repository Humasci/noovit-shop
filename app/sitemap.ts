import type { MetadataRoute } from 'next';
import { getStoreProducts } from '@/lib/catalog/server';
import { SITE_URL } from '@/lib/site';

const PAGES = ['', '/shop', '/pets', '/about', '/reviews', '/faq', '/contact', '/policies/delivery-returns', '/policies/privacy', '/policies/terms'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getStoreProducts();
  return [
    ...PAGES.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.6 })),
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
  ];
}
