import 'server-only';
import { db } from '@/lib/db/server';
import { getCatalog } from '@/lib/catalog/server';
import { ordersOpen } from '@/lib/launch';
import { sendOpenNotice } from '@/lib/email';
import { marketingFooter } from './subscribers';
import { productUrl } from '@/lib/site';

// "Now open" emails (26 Nov). One press in Admin on launch day (and again whenever a product goes live):
//  1. everyone with an open Notify me request for a product that can now be bought gets ONE email listing those
//     products; the requests are marked notified (never emailed twice);
//  2. launch-list sign-ups who never picked a product get the general "Noovit is open" email once; their source then
//     becomes "newsletter", so they aren't emailed again.
// Kits stay on the list until kits can be bought. Unsubscribed addresses are skipped. Sends in batches (Resend limits).
const BATCH = 80;
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface OpenNoticePlan { productPeople: number; generalPeople: number }

async function plan() {
  const catalog = await getCatalog();
  const live = new Map(catalog.filter((p) => p.status === 'active' && p.productType !== 'pets').map((p) => [p.slug, p]));
  const { data: reqs, error } = await db().from('notify_requests').select('id, email, slug').eq('kind', 'product').is('notified_at', null).limit(5000);
  if (error) throw new Error('The Notify me list needs migration 0009.');
  const { data: unsub } = await db().from('subscribers').select('email').eq('status', 'unsubscribed').limit(20000);
  const blocked = new Set((unsub ?? []).map((u) => u.email as string));
  const byEmail = new Map<string, { ids: string[]; items: { name: string; url: string }[] }>();
  for (const r of (reqs ?? []) as { id: string; email: string; slug: string }[]) {
    const p = live.get(r.slug);
    if (!p || blocked.has(r.email)) continue;
    const e = byEmail.get(r.email) ?? { ids: [], items: [] };
    e.ids.push(r.id);
    e.items.push({ name: p.name, url: productUrl(p) });
    byEmail.set(r.email, e);
  }
  const { data: everAsked } = await db().from('notify_requests').select('email').limit(20000);
  const asked = new Set((everAsked ?? []).map((r) => r.email as string));
  const { data: launchList } = await db().from('subscribers').select('email').eq('source', 'launch-waitlist').eq('status', 'subscribed').limit(20000);
  const general = (launchList ?? []).map((s) => s.email as string).filter((e) => !asked.has(e));
  return { byEmail, general };
}

export async function openNoticePlan(): Promise<OpenNoticePlan | null> {
  try {
    const p = await plan();
    return { productPeople: p.byEmail.size, generalPeople: p.general.length };
  } catch {
    return null;
  }
}

// Sends up to one batch; returns how many went out and how many are left for the next press.
export async function sendOpenNotices(): Promise<{ sent: number; left: number }> {
  if (!ordersOpen()) throw new Error('Orders are not open yet.');
  const { byEmail, general } = await plan();
  let sent = 0;
  for (const [email, e] of byEmail) {
    if (sent >= BATCH) break;
    if (await sendOpenNotice(email, e.items, await marketingFooter(email)).catch(() => false)) {
      await db().from('notify_requests').update({ notified_at: new Date().toISOString() }).in('id', e.ids);
      await db().from('subscribers').update({ source: 'newsletter' }).eq('email', email).eq('source', 'launch-waitlist');
      sent++;
      await pause(550);
    }
  }
  for (const email of general) {
    if (sent >= BATCH) break;
    if (await sendOpenNotice(email, [], await marketingFooter(email)).catch(() => false)) {
      await db().from('subscribers').update({ source: 'newsletter' }).eq('email', email).eq('source', 'launch-waitlist');
      sent++;
      await pause(550);
    }
  }
  const after = await openNoticePlan();
  return { sent, left: (after?.productPeople ?? 0) + (after?.generalPeople ?? 0) };
}
