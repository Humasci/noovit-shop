import Link from 'next/link';
import { Download } from 'lucide-react';
import { requireAdmin } from '@/lib/admin/auth';
import { dbConfigured } from '@/lib/config';
import { buildReport } from '@/lib/admin/reports';
import { RevenueChart } from '@/components/admin/charts/RevenueChart';
import { ProductBars } from '@/components/admin/charts/ProductBars';
import { Card, NotConfigured, PageTitle, Stat, btnSmOutline, money } from '@/components/admin/ui';

const RANGES = [7, 30, 90, 365];
const th = 'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]';
const tdc = 'px-3 py-2';

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  await requireAdmin('reports');
  const days = RANGES.includes(Number((await searchParams).days)) ? Number((await searchParams).days) : 30;
  if (!dbConfigured()) return (<><PageTitle title="Reports" /><NotConfigured what="The database" /></>);
  const r = await buildReport(days);
  const k = r.kpis;
  const productTotal = r.products.reduce((s, p) => s + p.revenue, 0);

  return (
    <>
      <PageTitle title="Reports">
        <a href={`/admin/reports/export?days=${days}`} className={`${btnSmOutline} inline-flex items-center gap-1`}>
          <Download className="h-3.5 w-3.5" /> Export orders (CSV)
        </a>
      </PageTitle>

      <div className="mb-6 flex flex-wrap gap-2">
        {RANGES.map((d) => (
          <Link
            key={d}
            href={`/admin/reports?days=${d}`}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${d === days ? 'border-[var(--color-navy)] bg-[var(--color-navy)] text-white' : 'border-[var(--color-line)] bg-white text-[var(--color-navy)]'}`}
          >
            Last {d === 365 ? '12 months' : `${d} days`}
          </Link>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Net revenue" value={money(k.revenue)} sub="after refunds" />
        <Stat label="Orders" value={k.orders.toLocaleString()} sub={`Average order ${money(k.aov)}`} />
        <Stat label="Subscription share" value={`${Math.round(k.subscriptionShare * 100)}%`} sub="of net revenue" />
        <Stat label="New customers" value={k.newCustomers.toLocaleString()} />
        <Stat label="Refunds" value={money(k.refunds)} />
        <Stat label="Discounts given" value={money(k.discounts)} sub={`${k.discountedOrders} orders used a discount`} />
      </div>

      <Card className="mb-6">
        <h2 className="text-lg">Net revenue per day</h2>
        <p className="mb-4 text-xs text-[var(--color-muted)]">Days in UTC. Hover or tab through the columns for details.</p>
        <RevenueChart data={r.daily} />
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-xs font-semibold text-[var(--color-blue)]">Show as table</summary>
          <div className="mt-2 max-h-72 overflow-y-auto">
            <table className="w-full">
              <thead><tr><th className={th}>Date</th><th className={th}>Subscription</th><th className={th}>One-time</th><th className={th}>Total</th></tr></thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {r.daily.map((d) => (
                  <tr key={d.date}><td className={tdc}>{d.date}</td><td className={tdc}>{money(d.subscription)}</td><td className={tdc}>{money(d.oneTime)}</td><td className={`${tdc} font-semibold`}>{money(d.subscription + d.oneTime)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg">Sales by product</h2>
          {r.products.length ? <ProductBars rows={r.products.slice(0, 12)} total={productTotal} /> : <p className="text-sm text-[var(--color-muted)]">No sales in this period.</p>}
          {r.products.length > 12 && <p className="mt-3 text-xs text-[var(--color-muted)]">Top 12 of {r.products.length} products. The CSV export has every order line.</p>}
        </Card>

        <Card>
          <h2 className="text-lg">Subscription retention</h2>
          <p className="mb-4 text-xs text-[var(--color-muted)]">Subscriptions started in each month (last 6 months) and how many are still active today.</p>
          {r.cohorts.length ? (
            <table className="w-full text-sm">
              <thead><tr><th className={th}>Started</th><th className={th}>New</th><th className={th}>Still active</th><th className={th}>Cancelled</th><th className={th}>Retention</th></tr></thead>
              <tbody className="divide-y divide-[var(--color-line)]">
                {r.cohorts.map((c) => {
                  const pct = c.started ? Math.round((c.active / c.started) * 100) : 0;
                  return (
                    <tr key={c.month}>
                      <td className={tdc}>{new Date(`${c.month}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })}</td>
                      <td className={tdc}>{c.started}</td>
                      <td className={tdc}>{c.active}</td>
                      <td className={tdc}>{c.cancelled}</td>
                      <td className={tdc}>
                        <span className="flex items-center gap-2">
                          <span className="h-2 w-20 overflow-hidden rounded-full bg-[#cde2fb]">
                            <span className="block h-full rounded-full bg-[#2a78d6]" style={{ width: `${pct}%` }} />
                          </span>
                          <span className="font-semibold">{pct}%</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">No subscriptions yet.</p>
          )}
        </Card>
      </div>
    </>
  );
}
