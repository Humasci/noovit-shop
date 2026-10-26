import 'server-only';
import Stripe from 'stripe';
import { db } from '@/lib/db/server';
import { stripe } from '@/lib/stripe/server';
import { fulfilmentSupplier } from '@/lib/config';
import { findProduct } from '@/data/products';
import { getCatalog } from '@/lib/catalog/server';
import { Product } from '@/types';
import { sendOrderConfirmation } from '@/lib/email';
import { subscribe } from '@/lib/marketing/subscribers';
import { markRecovered } from '@/lib/marketing/abandoned';

type Kind = 'one_time' | 'subscription_initial' | 'subscription_renewal';

interface ItemRow {
  product_slug: string;
  product_name: string;
  purchase_mode: 'one-time' | 'subscribe';
  bottles: number;
  frequency_days: number | null;
  unit_amount_cents: number;
  quantity: number;
  stripe_price_id: string;
}

interface Shipping {
  name: string | null;
  address: Stripe.Address | null;
}

const UNIQUE_VIOLATION = '23505';

const idOf = (v: string | { id: string } | null | undefined) => (typeof v === 'string' ? v : v?.id ?? null);

function itemFromPrice(catalog: Product[], price: Stripe.Price, quantity: number, amountCents: number): ItemRow {
  const m = price.metadata;
  const product = findProduct(catalog, m.slug);
  return {
    product_slug: m.slug ?? 'unknown',
    product_name: product?.name ?? price.nickname ?? 'Unknown product',
    purchase_mode: m.mode === 'subscribe' ? 'subscribe' : 'one-time',
    bottles: Number(m.bottles) || 1,
    frequency_days: m.frequency_days ? Number(m.frequency_days) : null,
    unit_amount_cents: amountCents,
    quantity,
    stripe_price_id: price.id,
  };
}

async function upsertCustomer(email: string, name: string | null, stripeCustomerId: string | null) {
  const row: Record<string, string> = { email: email.toLowerCase() };
  if (name) row.name = name;
  if (stripeCustomerId) row.stripe_customer_id = stripeCustomerId;
  const { data, error } = await db().from('customers').upsert(row, { onConflict: 'email' }).select('id').single();
  if (error) throw error;
  return data.id as string;
}

async function customerIdForStripeCustomer(stripeCustomerId: string) {
  const { data } = await db().from('customers').select('id').eq('stripe_customer_id', stripeCustomerId).maybeSingle();
  if (data) return data.id as string;
  const c = await stripe().customers.retrieve(stripeCustomerId);
  if (c.deleted || !c.email) throw new Error(`Stripe customer ${stripeCustomerId} has no email`);
  return upsertCustomer(c.email, c.name ?? null, stripeCustomerId);
}

