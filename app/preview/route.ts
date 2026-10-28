import { NextRequest, NextResponse } from 'next/server';
import { PREVIEW_COOKIE, PREVIEW_TTL, isPreviewToken, previewToken } from '@/lib/launch';
import { adminConfigured } from '@/lib/admin/session';

// Opens the full store during pre-launch: /preview?token=… (link from the admin overview) sets a 30-day cookie.
export function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!adminConfigured() || !isPreviewToken(token)) return NextResponse.redirect(new URL('/coming-soon', req.url));
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set(PREVIEW_COOKIE, previewToken(), {
    httpOnly: true,
    secure: req.nextUrl.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    maxAge: PREVIEW_TTL,
  });
  return res;
}
