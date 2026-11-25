import { NextRequest, NextResponse } from 'next/server';
import { accountEmail } from '@/lib/account/session';
import { dbConfigured } from '@/lib/config';
import { db } from '@/lib/db/server';

// Privacy "give me my data", self-service: everything we hold for the signed-in email, as a JSON download.
export async function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const email = dbConfigured() ? await accountEmail() : null;
  if (!email) return NextResponse.redirect(`${origin}/account`);
  const { data: customer } = await db().from('customers').select('email, name, created_at, id').eq('email', email).maybeSingle();
  const [orders, subscriptions, reviews, subscriber, programs] = await Promise.all([
    db().from('orders').select('order_number, created_at, kind, status, email, currency, subtotal_cents, discount_cents, tax_cents, shipping_cents, total_cents, shipping_name, shipping_address, order_items(product_slug, product_name, purchase_mode, bottles, quantity, unit_amount_cents), fulfilments(status, carrier, tracking_number, shipped_at)').eq('email', email).order('created_at'),
    customer ? db().from('subscriptions').select('status, frequency_days, amount_cents, current_period_end, cancel_at_period_end, paused, created_at').eq('customer_id', customer.id) : Promise.resolve({ data: [] }),
    db().from('reviews').select('product_slug, name, rating, title, body, status, created_at').eq('email', email),
    db().from('subscribers').select('email, source, status, goal, created_at').eq('email', email).maybeSingle(),
    db().from('program_enrollments').select('program, started_at, last_step, completed_at').eq('email', email),
  ]);
  const body = {
    exported_at: new Date().toISOString(),
    note: 'Card and payment details are held by Stripe, our payment processor, not by Noovit. Lab results are held by the lab, not by Noovit.',
    customer: customer ? { email: customer.email, name: customer.name, created_at: customer.created_at } : { email },
    orders: orders.data ?? [],
    subscriptions: subscriptions.data ?? [],
    reviews: reviews.data ?? [],
    marketing: subscriber.data ?? null,
    programs: programs.data ?? [],
  };
  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': 'attachment; filename="noovit-my-data.json"', 'Cache-Control': 'no-store' },
  });
}
