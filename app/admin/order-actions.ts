'use server';

import { redirect, unstable_rethrow } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';
import { requireAdmin } from '@/lib/admin/auth';
import { addNote, parseTags } from '@/lib/orders/admin';
import { db } from '@/lib/db/server';
import { stripe } from '@/lib/stripe/server';
import { syncSubscription } from '@/lib/orders/ingest';
import { syncCommission } from '@/lib/affiliates';
import { loadCatalog } from '@/lib/catalog/server';
import { findProduct, packOptions } from '@/data/products';
import { priceLookupKey } from '@/lib/stripe/catalog';
import { fulfilmentSupplier, stripeConfigured } from '@/lib/config';
import { sendPaymentLink } from '@/lib/email';
import { formatPrice } from '@/lib/utils/format';

const str = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const back = (path: string, msg: string): never => redirect(`${path}${path.includes('?') ? '&' : '?'}msg=${encodeURIComponent(msg)}`);
const orderPath = (n: number | string) => `/admin/orders/${n}`;

async function loadOrder(id: string) {
  const { data } = await db()
    .from('orders')
    .select('id, order_number, status, total_cents, refunded_cents, stripe_payment_intent_id, subscription_id, fulfilments(id, status), subscriptions(stripe_subscription_id)')
    .eq('id', id)
    .maybeSingle();
  return data;
}

const REASONS = ['requested_by_customer', 'duplicate', 'fraudulent'] as const;

export async function refundOrder(f: FormData) {
  const me = await requireAdmin('orders.money');
  const order = await loadOrder(str(f, 'id'));
  if (!order) back('/admin/orders', 'Order not found.');
  const path = orderPath(order!.order_number);
  if (!order!.stripe_payment_intent_id) back(path, 'This order has no Stripe payment to refund.');

  const remaining = order!.total_cents - order!.refunded_cents;
  const amount = Math.round(Number(str(f, 'amount')) * 100);
  if (!(amount > 0 && amount <= remaining)) back(path, `Enter an amount between $0.01 and ${formatPrice(remaining / 100)}.`);
  const reason = str(f, 'reason') as (typeof REASONS)[number];
  const note = str(f, 'note');

  const refunded = order!.refunded_cents + amount;
  try {
    await stripe().refunds.create(
      { payment_intent: order!.stripe_payment_intent_id, amount, ...(REASONS.includes(reason) ? { reason } : {}), metadata: { order_id: order!.id, staff: me.name } },
      { idempotencyKey: `refund-${order!.id}-${refunded}` } // a double-click can't refund twice
    );
  } catch (e) {
    back(path, `Stripe refused the refund: ${e instanceof Error ? e.message : 'unknown error'}`);
  }

  const full = refunded >= order!.total_cents;
  await db()
    .from('orders')
    .update({ refunded_cents: refunded, ...(order!.status !== 'cancelled' ? { status: full ? 'refunded' : 'partially_refunded' } : {}) })
    .eq('id', order!.id);
  if (full) await db().from('fulfilments').update({ status: 'cancelled' }).eq('order_id', order!.id).eq('status', 'queued');
  await syncCommission(order!.id);
  await addNote(order!.id, me, `Refunded ${formatPrice(amount / 100)}${reason ? ` (${reason.replace(/_/g, ' ')})` : ''}.${note ? ` ${note}` : ''}`);
  revalidatePath('/admin', 'layout');
  back(path, `Refunded ${formatPrice(amount / 100)}.`);
}

