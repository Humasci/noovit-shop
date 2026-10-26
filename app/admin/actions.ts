'use server';

import { redirect, unstable_rethrow } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { stripe } from '@/lib/stripe/server';
import { syncSubscription } from '@/lib/orders/ingest';
import { sendShippedEmail } from '@/lib/email';
import { getProductBySlug } from '@/data/products';

const str = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const back = (path: string, msg: string): never => redirect(`${path}${path.includes('?') ? '&' : '?'}msg=${encodeURIComponent(msg)}`);

const ORDER_STATUS_FOR: Record<string, string | undefined> = {
  submitted: 'fulfilling',
  accepted: 'fulfilling',
  shipped: 'shipped',
  delivered: 'delivered',
};

export async function updateFulfilment(f: FormData) {
  await requireAdmin();
  const id = str(f, 'id');
  const status = str(f, 'status');
  const returnTo = str(f, 'returnTo') || '/admin/fulfilment';

  const { data: current, error: readError } = await db()
    .from('fulfilments')
    .select('status, order_id, orders(order_number, email, status)')
    .eq('id', id)
    .single();
  if (readError || !current) back(returnTo, 'Fulfilment not found.');

  const patch: Record<string, string | null> = {
    status,
    carrier: str(f, 'carrier') || null,
    tracking_number: str(f, 'tracking_number') || null,
    tracking_url: str(f, 'tracking_url') || null,
    supplier_order_ref: str(f, 'supplier_order_ref') || null,
    error: null,
  };
  if (status === 'submitted' && current!.status === 'queued') patch.submitted_at = new Date().toISOString();
  if (status === 'shipped' && current!.status !== 'shipped') patch.shipped_at = new Date().toISOString();

  const { error } = await db().from('fulfilments').update(patch).eq('id', id);
  if (error) back(returnTo, `Update failed: ${error.message}`);

  const order = current!.orders as unknown as { order_number: number; email: string; status: string };
  const nextOrderStatus = ORDER_STATUS_FOR[status];
  if (nextOrderStatus && !['refunded', 'cancelled'].includes(order.status)) {
    await db().from('orders').update({ status: nextOrderStatus }).eq('id', current!.order_id);
  }
  if (status === 'shipped' && current!.status !== 'shipped') {
    await sendShippedEmail(order.email, order.order_number, patch.carrier, patch.tracking_url, patch.tracking_number).catch((e) =>
      console.error('Shipped email failed', e)
    );
  }

  revalidatePath('/admin', 'layout');
  back(returnTo, 'Fulfilment updated.');
}

export async function markQueuedSubmitted() {
  await requireAdmin();
  const { data, error } = await db()
    .from('fulfilments')
    .update({ status: 'submitted', submitted_at: new Date().toISOString() })
    .eq('status', 'queued')
    .select('order_id');
  if (error) back('/admin/fulfilment', `Update failed: ${error.message}`);
  const orderIds = (data ?? []).map((r) => r.order_id);
  if (orderIds.length) await db().from('orders').update({ status: 'fulfilling' }).in('id', orderIds).eq('status', 'paid');
  revalidatePath('/admin', 'layout');
  back('/admin/fulfilment', `${orderIds.length} orders marked as submitted.`);
}

export async function refundOrder(f: FormData) {
  await requireAdmin();
  const id = str(f, 'id');
  const returnTo = str(f, 'returnTo');
  if (f.get('confirm') !== 'on') back(returnTo, 'Tick the confirmation box to refund.');

  const { data: order } = await db().from('orders').select('stripe_payment_intent_id, status').eq('id', id).single();
  if (!order?.stripe_payment_intent_id) back(returnTo, 'No Stripe payment found for this order — refund it in the Stripe dashboard.');
  if (order!.status === 'refunded') back(returnTo, 'Order is already refunded.');

  try {
    await stripe().refunds.create({ payment_intent: order!.stripe_payment_intent_id, metadata: { order_id: id } });
  } catch (e) {
    back(returnTo, `Stripe refused the refund: ${e instanceof Error ? e.message : 'unknown error'}`);
  }
  await db().from('orders').update({ status: 'refunded' }).eq('id', id);
  await db().from('fulfilments').update({ status: 'cancelled' }).eq('order_id', id).eq('status', 'queued');
  revalidatePath('/admin', 'layout');
  back(returnTo, 'Order refunded.');
}

