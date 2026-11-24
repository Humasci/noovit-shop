import { signToken, verifyToken } from '@/lib/sign';

// Pre-launch mode is ON unless SITE_LIVE=true (set it in Vercel and redeploy to launch).
// While it's on: visitors see /coming-soon, every response carries X-Robots-Tag: noindex,
// and signed-in staff or anyone with a preview link sees the full store.
export const siteLive = () => process.env.SITE_LIVE === 'true';

// Public checkout also needs live Stripe keys (24 Nov: the site went live early so the bank could review product pages).
// With test keys, only staff and preview-link holders can check out; everyone else is told orders open soon.
// The e2e suites run against a fake Stripe (STRIPE_MOCK_PORT), which counts as live.
export const stripeLive = () => /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? '') || !!process.env.STRIPE_MOCK_PORT;
// "Coming soon" mode for products (owner, 24 Nov): buy buttons become "Notify me" until ORDERS_OPEN=true in Vercel,
// and orders also need live Stripe keys. Staff and preview links can still reach checkout (for the test order).
export const ordersOpen = () => process.env.ORDERS_OPEN === 'true' && stripeLive();
export { SHOP_PREVIEW_HINT } from '@/lib/shop-preview';
export const ORDERS_SOON = 'Orders open in a few days. Sign up for our emails and we’ll tell you the moment they do.';

export const PREVIEW_COOKIE = 'noovit_preview';
export const PREVIEW_TTL = 30 * 86_400;

export const previewToken = () => signToken({ preview: 'store' }, PREVIEW_TTL);
export const isPreviewToken = (token: string | undefined | null) => verifyToken<{ preview?: string }>(token)?.preview === 'store';