export async function cancelOrder(f: FormData) {
  const me = await requireAdmin('orders.money');
  const order = await loadOrder(str(f, 'id'));
  if (!order) back('/admin/orders', 'Order not found.');
  const path = orderPath(order!.order_number);
  if (f.get('confirm') !== 'on') back(path, 'Tick the confirmation box to cancel.');
  if (order!.status === 'cancelled') back(path, 'Order is already cancelled.');
  const fulfilments = order!.fulfilments as { id: string; status: string }[];
  if (fulfilments.some((x) => ['shipped', 'delivered'].includes(x.status))) back(path, 'This order has already shipped — refund it instead.');

  const remaining = order!.total_cents - order!.refunded_cents;
  if (remaining > 0 && order!.stripe_payment_intent_id) {
    try {
      await stripe().refunds.create(
        { payment_intent: order!.stripe_payment_intent_id, amount: remaining, reason: 'requested_by_customer', metadata: { order_id: order!.id, staff: me.name } },
        { idempotencyKey: `cancel-${order!.id}` }
      );
    } catch (e) {
      back(path, `Stripe refused the refund: ${e instanceof Error ? e.message : 'unknown error'}`);
    }
  }

  await db().from('fulfilments').update({ status: 'cancelled' }).eq('order_id', order!.id).not('status', 'in', '(shipped,delivered,cancelled)');
  await db()
    .from('orders')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), refunded_cents: order!.stripe_payment_intent_id ? order!.total_cents : order!.refunded_cents })
    .eq('id', order!.id);
  await syncCommission(order!.id);

  let subNote = '';
  const sub = order!.subscriptions as unknown as { stripe_subscription_id: string } | null;
  if (f.get('cancel_subscription') === 'on' && sub) {
    try {
      await syncSubscription(await stripe().subscriptions.cancel(sub.stripe_subscription_id));
      subNote = ' Subscription cancelled.';
    } catch (e) {
      unstable_rethrow(e);
      subNote = ` Subscription could not be cancelled: ${e instanceof Error ? e.message : 'unknown error'}.`;
    }
  }
  await addNote(order!.id, me, `Order cancelled${remaining > 0 && order!.stripe_payment_intent_id ? ` and ${formatPrice(remaining / 100)} refunded` : ''}.${subNote} ${str(f, 'note')}`.trim());
  revalidatePath('/admin', 'layout');
  back(path, `Order cancelled.${subNote}`);
}

export async function addOrderNote(f: FormData) {
  const me = await requireAdmin('orders');
  const body = str(f, 'body');
  const { data: order } = await db().from('orders').select('id, order_number').eq('id', str(f, 'id')).maybeSingle();
  if (!order) back('/admin/orders', 'Order not found.');
  if (!body) back(orderPath(order!.order_number), 'Write a note first.');
  await addNote(order!.id, me, body);
  revalidatePath(orderPath(order!.order_number));
  back(orderPath(order!.order_number), 'Note added.');
}

export async function setOrderTags(f: FormData) {
  await requireAdmin('orders');
  const { data: order } = await db().from('orders').update({ tags: parseTags(str(f, 'tags')) }).eq('id', str(f, 'id')).select('order_number').maybeSingle();
  if (!order) back('/admin/orders', 'Order not found.');
  revalidatePath('/admin/orders', 'layout');
  back(orderPath(order!.order_number), 'Tags saved.');
}

const MANUAL_ROWS = 5;

