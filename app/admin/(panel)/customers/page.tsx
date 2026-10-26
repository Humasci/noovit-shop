import Link from 'next/link';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { NotConfigured, PageTitle, Table, btnSm, date, inputCls, money, td } from '@/components/admin/ui';

const COUNTED = ['paid', 'fulfilling', 'shipped', 'delivered', 'partially_refunded'];

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Customers" /><NotConfigured what="The database" /></>);

  let query = db()
    .from('customers')
    .select('id, email, name, created_at, orders(total_cents, status, created_at), subscriptions(status)')
    .order('created_at', { ascending: false })
    .limit(200);
  // Characters with meaning in PostgREST filter syntax are stripped before interpolating into .or().
  const term = q?.trim().replace(/[%_,()"\\*]/g, '');
  if (term) query = query.or(`email.ilike."%${term}%",name.ilike."%${term}%"`);
  const { data } = await query;

  const rows = (data ?? []).map((c) => {
    const orders = (c.orders as { total_cents: number; status: string; created_at: string }[]).filter((o) => COUNTED.includes(o.status));
    return {
      ...c,
      orderCount: orders.length,
      ltv: orders.reduce((s, o) => s + o.total_cents, 0),
      lastOrder: orders.map((o) => o.created_at).sort().at(-1),
      activeSubs: (c.subscriptions as { status: string }[]).filter((s) => s.status === 'active').length,
    };
  });

  return (
    <>
      <PageTitle title="Customers">
        <form className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="Name or email" className={inputCls} />
          <button className={btnSm}>Search</button>
        </form>
      </PageTitle>
      <Table head={['Customer', 'Orders', 'Lifetime spend', 'Active subscriptions', 'Last order', 'Since']} empty={!rows.length}>
        {rows.map((c) => (
          <tr key={c.id}>
            <td className={td}>
              <div className="font-semibold">{c.name ?? '—'}</div>
              <Link href={`/admin/orders?q=${encodeURIComponent(c.email)}`} className="text-xs text-[var(--color-blue)]">{c.email}</Link>
            </td>
            <td className={td}>{c.orderCount}</td>
            <td className={td}>{money(c.ltv)}</td>
            <td className={td}>{c.activeSubs}</td>
            <td className={td}>{date(c.lastOrder)}</td>
            <td className={td}>{date(c.created_at)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
