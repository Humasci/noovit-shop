import 'server-only';
import { db } from '@/lib/db/server';
import { signToken } from '@/lib/sign';
import { getSettings } from '@/lib/settings';
import { SITE_URL } from '@/lib/site';
import { MarketingFooter, sendNewsletterWelcome } from '@/lib/email';
import { klaviyoSubscribe, klaviyoUnsubscribe } from './klaviyo';

const UNSUB_TTL = 2 * 365 * 24 * 60 * 60;

export async function marketingFooter(email: string): Promise<MarketingFooter> {
  const token = encodeURIComponent(signToken({ e: email, p: 'unsub' }, UNSUB_TTL));
  return {
    unsubscribeUrl: `${SITE_URL}/unsubscribe?token=${token}`,
    oneClickUrl: `${SITE_URL}/api/newsletter/unsubscribe?token=${token}`,
    address: (await getSettings()).business_address,
  };
}

// Returns true when this email is new or re-subscribing (and so should get the welcome email).
export async function subscribe(email: string, source: 'newsletter' | 'checkout' | 'pets-waitlist' | 'launch-waitlist' | 'quiz') {
  const normalized = email.trim().toLowerCase();
  const { data: existing } = await db().from('subscribers').select('status').eq('email', normalized).maybeSingle();
  if (existing?.status === 'subscribed') return false;

  const { error } = await db()
    .from('subscribers')
    .upsert({ email: normalized, source, status: 'subscribed', unsubscribed_at: null }, { onConflict: 'email' });
  if (error) throw error;
  await klaviyoSubscribe(normalized, source);
  return true;
}

export async function welcome(email: string) {
  const settings = await getSettings();
  await sendNewsletterWelcome(email, settings.newsletter_code, await marketingFooter(email));
}

export async function unsubscribe(email: string) {
  // Upsert, so an address that was never on the list (e.g. a checkout-only customer clicking the
  // footer link) is still recorded as opted out.
  const normalized = email.trim().toLowerCase();
  const { data: existing } = await db().from('subscribers').select('email').eq('email', normalized).maybeSingle();
  const now = new Date().toISOString();
  const { error } = existing
    ? await db().from('subscribers').update({ status: 'unsubscribed', unsubscribed_at: now }).eq('email', normalized)
    : await db().from('subscribers').insert({ email: normalized, source: 'unsubscribe', status: 'unsubscribed', unsubscribed_at: now });
  if (error) throw error;
  await klaviyoUnsubscribe(normalized);
}
