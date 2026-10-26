import type { MetadataRoute } from 'next';
import { getStoreCollections, getStoreProducts } from '@/lib/catalog/server';
import { SITE_URL } from '@/lib/site';
import { getPublishedPosts } from '@/lib/blog';

const PAGES = ['', '/shop', '/pets', '/blog', '/about', '/reviews', '/faq', '/contact', '/policies/delivery-returns', '/policies/privacy', '/policies/terms'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, posts] = await Promise.all([getStoreProducts(), getStoreCollections(), getPublishedPosts()]);
  return [
    ...PAGES.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.6 })),
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...collections.map((c) => ({ url: `${SITE_URL}/collections/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
