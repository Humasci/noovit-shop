import 'server-only';
import { db } from '@/lib/db/server';
import { findKit } from '@/lib/tests';
import { PROGRAM_EMAILS } from '@/lib/programs/perimenopause-emails';

// Everything the account dashboard shows for one email. Orders are matched on the order's email, so guest checkouts
// appear too. Read-only; changes to subscriptions go through Stripe's customer portal.
export interface AccountOrder {
  id: string; number: number; placed: string; status: string; totalCents: number; kind: string;
  items: { slug: string; name: string; quantity: number; bottles: number; mode: string; isKit: boolean }[];
  shipments: { status: string; carrier: string | null; trackingNumber: string | null; trackingUrl: string | null; shippedAt: string | null }[];
}
export interface AccountSubscription { id: string; status: string; frequencyDays: number; amountCents: number; renews: string | null; cancelling: boolean; paused: boolean; items: string[] }
export interface AccountData {
  name: string | null;
  hasStripeCustomer: boolean;
  orders: AccountOrder[];
  subscriptions: AccountSubscription[];
  newsletter: 'subscribed' | 'unsubscribed' | 'none';
  testsWaitlist: string | null; // kit name they asked about, or '' for the general list
  program: { sent: number; total: number; done: boolean } | null;
}

export async function loadAccount(email: string): Promise<AccountData> {
  const e = email.trim().toLowerCase();
  const [cust, ordersRes, subRow, enrol] = await Promise.all([
    db().from('customers').select('id, name, stripe_customer_id').eq('email', e).maybeSingle(),
    db().from('orders')
      .select('id, order_number, created_at, status, total_cents, kind, subscription_id, order_items(product_slug, product_name, quantity, bottles, purchase_mode), fulfilments(status, carrier, tracking_number, tracking_url, shipped_at)')
      .eq('email', e).order('created_at', { ascending: false }).limit(50),
    db().from('subscribers').select('status, source, goal').eq('email', e).maybeSingle(),
    db().from('program_enrollments').select('last_step, completed_at').eq('email', e).eq('program', 'perimenopause').maybeSingle(),
  ]);

  type Row = {
    id: string; order_number: number; created_at: string; status: string; total_cents: number; kind: string; subscription_id: string | null;
    order_items: { product_slug: string; product_name: string; quantity: number; bottles: number; purchase_mode: string }[];
    fulfilments: { status: string; carrier: string | null; tracking_number: string | null; tracking_url: string | null; shipped_at: string | null }[];
  };
  const rows = (ordersRes.data ?? []) as unknown as Row[];
  const orders: AccountOrder[] = rows.map((o) => ({
    id: o.id, number: o.order_number, placed: o.created_at, status: o.status, totalCents: o.total_cents, kind: o.kind,
    items: o.order_items.map((i) => ({ slug: i.product_slug, name: i.product_name, quantity: i.quantity, bottles: i.bottles, mode: i.purchase_mode, isKit: !!findKit(i.product_slug) })),
    shipments: o.fulfilments.map((f) => ({ status: f.status, carrier: f.carrier, trackingNumber: f.tracking_number, trackingUrl: f.tracking_url, shippedAt: f.shipped_at })),
  }));

  let subscriptions: AccountSubscription[] = [];
  if (cust.data?.id) {
    const { data: subs } = await db().from('subscriptions')
      .select('id, status, frequency_days, amount_cents, current_period_end, cancel_at_period_end, paused')
      .eq('customer_id', cust.data.id).order('created_at', { ascending: false });
    subscriptions = (subs ?? []).filter((s) => s.status !== 'canceled' && s.status !== 'incomplete_expired').map((s) => {
      const first = rows.filter((o) => o.subscription_id === s.id).pop();
      return {
        id: s.id, status: s.status, frequencyDays: s.frequency_days, amountCents: s.amount_cents, renews: s.current_period_end,
        cancelling: s.cancel_at_period_end, paused: s.paused,
        items: (first?.order_items ?? []).filter((i) => i.purchase_mode === 'subscribe').map((i) => `${i.product_name}${i.bottles > 1 ? ` × ${i.bottles}` : ''}`),
      };
    });
  }

  const sub = subRow.data;
  return {
    name: cust.data?.name ?? null,
    hasStripeCustomer: !!cust.data?.stripe_customer_id,
    orders,
    subscriptions,
    newsletter: sub ? (sub.status === 'subscribed' ? 'subscribed' : 'unsubscribed') : 'none',
    testsWaitlist: sub?.source === 'tests-waitlist' ? (findKit(sub.goal ?? '')?.sensitive ? '' : findKit(sub.goal ?? '')?.name ?? '') : null,
    program: enrol.data ? { sent: enrol.data.last_step, total: PROGRAM_EMAILS.length, done: !!enrol.data.completed_at } : null,
  };
}

// Is there anything on file for this email (so we only email sign-in links to people we know)?
export async function knownEmail(email: string) {
  const e = email.trim().toLowerCase();
  const [c, o, s] = await Promise.all([
    db().from('customers').select('id').eq('email', e).limit(1),
    db().from('orders').select('id').eq('email', e).limit(1),
    db().from('subscribers').select('email').eq('email', e).limit(1),
  ]);
  return Boolean(c.data?.length || o.data?.length || s.data?.length);
}
