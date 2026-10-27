import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { dbConfigured, stripeConfigured } from '@/lib/config';
import { db } from '@/lib/db/server';
import { signToken } from '@/lib/sign';
import { sendPortalLink } from '@/lib/email';

const GENERIC = { message: "If there's a Noovit account for that email, we've sent you a link to manage it." };

export async function POST(req: NextRequest) {
  if (!stripeConfigured()) return NextResponse.json({ error: 'Account management is not set up yet.' }, { status: 503 });

  const { email } = await req.json().catch(() => ({}));
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  // Same response whether or not the customer exists, so emails can't be enumerated.
  // Prefer the Stripe customer we recorded for this email (the one holding subscriptions); Stripe's email
  // search is case-sensitive and can return a stale duplicate, so it is only the fallback.
  const normalized = email.trim().toLowerCase();
  let cid: string | null = null;
  if (dbConfigured()) {
    const { data: row } = await db().from('customers').select('stripe_customer_id').eq('email', normalized).maybeSingle();
    cid = row?.stripe_customer_id ?? null;
  }
  if (!cid) {
    const { data } = await stripe().customers.list({ email: normalized, limit: 1 });
    cid = data[0]?.id ?? null;
  }
  if (cid) {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const token = signToken({ cid }, 30 * 60);
    await sendPortalLink(email, `${origin}/api/account/portal?token=${encodeURIComponent(token)}`).catch((err) =>
      console.error('Portal link email failed', err)
    );
  }
  return NextResponse.json(GENERIC);
}
