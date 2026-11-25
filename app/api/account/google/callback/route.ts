import { NextRequest, NextResponse } from 'next/server';
import { GOOGLE_STATE_COOKIE, googleConfigured, googleEmailFromCode } from '@/lib/account/google';
import { ACCOUNT_COOKIE, ACCOUNT_HINT, ACCOUNT_TTL, accountSessionToken } from '@/lib/account/session';
import { dbConfigured } from '@/lib/config';

// Step 2: Google sends the customer back with a one-time code. State must match the cookie set in step 1; the code
// is swapped for the verified email; then the same 30-day session as the emailed link.
export async function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const fail = () => {
    const r = NextResponse.redirect(`${origin}/account?google=failed`);
    r.cookies.delete({ name: GOOGLE_STATE_COOKIE, path: '/api/account/google' });
    return r;
  };
  if (!googleConfigured() || !dbConfigured()) return fail();
  const q = req.nextUrl.searchParams;
  const state = q.get('state'), code = q.get('code');
  const expected = req.cookies.get(GOOGLE_STATE_COOKIE)?.value;
  if (!code || !state || !expected || state !== expected) return fail();
  const email = await googleEmailFromCode(code, origin);
  if (!email) return fail();

  const res = NextResponse.redirect(`${origin}/account`);
  const secure = origin.startsWith('https:');
  res.cookies.set(ACCOUNT_COOKIE, accountSessionToken(email), { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: ACCOUNT_TTL });
  res.cookies.set(ACCOUNT_HINT, '1', { secure, sameSite: 'lax', path: '/', maxAge: ACCOUNT_TTL });
  res.cookies.delete({ name: GOOGLE_STATE_COOKIE, path: '/api/account/google' });
  res.headers.set('Referrer-Policy', 'no-referrer');
  return res;
}