export async function createManualOrder(f: FormData) {
  const me = await requireAdmin('orders.money');
  const path = '/admin/orders/new';
  const type = str(f, 'type') === 'payment_link' ? 'payment_link' : 'replacement';
  const email = str(f, 'email').toLowerCase();
  const name = str(f, 'name');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) back(path, 'Enter a valid customer email.');

  const catalog = await loadCatalog();
  const lines: { slug: string; name: string; bottles: number; qty: number; unit: number }[] = [];
  for (let i = 0; i < MANUAL_ROWS; i++) {
    const slug = str(f, `slug_${i}`);
    if (!slug) continue;
    const product = findProduct(catalog, slug);
    if (!product) back(path, 'Unknown product.');
    const pack = packOptions(product!, 'one-time').find((o) => o.bottles === Number(str(f, `bottles_${i}`)));
    const qty = Number(str(f, `qty_${i}`));
    if (!pack || !(Number.isInteger(qty) && qty >= 1 && qty <= 20)) back(path, `Check the pack size and quantity for ${product!.name}.`);
    lines.push({ slug, name: product!.name, bottles: pack!.bottles, qty, unit: Math.round(pack!.pricePerBottle * pack!.bottles * 100) });
  }
  if (!lines.length) back(path, 'Add at least one product.');
  const note = str(f, 'note');

  if (type === 'payment_link') {
    if (!stripeConfigured()) back(path, 'Stripe is not connected.');
    let url = '';
    try {
      const s = stripe();
      const keys = lines.map((l) => priceLookupKey(l.slug, 'one-time', l.bottles));
      const { data: prices } = await s.prices.list({ lookup_keys: keys, active: true, limit: 10 });
      const ids = new Map(prices.map((p) => [p.lookup_key, p.id]));
      const missing = keys.find((k) => !ids.has(k));
      if (missing) back(path, `No Stripe price for ${missing} — sync products to Stripe first.`);
      const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://noovit.com';
      const session = await s.checkout.sessions.create({
        mode: 'payment',
        customer_email: email,
        customer_creation: 'always',
        line_items: lines.map((l, i) => ({ price: ids.get(keys[i])!, quantity: l.qty })),
        shipping_address_collection: { allowed_countries: ['US'] },
        allow_promotion_codes: true,
        automatic_tax: { enabled: process.env.STRIPE_TAX_ENABLED === 'true' },
        success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${site}/`,
        metadata: { manual_by: me.name, manual_note: note.slice(0, 450) },
      } satisfies Stripe.Checkout.SessionCreateParams);
      url = session.url!;
      if (f.get('send_email') === 'on') await sendPaymentLink(email, name, url, lines.map((l) => ({ name: l.name, quantity: l.qty })));
    } catch (e) {
      unstable_rethrow(e);
      back(path, `Stripe error: ${e instanceof Error ? e.message : 'unknown'}`);
    }
    redirect(`${path}?link=${encodeURIComponent(url)}&emailed=${f.get('send_email') === 'on' ? 1 : 0}`);
  }

  // Free replacement / goodwill order: no payment, goes straight into fulfilment.
  const address = {
    line1: str(f, 'line1'),
    line2: str(f, 'line2') || null,
    city: str(f, 'city'),
    state: str(f, 'state').toUpperCase(),
    postal_code: str(f, 'postal_code'),
    country: 'US',
  };
  if (!name || !address.line1 || !address.city || !/^[A-Z]{2}$/.test(address.state) || !/^\d{5}(-\d{4})?$/.test(address.postal_code)) {
    back(path, 'Enter the full US shipping address (2-letter state, 5-digit ZIP).');
  }

  const { data: customer, error: cErr } = await db().from('customers').upsert({ email, name }, { onConflict: 'email' }).select('id').single();
  if (cErr) back(path, cErr.message);
  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);
  const { data: skus } = await db().from('products').select('slug, supplier_sku');
  const skuMap = new Map((skus ?? []).map((r) => [r.slug, r.supplier_sku]));
  const { data, error } = await db().rpc('create_order', {
    p_order: {
      kind: 'manual', customer_id: customer!.id, email, currency: 'usd', subtotal_cents: subtotal, discount_cents: subtotal,
      tax_cents: 0, shipping_cents: 0, total_cents: 0, shipping_name: name, shipping_address: address, age_confirmed: true,
    },
    p_items: lines.map((l) => ({
      product_slug: l.slug, product_name: l.name, purchase_mode: 'one-time', bottles: l.bottles, frequency_days: null,
      unit_amount_cents: l.unit, quantity: l.qty, stripe_price_id: null, supplier_sku: skuMap.get(l.slug) ?? null,
    })),
    p_supplier: fulfilmentSupplier(),
  });
  if (error) back(path, error.message);
  const orderId = data[0].order_id as string;
  await db().from('orders').update({ tags: ['manual', 'replacement'] }).eq('id', orderId);
  await addNote(orderId, me, `Manual replacement order created.${note ? ` ${note}` : ''}`);
  revalidatePath('/admin', 'layout');
  back(orderPath(Number(data[0].order_no)), 'Replacement order created and queued for fulfilment.');
}
