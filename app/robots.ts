import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { siteLive } from '@/lib/launch';

export default function robots(): MetadataRoute.Robots {
  return {
    // /cart and /account stay crawlable so Google can see their noindex tags.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/checkout', '/partner/', '/r/'] },
    // Pre-launch: no sitemap; pages stay crawlable so Google can read the noindex header.
    ...(siteLive() ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
