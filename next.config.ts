import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Native PNG renderer for product images; its fonts are read from assets/fonts at runtime.
  serverExternalPackages: ['@resvg/resvg-js'],
  outputFileTracingIncludes: { '/product-image/[slug]': ['./assets/fonts/**/*'] },
  experimental: {
    // Product photos upload one per request; Vercel caps request bodies at 4.5MB.
    serverActions: { bodySizeLimit: '4.5mb' },
  },
};

export default nextConfig;
