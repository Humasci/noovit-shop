'use server';

import { redirect, unstable_rethrow } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { stripeConfigured } from '@/lib/config';
import { CODE_PATTERN, createStripeCode, normalizeCode, portalLink, setStripeCodeActive, shareLink, type Affiliate } from '@/lib/affiliates';
import { sendPartnerWelcome } from '@/lib/email';
import { formatPrice } from '@/lib/utils/format';

const str = (f: FormData, k: string) => String(f.get(k) ?? '').trim();
const back = (path: string, msg: string): never => redirect(`${path}${path.includes('?') ? '&' : '?'}msg=${encodeURIComponent(msg)}`);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function terms(f: FormData, path: string) {
  const discount = Number(str(f, 'customer_discount_pct'));
  const commission = Number(str(f, 'commission_pct'));
  if (!Number.isInteger(discount) || discount < 0 || discount > 50) back(path, 'Customer discount must be a whole number from 0 to 50%.');
  if (!(commission >= 0 && commission <= 50)) back(path, 'Commission must be between 0 and 50%.');
  return { customer_discount_pct: discount, commission_pct: Math.round(commission * 100) / 100 };
}

async function load(id: string) {
  const { data } = await db().from('affiliates').select('*').eq('id', id).maybeSingle();
  return data as Affiliate | null;
}

export async function createAffiliate(f: FormData) {
  await requireAdmin('marketing');
  const path = '/admin/affiliates';
  const name = str(f, 'name');
  const email = str(f, 'email').toLowerCase();
  const code = normalizeCode(str(f, 'code'));
  if (!name) back(path, 'Name is required.');
  if (!EMAIL.test(email)) back(path, 'Enter a valid email address.');
  if (!CODE_PATTERN.test(code)) back(path, 'Code must be 3–30 letters, numbers, - or _.');
  const t = terms(f, path);
  if (t.customer_discount_pct > 0 && !stripeConfigured()) back(path, 'Connect Stripe first, or set the customer discount to 0 for a link-only partner.');

  const { data: created, error } = await db()
    .from('affiliates')
    .insert({ name, email, code, platform: str(f, 'platform') || null, recurring: f.get('recurring') === 'on', ...t })
    .select('id')
    .single();
  if (error) back(path, error.code === '23505' ? `The code ${code} is already taken.` : `Could not save: ${error.message}`);

  try {
    const ids = await createStripeCode({ id: created!.id, name, code, customer_discount_pct: t.customer_discount_pct });
    await db().from('affiliates').update(ids).eq('id', created!.id);
  } catch (e) {
    unstable_rethrow(e);
    await db().from('affiliates').delete().eq('id', created!.id); // nothing attributed yet, so a clean undo
    back(path, `Stripe could not create the code: ${e instanceof Error ? e.message : 'unknown error'}`);
  }
  revalidatePath(path);
  back(`/admin/affiliates/${created!.id}`, `${name} added. Share their link or code.`);
}

export async function updateAffiliate(f: FormData) {
  await requireAdmin('marketing');
  const id = str(f, 'id');
  const path = `/admin/affiliates/${id}`;
  const a = await load(id);
  if (!a) back('/admin/affiliates', 'Partner not found.');
  const email = str(f, 'email').toLowerCase();
  if (!str(f, 'name')) back(path, 'Name is required.');
  if (!EMAIL.test(email)) back(path, 'Enter a valid email address.');
  const t = terms(f, path);
  const status = str(f, 'status') === 'paused' ? 'paused' : 'active';

  const patch: Record<string, unknown> = {
    name: str(f, 'name'),
    email,
    platform: str(f, 'platform') || null,
    payout_details: str(f, 'payout_details') || null,
    notes: str(f, 'notes') || null,
    recurring: f.get('recurring') === 'on',
    commission_pct: t.commission_pct,
    status,
  };

  try {
    // Stripe coupons can't be edited, so a new customer discount means a fresh coupon + code.
    if (t.customer_discount_pct !== a!.customer_discount_pct) {
      await setStripeCodeActive(a!.stripe_promotion_code_id, false);
      Object.assign(patch, { customer_discount_pct: t.customer_discount_pct }, await createStripeCode({ ...a!, customer_discount_pct: t.customer_discount_pct }));
      if (status === 'paused') await setStripeCodeActive(patch.stripe_promotion_code_id as string | null, false);
    } else if (status !== a!.status) {
      await setStripeCodeActive(a!.stripe_promotion_code_id, status === 'active');
    }
  } catch (e) {
    unstable_rethrow(e);
    back(path, `Stripe error: ${e instanceof Error ? e.message : 'unknown error'}`);
  }

  const { error } = await db().from('affiliates').update(patch).eq('id', id);
  if (error) back(path, `Could not save: ${error.message}`);
  revalidatePath('/admin/affiliates');
  back(path, status === 'paused' && a!.status === 'active' ? 'Saved. The partner is paused and their code no longer works.' : 'Saved.');
}