export async function subscriptionAction(f: FormData) {
  await requireAdmin();
  const id = str(f, 'stripe_subscription_id');
  const action = str(f, 'action');
  const s = stripe();
  try {
    const sub =
      action === 'pause'
        ? await s.subscriptions.update(id, { pause_collection: { behavior: 'void' } })
        : action === 'resume'
          ? await s.subscriptions.update(id, { pause_collection: '' })
          : action === 'cancel'
            ? await s.subscriptions.update(id, { cancel_at_period_end: true })
            : action === 'reactivate'
              ? await s.subscriptions.update(id, { cancel_at_period_end: false })
              : null;
    if (!sub) back('/admin/subscriptions', 'Unknown action.');
    await syncSubscription(sub!);
  } catch (e) {
    unstable_rethrow(e);
    back('/admin/subscriptions', `Stripe error: ${e instanceof Error ? e.message : 'unknown'}`);
  }
  revalidatePath('/admin/subscriptions');
  back('/admin/subscriptions', 'Subscription updated.');
}

export async function setSupplierSku(f: FormData) {
  await requireAdmin();
  const slug = str(f, 'slug');
  if (!getProductBySlug(slug)) back('/admin/products', 'Unknown product.');
  const { error } = await db().from('product_settings').upsert({ slug, supplier_sku: str(f, 'supplier_sku') || null });
  if (error) back('/admin/products', `Save failed: ${error.message}`);
  revalidatePath('/admin/products');
  back('/admin/products', 'Supplier SKU saved.');
}

export async function moderateReview(f: FormData) {
  await requireAdmin();
  const status = str(f, 'status');
  if (!['approved', 'rejected', 'pending'].includes(status)) back('/admin/reviews', 'Invalid status.');
  const { error } = await db().from('reviews').update({ status }).eq('id', str(f, 'id'));
  if (error) back('/admin/reviews', `Update failed: ${error.message}`);
  revalidatePath('/admin/reviews');
  back(`/admin/reviews?status=${str(f, 'tab') || 'pending'}`, `Review ${status}.`);
}

export async function createDiscount(f: FormData) {
  await requireAdmin();
  const code = str(f, 'code').toUpperCase();
  const percent = Number(str(f, 'percent_off'));
  const duration = str(f, 'duration') as 'once' | 'forever';
  const maxRedemptions = Number(str(f, 'max_redemptions')) || undefined;
  const expires = str(f, 'expires_at');

  if (!/^[A-Z0-9_-]{3,30}$/.test(code)) back('/admin/discounts', 'Code must be 3–30 letters, numbers, - or _.');
  if (!(percent > 0 && percent <= 100)) back('/admin/discounts', 'Percent off must be between 1 and 100.');
  if (!['once', 'forever'].includes(duration)) back('/admin/discounts', 'Invalid duration.');

  try {
    const s = stripe();
    const coupon = await s.coupons.create({ percent_off: percent, duration, name: `${code} — ${percent}% off` });
    await s.promotionCodes.create({
      promotion: { type: 'coupon', coupon: coupon.id },
      code,
      ...(maxRedemptions ? { max_redemptions: maxRedemptions } : {}),
      ...(expires ? { expires_at: Math.floor(new Date(`${expires}T23:59:59`).getTime() / 1000) } : {}),
    });
  } catch (e) {
    back('/admin/discounts', `Stripe error: ${e instanceof Error ? e.message : 'unknown'}`);
  }
  revalidatePath('/admin/discounts');
  back('/admin/discounts', `Code ${code} created.`);
}

export async function deactivateDiscount(f: FormData) {
  await requireAdmin();
  await stripe().promotionCodes.update(str(f, 'id'), { active: false });
  revalidatePath('/admin/discounts');
  back('/admin/discounts', 'Code deactivated.');
}
