import 'server-only';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { findKit } from '@/lib/tests';
import { PROGRAM_EMAILS } from '@/lib/programs/perimenopause-emails';
import { accountEmail } from './session';
import { listNotify } from '@/lib/marketing/notify';
import { getCatalog } from '@/lib/catalog/server';
import { productPath, testPath } from '@/lib/urls';

// Everything the account area shows for one email. Orders are matched on the order's email, so guest checkouts
// appear too. Every read is scoped to the signed-in email; nothing here takes an id from the browser on trust.
export interface AccountAddress { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postal_code?: string | null; country?: string | null; phone?: string | null }
export interface AccountOrder {
  id: string; number: number; placed: string; status: string; kind: string;
  subtotalCents: number; discountCents: number; taxCents: number; shippingCents: number; totalCents: number;
  shippingName: string | null; shippingAddress: AccountAddress | null;
  stripeInvoiceId: string | null; stripePaymentIntentId: string | null;
  items: { slug: string; name: string; quantity: number; bottles: number; mode: string; unitCents: number; isKit: boolean }[];
  shipments: { status: string; carrier: string | null; trackingNumber: string | null; trackingUrl: string | null; shippedAt: string | null }[];
}
export interface AccountSubscription { id: string; stripeId: string; status: string; frequencyDays: number; amountCents: number; renews: string | null; cancelling: boolean; paused: boolean; items: string[] }
export interface AccountData {
  customerId: string | null;
  name: string | null;
  stripeCustomerId: string | null;
  orders: AccountOrder[];
  subscriptions: AccountSubscription[];
  newsletter: 'subscribed' | 'unsubscribed' | 'none';
  testsWaitlist: string | null; // kit name they asked about, '' for the general list, null = not on it
  program: { sent: number; total: number; done: boolean } | null;
  waiting: { kind: 'product' | 'kit'; slug: string; name: string; href: string; since: string }[];
}

// The signed-in email, or a redirect to the sign-in page. Call at the top of every account page and action.
export async function requireAccount() {
  const email = dbConfigured() ? await accountEmail() : null;
  if (!email) redirect('/account');
  return email;
}

type OrderRow = {
  id: string; order_number: number; created_at: string; status: string; kind: string; subscription_id: string | null;
  subtotal_cents: number; discount_cents: number; tax_cents: number; shipping_cents: number; total_cents: number;
  shipping_name: string | null; shipping_address: AccountAddress | null; stripe_invoice_id: string | null; stripe_payment_intent_id: string | null;
  order_items: { product_slug: string; product_name: string; quantity: number; bottles: number; purchase_mode: string; unit_amount_cents: number }[];
  fulfilments: { status: string; carrier: string | null; tracking_number: string | null; tracking_url: string | null; shipped_at: string | null }[];
};
const ORDER_COLS =
  'id, order_number, created_at, status, kind, subscription_id, subtotal_cents, discount_cents, tax_cents, shipping_cents, total_cents, shipping_name, shipping_address, stripe_invoice_id, stripe_payment_intent_id, order_items(product_slug, product_name, quantity, bottles, purchase_mode, unit_amount_cents), fulfilments(status, carrier, tracking_number, tracking_url, shipped_at)';
const toOrder = (o: OrderRow): AccountOrder => ({
  id: o.id, number: o.order_number, placed: o.created_at, status: o.status, kind: o.kind,
  subtotalCents: o.subtotal_cents, discountCents: o.discount_cents, taxCents: o.tax_cents, shippingCents: o.shipping_cents, totalCents: o.total_cents,
  shippingName: o.shipping_name, shippingAddress: o.shipping_address, stripeInvoiceId: o.stripe_invoice_id, stripePaymentIntentId: o.stripe_payment_intent_id,
  items: o.order_items.map((i) => ({ slug: i.product_slug, name: i.product_name, quantity: i.quantity, bottles: i.bottles, mode: i.purchase_mode, unitCents: i.unit_amount_cents, isKit: !!findKit(i.product_slug) })),
  shipments: o.fulfilments.map((f) => ({ status: f.status, carrier: f.carrier, trackingNumber: f.tracking_number, trackingUrl: f.tracking_url, shippedAt: f.shipped_at })),
});

