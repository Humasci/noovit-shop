import 'server-only';
import { db } from '@/lib/db/server';

const DAY = 86_400_000;
const EXCLUDED = ['cancelled'];

export interface DayPoint {
  date: string; // YYYY-MM-DD (UTC)
  subscription: number; // cents, net of refunds
  oneTime: number;
}

export interface ProductRow {
  slug: string;
  name: string;
  revenue: number; // cents (list value of items sold)
  units: number; // bottles
  orders: number;
}

export interface CohortRow {
  month: string; // YYYY-MM
  started: number;
  active: number;
  cancelled: number;
}

export interface Report {
  days: number;
  since: string;
  kpis: {
    revenue: number;
    orders: number;
    aov: number;
    subscriptionShare: number;
    newCustomers: number;
    refunds: number;
    discounts: number;
    discountedOrders: number;
  };
  daily: DayPoint[];
  products: ProductRow[];
  cohorts: CohortRow[];
}

interface OrderRow {
  order_number: number;
  kind: string;
  status: string;
  total_cents: number;
  refunded_cents: number;
  discount_cents: number;
  created_at: string;
  order_items: { product_slug: string; product_name: string; bottles: number; quantity: number; unit_amount_cents: number }[];
}

export async function loadOrdersSince(since: string): Promise<OrderRow[]> {
  const out: OrderRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db()
      .from('orders')
      .select('order_number, kind, status, total_cents, refunded_cents, discount_cents, created_at, order_items(product_slug, product_name, bottles, quantity, unit_amount_cents)')
      .gte('created_at', since)
      .order('created_at')
      .range(from, from + 999);
    if (error) throw error;
    out.push(...(data as OrderRow[]));
    if (data.length < 1000) break;
  }
  return out;
}

export async function buildReport(days: number): Promise<Report> {
  // eslint-disable-next-line react-hooks/purity -- runs once per request on the server
  const now = Date.now();
  const startDay = new Date(now - (days - 1) * DAY);
  startDay.setUTCHours(0, 0, 0, 0);
  const since = startDay.toISOString();

  const [orders, customers, subs] = await Promise.all([
    loadOrdersSince(since),
    db().from('customers').select('id', { count: 'exact', head: true }).gte('created_at', since),
    db().from('subscriptions').select('status, paused, created_at').gte('created_at', new Date(now - 180 * DAY).toISOString()),
  ]);

  const counted = orders.filter((o) => !EXCLUDED.includes(o.status) && o.kind !== 'manual');
  const net = (o: OrderRow) => o.total_cents - (o.refunded_cents ?? 0);

  const daily = new Map<string, DayPoint>();
  for (let i = 0; i < days; i++) {
    const d = new Date(startDay.getTime() + i * DAY).toISOString().slice(0, 10);
    daily.set(d, { date: d, subscription: 0, oneTime: 0 });
  }
  for (const o of counted) {
    const point = daily.get(o.created_at.slice(0, 10));
    if (!point) continue;
    if (o.kind === 'one_time') point.oneTime += net(o);
    else point.subscription += net(o);
  }

  const products = new Map<string, ProductRow>();
  for (const o of counted) {
    if (o.status === 'refunded') continue;
    for (const i of o.order_items) {
      const row = products.get(i.product_slug) ?? { slug: i.product_slug, name: i.product_name, revenue: 0, units: 0, orders: 0 };
      row.revenue += i.unit_amount_cents * i.quantity;
      row.units += i.bottles * i.quantity;
      row.orders += 1;
      products.set(i.product_slug, row);
    }
  }

  const cohorts = new Map<string, CohortRow>();
  for (const s of subs.data ?? []) {
    const month = s.created_at.slice(0, 7);
    const c = cohorts.get(month) ?? { month, started: 0, active: 0, cancelled: 0 };
    c.started++;
    if (s.status === 'canceled') c.cancelled++;
    else if (['active', 'trialing', 'past_due'].includes(s.status) && !s.paused) c.active++;
    cohorts.set(month, c);
  }

  const revenue = counted.reduce((s, o) => s + net(o), 0);
  const subscriptionRevenue = [...daily.values()].reduce((s, d) => s + d.subscription, 0);
  return {
    days,
    since,
    kpis: {
      revenue,
      orders: counted.length,
      aov: counted.length ? Math.round(revenue / counted.length) : 0,
      subscriptionShare: revenue ? subscriptionRevenue / revenue : 0,
      newCustomers: customers.count ?? 0,
      refunds: orders.reduce((s, o) => s + (o.refunded_cents ?? 0), 0),
      discounts: counted.reduce((s, o) => s + (o.discount_cents ?? 0), 0),
      discountedOrders: counted.filter((o) => (o.discount_cents ?? 0) > 0).length,
    },
    daily: [...daily.values()],
    products: [...products.values()].sort((a, b) => b.revenue - a.revenue),
    cohorts: [...cohorts.values()].sort((a, b) => b.month.localeCompare(a.month)),
  };
}
