import { signToken, verifyToken } from '@/lib/sign';

// Pre-launch mode is ON unless SITE_LIVE=true (set it in Vercel and redeploy to launch).
// While it's on: visitors see /coming-soon, every response carries X-Robots-Tag: noindex,
// and signed-in staff or anyone with a preview link sees the full store.
export const siteLive = () => process.env.SITE_LIVE === 'true';

export const PREVIEW_COOKIE = 'noovit_preview';
export const PREVIEW_TTL = 30 * 86_400;

export const previewToken = () => signToken({ preview: 'store' }, PREVIEW_TTL);
export const isPreviewToken = (token: string | undefined | null) => verifyToken<{ preview?: string }>(token)?.preview === 'store';
