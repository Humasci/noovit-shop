import 'server-only';
import { db } from '@/lib/db/server';

// "Notify me" requests (migration 0009): one row per person per product or kit. Every call fails soft, so the site
// keeps working before the owner has run the migration (subscribers.goal still keeps the latest one).
export type NotifyKind = 'product' | 'kit';
export interface NotifyRequest { kind: NotifyKind; slug: string; created_at: string }

export async function addNotify(email: string, kind: NotifyKind, slug: string) {
  const { error } = await db().from('notify_requests').upsert({ email: email.trim().toLowerCase(), kind, slug }, { onConflict: 'email,kind,slug', ignoreDuplicates: true });
  if (error && !/notify_requests/.test(error.message)) console.error('Notify request not saved', error.message);
}

// Open requests for one email, or null when the table doesn't exist yet.
export async function listNotify(email: string): Promise<NotifyRequest[] | null> {
  const { data, error } = await db().from('notify_requests').select('kind, slug, created_at').eq('email', email.trim().toLowerCase()).is('notified_at', null).order('created_at', { ascending: false });
  return error ? null : (data as NotifyRequest[]);
}

export async function removeNotify(email: string, kind: NotifyKind, slug: string) {
  await db().from('notify_requests').delete().eq('email', email.trim().toLowerCase()).eq('kind', kind).eq('slug', slug);
}

// Admin: how many people wait for each product or kit (open requests).
export async function notifyCounts(): Promise<{ kind: NotifyKind; slug: string; n: number }[] | null> {
  const { data, error } = await db().from('notify_requests').select('kind, slug').is('notified_at', null).limit(10000);
  if (error) return null;
  const m = new Map<string, { kind: NotifyKind; slug: string; n: number }>();
  for (const r of data as { kind: NotifyKind; slug: string }[]) {
    const k = `${r.kind}:${r.slug}`;
    m.set(k, { ...r, n: (m.get(k)?.n ?? 0) + 1 });
  }
  return [...m.values()].sort((a, b) => b.n - a.n);
}
