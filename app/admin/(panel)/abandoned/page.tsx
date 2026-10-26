import Link from 'next/link';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { Badge, NotConfigured, PageTitle, Stat, Table, dateTime, money, td } from '@/components/admin/ui';

export default async function AbandonedPage() {
  if (!dbConfigured()) return (<><PageTitle title="Abandoned checkouts" /><NotConfigured what="The database" /></>);

  // eslint-disable-next-line react-hooks/purity -- server component, evaluated once per request
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const { data } = await db()
    .from('abandoned_checkouts')
    .select('*, orders:recovered_order_id(order_number)')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(300);
  const rows = data ?? [];
  const emailed = rows.filter((r) => r.email_sent_at).length;
  const recovered = rows.filter((r) => r.recovered_at);
  const recoveredValue = recovered.reduce((s, r) => s + r.amount_cents, 0);

  return (
    <>
      <PageTitle title="Abandoned checkouts" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Abandoned (30 days)" value={String(rows.length)} sub={money(rows.reduce((s, r) => s + r.amount_cents, 0)) + ' in carts'} />
        <Stat label="Reminder emails sent" value={String(emailed)} />
        <Stat label="Recovered" value={String(recovered.length)} sub={rows.length ? `${Math.round((recovered.length / rows.length) * 100)}% recovery rate` : undefined} />
        <Stat label="Recovered revenue" value={money(recoveredValue)} />
      </div>
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        A checkout counts as abandoned 2 hours after it was started. Shoppers who ticked the marketing box get one reminder email with a link back to their cart (at most one a week);
        others are listed here only. Your welcome code from Settings is included in the email.
      </p>
      <Table head={['Started', 'Email', 'Cart', 'Value', 'Reminder', 'Outcome']} empty={!rows.length}>
        {rows.map((r) => {
          const order = r.orders as { order_number: number } | null;
          return (
            <tr key={r.stripe_session_id}>
              <td className={td}>{dateTime(r.created_at)}</td>
              <td className={td}>{r.email}</td>
              <td className={`${td} max-w-xs truncate`}>{(r.items as { name: string; quantity: number }[]).map((i) => `${i.quantity}× ${i.name}`).join(', ')}</td>
              <td className={td}>{money(r.amount_cents)}</td>
              <td className={td}>{r.email_sent_at ? dateTime(r.email_sent_at) : <span className="text-[var(--color-muted)]">not sent (no consent)</span>}</td>
              <td className={td}>
                {r.recovered_at ? (
                  order ? <Link href={`/admin/orders/${order.order_number}`} className="font-bold text-[var(--color-blue)]">Recovered #{order.order_number}</Link> : <Badge status="active" />
                ) : (
                  <Badge status="pending" />
                )}
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
