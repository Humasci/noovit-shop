import 'server-only';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { stripeConfigured } from '@/lib/config';
import type { AccountAddress } from './data';

// Live reads from Stripe for the account pages. Each one fails soft (null): the page still renders from our database.
const idOf = (v: string | { id: string } | null | undefined) => (typeof v === 'string' ? v : v?.id ?? null);

export interface LiveSubscription { resumesAt: string | null; periodEnd: number | null; card: { brand: string; last4: string } | null }
export async function liveSubscription(stripeSubId: string): Promise<LiveSubscription | null> {
  if (!stripeConfigured()) return null;
  try {
    const sub = await stripe().subscriptions.retrieve(stripeSubId, { expand: ['default_payment_method'] });
    const pm = typeof sub.default_payment_method === 'object' ? sub.default_payment_method : null;
    const resumes = sub.pause_collection?.resumes_at ?? null;
    return {
      resumesAt: resumes ? new Date(resumes * 1000).toISOString() : null,
      periodEnd: sub.items.data[0]?.current_period_end ?? null,
      card: pm?.card ? { brand: pm.card.brand, last4: pm.card.last4 } : null,
    };
  } catch {
    return null;
  }
}

export interface SavedShipping { name: string | null; address: AccountAddress | null }
export async function savedShipping(stripeCustomerId: string | null): Promise<SavedShipping | null> {
  if (!stripeCustomerId || !stripeConfigured()) return null;
  try {
    const c = await stripe().customers.retrieve(stripeCustomerId);
    if (c.deleted || !c.shipping) return null;
    return { name: c.shipping.name ?? null, address: c.shipping.address ? { ...c.shipping.address, phone: c.shipping.phone ?? null } : null };
  } catch {
    return null;
  }
}

// Stripe's hosted receipt (one-time orders) or invoice page (subscription orders) for an order, if there is one.
export async function receiptUrl(o: { stripeInvoiceId: string | null; stripePaymentIntentId: string | null }): Promise<string | null> {
  if (!stripeConfigured()) return null;
  try {
    if (o.stripeInvoiceId) return (await stripe().invoices.retrieve(o.stripeInvoiceId)).hosted_invoice_url ?? null;
    if (o.stripePaymentIntentId) {
      const pi = await stripe().paymentIntents.retrieve(o.stripePaymentIntentId, { expand: ['latest_charge'] });
      const charge = pi.latest_charge as Stripe.Charge | string | null;
      return typeof charge === 'object' && charge ? charge.receipt_url ?? null : null;
    }
  } catch {
    /* no receipt */
  }
  return null;
}
export { idOf };
