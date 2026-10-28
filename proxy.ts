import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminConfigured, isAdminToken } from '@/lib/admin/session';
import { signToken, verifyToken } from '@/lib/sign';
import { PREVIEW_COOKIE, isPreviewToken, siteLive } from '@/lib/launch';

// Hidden admin entrance. When ADMIN_PATH is set, /admin answers 404 to anyone who hasn't
// first opened /<ADMIN_PATH> on this browser (which sets a signed "gate" cookie) or isn't
// already signed in. Unset = /admin is reachable directly (local development).
const GATE_COOKIE = 'noovit_gate';
const GATE_TTL = 90 * 86_400;
const adminPath = () => process.env.ADMIN_PATH?.replace(/^\/+|\/+$/g, '') || null;

// The gate is tied to the current ADMIN_PATH, so changing the address revokes every gate already issued.
const gateId = (path: string) => createHash('sha256').update(path).digest('base64url').slice(0, 16);
const hasGate = (req: NextRequest, path: string) => verifyToken<{ gate?: string }>(req.cookies.get(GATE_COOKIE)?.value)?.gate === gateId(path);
const notFound = (req: NextRequest) => NextResponse.rewrite(new URL('/__not-found', req.url));

// Pre-launch: everything a shopper could open goes to /coming-soon, except for signed-in staff and preview-link holders.
// Admin, the preview link, robots/sitemap and files (anything with an extension) stay reachable.
const OPEN_PATHS = /^\/(admin|coming-soon|preview|unsubscribe|__not-found)(\/|$)/;
const gated = (pathname: string) => !OPEN_PATHS.test(pathname) && !/\.[a-z0-9]+$/i.test(pathname);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = adminPath();
  const signedIn = isAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);

  if (!siteLive() && gated(pathname) && !signedIn && !(adminConfigured() && isPreviewToken(req.cookies.get(PREVIEW_COOKIE)?.value))) {
    if (!(secret && pathname === `/${secret}`)) return NextResponse.rewrite(new URL('/coming-soon', req.url));
  }

  if (secret && pathname === `/${secret}`) {
    if (!adminConfigured()) return notFound(req);
    const res = NextResponse.redirect(new URL(signedIn ? '/admin' : '/admin/login', req.url));
    res.cookies.set(GATE_COOKIE, signToken({ gate: gateId(secret) }, GATE_TTL), {
      httpOnly: true,
      secure: req.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: GATE_TTL,
    });
    return res;
  }

  if (pathname !== '/admin' && !pathname.startsWith('/admin/')) return NextResponse.next();
  if (secret && !signedIn && !(adminConfigured() && hasGate(req, secret))) return notFound(req);
  if (pathname === '/admin/login' || signedIn) return NextResponse.next();
  return NextResponse.redirect(new URL('/admin/login', req.url));
}

// Runs on pages (not static assets, APIs or feeds) so it can see the secret entrance path.
export const config = { matcher: ['/((?!_next/|api/|feeds/|product-image/|favicon).*)'] };
