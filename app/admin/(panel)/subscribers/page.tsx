import { Download } from 'lucide-react';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { Badge, FilterLinks, NotConfigured, PageTitle, Stat, Table, btnSm, btnSmOutline, dateTime, inputCls, td } from '@/components/admin/ui';

const STATUSES = ['subscribed', 'unsubscribed'];

export default async function SubscribersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Subscribers" /><NotConfigured what="The database" /></>);

  const count = async (filter?: string) => {
    let query = db().from('subscribers').select('id', { count: 'exact', head: true });
    if (filter) query = query.eq('status', filter);
    return (await query).count ?? 0;
  };
  // eslint-disable-next-line react-hooks/purity -- server component, evaluated once per request
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const [subscribed, unsubscribed, recent] = await Promise.all([
    count('subscribed'),
    count('unsubscribed'),
    db().from('subscribers').select('id', { count: 'exact', head: true }).eq('status', 'subscribed').gte('created_at', since).then((r) => r.count ?? 0),
  ]);

  let query = db().from('subscribers').select('*').order('created_at', { ascending: false }).limit(200);
  if (status && STATUSES.includes(status)) query = query.eq('status', status);
  const term = q?.trim().replace(/[%_,()"\\*]/g, '');
  if (term) query = query.ilike('email', `%${term}%`);
  const { data } = await query;

  return (
    <>
      <PageTitle title="Subscribers">
        <form className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="Search email" className={inputCls} />
          <button className={btnSm}>Search</button>
        </form>
        <a href="/admin/subscribers/export" className={`${btnSmOutline} inline-flex items-center gap-1`}>
          <Download className="h-3.5 w-3.5" /> Export subscribed (CSV)
        </a>
      </PageTitle>
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Stat label="Subscribed" value={String(subscribed)} />
        <Stat label="New (30 days)" value={String(recent)} />
        <Stat label="Unsubscribed" value={String(unsubscribed)} />
      </div>
      <p className="mb-4 text-sm text-[var(--color-muted)]">
        People join from the newsletter form or by ticking the marketing box at checkout. Export the list to import into an email tool such as Klaviyo; unsubscribes are
        handled automatically by the link in every marketing email.
      </p>
      <div className="mb-4">
        <FilterLinks base="/admin/subscribers" param="status" current={status} options={STATUSES} />
      </div>
      <Table head={['Email', 'Source', 'Status', 'Joined', 'Unsubscribed']} empty={!data?.length}>
        {data?.map((s) => (
          <tr key={s.id}>
            <td className={td}>{s.email}</td>
            <td className={td}>{s.source}</td>
            <td className={td}><Badge status={s.status === 'subscribed' ? 'active' : 'cancelled'} /></td>
            <td className={td}>{dateTime(s.created_at)}</td>
            <td className={td}>{dateTime(s.unsubscribed_at)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
