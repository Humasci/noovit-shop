import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, isAdminToken } from '@/lib/admin/session';

export function proxy(req: NextRequest) {
  if (req.nextUrl.pathname === '/admin/login') return NextResponse.next();
  if (isAdminToken(req.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next();
  return NextResponse.redirect(new URL('/admin/login', req.url));
}

export const config = { matcher: ['/admin/:path*'] };
