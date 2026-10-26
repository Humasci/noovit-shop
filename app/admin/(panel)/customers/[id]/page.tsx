import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { saveCustomer } from '@/app/admin/customer-actions';
import { Badge, Card, Flash, NotConfigured, PageTitle, Stat, Table, btnSm, date, dateTime, inputCls, money, td } from '@/components/admin/ui';

const COUNTED = ['paid', 'fulfilling', 'shipped', 'delivered', 'partially_refunded'];

export default async function CustomerPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ msg?: string }> }) {
  await requireAdmin('customers');
  const { id } = await params;
  const { msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Customer" /><NotConfigured what="The database" /></>);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  const { data: c } = await db()
    .from('customers')
    .select('*, orders(id, order_number, kind, status, total_cents, refunded_cents, created_at), subscriptions(stripe_subscription_id, status, paused, frequency_days, amount_cents, current_period_end)')
    .eq('id', id)
    .maybeSingle();
  if (!c) notFound();

  const orders = [...(c.orders as { id: string; order_number: number; kind: string; status: string; total_cents: number; refunded_cents: number; created_at: string }[])].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );
  const counted = orders.filter((o) => COUNTED.includes(o.status));
  const ltv = counted.reduce((s, o) => s + o.total_cents - (o.refunded_cents ?? 0), 0);
  const subs = c.subscriptions as { stripe_subscription_id: string; status: string; paused: boolean; frequency_days: number; amount_cents: number; current_period_end: string | null }[];
  const { count: reviewCount } = await db().from('reviews').select('id', { count: 'exact', head: true }).eq('email', c.email);
  const { data: sub } = await db().from('subscribers').select('status').eq('email', c.email).maybeSingle();

  return (
    <>
      <Link href="/admin/customers" className="mb-2 inline-block text-sm text-[var(--color-blue)]">← Customers</Link>
      <PageTitle title={c.name ?? c.email} />
      <Flash msg={msg} />
      <p className="-mt-4 mb-6 text-sm text-[var(--color-muted)]">
        {c.email} · customer since {date(c.created_at)} · marketing emails: <b>{sub?.status ?? 'not subscribed'}</b> · {reviewCount ?? 0} reviews
      </p>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Orders" value={String(counted.length)} />
        <Stat label="Lifetime spend" value={money(ltv)} />
        <Stat label="Average order" value={money(counted.length ? ltv / counted.length : 0)} />
        <Stat label="Active subscriptions" value={String(subs.filter((s) => s.status === 'active').length)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div>
            <h2 className="mb-3 text-lg">Orders</h2>
            <Table head={['Order', 'Type', 'Total', 'Status', 'Placed']} empty={!orders.length}>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className={td}><Link href={`/admin/orders/${o.order_number}`} className="font-bold text-[var(--color-blue)]">#{o.order_number}</Link></td>
                  <td className={td}>{o.kind.replace(/_/g, ' ')}</td>
                  <td className={td}>{money(o.total_cents)}</td>
                  <td className={td}><Badge status={o.status} /></td>
                  <td className={td}>{dateTime(o.created_at)}</td>
                </tr>
              ))}
            </Table>
          </div>
          {subs.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg">Subscriptions</h2>
              <Table head={['Status', 'Every', 'Amount', 'Next renewal']}>
                {subs.map((s) => (
                  <tr key={s.stripe_subscription_id}>
                    <td className={td}><Badge status={s.paused ? 'paused' : s.status} /></td>
                    <td className={td}>{s.frequency_days} days</td>
                    <td className={td}>{money(s.amount_cents)}</td>
                    <td className={td}>{s.status === 'canceled' ? '—' : date(s.current_period_end)}</td>
                  </tr>
                ))}
              </Table>
            </div>
          )}
        </div>

        <Card>
          <form action={saveCustomer} className="space-y-4">
            <input type="hidden" name="id" value={c.id} />
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Tags</span>
              <input name="tags" defaultValue={(c.tags ?? []).join(', ')} placeholder="e.g. vip, wholesale, influencer" className={`${inputCls} w-full`} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Internal notes</span>
              <textarea name="notes" rows={8} defaultValue={c.notes ?? ''} placeholder="Preferences, conversations, allergies mentioned…" className={`${inputCls} w-full`} />
            </label>
            <button className={btnSm}>Save</button>
          </form>
        </Card>
      </div>
    </>
  );
}