export async function approvePendingCommissions(f: FormData) {
  await requireAdmin('marketing');
  const id = str(f, 'id');
  const { data } = await db()
    .from('commissions')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('affiliate_id', id)
    .eq('status', 'pending')
    .select('id');
  revalidatePath(`/admin/affiliates/${id}`);
  back(`/admin/affiliates/${id}`, `${data?.length ?? 0} commission(s) approved.`);
}

export async function voidCommission(f: FormData) {
  await requireAdmin('marketing');
  const id = str(f, 'affiliate_id');
  const reason = str(f, 'reason') || 'Voided by staff';
  await db().from('commissions').update({ status: 'void', void_reason: reason }).eq('id', str(f, 'commission_id')).in('status', ['pending', 'approved']);
  revalidatePath(`/admin/affiliates/${id}`);
  back(`/admin/affiliates/${id}`, 'Commission voided.');
}

// Records money already sent to the partner (PayPal, bank…) and marks the approved commissions paid.
export async function recordPayout(f: FormData) {
  const me = await requireAdmin('marketing');
  const id = str(f, 'id');
  const path = `/admin/affiliates/${id}`;
  const { data: due } = await db().from('commissions').select('id, amount_cents').eq('affiliate_id', id).eq('status', 'approved');
  const total = (due ?? []).reduce((s, c) => s + c.amount_cents, 0);
  if (!total) back(path, 'Nothing approved to pay yet.');
  if (Number(str(f, 'expected_cents')) !== total) back(path, 'The amount owed changed while you were on this page. Check it and try again.');

  const { data: payout, error } = await db()
    .from('affiliate_payouts')
    .insert({ affiliate_id: id, amount_cents: total, method: str(f, 'method') || null, reference: str(f, 'reference') || null, paid_by: me.name })
    .select('id')
    .single();
  if (error) back(path, `Could not record payout: ${error.message}`);
  await db().from('commissions').update({ status: 'paid', payout_id: payout!.id }).in('id', due!.map((c) => c.id)).eq('status', 'approved');
  revalidatePath(path);
  back(path, `Payout of ${formatPrice(total / 100)} recorded.`);
}

export async function regeneratePortalLink(f: FormData) {
  await requireAdmin('marketing');
  const id = str(f, 'id');
  const token = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  await db().from('affiliates').update({ portal_token: token }).eq('id', id);
  back(`/admin/affiliates/${id}`, 'New dashboard link created. The old link no longer works.');
}

export async function emailPartnerWelcome(f: FormData) {
  await requireAdmin('marketing');
  const id = str(f, 'id');
  const a = await load(id);
  if (!a) back('/admin/affiliates', 'Partner not found.');
  await sendPartnerWelcome(a!.email, {
    name: a!.name,
    code: a!.code,
    discountPct: a!.customer_discount_pct,
    commissionPct: Number(a!.commission_pct),
    recurring: a!.recurring,
    link: shareLink(a!.code),
    dashboard: portalLink(a!.portal_token),
  });
  back(`/admin/affiliates/${id}`, `Welcome email sent to ${a!.email}.`);
}
