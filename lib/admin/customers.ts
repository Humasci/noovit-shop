import 'server-only';
import { db } from '@/lib/db/server';

const COUNTED = ['paid', 'fulfilling', 'shipped', 'delivered', 'partially_refunded'];
const DAY = 86_400_000;

export const SEGMENTS = {
  subscribers: { label: 'Active subscribers', test: (c: CustomerSummary) => c.activeSubs > 0 },
  repeat: { label: 'Repeat buyers (2+ orders)', test: (c: CustomerSummary) => c.orderCount >= 2 },
  'one-time': { label: 'One order, no subscription', test: (c: CustomerSummary) => c.orderCount === 1 && c.activeSubs === 0 },
  lapsed: { label: 'Lapsed (no order in 60 days, no subscription)', test: (c: CustomerSummary, now: number) => c.activeSubs === 0 && !!c.lastOrder && now - Date.parse(c.lastOrder) > 60 * DAY },
  vip: { label: 'VIP ($200+ lifetime)', test: (c: CustomerSummary) => c.ltv >= 20000 },
} as const;

export type SegmentKey = keyof typeof SEGMENTS;

export interface CustomerSummary {
  id: string;
  email: string;
  name: string | null;
  tags: string[];
  createdAt: string;
  orderCount: number;
  ltv: number;
  lastOrder: string | null;
  activeSubs: number;
}

// Reads every customer in pages of 1,000; fine into the tens of thousands.
export async function loadCustomerSummaries(): Promise<CustomerSummary[]> {
  const out: CustomerSummary[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db()
      .from('customers')
      .select('id, email, name, tags, created_at, orders(total_cents, refunded_cents, status, created_at), subscriptions(status)')
      .order('created_at', { ascending: false })
      .range(from, from + 999);
    if (error) throw error;
    for (const c of data) {
      const orders = (c.orders as { total_cents: number; refunded_cents: number; status: string; created_at: string }[]).filter((o) => COUNTED.includes(o.status));
      out.push({
        id: c.id,
        email: c.email,
        name: c.name,
        tags: c.tags ?? [],
        createdAt: c.created_at,
        orderCount: orders.length,
        ltv: orders.reduce((s, o) => s + o.total_cents - (o.refunded_cents ?? 0), 0),
        lastOrder: orders.map((o) => o.created_at).sort().at(-1) ?? null,
        activeSubs: (c.subscriptions as { status: string }[]).filter((s) => ['active', 'trialing', 'past_due'].includes(s.status)).length,
      });
    }
    if (data.length < 1000) break;
  }
  return out;
}

export function filterCustomers(list: CustomerSummary[], opts: { segment?: string; tag?: string; q?: string }) {
  const now = Date.now();
  const seg = opts.segment && opts.segment in SEGMENTS ? SEGMENTS[opts.segment as SegmentKey] : null;
  const q = opts.q?.trim().toLowerCase();
  return list.filter(
    (c) =>
      (!seg || seg.test(c, now)) &&
      (!opts.tag || c.tags.includes(opts.tag)) &&
      (!q || c.email.includes(q) || (c.name ?? '').toLowerCase().includes(q))
  );
}
