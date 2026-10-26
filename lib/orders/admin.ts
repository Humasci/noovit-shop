import 'server-only';
import { db } from '@/lib/db/server';
import { Staff } from '@/lib/admin/auth';

export async function addNote(orderId: string, staff: Staff, body: string) {
  await db().from('order_notes').insert({
    order_id: orderId,
    staff_id: staff.bootstrap ? null : staff.id,
    author: staff.name,
    body: body.slice(0, 2000),
  });
}

export const parseTags = (raw: string) =>
  [...new Set(raw.split(',').map((t) => t.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '').slice(0, 30)).filter(Boolean))].slice(0, 10);
