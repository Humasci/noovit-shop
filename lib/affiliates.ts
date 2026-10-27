import 'server-only';
import Stripe from 'stripe';
import { db } from '@/lib/db/server';
import { stripe } from '@/lib/stripe/server';
import { SITE_URL } from '@/lib/site';

// Affiliates & influencers. Each partner has one code that works two ways:
//  - typed at checkout (a Stripe promotion code giving their customer discount), and
//  - as a share link noovit.com/r/CODE, which remembers the partner for REF_DAYS and pre-applies the code.
// Commissions are created when the order is ingested, adjusted on refunds, approved after a hold period
// and marked paid when a payout is recorded. Payouts themselves happen outside the system (PayPal, bank).

export const REF_COOKIE = 'noovit_ref';
export const REF_DAYS = 30;
export const CODE_PATTERN = /^[A-Z0-9_-]{3,30}$/;

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  code: string;
  platform: string | null;
  customer_discount_pct: number;
  commission_pct: number;
  recurring: boolean;
  status: 'active' | 'paused';
  payout_details: string | null;
  notes: string | null;
  stripe_coupon_id: string | null;
  stripe_promotion_code_id: string | null;
  portal_token: string;
  clicks: number;
  created_at: string;
}

export const normalizeCode = (raw: string) => raw.trim().toUpperCase();
export const shareLink = (code: string, path = '') => `${SITE_URL}/r/${encodeURIComponent(code)}${path ? `?to=${encodeURIComponent(path)}` : ''}`;
export const portalLink = (token: string) => `${SITE_URL}/partner/${token}`;

const idOf = (v: string | { id: string } | null | undefined) => (typeof v === 'string' ? v : v?.id ?? null);

export async function activeAffiliateByCode(code: string | undefined | null) {
  if (!code || !CODE_PATTERN.test(normalizeCode(code))) return null;
  const { data } = await db().from('affiliates').select('*').eq('code', normalizeCode(code)).eq('status', 'active').maybeSingle();
  return (data as Affiliate | null) ?? null;
}

// Stripe coupon + promotion code for the partner's customer discount. A 0% partner is link-only.
export async function createStripeCode(a: { id: string; name: string; code: string; customer_discount_pct: number }) {
  if (a.customer_discount_pct <= 0) return { stripe_coupon_id: null, stripe_promotion_code_id: null };
  const s = stripe();
  const coupon = await s.coupons.create({
    percent_off: a.customer_discount_pct,
    duration: 'once',
    name: `${a.code} · ${a.customer_discount_pct}% off`,
    metadata: { affiliate_id: a.id },
  });
  const promo = await s.promotionCodes.create({
    promotion: { type: 'coupon', coupon: coupon.id },
    code: a.code,
    metadata: { affiliate_id: a.id },
  });
  return { stripe_coupon_id: coupon.id, stripe_promotion_code_id: promo.id };
}

export async function setStripeCodeActive(promotionCodeId: string | null, active: boolean) {
  if (promotionCodeId) await stripe().promotionCodes.update(promotionCodeId, { active });
}

// ---------- Attribution (called from order ingestion) ----------

const baseOf = (o: { subtotal_cents: number; discount_cents: number; refunded_cents: number; status: string }) =>
  o.status === 'cancelled' || o.status === 'refunded' ? 0 : Math.max(0, o.subtotal_cents - o.discount_cents - o.refunded_cents);

async function addCommission(a: Affiliate, orderId: string, email: string, source: 'code' | 'link' | 'renewal') {
  const { data: order } = await db().from('orders').select('subtotal_cents, discount_cents, refunded_cents, status').eq('id', orderId).single();
  if (!order) return;
  await db().from('orders').update({ affiliate_id: a.id }).eq('id', orderId);
  const self = email.toLowerCase() === a.email.toLowerCase();
  const base = baseOf(order);
  const { error } = await db().from('commissions').insert({
    affiliate_id: a.id,
    order_id: orderId,
    source,
    base_cents: base,
    rate_pct: a.commission_pct,
    amount_cents: self ? 0 : Math.round((base * a.commission_pct) / 100),
    status: self ? 'void' : 'pending',
    void_reason: self ? 'Partner ordered with their own code' : null,
  });
  if (error && error.code !== '23505') throw error; // 23505: already recorded by an earlier delivery
}