export async function loadAccount(email: string): Promise<AccountData> {
  const e = email.trim().toLowerCase();
  const [cust, ordersRes, subRow, enrol] = await Promise.all([
    db().from('customers').select('id, name, stripe_customer_id').eq('email', e).maybeSingle(),
    db().from('orders').select(ORDER_COLS).eq('email', e).order('created_at', { ascending: false }).limit(100),
    db().from('subscribers').select('status, source, goal, created_at').eq('email', e).maybeSingle(),
    db().from('program_enrollments').select('last_step, completed_at').eq('email', e).eq('program', 'perimenopause').maybeSingle(),
  ]);
  const rows = (ordersRes.data ?? []) as unknown as OrderRow[];

  let subscriptions: AccountSubscription[] = [];
  if (cust.data?.id) {
    const { data: subs } = await db().from('subscriptions')
      .select('id, stripe_subscription_id, status, frequency_days, amount_cents, current_period_end, cancel_at_period_end, paused')
      .eq('customer_id', cust.data.id).order('created_at', { ascending: false });
    subscriptions = (subs ?? []).filter((s) => s.status !== 'canceled' && s.status !== 'incomplete_expired').map((s) => {
      const first = rows.filter((o) => o.subscription_id === s.id).pop();
      return {
        id: s.id, stripeId: s.stripe_subscription_id, status: s.status, frequencyDays: s.frequency_days, amountCents: s.amount_cents, renews: s.current_period_end,
        cancelling: s.cancel_at_period_end, paused: s.paused,
        items: (first?.order_items ?? []).filter((i) => i.purchase_mode === 'subscribe').map((i) => `${i.product_name}${i.bottles > 1 ? ` × ${i.bottles}` : ''}`),
      };
    });
  }

  // "Notify me" list (migration 0009); before it runs, the one product or kit kept in subscribers.goal.
  const catalog = await getCatalog();
  const saved = await listNotify(e);
  const fromGoal = sub0(subRow.data);
  const requests = saved ?? fromGoal;
  const waiting = requests.flatMap((r): AccountData['waiting'] => {
    if (r.kind === 'kit') {
      const k = findKit(r.slug);
      return k ? [{ kind: r.kind, slug: r.slug, name: k.sensitive ? 'At-home test' : k.name, href: testPath(k.slug), since: r.created_at }] : [];
    }
    const p = catalog.find((x) => x.slug === r.slug);
    return p ? [{ kind: r.kind, slug: r.slug, name: p.name, href: productPath(p.slug), since: r.created_at }] : [];
  });

  const sub = subRow.data;
  const waitKit = sub?.source === 'tests-waitlist' ? findKit(sub.goal ?? '') : undefined;
  return {
    customerId: cust.data?.id ?? null,
    name: cust.data?.name ?? null,
    stripeCustomerId: cust.data?.stripe_customer_id ?? null,
    orders: rows.map(toOrder),
    subscriptions,
    newsletter: sub ? (sub.status === 'subscribed' ? 'subscribed' : 'unsubscribed') : 'none',
    testsWaitlist: sub?.source === 'tests-waitlist' ? (waitKit && !waitKit.sensitive ? waitKit.name : '') : null,
    program: enrol.data ? { sent: enrol.data.last_step, total: PROGRAM_EMAILS.length, done: !!enrol.data.completed_at } : null,
    waiting,
  };
}

type SubRow = { status: string; source: string; goal: string | null; created_at: string } | null;
const sub0 = (s: SubRow) =>
  s?.goal && s.status === 'subscribed' && (s.source === 'launch-waitlist' || s.source === 'tests-waitlist')
    ? [{ kind: (s.source === 'tests-waitlist' ? 'kit' : 'product') as 'kit' | 'product', slug: s.goal, created_at: s.created_at }]
    : [];

// One order by its number, only if it belongs to this email.
export async function loadOrder(email: string, number: number): Promise<AccountOrder | null> {
  const { data } = await db().from('orders').select(ORDER_COLS).eq('email', email.trim().toLowerCase()).eq('order_number', number).maybeSingle();
  return data ? toOrder(data as unknown as OrderRow) : null;
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
