import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Product photos upload one per request; Vercel caps request bodies at 4.5MB.
    serverActions: { bodySizeLimit: '4.5mb' },
  },
};

export default nextConfig;
