import Link from 'next/link';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { Badge, FilterLinks, Flash, NotConfigured, PageTitle, Table, btnSm, dateTime, inputCls, money, td } from '@/components/admin/ui';

const STATUSES = ['paid', 'fulfilling', 'shipped', 'delivered', 'refunded', 'partially_refunded', 'cancelled'];
const PAGE_SIZE = 50;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string; msg?: string }> }) {
  const { status, q, page, msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Orders" /><NotConfigured what="The database" /></>);

  const pageNo = Math.max(1, Number(page) || 1);
  let query = db()
    .from('orders')
    .select('id, order_number, email, shipping_name, total_cents, status, kind, created_at, fulfilments(status)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((pageNo - 1) * PAGE_SIZE, pageNo * PAGE_SIZE - 1);
  if (status && STATUSES.includes(status)) query = query.eq('status', status);
  const term = q?.trim().replace(/^#/, '');
  if (term) query = /^\d+$/.test(term) ? query.eq('order_number', Number(term)) : query.ilike('email', `%${term.replace(/[%_,()]/g, '')}%`);

  const { data: orders, count } = await query;
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));
  const qs = (p: number) => `/admin/orders?${new URLSearchParams({ ...(status ? { status } : {}), ...(q ? { q } : {}), page: String(p) })}`;

  return (
    <>
      <PageTitle title="Orders">
        <form className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Email or order #" className={inputCls} />
          <button className={btnSm}>Search</button>
        </form>
      </PageTitle>
      <Flash msg={msg} />
      <div className="mb-4">
        <FilterLinks base="/admin/orders" param="status" current={status} options={STATUSES} />
      </div>

      <Table head={['Order', 'Customer', 'Type', 'Total', 'Status', 'Fulfilment', 'Placed']} empty={!orders?.length}>
        {orders?.map((o) => (
          <tr key={o.id}>
            <td className={td}>
              <Link href={`/admin/orders/${o.order_number}`} className="font-bold text-[var(--color-blue)]">#{o.order_number}</Link>
            </td>
            <td className={td}>
              <div className="font-semibold">{o.shipping_name ?? '—'}</div>
              <div className="text-xs text-[var(--color-muted)]">{o.email}</div>
            </td>
            <td className={td}>{o.kind.replace(/_/g, ' ')}</td>
            <td className={td}>{money(o.total_cents)}</td>
            <td className={td}><Badge status={o.status} /></td>
            <td className={td}>{(o.fulfilments as { status: string }[])?.map((f, i) => <Badge key={i} status={f.status} />)}</td>
            <td className={td}>{dateTime(o.created_at)}</td>
          </tr>
        ))}
      </Table>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[var(--color-muted)]">{count} orders · page {pageNo} of {pages}</span>
          <div className="flex gap-2">
            {pageNo > 1 && <Link href={qs(pageNo - 1)} className={btnSm}>Previous</Link>}
            {pageNo < pages && <Link href={qs(pageNo + 1)} className={btnSm}>Next</Link>}
          </div>
        </div>
      )}
    </>
  );
}
