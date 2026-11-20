import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // /cart and /account stay crawlable so Google can see their noindex tags.
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/checkout', '/partner/', '/r/'] },
    // Pre-launch the sitemap lists only the guides that are public early; other pages stay crawlable so Google can read
    // their noindex header.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
