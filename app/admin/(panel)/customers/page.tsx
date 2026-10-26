import Link from 'next/link';
import { Download } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/auth';
import { dbConfigured } from '@/lib/config';
import { filterCustomers, loadCustomerSummaries, SEGMENTS } from '@/lib/admin/customers';
import { NotConfigured, PageTitle, Table, btnSm, btnSmOutline, date, inputCls, money, td } from '@/components/admin/ui';

const SHOW = 200;

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; segment?: string; tag?: string }> }) {
  await requireAdmin('customers');
  const sp = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Customers" /><NotConfigured what="The database" /></>);

  const all = await loadCustomerSummaries();
  const rows = filterCustomers(all, sp);
  const exportQs = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]).toString();

  return (
    <>
      <PageTitle title="Customers">
        <form className="flex gap-2">
          {sp.segment && <input type="hidden" name="segment" value={sp.segment} />}
          {sp.tag && <input type="hidden" name="tag" value={sp.tag} />}
          <input name="q" defaultValue={sp.q} placeholder="Name or email" className={inputCls} />
          <button className={btnSm}>Search</button>
        </form>
        <a href={`/admin/customers/export${exportQs ? `?${exportQs}` : ''}`} className={`${btnSmOutline} inline-flex items-center gap-1`}>
          <Download className="h-3.5 w-3.5" /> Export ({rows.length})
        </a>
      </PageTitle>

      <div className="mb-4 flex flex-wrap gap-2">
        {[['', 'All'], ...Object.entries(SEGMENTS).map(([k, v]) => [k, v.label])].map(([key, label]) => (
          <Link
            key={key}
            href={key ? `/admin/customers?segment=${key}` : '/admin/customers'}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              (sp.segment ?? '') === key ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white' : 'border-[var(--color-line)] bg-white text-[var(--color-navy)]'
            }`}
          >
            {label} ({filterCustomers(all, { segment: key || undefined }).length})
          </Link>
        ))}
      </div>
      {sp.tag && (
        <p className="mb-4 text-sm">Tagged <b>{sp.tag}</b> · <Link href="/admin/customers" className="text-[var(--color-accent)]">clear</Link></p>
      )}

      <Table head={['Customer', 'Orders', 'Lifetime spend', 'Subscriptions', 'Last order', 'Tags', 'Since']} empty={!rows.length}>
        {rows.slice(0, SHOW).map((c) => (
          <tr key={c.id}>
            <td className={td}>
              <Link href={`/admin/customers/${c.id}`} className="font-semibold hover:text-[var(--color-accent)]">{c.name ?? '—'}</Link>
              <div className="text-xs text-[var(--color-muted)]">{c.email}</div>
            </td>
            <td className={td}>{c.orderCount}</td>
            <td className={td}>{money(c.ltv)}</td>
            <td className={td}>{c.activeSubs}</td>
            <td className={td}>{date(c.lastOrder)}</td>
            <td className={td}>
              <div className="flex flex-wrap gap-1">
                {c.tags.map((t) => (
                  <Link key={t} href={`/admin/customers?tag=${encodeURIComponent(t)}`} className="rounded-full bg-[var(--color-soft)] px-2 py-0.5 text-xs font-semibold">{t}</Link>
                ))}
              </div>
            </td>
            <td className={td}>{date(c.createdAt)}</td>
          </tr>
        ))}
      </Table>
      {rows.length > SHOW && <p className="mt-3 text-xs text-[var(--color-muted)]">Showing the newest {SHOW} of {rows.length}. Search or export to see all.</p>}
    </>
  );
}
