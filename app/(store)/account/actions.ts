'use server';

import { redirect, unstable_rethrow } from 'next/navigation';
import { db } from '@/lib/db/server';
import { stripe } from '@/lib/stripe/server';
import { stripeConfigured } from '@/lib/config';
import { requireAccount, loadOrder } from '@/lib/account/data';
import { syncSubscription } from '@/lib/orders/ingest';
import { subscribe, unsubscribe } from '@/lib/marketing/subscribers';
import { sendContactMessage } from '@/lib/email';
import { supportEmail } from '@/lib/settings';
import { rateLimited } from '@/lib/rate-limit';
import { removeNotify } from '@/lib/marketing/notify';

// Customer account actions (25 Nov). Every action starts from the signed-in email and checks that the thing being
// changed belongs to it; ids from the form are never trusted on their own. Results come back as ?ok= / ?err= codes
// (texts in lib/account/format.ts FLASH).
const str = (f: FormData, k: string, max = 200) => String(f.get(k) ?? '').trim().slice(0, max);
const back = (path: string, kind: 'ok' | 'err', code: string): never => redirect(`${path}?${kind}=${code}`);
const limited = (key: string, max: number) => process.env.RATE_LIMIT_OFF !== '1' && rateLimited(key, max, 60 * 60_000);

async function myCustomer(email: string) {
  const { data } = await db().from('customers').select('id, name, stripe_customer_id').eq('email', email).maybeSingle();
  return data as { id: string; name: string | null; stripe_customer_id: string | null } | null;
}

const CANCEL_REASONS = ['too_expensive', 'unused', 'low_quality', 'switched_service', 'other'] as const;

// Skip the next order, pause, resume, cancel at the end of the paid period, or undo a cancellation.
export async function subscriptionAction(f: FormData) {
  const email = await requireAccount();
  const P = '/account/subscriptions';
  const action = str(f, 'action');
  const cust = await myCustomer(email);
  const { data: row } = cust
    ? await db().from('subscriptions').select('stripe_subscription_id').eq('id', str(f, 'id')).eq('customer_id', cust.id).maybeSingle()
    : { data: null };
  if (!row || !stripeConfigured()) back(P, 'err', 'invalid');
  const id = row!.stripe_subscription_id as string;
  const s = stripe();
  let code = '';
  try {
    if (action === 'skip') {
      // Pausing collection until just after the next renewal voids that one invoice; billing then carries on by itself.
      const cur = await s.subscriptions.retrieve(id);
      const end = cur.items.data[0]?.current_period_end;
      if (!end || cur.pause_collection || cur.cancel_at_period_end) back(P, 'err', 'invalid');
      await syncSubscription(await s.subscriptions.update(id, { pause_collection: { behavior: 'void', resumes_at: end! + 86_400 } }));
      code = 'skipped';
    } else if (action === 'pause') {
      await syncSubscription(await s.subscriptions.update(id, { pause_collection: { behavior: 'void' } }));
      code = 'paused';
    } else if (action === 'resume') {
      await syncSubscription(await s.subscriptions.update(id, { pause_collection: '' }));
      code = 'resumed';
    } else if (action === 'cancel') {
      const reason = CANCEL_REASONS.find((r) => r === str(f, 'reason')) ?? 'other';
      const comment = str(f, 'comment', 500);
      await syncSubscription(await s.subscriptions.update(id, { cancel_at_period_end: true, pause_collection: '', cancellation_details: { feedback: reason, ...(comment ? { comment } : {}) } }));
      code = 'cancelled';
    } else if (action === 'reactivate') {
      await syncSubscription(await s.subscriptions.update(id, { cancel_at_period_end: false }));
      code = 'reactivated';
    }
  } catch (e) {
    unstable_rethrow(e);
    console.error('Account subscription action failed', action, e);
    back(P, 'err', 'stripe');
  }
  back(P, code ? 'ok' : 'err', code || 'invalid');
}

export async function saveName(f: FormData) {
  const email = await requireAccount();
  const name = str(f, 'name', 80);
  if (name.length < 2 || /[<>]/.test(name)) back('/account/profile', 'err', 'invalid');
  const { data, error } = await db().from('customers').upsert({ email, name }, { onConflict: 'email' }).select('stripe_customer_id').single();
  if (error) back('/account/profile', 'err', 'invalid');
  if (data?.stripe_customer_id && stripeConfigured()) await stripe().customers.update(data.stripe_customer_id, { name }).catch((e) => console.error('Stripe name update failed', e));
  back('/account/profile', 'ok', 'name');
}

