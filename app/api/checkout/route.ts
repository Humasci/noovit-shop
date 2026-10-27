import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { dbConfigured, stripeConfigured } from '@/lib/config';
import { validateCheckout } from '@/lib/checkout/validate';
import { loadCatalog } from '@/lib/catalog/server';
import { getSettings } from '@/lib/settings';
import { autoDiscountCoupon, autoDiscountFrom } from '@/lib/marketing/auto-discount';
import { REF_COOKIE, activeAffiliateByCode } from '@/lib/affiliates';

async function resolvePriceIds(lookupKeys: string[]) {
  const ids = new Map<string, string>();
  for (let i = 0; i < lookupKeys.length; i += 10) {
    const { data } = await stripe().prices.list({ lookup_keys: lookupKeys.slice(i, i + 10), active: true, limit: 10 });
    for (const p of data) if (p.lookup_key) ids.set(p.lookup_key, p.id);
  }
  return ids;
}

const CHECKOUT_TTL_SECONDS = 2 * 60 * 60;

export async function POST(req: NextRequest) {
  if (!stripeConfigured()) {
    return NextResponse.json({ error: 'Checkout is not set up yet. Please try again soon.' }, { status: 503 });
  }

  const result = validateCheckout(await req.json().catch(() => null), await loadCatalog());
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
    // Abandoned-cart recovery: the session expires after 2 hours and Stripe gives us a recovery link.
    consent_collection: { promotions: 'auto' },
    after_expiration: { recovery: { enabled: true, allow_promotion_codes: true } },
    expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_TTL_SECONDS,
  };

  // Stripe allows either an applied discount or customer-entered codes, not both.
  const applyDiscount = (discount: Stripe.Checkout.SessionCreateParams.Discount) => {
    params.discounts = [discount];
    delete params.allow_promotion_codes;
    params.after_expiration = { recovery: { enabled: true, allow_promotion_codes: false } };
  };

  // Visitors who came through a partner's share link are credited to that partner, and the partner's
  // code is pre-applied unless the automatic discount gives the customer more.
  const affiliate = dbConfigured() ? await activeAffiliateByCode(req.cookies.get(REF_COOKIE)?.value).catch(() => null) : null;
  if (affiliate) params.metadata!.affiliate_id = affiliate.id;

  const auto = autoDiscountFrom(await getSettings());
  const subtotal = lines.reduce((sum, l) => sum + l.unitAmount * l.quantity, 0);
  const autoApplies = auto && subtotal >= auto.thresholdCents;
  if (affiliate?.stripe_promotion_code_id && !(autoApplies && auto.percent > affiliate.customer_discount_pct)) {
    applyDiscount({ promotion_code: affiliate.stripe_promotion_code_id });
  } else if (autoApplies) {
    try {
      applyDiscount({ coupon: await autoDiscountCoupon(auto.percent) });
    } catch (err) {
      console.error('Automatic discount unavailable', err);
    }
  }

  if (frequency) {
    params.subscription_data = { metadata: { frequency_days: String(frequency), ...(affiliate ? { affiliate_id: affiliate.id } : {}) } };
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
