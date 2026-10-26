import 'server-only';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { Settings } from '@/lib/settings';

export interface AutoDiscount {
  thresholdCents: number;
  percent: number;
}

export function autoDiscountFrom(settings: Settings): AutoDiscount | null {
  const threshold = Number(settings.auto_discount_threshold);
  const percent = Number(settings.auto_discount_percent);
  return threshold > 0 && percent > 0 && percent <= 50 ? { thresholdCents: threshold * 100, percent } : null;
}

// One reusable coupon per percentage, created on first use.
export async function autoDiscountCoupon(percent: number) {
  const id = `noovit-auto-${percent}`;
  try {
    await stripe().coupons.retrieve(id);
  } catch (err) {
    if ((err as Stripe.errors.StripeError).code !== 'resource_missing') throw err;
    await stripe().coupons.create({ id, percent_off: percent, duration: 'once', name: `${percent}% off (automatic)` });
  }
  return id;
}
