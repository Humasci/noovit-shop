import type { MetadataRoute } from 'next';
import { getStoreCollections, getStoreProducts } from '@/lib/catalog/server';
import { SITE_URL } from '@/lib/site';
import { getPublishedPosts } from '@/lib/blog';
import { petProducts } from '@/data/products';
import { GOAL_PAGES } from '@/lib/goals';

const PAGES = ['', '/shop', '/quiz', '/about', '/reviews', '/faq', '/contact', '/policies/delivery-returns', '/policies/privacy', '/policies/terms'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, posts] = await Promise.all([getStoreProducts(), getStoreCollections(), getPublishedPosts()]);
  // /pets and /blog are listed only once they have content (they are noindex until then).
  const pages = [...PAGES, ...(petProducts(products).length ? ['/pets'] : []), ...(posts.length ? ['/blog'] : [])];
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.6 })),
    ...GOAL_PAGES.map((g) => ({ url: `${SITE_URL}/goals/${g.slug}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...collections.map((c) => ({ url: `${SITE_URL}/collections/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
