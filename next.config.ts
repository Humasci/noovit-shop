import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Native PNG renderer for product images; its fonts are read from assets/fonts at runtime.
  serverExternalPackages: ['@resvg/resvg-js'],
  outputFileTracingIncludes: {
    '/product-image/[slug]': ['./assets/fonts/**/*'],
    '/product-image/[slug]/[file]': ['./assets/fonts/**/*'],
  },
  images: {
    // Bottle mockups are rendered by our own route and resized/converted by next/image.
    localPatterns: [{ pathname: '/product-image/**', search: '' }],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
  async headers() {
    return [
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
