import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { GOOGLE_STATE_COOKIE, googleAuthUrl, googleConfigured } from '@/lib/account/google';
import { dbConfigured } from '@/lib/config';

// Step 1 of "Continue with Google": remember a random state value in a short-lived cookie and go to Google.
export function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  if (!googleConfigured() || !dbConfigured()) return NextResponse.redirect(`${origin}/account`);
  const state = randomBytes(24).toString('base64url');
  const res = NextResponse.redirect(googleAuthUrl(origin, state));
  res.cookies.set(GOOGLE_STATE_COOKIE, state, { httpOnly: true, secure: origin.startsWith('https:'), sameSite: 'lax', path: '/api/account/google', maxAge: 600 });
  return res;
}
