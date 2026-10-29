import { Product } from '@/types';

// The company behind the store (Wyoming LLC): footer, policies, label, emails, structured data.
export const LEGAL_NAME = 'Noovit LLC';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://noovit.com').replace(/\/$/, '');

export const productUrl = (p: Product) => `${SITE_URL}/products/${p.slug}`;

// Uploaded photo if there is one, otherwise a PNG render of the mockup (feeds and social cards can't use SVG).
export const productImageUrl = (p: Product) => p.images[0] ?? `${SITE_URL}/product-image/${p.slug}`;
