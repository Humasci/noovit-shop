import { NextRequest, NextResponse } from 'next/server';
import { accountEmail } from '@/lib/account/session';
import { loadOrder } from '@/lib/account/data';
import { receiptUrl } from '@/lib/account/stripe';
import { dbConfigured } from '@/lib/config';

// Sends the signed-in customer to Stripe's receipt (or invoice) page for one of their own orders.
export async function GET(req: NextRequest, { params }: { params: Promise<{ number: string }> }) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
  const email = dbConfigured() ? await accountEmail() : null;
  if (!email) return NextResponse.redirect(`${origin}/account`);
  const { number } = await params;
  const order = /^\d{1,12}$/.test(number) ? await loadOrder(email, Number(number)) : null;
  if (!order) return NextResponse.redirect(`${origin}/account/orders`);
  const url = await receiptUrl(order);
  return NextResponse.redirect(url ?? `${origin}/account/orders/${order.number}?err=receipt`);
}
