import { NextRequest, NextResponse } from 'next/server';
import { ACCOUNT_COOKIE, ACCOUNT_HINT, ACCOUNT_TTL, accountSessionToken, emailFromLinkToken } from '@/lib/account/session';

// The link from the sign-in email lands here: valid → set the 30-day session cookie and open the account page.
export function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const email = emailFromLinkToken(req.nextUrl.searchParams.get('token'));
  if (!email) return NextResponse.redirect(`${origin}/account?expired=1`);
  const res = NextResponse.redirect(`${origin}/account`);
  res.cookies.set(ACCOUNT_COOKIE, accountSessionToken(email), { httpOnly: true, secure: origin.startsWith('https:'), sameSite: 'lax', path: '/', maxAge: ACCOUNT_TTL });
  res.cookies.set(ACCOUNT_HINT, '1', { secure: origin.startsWith('https:'), sameSite: 'lax', path: '/', maxAge: ACCOUNT_TTL });
  res.headers.set('Referrer-Policy', 'no-referrer');
  return res;
}
