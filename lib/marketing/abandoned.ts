import 'server-only';
import Stripe from 'stripe';
import { db } from '@/lib/db/server';
import { stripe } from '@/lib/stripe/server';
import { getSettings } from '@/lib/settings';
import { sendAbandonedCheckout } from '@/lib/email';
import { marketingFooter, subscribe } from './subscribers';

const RESEND_GAP_DAYS = 7;

export async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  // Stripe only includes the email when the shopper gave promotional consent or typed it before leaving.
  const email = session.customer_details?.email?.toLowerCase();
  const recoveryUrl = session.after_expiration?.recovery?.url;
  if (!email || !recoveryUrl) return;

  const lineItems = await stripe().checkout.sessions.listLineItems(session.id, { limit: 100 });
  const items = lineItems.data.map((li) => ({ name: li.description ?? 'Item', quantity: li.quantity ?? 1 }));

  const { error } = await db().from('abandoned_checkouts').upsert(
    {
      stripe_session_id: session.id,
      email,
      amount_cents: session.amount_total ?? 0,
      currency: session.currency ?? 'usd',
      items,
      recovery_url: recoveryUrl,
    },
    { onConflict: 'stripe_session_id', ignoreDuplicates: true }
  );
  if (error) throw error;

  if (session.consent?.promotions !== 'opt_in') return;
  await subscribe(email, 'checkout'); // they just ticked the marketing box, which also re-subscribes past unsubscribers

  const since = new Date(Date.now() - RESEND_GAP_DAYS * 86_400_000).toISOString();
  const { count } = await db()
    .from('abandoned_checkouts')
    .select('stripe_session_id', { count: 'exact', head: true })
    .eq('email', email)
    .gte('email_sent_at', since);
  if (count) return;

  const settings = await getSettings();
  await sendAbandonedCheckout(email, items, session.amount_total ?? 0, recoveryUrl, settings.newsletter_code, await marketingFooter(email));
  await db().from('abandoned_checkouts').update({ email_sent_at: new Date().toISOString() }).eq('stripe_session_id', session.id);
}

export async function markRecovered(recoveredFrom: string, orderId: string | null) {
  await db()
    .from('abandoned_checkouts')
    .update({ recovered_at: new Date().toISOString(), recovered_order_id: orderId })
    .eq('stripe_session_id', recoveredFrom);
}
