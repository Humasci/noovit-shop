import 'server-only';
import { db } from '@/lib/db/server';
import { getSettings } from '@/lib/settings';
import { SITE_URL } from '@/lib/site';
import { sendReviewRequest } from '@/lib/email';
import { marketingFooter } from './subscribers';

const BATCH = 100;
const SKIP_ORDER = ['refunded', 'cancelled'];

// Emails customers N days after their order shipped, once per fulfilment. Skips refunds and unsubscribed emails.
export async function sendReviewRequests() {
  const days = Number((await getSettings()).review_request_days || 14);
  if (!days) return { sent: 0, skipped: 0, disabled: true };

  const cutoff = new Date(Date.now() - days * 86_400_000).toISOString();
  const { data, error } = await db()
    .from('fulfilments')
    .select('id, orders(email, shipping_name, status, order_items(product_slug, product_name))')
    .in('status', ['shipped', 'delivered'])
    .is('review_requested_at', null)
    .lte('shipped_at', cutoff)
    .limit(BATCH);
  if (error) throw error;

  let sent = 0;
  let skipped = 0;
  for (const f of data ?? []) {
    const o = f.orders as unknown as { email: string; shipping_name: string | null; status: string; order_items: { product_slug: string; product_name: string }[] };
    const { data: sub } = await db().from('subscribers').select('status').eq('email', o.email).maybeSingle();
    const skip = SKIP_ORDER.includes(o.status) || sub?.status === 'unsubscribed';
    if (skip) {
      skipped++;
    } else {
      const unique = [...new Map(o.order_items.map((i) => [i.product_slug, i])).values()];
      await sendReviewRequest(
        o.email,
        o.shipping_name,
        unique.map((i) => ({ name: i.product_name, url: `${SITE_URL}/products/${i.product_slug}#write` })),
        await marketingFooter(o.email)
      );
      sent++;
    }
    // Marked even when skipped, so nobody is asked twice.
    await db().from('fulfilments').update({ review_requested_at: new Date().toISOString() }).eq('id', f.id);
  }
  return { sent, skipped, disabled: false };
}
