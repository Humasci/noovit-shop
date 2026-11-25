import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { dbConfigured, stripeConfigured } from '@/lib/config';
import { ACCOUNT_COOKIE, ACCOUNT_HINT, ACCOUNT_TTL, CHECKOUT_COOKIE, accountSessionToken } from '@/lib/account/session';

// Stripe sends buyers here after paying. If this browser started that checkout (cookie set by /api/checkout), the
// session is paid and recent, sign the buyer in so their order is in "My Account" straight away. Then the success page.
// A session id copied from somewhere else (e.g. an analytics URL) signs nobody in: the cookie must match.
export async function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const id = req.nextUrl.searchParams.get('session_id') ?? '';
  const res = NextResponse.redirect(`${origin}/checkout/success?session_id=${encodeURIComponent(id)}`);
  const started = req.cookies.get(CHECKOUT_COOKIE)?.value;
  if (!id || !started || started !== id || !stripeConfigured() || !dbConfigured()) return res;
  res.cookies.delete({ name: CHECKOUT_COOKIE, path: '/api/account' });
  try {
    const session = await stripe().checkout.sessions.retrieve(id);
    const email = session.customer_details?.email?.trim().toLowerCase();
    const fresh = session.created && Date.now() / 1000 - session.created < 4 * 3600;
    if (session.status !== 'complete' || !fresh || !email) return res;
    const secure = origin.startsWith('https:');
    res.cookies.set(ACCOUNT_COOKIE, accountSessionToken(email), { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: ACCOUNT_TTL });
    res.cookies.set(ACCOUNT_HINT, '1', { secure, sameSite: 'lax', path: '/', maxAge: ACCOUNT_TTL });
  } catch (e) {
    console.error('After-checkout sign-in skipped', e);
  }
  return res;
}
