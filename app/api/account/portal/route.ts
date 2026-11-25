import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { verifyToken } from '@/lib/sign';
import { db } from '@/lib/db/server';
import { dbConfigured, stripeConfigured } from '@/lib/config';
import { accountEmail } from '@/lib/account/session';

// Opens Stripe's customer portal (card, address, invoices, cancel). Two ways in: the signed-in account session
// (the "Manage" button on /account), or a token from an older "manage your subscription" email.
export async function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  if (!stripeConfigured()) return NextResponse.redirect(`${origin}/account`);
  let cid = verifyToken<{ cid: string }>(req.nextUrl.searchParams.get('token'))?.cid ?? null;
  if (!cid && dbConfigured()) {
    const email = await accountEmail();
    if (email) {
      const { data } = await db().from('customers').select('stripe_customer_id').eq('email', email).maybeSingle();
      cid = data?.stripe_customer_id ?? null;
    }
  }
  if (!cid) return NextResponse.redirect(`${origin}/account?expired=1`);
  const session = await stripe().billingPortal.sessions.create({ customer: cid, return_url: `${origin}/account` });
  return NextResponse.redirect(session.url);
}
