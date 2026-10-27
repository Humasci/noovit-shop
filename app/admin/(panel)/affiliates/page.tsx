import Link from 'next/link';
import { Download } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/auth';
import { db } from '@/lib/db/server';
import { dbConfigured } from '@/lib/config';
import { REF_DAYS, statsByAffiliate, type Affiliate } from '@/lib/affiliates';
import { getSettings } from '@/lib/settings';
import { createAffiliate } from '@/app/admin/affiliate-actions';
import { Badge, Card, Flash, NotConfigured, PageTitle, Stat, Table, btnSm, btnSmOutline, inputCls, money, td } from '@/components/admin/ui';

const label = 'mb-1 block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]';

export default async function AffiliatesPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  await requireAdmin('marketing');
  const { msg } = await searchParams;
  if (!dbConfigured()) return (<><PageTitle title="Affiliates & influencers" /><NotConfigured what="database" /></>);

  const [{ data }, stats, settings] = await Promise.all([
    db().from('affiliates').select('*').order('created_at', { ascending: false }),
    statsByAffiliate(),
    getSettings(),
  ]);
  const partners = (data ?? []) as Affiliate[];
  const totals = partners.reduce(
    (t, a) => {
      const s = stats.get(a.id);
      return { sales: t.sales + s.sales, orders: t.orders + s.orders, owed: t.owed + s.approved, pending: t.pending + s.pending };
    },
    { sales: 0, orders: 0, owed: 0, pending: 0 }
  );
  const hold = Number(settings.affiliate_hold_days || 30);

  return (
    <>
      <PageTitle title="Affiliates & influencers">
        <a href={`/admin/affiliates/export`} className={`${btnSmOutline} flex items-center gap-1.5`}><Download className="h-3.5 w-3.5" /> Export CSV</a>
      </PageTitle>
      <Flash msg={msg} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active partners" value={String(partners.filter((a) => a.status === 'active').length)} />
        <Stat label="Sales from partners" value={money(totals.sales)} sub={`${totals.orders} orders, after discounts & refunds`} />
        <Stat label="Owed now" value={money(totals.owed)} sub="Approved, not yet paid" />
        <Stat label="Pending" value={money(totals.pending)} sub={`Approved automatically after ${hold} days`} />
      </div>

      <Card className="mb-6">
        <h2 className="mb-4 text-lg">Add a partner</h2>
        <form action={createAffiliate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label><span className={label}>Name</span><input name="name" required placeholder="Sarah Jones" className={`${inputCls} w-full`} /></label>
          <label><span className={label}>Email</span><input name="email" type="email" required placeholder="sarah@example.com" className={`${inputCls} w-full`} /></label>
          <label><span className={label}>Code</span><input name="code" required placeholder="SARAH10" className={`${inputCls} w-full uppercase`} /></label>
          <label><span className={label}>Platform (optional)</span><input name="platform" placeholder="Instagram @sarahwellness" className={`${inputCls} w-full`} /></label>
          <label><span className={label}>Customer discount (%)</span><input name="customer_discount_pct" type="number" min={0} max={50} step={1} defaultValue={10} className={`${inputCls} w-full`} /></label>
          <label><span className={label}>Commission (%)</span><input name="commission_pct" type="number" min={0} max={50} step="0.5" defaultValue={15} className={`${inputCls} w-full`} /></label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2 lg:mt-6">
            <input type="checkbox" name="recurring" /> Also pay commission on subscription renewals
          </label>
          <div className="sm:col-span-2 lg:col-span-4"><button className={btnSm}>Add partner</button></div>
        </form>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Each partner gets a code customers can type at checkout and a share link (noovit.com/r/CODE) that remembers their followers for {REF_DAYS} days and applies the code
          automatically. Commission is calculated on the order after discounts and refunds, excluding tax. The customer discount applies to the first payment; set it to 0 for a
          link-only partner.
        </p>
      </Card>

      <Table head={['Partner', 'Code', 'Deal', 'Clicks', 'Orders', 'Sales', 'Pending', 'Owed', 'Paid', 'Status', '']} empty={!partners.length}>
        {partners.map((a) => {
          const s = stats.get(a.id);
          return (
            <tr key={a.id}>
              <td className={td}>
                <Link href={`/admin/affiliates/${a.id}`} className="font-semibold text-[var(--color-navy)] hover:text-[var(--color-accent)]">{a.name}</Link>
                {a.platform && <p className="text-xs text-[var(--color-muted)]">{a.platform}</p>}
              </td>
              <td className={`${td} font-mono font-bold`}>{a.code}</td>
              <td className={td}>
                {a.customer_discount_pct}% off · {Number(a.commission_pct)}% commission
                {a.recurring && <p className="text-xs text-[var(--color-muted)]">incl. renewals</p>}
              </td>
              <td className={td}>{a.clicks}</td>
              <td className={td}>{s.orders}</td>
              <td className={td}>{money(s.sales)}</td>
              <td className={td}>{money(s.pending)}</td>
              <td className={`${td} font-semibold`}>{money(s.approved)}</td>
              <td className={td}>{money(s.paid)}</td>
              <td className={td}><Badge status={a.status} /></td>
              <td className={td}><Link href={`/admin/affiliates/${a.id}`} className="text-sm font-semibold text-[var(--color-accent)]">View</Link></td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
