'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { parseTags } from '@/lib/orders/admin';

export async function saveCustomer(f: FormData) {
  await requireAdmin('customers');
  const id = String(f.get('id') ?? '');
  const notes = String(f.get('notes') ?? '').trim().slice(0, 5000) || null;
  const tags = parseTags(String(f.get('tags') ?? ''));
  const { error } = await db().from('customers').update({ notes, tags }).eq('id', id);
  revalidatePath('/admin/customers', 'layout');
  redirect(`/admin/customers/${id}?msg=${encodeURIComponent(error ? `Save failed: ${error.message}` : 'Customer saved.')}`);
}

// Privacy request "delete my data". Orders are kept (tax and accounting records, adverse-event reporting), but every
// personal detail on them is removed; reviews, marketing sign-ups and abandoned checkouts are deleted. Customers with
// an active subscription must be cancelled first. Their Stripe customer is deleted separately, in the Stripe dashboard.
export async function eraseCustomer(f: FormData) {
  await requireAdmin('customers');
  const id = String(f.get('id') ?? '');
  const confirm = String(f.get('confirm') ?? '').trim().toLowerCase();
  const back = (msg: string) => redirect(`/admin/customers/${id}?msg=${encodeURIComponent(msg)}`);
  const { data: c } = await db().from('customers').select('id, email, subscriptions(status)').eq('id', id).maybeSingle();
  if (!c) return back('Customer not found.');
  if (confirm !== c.email.toLowerCase()) return back('Type the customer’s email exactly to confirm deletion.');
  if ((c.subscriptions as { status: string }[]).some((s) => !['canceled', 'incomplete_expired'].includes(s.status))) {
    return back('Cancel their subscription first (Stripe or the customer portal), then delete.');
  }
  const placeholder = `deleted-${id.slice(0, 8)}@deleted.invalid`;
  const steps = await Promise.all([
    db().from('orders').update({ email: placeholder, shipping_name: null, shipping_address: null }).or(`customer_id.eq.${id},email.eq.${c.email}`),
    db().from('reviews').delete().eq('email', c.email),
    db().from('subscribers').delete().eq('email', c.email),
    db().from('abandoned_checkouts').delete().eq('email', c.email),
  ]);
  const failed = steps.find((s) => s.error);
  if (failed) return back(`Delete failed: ${failed.error!.message}`);
  const { error } = await db().from('customers').update({ email: placeholder, name: null, notes: null, tags: [] }).eq('id', id);
  revalidatePath('/admin/customers', 'layout');
  back(error ? `Delete failed: ${error.message}` : 'Personal data deleted. Orders are kept without personal details. Now delete the customer in Stripe too.');
}