// The address lives on the Stripe customer: subscription renewals ship to it (lib/orders/ingest.ts).
export async function saveAddress(f: FormData) {
  const email = await requireAccount();
  const P = '/account/profile';
  const cust = await myCustomer(email);
  if (!cust?.stripe_customer_id || !stripeConfigured()) back(P, 'err', 'invalid');
  const a = { name: str(f, 'ship_name', 80), line1: str(f, 'line1', 120), line2: str(f, 'line2', 120), city: str(f, 'city', 80), state: str(f, 'state', 2).toUpperCase(), zip: str(f, 'zip', 10), phone: str(f, 'phone', 25) };
  if (a.name.length < 2 || a.line1.length < 3 || a.city.length < 2 || !/^[A-Z]{2}$/.test(a.state) || !/^\d{5}(-\d{4})?$/.test(a.zip) || (a.phone && !/^[+\d][\d\s().-]{6,}$/.test(a.phone))) back(P, 'err', 'address_invalid');
  try {
    await stripe().customers.update(cust!.stripe_customer_id!, {
      shipping: { name: a.name, phone: a.phone || undefined, address: { line1: a.line1, line2: a.line2 || undefined, city: a.city, state: a.state, postal_code: a.zip, country: 'US' } },
    });
  } catch (e) {
    console.error('Account address update failed', e);
    back(P, 'err', 'stripe');
  }
  back(P, 'ok', 'address');
}

export async function emailPreference(f: FormData) {
  const email = await requireAccount();
  if (str(f, 'want') === 'on') {
    await subscribe(email, 'newsletter');
    back('/account/settings', 'ok', 'subscribed');
  }
  await unsubscribe(email);
  back('/account/settings', 'ok', 'unsubscribed');
}

const HELP_TOPICS: Record<string, string> = {
  missing: "It hasn't arrived",
  damaged: 'Damaged or wrong item',
  refund: 'Refund (90-day first-bottle guarantee)',
  address: 'Change the address',
  other: 'Something else',
};

// "Get help with this order": goes to the support inbox with the order number, reply-to the customer.
export async function orderHelp(f: FormData) {
  const email = await requireAccount();
  const number = Number(str(f, 'number'));
  const order = Number.isInteger(number) ? await loadOrder(email, number) : null;
  if (!order) back('/account/orders', 'err', 'invalid');
  const P = `/account/orders/${number}`;
  const topic = HELP_TOPICS[str(f, 'topic')];
  const message = str(f, 'message', 2000);
  if (!topic || message.length < 5) back(P, 'err', 'invalid');
  if (limited(`acct-help:${email}`, 5)) back(P, 'err', 'limit');
  const cust = await myCustomer(email);
  await sendContactMessage(await supportEmail(), { name: cust?.name ?? order!.shippingName ?? email, email, topic: `Order #${number}: ${topic}`, message });
  back(P, 'ok', 'help');
}

// Privacy: "delete my data". Staff run the erase tool in Admin → Customers after checking nothing is still shipping.
export async function deleteRequest(f: FormData) {
  const email = await requireAccount();
  const P = '/account/settings';
  if (str(f, 'confirm').toLowerCase() !== email) back(P, 'err', 'invalid');
  const cust = await myCustomer(email);
  if (cust) {
    const { data: subs } = await db().from('subscriptions').select('status, cancel_at_period_end').eq('customer_id', cust.id);
    if ((subs ?? []).some((s) => !['canceled', 'incomplete_expired'].includes(s.status) && !s.cancel_at_period_end)) back(P, 'err', 'active_sub');
  }
  if (limited(`acct-del:${email}`, 2)) back(P, 'err', 'limit');
  await sendContactMessage(await supportEmail(), { name: cust?.name ?? email, email, topic: 'Privacy request: delete my data', message: `Sent from the account page while signed in as ${email}. Admin → Customers → this customer → Delete personal data.` });
  back(P, 'ok', 'delete');
}

// Take one product or kit off the "Notify me" list.
export async function notifyRemove(f: FormData) {
  const email = await requireAccount();
  const kind = str(f, 'kind');
  const slug = str(f, 'slug', 60);
  if ((kind !== 'product' && kind !== 'kit') || !/^[a-z0-9-]{2,60}$/.test(slug)) back('/account', 'err', 'invalid');
  await removeNotify(email, kind as 'product' | 'kit', slug);
  back('/account', 'ok', 'notify_removed');
}
