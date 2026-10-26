import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/server';
import { db } from '@/lib/db/server';
import { dbConfigured, stripeConfigured } from '@/lib/config';
import { handleCheckoutCompleted, handleInvoicePaid, handleChargeRefunded, syncSubscription } from '@/lib/orders/ingest';

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !stripeConfigured() || !dbConfigured()) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
  }

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), req.headers.get('stripe-signature') ?? '', secret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const { data: seen } = await db().from('stripe_events').select('id').eq('id', event.id).maybeSingle();
  if (seen) return NextResponse.json({ received: true, duplicate: true });

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        await handleCheckoutCompleted(event.data.object.id);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object);
        break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await syncSubscription(event.data.object);
        break;
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object);
        break;
      default:
        return NextResponse.json({ received: true, ignored: true });
    }
  } catch (err) {
    console.error(`Webhook ${event.type} (${event.id}) failed`, err);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 }); // Stripe retries
  }

  await db().from('stripe_events').insert({ id: event.id, type: event.type });
  return NextResponse.json({ received: true });
}
