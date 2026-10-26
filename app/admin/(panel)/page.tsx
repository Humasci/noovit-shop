import Link from 'next/link';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { Badge, Card, NotConfigured, PageTitle, Stat, Table, dateTime, money, td } from '@/components/admin/ui';

const DAY = 86_400_000;
const COUNTED = ['paid', 'fulfilling', 'shipped', 'delivered', 'partially_refunded'];

export default async function Overview() {
  if (!dbConfigured()) {
    return (
      <>
        <PageTitle title="Overview" />
        <NotConfigured what="The database" />
      </>
    );
  }

  // eslint-disable-next-line react-hooks/purity -- server component, evaluated once per request
  const now = Date.now();
  const since30 = new Date(now - 30 * DAY).toISOString();
  const [ordersRes, itemsRes, subsRes, recentRes, stuckRes] = await Promise.all([
    db().from('orders').select('total_cents, status, created_at').gte('created_at', since30),
    db().from('order_items').select('product_name, quantity, bottles, unit_amount_cents, orders!inner(created_at, status)').gte('orders.created_at', since30),
    db().from('subscriptions').select('status, paused, amount_cents, frequency_days, cancel_at_period_end, updated_at'),
    db().from('orders').select('id, order_number, email, total_cents, status, kind, created_at').order('created_at', { ascending: false }).limit(8),
    db().from('fulfilments').select('id', { count: 'exact', head: true }).or(`status.eq.failed,and(status.eq.queued,created_at.lt.${new Date(now - 2 * DAY).toISOString()})`),
  ]);

  const orders = (ordersRes.data ?? []).filter((o) => COUNTED.includes(o.status));
  const revenueSince = (days: number) =>
    orders.filter((o) => new Date(o.created_at).getTime() >= now - days * DAY).reduce((s, o) => s + o.total_cents, 0);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const today = orders.filter((o) => new Date(o.created_at) >= startOfToday);

  const subs = subsRes.data ?? [];
  const active = subs.filter((s) => ['active', 'trialing', 'past_due'].includes(s.status) && !s.paused);
  const mrr = active.reduce((sum, s) => sum + Math.round((s.amount_cents * 30) / s.frequency_days), 0);
  const churned30 = subs.filter((s) => s.status === 'canceled' && new Date(s.updated_at).getTime() >= now - 30 * DAY).length;
  const cancelling = active.filter((s) => s.cancel_at_period_end).length;

  const top = new Map<string, { units: number; revenue: number }>();
  for (const i of itemsRes.data ?? []) {
    const order = i.orders as unknown as { status: string };
    if (!COUNTED.includes(order.status)) continue;
    const t = top.get(i.product_name) ?? { units: 0, revenue: 0 };
    t.units += i.quantity * i.bottles;
    t.revenue += i.quantity * i.unit_amount_cents;
    top.set(i.product_name, t);
  }
  const topProducts = [...top.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);
  const stuck = stuckRes.count ?? 0;

  return (
    <>
      <PageTitle title="Overview" />

      {stuck > 0 && (
        <Link href="/admin/fulfilment" className="mb-6 block rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {stuck} {stuck === 1 ? 'order needs' : 'orders need'} attention in fulfilment (failed or queued for over 2 days) →
        </Link>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Revenue today" value={money(today.reduce((s, o) => s + o.total_cents, 0))} sub={`${today.length} orders`} />
        <Stat label="Revenue 7 days" value={money(revenueSince(7))} />
        <Stat label="Revenue 30 days" value={money(revenueSince(30))} sub={`${orders.length} orders · AOV ${money(orders.length ? revenueSince(30) / orders.length : 0)}`} />
        <Stat label="Monthly recurring" value={money(mrr)} sub={`${active.length} active subscribers`} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Cancelled (30d)" value={String(churned30)} />
        <Stat label="Cancelling at period end" value={String(cancelling)} />
        <Stat label="Paused" value={String(subs.filter((s) => s.paused).length)} />
        <Stat label="Fulfilment issues" value={String(stuck)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="mb-3 text-lg">Recent orders</h2>
          <Table head={['Order', 'Customer', 'Type', 'Total', 'Status', 'Placed']} empty={!recentRes.data?.length}>
            {recentRes.data?.map((o) => (
              <tr key={o.id}>
                <td className={td}>
                  <Link href={`/admin/orders/${o.order_number}`} className="font-bold text-[var(--color-blue)]">#{o.order_number}</Link>
                </td>
                <td className={td}>{o.email}</td>
                <td className={td}>{o.kind.replace(/_/g, ' ')}</td>
                <td className={td}>{money(o.total_cents)}</td>
                <td className={td}><Badge status={o.status} /></td>
                <td className={td}>{dateTime(o.created_at)}</td>
              </tr>
            ))}
          </Table>
        </div>
        <div>
          <h2 className="mb-3 text-lg">Top products (30 days)</h2>
          <Card>
            {topProducts.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">No sales yet.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {topProducts.map(([name, t]) => (
                  <li key={name} className="flex justify-between gap-3">
                    <span className="font-semibold">{name}</span>
                    <span className="text-right text-[var(--color-muted)]">
                      {money(t.revenue)} · {t.units} bottles
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
