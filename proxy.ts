import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminConfigured, isAdminToken } from '@/lib/admin/session';
import { signToken, verifyToken } from '@/lib/sign';

// Hidden admin entrance. When ADMIN_PATH is set, /admin answers 404 to anyone who hasn't
// first opened /<ADMIN_PATH> on this browser (which sets a signed "gate" cookie) or isn't
// already signed in. Unset = /admin is reachable directly (local development).
const GATE_COOKIE = 'noovit_gate';
const GATE_TTL = 90 * 86_400;
const adminPath = () => process.env.ADMIN_PATH?.replace(/^\/+|\/+$/g, '') || null;

const hasGate = (req: NextRequest) => Boolean(verifyToken<{ gate?: number }>(req.cookies.get(GATE_COOKIE)?.value)?.gate);
const notFound = (req: NextRequest) => NextResponse.rewrite(new URL('/__not-found', req.url));

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = adminPath();
  const signedIn = isAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);

  if (secret && pathname === `/${secret}`) {
    if (!adminConfigured()) return notFound(req);
    const res = NextResponse.redirect(new URL(signedIn ? '/admin' : '/admin/login', req.url));
    res.cookies.set(GATE_COOKIE, signToken({ gate: 1 }, GATE_TTL), {
      httpOnly: true,
      secure: req.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: GATE_TTL,
    });
    return res;
  }

  if (pathname !== '/admin' && !pathname.startsWith('/admin/')) return NextResponse.next();
  if (secret && !signedIn && !(adminConfigured() && hasGate(req))) return notFound(req);
  if (pathname === '/admin/login' || signedIn) return NextResponse.next();
  return NextResponse.redirect(new URL('/admin/login', req.url));
}

// Runs on pages (not static assets, APIs or feeds) so it can see the secret entrance path.
export const config = { matcher: ['/((?!_next/|api/|feeds/|product-image/|favicon).*)'] };