// First orders: a code typed at checkout wins over a remembered share link.
export async function attributeCheckout(session: Stripe.Checkout.Session, orderId: string, subscriptionId: string | null, email: string) {
  const promoIds = (session.discounts ?? []).map((d) => idOf(d.promotion_code)).filter((x): x is string => Boolean(x));
  let affiliate: Affiliate | null = null;
  let source: 'code' | 'link' = 'code';
  if (promoIds.length) {
    const { data } = await db().from('affiliates').select('*').in('stripe_promotion_code_id', promoIds).limit(1).maybeSingle();
    affiliate = data as Affiliate | null;
  }
  const linked = session.metadata?.affiliate_id;
  if (linked && (!affiliate || affiliate.id === linked)) {
    if (!affiliate) {
      const { data } = await db().from('affiliates').select('*').eq('id', linked).maybeSingle();
      affiliate = data as Affiliate | null;
    }
    source = 'link';
  }
  if (!affiliate || affiliate.status !== 'active') return;
  if (subscriptionId) await db().from('subscriptions').update({ affiliate_id: affiliate.id }).eq('id', subscriptionId);
  await addCommission(affiliate, orderId, email, source);
}

// Renewals earn only for partners on a recurring deal.
export async function attributeRenewal(orderId: string, subscriptionId: string, email: string) {
  const { data: sub } = await db().from('subscriptions').select('affiliate_id').eq('id', subscriptionId).maybeSingle();
  if (!sub?.affiliate_id) return;
  const { data } = await db().from('affiliates').select('*').eq('id', sub.affiliate_id).maybeSingle();
  const a = data as Affiliate | null;
  if (!a || a.status !== 'active' || !a.recurring) return;
  await addCommission(a, orderId, email, 'renewal');
}

// After a refund or cancellation: shrink or void the commission unless it was already paid out.
export async function syncCommission(orderId: string) {
  const { data: c } = await db().from('commissions').select('id, status, rate_pct').eq('order_id', orderId).maybeSingle();
  if (!c || c.status === 'paid' || c.status === 'void') return;
  const { data: order } = await db().from('orders').select('subtotal_cents, discount_cents, refunded_cents, status').eq('id', orderId).single();
  if (!order) return;
  const base = baseOf(order);
  const amount = Math.round((base * Number(c.rate_pct)) / 100);
  await db()
    .from('commissions')
    .update(amount > 0 ? { base_cents: base, amount_cents: amount } : { base_cents: base, amount_cents: 0, status: 'void', void_reason: 'Order refunded or cancelled' })
    .eq('id', c.id);
}

// Daily: pending commissions older than the hold period become payable.
export async function approveDueCommissions(holdDays: number) {
  const cutoff = new Date(Date.now() - holdDays * 86_400_000).toISOString();
  const { data, error } = await db()
    .from('commissions')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('status', 'pending')
    .lte('created_at', cutoff)
    .select('id');
  if (error) throw error;
  return data?.length ?? 0;
}

// ---------- Reporting ----------

export interface AffiliateStats {
  orders: number;
  sales: number; // commissionable sales (cents)
  pending: number;
  approved: number; // owed now
  paid: number;
}

const emptyStats = (): AffiliateStats => ({ orders: 0, sales: 0, pending: 0, approved: 0, paid: 0 });

export async function statsByAffiliate(affiliateId?: string) {
  const rows: { affiliate_id: string; status: string; base_cents: number; amount_cents: number }[] = [];
  for (let from = 0; ; from += 1000) {
    let q = db().from('commissions').select('affiliate_id, status, base_cents, amount_cents').order('created_at').range(from, from + 999);
    if (affiliateId) q = q.eq('affiliate_id', affiliateId);
    const { data, error } = await q;
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) break;
  }
  const out = new Map<string, AffiliateStats>();
  for (const c of rows) {
    const s = out.get(c.affiliate_id) ?? emptyStats();
    if (c.status !== 'void') {
      s.orders++;
      s.sales += c.base_cents;
    }
    if (c.status === 'pending') s.pending += c.amount_cents;
    if (c.status === 'approved') s.approved += c.amount_cents;
    if (c.status === 'paid') s.paid += c.amount_cents;
    out.set(c.affiliate_id, s);
  }
  return { get: (id: string) => out.get(id) ?? emptyStats() };
}