export async function syncSubscription(sub: Stripe.Subscription) {
  const customerId = await customerIdForStripeCustomer(idOf(sub.customer)!);
  const first = sub.items.data[0];
  const row = {
    customer_id: customerId,
    stripe_subscription_id: sub.id,
    status: sub.status,
    frequency_days: first?.price.recurring?.interval_count ?? 30,
    amount_cents: sub.items.data.reduce((s, i) => s + (i.price.unit_amount ?? 0) * (i.quantity ?? 1), 0),
    current_period_end: first ? new Date(first.current_period_end * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end,
    paused: Boolean(sub.pause_collection),
  };
  const { data, error } = await db().from('subscriptions').upsert(row, { onConflict: 'stripe_subscription_id' }).select('id').single();
  if (error) throw error;
  return data.id as string;
}

async function supplierSkus() {
  const { data } = await db().from('products').select('slug, supplier_sku');
  return new Map((data ?? []).map((r) => [r.slug as string, r.supplier_sku as string | null]));
}

async function paymentIntentForInvoice(invoiceId: string) {
  const inv = await stripe().invoices.retrieve(invoiceId, { expand: ['payments'] });
  return idOf(inv.payments?.data[0]?.payment.payment_intent);
}

async function createOrder(input: {
  kind: Kind;
  customerId: string;
  subscriptionId: string | null;
  email: string;
  name: string | null;
  currency: string;
  subtotal: number;
  discount: number;
  tax: number;
  shippingCents: number;
  total: number;
  shipping: Shipping;
  ageConfirmed: boolean;
  sessionId?: string;
  invoiceId?: string | null;
  paymentIntentId: string | null;
  items: ItemRow[];
}) {
  const skus = await supplierSkus();
  const { data, error } = await db().rpc('create_order', {
    p_order: {
      kind: input.kind,
      customer_id: input.customerId,
      subscription_id: input.subscriptionId,
      email: input.email.toLowerCase(),
      currency: input.currency,
      subtotal_cents: input.subtotal,
      discount_cents: input.discount,
      tax_cents: input.tax,
      shipping_cents: input.shippingCents,
      total_cents: input.total,
      shipping_name: input.shipping.name,
      shipping_address: input.shipping.address,
      age_confirmed: input.ageConfirmed,
      stripe_checkout_session_id: input.sessionId ?? null,
      stripe_invoice_id: input.invoiceId ?? null,
      stripe_payment_intent_id: input.paymentIntentId,
    },
    p_items: input.items.map((i) => ({ ...i, supplier_sku: skus.get(i.product_slug) ?? null })),
    p_supplier: fulfilmentSupplier(),
  });

  if (error) {
    if (error.code === UNIQUE_VIOLATION) return null; // already ingested by a concurrent delivery
    throw error;
  }
  const order = { id: data[0].order_id as string, order_number: Number(data[0].order_no) };

  // The order is already saved; a failed email must not make Stripe retry the webhook.
  await sendOrderConfirmation({
    orderNumber: order.order_number,
    email: input.email,
    name: input.name,
    totalCents: input.total,
    items: input.items.map((i) => ({ name: i.product_name, bottles: i.bottles, quantity: i.quantity, frequencyDays: i.frequency_days })),
  }).catch((err) => console.error(`Confirmation email for order ${order.order_number} failed`, err));
  return order.id as string;
}

export async function handleCheckoutCompleted(sessionId: string) {
  const { data: existing } = await db().from('orders').select('id').eq('stripe_checkout_session_id', sessionId).maybeSingle();
  if (existing) return;

  const s = stripe();
  const session = await s.checkout.sessions.retrieve(sessionId);
  if (session.payment_status === 'unpaid') return; // async payment pending; handled on async_payment_succeeded

  const email = session.customer_details?.email;
  if (!email) throw new Error(`Checkout session ${sessionId} has no email`);
  const name = session.customer_details?.name ?? null;
  const stripeCustomerId = idOf(session.customer);
  const ship = session.collected_information?.shipping_details;
  const shipping: Shipping = { name: ship?.name ?? name, address: ship?.address ?? null };

  // Saved on the Stripe customer so renewals ship to the latest address (editable in the portal).
  if (stripeCustomerId && ship) await s.customers.update(stripeCustomerId, { shipping: { name: ship.name, address: ship.address as Stripe.AddressParam } });

  const customerId = await upsertCustomer(email, name, stripeCustomerId);

  let subscriptionId: string | null = null;
  const stripeSubId = idOf(session.subscription);
  if (stripeSubId) subscriptionId = await syncSubscription(await s.subscriptions.retrieve(stripeSubId));

  const lineItems = await s.checkout.sessions.listLineItems(sessionId, { limit: 100, expand: ['data.price'] });
  const catalog = await getCatalog();
  const items = lineItems.data.map((li) => itemFromPrice(catalog, li.price!, li.quantity ?? 1, li.price?.unit_amount ?? 0));

  const invoiceId = idOf(session.invoice);
  const orderId = await createOrder({
    kind: stripeSubId ? 'subscription_initial' : 'one_time',
    customerId,
    subscriptionId,
    email,
    name,
    currency: session.currency ?? 'usd',
    subtotal: session.amount_subtotal ?? 0,
    discount: session.total_details?.amount_discount ?? 0,
    tax: session.total_details?.amount_tax ?? 0,
    shippingCents: session.total_details?.amount_shipping ?? 0,
    total: session.amount_total ?? 0,
    shipping,
    ageConfirmed: session.metadata?.age_confirmed === 'true',
    sessionId,
    invoiceId,
    paymentIntentId: idOf(session.payment_intent) ?? (invoiceId ? await paymentIntentForInvoice(invoiceId) : null),
    items,
  });

  if (session.recovered_from) await markRecovered(session.recovered_from, orderId);
  if (session.consent?.promotions === 'opt_in') await subscribe(email, 'checkout');
}

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // First invoices are ingested via checkout.session.completed; only renewals create orders here.
  if (invoice.billing_reason !== 'subscription_cycle') return;

  const { data: existing } = await db().from('orders').select('id').eq('stripe_invoice_id', invoice.id).maybeSingle();
  if (existing) return;

  const s = stripe();
  const stripeSubId = idOf(invoice.parent?.subscription_details?.subscription);
  if (!stripeSubId) return;
  const subscriptionId = await syncSubscription(await s.subscriptions.retrieve(stripeSubId));
  const customerId = await customerIdForStripeCustomer(idOf(invoice.customer)!);

  const customer = await s.customers.retrieve(idOf(invoice.customer)!);
  let shipping: Shipping = { name: null, address: null };
  if (!customer.deleted && customer.shipping) {
    shipping = { name: customer.shipping.name ?? null, address: customer.shipping.address ?? null };
  } else {
    const { data: last } = await db()
      .from('orders')
      .select('shipping_name, shipping_address')
      .eq('subscription_id', subscriptionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (last) shipping = { name: last.shipping_name, address: last.shipping_address };
  }

  const catalog = await getCatalog();
  const prices = new Map<string, Stripe.Price>();
  const items: ItemRow[] = [];
  for await (const line of s.invoices.listLineItems(invoice.id, { limit: 100 })) {
    const priceId = line.pricing?.price_details?.price;
    if (!priceId) continue;
    if (!prices.has(priceId)) prices.set(priceId, await s.prices.retrieve(priceId));
    const price = prices.get(priceId)!;
    items.push(itemFromPrice(catalog, price, line.quantity ?? 1, price.unit_amount ?? 0));
  }

  const email = invoice.customer_email ?? (!customer.deleted ? customer.email : null);
  if (!email) throw new Error(`Invoice ${invoice.id} has no customer email`);

  await createOrder({
    kind: 'subscription_renewal',
    customerId,
    subscriptionId,
    email,
    name: invoice.customer_name ?? shipping.name,
    currency: invoice.currency,
    subtotal: invoice.subtotal,
    discount: (invoice.total_discount_amounts ?? []).reduce((sum, d) => sum + d.amount, 0),
    tax: (invoice.total_taxes ?? []).reduce((sum, t) => sum + t.amount, 0),
    shippingCents: 0,
    total: invoice.amount_paid,
    shipping,
    ageConfirmed: true,
    invoiceId: invoice.id,
    paymentIntentId: await paymentIntentForInvoice(invoice.id),
    items,
  });
}

export async function handleChargeRefunded(charge: Stripe.Charge) {
  const pi = idOf(charge.payment_intent);
  if (!pi) return;
  const fullyRefunded = charge.amount_refunded >= charge.amount;
  const { data: order } = await db()
    .from('orders')
    .update({ status: fullyRefunded ? 'refunded' : 'partially_refunded' })
    .eq('stripe_payment_intent_id', pi)
    .select('id')
    .maybeSingle();
  if (order && fullyRefunded) {
    await db().from('fulfilments').update({ status: 'cancelled' }).eq('order_id', order.id).eq('status', 'queued');
  }
}
