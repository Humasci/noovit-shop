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
