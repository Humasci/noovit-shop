import { NextResponse } from 'next/server';
import { currentStaff } from '@/lib/admin/auth';
import { can } from '@/lib/admin/permissions';
import { dbConfigured } from '@/lib/config';
import { db } from '@/lib/db/server';

// Privacy request "give me my data": everything we hold on one customer, as JSON (orders with items,
// subscriptions, reviews, marketing status, abandoned checkouts). Payment details live only in Stripe.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const staff = await currentStaff();
  if (!staff || !can(staff.role, 'customers')) return new NextResponse('Unauthorized', { status: 401 });
  if (!dbConfigured()) return new NextResponse('Database not configured', { status: 503 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) return new NextResponse('Not found', { status: 404 });

  const { data: customer } = await db().from('customers').select('*').eq('id', id).maybeSingle();
  if (!customer) return new NextResponse('Not found', { status: 404 });
  const [orders, subscriptions, reviews, subscriber, abandoned] = await Promise.all([
    db().from('orders').select('*, order_items(*)').or(`customer_id.eq.${id},email.eq.${customer.email}`).order('created_at'),
    db().from('subscriptions').select('*').eq('customer_id', id),
    db().from('reviews').select('*').eq('email', customer.email),
    db().from('subscribers').select('*').eq('email', customer.email).maybeSingle(),
    db().from('abandoned_checkouts').select('*').eq('email', customer.email),
  ]);
  const body = {
    exported_at: new Date().toISOString(),
    note: 'Card and payment details are held by Stripe, our payment processor, not by Noovit.',
    customer,
    orders: orders.data ?? [],
    subscriptions: subscriptions.data ?? [],
    reviews: reviews.data ?? [],
    marketing: subscriber.data ?? null,
    abandoned_checkouts: abandoned.data ?? [],
  };
  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="noovit-customer-data-${id.slice(0, 8)}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
