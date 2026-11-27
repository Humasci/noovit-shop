import type { MetadataRoute } from 'next';
import { getStoreCollections, getStoreProducts } from '@/lib/catalog/server';
import { SITE_URL, productImageUrl } from '@/lib/site';
import { getPublishedPosts } from '@/lib/blog';
import { GOAL_PAGES } from '@/lib/goals';
import { GUIDES } from '@/lib/guides';
import { ADVISORS } from '@/data/content';
import { siteLive } from '@/lib/launch';
import { PUBLIC_EARLY_GUIDES, PUBLIC_EARLY_PROGRAMS } from '@/lib/public-early';
import { MEN_LIVE } from '@/lib/men';
import { TEST_KITS } from '@/lib/tests';
import { productPath } from '@/lib/urls';

// Always current (prices, products, launch switch): built per request, the catalog itself is cached.
export const dynamic = 'force-dynamic';

const PAGES = ['', '/womens-health', ...(MEN_LIVE ? ['/mens-health'] : []), '/at-home-tests', ...TEST_KITS.map((k) => `/at-home-tests/${k.slug}`), '/shop', '/stacks', '/quiz', '/about', '/reviews', '/faq', '/contact', '/policies/delivery-returns', '/policies/privacy', '/policies/terms', '/policies/consumer-health-data', '/policies/accessibility', ...PUBLIC_EARLY_PROGRAMS];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pre-launch every page is noindex (the coming-soon page), so listing them would only produce "noindex page in
  // sitemap" errors in Search Console and audits. The full sitemap appears once SITE_LIVE=true (after a redeploy).
  // The guides that are public early (lib/public-early.ts) are listed now.
  if (!siteLive()) return [
    { url: `${SITE_URL}/guides`, changeFrequency: 'weekly', priority: 0.6 },
    ...PUBLIC_EARLY_PROGRAMS.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...GUIDES.filter((g) => PUBLIC_EARLY_GUIDES.includes(g.slug)).map((g) => ({ url: `${SITE_URL}/guides/${g.slug}`, lastModified: g.updated, changeFrequency: 'monthly' as const, priority: 0.7, images: [`${SITE_URL}/guide-image/${g.slug}`] })),
  ];
  const [products, collections, posts] = await Promise.all([getStoreProducts(), getStoreCollections(), getPublishedPosts()]);
  // /blog is listed only once it has posts (noindex until then). /pets always: its at-home kits are content.
  const pages = [...PAGES, '/pets', ...(posts.length ? ['/blog'] : [])];
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.6 })),
    { url: `${SITE_URL}/guides`, changeFrequency: 'weekly' as const, priority: 0.6 },
    ...ADVISORS.filter((a) => a.slug).map((a) => ({ url: `${SITE_URL}/experts/${a.slug}`, changeFrequency: 'monthly' as const, priority: 0.4 })),
    ...GUIDES.map((g) => ({ url: `${SITE_URL}/guides/${g.slug}`, lastModified: g.updated, changeFrequency: 'monthly' as const, priority: 0.7, images: [`${SITE_URL}/guide-image/${g.slug}`] })),
    ...GOAL_PAGES.map((g) => ({ url: `${SITE_URL}/goals/${g.slug}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
    // Image entries help Google Images / Shopping find the bottle photos.
    ...products.map((p) => ({ url: `${SITE_URL}${productPath(p.slug)}`, changeFrequency: 'weekly' as const, priority: 0.8, images: [productImageUrl(p)] })),
    ...collections.map((c) => ({ url: `${SITE_URL}/collections/${c.slug}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5, images: [p.coverImage ? (p.coverImage.startsWith('/') ? `${SITE_URL}${p.coverImage}` : p.coverImage) : `${SITE_URL}/journal-image/${p.slug}`] })),
  ];
}
