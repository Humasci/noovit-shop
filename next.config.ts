import type { NextConfig } from 'next';
import { URL_REDIRECTS } from './lib/urls';
import { NOINDEX_SOURCE } from './lib/public-early';

const nextConfig: NextConfig = {
  // Native PNG renderer for product images; fonts (assets/fonts) and the bottle photo template (assets/mockups) are read at runtime.
  serverExternalPackages: ['@resvg/resvg-js', 'sharp'],
  outputFileTracingIncludes: {
    '/product-image/[slug]': ['./assets/fonts/**/*', './assets/mockups/**/*'],
    '/product-image/[slug]/[file]': ['./assets/fonts/**/*', './assets/mockups/**/*'],
    '/guide-image/[slug]': ['./assets/fonts/**/*'],
  },
  images: {
    // Bottle mockups are rendered by our own route and resized/converted by next/image.
    localPatterns: [{ pathname: '/product-image/**', search: '' }],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
  // Descriptive URLs (20 Nov): old addresses redirect permanently (lib/urls.ts).
  async redirects() {
    return URL_REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
  async headers() {
    return [
      // Pre-launch (lib/launch.ts): keep the site out of search results until SITE_LIVE=true, except the guides that are
      // public early (lib/public-early.ts).
      ...(process.env.SITE_LIVE === 'true' ? [] : [{ source: NOINDEX_SOURCE, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]),
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  experimental: {
    // Product photos upload one per request; Vercel caps request bodies at 4.5MB.
    serverActions: { bodySizeLimit: '4.5mb' },
  },
};

export default nextConfig;
