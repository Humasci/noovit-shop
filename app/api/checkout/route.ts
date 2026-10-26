import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { stripeConfigured } from '@/lib/config';
import { validateCheckout } from '@/lib/checkout/validate';

async function resolvePriceIds(lookupKeys: string[]) {
  const ids = new Map<string, string>();
  for (let i = 0; i < lookupKeys.length; i += 10) {
    const { data } = await stripe().prices.list({ lookup_keys: lookupKeys.slice(i, i + 10), active: true, limit: 10 });
    for (const p of data) if (p.lookup_key) ids.set(p.lookup_key, p.id);
  }
  return ids;
}

export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: 'Checkout is not set up yet. Please try again soon.' }, { status: 503 });
  }

  const result = validateCheckout(await req.json().catch(() => null));
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  const { lines, frequency, ageRestricted } = result;
  const priceIds = await resolvePriceIds(lines.map((l) => l.lookupKey));
  const missing = lines.find((l) => !priceIds.has(l.lookupKey));
  if (missing) {
    console.error(`Stripe price not found for ${missing.lookupKey} — run npm run stripe:sync`);
    return NextResponse.json({ error: `${missing.product.name} is temporarily unavailable.` }, { status: 409 });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: frequency ? 'subscription' : 'payment',
    line_items: lines.map((l) => ({ price: priceIds.get(l.lookupKey)!, quantity: l.quantity })),
    shipping_address_collection: { allowed_countries: ['US'] },
    allow_promotion_codes: true,
    automatic_tax: { enabled: process.env.STRIPE_TAX_ENABLED === 'true' },
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: { age_confirmed: String(ageRestricted), auto_renew_consent: String(Boolean(frequency)) },
  };

  if (frequency) {
    params.subscription_data = { metadata: { frequency_days: String(frequency) } };
    params.custom_text = {
      submit: {
        message: `Your subscription renews automatically every ${frequency} days at the price shown until you cancel. Cancel anytime from "My Subscriptions" at noovit.com.`,
      },
    };
  } else {
    params.customer_creation = 'always';
  }

  try {
    const session = await stripe().checkout.sessions.create(params);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout session failed', err);
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 502 });
  }
}
